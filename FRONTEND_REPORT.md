# 🎨 CommunityConnect: Frontend Guide & Documentation

*Multi-Tenant Gated Community Management & Resident Portal*

Covers everything built in the **CommunityConnect React 19 + Vite Frontend**: architecture, components, JWT authentication flow, role-based dashboards, CRUD operations, and deployment cheat sheet.

---

## 1. What we built in one page

**CommunityConnect Frontend** is a modern Single Page Application (SPA) designed for multi-tenant gated society management. It lets people:

- **Register and log in**, receiving and storing a secure JWT bearer token.
- **Generate Digital Gate Passes**: Residents create timed visitor passes with scannable QR display and expiry counters.
- **Hire Household Staff**: Direct 1-on-1 monthly retainers for home cooks, maids, and maintenance workers.
- **Join Group Demand Pools**: Aggregate neighborhood demand (e.g., Summer AC Servicing across 10 flats) to unlock bulk vendor discounts.
- **Resolve Occupancy Conflicts**: Community Admins physically verify flat registrations and resolve single active household disputes.
- **Security Gate Scanner**: Security guards scan passes and maintain real-time visitor entry logs.
- **Print Executive Reports**: Export high-level PDF/printable community financial & resident reports.

Everything is built using **React 19**, styled with custom **Glassmorphism Vanilla CSS**, and powered by **Vite**.

**Status**: Frontend complete and ready for GitHub repository upload & Vercel deployment.

---

## 2. Tech stack and why we chose each piece

| Piece | What it is | Why we use it |
|---|---|---|
| **React 19** | Component-based UI library | Modern declarative rendering with state hooks (`useState`, `useEffect`, `useContext`) |
| **Vite** | Frontend build tool & server | Lightning-fast HMR (Hot Module Replacement) and optimized production bundling |
| **Vanilla CSS (`index.css`)** | Custom design system | Maximum design control with CSS custom properties (tokens), dark mode & glassmorphism |
| **Native Fetch API** | HTTP client wrapper (`src/api/`) | Lightweight REST calls with automatic JWT `Authorization: Bearer <token>` injection |
| **Context API** | React state management | Global Auth Context for persistent user login state and role permissions |
| **SVG & Lucide Icons** | Vector graphics | Lightweight, resolution-independent UI icons |

---

## 3. The big picture: how a request travels

Every user action in the React app follows a structured flow through the layers:

```
[ User Interaction ]  ---> (Button Click / Form Submit)
       │
       ▼
[ React Component State ] -> Validates input, sets loading state
       │
       ▼
[ API Service (`src/api/`)] -> Reads JWT token from LocalStorage/Context
       │                       Injects `Authorization: Bearer <token>`
       ▼
[ HTTP REST Fetch ] -------> Sends JSON payload over HTTP to Backend (Port 8080)
       │
       ▼
[ Response Handler ] -------> Receives JSON (200 OK / 401 Unauthorized / 409 Conflict)
       │
       ▼
[ DOM Re-render ] ---------> Updates React State -> Dynamic Glassmorphism UI update
```

---

## 4. Project structure

```
communityconnect-frontend/
├── package.json                   # Dependencies and scripts (vite, react)
├── vite.config.js                 # Vite server port (3000) & proxy configuration
├── index.html                     # Main HTML entry point with Google Fonts
├── vercel.json                    # Vercel SPA routing configuration
├── .gitignore                     # Excludes node_modules, dist, .env
├── FRONTEND_REPORT.md             # Comprehensive Architecture Report
├── README.md                      # Complete Frontend Guide & Documentation
└── src/
    ├── main.jsx                   # Mounts React application root
    ├── App.jsx                    # Master Router & Role-Based Dashboard View Switcher
    ├── index.css                  # Design system tokens, glassmorphism & animations
    ├── ErrorBoundary.jsx          # Catches uncaught React render errors
    ├── api/                       # REST API Integration Services
    │   ├── auth.js                # Login, Register, Logout endpoints
    │   ├── community.js           # Directory & Admin management API
    │   ├── occupancy.js           # Conflict resolution & flat verification API
    │   └── service.js             # Service pools & daily staff retainer API
    ├── data/                      # Fallback mock data & initial state presets
    └── components/                # Modular React UI Components
        ├── auth/                  # LoginModal, RegisterModal
        ├── common/                # DigitalGatePassModal, ExecutiveReportPrintModal, Navbar
        ├── resident/              # ResidentDashboard, GatePassForm, StaffRetainerCard
        ├── community-admin/       # AdminDashboard, ConflictResolverModal, ExecutiveReport
        ├── platform-admin/        # PlatformAdminDashboard, SocietyOnboardingForm
        ├── security-gate/         # GateScanner, VisitorLogTable
        ├── provider/              # ProviderDashboard, ServiceBidModal
        └── public/                # LandingPage, CommunityCatalog
```

---

## 5. The data model & state management

Frontend manages state using React hooks and global Auth context:

```
User (id, name, email, role, communityId)
  │
  ├── Household (flatNumber, occupancyStatus, residentCount)
  │
  ├── DigitalGatePass (passId, visitorName, vehicleNo, passType, validUntil, qrCode)
  │
  ├── OccupancyConflict (conflictId, flatNumber, claimantEmail, status)
  │
  └── ServicePool (poolId, serviceType, targetFlats, currentFlats, discountPercentage)
```

---

## 6. The concepts we used, in plain English

