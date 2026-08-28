# SecureLine ATM Java Backend

This directory contains the primary ATM application logic for the CODSOFT Java Development Internship Task 3.

## Run locally

```bash
./run.sh
```

The dependency-free Java 17 REST server listens on port `8080` (or the `PORT` environment variable).

## OOP model

- `ATM.java` coordinates registration, authentication, sessions, and ATM operations.
- `BankAccount.java` encapsulates the balance, PIN, and transaction history.
- `Transaction.java` represents each registration, deposit, and withdrawal.
- `Main.java` exposes the domain operations as the `/api` REST interface.

The in-memory store keeps the internship demo self-contained. A production banking system would replace it with encrypted credentials, durable storage, rate limiting, and audited access controls.