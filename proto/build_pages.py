#!/usr/bin/env python3
"""Rebuild the four remaining artist pages in the redesign layout from the live pages.
Content (text, links, embeds, images) is carried over verbatim; only the layout classes change."""
import re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
SPRITE = '/proto/assets/sprite.svg'

# 1) sprite: add any symbol the live pages define that the proto sprite lacks
spr_path = ROOT/'proto/assets/sprite.svg'
spr = spr_path.read_text()
live = (ROOT/'yuvee/index.html').read_text()
for sid in ('ic-youtube','ic-facebook','ic-globe'):
    if f'id="{sid}"' in spr: continue
    m = re.search(r'<symbol id="%s".*?</symbol>' % sid, live, re.S)
    spr = spr.replace('</svg>', '  ' + m.group(0) + '\n</svg>')
spr_path.write_text(spr)

def build(slug):
    s = (ROOT/slug/'index.html').read_text()
    main = s[s.index('<main'):s.index('</main>')]
    title = re.search(r'<title>(.*?)</title>', s).group(1).replace('—','-')
    name = re.search(r'<h1 class="name[^"]*">(.*?)</h1>', main).group(1)
    tools = re.search(r'<div class="top__tools">(.*?)</div>', main, re.S).group(1).strip()
    plats = re.search(r'<div class="plats[^>]*>(.*?)\n  </div>', main, re.S).group(1)
    shot = re.search(r'<div class="shot"><img src="([^"]+)" alt="([^"]*)"', main)
    rest = main[main.index('</div>', main.index('<div class="shot">'))+6:]       # everything after the shot
    fix = lambda h: h.replace('href="#ic-', f'href="{SPRITE}#ic-')

    # sections
    rest = re.sub(r'<section class="sec(?: sec--dark)?"', '<section class="sec rv"', rest)
    rest = re.sub(r'<h2 class="sec__head mess__logo[^"]*">', '<h2 class="mess__logo">', rest)
    rest = re.sub(r'<h2 class="sec__head[^"]*"[^>]*>', '<h2>', rest)
    rest = re.sub(r'<div class="bio">\s*<div>(.*?)</div>\s*<figure class="bio__shot[^>]*>(.*?)</figure>\s*</div>',
                  lambda m: m.group(1) + '\n<figure class="bio__fig">' + m.group(2) + '</figure>', rest, flags=re.S)
    rest = re.sub(r'<p class="eyebrow"[^>]*>', '<p class="sub">', rest)
    rest = re.sub(r'<figcaption class="eyebrow">', '<figcaption class="sub">', rest)
    rest = re.sub(r'\sstyle="transition-delay:[^"]*"', '', rest)
    rest = rest.replace('class="decks decks--dark"', 'class="decks"').replace('class="list list--dark', 'class="list')
    rest = rest.replace('class="btn btn--mess"', 'class="btn btn--mess"')
    rest = rest.replace('<div class="map rv" id="map">', '<div class="mapwrap rv"><div class="map" id="map">')
    rest = rest.replace('<div class="map__pins" id="map-pins"></div>\n  </div>',
                        '<div class="map__pins" id="map-pins"></div>\n  </div></div>')
    rest = fix(rest)

    # header links: Rider + the first other link become the mobile dock
    links = re.findall(r'<a href="([^"]+)"[^>]*>([^<]+)</a>', tools)
    dock = [l for l in links if l[1] == 'Rider'] + [l for l in links if l[1] != 'Rider']
    dock = dock[:2]
    dock_html = ''.join(f'<a href="{u}" target="_blank" rel="noopener noreferrer">{t}</a>' for u,t in dock)

    script = s[s.rindex('<script>'):s.index('</script>', s.rindex('<script>'))+9]
    script = script.replace('—', '-') if False else script   # titles in the live script are content; leave as is

    head = f'''<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title} (redesign prototype)</title>
<meta name="robots" content="noindex">
<meta name="theme-color" content="#000000">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/proto/assets/site.css">
</head>
<body>

<header class="hdr">
  <a href="/proto/" class="hdr__logo" aria-label="Crossroads home">
    <svg viewBox="0 0 1920 768" fill="currentColor" aria-hidden="true"><use href="{SPRITE}#cr-logo"/></svg>
  </a>
  <nav class="hdr__nav"><a href="/proto/#roster">Roster</a><a href="#assets">Contact</a></nav>
</header>

<main class="split">
  <div class="split__photo"><img src="{shot.group(1)}" alt="{shot.group(2)}" width="900" height="1200"></div>
  <div class="split__main">
    <div class="tools">
      <a href="/proto/#roster"><i class="plus" aria-hidden="true"></i> Back to roster</a>
      <div class="tools__r">{tools}</div>
    </div>
    <h1 class="name">{name}</h1>
    <div class="plats">{fix(plats)}</div>
{rest}
    <div class="pfoot"><span>© 2026 Crossroads Agency</span><span>Design by Ormitus</span></div>
  </div>
</main>

<nav class="dock" aria-label="Quick links">{dock_html}</nav>

{script}
</body>
</html>
'''
    out = ROOT/'proto'/slug
    out.mkdir(exist_ok=True)
    (out/'index.html').write_text(head)
    print(slug, 'ok', len(head))

for slug in sys.argv[1:] or ['mishell','yuvee','nevos','mentesh']:
    build(slug)
