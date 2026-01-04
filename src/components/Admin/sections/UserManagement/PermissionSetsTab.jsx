import React, { useState } from 'react';
import { Shield, Plus, Edit2, Trash2, Save, ArrowLeft, Info, Check, User, Users, X, Search } from 'lucide-react';
import RoleCapabilities from './RoleCapabilities';
import { MOCK_PERMISSION_SETS, MOCK_USERS_SHORT, MOCK_ASSIGNMENTS } from './mockPermissionData';

// --- MOCK ROLES (Kept local for now as they are just metadata filters) ---
const MOCK_ROLES = [
    { id: 'r1', name: 'System Administrator' },
    { id: 'r2', name: 'Branch Manager' },
    { id: 'r3', name: 'Loan Officer' },
];

const PermissionSetsTab = () => {
    const [mode, setMode] = useState('list'); // 'list', 'create', 'edit', 'capabilities'
    const [sets, setSets] = useState(MOCK_PERMISSION_SETS);
    const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
    const [selectedSet, setSelectedSet] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', applicableRoles: [] });

    // Assignment Modal State
    const [showAssignmentModal, setShowAssignmentModal] = useState(false);
    const [tempAssignments, setTempAssignments] = useState([]); // Array of user IDs

    // --- Actions ---
    const handleCreate = () => {
        setFormData({ name: '', description: '', applicableRoles: [] });
        setSelectedSet(null);
        setMode('create');
    };

    const handleEdit = (set) => {
        setFormData({
            name: set.name,
            description: set.description,
            applicableRoles: set.applicableRoles || []
        });
        setSelectedSet(set);
        setMode('edit');
    };

    const toggleApplicableRole = (roleId) => {
        setFormData(prev => {
            const current = prev.applicableRoles;
            if (current.includes(roleId)) {
                return { ...prev, applicableRoles: current.filter(id => id !== roleId) };
            } else {
                return { ...prev, applicableRoles: [...current, roleId] };
            }
        });
    };

    const saveSet = (targetNextStep) => {
        if (!formData.name || !formData.description) return;

        let newSetId = selectedSet ? selectedSet.id : Date.now();
        let nextSetObject;

        if (mode === 'create') {
            nextSetObject = {
                id: newSetId,
                name: formData.name,
                description: formData.description,
                applicableRoles: formData.applicableRoles,
                users: 0,
                lastModified: new Date().toISOString().split('T')[0],
                capabilities: null,
                status: 'Draft'
            };
            setSets([...sets, nextSetObject]);
        } else {
            // Edit Mode
            setSets(sets.map(s =>
                s.id === selectedSet.id
                    ? {
                        ...s,
                        name: formData.name,
                        description: formData.description,
                        applicableRoles: formData.applicableRoles,
                        lastModified: new Date().toISOString().split('T')[0]
                    }
                    : s
            ));
            nextSetObject = { ...selectedSet, ...formData, id: newSetId };
        }

        if (targetNextStep === 'capabilities') {
            setSelectedSet(nextSetObject);
            setMode('capabilities'); // Pure mode, no baseline
        } else {
            setMode('list');
        }
    };

    const handleSaveDraft = () => saveSet('list');
    const handleContinue = () => saveSet('capabilities');

    const handleConfigurePermissions = (set) => {
        setSelectedSet(set);
        setMode('capabilities');
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this permission set? This will remove access for assigned users.")) {
            setSets(sets.filter(s => s.id !== id));
            // Cleanup assignments
            const newAssignments = { ...assignments };
            delete newAssignments[id];
            setAssignments(newAssignments);
        }
    };

    const handleSaveCapabilities = (setId, newCapabilities) => {
        console.group(`[AUDIT] Permission Set Updated: ${selectedSet.name}`);
        console.log(`timestamp: ${new Date().toISOString()}`);
        console.log(`user: Current Admin User`);
        console.log(`action: UPDATE_CAPABILITIES`);
        console.log(`target_set_id: ${setId}`);
        console.groupEnd();

        setSets(sets.map(s =>
            s.id === setId ? {
                ...s,
                capabilities: newCapabilities,
                lastModified: new Date().toISOString().split('T')[0],
                status: 'Active'
            } : s
        ));
        setMode('list');
    };

    // --- Assignment Logic ---
    const openAssignmentModal = (set) => {
        setSelectedSet(set);
        setTempAssignments(assignments[set.id] || []);
        setShowAssignmentModal(true);
    };

    const toggleAssignment = (userId) => {
        setTempAssignments(prev => prev.includes(userId)
            ? prev.filter(id => id !== userId)
            : [...prev, userId]
        );
    };

    const saveAssignments = () => {
        const setId = selectedSet.id;
        setAssignments(prev => ({
            ...prev,
            [setId]: tempAssignments
        }));

        // Update user count in the set object for display
        setSets(sets.map(s => s.id === setId ? { ...s, users: tempAssignments.length } : s));

        console.log(`[AUDIT] Assigned Users to Permission Set ${setId}:`, tempAssignments);
        setShowAssignmentModal(false);
    };

    return (
        <div className="flex flex-col relative bg-slate-50 min-h-[600px]">
            {/* --- LIST MODE --- */}
            {mode === 'list' && (
                <>
                    <div className="flex justify-between items-center mb-6 shrink-0 px-8 pt-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Permission Sets</h2>
                            <p className="text-sm text-slate-500">Create bundles of permissions to assign to users.</p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus size={18} />
                            Create Permission Set
                        </button>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sets.map(set => (
                                <div key={set.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col relative">
                                    {set.status === 'Draft' && (
                                        <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded border border-amber-200 uppercase tracking-wide">
                                            Draft
                                        </div>
                                    )}

                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                                            <Shield size={22} />
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(set)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit Details"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(set.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-slate-800 text-lg mb-2 mr-12">{set.name}</h3>
                                    <p className="text-sm text-slate-500 mb-6 line-clamp-2 flex-1 leading-relaxed">
                                        {set.description || "No description provided."}
                                    </p>

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                                        <button
                                            onClick={() => openAssignmentModal(set)}
                                            className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg transition-colors border border-slate-100"
                                        >
                                            <Users size={14} />
                                            <span className="font-bold">{set.users}</span> assigned
                                        </button>
                                        <button
                                            onClick={() => handleConfigurePermissions(set)}
                                            className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline px-2"
                                        >
                                            Configure Permissions
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Create New Placeholder Card */}
                            <button
                                onClick={handleCreate}
                                className="bg-slate-50/50 p-6 rounded-xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50/30 transition-all group min-h-[240px]"
                            >
                                <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                                    <Plus size={24} />
                                </div>
                                <span className="font-bold text-slate-500 group-hover:text-blue-600">Create New Set</span>
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* --- CREATE / EDIT METADATA MODE --- */}
            {(mode === 'create' || mode === 'edit') && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-900">
                                {mode === 'create' ? 'Create Permission Set' : 'Edit Permission Set'}
                            </h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8">
                        <div className="max-w-2xl mx-auto space-y-8">
                            {/* MVP Honest Banner */}
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-blue-800 text-sm">
                                <Info size={20} className="shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold mb-1">Permission Bundles (MVP)</h4>
                                    <p>Permission Sets define additional permissions that can be assigned to users. In this MVP, permissions are evaluated together with the user's role.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">General Information</h3>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Permission Set Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-lg"
                                        placeholder="e.g., Marketing Access"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm h-32 resize-none"
                                        placeholder="Describe the purpose of this permission set."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Applicable Roles <span className="text-slate-400 font-normal ml-1">(Optional)</span></h3>
                                <p className="text-sm text-slate-500 mb-3">Informational only: Indicate which roles this set is intended for.</p>

                                <div className="grid grid-cols-2 gap-3">
                                    {MOCK_ROLES.map(role => {
                                        const isSelected = formData.applicableRoles.includes(role.id);
                                        return (
                                            <button
                                                key={role.id}
                                                onClick={() => toggleApplicableRole(role.id)}
                                                className={`
                                                    flex items-center gap-3 p-3 rounded-lg border text-left transition-all
                                                    ${isSelected
                                                        ? 'bg-blue-50 border-blue-200 shadow-sm'
                                                        : 'bg-white border-slate-200 hover:bg-slate-50'}
                                                `}
                                            >
                                                <div className={`
                                                    w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                    ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}
                                                `}>
                                                    {isSelected && <Check size={12} className="text-white" />}
                                                </div>
                                                <div>
                                                    <div className={`font-bold text-sm ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{role.name}</div>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        <button
                            onClick={() => setMode('list')}
                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={handleSaveDraft}
                                disabled={!formData.name || !formData.description}
                                className="px-5 py-2.5 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save as Draft
                            </button>
                            <button
                                onClick={handleContinue}
                                disabled={!formData.name || !formData.description}
                                className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                Continue to Configure
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- CAPABILITIES MATRIX MODE (PURE MVP) --- */}
            {mode === 'capabilities' && selectedSet && (
                <div className="absolute inset-0 z-20 bg-white animate-in zoom-in-95 duration-200 flex flex-col">
                    {/* No Baseline Context Bar - Removed for MVP */}
                    <div className="flex-1 relative">
                        <RoleCapabilities
                            entity={selectedSet}
                            entityType="permission_set"
                            parentRole={null}
                            baselineRole={null} // Explicitly null for pure mode
                            onSave={handleSaveCapabilities}
                            onBack={() => setMode('list')}
                        />
                    </div>
                </div>
            )}

            {/* --- ASSIGNMENT MODAL --- */}
            {showAssignmentModal && selectedSet && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowAssignmentModal(false)} />
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg relative z-10 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Assign Users</h3>
                                <p className="text-xs text-slate-500">Assign "{selectedSet.name}" to users.</p>
                            </div>
                            <button onClick={() => setShowAssignmentModal(false)} className="text-slate-400 hover:text-slate-700">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-2 border-b border-slate-100 bg-slate-50">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-300"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-2">
                            <div className="space-y-1">
                                {MOCK_USERS_SHORT.map(user => {
                                    const isAssigned = tempAssignments.includes(user.id);
                                    return (
                                        <div
                                            key={user.id}
                                            onClick={() => toggleAssignment(user.id)}
                                            className={`
                                                flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                                                ${isAssigned ? 'bg-blue-50 border border-blue-100' : 'hover:bg-slate-50 border border-transparent'}
                                            `}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`
                                                    w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border
                                                    ${isAssigned ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'}
                                                `}>
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className={`font-medium text-sm ${isAssigned ? 'text-blue-900' : 'text-slate-700'}`}>{user.name}</div>
                                                    <div className="text-xs text-slate-500">{user.role}</div>
                                                </div>
                                            </div>
                                            <div className={`
                                                w-5 h-5 rounded border flex items-center justify-center transition-colors
                                                ${isAssigned ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}
                                            `}>
                                                {isAssigned && <Check size={12} className="text-white" />}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                            <button
                                onClick={() => setShowAssignmentModal(false)}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-100 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveAssignments}
                                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
                            >
                                Update Assignments ({tempAssignments.length})
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PermissionSetsTab;
