import React, { useState } from 'react';
import {
    FileText, Lock, ShieldCheck, AlertTriangle,
    CheckCircle2, FileCheck, Save, Printer, Send,
    ChevronDown, ChevronUp, Info, AlertCircle
} from 'lucide-react';

const CreditMemo = ({ loan }) => {
    // --- Mock Data: Financial Profile (Locked) ---
    const financialProfile = {
        status: 'Locked',
        source: '2024 Tax Return (Primary) + YTD QB',
        lockedBy: 'Alex Morgan',
        lockedDate: 'Dec 10, 2025',
        metrics: {
            revenue: { val: 1450000, trend: 'up' },
            ebitda: { val: 185000, trend: 'up' },
            dscr: { val: 1.25, status: 'pass' },
            ltv: { val: 65, status: 'pass' },
            leverage: { val: 2.8, status: 'pass' },
            liquidity: { val: 1.4, status: 'pass' }
        },
        // Mock Table Data
        incomeStatement: [
            { label: 'Gross Revenue', y1: 1200000, y2: 1450000, ytd: 1100000 },
            { label: 'COGS', y1: 700000, y2: 850000, ytd: 620000 },
            { label: 'Gross Profit', y1: 500000, y2: 600000, ytd: 480000 },
            { label: 'OpEx', y1: 380000, y2: 415000, ytd: 330000 },
            { label: 'EBITDA', y1: 120000, y2: 185000, ytd: 150000 },
        ]
    };

    // --- State: Narrative Sections (Editable) ---
    const [narrative, setNarrative] = useState({
        execSummary: "The borrower, Jenkins Catering, has shown strong resilience post-pandemic with a 20% YoY revenue growth. They are requesting $85k for inventory expansion to meet Q4 demand. Primary risks involve concentration in corporate events, but recent diversification into weddings mitigates this.",
        mitigants: "- Personal Guarantee from Sarah Jenkins (720 FICO)\n- UCC-1 Blanket Lien on all business assets including new inventory\n- LTV remains healthy at 65%",
        recommendation: "Recommend approval based on strong DSCR (1.25x) and 10-year industry tenure. Relationship allows for cross-sell of treasury services."
    });

    const [expandedSections, setExpandedSections] = useState({
        exec: true,
        borrower: true,
        financial: true,
        risk: true,
        collateral: false,
        covenants: false
    });

    const toggleSection = (key) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    const handleNarrativeChange = (field, val) => setNarrative(prev => ({ ...prev, [field]: val }));

    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    // --- Components ---
    const SectionBlock = ({ id, title, icon: Icon, children }) => (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
            <button
                onClick={() => toggleSection(id)}
                className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors text-left"
            >
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 shadow-sm">
                        <Icon size={18} />
                    </div>
                    <span className="font-bold text-slate-800 text-sm uppercase tracking-wide">{title}</span>
                </div>
                {expandedSections[id] ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </button>
            {expandedSections[id] && (
                <div className="p-6 animate-in fade-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    );

    return (
        <div className="flex h-full bg-slate-100/50">
            {/* --- Left Column: Document --- */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-4xl mx-auto">

                    {/* Doc Header */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                                <FileCheck className="text-blue-600" /> Credit Approval Memo
                            </h1>
                            <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                <span>ID: <span className="font-mono text-slate-700">CAM-2025-882</span></span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>Created: Dec 10, 2025</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wide">
                                Draft
                            </span>
                        </div>
                    </div>

                    {/* 1. Executive Summary */}
                    <SectionBlock id="exec" title="Executive Summary & Recommendation" icon={FileText}>
                        <div className="space-y-4">
                            <div className="flex gap-4 mb-4">
                                <div className="flex-1 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                    <div className="text-xs font-bold text-blue-600 uppercase mb-1">Loan Request</div>
                                    <div className="text-lg font-bold text-slate-900">{loan.amount}</div>
                                    <div className="text-xs text-slate-600">{loan.program} • {loan.purpose}</div>
                                </div>
                                <div className="flex-1 p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                                    <div className="text-xs font-bold text-emerald-600 uppercase mb-1">Proposed Rating</div>
                                    <div className="text-lg font-bold text-slate-900">4 - Satisfactory</div>
                                    <div className="text-xs text-slate-600">PD: 1.2% • LGD: 25%</div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Detailed Narrative</label>
                                <textarea
                                    className="w-full p-4 border border-slate-300 rounded-lg text-sm text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm min-h-[120px]"
                                    value={narrative.execSummary}
                                    onChange={(e) => handleNarrativeChange('execSummary', e.target.value)}
                                    placeholder="Enter executive summary..."
                                />
                            </div>
                        </div>
                    </SectionBlock>

                    {/* 2. Borrower Overview (Read Only) */}
                    <SectionBlock id="borrower" title="Borrower & Business Overview" icon={ShieldCheck}>
                        <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Borrower Name</div>
                                <div className="font-medium text-slate-900">{loan.borrower}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Industry (NAICS)</div>
                                <div className="font-medium text-slate-900">{loan.industry || '722320 - Caterers'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Years in Business</div>
                                <div className="font-medium text-slate-900">12 Years</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase mb-1">Entity Type</div>
                                <div className="font-medium text-slate-900">LLC</div>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-white border border-slate-200 rounded text-sm text-slate-600 italic">
                            Business description is pulled from the Borrower Profile entity. <a href="#" className="text-blue-600 hover:underline">View Entity</a>
                        </div>
                    </SectionBlock>

                    {/* 3. Financial Analysis (Locked) */}
                    <SectionBlock id="financial" title="Financial Analysis" icon={Lock}>
                        <div className="flex items-center justify-between mb-4 bg-slate-100 p-3 rounded-lg border border-slate-200">
                            <div className="flex items-center gap-2">
                                <Lock size={14} className="text-emerald-600" />
                                <span className="text-xs font-bold text-slate-700">Financial Profile Locked</span>
                            </div>
                            <div className="text-xs text-slate-500">Source: {financialProfile.source}</div>
                        </div>

                        {/* Ratios Strip */}
                        <div className="grid grid-cols-4 gap-4 mb-6">
                            {[
                                { label: 'DSCR', val: financialProfile.metrics.dscr.val + 'x', status: 'good' },
                                { label: 'LTV', val: financialProfile.metrics.ltv.val + '%', status: 'good' },
                                { label: 'Leverage', val: financialProfile.metrics.leverage.val + 'x', status: 'warn' }, // Mock warn
                                { label: 'Current Ratio', val: financialProfile.metrics.liquidity.val, status: 'good' },
                            ].map((m, i) => (
                                <div key={i} className="p-3 bg-white border border-slate-200 rounded-lg text-center shadow-sm">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{m.label}</div>
                                    <div className={`text-lg font-bold ${m.status === 'good' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {m.val}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Read-only Table */}
                        <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                            <table className="w-full text-sm text-right">
                                <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Metric</th>
                                        <th className="px-4 py-3">FY 2023</th>
                                        <th className="px-4 py-3 bg-blue-50/50">FY 2024</th>
                                        <th className="px-4 py-3">YTD 2025</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 bg-white">
                                    {financialProfile.incomeStatement.map((row, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 text-left font-medium text-slate-700">{row.label}</td>
                                            <td className="px-4 py-3 text-slate-600">{formatCurrency(row.y1)}</td>
                                            <td className="px-4 py-3 font-bold text-slate-900 bg-blue-50/30">{formatCurrency(row.y2)}</td>
                                            <td className="px-4 py-3 text-slate-600">{formatCurrency(row.ytd)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </SectionBlock>

                    {/* 4. Risk Analysis */}
                    <SectionBlock id="risk" title="Risk Analysis & Mitigants" icon={AlertTriangle}>
                        <div className="space-y-4">
                            <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                                <h4 className="text-xs font-bold text-amber-700 uppercase mb-3 flex items-center gap-2">
                                    <Info size={14} /> System Identified Risks
                                </h4>
                                <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                                    <li><strong>Customer Concentration:</strong> Top 3 clients account for 45% of revenue.</li>
                                    <li><strong>Sector Volatility:</strong> Event catering subject to seasonal fluctuations.</li>
                                </ul>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mitigating Factors</label>
                                <textarea
                                    className="w-full p-4 border border-slate-300 rounded-lg text-sm text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm min-h-[100px]"
                                    value={narrative.mitigants}
                                    onChange={(e) => handleNarrativeChange('mitigants', e.target.value)}
                                    placeholder="Enter risk mitigants..."
                                />
                            </div>
                        </div>
                    </SectionBlock>

                    {/* 5. Pricing & Collateral (Placeholder) */}
                    <SectionBlock id="collateral" title="Collateral & Security" icon={ShieldCheck}>
                        <div className="text-sm text-slate-500 italic p-4 text-center">
                            Collateral analysis module integration pending.
                        </div>
                    </SectionBlock>

                    {/* 6. Approval */}
                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-20">
                        <h3 className="text-sm font-bold text-slate-800 uppercase mb-4">Final Recommendation</h3>
                        <textarea
                            className="w-full p-4 border border-slate-300 rounded-lg text-sm text-slate-800 leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm min-h-[80px] mb-6"
                            value={narrative.recommendation}
                            onChange={(e) => handleNarrativeChange('recommendation', e.target.value)}
                        />
                        <div className="flex gap-4 pt-4 border-t border-slate-100 mb-6">
                            <div className="flex-1">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Prepared By</div>
                                <div className="font-medium">Alex Morgan</div>
                            </div>
                            <div className="flex-1">
                                <div className="text-xs text-slate-500 uppercase font-bold mb-1">Date</div>
                                <div className="font-medium">Dec 11, 2025</div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                            <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-md transition-all">
                                <Send size={18} /> Submit for Approval
                            </button>
                            <button className="px-4 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50">
                                <Save size={18} />
                            </button>
                            <button className="px-4 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50">
                                <Printer size={18} />
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* --- Right Column: Sidebar Actions --- */}
            <div className="w-[340px] bg-white border-l border-slate-200 shadow-xl z-20 flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-1">Memo Controls</h3>
                    <p className="text-xs text-slate-500">Validation & Policy Checks</p>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Financial Profile Status */}
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-500 uppercase">Financial Source</span>
                            <Lock size={12} className="text-emerald-600" />
                        </div>
                        <div className="text-sm font-bold text-slate-800 mb-1">2024 Tax + YTD</div>
                        <div className="text-xs text-slate-500 mb-3">Locked on Dec 10 by Alex M.</div>
                        <button className="w-full py-2 bg-white border border-slate-300 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm">
                            View Profile
                        </button>
                    </div>

                    {/* Policy Checks */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Policy Validation</h4>
                        <div className="space-y-3">
                            <ValidationItem label="DSCR > 1.20x" status="pass" />
                            <ValidationItem label="Credit Score > 680" status="pass" />
                            <ValidationItem label="Bankruptcy Check" status="pass" />
                            <ValidationItem label="Industry Restricted" status="pass" />
                            <ValidationItem label="LTV < 75%" status="pass" />
                            <ValidationItem label="Leverage < 3.0x" status="warn" msg="Approaching limit (2.8x)" />
                        </div>
                    </div>

                    {/* Completeness */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Completeness</h4>
                        <div className="w-full bg-slate-100 rounded-full h-2 mb-2 overflow-hidden">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <div className="text-xs text-slate-500 text-right">85% Ready</div>
                    </div>

                </div>

            </div>
        </div>
    );
};

const ValidationItem = ({ label, status, msg }) => {
    const isPass = status === 'pass';
    return (
        <div className="flex items-start gap-3">
            <div className={`mt-0.5 ${isPass ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isPass ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            </div>
            <div>
                <div className={`text-sm font-medium ${isPass ? 'text-slate-700' : 'text-slate-900'}`}>{label}</div>
                {msg && <div className="text-xs text-amber-600 mt-0.5">{msg}</div>}
            </div>
        </div>
    )
}

export default CreditMemo;
