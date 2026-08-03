# CROSSROADS

One-page site for CROSSROADS — artist agency and booking.

## Design language

Everything derives from the logo, which is a **stencil**: a plus/cross built from two
bars with `CROSSROADS` knocked *out* of it, so the letters are holes and the background
reads through them.

- **Monochrome only** — black `#000`, warm paper `#F2F0EA`, one grey. The mark has no
  accent colour, so neither does the site.
- **Cross motif** — the hero background is a page-sized ghost of the logo's own cross,
  using its exact proportions (vertical arm 20–40%, horizontal arm 25–75%). The `+`
  recurs as button icon, ticker separator and card hover mark.
- **Bar composition** — the header is a solid bar (the logo's horizontal arm), the
  ticker is a band, the carousel is a band with 1px hairline gaps between cards.
- **Hard edges, no radius.** Archivo 900 uppercase, tight tracking.

## Structure

`index.html` is self-contained — one file, inline CSS and JS, no build step.
The logo lives once in an SVG `<symbol>` and is reused via `<use>`.

1. **Hero** — full-bleed stencil wordmark over the ghost cross, ticker band.
2. **Roster** — drag/swipe carousel. Order: Mishell, Genish, Kino Todo, Yuvee, Nevos,
   Mentesh. One **Press Kit** action per artist.
3. **Footer** — contact columns and the wordmark lockup.

## Placeholder content

Both are deliberate and need replacing before launch:

- **Artist images** are generated in CSS (dot grid + spotlight + initial) and carry an
  `IMAGE PLACEHOLDER` chip. Swap `.card__media` for an `<img>` when the real shots land.
- **Footer details** — emails, phone numbers and names are dummy values. The two
  contact names are tagged `Placeholder` in the markup.

## Editing the roster

The card order lives in one place — the `ARTISTS` array near the bottom of `index.html`:

```js
const ARTISTS = [
  { name:'Mishell', tags:['Live','DJ Set'] },
  ...
];
```

## Responsive

Fluid `clamp()` type throughout, plus structural breakpoints at 400 / 720 / 1024 /
1440 / 1800px and short-viewport rules for landscape phones. Verified with no
horizontal overflow at 320, 390, 768, 1440 and 1920px. Hover-only affordances are
guarded behind `@media (hover:hover)` so they don't stick after a tap.

## Running locally

Any static server will do:

```bash
python3 -m http.server 5810 --directory .
```

Then open <http://localhost:5810>.

## Note

The page loads Archivo from Google Fonts. Self-host it if you'd rather not depend on
an external request.
