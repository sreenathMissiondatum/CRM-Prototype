import React, { useState, useEffect } from 'react';
import {
    Wallet, Lock, Shield, Calendar, Info,
    ChevronDown, TrendingUp, DollarSign,
    CheckCircle, AlertTriangle, Eye, EyeOff
} from 'lucide-react';
import { FinancialLedgerService } from '../../services/FinancialLedgerService';

const PersonalFinancialIntelligence = ({ contactId }) => {
    const [profile, setProfile] = useState(null);
    const [showSensitive, setShowSensitive] = useState(false);

    useEffect(() => {
        // Fetch strictly read-only profile
        const data = FinancialLedgerService.getPersonalProfile(contactId);
        setProfile(data);
    }, [contactId]);

    const toggleSensitive = () => {
        // LOG AUDIT EVENT HERE IN REAL APP
        console.log(`[AUDIT] Sensitive data revealed for contact ${contactId} at ${new Date().toISOString()}`);
        setShowSensitive(!showSensitive);
    };

    if (!profile) return <div className="p-8 text-center text-slate-500">Loading Intelligence...</div>;

    // Helper: Currency Formatter
    const fmt = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

    // Helper: Masker
    const MaskedValue = ({ value, visible, label }) => {
        if (visible) return <span className="font-mono font-bold text-slate-900">{value}</span>;
        return (
            <div className="flex items-center gap-2 select-none group cursor-pointer" onClick={toggleSensitive} title="Click to Reveal">
                <span className="text-slate-300 tracking-widest text-sm">••••••</span>
                <Eye size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto pb-20">

            {/* HEADER */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Wallet className="text-blue-600" />
                        Personal Financial Intelligence
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded text-xs font-bold uppercase tracking-wide">
                            {profile.name_period_sp1_cont1}
                        </span>
                        <span className="text-sm text-slate-400 font-medium">
                            {profile.startDt_sp1_cont1} — {profile.endDt_sp1_cont1}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest">System of Record</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium justify-end">
                        <Lock size={10} />
                        {profile.type_source_sp1_cont1} (Locked)
                    </div>
                </div>
            </div>

            {/* SECTIONS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-12">

                {/* 1. PERSONAL INCOME PROFILE */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                            <TrendingUp size={16} className="text-emerald-500" /> Income Profile
                        </h3>
                        <span className="text-xs text-slate-400 font-medium">Household Aware</span>
                    </div>
                    <div className="space-y-3 pl-2">
                        <Row label="W-2 Salary Income" value={fmt(profile.salaryW2_sp1_cont1)} />
                        <Row label="K-1 Distribution Income" value={fmt(profile.inc_distribK1_sp1_cont1)} />
                        <Row label="Rental Income (Net)" value={fmt(profile.inc_rentNet_sp1_cont1)} />
                        <Row label="Investment Income" value={fmt(profile.inc_invest_sp1_cont1)} />
                        {profile.inc_spouse_sp1_cont1 > 0 && <Row label="Spousal Income" value={fmt(profile.inc_spouse_sp1_cont1)} />}

                        <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 p-3 rounded-lg">
                            <span className="text-sm font-bold text-slate-700">Total Personal Income</span>
                            <span className="text-lg font-mono font-bold text-emerald-700">{fmt(profile.incGros_hhd_sp1_cont1)}</span>
                        </div>
                        <div className="flex items-start gap-2 text-[10px] text-slate-400 italic px-2">
                            <Info size={12} className="shrink-0 mt-0.5" />
                            Business income intentionally excluded to prevent double counting.
                        </div>
                    </div>
                </div>

                {/* 2. RECURRING EXPENSE PROFILE */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                            <TrendingUp size={16} className="text-red-500 rotate-180" /> Expense Profile
                        </h3>
                        {/* Method Badge */}
                        <span className="text-[10px] font-bold text-slate-500 px-2 py-0.5 bg-slate-100 rounded border border-slate-200">
                            Method: {profile.Living_Expense_Method_sp1_cont1}
                        </span>
                    </div>
                    <div className="space-y-3 pl-2">
                        <Row label="Housing Expense (Annual)" value={fmt(profile.exp_house_sp1_cont1)} />
                        <Row label="Living Expense" value={fmt(profile.exp_living_sp1_cont1)} />
                        <Row label="Consumer Debt Service" value={fmt(profile.dbtService_sp1_cont1)} />
                        <Row label="Other Legal Obligations" value={fmt(profile.ofile_sp1_cont1)} />

                        <div className="pt-3 mt-3 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 p-3 rounded-lg">
                            <span className="text-sm font-bold text-slate-700">Total Personal Outflow</span>
                            <span className="text-lg font-mono font-bold text-red-700">{fmt(profile.expTot_hhd_sp1_cont1)}</span>
                        </div>
                    </div>
                </div>

                {/* 3. CASH FLOW SUMMARY */}
                <div className="lg:col-span-2 bg-blue-50/50 rounded-xl border border-blue-100 p-6 flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide mb-1">Personal Cash Flow Summary</h3>
                        <p className="text-xs text-blue-600/80 max-w-md">
                            Net discretionary cash flow available for global debt service coverage (DSCR) calculations.
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-1">Discretionary Cash Flow</div>
                        <div className="text-3xl font-mono font-bold text-blue-700">
                            {fmt(profile.cfTot_hhd_sp1_cont1)}
                        </div>
                    </div>
                </div>

                {/* 4. LIQUIDITY & NET WORTH */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                            <DollarSign size={16} className="text-indigo-500" /> Net Worth & Liquidity
                        </h3>
                        <button onClick={toggleSensitive} className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                            {showSensitive ? <EyeOff size={12} /> : <Eye size={12} />}
                            {showSensitive ? 'Hide Sensitive' : 'Reveal Sensitive'}
                        </button>
                    </div>
                    <div className="space-y-4 pt-2">
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex justify-between items-center">
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Liquid Assets</div>
                                <div className="text-xs text-slate-400">Cash & Equivalents</div>
                            </div>
                            <div className="text-xl font-mono text-slate-900">
                                <MaskedValue value={fmt(profile.liquidAssets_hhd_sp1_cont1)} visible={showSensitive} />
                            </div>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex justify-between items-center">
                            <div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Total Net Worth</div>
                                <div className="text-xs text-slate-400">Assets - Liabilities</div>
                            </div>
                            <div className="text-xl font-mono text-purple-700 font-bold">
                                <MaskedValue value={fmt(profile.netWorth_hhd_sp1_cont1)} visible={showSensitive} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. CREDIT PROFILE */}
                <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-lg border border-slate-800">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 p-32 bg-blue-600 rounded-full blur-[90px] opacity-20 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex items-center gap-2">
                                <Shield size={18} className="text-blue-400" />
                                <h3 className="text-xs font-bold text-blue-200 uppercase tracking-widest">Credit Profile</h3>
                            </div>
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-200 rounded text-[10px] font-mono border border-blue-500/30">
                                REGULATORY SAFE
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Credit Score</div>
                                <div className="text-4xl font-bold tracking-tight text-white mb-2">
                                    <MaskedValue value={profile.crbScore_sp1_cont1} visible={showSensitive} />
                                </div>
                                <div className="text-xs text-blue-300 font-medium">
                                    Range: {profile.crbScore_range_sp1_cont1}
                                </div>
                            </div>
                            <div className="text-right space-y-3">
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase mb-0.5">Report Date</div>
                                    <div className="text-sm font-mono">{profile.crbScore_date_sp1_cont1}</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-slate-400 uppercase mb-0.5">Consent Status</div>
                                    <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                                        <CheckCircle size={10} /> Active
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

// Internal Row Component
const Row = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm py-1 hover:bg-slate-50 px-2 -mx-2 rounded transition-colors group">
        <span className="text-slate-600 font-medium group-hover:text-slate-900">{label}</span>
        <span className="font-mono text-slate-700 font-bold">{value}</span>
    </div>
);

export default PersonalFinancialIntelligence;
