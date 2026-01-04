import React, { useState } from 'react';
import { Plus, FolderPlus, X } from 'lucide-react';
import RoleTreeItem from './RoleTreeItem';
import RoleDetailsPane from './RoleDetailsPane';
import { MOCK_VISIBILITY_GROUPS } from '../../../../data/mockVisibilityGroups';

const RolesMVP = () => {
    // --- State ---
    const [roles, setRoles] = useState([
        { id: 'role_1', name: 'CEO', level: 1, members: 1, children: [] }
    ]);
    const [expandedRoles, setExpandedRoles] = useState(['role_1']);
    const [selectedRole, setSelectedRole] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [activeDetailsTab, setActiveDetailsTab] = useState('overview');

    // Modal State
    const [showAddModal, setShowAddModal] = useState(false);
    const [addModalData, setAddModalData] = useState({ name: '', description: '', parentId: '' });

    // --- Actions ---

    const toggleExpand = (roleId) => {
        setExpandedRoles(prev =>
            prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
        );
    };

    const handleSelectRole = (role) => {
        setSelectedRole(role);
        setIsEditing(false);
        setActiveDetailsTab('overview');
    };

    // Open Modal to Add Role (Root or Child)
    const handleOpenAddModal = (parentId = '') => {
        setAddModalData({ name: '', description: '', parentId });
        setShowAddModal(true);
    };

    const handleSaveNewRole = () => {
        if (!addModalData.name) return;

        const newRole = {
            id: `role_${Date.now()}`,
            name: addModalData.name,
            description: addModalData.description,
            members: 0,
            children: []
        };

        if (!addModalData.parentId) {
            // Root Role
            newRole.level = 1;
            setRoles([...roles, newRole]);
        } else {
            // Child Role
            const addRecursive = (nodes) => {
                return nodes.map(node => {
                    if (node.id === addModalData.parentId) {
                        return { ...node, children: [...(node.children || []), { ...newRole, level: node.level + 1 }] };
                    }
                    if (node.children) {
                        return { ...node, children: addRecursive(node.children) };
                    }
                    return node;
                });
            };
            setRoles(prev => addRecursive(prev));
            // Auto expand parent
            setExpandedRoles(prev => prev.includes(addModalData.parentId) ? prev : [...prev, addModalData.parentId]);
        }

        setShowAddModal(false);
        handleSelectRole(newRole); // Auto select
    };

    // Right Pane Actions
    const handleEditRole = (role) => {
        setFormData({ ...role });
        setIsEditing(true);
    };

    const handleSaveEdit = () => {
        const updateRecursive = (nodes) => {
            return nodes.map(node => {
                if (node.id === formData.id) {
                    const updated = { ...node, name: formData.name, description: formData.description };
                    if (selectedRole?.id === node.id) setSelectedRole(updated);
                    return updated;
                }
                if (node.children) {
                    return { ...node, children: updateRecursive(node.children) };
                }
                return node;
            });
        };
        setRoles(prev => updateRecursive(prev));
        setIsEditing(false);
    };

    const handleDeleteRole = () => {
        if (!selectedRole) return;
        if (selectedRole.children && selectedRole.children.length > 0) {
            alert("Cannot delete role with children.");
            return;
        }
        if (window.confirm("Delete this role?")) {
            const deleteRecursive = (nodes) => {
                return nodes.filter(n => n.id !== selectedRole.id).map(n => ({
                    ...n,
                    children: n.children ? deleteRecursive(n.children) : []
                }));
            };
            setRoles(prev => deleteRecursive(prev));
            setSelectedRole(null);
        }
    };

    // --- Helpers to Flatten Roles for Dropdown ---
    const getAllRoles = () => {
        const list = [];
        const traverse = (nodes) => {
            nodes.forEach(n => {
                list.push(n);
                if (n.children) traverse(n.children);
            });
        };
        traverse(roles);
        return list;
    };

    return (
        <div className="flex items-start gap-6 px-6 pb-6 h-full relative">
            {/* LEFT PANE */}
            <div className="w-96 flex-none bg-white rounded-xl border border-slate-200 flex flex-col shadow-sm min-h-[600px] h-[calc(100vh-180px)] overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
                    <div>
                        <h3 className="font-bold text-slate-800">Roles List</h3>
                        <p className="text-xs text-slate-500">Manage defined roles</p>
                    </div>
                </div>

                <div className="px-4 py-2 border-b border-slate-100 bg-white">
                    <button
                        onClick={() => handleOpenAddModal()}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg shadow-sm hover:bg-indigo-700 transition-all text-xs font-bold uppercase tracking-wide"
                    >
                        <Plus size={14} />
                        Add Role
                    </button>
                </div>

                {roles.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                        <FolderPlus size={32} className="mb-2 opacity-50" />
                        <h4 className="font-bold text-slate-600">No roles yet</h4>
                        <p className="text-xs">Create your first role to start.</p>
                    </div>
                ) : (
                    <div className="flex-1 py-2 overflow-y-auto">
                        {roles.map(role => (
                            <RoleTreeItem
                                key={role.id}
                                role={role}
                                expandedRoles={expandedRoles}
                                selectedRole={selectedRole}
                                onToggleExpand={toggleExpand}
                                onSelectRole={handleSelectRole}
                                onAddChild={(r) => handleOpenAddModal(r.id)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* RIGHT PANE */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col shadow-sm h-[calc(100vh-180px)] overflow-hidden">
                <RoleDetailsPane
                    mode="view"
                    selectedRole={selectedRole}
                    isEditing={isEditing}
                    formData={formData}
                    activeDetailsTab={activeDetailsTab}
                    onEditRole={handleEditRole}
                    onSaveRole={handleSaveEdit}
                    onCancelEdit={() => setIsEditing(false)}
                    onDeleteStart={handleDeleteRole}
                    onFormDataChange={setFormData}
                    onSetActiveDetailsTab={setActiveDetailsTab}
                    onAddChild={(r) => handleOpenAddModal(r.id)}
                    onAssignPermissionSet={() => { }} // Stub
                    onRemovePermissionSet={() => { }} // Stub
                    onAssignVisibilityGroup={() => { }} // Stub
                    onRemoveVisibilityGroup={() => { }} // Stub
                />
            </div>

            {/* ADD ROLE MODAL */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] bg-slate-900/50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-800">
                                {addModalData.parentId ? 'Add Child Role' : 'Add New Role'}
                            </h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={addModalData.name}
                                    onChange={e => setAddModalData({ ...addModalData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    placeholder="e.g. Sales Manager"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Parent Role</label>
                                <select
                                    value={addModalData.parentId}
                                    onChange={e => setAddModalData({ ...addModalData, parentId: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                                    disabled={!!addModalData.parentId} // If called as Add Child, parent is fixed
                                >
                                    <option value="">(None - Root Role)</option>
                                    {getAllRoles().map(r => (
                                        <option key={r.id} value={r.id}>
                                            {'-'.repeat(r.level - 1)} {r.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                                <textarea
                                    value={addModalData.description}
                                    onChange={e => setAddModalData({ ...addModalData, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 h-24 resize-none"
                                    placeholder="Description..."
                                />
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                            <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 font-medium hover:bg-white rounded-lg transition-colors">Cancel</button>
                            <button
                                onClick={handleSaveNewRole}
                                disabled={!addModalData.name}
                                className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                Save Role
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolesMVP;
