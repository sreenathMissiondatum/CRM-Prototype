import React, { useState } from 'react';
import { CreditCard, Plus, Trash2, Info, Coins, LayoutDashboard, List, Lock, Unlock } from 'lucide-react';
import Section from '../../Shared/Section';

const LoanIntentSection = ({
    isOpen,
    onToggle,
    formData, // { fundingScenarios: [...] }
    onUpdateScenarios // (scenarios) => ...
}) => {
    const [activeTab, setActiveTab] = useState('details');

    // --- Constants ---
    const USE_OF_FUNDS_OPTIONS = [
        'Working Capital',
        'Equipment',
        'Real Estate',
        'Debt Refinance',
        'Inventory',
        'Leasehold Improvements',
        'Acquisition',
        'Other'
    ];

    // --- Derived Values ---
    const scenarios = formData.fundingScenarios || [];

    // Calculate totals across all scenarios
    const totals = scenarios.reduce((acc, sc) => {
        const amt = parseFloat(sc.amount) || 0;
        const owner = parseFloat(sc.ownerContribution) || 0;
        const other = parseFloat(sc.otherFunding) || 0;
        return {
            authority: acc.authority + amt,
            ownerContribution: acc.ownerContribution + owner,
            otherFunding: acc.otherFunding + other,
            projectCost: acc.projectCost + (amt + owner + other)
        };
    }, { authority: 0, ownerContribution: 0, otherFunding: 0, projectCost: 0 });

    const allLocked = scenarios.length > 0 && scenarios.every(s => s.status === 'Locked');
    const readinessStatus = scenarios.length === 0 ? 'Empty' : (allLocked ? 'Ready' : 'Draft');

    // --- Handlers ---
    const addScenario = () => {
        const newScenario = {
            id: Date.now(),
            name: `Scenario ${scenarios.length + 1}`,
            amount: 0,
            term: 36,
            useOfFunds: [],
            useOfFundsDetail: '',
            ownerContribution: 0,
            otherFunding: 0,
            status: 'Draft'
        };
        onUpdateScenarios([...scenarios, newScenario]);
    };

    const updateScenario = (id, field, value) => {
        const updated = scenarios.map(s => {
            if (s.id !== id) return s;
            return { ...s, [field]: value };
        });
        onUpdateScenarios(updated);
    };

    const toggleUseOfFunds = (id, option) => {
        const sc = scenarios.find(s => s.id === id);
        if (!sc) return;
        const current = sc.useOfFunds || [];
        const newUse = current.includes(option)
            ? current.filter(o => o !== option)
            : [...current, option];
        updateScenario(id, 'useOfFunds', newUse);
    };

    const deleteScenario = (id) => {
        onUpdateScenarios(scenarios.filter(s => s.id !== id));
    };

    const toggleLock = (id) => {
        const sc = scenarios.find(s => s.id === id);
        if (!sc) return;
        const newStatus = sc.status === 'Locked' ? 'Draft' : 'Locked';
        updateScenario(id, 'status', newStatus);
    };

    return (
        <Section title="Funding Scenarios (Draft)" icon={CreditCard} isOpen={isOpen} onToggle={onToggle}>

            {/* Informational Banner */}
            <div className="mb-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg flex items-start gap-3">
                <Info className="text-blue-500 mt-0.5 shrink-0" size={20} />
                <div>
                    <h4 className="text-sm font-bold text-blue-900">Indicative Information Only</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        Funding scenarios are non-binding drafts. Final loan programs must be assigned and validated before conversion to a Loan Application.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-6 bg-slate-100 p-1 rounded-lg w-fit">
                <button
                    onClick={() => setActiveTab('details')}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'details' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <List size={14} /> Details
                </button>
                <button
                    onClick={() => setActiveTab('summary')}
                    className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all ${activeTab === 'summary' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    <LayoutDashboard size={14} /> Summary
                </button>
            </div>

            {activeTab === 'summary' ? (
                /* SUMMARY VIEW (Read Only) */
                <div className="bg-slate-50 rounded-xl p-8 border border-slate-200">
                    <div className="grid grid-cols-3 gap-12 text-center">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Requested Authority</div>
                            <div className="text-3xl font-black text-slate-800">${totals.authority.toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Active Scenarios</div>
                            <div className="text-3xl font-black text-slate-800">{scenarios.length}</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Readiness</div>
                            <div className={`text-2xl font-bold inline-flex items-center gap-2 px-4 py-1 rounded-full ${readinessStatus === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                {readinessStatus === 'Ready' ? <Lock size={18} /> : <Unlock size={18} />}
                                {readinessStatus}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* DETAILS VIEW (Editable) */
                <div className="space-y-6">
                    {scenarios.map((sc, idx) => {
                        const isLocked = sc.status === 'Locked';
                        const projectCost = (parseFloat(sc.amount) || 0) + (parseFloat(sc.ownerContribution) || 0) + (parseFloat(sc.otherFunding) || 0);

                        return (
                            <div key={sc.id} className={`border rounded-xl shadow-sm bg-white overflow-hidden group transition-all ${isLocked ? 'border-emerald-200 ring-1 ring-emerald-100' : 'border-slate-200'}`}>
                                {/* Header */}
                                <div className={`px-4 py-3 border-b flex justify-between items-center ${isLocked ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${isLocked ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-500 border border-slate-200'}`}>
                                            {idx + 1}
                                        </div>
                                        <input
                                            type="text"
                                            value={sc.name}
                                            disabled={isLocked}
                                            onChange={e => updateScenario(sc.id, 'name', e.target.value)}
                                            className="font-bold text-slate-700 bg-transparent hover:bg-white focus:bg-white border border-transparent focus:border-blue-300 rounded px-2 py-0.5 outline-none transition-colors w-1/2 disabled:opacity-70 disabled:hover:bg-transparent"
                                            placeholder="Scenario Name"
                                        />
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Requested</div>
                                            <div className="flex items-center justify-end gap-1">
                                                <span className="text-slate-400 text-sm">$</span>
                                                <input
                                                    type="number"
                                                    value={sc.amount}
                                                    disabled={isLocked}
                                                    onChange={e => updateScenario(sc.id, 'amount', e.target.value)}
                                                    className="font-bold text-slate-900 bg-transparent text-right outline-none border-b border-slate-300 focus:border-blue-500 w-28 disabled:border-none disabled:bg-transparent"
                                                />
                                            </div>
                                        </div>

                                        <div className="pl-4 border-l border-slate-200 flex items-center gap-2">
                                            <button
                                                onClick={() => toggleLock(sc.id)}
                                                className={`p-2 rounded-full transition-colors ${isLocked ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
                                                title={isLocked ? "Unlock Scenario" : "Lock for Conversion"}
                                            >
                                                {isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                                            </button>
                                            {!isLocked && (
                                                <button
                                                    onClick={() => deleteScenario(sc.id)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className={`p-5 space-y-6 ${isLocked ? 'opacity-70 pointer-events-none grayscale-[0.3]' : ''}`}>
                                    {/* Terms & Use */}
                                    <div className="grid grid-cols-12 gap-6">
                                        <div className="col-span-3">
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Term (Mos)</label>
                                            <input
                                                type="number"
                                                value={sc.term}
                                                onChange={e => updateScenario(sc.id, 'term', e.target.value)}
                                                className="w-full text-sm font-bold text-slate-700 border border-slate-200 rounded-lg px-3 py-2 focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                        <div className="col-span-9">
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Use of Funds</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {USE_OF_FUNDS_OPTIONS.map(opt => (
                                                    <button
                                                        key={opt}
                                                        onClick={() => toggleUseOfFunds(sc.id, opt)}
                                                        className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-all ${sc.useOfFunds?.includes(opt) ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                value={sc.useOfFundsDetail}
                                                onChange={e => updateScenario(sc.id, 'useOfFundsDetail', e.target.value)}
                                                className="w-full text-xs border border-slate-200 rounded px-2 py-1.5 focus:border-blue-400 outline-none placeholder:text-slate-400"
                                                placeholder="Specific details..."
                                            />
                                        </div>
                                    </div>

                                    {/* Funding Structure */}
                                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                        <h5 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                            <Coins size={14} /> Project Capital Stack
                                        </h5>
                                        <div className="grid grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Requested Amount</label>
                                                <div className="font-bold text-slate-700">${parseFloat(sc.amount || 0).toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Owner Contrib.</label>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-slate-400 text-sm">$</span>
                                                    <input
                                                        type="number"
                                                        value={sc.ownerContribution}
                                                        onChange={e => updateScenario(sc.id, 'ownerContribution', e.target.value)}
                                                        className="w-full text-sm font-bold bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Other Funding</label>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-slate-400 text-sm">$</span>
                                                    <input
                                                        type="number"
                                                        value={sc.otherFunding}
                                                        onChange={e => updateScenario(sc.id, 'otherFunding', e.target.value)}
                                                        className="w-full text-sm font-bold bg-transparent border-b border-slate-300 focus:border-blue-500 outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-end">
                                            <span className="text-xs text-slate-400 font-medium">Total Scenario Cost</span>
                                            <span className="text-sm font-black text-slate-800">${projectCost.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <button onClick={addScenario} className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 font-bold hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                        <Plus size={20} /> Add Funding Scenario
                    </button>
                </div>
            )}
        </Section>
    );
};

export default LoanIntentSection;
