import React, { useState } from 'react';
import {
    ChevronLeft, Lock, Edit3, Save, RotateCcw,
    Shield, FileText, Settings, Activity, History,
    Server, AlertTriangle, CheckCircle2, Clock
} from 'lucide-react';

const LoanProgramDetail = ({ program, onBack }) => {
    const [activeTab, setActiveTab] = useState('config'); // config, history, usage

    // MOCK DATA
    const lmsData = {
        minAmount: '$100,000',
        maxAmount: '$5,000,000',
        termRange: '12 - 120 Months',
        rateType: 'Variable (WSJ Prime + Margin)',
        amortization: 'Up to 25 Years',
        collateral: ['Commercial Real Estate', 'Equipment (Heavy)', 'Cash Secured'],
        regulatory: ['SBA 7(a) Eligible', 'CRA Reportable'],
        lastSync: '2023-12-07 08:30 AM'
    };

    const [losConfig, setLosConfig] = useState({
        eligibility: {
            borrowerTypes: ['LLC', 'Corp', 'Partnership'],
            industries: ['Manufacturing', 'Healthcare', 'Professional Services'],
            excludedIndustries: ['Gambling', 'Adult Entertainment', 'Cannabis'],
            minRevenue: '$500,000',
            geoRestricted: ['NY', 'CA']
        },
        documents: [
            { id: 1, category: 'Financials', name: '3 Years Tax Returns', required: true },
            { id: 2, category: 'Financials', name: 'YTD P&L and Balance Sheet', required: true },
            { id: 3, category: 'Legal', name: 'Entity Formation Docs', required: true },
            { id: 4, category: 'Collateral', name: 'Appraisal Report', required: true, condition: 'LTV > 50%' }
        ],
        underwriting: [
            { metric: 'DSCR', threshold: '1.25x', policy: 'Hard Stop' },
            { metric: 'Max LTV', threshold: '80%', policy: 'Exception Allowed' },
            { metric: 'Min Credit Score', threshold: '680', policy: 'Exception Allowed' },
            { metric: 'Global Debt Yield', threshold: '10%', policy: 'Hard Stop' }
        ]
    });

    const history = [
        { ver: '1.2', status: 'Active', date: '2023-11-15', user: 'Sarah J', changes: 'Updated DSCR threshold to 1.25x' },
        { ver: '1.1', status: 'Retired', date: '2023-10-01', user: 'Mike R', changes: 'Added Cannabis exclusion' },
        { ver: '1.0', status: 'Retired', date: '2023-08-20', user: 'System', changes: 'Initial Import from LMS' }
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 animate-in fade-in slide-in-from-right-4 duration-300">

            {/* GLOBAL HEADER */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-start sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-slate-900">{program.name}</h1>
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wide border border-emerald-200">
                                {program.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="font-mono bg-slate-100 px-1.5 rounded text-slate-600">{program.code}</span>
                            <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
                                <Server size={14} /> Imported from LMS (Fiserv)
                            </span>
                            <span>v{program.version}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-red-600 transition-colors">
                        Retire Program
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 flex items-center gap-2">
                        <Edit3 size={16} /> Create New Version
                    </button>
                </div>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-8">

                {/* SECTION 1: LMS CORE ATTRIBUTES (READ-ONLY) */}
                <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                    <div className="absolute top-4 right-4 text-slate-300 group-hover:text-indigo-400 transition-colors" title="Managed by LMS - Read Only">
                        <Lock size={20} />
                    </div>

                    <div className="px-6 py-4 border-b border-slate-100 bg-indigo-50/10">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Server size={20} className="text-indigo-500" />
                            LMS Product Definition
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Core product terms sourced from system of record. Updates require LMS refresh.
                            Last sync: <span className="font-mono">{lmsData.lastSync}</span>
                        </p>
                    </div>

                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Loan Amounts</div>
                            <div className="text-sm font-semibold text-slate-700">{lmsData.minAmount} - {lmsData.maxAmount}</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Term Range</div>
                            <div className="text-sm font-semibold text-slate-700">{lmsData.termRange}</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Rate Structure</div>
                            <div className="text-sm font-semibold text-slate-700">{lmsData.rateType}</div>
                            <div className="text-xs text-slate-400 mt-0.5">Amort: {lmsData.amortization}</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Regulatory Rules</div>
                            <div className="flex flex-wrap gap-2">
                                {lmsData.regulatory.map(reg => (
                                    <span key={reg} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium border border-slate-200">
                                        {reg}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3-COLUMN LAYOUT FOR LOS CONFIG */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COL 1: ELIGIBILITY & DOCS */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* SECTION 2: LOS ELIGIBILITY */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Shield size={20} className="text-blue-500" />
                                    Eligibility Rules (LOS)
                                </h2>
                                <button className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide">Edit Rules</button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <div className="text-sm font-bold text-slate-700 mb-2">Allowed Borrower Types</div>
                                    <div className="flex flex-wrap gap-2">
                                        {losConfig.eligibility.borrowerTypes.map(t => (
                                            <span key={t} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-medium">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-sm font-bold text-slate-700 mb-2">Target Industries</div>
                                        <ul className="list-disc list-outside ml-4 space-y-1">
                                            {losConfig.eligibility.industries.map(i => (
                                                <li key={i} className="text-sm text-slate-600">{i}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-slate-700 mb-2">Excluded Industries</div>
                                        <ul className="list-disc list-outside ml-4 space-y-1">
                                            {losConfig.eligibility.excludedIndustries.map(i => (
                                                <li key={i} className="text-sm text-red-600">{i}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 3: DOCUMENTS */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <FileText size={20} className="text-amber-500" />
                                    Required Documents
                                </h2>
                                <button className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wide">Configure</button>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {losConfig.documents.map(doc => (
                                    <div key={doc.id} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-slate-100 rounded text-slate-500">
                                                <FileText size={16} />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-slate-800">{doc.name}</div>
                                                {doc.condition && (
                                                    <div className="text-xs text-amber-600 flex items-center gap-1">
                                                        <AlertTriangle size={10} /> Condition: {doc.condition}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{doc.category}</span>
                                            {doc.required && (
                                                <div className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded mt-0.5 inline-block ml-2">REQUIRED</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* COL 2: UNDERWRITING & METRICS */}
                    <div className="space-y-8">

                        {/* SECTION: CAPITAL ALIGNMENT (NEW) */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-emerald-50/50">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Activity size={20} className="text-emerald-600" />
                                    Capital Alignment
                                </h2>
                                <div className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full border border-emerald-200">
                                    Auto-Derived
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                {/* 1. Eligible Structures */}
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Eligible Fund Structures</div>
                                    <div className="flex gap-2">
                                        {['Revolving Loan Fund', 'Blended Capital Fund'].map(tag => (
                                            <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium border border-slate-200">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Capital Composition */}
                                <div>
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Typical Capital Composition</div>
                                        <div className="text-xs font-medium text-slate-500">Based on active rules</div>
                                    </div>
                                    <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-blue-500 w-[30%]" title="Grant: 30%"></div>
                                        <div className="h-full bg-purple-500 w-[40%]" title="PRI: 40%"></div>
                                        <div className="h-full bg-slate-400 w-[30%]" title="Debt: 30%"></div>
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs text-slate-500 font-medium">
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Grant (~30%)</div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> PRI (~40%)</div>
                                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400"></div> Debt (~30%)</div>
                                    </div>
                                </div>

                                {/* 3. Cost & Mandates */}
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Cost of Capital</div>
                                        <div className="text-lg font-bold text-slate-900">2.1% – 2.6%</div>
                                        <div className="text-[10px] text-slate-400 mt-1">Weighted Avg.</div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Mandates Satisfied</div>
                                        <div className="space-y-1">
                                            {['CRA Eligible', 'Multifamily < 80% AMI', 'LMI Tracts'].map(m => (
                                                <div key={m} className="flex items-center gap-1.5 text-xs text-emerald-700">
                                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                                    {m}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 4: UNDERWRITING */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Settings size={20} className="text-slate-500" />
                                    Underwriting Criteria
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                {losConfig.underwriting.map(rule => (
                                    <div key={rule.metric} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                        <div>
                                            <div className="text-sm font-medium text-slate-700">{rule.metric}</div>
                                            <div className={`text-xs ${rule.policy === 'Hard Stop' ? 'text-red-600' : 'text-slate-400'}`}>
                                                {rule.policy}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-base font-bold text-slate-900">{rule.threshold}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* SECTION 6: ACTIVE USAGE */}
                        <section className="bg-slate-900 rounded-xl shadow-lg shadow-slate-200 overflow-hidden text-white p-6">
                            <div className="flex items-center gap-2 mb-6 text-slate-300">
                                <Activity size={20} />
                                <span className="font-bold tracking-wide uppercase text-xs">Program Usage</span>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <div className="text-3xl font-bold text-emerald-400">{program.activeLoans}</div>
                                    <div className="text-sm text-slate-400">Active Loans</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-blue-400">12</div>
                                    <div className="text-sm text-slate-400">In Underwriting</div>
                                </div>
                                <div className="col-span-2 pt-4 border-t border-slate-800">
                                    <div className="flex gap-2 items-start text-xs text-amber-200 bg-amber-900/30 p-2 rounded border border-amber-900/50">
                                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                        <span>Editing this program will create a new version (v{parseFloat(program.version) + 0.1}). Existing loans will remain on v{program.version}.</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* SECTION 7: HISTORY */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <History size={20} className="text-slate-400" />
                                    Version History
                                </h2>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {history.map(ver => (
                                    <div key={ver.ver} className="px-6 py-3 hover:bg-slate-50 transition-colors">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-slate-800 text-sm">v{ver.ver}</span>
                                            <span className="text-xs text-slate-400">{ver.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-600 line-clamp-1">{ver.changes}</p>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoanProgramDetail;
