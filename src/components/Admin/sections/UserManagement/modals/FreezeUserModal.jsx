import React, { useState, useMemo, useEffect } from 'react';
import { X, Snowflake, Info, Calendar } from 'lucide-react';

const FreezeUserModal = ({ isOpen, onClose, selectedUsers = [], onConfirm }) => {
    // 1. Hooks (Logic)
    const [freezeUntil, setFreezeUntil] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        if (!isOpen) {
            setFreezeUntil('');
            setReason('');
        }
    }, [isOpen]);

    const isDateValid = useMemo(() => {
        if (!freezeUntil) return false;
        const selected = new Date(freezeUntil);
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return selected >= now;
    }, [freezeUntil]);

    const canConfirm = isDateValid && reason.length >= 10;

    if (!isOpen) return null;

    const isBulk = selectedUsers ? selectedUsers.length > 1 : false;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden border border-blue-100">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-blue-50/50">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Snowflake className="text-blue-600" size={20} />
                            {isBulk ? `Freeze ${selectedUsers.length} Users?` : 'Freeze User Access'}
                        </h2>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider ml-8">Temporarily Suspend Access</span>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">

                    {/* Impact Summary */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
                            <div className="text-sm text-blue-900 leading-relaxed space-y-2">
                                <p><strong>User(s) will be unable to log in</strong> during the freeze period. All active sessions will be revoked immediately.</p>
                                <p className="text-xs text-blue-700">Note: This does not delete or deactivate the user. You can manually unfreeze them at any time.</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        {/* Date Picker */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                Freeze until <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={freezeUntil}
                                    onChange={(e) => setFreezeUntil(e.target.value)}
                                    // Use 'min' today
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                />
                                <div className="absolute left-3 top-2.5 pointer-events-none flex items-center">
                                    <Calendar className="text-slate-500" size={16} />
                                </div>
                            </div>
                            <p className="text-xs text-slate-500">Access will be automatically restored on this date.</p>
                        </div>

                        {/* Reason Text Area */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">
                                Reason for freezing <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter a reason active investigations, temporary leave, etc."
                                rows={3}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                            />
                            <div className="flex justify-between text-xs">
                                <span className={reason.length >= 10 ? "hidden" : "text-amber-600"}>
                                    {reason.length < 10 && `Minimum 10 characters (${reason.length}/10)`}
                                </span>
                                <span className="text-slate-400">Recorded in audit log</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(selectedUsers, freezeUntil, reason)}
                        disabled={!canConfirm}
                        className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Confirm Freeze
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FreezeUserModal;
