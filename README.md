<div align="center">

<img src="public/logo.png" alt="ABHIJEET" width="120" />

# 🏭 Smart Monitoring System

**Real-time assembly production monitoring for the shop floor, the office, and the TV wall.**

![Next.js](https://img.shields.io/badge/Next.js-16.3.8-black?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38BDF8?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-components-000000?logo=shadcnui&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-v5-FF4500?logo=react-query&logoColor=white)
![Status](https://img.shields.io/badge/status-in_development-blue)

</div>

---

## 📖 Overview

**Smart Monitoring** is a real-time production dashboard built for **APIPL / ABHIJEET** that tracks assembly and injection moulding machines on the shop floor. It shows live shift and day production for every machine, flags machines that have stopped, lets managers look back at any past date, and provides a dedicated full-screen **TV mode** that rotates through machine groups for display on shop-floor TVs.

The app is built with **Next.js (App Router)**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**, following a feature-based **MVVM architecture**.

## ✨ Highlights

| Feature | Description |
|---------|-------------|
| 📊 **Live Machine Cards** | Shift Production and Day Production for every machine, updated continuously via TanStack Query. |
| 🛑 **Stopped-Machine Detection** | If no new production event arrives within the timeout window, the machine turns red. |
| 🔍 **Machine Detail Popup** | Click any card to view OEE gauges, breakdown charts, and full machine details. |
| 📈 **Hourly Analytics** | Hourly production bar charts (green = target met, red = below target) on the Monitoring page. |
| 📅 **Date Picker / History** | View production for any past day. The "stopped from" indicator appears only on the live (today) view. |
| 📺 **TV Mode** | Full-screen, sidebar-free auto-rotating slides (`/tv` for Assembly, `/tv2` for Moulding) for shop-floor displays. |
| 🔐 **Persistent Login** | JWT-based authentication persisted in localStorage — stay signed in across tab and browser restarts. |
| 🏢 **Department Navigation** | Monitoring expands into **Assembly** and **Moulding**, each with its own **TV** sub-option. |
| 📱 **Responsive UI** | Branded blue/cyan theme, mobile-friendly, built with shadcn/ui and Tailwind CSS v4. |
| 🛡️ **Role-Based Access** | Super Admin guards protect sensitive pages (e.g., employee registration). |

## 🖥️ Monitored Machines

| Card | Machines | Notes |
|------|----------|-------|
| Aero Deflector | Aero Deflector | Shown alone |
| W610 Rear Door Cladding | RH + LH | No variant |
| W610 Rear Wheel Arch Cladding | RH + LH | **HIGH** = Pack C, **LOW** = Pack AB, grouped by variant |

> Production values shown on cards are the actual count **+1** (offset constants live in `src/constants/all-constants.js`).

## 🛠️ Tech Stack

| Area | Technology |
|------|------------|
| **Framework** | Next.js 16.3.8 (App Router) |
| **UI Library** | React 19.2.8 |
| **Styling** | Tailwind CSS v4, shadcn/ui (base-nova) |
| **State (Server)** | TanStack Query v5 |
| **State (Client)** | Zustand (auth) |
| **Forms** | React Hook Form + Zod |
| **HTTP Client** | Axios with JWT interceptors |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Dates** | date-fns (Asia/Kolkata timezone) |
| **Auth** | JWT, persisted in localStorage |

## 🗺️ Pages & Routes

| Route | Page | Description | Access |
|-------|------|-------------|--------|
| `/` | Login | Branded sign-in with remember me, show password, forgot password | Public (guests only) |
| `/dashboard` | Dashboard | Live machine cards, date picker, machine detail popup | Authenticated |
| `/dashboard/products` | Products | Product management | Authenticated |
| `/dashboard/settings` | Settings | App settings | Authenticated |
| `/monitoring` | Monitoring | Hourly production bar charts per department | Authenticated |
| `/monitoring/assembly` | Assembly Overview | Assembly machine grid | Authenticated |
| `/monitoring/moulding` | Moulding Overview | Injection moulding machine grid | Authenticated |
| `/employees/create` | Create Employee | Register a new person (name, ID, dept, role, password) | Authenticated |
| `/tv` | TV Display (Assembly) | Full-screen rotating slides, no sidebar, 35s rotation | TV kiosk |
| `/tv2` | TV Display (Moulding) | Full-screen IMM rotating slides | TV kiosk |

**Sidebar sections:** Dashboard, Monitoring, Employees, Reports, Activities, Settings.

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.18 or newer
- **npm**, **yarn**, or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/chakanabhijeet/next-js.git

# The project lives in the "smart" folder
cd next-js/smart

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 🌐 Opening on the Local Network (LAN)

To open the app from another device on the same network (e.g. `http://192.168.7.222:3000`), `next.config.mjs` already allows the `192.168.*.*` range:

```js
// next.config.mjs
const nextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
```

### 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the dev server with webpack |
| `npm run build` | Create a production build with webpack |
| `npm run start` | Run the production build |

## 📁 Project Structure

```
smart-monitoring/
├── .env.local                # Local environment variables (API URLs, secrets)
├── .gitignore                # Git ignore rules
├── AGENTS.md                 # Rules for AI coding agents
├── CLAUDE.md                 # Instructions for Claude Code
├── components.json           # shadcn/ui configuration
├── eslint.config.mjs         # ESLint flat config
├── jsconfig.json             # Path aliases (@/)
├── next.config.mjs           # Next.js config (React Compiler, LAN origins)
├── package.json              # Dependencies and scripts
├── postcss.config.mjs        # PostCSS / Tailwind setup
├── README.md                 # This file
├── structure.txt             # Detailed folder tree & data traceability
├── public/                   # Static assets (logo, SVGs, favicon)
│   └── logo.png              # Application logo (ABHIJEET)
└── src/
    ├── app/                  # Routes and pages (Next.js App Router)
    │   ├── page.js           # Login route (/)
    │   ├── layout.js         # Root layout + QueryProvider
    │   ├── globals.css       # Global styles
    │   ├── favicon.ico
    │   ├── dashboard/        # /dashboard (machine cards, date picker, popup)
    │   │   ├── page.js
    │   │   ├── layout.js
    │   │   ├── products/page.js
    │   │   └── settings/page.js
    │   ├── monitoring/       # /monitoring (hourly analytics)
    │   │   ├── page.js
    │   │   ├── assembly/page.js
    │   │   └── moulding/page.js
    │   ├── employees/create/page.js   # Register a new person
    │   ├── tv/page.js        # TV display for Assembly machines
    │   └── tv2/page.js       # TV display for Moulding (IMM) machines
    ├── components/           # Reusable UI components
    │   ├── common/           # AppSidebar, AuthGuard, GuestGuard, RoleGuard, etc.
    │   ├── dashboard/        # DashboardHeader
    │   ├── layout/           # DashboardLayout
    │   └── ui/               # shadcn/ui primitives (button, card, chart, input, etc.)
    ├── config/               # API endpoints, env, constants
    ├── constants/            # Roles, routes, machine timeout, offsets
    ├── features/             # Feature modules (MVVM: models / services / view-models / views / store)
    │   ├── auth/             # Login, JWT store, role-based access
    │   ├── monitoring/       # Assembly production monitoring (core)
    │   ├── moulding/         # Injection moulding (IMM) monitoring
    │   ├── analytics/        # Hourly production charts
    │   ├── employees/        # Employee registration
    │   ├── products/         # Product management
    │   └── users/            # User management
    ├── lib/                  # Axios client, JWT decode utils
    └── providers/            # TanStack Query provider
```

Each feature follows an **MVVM-style split**:

```
services  ──►  view-models  ──►  views
   ▲              │
   │       useProductionViewModel
   │       (shared by Dashboard and /tv)
```

| Layer | Folder | Responsibility |
|-------|--------|----------------|
| **Model** | `models/` | Data shape, normalisation, Zod validation schemas |
| **Service** | `services/` | API calls only — no UI, no state |
| **View-Model** | `view-models/` | React hooks with logic, state, grouping, calculations |
| **View** | `views/` | Pure UI — renders what the view-model provides |
| **Store** | `store/` | Global client state (auth only, via Zustand) |

1. **Services** fetch production data from the API.
2. **View-models** normalise data, apply offsets and the stopped-machine rule.
3. **Views** render the UI — Dashboard cards, popups, and TV slides all read from the same view model, so numbers always match.

**State Management:**
- **Zustand** — Authentication state (persisted to `localStorage` key `xoomgrid-auth`)
- **TanStack Query** — Server state caching (`staleTime: 60s`)
- **React Hook Form + Zod** — Form validation

**Styling:** Tailwind CSS v4 with shadcn/ui component patterns  
**Icons:** Lucide React  
**Charts:** Recharts  
**Date formatting:** date-fns with `Asia/Kolkata` timezone

## ⚙️ Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=https://api.xoomgrid.com
```

The API base URL is resolved in `src/config/env.js` with a fallback to `https://api.xoomgrid.com`.

## 🔌 API Endpoints

All endpoints are centralized in `src/config/api-endpoints.js`:

| Category | Endpoint | Description |
|----------|----------|-------------|
| Auth | `POST /users/loginuser` | User login |
| Dashboard | `GET /dashboard` | Dashboard summary |
| Users | `GET /users` | List users |
| Users | `GET /users/:id` | User detail |
| Products | `GET /products` | List products |
| Products | `GET /products/:id` | Product detail |
| Departments | `POST /dept/createdept` | Create department |
| Permissions | `POST /permission/createpermission` | Create permission |
| Production | `GET /proddata/assemblyshift` | Assembly live shift data |
| Production | `GET /proddata/yesterday` | Assembly historical data |
| Production | `GET /proddata/immshiftwise` | Moulding shift-wise data |
| Production | `http://192.168.7.144:8000/proddata/immlog` | Moulding shot log (external server) |

The Axios client automatically attaches a Bearer token from `localStorage` to every request.

## 🗺️ Roadmap

- [x] Live dashboard with stopped-machine detection
- [x] Machine detail popup (OEE, breakdown)
- [x] TV mode with auto-rotating slides
- [x] Persistent login (JWT + localStorage)
- [x] Date picker with historical data
- [x] Moulding department monitoring
- [ ] More departments under Monitoring
- [ ] Employees, Reports, and Activities pages
- [ ] Role-based access enforcement on all admin pages

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

## 📄 License

Proprietary. © **ABHIJEET / APIPL**. All rights reserved.

---

<div align="center">

Built for the shop floor. 🏭

</div>
