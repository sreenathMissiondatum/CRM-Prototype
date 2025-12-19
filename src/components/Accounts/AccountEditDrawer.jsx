import React, { useState, useEffect } from 'react';
import {
    X, Save, AlertTriangle, Lock, HelpCircle,
    Building2, MapPin, Phone, Briefcase,
    Users, Share2, FileCheck, Info,
    ChevronDown, ChevronUp, Check, Search
} from 'lucide-react';
import { createPortal } from 'react-dom';
import NAICSSelector from '../Shared/NAICSSelector';

const AccountEditDrawer = ({ isOpen, onClose, account, onSave }) => {
    // --- State ---
    const [formData, setFormData] = useState({});
    const [isDirty, setIsDirty] = useState(false);
    const [confirmClose, setConfirmClose] = useState(false);
    const [activeSections, setActiveSections] = useState({
        identity: true,
        industry: true,
        contact: true,
        ownership: false,
        relationship: false,
        compliance: false
    });

    // Initialize form when account changes
    useEffect(() => {
        if (account && isOpen) {
            setFormData({
                ...account,
                address: { ...account.address } // Deep copy for address
            });
            setIsDirty(false);
            setConfirmClose(false);
            // Reset sections? Optional
        }
    }, [account, isOpen]);

    // Handle Field Changes
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setIsDirty(true);
    };

    const handleAddressChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [field]: value }
        }));
        setIsDirty(true);
    };

    const handleFlagChange = (flag) => {
        const currentFlags = formData.flags || [];
        const newFlags = currentFlags.includes(flag)
            ? currentFlags.filter(f => f !== flag)
            : [...currentFlags, flag];

        setFormData(prev => ({ ...prev, flags: newFlags }));
        setIsDirty(true);
    };

    const handleNaicsSelect = (result) => {
        setFormData(prev => ({
            ...prev,
            naics: result.naicsCode,
            naicsSector: result.naicsTitle // Or mapped sector
        }));
        setIsDirty(true);
    };

    // Actions
    const handleClose = () => {
        if (isDirty && !confirmClose) {
            setConfirmClose(true);
            return;
        }
        onClose();
    };

    const handleSave = () => {
        if (!formData.name) return alert("Business Name is required");
        onSave(formData);
        onClose();
    };

    // Toggle Sections
    const toggleSection = (key) => {
        setActiveSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] transition-opacity"
                onClick={handleClose}
            ></div>

            {/* Drawer Panel */}
            <div className="relative w-full max-w-2xl h-full bg-slate-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* 1. Header */}
                <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Edit Account</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wide border border-emerald-200">
                                {formData.status || 'Active'}
                            </span>
                            <span className="text-xs text-slate-400">ID: {formData.id || 'ACC-12345'}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Dirty State Warning */}
                {confirmClose && (
                    <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 text-sm text-amber-800 font-medium">
                            <AlertTriangle size={16} />
                            Unsaved changes will be lost.
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setConfirmClose(false)}
                                className="text-xs font-bold text-slate-600 hover:text-slate-800"
                            >
                                Keep Editing
                            </button>
                            <button
                                onClick={onClose}
                                className="text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-200/50 px-3 py-1.5 rounded-md"
                            >
                                Discard Changes
                            </button>
                        </div>
                    </div>
                )}

                {/* 2. Main Scrollable Form */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Section 1: Business Identity */}
                    <Section
                        title="Business Identity"
                        icon={Building2}
                        isOpen={activeSections.identity}
                        onToggle={() => toggleSection('identity')}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Legal Business Name" required tooltip="Must match tax documents exactly.">
                                <input
                                    type="text"
                                    value={formData.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                />
                            </FormField>
                            <FormField label="DBA Name">
                                <input
                                    type="text"
                                    value={formData.dba || ''}
                                    onChange={(e) => handleChange('dba', e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                />
                            </FormField>
                            <FormField label="Entity Type">
                                <select
                                    value={formData.type || 'LLC'}
                                    onChange={(e) => handleChange('type', e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none bg-white font-medium text-slate-700"
                                >
                                    <option>Sole Proprietorship</option>
                                    <option>Limited Liability Company (LLC)</option>
                                    <option>C-Corporation</option>
                                    <option>S-Corporation</option>
                                    <option>Non-Profit (501c3)</option>
                                </select>
                            </FormField>
                            <FormField label="Employer ID (EIN)" locked reason="Locked: Associated with funding.">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.taxId || ''}
                                        readOnly
                                        className="w-full text-sm border border-slate-200 bg-slate-50 text-slate-500 rounded-lg px-3 py-2 outline-none cursor-not-allowed pl-8"
                                    />
                                    <Lock size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                                </div>
                            </FormField>
                            <FormField label="Date Established">
                                <input
                                    type="date"
                                    value={formData.established || ''}
                                    onChange={(e) => handleChange('established', e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none"
                                />
                            </FormField>
                            <FormField label="Years in Business" readOnly>
                                <input
                                    type="text"
                                    value={formData.yearsInBusiness || ''}
                                    readOnly
                                    className="w-full text-sm border border-slate-200 bg-slate-50 text-slate-500 rounded-lg px-3 py-2 outline-none"
                                />
                            </FormField>
                        </div>
                    </Section>

                    {/* Section 2: Industry & Location */}
                    <Section
                        title="Industry & Location"
                        icon={MapPin}
                        isOpen={activeSections.industry}
                        onToggle={() => toggleSection('industry')}
                    >
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <FormField label="NAICS Code">
                                    <NAICSSelector
                                        value={formData.naics ? `${formData.naics} ${formData.naicsSector ? '- ' + formData.naicsSector : ''}` : ''}
                                        onSelect={handleNaicsSelect}
                                        placeholderText="Search code or industry..."
                                    />
                                </FormField>
                                <FormField label="Sector (Auto-Filled)" readOnly>
                                    <input type="text" value={formData.naicsSector || ''} readOnly className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-500 rounded-lg px-3 py-2" />
                                </FormField>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Business Address</label>
                                <div className="grid grid-cols-6 gap-3">
                                    <div className="col-span-6">
                                        <input
                                            placeholder="Street Address"
                                            value={formData.address?.street || ''}
                                            onChange={(e) => handleAddressChange('street', e.target.value)}
                                            className="w-full text-sm border border-slate-300 rounded px-3 py-2"
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            placeholder="City"
                                            value={formData.address?.city || ''}
                                            onChange={(e) => handleAddressChange('city', e.target.value)}
                                            className="w-full text-sm border border-slate-300 rounded px-3 py-2"
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <input
                                            placeholder="State"
                                            value={formData.address?.state || ''}
                                            onChange={(e) => handleAddressChange('state', e.target.value)}
                                            className="w-full text-sm border border-slate-300 rounded px-3 py-2"
                                        />
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            placeholder="ZIP"
                                            value={formData.address?.zip || ''}
                                            onChange={(e) => handleAddressChange('zip', e.target.value)}
                                            className="w-full text-sm border border-slate-300 rounded px-3 py-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <FormField label="Census Tract" readOnly>
                                    <div className="text-sm font-mono text-slate-600 bg-slate-50 px-3 py-2 rounded border border-slate-200">
                                        {formData.censusTract || 'Checking...'}
                                    </div>
                                </FormField>
                                <div className="flex items-end pb-2">
                                    {formData.isLowIncome && (
                                        <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                                            <Info size={14} /> LIC Qualified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Section>

                    {/* Section 3: Contact */}
                    <Section
                        title="Contact & Communication"
                        icon={Phone}
                        isOpen={activeSections.contact}
                        onToggle={() => toggleSection('contact')}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Business Phone">
                                <input
                                    type="tel"
                                    value={formData.phone || ''}
                                    onChange={(e) => handleChange('phone', e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none"
                                />
                            </FormField>
                            <FormField label="Business Email">
                                <input
                                    type="email"
                                    value={formData.email || ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none"
                                />
                            </FormField>
                            <FormField label="Website">
                                <input
                                    type="url"
                                    value={formData.website || ''}
                                    onChange={(e) => handleChange('website', e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none"
                                />
                            </FormField>
                            <FormField label="Preferred Method">
                                <select className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none bg-white">
                                    <option>Email</option>
                                    <option>Phone</option>
                                    <option>Text / SMS</option>
                                </select>
                            </FormField>
                        </div>
                    </Section>

                    {/* Section 4: Ownership */}
                    <Section
                        title="Ownership & Certifications"
                        icon={Users}
                        isOpen={activeSections.ownership}
                        onToggle={() => toggleSection('ownership')}
                    >
                        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                            <h4 className="text-xs font-bold text-purple-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <Info size={14} /> Compliance & Impact Data
                            </h4>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-6">
                                {['Minority-Owned', 'Woman-Owned', 'Veteran-Owned', 'Native American-Owned', 'LGBTQ-Owned', 'Disability-Owned'].map(label => (
                                    <label key={label} className="flex items-center gap-3 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.flags?.includes(label) ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white border-purple-200'}`}>
                                            {formData.flags?.includes(label) && <Check size={14} />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData.flags?.includes(label) || false}
                                            onChange={() => handleFlagChange(label)}
                                            className="hidden"
                                        />
                                        <span className="text-sm text-slate-700 font-medium group-hover:text-purple-700 transition-colors">{label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </Section>

                    {/* Section 5: Relationship */}
                    <Section
                        title="Relationship & Referral"
                        icon={Share2}
                        isOpen={activeSections.relationship}
                        onToggle={() => toggleSection('relationship')}
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <FormField label="Active TA Client?">
                                <div className="flex bg-slate-100 rounded-lg p-1 w-fit">
                                    <button
                                        onClick={() => handleChange('isTaClient', true)}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${formData.isTaClient ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => handleChange('isTaClient', false)}
                                        className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${!formData.isTaClient ? 'bg-white text-slate-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        No
                                    </button>
                                </div>
                            </FormField>
                            <div className="col-span-2 grid grid-cols-2 gap-4">
                                <FormField label="Referral Source Type">
                                    <select className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white">
                                        <option>Partner Organization</option>
                                        <option>Bank Referral</option>
                                        <option>Client Referral</option>
                                    </select>
                                </FormField>
                                <FormField label="Referring Organization">
                                    <input type="text" value="Detroit Econ Club" className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2" />
                                </FormField>
                            </div>
                        </div>
                    </Section>

                    {/* Audit Footer (In-Flow) */}
                    <div className="mt-8 pt-8 border-t border-slate-100 text-xs text-slate-400 space-y-1">
                        <div className="flex justify-between">
                            <span>Created: Nov 15, 2023 by System</span>
                            <span>Last Modified: Dec 01, 2023 by Sarah Smith</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Account ID: {formData.id || 'ACC-12345'}</span>
                            <a href="#" className="text-blue-500 hover:underline">View Full Audit History</a>
                        </div>
                    </div>

                </div>

                {/* 3. Footer Actions */}
                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center shrink-0">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className={`
                            px-6 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-all flex items-center gap-2
                            ${isDirty ? 'bg-blue-600 hover:bg-blue-700 hover:shadow-md' : 'bg-slate-300 cursor-not-allowed'}
                        `}
                        disabled={!isDirty}
                    >
                        <Save size={16} />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// Helper Components
const Section = ({ title, icon: Icon, children, isOpen, onToggle }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <button
            onClick={onToggle}
            className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
        >
            <div className="flex items-center gap-3">
                <Icon size={18} className="text-slate-400" />
                <span className="font-bold text-slate-700">{title}</span>
            </div>
            {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>
        {isOpen && (
            <div className="p-5 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                <div className="h-px bg-slate-100 mb-5"></div>
                {children}
            </div>
        )}
    </div>
);

const FormField = ({ label, required, locked, reason, tooltip, children, readOnly, className = '' }) => (
    <div className={`space-y-1.5 ${className}`}>
        <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                {label}
                {required && <span className="text-red-500">*</span>}
            </label>
            {tooltip && (
                <div className="group relative">
                    <HelpCircle size={12} className="text-slate-400 cursor-help" />
                    <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        {tooltip}
                    </div>
                </div>
            )}
        </div>
        {children}
        {locked && (
            <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-1 rounded w-fit">
                <Lock size={10} /> {reason}
            </div>
        )}
    </div>
);

export default AccountEditDrawer;
