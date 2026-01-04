import React from 'react';
import { Shield, Layout, Edit2, Trash2, Plus, Eye, Users } from 'lucide-react';
import RoleCapabilitiesCard from './RoleCapabilitiesCard';
import { MOCK_VISIBILITY_GROUPS } from '../../../../data/mockVisibilityGroups';
import AssignedUsersTab from './AssignedUsersTab';

export const MOCK_AVAILABLE_PERMISSION_SETS = [
    { id: 1, name: 'Marketing Manager', description: 'Access to marketing campaigns and email templates.', applicableRoles: ['regional_mgr', 'branch_mgr'], type: 'role-scoped' },
    { id: 2, name: 'Compliance Auditor', description: 'Read-only access to all loan files for audit purposes.', applicableRoles: [], type: 'generic' },
    { id: 3, name: 'Branch Manager Override', description: 'Ability to override rate locks.', applicableRoles: ['branch_mgr'], type: 'role-scoped' },
    { id: 4, name: 'Holiday Party Committee', description: 'Event planning access.', applicableRoles: [], type: 'generic' }
];

const RoleDetailsPane = ({
    mode,
    selectedRole,
    isEditing,
    formData,
    activeDetailsTab,
    onEditRole,
    onSaveRole,
    onCancelEdit,
    onDeleteStart,
    onFormDataChange,
    onSetActiveDetailsTab,
    onAddChild,
    onSetMode,
    onAssignPermissionSet,
    onRemovePermissionSet,
    onAssignVisibilityGroup,
    onRemoveVisibilityGroup
}) => {

    // Helper to handle form data changes safely
    const handleChange = (key, value) => {
        onFormDataChange({ ...formData, [key]: value });
    };

    if (mode === 'view' && !selectedRole) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                    <Layout size={32} className="text-slate-300" />
                </div>
                <h3 className="text-slate-900 font-bold text-lg mb-1">Role Hierarchy</h3>
                <p className="max-w-xs mx-auto">Select a role from the tree to view details, or add a child role to expand the organization.</p>
            </div>
        );
    }

    if (mode === 'view' && selectedRole) {
        return (
            <div className="flex flex-col h-full">
                {/* ROLE HEADER */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-start shrink-0">
                    <div className="flex-1 mr-4">
                        {isEditing ? (
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="text-2xl font-bold text-slate-900 mb-1 w-full border-b border-blue-500 focus:outline-none bg-transparent"
                                placeholder="Role Name"
                                autoFocus
                            />
                        ) : (
                            <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedRole.name}</h2>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Level {selectedRole.level}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteStart(); }}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Role"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onEditRole(selectedRole); }}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <Edit2 size={16} /> Edit Role
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={onCancelEdit}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onSaveRole}
                                    className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    Save Changes
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* TABS HEADER */}
                <div className="px-6 border-b border-slate-100 flex gap-6 text-sm font-medium text-slate-500 shrink-0">
                    <button
                        onClick={() => onSetActiveDetailsTab('overview')}
                        className={`py-4 border-b-2 transition-colors ${activeDetailsTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'}`}
                    >
                        Overview & Capabilities
                    </button>
                    <button
                        onClick={() => onSetActiveDetailsTab('permissions')}
                        className={`py-4 border-b-2 transition-colors ${activeDetailsTab === 'permissions' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'}`}
                    >
                        Assigned Permission Sets
                    </button>
                    <button
                        onClick={() => onSetActiveDetailsTab('visibility')}
                        className={`py-4 border-b-2 transition-colors ${activeDetailsTab === 'visibility' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'}`}
                    >
                        Visibility Groups
                    </button>
                    <button
                        onClick={() => onSetActiveDetailsTab('users')}
                        className={`py-4 border-b-2 transition-colors ${activeDetailsTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'}`}
                    >
                        Assigned Users
                    </button>
                </div>

                {/* --- TAB: OVERVIEW --- */}
                {activeDetailsTab === 'overview' && (
                    <div className="flex-1 flex flex-col overflow-y-auto">
                        <div className="p-8 pb-0">
                            <div className="max-w-2xl grid grid-cols-1 gap-8">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                                    {isEditing ? (
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleChange('description', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 h-32 resize-none"
                                            placeholder="Role description..."
                                        />
                                    ) : (
                                        <p className="text-slate-700 text-lg leading-relaxed">{selectedRole.description || "No description provided."}</p>
                                    )}
                                </div>
                                <div className="flex gap-8">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Members</label>
                                        <div className="text-2xl font-bold text-slate-900">{selectedRole.members}</div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Child Roles</label>
                                        <div className="text-2xl font-bold text-slate-900">{selectedRole.children?.length || 0}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={`mt-auto p-6 border-t border-slate-100 bg-slate-50 shrink-0 transition-opacity ${!isEditing ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            <h4 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                                Hierarchy & Configuration
                                {!isEditing && <span className="text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">Read Only</span>}
                            </h4>
                            <button
                                onClick={(e) => { e.stopPropagation(); onAddChild(selectedRole); }}
                                className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group w-full max-w-md text-left mb-4"
                                disabled={!isEditing}
                            >
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Plus size={20} />
                                </div>
                                <div>
                                    <div className="font-bold text-slate-700 group-hover:text-blue-700">Add Child Role</div>
                                    <div className="text-xs text-slate-500">Create a new role reporting to {selectedRole.name}</div>
                                </div>
                            </button>

                            <div className="max-w-md">
                                <RoleCapabilitiesCard
                                    onClick={() => onSetMode('capabilities')}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* --- TAB: PERMISSION SETS --- */}
                {activeDetailsTab === 'permissions' && (
                    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
                        {/* Assigned Sets */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                Assigned Sets <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{(selectedRole.assignedPermissionSets || []).length}</span>
                            </h3>

                            {(selectedRole.assignedPermissionSets || []).length === 0 ? (
                                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white text-slate-400 text-sm">
                                    No permission sets explicitly assigned to this role.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {(selectedRole.assignedPermissionSets || []).map(setId => {
                                        const set = MOCK_AVAILABLE_PERMISSION_SETS.find(s => s.id === setId) || { id: setId, name: 'Unknown Set', type: 'generic' };
                                        return (
                                            <div key={setId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                        <Shield size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{set.name}</div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-xs text-slate-500">Assigned to Role</span>
                                                            {set.type === 'generic' ? (
                                                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 uppercase">Generic</span>
                                                            ) : (
                                                                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 uppercase">Role Scoped</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {isEditing && (
                                                    <button
                                                        onClick={() => onRemovePermissionSet(setId)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Remove Assignment"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Available Sets - Only show when editing to reduce clutter/encourage explicit action */}
                        {isEditing && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    Available Sets
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {MOCK_AVAILABLE_PERMISSION_SETS
                                        .filter(set => {
                                            // Exclude already assigned
                                            if ((selectedRole.assignedPermissionSets || []).includes(set.id)) return false;

                                            // Include Generic
                                            if (set.type === 'generic' && set.applicableRoles.length === 0) return true;

                                            // Include if scoped to this role
                                            if (set.applicableRoles.includes(selectedRole.id)) return true;

                                            return false;
                                        })
                                        .map(set => (
                                            <div key={set.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-lg transition-colors">
                                                        <Shield size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{set.name}</div>
                                                        <div className="text-xs text-slate-500">{set.description}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => onAssignPermissionSet(set.id)}
                                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 font-medium rounded text-xs hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
                                                >
                                                    Assign
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- TAB: VISIBILITY GROUPS --- */}
                {activeDetailsTab === 'visibility' && (
                    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 space-y-6">
                        {/* Assigned Groups */}
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                Assigned Groups <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">{(selectedRole.visibilityGroups || []).length}</span>
                            </h3>

                            {(selectedRole.visibilityGroups || []).length === 0 ? (
                                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl bg-white text-slate-400 text-sm">
                                    No visibility groups assigned to this role.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {(selectedRole.visibilityGroups || []).map(groupId => {
                                        const group = MOCK_VISIBILITY_GROUPS.find(g => g.id === groupId);
                                        if (!group) return null;
                                        return (
                                            <div key={groupId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                        <Eye size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{group.name}</div>
                                                        <div className="text-xs text-slate-500">{group.description}</div>
                                                    </div>
                                                </div>
                                                {isEditing && (
                                                    <button
                                                        onClick={() => onRemoveVisibilityGroup(groupId)}
                                                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        title="Remove Assignment"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Available Groups - Only show when editing */}
                        {isEditing && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                    Available Groups
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    {MOCK_VISIBILITY_GROUPS
                                        .filter(group => !(selectedRole.visibilityGroups || []).includes(group.id))
                                        .map(group => (
                                            <div key={group.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex items-center justify-between group">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 rounded-lg transition-colors">
                                                        <Eye size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{group.name}</div>
                                                        <div className="text-xs text-slate-500">{group.description}</div>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => onAssignVisibilityGroup(group.id)}
                                                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-500 font-medium rounded text-xs hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
                                                >
                                                    Assign
                                                </button>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- TAB: ASSIGNED USERS (NEW) --- */}
                {activeDetailsTab === 'users' && (
                    <AssignedUsersTab selectedRole={selectedRole} />
                )}
            </div>
        );
    }
    return null;
};

export default RoleDetailsPane;
