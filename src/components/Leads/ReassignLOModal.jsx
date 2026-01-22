import React, { useState, useMemo } from 'react';
import { X, Search, User, Check, ShieldAlert } from 'lucide-react';
import { createPortal } from 'react-dom';
import { MOCK_USERS } from '../../data/mockUsers';

const ReassignLOModal = ({ isOpen, onClose, onConfirm, currentOfficerId, leadName }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock Permission Check (Simulated)
    const canReassign = true;

    // Filter Users:
    // 1. Must be Active (MOCK_USERS are mainly active, except maybe filtered out ones)
    // 2. Exclude 'System', 'Unassigned'
    // 3. Exclude Current Officer
    const availableUsers = useMemo(() => {
        return MOCK_USERS.filter(user => {
            const isSystemOrUnassigned = ['System', 'Unassigned'].includes(user.name);
            const isCurrentOfficer = user.id === currentOfficerId || user.name === currentOfficerId; // Handle both ID and Name matching as currentOfficerId might be a name string in this prototype
            const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase());

            return !isSystemOrUnassigned && !isCurrentOfficer && matchesSearch;
        });
    }, [searchQuery, currentOfficerId]);

    const handleConfirm = async () => {
        if (!selectedUser) return;

        setIsSubmitting(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 600));

        // Log Audit Event
        const auditLog = {
            eventType: 'LEAD_LO_REASSIGNED',
            leadId: 'context-dependent', // In a real app we'd need the ID, but here the parent handles the update. We can just log context here.
            leadName: leadName,
            previousLo: currentOfficerId,
            newLoId: selectedUser.id,
            performedBy: 'current-user-id',
            timestamp: new Date().toISOString()
        };
        console.log('[AUDIT] LEAD_LO_REASSIGNED:', JSON.stringify(auditLog, null, 2));

        onConfirm(selectedUser);
        setIsSubmitting(false);
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="px-5 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Reassign Loan Officer</h2>
                        {leadName && <p className="text-xs text-slate-500 mt-0.5">For Lead: <span className="font-medium text-slate-700">{leadName}</span></p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5">

                    {!canReassign ? (
                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                            <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold block mb-1">Permission Denied</span>
                                You do not have permission to reassign Loan Officers. Please contact your administrator.
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Search Input */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    New Loan Officer
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            {/* User List */}
                            <div className="border border-slate-200 rounded-lg max-h-[240px] overflow-y-auto custom-scrollbar">
                                {availableUsers.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <User size={24} className="mx-auto text-slate-300 mb-2" />
                                        <p className="text-sm text-slate-500">No matching officers found.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-50">
                                        {availableUsers.map(user => (
                                            <button
                                                key={user.id}
                                                onClick={() => setSelectedUser(user)}
                                                className={`w-full flex items-center justify-between p-3 transition-colors text-left group ${selectedUser?.id === user.id
                                                        ? 'bg-blue-50/60'
                                                        : 'hover:bg-slate-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-200">
                                                        {user.avatar ? (
                                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">
                                                                {user.name.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className={`text-sm font-medium ${selectedUser?.id === user.id ? 'text-blue-700' : 'text-slate-700'}`}>
                                                            {user.name}
                                                        </div>
                                                        <div className="text-xs text-slate-400">{user.role}</div>
                                                    </div>
                                                </div>
                                                {selectedUser?.id === user.id && (
                                                    <Check size={16} className="text-blue-600 mr-1" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedUser || isSubmitting || !canReassign}
                        className={`px-5 py-2 text-sm font-bold text-white rounded-lg shadow-sm flex items-center gap-2 transition-all ${!selectedUser || isSubmitting
                                ? 'bg-slate-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 hover:shadow transform active:scale-95'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Reassigning...
                            </>
                        ) : (
                            'Reassign'
                        )}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ReassignLOModal;
