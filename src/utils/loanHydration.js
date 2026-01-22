/**
 * Hydrates a new Loan Application record from a converted Lead and selected Loan Program(s).
 * 
 * @param {Object} lead - The source Lead record.
 * @param {Array} scenarios - The locked funding scenarios from the lead.
 * @param {Array} programs - The full Loan Program objects corresponding to the scenarios.
 * @returns {Object} The initial Loan Application structure.
 */
export const hydrateLoanApplication = (lead, scenarios, programs) => {
    // 1. Create Basic Facilities from Scenarios
    const facilities = scenarios.map((scenario, index) => {
        const program = programs.find(p => p.id === scenario.loan_program_id);

        return {
            id: `fac_${Date.now()}_${index + 1}`,
            status: 'Proposed',

            // Source Metadata
            programSourceId: program?.id || 'UNKNOWN',
            programVersion: '1.0', // Placeholder for future versioning
            programName: program?.name || 'Custom Facility',

            // Core Terms (Hydrated from Scenario)
            requestAmount: parseFloat(scenario.amount) || 0,
            termMonths: parseInt(scenario.term) || (program ? parseInt(program.term) : 12), // Fallback logic

            // Program Defaults (Hydrated from Program Policy)
            interestRate: {
                baseIndex: 'Prime', // Simplified default
                spread: program?.rate ? extractSpread(program.rate) : 0.0,
                display: program?.rate || 'TBD',
                isSystemLocked: true
            },

            // Uses (Hydrated from Scenario)
            useOfFunds: Array.isArray(scenario.useOfFunds) ? scenario.useOfFunds.map(u => ({
                category: u,
                amount: 0, // User to allocate specific amounts later
                description: scenario.useOfFundsDetail || ''
            })) : [],

            // Compliance Limits (Hydrated from Program Rules)
            compliance: {
                maxLTV: program?.rules?.underwritingNotes?.includes('80%') ? 80 : 90, // Simple heuristic for prototype
                minDSCR: 1.15 // Default
            }
        };
    });

    // 2. Aggregate Totals
    const totalRequest = facilities.reduce((sum, f) => sum + f.requestAmount, 0);

    // 3. Construct the Full Loan Object Overlay
    return {
        // ...lead (spread handled by caller usually, but we define specific overrides here)
        stage: 'New', // Reset stage
        amount: `$${totalRequest.toLocaleString()}`, // Formatted display

        // The New "Details" Data Model
        application: {
            isHydrated: true,
            conversionDate: new Date().toISOString(),
            facilities: facilities,

            // Risk Model (Day 0)
            riskRating: {
                overallScore: null,
                status: 'DRAFT',
                dimensions: [
                    // Standard CDFI Dimensions
                    { key: 'character', label: 'Character & Management', score: null, weight: 0.20 },
                    { key: 'capacity', label: 'Capacity (Cash Flow)', score: null, weight: 0.30 },
                    { key: 'capital', label: 'Capital (Equity)', score: null, weight: 0.20 },
                    { key: 'collateral', label: 'Collateral Coverage', score: null, weight: 0.20 },
                    { key: 'conditions', label: 'Market Conditions', score: null, weight: 0.10 }
                ]
            }
        }
    };
};

// Helper: Try to parse "Prime + 2.25%" -> 2.25
const extractSpread = (rateString) => {
    if (!rateString) return 0;
    const match = rateString.match(/\+\s*([\d.]+)%/);
    return match ? parseFloat(match[1]) : 0;
};
