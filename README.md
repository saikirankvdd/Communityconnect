# 🏢 CommunityConnect — Multi-Tenant Residential Society Platform

An enterprise-grade, multi-tenant gated community management and neighborhood service aggregation platform. Features a **React 19 + Vite** single-page frontend, a **Spring Boot 3.2.3 + Java 21** REST backend, and **PostgreSQL 16** persistence with Flyway SQL migrations. Strictly enforces multi-tenancy data isolation, automated occupancy conflict resolution, groupable service demand buying, and verified household staff management.

![Java 21](https://img.shields.io/badge/Java-21-orange.svg)
![Spring Boot 3.2.3](https://img.shields.io/badge/Spring_Boot-3.2.3-brightgreen.svg)
![Spring Security 6.2](https://img.shields.io/badge/Spring_Security-6.2_JWT-blue.svg)
![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-blue.svg)
![React 19](https://img.shields.io/badge/React-19.0.0-61dafb.svg)
![License MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

---

## 📌 Table of Contents

- [How It Works](#how-it-works)
- [System Architecture](#system-architecture)
- [Platform Specifications & Roles](#platform-specifications--roles)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Project](#running-the-project)
- [Desktop GUI & Terminal Visualizers](#desktop-gui--terminal-visualizers)
- [REST API Reference & Manual Verification](#rest-api-reference--manual-verification)
- [Project Structure](#project-structure)
- [License](#license)

---

## 🔄 How It Works

```
┌────────────────────────────────┐     HTTP REST / JSON     ┌────────────────────────────────┐
│   React 19 + Vite Frontend     │ ───────────────────────► │   Spring Boot 3.2.3 Backend    │
│         (Port 3000)            │ ◄─────────────────────── │         (Port 8080)            │
└────────────────────────────────┘   HttpOnly JWT Cookie    └───────────────┬────────────────┘
                                                                            │
                                                                            │ JPA / Hibernate
                                                                            ▼
                                                            ┌────────────────────────────────┐
                                                            │     PostgreSQL 16 Database     │
                                                            │ (Flyway Migrations V1 & V2)    │
                                                            └────────────────────────────────┘
```

1. **User Action on Frontend**: Resident or Admin interacts with the React 19 UI on `http://localhost:3000`.
2. **API Proxying**: Vite's dev server proxies `/api/*` requests to the Spring Boot REST server on `http://localhost:8080`.
3. **Authentication & Security**: Spring Security 6.2 intercepts requests, validates HttpOnly JWT cookies, and enforces Role-Based Access Control (RBAC).
4. **Business Logic Enforcement**: The Service Layer checks community scoping rules, flat occupancy limits (1 active household per flat), and group demand pool aggregations.
5. **Database Execution**: Spring Data JPA executes operations against PostgreSQL 16 initialized via versioned Flyway SQL scripts.

---

## ⚙️ System Architecture

CommunityConnect follows a **Decoupled 3-Tier Layered Architecture**:

- **Presentation Layer (Port 3000)**: Single Page Application built with React 19, JSX, and Vanilla CSS glassmorphism styling.
- **Application & Security Layer (Port 8080)**: Layered Spring Boot 3.2.3 backend (Controllers, Services, Repositories, Security, and Exception Handlers).
- **Database Persistence Layer**: PostgreSQL 16 relational database with Flyway DDL/DML migrations (`V1__init_schema.sql` and `V2__seed_data.sql`).

---

## 🦾 Platform Specifications & Roles

### 1. Enforced 5 System Roles (RBAC)

| Role | Scope | Authorized Capabilities |
|---|---|---|
| **`PLATFORM_ADMIN`** | Global Platform | Onboard communities, manage subscriptions (`ACTIVE`, `SUSPENDED`, `FROZEN`), restore societies. |
| **`COMMUNITY_ADMIN`** | Assigned Community | Approve resident occupancy tickets, review security inspection reports, manage community work orders. |
| **`SECURITY`** | Gate & Physical Access | Submit physical inspection reports for occupancy conflicts, issue visitor OTP passes. Cannot grant final approval. |
| **`RESIDENT`** | Household Unit | Manage household members, issue guest temporary passes, join group demand pools, book services. |
| **`SERVICE_PROVIDER`** | Multi-Community | Submit quotations for group demand pools, manage accepted bookings, manage solo staff retainers. |

### 2. Service Catalog & Demand Model

| Service Name | Category | Model Type | Pricing & Structure |
|---|---|---|---|
| **AC Servicing & Deep Wash** | Appliance Maintenance | Groupable Demand Pool | ₹899.00 / Unit (Unlocks 20% group discount) |
| **Herbal Pest Control** | Cleaning & Sanitation | Groupable Demand Pool | ₹1,299.00 / Flat (Demand aggregation across households) |
| **Home Cook (Sunita Devi)** | Individual Solo Staff | Direct Retainer | ₹8,000.00 / Month (0% platform fee, gate OTP passes) |
| **Housekeeper Maid (Lakshmi Bai)** | Individual Solo Staff | Direct Retainer | ₹5,000.00 / Month (0% platform fee, police verified badge) |

---

## 📦 Prerequisites

### Operating System
- **Linux (Ubuntu 24.04 LTS / Debian / Fedora / Arch)**, **macOS**, or **Windows (WSL2)**

### Software Requirements
- **Java 21 LTS** (`openjdk version 21.0.12` or higher)
- **Apache Maven 3.8.7** or higher
- **Node.js 20** & **npm 10** or higher
- **Python 3.10+** (with Tkinter for Desktop GUI Visualizer)

---

## 🛠️ Installation & Setup

### Step 1: Clone or Navigate to the Workspace

```bash
cd /home/saikiran/Documents/communityconnect
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Compile Spring Boot Backend

```bash
cd backend
mvn clean compile
cd ..
```

---

## 🚀 Running the Project

### Step 1: Run the React Frontend

```bash
cd /home/saikiran/Documents/communityconnect
npm run dev
```
> Access the React web interface at **`http://localhost:3000`**.

---

### Step 2: Run the Spring Boot Backend Server

In a new terminal window:

```bash
cd /home/saikiran/Documents/communityconnect/backend
mvn spring-boot:run
```
> Starts the REST API server at **`http://localhost:8080`**. Flyway automatically migrates database schemas on boot.

---

### Step 3: Run Automated Integration Tests

To execute the 5 PostgreSQL / JUnit 5 integration scenarios:

```bash
cd /home/saikiran/Documents/communityconnect/backend
mvn test
```
> **Output**: `Tests run: 5, Failures: 0, Errors: 0` (`BUILD SUCCESS`).

---

## 💻 Desktop GUI & Terminal Visualizers

### 1. Native Laptop Desktop GUI Application Window

Launch a standalone native desktop app window on your laptop screen:

```bash
cd /home/saikiran/Documents/communityconnect
./launch-visualizer.sh
```

- **Features**: System Overview Cards, User Directory Table, Multi-Tenancy Subscription Toggles, Occupancy Ticket Inspector, and an interactive **"🔍 Inspect Database Payload"** raw JSON record popup!

---

### 2. Rich Terminal Console Visualizer

Render ANSI-colored, formatted ASCII tables directly inside your terminal window:

```bash
cd /home/saikiran/Documents/communityconnect
./launch-terminal-console.sh
```

---

## 🌐 REST API Reference & Manual Verification

#### 1. User Login (Receives HttpOnly JWT Cookie)
```bash
curl -i -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul.sharma@gmail.com","password":"password123"}'
```

#### 2. Public Communities Directory
```bash
curl -s http://localhost:8080/api/communities/public
```

#### 3. Service Catalog Query
```bash
curl -s http://localhost:8080/api/services/catalog
```

#### 4. Group Demand Pools Query
```bash
curl -s "http://localhost:8080/api/services/pools?communityId=comm-bhooja"
```

#### 5. Platform Admin Subscription Control
```bash
curl -X PATCH http://localhost:8080/api/communities/comm-saket/subscription \
  -H "Content-Type: application/json" \
  -d '{"status":"SUSPENDED"}'
```

---

## 📂 Project Structure

```
communityconnect/
├── backend/                              # Spring Boot 3.2.3 Backend Project
│   ├── pom.xml                           # Maven Dependencies & Build Setup
│   └── src/
│       ├── main/
│       │   ├── java/com/communityconnect/
│       │   │   ├── CommunityConnectApplication.java
│       │   │   ├── controller/           # REST Controllers
│       │   │   ├── model/                # JPA Domain Entities
│       │   │   ├── repository/           # JPA Repositories
│       │   │   ├── security/             # Spring Security 6.2 & JWT Filters
│       │   │   ├── service/              # Business Logic & Scoping
│       │   │   └── exception/            # Centralized Exception Handlers
│       │   └── resources/
│       │       ├── application.yml       # App & Database Config
│       │       ├── db/migration/         # Flyway Migrations (V1 & V2)
│       │       └── static/admin/         # Web Admin Visualizer Console
│       └── test/java/com/communityconnect/
│           └── CommunityConnectBackendIntegrationTest.java # JUnit 5 Tests
├── src/                                  # React Frontend Source Code
│   ├── api/                              # Frontend REST Service Layer
│   ├── components/                       # Consoles, Modals & Visual Views
│   └── data/initialData.js               # Multi-Community Seed Models
├── backend_gui.py                        # Native Python Tkinter Desktop App
├── launch-visualizer.sh                  # Desktop GUI Launcher Script
├── launch-terminal-console.sh            # Terminal Visualizer Launcher Script
├── terminal_visualizer.py                # ANSI ASCII Terminal Render Script
├── vite.config.js                        # Vite Server & API Proxy Setup
├── LICENSE                               # Standard MIT License
├── PROJECT_REPORT.md                     # System Architecture Report
└── README.md                             # Repository Documentation
```

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for full details.
