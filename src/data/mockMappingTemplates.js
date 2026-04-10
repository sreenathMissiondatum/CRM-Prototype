// ─── FINANCIAL MAPPING TEMPLATES MOCK STORE ───────────────────────────────
// Templates store ONLY: Raw Line Name → Canonical Category mappings.
// NO rule engine. NO pattern matching. NO match types.

export const INDUSTRIES = [
    'Agriculture', 'Construction', 'Food & Beverage', 'Healthcare',
    'Manufacturing', 'Professional Services', 'Real Estate', 'Retail',
    'Technology', 'Transportation', 'Other'
];

export const SOURCE_TYPES = ['QuickBooks', 'Upload', 'Other'];

// Canonical category options grouped by section
export const TEMPLATE_CANONICAL_OPTIONS = [
    // Income Statement
    { id: 'IS_REV', group: 'Revenue', label: 'Total Revenue' },
    { id: 'IS_COGS', group: 'Revenue', label: 'Cost of Goods Sold' },
    { id: 'IS_GROSS', group: 'Revenue', label: 'Gross Profit' },
    { id: 'IS_OPEX_RENT', group: 'OpEx', label: 'Rent / Lease' },
    { id: 'IS_OPEX_PAYROLL', group: 'OpEx', label: 'Payroll / Salaries' },
    { id: 'IS_OPEX_UTIL', group: 'OpEx', label: 'Utilities' },
    { id: 'IS_OPEX_MKTG', group: 'OpEx', label: 'Marketing & Advertising' },
    { id: 'IS_OPEX_INSUR', group: 'OpEx', label: 'Insurance' },
    { id: 'IS_OPEX_OTHER', group: 'OpEx', label: 'Other Operating Expenses' },
    { id: 'IS_DEPR', group: 'Non-Cash', label: 'Depreciation & Amortization' },
    { id: 'IS_INT', group: 'Non-Cash', label: 'Interest Expense' },
    { id: 'IS_TAX', group: 'Below Line', label: 'Income Tax' },
    { id: 'IS_OWNER', group: 'Below Line', label: 'Owner Draw / Distribution' },
    { id: 'IS_NET', group: 'Below Line', label: 'Net Profit / Loss' },
    // Balance Sheet
    { id: 'BS_CASH', group: 'Assets', label: 'Cash & Equivalents' },
    { id: 'BS_AR', group: 'Assets', label: 'Accounts Receivable' },
    { id: 'BS_INV', group: 'Assets', label: 'Inventory' },
    { id: 'BS_FIXASSET', group: 'Assets', label: 'Fixed Assets (Net)' },
    { id: 'BS_AP', group: 'Liabilities', label: 'Accounts Payable' },
    { id: 'BS_LTD', group: 'Liabilities', label: 'Long-Term Debt' },
    { id: 'BS_EQUITY', group: 'Equity', label: 'Total Equity' },
];

// Sample ledger rows — amounts are always masked (zero) in Template Mode
export const SAMPLE_LEDGER_ROWS = [
    { id: 'SL_001', rawLineName: 'Sales - Product Revenue' },
    { id: 'SL_002', rawLineName: 'Service Revenue' },
    { id: 'SL_003', rawLineName: 'Cost of Goods Sold' },
    { id: 'SL_004', rawLineName: 'Office Rent' },
    { id: 'SL_005', rawLineName: 'Employee Salaries' },
    { id: 'SL_006', rawLineName: 'Payroll Taxes' },
    { id: 'SL_007', rawLineName: 'Electricity & Gas' },
    { id: 'SL_008', rawLineName: 'Google Ads Expense' },
    { id: 'SL_009', rawLineName: 'Business Insurance' },
    { id: 'SL_010', rawLineName: 'Miscellaneous Expense' },
    { id: 'SL_011', rawLineName: 'Depreciation Expense' },
    { id: 'SL_012', rawLineName: 'Interest on Loan' },
    { id: 'SL_013', rawLineName: 'Federal Income Tax' },
    { id: 'SL_014', rawLineName: 'Owner Distribution' },
    { id: 'SL_015', rawLineName: 'Net Income' },
    { id: 'SL_016', rawLineName: 'Cash on Hand' },
    { id: 'SL_017', rawLineName: 'Accounts Receivable - Trade' },
    { id: 'SL_018', rawLineName: 'Finished Goods Inventory' },
    { id: 'SL_019', rawLineName: 'Equipment (Net of Depreciation)' },
    { id: 'SL_020', rawLineName: 'Accounts Payable - Vendors' },
];

