/**
 * FinancialDataEngine.js
 * 
 * AUTHORITATIVE DATA ENGINE
 * Implements F1 (Business) and F2 (Personal) Data Contracts.
 * 
 * RULES:
 * - FinItems are SOURCE OF TRUTH.
 * - All metrics (7000-series) are derived from FinItems.
 * - Strict adherence to formulas defined in Data Catalog.
 */

// =========================================================
// 1. RAW DATA MOCK (FinItems)
// =========================================================

export const generateRawFinItems = () => {
    return [
        // --- INCOME STATEMENT ITEMS ---
        { id: 1, name: "Gross Revenue – Sales", amount: 1250000, type: "incS", incSMastCtg: "revenue", mappingStatus: "normalized", sourceRef: "Part I, Line 1a" },
        { id: 2, name: "Service Revenue", amount: 350000, type: "incS", incSMastCtg: "revenue", mappingStatus: "normalized", sourceRef: "Part I, Line 1c" },
        { id: 3, name: "Returns & Allowances", amount: -45000, type: "incS", incSMastCtg: "revenue", mappingStatus: "normalized", sourceRef: "Part I, Line 1b" },

        { id: 4, name: "Inventory Beginning", amount: 120000, type: "incS", incSMastCtg: "COGS", mappingStatus: "normalized", sourceRef: "Part I, Line 2" },
        { id: 5, name: "Materials", amount: 450000, type: "incS", incSMastCtg: "COGS", mappingStatus: "normalized", sourceRef: "Part I, Line 2" },
        { id: 6, name: "Labor (Direct)", amount: 180000, type: "incS", incSMastCtg: "COGS", mappingStatus: "normalized", sourceRef: "Part I, Line 2" },

        { id: 7, name: "Advertising", amount: 12500, type: "incS", incSMastCtg: "opEx", mappingStatus: "review", sourceRef: "Part III, Line 19" },
        { id: 8, name: "Salaries & Wages (Staff)", amount: 145000, type: "incS", incSMastCtg: "opEx", mappingStatus: "normalized", sourceRef: "Part III, Line 7" },
        { id: 9, name: "Rent", amount: 48000, type: "incS", incSMastCtg: "opEx", mappingStatus: "normalized", sourceRef: "Part III, Line 11" },
        { id: 10, name: "Repairs", amount: 8200, type: "incS", incSMastCtg: "opEx", mappingStatus: "auto", sourceRef: "Part III, Line 9" },

        { id: 11, name: "Depreciation", amount: 22000, type: "incS", incSMastCtg: "opEx", mappingStatus: "normalized", Is_Non_Cash: true, sourceRef: "Part III, Line 14" },

        { id: 12, name: "Interest Expense", amount: 15000, type: "incS", incSMastCtg: "opEx", mappingStatus: "normalized", Is_Interest: true, sourceRef: "Part III, Line 13" },

        { id: 13, name: "Owner Salary (Addback)", amount: 85000, type: "incS", incSMastCtg: "ownerDraw", mappingStatus: "manual", Is_Owner_Comp: true, sourceRef: "Part III, Line 7" },

        { id: 14, name: "Taxes Paid", amount: 12000, type: "incS", incSMastCtg: "tax", mappingStatus: "normalized", sourceRef: "Part III, Line 12" },

        // --- BALANCE SHEET ITEMS ---
        { id: 101, name: "Cash in Bank", amount: 85000, type: "balS", balSMastCtg: "cash", mappingStatus: "normalized" },
        { id: 102, name: "Accounts Receivable", amount: 120000, type: "balS", balSMastCtg: "ar", mappingStatus: "normalized" },
        { id: 103, name: "Inventory", amount: 140000, type: "balS", balSMastCtg: "inv", mappingStatus: "normalized" },
        { id: 104, name: "Prepaid Expenses", amount: 15000, type: "balS", balSMastCtg: "caOth", mappingStatus: "normalized" },

        { id: 105, name: "Equipment", amount: 450000, type: "balS", balSMastCtg: "FA", mappingStatus: "normalized" },
        { id: 106, name: "Accumulated Depreciation", amount: -120000, type: "balS", balSMastCtg: "FA", mappingStatus: "normalized" },

        { id: 107, name: "Intangible Assets", amount: 10000, type: "balS", balSMastCtg: "NFA", mappingStatus: "normalized" },

        { id: 108, name: "Accounts Payable", amount: 45000, type: "balS", balSMastCtg: "CL", mappingStatus: "normalized" },
        { id: 109, name: "Credit Cards", amount: 12000, type: "balS", balSMastCtg: "CC", mappingStatus: "normalized" },
        { id: 110, name: "Line of Credit", amount: 35000, type: "balS", balSMastCtg: "CL", mappingStatus: "normalized" },

        { id: 111, name: "SBA Loan", amount: 250000, type: "balS", balSMastCtg: "LTD", mappingStatus: "normalized" },

        { id: 112, name: "Owner Equity", amount: 358000, type: "balS", balSMastCtg: "EQ", mappingStatus: "normalized" } // Balancing plug
    ];
};

