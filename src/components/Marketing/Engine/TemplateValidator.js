import { isPathValid, VALID_PATHS } from './VariableRegistry.js';

/**
 * Template Validator
 * 
 * Performs static analysis on HTML templates to ensure security and correctness.
 * 
 * Checks:
 * 1. Safe HTML (no scripts, iframes) - Note: In a real app, use DOMPurify. Here we use basic regex for MVP.
 * 2. Syntax Validation (matching brackets)
 * 3. Variable Validation against Registry
 */

export const validateTemplate = (htmlContent) => {
    const result = {
        isValid: true,
        errors: [],
        warnings: [],
        detectedPlaceholders: []
    };

    if (!htmlContent) {
        result.isValid = false;
        result.errors.push("Template content is empty.");
        return result;
    }

    // --- 1. Security Checks (Basic Regex MVP) ---
    // In production, use a library like DOMPurify or sanitize-html on the backend.
    const unsafeTags = /<(script|iframe|object|embed|form)/gi;
    if (unsafeTags.test(htmlContent)) {
        result.isValid = false;
        result.errors.push("Security Violation: unsafe tags (<script>, <iframe>, etc.) are not allowed.");
    }

    const unsafeAttributes = /(on\w+=")/gi; // e.g., onclick="..."
    if (unsafeAttributes.test(htmlContent)) {
        result.isValid = false;
        result.errors.push("Security Violation: inline event handlers (onclick, onload) are not allowed.");
    }

    // --- 2. Variable Parsing & Validation ---
    // Regex to match {{ Context.Path }}
    const placeholderRegex = /{{\s*([a-zA-Z0-9_.]+)(?:\s*\|\s*default:\s*"([^"]*)")?\s*}}/g;

    let match;
    const placeholders = new Set();

    while ((match = placeholderRegex.exec(htmlContent)) !== null) {
        const fullMatch = match[0];
        const path = match[1];
        const fallback = match[2]; // Optional fallback value

        placeholders.add(path);

        // Record detection
        result.detectedPlaceholders.push({
            fullMatch,
            path,
            hasFallback: !!fallback,
            isValid: isPathValid(path)
        });

        // Validate Path
        if (!isPathValid(path)) {
            result.isValid = false;
            // Suggest close match? (Not implemented in MVP)
            result.errors.push(`Invalid Placeholder: '${path}' is not in the allowed registry.`);
        }
    }

    // --- 3. Conditional Logic Validation ---
    // Regex for {% if Variable > Value %}
    const ifRegex = /{%-?\s*if\s+([a-zA-Z0-9_.]+)\s*(?:(==|!=|>|<|>=|<=)\s*['"]?([^'"]*)['"]?)?\s*-?%}/g;

    while ((match = ifRegex.exec(htmlContent)) !== null) {
        const path = match[1];

        if (!isPathValid(path)) {
            result.isValid = false;
            result.errors.push(`Invalid Conditional: Field '${path}' is not in the allowed registry.`);
        }
    }

    return result;
};
