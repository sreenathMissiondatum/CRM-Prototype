// Mock UUID generator to avoid external dependency
const uuidv4 = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
});

// ==========================================
// DOMAIN MODEL: TABLES (MOCKED)
// ==========================================

// Mock Database State
let fin_statements = [
    {
        ID_finStmnt_rp1: 'STM-2024-001',
        ID_account: 'ACC-12345',
        type_finStmnt_rp1: 'Tax Return',
        status_finStmnt_rp1: 'Draft', // Draft | Mapped | Locked
        importMethod_finStmnt_rp1: 'OCR',
        mappingComplete_finStmnt_rp1: 0.85, // 85% mapped
        startDt_rp1: '2024-01-01',
        endDt_rp1: '2024-12-31',
        rp1_mo: 12,
        rp1_fiscalYr: '2024',
        version_number: 1,
        locked_at: null,
        locked_by: null
    }
];

// Raw Ledger Items (fin_item)
// These are the granular facts.
let fin_items = [
    // Revenue
    { ID_finItem: 'itm-001', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Gross Receipts', Line_Amount: 1250000, Statement_Section: 'IS', Category_Type: 'Revenue', Master_Category: 'Revenue', Mapping_Status: 'Auto', Is_Non_Cash: false, Is_Interest: false },

    // COGS
    { ID_finItem: 'itm-002', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Cost of Goods Sold', Line_Amount: 410000, Statement_Section: 'IS', Category_Type: 'Expense', Master_Category: 'COGS', Mapping_Status: 'Auto', Is_Non_Cash: false, Is_Interest: false },

    // Operating Expenses
    { ID_finItem: 'itm-003', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Salaries and Wages', Line_Amount: 300000, Statement_Section: 'IS', Category_Type: 'Expense', Master_Category: 'OpEx', Mapping_Status: 'Auto', Is_Non_Cash: false, Is_Interest: false },
    { ID_finItem: 'itm-004', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Rent', Line_Amount: 60000, Statement_Section: 'IS', Category_Type: 'Expense', Master_Category: 'OpEx', Mapping_Status: 'Manual', Is_Non_Cash: false, Is_Interest: false },
    { ID_finItem: 'itm-005', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Depreciation', Line_Amount: 45000, Statement_Section: 'IS', Category_Type: 'Expense', Master_Category: 'OpEx', Mapping_Status: 'Auto', Is_Non_Cash: true, Is_Interest: false },
    { ID_finItem: 'itm-006', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Interest Expense', Line_Amount: 12000, Statement_Section: 'IS', Category_Type: 'Expense', Master_Category: 'Interest', Mapping_Status: 'Auto', Is_Non_Cash: false, Is_Interest: true },
    { ID_finItem: 'itm-007', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Taxes Paid', Line_Amount: 35000, Statement_Section: 'IS', Category_Type: 'Expense', Master_Category: 'Tax', Mapping_Status: 'Auto', Is_Non_Cash: false, Is_Interest: false },

    // Unmapped / Other
    { ID_finItem: 'itm-008', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Misc Suspense', Line_Amount: 5000, Statement_Section: 'IS', Category_Type: 'Expense', Master_Category: null, Mapping_Status: 'Unmapped', Is_Non_Cash: false, Is_Interest: false },

    // Balance Sheet
    { ID_finItem: 'itm-010', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Cash in Bank', Line_Amount: 150000, Statement_Section: 'BS', Category_Type: 'Asset', Master_Category: 'Cash', Mapping_Status: 'Auto' },
    { ID_finItem: 'itm-011', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Accounts Receivable', Line_Amount: 80000, Statement_Section: 'BS', Category_Type: 'Asset', Master_Category: 'AR', Mapping_Status: 'Auto' },
    { ID_finItem: 'itm-012', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Inventory', Line_Amount: 200000, Statement_Section: 'BS', Category_Type: 'Asset', Master_Category: 'Inventory', Mapping_Status: 'Auto' },
    { ID_finItem: 'itm-013', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Equipment (Net)', Line_Amount: 120000, Statement_Section: 'BS', Category_Type: 'Asset', Master_Category: 'FixedAssets', Mapping_Status: 'Auto' },

    { ID_finItem: 'itm-020', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Accounts Payable', Line_Amount: 150000, Statement_Section: 'BS', Category_Type: 'Liability', Master_Category: 'CurrentLiab', Mapping_Status: 'Auto' },
    { ID_finItem: 'itm-021', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'SBA Loan', Line_Amount: 200000, Statement_Section: 'BS', Category_Type: 'Liability', Master_Category: 'LongTermDebt', Mapping_Status: 'Auto' },
    { ID_finItem: 'itm-022', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Owner Equity', Line_Amount: 220000, Statement_Section: 'BS', Category_Type: 'Equity', Master_Category: 'Equity', Mapping_Status: 'Auto' },
];

const MASTER_CATEGORIES = [
    { id: 'Revenue', label: 'Revenue', type: 'IS' },
    { id: 'COGS', label: 'Cost of Goods Sold', type: 'IS' },
    { id: 'OpEx', label: 'Operating Expenses', type: 'IS' },
    { id: 'Interest', label: 'Interest', type: 'IS' },
    { id: 'Depreciation', label: 'Depreciation', type: 'IS' },
    { id: 'Amortization', label: 'Amortization', type: 'IS' },
    { id: 'Tax', label: 'Taxes', type: 'IS' },
    { id: 'OwnerDraw', label: 'Owner Draws', type: 'IS' },
    { id: 'OtherIncome', label: 'Other Income', type: 'IS' },

    { id: 'Cash', label: 'Cash', type: 'BS' },
    { id: 'AR', label: 'Accounts Receivable', type: 'BS' },
    { id: 'Inventory', label: 'Inventory', type: 'BS' },
    { id: 'OtherCurAssets', label: 'Other Current Assets', type: 'BS' },
    { id: 'FixedAssets', label: 'Fixed Assets', type: 'BS' },
    { id: 'NonFixedAssets', label: 'Non-Fixed Assets', type: 'BS' },

    { id: 'CurrentLiab', label: 'Current Liabilities', type: 'BS' },
    { id: 'LongTermDebt', label: 'Long Term Debt', type: 'BS' },
    { id: 'Equity', label: 'Equity', type: 'BS' },
];

// ==========================================
// SERVICE LAYER
// ==========================================

export const FinancialLedgerService = {

    // --- READ ---

    getStatement: (id) => {
        return fin_statements.find(s => s.ID_finStmnt_rp1 === id);
    },

    getStatementItems: (statementId) => {
        return fin_items.filter(i => i.ID_finStmnt_rp1 === statementId);
    },

    getChecklist: (statementId) => {
        const items = fin_items.filter(i => i.ID_finStmnt_rp1 === statementId);
        const total = items.length;
        const mapped = items.filter(i => i.Mapping_Status !== 'Unmapped' && i.Master_Category).length;
        return {
            total,
            mapped,
            percent: total === 0 ? 0 : Math.round((mapped / total) * 100)
        };
    },

    // --- WRITE (Ledger Only) ---

    updateItemMapping: (itemId, changes) => {
        const index = fin_items.findIndex(i => i.ID_finItem === itemId);
        if (index === -1) throw new Error('Item not found');

        const statement = fin_statements.find(s => s.ID_finStmnt_rp1 === fin_items[index].ID_finStmnt_rp1);
        if (statement.status_finStmnt_rp1 === 'Locked') {
            throw new Error('Cannot edit items in a Locked statement');
        }

        fin_items[index] = { ...fin_items[index], ...changes, updated_at: new Date().toISOString() };

        // Update statement completeness
        const checklist = FinancialLedgerService.getChecklist(statement.ID_finStmnt_rp1);
        statement.mappingComplete_finStmnt_rp1 = checklist.percent / 100;

        return fin_items[index];
    },

    // --- MATERIALIZATION PIPELINE ---

    lockStatement: (statementId) => {
        const statement = fin_statements.find(s => s.ID_finStmnt_rp1 === statementId);
        if (!statement) throw new Error('Statement not found');

        // Validation
        const items = fin_items.filter(i => i.ID_finStmnt_rp1 === statementId);
        const unmapped = items.filter(i => !i.Master_Category);
        if (unmapped.length > 0) {
            throw new Error(`Cannot lock: ${unmapped.length} items are unmapped.`);
        }

        // 1. Freeze Statement
        statement.status_finStmnt_rp1 = 'Locked';
        statement.locked_at = new Date().toISOString();
        statement.version_number += 1;

        // 2. Deterministic Materialization
        const finProfile = materializeProfile(statement, items);

        // 3. Emit / Persist (Mocked Console Log)
        console.log('[MATERIALIZATION] Generated finProfile_bus:', finProfile);

        return finProfile;
    }
};

// ==========================================
// MATERIALIZATION LOGIC (Private)
// ==========================================

// Determines F1_rp1 from fin_items
const materializeProfile = (stmt, items) => {

    // -- Aggregators --
    const sum = (cat) => items
        .filter(i => i.Master_Category === cat)
        .reduce((acc, curr) => acc + curr.Line_Amount, 0);

    const sumList = (cats) => items
        .filter(i => cats.includes(i.Master_Category))
        .reduce((acc, curr) => acc + curr.Line_Amount, 0);

    // -- INCOME STATEMENT --
    const revenue = sum('Revenue');
    const cogs = sum('COGS');
    const grossProfit = revenue - cogs;

    const opexRaw = sum('OpEx');
    const interest = sum('Interest');
    const depr = sum('Depreciation');
    const tax = sum('Tax');
    const ownerDraw = sum('OwnerDraw');

    // Total OpEx for display typically excludes Interest/Depr/Tax depending on definition, 
    // but usually "OpEx" category in ledger means SG&A.
    // Let's assume 'OpEx' category covers SG&A.
    const totalOpEx = opexRaw;

    // NOI / EBITDA derivations
    // EBITDA = Revenue - COGS - OpEx (excluding interest/tax/depr) + Addbacks?
    // Simplified: EBITDA = GrossProfit - OpEx
    const ebitda = grossProfit - totalOpEx;

    // Net Income
    const netIncome = ebitda - depr - interest - tax;

    // -- BALANCE SHEET --
    const cash = sum('Cash');
    const ar = sum('AR');
    const inventory = sum('Inventory');
    const otherCur = sum('OtherCurAssets');
    const assetsCur = cash + ar + inventory + otherCur;

    const assetsFixed = sum('FixedAssets');
    const assetsNonFixed = sum('NonFixedAssets');
    const assetsTot = assetsCur + assetsFixed + assetsNonFixed;

    const liabCur = sum('CurrentLiab'); // Includes AP, CPLTD
    const liabLong = sum('LongTermDebt');
    const liabTot = liabCur + liabLong;

    const equity = sum('Equity'); // PLUS Net Income for period? 
    // Usually Equity in ledger is opening equity + contributions. 
    // Retained Earnings calculation is complex; assuming 'Equity' category includes RE roll-forward for MVP.
    const equityTot = assetsTot - liabTot; // Balance Sheet Plug for MVP correctness

    // -- RATIOS --
    const calcRatio = (n, d) => d === 0 ? 0 : n / d;
    const calcPct = (n, d) => d === 0 ? 0 : (n / d);

    // Profile Construction
    return {
        meta: {
            Account_ID: stmt.ID_account,
            ID_finStmnt_rp1: stmt.ID_finStmnt_rp1,
            rp1_fiscalYr: stmt.rp1_fiscalYr,
            source_version: stmt.version_number,
            materialized_at: new Date().toISOString()
        },
        income: {
            revenue_rp1: fmt(revenue),
            COGS_rp1: fmt(cogs),
            margGros_rp1: fmt(grossProfit),
            opEx_rp1: fmt(totalOpEx),
            opIncNet_rp1: fmt(ebitda - 0), // Assuming NOI ~ EBITDA for simplicty or adjust
            EBITDA_rp1: fmt(ebitda),
            deprAmort_rp1: fmt(depr),
            interest_rp1: fmt(interest),
            EBT_rp1: fmt(ebitda - depr - interest),
            tax_rp1: fmt(tax),
            ownerDraw_01_rp1: fmt(ownerDraw),
            margNet_rp1: fmt(netIncome)
        },
        balanceSheet: {
            cash_rp1: fmt(cash),
            ar_rp1: fmt(ar),
            inv_rp1: fmt(inventory),
            caOth_rp1: fmt(otherCur),
            assetsCur_rp1: fmt(assetsCur),
            assetsFix_rp1: fmt(assetsFixed),
            assetsNFix_rp1: fmt(assetsNonFixed),
            assetsTot_rp1: fmt(assetsTot),
            liabtsCur_rp1: fmt(liabCur),
            liabtsTot_rp1: fmt(liabTot),
            equityTot_rp1: fmt(equityTot)
        },
        profitability: {
            margGros_prcnt_rp1: pct(grossProfit, revenue),
            margNet_prcnt_rp1: pct(netIncome, revenue),
            RevOA_rp1: x(revenue, assetsTot),
            ROA_rp1: pct(netIncome, assetsTot),
            RevOE_rp1: x(revenue, equityTot),
            ROE_rp1: pct(netIncome, equityTot),
            opExOA_rp1: pct(totalOpEx, assetsTot),
            opExOE_rp1: pct(totalOpEx, equityTot)
        },
        // ... (Other profiles omitted for brevity but follow same pattern)
    };
};

// Helpers
const fmt = (n) => `$${n.toLocaleString()}`;
const pct = (n, d) => d === 0 ? '0.0%' : `${((n / d) * 100).toFixed(1)}%`;
const x = (n, d) => d === 0 ? '0.00x' : `${(n / d).toFixed(2)}x`;

export const CATEGORY_OPTIONS = MASTER_CATEGORIES;
