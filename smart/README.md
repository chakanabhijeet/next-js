<div align="center">

<img src="public/logo.png" alt="ABHIJEET" width="120" />

# Smart Monitoring

**Real-time assembly production monitoring for the shop floor, the office and the TV wall.**

![Next.js](https://img.shields.io/badge/Next.js-App_Router-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-UI-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38BDF8?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-components-000000)
![Status](https://img.shields.io/badge/status-in_development-blue)

</div>

---

## Overview

**Smart Monitoring** is a web dashboard built for **APIPL / ABHIJEET** that tracks assembly machines in real time. It shows live shift and day production, flags machines that have stopped, and lets managers look back at any past date. A dedicated full-screen **TV mode** rotates through machine groups for display on the shop floor.

## Highlights

- **Live machine cards**: Shift Production and Day Production for every machine, updated continuously.
- **Stopped-machine detection**: if no new production event arrives for **15 minutes**, the machine turns red.
- **Machine detail popup**: click any card to see OEE gauges, a breakdown chart and machine details.
- **Hourly analytics**: hourly production bar charts (shadcn charts) on the Monitoring page.
- **Date picker / history**: view production for any past day. The "stopped from" indicator appears only on the live (today) view.
- **TV mode (`/tv`)**: sidebar-free, auto-rotating slides (every 35 seconds) with paired machines grouped together.
- **Persistent login**: stay signed in across tab and browser restarts until you press **Logout**.
- **Department navigation**: Monitoring expands into **Assembly** and **Moulding** (more departments coming), each with a **TV** sub-option.
- **Responsive, branded UI**: blue/cyan theme, built with shadcn/ui and Tailwind CSS.

## Monitored Machines

| Card | Machines | Notes |
|------|----------|-------|
| Aero Deflector | Aero Deflector | Shown alone |
| W610 Rear Door Cladding | RH + LH | No variant |
| W610 Rear Wheel Arch Cladding | RH + LH | **HIGH** = Pack C, **LOW** = Pack AB, grouped by variant |

Production values shown on cards are the actual count **+1** (offset constants live in `page.js`).

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | Next.js (App Router) |
| UI | React, Tailwind CSS, shadcn/ui |
| Charts | shadcn charts |
| Forms | react-hook-form |
| Data fetching | Axios + a query provider (`providers/query-provider.jsx`) |
| Auth | JWT-based, persisted login |

## Pages

| Route | Description |
|-------|-------------|
| `/login` | Branded sign-in with remember me, show password, forgot password |
| `/dashboard` | Live machine cards, date picker, machine detail popup |
| `/monitoring` | Hourly production charts per department |
| `/tv` | Full-screen rotating display for TVs (no sidebar) |

Sidebar sections: Dashboard, Monitoring, Employees, Reports, Activities, Settings.

## Getting Started

### Prerequisites

- Node.js 18.18 or newer
- npm, yarn or pnpm

### Installation

```bash
# clone the repository
git clone https://github.com/chakanabhijeet/next-js.git

# the project lives in the "smart" folder
cd next-js/smart

# install dependencies
npm install

# start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Opening on the local network (LAN)

To open the app from another device on the same network (for example `http://192.168.7.222:3000`), add your LAN origin to `allowedDevOrigins` in `next.config`:

```js
// next.config.mjs
const nextConfig = {
  allowedDevOrigins: ["192.168.7.222"],
};

export default nextConfig;
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the codebase |

## Project Structure

```text
src/
├── app/                  # Routes: dashboard (products, settings), monitoring, tv
├── components/           # common, dashboard, layout, ui (shadcn)
├── config/               # App configuration
├── constants/            # Shared constants
├── features/             # Feature modules
│   ├── analytics/
│   ├── auth/
│   ├── monitoring/
│   ├── products/
│   └── users/            # each split into: models / services / view-models / views
├── lib/                  # axios, jwt, utils
└── providers/
    └── query-provider.jsx
```

Each feature follows an **MVVM-style split**: `models` (types and shapes), `services` (data access), `view-models` (logic and state), `views` (UI). For a file-by-file description see [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md).

## How It Works

```text
Services ──► view-models ──► views
                │
   useProductionViewModel
   (shared by Dashboard and /tv)
```

1. Services fetch production data for the selected date.
2. `useProductionViewModel` normalises the data, applies the +1 offset and the 15-minute stopped rule.
3. Dashboard cards, popups and TV slides all read from the same view model, so the numbers always match.

## Roadmap

- [x] Live dashboard with stopped-machine detection
- [x] Machine detail popup (OEE, breakdown)
- [x] TV mode with auto-rotating slides
- [x] Persistent login
- [x] Date picker with historical data
- [ ] Moulding department monitoring
- [ ] More departments under Monitoring
- [ ] Employees, Reports and Activities pages

## Contributing

1. Create a branch: `git checkout -b feature/your-feature`
2. Commit your changes: `git commit -m "Add your feature"`
3. Push: `git push origin feature/your-feature`
4. Open a Pull Request

## License

Proprietary. © ABHIJEET / APIPL. All rights reserved.

---

<div align="center">
Built for the shop floor. 🏭
</div>