- **REST API & JSON**: Standardized HTTP endpoints for client-server communication.
- **JWT (JSON Web Token)**: Stateless authentication token saved upon login and attached to all secure fetch headers (`Authorization: Bearer <token>`).
- **Role-Based View Switching**: Automatically renders the correct dashboard interface based on the logged-in user's role (`RESIDENT`, `COMMUNITY_ADMIN`, `PLATFORM_ADMIN`, `SECURITY`, `SERVICE_PROVIDER`).
- **Glassmorphism Design System**: Modern UI aesthetic using translucent backgrounds (`backdrop-filter: blur(12px)`), vibrant gradient borders, and responsive grid layouts.
- **Modal Portals**: Reusable overlays (`DigitalGatePassModal`, `ExecutiveReportPrintModal`) that trigger on demand without disturbing the page flow.
- **CORS Handling**: Frontend sends requests to `http://localhost:8080/api` configured with credentials and origin header.

---

## 7. Flow walkthroughs (CRUD Operations)

### 7.1 Authentication (Login & JWT Handling)
```
1. User enters Email & Password in LoginModal
2. `auth.js` sends POST request to `/api/auth/login`
3. Server returns JWT token + user details
4. AuthContext stores token in localStorage and sets active user state
5. App.jsx automatically redirects user to their Role Dashboard
```

### 7.2 Resident: Digital Gate Pass CRUD
- **Create**: Resident fills visitor name, phone, vehicle number -> POST `/api/passes` -> Generates active pass with QR code.
- **Read**: View active and expired visitor passes in `DigitalGatePassModal`.
- **Update**: Extend pass expiry time or revoke access.
- **Delete**: Cancel pending visitor pass.

### 7.3 Community Admin: Occupancy Conflict CRUD
- **Read**: Fetch list of disputed flat registrations (`GET /api/occupancy/conflicts`).
- **Update (Resolve)**: Admin physically verifies resident proof -> PATCH `/api/occupancy/conflicts/{id}/approve` -> Deactivates stale resident and approves new tenant.

### 7.4 Security Gate: Visitor Verification
- **Read/Scan**: Security guard scans pass ID -> GET `/api/passes/verify/{passId}`.
- **Create Entry Log**: Click "Check In" -> POST `/api/gate/logs` -> Updates real-time entry status.

---

## 8. API reference

All secure endpoints require `Authorization: Bearer <token>`.

| Method | Endpoint URL | What it does | Success |
|---|---|---|---|
| **POST** | `/api/auth/login` | Authenticate user & return JWT token | `200 OK` |
| **POST** | `/api/auth/register` | Register new resident account | `201 Created` |
| **GET** | `/api/communities/public` | Get list of onboarded gated societies | `200 OK` |
| **GET** | `/api/occupancy/conflicts` | Fetch pending flat occupancy disputes | `200 OK` |
| **PATCH** | `/api/occupancy/conflicts/{id}` | Approve or reject flat registration | `200 OK` |
| **GET** | `/api/services/pools` | Fetch active group demand service pools | `200 OK` |
| **POST** | `/api/services/pools/join` | Join group servicing pool for discount | `200 OK` |

---

## 9. Who can do what, and what the status codes mean

### Role Permissions Matrix:

| Action | Resident | Community Admin | Security | Service Provider |
|---|---|---|---|---|
| **Generate Gate Pass** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Scan Gate Pass** | ❌ No | ✅ Yes | ✅ Yes | ❌ No |
| **Resolve Flat Conflict** | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **Join Service Pool** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Bid Service Contract** | ❌ No | ❌ No | ❌ No | ✅ Yes |

### HTTP Status Codes:
- `200 OK`: Request succeeded.
- `201 Created`: Gate pass or user account created successfully.
- `401 Unauthorized`: Missing or expired JWT token.
- `403 Forbidden`: Role permission denied (e.g. Resident attempting Admin actions).
- `409 Conflict`: Flat already registered to another active household.

---

## 10. Configuration files explained

- `package.json`: Contains React 19 dependencies and build scripts.
- `vite.config.js`: Sets server port to `3000` and configures API proxies.
- `.env.example`: Template for environment variables (e.g. `VITE_API_BASE_URL=http://localhost:8080/api`).

---

## 11. Cheat sheet: run, test, save

### Run Frontend locally:
```bash
npm run dev
```
*(App starts on `http://localhost:3000`)*

### Build for Production:
```bash
npm run build
```

### Save & Push to GitHub:
```bash
git status
git add .
git commit -m "Initial commit: CommunityConnect Frontend"
git push -u origin main
```

---

## 12. When something goes wrong

| Symptom | Likely cause | Fix |
|---|---|---|
| **Page blank on refresh** | Router path mismatch | Ensure `vite.config.js` or `vercel.json` has rewrite rules |
| **401 Unauthorized error** | Token missing or expired | Re-login to regenerate JWT bearer token |
| **CORS policy blocked request** | Backend missing frontend URL in CORS config | Update backend `SecurityConfig.java` to allow `http://localhost:3000` |
| **Port 3000 in use** | Another dev server running | Run `npx kill-port 3000` or change port in `vite.config.js` |

---

## 13. Reminders and what comes next

1. **GitHub Setup**: Repository URL: `https://github.com/saikirankvdd/Communityconnect-frount-end-.git`
2. **Deployment**: Connect GitHub repository to Vercel/Netlify for automatic CI/CD deployment.
3. **Backend Connection**: Set `VITE_API_BASE_URL` to your production backend URL once deployed.
