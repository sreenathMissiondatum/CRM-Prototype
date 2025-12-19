import React, { useState, useMemo } from 'react';
import {
    FileText, RefreshCw, Lock, AlertCircle, TrendingUp, TrendingDown,
    Minus, Calendar, ArrowRight, ShieldCheck, CheckCircle2, History, X,
    DollarSign, Search, Filter
} from 'lucide-react';
import { createPortal } from 'react-dom';

// --- Reusable UI Components ---

const KPIBox = ({ label, value, trend, trendValue, source, status = 'neutral' }) => {
    let trendColor = 'text-slate-400';
    let TrendIcon = Minus;
    if (trend === 'up') { trendColor = 'text-emerald-600'; TrendIcon = TrendingUp; }
    if (trend === 'down') { trendColor = 'text-red-500'; TrendIcon = TrendingDown; }

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-full relative overflow-hidden">
            <div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</div>
                <div className="flex items-end gap-2 mb-1">
                    <span className={`text-2xl font-bold ${status === 'good' ? 'text-emerald-700' : status === 'warning' ? 'text-amber-600' : 'text-slate-900'}`}>
                        {value}
                    </span>
                    {trend && (
                        <div className={`flex items-center text-xs font-bold ${trendColor} mb-1.5`}>
                            <TrendIcon size={14} className="mr-0.5" />
                            {trendValue}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
                <ShieldCheck size={12} className="text-slate-300" />
                {source}
            </div>
        </div>
    );
};

const ProfileBadge = ({ type }) => {
    if (type.includes('Tax Return')) return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">Tax Return</span>;
    if (type.includes('QuickBooks')) return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">QuickBooks</span>;
    if (type.includes('Pro Forma')) return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">Pro Forma</span>;
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">{type}</span>;
};

// --- Mock Data (Account Level Profiles) ---
const MOCK_PROFILES = [
    {
        id: 'prof_2024_qb',
        name: '2024 QuickBooks YTD (Annualized)',
        period: 'Jan 1, 2024 - Dec 31, 2024',
        source: 'QuickBooks API',
        type: 'QuickBooks',
        status: 'Locked',
        lockedDate: 'Oct 15, 2025',
        isAnnualized: true,
        revenue: 2450000,
        ebitda: 420000,
        dscr: 1.45,
        leverage: 2.8,
        noi: 510000,
        fingerprint: 'A94F...'
    },
    {
        id: 'prof_2023_tax',
        name: '2023 Tax Return',
        period: 'Jan 1, 2023 - Dec 31, 2023',
        source: 'OCR Extraction',
        type: 'Tax Return',
        status: 'Locked',
        lockedDate: 'Apr 10, 2024',
        isAnnualized: false,
        revenue: 2100000,
        ebitda: 380000,
        dscr: 1.32,
        leverage: 3.1,
        noi: 450000,
        fingerprint: 'B22D...'
    },
    {
        id: 'prof_2022_tax',
        name: '2022 Tax Return',
        period: 'Jan 1, 2022 - Dec 31, 2022',
        source: 'OCR Extraction',
        type: 'Tax Return',
        status: 'Locked',
        lockedDate: 'Mar 15, 2023',
        isAnnualized: false,
        revenue: 1950000,
        ebitda: 310000,
        dscr: 1.15,
        leverage: 3.5,
        noi: 390000,
        fingerprint: 'C11A...'
    },
    {
        id: 'prof_proforma_2025',
        name: '2025 Pro Forma',
        period: 'Jan 1, 2025 - Dec 31, 2025',
        source: 'Manual Entry',
        type: 'Pro Forma',
        status: 'Draft',
        lockedDate: '-',
        isAnnualized: false,
        revenue: 2800000,
        ebitda: 550000,
        dscr: 1.65,
        leverage: 2.4,
        noi: 620000,
        fingerprint: 'D55E...'
    }
];

// --- Main Component ---
const FinancialsTab = ({ loan }) => {
    // State
    const [activeProfileId, setActiveProfileId] = useState('prof_2024_qb');
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

    // Derived Data
    const activeProfile = useMemo(() => MOCK_PROFILES.find(p => p.id === activeProfileId) || MOCK_PROFILES[0], [activeProfileId]);

    // Comparison for trends (simplified logic: compare to previous year/profile)
    const previousProfile = useMemo(() => {
        const idx = MOCK_PROFILES.findIndex(p => p.id === activeProfileId);
        return idx < MOCK_PROFILES.length - 1 ? MOCK_PROFILES[idx + 1] : null;
    }, [activeProfileId]);

    const getTrend = (key) => {
        if (!previousProfile) return { dir: 'flat', val: '-' };
        const curr = activeProfile[key];
        const prev = previousProfile[key];
        const diff = ((curr - prev) / prev) * 100;
        return {
            dir: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat',
            val: `${Math.abs(diff).toFixed(1)}%`
        };
    };

    const revTrend = getTrend('revenue');
    const ebitdaTrend = getTrend('ebitda');

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">

            {/* 1. Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Financial Overview</h2>
                    <p className="text-sm text-slate-500 mt-1 max-w-2xl">
                        This loan is underwritten using data from the selected Financial Profile below.
                        Metrics are derived normalized values mapped from the Account level.
                    </p>
                </div>
            </div>

            {/* 2. Active Profile Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl opacity-50"></div>

                <div className="flex justify-between items-start relative z-10">
                    <div className="flex gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                            <FileText size={24} />
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-slate-900">{activeProfile.name}</h3>
                                {activeProfile.status === 'Locked' && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100">
                                        <Lock size={10} /> Locked
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-slate-400" /> {activeProfile.period}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="flex items-center gap-1.5">
                                    <ShieldCheck size={14} className="text-slate-400" /> Source: <span className="font-medium text-slate-700">{activeProfile.source}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsSelectModalOpen(true)}
                        className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg text-sm hover:border-blue-400 hover:text-blue-600 transition-all shadow-sm flex items-center gap-2"
                    >
                        <RefreshCw size={16} /> Replace Profile
                    </button>
                </div>
            </div>

            {/* 3. Underwriting Snapshot (Grid) */}
            <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-blue-600" /> Underwriting Snapshot
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Revenue */}
                    <KPIBox
                        label="Total Revenue"
                        value={formatCurrency(activeProfile.revenue)}
                        trend={revTrend.dir}
                        trendValue={revTrend.val}
                        source="Income Statement"
                    />

                    {/* EBITDA */}
                    <KPIBox
                        label="EBITDA"
                        value={formatCurrency(activeProfile.ebitda)}
                        trend={ebitdaTrend.dir}
                        trendValue={ebitdaTrend.val}
                        source="Derived Metric"
                    />

                    {/* DSCR (Big) */}
                    <div className="md:col-span-1 lg:col-span-1 bg-slate-900 text-white p-5 rounded-xl shadow-lg flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={64} />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Global DSCR</div>
                            <div className="text-4xl font-bold text-white mb-1">{activeProfile.dscr}x</div>
                            <div className="text-xs font-medium text-emerald-400">Strong Coverage</div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                            <ShieldCheck size={12} /> Debt Service Schedule
                        </div>
                    </div>

                    {/* Leverage */}
                    <KPIBox
                        label="Leverage Ratio"
                        value={`${activeProfile.leverage}x`}
                        status={activeProfile.leverage > 4 ? 'warning' : 'good'}
                        source="Balance Sheet"
                    />
                </div>
            </div>

            {/* 4. Profile History Table */}
            <div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2 py-2">
                    <History size={16} className="text-slate-400" /> Profile History
                </h3>
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Profile Name</th>
                                <th className="px-6 py-3">Period</th>
                                <th className="px-6 py-3">Source</th>
                                <th className="px-6 py-3 text-right">Revenue</th>
                                <th className="px-6 py-3 text-right">DSCR</th>
                                <th className="px-6 py-3 w-24"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_PROFILES.map(profile => (
                                <tr key={profile.id} className={`hover:bg-slate-50 transition-colors ${activeProfileId === profile.id ? 'bg-blue-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 flex items-center gap-2">
                                            {profile.name}
                                            {activeProfileId === profile.id && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{profile.period}</td>
                                    <td className="px-6 py-4"><ProfileBadge type={profile.type} /></td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-700">{formatCurrency(profile.revenue)}</td>
                                    <td className="px-6 py-4 text-right font-mono text-slate-700">{profile.dscr}x</td>
                                    <td className="px-6 py-4 text-right">
                                        {activeProfileId !== profile.id && (
                                            <button
                                                onClick={() => setActiveProfileId(profile.id)}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
                                            >
                                                Select
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Portal */}
            <SelectProfileModal
                isOpen={isSelectModalOpen}
                onClose={() => setIsSelectModalOpen(false)}
                profiles={MOCK_PROFILES}
                onSelect={(id) => {
                    setActiveProfileId(id);
                    setIsSelectModalOpen(false);
                }}
            />

        </div>
    );
};

// --- Selection Modal Component ---
const SelectProfileModal = ({ isOpen, onClose, profiles, onSelect }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">

                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Select Financial Profile</h3>
                        <p className="text-xs text-slate-500">Choose an account-level profile to use for underwriting this loan.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Filters (Visual Only) */}
                <div className="px-6 py-3 border-b border-slate-200 flex gap-2">
                    <div className="relative flex-1">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input type="text" placeholder="Search profiles..." className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all" />
                    </div>
                    <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 text-sm hover:bg-slate-50">
                        <Filter size={14} />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {profiles.map(profile => (
                        <button
                            key={profile.id}
                            onClick={() => onSelect(profile.id)}
                            className="w-full text-left p-4 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group flex justify-between items-center"
                        >
                            <div className="flex gap-4 items-center">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${profile.type.includes('Tax') ? 'bg-blue-50 border-blue-100 text-blue-600' :
                                        profile.type.includes('QuickBooks') ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                            'bg-purple-50 border-purple-100 text-purple-600'
                                    }`}>
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 text-sm">{profile.name}</div>
                                    <div className="text-xs text-slate-500 font-mono mt-0.5">{profile.period}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <ArrowRight size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                    <span className="text-xs text-slate-400">Can't find a profile? Go to Account View to create new profiles.</span>
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Cancel</button>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default FinancialsTab;
