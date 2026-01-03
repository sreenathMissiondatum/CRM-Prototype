import React, { useState } from 'react';

// Inline Icons (Safe)
const Icons = {
    X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>,
    AlertTriangle: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-700 shrink-0 mt-0.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>,
    Ban: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600"><circle cx="12" cy="12" r="10" /><path d="m4.9 4.9 14.2 14.2" /></svg>,
    Info: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
};

const DeactivateUserModal = ({ isOpen, onClose, selectedUsers = [], onConfirm, onFreeze }) => {
    const [acknowledged, setAcknowledged] = useState(false);

    if (!isOpen) return null;

    // --- LOGIC (Inline, No Hooks to prevent crash) ---
    const active = [];
    const ineligible = [];

    // Safety Check
    if (Array.isArray(selectedUsers)) {
        selectedUsers.forEach(user => {
            if (user && (user.status === 'Active' || user.status === 'Frozen')) {
                active.push(user);
            } else {
                ineligible.push(user);
            }
        });
    }

    const isBulk = selectedUsers.length > 1;
    const isActionBlocked = active.length < selectedUsers.length || active.length === 0;

    // --- RENDER (Fixed Div, No Portal) ---
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden border border-red-100">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-red-50/50">
                    <div className="flex flex-col">
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Icons.Ban />
                            {isBulk ? `Deactivate ${selectedUsers.length} Users?` : 'Deactivate User?'}
                        </h2>
                        <span className="text-xs font-bold text-red-600 uppercase tracking-wider ml-8">Irreversible Action</span>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <Icons.X />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    {/* Mandatory Warning Banner */}
                    <div className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 mx-[-0.5rem]">
                        <div className="flex items-start gap-3">
                            <Icons.AlertTriangle />
                            <div>
                                <h3 className="text-sm font-bold text-red-900 mb-1">Deactivation is permanent and irreversible.</h3>
                                <p className="text-sm text-red-800 leading-relaxed">
                                    Once deactivated, the user <strong>cannot be reactivated</strong> and will permanently lose access to the system.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Eligibility Blocking */}
                    {isActionBlocked ? (
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                            <h4 className="text-sm font-bold text-slate-700 mb-2">Selection Eligibility</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Selected:</span>
                                    <span className="font-medium">{selectedUsers.length}</span>
                                </div>
                                <div className="flex justify-between text-red-600">
                                    <span>Ineligible (Not Active/Frozen):</span>
                                    <span className="font-bold">{ineligible.length}</span>
                                </div>
                            </div>
                            <div className="mt-3 p-2 bg-red-100/50 rounded text-xs text-red-800 font-medium">
                                Action blocked: You can only deactivate users who are currently 'Active' or 'Frozen'. Please adjust your selection.
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Alternative Path: Freeze */}
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-3">
                                <Icons.Info />
                                <div>
                                    <p className="text-sm text-blue-900 leading-relaxed">
                                        If you only need to temporarily suspend access, do <strong>NOT</strong> deactivate the user.
                                    </p>
                                    <button
                                        onClick={() => {
                                            onFreeze?.(selectedUsers);
                                            onClose();
                                        }}
                                        className="mt-2 text-sm font-bold text-blue-700 hover:text-blue-800 underline underline-offset-2 flex items-center gap-1"
                                    >
                                        Use Freeze User instead <span aria-hidden="true">&rarr;</span>
                                    </button>
                                </div>
                            </div>

                            {/* Impact Summary */}
                            <div className="mb-6">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Impact Summary</h4>
                                <ul className="space-y-2">
                                    {['All active sessions are immediately revoked', 'Login via SSO or password is permanently disabled', 'User record is retained for audit and reporting', 'Action CANNOT be undone'].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Mandatory Acknowledgement */}
                            <div className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setAcknowledged(!acknowledged)}>
                                <input
                                    type="checkbox"
                                    checked={acknowledged}
                                    onChange={(e) => setAcknowledged(e.target.checked)}
                                    className="mt-1 w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                                />
                                <label className="text-sm font-medium text-slate-700 cursor-pointer select-none">
                                    I understand that deactivation is permanent and cannot be undone.
                                </label>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                        Cancel
                    </button>
                    {!isActionBlocked && (
                        <button
                            onClick={() => onConfirm(active.map(u => u.id))}
                            disabled={!acknowledged}
                            className="px-6 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            Confirm Permanent Deactivation
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DeactivateUserModal;
