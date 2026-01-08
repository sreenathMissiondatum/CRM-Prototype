import { validateTemplate } from './src/components/Marketing/Engine/TemplateValidator.js';
import { renderTemplate } from './src/components/Marketing/Engine/PersonalizationService.js';

console.log("--- Starting Template Engine Tests ---");

// Test Data
const validTemplate = `
    <h1>Hello {{Lead.FirstName}},</h1>
    <p>We noticed your business, {{Lead.Business.LegalName}}, has revenue of {{Lead.Business.AnnualRevenue | default:"unknown" }}.</p>
    {% if Lead.Value > 10000 %}
        <p>You qualify for our premium tier!</p>
    {% endif %}
    <p>Contact us at {{Org.SupportEmail}}.</p>
`;

const invalidTemplate = `
    <h1>Hi {{Lead.FirstName}},</h1>
    <p>Your password is {{Lead.Password}}.</p> <!-- Invalid Field -->
    <script>alert('Stealing cookies');</script> <!-- Unsafe Tag -->
`;

const context = {
    Lead: {
        id: 'lead-123',
        FirstName: 'Sarah',
        Value: 50000,
        Business: {
            LegalName: 'Jenkins Catering',
            AnnualRevenue: 150000
        }
    },
    Org: {
        SupportEmail: 'support@myflow.com'
    }
};

// 1. Validator Tests
console.log("\n1. Testing Validator...");
const validResult = validateTemplate(validTemplate);
console.log("Valid Template Check:", validResult.isValid ? "PASS" : "FAIL");
if (!validResult.isValid) console.log(validResult.errors);

const invalidResult = validateTemplate(invalidTemplate);
console.log("Invalid Template Check:", !invalidResult.isValid ? "PASS" : "FAIL");
if (!invalidResult.isValid) {
    console.log("Caught Errors:", invalidResult.errors);
}


// 2. Personalization Tests
console.log("\n2. Testing Personalization...");
const renderResult = renderTemplate(validTemplate, context);
console.log("Rendered Output:");
console.log(renderResult.renderedHtml.trim());

console.log("\nRender Log:", renderResult.log);


// 3. Conditional Logic Test
console.log("\n3. Testing Conditional Logic...");
const conditionalTemplate = `{% if Lead.Value > 10000 %}High Value{% endif %}`;
const highValContext = { Lead: { Value: 50000 } };
const lowValContext = { Lead: { Value: 500 } };

const resHigh = renderTemplate(conditionalTemplate, highValContext);
const resLow = renderTemplate(conditionalTemplate, lowValContext);

console.log("High Value Render:", resHigh.renderedHtml.includes("High Value") ? "PASS" : "FAIL");
console.log("Low Value Render:", !resLow.renderedHtml.includes("High Value") ? "PASS" : "FAIL");
