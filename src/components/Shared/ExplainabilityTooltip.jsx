import React from 'react';
import { Info, Calculator, Database, AlertCircle } from 'lucide-react';

const ExplainabilityTooltip = ({ children, formula, source, rationale, type = "metric" }) => {
    return (
        <div className="group relative inline-flex items-center gap-1 cursor-help">
            {children}
            <Info size={12} className="text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity" />

            {/* Tooltip Content */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 bg-slate-900 text-white p-4 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">

                {/* Connecting Arrow */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-8 border-transparent border-t-slate-900"></div>

                <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-2 border-b border-slate-700 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            {type === "metric" ? "Calculation Logic" : "Data Source"}
                        </span>
                    </div>

                    {/* Formula Section */}
                    {formula && (
                        <div className="flex gap-3">
                            <Calculator size={14} className="text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <span className="block text-xs font-bold text-slate-300">Formula</span>
                                <span className="text-xs text-slate-400 font-mono">{formula}</span>
                            </div>
                        </div>
                    )}

                    {/* Source Section */}
                    {source && (
                        <div className="flex gap-3">
                            <Database size={14} className="text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <span className="block text-xs font-bold text-slate-300">Source Fields</span>
                                <span className="text-xs text-slate-400">{source}</span>
                            </div>
                        </div>
                    )}

                    {/* Rationale Section */}
                    {rationale && (
                        <div className="flex gap-3">
                            <AlertCircle size={14} className="text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <span className="block text-xs font-bold text-slate-300">Rationale</span>
                                <span className="text-xs text-slate-400 italic">"{rationale}"</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExplainabilityTooltip;
