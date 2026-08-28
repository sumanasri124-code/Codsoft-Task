package com.secureline.atm;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ThreadLocalRandom;

/** Coordinates account creation, authentication, and all ATM operations. */
public final class ATM {
    private final Map<String, BankAccount> accounts = new ConcurrentHashMap<>();
    private final Map<String, BankAccount> activeSessions = new ConcurrentHashMap<>();

    public ATM() {
        register("demo_user", "2468", 25_000);
    }

    public synchronized AuthResult register(String username, String pin, double initialDeposit) {
        validateUsername(username);
        validatePin(pin);
        if (!Double.isFinite(initialDeposit) || initialDeposit < 0) {
            throw new IllegalArgumentException("Initial deposit cannot be negative.");
        }
        String key = username.toLowerCase();
        if (accounts.containsKey(key)) {
            throw new IllegalArgumentException("That username is already registered.");
        }
        String accountId = UUID.randomUUID().toString();
        String accountNumber = generateAccountNumber();
        BankAccount account = new BankAccount(accountId, username, accountNumber, pin, initialDeposit);
        accounts.put(key, account);
        return signIn(account);
    }

    public synchronized AuthResult login(String username, String pin) {
        BankAccount account = accounts.get(username == null ? "" : username.toLowerCase());
        if (account == null || !account.matchesPin(pin)) {
            throw new SecurityException("Invalid username or PIN.");
        }
        return signIn(account);
    }

    public BankAccount requireAccount(String token) {
        if (token == null || token.isBlank()) {
            throw new SecurityException("Authentication required.");
        }
        BankAccount account = activeSessions.get(token);
        if (account == null) {
            throw new SecurityException("Your session has expired. Please sign in again.");
        }
        return account;
    }

    public void logout(String token) {
        if (token != null) {
            activeSessions.remove(token);
        }
    }

    public Map<String, Object> dashboard(BankAccount account) {
        List<Transaction> transactions = account.getTransactions();
        double deposited = transactions.stream()
                .filter(transaction -> "DEPOSIT".equals(transaction.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
        double withdrawn = transactions.stream()
                .filter(transaction -> "WITHDRAWAL".equals(transaction.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();
        List<Map<String, Object>> recent = new ArrayList<>();
        transactions.stream().limit(4).forEach(transaction -> recent.add(transaction.toMap()));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("account", accountMap(account));
        result.put("totalDeposited", deposited);
        result.put("totalWithdrawn", withdrawn);
        result.put("transactionCount", transactions.size());
        result.put("recentTransactions", recent);
        return result;
    }

    public static Map<String, Object> accountMap(BankAccount account) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", account.getId());
        result.put("username", account.getUsername());
        result.put("accountNumber", account.getAccountNumber());
        result.put("balance", account.checkBalance());
        result.put("createdAt", account.getCreatedAt());
        result.put("lastActivity", account.getLastActivity());
        return result;
    }

    private AuthResult signIn(BankAccount account) {
        String token = UUID.randomUUID().toString();
        activeSessions.put(token, account);
        return new AuthResult(token, account);
    }

    private static void validateUsername(String username) {
        if (username == null || !username.matches("[A-Za-z0-9_]{3,24}")) {
            throw new IllegalArgumentException("Username must be 3–24 letters, numbers, or underscores.");
        }
    }

    private static void validatePin(String pin) {
        if (pin == null || !pin.matches("\\d{4}")) {
            throw new IllegalArgumentException("PIN must be exactly 4 digits.");
        }
    }

    private static String generateAccountNumber() {
        long digits = ThreadLocalRandom.current().nextLong(100_000_000L, 999_999_999L);
        return "SL" + digits;
    }

    public record AuthResult(String token, BankAccount account) {}
}