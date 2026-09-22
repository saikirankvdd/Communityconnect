# 📊 CommunityConnect - Comprehensive System Architecture & Engineering Report

**Project**: CommunityConnect Full-Stack Platform  
**Target Audience**: Project Reviewers, Stakeholders & Technical Management  
**Stack**: React 19 + Vite | Java 21 + Spring Boot 3.2.3 | PostgreSQL 16 + Flyway 10  

---

## 1. Problem Statement & System Purpose

Gated residential societies and high-rise apartments require structured platforms for:
1. **Multi-Tenant Isolation**: Ensuring private resident directories and financial data of Community A are never accessible by Community B.
2. **Occupancy Verification**: Preventing stale resident data when tenants move out and new residents register for the same flat.
3. **Neighborhood Service Aggregation**: Grouping service demand (e.g., Summer AC Servicing across 10 households) to unlock volume discounts from verified vendors, alongside direct 1-on-1 retainers for individual daily household staff (Home Cook & Maid).

---

## 2. System Architecture & Layer Breakdown

CommunityConnect follows a **Decoupled 3-Tier Layered Architecture**:

```
[ Tier 1: Presentation ]  ----> React 19 + Vite Frontend (Port 3000)
                                      │ (HTTP REST / JSON / HttpOnly JWT Cookie)
                                      ▼
[ Tier 2: Business Logic ] ----> Spring Boot 3.2.3 Backend (Port 8080)
                                 ├── Controller Layer (/api/* endpoints)
                                 ├── Security Layer (Spring Security 6.2 + JWT)
                                 ├── Service Layer (Business Rules & Isolation)
                                 └── Repository Layer (Spring Data JPA)
                                      │
                                      ▼
[ Tier 3: Persistence ]   ----> PostgreSQL 16 Database (Flyway Migrations V1 & V2)
```

---

## 3. Why Spring Boot Requires Layered Java Files (`src/main/java`)

To ensure maintainability, security, and scalability, the backend is partitioned into dedicated Java packages:

| Package | Purpose | Examples | Why It Is Needed |
|---|---|---|---|
| **`model/`** | Entity Classes | `User.java`, `Community.java`, `Household.java`, `OccupancyConflict.java` | Maps PostgreSQL database tables directly into Java object models. |
| **`repository/`** | Data Access | `UserRepository.java`, `CommunityRepository.java` | Executes Spring Data JPA queries against PostgreSQL without writing raw SQL strings. |
| **`service/`** | Business Logic | `AuthService.java`, `OccupancyService.java`, `ServicePoolService.java` | Enforces business rules: multi-tenancy isolation, 1 active household per flat rule, group demand aggregation. |
| **`controller/`** | REST API Endpoints | `AuthController.java`, `CommunityController.java`, `OccupancyController.java` | Receives HTTP REST requests from React frontend / `curl` and returns clean JSON responses. |
| **`security/`** | Security & Auth | `SecurityConfig.java`, `JwtTokenProvider.java`, `JwtAuthenticationFilter.java` | Handles BCrypt password hashing, signed 256-bit JWT creation, and role-based access control (RBAC). |
| **`exception/`** | Error Handling | `GlobalExceptionHandler.java`, `OccupancyConflictException.java` | Intercepts runtime errors and converts them into standardized JSON error responses (`403`, `409`, `404`). |

---

## 4. Business Logic Enforcements

1. **5 Enforced System Roles**: `PLATFORM_ADMIN`, `COMMUNITY_ADMIN`, `RESIDENT`, `SECURITY`, `SERVICE_PROVIDER`.
2. **Single Active Household Rule**: Only 1 active household permitted per flat. Conflict triggers physical security inspection and Community Admin approval.
3. **Multi-Tenancy Isolation**: Backend validates `community_id` on every query, rejecting cross-community access with `403 Forbidden`.
4. **Group Buying & Solo Staff**: Aggregates unit demand for group services (AC Wash) and manages direct 1-on-1 monthly retainers for Home Cooks & Maids.

---

## 5. Complete Terminal Commands Cheatsheet

### A. Run Application Services
```bash
# 1. Start React Frontend (Port 3000)
cd Communityconnect
npm run dev

# 2. Start Spring Boot Backend Server (Port 8080)
cd Communityconnect/backend
mvn spring-boot:run
```

### B. Operations & Visualizer Applications
```bash
# Launch Native Laptop Desktop GUI App Window
cd Communityconnect
./launch-visualizer.sh

# Launch ANSI Terminal Console Visualizer
cd Communityconnect
./launch-terminal-console.sh
```

### C. Automated Integration Tests
```bash
cd Communityconnect/backend
mvn test
```

### D. Manual REST API Verification Commands (`curl`)
```bash
# 1. Authenticate & Login
curl -i -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rahul.sharma@gmail.com","password":"password123"}'

# 2. Fetch Public Communities Directory
curl -s http://localhost:8080/api/communities/public

# 3. Fetch Service Catalog
curl -s http://localhost:8080/api/services/catalog

# 4. Fetch Group Demand Pools
curl -s "http://localhost:8080/api/services/pools?communityId=comm-bhooja"

# 5. Admin Subscription Update
curl -X PATCH http://localhost:8080/api/communities/comm-saket/subscription \
  -H "Content-Type: application/json" \
  -d '{"status":"SUSPENDED"}'
```
