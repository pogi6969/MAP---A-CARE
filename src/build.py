"""Build MAP-A Care: the app (app/index.html) and the download website (index.html).

Run from the repository root:

    python3 src/build.py

Edit the sources in src/, never the two built files, which this script overwrites.

  src/vendor/mapa-app-v49.html   the MAP-A app (v49): map, road and transit network, fares, registry
  src/care.js, src/care.css      the MAP-A Care module and its styles, added to the MAP-A app
  src/site/site.css, body.html, site.js   the website
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "src")


def read(*p):
    with open(os.path.join(SRC, *p), encoding="utf-8") as f:
        return f.read()


def write(rel, text):
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        f.write(text)
    print("wrote", rel, len(text.encode("utf-8")), "bytes")


def rep(s, old, new):
    n = s.count(old)
    if n != 1:
        raise SystemExit("expected exactly one match (%d found): %s" % (n, old[:90]))
    return s.replace(old, new)


def build_app():
    s = read("vendor", "mapa-app-v49.html")
    care_js, care_css = read("care.js"), read("care.css")
    # head: the links to ../manifest.webmanifest, ../icons and ../sw.js stay, since the app sits in app/
    s = rep(s, '<link rel="apple-touch-icon" href="../icons/apple-touch-icon.png">',
            '<link rel="apple-touch-icon" href="../icons/apple-touch-icon.png">\n'
            '<meta name="description" content="MAP-A Care finds the nearest hospital in Albay that can treat the '
            'patient, has a bed and fits what the family can pay, by ambulance or by public transport, with '
            'planning tools for the health office.">')
    s = rep(s, '<meta name="apple-mobile-web-app-title" content="MAP-A">',
            '<meta name="apple-mobile-web-app-title" content="MAP-A Care">')
    s = rep(s, '<title>Albay Open Transit · Maps v49</title>',
            '<title>MAP-A Care · Right hospital, right bed, right time</title>')
    s = rep(s, '</head>', '<style id="care-css">\n' + care_css + '</style>\n</head>')
    # splash
    s = rep(s, 'aria-label="Loading MAP-A"', 'aria-label="Loading MAP-A Care"')
    s = rep(s, '<div class="sp-title">MAP&#8209;A</div>', '<div class="sp-title">MAP&#8209;A Care</div>')
    i = s.index('<div class="sp-foot">')
    j = s.index('</div>', i) + len('</div>')
    s = s[:i] + ('<div class="sp-foot">Right hospital, right bed, right time &middot; 18 LGUs &middot; '
                 'Districts I–III &middot; v1.0</div>') + s[j:]
    # bottom bar
    i = s.index('<nav class="nav" id="bottomNav"')
    j = s.index('</nav>', i) + len('</nav>')
    s = s[:i] + '''<nav class="nav" id="bottomNav" aria-label="Main">
  <button data-tab="hosp" aria-current="true"><b class="mi"></b>Care</button>
  <button data-tab="plan"><b class="mi"></b>Plan</button>
  <button data-tab="beds"><b class="mi"></b>Beds</button>
  <button data-tab="map"><b class="mi"></b>Map</button>
  <button data-tab="dir"><b class="mi"></b>Directions</button>
  <button data-tab="more"><b class="mi"></b>More</button>
</nav>''' + s[j:]
    # the care module goes at the end of the main script
    k = s.index('<script>\n/* Installed app')
    end = s.rindex('</script>', 0, k)
    s = s[:end] + care_js + '\n' + s[end:]
    s = rep(s, "/* Installed app: the site's service worker keeps a copy of MAP-A so it opens without a signal. */",
            "/* Installed app: the site's service worker keeps a copy of MAP-A Care so it opens without a signal. */")
    write("app/index.html", s)


DL = ('<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 3.5v11.5m0 0-4.6-4.6'
      'M12 15l4.6-4.6M4.5 15.5v4h15v-4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" '
      'stroke-linejoin="round"/></svg>')


def build_site():
    css, body, js = read("site", "site.css"), read("site", "body.html"), read("site", "site.js")
    head = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>MAP-A Care</title>
<meta name="description" content="MAP-A Care finds the nearest hospital in Albay that can treat the patient, has a bed that is not reported full and accepts what the family can pay, by ambulance or by jeepney, van, bus and on foot, with backups and planning tools for the health office.">
<meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#160C0C" media="(prefers-color-scheme: dark)">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="MAP-A Care">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="favicon.ico" sizes="48x48">
<link rel="icon" href="icons/favicon-32.png" type="image/png" sizes="32x32">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}</style>
</head>
<body>
'''
    fonts = ('<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" '
             'href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/'
             'css2?family=Barlow+Condensed:wght@600;700;800&family=Overpass:wght@400;600;700;800&family=Overpass+Mono:'
             'wght@500;600;700&display=swap">\n')
    html = (head + '<style id="care-site-css">\n' + css + '</style>\n' + fonts + body.replace("@@DL@@", DL) +
            '<script id="care-site">' + js + '</script>\n</body>\n</html>\n')
    write("index.html", html)


if __name__ == "__main__":
    build_app()
    build_site()
