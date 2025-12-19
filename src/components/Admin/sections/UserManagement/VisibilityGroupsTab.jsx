import React, { useState } from 'react';
import { Eye, Plus, Edit2, Trash2, Shield, Info, Check, Search, Globe, Users, Building, Briefcase, ChevronRight, FileText, DollarSign, UserSquare, Layout } from 'lucide-react';
import { MOCK_VISIBILITY_GROUPS, VISIBILITY_SCOPES, VISIBILITY_OBJECTS } from '../../../../data/mockVisibilityGroups';

// Icon Mapping
const ICON_MAP = {
    Users, Building, Briefcase, Globe, DollarSign, UserSquare, Layout
};

const resolveIcon = (iconName) => ICON_MAP[iconName] || Globe;

const SCOPE_DEFINITIONS = VISIBILITY_SCOPES.map(s => ({ ...s, icon: resolveIcon(s.iconName) }));
const OBJECTS = VISIBILITY_OBJECTS.map(o => ({ ...o, icon: resolveIcon(o.iconName) }));


const VisibilityGroupsTab = () => {
    const [mode, setMode] = useState('list'); // 'list', 'create', 'edit'
    const [groups, setGroups] = useState(MOCK_VISIBILITY_GROUPS);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Form State
    const [formData, setFormData] = useState({ name: '', description: '', permissions: {} });
    const [activeObject, setActiveObject] = useState('leads'); // Default selected object in wizard

    // --- Actions ---
    const handleCreate = () => {
        setFormData({ name: '', description: '', permissions: {} });
        setActiveObject('leads');
        setSelectedGroup(null);
        setMode('create');
    };

    const handleEdit = (group) => {
        setFormData({
            name: group.name,
            description: group.description,
            permissions: JSON.parse(JSON.stringify(group.permissions || {})) // Deep copy
        });
        setActiveObject('leads');
        setSelectedGroup(group);
        setMode('edit');
    };

    const toggleScope = (objectKey, scopeId) => {
        setFormData(prev => {
            const currentObjScopes = prev.permissions[objectKey] || [];
            let newObjScopes;

            if (currentObjScopes.includes(scopeId)) {
                newObjScopes = currentObjScopes.filter(id => id !== scopeId);
            } else {
                newObjScopes = [...currentObjScopes, scopeId];
            }

            // Cleanup empty arrays to keep data clean? Optional, but good for "is configured" checks
            const newPermissions = { ...prev.permissions };
            if (newObjScopes.length > 0) {
                newPermissions[objectKey] = newObjScopes;
            } else {
                delete newPermissions[objectKey];
            }

            return { ...prev, permissions: newPermissions };
        });
    };

    const handleSave = () => {
        if (!formData.name) return;
        // Validate at least one permission exists
        if (Object.keys(formData.permissions).length === 0) return;

        if (mode === 'create') {
            const newGroup = {
                id: `vg_${Date.now()}`,
                name: formData.name,
                description: formData.description,
                permissions: formData.permissions,
                rolesCount: 0,
                lastModified: new Date().toISOString().split('T')[0]
            };
            setGroups([...groups, newGroup]);
        } else {
            setGroups(groups.map(g => g.id === selectedGroup.id ? { ...g, ...formData, lastModified: new Date().toISOString().split('T')[0] } : g));
        }
        setMode('list');
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this Visibility Group?")) {
            setGroups(groups.filter(g => g.id !== id));
        }
    };

    const getSummary = (permissions) => {
        if (!permissions || Object.keys(permissions).length === 0) return 'No visibility defined';
        const count = Object.keys(permissions).length;
        if (count === OBJECTS.length) return 'All Objects Configured';
        return `${count} Object${count === 1 ? '' : 's'} Configured`;
    };

    const getObjectStatus = (objectKey) => {
        const scopes = formData.permissions[objectKey];
        if (!scopes || scopes.length === 0) return 'none';
        return 'configured';
    };

    return (
        <div className="flex flex-col relative bg-slate-50">
            {/* --- LIST MODE --- */}
            {mode === 'list' && (
                <>
                    <div className="flex justify-between items-center mb-6 shrink-0 px-8 pt-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Visibility Groups</h2>
                            <p className="text-sm text-slate-500">Define reusable, per-object visibility scopes.</p>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                        >
                            <Plus size={18} />
                            Create Visibility Group
                        </button>
                    </div>

                    <div className="px-8 pb-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groups.map(group => (
                                <div key={group.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg">
                                            <Eye size={22} />
                                        </div>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(group)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                title="Edit Details"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(group.id)}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-slate-800 text-lg mb-2">{group.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 flex-1 leading-relaxed">
                                        {group.description || "No description provided."}
                                    </p>

                                    <div className="mt-auto space-y-3 pt-4 border-t border-slate-100">
                                        <div className="flex flex-wrap gap-2">
                                            {/* Mini Object Badges */}
                                            {Object.keys(group.permissions || {}).slice(0, 3).map(objKey => {
                                                const objDef = OBJECTS.find(o => o.id === objKey);
                                                return (
                                                    <span key={objKey} className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold rounded border border-slate-200">
                                                        {objDef?.label || objKey}
                                                    </span>
                                                );
                                            })}
                                            {(Object.keys(group.permissions || {}).length > 3) && (
                                                <span className="px-2 py-1 bg-slate-50 text-slate-400 text-[10px] font-bold rounded border border-slate-200">
                                                    +{Object.keys(group.permissions || {}).length - 3} more
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-slate-500">
                                            <Shield size={12} />
                                            <span className="font-bold text-slate-700">{group.rolesCount}</span> roles assigned
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* --- CREATE / EDIT MODE --- */}
            {(mode === 'create' || mode === 'edit') && (
                <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in slide-in-from-bottom-4 duration-300">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-slate-900">
                                {mode === 'create' ? 'Create Visibility Group' : 'Edit Visibility Group'}
                            </h2>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden flex">
                        {/* LEFT SIDEBAR: Object List */}
                        <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col overflow-y-auto shrink-0">
                            <div className="p-6 pb-2">
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Configuration Scope</label>
                            </div>
                            <div className="flex-1 px-3 space-y-1">
                                {OBJECTS.map(obj => {
                                    const status = getObjectStatus(obj.id);
                                    const isActive = activeObject === obj.id;
                                    return (
                                        <button
                                            key={obj.id}
                                            onClick={() => setActiveObject(obj.id)}
                                            className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all group ${isActive ? 'bg-white shadow-sm border border-slate-200' : 'hover:bg-slate-100 border border-transparent'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`p-1.5 rounded ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                                    <obj.icon size={16} />
                                                </div>
                                                <span className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                                                    {obj.label}
                                                </span>
                                            </div>
                                            {status === 'configured' && (
                                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" title="Configured" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* RIGHT MAIN AREA: Form & Builder */}
                        <div className="flex-1 overflow-y-auto bg-white">
                            <div className="max-w-3xl mx-auto p-8 space-y-8">

                                {/* 1. General Info Block (Only show when top object selected? No, show always at top or separate tab? Let's keep it simple: Show top form, then object settings below) */}
                                {/* Actually, with the sidebar, maybe the sidebar should have a "General Settings" tab? */}
                                {/* For simplicity, I'll put General Info at the top of the content area, but maybe collapsed or smaller? */}
                                {/* BETTER: The sidebar navigates OBJECTS. General info is implicitly global. Let's make "General Info" the first item in sidebar? */}
                                {/* Trying a simpler approach: General Info is always visible at the top, scrollable. Object list below. */}
                                {/* But Object List is a sidebar. */}
                                {/* Okay, sticking to the Layout: Sidebar targets Objects. Detail view shows scopes. */}
                                {/* Where does Name/Desc go? Maybe a "General Settings" item in the sidebar is best. */}

                                {/* Let's add 'general' to objects list logic or handle it. */}
                                {/* Going to keep Name/Desc at the top of the detailed view for context, but standard inputs. */}

                                <div className="grid grid-cols-2 gap-6 p-6 bg-slate-50/50 rounded-xl border border-slate-100 mb-8">
                                    <div className="col-span-2">
                                        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                            <FileText size={18} className="text-slate-400" /> General Information
                                        </h3>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Group Name <span className="text-red-500">*</span></label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                            placeholder="e.g., Regional Management Access"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                        <input
                                            type="text"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm"
                                            placeholder="Optional description..."
                                        />
                                    </div>
                                </div>

                                {/* Object Scope Configuration */}
                                <div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
                                            {(() => {
                                                const Icon = OBJECTS.find(o => o.id === activeObject)?.icon || Globe;
                                                return <Icon size={24} />;
                                            })()}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">
                                                {OBJECTS.find(o => o.id === activeObject)?.label} Visibility
                                            </h3>
                                            <p className="text-slate-500 text-sm">Define what users can see for this object.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {SCOPE_DEFINITIONS.map(scope => {
                                            const isSelected = (formData.permissions[activeObject] || []).includes(scope.id);
                                            return (
                                                <button
                                                    key={scope.id}
                                                    onClick={() => toggleScope(activeObject, scope.id)}
                                                    className={`
                                                        w-full relative p-4 rounded-xl border text-left transition-all flex items-start gap-4
                                                        ${isSelected
                                                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                                                            : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'}
                                                    `}
                                                >
                                                    <div className={`
                                                        p-2 rounded-lg shrink-0 transition-colors
                                                        ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}
                                                    `}>
                                                        <scope.icon size={20} />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`font-bold ${isSelected ? 'text-blue-900' : 'text-slate-700'}`}>{scope.label}</span>
                                                            {scope.warning && (
                                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase rounded border border-amber-200">
                                                                    {scope.warning}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-slate-500">{scope.description}</p>
                                                    </div>

                                                    <div className={`
                                                        w-6 h-6 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-colors
                                                        ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300'}
                                                    `}>
                                                        {isSelected && <Check size={14} className="text-white" />}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
                        {/* Validation Error Message */}
                        {Object.keys(formData.permissions).length === 0 ? (
                            <div className="text-red-600 text-sm font-medium flex items-center gap-2">
                                <Info size={16} /> Configure at least one object.
                            </div>
                        ) : (
                            <div className="text-slate-500 text-sm font-medium">
                                {Object.keys(formData.permissions).length} objects configured
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => setMode('list')}
                                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!formData.name || Object.keys(formData.permissions).length === 0}
                                className="px-8 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                            >
                                Save Visibility Group
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisibilityGroupsTab;
