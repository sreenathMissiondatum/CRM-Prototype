import React, { useState } from 'react';
import {
    Users, User, DollarSign, Wallet,
    TrendingUp, ShieldCheck, AlertCircle,
    ArrowRight, Building2, Car
} from 'lucide-react';
import ExplainabilityTooltip from '../../Shared/ExplainabilityTooltip';

// Helper for currency formatting
const formatCurrency = (val) => {
    if (val === undefined || val === null) return '-';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
};

const MetricCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon size={20} className={color.replace('bg-', 'text-').replace('/10', '-600')} />
            </div>
        </div>
        <div className="mt-2">
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">{title}</div>
            {subtext && <div className="text-xs text-slate-400 mt-1">{subtext}</div>}
        </div>
    </div>
);

const SourceRow = ({ label, amount, source, status }) => (
    <div className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 px-2 -mx-2 rounded transition-colors group">
        <div className="flex items-center gap-3">
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'verified' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
            <div>
                <div className="text-sm font-medium text-slate-700">{label}</div>
                <div className="text-xs text-slate-400">{source}</div>
            </div>
        </div>
        <div className="text-right">
            <div className="text-sm font-mono font-bold text-slate-800">{formatCurrency(amount)}</div>
            <div className={`text-[10px] uppercase font-bold tracking-wider ${status === 'verified' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {status}
            </div>
        </div>
    </div>
);

const PersonalFinancials = ({ profiles, household }) => {
    const [activeTab, setActiveTab] = useState('household'); // 'household' or profile.id

    if (!profiles || !household) return <div className="p-8 text-center text-slate-400">Loading personal profiles...</div>;

    const activeProfile = profiles.find(p => p.id === activeTab);

    return (
        <div className="flex flex-col h-full">

            {/* 1. TOP TABS (Household vs Individuals) */}
            <div className="flex gap-2 mb-6 border-b border-slate-200 px-6 -mx-6">
                <button
                    onClick={() => setActiveTab('household')}
                    className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'household' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    <Users size={16} /> Household Aggregate
                </button>
                {profiles.map(p => (
                    <button
                        key={p.id}
                        onClick={() => setActiveTab(p.id)}
                        className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === p.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <User size={16} /> {p.name}
                    </button>
                ))}
            </div>

            {/* 2. CONTENT AREA */}
            <div className="animate-in fade-in duration-300">
                {activeTab === 'household' ? (
                    <div className="space-y-8">
                        {/* Household Summary */}
                        <div className="grid grid-cols-3 gap-6">
                            <MetricCard
                                title="Global Discretionary Cashflow"
                                value={formatCurrency(household.discretionaryCashflow)}
                                subtext="Total Income - Total Expenses"
                                icon={Wallet}
                                color="bg-emerald-50"
                            />
                            <MetricCard
                                title="Household Income"
                                value={formatCurrency(household.totalHouseholdIncome)}
                                subtext={`Across ${household.ownerCount} guarantors`}
                                icon={DollarSign}
                                color="bg-blue-50"
                            />
                            <MetricCard
                                title="Liquid Assets"
                                value={formatCurrency(household.totalLiquidAssets)}
                                subtext="Cash + Marketable Securities"
                                icon={ShieldCheck}
                                color="bg-indigo-50"
                            />
                        </div>

                        {/* Household Breakdown */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-sm font-bold text-slate-800 mb-4">Household Contribution Analysis</h3>
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-400 uppercase bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-2 font-medium">Guarantor</th>
                                        <th className="px-4 py-2 font-medium text-right">Income</th>
                                        <th className="px-4 py-2 font-medium text-right">Expenses</th>
                                        <th className="px-4 py-2 font-medium text-right">Net Contribution</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {profiles.map(p => {
                                        const income = p.sources.reduce((sum, s) => sum + s.amount, 0);
                                        const expense = p.expenses.reduce((sum, e) => sum + e.amount, 0);
                                        return (
                                            <tr key={p.id}>
                                                <td className="px-4 py-3 font-medium text-slate-700">{p.name}</td>
                                                <td className="px-4 py-3 text-right font-mono text-slate-600">{formatCurrency(income)}</td>
                                                <td className="px-4 py-3 text-right font-mono text-slate-600">{formatCurrency(expense)}</td>
                                                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">+{formatCurrency(income - expense)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    // INDIVIDUAL PROFILE VIEW
                    <div className="grid grid-cols-2 gap-8">
                        {/* Income Sources */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-emerald-500" /> Income Sources
                                </h3>
                                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-bold border border-emerald-100">
                                    {formatCurrency(activeProfile.sources.reduce((s, i) => s + i.amount, 0))} / yr
                                </span>
                            </div>
                            <div className="space-y-1">
                                {activeProfile.sources.map((src, i) => (
                                    <SourceRow key={i} label={src.type} amount={src.amount} source={src.source} status={src.status} />
                                ))}
                            </div>
                        </div>

                        {/* Liabilities / Expenses */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-rose-500 rotate-180" /> Recurring Expenses
                                </h3>
                                <span className="text-xs bg-rose-50 text-rose-700 px-2 py-1 rounded font-bold border border-rose-100">
                                    {formatCurrency(activeProfile.expenses.reduce((s, i) => s + i.amount, 0))} / yr
                                </span>
                            </div>
                            <div className="space-y-1">
                                {activeProfile.expenses.map((exp, i) => (
                                    <SourceRow key={i} label={exp.type} amount={exp.amount} source={exp.source} status={exp.mode === 'verified' ? 'verified' : 'stated'} />
                                ))}
                            </div>
                        </div>

                        {/* Assets Summary */}
                        <div className="col-span-2 bg-slate-50 rounded-xl border border-slate-200 p-6 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Personal Net Worth</h4>
                                <div className="text-3xl font-bold text-slate-900 mt-1">
                                    {formatCurrency(activeProfile.assets.netWorth)}
                                </div>
                            </div>
                            <div className="flex gap-8">
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Liquid Assets</span>
                                    <span className="block text-lg font-mono font-medium text-slate-700">{formatCurrency(activeProfile.assets.liquid)}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-slate-400 uppercase">Cash on Hand</span>
                                    <span className="block text-lg font-mono font-medium text-slate-700">{formatCurrency(activeProfile.assets.cash)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonalFinancials;
