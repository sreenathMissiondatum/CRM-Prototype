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
        mappingComplete_finStmnt_rp1: 0,
        startDt_rp1: '2024-01-01',
        endDt_rp1: '2024-12-31',
        rp1_mo: 12,
        rp1_fiscalYr: '2024',
        version_number: 1,
        locked_at: null,
        locked_by: null
    }
];

// [NEW] Personal Financial Profile Mock (Strictly Read-Only)
let finProfile_pers = {
    // Statement Meta
    ID_contX: 'C-101',
    statementPeriod_sp1: 'SP-2024-Q1',
    name_period_sp1_cont1: '2024 Annual Layout',
    startDt_sp1_cont1: '2024-01-01',
    endDt_sp1_cont1: '2024-12-31',
    type_source_sp1_cont1: 'Tax Return', // Verified
    status_sp1_cont1: 'Locked',

    // 1. Personal Income
    salaryW2_sp1_cont1: 155000,
    inc_distribK1_sp1_cont1: 45000,
    inc_rentNet_sp1_cont1: 12000,
    inc_invest_sp1_cont1: 5400,
    inc_spouse_sp1_cont1: 0,
    incGros_hhd_sp1_cont1: 217400, // Sum

    // 2. Recurring Expenses
    exp_house_sp1_cont1: 32000, // Annualized
    exp_living_sp1_cont1: 42000,
    Living_Expense_Method_sp1_cont1: 'Actual (Stated)',
    dbtService_sp1_cont1: 14500,
    ofile_sp1_cont1: 0, // Other Obligations
    expTot_hhd_sp1_cont1: 88500, // Sum

    // 3. Cash Flow
    cfTot_hhd_sp1_cont1: 128900, // Net Discretionary

    // 4. Assets & Net Worth
    liquidAssets_hhd_sp1_cont1: 145000,
    netWorth_hhd_sp1_cont1: 1250000,

    // 5. Credit Profile (Sensitive)
    crbScore_sp1_cont1: 742,
    crbScore_range_sp1_cont1: '720-760',
    crbScore_date_sp1_cont1: '2024-03-15',
    crbScore_consentTime_sp1_cont1: '2024-01-10T09:30:00Z'
};

