import React from 'react';
import { Eye, FileText, Trash2, CheckCircle2, ShieldCheck, Database } from 'lucide-react';

const SelectedProgramCard = ({ program, onViewDetails, onViewDocs, onRemove }) => {
    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="p-4">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-bold text-slate-800 text-sm">{program.name}</div>

                        {/* Badges */}
                        {program.recommended && (
                            <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold uppercase tracking-wide rounded border border-emerald-200 flex items-center gap-1">
                                REC.
                            </span>
                        )}

                        {program.source === 'NATIVE' ? (
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-bold uppercase tracking-wide rounded border border-blue-200 flex items-center gap-1">
                                NATIVE
                            </span>
                        ) : (
                            <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[9px] font-bold uppercase tracking-wide rounded border border-purple-200 flex items-center gap-1">
                                <Database size={10} /> LMS
                            </span>
                        )}
                    </div>
                </div>

                {/* Body: Terms */}
                <div className="flex items-center gap-3 text-xs text-slate-600 mb-1">
                    <div className="font-medium bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {program.rate}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <div className="font-medium bg-slate-50 px-2 py-1 rounded border border-slate-100">
                        {program.term}
                    </div>
                </div>
            </div>

            {/* Footer Action Bar */}
            <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 flex justify-end items-center gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); onViewDetails(program); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded transition-all"
                    title="View Program Details"
                >
                    <Eye size={14} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onViewDocs(program); }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-sm rounded transition-all"
                    title="Required Documents"
                >
                    <FileText size={14} />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1"></div>
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(program.id); }}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-white hover:shadow-sm rounded transition-all"
                    title="Remove Program"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
};

export default SelectedProgramCard;
