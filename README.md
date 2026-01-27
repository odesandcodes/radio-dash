# Radio-Boss

A minimalist, high-performance radio dashboard built with Astro and Cloudflare Pages.

## 🏗 Infrastructure
- **Frontend:** Astro (SSR disabled for index) for a lightning-fast Light Mode UI.
- **Backend:** Cloudflare Functions (located in `/api/stations.json.js`) act as a server-side proxy to bypass CORS and fetch live track metadata.
- **Audio Engine:** Native HTML5 Audio API using direct-link stream mounts.

## 🛠 How to Update a Station
To replace a station:
1. **Update Stream:** In `index.astro`, update the `streams` object with a direct `.mp3` or `.aac` link.
2. **Update Metadata:** In `api/stations.json.js`, update the fetch URL and the JSON mapping to match the station's API format.

## 🧪 Testing New Stations (Avoid Lockouts)
Before adding a station, test the URL in your browser:
1. **Direct Check:** Paste the stream URL into a browser tab. If it plays, it's compatible.
2. **DNS Check:** If you get `NXDOMAIN`, the network is blocking that domain. Look for an alternative relay URL.
3. **Console Check:** Use DevTools (F12) to ensure no "Mixed Content" (HTTP vs HTTPS) errors exist.

---
**Disclaimer:** This project is for educational purposes only. No theft of intellectual property is intended. All audio streams are the property of their respective broadcasters.