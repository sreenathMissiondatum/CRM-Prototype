import React, { useState, useEffect } from 'react';
import {
    ArrowLeft, Save, User, Mail, Briefcase, Building, Shield,
    Lock, Globe, AlertCircle, ChevronDown, Check, X, Eye,
    Calendar, Key, Clock, Info, CheckCircle, Search, MoreVertical, Copy, RotateCcw,
    PauseCircle, PlayCircle, Trash2, ChevronRight
} from 'lucide-react';
import { MOCK_VISIBILITY_GROUPS } from '../../../../data/mockVisibilityGroups';

const UserEdit = ({ user, onSave, onCancel, existingUsers = [] }) => {
    // --- State ---
    const [formData, setFormData] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: user?.phone || '',
        jobTitle: user?.jobTitle || '',
        status: user?.status || 'Pending Activation',

        // Org
        role: user?.role || '',
        reportsTo: user?.reportsTo || '',
        departments: user?.departments || (user?.department ? [user.department] : []),
        branches: user?.branches || (user?.location ? [user.location] : []),
        teams: user?.teams || [],

        // Additive Security
        additivePermissions: [],
        additiveVisibility: [],

        // Preferences
        locale: user?.locale || 'en-US',
        timezone: user?.timezone || 'UTC-5 (EST)',
        dateFormat: user?.dateFormat || 'MM/DD/YYYY',
        numberFormat: user?.numberFormat || '1,000.00'
    });

    const [errors, setErrors] = useState({});
    const [activeTab, setActiveTab] = useState('config'); // config | preview

    // Warning Modal State
    const [showRoleWarning, setShowRoleWarning] = useState(false);
    const [pendingRole, setPendingRole] = useState(null);
    const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);



    // --- Mock Data ---
    const ROLES = ['Admin', 'Loan Officer', 'Underwriter', 'Processor', 'Auditor', 'Manager'];

    // Mock Role Baselines
    const ROLE_BASELINES = {
        'Admin': {
            permissions: ['System Administration', 'User Management', 'Full Access'],
            visibility: ['Global Organization']
        },
        'Loan Officer': {
            permissions: ['Loan Origination', 'CRM Access', 'Document Upload'],
            visibility: ['Own Deals', 'Branch Deals']
        },
        'Underwriter': {
            permissions: ['Credit Analysis', 'Risk Assessment', 'Approval Authority L1'],
            visibility: ['Assigned Deals', 'Queue Access']
        },
        'Processor': {
            permissions: ['Document Processing', 'Verification Tools'],
            visibility: ['Assigned Deals']
        }
    };

    const AVAILABLE_PERMISSIONS = [
        { id: 'p1', name: 'Marketing Manager', type: 'Functional' },
        { id: 'p2', name: 'Compliance Review', type: 'compliance' },
        { id: 'p3', name: 'Override Rate', type: 'Restricted' },
        { id: 'p4', name: 'View Audit Logs', type: 'Read-Only' }
    ];

    const AVAILABLE_VISIBILITY = MOCK_VISIBILITY_GROUPS.map(g => ({
        id: g.id,
        name: g.name,
        scope: g.description // Compatibility mapping
    }));

    const DEPARTMENT_OPTIONS = ['Lending', 'Credit', 'Operations', 'Finance', 'Compliance', 'Servicing', 'Admin', 'IT', 'Marketing'];
    const BRANCH_OPTIONS = ['New York HQ', 'Austin Branch', 'Chicago Branch', 'SF Tech Hub', 'Miami Sales', 'Remote'];
    const TEAM_OPTIONS = ['Team Alpha', 'Team Beta', 'Mortgage Ops', 'Risk Management', 'Sales East', 'Sales West'];

    const LOCALES = ['en-US', 'es-US', 'fr-CA', 'en-GB'];
    const TIMEZONES = ['UTC-8 (PST)', 'UTC-5 (EST)', 'UTC+0 (GMT)', 'UTC+1 (CET)'];
    const DATE_FORMATS = ['MM/DD/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY'];
    const NUMBER_FORMATS = ['1,000.00', '1.000,00'];

    // --- Derived State ---
    const inheritedPermissions = ROLE_BASELINES[formData.role]?.permissions || [];
    const inheritedVisibility = ROLE_BASELINES[formData.role]?.visibility || [];
    const canActivate = formData.role && formData.firstName && formData.lastName;

    // --- Handlers ---
    const handleChange = (field, value) => {
        // Intercept Role Change for Warning
        if (field === 'role' && formData.role && value !== formData.role) {
            setPendingRole(value);
            setShowRoleWarning(true);
            return;
        }

        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
        }
    };

    const confirmRoleChange = () => {
        setFormData(prev => ({ ...prev, role: pendingRole }));
        setShowRoleWarning(false);
        setPendingRole(null);
    };

    const handleAddPermission = (perm) => {
        if (!formData.additivePermissions.find(p => p.id === perm.id)) {
            handleChange('additivePermissions', [...formData.additivePermissions, { ...perm, addedDate: new Date().toLocaleDateString() }]);
        }
    };

    const handleRemovePermission = (permId) => {
        handleChange('additivePermissions', formData.additivePermissions.filter(p => p.id !== permId));
    };

    const handleAddVisibility = (group) => {
        if (!formData.additiveVisibility.find(g => g.id === group.id)) {
            handleChange('additiveVisibility', [...formData.additiveVisibility, group]);
        }
    };

    const handleRemoveVisibility = (groupId) => {
        handleChange('additiveVisibility', formData.additiveVisibility.filter(g => g.id !== groupId));
    };

    const toggleMultiSelect = (field, item) => {
        const current = formData[field] || [];
        let next;
        if (current.includes(item)) {
            next = current.filter(i => i !== item);
        } else {
            next = [...current, item];
        }
        handleChange(field, next);
    };

    const handleFreeze = () => {
        if (window.confirm('Are you sure you want to freeze this user? This will revoke all active sessions.')) {
            handleSave('freeze');
        }
    };

    const handleUnfreeze = () => {
        handleSave('unfreeze');
    };

    const handleSave = (actionType) => {
        // Basic Validation
        if (!formData.firstName || !formData.lastName || !formData.role) {
            setErrors({
                firstName: !formData.firstName ? 'Required' : null,
                lastName: !formData.lastName ? 'Required' : null,
                role: !formData.role ? 'Required' : null
            });
            return;
        }

        let newStatus = formData.status;

        if (actionType === 'activate') newStatus = 'Active';
        if (actionType === 'deactivate') newStatus = 'Inactive';
        if (actionType === 'freeze') newStatus = 'Frozen';
        if (actionType === 'unfreeze') newStatus = 'Active';

        // Capture snapshot for audit
        const previousState = { ...user };
        const newState = { ...formData, status: newStatus };

        // --- Audit Log ---
        console.groupCollapsed(`[AUDIT] User Update: ${user.email}`);
        console.log(`Timestamp: ${new Date().toISOString()}`);
        console.log(`Admin User: Current Admin`);
        console.log('--- Changes ---');
        Object.keys(newState).forEach(key => {
            if (JSON.stringify(previousState[key]) !== JSON.stringify(newState[key])) {
                console.log(`${key}:`, previousState[key], '→', newState[key]);
            }
        });
        console.groupEnd();

        const updatedUser = {
            ...user,
            ...newState,
            lastActive: actionType === 'activate' ? 'Just now' : user.lastActive
        };

        onSave(updatedUser);
    };

    return (
        <div className="flex flex-col w-full bg-slate-50 relative animate-in fade-in duration-300 min-h-screen">
            {/* --- HEADER --- */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm/50">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-2">
                        <span className="cursor-pointer hover:text-slate-800">Admin Console</span>
                        <ChevronRight size={12} />
                        <span className="cursor-pointer hover:text-slate-800">Users</span>
                        <ChevronRight size={12} />
                        <span className="text-blue-600">Edit User</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold text-slate-900">{formData.firstName} {formData.lastName}</h1>

                        {/* Dynamic Status Pill */}
                        {formData.status === 'Active' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
                                <Check size={12} /> Active
                            </span>
                        )}
                        {(formData.status === 'Pending Activation' || formData.status === 'Invited') && (
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold flex items-center gap-1.5">
                                <Clock size={12} /> Pending Activation
                            </span>
                        )}
                        {formData.status === 'Frozen' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                                <undefined size={12} /> Frozen
                            </span>
                        )}
                        {formData.status === 'Inactive' && (
                            <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5">
                                <X size={12} /> Deactivated
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={() => handleSave('save')}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm"
                    >
                        Save Changes
                    </button>

                    {/* Kebab Menu - Lifecycle Actions */}
                    <div className="relative ml-1">
                        <button
                            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                            className={`p-2 rounded-lg border transition-all ${isActionMenuOpen ? 'bg-slate-100 border-slate-300 text-slate-800' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                        >
                            <MoreVertical size={20} />
                        </button>

                        {isActionMenuOpen && (
                            <>
                                <div className="fixed inset-0 z-30" onClick={() => setIsActionMenuOpen(false)}></div>
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-40 py-2 origin-top-right animate-in fade-in zoom-in-95 duration-100">

                                    {/* SECTION 1: OPERATIONAL */}
                                    <div className="px-2 pb-2 border-b border-slate-100 mb-2">
                                        <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Operational</div>
                                        <button
                                            onClick={() => { setIsActionMenuOpen(false); window.alert('Clone User placeholder'); }}
                                            className="w-full text-left px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2"
                                        >
                                            <Copy size={14} className="text-slate-400" /> Clone User
                                        </button>
                                        <button
                                            onClick={() => { setIsActionMenuOpen(false); window.alert('Reset Password placeholder'); }}
                                            className="w-full text-left px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2"
                                        >
                                            <RotateCcw size={14} className="text-slate-400" /> Reset Password
                                        </button>
                                        {(formData.status === 'Pending Activation' || formData.status === 'Invited') && (
                                            <button
                                                onClick={() => { setIsActionMenuOpen(false); handleSave('activate'); }}
                                                className="w-full text-left px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2"
                                            >
                                                <Mail size={14} className="text-slate-400" /> Send Activation Email
                                            </button>
                                        )}
                                    </div>

                                    {/* SECTION 2: ACCESS CONTROL */}
                                    <div className="px-2 pb-2 border-b border-slate-100 mb-2">
                                        <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Access Control</div>
                                        {formData.status === 'Frozen' ? (
                                            <button
                                                onClick={() => { setIsActionMenuOpen(false); handleUnfreeze(); }}
                                                className="w-full text-left px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2"
                                            >
                                                <PlayCircle size={14} className="text-emerald-500" /> Unfreeze User
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { setIsActionMenuOpen(false); handleFreeze(); }}
                                                className="w-full text-left px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50 rounded flex items-center gap-2"
                                            >
                                                <PauseCircle size={14} className="text-amber-500" /> Freeze User
                                            </button>
                                        )}
                                    </div>

                                    {/* SECTION 3: DESTRUCTIVE */}
                                    <div className="px-2">
                                        <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Danger Zone</div>
                                        {formData.status !== 'Inactive' && (
                                            <button
                                                onClick={() => { setIsActionMenuOpen(false); handleSave('deactivate'); }}
                                                className="w-full text-left px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2"
                                            >
                                                <Trash2 size={14} className="text-red-500" /> Deactivate User
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8 pb-32 max-w-7xl mx-auto w-full grid grid-cols-12 gap-8">

                {/* --- LEFT COLUMN: IDENTITY & ORG --- */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                    {/* Identity (Read-Only) */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 relative overflow-hidden">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2 relative z-10">
                            <User size={16} className="text-blue-500" /> Identity
                        </h3>
                        <div className="space-y-4 relative z-10">
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="First Name" value={formData.firstName} onChange={e => handleChange('firstName', e.target.value)} />
                                <Input label="Last Name" value={formData.lastName} onChange={e => handleChange('lastName', e.target.value)} />
                            </div>
                            <Input label="Email Address" value={formData.email} readOnly lockTooltip="Email is the user’s login identifier and cannot be changed." />
                            <Input label="Job Title" value={formData.jobTitle} onChange={e => handleChange('jobTitle', e.target.value)} />
                            <Input label="Phone Number" value={formData.phone} onChange={e => handleChange('phone', e.target.value)} />
                        </div>
                    </section>
                </div>

                {/* --- CENTER/RIGHT: SECURITY & ACCESS CONFIG --- */}
                <div className="col-span-12 lg:col-span-8 space-y-6">

                    {/* Organization Placement */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Building size={16} className="text-indigo-500" /> Organization
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <Select
                                label="Organizational Role"
                                req
                                value={formData.role}
                                options={ROLES}
                                onChange={e => handleChange('role', e.target.value)}
                                error={errors.role}
                                desc="Defines the user’s baseline permissions."
                            />
                            <div className="space-y-1.5 w-full">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    Reports To
                                </label>
                                <p className="text-xs text-slate-400 mb-1">Direct manager for reporting hierarchy.</p>
                                <div className="relative">
                                    <select
                                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:border-blue-400 transition-all cursor-pointer"
                                        value={formData.reportsTo || ''}
                                        onChange={e => handleChange('reportsTo', e.target.value)}
                                    >
                                        <option value="">Select Manager...</option>
                                        {existingUsers?.filter(u => u.id !== user?.id).map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Multi-Select Fields */}
                        <div className="space-y-6 mb-6">
                            <MultiSelect
                                label="Departments"
                                options={DEPARTMENT_OPTIONS}
                                selected={formData.departments}
                                onToggle={item => toggleMultiSelect('departments', item)}
                            />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <MultiSelect
                                    label="Branches"
                                    options={BRANCH_OPTIONS}
                                    selected={formData.branches}
                                    onToggle={item => toggleMultiSelect('branches', item)}
                                />
                                <MultiSelect
                                    label="Teams"
                                    options={TEAM_OPTIONS}
                                    selected={formData.teams}
                                    onToggle={item => toggleMultiSelect('teams', item)}
                                />
                            </div>
                        </div>

                        {/* Role Preview (Baseline) */}
                        {formData.role && (
                            <div className="bg-slate-50/80 rounded-lg border border-slate-200 p-4 animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg shrink-0">
                                        <Shield size={18} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-slate-800 mb-1">Baseline Access: {formData.role}</h4>
                                        <p className="text-xs text-slate-500 mb-3">
                                            The following permissions are inherited automatically. To change these, you must modify the role itself.
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">Inherited Permissions</span>
                                                <div className="flex flex-wrap gap-1.5 align-start">
                                                    {inheritedPermissions.length > 0 ? inheritedPermissions.map(p => (
                                                        <span key={p} className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-600 shadow-sm">
                                                            <Lock size={10} className="mr-1.5 text-slate-400" /> {p}
                                                        </span>
                                                    )) : <span className="text-xs text-slate-400 italic">No permissions defined</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold uppercase text-slate-400 mb-1.5 block">Inherited Visibility</span>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {inheritedVisibility.length > 0 ? inheritedVisibility.map(v => (
                                                        <span key={v} className="inline-flex items-center px-2 py-1 rounded-md bg-white border border-slate-200 text-xs text-slate-600 shadow-sm">
                                                            <Eye size={10} className="mr-1.5 text-slate-400" /> {v}
                                                        </span>
                                                    )) : <span className="text-xs text-slate-400 italic">No visibility defined</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Access Extensions */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                <Key size={16} className="text-emerald-500" /> Access Extensions
                            </h3>
                        </div>

                        <div className="space-y-6">
                            {/* Permission Sets */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700">Permission Sets</label>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Permission Sets extend access beyond the user’s role baseline.</p>
                                    </div>
                                    <PermissionDropdown
                                        options={AVAILABLE_PERMISSIONS}
                                        assigned={formData.additivePermissions}
                                        onSelect={handleAddPermission}
                                    />
                                </div>
                                <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 min-h-[60px] flex flex-wrap gap-2">
                                    {formData.additivePermissions.length === 0 ? (
                                        <span className="text-xs text-slate-400 italic self-center">No additional permission sets assigned.</span>
                                    ) : (
                                        formData.additivePermissions.map(p => (
                                            <div key={p.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm group">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-700">{p.name}</span>
                                                </div>
                                                <button onClick={() => handleRemovePermission(p.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Visibility Groups */}
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <div>
                                        <label className="text-xs font-bold text-slate-700">Visibility Groups</label>
                                        <p className="text-[11px] text-slate-500 mt-0.5">Visibility Groups control which records the user can see, beyond role-based defaults.</p>
                                    </div>
                                    <VisibilityDropdown
                                        options={AVAILABLE_VISIBILITY}
                                        assigned={formData.additiveVisibility}
                                        onSelect={handleAddVisibility}
                                    />
                                </div>
                                <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 min-h-[60px] flex flex-wrap gap-2">
                                    {formData.additiveVisibility.length === 0 ? (
                                        <span className="text-xs text-slate-400 italic self-center">No additional visibility groups assigned.</span>
                                    ) : (
                                        formData.additiveVisibility.map(v => (
                                            <div key={v.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm group">
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-slate-700">{v.name}</span>
                                                    <span className="text-[10px] text-slate-400">{v.scope}</span>
                                                </div>
                                                <button onClick={() => handleRemoveVisibility(v.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Preferences Card */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Globe size={16} className="text-purple-500" /> Preferences
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select label="Locale" value={formData.locale} options={LOCALES} onChange={e => handleChange('locale', e.target.value)} />
                            <Select label="Timezone" value={formData.timezone} options={TIMEZONES} onChange={e => handleChange('timezone', e.target.value)} />
                            <Select label="Date Format" value={formData.dateFormat} options={DATE_FORMATS} onChange={e => handleChange('dateFormat', e.target.value)} />
                            <Select label="Number Format" value={formData.numberFormat} options={NUMBER_FORMATS} onChange={e => handleChange('numberFormat', e.target.value)} />
                        </div>
                    </section>

                    {/* Security & Status - Read Only */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                                <Shield size={16} className="text-emerald-500" /> Security & Status
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1.5">Account Status</label>
                                <div className="flex items-center gap-2 text-sm text-slate-900 border border-slate-200 bg-slate-50 px-3 py-2 rounded-lg">
                                    {(formData.status === 'Active') && <Check size={14} className="text-emerald-500" />}
                                    {(formData.status === 'Pending Activation' || formData.status === 'Invited') && <Clock size={14} className="text-slate-400" />}
                                    {(formData.status === 'Frozen') && <PauseCircle size={14} className="text-amber-500" />}
                                    {(formData.status === 'Inactive') && <X size={14} className="text-red-500" />}
                                    <span className="font-medium">{formData.status}</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1.5">Last Login</label>
                                <div className="flex items-center gap-2 text-sm text-slate-500 border border-slate-200 bg-slate-50 px-3 py-2 rounded-lg">
                                    <Clock size={14} />
                                    Never logged in
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1.5">Created Date</label>
                                <div className="flex items-center gap-2 text-sm text-slate-500 border border-slate-200 bg-slate-50 px-3 py-2 rounded-lg">
                                    <Calendar size={14} />
                                    Oct 24, 2023
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Effective Access Preview (Collapsible) */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setActiveTab(activeTab === 'preview' ? 'config' : 'preview')}
                            className="w-full flex items-center justify-between p-4 bg-slate-100 hover:bg-slate-200/80 transition-colors text-left"
                        >
                            <div className="flex items-center gap-2">
                                <Shield size={16} className="text-slate-600" />
                                <span className="text-sm font-bold text-slate-700">Effective Access Preview</span>
                            </div>
                            <ChevronDown size={16} className={`text-slate-500 transition-transform ${activeTab === 'preview' ? 'rotate-180' : ''}`} />
                        </button>

                        {activeTab === 'preview' && (
                            <div className="p-6 bg-white animate-in slide-in-from-top-1">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 border-b border-slate-100 pb-2">Combined Permissions</h4>
                                        <ul className="space-y-2">
                                            {inheritedPermissions.map(p => (
                                                <li key={p} className="text-xs text-slate-700 flex items-center gap-2">
                                                    <Check size={12} className="text-indigo-500" /> {p} <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-1.5 rounded">Role</span>
                                                </li>
                                            ))}
                                            {formData.additivePermissions.map(p => (
                                                <li key={p.id} className="text-xs text-slate-700 flex items-center gap-2">
                                                    <Check size={12} className="text-emerald-500" /> {p.name} <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-1.5 rounded">Direct</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold uppercase text-slate-500 mb-3 border-b border-slate-100 pb-2">Combined Visibility</h4>
                                        <ul className="space-y-2">
                                            {inheritedVisibility.map(p => (
                                                <li key={p} className="text-xs text-slate-700 flex items-center gap-2">
                                                    <Eye size={12} className="text-indigo-500" /> {p} <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-1.5 rounded">Role</span>
                                                </li>
                                            ))}
                                            {formData.additiveVisibility.map(p => (
                                                <li key={p.id} className="text-xs text-slate-700 flex items-center gap-2">
                                                    <Eye size={12} className="text-purple-500" /> {p.name} <span className="ml-auto text-[10px] text-slate-400 bg-slate-100 px-1.5 rounded">Direct</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Warning Modal */}
            {showRoleWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowRoleWarning(false)}></div>
                    <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Change Role?</h3>
                                <p className="text-sm text-slate-500">This will impact user access.</p>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                            Changing the role will <strong>reset baseline permissions</strong> for this user.
                            Existing permission sets will be re-evaluated against the new role.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowRoleWarning(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRoleChange}
                                className="px-4 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
                            >
                                Yes, Change Role
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Sub-Components (Duplicated/Simplified from AddUser for isolation) ---

const Input = ({ label, req, error, readOnly, lockTooltip, ...props }) => (
    <div className="space-y-1.5 w-full">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-2">
            {label} {req && <span className="text-red-500">*</span>}
            {lockTooltip && <Lock size={12} className="text-slate-400" />}
        </label>
        <div className="relative group">
            <input
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-800 transition-all ${readOnly ? 'cursor-not-allowed opacity-70 bg-slate-100 text-slate-500' : 'focus:bg-white focus:outline-none focus:ring-2'} ${error ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                readOnly={readOnly}
                {...props}
            />
            {lockTooltip && (
                <div className="absolute left-0 -top-8 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {lockTooltip}
                    <div className="absolute left-4 top-full -mt-1 border-4 border-transparent border-t-slate-800"></div>
                </div>
            )}
        </div>
        {error && <span className="text-xs text-red-500 flex items-center gap-1">{error}</span>}
    </div>
);

const Select = ({ label, req, options, error, desc, ...props }) => (
    <div className="space-y-1.5 w-full">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {label} {req && <span className="text-red-500">*</span>}
        </label>
        {desc && <p className="text-xs text-slate-400 mb-1">{desc}</p>}
        <div className="relative">
            <select
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-800 appearance-none focus:bg-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${error ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                {...props}
            >
                <option value="">Select...</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
        {error && <span className="text-xs text-red-500 flex items-center gap-1">{error}</span>}
    </div>
);

const PermissionDropdown = ({ options, assigned, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const available = options.filter(o => !assigned.find(a => a.id === o.id));

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounde-md flex items-center gap-1 transition-colors"
            >
                + Assign
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-1">
                        {available.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-slate-400">No more available</div>
                        ) : available.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => { onSelect(opt); setIsOpen(false); }}
                                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-blue-600 truncate"
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const VisibilityDropdown = ({ options, assigned, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const available = options.filter(o => !assigned.find(a => a.id === o.id));

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounde-md flex items-center gap-1 transition-colors"
            >
                + Add Scope
            </button>
            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-1">
                        {available.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-slate-400">No more available</div>
                        ) : available.map(opt => (
                            <button
                                key={opt.id}
                                onClick={() => { onSelect(opt); setIsOpen(false); }}
                                className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-purple-600 truncate"
                            >
                                {opt.name}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// --- New Sub-Components ---

const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg bg-slate-50/50">
        <div>
            <div className="text-sm font-semibold text-slate-700">{label}</div>
            <div className="text-xs text-slate-500">{desc}</div>
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-blue-600' : 'bg-slate-200'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const MultiSelect = ({ label, options, selected, onToggle }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-1.5 w-full">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex justify-between">
                {label}
                <span className="text-[10px] font-normal text-slate-400">{selected.length} selected</span>
            </label>

            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="min-h-[38px] w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap gap-1.5 cursor-pointer hover:bg-white hover:border-blue-300 transition-colors"
                >
                    {selected.length === 0 && <span className="text-sm text-slate-400 px-1">Select...</span>}
                    {selected.map(item => (
                        <span key={item} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 shadow-sm">
                            {item}
                            <X size={12} className="text-slate-400 hover:text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); onToggle(item); }} />
                        </span>
                    ))}
                    <div className="ml-auto self-center text-slate-400">
                        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </div>
                </div>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)}></div>
                        <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-xl z-20 max-h-60 overflow-y-auto p-1 animate-in fade-in zoom-in-95 duration-100">
                            {options.map(option => (
                                <div
                                    key={option}
                                    onClick={() => onToggle(option)}
                                    className={`px-3 py-2 text-sm rounded cursor-pointer flex items-center justify-between ${selected.includes(option) ? 'bg-blue-50 text-blue-700 font-medium' : 'hover:bg-slate-50 text-slate-700'}`}
                                >
                                    {option}
                                    {selected.includes(option) && <Check size={14} />}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserEdit;
