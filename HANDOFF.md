# Handoff

Everything a new machine, a new person or a new Claude session needs to pick this
site up. `README.md` explains how the site is built; this file explains the state
it is in and the decisions that are not visible in the code.

## Getting set up on another computer

```bash
git clone https://github.com/crossroaddd/crossroads.git
cd crossroads
python3 -m http.server 5810 --directory .   # then open http://localhost:5810
```

To be able to publish, that machine needs its own GitHub login:

```bash
gh auth login -h github.com -p https -w
gh auth setup-git -h github.com
```

Choose **Login with a web browser**, copy the one-time code it prints, press
Enter, paste the code at github.com/login/device. Two things that went wrong
before: a Hebrew keyboard layout sends `ט` instead of `y` at the `(Y/n)` prompt
and the login aborts, and the flow silently stalls if you never press Enter at
"Press Enter to open …". Confirm with `gh auth status` — it must say
`✓ Logged in`, not `token in keyring is invalid`.

Never paste a personal access token into a chat. One was leaked that way and had
to be revoked.

## Publishing

`git push origin main` is the deploy. GitHub Pages builds from `main`; the custom
domain `cross-roadsmgmt.com` is pinned by `CNAME` with a Let's Encrypt
certificate and `cache-control: max-age=600`.

Check the build and verify the live page rather than trusting the push:

```bash
gh api repos/crossroaddd/crossroads/pages/builds/latest -q '.status + " " + .commit'
curl -s https://cross-roadsmgmt.com/genish/ | grep -c "some string you just added"
```

A build can sit at `building` for a long time during a GitHub incident — that is
not a broken deploy, check githubstatus.com before investigating.

## Open items

- **Nevos is missing platform links.** His roster card shows SoundCloud and
  Instagram only; Spotify, Apple Music and Beatport have never been supplied. A
  platform with no URL renders no icon, so nothing is a dead link.
- **Genish has two riders.** His page carries a `Technical requirements` section
  from his own EPK *and* a `Rider` button pointing at the agency-wide rider. The
  client has not said which one wins.
- **The five artist pages duplicate their CSS.** Only `assets/cursor.js` is
  shared; design tokens and the header/footer/button rules are copied into each
  page. This has already caused one real bug — Yuvee's `.btn` block went missing
  when his page was scaffolded from Mishell's and his buttons rendered as plain
  text. Extracting a shared stylesheet has been offered repeatedly and not yet
  scheduled.

## Decisions that are easy to undo by accident

- **Contact details differ between the home page and the artist pages, on
  purpose.** Home page: `booking@cross-roadsmgmt.com`, `+972 54-805-1138`.
  Every artist page: `daniel@cross-roadsmgmt.com`, `+972 52-539-2032`. Nevos
  additionally splits his into Booking `booking@ritual-artists.com` and
  Management `daniel@cross-roadsmgmt.com`.
- **The artist EPKs listed Strange Talent and Ritual Artists as contacts.** Those
  were deliberately *not* copied — a press kit on the agency's own site routes
  enquiries to the agency. Nevos' booking address is the one exception, supplied
  by the client.
- **Never invent contact details.** An earlier draft shipped a fabricated email,
  phone and street address to the live site. The footer's Management, Studio and
  Follow columns were deleted rather than filled with placeholders; markers in
  the markup show where they were.
- **Artist pages are reachable only by clicking the artist's photo** on the
  roster. That is driven by `epk: '/<slug>/'` in the `ARTISTS` array in
  `index.html`; an artist without it renders a plain `<div>` instead of a link.
- **Every artist page has its own `og-<slug>.png`** so a shared link previews the
  artist, not the agency logo.
- **One agency-wide rider** (`CrossRoads Tech & Hospitality Rider.pdf` on Google
  Drive) is linked from all five pages, in both the page-header tools and the
  Assets buttons — ten links. It replaced the artists' individual rider
  documents.
- **The ticker must be built past 4000px per half**, otherwise the `-50%` loop
  exposes a visible gap on wide screens.
- **The carousel drag threshold is 12px.** At 4px, normal mouse drift cancelled
  the click and the card links were unclickable.
- **Photos are served at 900px wide** (`sips --resampleWidth 900`). Do not use
  `sips -Z 900` — it fits the *longest* side and leaves portraits about 600px
  wide, which is under-resolution for a 2× card.

## Moving the conversation itself

The chat transcript lives only on the machine that ran it, under
`~/.claude/projects/`, and it belongs to that Claude account — another account
cannot resume it. The session menu's **Export** writes a zip to `~/Downloads`
if a verbatim copy is wanted, but it is large (this one is over 100 MB, mostly
screenshots) and a new session cannot load it as context anyway.

This file is the handoff. Keep it current instead.
