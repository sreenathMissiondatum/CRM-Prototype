import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Trash2, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';
import Section from '../../Shared/Section';
import Field from '../../Shared/Field';
import SystemField from '../../Shared/SystemField';

const LoanIntentSection = ({
    isOpen,
    onToggle,
    formData, // expect formData.intent object
    handleChange, // (field, value) => ...
    onUpdatePrograms, // (programs) => ...
    totalProjectCost
}) => {
    // --- Local State for UI ---
    const [isEditingTotal, setIsEditingTotal] = useState(false);

    // --- Derived Values ---
    const totalAmount = parseFloat(formData.amount) || 0;
    const programs = formData.programs || []; // [{ id, name, amount, percent }]
    const allocatedAmount = programs.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);
    const remainingAmount = totalAmount - allocatedAmount;
    const isBalanced = Math.abs(remainingAmount) < 1; // Tolerance for floating point

    // --- Handlers ---

    // 1. Update Total Amount (Triggers Proportional Rebalance)
    const handleTotalChange = (newTotal) => {
        const val = parseFloat(newTotal) || 0;
        handleChange('amount', val);

        if (programs.length > 0) {
            const ratio = val / (totalAmount || 1);
            const newPrograms = programs.map(p => ({
                ...p,
                amount: Math.round(p.amount * ratio)
            }));

            // Fix rounding error on first program
            const newSum = newPrograms.reduce((sum, p) => sum + p.amount, 0);
            const diff = val - newSum;
            if (newPrograms.length > 0) {
                newPrograms[0].amount += diff;
            }

            onUpdatePrograms(newPrograms);
        }
    };

    // 2. Add Program (Triggers Equal Resplit)
    const addProgram = () => {
        const count = programs.length + 1;
        const baseAmount = Math.floor(totalAmount / count);
        const remainder = totalAmount - (baseAmount * count);

        // Nuke existing allocations and resplit equally (per prompt "Default Split Strategy")
        const newPrograms = [
            ...programs.map(p => ({ ...p, amount: baseAmount })),
            {
                id: Date.now(),
                name: `Program ${count}`,
                amount: baseAmount,
                percent: 0 // Recalc later 
            }
        ];

        // Add remainder to first
        newPrograms[0].amount += remainder;

        onUpdatePrograms(newPrograms);
    };

    // 3. Delete Program (Redistribute proportionally)
    const deleteProgram = (id) => {
        if (programs.length <= 1) return; // Prevent deleting last program

        const progToDelete = programs.find(p => p.id === id);
        const amountToRedistribute = progToDelete.amount;
        const remainingProgs = programs.filter(p => p.id !== id);

        // Distribute to first remaining (Simplest "proportional" logic for now, or just dump to primary)
        // Prompt says "Redistribute deleted amount proportionally". 
        // For simplicity: Add to first program for now to ensure balance.
        if (remainingProgs.length > 0) {
            remainingProgs[0].amount += amountToRedistribute;
        }

        onUpdatePrograms(remainingProgs);
    };

    // 4. Manual Edit of Program Amount
    const handleProgramAmountChange = (id, newAmount) => {
        const val = parseFloat(newAmount) || 0;
        const newPrograms = programs.map(p => p.id === id ? { ...p, amount: val } : p);
        onUpdatePrograms(newPrograms);
    };

    return (
        <Section title="Loan Intent & Funding" icon={CreditCard} isOpen={isOpen} onToggle={onToggle}>

            {/* 1. AUTHORITATIVE TOTAL HEADER */}
            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Requested Authority</label>
                    {!isEditingTotal && (
                        <button onClick={() => setIsEditingTotal(true)} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                            Edit Total
                        </button>
                    )}
                </div>
                {isEditingTotal ? (
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-slate-400">$</span>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={e => handleTotalChange(e.target.value)}
                            onBlur={() => setIsEditingTotal(false)}
                            autoFocus
                            className="text-3xl font-bold text-slate-900 bg-transparent border-b-2 border-slate-300 focus:border-blue-600 outline-none w-full"
                        />
                    </div>
                ) : (
                    <div className="text-3xl font-bold text-slate-900">
                        ${totalAmount.toLocaleString()}
                    </div>
                )}
            </div>

            {/* 2. PROGRAM ALLOCATION TABLE */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-bold text-slate-800">Program Allocations</h4>
                    <button
                        onClick={addProgram}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors"
                    >
                        <Plus size={14} strokeWidth={3} />
                        Add Program
                    </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 text-left w-[40%]">Program</th>
                                <th className="px-4 py-3 text-right">Allocation</th>
                                <th className="px-4 py-3 text-right w-[15%]">%</th>
                                <th className="px-4 py-3 w-[10%]"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {programs.map((prog, idx) => {
                                const percent = totalAmount > 0 ? ((prog.amount / totalAmount) * 100).toFixed(1) : 0;
                                return (
                                    <tr key={prog.id} className="group hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <input
                                                type="text"
                                                value={prog.name}
                                                onChange={(e) => {
                                                    const newProgs = [...programs];
                                                    newProgs[idx].name = e.target.value;
                                                    onUpdatePrograms(newProgs);
                                                }}
                                                className="w-full font-medium text-slate-900 bg-transparent outline-none focus:text-blue-700 placeholder:text-slate-400"
                                                placeholder="Select Program..."
                                            />
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="relative">
                                                <span className="absolute left-0 text-slate-400">$</span>
                                                <input
                                                    type="number"
                                                    value={prog.amount}
                                                    onChange={e => handleProgramAmountChange(prog.id, e.target.value)}
                                                    className={`w-full text-right font-mono font-bold bg-transparent outline-none ${Math.abs(remainingAmount) > 1 ? 'text-amber-600' : 'text-slate-700'}`}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right text-slate-500 font-medium">
                                            {percent}%
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => deleteProgram(prog.id)}
                                                disabled={programs.length === 1}
                                                className="p-1.5 rounded text-slate-400 hover:text-rose-500 hover:bg-rose-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition-all"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-slate-50 border-t border-slate-200 text-xs font-bold">
                            <tr>
                                <td className="px-4 py-2 text-slate-500">TOTAL ALLOCATED</td>
                                <td className={`px-4 py-2 text-right ${isBalanced ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    ${allocatedAmount.toLocaleString()}
                                </td>
                                <td colSpan={2}></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* RECONCILIATION BAR */}
                {!isBalanced && (
                    <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3">
                        <AlertTriangle size={16} className="text-rose-600 mt-0.5 shrink-0" />
                        <div>
                            <div className="text-sm font-bold text-rose-800">Unbalanced Allocation</div>
                            <p className="text-xs text-rose-600 mt-0.5">
                                You have <span className="font-bold">${remainingAmount.toLocaleString()}</span> remaining to allocate.
                                Program amounts must sum exactly to the Total Requested Amount.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* 3. ADDITIONAL DETAILS (Legacy Grid) */}
            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <Field
                    label="Term (Months)"
                    value={formData.term}
                    onChange={v => handleChange('term', v)}
                    type="number"
                    helper="Proposed maturity for primary program."
                />
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Use of Funds</label>
                    <select className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white">
                        <option>Working Capital</option>
                        <option>Equipment</option>
                        <option>Real Estate</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-4 pt-4 border-t border-slate-100">
                <Field label="Owner Contribution" value={formData.ownerContribution} onChange={v => handleChange('ownerContribution', v)} type="number" />
                <Field label="Other Funding" value={formData.otherFunding} onChange={v => handleChange('otherFunding', v)} type="number" />
                <SystemField label="Total Project Cost" value={totalProjectCost} />
            </div>
        </Section>
    );
};

export default LoanIntentSection;
