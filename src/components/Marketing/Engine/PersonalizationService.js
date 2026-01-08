import { isPathValid } from './VariableRegistry.js';

/**
 * Personalization Service
 * 
 * Handles Just-in-Time (JIT) rendering of templates for specific recipients.
 * Enforces masking and fallbacks.
 */

// Helper to safely access nested properties
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const renderTemplate = (templateHtml, context) => {
    const renderLog = {
        timestamp: new Date().toISOString(),
        recipientId: context?.Lead?.id || 'unknown',
        replacements: 0,
        missingFields: [],
        usedFallbacks: [],
        maskedFields: []
    };

    if (!templateHtml || !context) return { renderedHtml: '', log: renderLog };

    let renderedHtml = templateHtml;

    // --- 1. Handle Conditionals first (Simple MVP implementation) ---
    // Supports: {% if Variable %} content {% endif %}
    // Limitation: Does not support nested ifs or complex logic in this MVP.

    const ifBlockRegex = /{%-?\s*if\s+([a-zA-Z0-9_.]+)\s*(?:(==|!=|>|<|>=|<=)\s*['"]?([^'"]*)['"]?)?\s*-?%}([\s\S]*?){%-?\s*endif\s*-?%}/g;

    renderedHtml = renderedHtml.replace(ifBlockRegex, (match, path, content) => {
        // Security Check
        if (!isPathValid(path)) return ''; // Should have been caught by validator, but fail safe.

        const value = getNestedValue(context, path);

        // Truthy check
        if (value) {
            return content;
        } else {
            return '';
        }
    });


    // --- 2. Handle Variable Substitution ---
    const variableRegex = /{{\s*([a-zA-Z0-9_.]+)(?:\s*\|\s*default:\s*"([^"]*)")?\s*}}/g;

    renderedHtml = renderedHtml.replace(variableRegex, (match, path, defaultValue) => {
        // Security Check: is this path allowed?
        if (!isPathValid(path)) {
            console.warn(`Security Block: Attempted to render unauthorized path '${path}'`);
            return ''; // Return empty string for unauthorized paths
        }

        let value = getNestedValue(context, path);

        renderLog.replacements++;

        // Missing Value Logic
        if (value === undefined || value === null || value === '') {
            if (defaultValue) {
                renderLog.usedFallbacks.push({ path, value: defaultValue });
                return defaultValue;
            } else {
                renderLog.missingFields.push(path);
                return ''; // Return empty string if no fallback
            }
        }

        // PII Masking Logic (MVP Hardcoded)
        if (path.includes('TaxID') || path.includes('SSN')) {
            renderLog.maskedFields.push(path);
            // Show last 4 chars only
            return `***-**-${String(value).slice(-4)}`;
        }

        return value;
    });

    return {
        renderedHtml,
        log: renderLog
    };
};
