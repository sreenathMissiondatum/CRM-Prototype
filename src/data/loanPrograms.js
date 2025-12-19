export const programs = [
    {
        id: 'LP-001',
        name: 'SBA 7(a) Standard',
        code: 'SBA-7A',
        rate: 'Prime + 2.25%',
        term: 'Up to 10 years',
        description: 'General purpose loan for working capital, equipment, or expansion.',
        match: '95%',
        recommended: true,
        source: 'LMS-FETCHED',
        requiredDocuments: [
            { id: 1, category: 'Identity', name: 'Driver\'s License (All Owners)', description: 'Valid government ID for all 20%+ owners.', source: 'NATIVE' },
            { id: 2, category: 'Financial', name: 'Business Tax Returns (3 Years)', description: 'Federal returns including all schedules.', source: 'LMS-FETCHED' },
            { id: 3, category: 'Financial', name: 'Personal Financial Statement', description: 'SBA Form 413 for each owner.', source: 'LMS-FETCHED' },
            { id: 4, category: 'Business', name: 'Business Plan', description: 'Required for startups or expansion projects.', source: 'NATIVE' }
        ],
        rules: {
            eligibility: 'For-profit businesses operating in the US. Owners must have invested equity.',
            rateDetails: 'Variable rate based on Wall Street Journal Prime. Max spread is 2.75%.',
            termDetails: '10 years for working capital/equipment, 25 years for real estate.',
            underwritingNotes: 'Cash flow must support 1.15x DSCR. Collateral required for loans > $25k.'
        }
    },
    {
        id: 'LP-002',
        name: 'SBA 504 Loan',
        code: 'SBA-504',
        rate: 'Fixed (Market)',
        term: '10, 20, 25 years',
        description: 'Long-term fixed rate financing for major fixed assets like real estate.',
        match: '85%',
        source: 'LMS-FETCHED',
        requiredDocuments: [
            { id: 1, category: 'Financial', name: 'Interim Financial Statements', description: 'Within last 90 days.', source: 'LMS-FETCHED' },
            { id: 2, category: 'Collateral', name: 'Real Estate Purchase Agreement', description: 'Signed letter of intent or contract.', source: 'NATIVE' }
        ],
        rules: {
            eligibility: 'Tangible net worth < $15M. Net income < $5M (2 year avg).',
            rateDetails: 'Fixed rate established at debenture sale.',
            termDetails: '20 or 25 years for real estate, 10 years for equipment.',
            underwritingNotes: 'Job creation requirement: 1 job per $75k lent (exceptions apply).'
        }
    },
    {
        id: 'LP-003',
        name: 'Business Line of Credit',
        code: 'LOC-STD',
        rate: 'Prime + 1.5%',
        term: 'Revolving',
        description: 'Flexible access to funds for short-term working capital needs.',
        match: '90%',
        source: 'NATIVE',
        requiredDocuments: [
            { id: 1, category: 'Financial', name: 'A/R Aging Report', description: 'Detailed aging of accounts receivable.', source: 'NATIVE' },
            { id: 2, category: 'Financial', name: 'Bank Statements (6 months)', description: 'Primary business operating account.', source: 'NATIVE' }
        ],
        rules: {
            eligibility: 'Minimum 2 years in business. Revenue > $250k.',
            rateDetails: 'Variable, adjusted monthly.',
            termDetails: '12 month renewable term.',
            underwritingNotes: 'Advance rate up to 80% on eligible A/R.'
        }
    },
    {
        id: 'LP-004',
        name: 'Equipment Term Loan',
        code: 'EQ-TERM',
        rate: '6.5% Fixed',
        term: '5 years',
        description: 'Secured loan specifically for purchasing business equipment.',
        match: '80%',
        source: 'NATIVE',
        requiredDocuments: [
            { id: 1, category: 'Collateral', name: 'Equipment Invoice / Quote', description: 'Official vendor quote.', source: 'NATIVE' }
        ],
        rules: {
            eligibility: 'Equipment must be essential to operations.',
            rateDetails: 'Fixed for the term of the loan.',
            termDetails: 'Matched to useful life of equipment, max 7 years.',
            underwritingNotes: 'Down payment of 10-20% usually required.'
        }
    }
];
