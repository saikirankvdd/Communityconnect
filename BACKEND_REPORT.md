# ⚙️ CommunityConnect: Backend Guide & Documentation

*Multi-Tenant Spring Boot 3 REST API & Database Management Engine*

Covers everything built in the **CommunityConnect Java 21 + Spring Boot 3.2.3 REST Backend**: architecture, packages, database entities, JWT authentication, RBAC authorization, CRUD operations, API reference, and deployment guide.

---

## 1. What we built in one page

**CommunityConnect Backend** is a multi-tenant enterprise REST API server designed for gated residential communities. It handles data persistence, authentication, role-based access control (RBAC), multi-tenancy isolation, and business logic execution. It lets people:

- **Register and log in**, receiving a secure signed token (JWT).
- **Enforce Single Active Household Rule**: Automatically detects flat occupancy disputes when a new tenant registers an already occupied flat.
- **Isolate Multi-Tenant Society Records**: Ensures resident, visitor, and financial data of Society A are strictly isolated from Society B.
- **Aggregate Group Service Demand**: Groups resident service requests (e.g. Summer AC Servicing across 10 households) to unlock bulk vendor discounts while managing 1-on-1 daily staff retainers (Home Cooks & Maids).
- **Issue & Verify Digital Gate Passes**: Creates timed security passes, verifies QR codes, and logs visitor entries.
- **Provide Admin Analytics**: Returns printable executive summary data for community admins.

Everything is stored in a managed **PostgreSQL 16** database with **Flyway** schema versioning migrations.

**Status**: Backend complete, tested with unit/integration tests, and ready for deployment.

---

## 2. Tech stack and why we chose each piece

| Piece | What it is | Why we use it |
|---|---|---|
| **Java 21 (LTS)** | Modern Java runtime | High performance, virtual threads, stable and enterprise-ready |
| **Spring Boot 3.2.3** | Framework container | Industry standard for Java REST microservices and Web APIs |
| **Spring Web** | REST Endpoint Engine | Receives HTTP REST requests and serializes JSON responses |
| **Spring Data JPA + Hibernate** | ORM Persistence Engine | Object-Relational Mapping to PostgreSQL without writing manual SQL |
| **PostgreSQL 16** | Relational Database | ACIDS compliant relational database engine for multi-tenant data |
| **Flyway 10** | Database Versioning | Manages schema migrations (`V1__init_schema.sql`, `V2__seed_data.sql`) |
| **Spring Security 6.2** | Security Framework | Secures endpoints, manages CORS policies, and enforces RBAC rules |
| **JJWT (jjwt 0.12.5)** | Token Engine | Generates and verifies HMAC-SHA256 JWT tokens for stateless auth |
| **BCrypt** | Password Encoder | One-way hashing algorithm ensuring plain passwords are never stored |
| **Apache Maven** | Build & Dependency Tool | Manages libraries and executes build lifecycle (`mvn spring-boot:run`) |

---

## 3. The big picture: how a request travels

Every request from React or `curl` goes through the Spring layered pipeline:

```
React App / HTTP Client
       │
       ▼  (HTTP Request + JSON + Bearer JWT Token)
┌──────────────────────────────────────────────────────────┐
│ 1. CORS Check       : Is frontend allowed to call backend?│
│ 2. JwtAuthFilter    : Decodes JWT header & verifies claims│
│ 3. Security Rules   : Enforces role permissions (RBAC)   │
└─────────────────────────────┬────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────┐
│ Controller Layer    : Validates input DTOs & maps routes │
├──────────────────────────────────────────────────────────┤
│ Service Layer       : Enforces multi-tenancy & business  │
│                       rules (Single household rule)      │
├──────────────────────────────────────────────────────────┤
│ Repository Layer    : Executes JPA queries (Spring Data) │
├──────────────────────────────────────────────────────────┤
│ PostgreSQL DB       : Persists records to Flyway tables  │
└──────────────────────────────────────────────────────────┘
```

---

## 4. Project structure

