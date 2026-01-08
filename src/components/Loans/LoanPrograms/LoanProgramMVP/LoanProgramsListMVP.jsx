import React, { useState } from 'react';
import {
    Search, Filter, MoreHorizontal, FileText,
    CloudDownload, LayoutGrid, List, ArrowUpRight, Settings
} from 'lucide-react';
import RulesConfiguration from './RulesConfiguration';

const LoanProgramsListMVP = () => {
    const [viewMode, setViewMode] = useState('list'); // list | grid
    const [viewRulesFor, setViewRulesFor] = useState(null); // MVP Rules Screen
    const [activeMenuId, setActiveMenuId] = useState(null); // For dropdowns

    // Mock Data (matches original but isolated)
    const [programs] = useState([
        {
            id: 'LP-001',
            name: 'SBA 7(a) Standard',
            code: 'SBA-7A',
            source: 'LMS',
            version: '2.4',
            status: 'Active',
            activeLoans: 142,
            lastModified: '2023-12-01',
            owner: 'System Sync'
        },
        {
            id: 'LP-002',
            name: 'CRE Bridge Loan',
            code: 'CRE-BRG',
            source: 'Native',
            version: '1.1',
            status: 'Active',
            activeLoans: 28,
            lastModified: '2023-11-20',
            owner: 'Sarah Jenkins'
        },
        {
            id: 'LP-003',
            name: 'Equipment Finance Express',
            code: 'EQ-EXP',
            source: 'Native',
            version: '0.9',
            status: 'Draft',
            activeLoans: 0,
            lastModified: '2023-12-06',
            owner: 'Mike Ross'
        },
        {
            id: 'LP-004',
            name: 'SBA 504',
            code: 'SBA-504',
            source: 'LMS',
            version: '3.0',
            status: 'Retired',
            activeLoans: 5,
            lastModified: '2023-10-15',
            owner: 'System Sync'
        }
    ]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Draft': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Retired': return 'bg-slate-100 text-slate-500 border-slate-200';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    if (viewRulesFor) {
        return <RulesConfiguration onClose={() => setViewRulesFor(null)} />;
    }

    return (
        <div
            className="flex-1 bg-slate-50 overflow-hidden flex flex-col h-full animate-in fade-in duration-300"
            onClick={() => setActiveMenuId(null)} // Close menus on click outside
        >
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 uppercase tracking-wide">
                                MVP Module
                            </span>
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Rules Configuration Console</h1>
                        <p className="text-sm text-slate-500 mt-1">Configure eligibility and compliance rules for loan programs.</p>
                    </div>
                    {/* No Create/Import buttons - Read Only List for Config */}
                </div>

                {/* Filters Row */}
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Find program to configure..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-400 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider text-left">
                            <tr>
                                <th className="px-6 py-3">Program Name</th>
                                <th className="px-6 py-3">Source</th>
                                <th className="px-6 py-3">Version</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Configuration</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {programs.map((prog) => (
                                <tr key={prog.id} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{prog.name}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5">{prog.code}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {prog.source === 'LMS' ? (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">
                                                <CloudDownload size={10} /> LMS
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
                                                <LayoutGrid size={10} /> Native
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">v{prog.version}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(prog.status)}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${prog.status === 'Active' ? 'bg-emerald-500' : prog.status === 'Draft' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
                                            {prog.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => setViewRulesFor(prog)}
                                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-purple-700 hover:border-purple-200 hover:bg-purple-50 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-2 ml-auto"
                                        >
                                            <Settings size={14} />
                                            Configure Rules
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default LoanProgramsListMVP;
