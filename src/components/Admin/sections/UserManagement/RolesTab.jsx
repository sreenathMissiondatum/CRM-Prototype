import React, { useState } from 'react';
import { Shield, ChevronDown, ChevronRight, Plus, Users, Layout, MoreHorizontal, Edit2, Info, Trash2, AlertTriangle, ArrowRight, CheckCircle2, Settings, Eye } from 'lucide-react';
import RoleCapabilities from './RoleCapabilities';
import RoleCapabilitiesCard from './RoleCapabilitiesCard';
import { MOCK_VISIBILITY_GROUPS } from '../../../../data/mockVisibilityGroups';

// --- Recursive Component defined OUTSIDE to prevent re-creation/closure issues ---
const RoleTreeItem = ({
    role,
    depth = 0,
    expandedRoles,
    selectedRole,
    onToggleExpand,
    onSelectRole,
    onAddChild,
    onEditRole
}) => {
    const isExpanded = expandedRoles.includes(role.id);
    const hasChildren = role.children && role.children.length > 0;
    const isSelected = selectedRole?.id === role.id;

    return (
        <div className="relative">
            {/* Connector Line (Vertical) */}
            {depth > 0 && (
                <div className="absolute left-[19px] top-0 bottom-0 border-l border-slate-200 -z-10"
                    style={{ left: `${(depth * 24) + 11}px`, top: '-10px', height: 'calc(100% + 10px)' }}
                />
            )}

            <div
                onClick={() => onSelectRole(role)}
                className={`group relative flex items-center pr-3 py-2 cursor-pointer transition-all border-l-4 ${isSelected
                    ? 'bg-blue-50 border-blue-600'
                    : 'hover:bg-slate-50 border-transparent'
                    }`}
                style={{ paddingLeft: `${depth * 24 + 12}px` }}
            >
                {/* Connector Curve (Horizontal) */}
                {depth > 0 && (
                    <div className="absolute border-b border-l border-slate-200 w-3 h-4 rounded-bl-lg -z-10"
                        style={{ left: `${(depth * 24) - 13}px`, top: '-6px' }}
                    />
                )}

                {/* Expand Toggle */}
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        if (hasChildren) onToggleExpand(role.id);
                    }}
                    className={`mr-2 flex-none w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 text-slate-400 transition-colors ${!hasChildren ? 'invisible' : ''}`}
                >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </div>

                {/* Icon */}
                <div className={`mr-3 flex-none p-1.5 rounded-lg ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-white border border-slate-200 text-slate-500 shadow-sm'}`}>
                    <Shield size={16} />
                </div>

                {/* Label */}
                <div className="flex-1 min-w-0">
                    <div className={`text-sm font-bold truncate ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{role.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                        <span className="flex items-center gap-0.5"><Users size={10} /> {role.members}</span>
                        <span>•</span>
                        <span>Level {role.level}</span>
                    </div>
                </div>

                {/* Hover Actions */}
                <div className="hidden group-hover:flex items-center gap-1 ml-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAddChild(role);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Add Child Role"
                    >
                        <Plus size={14} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEditRole(role);
                        }}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit Role"
                    >
                        <Edit2 size={14} />
                    </button>
                </div>
            </div>

            {/* Recursion */}
            {hasChildren && isExpanded && (
                <div>
                    {role.children.map(child => (
                        <RoleTreeItem
                            key={child.id}
                            role={child}
                            depth={depth + 1}
                            expandedRoles={expandedRoles}
                            selectedRole={selectedRole}
                            onToggleExpand={onToggleExpand}
                            onSelectRole={onSelectRole}
                            onAddChild={onAddChild}
                            onEditRole={onEditRole}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const RolesTab = () => {
    // Initial Data
    // Update mock roles with visibilityGroups
    const initialRoles = [
        {
            id: 'admin',
            name: 'System Administrator',
            description: 'Full system access and configuration control.',
            members: 3,
            level: 1,
            visibilityGroups: ['vg_3'], // Mock existing assignment
            children: [
                {
                    id: 'regional_mgr',
                    name: 'Regional Manager',
                    description: 'Oversees multiple branches and approves high-level overrides.',
                    members: 2,
                    level: 2,
                    children: [
                        {
                            id: 'branch_mgr',
                            name: 'Branch Manager',
                            description: 'Manages branch operations and staff.',
                            members: 5,
                            level: 3,
                            children: [
                                {
                                    id: 'lo',
                                    name: 'Loan Officer',
                                    description: 'Manage own leads and loans. Originates new business.',
                                    members: 12,
                                    level: 4,
                                    children: [
                                        {
                                            id: 'lo_assistant',
                                            name: 'LO Assistant',
                                            description: 'Supports Loan Officers with document collection.',
                                            members: 8,
                                            level: 5,
                                            children: []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    id: 'ops_mgr',
                    name: 'Operations Manager',
                    description: 'Oversees underwriting and processing departments.',
                    members: 1,
                    level: 2,
                    children: [
                        {
                            id: 'uw',
                            name: 'Underwriter',
                            description: 'Review and approve applications based on risk criteria.',
                            members: 4,
                            level: 3,
                            children: []
                        },
                        {
                            id: 'proc',
                            name: 'Processor',
                            description: 'Document collection and verification.',
                            members: 6,
                            level: 3,
                            children: []
                        }
                    ]
                }
            ]
        }
    ];

    // --- Mock Permission Sets for Assignment Context ---
    const MOCK_AVAILABLE_PERMISSION_SETS = [
        { id: 1, name: 'Marketing Manager', description: 'Access to marketing campaigns and email templates.', applicableRoles: ['regional_mgr', 'branch_mgr'], type: 'role-scoped' },
        { id: 2, name: 'Compliance Auditor', description: 'Read-only access to all loan files for audit purposes.', applicableRoles: [], type: 'generic' },
        { id: 3, name: 'Branch Manager Override', description: 'Ability to override rate locks.', applicableRoles: ['branch_mgr'], type: 'role-scoped' },
        { id: 4, name: 'Holiday Party Committee', description: 'Event planning access.', applicableRoles: [], type: 'generic' }
    ];

    const [roles, setRoles] = useState(initialRoles);
    const [expandedRoles, setExpandedRoles] = useState(['admin', 'regional_mgr', 'branch_mgr', 'ops_mgr', 'lo']);
    const [selectedRole, setSelectedRole] = useState(null);
    const [mode, setMode] = useState('view'); // 'view', 'edit', 'add', 'delete', 'capabilities'
    const [activeDetailsTab, setActiveDetailsTab] = useState('overview'); // 'overview', 'permissions'
    const [formData, setFormData] = useState({ name: '', description: '', parentId: '', parentName: '', members: 0 });
    const [deleteConfig, setDeleteConfig] = useState({
        step: 1,
        reassignUsersTo: '',
        reassignChildrenTo: '',
        reassignReportingTo: '',
        affectedReportingUsers: 0
    });

    const handleSaveCapabilities = (roleId, newCapabilities) => {
        // Update the main roles tree
        setRoles(prevRoles => {
            const updateRecursive = (nodes) => {
                return nodes.map(node => {
                    if (node.id === roleId) {
                        return { ...node, capabilities: newCapabilities };
                    }
                    if (node.children) {
                        return { ...node, children: updateRecursive(node.children) };
                    }
                    return node;
                });
            };
            return updateRecursive(prevRoles);
        });

        // Update selectedRole if it matches (to reflect changes immediately in UI if persisted)
        if (selectedRole?.id === roleId) {
            setSelectedRole(prev => ({ ...prev, capabilities: newCapabilities }));
        }

        setMode('view');
    };

    // --- Visibility Group Actions ---
    const handleAssignVisibilityGroup = (groupId) => {
        const group = MOCK_VISIBILITY_GROUPS.find(g => g.id === groupId);

        // Audit Log
        console.group(`[AUDIT] Visibility Group Assigned to Role`);
        console.log(`timestamp: ${new Date().toISOString()}`);
        console.log(`role: ${selectedRole.name}`);
        console.log(`visibility_group: ${group.name}`);
        console.log(`admin: Current User`);
        console.groupEnd();

        // Update Role Data
        setRoles(prevRoles => {
            const updateRecursive = (nodes) => {
                return nodes.map(node => {
                    if (node.id === selectedRole.id) {
                        const currentGroups = node.visibilityGroups || [];
                        return { ...node, visibilityGroups: [...currentGroups, groupId] };
                    }
                    if (node.children) {
                        return { ...node, children: updateRecursive(node.children) };
                    }
                    return node;
                });
            };
            return updateRecursive(prevRoles);
        });

        // Update Local State if matches
        setSelectedRole(prev => ({
            ...prev,
            visibilityGroups: [...(prev.visibilityGroups || []), groupId]
        }));
    };

    const handleRemoveVisibilityGroup = (groupId) => {
        if (!window.confirm("Removing this visibility group will remove access from all users in this role. Are you sure?")) return;

        // Audit Log
        console.group(`[AUDIT] Visibility Group Removed from Role`);
        console.log(`timestamp: ${new Date().toISOString()}`);
        console.log(`role: ${selectedRole.name}`);
        console.log(`visibility_group_id: ${groupId}`);
        console.log(`admin: Current User`);
        console.groupEnd();

        // Update Role Data
        setRoles(prevRoles => {
            const updateRecursive = (nodes) => {
                return nodes.map(node => {
                    if (node.id === selectedRole.id) {
                        const currentGroups = node.visibilityGroups || [];
                        return { ...node, visibilityGroups: currentGroups.filter(id => id !== groupId) };
                    }
                    if (node.children) {
                        return { ...node, children: updateRecursive(node.children) };
                    }
                    return node;
                });
            };
            return updateRecursive(prevRoles);
        });

        // Update Local State
        setSelectedRole(prev => ({
            ...prev,
            visibilityGroups: (prev.visibilityGroups || []).filter(id => id !== groupId)
        }));
    };

    // --- Permission Set Actions ---
    const handleAssignPermissionSet = (setId) => {
        const set = MOCK_AVAILABLE_PERMISSION_SETS.find(s => s.id === setId);

        // Audit Log
        console.group(`[AUDIT] Permission Set Assigned to Role`);
        console.log(`timestamp: ${new Date().toISOString()}`);
        console.log(`role: ${selectedRole.name}`);
        console.log(`permission_set: ${set.name}`);
        console.log(`admin: Current User`);
        console.groupEnd();

        // Update Role Data
        setRoles(prevRoles => {
            const updateRecursive = (nodes) => {
                return nodes.map(node => {
                    if (node.id === selectedRole.id) {
                        const currentSets = node.assignedPermissionSets || [];
                        return { ...node, assignedPermissionSets: [...currentSets, setId] };
                    }
                    if (node.children) {
                        return { ...node, children: updateRecursive(node.children) };
                    }
                    return node;
                });
            };
            return updateRecursive(prevRoles);
        });

        // Update Local State if matches
        setSelectedRole(prev => ({
            ...prev,
            assignedPermissionSets: [...(prev.assignedPermissionSets || []), setId]
        }));
    };

    const handleRemovePermissionSet = (setId) => {
        if (!window.confirm("Removing this permission set will remove access from all users in this role. Are you sure?")) return;

        // Audit Log
        console.group(`[AUDIT] Permission Set Removed from Role`);
        console.log(`timestamp: ${new Date().toISOString()}`);
        console.log(`role: ${selectedRole.name}`);
        console.log(`permission_set_id: ${setId}`);
        console.log(`admin: Current User`);
        console.groupEnd();

        // Update Role Data
        setRoles(prevRoles => {
            const updateRecursive = (nodes) => {
                return nodes.map(node => {
                    if (node.id === selectedRole.id) {
                        const currentSets = node.assignedPermissionSets || [];
                        return { ...node, assignedPermissionSets: currentSets.filter(id => id !== setId) };
                    }
                    if (node.children) {
                        return { ...node, children: updateRecursive(node.children) };
                    }
                    return node;
                });
            };
            return updateRecursive(prevRoles);
        });

        // Update Local State
        setSelectedRole(prev => ({
            ...prev,
            assignedPermissionSets: (prev.assignedPermissionSets || []).filter(id => id !== setId)
        }));
    };


    // --- Helpers ---
    const toggleExpand = (roleId) => {
        setExpandedRoles(prev =>
            prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
        );
    };

    const handleSelectRole = (role) => {
        setSelectedRole(role);
        setMode('view');
        setActiveDetailsTab('overview');
    };

    const handleAddChild = (parentRole) => {
        setMode('add');
        setSelectedRole(null);
        setFormData({
            id: '',
            name: '',
            description: '',
            parentId: parentRole.id,
            parentName: parentRole.name,
            level: parentRole.level + 1,
            members: 0
        });
    };

    const handleEditRole = (role) => {
        setSelectedRole(role);
        setMode('edit');
        setFormData({
            id: role.id,
            name: role.name || '',
            description: role.description || '',
            parentId: 'readonly',
            parentName: 'Parent Role',
            level: role.level,
            members: role.members || 0,
            visibilityGroups: role.visibilityGroups || []
        });
    };

    const handleDeleteStart = () => {
        setMode('delete');
        // Simulate finding users who report to this role
        // For prototype, we'll assume a random number between 0 and 15
        const mockReportingConflicts = Math.floor(Math.random() * 15);

        setDeleteConfig({
            step: 1,
            reassignUsersTo: '',
            reassignChildrenTo: '',
            reassignReportingTo: '',
            affectedReportingUsers: mockReportingConflicts
        });
    };

    const getPotentialTargets = (excludeRoleId) => {
        const flatten = (nodes) => {
            let res = [];
            nodes.forEach(n => {
                res.push(n);
                if (n.children) res = res.concat(flatten(n.children));
            });
            return res;
        };

        const allRoles = flatten(roles);

        const getDescendantIds = (role, all) => {
            let ids = [];
            if (role.children) {
                role.children.forEach(c => {
                    ids.push(c.id);
                    ids = ids.concat(getDescendantIds(c, all));
                });
            }
            return ids;
        };

        const currentRole = allRoles.find(r => r.id === excludeRoleId);
        if (!currentRole) return [];

        const descendantIds = getDescendantIds(currentRole, allRoles);
        return allRoles.filter(r => r.id !== excludeRoleId && !descendantIds.includes(r.id));
    };

    const handleDeleteConfirm = () => {
        const roleToDelete = selectedRole;

        // --- AUDIT LOGGING ---
        console.group(`[AUDIT] Role Deletion: ${roleToDelete.name}`);
        console.log(`timestamp: ${new Date().toISOString()}`);
        console.log(`admin: Current User`);
        console.log(`action: DELETE_ROLE`);
        console.log(`target_role_id: ${roleToDelete.id}`);
        console.log(`reassigned_users_count: ${roleToDelete.members}`);
        if (roleToDelete.members > 0) console.log(`reassigned_users_to: ${deleteConfig.reassignUsersTo}`);
        console.log(`reparented_children_count: ${roleToDelete.children?.length || 0}`);
        if (roleToDelete.children?.length > 0) console.log(`reparented_children_to: ${deleteConfig.reassignChildrenTo}`);
        console.log(`affected_reporting_users: ${deleteConfig.affectedReportingUsers}`);
        if (deleteConfig.affectedReportingUsers > 0) console.log(`reporting_manager_reassignment: ${deleteConfig.reassignReportingTo}`);
        console.groupEnd();
        // ---------------------

        const deleteRecursive = (nodes) => {
            let newNodes = JSON.parse(JSON.stringify(nodes));

            const traverseAndRemove = (list, id) => {
                const index = list.findIndex(n => n.id === id);
                if (index !== -1) {
                    const removed = list[index];
                    list.splice(index, 1);
                    return removed;
                }
                for (let node of list) {
                    if (node.children) {
                        const res = traverseAndRemove(node.children, id);
                        if (res) return res;
                    }
                }
                return null;
            };

            const removedRole = traverseAndRemove(newNodes, roleToDelete.id);

            if (removedRole) {
                if (removedRole.members > 0 && deleteConfig.reassignUsersTo) {
                    const findAndAddMembers = (list, targetId, count) => {
                        for (let node of list) {
                            if (node.id === targetId) {
                                node.members += count;
                                return true;
                            }
                            if (node.children && findAndAddMembers(node.children, targetId, count)) return true;
                        }
                        return false;
                    };
                    findAndAddMembers(newNodes, deleteConfig.reassignUsersTo, removedRole.members);
                }

                if (removedRole.children && removedRole.children.length > 0 && deleteConfig.reassignChildrenTo) {
                    const findAndAddChildren = (list, targetId, childrenToMove) => {
                        for (let node of list) {
                            if (node.id === targetId) {
                                node.children = [...(node.children || []), ...childrenToMove];
                                return true;
                            }
                            if (node.children && findAndAddChildren(node.children, targetId, childrenToMove)) return true;
                        }
                        return false;
                    };
                    findAndAddChildren(newNodes, deleteConfig.reassignChildrenTo, removedRole.children);
                }
            }
            return newNodes;
        };

        setRoles(deleteRecursive(roles));
        setSelectedRole(null);
        setMode('view');
    };

    const handleSaveRole = () => {
        if (!formData.name) return;

        if (mode === 'edit') {
            const updateRecursive = (nodes) => {
                return nodes.map(node => {
                    if (node.id === formData.id) {
                        const updatedNode = { ...node, name: formData.name, description: formData.description };
                        if (selectedRole?.id === node.id) {
                            setSelectedRole(updatedNode);
                        }
                        return updatedNode;
                    }
                    if (node.children && node.children.length > 0) {
                        return { ...node, children: updateRecursive(node.children) };
                    }
                    return node;
                });
            };
            setRoles(prevRoles => updateRecursive(prevRoles));
            setMode('view');
        } else if (mode === 'add') {
            const newRole = {
                id: `role_${Date.now()}`,
                name: formData.name,
                description: formData.description,
                members: 0,
                level: formData.level,
                children: []
            };

            const addRecursive = (nodes) => {
                return nodes.map(node => {
                    if (node.id === formData.parentId) {
                        return { ...node, children: [...(node.children || []), newRole] };
                    }
                    if (node.children && node.children.length > 0) {
                        return { ...node, children: addRecursive(node.children) };
                    }
                    return node;
                });
            };

            setRoles(prevRoles => addRecursive(prevRoles));
            setExpandedRoles(prev => prev.includes(formData.parentId) ? prev : [...prev, formData.parentId]);
            setSelectedRole(newRole);
            setMode('view');
        }
    };

    return (
        <div className="flex items-start gap-6 px-6 pb-6 h-full">
            {/* LEFT PANE: Hierarchy Tree */}
            <div className="w-96 flex-none bg-white rounded-xl border border-slate-200 flex flex-col shadow-sm min-h-[600px] h-[calc(100vh-180px)] overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div>
                        <h3 className="font-bold text-slate-800">Organisation Chart</h3>
                        <p className="text-xs text-slate-500">Define reporting structure</p>
                    </div>
                </div>

                <div className="flex-1 py-2 overflow-y-auto">
                    {roles.map(role => (
                        <RoleTreeItem
                            key={role.id}
                            role={role}
                            expandedRoles={expandedRoles}
                            selectedRole={selectedRole}
                            onToggleExpand={toggleExpand}
                            onSelectRole={handleSelectRole}
                            onAddChild={handleAddChild}
                            onEditRole={handleEditRole}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT PANE: Details / Form */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col shadow-sm h-[calc(100vh-180px)] overflow-hidden">
                {mode === 'view' && !selectedRole && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                            <Layout size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-slate-900 font-bold text-lg mb-1">Role Hierarchy</h3>
                        <p className="max-w-xs mx-auto">Select a role from the tree to view details, or add a child role to expand the organization.</p>
                    </div>
                )}

                {(mode === 'view' && selectedRole) && (
                    <div className="flex flex-col h-full">
                        {/* ROLE HEADER */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedRole.name}</h2>
                                <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Level {selectedRole.level}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteStart(); }}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Role"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleEditRole(selectedRole); }}
                                    className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <Edit2 size={16} /> Edit Role
                                </button>
                            </div>
                        </div>

                        {/* TABS HEADER */}
                        <div className="px-6 border-b border-slate-100 flex gap-6 text-sm font-medium text-slate-500 shrink-0">
                            <button
                                onClick={() => setActiveDetailsTab('overview')}
                                className={`py-4 border-b-2 transition-colors ${activeDetailsTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'}`}
                            >
                                Overview & Capabilities
                            </button>
                            <button
                                onClick={() => setActiveDetailsTab('permissions')}
                                className={`py-4 border-b-2 transition-colors ${activeDetailsTab === 'permissions' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'}`}
                            >
                                Assigned Permission Sets
                            </button>
                            <button
                                onClick={() => setActiveDetailsTab('visibility')}
                                className={`py-4 border-b-2 transition-colors ${activeDetailsTab === 'visibility' ? 'border-blue-600 text-blue-600' : 'border-transparent hover:text-slate-700'}`}
                            >
                                Visibility Groups
                            </button>
                        </div>

                        {/* --- TAB: OVERVIEW --- */}
                        {activeDetailsTab === 'overview' && (
                            <div className="flex-1 flex flex-col overflow-y-auto">
                                <div className="p-8 pb-0">
                                    <div className="max-w-2xl grid grid-cols-1 gap-8">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                                            <p className="text-slate-700 text-lg leading-relaxed">{selectedRole.description || "No description provided."}</p>
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
                                <div className="mt-auto p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                                    <h4 className="font-bold text-slate-800 mb-3 text-sm">Hierarchy Actions</h4>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleAddChild(selectedRole); }}
                                        className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all group w-full max-w-md text-left"
                                    >
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Plus size={20} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-700 group-hover:text-blue-700">Add Child Role</div>
                                            <div className="text-xs text-slate-500">Create a new role reporting to {selectedRole.name}</div>
                                        </div>
                                    </button>

                                    <div className="mt-4">
                                        <RoleCapabilitiesCard onClick={() => setMode('capabilities')} />
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
                                                        <button
                                                            onClick={() => handleRemovePermissionSet(setId)}
                                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                            title="Remove Assignment"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Available Sets */}
                                <div>
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
                                                            <div className="text-xs text-slate-500 mb-0.5">{set.description}</div>
                                                            <div className="flex items-center gap-2">
                                                                {set.type === 'generic' ? (
                                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200 uppercase">Generic</span>
                                                                ) : (
                                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-100 uppercase">Role Scoped</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAssignPermissionSet(set.id)}
                                                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm flex items-center gap-1"
                                                    >
                                                        <Plus size={14} /> Assign
                                                    </button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
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
                                            No visibility groups explicitly assigned to this role.
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-3">
                                            {(selectedRole.visibilityGroups || []).map(groupId => {
                                                const group = MOCK_VISIBILITY_GROUPS.find(g => g.id === groupId) || { id: groupId, name: 'Unknown Group', description: 'Unknown' };
                                                return (
                                                    <div key={groupId} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                                                <Eye size={18} />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-slate-800">{group.name}</div>
                                                                <div className="text-xs text-slate-500 mt-1">{group.description}</div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleRemoveVisibilityGroup(groupId)}
                                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                            title="Remove Assignment"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Available Groups */}
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        Available Groups
                                    </h3>
                                    <div className="grid grid-cols-1 gap-3">
                                        {MOCK_VISIBILITY_GROUPS
                                            .filter(group => !(selectedRole.visibilityGroups || []).includes(group.id))
                                            .map(group => (
                                                <div key={group.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all flex items-center justify-between group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-slate-50 text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-600 rounded-lg transition-colors">
                                                            <Eye size={18} />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-800">{group.name}</div>
                                                            <div className="text-xs text-slate-500 mb-0.5">{group.description}</div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAssignVisibilityGroup(group.id)}
                                                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-lg hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm flex items-center gap-1"
                                                    >
                                                        <Plus size={14} /> Assign
                                                    </button>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                {(mode === 'edit' || mode === 'add') && (
                    <div className="flex flex-col">
                        <div className="p-6 border-b border-slate-100">
                            <h2 className="text-xl font-bold text-slate-900">
                                {mode === 'add' ? 'Create New Role' : 'Edit Role'}
                            </h2>
                            <p className="text-slate-500 text-sm">
                                {mode === 'add' ? `Adding a new role reporting to ${formData.parentName}` : 'Update role details and hierarchy placement.'}
                            </p>
                        </div>

                        <div className="p-8">
                            <div className="max-w-xl space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Role Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                        placeholder="e.g., Senior Loan Officer"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm h-32 resize-none"
                                        placeholder="Describe the responsibilities of this role..."
                                    />
                                </div>

                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Reporting Line</label>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white border border-slate-200 rounded shadow-sm text-slate-500">
                                            <Shield size={16} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-xs text-slate-500 mb-0.5">Reports to</div>
                                            <div className="font-bold text-slate-800">{formData.parentName}</div>
                                        </div>
                                        {mode === 'edit' && (
                                            <button className="text-xs text-blue-600 font-medium hover:underline">Change</button>
                                        )}
                                    </div>
                                    {mode === 'edit' && formData.members > 0 && (
                                        <div className="mt-3 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded border border-amber-100">
                                            <Info size={14} className="shrink-0 mt-0.5" />
                                            <span>Changing the parent role will affect reporting lines for {formData.members} assigned users.</span>
                                        </div>
                                    )}
                                </div>

                                {/* Visibility Groups Assignment (NEW) */}
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Assigned Visibility Groups</label>
                                    <p className="text-xs text-slate-500 mb-3">Define which records users in this role can see. (Additive to Global Visibility)</p>

                                    <div className="space-y-2">
                                        {[
                                            { id: 'vg_1', name: 'Branch Standard Access', desc: 'See all records in assigned branch' },
                                            { id: 'vg_2', name: 'Manager Oversight', desc: 'See own + direct reports data' },
                                            { id: 'vg_3', name: 'Org-Wide Audit', desc: 'Full organization visibility' }
                                        ].map(group => {
                                            const isChecked = formData.visibilityGroups && formData.visibilityGroups.includes(group.id);
                                            return (
                                                <label key={group.id} className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                        checked={isChecked}
                                                        onChange={(e) => {
                                                            const newGroups = e.target.checked
                                                                ? [...(formData.visibilityGroups || []), group.id]
                                                                : (formData.visibilityGroups || []).filter(id => id !== group.id);
                                                            setFormData({ ...formData, visibilityGroups: newGroups });
                                                        }}
                                                    />
                                                    <div>
                                                        <div className="text-sm font-bold text-slate-700">{group.name}</div>
                                                        <div className="text-xs text-slate-500">{group.desc}</div>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
                            <button
                                onClick={() => setMode('view')}
                                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveRole}
                                className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                {mode === 'add' ? 'Create Role' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                )}

                {/* --- DELETE WIZARD --- */}
                {mode === 'delete' && (
                    <div className="flex flex-col">
                        <div className="p-6 border-b border-slate-100 bg-red-50/50">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                                    <AlertTriangle size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-red-900">Delete Role: {selectedRole.name}</h2>
                            </div>
                            <p className="text-red-700 text-sm pl-[44px]">Strict validation is enforced to prevent data orphans.</p>
                        </div>

                        {/* WIZARD CONTENT */}
                        <div className="p-8">

                            {/* --- Step 1: Impact Analysis (Mandatory) --- */}
                            {deleteConfig.step === 1 && (
                                <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-slate-800 mb-2">Impact Analysis</h3>
                                        <p className="text-slate-600 text-sm">Review the organizational impact before proceeding. This action cannot be undone.</p>
                                    </div>

                                    {(selectedRole.members > 0 || (selectedRole.children && selectedRole.children.length > 0) || deleteConfig.affectedReportingUsers > 0) ? (
                                        <>
                                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
                                                <div className="p-6 space-y-4">
                                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                        <div className="flex items-center gap-3">
                                                            <Users size={18} className="text-slate-400" />
                                                            <span className="text-slate-700 font-medium">Assigned Users</span>
                                                        </div>
                                                        <span className="font-bold text-slate-900 text-lg">{selectedRole.members}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                        <div className="flex items-center gap-3">
                                                            <Layout size={18} className="text-slate-400" />
                                                            <span className="text-slate-700 font-medium">Child Roles</span>
                                                        </div>
                                                        <span className="font-bold text-slate-900 text-lg">{selectedRole.children?.length || 0}</span>
                                                    </div>

                                                    <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                                                        <div className="flex items-center gap-3">
                                                            <Shield size={18} className="text-slate-400" />
                                                            <span className="text-slate-700 font-medium">Reporting Dependencies</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="font-bold text-slate-900 text-lg">{deleteConfig.affectedReportingUsers}</span>
                                                            <div className="text-xs text-slate-400">users report to managers in this role</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 mb-8 flex gap-3 text-amber-800 text-sm">
                                                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-bold">Action Required:</span> You must reassign all dependencies to maintain organizational integrity.
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setDeleteConfig({ ...deleteConfig, step: 2 })}
                                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm flex justify-center items-center gap-2 transition-all"
                                            >
                                                Start Migration Analysis <ArrowRight size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-green-500 shadow-sm">
                                                <CheckCircle2 size={32} />
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800 mb-2">Safe to Delete</h3>
                                            <p className="text-slate-600 mb-8 max-w-xs mx-auto">Use this action to permanently remove this role from the schema.</p>
                                            <button
                                                onClick={handleDeleteConfirm}
                                                className="px-8 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-sm flex items-center gap-2 mx-auto"
                                            >
                                                <Trash2 size={18} /> Confirm Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* --- Step 2: Role & User Reassignment --- */}
                            {deleteConfig.step === 2 && (
                                <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                                    <div>
                                        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Step 2 of 4</div>
                                        <h3 className="font-bold text-xl text-slate-900">Reassign Direct Dependencies</h3>
                                        <p className="text-slate-500 text-sm mt-1">Move direct users and child roles to a new parent.</p>
                                    </div>

                                    <div className="space-y-6">
                                        {selectedRole.members > 0 ? (
                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex justify-between mb-4">
                                                    <label className="block text-sm font-bold text-slate-700">
                                                        Reassign <span className="text-blue-600">{selectedRole.members} Users</span> To:
                                                    </label>
                                                </div>
                                                <select
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                                    value={deleteConfig.reassignUsersTo}
                                                    onChange={(e) => setDeleteConfig({ ...deleteConfig, reassignUsersTo: e.target.value })}
                                                >
                                                    <option value="">Select Target Role...</option>
                                                    {getPotentialTargets(selectedRole.id).map(r => (
                                                        <option key={r.id} value={r.id}>{r.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center gap-3 text-sm">
                                                <CheckCircle2 size={16} /> No direct users to reassign.
                                            </div>
                                        )}

                                        {selectedRole.children?.length > 0 ? (
                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="flex justify-between mb-4">
                                                    <label className="block text-sm font-bold text-slate-700">
                                                        Move <span className="text-purple-600">{selectedRole.children.length} Child Roles</span> To:
                                                    </label>
                                                </div>
                                                <select
                                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                                    value={deleteConfig.reassignChildrenTo}
                                                    onChange={(e) => setDeleteConfig({ ...deleteConfig, reassignChildrenTo: e.target.value })}
                                                >
                                                    <option value="">Select New Parent Role...</option>
                                                    {getPotentialTargets(selectedRole.id).map(r => (
                                                        <option key={r.id} value={r.id}>{r.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-100 flex items-center gap-3 text-sm">
                                                <CheckCircle2 size={16} /> No child roles to reparent.
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                                        <button
                                            onClick={() => setDeleteConfig({ ...deleteConfig, step: 1 })}
                                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfig({ ...deleteConfig, step: 3 })}
                                            disabled={
                                                (selectedRole.members > 0 && !deleteConfig.reassignUsersTo) ||
                                                (selectedRole.children?.length > 0 && !deleteConfig.reassignChildrenTo)
                                            }
                                            className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                        >
                                            Continue to Reporting
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* --- Step 3: Reporting Manager Reassignment (CRITICAL) --- */}
                            {deleteConfig.step === 3 && (
                                <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-300">
                                    <div>
                                        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Step 3 of 4</div>
                                        <h3 className="font-bold text-xl text-slate-900">Reporting Manager Reassignment</h3>
                                        <p className="text-slate-500 text-sm mt-1">Users in this role act as managers. Their direct reports need a new manager.</p>
                                    </div>

                                    <div className="space-y-6">
                                        {deleteConfig.affectedReportingUsers > 0 ? (
                                            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                                                <div className="mb-6 flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                                                    <Users size={18} className="text-amber-600 mt-0.5 shrink-0" />
                                                    <div>
                                                        <div className="font-bold text-amber-800">{deleteConfig.affectedReportingUsers} users currently report to managers in this role.</div>
                                                        <div className="text-xs text-amber-700 mt-1">They cannot be left without a manager. Please select a new reporting line for these users.</div>
                                                    </div>
                                                </div>

                                                <label className="block text-sm font-bold text-slate-700 mb-3">
                                                    Reassign Reporting Lines To:
                                                </label>

                                                <div className="space-y-3">
                                                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                                        <input
                                                            type="radio"
                                                            name="reporting"
                                                            className="w-4 h-4 text-blue-600"
                                                            checked={deleteConfig.reassignReportingTo === 'manager_of_deleted'}
                                                            onChange={() => setDeleteConfig({ ...deleteConfig, reassignReportingTo: 'manager_of_deleted' })}
                                                        />
                                                        <div>
                                                            <div className="font-bold text-slate-800 text-sm">Manager of deleted role (Default)</div>
                                                            <div className="text-xs text-slate-500">Reports will roll up to the next level manager.</div>
                                                        </div>
                                                    </label>

                                                    <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                                        <input
                                                            type="radio"
                                                            name="reporting"
                                                            className="w-4 h-4 text-blue-600"
                                                            checked={deleteConfig.reassignReportingTo === 'specific_user'}
                                                            onChange={() => setDeleteConfig({ ...deleteConfig, reassignReportingTo: 'specific_user' })}
                                                        />
                                                        <div>
                                                            <div className="font-bold text-slate-800 text-sm">Select Specific User</div>
                                                            <div className="text-xs text-slate-500">Pick a specific person to take over management.</div>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-12 text-center bg-slate-50 border border-slate-200 border-dashed rounded-xl">
                                                <CheckCircle2 size={32} className="text-green-500 mx-auto mb-3" />
                                                <h3 className="font-bold text-slate-800">No Reporting Conflicts</h3>
                                                <p className="text-slate-500 text-sm">No users report to members of this role.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                                        <button
                                            onClick={() => setDeleteConfig({ ...deleteConfig, step: 2 })}
                                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfig({ ...deleteConfig, step: 4 })}
                                            disabled={deleteConfig.affectedReportingUsers > 0 && !deleteConfig.reassignReportingTo}
                                            className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                                        >
                                            Review & Confirm
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* --- Step 4: Final Confirmation --- */}
                            {deleteConfig.step === 4 && (
                                <div className="max-w-xl mx-auto animate-in fade-in slide-in-from-right-8 duration-300">
                                    <div>
                                        <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Final Step</div>
                                        <h3 className="font-bold text-xl text-slate-900">Confirm Deletion</h3>
                                        <p className="text-slate-500 text-sm mt-1">Please review the summary of changes below.</p>
                                    </div>

                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-6 mt-6">
                                        <h4 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">Change Summary</h4>
                                        <ul className="space-y-4 text-sm text-slate-700">
                                            {selectedRole.members > 0 && (
                                                <li className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 bg-blue-100 text-blue-600 rounded-full"><Users size={12} /></div>
                                                    <span>Reassign <strong>{selectedRole.members} users</strong> to new role.</span>
                                                </li>
                                            )}
                                            {selectedRole.children?.length > 0 && (
                                                <li className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 bg-purple-100 text-purple-600 rounded-full"><Layout size={12} /></div>
                                                    <span>Reparent <strong>{selectedRole.children.length} roles</strong> to new parent.</span>
                                                </li>
                                            )}
                                            {deleteConfig.affectedReportingUsers > 0 && (
                                                <li className="flex items-start gap-3">
                                                    <div className="mt-0.5 p-1 bg-amber-100 text-amber-600 rounded-full"><Shield size={12} /></div>
                                                    <span>Reassign reporting managers for <strong>{deleteConfig.affectedReportingUsers} users</strong>.</span>
                                                </li>
                                            )}
                                            <li className="flex items-start gap-3 pt-3 border-t border-slate-200">
                                                <div className="mt-0.5 p-1 bg-red-100 text-red-600 rounded-full"><Trash2 size={12} /></div>
                                                <span className="text-red-700 font-bold">Permanently delete role: {selectedRole.name}</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setDeleteConfig({ ...deleteConfig, step: 3 })}
                                            className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50"
                                        >
                                            Back
                                        </button>
                                        <button
                                            onClick={handleDeleteConfirm}
                                            className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-sm shadow-red-200"
                                        >
                                            Confirm & Delete Role
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer for Wizard (Cancel) */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-start">
                            <button
                                onClick={() => setMode('view')}
                                className="text-slate-500 hover:text-slate-800 font-medium text-sm transition-colors"
                            >
                                Cancel Wizard
                            </button>
                        </div>
                    </div>
                )}

                {(mode === 'capabilities' && selectedRole) && (
                    <RoleCapabilities
                        entity={selectedRole}
                        entityType="role"
                        // For prototype, we pass null as parentRole or implement lookup lightly
                        parentRole={null}
                        onSave={handleSaveCapabilities}
                        onBack={() => setMode('view')}
                    />
                )}
            </div>
        </div>
    );
};

export default RolesTab;
