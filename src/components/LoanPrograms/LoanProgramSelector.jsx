import React, { useState } from 'react';
import { X, Search, CheckCircle2, FileText, ArrowRight, ShieldCheck } from 'lucide-react';
import { createPortal } from 'react-dom';
import { programs } from '../../data/loanPrograms';

const LoanProgramSelector = ({
    isOpen,
    onClose,
    onSelect,
    currentProgramIds = [],
    title = "Assign Loan Programs to Lead",
    confirmLabel = "Assign Programs"
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState(currentProgramIds);

    // Mock Data
    // Handlers
    const toggleSelection = (id) => {
        setSelectedIds(prev => {
            if (prev.includes(id)) {
                return prev.filter(pId => pId !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleConfirm = () => {
        const selectedPrograms = programs.filter(p => selectedIds.includes(p.id));
        onSelect(selectedPrograms);
        onClose();
    };

    const filteredPrograms = programs.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sync State when re-opened (if component persists)
    React.useEffect(() => {
        if (isOpen) {
            setSelectedIds(currentProgramIds);
        }
    }, [isOpen, currentProgramIds]);

    if (!isOpen) return null;

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
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                        <p className="text-xs text-slate-500 mt-1">Select one or more loan programs for this lead.</p>
                    </div>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-slate-100 bg-white">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search programs..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Selected Chips */}
                {selectedIds.length > 0 && (
                    <div className="px-4 pt-4 pb-0 animate-in slide-in-from-top-2 duration-200">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Selected Programs</div>
                        <div className="flex flex-wrap gap-2">
                            {programs.filter(p => selectedIds.includes(p.id)).map(p => (
                                <button
                                    key={p.id}
                                    onClick={() => toggleSelection(p.id)}
                                    className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100/50 text-blue-700 text-xs font-medium rounded-full border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors group"
                                >
                                    {p.name}
                                    <X size={12} className="text-blue-400 group-hover:text-blue-600" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
                    {filteredPrograms.map(prog => {
                        const isSelected = selectedIds.includes(prog.id);
                        return (
                            <div
                                key={prog.id}
                                onClick={() => toggleSelection(prog.id)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all relative ${isSelected
                                    ? 'bg-blue-50 border-blue-200 shadow-sm ring-1 ring-blue-200'
                                    : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-sm">{prog.name}</div>
                                            <div className="text-[10px] font-mono text-slate-400">{prog.code}</div>
                                        </div>
                                    </div>
                                    {prog.recommended && (
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide rounded-full border border-emerald-200 flex items-center gap-1">
                                            <ShieldCheck size={10} /> Rec.
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
                                    {prog.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 pt-3 border-t border-slate-100/50">
                                    <div>Rate: <span className="text-slate-800">{prog.rate}</span></div>
                                    <div className="w-px h-3 bg-slate-200"></div>
                                    <div>Term: <span className="text-slate-800">{prog.term}</span></div>
                                </div>

                                {isSelected && (
                                    <div className="absolute top-4 right-4 text-blue-600 animate-in zoom-in duration-200">
                                        <CheckCircle2 size={20} fill="currentColor" className="text-blue-600 bg-white rounded-full" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 bg-white">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={selectedIds.length === 0}
                            className="flex-1 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {confirmLabel} <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LoanProgramSelector;