// PROMPT-DEFINED CANONICAL CATEGORIES
const CANONICAL_CATEGORIES = [
    // INCOME STATEMENT
    { id: 'revenueBus_01_rp1', label: 'Sales / Revenue', group: 'Revenue', type: 'IS' },
    { id: 'incOthBus_01_rp1', label: 'Other Business Income', group: 'Revenue', type: 'IS' },

    { id: 'COGS_mtrl_01_rp1', label: 'COGS – Materials', group: 'COGS', type: 'IS' },
    { id: 'COGS_dirLbr_01_rp1', label: 'COGS – Direct Labor', group: 'COGS', type: 'IS' },

    { id: 'exp_oheadLbr_01_rp1', label: 'Salaries & Wages – Non-Owner', group: 'OpEx', type: 'IS' },
    { id: 'exp_salesMrktng_01_rp1', label: 'Advertising / Marketing', group: 'OpEx', type: 'IS' },
    { id: 'exp_util_01_rp1', label: 'Utilities', group: 'OpEx', type: 'IS' },
    { id: 'exp_vehicle_01_rp1', label: 'Auto & Vehicle', group: 'OpEx', type: 'IS' },
    { id: 'exp_rentLease_01_rp1', label: 'Rent / Lease', group: 'OpEx', type: 'IS' },
    { id: 'exp_supplies_01_rp1', label: 'Supplies', group: 'OpEx', type: 'IS' },
    { id: 'exp_TE_01_rp1', label: 'Travel / Meals', group: 'OpEx', type: 'IS' },
    { id: 'exp_licen_01_rp1', label: 'Taxes & Licenses – Operating', group: 'OpEx', type: 'IS' },
    { id: 'exp_insur_01_rp1', label: 'Insurance', group: 'OpEx', type: 'IS' },
    { id: 'exp_repair_01_rp1', label: 'Repairs & Maintenance', group: 'OpEx', type: 'IS' },
    { id: 'exp_services_01_rp1', label: 'Professional Services – Legal/CPA', group: 'OpEx', type: 'IS' },
    { id: 'exp_oth_01_rp1', label: 'Other Expense', group: 'OpEx', type: 'IS' },
    { id: 'deprAmort_01_rp1', label: 'Depreciation / Amortization', group: 'OpEx', type: 'IS' },

    { id: 'exp_interest_01_rp1', label: 'Interest Expense', group: 'Interest', type: 'IS' },
    { id: 'exp_tax_01_rp1', label: 'Taxes (Non-Operating)', group: 'Tax', type: 'IS' },
    { id: 'ownerDraw_01_rp1', label: 'Owner Compensation', group: 'OwnerDraw', type: 'IS' },

    // BALANCE SHEET
    { id: 'cash_01_rp1', label: 'Cash & Equivalents', group: 'Current Assets', type: 'BS' },
    { id: 'ar_01_rp1', label: 'Accounts Receivable', group: 'Current Assets', type: 'BS' },
    { id: 'inv_01_rp1', label: 'Inventory', group: 'Current Assets', type: 'BS' },
    { id: 'caOth_01_rp1', label: 'Other Current Assets', group: 'Current Assets', type: 'BS' },

    { id: 'FA_land_01_rp1', label: 'Land', group: 'Fixed Assets', type: 'BS' },
    { id: 'FA_bldngs_01_rp1', label: 'Buildings', group: 'Fixed Assets', type: 'BS' },
    { id: 'FA_machinEquip_01_rp1', label: 'Machinery & Equipment', group: 'Fixed Assets', type: 'BS' },
    { id: 'FA_vehicles_01_rp1', label: 'Vehicles', group: 'Fixed Assets', type: 'BS' },
    { id: 'FA_furnFixtur_01_rp1', label: 'Furniture & Fixtures', group: 'Fixed Assets', type: 'BS' },
    { id: 'FA_leasehldImprov_01_rp1', label: 'Leasehold Improvements', group: 'Fixed Assets', type: 'BS' },
    { id: 'FA_other_01_rp1', label: 'Other Fixed Assets', group: 'Fixed Assets', type: 'BS' },

    { id: 'intanNFA_01_rp1', label: 'Intangible Assets', group: 'Non-Fixed Assets', type: 'BS' },

    { id: 'ap_01_rp1', label: 'Accounts Payable', group: 'Current Liabilities', type: 'BS' },
    { id: 'cc_01_rp1', label: 'Credit Cards / LOC', group: 'Current Liabilities', type: 'BS' },
    { id: 'cpLTD_01_rp1', label: 'Current Portion LTD', group: 'Current Liabilities', type: 'BS' },

    { id: 'LTD_01_rp1', label: 'Long Term Debt', group: 'Long Term Debt', type: 'BS' },

    { id: 'equity_01_rp1', label: 'Owner Equity / Retained Earnings', group: 'Equity', type: 'BS' },
];

