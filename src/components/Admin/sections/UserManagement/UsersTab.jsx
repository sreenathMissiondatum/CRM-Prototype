import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import AddUser from '../AddUser';
import UserEdit from './UserEdit';
import {
    Search, Plus, MoreHorizontal, Shield, Mail, CheckCircle, XCircle,
    Filter, LayoutGrid, ArrowUpDown, Lock, Eye, Trash2, UserCog, Copy,
    ArrowUp, ArrowDown, X, Check, GripVertical, Ban, Download, Table, FileText, File, Upload
} from 'lucide-react';
import StageScroll from '../../../Shared/StageScroll';
import Pagination from '../../../Shared/Pagination';
import ImportUsersModal from './modals/ImportUsersModal';
import BulkUpdateUsersModal from './modals/BulkUpdateUsersModal';
import DeactivateUserModal from './modals/DeactivateUserModal';

import FreezeUserModal from './modals/FreezeUserModal';
import { downloadLeadTemplate } from '../../../../utils/leadTemplateUtils'; // Reusing util or create new one if needed

// ... (existing imports)




// Custom Icons to avoid version mismatches
const SnowflakeIcon = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M2.2 12h19.6" /><path d="M12 2.2v19.6" /><path d="m20 20-4.7-4.7" /><path d="M4 4l4.7 4.7" /><path d="M20 4l-4.7 4.7" /><path d="M4 20l4.7-4.7" />
    </svg>
);