```
communityconnect-backend/
├── pom.xml                               # Dependencies (Spring Boot, Security, JPA, PostgreSQL)
├── BACKEND_REPORT.md                     # Technical Architecture & Engineering Report
├── README.md                             # Complete Backend Guide & Documentation
└── src/
    ├── main/
    │   ├── resources/
    │   │   ├── application.properties    # Safe configuration settings (goes to GitHub)
    │   │   ├── application-local.properties # Local secrets DB URL & JWT secret (.gitignored)
    │   │   └── db/migration/             # Flyway SQL Migrations
    │   │       ├── V1__init_schema.sql   # Database tables creation
    │   │       └── V2__seed_data.sql     # Seed communities & initial admin users
    │   └── java/com/communityconnect/
    │       ├── CommunityConnectApplication.java # Spring Boot Application Main Entry
    │       ├── config/                   # WebConfig & CORS settings
    │       ├── security/                 # Security Filter Chain & Token Engine
    │       │   ├── SecurityConfig.java   # HTTP Security, CORS & RBAC route rules
    │       │   ├── JwtTokenProvider.java # Token creation & validation helper
    │       │   └── JwtAuthenticationFilter.java # Per-request Bearer token filter
    │       ├── model/                    # JPA Entities
    │       │   ├── User.java             # User entity with SystemRole enum
    │       │   ├── Community.java        # Gated society tenant configuration
    │       │   ├── Household.java        # Occupancy model (1 active flat rule)
    │       │   ├── OccupancyConflict.java # Flat dispute dispute entity
    │       │   └── GroupDemandPool.java  # Vendor demand aggregation model
    │       ├── repository/               # Spring Data JPA Repositories
    │       │   ├── UserRepository.java
    │       │   ├── CommunityRepository.java
    │       │   ├── HouseholdRepository.java
    │       │   ├── OccupancyConflictRepository.java
    │       │   └── GroupDemandPoolRepository.java
    │       ├── service/                  # Business Logic Services
    │       │   ├── AuthService.java      # Hashing & JWT generation logic
    │       │   ├── CommunityService.java  # Multi-tenant society administration
    │       │   ├── OccupancyService.java  # Flat verification & conflict resolution
    │       │   └── ServicePoolService.java # Group buying & vendor retainers
    │       ├── controller/               # REST Controllers
    │       │   ├── AuthController.java   # /api/auth endpoints
    │       │   ├── CommunityController.java # /api/communities endpoints
    │       │   ├── OccupancyController.java # /api/occupancy endpoints
    │       │   └── ServicePoolController.java # /api/services endpoints
    │       └── exception/                # Exception Handlers
    │           ├── GlobalExceptionHandler.java # Converts exceptions to clean JSON
    │           └── OccupancyConflictException.java # Custom domain exception
```

---

## 5. The data model (database tables)

Key: `A -< B` means one A has many B.

```
Community -< Users -< Households -< OccupancyConflicts
                       │
                       └── ServicePools -< ServiceProviderBids
```

### Table Schema Summary:

| Table | Columns | Purpose |
|---|---|---|
| **`communities`** | `id`, `name`, `code`, `address`, `subscription_status` | Multi-tenant society registry |
| **`users`** | `id`, `name`, `email`, `password_hash`, `role`, `community_id` | System user accounts with RBAC roles |
| **`households`** | `id`, `flat_number`, `community_id`, `resident_id`, `status` | Active resident unit tracking |
| **`occupancy_conflicts`** | `id`, `flat_number`, `community_id`, `claimant_id`, `status` | Disputed flat registration records |
| **`group_demand_pools`** | `id`, `service_name`, `community_id`, `min_flats`, `joined_count` | Bulk vendor discount pools |

---

## 6. The concepts we used, in plain English

- **REST API**: Standardized HTTP endpoints returning structured JSON.
- **Layers (Controller, Service, Repository, Model)**: Controllers handle HTTP, Services enforce business logic, Repositories handle database queries, and Models mirror tables.
- **Spring Data JPA & Flyway**: Automatic database mapping and version-controlled SQL migrations.
- **BCrypt Password Hashing**: Passwords are standardly hashed with one-way salt before storing.
- **Stateless JWT Authentication**: Server verifies token signatures via `JwtAuthenticationFilter` on every request.
- **Multi-Tenant Scope Enforcer**: `community_id` is validated on all operations to prevent data leaks between communities.

---

## 7. Flow walkthroughs (CRUD Operations & Workflows)

