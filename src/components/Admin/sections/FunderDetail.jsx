
import React, { useState } from 'react';
import {
    ArrowLeft, Plus, Edit2, Globe, Building2,
    Calendar, TrendingUp, AlertTriangle, Phone, Mail,
    FileText, PieChart, Clock, ShieldCheck
} from 'lucide-react';

const FunderDetail = ({ funder, onBack }) => {
    const [activeTab, setActiveTab] = useState('capital');

    // Mock Data for Tabs
    const mockCommitments = [
        { id: 1, agreement: 'EQ2 Investment 2023', amount: '$5,000,000', date: '2023-01-15', status: 'Active' },
        { id: 2, agreement: 'CRA Grant 2022', amount: '$250,000', date: '2022-06-10', status: 'Fully Disbursed' },
    ];

    return (
        <div className="flex flex-col h-full animate-in slide-in-from-right duration-300 bg-white">
            {/* 1. PAGE HEADER */}
            <div className="flex-none px-8 py-5 border-b border-slate-200 bg-white flex justify-between items-start sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{funder.name}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium text-slate-500">Funder / Investor Profile</span>
                            <span className="text-slate-300">•</span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${funder.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                {funder.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
                        <Edit2 size={16} />
                        Edit
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200">
                        <Plus size={16} />
                        Add Commitment
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50/50 p-8">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* SECTION 1 & 2: FUNDAMENTALS + RELATIONSHIP (Side by Side) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Section 1: Fundamentals */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <Building2 size={16} /> Fundamentals
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Legal Name</div>
                                        <div className="text-sm font-medium text-slate-900">{funder.name}, Inc.</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Funder Type</div>
                                        <div className="text-sm font-medium text-slate-900">{funder.type}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">Jurisdiction</div>
                                        <div className="text-sm font-medium text-slate-900">Delaware (US)</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 mb-1">EIN / Reg ID</div>
                                        <div className="text-sm font-medium text-slate-900 font-mono">13-5554321</div>
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-slate-100">
                                    <div className="text-xs text-slate-500 mb-1">Website</div>
                                    <a href="#" className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                                        <Globe size={14} /> www.example-foundation.org
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Relationship Context */}
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                                <TrendingUp size={16} /> Relationship Context
                            </h3>
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Relationship Tier</div>
                                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700`}>
                                        {funder.tier}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Motivation</div>
                                    <div className="text-sm font-medium text-slate-900">
                                        {funder.type.includes('Bank') ? 'CRA Credits' : 'Social Impact'}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">First Engagement</div>
                                    <div className="text-sm font-medium text-slate-900 flex items-center gap-1">
                                        <Calendar size={14} className="text-slate-400" /> Jan 15, 2018
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Renewal Likelihood</div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-emerald-500 w-[85%] rounded-full"></div>
                                        </div>
                                        <span className="text-xs font-bold text-emerald-600">High</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: CONTACTS */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-900">Key Contacts</h3>
                            <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Manage</button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {[1, 2].map((i) => (
                                <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                            {i === 1 ? 'JD' : 'AS'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">{i === 1 ? 'Jane Doe' : 'Alex Smith'}</div>
                                            <div className="text-xs text-slate-500">{i === 1 ? 'Program Officer' : 'Compliance Lead'}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 text-sm text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Mail size={14} className="text-slate-400" />
                                            <span>{i === 1 ? 'jane@example.org' : 'alex@example.org'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} className="text-slate-400" />
                                            <span>(212) 555-010{i}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 4: REPORTING EXPECTATIONS */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                            <Clock size={16} /> Reporting & Compliance
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-500 mb-1">Frequency</div>
                                <div className="text-base font-bold text-slate-900">{funder.reportingFreq}</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-500 mb-1">Format</div>
                                <div className="text-base font-bold text-slate-900">Excel + Narrative</div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-500 mb-1">Audit Required?</div>
                                <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                                    <ShieldCheck size={18} className="text-emerald-500" /> Yes
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-500 mb-1">Site Visits?</div>
                                <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                                    <AlertTriangle size={18} className="text-amber-500" /> Annually
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 5: TABS (READ ONLY) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
                        <div className="flex border-b border-slate-200 px-2 mt-2">
                            {[
                                { id: 'capital', label: 'Capital Commitments' },
                                { id: 'funds', label: 'Funds Impacted' },
                                { id: 'reports', label: 'Reports Submitted' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-blue-600 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-800'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <div className="p-0">
                            {activeTab === 'capital' && (
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Agreement Name</th>
                                            <th className="px-6 py-3 font-semibold">Amount</th>
                                            <th className="px-6 py-3 font-semibold">Date</th>
                                            <th className="px-6 py-3 font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {mockCommitments.map(c => (
                                            <tr key={c.id}>
                                                <td className="px-6 py-3 font-medium text-slate-900">{c.agreement}</td>
                                                <td className="px-6 py-3 text-slate-600">{c.amount}</td>
                                                <td className="px-6 py-3 text-slate-600">{c.date}</td>
                                                <td className="px-6 py-3">
                                                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                                                        {c.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            {activeTab !== 'capital' && (
                                <div className="p-8 text-center text-slate-400 italic">
                                    Read-only view for {activeTab} populated here.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer / Governance */}
                    <div className="text-center py-6">
                        <p className="text-xs text-slate-400 mb-2">Record created on Jan 15, 2018 by System Admin.</p>
                        <button className="text-xs text-red-400 hover:text-red-600 font-medium hover:underline">
                            Deactivate Funder Record
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FunderDetail;
