import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { X, User, Mail, Building, Briefcase, Users, Phone, Check, AlertCircle, ChevronDown, Search, Shield } from 'lucide-react';

const AddUserModal = ({ isOpen, onClose, onSave, existingUsers = [] }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        department: '',
        branch: '',
        team: '',
        reportsTo: '',
        status: 'Active',
        phone: '',
        sendInvite: true
    });

    const [errors, setErrors] = useState({});
    const [isReportsToOpen, setIsReportsToOpen] = useState(false);
    const [reportsToSearch, setReportsToSearch] = useState('');

    // Reset form on open
    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                role: '',
                department: '',
                branch: '',
                team: '',
                reportsTo: '',
                status: 'Active',
                phone: '',
                sendInvite: true
            });
            setErrors({});
            setMessages([]);
        }
    }, [isOpen]);

    // Validation Logic
    const validateField = (name, value) => {
        let error = '';
        switch (name) {
            case 'firstName':
                if (!value.trim()) error = 'First name is required';
                break;
            case 'lastName':
                if (!value.trim()) error = 'Last name is required';
                break;
            case 'email':
                if (!value.trim()) {
                    error = 'Email is required';
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = 'Invalid email format';
                } else if (existingUsers.some(u => u.email.toLowerCase() === value.toLowerCase())) {
                    error = 'Email already exists';
                }
                break;
            case 'role':
                if (!value) error = 'Role is required';
                break;
            default:
                break;
        }
        return error;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData(prev => ({ ...prev, [name]: val }));

        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleSubmit = () => {
        // Validate all
        const newErrors = {};
        ['firstName', 'lastName', 'email', 'role'].forEach(field => {
            const error = validateField(field, formData[field]);
            if (error) newErrors[field] = error;
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Prepare User Object
        const newUser = {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            role: formData.role,
            status: formData.status,
            department: formData.department || 'Unassigned',
            location: formData.branch || 'Remote',
            avatar: `${formData.firstName[0]}${formData.lastName[0]}`.toUpperCase(),
            phone: formData.phone || '',
            lastActive: '—' // New users haven't logged in
        };

        onSave(newUser, formData.sendInvite);
        onClose();
    };

    // Filtered Users for "Reports To"
    const filteredManagers = useMemo(() => {
        return existingUsers.filter(u =>
            u.name.toLowerCase().includes(reportsToSearch.toLowerCase()) ||
            u.role.toLowerCase().includes(reportsToSearch.toLowerCase())
        );
    }, [existingUsers, reportsToSearch]);

    // Data Lists
    const roles = ['Admin', 'Loan Officer', 'Underwriter', 'Processor', 'Manager'];
    const departments = ['Sales', 'Operations', 'Risk', 'Executive', 'IT', 'Marketing'];
    const branches = ['New York, NY', 'Austin, TX', 'Chicago, IL', 'San Francisco, CA', 'Miami, FL', 'Remote'];
    const teams = ['Team Alpha', 'Team Beta', 'Team Gamma', 'Mortgage Ops', 'Risk A'];

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Add New User</h2>
                        <p className="text-sm text-slate-500 mt-1">Create a new account and assign permissions.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Scrollable Form Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="space-y-8">

                        {/* SECTION: USER INFORMATION */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <User size={14} /> User Information
                            </h3>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">First Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="e.g. Jane"
                                        className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.firstName ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                                    />
                                    {errors.firstName && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.firstName}</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Last Name <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="e.g. Doe"
                                        className={`w-full px-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.lastName ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                                    />
                                    {errors.lastName && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.lastName}</span>}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="jane.doe@acmelending.com"
                                        className={`w-full pl-10 pr-3 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                                    />
                                </div>
                                {errors.email && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Role <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            name="role"
                                            value={formData.role}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`w-full px-3 py-2 bg-white border rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 transition-all cursor-pointer ${errors.role ? 'border-red-300 focus:ring-red-100' : 'border-slate-200 focus:ring-blue-100 focus:border-blue-400'}`}
                                        >
                                            <option value="">Select Role...</option>
                                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                    {errors.role && <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle size={10} /> {errors.role}</span>}
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Department</label>
                                    <div className="relative">
                                        <select
                                            name="department"
                                            value={formData.department}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer"
                                        >
                                            <option value="">Select Department...</option>
                                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Branch</label>
                                    <div className="relative">
                                        <select
                                            name="branch"
                                            value={formData.branch}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer"
                                        >
                                            <option value="">Select Branch...</option>
                                            {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Team</label>
                                    <div className="relative">
                                        <select
                                            name="team"
                                            value={formData.team}
                                            onChange={handleChange}
                                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all cursor-pointer"
                                        >
                                            <option value="">Select Team...</option>
                                            {teams.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5 relative">
                                <label className="text-sm font-semibold text-slate-700">Reports To</label>
                                <div
                                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm flex items-center justify-between cursor-pointer focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400"
                                    onClick={() => setIsReportsToOpen(!isReportsToOpen)}
                                >
                                    {formData.reportsTo ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                                {existingUsers.find(u => u.id === formData.reportsTo)?.avatar}
                                            </div>
                                            <span>{existingUsers.find(u => u.id === formData.reportsTo)?.name}</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-400">Select Manager...</span>
                                    )}
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${isReportsToOpen ? 'rotate-180' : ''}`} />
                                </div>

                                {isReportsToOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsReportsToOpen(false)}></div>
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-2">
                                            <div className="p-2 border-b border-slate-100 sticky top-0 bg-white">
                                                <div className="relative">
                                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                    <input
                                                        type="text"
                                                        placeholder="Search users..."
                                                        className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:border-blue-400"
                                                        value={reportsToSearch}
                                                        onChange={e => setReportsToSearch(e.target.value)}
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>
                                            <div className="overflow-y-auto p-1">
                                                {filteredManagers.length === 0 ? (
                                                    <div className="text-xs text-slate-400 p-3 text-center">No users found</div>
                                                ) : (
                                                    filteredManagers.map(user => (
                                                        <div
                                                            key={user.id}
                                                            onClick={() => {
                                                                setFormData(prev => ({ ...prev, reportsTo: user.id }));
                                                                setIsReportsToOpen(false);
                                                            }}
                                                            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer text-sm ${formData.reportsTo === user.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'}`}
                                                        >
                                                            <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500">
                                                                {user.avatar}
                                                            </div>
                                                            <div>
                                                                <div className="font-medium">{user.name}</div>
                                                                <div className="text-[10px] text-slate-400">{user.role}</div>
                                                            </div>
                                                            {formData.reportsTo === user.id && <Check size={14} className="ml-auto text-blue-600" />}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {!formData.reportsTo && (
                                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                                        <AlertCircle size={10} /> User will not appear in reporting hierarchy until a manager is assigned.
                                    </p>
                                )}
                            </div>
                        </section>

                        <div className="h-px bg-slate-100"></div>

                        {/* SECTION: ACCOUNT SETTINGS */}
                        <section className="space-y-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                <Briefcase size={14} /> Account Settings
                            </h3>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-slate-700">Phone Number (Optional)</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="(555) 123-4567"
                                            className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3 pt-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700">Account Status</span>
                                        <button
                                            onClick={() => setFormData(prev => ({ ...prev, status: prev.status === 'Active' ? 'Inactive' : 'Active' }))}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${formData.status === 'Active' ? 'bg-blue-600' : 'bg-slate-200'}`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.status === 'Active' ? 'translate-x-6' : 'translate-x-1'}`}
                                            />
                                        </button>
                                    </div>

                                    <label className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all ${formData.sendInvite ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
                                        <div className="pt-0.5">
                                            <input
                                                type="checkbox"
                                                checked={formData.sendInvite}
                                                onChange={(e) => setFormData(prev => ({ ...prev, sendInvite: e.target.checked }))}
                                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-900">Send Welcome Email</div>
                                            <div className="text-xs text-slate-500 mt-0.5">Automatically send login instructions and password setup link to the user.</div>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.firstName || !formData.lastName || !formData.email || !formData.role}
                        className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        <Check size={16} /> Create User
                    </button>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: #cbd5e1;
                  border-radius: 20px;
                }
            `}</style>
        </div>,
        document.body
    );
};

// Simple visual components not used by the main app can be helper functions or just inline
const setMessages = () => { }; // Dummy helper to match reset logic structure if needed.

export default AddUserModal;
