import React from 'react';
import { X, FileText, ExternalLink, Info, Database, FileCheck } from 'lucide-react';
import { createPortal } from 'react-dom';

const RequiredDocumentsModal = ({ isOpen, onClose, program, onOpenFullDetails }) => {
    if (!isOpen || !program) return null;

    // Group documents by category
    const groupedDocs = program.requiredDocuments?.reduce((acc, doc) => {
        const cat = doc.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(doc);
        return acc;
    }, {}) || {};

    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FileCheck size={18} className="text-blue-600" /> Required Documents
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            For <span className="font-semibold text-slate-700">{program.name}</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {Object.keys(groupedDocs).length === 0 ? (
                        <div className="text-center py-8 text-slate-500 italic text-sm">
                            No specific documents defined for this program.
                        </div>
                    ) : (
                        Object.entries(groupedDocs).map(([category, docs]) => (
                            <div key={category}>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    {category}
                                </h3>
                                <div className="space-y-3">
                                    {docs.map(doc => (
                                        <div key={doc.id} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-blue-200 transition-colors group">
                                            <div className="flex justify-between items-start">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5">
                                                        <FileText size={16} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-700">{doc.name}</div>
                                                        <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                                                            {doc.description}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Source Badge */}
                                                {doc.source === 'LMS-FETCHED' && (
                                                    <div className="shrink-0" title="Requirement fetched from LMS">
                                                        <Database size={12} className="text-purple-400" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all"
                    >
                        Close
                    </button>
                    <button
                        onClick={() => { onClose(); onOpenFullDetails(program); }}
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-2"
                    >
                        Open Full Program Details <ExternalLink size={14} />
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default RequiredDocumentsModal;
