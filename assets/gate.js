/* Code gate for the asset links (photos, videos, press, rider, biography, logo).
   Links carry an encrypted URL in data-gate; the right code decrypts them in the browser.
   Streaming links (Spotify, SoundCloud...) are never gated. Built by tools/gate.mjs. */
(() => {
  const CFG = { salt: 'pbSIwcdblVq9neelGGyzww==', iter: 300000 };
  const enc = new TextEncoder(), dec = new TextDecoder();
  const links = [...document.querySelectorAll('a[data-gate]')];
  if (!links.length || !window.crypto?.subtle) return;
  const unb64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));

  const keyFor = async code => crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: unb64(CFG.salt), iterations: CFG.iter, hash: 'SHA-256' },
    await crypto.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey']),
    { name: 'AES-GCM', length: 256 }, false, ['decrypt']);
  const unseal = async (key, payload) => { const all = unb64(payload);
    return dec.decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: all.slice(0, 12) }, key, all.slice(12))); };

  let unlocked = false;
  const unlockAll = async key => {
    for (const a of links) { a.href = await unseal(key, a.dataset.gate); a.removeAttribute('data-gate'); a.dataset.open = ''; }
    unlocked = true;
  };

  const dlg = document.createElement('dialog');
  dlg.className = 'gate';
  dlg.innerHTML = `<form method="dialog" class="gate__form" novalidate>
      <label for="gate-code" class="gate__label">Code</label>
      <input id="gate-code" class="gate__input" type="password" inputmode="numeric" autocomplete="off" required>
      <p class="gate__err" role="alert" hidden>That code is not right.</p>
      <div class="gate__row"><button type="submit" class="gate__go">Open</button><button type="button" class="gate__x">Cancel</button></div>
    </form>`;
  document.body.appendChild(dlg);
  const input = dlg.querySelector('input'), err = dlg.querySelector('.gate__err');
  let pending = null, trigger = null;

  document.addEventListener('click', e => {
    const a = e.target.closest('a[data-gate]'); if (!a || unlocked) return;
    e.preventDefault(); pending = a; trigger = a; err.hidden = true; input.value = '';
    dlg.showModal(); input.focus();
  });
  dlg.querySelector('.gate__x').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('close', () => trigger?.focus());

  dlg.querySelector('form').addEventListener('submit', async e => {
    e.preventDefault();
    try {
      const key = await keyFor(input.value.trim());
      const url = await unseal(key, pending.dataset.gate);
      await unlockAll(key);
      sessionStorage.setItem('cr-gate', input.value.trim());
      dlg.close();
      if (!window.open(url, '_blank', 'noopener')) pending.focus();   // pop-up blocked: links are now open, click again
    } catch { err.hidden = false; input.select(); }
  });

  // same tab session: stay unlocked after the first correct code
  const saved = sessionStorage.getItem('cr-gate');
  if (saved) keyFor(saved).then(unlockAll).catch(() => sessionStorage.removeItem('cr-gate'));
})();
