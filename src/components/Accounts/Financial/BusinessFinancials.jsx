import React from 'react';
import {
    TrendingUp, TrendingDown, DollarSign, Activity,
    PieChart, ArrowUpRight, ArrowDownRight, Info,
    CreditCard, BarChart3, AlertTriangle, FileText
} from 'lucide-react';
import ExplainabilityTooltip from '../../Shared/ExplainabilityTooltip';

// Helper for currency formatting
const formatCurrency = (val) => {
    if (val === undefined || val === null) return '-';
    if (typeof val === 'string') return val; // Handle already formatted
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

const formatPercent = (val) => {
    if (val === undefined || val === null) return '-';
    if (typeof val === 'string') return val;
    return (val * 100).toFixed(1) + '%';
};

const MetricCard = ({ title, value, subValue, trend, trendVal, icon: Icon, color, formula, source, rationale }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
        <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon size={20} className={color.replace('bg-', 'text-').replace('/10', '-600')} />
            </div>
            {/* Explainability Hook */}
            <ExplainabilityTooltip
                metricName={title}
                formula={formula}
                source={source}
                rationale={rationale}
            >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-help">
                    <Info size={16} className="text-slate-300 hover:text-blue-500" />
                </div>
            </ExplainabilityTooltip>
        </div>

        <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">{title}</div>
        </div>

        {trend && (
            <div className={`flex items-center gap-1 mt-3 text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{trendVal} vs last year</span>
            </div>
        )}
    </div>
);

const StatementRow = ({ label, value, isHeader, isTotal, isNegative, isAddback, indent = true, formula, source, rationale }) => (
    <div className={`group flex justify-between items-center py-2 ${isHeader ? 'border-b border-slate-200 font-bold text-slate-800 mt-4 mb-2' : 'border-b border-slate-50 text-slate-600'} ${isTotal ? 'font-bold text-slate-900 border-t border-slate-300 bg-slate-50/50 px-2 -mx-2' : ''}`}>
        <div className="flex items-center gap-2">
            <span className={`${indent && !isHeader ? 'pl-4' : ''} text-sm flex items-center gap-2`}>
                {isAddback && <div className="w-1 h-3 bg-emerald-400 rounded-full" title="Add-back"></div>}
                {label}
            </span>
            {(formula || source) && (
                <ExplainabilityTooltip
                    metricName={label}
                    formula={formula}
                    source={source}
                    rationale={rationale}
                >
                    <Info size={12} className="text-slate-300 hover:text-blue-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity ml-1" />
                </ExplainabilityTooltip>
            )}
        </div>
        <span className={`text-sm font-mono ${isNegative ? 'text-rose-600' : ''}`}>
            {value}
        </span>
    </div>
);

const BusinessFinancials = ({ profile }) => {
    if (!profile) return <div className="p-8 text-center text-slate-400">Loading financial profile...</div>;

    // Destructure strict F1 fields
    const {
        revenue_rp1, COGS_rp1, margGros_rp1, opEx_rp1, opIncNet_rp1,
        deprAmort_rp1, interest_rp1, EBITDA_rp1, EBT_rp1, tax_rp1,
        ownerDraw_01_rp1, margNet_rp1,

        cash_rp1, ar_rp1, inv_rp1, caOth_rp1,
        assetsCur_rp1, assetsFix_rp1, assetsNFix_rp1, assetsTot_rp1,

        liabtsCur_rp1, crCards_rp1, LTD_rp1, liabtsTot_rp1, equityTot_rp1,

        DSCR_bus_an1, DSCR_glob_an1, DSCR_globProj_an1, margGros_prcnt_rp1, margNet_prcnt_rp1,
        wCap_rp1, curentR_rp1
    } = profile;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">

            {/* 1. EXECUTIVE SIGNALS (Section 9A) */}
            <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity size={16} /> Key Performance Signals
                </h3>
                <div className="grid grid-cols-4 gap-4">
                    <MetricCard
                        title="Revenue (TTM)"
                        value={formatCurrency(revenue_rp1)}
                        icon={DollarSign}
                        color="bg-blue-50"
                        formula="SUM(FinItems where incSMastCtg = 'revenue')"
                        source="Section 2: 702101.1"
                        rationale="Top-line performance indicator."
                    />
                    <MetricCard
                        title="EBITDA"
                        value={formatCurrency(EBITDA_rp1)}
                        icon={BarChart3}
                        color="bg-indigo-50"
                        formula="Net Operating Income + Depreciation"
                        source="Section 2: 702105.1"
                        rationale="Core proxy for operating cash flow."
                    />
                    <MetricCard
                        title="Global DSCR"
                        value={DSCR_glob_an1?.toFixed(2) + "x"}
                        icon={Activity}
                        color={DSCR_glob_an1 >= 1.25 ? "bg-emerald-50" : "bg-amber-50"}
                        formula="(EBITDA + Household CF) / Total Debt Service"
                        source="Section 4: 702302.1"
                        rationale="Primary repayment capacity metric."
                    />
                    <MetricCard
                        title="Working Capital"
                        value={formatCurrency(wCap_rp1)}
                        icon={CreditCard}
                        color="bg-slate-50"
                        formula="Current Assets - Current Liabilities"
                        source="Section 7: 702601.1"
                        rationale="Liquidity measure."
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">

                {/* 2. INCOME STATEMENT (Section 2 - 7021) */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Income Statement</h3>
                        <span className="text-xs text-slate-500 font-mono">TTM Period</span>
                    </div>
                    <div className="p-6 group">
                        {/* 702101.1 Revenue */}
                        <StatementRow label="Total Revenue" value={formatCurrency(revenue_rp1)} isHeader formula="SUM(Revenue Items)" source="702101.1" />

                        {/* 702102.1 COGS */}
                        <StatementRow label="Cost of Goods Sold" value={`(${formatCurrency(COGS_rp1)})`} formula="SUM(COGS Items)" source="702102.1" />

                        {/* 702103.1 Gross Margin */}
                        <StatementRow label="Gross Profit" value={formatCurrency(margGros_rp1)} isTotal formula="Revenue - COGS" source="702103.1" />

                        {/* 702104.1 OpEx */}
                        <StatementRow label="Operating Expenses" value={`(${formatCurrency(opEx_rp1)})`} isHeader formula="SUM(OpEx Items)" source="702104.1" />

                        {/* 702105.1 EBITDA (Placed here per User Requirement) */}
                        <div className="my-2 py-2 border-y border-slate-100 bg-slate-50/30 -mx-6 px-6">
                            <StatementRow label="EBITDA" value={formatCurrency(EBITDA_rp1)} isTotal formula="NOI + Depreciation" source="702105.1" rationale="Earnings Before Interest, Taxes, Depreciation, Amortization" />
                        </div>

                        {/* 702106.1 Depr/Amort */}
                        <div className="pl-4">
                            <StatementRow label="Addback: Depreciation" value={formatCurrency(deprAmort_rp1)} isAddback formula="Non-Cash Items" source="702106.1" />
                        </div>

                        {/* 702107.1 NOI */}
                        <StatementRow label="Net Operating Income" value={formatCurrency(opIncNet_rp1)} isTotal formula="Gross Profit - OpEx" source="702107.1" />

                        <div className="mt-4 pt-4 border-t border-slate-100">
                            {/* 702108.1 Interest */}
                            <StatementRow label="Interest Expense" value={`(${formatCurrency(interest_rp1)})`} source="702108.1" />

                            {/* 702109.1 EBT */}
                            <StatementRow label="Earnings Before Tax" value={formatCurrency(EBT_rp1)} isTotal formula="NOI - Interest" source="702109.1" />

                            {/* 702110.1 Tax */}
                            <StatementRow label="Taxes" value={`(${formatCurrency(tax_rp1)})`} source="702110.1" />

                            {/* 702111.1 Owner Draw */}
                            <StatementRow label="Owner Compensation" value={`(${formatCurrency(ownerDraw_01_rp1)})`} source="702111.1" />

                            {/* 702112.1 Net Margin */}
                            <StatementRow label="Net Profit" value={formatCurrency(margNet_rp1)} isTotal formula="EBT - Tax - OwnerDraw" source="702112.1" />
                        </div>
                    </div>
                </div>

                {/* 3. BALANCE SHEET & RATIOS (Section 3 & 5-8) */}
                <div className="space-y-6">
                    {/* Balance Sheet Summary */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Balance Sheet Summary</h3>
                            <div className="flex items-center gap-3">
                                {profile.balS_checkYn_rp1 ? (
                                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                        <check size={12} strokeWidth={3} /> BALANCED
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                        <x size={12} strokeWidth={3} /> UNBALANCED
                                    </span>
                                )}
                                <span className="text-xs text-slate-500 font-mono">As of Period End</span>
                            </div>
                        </div>
                        <div className="p-6 group">
                            <StatementRow label="Total Assets" value={formatCurrency(assetsTot_rp1)} isTotal formula="Current + Fixed + Intangible Assets" source="702208.1" />
                            <StatementRow label="Current Assets" value={formatCurrency(assetsCur_rp1)} indent formula="Cash + AR + Inv + Other" source="702205.1" />
                            <StatementRow label="   - Cash" value={formatCurrency(cash_rp1)} indent />
                            <StatementRow label="   - AR" value={formatCurrency(ar_rp1)} indent />
                            <StatementRow label="   - Inventory" value={formatCurrency(inv_rp1)} indent source="702203.1" />
                            <StatementRow label="   - Other Current" value={formatCurrency(caOth_rp1)} indent source="702204.1" />

                            <div className="h-2"></div>
                            <StatementRow label="Fixed Assets" value={formatCurrency(assetsFix_rp1)} indent source="702206.1" />
                            <StatementRow label="Intangible Assets" value={formatCurrency(assetsNFix_rp1)} indent source="702207.1" />

                            <div className="h-4"></div>

                            <StatementRow label="Total Liabilities" value={formatCurrency(liabtsTot_rp1)} isTotal formula="Current + Long Term Liabilities" source="702213.1" />
                            <StatementRow label="Current Liabilities" value={formatCurrency(liabtsCur_rp1)} indent formula="AP + CC + Lines" source="702210.1" />
                            <StatementRow label="   - Credit Cards" value={formatCurrency(crCards_rp1)} indent source="702211.1" />

                            <div className="h-2"></div>
                            <StatementRow label="Long Term Debt" value={formatCurrency(LTD_rp1)} indent source="702212.1" />

                            <div className="h-4"></div>

                            <StatementRow label="Total Equity" value={formatCurrency(equityTot_rp1)} isTotal formula="Assets - Liabilities" source="702214.1" />
                        </div>
                    </div>

                    {/* Ratio Analysis */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">Ratio Analysis</h3>
                        </div>
                        <div className="p-6 grid grid-cols-2 gap-x-12 gap-y-8">

                            {/* DSCR (7023) */}
                            <div className="col-span-2 pb-4 border-b border-slate-100">
                                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3">Debt Service Coverage (7023)</div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Business DSCR</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${profile.DSCR_bus_an1 >= 1.25 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {profile.DSCR_bus_an1 >= 1.25 ? 'PASS' : 'WATCH'}
                                            </span>
                                            <span className="font-mono font-bold text-slate-800">{profile.DSCR_bus_an1?.toFixed(2)}x</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Global DSCR</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${profile.DSCR_glob_an1 >= 1.25 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {profile.DSCR_glob_an1 >= 1.25 ? 'PASS' : 'WATCH'}
                                            </span>
                                            <span className="font-mono font-bold text-slate-800">{profile.DSCR_glob_an1?.toFixed(2)}x</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center opacity-75">
                                        <span className="text-sm text-slate-600">Projected Global DSCR</span>
                                        <span className="font-mono font-bold text-slate-800">{profile.DSCR_globProj_an1?.toFixed(2)}x</span>
                                    </div>
                                </div>
                            </div>

                            {/* Liquidity */}
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3 border-b border-slate-100 pb-1">Liquidity (7026)</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Current Ratio</span>
                                        <span className="font-mono font-bold text-slate-800">{profile.curentR_rp1?.toFixed(2)}x</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Quick Ratio</span>
                                        <span className="font-mono font-bold text-slate-800">{profile.quickR_rp1?.toFixed(2)}x</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Liquid Assets %</span>
                                        <span className="font-mono font-bold text-slate-800">{formatPercent(profile.liquidA_rp1)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Profitability */}
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3 border-b border-slate-100 pb-1">Profitability (7024)</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Gross Margin</span>
                                        <span className="font-mono font-bold text-slate-800">{formatPercent(profile.margGros_prcnt_rp1)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Net Margin</span>
                                        <span className="font-mono font-bold text-slate-800">{formatPercent(profile.margNet_prcnt_rp1)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Return on Assets (ROA)</span>
                                        <span className="font-mono font-bold text-slate-800">{formatPercent(profile.ROA_rp1)}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">Return on Equity (ROE)</span>
                                        <span className="font-mono font-bold text-slate-800">{formatPercent(profile.ROE_rp1)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Leverage */}
                            <div className="col-span-2 mt-4 pt-4 border-t border-slate-100">
                                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3">Deep Dive: Leverage (7025)</div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <div className="text-xs font-semibold text-slate-500 mb-1">Business</div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Debt / Equity</span>
                                            <span className="font-mono font-bold text-slate-800">{profile.leverage_bus_rp1?.toFixed(2)}x</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Debt / Fixed Assets</span>
                                            <span className="font-mono font-bold text-slate-800">{profile.liabtsTot_FA_rp1?.toFixed(2)}x</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Debt / Revenue</span>
                                            <span className="font-mono font-bold text-slate-800">{profile.liabtsTot_Rev_rp1?.toFixed(2)}x</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="text-xs font-semibold text-slate-500 mb-1">Global (Inc. Household)</div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Debt / Equity</span>
                                            <span className="font-mono font-bold text-slate-800">{profile.leverage_glob_rp1?.toFixed(2)}x</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Debt / FA+NW</span>
                                            <span className="font-mono font-bold text-slate-800">{profile.liabtsGlob_FA_rp1?.toFixed(2)}x</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Debt / Rev+CF</span>
                                            <span className="font-mono font-bold text-slate-800">{profile.liabtsGlob_Rev_rp1?.toFixed(2)}x</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 opacity-75">
                                        <div className="text-xs font-semibold text-slate-500 mb-1">Projected (Post-Loan)</div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Debt / Equity</span>
                                            <span className="font-mono font-bold text-slate-800">{profile.leverage_busProj_rp1?.toFixed(2)}x</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Debt / Fixed Assets</span>
                                            <span className="font-mono font-bold text-slate-800">{profile.liabtsProj_FA_rp1?.toFixed(2)}x</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-slate-600">Debt / Revenue</span>
                                            <span className="font-mono font-bold text-slate-800">{profile.liabtsProj_Rev_rp1?.toFixed(2)}x</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity */}
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-3 border-b border-slate-100 pb-1">Activity (7027)</div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">DIO (Inv Days)</span>
                                        <span className="font-mono font-bold text-slate-800">{profile.DIO_an1?.toFixed(0)}d</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">DSO (AR Days)</span>
                                        <span className="font-mono font-bold text-slate-800">{profile.DSO_an1?.toFixed(0)}d</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-slate-600">DPO (AP Days)</span>
                                        <span className="font-mono font-bold text-slate-800">{profile.DPO_an1?.toFixed(0)}d</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 border-t border-slate-50 mt-1">
                                        <span className="text-sm font-bold text-slate-700">Cash Conversion Cycle</span>
                                        <span className="font-mono font-bold text-slate-900">{profile.CCC_an1?.toFixed(0)}d</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BusinessFinancials;