// =========================================================
// 2. F1 Business Profile Engine (7021 - 7027)
// =========================================================

export const deriveBusinessProfile = (finItems, globalContext = {}) => {
    // Helper: Sum by filter
    const sum = (filterFn) => finItems.filter(filterFn).reduce((acc, i) => acc + i.amount, 0);

    // --- SECTION 2: INCOME STATEMENT (7021) ---

    // 702101.1 revenue_rp1
    const revenue_rp1 = sum(i => i.incSMastCtg === 'revenue');

    // 702102.1 COGS_rp1
    const COGS_rp1 = sum(i => i.incSMastCtg === 'COGS');

    // 702103.1 margGros_rp1
    const margGros_rp1 = revenue_rp1 - COGS_rp1;

    // 702104.1 opEx_rp1
    const opEx_rp1 = sum(i => i.incSMastCtg === 'opEx');

    // 702106.1 deprAmort_rp1 (Moved up for numerical order where possible)
    const deprAmort_rp1 = sum(i => i.Is_Non_Cash === true);

    // 702107.1 opIncNet_rp1
    const opIncNet_rp1 = margGros_rp1 - opEx_rp1;

    // 702108.1 interest_rp1
    const interest_rp1 = sum(i => i.Is_Interest === true);

    // 702105.1 EBITDA_rp1 (Must follow 702107 per strict formula dependency)
    const EBITDA_rp1 = opIncNet_rp1 + deprAmort_rp1;

    // 702109.1 EBT_rp1
    const EBT_rp1 = opIncNet_rp1 - interest_rp1;

    // 702110.1 tax_rp1
    const tax_rp1 = sum(i => i.incSMastCtg === 'tax');

    // 702111.1 ownerDraw_01_rp1
    const ownerDraw_01_rp1 = sum(i => i.incSMastCtg === 'ownerDraw');

    // 702112.1 margNet_rp1
    const margNet_rp1 = EBT_rp1 - tax_rp1 - ownerDraw_01_rp1;

    // --- SECTION 3: BALANCE SHEET (7022) ---
    const cash_rp1 = sum(i => i.balSMastCtg === 'cash'); // 702201.1
    const ar_rp1 = sum(i => i.balSMastCtg === 'ar'); // 702202.1
    const inv_rp1 = sum(i => i.balSMastCtg === 'inv'); // 702203.1
    const caOth_rp1 = sum(i => i.balSMastCtg === 'caOth'); // 702204.1

    // 702205.1 assetsCur_rp1 (Total Current Assets)
    // Formula: SUM balSMastCtg = 'CA'. Implies aggregation of all CA subtypes.
    const assetsCur_rp1 = sum(i => ['CA', 'cash', 'ar', 'inv', 'caOth'].includes(i.balSMastCtg));

    const assetsFix_rp1 = sum(i => i.balSMastCtg === 'FA'); // 702206.1
    const assetsNFix_rp1 = sum(i => i.balSMastCtg === 'NFA'); // 702207.1
    const assetsTot_rp1 = assetsCur_rp1 + assetsFix_rp1 + assetsNFix_rp1; // 702208.1

    // Liabilities
    // 702210.1 liabtsCur_rp1 (Total Current Liabilities)
    // Formula: SUM balSMastCtg = 'CL'. Implies aggregation of all CL subtypes.
    const liabtsCur_rp1 = sum(i => ['CL', 'CC'].includes(i.balSMastCtg));
    const crCards_rp1 = sum(i => i.balSMastCtg === 'CC'); // 702211.1

    const LTD_rp1 = sum(i => i.balSMastCtg === 'LTD'); // 702212.1
    const liabtsTot_rp1 = liabtsCur_rp1 + LTD_rp1; // 702213.1

    const equityTot_rp1 = sum(i => i.balSMastCtg === 'EQ'); // 702214.1
    const balS_checkYn_rp1 = assetsTot_rp1 === (liabtsTot_rp1 + equityTot_rp1); // 702215.1

    // --- SECTION 4, 5, 6, 7, 8: DERIVED METRICS ---

    // Global Context & Mocks
    const cfTot_hhd_an1_contALL = globalContext.totalHouseholdDiscretionary || 0;
    const netWorth_hhd_sp1_contALL = globalContext.totalHouseholdNetWorth || 1550000; // Mock derived from F2

    // Mapped Internal Vars to F1 Keys
    const dServExistLoans_mo_bus_apl = 12000; // Mock 7023xx
    const dServExistLoans_mo_hhd_apl_contALL = 4500; // Mock 7023xx
    const amtExistLoans_hhd_apl_contALL = 250000; // Mock personal debt total

    // Scenario / Projected Mocks
    const payAmt_mo_fALL = 3500; // Mock new loan payment
    const amtLoan_fALL = 350000; // Mock new loan amount

    // 7023 DSCR
    const EBITDA_an1 = EBITDA_rp1; // Assuming rp1 is annual

    const DSCR_bus_an1 = EBITDA_an1 / (12 * dServExistLoans_mo_bus_apl); // 702301.1

    const DSCR_glob_an1 = (EBITDA_an1 + cfTot_hhd_an1_contALL) /
        (12 * (dServExistLoans_mo_bus_apl + dServExistLoans_mo_hhd_apl_contALL)); // 702302.1

    const DSCR_globProj_an1 = (EBITDA_an1 + cfTot_hhd_an1_contALL) /
        (12 * (dServExistLoans_mo_bus_apl + dServExistLoans_mo_hhd_apl_contALL + payAmt_mo_fALL)); // 702303.1

    // 7024 Profitability
    const margGros_prcnt_rp1 = margGros_rp1 / revenue_rp1;
    const margNet_prcnt_rp1 = margNet_rp1 / revenue_rp1;
    const ROA_rp1 = margNet_rp1 / assetsTot_rp1;
    const ROE_rp1 = margNet_rp1 / equityTot_rp1;

    // 7025 Leverage
    // Business
    const leverage_bus_rp1 = liabtsTot_rp1 / equityTot_rp1;
    const liabtsTot_FA_rp1 = assetsFix_rp1 ? liabtsTot_rp1 / assetsFix_rp1 : 0; // 702502.1
    const liabtsTot_Rev_rp1 = liabtsTot_rp1 / revenue_rp1; // 702503.1

    // Global
    const leverage_glob_rp1 = (liabtsTot_rp1 + amtExistLoans_hhd_apl_contALL) / (equityTot_rp1 + netWorth_hhd_sp1_contALL);
    const liabtsGlob_FA_rp1 = (liabtsTot_rp1 + amtExistLoans_hhd_apl_contALL) / (assetsFix_rp1 + netWorth_hhd_sp1_contALL); // 702512.1
    const liabtsGlob_Rev_rp1 = (liabtsTot_rp1 + amtExistLoans_hhd_apl_contALL) / (revenue_rp1 + cfTot_hhd_an1_contALL); // 702513.1

    // Projected
    const leverage_busProj_rp1 = (liabtsTot_rp1 + amtLoan_fALL) / equityTot_rp1;
    const liabtsProj_FA_rp1 = assetsFix_rp1 ? (liabtsTot_rp1 + amtLoan_fALL) / assetsFix_rp1 : 0; // 702522.1
    const liabtsProj_Rev_rp1 = (liabtsTot_rp1 + amtLoan_fALL) / revenue_rp1; // 702523.1

    // 7026 Liquidity
    // 7026 Liquidity
    const wCap_rp1 = assetsCur_rp1 - liabtsCur_rp1; // 702601.1
    const curentR_rp1 = assetsCur_rp1 / liabtsCur_rp1; // 702602.1
    const quickR_rp1 = (assetsCur_rp1 - inv_rp1) / liabtsCur_rp1; // 702603.1
    const liquidA_rp1 = assetsCur_rp1 / assetsTot_rp1; // 702604.1

    // 7027 Activity (Assuming annualization of Income Statement items for Activity Ratios if rp1 is annual)
    // NOTE: Formulas use _an1 (annualized). Assuming current data IS annual 12mo.
    const revenue_an1 = revenue_rp1;
    const COGS_an1 = COGS_rp1;

    const DIO_an1 = COGS_an1 > 0 ? 365 / (COGS_an1 / inv_rp1) : 0; // 702701.1
    const DSO_an1 = revenue_an1 > 0 ? 365 / (revenue_an1 / ar_rp1) : 0; // 702702.1
    const DPO_an1 = COGS_an1 > 0 ? 365 / (COGS_an1 / liabtsCur_rp1) : 0; // 702703.1
    const CCC_an1 = DIO_an1 + DSO_an1 - DPO_an1; // 702704.1

    return {
        // Income Statement 7021
        revenue_rp1, COGS_rp1, margGros_rp1, opEx_rp1, opIncNet_rp1,
        deprAmort_rp1, interest_rp1, EBITDA_rp1, EBT_rp1, tax_rp1,
        ownerDraw_01_rp1, margNet_rp1,

        // Balance Sheet 7022
        cash_rp1, ar_rp1, inv_rp1, caOth_rp1, assetsCur_rp1,
        assetsFix_rp1, assetsNFix_rp1, assetsTot_rp1,
        liabtsCur_rp1, crCards_rp1, LTD_rp1,
        liabtsTot_rp1, equityTot_rp1, balS_checkYn_rp1,

        // Ratios
        // Ratios
        DSCR_bus_an1, DSCR_glob_an1, DSCR_globProj_an1,
        margGros_prcnt_rp1, margNet_prcnt_rp1, ROA_rp1, ROE_rp1,
        leverage_bus_rp1, liabtsTot_FA_rp1, liabtsTot_Rev_rp1,
        leverage_glob_rp1, liabtsGlob_FA_rp1, liabtsGlob_Rev_rp1,
        leverage_busProj_rp1, liabtsProj_FA_rp1, liabtsProj_Rev_rp1,
        wCap_rp1, curentR_rp1, quickR_rp1, liquidA_rp1,
        DIO_an1, DSO_an1, DPO_an1, CCC_an1,

        // Meta
        items: finItems,
        isBalanced: balS_checkYn_rp1
    };
};