const UsersTab = () => {
    // Mock Data (Enhanced with Frozen and Invited statuses)
    const [users, setUsers] = useState([
        { id: 1, name: 'Alex Morgan', email: 'alex@acmelending.com', role: 'Admin', status: 'Active', lastActive: '2 min ago', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150', department: 'Executive', location: 'New York, NY', phone: '(212) 555-0123', allowedActions: [] },
        { id: 2, name: 'Sarah Connor', email: 'sarah@acmelending.com', role: 'Loan Officer', status: 'Active', lastActive: '1 hr ago', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150', department: 'Sales', location: 'Austin, TX', phone: '(512) 555-0199', allowedActions: [] },
        { id: 3, name: 'James Wright', email: 'james@acmelending.com', role: 'Underwriter', status: 'Active', lastActive: '4 hrs ago', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150', department: 'Risk', location: 'Chicago, IL', phone: '(312) 555-0144', allowedActions: [] },
        { id: 4, name: 'Emily Chen', email: 'emily@acmelending.com', role: 'Processor', status: 'Inactive', lastActive: '2 days ago', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150', department: 'Operations', location: 'San Francisco, CA', phone: '(415) 555-0177', allowedActions: [] },
        { id: 5, name: 'Michael Ross', email: 'mike@acmelending.com', role: 'Loan Officer', status: 'Active', lastActive: '10 min ago', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150', department: 'Sales', location: 'New York, NY', phone: '(212) 555-0188', allowedActions: [] },
        { id: 6, name: 'David Miller', email: 'david@acmelending.com', role: 'Loan Officer', status: 'Active', lastActive: 'Yesterday', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150&h=150', department: 'Sales', location: 'Miami, FL', phone: '(305) 555-0155', allowedActions: [] },
        { id: 7, name: 'Elena Fisher', email: 'elena@acmelending.com', role: 'Admin', status: 'Active', lastActive: 'Today', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150', department: 'IT', location: 'Remote', phone: '(206) 555-0122', allowedActions: [] },
        // New Mock Data for Testing
        { id: 8, name: 'Frozen Account', email: 'frozen@acmelending.com', role: 'Loan Officer', status: 'Frozen', lastActive: '1 week ago', avatar: 'FA', department: 'Sales', location: 'Denver, CO', phone: '(303) 555-0100', allowedActions: [] },
        { id: 9, name: 'Pending User', email: 'pending@acmelending.com', role: 'Processor', status: 'Pending Activation', lastActive: 'Pending', avatar: 'PU', department: 'Operations', location: 'Seattle, WA', phone: '(206) 555-0999', allowedActions: ['RESEND_ACTIVATION', 'EXPIRE_TOKEN'] },
    ]);

    // View State: 'list' | 'add' | 'edit_user'
    const [currentView, setCurrentView] = useState('list');
    const [editingUser, setEditingUser] = useState(null);
    const [cloningUser, setCloningUser] = useState(null); // New State for Clone
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

    // Actions State
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false);
    const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
    const [usersToDeactivate, setUsersToDeactivate] = useState([]); // For modal context (Single or Bulk)

    const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
    const [usersToFreeze, setUsersToFreeze] = useState([]);

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

    // Toast Logic: Auto-dismiss only if NOT an Action Toast (User needs time to read/act)
    useEffect(() => {
        if (toastMessage && toastMessage.type !== 'ACTION_TOAST') {
            const timer = setTimeout(() => setToastMessage(null), 3000);
            return () => clearTimeout(timer);
        }
        // Action Toasts stay until dismissed or interacted with (or maybe 10s?)
        // Let's stick to no-auto-dismiss for Actions to be safe/visible
        if (toastMessage && toastMessage.type === 'ACTION_TOAST') {
            const timer = setTimeout(() => setToastMessage(null), 10000); // 10s auto dismiss for hygiene
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
        // Mock Backend: Add allowedActions for Pending Activation status
        const newUser = {
            id: Math.max(...users.map(u => u.id)) + 1,
            ...user,
            allowedActions: user.status === 'Pending Activation' || sendInvite ? ['RESEND_ACTIVATION', 'EXPIRE_TOKEN'] : []
        };

        // 1. Persist User (Prepend to list, but filtering/paging might hide it)
        setUsers(prev => [newUser, ...prev]);

        // 2. Audit Log
        const actionType = cloningUser ? 'USER_CLONED' : 'USER_CREATED';
        console.log(`[AUDIT] Action: ${actionType}, Actor: Admin, Target User: ${newUser.email}, Status: ${newUser.status}${cloningUser ? `, SourceUser: ${cloningUser.id}` : ''}`);

        // 3. Set Actionable Toast (Context Preserved: No setPage/setFilter calls here)
        setToastMessage({
            type: 'ACTION_TOAST',
            title: cloningUser ? 'User cloned successfully' : 'User created successfully',
            message: cloningUser
                ? 'The new user is in Pending Activation and may not appear in the current view.'
                : 'This user is currently in Pending Activation and is not visible in the current view.',
            data: newUser
        });

        // 4. Return to List View (Context Untouched)
        setCurrentView('list');
        setCloningUser(null);
    };

    const handleUpdateUser = (updatedUser) => {
        // Mock Backend: Update allowedActions based on status
        const finalUser = {
            ...updatedUser,
            allowedActions: updatedUser.status === 'Pending Activation' ? ['RESEND_ACTIVATION', 'EXPIRE_TOKEN'] : []
        };
        setUsers(prev => prev.map(u => u.id === finalUser.id ? finalUser : u));
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
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    // Pending Activation Handlers
    const handleResendActivation = (userId) => {
        setToastMessage({ type: 'success', title: 'Activation Email Sent', message: 'A new activation link has been sent to the user.' });
        setActiveRowMenu(null);
    };

    const handleExpireToken = (userId) => {
        setToastMessage({ type: 'success', title: 'Token Expired', message: 'The activation token has been invalidated.' });
        setActiveRowMenu(null);
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

    // Action Handlers
    const handleExport = (format) => {
        const idsToExport = selectedIds.size > 0 ? Array.from(selectedIds) : filteredUsers.map(u => u.id);
        const mode = selectedIds.size > 0 ? 'Selected' : 'All/Filtered';
        alert(`Successfully exported ${idsToExport.length} users (${mode}) to ${format.toUpperCase()}.`);
        setIsExportMenuOpen(false);
    };

    const handleBulkUpdate = (ids, updates) => {
        // Mock Update Logic
        setUsers(prev => prev.map(u => {
            if (ids.includes(u.id)) {
                return { ...u, ...updates };
            }
            return u;
        }));
        setToastMessage(`Successfully updated ${ids.length} users.`);
        setSelectedIds(new Set()); // Clear selection
    };

    const handleDeactivate = (userIds) => {
        // Audit Log Strict Compliance
        console.log(`[AUDIT] Action: USER_DEACTIVATED_PERMANENT, Actor: Admin, Users: ${userIds.join(', ')}, NewStatus: Inactive, confirmationAcknowledged: true`);

        setUsers(prev => prev.map(u => {
            if (userIds.includes(u.id)) {
                return { ...u, status: 'Inactive', allowedActions: [] };
            }
            return u;
        }));

        setToastMessage(`${userIds.length} user(s) permanently deactivated.`);
        setIsDeactivateModalOpen(false);
        setUsersToDeactivate([]);
        setSelectedIds(new Set());
    };

    const handleUnfreeze = (userId) => {
        // Audit Log
        console.log(`[AUDIT] Action: USER_UNFROZEN, Actor: Admin, User: ${userId}, NewStatus: Active`);

        setUsers(prev => prev.map(u => {
            if (u.id === userId) {
                return { ...u, status: 'Active' };
            }
            return u;
        }));
        setToastMessage('User successfully unfrozen and active.');
        setActiveRowMenu(null);
    };

    const handleFreeze = (userId) => {
        // Open Modal Flow instead of direct freeze
        const user = users.find(u => u.id === userId);
        if (user) {
            setUsersToFreeze([user]);
            setIsFreezeModalOpen(true);
        }
        setActiveRowMenu(null);
    };

    const handleConfirmFreeze = (usersToFreeze, untilDate, reason) => {
        const userIds = usersToFreeze.map(u => u.id);
        const isBulk = userIds.length > 1;

        // Audit Logs (Strict)
        usersToFreeze.forEach(u => {
            console.log(`[AUDIT] Action: USER_FROZEN, Actor: Admin, Target User ID: ${u.id}, ` +
                `FreezeUntil: ${untilDate}, Reason: "${reason}", ` +
                `Source: ${isBulk ? 'BULK_ACTION' : 'ROW_LEVEL_MENU'}`);
        });

        // Update State
        setUsers(prev => prev.map(u => {
            if (userIds.includes(u.id)) {
                return {
                    ...u,
                    status: 'Frozen',
                    freezeMetadata: { until: untilDate, reason: reason, frozenAt: new Date().toISOString() }
                };
            }
            return u;
        }));

        setToastMessage(`Successfully frozen ${userIds.length} user(s) until ${untilDate}.`);
        setIsFreezeModalOpen(false);
        setUsersToFreeze([]);
    };

    const handleDeactivateModalFreeze = (users) => {
        const activeUsers = users.filter(u => u.status === 'Active');
        if (activeUsers.length === 0) return;

        setIsDeactivateModalOpen(false);
        setUsersToFreeze(activeUsers);
        setIsFreezeModalOpen(true);
    };

    // Calculate Bulk Deactivate Eligibility
    const selectedUsersList = useMemo(() => {
        return users.filter(u => selectedIds.has(u.id));
    }, [users, selectedIds]);

    const bulkDeactivateEligibility = useMemo(() => {
        if (selectedIds.size === 0) return { allowed: false, reason: 'No users selected' };

        const activeCount = selectedUsersList.filter(u => u.status === 'Active').length;
        const totalCount = selectedUsersList.length;

        if (activeCount === 0) return { allowed: false, reason: 'No Active users selected' };
        if (activeCount < totalCount) return { allowed: false, reason: `${totalCount - activeCount} of ${totalCount} users are not eligible (must be Active).` };

        return { allowed: true };
    }, [selectedUsersList, selectedIds]);

    // Derived Grid Columns
    const gridTemplateColumns = columns.filter(c => c.visible).map(c => c.width).join(' ');

    // --- RENDER ADD USER VIEW ---
    if (currentView === 'add') {
        return (
            <AddUser
                onSave={handleSaveNewUser}
                onCancel={() => { setCurrentView('list'); setCloningUser(null); }}
                existingUsers={users}
                initialData={cloningUser}
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

    if (currentView === 'view_user' && editingUser) {
        return (
            <UserEdit
                user={editingUser}
                existingUsers={users}
                onSave={() => { }}
                onCancel={() => { setCurrentView('list'); setEditingUser(null); }}
                readOnly={true}
            />
        );
    }

    // --- RENDER LIST VIEW ---
    return (
        <div className="flex flex-col relative px-6 pb-6">
            {/* Toast Notification */}
            {/* Toast Notification */}
            {toastMessage && createPortal(
                <div className={`fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-lg shadow-xl animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-start gap-3 max-w-md border ${toastMessage.type === 'ACTION_TOAST' ? 'bg-white border-slate-200 text-slate-800' : 'bg-slate-900/90 border-transparent text-white'}`}>

                    {/* Icon */}
                    <div className={`mt-0.5 ${toastMessage.type === 'ACTION_TOAST' ? 'text-green-600' : 'text-emerald-400'}`}>
                        <CheckCircle size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="font-bold text-sm mb-1">
                            {typeof toastMessage === 'string' ? 'Notification' : toastMessage.title || 'Notification'}
                        </div>
                        <div className={`text-sm mb-3 ${toastMessage.type === 'ACTION_TOAST' ? 'text-slate-600' : 'text-slate-200'}`}>
                            {typeof toastMessage === 'string' ? toastMessage : toastMessage.message}
                        </div>

                        {/* Action Buttons (Strictly for ACTION_TOAST) */}
                        {toastMessage.type === 'ACTION_TOAST' && (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        // 1. Primary CTA: View Pending Activation
                                        setActiveStatus('Pending Activation'); // Force Filter
                                        setSearchQuery(''); // Clear Search
                                        setActiveFilters({ roles: [], departments: [] }); // Clear Advanced
                                        setCurrentPage(1); // Go to Page 1
                                        setToastMessage(null);

                                        console.log(`[AUDIT] Action: FILTER_CHANGED_VIA_TOAST, Actor: Admin, NewStatus: Pending Activation`);
                                    }}
                                    className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors shadow-sm"
                                >
                                    View Pending Activation Users
                                </button>

                                <button
                                    onClick={() => {
                                        // 2. Secondary CTA: View Profile
                                        setEditingUser(toastMessage.data);
                                        setCurrentView('view_user');
                                        setToastMessage(null);

                                        console.log(`[AUDIT] Action: PROFILE_VIEWED_VIA_TOAST, Actor: Admin, Target User: ${toastMessage.data.id}`);
                                    }}
                                    className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition-colors"
                                >
                                    View User Profile
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Close Button */}
                    <button onClick={() => setToastMessage(null)} className={`ml-2 hover:opacity-75 transition-opacity ${toastMessage.type === 'ACTION_TOAST' ? 'text-slate-400' : 'text-slate-400'}`}>
                        <X size={16} />
                    </button>
                </div>,
                document.body
            )}

            <div className="flex justify-between items-center mb-4">
                {/* Header Removed - managed by parent */}
                <div />

                <div className="flex items-center gap-3">
                    {/* Add User Button (Primary) */}
                    <button
                        onClick={() => setCurrentView('add')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                    >
                        <Plus size={18} />
                        Add User
                    </button>

                    {/* Export Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <Download size={16} />
                            {selectedIds.size > 0 ? `Export (${selectedIds.size})` : 'Export'}
                        </button>
                        {isExportMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsExportMenuOpen(false)}></div>
                                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">Export As</div>
                                    <button onClick={() => handleExport('excel')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between items-center group">
                                        <div className="flex items-center gap-2">
                                            <Table size={14} className="text-emerald-600" />
                                            <span>Excel</span>
                                        </div>
                                    </button>
                                    <button onClick={() => handleExport('csv')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between items-center group">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-blue-600" />
                                            <span>CSV</span>
                                        </div>
                                    </button>
                                    <button onClick={() => handleExport('pdf')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between items-center group">
                                        <div className="flex items-center gap-2">
                                            <File size={14} className="text-red-600" />
                                            <span>PDF</span>
                                        </div>
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Kebab Menu (More Actions) */}
                    <div className="relative">
                        <button
                            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                            className="p-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                        >
                            <MoreHorizontal size={20} />
                        </button>
                        {isMoreMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsMoreMenuOpen(false)}></div>
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsImportModalOpen(true);
                                            setIsMoreMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors flex items-center gap-3"
                                    >
                                        <Upload size={16} className="text-slate-400" /> Import Users
                                    </button>



                                    {/* Deactivate Users */}
                                    <div className="relative group">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (bulkDeactivateEligibility.allowed) {
                                                    setUsersToDeactivate(selectedUsersList);
                                                    setIsDeactivateModalOpen(true);
                                                    setIsMoreMenuOpen(false);
                                                }
                                            }}
                                            disabled={!bulkDeactivateEligibility.allowed}
                                            className={`w-full text-left px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-3 
                                                ${bulkDeactivateEligibility.allowed
                                                    ? 'text-red-600 hover:bg-red-50 cursor-pointer'
                                                    : 'text-slate-400 cursor-default opacity-60'}`}
                                        >
                                            <Ban size={16} className={bulkDeactivateEligibility.allowed ? "text-red-500" : "text-slate-300"} />
                                            Deactivate Users {selectedIds.size > 0 && `(${selectedIds.size})`}
                                        </button>

                                        {/* Disabled Reason Tooltip */}
                                        {!bulkDeactivateEligibility.allowed && selectedIds.size > 0 && (
                                            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                                {bulkDeactivateEligibility.reason}
                                                <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 transform"></div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-px bg-slate-100 my-1"></div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // downloadTemplate(); 
                                            alert("Downloading User Template...");
                                            setIsMoreMenuOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors flex items-center gap-3"
                                    >
                                        <FileText size={16} className="text-slate-400" /> Download Template
                                    </button>


                                </div>
                            </>
                        )}
                    </div>
                </div>
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
                                        onClick={() => {/* Navigate/Select logic if needed, but row click usually does nothing or selects */ }}
                                        onDoubleClick={() => {
                                            // Feature: Row Double-Click -> View User
                                            // Check permission mock
                                            console.log(`[AUDIT] Action: USER_VIEWED, Source: User List (Row Double-Click), Target User: ${user.id}`);
                                            setEditingUser(user);
                                            setCurrentView('view_user');
                                        }}
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
                                                                        : user.status === 'Pending Activation'
                                                                            ? 'bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100'
                                                                            : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
                                                                    }`}
                                                            >
                                                                {user.status === 'Active' && <CheckCircle size={10} className="mr-1.5" />}
                                                                {user.status === 'Frozen' && <SnowflakeIcon className="w-2.5 h-2.5 mr-1.5" />}
                                                                {user.status === 'Inactive' && <XCircle size={10} className="mr-1.5" />}
                                                                {user.status === 'Pending Activation' && <Mail size={10} className="mr-1.5" />}
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
                                                            <button
                                                                className="hidden xl:flex p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    // Feature: Clone User
                                                                    setCloningUser(user);
                                                                    setCurrentView('add');
                                                                }}
                                                                title="Clone User"
                                                            >
                                                                <Copy size={16} />
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
                                                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                                                                        <button onClick={() => { setEditingUser(user); setCurrentView('view_user'); setActiveRowMenu(null); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                                                            <Eye size={14} /> View Details
                                                                        </button>
                                                                        {/* Edit User: Active/Pending only. Hidden for Frozen/Inactive */}
                                                                        {user.status !== 'Inactive' && user.status !== 'Frozen' && (
                                                                            <button
                                                                                onClick={() => { setEditingUser(user); setCurrentView('edit_user'); setActiveRowMenu(null); }}
                                                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
                                                                            >
                                                                                <UserCog size={14} /> Edit User
                                                                            </button>
                                                                        )}
                                                                        <button onClick={() => setActiveRowMenu(null)} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                                                            <Copy size={14} /> Clone User
                                                                        </button>


                                                                        {/* Dynamic Actions based on allowedActions */}
                                                                        {(user.allowedActions || []).includes('RESEND_ACTIVATION') && (
                                                                            <button
                                                                                onClick={() => handleResendActivation(user.id)}
                                                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2"
                                                                            >
                                                                                <Mail size={14} /> Resend Activation
                                                                            </button>
                                                                        )}

                                                                        {(user.allowedActions || []).includes('EXPIRE_TOKEN') && (
                                                                            <button
                                                                                onClick={() => handleExpireToken(user.id)}
                                                                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-amber-600 flex items-center gap-2"
                                                                            >

                                                                                <Lock size={14} /> Expire Token
                                                                            </button>
                                                                        )}

                                                                        <div className="border-t border-slate-100 my-1"></div>

                                                                        {/* Freeze User: Active only */}
                                                                        {user.status === 'Active' && (
                                                                            <button
                                                                                onClick={() => handleFreeze(user.id)}
                                                                                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                                                                            >
                                                                                <SnowflakeIcon size={14} /> Freeze User
                                                                            </button>
                                                                        )}

                                                                        {/* Frozen Actions */}
                                                                        {user.status === 'Frozen' && (
                                                                            <button
                                                                                onClick={() => handleUnfreeze(user.id)}
                                                                                className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                                                                            >
                                                                                {/* Reusing CheckCircle as 'Unfreeze/Activate' metaphor or Sun icon if available */}
                                                                                <CheckCircle size={14} /> Unfreeze User
                                                                            </button>
                                                                        )}

                                                                        {user.status === 'Inactive' && (
                                                                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                                                                                <Trash2 size={14} /> Delete User
                                                                            </button>
                                                                        )}

                                                                        {(user.status === 'Active' || user.status === 'Frozen') && (
                                                                            <button
                                                                                onClick={() => {
                                                                                    setUsersToDeactivate([user]);
                                                                                    setIsDeactivateModalOpen(true);
                                                                                    setActiveRowMenu(null);
                                                                                }}
                                                                                className="w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2"
                                                                            >
                                                                                <Ban size={14} /> Deactivate User
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return <div key={col.id} className={col.id === 'actions' ? 'text-right' : ''}>{col.label}</div> // Fallback, though label is wrong here, it should be content. Wait, original logic was different.
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
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

                <ColumnEditorModal
                    isOpen={isColumnEditorOpen}
                    onClose={() => setIsColumnEditorOpen(false)}
                    currentColumns={columns}
                    onSave={handleUpdateColumns}
                />

                {/* New Action Modals */}
                <ImportUsersModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onImportComplete={() => setToastMessage("Users imported successfully.")}
                />

                <BulkUpdateUsersModal
                    isOpen={isBulkUpdateModalOpen}
                    onClose={() => setIsBulkUpdateModalOpen(false)}
                    selectedUsers={users.filter(u => selectedIds.has(u.id))}
                    onUpdate={handleBulkUpdate}
                />

                <DeactivateUserModal
                    isOpen={isDeactivateModalOpen}
                    onClose={() => setIsDeactivateModalOpen(false)}
                    selectedUsers={usersToDeactivate}
                    onConfirm={handleDeactivate}
                    onFreeze={handleDeactivateModalFreeze}
                />

                <FreezeUserModal
                    isOpen={isFreezeModalOpen}
                    onClose={() => setIsFreezeModalOpen(false)}
                    selectedUsers={usersToFreeze}
                    onConfirm={handleConfirmFreeze}
                />
            </div>
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
