(function () {
  const timelineSlides = typeof SLIDES !== 'undefined'
    ? SLIDES
    : (typeof window.SLIDES !== 'undefined' ? window.SLIDES : null);
  if (timelineSlides) {
    const items = document.getElementById('htlItems');
    if (items && items.children.length === 0) {
      const current = location.pathname.split('/').pop() || '';
      let visited = [];
      try { visited = JSON.parse(localStorage.getItem('visited') || '[]'); } catch (e) {}
      if (!visited.includes(current)) visited.push(current);
      try { localStorage.setItem('visited', JSON.stringify(visited)); } catch (e) {}

      let activeIdx = 0;
      timelineSlides.forEach((slide, index) => {
        const isActive = slide.file === current;
        if (isActive) activeIdx = index;
        const isVisited = visited.includes(slide.file) && !isActive;
        const item = document.createElement('div');
        item.className = 'htl-item'
          + (isActive ? ' active' : '')
          + (isVisited ? ' visited' : '')
          + (slide.cover ? ' cover' : '');
        item.innerHTML =
          `<div class="htl-year">${slide.year || ''}</div>` +
          `<div class="htl-dot"></div>` +
          `<span class="htl-tip">${slide.label}</span>` +
          (isActive ? `<div class="you-are-here">▲ Buradasın</div>` : '');
        item.onclick = () => { window.location.href = slide.file; };
        items.appendChild(item);
      });

      const progress = document.getElementById('prog');
      if (progress) progress.textContent = activeIdx + 1;
      setTimeout(() => {
        const fill = document.getElementById('htlFill');
        if (fill) fill.style.width = ((activeIdx + 0.5) / timelineSlides.length * 100) + '%';
      }, 200);
    }
  }

  const divider = document.getElementById('divider');
  const slide = document.querySelector('.slide');
  const leftPanel = document.getElementById('leftPanel') || document.querySelector('.left');
  const rightPanel = document.getElementById('rightPanel') || document.querySelector('.right');
  if (!divider || !slide || !leftPanel || !rightPanel) return;
  if (divider.dataset.zoomDividerReady === '1') return;
  divider.dataset.zoomDividerReady = '1';

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const dividerWidth = () => divider.getBoundingClientRect().width || 5;

  function configureInner(panel, inner, className) {
    const cs = getComputedStyle(panel);
    inner.classList.add('divider-zoom-inner', className);
    inner.style.display = cs.display.includes('flex') ? 'flex' : 'block';
    inner.style.flexDirection = cs.flexDirection;
    inner.style.alignItems = cs.alignItems;
    inner.style.justifyContent = cs.justifyContent;
    inner.style.gap = cs.gap;
    return inner;
  }

  function wrapPanel(panel, id, className) {
    const existing = document.getElementById(id);
    if (existing && panel.contains(existing)) return configureInner(panel, existing, className);

    const inner = document.createElement('div');
    inner.id = id;
    configureInner(panel, inner, className);

    while (panel.firstChild) inner.appendChild(panel.firstChild);
    panel.appendChild(inner);
    return inner;
  }

  const leftInner = wrapPanel(leftPanel, 'leftInner', 'left-zoom-inner');
  const rightInner = wrapPanel(rightPanel, 'rightInner', 'right-zoom-inner');
  const initialLeft = leftPanel.getBoundingClientRect().width || slide.getBoundingClientRect().width * 0.42;
  let dragging = false;
  let startX = 0;
  let startW = 0;
  let afterResizeFrame = 0;

  function applyZoom() {
    const cw = slide.getBoundingClientRect().width;
    if (!cw || getComputedStyle(divider).display === 'none') return;

    const dw = dividerWidth();
    const lw = leftPanel.getBoundingClientRect().width;
    const rw = Math.max(cw - lw - dw, 1);
    const defL = initialLeft;
    const defR = Math.max(cw - initialLeft - dw, 1);

    leftInner.style.zoom = clamp(lw / defL, 0.6, 1.7);
    rightInner.style.zoom = clamp(rw / defR, 0.6, 1.7);
  }

  function queueAfterResize() {
    if (afterResizeFrame) return;
    afterResizeFrame = requestAnimationFrame(() => {
      afterResizeFrame = 0;
      if (typeof window.drawLines === 'function') window.drawLines();
      if (typeof window.draw === 'function') window.draw();
      window.dispatchEvent(new CustomEvent('dividerresize'));
    });
  }

  divider.addEventListener('pointerdown', e => {
    dragging = true;
    startX = e.clientX;
    startW = leftPanel.getBoundingClientRect().width;
    divider.setPointerCapture(e.pointerId);
    divider.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  divider.addEventListener('pointermove', e => {
    if (!dragging) return;
    const cw = slide.getBoundingClientRect().width;
    const dw = dividerWidth();
    const nextW = clamp(startW + e.clientX - startX, cw * 0.15, cw * 0.82);
    slide.style.gridTemplateColumns = `${nextW}px ${dw}px 1fr`;
    leftPanel.style.width = '';
    leftPanel.style.minWidth = '0';
    applyZoom();
    queueAfterResize();
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    divider.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  divider.addEventListener('pointerup', endDrag);
  divider.addEventListener('pointercancel', endDrag);
  window.addEventListener('blur', endDrag);

  divider.addEventListener('dblclick', () => {
    slide.style.gridTemplateColumns = '';
    leftPanel.style.width = '';
    leftPanel.style.minWidth = '';
    leftInner.style.zoom = 1;
    rightInner.style.zoom = 1;
    queueAfterResize();
  });

  window.addEventListener('resize', () => {
    if (!slide.style.gridTemplateColumns) {
      leftInner.style.zoom = 1;
      rightInner.style.zoom = 1;
      return;
    }
    applyZoom();
    queueAfterResize();
  });
})();