### 7.1 Register, Login, and Bearer Token Flow
```
Client                      Server (Spring Boot)                 Database (PostgreSQL)
  │                                │                                      │
  ├── POST /api/auth/login ───────>│ 1. Find user by email ──────────────>│
  │   {email, password}            │<── User details & password hash ─────┤
  │                                │ 2. BCrypt: Matches password?        │
  │                                │ 3. JwtTokenProvider signs JWT        │
  │<── {token, role, communityId}──┤                                      │
  │                                │                                      │
  ├── GET /api/occupancy/conflicts │                                      │
  │   Header: Bearer <token> ─────>│ 1. JwtAuthFilter validates signature  │
  │                                │ 2. Service checks community scope    │
  │                                │ 3. Repository fetches conflicts ────>│
  │<── JSON List ──────────────────┼<── Conflict Records ─────────────────┤
```

### 7.2 Conflict Resolution CRUD Operations
- **CREATE**: When resident submits flat registration -> System checks `households` table. If active household exists -> Creates `OccupancyConflict` (Status: `PENDING`).
- **READ**: Admin requests `GET /api/occupancy/conflicts` -> Returns pending disputes.
- **UPDATE**: Admin clicks approve -> PATCH `/api/occupancy/conflicts/{id}` -> Deactivates old resident, marks new flat active, and updates status to `RESOLVED`.

---

## 8. API reference

All endpoints except public auth routes require header `Authorization: Bearer <token>`.

| Method and URL | What it does | Access Role | Success |
|---|---|---|---|
| **POST** `/api/auth/login` | Authenticates user & returns JWT token | Public | `200 OK` |
| **POST** `/api/auth/register` | Registers new resident user account | Public | `201 Created` |
| **GET** `/api/communities/public` | Returns directory of active societies | Public | `200 OK` |
| **GET** `/api/occupancy/conflicts` | Returns flat occupancy disputes | Admin | `200 OK` |
| **PATCH** `/api/occupancy/conflicts/{id}` | Resolves occupancy conflict | Admin | `200 OK` |
| **GET** `/api/services/pools` | Returns active bulk service pools | Resident / Vendor | `200 OK` |
| **POST** `/api/services/pools/join` | Joins a group servicing pool | Resident | `200 OK` |

---

## 9. Who can do what, and what the status codes mean

### HTTP Status Codes:
- `200 OK` / `201 Created`: Operation succeeded.
- `400 Bad Request`: Invalid payload or missing parameters.
- `401 Unauthorized`: Missing or invalid JWT bearer token.
- `403 Forbidden`: Insufficient role permissions (e.g., Resident attempting Admin operation).
- `404 Not Found`: Resource ID or endpoint does not exist.
- `409 Conflict`: Flat occupied or user email already registered.
- `500 Internal Error`: Backend execution failure (check server logs).

---

## 10. Configuration files explained

- `application.properties`: Standard application settings checked into GitHub repository.
- `application-local.properties`: Contains secret DB passwords, connection strings, and `jwt.secret` key (`.gitignored`).

---

## 11. Cheat sheet: run, test, save

### Run Backend Server:
```bash
cd /home/saikiran/Documents/communityconnect-backend
mvn spring-boot:run
```
*(Server starts on `http://localhost:8080`)*

### Run Integration Tests:
```bash
mvn test
```

### Build Executable Package:
```bash
mvn clean package -DskipTests
```

---

## 12. When something goes wrong

| Symptom | Likely cause | Fix |
|---|---|---|
| **Port 8080 already in use** | Old Spring Boot process running | Run `lsof -i :8080` and `kill -9 <PID>` |
| **401 Unauthorized in Postman** | Missing Bearer prefix | Ensure Header is `Authorization: Bearer <token>` |
| **403 Forbidden error** | Logged in user role insufficient | Re-login with appropriate admin or resident account |
| **Database Connection Refused** | PostgreSQL service stopped | Verify PostgreSQL service status or connection credentials |

---

## 13. Reminders and what comes next

1. **GitHub Setup**: Upload codebase to dedicated backend repository.
2. **Environment Variables**: Configure DB URL, DB Username, DB Password, and `JWT_SECRET` as environment variables for deployment.
3. **Deployment**: Deploy Docker container or Maven build to Render / Railway / AWS.
