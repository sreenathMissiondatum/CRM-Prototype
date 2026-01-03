import React, { useState, useEffect } from 'react';
import {
    User, FileText, ArrowRight, Shield, Award, Clock, Camera, Mail, Phone, MapPin, Globe, Calendar, Briefcase, Lock, Edit2, Save, X, CheckCircle, AlertCircle
} from 'lucide-react';
// import ImpactRecap from './ImpactRecap';

const UserProfile = ({ user, onUpdateProfile }) => {
    const [showRecap, setShowRecap] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);

    // Initialize form data when user prop changes or edit mode starts
    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                altEmail: user.altEmail || '',
                location: user.location || '',
                timezone: user.timezone || '',
                locale: user.locale || '',
                profilePhotoUrl: user.profilePhotoUrl || ''
            });
        }
    }, [user, isEditing]);

    const handleEditToggle = () => {
        if (isEditing) {
            // Cancelled
            setIsEditing(false);
            setErrors({});
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                phone: user.phone || '',
                altEmail: user.altEmail || '',
                location: user.location || '',
                timezone: user.timezone || '',
                locale: user.locale || '',
                profilePhotoUrl: user.profilePhotoUrl || ''
            });
        } else {
            setIsEditing(true);
            setShowSuccess(false);
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';

        // Basic Phone Validation (North America format for demo)
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (formData.phone && !phoneRegex.test(formData.phone)) {
            newErrors.phone = 'Invalid phone number format (e.g., 555-123-4567)';
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.altEmail) {
            if (!emailRegex.test(formData.altEmail)) {
                newErrors.altEmail = 'Invalid email address';
            }
            if (formData.altEmail.toLowerCase() === user.email.toLowerCase()) {
                newErrors.altEmail = 'Alternate email cannot be the same as primary login email';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for field on change
        if (errors[field]) {
            setErrors(prev => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Size check (e.g. 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size exceeds 2MB limit.');
                return;
            }

            // Mock upload by creating local URL
            const url = URL.createObjectURL(file);
            handleChange('profilePhotoUrl', url);
        }
    };

    const handleSave = () => {
        if (validate()) {
            onUpdateProfile(formData);
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
        }
    };

    // if (showRecap) {
    //     return <ImpactRecap onClose={() => setShowRecap(false)} />;
    // }

    if (!user) return <div className="p-8">Loading profile...</div>;

    const InputField = ({ label, field, type = 'text', required = false, placeholder, options }) => (
        <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {isEditing ? (
                <div>
                    {type === 'select' ? (
                        <div className="relative">
                            <select
                                value={formData[field]}
                                onChange={(e) => handleChange(field, e.target.value)}
                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 appearance-none transition-all ${errors[field] ? 'border-red-300 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`}
                            >
                                <option value="">Select...</option>
                                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                            </div>
                        </div>
                    ) : (
                        <input
                            type={type}
                            value={formData[field]}
                            onChange={(e) => handleChange(field, e.target.value)}
                            placeholder={placeholder}
                            className={`w-full px-3 py-2 bg-white border rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 transition-all ${errors[field] ? 'border-red-300 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`}
                        />
                    )}
                    {errors[field] && <p className="text-xs text-red-500 mt-1">{errors[field]}</p>}
                </div>
            ) : (
                <div className="text-sm font-medium text-slate-900 py-2 border-b border-transparent min-h-[38px] flex items-center">
                    {field === 'altEmail' && !formData[field] ? <span className="text-slate-400 italic">Not set</span> : formData[field]}
                </div>
            )}
        </div>
    );

    const ReadOnlySystemField = ({ label, value, icon: Icon, tooltip }) => (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between group relative">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-md border border-slate-100 text-slate-400 shrink-0">
                    <Icon size={16} />
                </div>
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block mb-0.5">{label}</label>
                    <div className="text-sm font-semibold text-slate-700">{value}</div>
                </div>
            </div>
            <div className="text-slate-400">
                <Lock size={14} />
            </div>
            {tooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 w-max max-w-[200px] text-center">
                    {tooltip}
                    <div className="absolute left-1/2 top-full -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500 pb-20">

            {/* Success Toast */}
            {showSuccess && (
                <div className="fixed top-24 right-8 z-50 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-in slide-in-from-right-10 fade-out duration-500">
                    <CheckCircle size={20} />
                    <div>
                        <p className="font-bold text-sm">Profile Updated</p>
                        <p className="text-xs opacity-90">Your changes have been saved successfully.</p>
                    </div>
                </div>
            )}

            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row items-start gap-8 relative overflow-hidden">

                {/* Edit Controls */}
                <div className="absolute top-8 right-8 flex items-center gap-2">
                    {isEditing ? (
                        <>
                            <button onClick={handleEditToggle} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2">
                                <X size={16} /> Cancel
                            </button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all flex items-center gap-2">
                                <Save size={16} /> Save Changes
                            </button>
                        </>
                    ) : (
                        <button onClick={handleEditToggle} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2">
                            <Edit2 size={16} /> Edit Profile
                        </button>
                    )}
                </div>

                <div className="relative group shrink-0">
                    <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg overflow-hidden relative">
                        {isEditing ? (
                            formData.profilePhotoUrl ? (
                                <img src={formData.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-3xl font-bold">
                                    {formData.firstName?.[0]}{formData.lastName?.[0]}
                                </div>
                            )
                        ) : (
                            user.profilePhotoUrl ? (
                                <img src={user.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-3xl font-bold">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                </div>
                            )
                        )}

                        {/* Photo Overlay in Edit Mode */}
                        {isEditing && (
                            <label className="absolute inset-0 bg-slate-900/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="text-white flex flex-col items-center gap-1">
                                    <Camera size={24} />
                                    <span className="text-[10px] font-bold uppercase tracking-wider">Change</span>
                                </div>
                                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                            </label>
                        )}
                    </div>
                </div>

                <div className="flex-1 mt-2">
                    {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg">
                            <InputField label="First Name" field="firstName" required />
                            <InputField label="Last Name" field="lastName" required />
                            <div className="md:col-span-2">
                                <InputField label="Current Role" field="jobTitle" required />
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">{user.firstName} {user.lastName}</h1>
                            <p className="text-lg text-slate-500 font-medium flex items-center gap-2">
                                <Briefcase size={18} /> {user.jobTitle}
                                <span className="text-slate-300">•</span>
                                <span className="text-slate-500">{user.department}</span>
                            </p>
                        </div>
                    )}

                    {!isEditing && (
                        <div className="flex flex-wrap gap-6 mt-6">
                            <div className="flex items-center gap-2 text-slate-600">
                                <Shield size={18} className="text-blue-500" />
                                <span className="text-sm font-medium">{user.role} Access</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Award size={18} className="text-amber-500" />
                                <span className="text-sm">Top Performer (Q3)</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                                <Clock size={18} className="text-emerald-500" />
                                <span className="text-sm">Active since {new Date().getFullYear() - 2}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left Column: Editable Details */}
                <div className="lg:col-span-7 space-y-8">

                    {/* Contact Info */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <User size={16} className="text-indigo-500" /> Personal Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <div className="space-y-1.5 opacity-60">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                                        Primary Email <Lock size={10} />
                                    </label>
                                    <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 font-mono">
                                        {user.email}
                                    </div>
                                    <p className="text-[10px] text-slate-400">Used for login. Contact IT to change.</p>
                                </div>
                            </div>
                            <InputField label="Mobile Number" field="phone" placeholder="(555) 000-0000" />
                            <InputField label="Alternate Email" field="altEmail" placeholder="personal@email.com" />
                            <div className="md:col-span-2">
                                <InputField label="Location / Branch" field="location" />
                            </div>
                        </div>
                    </section>

                    {/* Regional Settings */}
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-slate-100 pb-3">
                            <Globe size={16} className="text-teal-500" /> Regional Settings
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputField
                                label="Time Zone"
                                field="timezone"
                                type="select"
                                options={['UTC-8 (PST)', 'UTC-5 (EST)', 'UTC+0 (GMT)', 'UTC+1 (CET)']}
                            />
                            <InputField
                                label="Locale / Language"
                                field="locale"
                                type="select"
                                options={['en-US', 'es-US', 'fr-CA', 'en-GB']}
                            />
                        </div>
                    </section>

                    {/* My Hits & Misses (Existing Feature) */}
                    <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-semibold tracking-wider uppercase mb-2 text-blue-200">
                                    <FileText size={10} /> New Feature
                                </div>
                                <h2 className="text-xl font-bold mb-2 font-serif relative">
                                    My Hits & Misses
                                </h2>
                                <p className="text-blue-100 text-sm opacity-80 max-w-sm">
                                    Explore a reflective narrative of your year. Uncover hidden patterns in your work.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowRecap(true)}
                                className="px-5 py-2.5 bg-white text-blue-900 rounded-lg font-bold text-sm shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300 shrink-0"
                            >
                                Open Recap
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: System (Read Only) */}
                <div className="lg:col-span-5 space-y-8">
                    <section className="bg-slate-50 rounded-xl border border-slate-200 p-6 sticky top-24">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-slate-200 pb-3">
                            <Lock size={16} className="text-slate-500" /> Account System
                        </h3>

                        <div className="space-y-4">
                            <ReadOnlySystemField
                                label="System Role"
                                value={user.role}
                                icon={Shield}
                                tooltip="Determines your baseline permissions."
                            />
                            <ReadOnlySystemField
                                label="Department"
                                value={user.department}
                                icon={Briefcase}
                                tooltip="Your assigned organizational unit."
                            />
                            <ReadOnlySystemField
                                label="Account Status"
                                value={user.status}
                                icon={CheckCircle}
                                tooltip="Current login eligibility."
                            />
                        </div>

                        <div className="mt-8">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Assigned Permissions</h4>
                            <div className="flex flex-wrap gap-2">
                                {user.permissions?.map(p => (
                                    <span key={p} className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-medium text-slate-600 shadow-sm">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-200">
                            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                                <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
                                <div className="text-xs text-blue-800">
                                    <span className="font-bold block mb-1">Need access changes?</span>
                                    Contact your System Administrator to request role changes or additional permissions.
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
