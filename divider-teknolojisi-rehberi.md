# Divider Teknolojisi Rehberi

Bu not, gecici prototip olarak eklenen `24-ai-ideler.html` dosyasindaki bolunebilir panel/divider teknolojisini saklamak icin yazildi. Dosya silinse bile ayni davranisi yeni Bolum 3 slaytlarina tasimak icin buradaki yapi yeterlidir.

## Kaynak Dosyadaki Ana Yerler

- CSS layout: `24-ai-ideler.html` satir `56-140`
- HTML panel iskeleti: `24-ai-ideler.html` satir `652-691`
- Divider/zoom JS: `24-ai-ideler.html` satir `826-879`

## Davranis Ozeti

Bu divider sadece sol ve sag kolonlarin genisligini degistirmez. Kolon genisligi degistikce iki taraftaki ic wrapper'larin `zoom` degeri de degisir.

Mantik:

1. Ana container `display: flex` kullanir.
2. Sol panel baslangicta `%40` genislik alir.
3. Divider sabit `5px` genisligindedir.
4. Sag panel `flex: 1` ile kalan alani kaplar.
5. Drag sirasinda JS sol panelin `style.width` degerini piksel olarak yazar.
6. Sol panel `containerWidth * 0.15` ile `containerWidth * 0.82` arasinda sinirlanir.
7. `applyZoom()` fonksiyonu sol ve sag ic wrapper'lari kendi mevcut genisliklerine gore zoom'lar.
8. Divider'a cift tiklaninca genislik ve zoom resetlenir.

## HTML Iskeleti

Prototipteki yapi:

```html
<div class="layout">
  <div class="left-panel" id="leftPanel">
    <div id="leftInner" style="display:flex;flex-direction:column;gap:inherit;min-height:min-content;">
      <!-- Sol panel icerigi -->
    </div>
  </div>

  <div class="v-divider" id="divider"></div>

  <div class="right-panel" id="rightPanel">
    <div class="rp-inner" id="rightInner">
      <!-- Sag panel icerigi -->
    </div>
  </div>
</div>
```

Kritik nokta: `zoom` dogrudan `.left-panel` ve `.right-panel` uzerine degil, onlarin icindeki `#leftInner` ve `#rightInner` wrapper'larina uygulanir. Boylece panelin scroll/yerlesim davranisi korunur, icerik olceklenir.

## CSS Iskeleti

Prototipteki temel CSS:

```css
:root {
  --tl-h: 68px;
  --border: rgba(255, 255, 255, 0.07);
  --accent: #10b981;
}

.layout {
  display: flex;
  height: calc(100vh - var(--tl-h));
  position: relative;
  z-index: 1;
}

.left-panel {
  width: 40%;
  flex-shrink: 0;
  overflow-y: auto;
  padding: 32px 28px 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
}

.left-panel::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--border);
  pointer-events: none;
}

.v-divider {
  width: 5px;
  flex-shrink: 0;
  cursor: col-resize;
  background: var(--border);
  transition: background 0.2s;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.v-divider:hover,
.v-divider.dragging {
  background: rgba(16, 185, 129, 0.3);
}

.v-divider::after {
  content: '';
  width: 2px;
  height: 32px;
  border-radius: 1px;
  background: rgba(255, 255, 255, 0.12);
  transition: background 0.2s;
}

.v-divider:hover::after,
.v-divider.dragging::after {
  background: rgba(16, 185, 129, 0.6);
}

.right-panel {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.rp-inner {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px 92px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}
```

Notlar:

- `.layout` toplam yuksekligi timeline/footer yuksekligi dusulerek hesapliyor: `calc(100vh - var(--tl-h))`.
- `.left-panel` scroll'u kendi icinde tasiyor.
- `.right-panel` dis kabuk olarak `overflow: hidden`, sagdaki scroll ise `.rp-inner` uzerinde.
- `.right-panel { min-width: 0; }` flex tasmasini engellemek icin onemli.
- Divider'in kendisi `5px`, fakat gorsel tutamac `::after` ile `2px x 32px`.

