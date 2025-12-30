import React from 'react';
import { X, CheckCircle, AlertCircle, HelpCircle, Shield, ArrowRight, BookOpen, PenTool, ExternalLink } from 'lucide-react';

const EligibilityExplanationPanel = ({ isOpen, onClose, data }) => {
    if (!isOpen) return null;

    // Mock Factors Data (In a real app, this would come from `data` prop)
    const factors = [
        { label: 'Geography', value: 'Detroit, MI', expectation: 'Within Service Area', result: 'Pass' },
        { label: 'Loan Amount', value: '$75,000', expectation: '$10k - $250k', result: 'Pass' },
        { label: 'Business Age', value: '5 Years', expectation: 'Min. 2 Years', result: 'Pass' },
        { label: 'Credit Score', value: '680-720', expectation: 'Min. 600', result: 'Pass' },
        { label: 'Revenue', value: 'Not Verified', expectation: 'Min. $100k', result: 'Unknown' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">Eligibility Explainability</div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Why {data?.eligibility || 'Likely Eligible'}?
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Intro / Disclaimer */}
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                        <Shield size={20} className="text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800 leading-relaxed">
                            This assessment is based on early lead information and program eligibility criteria.
                            <strong> It is not a credit or underwriting decision.</strong>
                        </div>
                    </div>

                    {/* Summary Highlights */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Key Signals</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
                                Geography aligns with service area (Detroit)
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
                                Requested amount ($75k) fits program range
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
                                Business age meets minimum requirement
                            </li>
                            <li className="flex items-start gap-2 text-sm text-slate-600">
                                <CheckCircle size={16} className="text-emerald-500 mt-0.5" />
                                Self-reported credit meets threshold
                            </li>
                        </ul>
                    </div>

                    {/* Factor Breakdown Table */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Factor Breakdown</h3>
                        <div className="border border-slate-200 rounded-lg overflow-hidden text-sm">
                            <table className="w-full">
                                <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase text-left">
                                    <tr>
                                        <th className="px-3 py-2">Factor</th>
                                        <th className="px-3 py-2">Value</th>
                                        <th className="px-3 py-2 text-right">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {factors.map((factor, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="px-3 py-2 font-medium text-slate-700">{factor.label}</td>
                                            <td className="px-3 py-2 text-slate-500">{factor.value}</td>
                                            <td className="px-3 py-2 text-right">
                                                {factor.result === 'Pass' && <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">Pass</span>}
                                                {factor.result === 'Caution' && <span className="text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Check</span>}
                                                {factor.result === 'Unknown' && <span className="text-slate-500 font-bold text-xs bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">Unknown</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Confidence Band */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase text-slate-500">Confidence Level</span>
                            <span className="text-xs font-bold text-emerald-600">High</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full w-3/4 rounded-full"></div>
                        </div>
                        <p className="text-xs text-slate-500 leading-normal">
                            All primary pre-screening criteria are currently met. Some financial data (Revenue) is self-reported and requires verification.
                        </p>
                    </div>

                    {/* Coaching / Changes */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <HelpCircle size={16} className="text-blue-500" />
                            What could change this?
                        </h3>
                        <div className="space-y-2">
                            <div className="flex gap-3 items-start p-3 bg-white border border-slate-100 shadow-sm rounded-lg">
                                <span className="text-amber-500 font-bold text-lg leading-none">?</span>
                                <p className="text-sm text-slate-600">If requested amount exceeds program maximum, eligibility may decrease.</p>
                            </div>
                            <div className="flex gap-3 items-start p-3 bg-white border border-slate-100 shadow-sm rounded-lg">
                                <span className="text-amber-500 font-bold text-lg leading-none">?</span>
                                <p className="text-sm text-slate-600">If revenue validation fails ($100k min), Technical Assistance may be required.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="border-t border-slate-200 p-6 bg-slate-50 space-y-3">
                    <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 rounded-lg font-medium transition-colors shadow-sm">
                        <PenTool size={16} /> Edit Pre-Screening Details
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 rounded-lg font-medium transition-colors shadow-sm text-xs">
                            <BookOpen size={14} /> View Criteria
                        </button>
                        <button className="flex items-center justify-center gap-2 py-2 px-4 bg-white border border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 rounded-lg font-medium transition-colors shadow-sm text-xs">
                            <ExternalLink size={14} /> Create TA Req
                        </button>
                    </div>

                    <div className="pt-2 text-[10px] text-slate-400 text-center leading-tight">
                        Eligibility is an early-stage, advisory signal. It does not represent a credit decision and does not replace underwriting.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EligibilityExplanationPanel;
