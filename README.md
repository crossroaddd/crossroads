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
The logo and the platform icons live once in SVG `<symbol>`s and are reused via `<use>`.

1. **Hero** — stencil wordmark on the left, Roster / Contact on the right, sharing a
   centre line on a plain black field. Below it a ticker of the artist names.
2. **Roster** — drag/swipe carousel. Order: Mishell, Genish, Yuvee, Nevos, Mentesh.
   Each card carries its platform links: Spotify, Apple Music, Beatport, SoundCloud,
   Instagram.
3. **Footer** — "Lets talk", the booking address, and the contact details.

The page is monochrome throughout, so the artist photography is the only colour in it.
That's deliberate — don't add an accent hue elsewhere without rethinking it.

## Still placeholder

- **Missing platform links.** Nevos still needs Spotify, Apple Music and Beatport;
  he currently shows SoundCloud and Instagram only. A platform with no URL renders no
  icon, so nothing on the page is ever a dead link.
- **The footer is deliberately thin.** The Management, Studio and Follow columns were
  removed because every value in them was invented — fake contact details must not sit
  beside the real ones on a public page. Markers in the markup show where they were.
- **The Beatport and SoundCloud icons are drawn to match the set**, not the official
  brand marks. Swap them if exact brand assets are wanted.
- The generated photo placeholder (dot grid + initial + `IMAGE PLACEHOLDER` chip) is
  still wired up — any artist added with `photo: null` gets it automatically.

## Artist press kit pages

`mishell/index.html` serves at `/mishell`. Reachable only by clicking the artist's
photo on the roster — set `epk: '/<slug>/'` on the artist in the `ARTISTS` array and
the photo becomes the link; artists without it render a plain `<div>` as before.

Content comes from the artist's EPK PDF. For Mishell the contact block was
deliberately **not** copied from the PDF: that listed Strange Talent and Ritual
Artists, and a press kit on the agency's own site should route enquiries to the
agency, so it carries CrossRoads' details instead.

The page duplicates the design tokens and the header/footer/button CSS from the home
page. That is fine for one page — extract it to a shared stylesheet before adding a
second artist, or the two will drift. The custom cursor is already shared, at
`assets/cursor.js`.

## Editing the roster

Order, photos and links all live in one place — the `ARTISTS` array near the bottom of
`index.html`. The ticker builds itself from the same array, so adding an artist updates
both:

```js
const ARTISTS = [
  { name:'Mishell', photo:'img/mishell.jpg',
    links:{spotify:'#', instagram:'#', beatport:'#', apple:'#'} },
  ...
];
```

Photos are cropped to 3:4 with `object-fit: cover` and served at 900px wide, which
covers a 2× retina card with room to spare.

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
