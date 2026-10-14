# MAP-A Care

**Right hospital, right bed, right time.** MAP-A Care finds the nearest hospital in Albay that can treat the patient, has a bed that is not reported full, and accepts what the family can pay, by ambulance or by jeepney, van, bus and on foot. It shows two backup hospitals, the payment, need and mobility gaps, and planning tools for the Provincial Health Office, the PDRRMO and LGUs: catchment maps, beds per person and bed deserts, surge assignment, critical roads and new Malasakit Center sites.

Like MAP-A, it comes in two parts:

- **The website** (`index.html`): what the app does, screenshots, and the Install button, the Open in browser link and a one-file download.
- **The app** (`app/index.html`): MAP-A Care itself. The website's Install button installs it, and it opens without a signal once installed.

It is the app of the research paper *Right Hospital, Right Bed, Right Time: A Verified Network Model for Mapping Hospitals and Routing Patients in Albay by Clinical Need, Live Bed Availability, and Ability to Pay* (Legazpi City Science High School, MCS-T), and it runs on the network of the [MAP-A transit atlas](https://pogi6969.github.io/MAP---A/).

Navigation and planning support only. It does not diagnose or triage and does not replace 911.

## Files

- `index.html` – the website (built)
- `app/index.html` – the app (built)
- `manifest.webmanifest` – app name, colours, icons and start page (`app/`) used when installing
- `sw.js` – service worker that keeps an offline copy of the app and the website (caches named `mapa-care-`)
- `icons/`, `favicon.ico` – app icons: the official logo with a red cross badge
- `assets/official-logo.webp` – the official logo of the Landmark-Anchored Research Initiative
- `assets/screens/` – app screenshots shown on the website
- `src/` – sources:
  - `care.js`, `care.css` – the MAP-A Care module and its styles
  - `vendor/mapa-app-v49.html` – the MAP-A app v49 it builds on (map, road and transit network, fares, DOH registry)
  - `site/` – the website's styles, page body and install script
  - `build.py` – builds `app/index.html` and `index.html`
  - `tools/` – screenshot scripts for the website

## Build

Edit the files in `src/`, never the two built files.

```
python3 src/build.py
```

To refresh the screenshots, serve the repository (`python3 -m http.server 8766`), then run `node src/tools/screens.js http://localhost:8766/ assets/screens` and `python3 src/tools/screens_webp.py assets/screens` (needs Playwright with Chromium and Pillow).

After changing the app, the icons or the manifest, bump `VERSION` in `sw.js` so installed copies refresh.

## Publish

Installing needs HTTPS. Test locally with `python3 -m http.server 8000`, then open http://localhost:8000.

GitHub Pages: Settings → Pages → Build and deployment → Deploy from a branch → `main` and `/ (root)` → Save. Pages on a private repository needs a paid GitHub plan; any other static host works the same way.
