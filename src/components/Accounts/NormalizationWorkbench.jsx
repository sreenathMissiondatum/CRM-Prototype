import React, { useState, useMemo } from 'react';
import {
    ArrowLeft, Save, Lock, FileText, ChevronRight,
    AlertCircle, CheckCircle2, MoreHorizontal, Settings,
    History, Sparkles, AlertTriangle, Eye, ArrowRight
} from 'lucide-react';
import { generateRawFinItems } from '../../utils/FinancialDataEngine'; // For fallback or initial state

const NormalizationWorkbench = ({ onBack }) => {
    // In a real app, these would come from props/context. Using local state for prototype.
    const [lineItems, setLineItems] = useState(generateRawFinItems());
    const [selectedItemId, setSelectedItemId] = useState(lineItems[0].id);

    const selectedItem = lineItems.find(i => i.id === selectedItemId);

    // Derived Metrics
    const totalItems = lineItems.length;
    const mappedItems = lineItems.filter(i => i.mappingStatus === 'normalized').length;
    const completeness = Math.round((mappedItems / totalItems) * 100);
    const isLocked = false; // State for lock

    const handleUpdateCategory = (newCat) => {
        setLineItems(prev => prev.map(item =>
            item.id === selectedItemId ? { ...item, category: newCat, mappingStatus: 'normalized' } : item
        ));
    };

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
                            {completeness < 100 ? (
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider rounded">
                                    Draft • In Progress
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider rounded">
                                    Ready to Lock
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${completeness}%` }}></div>
                                </div>
                                <span className="font-bold text-slate-700">{completeness}% Mapped</span>
                            </div>
                            <span className="text-slate-300">•</span>
                            <span>{totalItems - mappedItems} items remaining</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors">
                        <Save size={16} /> Save Draft
                    </button>

                    {/* LOCK BUTTON LOGIC */}
                    {completeness === 100 ? (
                        <button className="flex items-center gap-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-lg shadow-sm transition-colors ring-2 ring-transparent focus:ring-slate-500">
                            <Lock size={16} /> Lock Statement
                        </button>
                    ) : (
                        <div className="group relative">
                            <button disabled className="flex items-center gap-2 text-sm font-medium text-slate-400 bg-slate-100 cursor-not-allowed px-4 py-2 rounded-lg">
                                <Lock size={16} /> Lock Statement
                            </button>
                            {/* Tooltip */}
                            <div className="absolute top-full right-0 mt-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                <div className="font-bold mb-1 flex items-center gap-1 text-amber-400">
                                    <AlertTriangle size={12} /> Cannot Lock
                                </div>
                                All line items must be fully mapped to a Master Category before locking.
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* MAIN CONTENT - 3 COLUMN LAYOUT */}
            <div className="flex-1 overflow-hidden flex">

                {/* COLUMN 1: SOURCE LINE ITEMS (25%) */}
                <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Items</h2>
                        <div className="flex gap-2 text-[10px] font-bold">
                            <span className="text-slate-500">{totalItems} Total</span>
                            <span className="text-amber-600">{totalItems - mappedItems} Left</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {lineItems.map(item => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItemId(item.id)}
                                className={`px-4 py-3 border-b border-slate-50 cursor-pointer transition-colors flex justify-between items-center group relative ${selectedItemId === item.id
                                    ? 'bg-blue-50 border-blue-100'
                                    : 'hover:bg-slate-50'
                                    }`}
                            >
                                {/* Active Indicator Bar */}
                                {selectedItemId === item.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>}

                                <div className="flex flex-col gap-0.5">
                                    <span className={`text-sm font-medium ${selectedItemId === item.id ? 'text-blue-700' : 'text-slate-700'}`}>
                                        {item.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400 group-hover:text-slate-500">
                                        {item.sourceRef}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-mono text-slate-600">${(item.amount / 1000).toFixed(1)}k</span>
                                    {getStatusIcon(item.mappingStatus)}
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
                                    <span className="text-2xl font-mono text-slate-700">${selectedItem.amount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {selectedItem.type === 'incS' ? (
                                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold rounded">Income Statement</span>
                                    ) : (
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-bold rounded">Balance Sheet</span>
                                    )}
                                    <span className="text-xs text-slate-400">Source: {selectedItem.sourceRef}</span>
                                </div>
                            </div>

                            {/* Section 1: Standard Classification */}
                            <div className="p-8 border-b border-slate-100 bg-slate-50/30">
                                <label className="block text-sm font-bold text-slate-700 mb-2">Master Financial Category</label>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedItem.category}
                                        onChange={(e) => handleUpdateCategory(e.target.value)}
                                        className="flex-1 h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm"
                                    >
                                        <optgroup label="Income Statement">
                                            <option value="Revenue">Revenue</option>
                                            <option value="COGS">Cost of Goods Sold</option>
                                            <option value="Operating Expenses">Operating Expenses</option>
                                            <option value="Taxes">Taxes</option>
                                            <option value="Other Income">Other Income</option>
                                        </optgroup>
                                        <optgroup label="Balance Sheet">
                                            <option value="Current Assets">Current Assets</option>
                                            <option value="Fixed Assets">Fixed Assets</option>
                                            <option value="Current Liabilities">Current Liabilities</option>
                                            <option value="Long Term Debt">Long Term Debt</option>
                                            <option value="Equity">Equity</option>
                                        </optgroup>
                                    </select>
                                    <button className="h-10 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2">
                                        <CheckCircle2 size={16} /> Confirm
                                    </button>
                                </div>

                                <div className="mt-4 p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex gap-3">
                                    <Sparkles size={16} className="text-blue-500 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="block text-xs font-bold text-blue-800">Impact Preview</span>
                                        <p className="text-xs text-slate-600 mt-1">
                                            Mapping to <span className="font-bold">{selectedItem.category}</span> affects:
                                            <span className="font-mono bg-white px-1 ml-1 border rounded">EBITDA</span>
                                            <span className="font-mono bg-white px-1 ml-1 border rounded">Net Income</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Section 2: Special Flags */}
                            <div className="p-8 border-b border-slate-100">
                                <h3 className="text-sm font-bold text-slate-800 mb-4">Adjustments & Flags</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center gap-3 p-3 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input type="checkbox" checked={selectedItem.isNonCash} readOnly className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                        <div className="flex-1">
                                            <span className="block text-sm font-bold text-slate-700">Non-Cash Item</span>
                                            <span className="text-xs text-slate-500">Add-back for Cash Flow & EBITDA (e.g. Depreciation)</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input type="checkbox" checked={selectedItem.isOwnerComp} readOnly className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                        <div className="flex-1">
                                            <span className="block text-sm font-bold text-slate-700">Owner Compensation</span>
                                            <span className="text-xs text-slate-500">Discretionary add-back for Seller's Discretionary Earnings</span>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 p-3 border border-dashed border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                        <input type="checkbox" checked={selectedItem.isInterest} readOnly className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                        <div className="flex-1">
                                            <span className="block text-sm font-bold text-slate-700">Interest Expense</span>
                                            <span className="text-xs text-slate-500">Relevant for DSCR Calculation</span>
                                        </div>
                                    </label>
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