// =========================================================
// 3. F2 Personal Profile Generator (Section 1-6)
// =========================================================

export const generatePersonalProfiles = () => {
    return [
        {
            id: 'p1',
            name: "Alex Morgan",
            role: "Owner (60%)",
            // Section 3: Income Streams
            sources: [
                { type: "W2 Salary", amount: 120000, source: "TechStart Systems (Spouse)", status: "verified", includeInGlobal: true },
                { type: "K-1 Distributions", amount: 85000, source: "Jenkins Catering", status: "verified", includeInGlobal: true },
            ],
            // Section 4: Expenses
            expenses: [
                { type: "Housing", amount: 42000, source: "Credit Report", mode: "verified" },
                { type: "Living", amount: 36000, source: "MIT Index (HH: 4)", mode: "indexed" },
                { type: "Debt Service", amount: 14000, source: "Credit Report", mode: "verified" }
            ],
            // Section 5: Assets
            assets: {
                cash: 45000,
                securities: 100000,
                liquid: 145000, // Derived
                netWorth: 1200000
            }
        },
        {
            id: 'p2',
            name: "Sarah Jenkins",
            role: "Owner (40%)",
            sources: [
                { type: "K-1 Distributions", amount: 65000, source: "Jenkins Catering", status: "verified", includeInGlobal: true }
            ],
            expenses: [
                { type: "Rent", amount: 24000, source: "Stated", mode: "stated" },
                { type: "Living", amount: 22000, source: "MIT Index (HH: 1)", mode: "indexed" }
            ],
            assets: {
                cash: 15000,
                securities: 30000,
                liquid: 45000,
                netWorth: 350000
            }
        }
    ];
};

export const aggregateHousehold = (profiles) => {
    // F2 Section 6: Aggregation
    let totalIncome = 0;
    let totalExpense = 0;
    let totalLiquid = 0;

    profiles.forEach(p => {
        const pIncome = p.sources.filter(s => s.includeInGlobal).reduce((acc, s) => acc + s.amount, 0);
        const pExpense = p.expenses.reduce((acc, e) => acc + e.amount, 0);

        totalIncome += pIncome;
        totalExpense += pExpense;
        totalLiquid += p.assets.liquid;
    });

    const discretionary = totalIncome - totalExpense;

    return {
        totalHouseholdIncome: totalIncome,
        totalHouseholdExpense: totalExpense,
        discretionaryCashflow: discretionary, // cfTot_hhd_an1_contALL
        totalLiquidAssets: totalLiquid,
        ownerCount: profiles.length
    };
};