// Mapping shape: { rawLineName: string, canonicalCategoryId: string }

// ─── IN-MEMORY STORE ───────────────────────────────────────────────────────
let _templates = [
    {
        id: 'tpl_001',
        name: 'QuickBooks Standard - Small Business',
        sourceType: 'QuickBooks',
        structureType: 'PNL',
        industry: 'Professional Services',
        description: 'Standard mapping for QuickBooks Online exports from small service-based businesses.',
        status: 'Active',
        usageCount: 14,
        createdBy: 'admin@myflow.com',
        createdAt: '2025-11-10T09:14:00Z',
        updatedAt: '2026-01-15T14:30:00Z',
        isDeleted: false,
        versions: [
            {
                version: 1,
                createdAt: '2025-11-10T09:14:00Z',
                createdBy: 'admin@myflow.com',
                mappings: [
                    { rawLineName: 'Sales - Product Revenue', canonicalCategoryId: 'IS_REV' },
                    { rawLineName: 'Service Revenue', canonicalCategoryId: 'IS_REV' },
                    { rawLineName: 'Cost of Goods Sold', canonicalCategoryId: 'IS_COGS' },
                    { rawLineName: 'Office Rent', canonicalCategoryId: 'IS_OPEX_RENT' },
                    { rawLineName: 'Employee Salaries', canonicalCategoryId: 'IS_OPEX_PAYROLL' },
                    { rawLineName: 'Payroll Taxes', canonicalCategoryId: 'IS_OPEX_PAYROLL' },
                    { rawLineName: 'Electricity & Gas', canonicalCategoryId: 'IS_OPEX_UTIL' },
                    { rawLineName: 'Business Insurance', canonicalCategoryId: 'IS_OPEX_INSUR' },
                    { rawLineName: 'Depreciation Expense', canonicalCategoryId: 'IS_DEPR' },
                    { rawLineName: 'Interest on Loan', canonicalCategoryId: 'IS_INT' },
                    { rawLineName: 'Federal Income Tax', canonicalCategoryId: 'IS_TAX' },
                    { rawLineName: 'Net Income', canonicalCategoryId: 'IS_NET' },
                ]
            },
            {
                version: 2,
                createdAt: '2026-01-15T14:30:00Z',
                createdBy: 'lo_jane@myflow.com',
                mappings: [
                    { rawLineName: 'Sales - Product Revenue', canonicalCategoryId: 'IS_REV' },
                    { rawLineName: 'Service Revenue', canonicalCategoryId: 'IS_REV' },
                    { rawLineName: 'Cost of Goods Sold', canonicalCategoryId: 'IS_COGS' },
                    { rawLineName: 'Office Rent', canonicalCategoryId: 'IS_OPEX_RENT' },
                    { rawLineName: 'Employee Salaries', canonicalCategoryId: 'IS_OPEX_PAYROLL' },
                    { rawLineName: 'Payroll Taxes', canonicalCategoryId: 'IS_OPEX_PAYROLL' },
                    { rawLineName: 'Electricity & Gas', canonicalCategoryId: 'IS_OPEX_UTIL' },
                    { rawLineName: 'Google Ads Expense', canonicalCategoryId: 'IS_OPEX_MKTG' },
                    { rawLineName: 'Business Insurance', canonicalCategoryId: 'IS_OPEX_INSUR' },
                    { rawLineName: 'Depreciation Expense', canonicalCategoryId: 'IS_DEPR' },
                    { rawLineName: 'Interest on Loan', canonicalCategoryId: 'IS_INT' },
                    { rawLineName: 'Federal Income Tax', canonicalCategoryId: 'IS_TAX' },
                    { rawLineName: 'Net Income', canonicalCategoryId: 'IS_NET' },
                    { rawLineName: 'Cash on Hand', canonicalCategoryId: 'BS_CASH' },
                    { rawLineName: 'Accounts Receivable - Trade', canonicalCategoryId: 'BS_AR' },
                ]
            }
        ]
    },
    {
        id: 'tpl_002',
        name: 'Construction LLC — Tax Return Layout',
        sourceType: 'Upload',
        structureType: 'TAX_RETURN',
        industry: 'Construction',
        description: 'Handles scanned tax return PDFs from general contractors and subcontracting LLCs.',
        status: 'Active',
        usageCount: 7,
        createdBy: 'admin@myflow.com',
        createdAt: '2026-01-22T11:00:00Z',
        updatedAt: '2026-01-22T11:00:00Z',
        isDeleted: false,
        versions: [
            {
                version: 1,
                createdAt: '2026-01-22T11:00:00Z',
                createdBy: 'admin@myflow.com',
                mappings: [
                    { rawLineName: 'Sales - Product Revenue', canonicalCategoryId: 'IS_REV' },
                    { rawLineName: 'Cost of Goods Sold', canonicalCategoryId: 'IS_COGS' },
                    { rawLineName: 'Office Rent', canonicalCategoryId: 'IS_OPEX_RENT' },
                    { rawLineName: 'Business Insurance', canonicalCategoryId: 'IS_OPEX_INSUR' },
                    { rawLineName: 'Depreciation Expense', canonicalCategoryId: 'IS_DEPR' },
                    { rawLineName: 'Interest on Loan', canonicalCategoryId: 'IS_INT' },
                    { rawLineName: 'Net Income', canonicalCategoryId: 'IS_NET' },
                    { rawLineName: 'Equipment (Net of Depreciation)', canonicalCategoryId: 'BS_FIXASSET' },
                ]
            }
        ]
    },
    {
        id: 'tpl_003',
        name: 'Retail Standard — POS Upload',
        sourceType: 'Upload',
        structureType: 'PNL',
        industry: 'Retail',
        description: 'Maps POS system exports to canonical financial categories for retail borrowers.',
        status: 'Inactive',
        usageCount: 2,
        createdBy: 'lo_jane@myflow.com',
        createdAt: '2025-12-05T08:20:00Z',
        updatedAt: '2026-02-10T09:45:00Z',
        isDeleted: false,
        versions: [
            {
                version: 1,
                createdAt: '2025-12-05T08:20:00Z',
                createdBy: 'lo_jane@myflow.com',
                mappings: [
                    { rawLineName: 'Sales - Product Revenue', canonicalCategoryId: 'IS_REV' },
                    { rawLineName: 'Cost of Goods Sold', canonicalCategoryId: 'IS_COGS' },
                    { rawLineName: 'Office Rent', canonicalCategoryId: 'IS_OPEX_RENT' },
                    { rawLineName: 'Finished Goods Inventory', canonicalCategoryId: 'BS_INV' },
                ]
            }
        ]
    }
];

