package com.secureline.atm;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;

/** Dependency-free REST server that exposes the Java ATM domain model to the web UI. */
public final class Main {
    private final ATM atm = new ATM();

    public static void main(String[] args) throws IOException {
        int port = Integer.parseInt(System.getenv().getOrDefault("PORT", "8080"));
        Main application = new Main();
        HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);
        server.createContext("/api", application::handle);
        server.setExecutor(Executors.newFixedThreadPool(12));
        server.start();
        System.out.println("SecureLine ATM Java backend listening on port " + port);
    }

    private void handle(HttpExchange exchange) throws IOException {
        addCors(exchange.getResponseHeaders());
        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            send(exchange, 204, null);
            return;
        }
        String path = exchange.getRequestURI().getPath();
        try {
            if ("GET".equals(exchange.getRequestMethod()) && "/api/healthz".equals(path)) {
                send(exchange, 200, Map.of("status", "ok"));
                return;
            }
            if ("POST".equals(exchange.getRequestMethod()) && "/api/auth/register".equals(path)) {
                Map<String, String> body = Json.parseObject(readBody(exchange));
                ATM.AuthResult auth = atm.register(
                        required(body, "username"),
                        required(body, "pin"),
                        parseNonNegative(body, "initialDeposit")
                );
                send(exchange, 201, authResponse(auth));
                return;
            }
            if ("POST".equals(exchange.getRequestMethod()) && "/api/auth/login".equals(path)) {
                Map<String, String> body = Json.parseObject(readBody(exchange));
                ATM.AuthResult auth = atm.login(required(body, "username"), required(body, "pin"));
                send(exchange, 200, authResponse(auth));
                return;
            }
            if ("POST".equals(exchange.getRequestMethod()) && "/api/auth/logout".equals(path)) {
                atm.logout(token(exchange));
                send(exchange, 204, null);
                return;
            }

            BankAccount account = atm.requireAccount(token(exchange));
            if ("GET".equals(exchange.getRequestMethod()) && "/api/account".equals(path)) {
                send(exchange, 200, ATM.accountMap(account));
            } else if ("GET".equals(exchange.getRequestMethod()) && "/api/dashboard".equals(path)) {
                send(exchange, 200, atm.dashboard(account));
            } else if ("GET".equals(exchange.getRequestMethod()) && "/api/transactions".equals(path)) {
                send(exchange, 200, account.getTransactions().stream().map(Transaction::toMap).toList());
            } else if ("POST".equals(exchange.getRequestMethod()) && "/api/transactions/deposit".equals(path)) {
                Map<String, String> body = Json.parseObject(readBody(exchange));
                Transaction transaction = account.deposit(parsePositive(body, "amount"));
                send(exchange, 200, transactionResult("Deposit completed successfully.", transaction, account));
            } else if ("POST".equals(exchange.getRequestMethod()) && "/api/transactions/withdraw".equals(path)) {
                Map<String, String> body = Json.parseObject(readBody(exchange));
                Transaction transaction = account.withdraw(parsePositive(body, "amount"));
                send(exchange, 200, transactionResult("Withdrawal completed successfully.", transaction, account));
            } else if ("POST".equals(exchange.getRequestMethod()) && "/api/pin/change".equals(path)) {
                Map<String, String> body = Json.parseObject(readBody(exchange));
                account.changePin(required(body, "currentPin"), required(body, "newPin"));
                send(exchange, 200, Map.of("message", "PIN changed successfully."));
            } else {
                send(exchange, 404, Json.error("Endpoint not found."));
            }
        } catch (SecurityException error) {
            send(exchange, 401, Json.error(error.getMessage()));
        } catch (IllegalArgumentException error) {
            send(exchange, 400, Json.error(error.getMessage()));
        } catch (Exception error) {
            send(exchange, 500, Json.error("Something went wrong while processing that request."));
        } finally {
            exchange.close();
        }
    }

    private static Map<String, Object> authResponse(ATM.AuthResult auth) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", auth.token());
        result.put("account", ATM.accountMap(auth.account()));
        return result;
    }

    private static Map<String, Object> transactionResult(
            String message,
            Transaction transaction,
            BankAccount account
    ) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("message", message);
        result.put("transaction", transaction.toMap());
        result.put("account", ATM.accountMap(account));
        return result;
    }

    private static String token(HttpExchange exchange) {
        String authorization = exchange.getRequestHeaders().getFirst("Authorization");
        return authorization != null && authorization.startsWith("Bearer ")
                ? authorization.substring("Bearer ".length()).trim()
                : null;
    }

    private static String required(Map<String, String> body, String field) {
        String value = body.get(field);
        if (value == null || value.isBlank() || "null".equals(value)) {
            throw new IllegalArgumentException(field + " is required.");
        }
        return value;
    }

    private static double parsePositive(Map<String, String> body, String field) {
        double amount = parseNumber(body, field);
        if (amount <= 0) throw new IllegalArgumentException("Enter an amount greater than ₹0.");
        return amount;
    }

    private static double parseNonNegative(Map<String, String> body, String field) {
        double amount = parseNumber(body, field);
        if (amount < 0) throw new IllegalArgumentException("Initial deposit cannot be negative.");
        return amount;
    }

    private static double parseNumber(Map<String, String> body, String field) {
        try {
            return Double.parseDouble(required(body, field));
        } catch (NumberFormatException error) {
            throw new IllegalArgumentException("Enter a valid numeric amount.");
        }
    }

    private static String readBody(HttpExchange exchange) throws IOException {
        try (InputStream input = exchange.getRequestBody()) {
            return new String(input.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private static void addCors(Headers headers) {
        headers.set("Access-Control-Allow-Origin", "*");
        headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
        headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        headers.set("Cache-Control", "no-store");
    }

    private static void send(HttpExchange exchange, int status, Object payload) throws IOException {
        if (status == 204) {
            exchange.sendResponseHeaders(status, -1);
            return;
        }
        byte[] bytes = Json.stringify(payload).getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream output = exchange.getResponseBody()) {
            output.write(bytes);
        }
    }
}