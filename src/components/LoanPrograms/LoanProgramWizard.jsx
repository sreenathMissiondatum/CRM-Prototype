import React, { useState } from 'react';
import {
    X, Check, ChevronRight, Briefcase, FileText, Settings, Shield,
    MapPin, Globe, AlertCircle, Info, Building2, User
} from 'lucide-react';

const LoanProgramWizard = ({ onClose, onCreate }) => {
    const [step, setStep] = useState(1);

    // Form State
    const [data, setData] = useState({
        // Basics
        name: '',
        code: '',
        type: 'Term Loan',

        // Eligibility
        borrowerTypes: new Set(['LLC', 'Corp']), // Default selection
        geo: {
            allowedStates: ['NY', 'CA', 'TX', 'FL'],
            restrictedZips: ''
        },
        industry: {
            allowed: [],
            excluded: ['Gambling', 'Cannabis'],
            highRisk: []
        },
        business: {
            minYears: 2,
            minYearsStrict: true,
            minRevenue: 250000,
            minRevenueStrict: false,
            maxExposure: 5000000
        },
        credit: {
            minScore: 680,
            bankruptcyLookback: 7
        },
        // Documents
        documents: [
            { id: 1, name: 'Driver License / Passport', category: 'Identity', required: true, sla: 2, source: 'Upload' },
            { id: 2, name: 'Business Tax Returns (2 Years)', category: 'Financials', required: true, sla: 5, source: 'Upload' },
            { id: 3, name: 'YTD P&L Statement', category: 'Financials', required: true, sla: 3, source: 'Upload' }
        ],
        // Rules
        rules: {
            minDSCR: 1.25,
            dscrSeverity: 'Warning',
            maxLTV: 80,
            ltvSeverity: 'Hard Stop',
            minFICO: 680,
            allowedGrades: new Set(['A', 'B', 'C']),
            collateralTypes: new Set(['Multifamily', 'Mixed Use']),
            exceptions: {
                requireNote: true,
                requireApproval: true
            }
        }
    });

    const [newDoc, setNewDoc] = useState({ name: '', category: 'Financials', required: true, sla: 3 });
    const [isAddingDoc, setIsAddingDoc] = useState(false);


    const steps = [
        { id: 1, label: 'Basics', icon: Briefcase },
        { id: 2, label: 'Eligibility', icon: Shield },
        { id: 3, label: 'Documents', icon: FileText },
        { id: 4, label: 'Rules', icon: Settings },
        { id: 5, label: 'Review', icon: Check }
    ];

    const categories = ['Identity', 'Financials', 'Collateral', 'Legal', 'Compliance'];

    const handleAddDoc = () => {
        if (!newDoc.name) return;
        setData(prev => ({
            ...prev,
            documents: [...prev.documents, { ...newDoc, id: Math.random() }]
        }));
        setNewDoc({ name: '', category: 'Financials', required: true, sla: 3 });
        setIsAddingDoc(false);
    };

    const removeDoc = (id) => {
        setData(prev => ({
            ...prev,
            documents: prev.documents.filter(d => d.id !== id)
        }));
    };



    // Mock Options
    const borrowerTypeOptions = [
        { id: 'LLC', label: 'LLC' },
        { id: 'Corp', label: 'Corporation' },
        { id: 'SoleProp', label: 'Sole Proprietor' },
        { id: 'Nonprofit', label: 'Nonprofit' },
        { id: 'Individual', label: 'Individual' },
        { id: 'Gov', label: 'Gov / Tribal' }
    ];

    const stateOptions = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
    ];

    const handleCreate = () => {
        const newProgram = {
            id: `LP-NAT-${Math.floor(Math.random() * 1000)}`,
            name: data.name || 'New Native Program',
            code: data.code || 'NAT-001',
            source: 'Native',
            version: '0.1',
            status: 'Draft',
            activeLoans: 0,
            lastModified: new Date().toISOString().split('T')[0],
            owner: 'Me'
        };
        onCreate(newProgram);
    };

    // Helper to toggle set items
    const toggleBorrowerType = (type) => {
        setData(prev => {
            const next = new Set(prev.borrowerTypes);
            if (next.has(type)) next.delete(type);
            else next.add(type);
            return { ...prev, borrowerTypes: next };
        });
    };

    const toggleState = (st) => {
        setData(prev => {
            const current = prev.geo.allowedStates;
            const next = current.includes(st)
                ? current.filter(s => s !== st)
                : [...current, st];
            return { ...prev, geo: { ...prev.geo, allowedStates: next } };
        });
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-200 flex flex-col h-[85vh]">

                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Create Loan Program</h2>
                        <p className="text-sm text-slate-500">Define a new native loan product policy.</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 p-2 rounded-full hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Sidebar Steps */}
                    <div className="w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-6 shrink-0">
                        {steps.map((s, idx) => {
                            const isActive = s.id === step;
                            const isCompleted = s.id < step;
                            return (
                                <div key={s.id} className={`flex items-center gap-3 ${isActive ? 'text-blue-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${isActive ? 'border-blue-600 bg-white shadow-sm' :
                                        isCompleted ? 'border-green-500 bg-green-50 text-green-600' :
                                            'border-slate-300 bg-transparent'
                                        }`}>
                                        {isCompleted ? <Check size={14} strokeWidth={3} /> : <s.icon size={14} />}
                                    </div>
                                    <span className="text-sm font-bold tracking-tight">{s.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 flex overflow-hidden">

                        {/* Config Canvas */}
                        <div className="flex-1 overflow-y-auto p-8 border-r border-slate-200">

                            {/* Step 1: Basics */}
                            {step === 1 && (
                                <div className="max-w-xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2">Program Basics</h3>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Program Name <span className="text-red-500">*</span></label>
                                        <input
                                            autoFocus
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                            placeholder="e.g. Small Business Growth Fund"
                                            value={data.name}
                                            onChange={e => setData({ ...data, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Program Code</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all font-mono text-sm"
                                            placeholder="e.g. SB-GROW-01"
                                            value={data.code}
                                            onChange={e => setData({ ...data, code: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Loan Type</label>
                                        <select
                                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                                            value={data.type}
                                            onChange={e => setData({ ...data, type: e.target.value })}
                                        >
                                            <option>Term Loan</option>
                                            <option>Line of Credit</option>
                                            <option>Commercial Mortgage</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Eligibility */}
                            {step === 2 && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-3xl">

                                    {/* Borrower Type */}
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                                            <User size={20} className="text-blue-500" />
                                            Borrower Type Eligibility
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-4">These borrower types can create applications using this program.</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {borrowerTypeOptions.map(opt => {
                                                const isSelected = data.borrowerTypes.has(opt.id);
                                                return (
                                                    <label
                                                        key={opt.id}
                                                        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                                                            ? 'border-blue-500 bg-blue-50 text-blue-800'
                                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleBorrowerType(opt.id)}
                                                            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm font-medium">{opt.label}</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                        {data.borrowerTypes.size === 0 && (
                                            <div className="mt-2 text-xs text-red-600 font-medium flex items-center gap-1">
                                                <AlertCircle size={12} />
                                                At least one borrower type is required.
                                            </div>
                                        )}
                                    </section>

                                    {/* Geography */}
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                                            <MapPin size={20} className="text-emerald-500" />
                                            Geographic Eligibility
                                        </h3>
                                        <p className="text-sm text-slate-500 mb-4">Borrowers outside these locations cannot apply.</p>

                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Allowed States</div>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {data.geo.allowedStates.map(st => (
                                                    <span key={st} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 shadow-sm">
                                                        {st}
                                                        <button onClick={() => toggleState(st)} className="hover:text-red-500"><X size={12} /></button>
                                                    </span>
                                                ))}
                                                <button className="px-2 py-1 bg-white border border-dashed border-slate-300 rounded text-xs text-slate-500 hover:text-blue-600 hover:border-blue-400 transition-colors">
                                                    + Add State
                                                </button>
                                            </div>
                                            <div className="text-xs text-slate-400 italic">Common: All US, Contiguous US, North East</div>
                                        </div>
                                    </section>

                                    {/* Business Profile */}
                                    <section>
                                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-1">
                                            <Building2 size={20} className="text-amber-500" />
                                            Business Profile Constraints
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1">Min. Years in Operation</label>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        value={data.business.minYears}
                                                        onChange={(e) => setData({ ...data, business: { ...data.business, minYears: e.target.value } })}
                                                        className="w-24 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                                    />
                                                    <span className="text-sm text-slate-500">Years</span>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" checked={data.business.minYearsStrict} className="sr-only peer" onChange={() => { }} />
                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                                        <span className="ml-2 text-xs font-medium text-slate-600">{data.business.minYearsStrict ? 'Strict Enforce' : 'Allow Override'}</span>
                                                    </label>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1">Min. Annual Revenue</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 text-sm">$</span>
                                                    <input
                                                        type="number"
                                                        value={data.business.minRevenue}
                                                        onChange={(e) => setData({ ...data, business: { ...data.business, minRevenue: e.target.value } })}
                                                        className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input type="checkbox" checked={data.business.minRevenueStrict} className="sr-only peer" onChange={() => { }} />
                                                        <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                                                        <span className="ml-2 text-xs font-medium text-slate-600">{data.business.minRevenueStrict ? 'Strict Enforce' : 'Allow Override'}</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                </div>
                            )}

                            {/* Step 3: Documents */}
                            {step === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl">

                                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <FileText size={20} className="text-amber-500" />
                                                Document Checklist
                                            </h3>
                                            <p className="text-sm text-slate-500">Define evidence required for underwriting.</p>
                                        </div>
                                        <button
                                            onClick={() => setIsAddingDoc(true)}
                                            className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors border border-blue-100"
                                        >
                                            + Add Document
                                        </button>
                                    </div>

                                    {/* Add Doc Form */}
                                    {isAddingDoc && (
                                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 animate-in fade-in zoom-in-95 duration-200">
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-bold text-slate-500 mb-1">Document Name</label>
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm focus:ring-2 focus:ring-blue-100 outline-none"
                                                        placeholder="e.g. Articles of Incorporation"
                                                        value={newDoc.name}
                                                        onChange={e => setNewDoc({ ...newDoc, name: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-1">Category</label>
                                                    <select
                                                        className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm outline-none"
                                                        value={newDoc.category}
                                                        onChange={e => setNewDoc({ ...newDoc, category: e.target.value })}
                                                    >
                                                        {categories.map(c => <option key={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-slate-500 mb-1">Due (Days)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full px-3 py-1.5 border border-slate-200 rounded text-sm outline-none"
                                                        value={newDoc.sla}
                                                        onChange={e => setNewDoc({ ...newDoc, sla: parseInt(e.target.value) })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={newDoc.required}
                                                        onChange={e => setNewDoc({ ...newDoc, required: e.target.checked })}
                                                        className="w-4 h-4 text-blue-600 rounded"
                                                    />
                                                    <span className="text-sm font-medium text-slate-700">Mandatory Requirement</span>
                                                </label>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setIsAddingDoc(false)} className="text-sm text-slate-500 hover:text-slate-700 px-3 py-1.5">Cancel</button>
                                                    <button onClick={handleAddDoc} className="text-sm bg-blue-600 text-white font-bold px-4 py-1.5 rounded hover:bg-blue-700">Save</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Document Categories */}
                                    <div className="space-y-6">
                                        {categories.map(cat => {
                                            const docs = data.documents.filter(d => d.category === cat);
                                            if (docs.length === 0) return null;
                                            return (
                                                <div key={cat} className="group">
                                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 pl-1">{cat}</h4>
                                                    <div className="space-y-2">
                                                        {docs.map(doc => (
                                                            <div key={doc.id} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm group-hover:border-slate-300 transition-all">
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`p-1.5 rounded ${doc.required ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-400'}`}>
                                                                        <FileText size={16} />
                                                                    </div>
                                                                    <div>
                                                                        <div className="text-sm font-bold text-slate-700">{doc.name}</div>
                                                                        <div className="text-xs text-slate-400 flex items-center gap-2">
                                                                            <span>Due: {doc.sla} days</span>
                                                                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                                            <span>Source: {doc.source}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-3">
                                                                    {doc.required ? (
                                                                        <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wide rounded border border-red-100">Required</span>
                                                                    ) : (
                                                                        <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wide rounded border border-slate-200">Optional</span>
                                                                    )}
                                                                    <button onClick={() => removeDoc(doc.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                                                                        <X size={14} />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {data.documents.length === 0 && (
                                            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                                                <FileText className="mx-auto text-slate-300 mb-3" size={32} />
                                                <p className="text-slate-500 font-medium">No documents defined yet.</p>
                                                <button onClick={() => setIsAddingDoc(true)} className="text-blue-600 font-bold text-sm mt-2 hover:underline">Add your first document</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {/* Other Steps */}
                            {step === 4 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-5xl">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <Settings size={20} className="text-purple-500" />
                                                Underwriting Rules
                                            </h3>
                                            <p className="text-sm text-slate-500">Define risk thresholds and decision logic.</p>
                                        </div>
                                    </div>

                                    {/* Financial Rules */}
                                    <section>
                                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                            <div className="w-1 h-4 bg-purple-500 rounded-full"></div>
                                            Financial Thresholds
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* DSCR */}
                                            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">Min. DSCR</div>
                                                        <div className="text-xs text-slate-500">Debt Service Coverage Ratio</div>
                                                    </div>
                                                    <div className="flex bg-slate-100 p-0.5 rounded-lg">
                                                        <button
                                                            onClick={() => setData(prev => ({ ...prev, rules: { ...prev.rules, dscrSeverity: 'Warning' } }))}
                                                            className={`px-2 py-1 text-[10px] font-bold rounded ${data.rules.dscrSeverity === 'Warning' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}
                                                        >
                                                            Warn
                                                        </button>
                                                        <button
                                                            onClick={() => setData(prev => ({ ...prev, rules: { ...prev.rules, dscrSeverity: 'Hard Stop' } }))}
                                                            className={`px-2 py-1 text-[10px] font-bold rounded ${data.rules.dscrSeverity === 'Hard Stop' ? 'bg-red-50 text-red-600 shadow' : 'text-slate-400'}`}
                                                        >
                                                            Stop
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="range" min="1.0" max="2.0" step="0.05"
                                                        value={data.rules.minDSCR}
                                                        onChange={e => setData(prev => ({ ...prev, rules: { ...prev.rules, minDSCR: parseFloat(e.target.value) } }))}
                                                        className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                                    />
                                                    <div className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-center font-mono font-bold text-slate-700">
                                                        {data.rules.minDSCR}x
                                                    </div>
                                                </div>
                                            </div>

                                            {/* LTV */}
                                            <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-800">Max. LTV</div>
                                                        <div className="text-xs text-slate-500">Loan-to-Value Ratio</div>
                                                    </div>
                                                    <div className="flex bg-slate-100 p-0.5 rounded-lg">
                                                        <button
                                                            onClick={() => setData(prev => ({ ...prev, rules: { ...prev.rules, ltvSeverity: 'Warning' } }))}
                                                            className={`px-2 py-1 text-[10px] font-bold rounded ${data.rules.ltvSeverity === 'Warning' ? 'bg-white shadow text-slate-800' : 'text-slate-400'}`}
                                                        >
                                                            Warn
                                                        </button>
                                                        <button
                                                            onClick={() => setData(prev => ({ ...prev, rules: { ...prev.rules, ltvSeverity: 'Hard Stop' } }))}
                                                            className={`px-2 py-1 text-[10px] font-bold rounded ${data.rules.ltvSeverity === 'Hard Stop' ? 'bg-red-50 text-red-600 shadow' : 'text-slate-400'}`}
                                                        >
                                                            Stop
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="range" min="50" max="95" step="5"
                                                        value={data.rules.maxLTV}
                                                        onChange={e => setData(prev => ({ ...prev, rules: { ...prev.rules, maxLTV: parseInt(e.target.value) } }))}
                                                        className="flex-1 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                                    />
                                                    <div className="w-16 px-2 py-1 bg-slate-50 border border-slate-200 rounded text-center font-mono font-bold text-slate-700">
                                                        {data.rules.maxLTV}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Credit Policy */}
                                    <section>
                                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                            Credit Policy
                                        </h4>
                                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Min. FICO Score</label>
                                                <input
                                                    type="number"
                                                    value={data.rules.minFICO}
                                                    onChange={e => setData(prev => ({ ...prev, rules: { ...prev.rules, minFICO: parseInt(e.target.value) } }))}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Max. Delinquencies</label>
                                                <select className="w-full px-3 py-2 border border-slate-200 rounded text-sm bg-white">
                                                    <option>None allowed</option>
                                                    <option>1x30 in 12m</option>
                                                    <option>2x30 in 24m</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 mb-1">Risk Grades</label>
                                                <div className="flex gap-1 mt-1">
                                                    {['A', 'B', 'C', 'D'].map(g => (
                                                        <button
                                                            key={g}
                                                            onClick={() => {
                                                                const current = new Set(data.rules.allowedGrades);
                                                                if (current.has(g)) current.delete(g);
                                                                else current.add(g);
                                                                setData(prev => ({ ...prev, rules: { ...prev.rules, allowedGrades: current } }));
                                                            }}
                                                            className={`w-8 h-8 rounded border text-sm font-bold transition-colors ${data.rules.allowedGrades.has(g) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                                                        >
                                                            {g}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </section>

                                    {/* Collateral */}
                                    <section>
                                        <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                                            <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                                            Eligible Collateral
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {['Multifamily', 'Office', 'Retail', 'Industrial', 'Mixed Use', 'Self Storage', 'Hospitality', 'Land'].map(type => (
                                                <label key={type} className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded cursor-pointer hover:bg-slate-50">
                                                    <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" defaultChecked={['Multifamily', 'Mixed Use'].includes(type)} />
                                                    <span className="text-sm text-slate-700">{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </section>

                                    {/* Exceptions */}
                                    <section>
                                        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex items-start gap-3">
                                            <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-800">Exception Policy</h4>
                                                <p className="text-xs text-slate-600 mb-2">Define who can approve loans that breach these warnings.</p>
                                                <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                                                    <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> Require Explanatory Note</label>
                                                    <label className="flex items-center gap-1.5"><input type="checkbox" defaultChecked /> Chief Credit Officer Approval</label>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            )}

                            {/* Other Steps */}
                            {step === 5 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-5xl pb-10">
                                    <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                                <Check size={20} className="text-green-600" />
                                                Review & Activate
                                            </h3>
                                            <p className="text-sm text-slate-500">Validate configuration before publishing.</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold border border-slate-200">
                                                Version 1.0
                                            </span>
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                                                Native Program
                                            </span>
                                        </div>
                                    </div>

                                    {/* Warnings */}
                                    {(() => {
                                        const warnings = [];
                                        if (data.documents.length === 0) warnings.push("No documents defined. Applications may lack evidence.");
                                        if (data.documents.filter(d => d.required).length === 0) warnings.push("No mandatory documents. Consider making key docs required.");
                                        if (!data.rules.dscrSeverity && !data.rules.ltvSeverity) warnings.push("No hard stops or warnings active. All loans may pass underwriting automatically.");

                                        if (warnings.length > 0) return (
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                                                    <AlertCircle size={16} /> Configuration Warnings
                                                </div>
                                                <ul className="list-disc list-inside text-xs text-amber-700 space-y-1">
                                                    {warnings.map((w, i) => <li key={i}>{w}</li>)}
                                                </ul>
                                            </div>
                                        );
                                        return null;
                                    })()}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Review Sections */}
                                        <div className="md:col-span-2 space-y-6">

                                            {/* Eligibility Section */}
                                            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                        <Shield size={16} className="text-blue-500" />
                                                        Eligibility Criteria
                                                    </h4>
                                                    <button onClick={() => setStep(2)} className="text-xs text-blue-600 font-medium hover:underline">Edit</button>
                                                </div>
                                                <div className="p-4 grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Borrowers</div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {Array.from(data.borrowerTypes).map(t => <span key={t} className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-xs font-medium">{t}</span>)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">States</div>
                                                        <div className="text-slate-700 font-medium truncate" title={data.geo.allowedStates.join(', ')}>
                                                            {data.geo.allowedStates.length} Allowed ({data.geo.allowedStates.slice(0, 3).join(', ')}{data.geo.allowedStates.length > 3 && '...'})
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Biz Age</div>
                                                        <div className="text-slate-700 font-medium">{data.business.minYears} Years <span className="text-slate-400 font-normal">({data.business.minYearsStrict ? 'Strict' : 'Flexible'})</span></div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">Min Revenue</div>
                                                        <div className="text-slate-700 font-medium">${parseInt(data.business.minRevenue).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Documents Section */}
                                            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                        <FileText size={16} className="text-amber-500" />
                                                        Required Evidence
                                                    </h4>
                                                    <button onClick={() => setStep(3)} className="text-xs text-blue-600 font-medium hover:underline">Edit</button>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex gap-4 mb-3">
                                                        <div className="text-center px-4 py-2 bg-slate-50 rounded border border-slate-200">
                                                            <div className="text-lg font-bold text-slate-800">{data.documents.length}</div>
                                                            <div className="text-[10px] text-slate-500 uppercase font-bold">Total</div>
                                                        </div>
                                                        <div className="text-center px-4 py-2 bg-red-50 rounded border border-red-100">
                                                            <div className="text-lg font-bold text-red-700">{data.documents.filter(d => d.required).length}</div>
                                                            <div className="text-[10px] text-red-500 uppercase font-bold">Hard Gates</div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        {categories.map(cat => {
                                                            const docs = data.documents.filter(d => d.category === cat);
                                                            if (docs.length === 0) return null;
                                                            return (
                                                                <div key={cat} className="flex gap-2 text-xs">
                                                                    <span className="text-slate-500 w-24 shrink-0">{cat}:</span>
                                                                    <span className="text-slate-700">{docs.map(d => d.name).join(', ')} ({docs.length})</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rules Section */}
                                            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                                    <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                                        <Settings size={16} className="text-purple-500" />
                                                        Underwriting Policy
                                                    </h4>
                                                    <button onClick={() => setStep(4)} className="text-xs text-blue-600 font-medium hover:underline">Edit</button>
                                                </div>
                                                <div className="p-4 grid grid-cols-1 gap-3">
                                                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-100">
                                                        <span className="text-sm font-bold text-purple-900">Debt Service (DSCR)</span>
                                                        <div className="flex items-center gap-3 text-xs">
                                                            <span className="text-slate-600">Threshold: <b>{data.rules.minDSCR}x</b></span>
                                                            <span className={`px-2 py-0.5 rounded font-bold uppercase ${data.rules.dscrSeverity === 'Hard Stop' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{data.rules.dscrSeverity || 'None'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-100">
                                                        <span className="text-sm font-bold text-purple-900">Loan to Value (LTV)</span>
                                                        <div className="flex items-center gap-3 text-xs">
                                                            <span className="text-slate-600">Max: <b>{data.rules.maxLTV}%</b></span>
                                                            <span className={`px-2 py-0.5 rounded font-bold uppercase ${data.rules.ltvSeverity === 'Hard Stop' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{data.rules.ltvSeverity || 'None'}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded border border-purple-100">
                                                        <span className="text-sm font-bold text-purple-900">Credit Score</span>
                                                        <span className="text-xs text-slate-600">Min <b>{data.rules.minFICO}</b></span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Impact Preview Sidebar */}
                                        <div className="space-y-6">
                                            <div className="bg-slate-900 text-slate-300 p-5 rounded-xl shadow-lg">
                                                <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
                                                    <Info size={16} className="text-blue-400" />
                                                    Program Impact
                                                </h4>
                                                <div className="space-y-4 text-xs leading-relaxed">
                                                    <p>
                                                        Loans created under <strong className="text-white">{data.name}</strong> will:
                                                    </p>
                                                    <ul className="space-y-3">
                                                        <li className="flex gap-2">
                                                            <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                                                            <span>Be restricted to <strong className="text-white">{data.geo.allowedStates.length} states</strong> and <strong className="text-white">{data.borrowerTypes.size} entity types</strong>.</span>
                                                        </li>
                                                        <li className="flex gap-2">
                                                            <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                                                            <span>Require <strong className="text-white">{data.documents.filter(d => d.required).length} mandatory documents</strong> before underwriting can complete.</span>
                                                        </li>
                                                        <li className="flex gap-2">
                                                            <Check size={14} className="text-green-500 shrink-0 mt-0.5" />
                                                            <span>Automatically <strong className="text-white">{data.rules.ltvSeverity === 'Hard Stop' || data.rules.dscrSeverity === 'Hard Stop' ? 'Reject' : 'Flag'}</strong> deals breaching financial thresholds.</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div className="mt-6 pt-4 border-t border-slate-700/50">
                                                    <div className="text-[10px] uppercase font-bold text-slate-500 mb-1">Target Audience</div>
                                                    <div className="text-white font-medium text-sm">Small Business • {data.type}</div>
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                                <h5 className="font-bold text-xs text-slate-500 uppercase tracking-wide mb-2">Governance</h5>
                                                <div className="text-xs text-slate-600 space-y-2">
                                                    <div className="flex justify-between">
                                                        <span>Created By:</span>
                                                        <span className="font-medium text-slate-900">Current User</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Date:</span>
                                                        <span className="font-medium text-slate-900">{new Date().toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Approval:</span>
                                                        <span className="font-medium text-slate-900">Auto-Approved</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Right Summary Panel (Visible on Step 2, 3, 4) */}
                        {step >= 2 && step <= 4 && (
                            <div className="w-80 bg-slate-50 border-l border-slate-200 p-6 overflow-y-auto hidden xl:block animate-in slide-in-from-right-4 duration-300">
                                {step === 2 && (
                                    <>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Eligibility Summary</h3>
                                        <div className="space-y-6">
                                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                                                    <User size={16} className="text-blue-500" /> Who can apply?
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {Array.from(data.borrowerTypes).map(t => (
                                                        <span key={t} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 font-medium">{t}</span>
                                                    ))}
                                                    {data.borrowerTypes.size === 0 && <span className="text-xs text-red-500 italic">None selected</span>}
                                                </div>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                                                    <MapPin size={16} className="text-emerald-500" /> Locations
                                                </div>
                                                <p className="text-xs text-slate-600 leading-relaxed">
                                                    Restricted to <span className="font-bold text-slate-800">{data.geo.allowedStates.length} states</span> including {data.geo.allowedStates.slice(0, 3).join(', ')}{data.geo.allowedStates.length > 3 && '...'}.
                                                </p>
                                            </div>
                                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                                <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                                                    <Building2 size={16} className="text-amber-500" /> Business Profile
                                                </div>
                                                <ul className="space-y-2">
                                                    <li className="flex justify-between text-xs">
                                                        <span className="text-slate-500">Min Revenue:</span>
                                                        <span className="font-medium text-slate-900">${parseInt(data.business.minRevenue).toLocaleString()}</span>
                                                    </li>
                                                    <li className="flex justify-between text-xs">
                                                        <span className="text-slate-500">Min Operation:</span>
                                                        <span className="font-medium text-slate-900">{data.business.minYears} Years</span>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="bg-blue-50/50 p-3 rounded border border-blue-100 text-xs text-blue-800 flex gap-2">
                                                <Info size={14} className="shrink-0 mt-0.5" />
                                                These rules gate the application process but do not guarantee approval.
                                            </div>
                                        </div>
                                    </>
                                )}
                                {step === 3 && (
                                    <>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Document Impact</h3>
                                        <div className="space-y-6">
                                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                                <div className="text-3xl font-bold text-slate-800 mb-1">{data.documents.length}</div>
                                                <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Documents</div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> Mandatory</span>
                                                    <span className="font-bold text-slate-800">{data.documents.filter(d => d.required).length}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-slate-500 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Optional</span>
                                                    <span className="font-bold text-slate-800">{data.documents.filter(d => !d.required).length}</span>
                                                </div>
                                            </div>
                                            <div className="bg-amber-50/50 p-3 rounded border border-amber-100 text-xs text-amber-800 flex gap-2 leading-relaxed">
                                                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                                                <span>Mandatory documents will block the 'Underwriting' stage until collected and verified.</span>
                                            </div>
                                            <div className="border-t border-slate-200 pt-4">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">By Category</div>
                                                {categories.map(cat => {
                                                    const count = data.documents.filter(d => d.category === cat).length;
                                                    if (count === 0) return null;
                                                    return (
                                                        <div key={cat} className="flex justify-between items-center text-xs py-1">
                                                            <span className="text-slate-600">{cat}</span>
                                                            <span className="font-bold text-slate-800">{count}</span>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {step === 4 && (
                                    <>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Decision Impact</h3>
                                        <div className="space-y-6">
                                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Hard Stops</div>
                                                <div className="space-y-2">
                                                    {data.rules.dscrSeverity === 'Hard Stop' && (
                                                        <div className="flex items-center gap-2 text-sm text-red-600 font-medium bg-red-50 p-2 rounded">
                                                            <X size={14} /> DSCR &lt; {data.rules.minDSCR}x
                                                        </div>
                                                    )}
                                                    {data.rules.ltvSeverity === 'Hard Stop' && (
                                                        <div className="flex items-center gap-2 text-sm text-red-600 font-medium bg-red-50 p-2 rounded">
                                                            <X size={14} /> LTV &gt; {data.rules.maxLTV}%
                                                        </div>
                                                    )}
                                                    {(!data.rules.dscrSeverity && !data.rules.ltvSeverity) && <span className="text-slate-400 italic text-sm">No hard stops defined.</span>}
                                                </div>
                                            </div>

                                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Warnings (Review)</div>
                                                <div className="space-y-2">
                                                    {data.rules.dscrSeverity === 'Warning' && (
                                                        <div className="flex items-center gap-2 text-sm text-amber-600 font-medium bg-amber-50 p-2 rounded">
                                                            <AlertCircle size={14} /> DSCR &lt; {data.rules.minDSCR}x
                                                        </div>
                                                    )}
                                                    {data.rules.ltvSeverity === 'Warning' && (
                                                        <div className="flex items-center gap-2 text-sm text-amber-600 font-medium bg-amber-50 p-2 rounded">
                                                            <AlertCircle size={14} /> LTV &gt; {data.rules.maxLTV}%
                                                        </div>
                                                    )}
                                                    {(!data.rules.dscrSeverity && !data.rules.ltvSeverity) && <span className="text-slate-400 italic text-sm">No warnings defined.</span>}
                                                </div>
                                            </div>

                                            <div className="bg-purple-50/50 p-4 rounded-lg border border-purple-100">
                                                <div className="flex items-center gap-2 text-sm font-bold text-purple-900 mb-2">
                                                    <Shield size={16} /> Credit Policy
                                                </div>
                                                <ul className="space-y-2 text-xs text-purple-800">
                                                    <li className="flex justify-between"><span>Min. FICO:</span> <b>{data.rules.minFICO}</b></li>
                                                    <li className="flex justify-between"><span>Allowed Grades:</span> <b>{Array.from(data.rules.allowedGrades).join(', ')}</b></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 shrink-0">
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
                        >
                            Back
                        </button>
                    )}

                    {step < 5 ? (
                        <button
                            disabled={step === 2 && data.borrowerTypes.size === 0}
                            onClick={() => setStep(step + 1)}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleCreate}
                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2"
                        >
                            Create Program <Check size={16} />
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default LoanProgramWizard;
