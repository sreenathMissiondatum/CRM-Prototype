import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, FileText, ChevronRight, Briefcase } from 'lucide-react';

const LoanProgramManager = () => {
    const [programs, setPrograms] = useState([
        { id: 1, name: 'SBA 7(a) Working Capital', type: 'Government', rate: 'Prime + 2.75%', active: true, docs: 12 },
        { id: 2, name: 'Commercial Real Estate (CRE)', type: 'Conventional', rate: '6.5% - 8.5%', active: true, docs: 8 },
        { id: 3, name: 'Equipment Financing', type: 'Asset-Based', rate: '7.0% Fixed', active: true, docs: 5 },
        { id: 4, name: 'Merchant Cash Advance', type: 'Alternative', rate: 'Factor 1.25', active: false, docs: 4 },
    ]);

    return (
        <div className="h-full flex flex-col p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Loan Programs</h1>
                    <p className="text-slate-500">Configure lending products, rates, and eligibility criteria.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <Plus size={18} />
                    New Program
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* METRICS */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Programs</div>
                        <div className="text-2xl font-bold text-slate-800 mt-1">{programs.filter(p => p.active).length}</div>
                    </div>
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                        <Briefcase size={20} />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                    <div>
                        <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Total Documents Map</div>
                        <div className="text-2xl font-bold text-slate-800 mt-1">{programs.reduce((acc, p) => acc + p.docs, 0)}</div>
                    </div>
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                        <FileText size={20} />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                {/* TOOLBAR */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search programs..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white focus:outline-none">
                            <option>All Types</option>
                            <option>Government</option>
                            <option>Conventional</option>
                        </select>
                    </div>
                </div>

                {/* LIST */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/50">
                    {programs.map(program => (
                        <div key={program.id} className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 transition-colors group cursor-pointer">
                            <div className="flex justify-between items-center">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-sm ${program.active ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-slate-300'}`}>
                                        {program.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{program.name}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                                            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium text-slate-600 border border-slate-200">
                                                {program.type}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                {program.rate}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                {program.docs} Required Docs
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`px-2.5 py-1 rounded-full text-xs font-bold border ${program.active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                        {program.active ? 'ACTIVE' : 'INACTIVE'}
                                    </div>
                                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                                        <Edit2 size={16} />
                                    </button>
                                    <ChevronRight size={18} className="text-slate-300 group-hover:text-blue-400" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoanProgramManager;
