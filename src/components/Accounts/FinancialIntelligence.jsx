import React, { useState } from 'react';
import {
    ShieldCheck, Calendar, Info, Lock,
    TrendingUp, TrendingDown, Minus,
    FileText, Users, Download, Activity,
    DollarSign, Percent, BarChart3, PieChart
} from 'lucide-react';

const FinancialIntelligence = ({ accountId = 'ACC-12345', onEditSource }) => {
    const [activeTab, setActiveTab] = useState('commercial');

    // --- Mock Data (Contract: finProfile_bus [F1_rp1], Read-Only) ---
    // Represents the "Single Source of Truth" for Underwriting
    // Schema: F1_rp1
    const finProfile_bus = {
        meta: {
            Account_ID: accountId,
            ID_finStmnt_rp1: 'STM-2024-001',
            type_finStmnt_rp1: 'Tax Return',
            status_finStmnt_rp1: 'Locked',
            importMethod_finStmnt_rp1: 'OCR',
            startDt_rp1: 'Jan 1, 2024',
            endDt_rp1: 'Dec 31, 2024',
            rp1_mo: 12,
            rp1_fiscalYr: '2024',
            periodLabel: 'Full Year',
            fingerprint: '3a9f78b',
        },
        income: {
            revenue_rp1: '$1,250,000',
            COGS_rp1: '$410,000',
            margGros_rp1: '$840,000',
            opEx_rp1: '$560,000',
            opIncNet_rp1: '$280,000', // NOI
            EBITDA_rp1: '$320,000',
            deprAmort_rp1: '$45,000',
            interest_rp1: '$12,000',
            EBT_rp1: '$223,000',
            tax_rp1: '$35,000',
            ownerDraw_01_rp1: '$50,000',
            margNet_rp1: '$188,000'
        },
        balanceSheet: {
            cash_rp1: '$150,000',
            ar_rp1: '$80,000',
            inv_rp1: '$200,000',
            caOth_rp1: '$20,000',
            assetsCur_rp1: '$450,000',
            assetsFix_rp1: '$120,000',
            assetsNFix_rp1: '$0',
            assetsTot_rp1: '$570,000',

            liabtsCur_rp1: '$150,000',
            crCards_rp1: '$15,000',
            LTD_rp1: '$200,000',
            liabtsTot_rp1: '$350,000',
            equityTot_rp1: '$220,000',
            balS_checkYn_rp1: true
        },
        dscr: {
            DSCR_bus_an1: '1.45',
            DSCR_glob_an1: '1.32',
            DSCR_globProj_an1: '1.28'
        },
        profitability: {
            margGros_prcnt_rp1: '67.2%',
            margNet_prcnt_rp1: '15.0%',
            RevOA_rp1: '2.19x',
            ROA_rp1: '32.9%',
            RevOE_rp1: '5.68x',
            ROE_rp1: '85.4%',
            opExOA_rp1: '44.8%', // 0.98 -> %
            opExOE_rp1: '116.2%'
        },
        leverage: {
            // 1. BUSINESS
            leverage_bus_rp1: '2.10x',
            liabtsTot_FA_rp1: '2.92x',
            liabtsTot_Rev_rp1: '0.28x',
            // 2. GLOBAL
            leverage_glob_rp1: '2.45x',
            liabtsGlob_FA_rp1: '3.15x',
            liabtsGlob_Rev_rp1: '0.35x',
            // 3. PROJECTED
            leverage_busProj_rp1: '2.35x',
            liabtsProj_FA_rp1: '3.05x',
            liabtsProj_Rev_rp1: '0.31x'
        },
        liquidity: {
            wCap_rp1: '$300,000',
            curentR_rp1: '3.00x',
            quickR_rp1: '1.53x',
            liquidA_rp1: '78.9%' // assetsCur / assetsTot
        },
        activity: {
            DIO_an1: '45 Days',
            DSO_an1: '30 Days',
            DPO_an1: '60 Days',
            CCC_an1: '15 Days'
        }
    };

    // --- Helpers ---
    const logAccess = (action, details = {}) => {
        console.log(`[AUDIT] Action: ${action} | User: CurrentUser | Context: Financial_Intelligence | Resource: ${accountId}`);
    };

    React.useEffect(() => {
        logAccess('VIEW_PAGE', { period: finProfile_bus.meta.rp1_fiscalYr });
    }, []);

    return (
        <div className="space-y-8 pb-10">

            {/* HEADER SECTION */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-xl font-bold text-slate-900">Financial Intelligence</h2>
                            {finProfile_bus.meta.status_finStmnt_rp1 === 'Locked' ? (
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                                    <ShieldCheck size={14} /> VERIFIED
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-200">
                                    <FileText size={14} /> DRAFT
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 text-sm max-w-2xl">
                            Verified financial data used for credit underwriting and risk monitoring.
                            Read-only view of <strong>finProfile_bus ({finProfile_bus.meta.rp1_fiscalYr})</strong>.
                        </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 min-w-[280px]">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            <Calendar size={12} /> Reporting Period
                        </div>
                        <div className="flex items-center justify-between bg-white border border-slate-200 rounded px-3 py-2 shadow-sm">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-800">{finProfile_bus.meta.rp1_fiscalYr} ({finProfile_bus.meta.periodLabel})</span>
                                <span className="text-xs text-slate-500">{finProfile_bus.meta.startDt_rp1} – {finProfile_bus.meta.endDt_rp1}</span>
                            </div>
                            <Lock size={14} className="text-slate-400" />
                        </div>
                        {finProfile_bus.meta.status_finStmnt_rp1 !== 'Locked' && onEditSource && (
                            <button
                                onClick={() => {
                                    logAccess('EDIT_SOURCE_INITIATED');
                                    onEditSource({
                                        accountId,
                                        statementId: finProfile_bus.meta.ID_finStmnt_rp1,
                                        fiscalYear: finProfile_bus.meta.rp1_fiscalYr
                                    });
                                }}
                                className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                            >
                                <Pen size={12} /> Edit Source Financials
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex gap-6 mt-8 border-b border-slate-200">
                    <button
                        onClick={() => { setActiveTab('commercial'); logAccess('SWITCH_TAB_COMMERCIAL'); }}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'commercial' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <FileText size={16} /> Commercial Financials
                    </button>
                    <button
                        onClick={() => { setActiveTab('personal'); logAccess('SWITCH_TAB_PERSONAL'); }}
                        className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'personal' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Users size={16} /> Personal & Guarantors
                    </button>
                </div>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'commercial' && (
                <div className="space-y-6 animate-in fade-in duration-300">

                    {/* 1. INCOME STATEMENT & 2. BALANCE SHEET (GRID) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Income Statement */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                            <SectionHeader title="1. Income Statement" icon={DollarSign} />
                            <div className="divide-y divide-slate-50 flex-1">
                                <Row label="Revenue" value={finProfile_bus.income.revenue_rp1} bold />
                                <Row label="COGS" value={finProfile_bus.income.COGS_rp1} indent />
                                <Row label="Gross Profit" value={finProfile_bus.income.margGros_rp1} highlight />
                                <Row label="Operating Expenses" value={finProfile_bus.income.opEx_rp1} />
                                <Row label="Net Operating Income" value={finProfile_bus.income.opIncNet_rp1} bold />
                                <Row label="EBITDA" value={finProfile_bus.income.EBITDA_rp1} highlight />
                                <Row label="Depreciation & Amort" value={finProfile_bus.income.deprAmort_rp1} indent />
                                <Row label="Interest Expense" value={finProfile_bus.income.interest_rp1} indent />
                                <Row label="EBT" value={finProfile_bus.income.EBT_rp1} />
                                <Row label="Taxes" value={finProfile_bus.income.tax_rp1} indent />
                                <Row label="Owner Draws" value={finProfile_bus.income.ownerDraw_01_rp1} indent />
                                <Row label="Net Profit" value={finProfile_bus.income.margNet_rp1} highlight />
                            </div>
                        </div>

                        {/* Balance Sheet */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                            <SectionHeader title="2. Balance Sheet Summary" icon={BarChart3} />
                            <div className="divide-y divide-slate-50 flex-1">
                                <Row label="Cash" value={finProfile_bus.balanceSheet.cash_rp1} indent />
                                <Row label="Accts Receivable" value={finProfile_bus.balanceSheet.ar_rp1} indent />
                                <Row label="Inventory" value={finProfile_bus.balanceSheet.inv_rp1} indent />
                                <Row label="Other C. Assets" value={finProfile_bus.balanceSheet.caOth_rp1} indent />
                                <Row label="Total Current Assets" value={finProfile_bus.balanceSheet.assetsCur_rp1} bold />
                                <Row label="Fixed Assets" value={finProfile_bus.balanceSheet.assetsFix_rp1} />
                                <Row label="Non-Fixed Assets" value={finProfile_bus.balanceSheet.assetsNFix_rp1} />
                                <Row label="Total Assets" value={finProfile_bus.balanceSheet.assetsTot_rp1} highlight />

                                <Divider />

                                <Row label="Current Liabilities" value={finProfile_bus.balanceSheet.liabtsCur_rp1} bold />
                                <Row label="Credit Cards" value={finProfile_bus.balanceSheet.crCards_rp1} indent />
                                <Row label="Long Term Debt" value={finProfile_bus.balanceSheet.LTD_rp1} />
                                <Row label="Total Liabilities" value={finProfile_bus.balanceSheet.liabtsTot_rp1} highlight />
                                <Row label="Total Equity" value={finProfile_bus.balanceSheet.equityTot_rp1} highlight />
                            </div>
                        </div>
                    </div>

                    {/* 3. DSCR PROFILE */}
                    <ProfileSection title="3. DSCR Profile" icon={Activity}>
                        <MetricBox label="DSCR (Business)" value={finProfile_bus.dscr.DSCR_bus_an1} />
                        <MetricBox label="DSCR (Global)" value={finProfile_bus.dscr.DSCR_glob_an1} highlight />
                        <MetricBox label="DSCR (Global Proj)" value={finProfile_bus.dscr.DSCR_globProj_an1} />
                        <div className="flex items-center justify-center text-xs text-slate-400 italic px-4">
                            *Read-only from underwriting analysis
                        </div>
                    </ProfileSection>

                    {/* 4. PROFITABILITY PROFILE */}
                    <ProfileSection title="4. Profitability Profile" icon={Percent}>
                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                            {/* Margins */}
                            <MetricBox label="Gross Margin" value={finProfile_bus.profitability.margGros_prcnt_rp1} />
                            <MetricBox label="Net Margin" value={finProfile_bus.profitability.margNet_prcnt_rp1} />

                            {/* Returns */}
                            <MetricBox label="Return on Assets" value={finProfile_bus.profitability.ROA_rp1} />
                            <MetricBox label="Return on Equity" value={finProfile_bus.profitability.ROE_rp1} />

                            {/* Efficiency */}
                            <MetricBox label="Revenue over Assets" value={finProfile_bus.profitability.RevOA_rp1} />
                            <MetricBox label="Revenue over Equity" value={finProfile_bus.profitability.RevOE_rp1} />
                            <MetricBox label="OpEx over Assets" value={finProfile_bus.profitability.opExOA_rp1} />
                            <MetricBox label="OpEx over Equity" value={finProfile_bus.profitability.opExOE_rp1} />
                        </div>
                    </ProfileSection>

                    {/* 5. LEVERAGE PROFILE */}
                    <ProfileSection title="5. Leverage Profile" icon={BarChart3}>
                        {/* 1. Business Leverage */}
                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 pb-4 mb-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider md:col-span-3">Business Leverage</div>
                            <MetricBox label="Leverage Ratio (Business)" value={finProfile_bus.leverage.leverage_bus_rp1 || '—'} />
                            <MetricBox label="Liabilities / Fixed Assets" value={finProfile_bus.leverage.liabtsTot_FA_rp1 || '—'} />
                            <MetricBox label="Liabilities / Revenue" value={finProfile_bus.leverage.liabtsTot_Rev_rp1 || '—'} />
                        </div>

                        {/* 2. Global Leverage */}
                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-slate-100 pb-4 mb-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider md:col-span-3">Global Leverage (Business + Household)</div>
                            <MetricBox label="Global Leverage Ratio" value={finProfile_bus.leverage.leverage_glob_rp1 || '—'} />
                            <MetricBox label="Glob. Liab / Fixed Assets" value={finProfile_bus.leverage.liabtsGlob_FA_rp1 || '—'} />
                            <MetricBox label="Glob. Liab / Revenue" value={finProfile_bus.leverage.liabtsGlob_Rev_rp1 || '—'} />
                        </div>

                        {/* 3. Projected Leverage */}
                        <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider md:col-span-3">Projected Leverage (Post-Loan)</div>
                            <MetricBox label="Projected Leverage Ratio" value={finProfile_bus.leverage.leverage_busProj_rp1 || '—'} />
                            <MetricBox label="Proj. Liab / Fixed Assets" value={finProfile_bus.leverage.liabtsProj_FA_rp1 || '—'} />
                            <MetricBox label="Proj. Liab / Revenue" value={finProfile_bus.leverage.liabtsProj_Rev_rp1 || '—'} />
                        </div>
                    </ProfileSection>

                    {/* 6. LIQUIDITY PROFILE & 7. ACTIVITY PROFILE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <SectionHeader title="6. Liquidity Profile" icon={DollarSign} />
                            <div className="p-6 grid grid-cols-2 gap-4">
                                <div className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100 relative group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Working Capital</span>
                                        <Lock size={10} className="text-slate-300" />
                                    </div>
                                    <span className="text-lg font-bold text-slate-800">{finProfile_bus.liquidity.wCap_rp1 || '—'}</span>
                                </div>
                                <div className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100 relative group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Current Ratio</span>
                                        <Lock size={10} className="text-slate-300" />
                                    </div>
                                    <span className="text-lg font-bold text-slate-800">{finProfile_bus.liquidity.curentR_rp1 || '—'}</span>
                                </div>
                                <div className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100 relative group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Quick Ratio</span>
                                        <Lock size={10} className="text-slate-300" />
                                    </div>
                                    <span className="text-lg font-bold text-slate-800">{finProfile_bus.liquidity.quickR_rp1 || '—'}</span>
                                </div>
                                <div className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100 relative group">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider truncate">Liquid Assets Ratio</span>
                                        <Lock size={10} className="text-slate-300" />
                                    </div>
                                    <span className="text-lg font-bold text-slate-800">{finProfile_bus.liquidity.liquidA_rp1 || '—'}</span>
                                </div>
                            </div>
                        </div>

                        <ProfileSection title="7. Activity Profile" icon={Activity}>
                            <MetricBox label="DIO (Days Inv)" value={finProfile_bus.activity.DIO_an1} />
                            <MetricBox label="DSO (Days Sales)" value={finProfile_bus.activity.DSO_an1} />
                            <MetricBox label="DPO (Days Payable)" value={finProfile_bus.activity.DPO_an1} />
                            <MetricBox label="Cash Conv. Cycle" value={finProfile_bus.activity.CCC_an1} />
                        </ProfileSection>
                    </div>

                </div>
            )}

            {activeTab === 'personal' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                        <Users size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800">Personal Guarantor Aggregation</h3>
                    <p className="text-slate-500 max-w-md mx-auto mt-2 text-sm">
                        Aggregate financial data from all Owners and Guarantors.
                        Sourced from Contact Financial Profiles.
                    </p>
                </div>
            )}

            <div className="mt-8 border-t border-slate-200 pt-6 flex justify-between items-center text-xs text-slate-400">
                <div className="flex gap-4">
                    <span>Generated: {new Date().toLocaleDateString()}</span>
                    <span>Fingerprint: {finProfile_bus.meta.fingerprint}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Lock size={10} /> Read-Only
                </div>
            </div>

        </div>
    );
};

// --- Sub-components ---

const SectionHeader = ({ title, icon: Icon }) => (
    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
            {Icon && <Icon size={14} className="text-slate-400" />}
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
        </div>
        <Lock size={12} className="text-slate-300" />
    </div>
);

const Row = ({ label, value, indent, bold, highlight }) => (
    <div className={`flex justify-between items-center pr-6 py-2.5 hover:bg-slate-50 transition-colors ${indent ? 'pl-10' : 'pl-6'} ${highlight ? 'bg-slate-50/50' : ''}`}>
        <span className={`text-sm ${bold || highlight ? 'font-bold text-slate-800' : 'text-slate-600'}`}>{label}</span>
        <span className={`font-mono text-sm ${highlight ? 'font-bold text-blue-700' : bold ? 'font-bold text-slate-900' : 'text-slate-700'}`}>{value}</span>
    </div>
);

const Divider = () => <div className="border-t border-slate-100 mx-6 my-2"></div>;

const ProfileSection = ({ title, icon, children }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <SectionHeader title={title} icon={icon} />
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {children}
        </div>
    </div>
);

const MetricBox = ({ label, value, highlight }) => (
    <div className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate" title={label}>{label}</span>
        <span className={`text-lg font-bold ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>{value}</span>
    </div>
);

export default FinancialIntelligence;
