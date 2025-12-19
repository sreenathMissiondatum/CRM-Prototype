import React, { useState } from 'react';
import {
    Plus, Search, Filter, MoreHorizontal, Download,
    CloudDownload, FileText, CheckCircle, AlertCircle, Clock,
    LayoutGrid, List, ArrowUpRight
} from 'lucide-react';
import LoanProgramImport from './LoanProgramImport';
import LoanProgramWizard from './LoanProgramWizard';
import LoanProgramDetail from './LoanProgramDetail';

const LoanProgramsList = () => {
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // list | grid

    // Mock Data
    const [programs, setPrograms] = useState([
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

    const handleImport = (newProgram) => {
        setPrograms(prev => [newProgram, ...prev]);
        setIsImportOpen(false);
    };

    const handleCreate = (newProgram) => {
        setPrograms(prev => [newProgram, ...prev]);
        setIsWizardOpen(false);
    };

    const [selectedProgram, setSelectedProgram] = useState(null);

    // ... handleImport and handleCreate logic remains same ...

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Draft': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Retired': return 'bg-slate-100 text-slate-500 border-slate-200';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    if (selectedProgram) {
        return <LoanProgramDetail program={selectedProgram} onBack={() => setSelectedProgram(null)} />;
    }

    return (
        <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Loan Programs</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage product definitions, policies, and eligibility rules.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsImportOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                        >
                            <CloudDownload size={18} />
                            Import from LMS
                        </button>
                        <button
                            onClick={() => setIsWizardOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
                        >
                            <Plus size={18} />
                            Create Program
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search programs..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 ml-auto">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
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
                                <th className="px-6 py-3">Active Loans</th>
                                <th className="px-6 py-3">Last Modified</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {programs.map((prog) => (
                                <tr key={prog.id} onClick={() => setSelectedProgram(prog)} className="group hover:bg-slate-50/50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors cursor-pointer">{prog.name}</div>
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
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-700">{prog.activeLoans}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-600">{prog.lastModified}</div>
                                        <div className="text-xs text-slate-400">{prog.owner}</div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Render Modals */}
            {isImportOpen && <LoanProgramImport onClose={() => setIsImportOpen(false)} onImport={handleImport} />}
            {isWizardOpen && <LoanProgramWizard onClose={() => setIsWizardOpen(false)} onCreate={handleCreate} />}
        </div>
    );
};

export default LoanProgramsList;
