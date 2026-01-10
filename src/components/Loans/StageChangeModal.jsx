import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, ShieldAlert, ArrowRight } from 'lucide-react';

const StageChangeModal = ({ isOpen, onClose, currentStage, allStages, onConfirm }) => {
    const [targetStage, setTargetStage] = useState('');
    const [justification, setJustification] = useState('');
    const [readiness, setReadiness] = useState(null);

    // Filter available next stages (mock logic: allow any, but maybe highlight next/prev)
    // For this prototype, we allow picking any stage to demonstrate the flow.
    const availableStages = allStages.filter(s => s !== currentStage);

    useEffect(() => {
        if (!isOpen) {
            setTargetStage('');
            setJustification('');
            setReadiness(null);
        }
    }, [isOpen]);

    const handleStageSelect = (stage) => {
        setTargetStage(stage);
        // Mock Readiness Logic
        // In a real app, this would query an API or checking strict rules
        setReadiness({
            status: 'warning', // passed, warning, blocked
            checks: [
                { id: 1, label: 'Financials Reviewed', status: 'pass' },
                { id: 2, label: 'Identify Verification (KYC)', status: 'pass' },
                { id: 3, label: 'Collateral Valuation', status: 'warn', message: 'Valuation is > 30 days old' },
                { id: 4, label: 'Credit Memo Approval', status: 'pass' }
            ]
        });
    };

    const handleConfirm = () => {
        if (!targetStage || !justification) return;
        onConfirm(targetStage, justification);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
                    <h3 className="text-lg font-bold text-slate-800">Change Loan Stage</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                    {/* Stage Selection */}
                    <div className="grid grid-cols-2 gap-8 items-center">
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center opacity-70">
                            <div className="text-xs uppercase text-slate-500 font-bold tracking-wider mb-1">Current Stage</div>
                            <div className="text-lg font-bold text-slate-700">{currentStage}</div>
                        </div>

                        <div className="flex justify-center text-slate-300">
                            <ArrowRight size={24} />
                        </div>

                        <div className="col-start-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">Target Stage</label>
                            <select
                                value={targetStage}
                                onChange={(e) => handleStageSelect(e.target.value)}
                                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="">Select Stage...</option>
                                {availableStages.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Readiness Checks */}
                    {targetStage && readiness && (
                        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <ShieldAlert size={16} className="text-slate-500" />
                                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Stage Readiness Information</h4>
                            </div>
                            <div className="space-y-2">
                                {readiness.checks.map(check => (
                                    <div key={check.id} className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            {check.status === 'pass' && <CheckCircle size={15} className="text-emerald-500" />}
                                            {check.status === 'warn' && <AlertCircle size={15} className="text-amber-500" />}
                                            {check.status === 'block' && <X size={15} className="text-red-500" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-700">{check.label}</div>
                                            {check.message && <div className="text-xs text-slate-500">{check.message}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {readiness.status === 'warn' && (
                                <div className="mt-3 text-xs bg-amber-50 text-amber-700 px-3 py-2 rounded border border-amber-100">
                                    <strong>Warning:</strong> You are bypassing warning checks. This action will be flagged in the audit log.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Justification */}
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                            Transition Justification <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Please provide a reason for this stage change..."
                            className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
                        ></textarea>
                        <div className="text-right text-xs text-slate-400 mt-1">
                            {justification.length} characters
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 transition-colors">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!targetStage || !justification}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all"
                    >
                        Confirm Stage Change
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StageChangeModal;
