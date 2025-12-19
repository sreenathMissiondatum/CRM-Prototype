import React, { useState, useEffect } from 'react';
import {
    Check, X, Copy, Info, Settings, Save, ArrowLeft,
    Shield, FileText, Briefcase, User, Calendar,
    PieChart, DollarSign
} from 'lucide-react';

// --- Configuration Data ---
const OBJECTS = [
    { id: 'leads', label: 'Leads', icon: User, description: 'Potential customer records' },
    { id: 'loans', label: 'Loans', icon: DollarSign, description: 'Loan applications and active facilities' },
    { id: 'tasks', label: 'Tasks', icon: Check, description: 'Workflow tasks and assignments' },
    { id: 'documents', label: 'Documents', icon: FileText, description: 'Uploaded files and agreements' },
    { id: 'reports', label: 'Reports', icon: PieChart, description: 'Analytics and dashboards' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, description: 'Events and scheduling' },
];

const DEFAULT_CAPABILITIES = OBJECTS.reduce((acc, obj) => {
    acc[obj.id] = { create: false, read: true, update: false, delete: false, special: [] };
    return acc;
}, {});

const RoleCapabilities = ({
    entity,
    entityType = 'role', // 'role' or 'permission_set'
    parentRole,
    baselineRole, // NEW: The role context for "additive" checks
    onSave,
    onBack
}) => {
    // Initialize permissions (mocking potential existing data or defaulting)
    const [permissions, setPermissions] = useState(entity.capabilities || JSON.parse(JSON.stringify(DEFAULT_CAPABILITIES)));
    const [activeSpecial, setActiveSpecial] = useState(null); // ID of object open in side panel

    // --- Actions ---
    const togglePermission = (objId, type) => {
        setPermissions(prev => ({
            ...prev,
            [objId]: {
                ...prev[objId],
                [type]: !prev[objId][type]
            }
        }));
    };

    const handleCopyParent = () => {
        if (!parentRole) return;
        // In a real app, we'd deep copy parentRole.capabilities
        // Here we'll just simulate a "smart copy" 
        // e.g., enable Read/Update for everything if copying from a manager
        const newPerms = JSON.parse(JSON.stringify(permissions));
        Object.keys(newPerms).forEach(key => {
            newPerms[key].read = true;
            newPerms[key].update = true;
            newPerms[key].create = true; // Simulating inheritance
        });
        setPermissions(newPerms);
        alert(`Copied baseline capabilities from ${parentRole.name}`);
    };

    const handleSave = () => {
        onSave(entity.id, permissions);
    };

    const isRole = entityType === 'role';

    return (
        <div className="flex flex-col bg-white relative">
            {/* --- Header --- */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={onBack} className="text-slate-400 hover:text-slate-700 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-xl font-bold text-slate-900">{entity.name} Capabilities</h2>
                    </div>
                    <p className="text-slate-500 text-sm ml-7">
                        {isRole
                            ? "These capabilities apply to all users assigned this role."
                            : "Select additional capabilities to grant users with this permission set."}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {(isRole && parentRole) && (
                        <button
                            onClick={handleCopyParent}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-sm text-sm"
                        >
                            <Copy size={14} /> Copy from Parent
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Save size={16} /> Save Changes
                    </button>
                </div>
            </div>

            {/* --- Main Content (Matrix) --- */}
            <div className="p-8">
                <div className="max-w-5xl mx-auto">

                    {!isRole && (
                        <div className="mb-6 space-y-4">
                            {/* Additive Access Warning */}
                            {entity.applicableRoles && entity.applicableRoles.length > 0 && (
                                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-3 text-indigo-900 text-sm shadow-sm">
                                    <Info size={20} className="shrink-0 text-indigo-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-bold mb-1 text-indigo-700">Additive Access Only</h4>
                                        <p className="leading-relaxed">Permissions defined here are added on top of the user's base Role permissions. You cannot restrict access (e.g., unchecking 'Read') that a user already has from their Role.</p>
                                    </div>
                                </div>
                            )}

                            {/* Baseline Context Display */}
                            {baselineRole && (
                                <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-2 rounded-md border border-slate-200 inline-block">
                                    <span>Viewing effective permissions for role:</span>
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                        <Shield size={14} /> {baselineRole.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200">
                                    <th className="py-4 px-6 font-bold text-slate-700 text-sm w-1/3">Business Object</th>
                                    <th className="py-4 px-4 font-bold text-slate-500 text-xs uppercase text-center w-24">Create</th>
                                    <th className="py-4 px-4 font-bold text-slate-500 text-xs uppercase text-center w-24">Read</th>
                                    <th className="py-4 px-4 font-bold text-slate-500 text-xs uppercase text-center w-24">Update</th>
                                    <th className="py-4 px-4 font-bold text-slate-500 text-xs uppercase text-center w-24">Delete</th>
                                    <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase text-right">Special Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {OBJECTS.map(obj => {
                                    const Icon = obj.icon;
                                    const p = permissions[obj.id];

                                    // Helper to check baseline
                                    const getPermissionState = (type) => {
                                        const grantedByRole = baselineRole?.capabilities?.[obj.id]?.[type];
                                        const grantedBySet = p[type];

                                        return {
                                            checked: grantedByRole || grantedBySet,
                                            disabled: !!grantedByRole, // Force disabled if role grants it
                                            grantedByRole
                                        };
                                    };

                                    return (
                                        <tr key={obj.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 bg-slate-100/50 text-slate-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                        <Icon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{obj.label}</div>
                                                        <div className="text-xs text-slate-400 font-medium">{obj.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Status Toggles */}
                                            {['create', 'read', 'update', 'delete'].map(type => {
                                                const { checked, disabled, grantedByRole } = getPermissionState(type);
                                                return (
                                                    <td key={type} className="py-4 px-4 text-center group/cell">
                                                        <div className="relative inline-block" title={grantedByRole ? `Granted by role: ${baselineRole.name}` : ''}>
                                                            <ToggleSwitch
                                                                checked={checked}
                                                                onChange={() => togglePermission(obj.id, type)}
                                                                disabled={disabled || (type === 'delete' && !getPermissionState('read').checked)}
                                                            />
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                            <td className="py-4 px-6 text-right">
                                                <button
                                                    onClick={() => setActiveSpecial(obj.id)}
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors"
                                                >
                                                    <Settings size={14} /> Configure
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 flex justify-center">
                        <div className="flex items-center gap-2 text-slate-400 text-xs">
                            <Shield size={12} />
                            <span>
                                {isRole
                                    ? `Changes apply immediately to all ${entity.members || 0} users in this role upon saving.`
                                    : `Changes apply immediately to all ${entity.users || 0} assigned users.`}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- Special Actions Side Panel --- */}
            {activeSpecial && (
                <div className="absolute inset-0 z-20 flex justify-end bg-slate-900/10 backdrop-blur-[1px] animate-in fade-in duration-200">
                    <div className="w-96 bg-white height-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                <Settings size={16} />
                                {OBJECTS.find(o => o.id === activeSpecial)?.label} Actions
                            </h3>
                            <button onClick={() => setActiveSpecial(null)} className="text-slate-400 hover:text-slate-700">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="flex-1 p-6 overflow-y-auto space-y-6">
                            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
                                <Info size={16} className="inline mb-1 mr-2" />
                                Special actions define granular capabilities beyond standard CRUD operations.
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="mt-0.5">
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" defaultChecked />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">Approve Records</div>
                                        <div className="text-xs text-slate-500">Allow user to approve records submitted for review.</div>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="mt-0.5">
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">Transfer Ownership</div>
                                        <div className="text-xs text-slate-500">Allow reassignment of record ownership.</div>
                                    </div>
                                </label>
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <div className="mt-0.5">
                                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors">Bulk Import/Export</div>
                                        <div className="text-xs text-slate-500">Allow CSV data operations.</div>
                                    </div>
                                </label>
                            </div>
                        </div>
                        <div className="p-5 border-t border-slate-100 bg-slate-50 text-right">
                            <button
                                onClick={() => setActiveSpecial(null)}
                                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm text-sm"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Simple iOS-style Toggle Switch Component
const ToggleSwitch = ({ checked, onChange, disabled }) => (
    <button
        onClick={onChange}
        disabled={disabled}
        className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50
            ${checked ? 'bg-blue-600' : 'bg-slate-200'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
    >
        <span className="sr-only">Enable</span>
        <span
            className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm
                ${checked ? 'translate-x-6' : 'translate-x-1'}
            `}
        />
    </button>
);

export default RoleCapabilities;
