#!/usr/bin/env node
// Locks the asset links (Drive / Dropbox / Google Docs) on the artist pages behind a code.
// Each URL is AES-GCM encrypted with a key derived from the code (PBKDF2-SHA256), so the
// links are not in the page source in plain text. assets/gate.js decrypts them in the browser.
//
//   node tools/gate.mjs lock  <code>          encrypt every plain Drive/Dropbox/Docs link
//   node tools/gate.mjs rekey <old> <new>     change the code (no plain URLs needed)
//
// The code is never stored in the repo. This is a client-side gate: it keeps casual visitors out,
// it is not real access control (see HANDOFF.md).
import { webcrypto as c } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['genish', 'mishell', 'yuvee', 'nevos', 'mentesh'].map(a => path.join(ROOT, a, 'index.html'));
const GATE_JS = path.join(ROOT, 'assets', 'gate.js');
const HOSTS = new Set(['drive.google.com', 'www.dropbox.com', 'docs.google.com']);
const ITER = 300000;
const enc = new TextEncoder(), dec = new TextDecoder();
const b64 = u8 => Buffer.from(u8).toString('base64');
const unb64 = s => new Uint8Array(Buffer.from(s, 'base64'));
const unesc = s => s.replace(/&amp;/g, '&');
const esc = s => s.replace(/&/g, '&amp;');

const key = async (code, salt) => c.subtle.deriveKey(
  { name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' },
  await c.subtle.importKey('raw', enc.encode(code), 'PBKDF2', false, ['deriveKey']),
  { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
const seal = async (k, text) => { const iv = c.getRandomValues(new Uint8Array(12));
  const ct = new Uint8Array(await c.subtle.encrypt({ name: 'AES-GCM', iv }, k, enc.encode(text)));
  return b64(Uint8Array.from([...iv, ...ct])); };
const open = async (k, payload) => { const all = unb64(payload);
  return dec.decode(await c.subtle.decrypt({ name: 'AES-GCM', iv: all.slice(0, 12) }, k, all.slice(12))); };

const [cmd, a1, a2] = process.argv.slice(2);
const A = /<a\b[^>]*>/g;

if (cmd === 'lock') {
  const salt = c.getRandomValues(new Uint8Array(16)), k = await key(a1, salt); let n = 0;
  for (const f of PAGES) {
    let s = fs.readFileSync(f, 'utf8');
    const out = []; let last = 0;
    for (const m of s.matchAll(A)) {
      const tag = m[0], h = tag.match(/\shref="([^"]*)"/);
      if (!h || /data-gate=/.test(tag)) continue;
      let host; try { host = new URL(unesc(h[1])).host; } catch { continue; }
      if (!HOSTS.has(host)) continue;
      out.push(s.slice(last, m.index), tag.replace(h[0], ` href="#code" data-gate="${await seal(k, unesc(h[1]))}"`)); last = m.index + tag.length; n++;
    }
    fs.writeFileSync(f, out.join('') + s.slice(last));
  }
  let g = fs.readFileSync(GATE_JS, 'utf8').replace(/const CFG = \{[^}]*\};/, `const CFG = { salt: '${b64(salt)}', iter: ${ITER} };`);
  fs.writeFileSync(GATE_JS, g); console.log(`locked ${n} links`);
} else if (cmd === 'rekey') {
  const g0 = fs.readFileSync(GATE_JS, 'utf8'), oldSalt = unb64(g0.match(/salt: '([^']+)'/)[1]);
  const ko = await key(a1, oldSalt), salt = c.getRandomValues(new Uint8Array(16)), kn = await key(a2, salt); let n = 0;
  for (const f of PAGES) {
    let s = fs.readFileSync(f, 'utf8');
    const parts = []; let last = 0;
    for (const m of s.matchAll(/data-gate="([^"]+)"/g)) {
      parts.push(s.slice(last, m.index), `data-gate="${await seal(kn, await open(ko, m[1]))}"`); last = m.index + m[0].length; n++;
    }
    fs.writeFileSync(f, parts.join('') + s.slice(last));
  }
  fs.writeFileSync(GATE_JS, g0.replace(/const CFG = \{[^}]*\};/, `const CFG = { salt: '${b64(salt)}', iter: ${ITER} };`));
  console.log(`re-keyed ${n} links`);
} else { console.log('usage: node tools/gate.mjs lock <code> | rekey <old> <new>'); process.exit(1); }
