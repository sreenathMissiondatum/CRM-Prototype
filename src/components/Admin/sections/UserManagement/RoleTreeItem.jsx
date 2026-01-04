import React from 'react';
import { Shield, ChevronDown, ChevronRight, Plus, Users, Edit2 } from 'lucide-react';

const RoleTreeItem = ({
    role,
    depth = 0,
    expandedRoles = [], // Default to empty array
    selectedRole,
    onToggleExpand,
    onSelectRole,
    onAddChild,
    onEditRole,
    readOnly = false // New prop to support read-only view mode
}) => {
    if (!role) return null; // Safety check

    const isExpanded = expandedRoles?.includes ? expandedRoles.includes(role.id) : false; // Safe access
    const hasChildren = Array.isArray(role.children) && role.children.length > 0;
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
                onClick={() => onSelectRole && onSelectRole(role)}
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
                        <span className="flex items-center gap-0.5"><Users size={10} /> {role.members || 0}</span>
                        <span>•</span>
                        <span>Level {role.level}</span>
                    </div>
                </div>

                {/* Hover Actions - Only if not readOnly */}
                {!readOnly && (
                    <div className="hidden group-hover:flex items-center gap-1 ml-2">
                        {onAddChild && (
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
                        )}
                        {onEditRole && (
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
                        )}
                    </div>
                )}
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
                            readOnly={readOnly}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default RoleTreeItem;
