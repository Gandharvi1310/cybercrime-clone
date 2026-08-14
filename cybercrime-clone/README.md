# Eigi–NCRP Demo Portal (Cybercrime Reporting Clone)

Plain HTML/CSS/JavaScript student demo. No frameworks, no backend, no real data.

## Run it in VS Code

1. Open the `cybercrime-clone` folder in VS Code.
2. Install the "Live Server" extension (if you don't have it).
3. Right-click `index.html` → **Open with Live Server**.

Or, without any extension:

```bash
cd cybercrime-clone
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.

## Pages

- `index.html` — homepage (hero, 3 report cards, track/suspect services, what's new, learning corner, safety tips, citizen manual/digest)
- `complaint.html` — demo complaint form with validation, evidence upload UI, fake reference number generation
- `track.html` — mock complaint status lookup (try `NCRP-DEMO-2026-123456`)
- `suspect.html` — mock suspect identifier checker (mobile/email/URL/UPI tabs)
- `safety.html`, `faq.html`, `contact.html` — supporting content pages

All logic lives in `js/script.js`; all styling in `css/style.css`. No data ever leaves the browser.
