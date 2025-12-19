import React, { useState } from 'react';
import {
    Activity, AlertTriangle, CheckCircle2, FileText,
    TrendingUp, TrendingDown, DollarSign, ShieldAlert,
    UserCheck, Clock, CheckSquare, AlertOctagon, Info
} from 'lucide-react';

const UnderwritingTab = ({ loan }) => {
    // --------------------------------------------------------------------------
    // MOCK DATA: Underwriting Decision & Metrics
    // --------------------------------------------------------------------------
    const [decisionData] = useState({
        summary: {
            rating: 'B+',
            status: 'Conditionally Approved',
            riskLevel: 'Moderate',
            recommendation: 'Approve with Conditions',
            lastUpdated: 'Dec 07, 2023'
        },
        metrics: [
            { label: 'DSCR', value: '1.25x', threshold: '1.20x', status: 'pass', trend: 'stable' },
            { label: 'LTV', value: '72%', threshold: '75%', status: 'pass', trend: 'down' },
            { label: 'Debt Yield', value: '9.8%', threshold: '10.0%', status: 'fail', trend: 'flat' },
            { label: 'Global Cash Flow', value: '$1.2M', threshold: '$1.0M', status: 'pass', trend: 'up' },
            { label: 'Net Worth', value: '$15.5M', threshold: '$10.0M', status: 'pass', trend: 'up' },
            { label: 'Liquidity', value: '$2.1M', threshold: '$1.5M', status: 'pass', trend: 'down' }
        ],
        exceptions: [
            {
                id: 'ex1',
                type: 'Policy Exception',
                policy: 'Credit Policy 4.2 (Debt Yield Min)',
                breach: '9.8% vs 10.0% Min',
                mitigant: 'Sponsor has significant post-close liquidity ($2M+) and property is in a high-growth submarket with 5% rent growth YoY.',
                status: 'Approved',
                approver: 'Credit Committee',
                date: 'Dec 05, 2023'
            }
        ],
        analysis: {
            business: "Borrower is an experienced operator with 15+ years in the multifamily sector. The subject property is a 45-unit Class B apartment complex in a stabilizing neighborhood. Value-add plan involves renovating 20% of units to achieve market rents.",
            management: "Sponsor (Apex Holdings) manages 2,000+ units locally. Property management will be third-party (Greystar). Historical occupancy has been strong (95%+).",
            risks: [
                "Debt Yield below 10% threshold (9.8%) due to higher leverage request.",
                "Market vacancy has ticked up slightly to 6% in Q3.",
                "Renovation budget includes 10% contingency which may be tight given labor costs."
            ],
            mitigants: [
                "Sponsor is injecting 35% equity ($4.5M).",
                "DSCR is healthy at 1.25x based on T-12.",
                "6-month Interest Reserve required at closing."
            ]
        },
        conditions: [
            { id: 'c1', type: 'Precedent', desc: 'Proof of Insurance naming Lender as Loss Payee', status: 'Open' },
            { id: 'c2', type: 'Precedent', desc: 'Copy of executed Management Agreement', status: 'Satisfied' },
            { id: 'c3', type: 'Subsequent', desc: 'Quarterly Operating Statements (ongoing)', status: 'Open' }
        ],
        approval: {
            underwriter: 'Alex Morgan',
            reviewer: 'Sarah Jenkins',
            approver: 'Credit Committee (Level 2)',
            date: 'Dec 06, 2023 14:30 EST'
        }
    });

    // Helper for Metric Status Color
    const getStatusColor = (status) => {
        if (status === 'pass') return 'text-green-600 bg-green-50 border-green-200';
        if (status === 'fail') return 'text-red-600 bg-red-50 border-red-200'; // Exception usually
        return 'text-amber-600 bg-amber-50 border-amber-200';
    };

    return (
        <div className="flex flex-col gap-6 p-1 max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* 1. RISK SUMMARY DECK */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex justify-between items-center">
                    <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Activity size={16} className="text-blue-600" />
                        Risk Summary
                    </h2>
                    <span className="text-xs text-slate-400 font-mono">Last Updated: {decisionData.summary.lastUpdated}</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="p-4 rounded-lg bg-blue-50/50 border border-blue-100 flex flex-col items-center justify-center text-center">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Risk Rating</div>
                        <div className="text-3xl font-black text-slate-800 tracking-tight">{decisionData.summary.rating}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-green-50/50 border border-green-100 flex flex-col items-center justify-center text-center">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Decision</div>
                        <div className="text-lg font-bold text-green-700">{decisionData.summary.status}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 flex flex-col items-center justify-center text-center">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Risk Risk Level</div>
                        <div className="text-lg font-bold text-slate-700">{decisionData.summary.riskLevel}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-100 flex flex-col items-center justify-center text-center">
                        <div className="text-xs text-slate-500 font-bold uppercase mb-1">Recommendation</div>
                        <div className="text-sm font-bold text-indigo-700 leading-tight">{decisionData.summary.recommendation}</div>
                    </div>
                </div>
            </div>

            {/* 2. KEY FINANCIAL METRICS */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200">
                    <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp size={18} className="text-slate-400" />
                        Key Financial Metrics
                    </h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {decisionData.metrics.map((metric, idx) => (
                            <div key={idx} className={`p-3 rounded-lg border ${getStatusColor(metric.status)} bg-opacity-30`}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">{metric.label}</span>
                                    {metric.status === 'fail' && <AlertOctagon size={12} className="text-red-600" />}
                                    {metric.status === 'pass' && <CheckCircle2 size={12} className="text-green-600" />}
                                </div>
                                <div className="text-2xl font-bold tracking-tight mb-1">{metric.value}</div>
                                <div className="text-[10px] font-medium opacity-80 flex items-center gap-1">
                                    Target: {metric.threshold}
                                    {metric.trend === 'up' && <TrendingUp size={10} />}
                                    {metric.trend === 'down' && <TrendingDown size={10} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. POLICY EXCEPTIONS & OVERRIDES */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
                <div className="px-6 py-4 border-b border-slate-200 bg-amber-50/30">
                    <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <ShieldAlert size={18} className="text-amber-500" />
                        Policy Exceptions & Mitigants
                    </h2>
                </div>
                <div className="p-0">
                    {decisionData.exceptions.map((ex) => (
                        <div key={ex.id} className="p-6 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="md:w-1/3 space-y-2">
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">
                                        {ex.type}
                                    </span>
                                    <div className="text-sm font-bold text-slate-800">{ex.policy}</div>
                                    <div className="text-xs text-red-600 font-medium bg-red-50 inline-block px-2 py-1 rounded">
                                        Breach: {ex.breach}
                                    </div>
                                    <div className="pt-2 flex items-center gap-2 text-xs text-slate-400">
                                        <UserCheck size={12} />
                                        Approved by {ex.approver} on {ex.date}
                                    </div>
                                </div>
                                <div className="md:w-2/3 bg-slate-50 p-4 rounded-lg border border-slate-200/50">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                                        <CheckCircle2 size={12} className="text-green-600" />
                                        Compensating Factors
                                    </h4>
                                    <p className="text-sm text-slate-700 leading-relaxed">
                                        {ex.mitigant}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. UNDERWRITER ANALYSIS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Narrative Sections */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="px-6 py-4 border-b border-slate-200">
                            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                                <FileText size={18} className="text-slate-400" />
                                Deal Analysis
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">

                            {/* Business */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-2 border-blue-500 pl-3">
                                    Business Overview
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed pl-4">
                                    {decisionData.analysis.business}
                                </p>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Management */}
                            <section>
                                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 border-l-2 border-blue-500 pl-3">
                                    Management Assessment
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed pl-4">
                                    {decisionData.analysis.management}
                                </p>
                            </section>

                            <hr className="border-slate-100" />

                            {/* Risks & Mitigants */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <section className="bg-red-50/30 p-4 rounded-lg border border-red-100/50">
                                    <h3 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <AlertTriangle size={14} /> Key Risks
                                    </h3>
                                    <ul className="list-disc list-outside ml-4 space-y-2">
                                        {decisionData.analysis.risks.map((risk, i) => (
                                            <li key={i} className="text-sm text-slate-700 pl-1">{risk}</li>
                                        ))}
                                    </ul>
                                </section>

                                <section className="bg-green-50/30 p-4 rounded-lg border border-green-100/50">
                                    <h3 className="text-xs font-bold text-green-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <CheckSquare size={14} /> Mitigating Factors
                                    </h3>
                                    <ul className="list-disc list-outside ml-4 space-y-2">
                                        {decisionData.analysis.mitigants.map((mit, i) => (
                                            <li key={i} className="text-sm text-slate-700 pl-1">{mit}</li>
                                        ))}
                                    </ul>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. SIDEBAR: CONDITIONS & APPROVAL */}
                <div className="space-y-6">

                    {/* Conditions */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <CheckSquare size={16} className="text-slate-400" />
                                Conditions of Approval
                            </h2>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {decisionData.conditions.map(cond => (
                                <div key={cond.id} className="p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                                    <div className={`mt-0.5 ${cond.status === 'Satisfied' ? 'text-green-500' : 'text-slate-300'}`}>
                                        <CheckCircle2 size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-500 uppercase mb-0.5">{cond.type}</div>
                                        <div className={`text-sm font-medium ${cond.status === 'Satisfied' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                            {cond.desc}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Approval Trail */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50">
                            <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <UserCheck size={16} className="text-slate-400" />
                                Approval Sign-off
                            </h2>
                        </div>
                        <div className="p-5 space-y-6 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-6 top-8 bottom-8 w-px bg-slate-200"></div>

                            {/* Steps */}
                            <div className="relative flex items-center gap-4 z-10">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-white"></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase">Recommended By</div>
                                    <div className="text-sm font-bold text-slate-800">{decisionData.approval.underwriter}</div>
                                </div>
                            </div>

                            <div className="relative flex items-center gap-4 z-10">
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500 ring-4 ring-white"></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase">Reviewed By</div>
                                    <div className="text-sm font-bold text-slate-800">{decisionData.approval.reviewer}</div>
                                </div>
                            </div>

                            <div className="relative flex items-center gap-4 z-10">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white"></div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase">Final Approval</div>
                                    <div className="text-sm font-bold text-blue-700">{decisionData.approval.approver}</div>
                                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                        <Clock size={10} />
                                        {decisionData.approval.date}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UnderwritingTab;
