import React from 'react';
import { X, CheckCircle2, AlertCircle, ArrowRight, ShieldAlert, FileText, ClipboardCheck } from 'lucide-react';
import { createPortal } from 'react-dom';

const ReadinessChecklistDrawer = ({ isOpen, onClose, readinessData, onAction }) => {
    if (!isOpen) return null;

    const { score, required = [], recommended = [] } = readinessData;
    const isReady = score >= 100;

    return createPortal(
        <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

            <div className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out flex flex-col">
                {/* Header */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Conversion Readiness</h2>
                        <p className="text-sm text-slate-500">Complete required items to proceed.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5 space-y-8">

                    {/* Score Indicator */}
                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 dash-border">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                                <circle
                                    cx="48" cy="48" r="40" fill="none" stroke={isReady ? "#10b981" : "#fbbf24"} strokeWidth="8"
                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - score / 100)}`}
                                    className="transition-all duration-1000 ease-out"
                                />
                            </svg>
                            <span className="absolute text-2xl font-black text-slate-800">{Math.floor(score)}%</span>
                        </div>
                        <div className="mt-2 text-sm font-medium text-slate-500">Readiness Score</div>
                    </div>

                    {/* Required Items */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider flex items-center gap-2">
                            <ShieldAlert size={14} /> Required to Convert
                        </h3>
                        <div className="space-y-2">
                            {required.map((item, idx) => (
                                <div key={idx} className={`p-4 rounded-xl border ${item.done ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-red-100 shadow-sm'} flex items-start gap-4 transition-all`}>
                                    <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-red-50 text-red-500 border border-red-200'}`}>
                                        {item.done ? <CheckCircle2 size={12} /> : <X size={12} />}
                                    </div>
                                    <div className="flex-1">
                                        <div className={`font-bold text-sm ${item.done ? 'text-emerald-900' : 'text-slate-800'}`}>{item.label}</div>
                                        {!item.done && (
                                            <div className="mt-1 flex items-center justify-between">
                                                <span className="text-xs text-slate-500">{item.description}</span>
                                                {item.action && (
                                                    <button
                                                        onClick={() => { onAction(item.action); onClose(); }}
                                                        className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                                                    >
                                                        {item.cta || 'Fix Now'}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {required.length === 0 && <div className="text-sm text-emerald-600 italic">All required items complete.</div>}
                        </div>
                    </div>

                    {/* Recommended Items */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                            <ClipboardCheck size={14} /> Recommended
                        </h3>
                        <div className="space-y-2">
                            {recommended.map((item, idx) => (
                                <div key={idx} className={`p-3 rounded-lg border ${item.done ? 'bg-slate-50 border-slate-100 opacity-75' : 'bg-white border-slate-200'} flex items-center gap-3`}>
                                    <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${item.done ? 'bg-slate-200 text-slate-500' : 'border border-slate-300'}`}>
                                        {item.done && <CheckCircle2 size={10} />}
                                    </div>
                                    <span className={`text-sm ${item.done ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-100 bg-slate-50">
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-lg border border-slate-200 bg-white text-slate-700 font-bold hover:bg-slate-50 transition-colors"
                    >
                        Close & Continue Working
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ReadinessChecklistDrawer;
