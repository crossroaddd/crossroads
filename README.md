# CROSSROADS

One-page site for CROSSROADS — artist agency and booking.

See `HANDOFF.md` for the current state of the site, the open items and the
decisions that are not visible in the code — read it first if you are picking
this project up on another machine.

## Design language

Everything derives from the logo, which is a **stencil**: a plus/cross built from two
bars with `CROSSROADS` knocked *out* of it, so the letters are holes and the background
reads through them.

- **Monochrome only** — black `#000`, white, one grey. The mark has no accent colour,
  so neither does the site. The artist photography is the only colour on the page
  (the one exception is Mishell's own red Mess mark, kept as their brand asset).
- **The hero is the stencil, literally** — the five artists sit side by side behind the
  letters at natural scale, and the row slides one portrait over every few seconds.
- **Roster = five full-height strips** — the logo's horizontal bar cut into five; the
  hovered strip opens. On phones they stack.
- **Artist pages** — portrait pinned on the left, content on the right, plain headings
  (no section numbers, no uppercase micro-labels).
- **Hard edges, no radius.** Archivo 900 uppercase, tracking no tighter than -0.04em,
  display type capped around 6rem.

## Structure

One shared stylesheet (`assets/site.css`) and one shared artist list
(`assets/artists.js`, order and links in one place). Logo and platform icons live once in
`assets/sprite.svg` and are reused with `<use>`.

1. **Home** (`index.html`) — stencil hero, roster strips, "Lets talk" footer.
2. **Artist pages** (`/mishell`, `/genish`, `/yuvee`, `/nevos`, `/mentesh`) — each keeps
   its own content (embeds, sets, shows, brand book) in its own `index.html`.

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

`mishell/index.html` and `yuvee/index.html` serve at `/mishell` and `/yuvee`. Reachable only by clicking the artist's
photo on the roster — set `epk: '/<slug>/'` on the artist in the `ARTISTS` array and
the photo becomes the link; artists without it render a plain `<div>` as before.

Content comes from the artist's EPK PDF. For Mishell the contact block was
deliberately **not** copied from the PDF: that listed Strange Talent and Ritual
Artists, and a press kit on the agency's own site should route enquiries to the
agency, so it carries CrossRoads' details instead.

Each artist page carries its own `og:image` (`og-<slug>.png`) so sharing an artist
link shows that artist rather than the agency logo. Those are generated from the
roster photo — see the generator note in the commit history.

**Both artist pages duplicate the design tokens and the header/footer/button CSS.**
The custom cursor is shared at `assets/cursor.js`, but the CSS is not. With two pages
live this is now real drift risk — extract it before adding a third.

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
