package com.secureline.atm;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

/** Encapsulates the balance, PIN, and transaction history for one account. */
public final class BankAccount {
    private final String id;
    private final String username;
    private final String accountNumber;
    private final String createdAt;
    private String pin;
    private double balance;
    private String lastActivity;
    private final LinkedList<Transaction> transactions = new LinkedList<>();

    public BankAccount(
            String id,
            String username,
            String accountNumber,
            String pin,
            double initialDeposit
    ) {
        this.id = id;
        this.username = username;
        this.accountNumber = accountNumber;
        this.pin = pin;
        this.balance = initialDeposit;
        this.createdAt = Instant.now().toString();
        this.lastActivity = createdAt;
        record("REGISTRATION", initialDeposit, "Opening balance");
    }

    public synchronized boolean matchesPin(String candidate) {
        return pin.equals(candidate);
    }

    public synchronized void changePin(String currentPin, String newPin) {
        if (!matchesPin(currentPin)) {
            throw new IllegalArgumentException("Current PIN is incorrect.");
        }
        if (pin.equals(newPin)) {
            throw new IllegalArgumentException("New PIN must be different from the current PIN.");
        }
        pin = newPin;
        touch();
    }

    public synchronized Transaction deposit(double amount) {
        validateAmount(amount);
        balance += amount;
        return record("DEPOSIT", amount, "Cash deposit");
    }

    public synchronized Transaction withdraw(double amount) {
        validateAmount(amount);
        if (amount > balance) {
            throw new IllegalArgumentException("Insufficient balance for this withdrawal.");
        }
        balance -= amount;
        return record("WITHDRAWAL", amount, "Cash withdrawal");
    }

    public synchronized double checkBalance() {
        return balance;
    }

    public synchronized List<Transaction> getTransactions() {
        List<Transaction> copy = new ArrayList<>(transactions);
        Collections.reverse(copy);
        return copy;
    }

    public synchronized String getId() {
        return id;
    }

    public synchronized String getUsername() {
        return username;
    }

    public synchronized String getAccountNumber() {
        return accountNumber;
    }

    public synchronized String getCreatedAt() {
        return createdAt;
    }

    public synchronized String getLastActivity() {
        return lastActivity;
    }

    private Transaction record(String type, double amount, String description) {
        touch();
        Transaction transaction = new Transaction(type, amount, balance, description);
        transactions.add(transaction);
        return transaction;
    }

    private void touch() {
        lastActivity = Instant.now().toString();
    }

    private static void validateAmount(double amount) {
        if (!Double.isFinite(amount) || amount <= 0) {
            throw new IllegalArgumentException("Enter an amount greater than ₹0.");
        }
        if (amount > 10_000_000) {
            throw new IllegalArgumentException("Amount exceeds the per-transaction limit of ₹1,00,00,000.");
        }
    }
}