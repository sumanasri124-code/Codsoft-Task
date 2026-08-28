# SecureLine ATM

**CODSOFT Java Development Internship — Task 3: ATM Interface**

SecureLine ATM is a professional ATM-style web interface backed by a Java REST service. The Java backend owns the banking rules and object model, while the React frontend focuses on the terminal experience.

## Features

- New account registration with an initial deposit
- Username and 4-digit PIN authentication
- Deposit and cash withdrawal in Indian Rupees
- Balance enquiry
- Mini statement / transaction history
- PIN change
- Login and logout
- Validation for invalid, zero, negative, and insufficient amounts
- Responsive ATM-inspired banking interface

## Project structure

```text
Task-3-ATM-Interface/
├── frontend/                 # Conceptual submission boundary
├── backend/
│   ├── src/main/java/
│   │   └── com/secureline/atm/
│   │       ├── ATM.java
│   │       ├── BankAccount.java
│   │       ├── Transaction.java
│   │       ├── Main.java
│   │       └── Json.java
│   ├── compile.sh
│   └── run.sh
├── artifacts/secureline-atm/ # React + Vite frontend
└── lib/api-spec/openapi.yaml # Shared REST contract
```

The repository keeps the runnable React artifact under `artifacts/secureline-atm` because it is managed by the workspace, while the `backend/` directory is the GitHub-ready Java source boundary requested for the internship submission.

## Technology

- **Primary technology:** Java 17+
- **Backend:** Java OOP with JDK `HttpServer`
- **Frontend:** HTML, CSS, JavaScript through React + Vite + TypeScript
- **API contract:** OpenAPI with generated React Query client helpers
- **Persistence:** In-memory demo store for a self-contained internship presentation

## Run locally

From the repository root:

```bash
./backend/run.sh
```

In a second terminal, run the frontend through the workspace workflow:

```bash
pnpm --filter @workspace/secureline-atm run dev
```

The backend listens on port `8080` by default and supports the following demo account:

- Username: `demo_user`
- PIN: `2468`

## Java OOP model

- `ATM` coordinates account creation, authentication, sessions, and ATM operations.
- `BankAccount` encapsulates balance, PIN, validation, and transaction history.
- `Transaction` is an immutable record of each account operation.
- `Main` exposes the Java domain model through REST endpoints consumed by the web frontend.

> This is an educational demo. A production banking system would use encrypted credentials, durable storage, rate limiting, audit logging, and additional security controls.