## JavaScript Iskeleti

Prototipteki tam mekanizma:

```js
(function () {
  const divider = document.getElementById('divider');
  const leftPanel = document.getElementById('leftPanel');
  const leftInner = document.getElementById('leftInner');
  const rightInner = document.getElementById('rightInner');
  const container = leftPanel.parentElement;
  const DEFAULT_L = 0.40;
  let dragging = false, startX = 0, startW = 0;

  function applyZoom() {
    const cw = container.getBoundingClientRect().width;
    const lw = leftPanel.getBoundingClientRect().width;
    const rw = cw - lw - 6;
    const defL = cw * DEFAULT_L, defR = cw * (1 - DEFAULT_L) - 6;
    leftInner.style.zoom = Math.min(Math.max(lw / defL, 0.6), 1.7);
    rightInner.style.zoom = Math.min(Math.max(rw / defR, 0.6), 1.7);
  }

  divider.addEventListener('mousedown', e => {
    dragging = true;
    startX = e.clientX;
    startW = leftPanel.getBoundingClientRect().width;
    divider.classList.add('dragging');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const cw = container.getBoundingClientRect().width;
    leftPanel.style.width = Math.min(Math.max(startW + e.clientX - startX, cw * 0.15), cw * 0.82) + 'px';
    leftPanel.style.flex = 'none';
    applyZoom();
  });

  document.addEventListener('mouseup', () => {
    dragging = false;
    divider.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  window.addEventListener('blur', () => {
    if (!dragging) return;
    dragging = false;
    divider.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  });

  divider.addEventListener('dblclick', () => {
    leftPanel.style.width = '';
    leftPanel.style.flex = '';
    leftInner.style.zoom = 1;
    rightInner.style.zoom = 1;
  });
})();
```

## Zoom Formulu

Baslangic kabulu:

```js
const DEFAULT_L = 0.40;
```

Bu, sol panelin normal genisliginin container'in `%40`'i oldugunu soyler.

Sol zoom:

```js
leftInner.style.zoom = clamp(leftWidth / defaultLeftWidth, 0.6, 1.7);
```

Sag zoom:

```js
rightInner.style.zoom = clamp(rightWidth / defaultRightWidth, 0.6, 1.7);
```

Kodda `clamp` dogrudan fonksiyon olarak yazilmamis, `Math.min(Math.max(...))` ile kurulmus:

```js
Math.min(Math.max(value, 0.6), 1.7)
```

Sonuc:

- Sol panel buyurse sol icerik zoom-in yapar.
- Sol panel kuculurse sol icerik zoom-out yapar.
- Sag panel kalan alanla ters yonde buyuyup kuculdugu icin sag icerik de kendi alanina gore zoomlanir.

## Resize Sinirlari

Drag sirasinda sol panel genisligi su aralikta tutulur:

```js
const minLeft = containerWidth * 0.15;
const maxLeft = containerWidth * 0.82;
```

Prototipte tek satir halinde:

```js
leftPanel.style.width = Math.min(Math.max(startW + e.clientX - startX, cw * 0.15), cw * 0.82) + 'px';
```

Bu sinirlar sayesinde:

- Sol panel tamamen kapanmaz.
- Sag panel tamamen yok olmaz.
- Zoom en fazla `1.7`, en az `0.6` olur.

## Drag Event Akisi

`mousedown`:

- Drag baslar.
- Baslangic mouse X konumu kaydedilir.
- Sol panelin baslangic genisligi kaydedilir.
- Divider'a `.dragging` class'i eklenir.
- Body cursor `col-resize` olur.
- Metin secimi kapatilir.

`mousemove`:

- Drag aktif degilse cikilir.
- Container genisligi olculur.
- Yeni sol panel genisligi hesaplanir.
- Sol panel `style.width` piksel olarak guncellenir.
- `leftPanel.style.flex = 'none'` ile flex otomatik dagilimi devreden cikarilir.
- `applyZoom()` calisir.

`mouseup`:

- Drag biter.
- `.dragging` class'i kalkar.
- Cursor ve text selection resetlenir.

`window.blur`:

