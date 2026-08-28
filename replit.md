# SecureLine ATM

SecureLine ATM is a polished ATM interface for the CODSOFT Java Development Internship Task 3, with a Java REST backend powering secure account and transaction operations.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the Java API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `./backend/compile.sh` — compile the Java domain model and REST server
- Required env: `PORT` is supplied by the API workflow; the Java server defaults to `8080`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Java 17+ `HttpServer` REST service
- ATM domain: Java OOP (`ATM`, `BankAccount`, `Transaction`)
- Frontend: React + Vite + TypeScript
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `backend/src/main/java/com/secureline/atm/` — Java ATM domain model and dependency-free REST server
- `artifacts/secureline-atm/` — React/Vite frontend
- `lib/api-spec/openapi.yaml` — source of truth for the frontend/backend API contract
- `artifacts/api-server/` — API workflow wrapper that launches the Java backend

## Architecture decisions

- Java owns account creation, authentication, sessions, validation, balance mutations, transaction recording, and PIN changes.
- The web client uses generated API hooks from the OpenAPI contract; it does not contain ATM business rules.
- The Java server uses the JDK HTTP server and an in-memory store so the internship demo has no external runtime dependencies.

## Product

- Registration with an initial deposit and username/PIN authentication
- Deposit, withdrawal, balance enquiry, mini statement, PIN change, and logout
- Indian Rupee formatting and responsive physical-ATM-inspired presentation

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
