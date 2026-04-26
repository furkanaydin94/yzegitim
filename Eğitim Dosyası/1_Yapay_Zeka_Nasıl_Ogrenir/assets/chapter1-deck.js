/* chapter1-deck.js — shared bootstrap for the deck.
   Each slide renders the horizontal timeline (htl) using the
   SLIDES + CURRENT constants it defines locally. This file is
   intentionally minimal: per-slide JS handles its own viz. */

(function () {
  // Build the horizontal timeline if the slide set up SLIDES + CURRENT
  if (typeof window.SLIDES !== 'undefined' && typeof window.CURRENT !== 'undefined') {
    const items = document.getElementById('htlItems');
    if (!items) return;
    const visited = JSON.parse(localStorage.getItem('visited') || '[]');
    if (!visited.includes(window.CURRENT)) visited.push(window.CURRENT);
    localStorage.setItem('visited', JSON.stringify(visited));
    let activeIdx = 0;
    window.SLIDES.forEach((s, i) => {
      const isActive = s.file === window.CURRENT;
      if (isActive) activeIdx = i;
      const isVisited = visited.includes(s.file) && !isActive;
      const el = document.createElement('div');
      el.className = 'htl-item'
        + (isActive ? ' active' : '')
        + (isVisited ? ' visited' : '')
        + (s.cover ? ' cover' : '');
      el.innerHTML =
        `<div class="htl-year">${s.year || ''}</div>` +
        `<div class="htl-dot"></div>` +
        `<span class="htl-tip">${s.label}</span>` +
        (isActive ? `<div class="you-are-here">▲ Buradasın</div>` : '');
      el.onclick = () => { window.location.href = s.file; };
      items.appendChild(el);
    });
    const prog = document.getElementById('prog');
    if (prog) prog.textContent = activeIdx + 1;
    setTimeout(() => {
      const fill = document.getElementById('htlFill');
      if (fill) fill.style.width = ((activeIdx + 0.5) / window.SLIDES.length * 100) + '%';
    }, 200);
  }
})();

(function () {
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