- Pencere odak kaybederse drag state temizlenir.
- Ozellikle mouse basili halde pencere disina cikildiginda takilma riskini azaltir.

`dblclick`:

- Sol panel inline `width` degeri temizlenir.
- Sol panel inline `flex` degeri temizlenir.
- Sol ve sag zoom `1` olur.

## Mevcut Sunum Slaytlarina Uygulama Notlari

Mevcut Bolum 1 ve Bolum 2 slaytlarinda divider genelde grid/flex kolon genisligi degistiriyor, fakat icerik zoom'u ayni sistemde degil. Bu teknolojiyi tasimak icin gerekenler:

1. Sol panel icerigini `#leftInner` gibi bir wrapper icine al.
2. Sag panel scroll icerigini `#rightInner` gibi bir wrapper icine al.
3. Ana layout'u `display: flex` veya mevcut flex yapisiyla uyumlu hale getir.
4. Divider'i sol ve sag panel arasina koy.
5. JS'te panel id'lerini dogru esle.
6. Varsayilan sol oran baska ise `DEFAULT_L` degerini degistir. Ornegin mevcut slaytta sol kolon `%42` ise `DEFAULT_L = 0.42` kullan.
7. Divider genisligi `5px` yerine `1.5px` veya `6px` ise `rw = cw - lw - dividerWidth` ve `defR = cw * (1 - DEFAULT_L) - dividerWidth` kisimlarini ayni degere gore guncelle.

## Dikkat Edilecekler

- `style.zoom` Chromium/Edge tarafinda pratik calisir. Standart CSS transform kadar evrensel degildir.
- Bu prototipte touch/pointer event destegi yoktur; mouse event'leri vardir.
- Mobilde iki kolonlu bolunebilir panel yerine tek kolon tasarim daha mantikli olabilir.
- Zoom panelin ic wrapper'ina verildigi icin scroll alanlari dis panelde kalmalidir.
- `right-panel` icin `min-width: 0` unutulursa flex tasmalari olabilir.
- Cift tiklama reseti kullanici icin guzel bir kacis yoludur; yeni slaytlarda korunmali.

## Daha Evrensel Pointer Event Versiyonu

Yeni slaytlarda mouse + touch destegi istenirse ayni mantik `pointerdown/pointermove/pointerup` ile yazilabilir:

```js
(function () {
  const divider = document.getElementById('divider');
  const leftPanel = document.getElementById('leftPanel');
  const leftInner = document.getElementById('leftInner');
  const rightInner = document.getElementById('rightInner');
  const container = leftPanel.parentElement;
  const DEFAULT_L = 0.40;
  const DIVIDER_W = 5;
  let dragging = false, startX = 0, startW = 0;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  function applyZoom() {
    const cw = container.getBoundingClientRect().width;
    const lw = leftPanel.getBoundingClientRect().width;
    const rw = cw - lw - DIVIDER_W;
    const defL = cw * DEFAULT_L;
    const defR = cw * (1 - DEFAULT_L) - DIVIDER_W;
    leftInner.style.zoom = clamp(lw / defL, 0.6, 1.7);
    rightInner.style.zoom = clamp(rw / defR, 0.6, 1.7);
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
    const cw = container.getBoundingClientRect().width;
    const nextW = clamp(startW + e.clientX - startX, cw * 0.15, cw * 0.82);
    leftPanel.style.width = nextW + 'px';
    leftPanel.style.flex = 'none';
    applyZoom();
  });

  function endDrag() {
    dragging = false;
    divider.classList.remove('dragging');
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }

  divider.addEventListener('pointerup', endDrag);
  divider.addEventListener('pointercancel', endDrag);
  window.addEventListener('blur', () => {
    if (dragging) endDrag();
  });

  divider.addEventListener('dblclick', () => {
    leftPanel.style.width = '';
    leftPanel.style.flex = '';
    leftInner.style.zoom = 1;
    rightInner.style.zoom = 1;
  });
})();
```

Bu versiyon prototipten davranis olarak aynidir, sadece touch/pen destegi daha gucludur.
