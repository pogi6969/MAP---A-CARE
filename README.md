# MAP---A-CARE

MAP-A Care: the nearest hospital in Albay that can treat the patient, has a bed that is not reported full, and accepts what the family can pay, by ambulance or by jeepney, van, bus and on foot, across all 18 cities and municipalities of Albay, with backup hospitals and planning tools for the health office. This repository holds the MAP-A Care website and the MAP-A Care app (version 1.0). Visitors install the app from the website on Android, iPhone, iPad and computers, and it opens without a signal once installed.

## Files

- `index.html` – the website: features, planning tools, fare calculator, coverage map and the install section
- `app/index.html` – the MAP-A Care app; the website's Install button installs this, and it can also be downloaded as one file
- `manifest.webmanifest` – app name, colours, icons and start page (`app/`) used when installing
- `sw.js` – service worker that keeps an offline copy of the app and the website
- `icons/`, `favicon.ico` – icons made from the MAP-A logo
- `assets/map-a-app-logo.png` – the MAP-A logo, used for the icons and on the website
- `assets/map-a-interface-logo.png` – the MAP-A interface logo, shown inside the app

## Publish

Installing needs HTTPS. With GitHub Pages: Settings → Pages → Build and deployment → Deploy from a branch → `main` and `/ (root)` → Save.

- Website: https://pogi6969.github.io/MAP---A-CARE/
- App: https://pogi6969.github.io/MAP---A-CARE/app/

Test locally with `python3 -m http.server 8000`, then open http://localhost:8000.

After changing the app, the icons or the manifest, bump `VERSION` in `sw.js` so installed copies refresh.
