import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle, AlertTriangle, User, Mail, Shield, AlertOctagon } from 'lucide-react';
import { templateStore } from '../../../../data/templateStore';

const Step5_Review = ({ data, onUpdate, onNext, onBack }) => {
    const [sending, setSending] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const template = templateStore.getById(data.templateId);
    const recipientCount = data.selectedLeads?.length || 0;

    // In a real app, we might re-run validation here or pass it from Step 4
    // For now, assume if they got here, they are good.

    const handleSend = () => {
        setSending(true);
        // Simulate API Call
        setTimeout(() => {
            setSending(false);
            onNext(); // Navigate to Success Screen (Step 6 handling in parent or new component)
        }, 2000);
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500 relative">

            {/* Confirmation Modal Overlay */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                            <Send size={24} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-slate-800">Ready to Launch?</h3>
                            <p className="text-slate-500 mt-2">
                                You are about to send <span className="font-bold text-slate-800">{data?.name}</span> to <span className="font-bold text-slate-800">{recipientCount} recipients</span>.
                            </p>
                            <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-sm rounded-lg flex items-start gap-2 text-left">
                                <AlertOctagon size={16} className="shrink-0 mt-0.5" />
                                <p>This action cannot be undone. Emails will be queued for immediate delivery.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="flex-1 py-2.5 font-bold text-slate-600 hover:bg-slate-50 rounded-lg border border-slate-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSend}
                                disabled={sending}
                                className="flex-1 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md hover:shadow-lg transition-colors flex items-center justify-center gap-2"
                            >
                                {sending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} /> Send Campaign
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-6 p-1">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2">
                    <h2 className="text-2xl font-bold text-slate-800">Final Review</h2>
                    <p className="text-slate-600 max-w-lg">
                        Please review the campaign details below. Once sent, you can track performance in the dashboard.
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Campaign</div>
                        <div className="font-bold text-slate-800 text-lg">{data.name}</div>
                        <div className="text-sm text-slate-500 mt-1 truncate">{data.description || 'No description'}</div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Template</div>
                        <div className="font-bold text-slate-800 text-lg">{data.templateName}</div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                            <span className="font-mono bg-slate-100 px-1 rounded text-xs">{template?.version || 'v1.0'}</span>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Audience</div>
                        <div className="font-bold text-slate-800 text-lg">{recipientCount} Recipients</div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                            <CheckCircle size={14} className="text-green-500" /> All passed check
                        </div>
                    </div>
                </div>

                {/* Recipients Preview Table (Condensed) */}
                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">Recipient List</h3>
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                            <Shield size={12} /> PII Masked
                        </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                            <tbody className="divide-y divide-slate-100">
                                {data._hydratedLeads?.map((lead, idx) => (
                                    <tr key={lead.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-3 font-medium text-slate-700">
                                            {lead.firstName} {lead.lastName}
                                        </td>
                                        <td className="px-6 py-3 text-slate-500">
                                            {lead.email}
                                        </td>
                                        <td className="px-6 py-3 text-slate-500">
                                            {lead.company}
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100 uppercase font-bold">
                                                Ready
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 flex justify-between">
                <button
                    onClick={onBack}
                    className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900 flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> Back
                </button>
                <button
                    onClick={() => setShowConfirmation(true)}
                    className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 transition-all"
                >
                    <Send size={18} /> Launch Campaign
                </button>
            </div>
        </div>
    );
};

export default Step5_Review;
