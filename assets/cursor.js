/* ============================================================
   CUSTOM CURSOR
   A square that inverts against whatever is under it. Surface brightness comes
   from the computed background colour, which also makes hover states work for
   free. Over a photo that is useless — .card__media is near-black but several
   of the shots are light — so there we sample the image's own pixels.
   ============================================================ */
(() => {
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)');
  if (!fine.matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);
  document.documentElement.classList.add('has-cursor');

  const lum = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

  /* first ancestor with an actually opaque background wins */
  function backgroundIsDark(el) {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const m = getComputedStyle(n).backgroundColor.match(/rgba?\(([^)]+)\)/);
      if (!m) continue;
      const [r, g, b, a = 1] = m[1].split(',').map(parseFloat);
      if (a > 0.5) return lum(r, g, b) < 0.5;
    }
    return false;
  }

  /* downsampled copy of each photo — one read, then cheap lookups */
  const shrunk = new WeakMap();
  function imageIsDark(img, cx, cy) {
    let s = shrunk.get(img);
    if (s === undefined) {
      s = null;
      if (img.complete && img.naturalWidth) {
        const W = 64, H = Math.max(1, Math.round(64 * img.naturalHeight / img.naturalWidth));
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const ctx = c.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, W, H);
        try { s = { W, H, px: ctx.getImageData(0, 0, W, H).data }; }
        catch { s = null; }                       // cross-origin taint
      }
      shrunk.set(img, s);
    }
    if (!s) return null;

    // undo object-fit: cover to find the point in the image's own pixels
    const r = img.getBoundingClientRect();
    const scale = Math.max(r.width / img.naturalWidth, r.height / img.naturalHeight);
    const nx = (cx - r.left - (r.width  - img.naturalWidth  * scale) / 2) / scale;
    const ny = (cy - r.top  - (r.height - img.naturalHeight * scale) / 2) / scale;
    const sx = Math.min(s.W - 1, Math.max(0, Math.round(nx / img.naturalWidth  * s.W)));
    const sy = Math.min(s.H - 1, Math.max(0, Math.round(ny / img.naturalHeight * s.H)));
    const i = (sy * s.W + sx) * 4;
    return lum(s.px[i], s.px[i + 1], s.px[i + 2]) < 0.5;
  }

  let x = 0, y = 0, queued = false;

  function paint() {
    queued = false;
    dot.style.transform = `translate3d(${x}px,${y}px,0) translate(-50%,-50%)`;

    const el = document.elementFromPoint(x, y);
    if (!el) return;

    let dark;
    if (el.tagName === 'IMG') {
      const fromPixels = imageIsDark(el, x, y);
      dark = fromPixels === null ? backgroundIsDark(el) : fromPixels;
    } else {
      dark = backgroundIsDark(el);
    }
    dot.classList.toggle('on-dark', dark);
    dot.classList.toggle('on-target', !!el.closest('a,button'));
  }

  window.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    dot.classList.add('is-visible');
    if (!queued) { queued = true; requestAnimationFrame(paint); }
  }, { passive: true });

  const hide = () => dot.classList.remove('is-visible');
  document.addEventListener('mouseleave', hide);
  window.addEventListener('blur', hide);
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(paint); } }, { passive: true });
})();
