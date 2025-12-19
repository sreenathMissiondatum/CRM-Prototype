import React from 'react';
import { X, ShieldCheck, Database, FileText, Info, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

const ProgramDetailsDrawer = ({ isOpen, onClose, program }) => {
    if (!isOpen || !program) return null;

    return createPortal(
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col border-l border-slate-200">

                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm sticky top-0 z-10">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex gap-2 mb-2">
                            {program.source === 'LMS-FETCHED' ? (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wide rounded border border-purple-200 flex items-center gap-1">
                                    <Database size={10} /> LMS Synced
                                </span>
                            ) : (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide rounded border border-blue-200 flex items-center gap-1">
                                    Native
                                </span>
                            )}
                            {program.recommended && (
                                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide rounded border border-emerald-200 flex items-center gap-1">
                                    <ShieldCheck size={10} /> Recommended
                                </span>
                            )}
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-white border border-slate-200 hover:border-slate-300 p-1 rounded-md transition-all shadow-sm">
                            <X size={18} />
                        </button>
                    </div>
                    <h2 className="text-xl font-bold text-slate-800 leading-tight">{program.name}</h2>
                    <div className="text-xs font-mono text-slate-400 mt-1">{program.code}</div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* 1. Core Terms */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                            <div className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                                <TrendingUp size={12} /> Rate
                            </div>
                            <div className="font-bold text-slate-800">{program.rate}</div>
                            <div className="text-[10px] text-slate-500 mt-1 leading-snug">
                                {program.rules?.rateDetails || "Standard rate rules apply."}
                            </div>
                        </div>
                        <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-100">
                            <div className="text-xs text-amber-600 font-bold uppercase tracking-wide mb-1 flex items-center gap-1">
                                <Calendar size={12} /> Term
                            </div>
                            <div className="font-bold text-slate-800">{program.term}</div>
                            <div className="text-[10px] text-slate-500 mt-1 leading-snug">
                                {program.rules?.termDetails || "Standard term rules apply."}
                            </div>
                        </div>
                    </div>

                    {/* 2. Description */}
                    <div>
                        <h3 className="section-header">Description</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {program.description}
                        </p>
                    </div>

                    {/* 3. Eligibility Rules */}
                    <div>
                        <h3 className="section-header">Eligibility Criteria</h3>
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed">
                            {program.rules?.eligibility || "No specific eligibility notes."}
                        </div>
                    </div>

                    {/* 4. Underwriting Notes */}
                    <div>
                        <h3 className="section-header">Underwriting Notes</h3>
                        <div className="flex gap-3 items-start p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                            <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-slate-600 leading-relaxed italic">
                                {program.rules?.underwritingNotes || "Standard underwriting guidelines apply."}
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-white">
                    <button className="w-full py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:text-slate-800 hover:border-slate-400 font-medium text-sm transition-colors">
                        Open in Program Manager
                    </button>
                </div>
            </div>

            <style>{`
                .section-header {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #94a3b8; /* slate-400 */
                    margin-bottom: 0.75rem;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default ProgramDetailsDrawer;
