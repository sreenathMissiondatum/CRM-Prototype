import React, { useState } from 'react';
import {
    ArrowLeft, Save, User, Mail, Briefcase, Building, Shield,
    Lock, Clock, Globe, Info, CheckCircle, AlertCircle, ChevronDown, Check, X, Search
} from 'lucide-react';

const AddUser = ({ onSave, onCancel, existingUsers = [], initialData = null }) => {
    // --- State ---
    const [formData, setFormData] = useState({
        // Identity
        firstName: initialData?.firstName || '',
        lastName: initialData?.lastName || '',
        email: '', // Always empty for clone/new
        phone: initialData?.phone || '',
        jobTitle: initialData?.jobTitle || '',
        photo: null,

        // Org
        role: initialData?.role || '',
        reportsTo: initialData?.reportsTo || '',
        departments: initialData?.departments || [],
        teams: initialData?.teams || [],
        branches: initialData?.branches || [],

        // Security & Status
        status: 'Pending Activation', // MVP Rule: Always Pending Activation
        userType: initialData?.userType || 'Internal',         // MVP Rule: Default to Internal
        portalAccess: initialData?.portalAccess || false,          // MVP Rule: Default Off for Internal

        // Preferences
        locale: initialData?.locale || 'en-US',
        timezone: initialData?.timezone || 'UTC-5 (EST)',
        dateFormat: initialData?.dateFormat || 'MM/DD/YYYY',
        numberFormat: initialData?.numberFormat || '1,000.00'
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Success State
    const [showSuccessToast, setShowSuccessToast] = useState(false);

    // --- Mock Data ---
    const roles = ['Admin', 'Loan Officer', 'Underwriter', 'Processor', 'Auditor', 'manager'];
    const departmentOptions = ['Lending', 'Credit', 'Operations', 'Finance', 'Compliance', 'Servicing', 'Admin', 'IT', 'Marketing'];
    const branchOptions = ['New York HQ', 'Austin Branch', 'Chicago Branch', 'SF Tech Hub', 'Miami Sales', 'Remote'];
    const teamOptions = ['Team Alpha', 'Team Beta', 'Mortgage Ops', 'Risk Management', 'Sales East', 'Sales West'];

    const locales = ['en-US', 'es-US', 'fr-CA', 'en-GB'];
    const timezones = ['UTC-8 (PST)', 'UTC-5 (EST)', 'UTC+0 (GMT)', 'UTC+1 (CET)'];
    const dateFormats = ['MM/DD/YYYY', 'YYYY-MM-DD', 'DD/MM/YYYY'];
    const numberFormats = ['1,000.00', '1.000,00'];

    // --- Helpers ---

    // REGEX PATTERNS
    // Unicode letters, spaces, periods, apostrophes, hyphens.
    const NAME_REGEX = /^[\p{L}\s.'-]+$/u;
    // Basic E.164-ish: +, numbers, spaces, dots, dashes, parentheses
    const PHONE_REGEX = /^[\d\+\-\.\(\)\s]+$/;
    // Common job title chars: letters, numbers, spaces, hyphen, comma, slash
    const JOB_TITLE_REGEX = /^[a-zA-Z0-9\s\-\,\/]+$/;

    const validate = (field, value, currentState = formData) => {
        let error = null;

        // Identity
        if (field === 'firstName') {
            if (!value || !value.trim()) return 'First Name is required.';
            if (!NAME_REGEX.test(value.trim())) return 'First Name contains invalid characters.';
            if (value.length > 100) return 'First Name is too long.';
        }
        if (field === 'lastName') {
            if (!value || !value.trim()) return 'Last Name is required.';
            if (!NAME_REGEX.test(value.trim())) return 'Last Name contains invalid characters.';
            if (value.length > 100) return 'Last Name is too long.';
        }
        if (field === 'email') {
            if (!value) return 'Email Address is required.';
            // Simple RFC-compliant check
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
            if (existingUsers.some(u => u.email.toLowerCase() === value.toLowerCase() && u.id !== currentState.id)) return 'A user with this email already exists.';
        }
        if (field === 'jobTitle' && value) {
            if (!JOB_TITLE_REGEX.test(value)) return 'Job Title contains invalid characters.';
            if (value.length > 150) return 'Job Title is too long.';
        }
        if (field === 'phone' && value) {
            if (!PHONE_REGEX.test(value)) return 'Enter a valid phone number.';
        }

        // Organization
        if (field === 'role' && !value) return 'Role is required.';
        if (field === 'reportsTo') {
            if (!value) return 'Reporting Manager is required.';
            if (value === currentState.id) return 'Invalid reporting manager selected.'; // simplified check
        }

        // Multi-selects (Only checking individual requirement if we enforce it individually, 
        // but instructions say "At least one Department must be selected" -> section banner.
        // We will handle section banners in the render logic or a special 'validateForm' pass.
        // However, we can return null here and rely on submit validation for banners.

        return error;
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        const error = validate(field, formData[field]);
        setErrors(prev => {
            const next = { ...prev };
            if (error) next[field] = error;
            else delete next[field];
            return next;
        });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // If the field has been touched or currently has an error, validate immediately (aggressive feedback fix)
        // Rule says "Validation MUST occur on submit and on field blur only".
        // BUT usually if I fix an error, I want it to go away.
        // Strict interpretation: clear error on change? Or wait for blur?
        // "Validation enforced on blur and on Save." -> imply don't validate on change.
        // However, UX best practice: clear error if user starts typing.
        if (touched[field] || errors[field]) {
            const error = validate(field, value); // Re-validate
            setErrors(prev => {
                const next = { ...prev };
                if (error) next[field] = error;
                else delete next[field];
                return next;
            });
        }
    };

    // Special handler for User Type to enforce Portal Access rules
    const handleUserTypeChange = (type) => {
        const isInternal = type === 'Internal';

        setFormData(prev => ({
            ...prev,
            userType: type,
            // Rule: Internal -> Portal Access forced OFF. External -> Portal Access default ON.
            portalAccess: isInternal ? false : true
        }));
    };

    // Multi-Select Helper
    const toggleMultiSelect = (field, item) => {
        const current = formData[field];
        let next;
        if (current.includes(item)) {
            next = current.filter(i => i !== item);
        } else {
            next = [...current, item];
        }
        // Multi-select immediate update
        setFormData(prev => ({ ...prev, [field]: next }));
        // Clear section errors if any selection is made (optimistic)
        if (next.length > 0) {
            setErrors(prev => {
                const n = { ...prev };
                // Map field to error key
                if (field === 'departments') delete n.departments;
                if (field === 'branches') delete n.branches;
                if (field === 'teams') delete n.teams;
                if (field === 'departments' || field === 'branches' || field === 'teams') delete n.org; // consolidated
                return n;
            });
        }
    };

    const handleSave = () => {
        // 1. Validate All Identity Fields
        const newErrors = {};
        ['firstName', 'lastName', 'email', 'jobTitle', 'phone'].forEach(f => {
            const e = validate(f, formData[f]);
            if (e) newErrors[f] = e;
        });

        // 2. Validate Org Fields
        const roleErr = validate('role', formData.role);
        if (roleErr) newErrors.role = roleErr;

        const reportsErr = validate('reportsTo', formData.reportsTo);
        if (reportsErr) newErrors.reportsTo = reportsErr;

        // 3. Validate Sections
        const deptsValid = formData.departments.length > 0;
        const branchesValid = formData.branches.length > 0;
        const teamsValid = formData.teams.length > 0;

        if (!deptsValid) newErrors.departments = 'At least one Department must be selected.';
        if (!branchesValid) newErrors.branches = 'At least one Branch must be selected.';
        if (!teamsValid) newErrors.teams = 'At least one Team must be selected.';

        // Consolidated fallback (if triggered by specific logic, but requirements demand individual banners)
        // "If none of Department, Branch, or Team is selected, show a SINGLE consolidated error banner"
        // This implies if ALL are empty.
        if (!deptsValid && !branchesValid && !teamsValid) {
            // Override individual errors with consolidated one? Or show both?
            // "show a SINGLE consolidated error banner" -> So suppress individual ones.
            delete newErrors.departments;
            delete newErrors.branches;
            delete newErrors.teams;
            newErrors.org = 'Select at least one Department, Branch, or Team.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            // Mark all potential fields as touched so errors display
            setTouched({
                firstName: true, lastName: true, email: true, jobTitle: true, phone: true,
                role: true, reportsTo: true
            });

            // Focus first error
            const firstErrorField = Object.keys(newErrors)[0];
            if (firstErrorField) {
                const el = document.getElementById(firstErrorField);
                if (el) el.focus();
            }
            return;
        }

        // Prepare Payload
        const newUser = {
            ...formData,
            // Normalize Name
            firstName: formData.firstName.trim().replace(/\s+/g, ' '),
            lastName: formData.lastName.trim().replace(/\s+/g, ' '),
            email: formData.email.toLowerCase(),
            name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
            avatar: `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase(),
            // status is already set in state and non-editable
            lastActive: '—',
            department: formData.departments[0] || 'Unassigned', // Main dept for table display
            location: formData.branches[0] || 'Remote', // Main location
        };

        console.log("Saving User:", newUser);
        onSave(newUser, true); // true = send invite
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    return (
        <div className="flex flex-col w-full bg-slate-50 relative animate-in fade-in duration-300">
            {/* SUCCESS TOAST */}
            {showSuccessToast && (
                <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-right duration-300">
                    <CheckCircle size={24} className="text-white" />
                    <div>
                        <p className="font-bold text-sm">Success</p>
                        <p className="text-sm opacity-90">User has been created successfully and is pending activation.</p>
                    </div>
                </div>
            )}

            {/* --- HEADER --- */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-20 shadow-sm/50">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1.5">
                        <span className="hover:text-slate-800 cursor-pointer">Admin Console</span>
                        <span>/</span>
                        <span className="hover:text-slate-800 cursor-pointer" onClick={onCancel}>Users</span>
                        <span>/</span>
                        <span className="text-blue-600">{initialData ? 'Clone User' : 'Add User'}</span>
                    </div>
                    <h1 className="text-xl font-bold text-slate-900">{initialData ? 'Clone User' : 'Add New User'}</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-all">
                        <Save size={16} /> Save User
                    </button>
                </div>
            </div>

            <div className="p-8 pb-32">
                <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">

                    {/* LEFT COLUMN: IDENTITY & SECURITY (4 cols) */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Identity Card */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                                <User size={16} className="text-blue-500" /> Identity
                            </h3>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        id="firstName"
                                        label="First Name"
                                        req
                                        value={formData.firstName}
                                        onChange={e => handleChange('firstName', e.target.value)}
                                        onBlur={() => handleBlur('firstName')}
                                        error={errors.firstName}
                                    />
                                    <Input
                                        id="lastName"
                                        label="Last Name"
                                        req
                                        value={formData.lastName}
                                        onChange={e => handleChange('lastName', e.target.value)}
                                        onBlur={() => handleBlur('lastName')}
                                        error={errors.lastName}
                                    />
                                </div>
                                <Input
                                    id="email"
                                    label="Email Address"
                                    req
                                    type="email"
                                    value={formData.email}
                                    onChange={e => handleChange('email', e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                    error={errors.email}
                                />
                                <Input
                                    id="jobTitle"
                                    label="Job Title"
                                    value={formData.jobTitle}
                                    onChange={e => handleChange('jobTitle', e.target.value)}
                                    onBlur={() => handleBlur('jobTitle')}
                                    error={errors.jobTitle}
                                />
                                <Input
                                    id="phone"
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={e => handleChange('phone', e.target.value)}
                                    onBlur={() => handleBlur('phone')}
                                    placeholder="(555) 000-0000"
                                    error={errors.phone}
                                />
                            </div>
                        </section>

                        {/* Security Card */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-5 flex items-center gap-2">
                                <Shield size={16} className="text-emerald-500" /> Security & Access
                            </h3>

                            <div className="space-y-6">
                                {/* Informational Banner */}
                                <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                    <Info className="text-blue-600 shrink-0 mt-0.5" size={16} />
                                    <div>
                                        <p className="text-sm text-blue-800 font-medium">Pending Activation</p>
                                        <p className="text-xs text-blue-600 leading-relaxed mt-0.5">
                                            Users are created in a <span className="font-semibold">Pending Activation</span> state. They will become active after completing activation.
                                        </p>
                                    </div>
                                </div>

                                {/* User Type Selection */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700">User Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <label className={`
                                            flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all
                                            ${formData.userType === 'Internal' ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}
                                        `}>
                                            <input
                                                type="radio"
                                                name="userType"
                                                value="Internal"
                                                checked={formData.userType === 'Internal'}
                                                onChange={() => handleUserTypeChange('Internal')}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-medium ${formData.userType === 'Internal' ? 'text-blue-900' : 'text-slate-700'}`}>Internal</span>
                                                <span className="text-[10px] text-slate-500">Employee access</span>
                                            </div>
                                        </label>

                                        <label className={`
                                            flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all
                                            ${formData.userType === 'External' ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}
                                        `}>
                                            <input
                                                type="radio"
                                                name="userType"
                                                value="External"
                                                checked={formData.userType === 'External'}
                                                onChange={() => handleUserTypeChange('External')}
                                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                            />
                                            <div className="flex flex-col">
                                                <span className={`text-sm font-medium ${formData.userType === 'External' ? 'text-blue-900' : 'text-slate-700'}`}>External</span>
                                                <span className="text-[10px] text-slate-500">Partner/Vendor access</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Portal Access Toggle */}
                                <div className={`transition-opacity duration-200 ${formData.userType === 'Internal' ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
                                    <Toggle
                                        label="Portal Access"
                                        desc={formData.userType === 'Internal' ? "Not available for internal users" : "Allow access to external portal"}
                                        checked={formData.portalAccess}
                                        onChange={v => handleChange('portalAccess', v)}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* RIGHT COLUMN: ORG & PREFS (8 cols) */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">

                        {/* Organizational Card */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Building size={16} className="text-indigo-500" /> Organization
                            </h3>

                            {/* Section Level Errors */}
                            {(errors.org || errors.departments || errors.branches || errors.teams) && (
                                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 space-y-1">
                                    {errors.org && <div className="flex items-center gap-2"><AlertCircle size={16} className="shrink-0" /> {errors.org}</div>}
                                    {errors.departments && <div className="flex items-center gap-2"><AlertCircle size={16} className="shrink-0" /> {errors.departments}</div>}
                                    {errors.branches && <div className="flex items-center gap-2"><AlertCircle size={16} className="shrink-0" /> {errors.branches}</div>}
                                    {errors.teams && <div className="flex items-center gap-2"><AlertCircle size={16} className="shrink-0" /> {errors.teams}</div>}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <Select
                                    id="role"
                                    label="Role"
                                    req
                                    value={formData.role}
                                    options={roles}
                                    onChange={e => handleChange('role', e.target.value)}
                                    onBlur={() => handleBlur('role')}
                                    error={errors.role}
                                />

                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Reports To</label>
                                    <div className="relative">
                                        <select
                                            id="reportsTo"
                                            className={`w-full px-3 py-2 bg-white border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 transition-all ${errors.reportsTo ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                                            value={formData.reportsTo}
                                            onChange={e => handleChange('reportsTo', e.target.value)}
                                            onBlur={() => handleBlur('reportsTo')}
                                        >
                                            <option value="">Select Manager...</option>
                                            {existingUsers.map(u => (
                                                <option key={u.id} value={u.id}>{u.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                    {errors.reportsTo && <span className="text-xs text-red-500 flex items-center gap-1">{errors.reportsTo}</span>}
                                </div>

                                {/* Multi-Select Fields */}
                                <div className="md:col-span-2 space-y-6">
                                    <MultiSelect
                                        label="Departments"
                                        options={departmentOptions}
                                        selected={formData.departments}
                                        onToggle={item => toggleMultiSelect('departments', item)}
                                    />
                                    <MultiSelect
                                        label="Branches"
                                        options={branchOptions}
                                        selected={formData.branches}
                                        onToggle={item => toggleMultiSelect('branches', item)}
                                    />
                                    <MultiSelect
                                        label="Teams"
                                        options={teamOptions}
                                        selected={formData.teams}
                                        onToggle={item => toggleMultiSelect('teams', item)}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Preferences Card */}
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Globe size={16} className="text-purple-500" /> Preferences
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Select label="Locale" value={formData.locale} options={locales} onChange={e => handleChange('locale', e.target.value)} />
                                <Select label="Timezone" value={formData.timezone} options={timezones} onChange={e => handleChange('timezone', e.target.value)} />
                                <Select label="Date Format" value={formData.dateFormat} options={dateFormats} onChange={e => handleChange('dateFormat', e.target.value)} />
                                <Select label="Number Format" value={formData.numberFormat} options={numberFormats} onChange={e => handleChange('numberFormat', e.target.value)} />
                            </div>
                        </section>
                    </div>

                </div>
            </div>
        </div>
    );
};

// --- SUB-COMPONENTS ---

const Input = ({ label, req, error, ...props }) => (
    <div className="space-y-1.5 w-full">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {label} {req && <span className="text-red-500">*</span>}
        </label>
        <input
            className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 transition-all ${error ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
            type="text"
            {...props}
        />
        {error && <span className="text-xs text-red-500 flex items-center gap-1">{error}</span>}
    </div>
);

const Select = ({ label, req, options, error, ...props }) => (
    <div className="space-y-1.5 w-full">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
            {label} {req && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            <select
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm text-slate-800 appearance-none focus:bg-white focus:outline-none focus:ring-2 transition-all cursor-pointer ${error ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                {...props}
            >
                {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
        {error && <span className="text-xs text-red-500 flex items-center gap-1">{error}</span>}
    </div>
);

const Toggle = ({ label, desc, checked, onChange }) => (
    <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
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
        <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex justify-between">
                {label}
                <span className="text-[10px] font-normal text-slate-400">{selected.length} selected</span>
            </label>

            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="min-h-[42px] w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-wrap gap-1.5 cursor-pointer hover:bg-white hover:border-blue-300 transition-colors"
                >
                    {selected.length === 0 && <span className="text-sm text-slate-400 px-1 py-1">Select {label}...</span>}
                    {selected.map(item => (
                        <span key={item} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-700 shadow-sm">
                            {item}
                            <X size={12} className="text-slate-400 hover:text-red-500 cursor-pointer" onClick={(e) => { e.stopPropagation(); onToggle(item); }} />
                        </span>
                    ))}
                    <div className="ml-auto self-center px-1">
                        <PlusIcon isActive={isOpen} />
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

const PlusIcon = ({ isActive }) => (
    <svg
        width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={`text-slate-400 transition-transform ${isActive ? 'rotate-45' : ''}`}
    >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

export default AddUser;
