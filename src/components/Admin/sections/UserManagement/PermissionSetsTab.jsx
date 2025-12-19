import React, { useState } from 'react';
import { Shield, Plus, MoreHorizontal, Edit2, Search, Trash2, CheckCircle2, Save, ArrowLeft, Info, Copy, Check } from 'lucide-react';
import RoleCapabilities from './RoleCapabilities';

// --- Placeholder Data for Roles (Context) ---
// in a real app, this would come from a global store or API
const MOCK_ROLES = [
    {
        id: 'r1',
        name: 'System Administrator',
        capabilities: {
            leads: { create: true, read: true, update: true, delete: true },
            loans: { create: true, read: true, update: true, delete: true },
            tasks: { create: true, read: true, update: true, delete: true },
            documents: { create: true, read: true, update: true, delete: true },
            reports: { create: true, read: true, update: true, delete: true },
            calendar: { create: true, read: true, update: true, delete: true },
        }
    },
    {
        id: 'r2',
        name: 'Branch Manager',
        capabilities: {
            leads: { create: true, read: true, update: true, delete: false },
            loans: { create: true, read: true, update: true, delete: false },
            tasks: { create: true, read: true, update: true, delete: true },
            documents: { create: true, read: true, update: true, delete: false },
            reports: { create: false, read: true, update: false, delete: false },
            calendar: { create: true, read: true, update: true, delete: true },
        }
    },
    {
        id: 'r3',
        name: 'Loan Officer',
        capabilities: {
            leads: { create: true, read: true, update: false, delete: false },
            loans: { create: true, read: true, update: true, delete: false }, // Can update own loans
            tasks: { create: true, read: true, update: true, delete: false },
            documents: { create: true, read: true, update: false, delete: false },
            reports: { create: false, read: false, update: false, delete: false },
            calendar: { create: true, read: true, update: true, delete: false },
        }
    },
];

const INITIAL_SETS = [
    {
        id: 1,
        name: 'Marketing Manager',
        description: 'Access to marketing campaigns and email templates.',
        users: 2,
        lastModified: '2023-11-15',
        applicableRoles: ['r2', 'r3'],
        status: 'Active'
    },
    {
        id: 2,
        name: 'Compliance Auditor',
        description: 'Read-only access to all loan files for audit purposes.',
        users: 1,
        lastModified: '2023-12-01',
        applicableRoles: ['r1', 'r2', 'r3'],
        status: 'Active'
    },
    {
        id: 3,
        name: 'Branch Manager Override',
        description: 'Ability to override rate locks for specific branch managers.',
        users: 5,
        lastModified: '2023-10-20',
        applicableRoles: ['r2'],
        status: 'Active'
    },
];

