# Full Stack Developer Assessment — User Management

A small admin tool that lets administrators view a list of users, drill into any user, and manage that user's profile and addresses (a 1-to-many relationship).

- **Backend:** Java 17, Spring Boot 3.3
- **Frontend:** React 18, Material UI 6, React Router 6, Vite

The project is organized as two independent apps:

```
Tumacay_MacNeilIvan_AssessmentForFullStackDeveloper_25052026/
├── backend/       Spring Boot Base Service (REST API, in-memory data)
├── frontend/      React + MUI single-page app
└── README.md
```

---

## Prerequisites

- **JDK 17** or newer
- **Maven 3.8+** (or use the Maven wrapper if you prefer to add one)
- **Node.js 18+** and **npm**

---

## Running the backend

```bash
cd backend
mvn spring-boot:run
```

The API starts on `http://localhost:8080`.

Quick smoke test:

```bash
curl http://localhost:8080/api/users
curl http://localhost:8080/api/users/1
```

Sample data is seeded at startup (see `BaseService#seed`): three users, one of whom intentionally has no addresses so the empty state is visible in the UI.

### Endpoints

| Method | Path                                    | Purpose                          |
|--------|-----------------------------------------|----------------------------------|
| GET    | `/api/users`                            | List users                       |
| GET    | `/api/users/{id}`                       | Get user + addresses (aggregate) |
| POST   | `/api/users`                            | Create user                      |
| PUT    | `/api/users/{id}`                       | Update user                      |
| DELETE | `/api/users/{id}`                       | Delete user (cascades addresses) |
| GET    | `/api/users/{id}/addresses`             | List addresses for user          |
| POST   | `/api/users/{id}/addresses`             | Add address to user              |
| PUT    | `/api/users/{id}/addresses/{addrId}`    | Update address                   |
| DELETE | `/api/users/{id}/addresses/{addrId}`    | Delete address                   |

---

## Running the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server starts on `http://localhost:5173` and proxies `/api/*` to the Spring Boot backend, so the React code uses relative URLs and there's no CORS friction in development.

For a production build:

```bash
npm run build
npm run preview
```

---

## Design notes — the "User → Address" flow

A few decisions worth calling out.

### 1. Nested routes mirror the data shape

The URLs read like the relationship: `/api/users/{id}/addresses/{addrId}`. The `userId` always lives in the URL, never in the request body, which prevents a class of bugs where the client could "move" an address between users by accident. On the frontend, the routing mirrors this: `/users` for the list and `/users/:id` for the detail/edit view.

### 2. One aggregate endpoint for the detail page

`GET /api/users/{id}` returns both the user and their addresses in a single payload (`UserWithAddressesResponse`). The detail page only needs one `useEffect` and one loading state — no `Promise.all`, no orchestration. The flat list endpoints are still available for any callers that want them.

### 3. Local state, optimistic updates

State lives in the page component closest to the data (`UserListPage`, `UserDetailPage`). After a successful mutation, the page splices the new/updated/removed item into its own list rather than refetching everything — snappier UI, fewer network calls. The trade-off is that it relies on the API returning the persisted object, which all of the write endpoints do.

The project is small enough that adding Redux / Zustand / React Query would have been more weight than benefit. The API client (`src/api/client.js`) is a thin layer, so swapping to React Query later is a localized change.

### 4. One dialog component per entity type

`UserFormDialog` and `AddressFormDialog` each handle both **create** and **edit** flows — same fields, same validation, the only difference is whether `initial` is passed in. This avoids two near-duplicate forms and keeps the modification flow consistent.

### 5. MUI choices

The UI sticks to standard MUI primitives (`Table`, `Paper`, `Dialog`, `TextField`, `Grid`, `Chip`, `Avatar`) with a light custom theme (`src/theme/theme.js`). The list-to-detail transition is a normal row click — the whole row is a target, with a chevron icon to make the affordance obvious, and a breadcrumb on the detail page so users always know how to get back.

### 6. Backend is intentionally hardcoded

Per the brief, data lives in two `ArrayList`s inside `BaseService` with `AtomicLong` id generators. There's no JPA / H2 / Liquibase — the goal is to show the API contract, not the persistence layer. Swapping to a real database would mean adding `@Entity` annotations to the models and replacing the lists with `JpaRepository` calls; the controller/DTO layer would not change.

---

## Project layout

### Backend

```
backend/src/main/java/com/assessment/usermanagement/
├── UserManagementApplication.java
├── config/CorsConfig.java
├── controller/
│   ├── UserController.java
│   └── AddressController.java
├── dto/
│   ├── UserRequest.java
│   ├── AddressRequest.java
│   └── UserWithAddressesResponse.java
├── exception/NotFoundException.java
├── model/
│   ├── User.java
│   └── Address.java
└── service/BaseService.java
```

### Frontend

```
frontend/src/
├── main.jsx              React entry — wraps the app in BrowserRouter + ThemeProvider
├── App.jsx               Top-level layout & route table
├── api/client.js         Fetch wrapper — all HTTP calls live here
├── theme/theme.js        MUI theme (colors, typography, shape)
├── pages/
│   ├── UserListPage.jsx      Table of users, click-through to detail
│   └── UserDetailPage.jsx    Profile + addresses for one user
└── components/
    ├── UserFormDialog.jsx    Create / edit user (shared form)
    ├── AddressFormDialog.jsx Create / edit address (shared form)
    └── AddressList.jsx       Address cards with edit/delete + confirm
```

---

## Notes on what was skipped (and why)

- **No tests.** The brief asks for a working app and clean structure, not a test suite. The code is structured so tests would slot in cleanly: `BaseService` is a pure POJO, controllers are thin, and the React components accept their data as props.
- **No auth.** "Administrators" is a role label in the brief, not a requirement to implement login.
- **No persistence.** The brief allows hardcoded data; everything resets on backend restart, which is the right default for a take-home.
