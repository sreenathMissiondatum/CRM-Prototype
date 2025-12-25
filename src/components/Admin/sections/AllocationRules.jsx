
import React, { useState, useMemo, useEffect } from 'react';
import {
    Plus, Search, Filter, MoreVertical,
    GitBranch, ArrowRight, Layers, ShieldCheck,
    AlertCircle, CheckCircle, GripVertical, X,
    DollarSign, TrendingDown, Info, AlertTriangle,
    PieChart
} from 'lucide-react';

const RuleBuilderModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        priority: 1,
        conditions: [{ field: 'Loan Program', operator: 'equals', value: '' }],
        allocations: [{ fund: 'Affordable Housing Fund I', percentage: 100 }],
        status: 'Draft'
    });

    // Mock Capital Sources with Cost Data
    const availableFunds = [
        { name: 'Affordable Housing Fund I', cost: 2.5, available: 4250000 },
        { name: 'Small Biz Growth Fund', cost: 0.0, available: 1200000 }, // Grant
        { name: 'Green Energy Catalyst', cost: 4.5, available: 7500000 },
        { name: 'Emergency Relief Pool', cost: 0.0, available: 0 },
        { name: 'Commercial Debt Facility', cost: 6.25, available: 15000000 }
    ];

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                name: '',
                priority: 1,
                conditions: [{ field: 'Loan Program', operator: 'equals', value: '' }],
                allocations: [{ fund: 'Affordable Housing Fund I', percentage: 100 }],
                status: 'Draft'
            });
        }
    }, [initialData, isOpen]);

    // Calculate Economic Impact
    const economics = useMemo(() => {
        let totalPercent = 0;
        let weightedCost = 0;
        let fundsInvolved = 0;
        let lowCostExhausted = false;

        formData.allocations.forEach(alloc => {
            const fund = availableFunds.find(f => f.name === alloc.fund);
            if (fund) {
                totalPercent += parseFloat(alloc.percentage) || 0;
                weightedCost += (fund.cost * (parseFloat(alloc.percentage) || 0)) / 100;
                fundsInvolved++;

                // Check for exhaustion of cheap capital
                if (fund.cost < 2.0 && fund.available < 100000) {
                    lowCostExhausted = true;
                }
            }
        });

        return {
            totalPercent,
            blendedCost: weightedCost,
            fundsCount: fundsInvolved,
            isHighSubsidy: weightedCost < 1.0,
            lowCostExhausted
        };
    }, [formData.allocations]);

    const handleConditionChange = (idx, field, value) => {
        const newConditions = [...formData.conditions];
        newConditions[idx] = { ...newConditions[idx], [field]: value };
        setFormData({ ...formData, conditions: newConditions });
    };

    const addCondition = () => {
        setFormData({
            ...formData,
            conditions: [...formData.conditions, { field: 'Loan Program', operator: 'equals', value: '' }]
        });
    };

    const removeCondition = (idx) => {
        const newConditions = formData.conditions.filter((_, i) => i !== idx);
        setFormData({ ...formData, conditions: newConditions });
    };

    const handleAllocationChange = (idx, field, value) => {
        const newAllocations = [...formData.allocations];
        newAllocations[idx] = { ...newAllocations[idx], [field]: value };
        setFormData({ ...formData, allocations: newAllocations });
    };

    const addAllocation = () => {
        setFormData({
            ...formData,
            allocations: [...formData.allocations, { fund: 'Affordable Housing Fund I', percentage: 0 }]
        });
    };

    const removeAllocation = (idx) => {
        const newAllocations = formData.allocations.filter((_, i) => i !== idx);
        setFormData({ ...formData, allocations: newAllocations });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {initialData ? 'Edit Allocation Rule' : 'New Allocation Rule'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Define automated capital routing logic</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT PANEL: RULE BUILDER */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8 border-r border-slate-100">
                        {/* Basic Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Rule Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                    placeholder="e.g. Small Business Priority"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div className="w-1/3">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                    <input
                                        type="number"
                                        value={formData.priority}
                                        onChange={e => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                    />
                                </div>
                                <div className="w-1/3">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* CONDITIONS */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                                    <GitBranch size={16} className="text-blue-500" />
                                    IF Matches
                                </h3>
                                <button onClick={addCondition} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                    <Plus size={12} /> Add Condition
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.conditions.map((cond, idx) => (
                                    <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-lg border border-slate-100">
                                        <select
                                            value={cond.field}
                                            onChange={e => handleConditionChange(idx, 'field', e.target.value)}
                                            className="px-2 py-1.5 text-sm border border-slate-200 rounded outline-none w-1/3"
                                        >
                                            <option>Loan Program</option>
                                            <option>Geography</option>
                                            <option>Loan Amount</option>
                                            <option>Risk Rating</option>
                                        </select>
                                        <select
                                            value={cond.operator}
                                            onChange={e => handleConditionChange(idx, 'operator', e.target.value)}
                                            className="px-2 py-1.5 text-sm border border-slate-200 rounded outline-none w-1/4"
                                        >
                                            <option value="equals">equals</option>
                                            <option value="contains">contains</option>
                                            <option value="greater than">greater than</option>
                                            <option value="less than">less than</option>
                                        </select>
                                        <input
                                            type="text"
                                            value={cond.value}
                                            onChange={e => handleConditionChange(idx, 'value', e.target.value)}
                                            className="flex-1 px-2 py-1.5 text-sm border border-slate-200 rounded outline-none"
                                            placeholder="Value..."
                                        />
                                        <button onClick={() => removeCondition(idx)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ALLOCATIONS */}
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                                    <Layers size={16} className="text-purple-500" />
                                    THEN Allocate
                                </h3>
                                <button onClick={addAllocation} className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                                    <Plus size={12} /> Add Fund
                                </button>
                            </div>
                            <div className="space-y-3">
                                {formData.allocations.map((alloc, idx) => (
                                    <div key={idx} className="flex gap-3 items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                                        <div className="flex-1">
                                            <select
                                                value={alloc.fund}
                                                onChange={e => handleAllocationChange(idx, 'fund', e.target.value)}
                                                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded outline-none"
                                            >
                                                {availableFunds.map(f => (
                                                    <option key={f.name} value={f.name}>{f.name} ({f.cost}%)</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-24 relative">
                                            <input
                                                type="number"
                                                value={alloc.percentage}
                                                onChange={e => handleAllocationChange(idx, 'percentage', e.target.value)}
                                                className="w-full pl-2 pr-6 py-1.5 text-sm border border-slate-200 rounded outline-none font-bold text-right"
                                                placeholder="0"
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                                        </div>
                                        <button onClick={() => removeAllocation(idx)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Validation Bar */}
                            <div className="mt-4 flex items-center justify-between text-sm">
                                <span className="text-slate-500">Total Allocation</span>
                                <span className={`font-bold ${economics.totalPercent === 100 ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {economics.totalPercent}%
                                </span>
                            </div>
                            {economics.totalPercent !== 100 && (
                                <p className="text-xs text-red-500 mt-1 text-right">Must equal 100%</p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: PREVIEW */}
                    <div className="w-[350px] bg-slate-50 p-6 overflow-y-auto">
                        <div className="sticky top-0">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6 flex items-center gap-2">
                                <PieChart size={16} className="text-slate-500" />
                                Economic Impact
                            </h3>

                            {/* COST CARD */}
                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm mb-6">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    Blended Allocation Cost
                                    <Info size={12} className="text-slate-400" title="Effective cost of capital for loans funded via this rule" />
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-slate-900 font-mono">
                                        {economics.blendedCost.toFixed(2)}%
                                    </span>
                                    {economics.isHighSubsidy && (
                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                                            Subsidized
                                        </span>
                                    )}
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Funds Involved</span>
                                        <span className="font-medium text-slate-900">{economics.fundsCount}</span>
                                    </div>
                                    <div className="flex justify-between text-xs text-slate-500">
                                        <span>Highest Rate</span>
                                        <span className="font-medium text-slate-900">
                                            {Math.max(...formData.allocations.map(a => {
                                                const f = availableFunds.find(fund => fund.name === a.fund);
                                                return f ? f.cost : 0;
                                            })).toFixed(2)}%
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* WARNINGS */}
                            <div className="space-y-3">
                                {economics.isHighSubsidy && (
                                    <div className="flex gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                        <TrendingDown size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs font-bold text-indigo-800">High Subsidy Allocation</div>
                                            <p className="text-xs text-indigo-600 mt-1 leading-snug">
                                                This rule heavily utilizes grant/low-cost capital. Ensure this aligns with impact goals.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {economics.lowCostExhausted && (
                                    <div className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                        <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-xs font-bold text-amber-800">Low-Cost Capital Strain</div>
                                            <p className="text-xs text-amber-600 mt-1 leading-snug">
                                                One or more low-cost funds in this rule are near exhaustion.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <p className="text-xs text-slate-400 text-center leading-relaxed">
                                    This preview updates in real-time as you adjust allocation percentages.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl z-10">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onSave(formData); onClose(); }}
                        disabled={economics.totalPercent !== 100}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                    >
                        <CheckCircle size={16} />
                        {initialData ? 'Save Changes' : 'Create Rule'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const AllocationRules = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState(null);

    // ----------------------------------------------------------------------
    // MOCK DATA
    // ----------------------------------------------------------------------
    const [rules, setRules] = useState([
        {
            id: 'RULE-001',
            name: 'Standard Affordable Housing Blend',
            priority: 1,
            conditions: [
                { field: 'Loan Program', operator: 'equals', value: 'Affordable Housing' },
                { field: 'Geography', operator: 'equals', value: 'NY, NJ, CT' }
            ],
            allocations: [
                { fund: 'Affordable Housing Fund I', percentage: 60 },
                { fund: 'Green Energy Catalyst', percentage: 40 }
            ],
            status: 'Active'
        },
        {
            id: 'RULE-002',
            name: 'Small Biz Microloan',
            priority: 2,
            conditions: [
                { field: 'Loan Program', operator: 'equals', value: 'Small Business' },
                { field: 'Loan Amount', operator: 'less than', value: '$50,000' }
            ],
            allocations: [
                { fund: 'Small Biz Growth Fund', percentage: 100 }
            ],
            status: 'Active'
        },
        {
            id: 'RULE-003',
            name: 'Disaster Relief Override',
            priority: 0, // High priority
            conditions: [
                { field: 'Tag', operator: 'contains', value: 'Disaster Relief' }
            ],
            allocations: [
                { fund: 'Emergency Relief Pool', percentage: 100 }
            ],
            status: 'Draft'
        }
    ]);

    const [filterStatus, setFilterStatus] = useState('All');

    // Helper for visual logic
    const getStatusColor = (status) => {
        return status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
            : 'bg-slate-100 text-slate-500 border-slate-200';
    };

    const handleOpenModal = (rule = null) => {
        setEditingRule(rule);
        setIsModalOpen(true);
    };

    const handleSaveRule = (data) => {
        if (editingRule) {
            setRules(prev => prev.map(r => r.id === editingRule.id ? { ...r, ...data } : r));
        } else {
            const newId = `RULE-00${rules.length + 1}`;
            setRules(prev => [...prev, { id: newId, ...data }]);
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Allocation Rules</h1>
                    <p className="text-slate-500 mt-1">Define logic for automated capital distribution</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Create Rule</span>
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search rules..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Rules List */}
            <div className="space-y-4">
                {rules.map((rule) => (
                    <div
                        key={rule.id}
                        onClick={() => handleOpenModal(rule)}
                        className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 hover:border-blue-300 transition-colors group cursor-pointer"
                    >
                        {/* Top Row: Header & Status */}
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 text-slate-500 rounded-lg cursor-grab active:cursor-grabbing" onClick={e => e.stopPropagation()}>
                                    <GripVertical size={16} />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{rule.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-mono text-slate-400">{rule.id}</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs text-slate-500 font-medium">Priority {rule.priority}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(rule.status)}`}>
                                    {rule.status}
                                </span>
                                <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                                    <MoreVertical size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Logic Visualization Box */}
                        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 flex flex-col md:flex-row items-start md:items-center gap-4 relative overflow-hidden">
                            {/* IF Conditions */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <GitBranch size={12} /> IF MATCHES
                                </div>
                                <div className="space-y-2">
                                    {rule.conditions.map((cond, idx) => (
                                        <div key={idx} className="flex items-center text-sm">
                                            <span className="font-semibold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 mr-2">{cond.field}</span>
                                            <span className="text-slate-500 italic mr-2">{cond.operator}</span>
                                            <span className="font-medium text-slate-900">{cond.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Arrow Divider */}
                            <div className="hidden md:flex flex-col items-center justify-center px-4 self-stretch border-x border-slate-200 bg-slate-100/50">
                                <ArrowRight size={20} className="text-slate-400" />
                            </div>

                            {/* THEN Allocations */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <Layers size={12} /> THEN ALLOCATE
                                </div>
                                <div className="space-y-2">
                                    {rule.allocations.map((alloc, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-slate-200 shadow-sm">
                                            <span className="text-sm font-medium text-slate-800">{alloc.fund}</span>
                                            <span className="text-sm font-bold text-blue-600">{alloc.percentage}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State / Prompt */}
            {rules.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <ShieldCheck size={48} className="mx-auto text-slate-300 mb-4" />
                    <p>No allocation rules defined.</p>
                </div>
            )}

            {/* Modal */}
            <RuleBuilderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveRule}
                initialData={editingRule}
            />
        </div>
    );
};

export default AllocationRules;
