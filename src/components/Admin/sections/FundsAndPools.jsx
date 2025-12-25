import React, { useState, useEffect, useMemo } from 'react';
import {
    Plus, Search, Filter, MoreVertical,
    PieChart, DollarSign, Briefcase, AlertTriangle,
    TrendingUp, Wallet, ArrowUpRight, Shield, X, CheckCircle, Info
} from 'lucide-react';

const FundPoolModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Revolving Loan Fund',
        description: '',
        restrictions: '',
        status: 'Draft',
        // Mock linked commitments (IDs)
        linkedCommitmentIds: []
    });

    // Mock Pool of Available Commitments to Link
    const availableCommitments = [
        { id: 'CMT-2023-001', funder: 'Kresge Foundation', amount: 5000000, rate: 1.0, type: 'PRI', endDate: '2028-01-15' },
        { id: 'CMT-2023-002', funder: 'Chase Community Dev', amount: 250000, rate: 0.0, type: 'Grant', endDate: '2024-03-01' },
        { id: 'CMT-2022-015', funder: 'Ford Foundation', amount: 2000000, rate: 3.5, type: 'Debt', endDate: '2025-06-01' },
        { id: 'CMT-2024-001', funder: 'Wells Fargo', amount: 10000000, rate: 4.25, type: 'Debt', endDate: '2027-09-30' },
    ];

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                linkedCommitmentIds: initialData.linkedCommitmentIds || []
            });
        } else {
            setFormData({
                name: '',
                type: 'Revolving Loan Fund',
                description: '',
                restrictions: '',
                status: 'Draft',
                linkedCommitmentIds: []
            });
        }
    }, [initialData, isOpen]);

    // Calculate Fund Economics
    const economics = useMemo(() => {
        const linked = availableCommitments.filter(c => formData.linkedCommitmentIds.includes(c.id));

        if (linked.length === 0) return {
            totalSize: 0,
            composition: { grant: 0, pri: 0, debt: 0 },
            effectiveCost: 0,
            expiryDate: '-'
        };

        const totalSize = linked.reduce((sum, c) => sum + c.amount, 0);

        // Composition
        const grants = linked.filter(c => c.type === 'Grant').reduce((sum, c) => sum + c.amount, 0);
        const pris = linked.filter(c => c.type === 'PRI').reduce((sum, c) => sum + c.amount, 0);
        const debts = linked.filter(c => c.type === 'Debt').reduce((sum, c) => sum + c.amount, 0);

        // Weighted Average Cost
        // (Amount * Rate) + ... / Total Amount
        const weightedCost = linked.reduce((sum, c) => sum + (c.amount * c.rate), 0);
        const effectiveCost = totalSize > 0 ? (weightedCost / totalSize) : 0;

        // Earliest Expiry
        const sortedDates = [...linked].map(c => c.endDate).sort();
        const earliestExpiry = sortedDates[0];

        return {
            totalSize,
            composition: {
                grant: (grants / totalSize) * 100,
                pri: (pris / totalSize) * 100,
                debt: (debts / totalSize) * 100
            },
            effectiveCost,
            expiryDate: earliestExpiry
        };
    }, [formData.linkedCommitmentIds]);

    const handleToggleCommitment = (id) => {
        setFormData(prev => {
            const current = prev.linkedCommitmentIds;
            if (current.includes(id)) {
                return { ...prev, linkedCommitmentIds: current.filter(cid => cid !== id) };
            } else {
                return { ...prev, linkedCommitmentIds: [...current, id] };
            }
        });
    };

    const isHighCost = economics.effectiveCost > 3.0; // Threshold

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-800">
                        {initialData ? 'Edit Fund Pool' : 'Create Fund Pool'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8 flex-1 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* LEFT COLUMN: SETUP */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Fund Setup</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fund Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                        placeholder="e.g. Small Business Growth Fund"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Fund Structure</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                                    >
                                        <option value="Revolving Loan Fund">Revolving Loan Fund</option>
                                        <option value="Grant Pool">Grant Pool</option>
                                        <option value="Blended Capital">Blended Capital</option>
                                        <option value="Guarantee Pool">Guarantee Pool</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Restrictions / Mandate</label>
                                    <input
                                        type="text"
                                        value={formData.restrictions}
                                        onChange={e => setFormData({ ...formData, restrictions: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                                        placeholder="e.g. Minority-Owned Businesses in Detroit"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Linked Capital Commitments</h4>
                                <div className="space-y-2 border border-slate-200 rounded-xl overflow-hidden">
                                    {availableCommitments.map(c => {
                                        const isSelected = formData.linkedCommitmentIds.includes(c.id);
                                        return (
                                            <div
                                                key={c.id}
                                                onClick={() => handleToggleCommitment(c.id)}
                                                className={`flex items-center justify-between p-3 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50/50' : 'hover:bg-slate-50'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                                                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-slate-900">{c.funder}</div>
                                                        <div className="text-xs text-slate-500">{c.type} • ${(c.amount / 1000000).toFixed(1)}M @ {c.rate}%</div>
                                                    </div>
                                                </div>
                                                <div className="text-xs font-mono text-slate-400">{c.id}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-slate-400 mt-2">Select commitments to capitalize this fund.</p>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: ECONOMICS */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                                    <TrendingUp size={16} className="text-blue-500" />
                                    Fund Economics
                                </h3>
                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                    Auto-Calculated
                                </span>
                            </div>

                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-6">
                                {/* Total Size */}
                                <div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Fund Size</div>
                                    <div className="text-2xl font-bold text-slate-900 font-mono">
                                        ${economics.totalSize.toLocaleString()}
                                    </div>
                                </div>

                                {/* Capital Composition */}
                                <div>
                                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Capital Composition</div>
                                    <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-200">
                                        {economics.composition.grant > 0 && (
                                            <div style={{ width: `${economics.composition.grant}%` }} className="bg-blue-400 h-full" title="Grant" />
                                        )}
                                        {economics.composition.pri > 0 && (
                                            <div style={{ width: `${economics.composition.pri}%` }} className="bg-indigo-500 h-full" title="PRI" />
                                        )}
                                        {economics.composition.debt > 0 && (
                                            <div style={{ width: `${economics.composition.debt}%` }} className="bg-violet-600 h-full" title="Debt" />
                                        )}
                                    </div>
                                    <div className="flex gap-4 mt-2 text-xs text-slate-600">
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-400" />{economics.composition.grant.toFixed(0)}% Grant</div>
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" />{economics.composition.pri.toFixed(0)}% PRI</div>
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-600" />{economics.composition.debt.toFixed(0)}% Debt</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/60">
                                    {/* Effective Cost */}
                                    <div>
                                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                            Effective Cost
                                            <Info size={12} className="text-slate-400" title="Weighted Average Cost of Capital" />
                                        </div>
                                        <div className={`text-xl font-bold font-mono ${isHighCost ? 'text-amber-600' : 'text-slate-900'}`}>
                                            {economics.effectiveCost.toFixed(2)}%
                                        </div>
                                    </div>

                                    {/* Expiry Horizon */}
                                    <div>
                                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Expiry Horizon</div>
                                        <div className="text-xl font-bold text-slate-900 font-mono">
                                            {economics.expiryDate}
                                        </div>
                                        <div className="text-xs text-slate-400 mt-0.5">Earliest commitment expiry</div>
                                    </div>
                                </div>

                                {/* WARNING STATE */}
                                {isHighCost && (
                                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                                        <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <div className="text-sm font-semibold text-amber-800">High cost of capital</div>
                                            <div className="text-xs text-amber-700 mt-1">
                                                Effective cost is above 3.00%. Review pricing model for loans originated from this pool.
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => { onSave(formData); onClose(); }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                    >
                        <CheckCircle size={16} />
                        {initialData ? 'Update' : 'Create'} Fund
                    </button>
                </div>
            </div>
        </div>
    );
};

const FundsAndPools = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFund, setEditingFund] = useState(null);

    // ----------------------------------------------------------------------
    // MOCK DATA
    // ----------------------------------------------------------------------
    const [funds, setFunds] = useState([
        {
            id: 'POOL-A',
            name: 'Affordable Housing Fund I',
            type: 'Revolving Loan Fund',
            commitments: 3,
            totalCapital: '$15,000,000',
            available: '$4,250,000',
            deployed: '$10,750,000',
            restrictions: 'Multifamily < 80% AMI',
            status: 'Active',
            expiry: '2030-12-31',
            linkedCommitmentIds: ['CMT-2023-001', 'CMT-2024-001']
        },
        {
            id: 'POOL-B',
            name: 'Small Biz Growth Fund',
            type: 'Grant Pool',
            commitments: 1,
            totalCapital: '$5,000,000',
            available: '$1,200,000',
            deployed: '$3,800,000',
            restrictions: 'Minority-Owned Business',
            status: 'Active',
            expiry: '2026-06-30',
            linkedCommitmentIds: ['CMT-2023-002']
        },
        {
            id: 'POOL-C',
            name: 'Green Energy Catalyst',
            type: 'Blended Capital',
            commitments: 2,
            totalCapital: '$8,000,000',
            available: '$7,500,000',
            deployed: '$500,000',
            restrictions: 'Renewable Projects only',
            status: 'Draft',
            expiry: '-',
            linkedCommitmentIds: ['CMT-2022-015', 'CMT-2024-001']
        },
        {
            id: 'POOL-D',
            name: 'Emergency Relief Pool',
            type: 'Grant Pool',
            commitments: 1,
            totalCapital: '$2,000,000',
            available: '$0',
            deployed: '$2,000,000',
            restrictions: 'Disaster Recovery',
            status: 'Fully Deployed',
            expiry: '2024-01-01',
            linkedCommitmentIds: []
        }
    ]);

    const [filterType, setFilterType] = useState('All');

    // Filter Logic
    const filteredFunds = filterType === 'All'
        ? funds
        : funds.filter(f => f.type.includes(filterType));

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Draft': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Fully Deployed': return 'bg-slate-100 text-slate-500 border-slate-200';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    const handleOpenModal = (fund = null) => {
        setEditingFund(fund);
        setIsModalOpen(true);
    };

    const handleSaveFund = (data) => {
        if (editingFund) {
            setFunds(prev => prev.map(f => f.id === editingFund.id ? { ...f, ...data } : f));
        } else {
            const newId = `POOL-${String.fromCharCode(65 + funds.length)}`; // POOL-E, etc.
            setFunds(prev => [...prev, { id: newId, totalCapital: '$0', available: '$0', deployed: '$0', commitments: data.linkedCommitmentIds.length, ...data }]);
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Funds & Pools</h1>
                    <p className="text-slate-500 mt-1">Manage internal capital pools and allocation rules</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Create Fund</span>
                </button>
            </div>

            {/* DASHBOARD CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Total Utilization</div>
                    <div className="flex items-end justify-between mt-1">
                        <div className="text-2xl font-bold text-slate-900">72.4%</div>
                        <TrendingUp size={20} className="text-emerald-500 mb-1" />
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                        <div className="bg-blue-600 h-full w-[72%] rounded-full"></div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Total Capital</div>
                    <div className="flex items-end justify-between mt-1">
                        <div className="text-2xl font-bold text-slate-900">$30.0M</div>
                        <Wallet size={20} className="text-blue-500 mb-1" />
                    </div>
                    <div className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                        <span className="text-emerald-600 font-medium">+5.2%</span> vs last qtr
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Loans Funded</div>
                    <div className="flex items-end justify-between mt-1">
                        <div className="text-2xl font-bold text-slate-900">142</div>
                        <Briefcase size={20} className="text-purple-500 mb-1" />
                    </div>
                    <div className="text-xs text-slate-500 mt-2">Across 4 active pools</div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Alerts</div>
                    <div className="flex items-end justify-between mt-1">
                        <div className="text-2xl font-bold text-slate-900">2</div>
                        <AlertTriangle size={20} className="text-amber-500 mb-1" />
                    </div>
                    <div className="text-xs text-amber-600 font-medium mt-2">1 Fund near capacity</div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search funds..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            className="text-sm border-none focus:ring-0 text-slate-600 font-medium bg-transparent cursor-pointer"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="All">All Types</option>
                            <option value="Revolving">Revolving Funds</option>
                            <option value="Grant">Grant Pools</option>
                            <option value="Blended">Blended Capital</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fund Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total Size</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Available</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Restrictions</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredFunds.map((fund) => (
                                <tr
                                    key={fund.id}
                                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                    onClick={() => handleOpenModal(fund)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {fund.name}
                                            </span>
                                            <span className="text-xs text-slate-500">ID: {fund.id} • {fund.commitments} Sources</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-700">{fund.type}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-bold text-slate-900">{fund.totalCapital}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-medium text-emerald-600">{fund.available}</span>
                                            <span className="text-xs text-slate-400">Deployed: {fund.deployed}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600 truncate">
                                            <Shield size={14} className="text-slate-400 shrink-0" />
                                            <span className="truncate">{fund.restrictions}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(fund.status)}`}>
                                            {fund.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(fund); }}
                                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Edit Fund"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-xs text-slate-500">
                    <div>Showing {filteredFunds.length} results</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <FundPoolModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveFund}
                initialData={editingFund}
            />
        </div>
    );
};

export default FundsAndPools;
