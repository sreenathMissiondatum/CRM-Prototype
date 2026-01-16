import React, { useState } from 'react';
import { Plus, Search, Filter, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import LoanProgramWizard from './LoanProgramWizard';

const LoanProgramRulesEngine = () => {
    const [view, setView] = useState('list'); // 'list' | 'editor'
    const [selectedProgramId, setSelectedProgramId] = useState(null);
    const [programs, setPrograms] = useState([
        {
            id: 'LP-2024-001',
            name: 'SBA 7(a) Standard',
            authority: 'SBA',
            status: 'Active',
            lastModified: '2023-12-15',
            version: '2.1'
        },
        {
            id: 'LP-2024-002',
            name: 'CDFI Small Business Micro',
            authority: 'CDFI Fund',
            status: 'Active',
            lastModified: '2024-01-10',
            version: '1.0'
        },
        {
            id: 'LP-2024-003',
            name: 'State SSBCI Growth Fund',
            authority: 'State SSBCI',
            status: 'Draft',
            lastModified: '2024-01-12',
            version: '0.1'
        }
    ]);

    const handleCreateNew = () => {
        setSelectedProgramId(null);
        setView('editor');
    };

    const handleEdit = (id) => {
        setSelectedProgramId(id);
        setView('editor');
    };

    const handleSaveProgram = (programData) => {
        if (selectedProgramId) {
            setPrograms(prev => prev.map(p => p.id === selectedProgramId ? { ...p, ...programData, lastModified: new Date().toISOString().split('T')[0] } : p));
        } else {
            const newProgram = {
                ...programData,
                id: `LP-${new Date().getFullYear()}-${String(programs.length + 1).padStart(3, '0')}`,
                lastModified: new Date().toISOString().split('T')[0],
                version: '1.0'
            };
            setPrograms(prev => [...prev, newProgram]);
        }
        setView('list');
    };

    if (view === 'editor') {
        const programToEdit = programs.find(p => p.id === selectedProgramId);
        return (
            <LoanProgramWizard
                initialData={programToEdit}
                onSave={handleSaveProgram}
                onCancel={() => setView('list')}
            />
        );
    }

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <ShieldCheck className="text-blue-600" />
                        Loan Program Rules Engine
                    </h1>
                    <p className="text-slate-500 mt-1">Manage lending policy regulations, eligibility gates, and pricing rules.</p>
                </div>
                <button
                    onClick={handleCreateNew}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                >
                    <Plus size={20} />
                    Create New Program
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Filters */}
                    <div className="flex gap-4 mb-6">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search programs..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 font-medium flex items-center gap-2 hover:bg-slate-50">
                            <Filter size={18} /> Filter
                        </button>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map(program => (
                            <div
                                key={program.id}
                                onClick={() => handleEdit(program.id)}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group p-6 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-100 to-transparent rounded-bl-full -mr-8 -mt-8 pointer-events-none group-hover:from-blue-50 transition-colors"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${program.authority === 'SBA' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            program.authority === 'CDFI Fund' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                'bg-purple-50 text-purple-700 border-purple-100'
                                            }`}>
                                            {program.authority}
                                        </div>
                                        <div className={`flex items-center gap-1 text-xs font-bold ${program.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'
                                            }`}>
                                            {program.status === 'Active' ? <CheckCircle2 size={14} /> : <FileText size={14} />}
                                            {program.status}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{program.name}</h3>
                                    <div className="text-xs font-mono text-slate-400 mb-6">{program.id} • v{program.version}</div>

                                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
                                        <span>Last Modified</span>
                                        <span className="font-medium">{program.lastModified}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanProgramRulesEngine;
