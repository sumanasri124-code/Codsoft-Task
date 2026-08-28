package com.secureline.atm;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

/** An immutable record of an operation performed through the ATM. */
public final class Transaction {
    private final String id;
    private final String type;
    private final double amount;
    private final double balanceAfter;
    private final Instant timestamp;
    private final String description;

    public Transaction(String type, double amount, double balanceAfter, String description) {
        this.id = UUID.randomUUID().toString();
        this.type = type;
        this.amount = amount;
        this.balanceAfter = balanceAfter;
        this.timestamp = Instant.now();
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public double getAmount() {
        return amount;
    }

    public Map<String, Object> toMap() {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", id);
        result.put("type", type);
        result.put("amount", amount);
        result.put("balanceAfter", balanceAfter);
        result.put("timestamp", timestamp.toString());
        result.put("description", description);
        return result;
    }
}