let _auditLog = [
    { id: 'a1', userId: 'admin@myflow.com', timestamp: '2025-11-10T09:14:00Z', templateId: 'tpl_001', templateName: 'QuickBooks Standard - Small Business', version: 1, action: 'TEMPLATE_CREATED', changes: { mappingsCount: 12 } },
    { id: 'a2', userId: 'lo_jane@myflow.com', timestamp: '2026-01-15T14:30:00Z', templateId: 'tpl_001', templateName: 'QuickBooks Standard - Small Business', version: 2, action: 'TEMPLATE_EDITED', changes: { mappingsAdded: 3, mappingsRemoved: 0 } },
    { id: 'a3', userId: 'admin@myflow.com', timestamp: '2026-01-22T11:00:00Z', templateId: 'tpl_002', templateName: 'Construction LLC — Tax Return Layout', version: 1, action: 'TEMPLATE_CREATED', changes: { mappingsCount: 8 } },
    { id: 'a4', userId: 'lo_jane@myflow.com', timestamp: '2025-12-05T08:20:00Z', templateId: 'tpl_003', templateName: 'Retail Standard — POS Upload', version: 1, action: 'TEMPLATE_CREATED', changes: { mappingsCount: 4 } },
    { id: 'a5', userId: 'admin@myflow.com', timestamp: '2026-02-10T09:45:00Z', templateId: 'tpl_003', templateName: 'Retail Standard — POS Upload', version: 1, action: 'TEMPLATE_STATUS_CHANGED', changes: { before: 'Active', after: 'Inactive' } },
];

let _nextId = 4;
let _nextAuditId = 6;

const _emitAudit = (entry) => {
    const log = { id: `a${_nextAuditId++}`, timestamp: new Date().toISOString(), ...entry };
    _auditLog.push(log);
    console.log('[AUDIT LOG] Template Action:', log);
};

