import React, { useState } from 'react';
import {
    Lock, Calendar, DollarSign, Wallet, TrendingUp,
    FileText, Plus, ChevronDown, CheckCircle, AlertCircle,
    Download, History, Shield, Info, Edit3
} from 'lucide-react';

const ContactFinancialsTab = ({ contact, readOnly = false }) => {
    // --- Mock State for Financial Profiles ---
    const [statements, setStatements] = useState([
        {
            id: 'stmt-2024',
            periodName: 'Calendar 2024',
            status: 'Draft', // Draft | Locked
            sourceType: 'Stated',
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            asOfDate: '2024-03-15',
            income: {
                w2: 125000,
                k1: 45000,
                rental: 12000,
                investment: 5000,
                spousal: 0
            },
            expenses: {
                housing: 2400 * 12,
                living: 3500 * 12, // Standard
                debtService: 1200 * 12,
                other: 5000
            },
            assets: {
                liquid: 85000,
                retirement: 250000,
                realEstate: 450000,
                businessValue: 0
            },
            liabilities: {
                mortgage: 320000,
                loans: 15000,
                cards: 4200
            }
        }
    ]);

    const [activeStmtId, setActiveStmtId] = useState('stmt-2024');
    const activeStmt = statements.find(s => s.id === activeStmtId) || statements[0];
    const isLocked = activeStmt.status === 'Locked' || readOnly;

    // --- Helpers ---
    const formatCurrency = (val) => {
        if (val === undefined || val === null || val === '') return '$0';
        return `$${val.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    };

    const handleUpdate = (section, field, value) => {
        if (isLocked) return;
        setStatements(prev => prev.map(s => {
            if (s.id === activeStmtId) {
                if (section === 'meta') {
                    return { ...s, [field]: value };
                } else {
                    return { ...s, [section]: { ...s[section], [field]: parseFloat(value) || 0 } };
                }
            }
            return s;
        }));
    };

    // --- Derivations ---
    const totalIncome = Object.values(activeStmt.income).reduce((a, b) => a + b, 0);
    const totalExpenses = Object.values(activeStmt.expenses).reduce((a, b) => a + b, 0);
    const discretionary = totalIncome - totalExpenses;
    const totalAssets = Object.values(activeStmt.assets).reduce((a, b) => a + b, 0);
    const totalLiabilities = Object.values(activeStmt.liabilities).reduce((a, b) => a + b, 0);
    const netWorth = totalAssets - totalLiabilities;

    // --- Components ---
    const SnapshotTile = ({ label, value, subtext, color = "blue" }) => (
        <div className={`p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-${color}-500`}>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{label}</div>
            <div className="text-2xl font-bold text-slate-800 font-mono tracking-tight">{formatCurrency(value)}</div>
            {subtext && <div className="text-xs text-slate-400 mt-1">{subtext}</div>}
        </div>
    );

    const GridRow = ({ label, value, onChange, prefix = "$" }) => (
        <div className="grid grid-cols-12 gap-4 items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-2 -mx-2 rounded">
            <div className="col-span-5 text-sm font-medium text-slate-700">{label}</div>
            <div className="col-span-3">
                {/* Source or Tags could go here */}
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200 uppercase tracking-wide">
                    Stated
                </span>
            </div>
            <div className="col-span-4 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">{prefix}</span>
                <input
                    type="number"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isLocked}
                    className={`w-full pl-6 pr-3 py-1.5 text-right text-sm font-mono border ${isLocked ? 'bg-slate-50 border-slate-200 text-slate-500' : 'bg-white border-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-400'} rounded-md transition-all outline-none`}
                    placeholder="0"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-300">

            {/* --- Section 1: Header --- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <Wallet size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Personal Financial Profile</h2>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span>System of Record</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="flex items-center gap-1">
                                {activeStmt.status === 'Locked' ? <Lock size={10} /> : <Edit3 size={10} />}
                                {activeStmt.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Period Selector */}
                    <div className="relative">
                        <select
                            value={activeStmtId}
                            onChange={(e) => setActiveStmtId(e.target.value)}
                            className="appearance-none pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:border-slate-300 focus:ring-2 focus:ring-blue-100 outline-none cursor-pointer"
                        >
                            {statements.map(s => <option key={s.id} value={s.id}>{s.periodName} ({s.status})</option>)}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>

                    <div className="h-8 w-px bg-slate-200 mx-1" />

                    {!isLocked && (
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors">
                            <Lock size={14} /> Lock Statement
                        </button>
                    )}
                    {isLocked && (
                        <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors">
                            <History size={14} /> History
                        </button>
                    )}
                </div>
            </div>

            {/* --- Section 2: Metadata (Compact) --- */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm px-6 py-4 grid grid-cols-12 gap-6">
                <div className="col-span-3">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Statement Period</label>
                    <input
                        type="text"
                        value={activeStmt.periodName}
                        onChange={(e) => handleUpdate('meta', 'periodName', e.target.value)}
                        disabled={isLocked}
                        className="w-full text-sm font-bold text-slate-700 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none pb-1"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Source Type</label>
                    <select
                        value={activeStmt.sourceType}
                        onChange={(e) => handleUpdate('meta', 'sourceType', e.target.value)}
                        disabled={isLocked}
                        className="w-full text-sm font-medium text-slate-700 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none pb-1"
                    >
                        <option>Verified</option>
                        <option>Stated</option>
                        <option>Credit</option>
                        <option>Verbal</option>
                    </select>
                </div>
                <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Start Date</label>
                    <input
                        type="date"
                        value={activeStmt.startDate}
                        onChange={(e) => handleUpdate('meta', 'startDate', e.target.value)}
                        disabled={isLocked}
                        className="w-full text-sm font-medium text-slate-700 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none pb-1"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">End Date</label>
                    <input
                        type="date"
                        value={activeStmt.endDate}
                        onChange={(e) => handleUpdate('meta', 'endDate', e.target.value)}
                        disabled={isLocked}
                        className="w-full text-sm font-medium text-slate-700 bg-transparent border-b border-slate-200 focus:border-blue-500 outline-none pb-1"
                    />
                </div>
                <div className="col-span-3 flex justify-end items-end">
                    <span className="text-xs text-slate-400 font-medium">Fiscal Year 2024</span>
                </div>
            </div>

            {/* --- Section 3: Snapshot --- */}
            <div className="grid grid-cols-5 gap-4">
                <SnapshotTile label="Total Income" value={totalIncome} color="emerald" />
                <SnapshotTile label="Total Expenses" value={totalExpenses} color="red" />
                <SnapshotTile label="Cashflow (Disc.)" value={discretionary} color="blue" subtext="Annual Discretionary" />
                <SnapshotTile label="Liquid Assets" value={activeStmt.assets.liquid} color="indigo" />
                <SnapshotTile label="Net Worth" value={netWorth} color="purple" />
            </div>

            <div className="grid grid-cols-12 gap-8">
                {/* --- Section 4: Income --- */}
                <div className="col-span-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                            <TrendingUp size={16} className="text-emerald-500" /> Annual Income
                        </h3>
                        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                            {formatCurrency(totalIncome)}
                        </span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <GridRow label="W-2 Wages & Salary" value={activeStmt.income.w2} onChange={(v) => handleUpdate('income', 'w2', v)} />
                        <GridRow label="K-1 Distributions" value={activeStmt.income.k1} onChange={(v) => handleUpdate('income', 'k1', v)} />
                        <GridRow label="Rental Net Income" value={activeStmt.income.rental} onChange={(v) => handleUpdate('income', 'rental', v)} />
                        <GridRow label="Investment Income" value={activeStmt.income.investment} onChange={(v) => handleUpdate('income', 'investment', v)} />
                        <GridRow label="Spousal Support / Other" value={activeStmt.income.spousal} onChange={(v) => handleUpdate('income', 'spousal', v)} />
                    </div>
                </div>

                {/* --- Section 5: Expenses --- */}
                <div className="col-span-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                            <TrendingUp size={16} className="text-red-500 rotate-180" /> Annual Expenses
                        </h3>
                        <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2 py-1 rounded">
                            {formatCurrency(totalExpenses)}
                        </span>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                        <GridRow label="Housing (Rent/Mortgage)" value={activeStmt.expenses.housing} onChange={(v) => handleUpdate('expenses', 'housing', v)} />
                        <GridRow label="Living Expenses (Annual)" value={activeStmt.expenses.living} onChange={(v) => handleUpdate('expenses', 'living', v)} />
                        <GridRow label="Debt Service (Consumer)" value={activeStmt.expenses.debtService} onChange={(v) => handleUpdate('expenses', 'debtService', v)} />
                        <GridRow label="Other Obligations" value={activeStmt.expenses.other} onChange={(v) => handleUpdate('expenses', 'other', v)} />
                    </div>
                </div>
            </div>

            {/* --- Section 6: Assets & Liabilities (Brief) --- */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">Balance Sheet Summary</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-12">
                    {/* Assets */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end border-b border-slate-100 pb-2 mb-2">
                            <span className="text-sm font-bold text-slate-700">Total Assets</span>
                            <span className="text-sm font-mono font-bold text-indigo-700">{formatCurrency(totalAssets)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Liquid / Cash Equiv.</span>
                            <span className="font-mono">{formatCurrency(activeStmt.assets.liquid)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Retirement Accounts</span>
                            <span className="font-mono">{formatCurrency(activeStmt.assets.retirement)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Real Estate</span>
                            <span className="font-mono">{formatCurrency(activeStmt.assets.realEstate)}</span>
                        </div>
                    </div>

                    {/* Liabilities */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-end border-b border-slate-100 pb-2 mb-2">
                            <span className="text-sm font-bold text-slate-700">Total Liabilities</span>
                            <span className="text-sm font-mono font-bold text-red-700">{formatCurrency(totalLiabilities)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Mortgages</span>
                            <span className="font-mono">{formatCurrency(activeStmt.liabilities.mortgage)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Installment Loans</span>
                            <span className="font-mono">{formatCurrency(activeStmt.liabilities.loans)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Credit Cards</span>
                            <span className="font-mono">{formatCurrency(activeStmt.liabilities.cards)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Section 7: Credit Snapshot (Read Only) --- */}
            <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-32 bg-blue-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
                <div className="relative z-10 flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Shield size={18} className="text-blue-400" />
                            <h3 className="text-xs font-bold text-blue-200 uppercase tracking-widest">Credit Profile</h3>
                        </div>
                        <div className="text-4xl font-bold tracking-tight">720</div>
                        <div className="text-sm text-blue-200 font-medium">TransUnion • Score Range: 640-740</div>
                    </div>
                    <div className="text-right space-y-1">
                        <div className="text-xs font-bold text-blue-200 uppercase">Consent Date</div>
                        <div className="text-sm font-mono text-white">2023-01-15</div>
                        <div className="text-[10px] text-blue-300">Expires in 14 days</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ContactFinancialsTab;
