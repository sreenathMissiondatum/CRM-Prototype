import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AddUser from '../AddUser';
import UserEdit from './UserEdit';
import {
    Search, Plus, MoreHorizontal, Shield, Mail, CheckCircle, XCircle,
    Filter, LayoutGrid, ArrowUpDown, Lock, Eye, Trash2, UserCog, Copy,
    ArrowUp, ArrowDown, X, Check, GripVertical
} from 'lucide-react';
import StageScroll from '../../../Shared/StageScroll';
import Pagination from '../../../Shared/Pagination';

const UsersTab = () => {
    // Mock Data (Enhanced with Frozen and Invited statuses)
    const [users, setUsers] = useState([
        { id: 1, name: 'Alex Morgan', email: 'alex@acmelending.com', role: 'Admin', status: 'Active', lastActive: '2 min ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150', department: 'Executive', location: 'New York, NY', phone: '(212) 555-0123' },
        { id: 2, name: 'Sarah Connor', email: 'sarah@acmelending.com', role: 'Loan Officer', status: 'Active', lastActive: '1 hr ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150', department: 'Sales', location: 'Austin, TX', phone: '(512) 555-0199' },
        { id: 3, name: 'James Wright', email: 'james@acmelending.com', role: 'Underwriter', status: 'Active', lastActive: '4 hrs ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150', department: 'Risk', location: 'Chicago, IL', phone: '(312) 555-0144' },
        { id: 4, name: 'Emily Chen', email: 'emily@acmelending.com', role: 'Processor', status: 'Inactive', lastActive: '2 days ago', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150', department: 'Operations', location: 'San Francisco, CA', phone: '(415) 555-0177' },
        { id: 5, name: 'Michael Ross', email: 'mike@acmelending.com', role: 'Loan Officer', status: 'Active', lastActive: '10 min ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150', department: 'Sales', location: 'New York, NY', phone: '(212) 555-0188' },
        { id: 6, name: 'David Miller', email: 'david@acmelending.com', role: 'Loan Officer', status: 'Active', lastActive: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150', department: 'Sales', location: 'Miami, FL', phone: '(305) 555-0155' },
        { id: 7, name: 'Elena Fisher', email: 'elena@acmelending.com', role: 'Admin', status: 'Active', lastActive: 'Today', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150', department: 'IT', location: 'Remote', phone: '(206) 555-0122' },
        // New Mock Data for Testing
        { id: 8, name: 'Frozen Account', email: 'frozen@acmelending.com', role: 'Loan Officer', status: 'Frozen', lastActive: '1 week ago', avatar: 'FA', department: 'Sales', location: 'Denver, CO', phone: '(303) 555-0100' },
        { id: 9, name: 'Invited User', email: 'newhire@acmelending.com', role: 'Processor', status: 'Invited', lastActive: 'Pending', avatar: 'IU', department: 'Operations', location: 'Seattle, WA', phone: '(206) 555-0999' },
    ]);

    // View State: 'list' | 'add' | 'edit_user'
    const [currentView, setCurrentView] = useState('list');
    const [editingUser, setEditingUser] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    const [activeStatus, setActiveStatus] = useState('All');
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [activeRowMenu, setActiveRowMenu] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

    // New Feature State
    const [isColumnEditorOpen, setIsColumnEditorOpen] = useState(false);
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({ roles: [], departments: [] });

    // Dynamic Columns State
    const [columns, setColumns] = useState([
        { id: 'select', label: '', visible: true, width: '40px', fixed: true },
        { id: 'user', label: 'User', visible: true, width: 'minmax(240px, 3fr)' },
        { id: 'role', label: 'Role', visible: true, width: 'minmax(140px, 1.5fr)' },
        { id: 'status', label: 'Status', visible: true, width: 'minmax(120px, 1fr)' },
        { id: 'department', label: 'Department', visible: false, width: 'minmax(120px, 1fr)' },
        { id: 'location', label: 'Location', visible: false, width: 'minmax(120px, 1fr)' },
        { id: 'lastActive', label: 'Last Activity', visible: true, width: 'minmax(150px, 1.5fr)' },
        { id: 'actions', label: 'Actions', visible: true, width: '120px', fixed: true }
    ]);

    const statuses = ['All', 'Active', 'Inactive', 'Frozen', 'Invited'];
    const statusCounts = {
        'All': users.length,
        'Active': users.filter(u => u.status === 'Active').length,
        'Inactive': users.filter(u => u.status === 'Inactive').length,
        'Frozen': users.filter(u => u.status === 'Frozen').length,
        'Invited': users.filter(u => u.status === 'Invited').length
    };

    // Toast Logic
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // Search Debounce Logic
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300); // 300ms debounce
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Filter Logic
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            // Status Tab Filter
            if (activeStatus !== 'All' && user.status !== activeStatus) return false;

            // Search Filter (Data Grid Scope: Name, Email, Role, Status)
            if (debouncedSearchQuery) {
                const terms = debouncedSearchQuery.toLowerCase().split(' ').filter(t => t.trim() !== '');
                // All terms must match at least one of the searchable fields (AND logic for terms)
                const matches = terms.every(term => {
                    return (
                        (user.name && user.name.toLowerCase().includes(term)) ||
                        (user.email && user.email.toLowerCase().includes(term)) ||
                        (user.role && user.role.toLowerCase().includes(term)) ||
                        (user.status && user.status.toLowerCase().includes(term))
                    );
                });
                if (!matches) return false;
            }

            // Advanced Filters
            if (activeFilters.roles.length > 0 && !activeFilters.roles.includes(user.role)) return false;
            if (activeFilters.departments.length > 0 && !activeFilters.departments.includes(user.department)) return false;

            return true;
        });
    }, [users, activeStatus, debouncedSearchQuery, activeFilters]);

    // Handlers
    const handleSaveNewUser = (user, sendInvite) => {
        setUsers(prev => [{ id: Math.max(...prev.map(u => u.id)) + 1, ...user }, ...prev]);
        setToastMessage(`User ${user.name} created successfully. Activation pending.`);
        setCurrentView('list');
    };

    const handleUpdateUser = (updatedUser) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        setToastMessage(`User ${updatedUser.name} updated successfully.`);
        setEditingUser(null);
        setCurrentView('list');
    };

    const handleStatusToggle = (id, e) => {
        e?.stopPropagation();
        setUsers(users.map(u =>
            u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
        ));
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(filteredUsers.map(u => u.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const toggleSelectRow = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleUpdateColumns = (newColumns) => {
        // Ensure fixed columns
        const finalCols = newColumns.map(c => ({
            ...c,
            fixed: c.id === 'select' || c.id === 'actions'
        }));
        setColumns(finalCols);
        setIsColumnEditorOpen(false);
    };

    const toggleColumnVisibility = (colId) => {
        setColumns(columns.map(col =>
            col.id === colId ? { ...col, visible: !col.visible } : col
        ));
    };

    // Derived Grid Columns
    const gridTemplateColumns = columns.filter(c => c.visible).map(c => c.width).join(' ');

    // --- RENDER ADD USER VIEW ---
    if (currentView === 'add') {
        return (
            <AddUser
                onSave={handleSaveNewUser}
                onCancel={() => setCurrentView('list')}
                existingUsers={users}
            />
        );
    }

    if (currentView === 'edit_user' && editingUser) {
        return (
            <UserEdit
                user={editingUser}
                existingUsers={users}
                onSave={handleUpdateUser}
                onCancel={() => { setCurrentView('list'); setEditingUser(null); }}
            />
        );
    }

    // --- RENDER LIST VIEW ---
    return (
        <div className="flex flex-col relative px-6 pb-6">
            {/* Toast Notification */}
            {toastMessage && createPortal(
                <div className="fixed bottom-6 right-6 z-[100] bg-slate-900/90 text-white px-4 py-3 rounded-lg shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3">
                    <CheckCircle size={20} className="text-emerald-400" />
                    <span className="font-medium text-sm">{toastMessage}</span>
                    <button onClick={() => setToastMessage(null)} className="ml-2 text-slate-400 hover:text-white"><X size={16} /></button>
                </div>,
                document.body
            )}

            <div className="flex justify-between items-center mb-4">
                {/* Header Removed - managed by parent */}
                <div />
                <button
                    onClick={() => setCurrentView('add')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            {/* Main Card Container */}
            <div className="flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm relative">
                <div className="flex-none p-3 border-b border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                    <div className="flex bg-slate-100/50 p-1 rounded-lg border border-slate-200/50 w-full xl:w-auto overflow-x-auto">
                        <StageScroll
                            items={statuses}
                            activeItem={activeStatus}
                            onSelect={setActiveStatus}
                            counts={statusCounts}
                        />
                    </div>

                    <div className="flex gap-2 shrink-0 w-full xl:w-auto">
                        <div className="relative flex-1 xl:flex-none">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by name, email, or role..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full xl:w-64 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                            <ArrowUpDown size={16} />
                            <span>Last Activity</span>
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)}
                                className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors shadow-sm ${isColumnMenuOpen ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                            {/* Quick Column Toggle Menu */}
                            {isColumnMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsColumnMenuOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-50 py-2 animate-in fade-in slide-in-from-top-2">
                                        <div className="max-h-64 overflow-y-auto">
                                            {columns.filter(c => !c.fixed).map(col => (
                                                <button
                                                    key={col.id}
                                                    onClick={() => toggleColumnVisibility(col.id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between group"
                                                >
                                                    <span>{col.label}</span>
                                                    {col.visible && <Check size={14} className="text-blue-600" />}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="h-px bg-slate-100 my-1"></div>
                                        <button
                                            onClick={() => {
                                                setIsColumnMenuOpen(false);
                                                setIsColumnEditorOpen(true);
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 flex items-center justify-center gap-2"
                                        >
                                            <Plus size={14} /> Add Columns
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className={`px-3 py-1.5 border rounded-lg text-sm font-medium transition-colors shadow-sm ${isFilterOpen || (activeFilters.roles.length > 0 || activeFilters.departments.length > 0) ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                <Filter size={16} />
                            </button>
                            {/* Filter Popover */}
                            {isFilterOpen && (
                                <>
                                    <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-4 animate-in fade-in slide-in-from-top-2">
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="font-bold text-slate-700 text-sm">Filters</h3>
                                            <button
                                                onClick={() => setActiveFilters({ roles: [], departments: [] })}
                                                className="text-[10px] uppercase font-bold text-blue-600 hover:text-blue-700"
                                            >
                                                Reset
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Role</label>
                                                <div className="space-y-1.5">
                                                    {['Admin', 'Loan Officer', 'Underwriter', 'Processor'].map(role => (
                                                        <label key={role} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900">
                                                            <input
                                                                type="checkbox"
                                                                checked={activeFilters.roles.includes(role)}
                                                                onChange={(e) => {
                                                                    const newRoles = e.target.checked
                                                                        ? [...activeFilters.roles, role]
                                                                        : activeFilters.roles.filter(r => r !== role);
                                                                    setActiveFilters({ ...activeFilters, roles: newRoles });
                                                                }}
                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            {role}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Department</label>
                                                <div className="space-y-1.5">
                                                    {['Sales', 'Operations', 'Risk', 'Executive', 'IT'].map(dept => (
                                                        <label key={dept} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900">
                                                            <input
                                                                type="checkbox"
                                                                checked={activeFilters.departments.includes(dept)}
                                                                onChange={(e) => {
                                                                    const newDepts = e.target.checked
                                                                        ? [...activeFilters.departments, dept]
                                                                        : activeFilters.departments.filter(d => d !== dept);
                                                                    setActiveFilters({ ...activeFilters, departments: newDepts });
                                                                }}
                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            {dept}
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* 2. TABLE HEADER */}
                <div className="flex flex-col flex-1 min-h-0 bg-white relative">
                    <div
                        className="grid gap-4 px-6 py-3 bg-white border-b border-l-4 border-transparent border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider items-center sticky top-0 z-10 shadow-sm"
                        style={{ gridTemplateColumns }}
                    >
                        {columns.filter(c => c.visible).map(col => {
                            if (col.id === 'select') {
                                return (
                                    <div key={col.id}>
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            onChange={toggleSelectAll}
                                            checked={filteredUsers.length > 0 && selectedIds.size === filteredUsers.length}
                                        />
                                    </div>
                                );
                            }
                            return <div key={col.id} className={col.id === 'actions' ? 'text-right' : ''}>{col.label}</div>
                        })}
                    </div>

                    {/* 3. ROWS SCROLL AREA */}
                    <div className="min-h-0">
                        <div className="divide-y divide-slate-100">
                            {filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map(user => {
                                const isSelected = selectedIds.has(user.id);
                                return (
                                    <div
                                        key={user.id}
                                        className={`group hover:bg-blue-50/30 transition-all cursor-pointer relative ${isSelected ? 'bg-blue-50/40' : ''}`}
                                        onClick={() => {/* Navigate */ }}
                                    >
                                        <div
                                            className={`grid gap-4 px-6 py-4 items-center border-l-4 hover:border-blue-200 transition-colors ${isSelected ? 'border-l-blue-500' : 'border-transparent'}`}
                                            style={{ gridTemplateColumns }}
                                        >
                                            {columns.filter(c => c.visible).map(col => {
                                                if (col.id === 'select') {
                                                    return (
                                                        <div key={col.id} onClick={e => e.stopPropagation()}>
                                                            <input
                                                                type="checkbox"
                                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                checked={isSelected}
                                                                onChange={() => toggleSelectRow(user.id)}
                                                            />
                                                        </div>
                                                    );
                                                }
                                                if (col.id === 'user') {
                                                    return (
                                                        <div key={col.id} className="flex items-center gap-3 min-w-0">
                                                            <div className="w-9 h-9 shrink-0 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs ring-2 ring-transparent group-hover:ring-blue-100 transition-all overflow-hidden">
                                                                {user.avatar.startsWith('http') ? (
                                                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    user.avatar
                                                                )}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className={`font-bold text-sm truncate transition-colors ${isSelected ? 'text-blue-700' : 'text-slate-700 group-hover:text-blue-700'}`}>{user.name}</div>
                                                                <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1 truncate">
                                                                    <Mail size={10} /> {user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (col.id === 'role') {
                                                    return (
                                                        <div key={col.id}>
                                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                                user.role === 'Loan Officer' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                    'bg-indigo-50 text-indigo-700 border-indigo-100'
                                                                }`}>
                                                                <Shield size={10} className="mr-1.5" />
                                                                {user.role}
                                                            </span>
                                                        </div>
                                                    );
                                                }
                                                if (col.id === 'status') {
                                                    return (
                                                        <div key={col.id} onClick={e => e.stopPropagation()}>
                                                            <button
                                                                onClick={(e) => handleStatusToggle(user.id, e)}
                                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all ${user.status === 'Active'
                                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100'
                                                                    : user.status === 'Frozen'
                                                                        ? 'bg-cyan-50 text-cyan-700 border-cyan-100 hover:bg-cyan-100'
                                                                        : user.status === 'Invited'
                                                                            ? 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                                                                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                                                    }`}
                                                            >
                                                                {user.status === 'Active' && <CheckCircle size={10} className="mr-1.5" />}
                                                                {user.status === 'Frozen' && <Lock size={10} className="mr-1.5" />}
                                                                {user.status === 'Inactive' && <XCircle size={10} className="mr-1.5" />}
                                                                {user.status === 'Invited' && <Mail size={10} className="mr-1.5" />}
                                                                {user.status}
                                                            </button>
                                                        </div>
                                                    );
                                                }
                                                if (col.id === 'department' || col.id === 'location') {
                                                    return <div key={col.id} className="text-sm text-slate-600">{user[col.id]}</div>;
                                                }
                                                if (col.id === 'lastActive') {
                                                    return (
                                                        <div key={col.id} className="text-xs text-slate-500 flex items-center gap-1.5">
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                                                            {user.lastActive}
                                                        </div>
                                                    );
                                                }
                                                if (col.id === 'actions') {
                                                    return (
                                                        <div key={col.id} className="flex items-center justify-end gap-1 relative" onClick={e => e.stopPropagation()}>
                                                            <button className="hidden xl:flex p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                                <Mail size={16} />
                                                            </button>

                                                            <button
                                                                onClick={() => setActiveRowMenu(activeRowMenu === user.id ? null : user.id)}
                                                                className={`p-1.5 rounded-lg transition-colors ${activeRowMenu === user.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                                                            >
                                                                <MoreHorizontal size={16} />
                                                            </button>

                                                            {activeRowMenu === user.id && (
                                                                <>
                                                                    <div className="fixed inset-0 z-40 cursor-default" onClick={() => setActiveRowMenu(null)}></div>
                                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                                                                        <div className="flex flex-col gap-0.5">
                                                                            <button onClick={() => setActiveRowMenu(null)} className="w-full text-left px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2">
                                                                                <Eye size={13} className="text-slate-400" /> View Details
                                                                            </button>
                                                                            <button onClick={() => { setActiveRowMenu(null); setEditingUser(user); setCurrentView('edit_user'); }} className="w-full text-left px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2">
                                                                                <UserCog size={13} className="text-slate-400" /> Edit User
                                                                            </button>
                                                                            <button onClick={() => setActiveRowMenu(null)} className="w-full text-left px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2">
                                                                                <Copy size={13} className="text-slate-400" /> Clone User
                                                                            </button>
                                                                            <button onClick={() => setActiveRowMenu(null)} className="w-full text-left px-2 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2">
                                                                                <Shield size={13} className="text-slate-400" /> Change Role
                                                                            </button>
                                                                            <div className="h-px bg-slate-100 my-1"></div>
                                                                            <button onClick={() => setActiveRowMenu(null)} className="w-full text-left px-2 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded flex items-center gap-2">
                                                                                <Trash2 size={13} className="text-red-400 group-hover:text-red-600" /> Delete User
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* 4. PAGINATION FOOTER */}
                    <div className="flex-none bg-white border-t border-slate-200 pt-4">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredUsers.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                </div>
            </div>

            {/* Column Manager Modal */}
            <ColumnEditorModal
                isOpen={isColumnEditorOpen}
                onClose={() => setIsColumnEditorOpen(false)}
                currentColumns={columns}
                onSave={handleUpdateColumns}
            />
        </div>
    );
};

// --- Column Manager Modal Component ---
const ColumnEditorModal = ({ isOpen, onClose, currentColumns, onSave }) => {
    if (!isOpen) return null;

    // Available fields mock
    const [availableFields] = useState([
        { id: 'user', label: 'User Name', category: 'Identity' },
        { id: 'role', label: 'Role / Permission', category: 'Access' },
        { id: 'status', label: 'Account Status', category: 'System' },
        { id: 'department', label: 'Department', category: 'Organization' },
        { id: 'location', label: 'Office Location', category: 'Organization' },
        { id: 'lastActive', label: 'Last Active Time', category: 'System' },
    ]);

    // Local state for mainpulation before save
    const [activeCols, setActiveCols] = useState(currentColumns);
    const [searchQuery, setSearchQuery] = useState('');

    // Sync state when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveCols(currentColumns);
        }
    }, [isOpen, currentColumns]);

    // Check for changes to highlight
    const isDirty = (col) => {
        const originalIndex = currentColumns.findIndex(c => c.id === col.id);
        const currentIndex = activeCols.findIndex(c => c.id === col.id);
        if (originalIndex === -1) return 'new';
        if (originalIndex !== currentIndex) return 'moved';
        return null;
    };

    const visibleCount = activeCols.filter(c => c.id !== 'select').length;
    const MAX_COLUMNS = 6; // Adjusted for User Management
    const isAtLimit = visibleCount >= MAX_COLUMNS;

    const toggleAvailability = (field) => {
        const existing = activeCols.find(c => c.id === field.id);
        if (existing) {
            if (existing.fixed) return;
            setActiveCols(activeCols.filter(c => c.id !== field.id));
        } else {
            if (isAtLimit) return;
            const widths = { 'user': 'minmax(240px, 3fr)', 'role': 'minmax(140px, 1.5fr)', 'status': 'minmax(120px, 1fr)', 'department': 'minmax(120px, 1fr)', 'location': 'minmax(120px, 1fr)', 'lastActive': 'minmax(150px, 1.5fr)' };
            setActiveCols([...activeCols, { id: field.id, label: field.label, visible: true, width: widths[field.id] || '1fr' }]);
        }
    };

    const removeCol = (id) => {
        if (activeCols.find(c => c.id === id)?.fixed) return;
        setActiveCols(activeCols.filter(c => c.id !== id));
    };

    const moveCol = (index, direction) => {
        const newCols = [...activeCols];
        if (direction === 'up') {
            if (index === 0) return;
            [newCols[index], newCols[index - 1]] = [newCols[index - 1], newCols[index]];
        } else {
            if (index === newCols.length - 1) return;
            [newCols[index], newCols[index + 1]] = [newCols[index + 1], newCols[index]];
        }
        setActiveCols(newCols);
    };

    const filteredAvailable = availableFields.filter(f =>
        f.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !activeCols.some(c => c.id === f.id)
    );

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col h-[600px] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Manage Columns</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT PANEL: Available */}
                    <div className="w-1/2 p-6 border-r border-slate-200 bg-slate-50 flex flex-col">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Available Fields</h3>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search fields..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white"
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {filteredAvailable.length === 0 ? (
                                <div className="text-center text-slate-400 text-sm py-8 italic">No fields match your search</div>
                            ) : (
                                filteredAvailable.map(field => (
                                    <button
                                        key={field.id}
                                        onClick={() => toggleAvailability(field)}
                                        disabled={isAtLimit}
                                        className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:border-slate-200"
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-slate-700">{field.label}</div>
                                            <div className="text-[10px] text-slate-400">{field.category}</div>
                                        </div>
                                        <Plus size={16} className="text-slate-300 group-hover:text-blue-600" />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL: Selected */}
                    <div className="w-1/2 p-6 flex flex-col bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visible Columns</h3>
                            <span className="text-xs text-slate-400 font-medium">
                                {visibleCount}/{MAX_COLUMNS}
                            </span>
                        </div>

                        {/* Validation Warning */}
                        {isAtLimit && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-medium flex items-center justify-center animate-in fade-in slide-in-from-top-1">
                                You can show up to {MAX_COLUMNS} columns at a time.
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto space-y-2">
                            {activeCols.map((col, idx) => {
                                const status = isDirty(col);
                                let borderClass = 'border-slate-100 hover:border-slate-300';
                                if (status === 'new') borderClass = 'border-emerald-200 bg-emerald-50/30';
                                if (status === 'moved') borderClass = 'border-amber-200 bg-amber-50/30';

                                return (
                                    <div key={col.id} className={`flex items-center gap-3 p-2 border rounded-lg bg-white transition-all group ${borderClass}`}>
                                        <div className="text-slate-300 cursor-move">
                                            <GripVertical size={16} />
                                        </div>
                                        <div className="flex-1 text-sm font-medium text-slate-700">
                                            {col.label || <span className="text-slate-400 italic">Selection Checkbox</span>}
                                        </div>
                                        {!col.fixed && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => moveCol(idx, 'up')} disabled={idx === 0 || activeCols[idx - 1]?.fixed} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30">
                                                    <ArrowUp size={14} />
                                                </button>
                                                <button onClick={() => moveCol(idx, 'down')} disabled={idx === activeCols.length - 1} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30">
                                                    <ArrowDown size={14} />
                                                </button>
                                                <div className="w-px h-3 bg-slate-200 mx-1"></div>
                                                <button onClick={() => removeCol(col.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                        {col.fixed && <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Fixed</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    <button onClick={() => onSave(activeCols)} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">Save Changes</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default UsersTab;