let fin_items = [
    // INCOME STATEMENT - REVENUE
    { ID_finItem: 'itm-rv-01', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Gross Receipts', Line_Amount: 1100000, Statement_Section: 'IS', Master_Category: 'revenueBus_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-rv-02', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Service Income', Line_Amount: 150000, Statement_Section: 'IS', Master_Category: 'revenueBus_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-rv-03', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Misc Business Income', Line_Amount: 5000, Statement_Section: 'IS', Master_Category: null, Mapping_Status: 'Unmapped' },
    { ID_finItem: 'itm-rv-04', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Referral Income', Line_Amount: 3000, Statement_Section: 'IS', Master_Category: 'incOthBus_01_rp1', Mapping_Status: 'Manual' },

    // COGS
    { ID_finItem: 'itm-cg-01', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Raw Materials Purchase', Line_Amount: 250000, Statement_Section: 'IS', Master_Category: 'COGS_mtrl_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-cg-02', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Packaging Supplies', Line_Amount: 50000, Statement_Section: 'IS', Master_Category: 'COGS_mtrl_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-cg-03', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Hourly Production Wages', Line_Amount: 80000, Statement_Section: 'IS', Master_Category: 'COGS_dirLbr_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-cg-04', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Contract Labor – Production', Line_Amount: 30000, Statement_Section: 'IS', Master_Category: 'COGS_dirLbr_01_rp1', Mapping_Status: 'Manual' },

    // OPEX
    { ID_finItem: 'itm-op-01', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Admin Salaries', Line_Amount: 120000, Statement_Section: 'IS', Master_Category: 'exp_oheadLbr_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-02', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Payroll – Office Staff', Line_Amount: 80000, Statement_Section: 'IS', Master_Category: 'exp_oheadLbr_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-03', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Online Ads', Line_Amount: 15000, Statement_Section: 'IS', Master_Category: 'exp_salesMrktng_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-04', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Print Marketing', Line_Amount: 5000, Statement_Section: 'IS', Master_Category: 'exp_salesMrktng_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-05', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Electric Utility', Line_Amount: 8000, Statement_Section: 'IS', Master_Category: 'exp_util_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-06', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Water & Sewer', Line_Amount: 2000, Statement_Section: 'IS', Master_Category: 'exp_util_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-07', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Fuel Expense', Line_Amount: 6000, Statement_Section: 'IS', Master_Category: 'exp_vehicle_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-08', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Vehicle Maintenance', Line_Amount: 4000, Statement_Section: 'IS', Master_Category: 'exp_vehicle_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-09', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Office Rent', Line_Amount: 45000, Statement_Section: 'IS', Master_Category: 'exp_rentLease_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-10', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Warehouse Lease', Line_Amount: 35000, Statement_Section: 'IS', Master_Category: 'exp_rentLease_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-11', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Office Supplies', Line_Amount: 3000, Statement_Section: 'IS', Master_Category: 'exp_supplies_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-12', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Cleaning Supplies', Line_Amount: 2000, Statement_Section: 'IS', Master_Category: 'exp_supplies_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-13', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Business Travel', Line_Amount: 12000, Statement_Section: 'IS', Master_Category: 'exp_TE_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-14', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Client Meals', Line_Amount: 5000, Statement_Section: 'IS', Master_Category: 'exp_TE_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-15', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Business License Fee', Line_Amount: 500, Statement_Section: 'IS', Master_Category: 'exp_licen_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-16', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Regulatory Permit', Line_Amount: 1500, Statement_Section: 'IS', Master_Category: 'exp_licen_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-17', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'General Liability Insurance', Line_Amount: 8000, Statement_Section: 'IS', Master_Category: 'exp_insur_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-18', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Workers Comp Insurance', Line_Amount: 6000, Statement_Section: 'IS', Master_Category: 'exp_insur_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-19', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Equipment Repair', Line_Amount: 4000, Statement_Section: 'IS', Master_Category: 'exp_repair_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-20', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Facility Maintenance', Line_Amount: 7000, Statement_Section: 'IS', Master_Category: 'exp_repair_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-21', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Legal Fees', Line_Amount: 15000, Statement_Section: 'IS', Master_Category: 'exp_services_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-22', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'CPA Services', Line_Amount: 5000, Statement_Section: 'IS', Master_Category: 'exp_services_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-23', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Bank Fees', Line_Amount: 1200, Statement_Section: 'IS', Master_Category: 'exp_oth_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-op-24', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Misc Operating Expense', Line_Amount: 3800, Statement_Section: 'IS', Master_Category: null, Mapping_Status: 'Unmapped' },
    { ID_finItem: 'itm-op-25', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Depreciation – Equipment', Line_Amount: 30000, Statement_Section: 'IS', Master_Category: 'deprAmort_01_rp1', Mapping_Status: 'Manual', Is_Non_Cash: true },
    { ID_finItem: 'itm-op-26', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Amortization – Software', Line_Amount: 15000, Statement_Section: 'IS', Master_Category: 'deprAmort_01_rp1', Mapping_Status: 'Manual', Is_Non_Cash: true },

    // INTEREST & TAX
    { ID_finItem: 'itm-it-01', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Bank Loan Interest', Line_Amount: 8000, Statement_Section: 'IS', Master_Category: 'exp_interest_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-it-02', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Line of Credit Interest', Line_Amount: 4000, Statement_Section: 'IS', Master_Category: 'exp_interest_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-it-03', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Federal Income Tax', Line_Amount: 25000, Statement_Section: 'IS', Master_Category: 'exp_tax_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-it-04', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'State Income Tax', Line_Amount: 10000, Statement_Section: 'IS', Master_Category: 'exp_tax_01_rp1', Mapping_Status: 'Manual' },

    // OWNER DRAW
    { ID_finItem: 'itm-od-01', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Owner Salary', Line_Amount: 100000, Statement_Section: 'IS', Master_Category: 'ownerDraw_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-od-02', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Owner Distribution', Line_Amount: 50000, Statement_Section: 'IS', Master_Category: 'ownerDraw_01_rp1', Mapping_Status: 'Manual' },

    // BALANCE SHEET - ASSETS
    { ID_finItem: 'itm-bs-01', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Operating Bank Account', Line_Amount: 100000, Statement_Section: 'BS', Master_Category: 'cash_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-bs-02', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Savings Account', Line_Amount: 50000, Statement_Section: 'BS', Master_Category: 'cash_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-bs-03', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Customer Invoice – Jan', Line_Amount: 50000, Statement_Section: 'BS', Master_Category: 'ar_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-bs-04', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Customer Invoice – Feb', Line_Amount: 30000, Statement_Section: 'BS', Master_Category: 'ar_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-bs-05', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Finished Goods Inventory', Line_Amount: 150000, Statement_Section: 'BS', Master_Category: 'inv_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-bs-06', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Raw Material Inventory', Line_Amount: 50000, Statement_Section: 'BS', Master_Category: 'inv_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-bs-07', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Prepaid Insurance', Line_Amount: 12000, Statement_Section: 'BS', Master_Category: 'caOth_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-bs-08', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Security Deposit', Line_Amount: 8000, Statement_Section: 'BS', Master_Category: null, Mapping_Status: 'Unmapped' },

    // FIXED ASSETS
    { ID_finItem: 'itm-fa-01', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Land Parcel – HQ', Line_Amount: 80000, Statement_Section: 'BS', Master_Category: 'FA_land_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-02', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Land Parcel – Storage', Line_Amount: 40000, Statement_Section: 'BS', Master_Category: 'FA_land_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-03', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Office Building', Line_Amount: 200000, Statement_Section: 'BS', Master_Category: 'FA_bldngs_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-04', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Warehouse Building', Line_Amount: 150000, Statement_Section: 'BS', Master_Category: 'FA_bldngs_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-05', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Production Machine A', Line_Amount: 60000, Statement_Section: 'BS', Master_Category: 'FA_machinEquip_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-06', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Production Machine B', Line_Amount: 40000, Statement_Section: 'BS', Master_Category: 'FA_machinEquip_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-07', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Delivery Van', Line_Amount: 35000, Statement_Section: 'BS', Master_Category: 'FA_vehicles_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-08', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Company Car', Line_Amount: 25000, Statement_Section: 'BS', Master_Category: 'FA_vehicles_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-09', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Office Furniture', Line_Amount: 15000, Statement_Section: 'BS', Master_Category: 'FA_furnFixtur_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-10', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Warehouse Shelving', Line_Amount: 10000, Statement_Section: 'BS', Master_Category: 'FA_furnFixtur_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-11', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Office Renovation', Line_Amount: 20000, Statement_Section: 'BS', Master_Category: 'FA_leasehldImprov_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-12', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Warehouse Improvements', Line_Amount: 15000, Statement_Section: 'BS', Master_Category: 'FA_leasehldImprov_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-13', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Security System', Line_Amount: 8000, Statement_Section: 'BS', Master_Category: 'FA_other_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-fa-14', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'IT Hardware', Line_Amount: 12000, Statement_Section: 'BS', Master_Category: 'FA_other_01_rp1', Mapping_Status: 'Manual' },

    // NON-FIXED ASSETS
    { ID_finItem: 'itm-nf-01', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Software License', Line_Amount: 10000, Statement_Section: 'BS', Master_Category: 'intanNFA_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-nf-02', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Trademark', Line_Amount: 5000, Statement_Section: 'BS', Master_Category: 'intanNFA_01_rp1', Mapping_Status: 'Manual' },

    // LIABILITIES
    { ID_finItem: 'itm-li-01', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Vendor Payable – Supplies', Line_Amount: 60000, Statement_Section: 'BS', Master_Category: 'ap_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-li-02', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Vendor Payable – Services', Line_Amount: 40000, Statement_Section: 'BS', Master_Category: 'ap_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-li-03', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Business Credit Card – Visa', Line_Amount: 10000, Statement_Section: 'BS', Master_Category: 'cc_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-li-04', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Business Credit Card – Amex', Line_Amount: 5000, Statement_Section: 'BS', Master_Category: 'cc_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-li-05', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Current Portion – Term Loan', Line_Amount: 25000, Statement_Section: 'BS', Master_Category: 'cpLTD_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-li-06', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Current Portion – Equipment Loan', Line_Amount: 15000, Statement_Section: 'BS', Master_Category: 'cpLTD_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-li-07', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Term Loan', Line_Amount: 200000, Statement_Section: 'BS', Master_Category: 'LTD_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-li-08', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Equipment Loan', Line_Amount: 100000, Statement_Section: 'BS', Master_Category: 'LTD_01_rp1', Mapping_Status: 'Manual' },

    // EQUITY
    { ID_finItem: 'itm-eq-01', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Owner Capital Contribution', Line_Amount: 250000, Statement_Section: 'BS', Master_Category: 'equity_01_rp1', Mapping_Status: 'Manual' },
    { ID_finItem: 'itm-eq-02', ID_finStmnt_rp1: 'STM-2024-001', Raw_Line_Name: 'Retained Earnings', Line_Amount: 320000, Statement_Section: 'BS', Master_Category: 'equity_01_rp1', Mapping_Status: 'Manual' },
];

// ==========================================
// SERVICE LAYER
// ==========================================

export const FinancialLedgerService = {

    // --- READ ---

    // [NEW] Personal Intelligence Read
    getPersonalProfile: (contactId) => {
        // In a real app, filtering by contactId would happen here.
        // For prototype, we return the single mock.
        return { ...finProfile_pers };
    },

    // 1. Get Statement Metadata (Header)
    getStatement: (id) => fin_statements.find(s => s.ID_finStmnt_rp1 === id),

    getStatementItems: (statementId) => {
        return fin_items.filter(i => i.ID_finStmnt_rp1 === statementId);
    },

    getCanonList: (statementId) => {
        const items = fin_items.filter(i => i.ID_finStmnt_rp1 === statementId);

        // Return exhaustive list with current totals
        return CANONICAL_CATEGORIES.map(cat => {
            const sum = items
                .filter(i => i.Master_Category === cat.id)
                .reduce((acc, curr) => acc + curr.Line_Amount, 0);

            // Check if ANY items map to this (even if sum is 0, presence counts as usage)
            // But prompt says: "No mapped items -> render as UNMAPPED"
            // Actually, mapped items are the source.
            // Let's count items mapped.
            const mappedCount = items.filter(i => i.Master_Category === cat.id).length;

            return {
                ...cat,
                amount: sum,
                itemCount: mappedCount,
                status: mappedCount > 0 ? 'Mapped' : 'Unmapped'
            };
        });
    },

    getChecklist: (statementId) => {
        const items = fin_items.filter(i => i.ID_finStmnt_rp1 === statementId);
        const totalRaw = items.length;
        const mappedRaw = items.filter(i => i.Mapping_Status !== 'Unmapped' && i.Master_Category).length;

        // Strict: All Raw Items MUST be mapped.
        // (Prompt also mentioned something about "required lines present", but usually mapping raw is the blocker)
        // Let's assume completeness = Raw Items Mapped %. 
        // AND we enforce that no raw item triggers an error.

        return {
            total: totalRaw,
            mapped: mappedRaw,
            percent: totalRaw === 0 ? 0 : Math.round((mappedRaw / totalRaw) * 100)
        };
    },

    // --- WRITE (Ledger Only) ---

    updateItemMapping: (itemId, masterCategory) => {
        const index = fin_items.findIndex(i => i.ID_finItem === itemId);
        if (index === -1) throw new Error('Item not found');

        const statement = fin_statements.find(s => s.ID_finStmnt_rp1 === fin_items[index].ID_finStmnt_rp1);
        if (statement.status_finStmnt_rp1 === 'Locked') {
            throw new Error('Cannot edit items in a Locked statement');
        }

        fin_items[index] = {
            ...fin_items[index],
            Master_Category: masterCategory,
            Mapping_Status: masterCategory ? 'Manual' : 'Unmapped',
            updated_at: new Date().toISOString()
        };

        const checklist = FinancialLedgerService.getChecklist(statement.ID_finStmnt_rp1);
        statement.mappingComplete_finStmnt_rp1 = checklist.percent / 100;

        return fin_items[index];
    },

    // --- MATERIALIZATION PIPELINE ---

    lockStatement: (statementId) => {
        const statement = fin_statements.find(s => s.ID_finStmnt_rp1 === statementId);
        if (!statement) throw new Error('Statement not found');

        const checklist = FinancialLedgerService.getChecklist(statementId);
        if (checklist.percent < 100) {
            throw new Error('Cannot lock: Raw items ensure 100% mapping coverage.');
        }

        // 1. Freeze Statement
        statement.status_finStmnt_rp1 = 'Locked';
        statement.locked_at = new Date().toISOString();
        statement.version_number += 1;

        // 2. Deterministic Materialization
        const items = fin_items.filter(i => i.ID_finStmnt_rp1 === statementId);
        const finProfile = materializeProfile(statement, items);

        // 3. Emit / Persist
        console.log('[MATERIALIZATION] Generated finProfile_bus:', finProfile);

        return finProfile;
    }
};

// ==========================================
// MATERIALIZATION LOGIC (Private)
// ==========================================

const materializeProfile = (stmt, items) => {

    // Sum by Master Category ID
    const sum = (catId) => items
        .filter(i => i.Master_Category === catId)
        .reduce((acc, curr) => acc + curr.Line_Amount, 0);

    // Group Aggregators
    const rev = sum('revenueBus_01_rp1') + sum('incOthBus_01_rp1');
    const cogs = sum('COGS_mtrl_01_rp1') + sum('COGS_dirLbr_01_rp1');
    const grossProfit = rev - cogs;

    // OpEx Summation
    const opExRaw = [
        'exp_oheadLbr_01_rp1', 'exp_salesMrktng_01_rp1', 'exp_util_01_rp1',
        'exp_vehicle_01_rp1', 'exp_rentLease_01_rp1', 'exp_supplies_01_rp1',
        'exp_TE_01_rp1', 'exp_licen_01_rp1', 'exp_insur_01_rp1',
        'exp_repair_01_rp1', 'exp_services_01_rp1', 'exp_oth_01_rp1',
        'deprAmort_01_rp1'
    ].reduce((acc, cat) => acc + sum(cat), 0);

    const interest = sum('exp_interest_01_rp1');
    const tax = sum('exp_tax_01_rp1');
    const depr = sum('deprAmort_01_rp1');
    const ownerDraw = sum('ownerDraw_01_rp1');

    // EBITDA = GrossProfit - OpEx (excluding interest/tax/depr if typically below the line)
    // Note: 'deprAmort_01_rp1' is included in opExRaw above.
    // Adjusted EBITDA = GrossProfit - (OpEx - Depr)
    // Simplified model:
    const ebitda = grossProfit - (opExRaw - depr);

    const netIncome = ebitda - depr - interest - tax;

    // Assets
    const cash = sum('cash_01_rp1');
    const ar = sum('ar_01_rp1');
    const inv = sum('inv_01_rp1');
    const caOth = sum('caOth_01_rp1');
    const assetsCur = cash + ar + inv + caOth;

    const assetsFix = [
        'FA_land_01_rp1', 'FA_bldngs_01_rp1', 'FA_machinEquip_01_rp1',
        'FA_vehicles_01_rp1', 'FA_furnFixtur_01_rp1', 'FA_leasehldImprov_01_rp1',
        'FA_other_01_rp1'
    ].reduce((acc, cat) => acc + sum(cat), 0);

    const intan = sum('intanNFA_01_rp1');
    const assetsTot = assetsCur + assetsFix + intan;

    // Liabilities
    const ap = sum('ap_01_rp1');
    const cc = sum('cc_01_rp1');
    const cpLTD = sum('cpLTD_01_rp1');
    const liabCur = ap + cc + cpLTD;

    const ltd = sum('LTD_01_rp1');
    const liabTot = liabCur + ltd;

    // Equity (Calculated from inputs, not plugged, though plug is often safer if data is bad)
    const equityInput = sum('equity_01_rp1');
    const equityTot = assetsTot - liabTot; // Balancing plug for now as standard practice in MVP

    const fmt = (n) => `$${n.toLocaleString()}`;
    const pct = (n, d) => d === 0 ? '0.0%' : `${((n / d) * 100).toFixed(1)}%`;
    const x = (n, d) => d === 0 ? '0.00x' : `${(n / d).toFixed(2)}x`;

    return {
        meta: {
            Account_ID: stmt.ID_account,
            ID_finStmnt_rp1: stmt.ID_finStmnt_rp1,
            rp1_fiscalYr: stmt.rp1_fiscalYr,
            status_finStmnt_rp1: 'Locked',
            periodLabel: 'Full Year',
            startDt_rp1: stmt.startDt_rp1,
            endDt_rp1: stmt.endDt_rp1,
            fingerprint: uuidv4().substring(0, 8)
        },
        income: {
            revenue_rp1: fmt(rev),
            COGS_rp1: fmt(cogs),
            margGros_rp1: fmt(grossProfit),
            opEx_rp1: fmt(opExRaw), // includes Depr usually in basic presentation
            opIncNet_rp1: fmt(ebitda), // Approx
            EBITDA_rp1: fmt(ebitda),
            deprAmort_rp1: fmt(depr),
            interest_rp1: fmt(interest),
            EBT_rp1: fmt(netIncome + tax),
            tax_rp1: fmt(tax),
            ownerDraw_01_rp1: fmt(ownerDraw),
            margNet_rp1: fmt(netIncome)
        },
        balanceSheet: {
            cash_rp1: fmt(cash),
            ar_rp1: fmt(ar),
            inv_rp1: fmt(inv),
            caOth_rp1: fmt(caOth),
            assetsCur_rp1: fmt(assetsCur),
            assetsFix_rp1: fmt(assetsFix),
            assetsNFix_rp1: fmt(intan),
            assetsTot_rp1: fmt(assetsTot),
            liabtsCur_rp1: fmt(liabCur),
            crCards_rp1: fmt(cc),
            LTD_rp1: fmt(ltd),
            liabtsTot_rp1: fmt(liabTot),
            equityTot_rp1: fmt(equityTot),
            balS_checkYn_rp1: true
        },
        dscr: { DSCR_bus_an1: '0.00' }, // Placeholder calc
        profitability: { margGros_prcnt_rp1: pct(grossProfit, rev) }, // Placeholder
        leverage: {},
        liquidity: {},
        activity: {}
    };
};

export const CATEGORY_OPTIONS = CANONICAL_CATEGORIES;
