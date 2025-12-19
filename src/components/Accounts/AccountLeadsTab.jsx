import React, { useState } from 'react';
import {
    Search, Filter, Plus, ArrowUpDown, MoreHorizontal,
    Eye, ArrowRightCircle, StickyNote, CircleCheck,
    XCircle, Clock, Banknote
} from 'lucide-react';

const AccountLeadsTab = ({ onAddNote, onViewLead }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Mock Data
    const leads = [
        {
            id: 'LD-2024-001',
            name: 'Equipment Financing - Q1',
            amount: '$45,000',
            purpose: 'Equipment Purchase',
            source: 'Web Inquiry',
            status: 'Qualified',
            owner: 'Sarah Miller',
            createdDate: '2024-01-15'
        },
        {
            id: 'LD-2023-089',
            name: 'Working Capital Need',
            amount: '$20,000',
            purpose: 'Working Capital',
            source: 'Referral (Chamber)',
            status: 'Converted',
            owner: 'Mike Ross',
            createdDate: '2023-11-05',
            loanId: 'LN-2023-882'
        },
        {
            id: 'LD-2023-042',
            name: 'Expansion Loan Inquiry',
            amount: '$150,000',
            purpose: 'Real Estate',
            source: 'Partner Referral',
            status: 'Disqualified',
            owner: 'Sarah Miller',
            createdDate: '2023-08-12',
            disqualificationReason: 'Low Credit Score'
        },
        {
            id: 'LD-2024-015',
            name: 'Inventory Restock',
            amount: '$15,000',
            purpose: 'Inventory',
            source: 'Email Campaign',
            status: 'New',
            owner: 'System',
            createdDate: '2024-02-01'
        }
    ];

    // Status Badge Helper
    const StatusBadge = ({ status }) => {
        const styles = {
            'New': 'bg-blue-100 text-blue-700 border-blue-200',
            'Qualified': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Converted': 'bg-indigo-100 text-indigo-700 border-indigo-200',
            'Disqualified': 'bg-slate-100 text-slate-600 border-slate-200 line-through decoration-slate-400'
        };

        const icon = {
            'New': <Clock size={12} />,
            'Qualified': <CircleCheck size={12} />,
            'Converted': <Banknote size={12} />,
            'Disqualified': <XCircle size={12} />
        };

        return (
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || styles['New']}`}>
                {icon[status]}
                {status}
            </span>
        );
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'All' || lead.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="relative w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>
                    <FilterDropdown
                        value={filterStatus}
                        onChange={setFilterStatus}
                        options={['All', 'New', 'Qualified', 'Converted', 'Disqualified']}
                    />
                </div>

            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-500 w-32">Lead ID</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Lead Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Amount</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Purpose</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Source</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Owner</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Created</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLeads.map((lead) => (
                            <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4 font-mono text-xs font-bold text-slate-500">
                                    <button onClick={() => onViewLead && onViewLead(lead.id)} className="hover:text-blue-600 hover:underline">
                                        {lead.id}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800">{lead.name}</div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-800">{lead.amount}</td>
                                <td className="px-6 py-4 text-slate-600">{lead.purpose}</td>
                                <td className="px-6 py-4 text-slate-600">{lead.source}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col items-start gap-1">
                                        <StatusBadge status={lead.status} />
                                        {lead.status === 'Converted' && lead.loanId && (
                                            <a href="#" className="text-[10px] font-bold text-indigo-600 hover:underline flex items-center gap-1 ml-1">
                                                View Loan <ArrowRightCircle size={10} />
                                            </a>
                                        )}
                                        {lead.status === 'Disqualified' && lead.disqualificationReason && (
                                            <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded ml-1">
                                                {lead.disqualificationReason}
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold border border-white shadow-sm">
                                            {lead.owner.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-slate-600">{lead.owner}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-xs">{lead.createdDate}</td>
                                <td className="px-6 py-4">
                                    {lead.status !== 'Disqualified' ? (
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                                            {lead.status === 'Qualified' && (
                                                <button
                                                    title="Convert to Loan"
                                                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                                >
                                                    <ArrowRightCircle size={16} />
                                                </button>
                                            )}
                                            <button
                                                title="Add Note"
                                                onClick={() => onAddNote && onAddNote(lead.id)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                                            >
                                                <StickyNote size={16} />
                                            </button>
                                            <button
                                                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-[10px] italic text-slate-400">Read Only</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {filteredLeads.length === 0 && (
                            <tr>
                                <td colSpan="9" className="px-6 py-12 text-center text-slate-400 font-medium">
                                    No leads found match filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const FilterDropdown = ({ value, onChange, options }) => (
    <div className="relative group">
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={14} />
            {value}
            <ArrowUpDown size={12} className="text-slate-400" />
        </button>
        <div className="hidden group-hover:block absolute top-full left-0 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1 mt-1">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${value === opt ? 'text-blue-600 font-bold' : 'text-slate-600'}`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export default AccountLeadsTab;
