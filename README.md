# Radio-Dash 📻

A private, high-fidelity radio dashboard for deep-focus work. Designed for minimalist aesthetics and ephemeral security.

## 🚀 Tech Stack
- **Framework:** Astro (Static)
- **Deployment:** Cloudflare Pages
- **Backend:** Cloudflare Functions (Serverless API Proxy)
- **Audio:** Native HTML5 Audio API (Standard Mounts)

## 🔐 The "Joshua" Protocol
This application utilizes a **Memory-Only Authorization** model. 
- **Persistence:** None. Authorization is discarded upon tab closure or refresh.
- **Handshake:** On the first interaction per session, a browser prompt will appear. 
- **Verification:** The entered key is verified server-side via the `/api/stations.json` proxy. Incorrect keys result in a `403 Forbidden` and a lockout of both audio and metadata.

## 📡 Station Lineup
| Station | Genre | Provider |
| :--- | :--- | :--- |
| **WQXR** | Classical | New York Public Radio |
| **Swiss Classic** | Classical | SSR SRG (Switzerland) |
| **Groove Salad** | Ambient/Downtempo | SomaFM |
| **Deep Space One** | Deep Ambient | SomaFM |
| **Beat Blender** | Mid-tempo House | SomaFM |

## 🛠 Maintenance
To swap stations, update the `streams` object in `src/pages/index.astro` and the conditional logic in `src/pages/api/stations.json.js`. 

---
**Private Repository:** Internal use only. MIT License.