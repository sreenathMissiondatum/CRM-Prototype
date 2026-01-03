import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, Shield, Users, MapPin, Briefcase } from 'lucide-react';

const BulkUpdateUsersModal = ({ isOpen, onClose, selectedUsers = [], onUpdate }) => {
    const [updates, setUpdates] = useState({
        status: '',
        role: '',
        department: '',
        location: ''
    });

    if (!isOpen) return null;

    const handleChange = (field, value) => {
        setUpdates(prev => ({ ...prev, [field]: value }));
    };

    const hasUpdates = Object.values(updates).some(val => val !== '');

    const handleSave = () => {
        if (!hasUpdates) return;
        // Filter out empty updates
        const finalUpdates = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== ''));
        onUpdate(selectedUsers.map(u => u.id), finalUpdates);
        onClose();
    };

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Bulk Update Users</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Updating {selectedUsers.length} selected users</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-xs text-amber-800 flex gap-2">
                        <div className="mt-0.5 font-bold">Note:</div>
                        <div>Only fields you select will be updated. Empty fields will remain unchanged for all selected users.</div>
                    </div>

                    <div className="grid gap-4">
                        {/* Status */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-2">
                                <Check size={14} /> Account Status
                            </label>
                            <select
                                value={updates.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            >
                                <option value="">No Change</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Frozen">Frozen</option>
                            </select>
                        </div>

                        {/* Role */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-2">
                                <Shield size={14} /> System Role
                            </label>
                            <select
                                value={updates.role}
                                onChange={(e) => handleChange('role', e.target.value)}
                                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            >
                                <option value="">No Change</option>
                                <option value="Admin">Admin</option>
                                <option value="Loan Officer">Loan Officer</option>
                                <option value="Underwriter">Underwriter</option>
                                <option value="Processor">Processor</option>
                            </select>
                        </div>

                        {/* Department */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-2">
                                <Users size={14} /> Department
                            </label>
                            <select
                                value={updates.department}
                                onChange={(e) => handleChange('department', e.target.value)}
                                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            >
                                <option value="">No Change</option>
                                <option value="Sales">Sales</option>
                                <option value="Operations">Operations</option>
                                <option value="Risk">Risk</option>
                                <option value="Executive">Executive</option>
                                <option value="IT">IT</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-2">
                                <MapPin size={14} /> Office Location
                            </label>
                            <select
                                value={updates.location}
                                onChange={(e) => handleChange('location', e.target.value)}
                                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
                            >
                                <option value="">No Change</option>
                                <option value="New York, NY">New York, NY</option>
                                <option value="Austin, TX">Austin, TX</option>
                                <option value="Chicago, IL">Chicago, IL</option>
                                <option value="San Francisco, CA">San Francisco, CA</option>
                                <option value="Miami, FL">Miami, FL</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    <button
                        onClick={handleSave}
                        disabled={!hasUpdates}
                        className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        Update {selectedUsers.length} Users
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default BulkUpdateUsersModal;
