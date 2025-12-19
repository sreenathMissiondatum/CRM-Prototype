import React from 'react';
import {
    X, ShieldCheck, TrendingUp, AlertTriangle,
    CheckCircle2, HelpCircle, RefreshCw
} from 'lucide-react';
import { createPortal } from 'react-dom';

const ScoreBreakdownDrawer = ({ isOpen, onClose, scoreData, onReRun }) => {
    if (!isOpen || !scoreData) return null;

    const { score, band, confidence, factors, timestamp, isLoading } = scoreData;

    const getScoreColor = (s) => {
        if (s >= 80) return 'text-emerald-600';
        if (s >= 60) return 'text-amber-600';
        return 'text-red-600';
    };

    const getBandColor = (b) => {
        const lower = b.toLowerCase();
        if (lower.includes('low')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
        if (lower.includes('medium')) return 'bg-amber-100 text-amber-800 border-amber-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    const drawerContent = (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="relative w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <ShieldCheck className="text-blue-600" size={20} />
                            AI Pre-Screening
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Automated Risk Assessment Model v2.4</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">

                    {/* Score Hero */}
                    <div className="text-center space-y-4">
                        <div className="relative inline-flex flex-col items-center justify-center">
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    className="text-slate-100"
                                    strokeWidth="8"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                                <circle
                                    className={`${getScoreColor(score)} transition-all duration-1000 ease-out`}
                                    strokeWidth="8"
                                    strokeDasharray={365}
                                    strokeDashoffset={365 - (365 * score) / 100}
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="transparent"
                                    r="58"
                                    cx="64"
                                    cy="64"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-extrabold ${getScoreColor(score)}`}>{score}</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">/ 100</span>
                            </div>
                        </div>

                        <div>
                            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold border ${getBandColor(band)}`}>
                                {band} Risk
                            </span>
                        </div>

                        <div className="flex justify-center gap-6 text-xs text-slate-500 border-t border-slate-100 pt-4 mx-8">
                            <div className="flex flex-col items-center gap-1">
                                <span className="uppercase tracking-wider font-bold text-slate-400">Confidence</span>
                                <span className="font-medium text-slate-700">{confidence}%</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <span className="uppercase tracking-wider font-bold text-slate-400">Last Run</span>
                                <span className="font-medium text-slate-700">{timestamp}</span>
                            </div>
                        </div>
                    </div>

                    {/* Factors */}
                    <div>
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <TrendingUp size={16} className="text-slate-400" />
                            Key Risk Factors
                        </h3>
                        <div className="space-y-3">
                            {factors.map((factor, idx) => (
                                <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className={`mt-0.5 shrink-0 ${factor.impact === 'positive' ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {factor.impact === 'positive' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-slate-700">{factor.label}</div>
                                        <div className="text-xs text-slate-500 mt-0.5">{factor.detail}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                        <HelpCircle size={18} className="text-blue-600 shrink-0" />
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-blue-800">Assistance Only</p>
                            <p className="text-xs text-blue-700 leading-relaxed">
                                This score is generated by an AI model to assist in prioritization. It does not replace formal underwriting policies or decisions.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-100 bg-slate-50">
                    <button
                        onClick={onReRun}
                        disabled={isLoading}
                        className="w-full py-2.5 bg-white border border-slate-200 hover:border-blue-400 hover:text-blue-600 text-slate-700 font-bold rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        {isLoading ? 'Running Analysis...' : 'Re-run Analysis'}
                    </button>
                </div>
            </div>
        </div>
    );

    return createPortal(drawerContent, document.body);
};

export default ScoreBreakdownDrawer;
