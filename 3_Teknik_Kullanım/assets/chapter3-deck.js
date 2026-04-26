(function () {
  const slides = window.CHAPTER3_SLIDES || [
    { file: '23-bolum3-kapak.html', year: 'B3', label: 'Kapak', cover: true },
    { file: '24-ai-ideler.html', year: 'IDE', label: "AI IDE'ler" },
    { file: '28-n8n.html', year: 'n8n', label: 'n8n Otomasyon' },
    { file: '29-uygulamalar.html', year: 'App', label: 'Uygulamalar' },
    { file: '30-local-llm.html', year: 'LLM', label: 'Yerel LLM' },
    { file: '34-ft-vs-rag.html', year: 'RAG', label: 'FT vs RAG' },
    { file: '35-kurumsal-ai.html', year: 'AI', label: 'Kurumsal AI' },
    { file: '36-gelecek.html', year: 'Gelecek', label: 'Gelecek' }
  ];

  const current = location.pathname.split('/').pop() || '';
  const previousChapter = window.CHAPTER3_PREV || '../2_Modeller_Kullan%C4%B1m/20-araclar.html';

  function renderTimeline() {
    const items = document.getElementById('htlItems');
    if (!items || items.children.length) return;

    let visited = [];
    try { visited = JSON.parse(localStorage.getItem('visited') || '[]'); } catch (e) {}
    if (!visited.includes(current)) visited.push(current);
    try { localStorage.setItem('visited', JSON.stringify(visited)); } catch (e) {}

    let activeIdx = Math.max(0, slides.findIndex(slide => slide.file === current));
    slides.forEach((slide, index) => {
      const isActive = index === activeIdx;
      const isVisited = visited.includes(slide.file) && !isActive;
      const item = document.createElement('div');
      item.className = 'htl-item'
        + (isActive ? ' active' : '')
        + (isVisited ? ' visited' : '')
        + (slide.cover ? ' cover' : '');
      item.innerHTML =
        '<div class="htl-year">' + (slide.year || '') + '</div>' +
        '<div class="htl-dot"></div>' +
        '<span class="htl-tip">' + slide.label + '</span>' +
        (isActive ? '<div class="you-are-here">Buradas&#305;n</div>' : '');
      item.addEventListener('click', () => { window.location.href = slide.file; });
      items.appendChild(item);
    });

    const progress = document.getElementById('prog');
    if (progress) progress.textContent = activeIdx + 1;
    const total = document.getElementById('progTotal');
    if (total) total.textContent = slides.length;
    requestAnimationFrame(() => {
      const fill = document.getElementById('htlFill');
      if (fill) fill.style.width = ((activeIdx + 0.5) / slides.length * 100) + '%';
    });
  }

  function toggleFS() {
    if (window.parent !== window) {
      window.parent.postMessage({ action: 'toggleFS' }, '*');
      return;
    }
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  }

  window.toggleFS = toggleFS;

  function setupKeys() {
    document.addEventListener('keydown', event => {
      const activeIdx = slides.findIndex(slide => slide.file === current);
      if (event.key === 'ArrowLeft') {
        if (activeIdx > 0) {
          window.location.href = slides[activeIdx - 1].file;
        } else if (activeIdx === 0 && previousChapter) {
          window.location.href = previousChapter;
        }
      }
      if (event.key === 'ArrowRight' && activeIdx >= 0 && activeIdx < slides.length - 1) {
        window.location.href = slides[activeIdx + 1].file;
      }
      if (event.key === 'f' || event.key === 'F') toggleFS();
    });
  }

  function setupFullscreenButton() {
    const button = document.getElementById('fsBtn');
    if (!button) return;
    const setState = isFullscreen => {
      button.textContent = isFullscreen ? '[]' : '[]';
      button.setAttribute('aria-label', isFullscreen ? 'Tam ekrandan cik' : 'Tam ekran');
      button.title = isFullscreen ? 'Tam ekrandan cik' : 'Tam ekran';
    };
    document.addEventListener('fullscreenchange', () => setState(!!document.fullscreenElement));
    window.addEventListener('message', event => {
      if (event.data && event.data.action === 'fullscreenChange') {
        setState(!!event.data.isFullscreen);
      }
    });
  }

  function setupDivider() {
    const divider = document.getElementById('divider') || document.querySelector('.divider');
    const slide = document.querySelector('.slide') || document.querySelector('.layout');
    const leftPanel = document.getElementById('leftPanel') || document.querySelector('.left');
    const rightPanel = document.getElementById('rightPanel') || document.querySelector('.right');
    if (!divider || !slide || !leftPanel || !rightPanel) return;
    if (divider.dataset.zoomDividerReady === '1') return;
    divider.dataset.zoomDividerReady = '1';

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const dividerWidth = () => divider.getBoundingClientRect().width || 5;

    function configureInner(panel, inner, className) {
      const style = getComputedStyle(panel);
      inner.classList.add('divider-zoom-inner', className);
      inner.style.display = style.display.includes('flex') ? 'flex' : 'block';
      inner.style.flexDirection = style.flexDirection;
      inner.style.alignItems = style.alignItems;
      inner.style.justifyContent = style.justifyContent;
      inner.style.gap = style.gap;
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
    let pointerDragActive = false;

    function afterResize() {
      if (afterResizeFrame) return;
      afterResizeFrame = requestAnimationFrame(() => {
        afterResizeFrame = 0;
        if (typeof window.drawLines === 'function') window.drawLines();
        if (typeof window.redrawLines === 'function') window.redrawLines();
        if (typeof window.draw === 'function') window.draw();
        if (typeof window.drawRadar === 'function') window.drawRadar();
        window.dispatchEvent(new CustomEvent('dividerresize'));
      });
    }

    function applyZoom() {
      const cw = slide.getBoundingClientRect().width;
      if (!cw || getComputedStyle(divider).display === 'none') return;
      const dw = dividerWidth();
      const lw = leftPanel.getBoundingClientRect().width;
      const rw = Math.max(cw - lw - dw, 1);
      const defL = initialLeft;
      const defR = Math.max(cw - initialLeft - dw, 1);
      leftInner.style.zoom = String(clamp(lw / defL, 0.6, 1.7));
      rightInner.style.zoom = String(clamp(rw / defR, 0.6, 1.7));
    }

    function startDrag(clientX) {
      dragging = true;
      startX = clientX;
      startW = leftPanel.getBoundingClientRect().width;
      divider.classList.add('dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    function moveDrag(clientX) {
      if (!dragging) return;
      const cw = slide.getBoundingClientRect().width;
      const dw = dividerWidth();
      const nextW = clamp(startW + clientX - startX, cw * 0.15, cw * 0.82);
      leftPanel.style.width = nextW + 'px';
      leftPanel.style.flex = 'none';
      leftPanel.style.minWidth = '0';
      applyZoom();
      afterResize();
    }

    divider.addEventListener('pointerdown', event => {
      pointerDragActive = true;
      startDrag(event.clientX);
      if (divider.setPointerCapture) divider.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    divider.addEventListener('pointermove', event => {
      moveDrag(event.clientX);
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      pointerDragActive = false;
      divider.classList.remove('dragging');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    divider.addEventListener('pointerup', endDrag);
    divider.addEventListener('pointercancel', endDrag);
    divider.addEventListener('mousedown', event => {
      if (pointerDragActive) return;
      startDrag(event.clientX);
      event.preventDefault();
    });
    window.addEventListener('mousemove', event => {
      if (!pointerDragActive) moveDrag(event.clientX);
    });
    window.addEventListener('mouseup', endDrag);
    window.addEventListener('blur', endDrag);

    divider.addEventListener('dblclick', () => {
      leftPanel.style.width = '';
      leftPanel.style.flex = '';
      leftPanel.style.minWidth = '';
      leftInner.style.zoom = 1;
      rightInner.style.zoom = 1;
      afterResize();
    });

    window.addEventListener('resize', () => {
      if (!leftPanel.style.width) {
        leftInner.style.zoom = 1;
        rightInner.style.zoom = 1;
        afterResize();
        return;
      }
      applyZoom();
      afterResize();
    });
  }

  function init() {
    renderTimeline();
    setupKeys();
    setupFullscreenButton();
    setupDivider();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
