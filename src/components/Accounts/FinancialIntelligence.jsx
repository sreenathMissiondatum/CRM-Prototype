import React, { useState } from 'react';
import {
    ShieldCheck, Calendar, Lock,
    TrendingUp, Activity,
    DollarSign, Percent, BarChart3, Pen,
    Building2, Wallet, Scale,
    Briefcase, ArrowRightLeft,
    FileText, Users, CheckCircle
} from 'lucide-react';

const FinancialIntelligence = ({ accountId = 'ACC-12345', onEditSource }) => {
    const [activeTab, setActiveTab] = useState('commercial');

    // --- Mock Data (Contract: finProfile_bus [F1_rp1], Read-Only) ---
    const finProfile_bus = {
        meta: {
            Account_ID: accountId,
            ID_finStmnt_rp1: 'STM-2024-001',
            type_finStmnt_rp1: 'Tax Return',
            status_finStmnt_rp1: 'Draft',
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
            opExOA_rp1: '44.8%',
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

    const logAccess = (action, details = {}) => {
        console.log(`[AUDIT] Action: ${action} | User: CurrentUser | Context: Financial_Intelligence | Resource: ${accountId}`);
    };

    return (
        <div className="bg-slate-50/50 min-h-screen pb-20 -mx-6 -my-6 animate-in fade-in duration-500">

            {/* 1. HEADER & META CONTROL */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-2.5 bg-slate-900 rounded-lg text-white shadow-md">
                            <Building2 size={24} strokeWidth={1.5} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Financial Intelligence</h2>
                                {finProfile_bus.meta.status_finStmnt_rp1 === 'Locked' ? (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100 uppercase tracking-wide">
                                        <ShieldCheck size={10} /> Verified
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 uppercase tracking-wide">
                                        <FileText size={10} /> Draft
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 font-medium">
                                <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-400" /> {finProfile_bus.meta.rp1_fiscalYr} ({finProfile_bus.meta.periodLabel})</span>
                                <span className="h-3 w-px bg-slate-200"></span>
                                <span>{finProfile_bus.meta.importMethod_finStmnt_rp1} Source</span>
                                <span className="h-3 w-px bg-slate-200"></span>
                                <span className="font-mono text-slate-400">ID: {finProfile_bus.meta.fingerprint}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Navigation Tabs */}
                        <div className="flex bg-slate-100/80 p-1 rounded-lg border border-slate-200">
                            <button
                                onClick={() => setActiveTab('commercial')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'commercial' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Commercial
                            </button>
                            <button
                                onClick={() => setActiveTab('personal')}
                                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'personal' ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                Personal
                            </button>
                        </div>

                        {onEditSource && (
                            <button
                                onClick={() => onEditSource({ accountId, fiscalYear: finProfile_bus.meta.rp1_fiscalYr })}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                title="Edit Source"
                            >
                                <Pen size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 pt-8 space-y-8">

                {/* 2. EXECUTIVE OVERVIEW STRIP */}
                {/* Requirement: Highlight key existing totals already shown (Revenue, Gross Profit, NOI, Net Profit) */}
                <div className="grid grid-cols-4 gap-6">
                    <HeroCard label="Total Revenue" value={finProfile_bus.income.revenue_rp1} icon={DollarSign} color="text-slate-600" />
                    <HeroCard label="Gross Profit" value={finProfile_bus.income.margGros_rp1} icon={TrendingUp} color="text-emerald-600" />
                    <HeroCard label="Net Op. Income" value={finProfile_bus.income.opIncNet_rp1} icon={Activity} color="text-blue-600" />
                    <HeroCard label="Net Profit" value={finProfile_bus.income.margNet_rp1} icon={Wallet} color="text-purple-600" />
                </div>

                {activeTab === 'commercial' && (
                    <div className="space-y-8 animate-in slide-in-from-bottom-2 duration-300">

                        {/* 3. FINANCIAL STATEMENTS - DUAL PANEL REFINEMENT */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* LEFT: Income Statement */}
                            <div className="group bg-white rounded-xl border border-slate-200 shadow-sm">
                                <PanelHeader title="Income Statement" icon={FileText} subtitle="Operating Performance" />
                                <div className="p-1">
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-slate-50">
                                            <DataRow label="Revenue" value={finProfile_bus.income.revenue_rp1} bold />
                                            <DataRow label="COGS" value={finProfile_bus.income.COGS_rp1} indent />
                                            <DataRow label="Gross Profit" value={finProfile_bus.income.margGros_rp1} highlight />

                                            <div className="h-2"></div> {/* Visual spacer */}

                                            <DataRow label="Operating Expenses" value={finProfile_bus.income.opEx_rp1} />
                                            <DataRow label="Net Operating Income (NOI)" value={finProfile_bus.income.opIncNet_rp1} bold />

                                            <div className="h-2"></div>

                                            <DataRow label="EBITDA" value={finProfile_bus.income.EBITDA_rp1} highlight />
                                            <DataRow label="Depreciation & Amortization" value={finProfile_bus.income.deprAmort_rp1} indent />
                                            <DataRow label="Interest Expense" value={finProfile_bus.income.interest_rp1} indent />
                                            <DataRow label="Earnings Before Tax (EBT)" value={finProfile_bus.income.EBT_rp1} />
                                            <DataRow label="Taxes" value={finProfile_bus.income.tax_rp1} indent />
                                            <DataRow label="Owner Draws" value={finProfile_bus.income.ownerDraw_01_rp1} indent />

                                            <DataRow label="Net Profit" value={finProfile_bus.income.margNet_rp1} highlight last />
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* RIGHT: Balance Sheet */}
                            <div className="group bg-white rounded-xl border border-slate-200 shadow-sm">
                                <PanelHeader title="Balance Sheet" icon={Scale} subtitle="Financial Position" />
                                <div className="p-1">
                                    <table className="w-full text-sm">
                                        <tbody className="divide-y divide-slate-50">
                                            {/* ASSETS */}
                                            <SectionLabel label="Assets" />
                                            <DataRow label="Cash & Equivalents" value={finProfile_bus.balanceSheet.cash_rp1} indent />
                                            <DataRow label="Accounts Receivable" value={finProfile_bus.balanceSheet.ar_rp1} indent />
                                            <DataRow label="Inventory" value={finProfile_bus.balanceSheet.inv_rp1} indent />
                                            <DataRow label="Other Current Assets" value={finProfile_bus.balanceSheet.caOth_rp1} indent />
                                            <DataRow label="Total Current Assets" value={finProfile_bus.balanceSheet.assetsCur_rp1} bold />
                                            <DataRow label="Fixed Assets" value={finProfile_bus.balanceSheet.assetsFix_rp1} />
                                            <DataRow label="Non-Fixed Assets" value={finProfile_bus.balanceSheet.assetsNFix_rp1} />
                                            <DataRow label="Total Assets" value={finProfile_bus.balanceSheet.assetsTot_rp1} highlight />

                                            {/* LIABILITIES & EQUITY */}
                                            <SectionLabel label="Liabilities & Equity" />
                                            <DataRow label="Current Liabilities" value={finProfile_bus.balanceSheet.liabtsCur_rp1} bold />
                                            <DataRow label="Credit Cards" value={finProfile_bus.balanceSheet.crCards_rp1} indent />
                                            <DataRow label="Long Term Debt" value={finProfile_bus.balanceSheet.LTD_rp1} />
                                            <DataRow label="Total Liabilities" value={finProfile_bus.balanceSheet.liabtsTot_rp1} highlight />
                                            <DataRow label="Total Equity" value={finProfile_bus.balanceSheet.equityTot_rp1} highlight />

                                            {finProfile_bus.balanceSheet.balS_checkYn_rp1 && (
                                                <tr className="bg-emerald-50/50">
                                                    <td colSpan={2} className="px-6 py-2 text-xs font-medium text-emerald-700 flex items-center gap-2">
                                                        <CheckCircle size={12} /> Equation Balanced (Assets = Liab + Eq)
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* 4. RATIO & PROFILE SECTIONS - CARD-BASED LAYOUT */}

                        {/* Row A: Coverage & Liquidity */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* Coverage Profile (DSCR) */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold uppercase tracking-wide text-xs">
                                    <ShieldCheck size={16} className="text-slate-400" /> Coverage Profile (DSCR)
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <MetricCard label="Business DSCR" value={finProfile_bus.dscr.DSCR_bus_an1} subtext="Operational Only" />
                                    <MetricCard label="Global DSCR" value={finProfile_bus.dscr.DSCR_glob_an1} highlight subtext="Bus + Household" />
                                    <MetricCard label="Global Projected" value={finProfile_bus.dscr.DSCR_globProj_an1} subtext="Post-Loan" />
                                </div>
                            </div>

                            {/* Liquidity Profile */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold uppercase tracking-wide text-xs">
                                    <Wallet size={16} className="text-slate-400" /> Liquidity Profile
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                    <MetricCard label="Working Capital" value={finProfile_bus.liquidity.wCap_rp1} />
                                    <MetricCard label="Current Ratio" value={finProfile_bus.liquidity.curentR_rp1} />
                                    <MetricCard label="Quick Ratio" value={finProfile_bus.liquidity.quickR_rp1} />
                                    <MetricCard label="Liquid Assets %" value={finProfile_bus.liquidity.liquidA_rp1} />
                                </div>
                            </div>
                        </div>

                        {/* Row B: Profitability */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold uppercase tracking-wide text-xs">
                                <Percent size={16} className="text-slate-400" /> Profitability Profile
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-y-6 gap-x-8">
                                <MetricCard label="Gross Margin" value={finProfile_bus.profitability.margGros_prcnt_rp1} />
                                <MetricCard label="Net Margin" value={finProfile_bus.profitability.margNet_prcnt_rp1} />

                                <DividerVertical />

                                <MetricCard label="ROA" value={finProfile_bus.profitability.ROA_rp1} />
                                <MetricCard label="ROE" value={finProfile_bus.profitability.ROE_rp1} />

                                <DividerVertical />

                                <MetricCard label="Rev/Assets" value={finProfile_bus.profitability.RevOA_rp1} />
                                <MetricCard label="Rev/Equity" value={finProfile_bus.profitability.RevOE_rp1} />
                                <MetricCard label="OpEx/Assets" value={finProfile_bus.profitability.opExOA_rp1} />
                                <MetricCard label="OpEx/Equity" value={finProfile_bus.profitability.opExOE_rp1} />
                            </div>
                        </div>

                        {/* Row C: Leverage (Complex Grouping) */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold uppercase tracking-wide text-xs">
                                <Scale size={16} className="text-slate-400" /> Leverage Profile
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">

                                {/* 1. Business */}
                                <div className="space-y-4 pt-4 md:pt-0">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Business Leverage</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <MetricCard label="Leverage Ratio" value={finProfile_bus.leverage.leverage_bus_rp1} />
                                        <div className="col-span-2 grid grid-cols-2 gap-4">
                                            <MetricCard label="Liab / Fixed Assets" value={finProfile_bus.leverage.liabtsTot_FA_rp1} small />
                                            <MetricCard label="Liab / Revenue" value={finProfile_bus.leverage.liabtsTot_Rev_rp1} small />
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Global */}
                                <div className="space-y-4 pt-4 md:pt-0 md:pl-8">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Leverage</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <MetricCard label="Leverage Ratio" value={finProfile_bus.leverage.leverage_glob_rp1} />
                                        <div className="col-span-2 grid grid-cols-2 gap-4">
                                            <MetricCard label="Liab / Fixed Assets" value={finProfile_bus.leverage.liabtsGlob_FA_rp1} small />
                                            <MetricCard label="Liab / Revenue" value={finProfile_bus.leverage.liabtsGlob_Rev_rp1} small />
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Projected */}
                                <div className="space-y-4 pt-4 md:pt-0 md:pl-8">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projected (Post-Loan)</div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <MetricCard label="Leverage Ratio" value={finProfile_bus.leverage.leverage_busProj_rp1} />
                                        <div className="col-span-2 grid grid-cols-2 gap-4">
                                            <MetricCard label="Liab / Fixed Assets" value={finProfile_bus.leverage.liabtsProj_FA_rp1} small />
                                            <MetricCard label="Liab / Revenue" value={finProfile_bus.leverage.liabtsProj_Rev_rp1} small />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row D: Activity (Card Row) */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold uppercase tracking-wide text-xs">
                                <ArrowRightLeft size={16} className="text-slate-400" /> Activity Profile
                            </div>
                            <div className="grid grid-cols-4 gap-6">
                                <MetricCard label="DIO (Days Inventory)" value={finProfile_bus.activity.DIO_an1} />
                                <MetricCard label="DSO (Days Sales)" value={finProfile_bus.activity.DSO_an1} />
                                <MetricCard label="DPO (Days Payable)" value={finProfile_bus.activity.DPO_an1} />
                                <MetricCard label="Cash Conv. Cycle" value={finProfile_bus.activity.CCC_an1} highlight />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'personal' && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-16 text-center">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-sm">
                            <Users size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Personal Guarantor Aggregation</h3>
                        <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed">
                            Aggregate financial data from all Owners and Guarantors.
                            <br />Sourced directly from Contact Financial Profiles.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Sub-Components for Clean Architecture ---

const HeroCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between group hover:shadow-md transition-shadow">
        <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
            <div className={`text-2xl font-mono font-bold ${color}`}>{value}</div>
        </div>
        <div className={`p-2 rounded-lg bg-slate-50 text-slate-300 group-hover:text-slate-400 transition-colors`}>
            {Icon && <Icon size={20} />}
        </div>
    </div>
);

const PanelHeader = ({ title, icon: Icon, subtitle }) => (
    <div className="px-6 py-4 border-b border-slate-50 flex justify-between items-center bg-slate-[0.25]">
        <div className="flex items-center gap-3">
            <div className="p-1.5 bg-slate-100 rounded text-slate-500">
                {Icon && <Icon size={16} />}
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-800">{title}</h3>
                <div className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{subtitle}</div>
            </div>
        </div>
        <Lock size={12} className="text-slate-300" />
    </div>
);

const SectionLabel = ({ label }) => (
    <tr className="bg-slate-50/50">
        <td colSpan={2} className="px-6 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-y border-slate-50">
            {label}
        </td>
    </tr>
);

const DataRow = ({ label, value, indent, bold, highlight, last }) => (
    <tr className={`group transition-colors hover:bg-slate-50 cursor-default ${highlight ? 'bg-slate-50/60' : ''}`}>
        <td className={`py-2.5 pr-4 ${indent ? 'pl-10' : 'pl-6'} ${bold || highlight ? 'font-bold text-slate-800' : 'text-slate-600 font-medium'} text-sm`}>
            {label}
        </td>
        <td className={`py-2.5 px-6 text-right font-mono text-sm ${bold || highlight ? 'font-bold text-slate-900' : 'text-slate-600'} ${last ? 'rounded-br-xl' : ''}`}>
            {value}
        </td>
    </tr>
);

const MetricCard = ({ label, value, subtext, highlight, small }) => (
    <div className="flex flex-col">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate" title={label}>{label}</div>
        <div className={`font-mono font-bold ${small ? 'text-sm' : 'text-xl'} ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>
            {value || '—'}
        </div>
        {subtext && <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{subtext}</div>}
    </div>
);

const DividerVertical = () => (
    <div className="hidden lg:block w-px bg-slate-100 my-1 mx-auto"></div>
);

export default FinancialIntelligence;
