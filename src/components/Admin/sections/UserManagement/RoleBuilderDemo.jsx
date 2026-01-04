import React, { useState, useEffect } from 'react';
import {
    MonitorPlay,
    X,
    Plus,
    Trash2,
    Edit2,
    Users,
    Shield,
    ChevronRight,
    ChevronDown,
    Layout,
    Check,
    AlertTriangle,
    Save,
    FolderOpen,
    ArrowLeft,
    Clock,
    FileText,
    Eye
} from 'lucide-react';
import RoleTreeItem from './RoleTreeItem'; // Shared component for View Mode

// --- Helper Component Moved Outside ---
const DesignTreeItem = ({ role, depth = 0, selectedRoleId, expandedRoles, onToggleExpand, onSelectRole }) => {
    const isSelected = selectedRoleId === role.id;
    const isExpanded = expandedRoles.includes(role.id);
    const hasChildren = role.children && role.children.length > 0;

    return (
        <div className="relative">
            {depth > 0 && (
                <div className="absolute left-[11px] top-0 bottom-0 border-l border-slate-200 -z-10"
                    style={{ height: 'calc(100% + 10px)' }}
                />
            )}

            <div
                className={`flex items-center p-2 rounded-lg cursor-pointer transition-all mb-1
                    ${isSelected ? 'bg-indigo-50 border border-indigo-200 shadow-sm' : 'hover:bg-slate-50 border border-transparent'}
                `}
                style={{ marginLeft: `${depth * 20}px` }}
                onClick={() => onSelectRole(role.id)}
            >
                <button
                    onClick={(e) => { e.stopPropagation(); onToggleExpand(role.id); }}
                    className={`w-5 h-5 flex items-center justify-center mr-1 rounded hover:bg-black/5 text-slate-400 ${!hasChildren ? 'invisible' : ''}`}
                >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                <div className={`mr-3 p-1.5 rounded-md ${isSelected ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}>
                    <Shield size={14} />
                </div>

                <div className="flex-1">
                    <div className={`text-sm font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {role.name || "Untitled Role"}
                    </div>
                    <div className="text-[10px] text-slate-400">Level {role.level}</div>
                </div>
            </div>

            {isExpanded && role.children && (
                <div className="ml-4 pl-2 border-l border-slate-100">
                    {role.children.map(child => (
                        <DesignTreeItem
                            key={child.id}
                            role={child}
                            depth={depth + 1}
                            selectedRoleId={selectedRoleId}
                            expandedRoles={expandedRoles}
                            onToggleExpand={onToggleExpand}
                            onSelectRole={onSelectRole}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const RoleBuilderDemo = ({ onExit }) => {
    // --- State ---
    const [mode, setMode] = useState('DESIGN'); // 'DESIGN' | 'LIST_SAVED' | 'VIEW_SAVED'

    // Design Data
    const [demoRoles, setDemoRoles] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState(null);
    const [expandedRoles, setExpandedRoles] = useState([]);

    // Persistence Data
    const [savedDrafts, setSavedDrafts] = useState([]);
    const [viewingDraft, setViewingDraft] = useState(null);

    // --- Effects ---
    useEffect(() => {
        // Load drafts from local storage on mount
        try {
            const stored = localStorage.getItem('crm_role_drafts');
            if (stored) {
                setSavedDrafts(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load drafts", e);
        }
    }, []);

    // --- Helpers ---

    const findNode = (nodes, id) => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findNode(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const getSelectedRole = () => selectedRoleId ? findNode(demoRoles, selectedRoleId) : null;

    const updateRoleRecursive = (nodes, id, updates) => {
        return nodes.map(node => {
            if (node.id === id) {
                return { ...node, ...updates };
            }
            if (node.children) {
                return { ...node, children: updateRoleRecursive(node.children, id, updates) };
            }
            return node;
        });
    };

    const addChildRecursive = (nodes, parentId, newChild) => {
        return nodes.map(node => {
            if (node.id === parentId) {
                return { ...node, children: [...(node.children || []), newChild] };
            }
            if (node.children) {
                return { ...node, children: addChildRecursive(node.children, parentId, newChild) };
            }
            return node;
        });
    };

    const deleteRecursive = (nodes, idToDelete) => {
        return nodes
            .filter(node => node.id !== idToDelete)
            .map(node => ({
                ...node,
                children: node.children ? deleteRecursive(node.children, idToDelete) : []
            }));
    };

    const countNodes = (nodes) => {
        let count = 0;
        nodes.forEach(n => {
            count++;
            if (n.children) count += countNodes(n.children);
        });
        return count;
    };


    // --- Actions: Design Mode ---

    const handleCreateFirstRole = () => {
        const newRole = {
            id: `role_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name: 'Root Role',
            description: '',
            level: 1,
            members: 0,
            children: []
        };
        setDemoRoles([newRole]);
        setSelectedRoleId(newRole.id);
    };

    const handleAddChild = () => {
        const parent = getSelectedRole();
        if (!parent) return;

        const newRole = {
            id: `role_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            name: 'New Child Role',
            description: '',
            level: parent.level + 1,
            members: 0,
            children: []
        };

        setDemoRoles(prev => addChildRecursive(prev, parent.id, newRole));
        setExpandedRoles(prev => prev.includes(parent.id) ? prev : [...prev, parent.id]);
        setSelectedRoleId(newRole.id);
    };

    const handleUpdateRole = (updates) => {
        if (!selectedRoleId) return;
        setDemoRoles(prev => updateRoleRecursive(prev, selectedRoleId, updates));
    };

    const handleDeleteRole = () => {
        if (!selectedRoleId) return;
        setDemoRoles(prev => deleteRecursive(prev, selectedRoleId));
        setSelectedRoleId(null);
    };

    const toggleExpand = (id) => {
        setExpandedRoles(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    // --- Actions: Persistence ---

    const handleSaveDraft = () => {
        if (demoRoles.length === 0) {
            alert("Cannot save an empty hierarchy.");
            return;
        }

        const name = prompt("Enter a name for this hierarchy draft:", `Draft ${savedDrafts.length + 1}`);
        if (!name) return;

        const newDraft = {
            id: `draft_${Date.now()}`,
            name,
            createdAt: new Date().toISOString(),
            roles: demoRoles,
            nodeCount: countNodes(demoRoles)
        };

        const updatedDrafts = [newDraft, ...savedDrafts];
        setSavedDrafts(updatedDrafts);
        localStorage.setItem('crm_role_drafts', JSON.stringify(updatedDrafts));
        alert("Hierarchy saved successfully!");
    };


    const handleDeleteDraft = (id) => {
        if (!window.confirm("Delete this draft?")) return;
        const updated = savedDrafts.filter(d => d.id !== id);
        setSavedDrafts(updated);
        localStorage.setItem('crm_role_drafts', JSON.stringify(updated));
    };

    const handleOpenDraft = (draft) => {
        // DEBUGGING CRASH:
        console.log("Opening draft:", draft);

        // 1. Just verify specific fields first
        if (!draft || !draft.roles) {
            alert("Invalid Draft Data");
            return;
        }

        // 2. Set viewing draft
        setViewingDraft(draft);

        // 3. Switch Mode
        setMode('VIEW_SAVED');
    };

    // --- Header Banner Helper ---
    const renderBanner = () => {
        if (mode === 'VIEW_SAVED') {
            return (
                <div className="bg-emerald-900 text-white px-6 py-3 shadow-md flex justify-between items-center shrink-0 z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                            <Eye size={20} className="text-emerald-200" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg leading-tight">Viewing Saved Draft: {viewingDraft?.name || 'Unknown'}</h1>
                            <p className="text-xs text-emerald-200 opacity-80">Read-only view of a saved hierarchy design.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setMode('LIST_SAVED')}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-white/10"
                    >
                        <ArrowLeft size={16} /> Back to Saved Drafts
                    </button>
                </div>
            )
        }

        // Default or List Mode Banner
        return (
            <div className="bg-indigo-900 text-white px-6 py-3 shadow-md flex justify-between items-center shrink-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                        <MonitorPlay size={20} className="text-indigo-200" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Role Builder (Demo Mode)</h1>
                        <p className="text-xs text-indigo-200 opacity-80">
                            {mode === 'LIST_SAVED' ? 'Manage your saved hierarchy drafts.' : 'Design hierarchies safely. Changes are not saved to production.'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {mode === 'DESIGN' && (
                        <>
                            <button
                                onClick={handleSaveDraft}
                                disabled={demoRoles.length === 0}
                                className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-bold border border-indigo-500 shadow-sm"
                            >
                                <Save size={16} /> Save Draft
                            </button>
                            <button
                                onClick={() => setMode('LIST_SAVED')}
                                className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-white/10"
                            >
                                <FolderOpen size={16} /> Saved Drafts
                            </button>
                        </>
                    )}
                    {mode === 'LIST_SAVED' && (
                        <button
                            onClick={() => setMode('DESIGN')}
                            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-white/10"
                        >
                            <ArrowLeft size={16} /> Back to Designer
                        </button>
                    )}
                    <div className="h-6 w-px bg-white/20 mx-1"></div>
                    <button
                        onClick={onExit}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium border border-white/10"
                    >
                        <X size={16} /> Exit
                    </button>
                </div>
            </div>
        )
    };

    // --- MAIN RENDER ---
    return (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col h-screen w-screen overflow-hidden animate-in fade-in duration-300">
            {renderBanner()}

            <div className="flex-1 flex overflow-hidden">

                {/* === MODE: LIST SAVED === */}
                {mode === 'LIST_SAVED' && (
                    <div className="flex-1 overflow-y-auto p-12">
                        <div className="max-w-5xl mx-auto">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                <FolderOpen className="text-indigo-600" /> Saved Hierarchy Drafts
                            </h2>

                            {savedDrafts.length === 0 ? (
                                <div className="p-12 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200">
                                    <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                        <FolderOpen size={32} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-700">No saved drafts yet</h3>
                                    <p className="text-slate-500 mt-1 mb-6">Create a hierarchy in the designer and save it to see it here.</p>
                                    <button onClick={() => setMode('DESIGN')} className="text-indigo-600 font-bold hover:underline">Go to Designer</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedDrafts.map(draft => (
                                        <div key={draft.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                                    <FileText size={24} />
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteDraft(draft.id); }}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-lg mb-1">{draft.name}</h3>
                                            <div className="text-xs text-slate-400 flex items-center gap-4 mb-6">
                                                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(draft.createdAt).toLocaleDateString()}</span>
                                                <span className="flex items-center gap-1"><Shield size={12} /> {draft.nodeCount} Roles</span>
                                            </div>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleOpenDraft(draft)}
                                                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-sm transition-colors"
                                                >
                                                    View Hierarchy
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}


                {/* === MODE: VIEW SAVED (READ ONLY) === */}
                {mode === 'VIEW_SAVED' && (
                    <div className="flex-1 flex overflow-hidden bg-slate-100 p-8 justify-center">
                        <div className="w-[800px] bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col overflow-hidden h-full max-h-[90vh]">
                            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900">{viewingDraft?.name}</h3>
                                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold mt-1">
                                        Read-Only Preview • {viewingDraft?.nodeCount} Roles
                                    </p>
                                </div>
                                <div className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">
                                    SAVED DRAFT
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6">
                                {viewingDraft?.roles?.map(role => (
                                    <RoleTreeItem
                                        key={role.id}
                                        role={role}
                                        expandedRoles={expandedRoles}
                                        selectedRole={null}
                                        onToggleExpand={toggleExpand}
                                        onSelectRole={() => { }}
                                        onAddChild={() => { }}
                                        onEditRole={() => { }}
                                        readOnly={true}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}


                {/* === MODE: DESIGN (DEFAULT) === */}
                {mode === 'DESIGN' && (
                    <>
                        {/* --- CANVAS / TREE (Left) --- */}
                        <div className="w-[400px] flex-none bg-white border-r border-slate-200 flex flex-col shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] z-0">
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Hierarchy Canvas</h2>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4">
                                {demoRoles.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                                            <Layout size={32} className="text-slate-300" />
                                        </div>
                                        <h3 className="text-slate-900 font-bold mb-2">No roles defined yet</h3>
                                        <p className="text-slate-500 text-sm mb-6 max-w-[200px]">Start by creating your first role to define the organization structure.</p>
                                        <button
                                            onClick={handleCreateFirstRole}
                                            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm shadow-indigo-200 transition-all font-medium flex items-center gap-2"
                                        >
                                            <Plus size={18} /> Create First Role
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-1 pb-20">
                                        {demoRoles.map(role => (
                                            <DesignTreeItem
                                                key={role.id}
                                                role={role}
                                                selectedRoleId={selectedRoleId}
                                                expandedRoles={expandedRoles}
                                                onToggleExpand={toggleExpand}
                                                onSelectRole={setSelectedRoleId}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* --- PROPERTIES PANEL (Right) --- */}
                        <div className="flex-1 bg-slate-50/50 flex flex-col items-center justify-center p-8 overflow-y-auto">
                            {selectedRoleId && getSelectedRole() ? (
                                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-in slide-in-from-right-4 duration-300">
                                    {/* Panel Header */}
                                    <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900 mb-1">Edit Role</h2>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">Level {getSelectedRole().level}</span>
                                                {getSelectedRole().id.includes('role_') && <span className="text-orange-500 text-xs flex items-center gap-1"><AlertTriangle size={10} /> Unsaved Draft</span>}
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleDeleteRole}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Role"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Form Fields */}
                                    <div className="p-8 space-y-6">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Role Name</label>
                                            <input
                                                type="text"
                                                value={getSelectedRole().name}
                                                onChange={(e) => handleUpdateRole({ name: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
                                                placeholder="e.g. Sales Manager"
                                                autoFocus
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                                            <textarea
                                                value={getSelectedRole().description}
                                                onChange={(e) => handleUpdateRole({ description: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 h-32 resize-none"
                                                placeholder="Describe the role's responsibilities..."
                                            />
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="pt-6 border-t border-slate-100">
                                            <button
                                                onClick={handleAddChild}
                                                className="w-full py-3 bg-white border-2 border-dashed border-slate-300 hover:border-indigo-400 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-xl transition-all flex items-center justify-center gap-2 font-medium group"
                                            >
                                                <div className="p-1 bg-slate-200 group-hover:bg-indigo-200 rounded-full transition-colors text-white">
                                                    <Plus size={14} />
                                                </div>
                                                Add Child Role under "{getSelectedRole().name || 'this role'}"
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Empty Selection State
                                <div className="text-center max-w-sm opacity-50">
                                    {demoRoles.length > 0 ? (
                                        <>
                                            <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                                                <Edit2 size={24} />
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-lg mb-2">Select a Role</h3>
                                            <p className="text-slate-500">Click on any role in the hierarchy to edit its details or add child roles.</p>
                                        </>
                                    ) : (
                                        <div className="hidden">Waiting for role creation...</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RoleBuilderDemo;