// ─── COVERAGE COMPUTATION ──────────────────────────────────────────────────
// Coverage = % of SAMPLE_LEDGER_ROWS that have a mapping
export const computeCoverage = (mappings) => {
    if (!mappings || mappings.length === 0) return 0;
    const mappedNames = new Set(mappings.map(m => m.rawLineName));
    const matched = SAMPLE_LEDGER_ROWS.filter(row => mappedNames.has(row.rawLineName)).length;
    return Math.round((matched / SAMPLE_LEDGER_ROWS.length) * 100);
};

// ─── CRUD API ──────────────────────────────────────────────────────────────
export const MappingTemplatesStore = {

    getAll: () => _templates.filter(t => !t.isDeleted),

    getById: (id) => _templates.find(t => t.id === id && !t.isDeleted),

    getAuditLog: () => [..._auditLog].reverse(),

    computeCoverage,

    isNameUnique: (name, excludeId = null) =>
        !_templates.some(t => !t.isDeleted && t.name.trim().toLowerCase() === name.trim().toLowerCase() && t.id !== excludeId),

    /** Create a new template with v1 mappings */
    create: ({ name, sourceType, industry, description, mappings, userId = 'current_user@myflow.com' }) => {
        const id = `tpl_${String(_nextId++).padStart(3, '0')}`;
        const now = new Date().toISOString();
        const newTemplate = {
            id, name, sourceType, industry: industry || null, description: description || '',
            status: 'Active', usageCount: 0, createdBy: userId, createdAt: now, updatedAt: now,
            isDeleted: false,
            versions: [{ version: 1, createdAt: now, createdBy: userId, mappings }]
        };
        _templates.push(newTemplate);
        _emitAudit({ userId, templateId: id, templateName: name, version: 1, action: 'TEMPLATE_CREATED', changes: { mappingsCount: mappings.length } });
        return newTemplate;
    },

    /** Edit — creates new version, preserves all previous versions */
    edit: ({ id, mappings, userId = 'current_user@myflow.com' }) => {
        const tpl = _templates.find(t => t.id === id);
        if (!tpl) throw new Error('Template not found');
        const latestVersion = Math.max(...tpl.versions.map(v => v.version));
        const newVersion = latestVersion + 1;
        const now = new Date().toISOString();
        tpl.versions.push({ version: newVersion, createdAt: now, createdBy: userId, mappings });
        tpl.updatedAt = now;
        _emitAudit({ userId, templateId: id, templateName: tpl.name, version: newVersion, action: 'TEMPLATE_EDITED', changes: { mappingsCount: mappings.length } });
        return tpl;
    },

    /** Clone with a new name, copies latest version mappings as v1 */
    clone: ({ id, newName, userId = 'current_user@myflow.com' }) => {
        const source = _templates.find(t => t.id === id);
        if (!source) throw new Error('Source template not found');
        const latestVersion = source.versions[source.versions.length - 1];
        const now = new Date().toISOString();
        const newId = `tpl_${String(_nextId++).padStart(3, '0')}`;
        const cloned = {
            ...JSON.parse(JSON.stringify(source)),
            id: newId, name: newName, usageCount: 0, status: 'Active',
            createdBy: userId, createdAt: now, updatedAt: now, isDeleted: false,
            versions: [{ version: 1, createdAt: now, createdBy: userId, mappings: JSON.parse(JSON.stringify(latestVersion.mappings)) }]
        };
        _templates.push(cloned);
        _emitAudit({ userId, templateId: newId, templateName: newName, version: 1, action: 'TEMPLATE_CLONED', changes: { sourceTemplateId: id, sourceTemplateName: source.name } });
        return cloned;
    },

    /** Soft delete */
    delete: ({ id, userId = 'current_user@myflow.com' }) => {
        const tpl = _templates.find(t => t.id === id);
        if (!tpl) throw new Error('Template not found');
        tpl.isDeleted = true;
        tpl.updatedAt = new Date().toISOString();
        _emitAudit({ userId, templateId: id, templateName: tpl.name, version: null, action: 'TEMPLATE_DELETED', changes: null });
    },

    /** Toggle Active / Inactive */
    setStatus: ({ id, status, userId = 'current_user@myflow.com' }) => {
        const tpl = _templates.find(t => t.id === id);
        if (!tpl) throw new Error('Template not found');
        const before = tpl.status;
        tpl.status = status;
        tpl.updatedAt = new Date().toISOString();
        _emitAudit({ userId, templateId: id, templateName: tpl.name, version: null, action: 'TEMPLATE_STATUS_CHANGED', changes: { before, after: status } });
        return tpl;
    },
};
