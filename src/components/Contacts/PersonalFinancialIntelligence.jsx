import React, { useState, useEffect } from 'react';
import {
    Wallet, Lock, Shield, Calendar, Info,
    ChevronDown, TrendingUp, DollarSign,
    CheckCircle, AlertTriangle, Eye, EyeOff,
    Building2, Activity, PieChart, Landmark
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

    if (!profile) return <div className="p-12 text-center text-slate-400 font-medium">Loading Financial Intelligence...</div>;

    // Helper: Currency Formatter
    const fmt = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);

    // Helper: Masker
    const MaskedValue = ({ value, visible, label, large = false }) => {
        if (visible) return <span className={`font-mono font-bold text-slate-900 ${large ? 'tracking-tight' : ''}`}>{value}</span>;
        return (
            <div className="flex items-center gap-2 select-none group cursor-pointer" onClick={toggleSensitive} title="Click to Reveal">
                <span className="text-slate-300 tracking-widest text-sm font-bold">••••••</span>
                <Eye size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
        );
    };

    return (
        <div className="animate-in fade-in duration-500 bg-slate-50/50 min-h-screen pb-20 -mx-6 -my-6">

            {/* A. EXECUTIVE SNAPSHOT STRIP (STICKY) */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm px-8 py-4 transition-all duration-300">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-slate-900 rounded-lg text-white shadow-lg">
                            <Wallet size={20} />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Financial Intelligence</h2>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium font-mono">
                                <span>{profile.name_period_sp1_cont1}</span>
                                <span className="text-slate-300">|</span>
                                <span>{profile.startDt_sp1_cont1} — {profile.endDt_sp1_cont1}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        {/* Key Metrics Hero */}
                        <div className="text-right">
                            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">Discretionary Cash Flow</div>
                            <div className="text-xl font-mono font-bold text-emerald-600">
                                {fmt(profile.cfTot_hhd_sp1_cont1)}
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-100"></div>
                        <div className="text-right">
                            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">Total Income</div>
                            <div className="text-lg font-mono font-bold text-slate-700">
                                {fmt(profile.incGros_hhd_sp1_cont1)}
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-0.5">Total Outflow</div>
                            <div className="text-lg font-mono font-bold text-slate-700">
                                {fmt(profile.expTot_hhd_sp1_cont1)}
                            </div>
                        </div>
                        <div className="h-8 w-px bg-slate-100"></div>
                        <div className="text-right group cursor-pointer" onClick={toggleSensitive}>
                            <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider mb-0.5 flex items-center justify-end gap-1">
                                Net Worth
                                {showSensitive ? <EyeOff size={10} /> : <Eye size={10} />}
                            </div>
                            <div className="text-lg font-mono font-bold text-purple-700">
                                <MaskedValue value={fmt(profile.netWorth_hhd_sp1_cont1)} visible={showSensitive} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-8 py-8 space-y-8">

                {/* Status Bar */}
                <div className="flex justify-between items-center px-1">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 shadow-sm flex items-center gap-2">
                            <Shield size={12} className="text-emerald-500" />
                            System of Record
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium px-2">
                            <Lock size={10} />
                            {profile.type_source_sp1_cont1} (Finalized)
                        </div>
                    </div>
                </div>

                {/* B. FINANCIAL NARRATIVE GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COLUMN 1: INCOME PROFILE */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                <TrendingUp size={16} className="text-emerald-500" /> Income Profile
                            </h3>
                            <Info size={14} className="text-slate-300" title="Business income excluded to avoid double counting." />
                        </div>
                        <div className="p-5 flex-1 space-y-4">
                            <div className="space-y-3">
                                <Row label="W-2 Salary Income" value={fmt(profile.salaryW2_sp1_cont1)} />
                                <Row label="K-1 Distribution Income" value={fmt(profile.inc_distribK1_sp1_cont1)} />
                                <Row label="Rental Income (Net)" value={fmt(profile.inc_rentNet_sp1_cont1)} />
                                <Row label="Investment Income" value={fmt(profile.inc_invest_sp1_cont1)} />
                                <div className={profile.inc_spouse_sp1_cont1 === 0 ? "opacity-40" : ""}>
                                    <Row label="Spousal Income" value={fmt(profile.inc_spouse_sp1_cont1)} />
                                </div>
                            </div>

                            <div className="pt-4 mt-auto border-t border-slate-100">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Personal Income</span>
                                    <span className="text-xl font-mono font-bold text-slate-800">{fmt(profile.incGros_hhd_sp1_cont1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 2: EXPENSE PROFILE */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                <Activity size={16} className="text-rose-500" /> Expense Profile
                            </h3>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold border border-slate-200">
                                {profile.Living_Expense_Method_sp1_cont1}
                            </span>
                        </div>
                        <div className="p-5 flex-1 space-y-4">
                            <div className="space-y-3">
                                <Row label="Housing Expense (Annual)" value={fmt(profile.exp_house_sp1_cont1)} />
                                <Row label="Living Expense" value={fmt(profile.exp_living_sp1_cont1)} />
                                <Row label="Consumer Debt Service" value={fmt(profile.dbtService_sp1_cont1)} />
                                <Row label="Other Legal Obligations" value={fmt(profile.ofile_sp1_cont1)} />
                            </div>

                            <div className="pt-4 mt-auto border-t border-slate-100">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Total Personal Outflow</span>
                                    <span className="text-xl font-mono font-bold text-rose-700">{fmt(profile.expTot_hhd_sp1_cont1)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 3: CASH FLOW & STRENGTH */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/30">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                <Landmark size={16} className="text-blue-500" /> Strength & Liquidity
                            </h3>
                        </div>
                        <div className="p-5 flex-1 flex flex-col gap-6">

                            {/* Hero CF */}
                            <div className="bg-blue-50/60 rounded-lg p-4 border border-blue-100 text-center">
                                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Discretionary Cash Flow</div>
                                <div className="text-3xl font-mono font-bold text-blue-700">{fmt(profile.cfTot_hhd_sp1_cont1)}</div>
                                <p className="text-[10px] text-blue-400 mt-2 font-medium">Available for Global DSCR</p>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between items-center group cursor-pointer" onClick={toggleSensitive}>
                                    <div>
                                        <div className="text-xs font-bold text-slate-700">Liquid Assets</div>
                                        <div className="text-[10px] text-slate-400 font-medium">Cash & Equivalents</div>
                                    </div>
                                    <div className="text-lg font-mono font-medium text-slate-900">
                                        <MaskedValue value={fmt(profile.liquidAssets_hhd_sp1_cont1)} visible={showSensitive} />
                                    </div>
                                </div>
                                <div className="h-px bg-slate-100"></div>
                                <div className="flex justify-between items-center group cursor-pointer" onClick={toggleSensitive}>
                                    <div>
                                        <div className="text-xs font-bold text-slate-700">Net Worth</div>
                                        <div className="text-[10px] text-slate-400 font-medium">Assets - Liabilities</div>
                                    </div>
                                    <div className="text-lg font-mono font-bold text-purple-700">
                                        <MaskedValue value={fmt(profile.netWorth_hhd_sp1_cont1)} visible={showSensitive} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* C. CREDIT PROFILE PANEL (ISOLATED) */}
                <div className="relative group rounded-xl overflow-hidden shadow-lg bg-slate-900 border border-slate-800">
                    <div className="absolute top-0 right-0 p-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

                    <div className="relative z-10 px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-8">

                        {/* Left: Identity */}
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-800 rounded-lg border border-slate-700 text-blue-400 shadow-inner">
                                <Shield size={24} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white tracking-wide">Consumer Credit Profile</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded flex items-center gap-1.5 uppercase tracking-wider">
                                        <CheckCircle size={10} /> Regulatory Safe
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        ID: {profile.crbScore_consentTime_sp1_cont1 || 'REF-8821'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Middle: Score */}
                        <div className="flex items-center gap-8 border-l border-slate-800 pl-8">
                            <div className="text-center group cursor-pointer" onClick={toggleSensitive} title="Click to Reveal Score">
                                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">FICO Score</div>
                                <div className="text-5xl font-mono font-bold text-white tracking-tighter shadow-black drop-shadow-lg">
                                    <MaskedValue value={profile.crbScore_sp1_cont1} visible={showSensitive} large />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <div className="flex justify-between gap-4 text-xs font-medium text-blue-200">
                                    <span className="opacity-60">Band</span>
                                    <span>{profile.crbScore_range_sp1_cont1}</span>
                                </div>
                                <div className="flex justify-between gap-4 text-xs font-medium text-blue-200">
                                    <span className="opacity-60">Report Date</span>
                                    <span className="font-mono">{profile.crbScore_date_sp1_cont1}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Actions/Status */}
                        <div className="hidden md:block pl-8 border-l border-slate-800 text-right">
                            <div className="text-xs text-slate-500 leading-relaxed max-w-xs">
                                Credit data sourced via approved bureau integration.
                                Values used strictly for underwriting calibration.
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

// Internal Row Component - Refined
const Row = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm py-1.5 border-b border-dashed border-slate-100 last:border-0 hover:bg-slate-50 px-2 -mx-2 rounded transition-colors group">
        <span className="text-slate-600 font-medium group-hover:text-slate-900 transition-colors">{label}</span>
        <span className="font-mono text-slate-700 font-bold">{value}</span>
    </div>
);

export default PersonalFinancialIntelligence;
