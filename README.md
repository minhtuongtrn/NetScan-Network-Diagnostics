# NetScan — Network Diagnostics

A comprehensive, real-time network diagnostic tool built with **React + Vite** (frontend) and **Express** (backend). All tests run entirely in your browser — no data is stored or sent to third-party servers.

![NetScan](https://img.shields.io/badge/NetScan-Network%20Diagnostics-blue?style=for-the-badge)

---

## ✨ Features

| Feature | Description |
|---|---|
| **Connection Type Detection** | Detects Wi-Fi, Ethernet, 4G/LTE, 3G, 2G via the Network Information API |
| **IPv4 & IPv6 Status** | Fetches your public IPv4 and IPv6 addresses with ISP/geo metadata |
| **DNS Server Analysis** | Tests DNS resolution latency, detects provider and DNS-over-HTTPS |
| **Speed Test** | Measures download & upload bandwidth with visual gauge rings |
| **Ping / Latency Test** | Pings multiple servers (Google, Cloudflare, GitHub, OpenAI) with live chart |
| **Reachability & IP Block Check** | Tests 11 popular services for firewall/blacklist/censorship detection |
| **IP Verdict & Risk Score** | Comprehensive analysis: proxy, VPN, Tor, blacklist, and firewall detection |

---

## 🏗️ Project Structure

```
status-check-internet/
├── frontend/                    # React + Vite application
│   ├── index.html               # Vite HTML entry point
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   └── src/
│       ├── main.jsx             # React DOM root
│       ├── App.jsx              # Main application orchestrator
│       ├── diagnostics.js       # Network diagnostic logic module
│       ├── style/
│       │   └── index.css        # Global styles (dark theme, animations)
│       └── components/
│           ├── Header.jsx       # App header with status badge
│           ├── Hero.jsx         # Hero section with run button
│           ├── SectionLabel.jsx # Section divider labels
│           ├── SummaryBar.jsx   # Results summary bar
│           └── cards/
│               ├── CardShell.jsx       # Reusable card wrapper
│               ├── ConnectionCard.jsx  # Connection type card
│               ├── IpVersionCard.jsx   # IPv4/IPv6 card
│               ├── DnsCard.jsx         # DNS server card
│               ├── SpeedTestCard.jsx   # Speed test with gauges
│               ├── PingCard.jsx        # Ping test with canvas chart
│               ├── BlockCheckCard.jsx  # Reachability check card
│               └── VerdictCard.jsx     # Final verdict card
├── backend/
│   ├── server.js                # Express static file server
│   └── package.json             # Backend dependencies
├── package.json                 # Root scripts
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd status-check-internet

# Install all dependencies (frontend + backend)
npm run install:all
```

### Development

Start the Vite dev server with hot reload:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production

Build the frontend and serve via Express:

```bash
# Build frontend
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`.

Or run both in one command:

```bash
npm run preview
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite 6, Vanilla CSS |
| **Backend** | Node.js, Express 5 |
| **Fonts** | Inter, JetBrains Mono (Google Fonts) |
| **APIs Used** | Network Information API, ipify, ipapi.co, Cloudflare Speed Test |

---

## 🌐 How It Works

All diagnostic checks run **client-side** in your browser:

1. **Connection Type** — Uses the [Network Information API](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API) to detect your connection type and estimated speed.
2. **IPv4/IPv6** — Fetches your public IP addresses from [ipify.org](https://www.ipify.org/) and geolocation metadata from [ipapi.co](https://ipapi.co/).
3. **DNS** — Measures DNS resolution time by timing fetches to known endpoints.
4. **Speed Test** — Downloads/uploads test payloads via [Cloudflare's speed test CDN](https://speed.cloudflare.com/).
5. **Ping** — Measures HTTP-based latency to multiple servers.
6. **Block Check** — Tests reachability of 11 popular services to detect firewall/censorship.
7. **Verdict** — Aggregates all results into a risk score and final verdict.

The **backend** is a simple Express static file server that serves the built React app. It can be extended with server-side API endpoints if needed.

---

## 📄 License

This project is open source. Feel free to use, modify, and distribute.
