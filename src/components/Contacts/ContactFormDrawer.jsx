import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    X, Save, User, Building2, ShieldCheck,
    CreditCard, History, AlertTriangle, ChevronDown,
    ChevronUp, Eye, EyeOff, Lock, Info, Briefcase, BadgeCheck
} from 'lucide-react';

const ContactFormDrawer = ({ isOpen, onClose, initialData, onSave, currentPrimaryName, isFirstContact }) => {
    // --- State ---
    const [formData, setFormData] = useState({
        recordType: 'Borrower / Owner', // Default
        isPrimaryContact: false,
        firstName: '',
        lastName: '',
        title: '',
        status: 'Active',
        portalUser: false,
        email: '',
        phone: '',
        preferredMethod: 'Email',
        ownershipPercentage: 0,
        yearsIndustry: '',
        yearsOwnership: '',
        race: [],
        ethnicity: [],
        gender: '',
        veteran: '',
        disability: '',
        dob: '',
        ssn: '', // Masked

        annualIncome: '',
        // Other Business
        otherBusinessOwnership: false,
        otherBusPercentage_owner1: 0,
        otherBusDescription_owner1: '',
        // Address & Housing
        homeAddress: '',
        monthlyHousingPayment: '',

        // Demographics Expanded
        demographicSource: '', // Applicant Provided vs Visual Observation
        lmiHouseholdStatus: '', // Calculated via HUD tables (Manual override for now)

        // Credit & Financial
        creditScore: '',
        creditReportDate: '',
        creditScoreRange: '',
        creditPullConsentTimestamp: null,

        // Audit
        id: 'NEW',
        createdDate: new Date().toISOString(),
        createdBy: 'System User'
    });

    const [expandedSections, setExpandedSections] = useState({
        identity: true,
        contact: true,
        ownership: true,
        otherBusiness: true,
        demographics: false,
        financial: false,
        audit: false
    });

    const [showSSN, setShowSSN] = useState(false);
    const [showPrimaryConfirm, setShowPrimaryConfirm] = useState(false);
    const [touched, setTouched] = useState({});

    // --- Effects ---
    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(prev => ({ ...prev, ...initialData }));
        } else if (isOpen && !initialData) {
            // Reset for New Contact
            setFormData({
                recordType: 'Borrower / Owner',
                isPrimaryContact: !!isFirstContact, // Default true if first
                firstName: '',
                lastName: '',
                title: '',
                status: 'Active',
                portalUser: false,
                email: '',
                phone: '',
                preferredMethod: 'Email',
                ownershipPercentage: 0,
                yearsIndustry: '',
                yearsOwnership: '',
                race: [],
                ethnicity: [],
                gender: '',
                veteran: '',
                disability: '',
                dob: '',
                ssn: '',

                annualIncome: '',
                otherBusinessOwnership: false,
                otherBusPercentage_owner1: 0,
                otherBusDescription_owner1: '',
                homeAddress: '',
                monthlyHousingPayment: '',
                demographicSource: '',
                lmiHouseholdStatus: '',
                creditScore: '',
                creditReportDate: '',
                creditScoreRange: '',
                creditPullConsentTimestamp: null,
                id: 'NEW',
                createdDate: new Date().toISOString(),
                createdBy: 'System User'
            });
        }
    }, [isOpen, initialData, isFirstContact]);

    useEffect(() => {
        if (isOpen) {
            // Lock scroll
            document.body.style.overflow = 'hidden';
            return () => { document.body.style.overflow = 'unset'; };
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- Helpers ---
    const isBorrower = formData.recordType === 'Owner';

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const handlePrimaryChange = (e) => {
        const isChecked = e.target.checked;
        if (isChecked && currentPrimaryName && !initialData?.isPrimaryContact) {
            // Attempting to set as primary when one exists
            setShowPrimaryConfirm(true);
        } else {
            handleChange('isPrimaryContact', isChecked);
        }
    };

    const confirmPrimaryChange = () => {
        handleChange('isPrimaryContact', true);
        setShowPrimaryConfirm(false);
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const handleSave = () => {
        if (!formData.firstName || !formData.lastName) {
            alert('Name is required');
            return;
        }

        // Validation for Other Business Ownership
        if (formData.otherBusinessOwnership) {
            const pct = parseFloat(formData.otherBusPercentage_owner1);
            if (pct < 0 || pct > 100) {
                alert('Other Business Ownership Percentage must be between 0 and 100');
                return;
            }
            if (pct > 0 && !formData.otherBusDescription_owner1?.trim()) {
                alert('Description is required when Other Business Ownership Percentage is greater than 0');
                return;
            }
        }

        onSave(formData);
        onClose();
    };

    // --- Render Components ---
    const SectionHeader = ({ id, title, icon: Icon, expanded }) => (
        <button
            onClick={() => toggleSection(id)}
            className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 hover:bg-slate-100 transition-colors"
        >
            <div className="flex items-center gap-3">
                <Icon size={18} className="text-slate-500" />
                <span className="font-bold text-slate-700 uppercase text-sm tracking-wide">{title}</span>
            </div>
            {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </button>
    );

    const DrawerContent = (
        <div className="fixed inset-0 z-[60] flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

            {/* Drawer */}
            <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                            {initialData ? <User size={20} /> : <User size={20} />}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {initialData ? 'Edit Contact' : 'New Contact'}
                            </h2>
                            <div className="text-xs text-slate-500 flex items-center gap-1">
                                {initialData ? `ID: ${initialData.id}` : 'Draft Record'}
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                {formData.recordType}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto">

                    {/* 1. Core Identity */}
                    <div className="border-b border-slate-200">
                        <SectionHeader id="identity" title="Core Identity" icon={User} expanded={expandedSections.identity} />
                        {expandedSections.identity && (
                            <div className="p-6 grid grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                <FormSelect
                                    label="Record Type"
                                    required
                                    value={formData.recordType}
                                    onChange={v => handleChange('recordType', v)}
                                    options={['Owner', 'Partner / Referral Agent', 'Board / Committee Member', 'Investor / Donor', 'Vendor']}
                                />
                                <FormSelect
                                    label="Status"
                                    value={formData.status}
                                    onChange={v => handleChange('status', v)}
                                    options={['Active', 'Inactive', 'Deceased', 'Do Not Contact']}
                                />
                                <FormInput label="First Name" required value={formData.firstName} onChange={v => handleChange('firstName', v)} />
                                <FormInput label="Last Name" required value={formData.lastName} onChange={v => handleChange('lastName', v)} />


                                <FormInput label="Job Title" value={formData.title} onChange={v => handleChange('title', v)} />

                                {/* Primary Contact Logic */}
                                <div className="col-span-2 pt-2 border-t border-slate-100 mt-2">
                                    <div className="flex items-start gap-3">
                                        <div className="pt-0.5">
                                            <input
                                                type="checkbox"
                                                id="isPrimary"
                                                checked={formData.isPrimaryContact}
                                                onChange={handlePrimaryChange}
                                                disabled={isFirstContact || (initialData?.isPrimaryContact && formData.isPrimaryContact)}
                                                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="isPrimary" className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                Primary Contact
                                                {formData.isPrimaryContact && <BadgeCheck size={14} className="text-blue-600" />}
                                            </label>

                                            {isFirstContact ? (
                                                <p className="text-xs text-blue-600 mt-1">This contact is the Primary Contact because no other contacts exist.</p>
                                            ) : (
                                                <p className="text-xs text-slate-500 mt-1">
                                                    {formData.isPrimaryContact
                                                        ? "Primary contact for this account."
                                                        : "Set this person as the primary contact?"}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 h-full pt-6">
                                    <input
                                        type="checkbox"
                                        id="portalUser"
                                        checked={formData.portalUser}
                                        onChange={e => handleChange('portalUser', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor="portalUser" className="text-sm font-medium text-slate-700">Enable Portal Access</label>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 2. Contact Info */}
                    <div className="border-b border-slate-200">
                        <SectionHeader id="contact" title="Contact Information" icon={Building2} expanded={expandedSections.contact} />
                        {expandedSections.contact && (
                            <div className="p-6 grid grid-cols-2 gap-6">
                                <FormInput label="Email" type="email" required value={formData.email} onChange={v => handleChange('email', v)} />
                                <FormInput label="Phone" type="tel" value={formData.phone} onChange={v => handleChange('phone', v)} />
                                <FormSelect
                                    label="Preferred Method"
                                    value={formData.preferredMethod}
                                    onChange={v => handleChange('preferredMethod', v)}
                                    options={['Email', 'Phone', 'Text', 'Mail']}
                                />
                                {isBorrower && (
                                    <div className="col-span-2">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-1">
                                                <FormInput label="Home Address (Confidential)" value={formData.homeAddress} onChange={v => handleChange('homeAddress', v)} />
                                                <div className="mt-1 text-xs text-slate-400 flex items-center gap-1">
                                                    <Lock size={10} /> Address masked after save
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* 3. Ownership (Borrower Only) */}
                    {isBorrower && (
                        <div className="border-b border-slate-200">
                            <SectionHeader id="ownership" title="Ownership & Relationship" icon={ShieldCheck} expanded={expandedSections.ownership} />
                            {expandedSections.ownership && (
                                <div className="p-6 grid grid-cols-2 gap-6 bg-amber-50/30">
                                    <FormInput
                                        label="Ownership %"
                                        type="number"
                                        value={formData.ownershipPercentage}
                                        onChange={v => handleChange('ownershipPercentage', v)}
                                        highlight={formData.ownershipPercentage < 51 ? 'warning' : ''}
                                    />
                                    <div className="col-span-1 pt-6 text-xs text-amber-600 font-medium">
                                        * Validated against Account Total
                                    </div>
                                    <FormInput label="Years Industry Exp." type="number" value={formData.yearsIndustry} onChange={v => handleChange('yearsIndustry', v)} />
                                    <FormInput label="Years Ownership Exp." type="number" value={formData.yearsOwnership} onChange={v => handleChange('yearsOwnership', v)} />
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3.1 Other Business Ownership (Borrower Only) */}
                    {isBorrower && (
                        <div className="border-b border-slate-200">
                            <SectionHeader id="otherBusiness" title="Other Business Ownership" icon={Briefcase} expanded={expandedSections.otherBusiness} />
                            {expandedSections.otherBusiness && (
                                <div className="p-6 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <label className="text-sm font-bold text-slate-700">Does this contact have ownership in other businesses?</label>
                                        <div className="flex bg-slate-100 p-1 rounded-lg">
                                            <button
                                                onClick={() => handleChange('otherBusinessOwnership', true)}
                                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${formData.otherBusinessOwnership ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleChange('otherBusinessOwnership', false);
                                                    handleChange('otherBusPercentage_owner1', 0);
                                                    handleChange('otherBusDescription_owner1', '');
                                                }}
                                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${!formData.otherBusinessOwnership ? 'bg-slate-400 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                            >
                                                No
                                            </button>
                                        </div>
                                    </div>

                                    {formData.otherBusinessOwnership && (
                                        <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-top-2 duration-200 pl-4 border-l-2 border-blue-100">
                                            <div className="w-1/2 pr-3">
                                                <FormInput
                                                    label="Percentage Ownership in Other Businesses"
                                                    type="number"
                                                    value={formData.otherBusPercentage_owner1}
                                                    onChange={v => handleChange('otherBusPercentage_owner1', v)}
                                                    highlight={formData.otherBusPercentage_owner1 > 100 ? 'warning' : ''}
                                                />
                                                <p className="text-xs text-slate-400 mt-1">Approximate percentage of ownership held across other businesses.</p>
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1 mb-1">
                                                    Description of Other Businesses
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.otherBusDescription_owner1}
                                                    onChange={(e) => handleChange('otherBusDescription_owner1', e.target.value)}
                                                    placeholder="e.g. 50% owner in ABC Logistics LLC (freight transport), minority partner in retail grocery venture."
                                                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* 4. Demographics (1071) (Borrower Only) */}
                    {isBorrower && (
                        <div className="border-b border-slate-200">
                            <SectionHeader id="demographics" title="Demographics (Section 1071)" icon={User} expanded={expandedSections.demographics} />
                            {expandedSections.demographics && (
                                <div className="p-6 space-y-4">
                                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2">
                                        <Info size={16} className="text-blue-600 mt-0.5" />
                                        <p className="text-xs text-blue-800">
                                            **Regulatory Requirement:** Field responses are voluntary for the applicant but collection is mandatory for the lender under Section 1071.
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <FormSelect label="Race" value={formData.race[0]} onChange={v => handleChange('race', [v])} options={['American Indian', 'Asian', 'Black or African American', 'White', 'Prefer not to say']} />
                                        <FormSelect label="Ethnicity" value={formData.ethnicity[0]} onChange={v => handleChange('ethnicity', [v])} options={['Hispanic or Latino', 'Not Hispanic or Latino', 'Prefer not to say']} />
                                        <FormSelect label="Gender" value={formData.gender} onChange={v => handleChange('gender', v)} options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} />
                                        <FormSelect label="Veteran Status" value={formData.veteran} onChange={v => handleChange('veteran', v)} options={['Veteran', 'Non-Veteran', 'Prefer not to say']} />

                                        <FormSelect
                                            label="Demographic Source"
                                            value={formData.demographicSource}
                                            onChange={v => handleChange('demographicSource', v)}
                                            options={['Applicant Provided', 'Visual Observation']}
                                        />

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">LMI Household Status</label>
                                            <select
                                                value={formData.lmiHouseholdStatus}
                                                onChange={(e) => handleChange('lmiHouseholdStatus', e.target.value)}
                                                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 bg-slate-50"
                                            >
                                                <option value="">Auto-Calculated...</option>
                                                <option value="Low">Low</option>
                                                <option value="Moderate">Moderate</option>
                                                <option value="Middle">Middle</option>
                                                <option value="Upper">Upper</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}



                    {/* 5. Credit & Financial (Borrower Only) */}
                    {isBorrower && (
                        <div className="border-b border-slate-200">
                            <SectionHeader id="financial" title="Credit & Financial Profile" icon={CreditCard} expanded={expandedSections.financial} />
                            {expandedSections.financial && (
                                <div className="p-6 space-y-6 bg-slate-50">
                                    <div className="grid grid-cols-2 gap-6">
                                        <FormInput label="Date of Birth" type="date" value={formData.dob} onChange={v => handleChange('dob', v)} />
                                        <div className="relative">
                                            <FormInput
                                                label="SSN"
                                                type={showSSN ? 'text' : 'password'}
                                                value={formData.ssn}
                                                onChange={v => handleChange('ssn', v)}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSSN(!showSSN)}
                                                className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
                                            >
                                                {showSSN ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Credit Report Section */}
                                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                                <ShieldCheck size={16} className="text-emerald-600" /> Credit Report Data
                                            </h4>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={!!formData.creditPullConsentTimestamp}
                                                    onChange={(e) => handleChange('creditPullConsentTimestamp', e.target.checked ? new Date().toISOString() : null)}
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-xs font-bold text-slate-600 uppercase">Consent on File</span>
                                            </label>
                                        </div>

                                        {formData.creditPullConsentTimestamp ? (
                                            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                                                <FormInput label="Credit Score" type="number" value={formData.creditScore} onChange={v => handleChange('creditScore', v)} />
                                                <FormInput label="Report Date" type="date" value={formData.creditReportDate} onChange={v => handleChange('creditReportDate', v)} />
                                                <FormSelect
                                                    label="Score Range"
                                                    value={formData.creditScoreRange}
                                                    onChange={v => handleChange('creditScoreRange', v)}
                                                    options={['Below 600', '600-640', '640-740', 'Above 740']}
                                                />
                                                <div className="pt-6 text-xs text-slate-400 italic">
                                                    * Stored encrypted. Audit log generated on view/edit.
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-slate-50 border border-slate-100 rounded text-center text-slate-500 text-sm italic">
                                                Credit data collection is disabled until "Consent on File" is verified.
                                            </div>
                                        )}
                                    </div>

                                    <FormInput label="Annual Household Income" type="number" value={formData.annualIncome} onChange={v => handleChange('annualIncome', v)} />
                                    <FormInput
                                        label="Monthly Housing Payment"
                                        type="number"
                                        value={formData.monthlyHousingPayment}
                                        onChange={v => handleChange('monthlyHousingPayment', v)}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* 6. System & Audit */}
                    <div className="border-b border-slate-200">
                        <SectionHeader id="audit" title="System & Audit" icon={History} expanded={expandedSections.audit} />
                        {expandedSections.audit && (
                            <div className="p-6 grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Created By</label>
                                    <div className="text-sm text-slate-700 font-medium">{formData.createdBy}</div>
                                    <div className="text-xs text-slate-400">{new Date(formData.createdDate).toLocaleString()}</div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Last Modified</label>
                                    <div className="text-sm text-slate-700 font-medium">System Admin</div>
                                    <div className="text-xs text-slate-400">{new Date().toLocaleString()}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="h-24"></div> {/* Spacer */}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-between items-center z-10 sticky bottom-0">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm flex items-center gap-2"
                    >
                        <Save size={16} /> Save Contact
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {createPortal(DrawerContent, document.body)}

            {/* Confirmation Modal */}
            {showPrimaryConfirm && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPrimaryConfirm(false)}></div>
                    <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4 text-amber-600">
                            <AlertTriangle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Change Primary Contact?</h3>
                        <p className="text-sm text-slate-600 mb-6">
                            <strong>{currentPrimaryName}</strong> is currently the Primary Contact for this account.
                            <br /><br />
                            Setting <strong>{formData.firstName || 'this person'}</strong> as the Primary Contact will remove the primary status from {currentPrimaryName}.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowPrimaryConfirm(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmPrimaryChange}
                                className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
                            >
                                Confirm Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// --- Form Components ---
const FormInput = ({ label, value, onChange, type = "text", required, highlight }) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full text-sm border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 ${highlight === 'warning' ? 'border-amber-300 bg-amber-50' : 'border-slate-300 focus:border-blue-500'}`}
        />
    </div>
);

const FormSelect = ({ label, value, onChange, options, required }) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-white font-medium text-slate-800"
        >
            <option value="">Select...</option>
            {options.map(opt => <option key={opt}>{opt}</option>)}
        </select>
    </div>
);

export default ContactFormDrawer;
