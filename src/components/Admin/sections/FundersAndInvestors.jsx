
import React, { useState } from 'react';
import {
    Plus, Search, Filter, MoreVertical,
    Wallet, Building2, Landmark, Briefcase, // Icons for Funder Types
    ArrowUpRight, Users, Calendar, AlertCircle
} from 'lucide-react';
import FunderDetail from './FunderDetail';

const FundersAndInvestors = () => {
    // ----------------------------------------------------------------------
    // MOCK DATA
    // ----------------------------------------------------------------------
    const [funders] = useState([
        {
            id: 'F-001',
            name: 'Kresge Foundation',
            type: 'Foundation',
            tier: 'Strategic',
            activeCommitments: 3,
            totalCapital: '$15,000,000',
            reportingFreq: 'Quarterly',
            status: 'Active',
            lastAudit: '2023-11-15'
        },
        {
            id: 'F-002',
            name: 'State Economic Dev Corp',
            type: 'Government',
            tier: 'Repeat',
            activeCommitments: 1,
            totalCapital: '$5,000,000',
            reportingFreq: 'Annual',
            status: 'Active',
            lastAudit: '2023-09-01'
        },
        {
            id: 'F-003',
            name: 'Chase Community Dev',
            type: 'Bank (CRA)',
            tier: 'Strategic',
            activeCommitments: 5,
            totalCapital: '$25,000,000',
            reportingFreq: 'Monthly',
            status: 'Active',
            lastAudit: '2023-10-30'
        },
        {
            id: 'F-004',
            name: 'Impact Capital Partners',
            type: 'Impact Investor',
            tier: 'One-time',
            activeCommitments: 1,
            totalCapital: '$2,000,000',
            reportingFreq: 'Quarterly',
            status: 'Inactive',
            lastAudit: '2022-12-01'
        },
        {
            id: 'F-005',
            name: 'Ford Foundation',
            type: 'Foundation',
            tier: 'Strategic',
            activeCommitments: 2,
            totalCapital: '$10,000,000',
            reportingFreq: 'Bi-Annual',
            status: 'Active',
            lastAudit: '2023-08-15'
        }
    ]);

    // State for Detail View
    const [selectedFunder, setSelectedFunder] = useState(null);

    const [filterType, setFilterType] = useState('All');

    // Filter Logic
    const getFilteredFunders = () => {
        if (filterType === 'All') return funders;
        return funders.filter(f => f.type.includes(filterType));
    };

    const filteredFunders = getFilteredFunders();

    // Helper for icons
    const getTypeIcon = (type) => {
        if (type.includes('Foundation')) return <Building2 size={16} className="text-purple-600" />;
        if (type.includes('Government')) return <Landmark size={16} className="text-slate-600" />;
        if (type.includes('Bank')) return <Wallet size={16} className="text-blue-600" />;
        return <Briefcase size={16} className="text-emerald-600" />;
    };

    const getStatusColor = (status) => {
        return status === 'Active'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
            : 'bg-slate-100 text-slate-500 border-slate-200';
    };

    const getTierColor = (tier) => {
        switch (tier) {
            case 'Strategic': return 'text-purple-700 bg-purple-50 border-purple-100';
            case 'Repeat': return 'text-blue-700 bg-blue-50 border-blue-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    // Render Detail View
    if (selectedFunder) {
        return <FunderDetail funder={selectedFunder} onBack={() => setSelectedFunder(null)} />;
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Funders & Investors</h1>
                    <p className="text-slate-500 mt-1">Organizations providing capital to your institution</p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                    <Plus size={18} />
                    <span>Add Funder</span>
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search funders..."
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
                            <option value="Foundation">Foundations</option>
                            <option value="Government">Government</option>
                            <option value="Bank">Banks</option>
                            <option value="Impact">Impact Investors</option>
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
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider w-[25%]">Funder Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Relationship</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Commitments</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total Capital</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reporting</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredFunders.map((funder) => (
                                <tr
                                    key={funder.id}
                                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                    onClick={() => setSelectedFunder(funder)}
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                                {funder.name}
                                            </span>
                                            <span className="text-xs text-slate-500">ID: {funder.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getTypeIcon(funder.type)}
                                            <span className="text-sm text-slate-700">{funder.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTierColor(funder.tier)}`}>
                                            {funder.tier}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-medium text-slate-700">{funder.activeCommitments}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-bold text-slate-900">{funder.totalCapital}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                            <Calendar size={14} className="text-slate-400" />
                                            {funder.reportingFreq}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(funder.status)}`}>
                                            {funder.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                                onClick={(e) => { e.stopPropagation(); setSelectedFunder(funder); }}
                                            >
                                                <ArrowUpRight size={16} />
                                            </button>
                                            <button
                                                className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                                                title="More Actions"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-xs text-slate-500">
                    <div>Showing {filteredFunders.length} results</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FundersAndInvestors;
