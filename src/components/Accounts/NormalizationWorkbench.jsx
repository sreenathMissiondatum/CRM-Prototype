import React, { useState } from 'react';
import {
    ArrowLeft, Save, Lock, FileText, ChevronRight,
    AlertCircle, CheckCircle2, MoreHorizontal, Settings,
    History, Sparkles, AlertTriangle, Eye
} from 'lucide-react';

const NormalizationWorkbench = ({ onBack }) => {
    const [selectedItemId, setSelectedItemId] = useState(2); // Default to a line needing review

    // Mock Data for Line Items
    const lineItems = [
        { id: 1, name: "Gross Revenue – Sales", amount: "$1,250,000", status: "normalized", sourceRef: "Part I, Line 1a" },
        { id: 2, name: "Advertising Expense", amount: "$12,500", status: "review", sourceRef: "Part III, Line 19" },
        { id: 3, name: "Cost of Goods Sold", amount: "$650,000", status: "normalized", sourceRef: "Part I, Line 2" },
        { id: 4, name: "Salaries & Wages", amount: "$145,000", status: "normalized", sourceRef: "Part III, Line 7" },
        { id: 5, name: "Repairs & Maintenance", amount: "$8,200", status: "auto", sourceRef: "Part III, Line 9" },
        { id: 6, name: "Other Deductions", amount: "$4,500", status: "manual", sourceRef: "Part III, Line 19" },
    ];

    const selectedItem = lineItems.find(i => i.id === selectedItemId);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'normalized': return <CheckCircle2 size={14} className="text-emerald-500" />;
            case 'review': return <AlertCircle size={14} className="text-amber-500" />;
            case 'auto': return <Sparkles size={14} className="text-blue-500" />;
            case 'manual': return <div className="text-[10px] bg-slate-200 px-1 rounded text-slate-600 font-bold">M</div>;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">

            {/* TOP HEADER */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-bold text-slate-900">Tax Return 1120-S (2024)</h1>
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider rounded">
                                Draft • Not Used in Underwriting
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <span className="font-medium">Jan 1, 2024 – Dec 31, 2024</span>
                            <span className="text-slate-300">•</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">12 Months</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-emerald-600 font-medium flex items-center gap-1">
                                <CheckCircle2 size={10} /> 88% Mapped
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors">
                        <Save size={16} /> Save Draft
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg shadow-sm transition-colors">
                        <Lock size={16} /> Lock Statement
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT - 3 COLUMN LAYOUT */}
            <div className="flex-1 overflow-hidden flex">

                {/* COLUMN 1: SOURCE LINE ITEMS (25%) */}
                <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Line Items</h2>
                        <span className="text-xs text-slate-500">{lineItems.length} items</span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {lineItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItemId(item.id)}
                                className={`px-4 py-3 border-b border-slate-50 cursor-pointer transition-colors flex justify-between items-center group ${selectedItemId === item.id
                                        ? 'bg-blue-50 border-blue-100'
                                        : 'hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex flex-col gap-0.5">
                                    <span className={`text-sm font-medium ${selectedItemId === item.id ? 'text-blue-700' : 'text-slate-700'}`}>
                                        {item.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 group-hover:text-slate-500">
                                        {item.sourceRef}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-mono text-slate-600">{item.amount}</span>
                                    {getStatusIcon(item.status)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMN 2: INTELLIGENCE WORKBENCH (45%) */}
                <div className="flex-1 bg-white flex flex-col overflow-y-auto">
                    {selectedItem ? (
                        <>
                            {/* Selected Item Header */}
                            <div className="p-8 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1 block">Selected Line Item</span>
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-2xl font-bold text-slate-900">{selectedItem.name}</h2>
                                    <span className="text-2xl font-mono text-slate-700">{selectedItem.amount}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded border border-slate-200">
                                        Income Statement
                                    </span>
                                    <span className="text-xs text-slate-400">Source: IRS 1120-S</span>
                                </div>
                            </div>

                            {/* Section 1: Standard Classification */}
                            <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Financial Category</label>
                                <div className="flex gap-2">
                                    <select className="flex-1 h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer">
                                        <option>Operating Expense</option>
                                        <option>Cost of Goods Sold</option>
                                        <option>Revenue</option>
                                        <option>Other Income</option>
                                        <option>Non-Operating Expense</option>
                                    </select>
                                    <button className="h-10 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                                        Apply
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                                    <CheckCircle2 size={12} className="text-emerald-500" />
                                    Updates EBITDA, Operating Income, and Net Income calculations.
                                </p>
                            </div>

                            {/* Section 2: Classification Intelligence */}
                            <div className="p-8 border-b border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                        <Sparkles size={16} className="text-indigo-500" />
                                        Classification Intelligence
                                    </h3>
                                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold border border-indigo-100">AI Confidence: 98%</span>
                                </div>

                                <div className="grid grid-cols-2 gap-6 bg-slate-50 rounded-xl p-5 border border-slate-200">
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Raw Source Category</span>
                                        <div className="flex items-center gap-2 font-medium text-slate-700 text-sm">
                                            <Lock size={12} className="text-slate-400" />
                                            {selectedItem.name}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Master Financial Category</span>
                                        <div className="flex items-center gap-2 font-medium text-slate-700 text-sm">
                                            <History size={12} className="text-slate-400" />
                                            Expense (Derived)
                                        </div>
                                    </div>
                                    <div className="col-span-2 pt-4 border-t border-slate-200">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Analytical Impact</span>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded border border-emerald-100 flex items-center gap-1">
                                                <CheckCircle2 size={10} /> EBITDA Impact
                                            </span>
                                            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded border border-emerald-100 flex items-center gap-1">
                                                <CheckCircle2 size={10} /> Net Operating Income
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 3: Audit Trail */}
                            <div className="p-8">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <History size={16} className="text-slate-400" />
                                    Normalization Details
                                </h3>
                                <div className="space-y-4 text-sm text-slate-600">
                                    <div className="flex justify-between py-2 border-b border-slate-50">
                                        <span className="text-slate-500">Classification Method</span>
                                        <span className="font-medium flex items-center gap-1.5">
                                            <Sparkles size={12} className="text-blue-500" /> Auto-Classified (Heuristics)
                                        </span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-50">
                                        <span className="text-slate-500">Normalized By</span>
                                        <span className="font-medium">System (Cortex v2.4)</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b border-slate-50">
                                        <span className="text-slate-500">Last Reviewed</span>
                                        <span className="font-medium text-slate-400 italic">Never</span>
                                    </div>
                                </div>
                            </div>

                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-slate-400">
                            Select a line item to view details
                        </div>
                    )}
                </div>

                {/* COLUMN 3: SOURCE PREVIEW (30%) */}
                <div className="w-[400px] border-l border-slate-200 bg-slate-100 shrink-0 flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <Eye size={14} /> Source Document
                        </h2>
                        <button className="text-blue-600 text-xs font-medium hover:underline">
                            Open PDF
                        </button>
                    </div>
                    {/* Simulated PDF Preview */}
                    <div className="flex-1 p-6 overflow-y-auto">
                        <div className="bg-white shadow-sm border border-slate-300 min-h-[500px] w-full p-8 text-[8px] text-slate-300 font-serif leading-loose select-none relative">
                            {/* Highlighting selected area */}
                            <div className="absolute top-[32%] left-[10%] right-[10%] h-8 bg-blue-500/10 border border-blue-500/50 rounded flex items-center px-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-sm"></div>
                            </div>

                            <div className="w-full h-4 bg-slate-200 mb-6"></div>
                            <div className="w-2/3 h-4 bg-slate-200 mb-12"></div>

                            <div className="space-y-3">
                                <div className="flex justify-between"><div className="w-1/3 h-2 bg-slate-100"></div><div className="w-1/6 h-2 bg-slate-100"></div></div>
                                <div className="flex justify-between"><div className="w-1/2 h-2 bg-slate-100"></div><div className="w-1/6 h-2 bg-slate-100"></div></div>
                                <div className="flex justify-between"><div className="w-1/4 h-2 bg-slate-100"></div><div className="w-1/6 h-2 bg-slate-100"></div></div>
                                <div className="flex justify-between"><div className="w-1/3 h-2 bg-slate-100"></div><div className="w-1/6 h-2 bg-slate-100"></div></div>
                                {/* Mock Matches */}
                                <div className="flex justify-between pt-20"><div className="w-1/3 h-2 bg-slate-800 opacity-20"></div><div className="w-1/6 h-2 bg-slate-800 opacity-20"></div></div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NormalizationWorkbench;
