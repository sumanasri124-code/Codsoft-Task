package com.secureline.atm;

import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Small JSON helper kept dependency-free so the demo backend can run with the JDK alone. */
public final class Json {
    private Json() {}

    public static Map<String, String> parseObject(String input) {
        Map<String, String> values = new LinkedHashMap<>();
        if (input == null || input.isBlank()) {
            return values;
        }
        int index = skipWhitespace(input, 0);
        if (index >= input.length() || input.charAt(index) != '{') {
            throw new IllegalArgumentException("Request body must be a JSON object.");
        }
        index++;
        while (true) {
            index = skipWhitespace(input, index);
            if (index >= input.length() || input.charAt(index) == '}') {
                return values;
            }
            Parsed key = parseString(input, index);
            index = skipWhitespace(input, key.nextIndex());
            if (index >= input.length() || input.charAt(index) != ':') {
                throw new IllegalArgumentException("Invalid JSON request body.");
            }
            index = skipWhitespace(input, index + 1);
            Parsed value = input.charAt(index) == '"'
                    ? parseString(input, index)
                    : parsePrimitive(input, index);
            values.put(key.value(), value.value());
            index = skipWhitespace(input, value.nextIndex());
            if (index < input.length() && input.charAt(index) == ',') {
                index++;
            } else if (index < input.length() && input.charAt(index) == '}') {
                return values;
            } else {
                throw new IllegalArgumentException("Invalid JSON request body.");
            }
        }
    }

    public static String stringify(Object value) {
        if (value == null) return "null";
        if (value instanceof String string) return quote(string);
        if (value instanceof Number || value instanceof Boolean) return value.toString();
        if (value instanceof Map<?, ?> map) {
            List<String> entries = new ArrayList<>();
            map.forEach((key, entryValue) ->
                    entries.add(quote(String.valueOf(key)) + ":" + stringify(entryValue)));
            return "{" + String.join(",", entries) + "}";
        }
        if (value instanceof Collection<?> collection) {
            List<String> entries = collection.stream().map(Json::stringify).toList();
            return "[" + String.join(",", entries) + "]";
        }
        return quote(value.toString());
    }

    public static Map<String, Object> error(String message) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("error", message);
        return result;
    }

    private static String quote(String value) {
        return "\"" + value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t") + "\"";
    }

    private static int skipWhitespace(String input, int index) {
        while (index < input.length() && Character.isWhitespace(input.charAt(index))) index++;
        return index;
    }

    private static Parsed parseString(String input, int index) {
        if (index >= input.length() || input.charAt(index) != '"') {
            throw new IllegalArgumentException("Invalid JSON string.");
        }
        StringBuilder value = new StringBuilder();
        index++;
        while (index < input.length()) {
            char current = input.charAt(index++);
            if (current == '"') return new Parsed(value.toString(), index);
            if (current == '\\' && index < input.length()) {
                char escaped = input.charAt(index++);
                value.append(switch (escaped) {
                    case '"', '\\', '/' -> escaped;
                    case 'n' -> '\n';
                    case 'r' -> '\r';
                    case 't' -> '\t';
                    default -> escaped;
                });
            } else {
                value.append(current);
            }
        }
        throw new IllegalArgumentException("Unterminated JSON string.");
    }

    private static Parsed parsePrimitive(String input, int index) {
        int start = index;
        while (index < input.length() && ",}".indexOf(input.charAt(index)) < 0) index++;
        String value = input.substring(start, index).trim();
        if (value.isEmpty()) throw new IllegalArgumentException("Invalid JSON value.");
        return new Parsed(value, index);
    }

    private record Parsed(String value, int nextIndex) {}
}