const PermissionSetsTab = () => {
    const [mode, setMode] = useState('list'); // 'list', 'create', 'edit', 'capabilities'
    const [sets, setSets] = useState(INITIAL_SETS);
    const [selectedSet, setSelectedSet] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '', applicableRoles: [] });
    // Baseline context state
    const [baselineRoleId, setBaselineRoleId] = useState('');

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
        // Validation
        if (!formData.name || !formData.description) return;

        let newSetId;
        if (mode === 'create') {
            const newSet = {
                id: Date.now(),
                name: formData.name,
                description: formData.description,
                applicableRoles: formData.applicableRoles,
                users: 0,
                lastModified: new Date().toISOString().split('T')[0],
                capabilities: null,
                status: 'Draft'
            };
            setSets([...sets, newSet]);
            newSetId = newSet.id;

            // Toasts or feedback could go here
            if (targetNextStep === 'list') {
                // alert("Permission Set saved as Draft.");
            }
        } else {
            // Edit Mode
            const updatedSets = sets.map(s =>
                s.id === selectedSet.id
                    ? {
                        ...s,
                        name: formData.name,
                        description: formData.description,
                        applicableRoles: formData.applicableRoles,
                        lastModified: new Date().toISOString().split('T')[0]
                    }
                    : s
            );
            setSets(updatedSets);
            newSetId = selectedSet.id;
        }

        if (targetNextStep === 'capabilities') {
            // For 'create' optimistic update needed if we rely on state immediately, 
            // but for simplicity we can construct the next state object
            const nextSetObject = mode === 'create'
                ? {
                    id: newSetId,
                    name: formData.name,
                    description: formData.description,
                    applicableRoles: formData.applicableRoles,
                    users: 0,
                    status: 'Draft',
                    capabilities: null
                }
                : { ...selectedSet, ...formData };

            setSelectedSet(nextSetObject);

            // Default baseline to first applicable role if available, otherwise empty (No Context)
            if (formData.applicableRoles.length > 0) {
                setBaselineRoleId(formData.applicableRoles[0]);
            } else {
                setBaselineRoleId('');
            }
            setMode('capabilities');
        } else {
            setMode('list');
        }
    };

    const handleSaveDraft = () => saveSet('list');
    const handleContinue = () => saveSet('capabilities');

    const handleManageAccess = (set) => {
        setSelectedSet(set);
        // Default baseline to first applicable role
        if (set.applicableRoles && set.applicableRoles.length > 0) {
            setBaselineRoleId(set.applicableRoles[0]);
        } else {
            setBaselineRoleId('');
        }
        setMode('capabilities');
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this permission set? This will remove access for assigned users.")) {
            setSets(sets.filter(s => s.id !== id));
        }
    };

    const handleSaveCapabilities = (setId, newCapabilities) => {
        // Audit Log Mock
        console.group(`[AUDIT] Permission Set Updated: ${selectedSet.name}`);
        console.log(`timestamp: ${new Date().toISOString()}`);
        console.log(`user: Current Admin User`);
        console.log(`action: UPDATE_CAPABILITIES`);
        console.log(`target_set_id: ${setId}`);
        console.groupEnd();

        const updatedSets = sets.map(s =>
            s.id === setId ? {
                ...s,
                capabilities: newCapabilities,
                lastModified: new Date().toISOString().split('T')[0],
                status: 'Active' // Capabilities saved -> Active
            } : s
        );
        setSets(updatedSets);
        setMode('list');
    };

    return (
        <div className="flex flex-col relative bg-slate-50">
            {/* --- LIST MODE --- */}
            {mode === 'list' && (
                <>
                    <div className="flex justify-between items-center mb-6 shrink-0 px-8 pt-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Permission Sets</h2>
                            <p className="text-sm text-slate-500">Provide specific, additive access rights beyond assigned roles.</p>
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

                                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-md">
                                            <span className="font-bold text-slate-700 mb-0.5">{set.users}</span> assigned
                                        </div>
                                        <button
                                            onClick={() => handleManageAccess(set)}
                                            className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                            Manage Access
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

                            {/* Info Banner */}
                            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-3 text-indigo-800 text-sm">
                                <Info size={20} className="shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="font-bold mb-1">Additive Access Only</h4>
                                    <p>Permission Sets grant additional access on top of a user’s role. They cannot remove or restrict access a user already has. Configure capabilities in the next step.</p>
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
                                        placeholder="e.g., Loan Officer - Jumbo Specialist"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm h-32 resize-none"
                                        placeholder="Describe the purpose of this permission set and who it should be assigned to."
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-slate-800 border-b border-slate-200 pb-2">Applicable Roles <span className="text-slate-400 font-normal ml-1">(Optional)</span></h3>
                                <p className="text-sm text-slate-500 mb-3">Select roles to limit who this permission set can be assigned to. Leave empty to make it available to all users (Generic).</p>

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
                                {formData.applicableRoles.length === 0 && (
                                    <div className="flex items-center gap-2 mt-2 text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                        <Info size={16} className="text-blue-500" />
                                        <span className="text-sm font-medium">No roles selected. This permission set will be <span className="font-bold text-slate-700">Generic</span> and available to any user.</span>
                                    </div>
                                )}
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

            {/* --- CAPABILITIES MATRIX MODE --- */}
            {mode === 'capabilities' && selectedSet && (
                <div className="absolute inset-0 z-20 bg-white animate-in zoom-in-95 duration-200 flex flex-col">
                    {/* Baseline Context Selector Overlay */}

                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-2 flex items-center justify-end gap-3 text-sm">
                        <span className="text-slate-500 font-medium">View baseline impact for:</span>
                        <select
                            className="bg-white border border-slate-300 text-slate-700 text-sm rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            value={baselineRoleId}
                            onChange={(e) => setBaselineRoleId(e.target.value)}
                        >
                            <option value="">-- No Context (Pure) --</option>
                            {MOCK_ROLES
                                .filter(r => selectedSet.applicableRoles.length === 0 ? false : selectedSet.applicableRoles.includes(r.id))
                                .map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))
                            }
                        </select>
                        <div className="flex items-center gap-1.5 ml-2 text-xs text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">
                            <Info size={12} />
                            <span>Simulated View</span>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <RoleCapabilities
                            entity={selectedSet}
                            entityType="permission_set"
                            parentRole={null}
                            baselineRole={MOCK_ROLES.find(r => r.id === baselineRoleId)}
                            onSave={handleSaveCapabilities}
                            onBack={() => setMode('list')}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default PermissionSetsTab;
