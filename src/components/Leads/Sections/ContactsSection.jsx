import React, { useState, useRef, useEffect } from 'react';
import { Users, Plus, Trash2, AlertCircle, Info, ChevronDown, ChevronUp, Copy, Check, Shield, Eye, EyeOff } from 'lucide-react';
import Section from '../../Shared/Section';
import Field from '../../Shared/Field';

// --- Constants ---
const RECORD_TYPE_OPTIONS = [
    "Partner / Referral Agent",
    "Board / Committee Member",
    "Investor / Donor",
    "Vendor"
];

// --- Helper: Multi-Select Dropdown ---
const MultiSelect = ({ label, options, value = [], onChange, onAudit }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (optValue) => {
        const newValue = value.includes(optValue)
            ? value.filter(v => v !== optValue)
            : [...value, optValue];

        onChange(newValue);
        // Audit log handled by parent on change usually, or we can trigger here if needed
        // For multi-select, logging every check might be noisy, but 'updated' implies final state. 
        // We'll let the change propagate.
    };

    return (
        <div className="space-y-1.5" ref={containerRef}>
            <label className="block text-[10px] uppercase text-slate-400 font-bold">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full text-sm text-left border border-slate-200 rounded-lg px-3 py-2 bg-white flex justify-between items-center hover:border-blue-300 transition-colors"
                >
                    <span className={value.length === 0 ? "text-slate-400" : "text-slate-700"}>
                        {value.length === 0 ? "Select..." : `${value.length} selected`}
                    </span>
                    <ChevronDown size={14} className="text-slate-400" />
                </button>

                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {options.map(opt => (
                            <div
                                key={opt.value}
                                onClick={() => toggleOption(opt.value)}
                                className="px-3 py-2 hover:bg-slate-50 cursor-pointer flex items-center gap-2 border-b border-slate-50 last:border-0"
                            >
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${value.includes(opt.value) ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white'}`}>
                                    {value.includes(opt.value) && <Check size={10} className="text-white" />}
                                </div>
                                <span className={`text-sm ${value.includes(opt.value) ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
                                    {opt.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                    {value.map(val => {
                        const label = options.find(o => o.value === val)?.label;
                        return (
                            <span key={val} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                                {label}
                            </span>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// --- Helper: Input with Copy & Blur Audit ---
const InputWithCopy = ({ label, value, onChange, placeholder, onAudit, auditField, contactId, type = "text" }) => {
    const [copied, setCopied] = useState(false);
    const initialValueRef = useRef(value);

    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);

        if (onAudit) {
            onAudit(`${auditField}_COPIED`, { contactId, field: auditField, value: '***MASKED***' });
        }
    };

    const handleFocus = () => {
        initialValueRef.current = value;
    };

    const handleBlur = () => {
        if (value !== initialValueRef.current && onAudit) {
            onAudit(`${auditField}_UPDATED`, {
                contactId,
                field: auditField,
                oldValue: '***MASKED***',
                newValue: '***MASKED***'
            });
        }
    };

    return (
        <div className="space-y-1.5 relative group">
            <label className="block text-[10px] uppercase text-slate-400 font-bold">{label}</label>
            <div className="relative flex items-center">
                <input
                    type={type}
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full text-sm bg-transparent outline-none border-b border-slate-200 focus:border-blue-500 py-1.5 pr-8 text-slate-900 placeholder:text-slate-300 transition-colors"
                    placeholder={placeholder}
                />
                <button
                    onClick={handleCopy}
                    disabled={!value}
                    className={`absolute right-0 p-1 rounded-md transition-all ${copied ? 'text-green-600 bg-green-50' : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50 opacity-0 group-hover:opacity-100 focus:opacity-100'}`}
                    title="Copy to Clipboard"
                >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
            </div>
        </div>
    );
};

// --- Helper: SSN Field (Secure) ---
const SSNField = ({ value, onChange, onAudit, leadId, contactId }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    const [copied, setCopied] = useState(false);
    const initialValueRef = useRef(value);

    // Format: XXX-XX-XXXX
    const formatSSN = (val) => {
        const clean = val.replace(/\D/g, '').slice(0, 9);
        if (clean.length < 4) return clean;
        if (clean.length < 6) return `${clean.slice(0, 3)}-${clean.slice(3)}`;
        return `${clean.slice(0, 3)}-${clean.slice(3, 5)}-${clean.slice(5)}`;
    };

    const handleChange = (e) => {
        const raw = e.target.value;
        const formatted = formatSSN(raw);
        onChange(formatted);
    };

    const toggleReveal = () => {
        const newState = !isRevealed;
        setIsRevealed(newState);
        if (newState && onAudit) onAudit('OWNER_SSN_REVEALED', { leadId, contactId, field: 'ssn' });
    };

    const handleCopy = () => {
        if (!value) return;
        navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        if (onAudit) onAudit('OWNER_SSN_COPIED', { leadId, contactId, field: 'ssn' });
    };

    const handleBlur = () => {
        if (value && onAudit && value !== initialValueRef.current) {
            onAudit('OWNER_SSN_ENTERED', { leadId, contactId, field: 'ssn' });
            initialValueRef.current = value;
        }
    };

    return (
        <div className="space-y-1.5 relative group">
            <label className="block text-[10px] uppercase text-slate-400 font-bold">Social Security Number</label>
            <div className="relative">
                <input
                    type={isRevealed ? "text" : "password"}
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={isRevealed ? "XXX-XX-XXXX" : "•••-••-••••"}
                    maxLength={11}
                    className={`w-full text-sm bg-transparent outline-none border-b border-slate-200 focus:border-blue-500 py-1.5 pr-16 text-slate-900 font-mono tracking-wide ${!value ? 'border-red-300' : ''}`}
                />
                <div className="absolute right-0 top-1.5 flex items-center gap-2">
                    <button type="button" onClick={toggleReveal} className="text-slate-400 hover:text-blue-600 transition-colors" title={isRevealed ? "Hide SSN" : "Reveal SSN"}>
                        {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                        type="button"
                        onClick={handleCopy}
                        disabled={!value}
                        className={`transition-colors ${copied ? 'text-green-600' : 'text-slate-300 hover:text-blue-600'}`}
                        title="Copy SSN"
                    >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                </div>
            </div>
        </div>
    );
};


const ContactsSection = ({
    isOpen,
    onToggle,
    ownership = [],
    contacts = [],
    onUpdateOwner,
    onUpdateContact,
    onAddOwner,
    onAddContact,
    onRemoveOwner,
    onRemoveContact,
    readOnly = false,
    variant = 'simple',
    householdGroups = [],
    onAudit // New Prop for Audit Logging
}) => {
    const [expandedOwnerRows, setExpandedOwnerRows] = useState({});
    const [expandedContactRows, setExpandedContactRows] = useState({});

    const toggleOwnerRow = (id) => {
        setExpandedOwnerRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleContactRow = (id) => {
        setExpandedContactRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const totalOwnership = ownership.reduce((sum, o) => sum + (parseFloat(o.percent) || 0), 0);
    const isTotalValid = Math.abs(totalOwnership - 100) < 0.01;
    const isOwner = (contact) => !!contact.ownerLink || contact.isOwner;

    if (!isOpen) {
        return <Section title="Contacts & Ownership" icon={Users} isOpen={false} onToggle={onToggle} />;
    }

    // --- 1071 Options ---
    const RACE_OPTIONS = [
        { value: 'american_indian', label: 'American Indian or Alaska Native' },
        { value: 'asian', label: 'Asian' },
        { value: 'black', label: 'Black or African American' },
        { value: 'pacific_islander', label: 'Native Hawaiian or Other Pacific Islander' },
        { value: 'white', label: 'White' },
        { value: 'prefer_not_to_say', label: 'Prefer not to provide' }
    ];

    const ETHNICITY_OPTIONS = [
        { value: 'hispanic_mexican', label: 'Hispanic: Mexican' },
        { value: 'hispanic_cuban', label: 'Hispanic: Cuban' },
        { value: 'hispanic_puerto_rican', label: 'Hispanic: Puerto Rican' },
        { value: 'hispanic_other', label: 'Hispanic: Other' },
        { value: 'not_hispanic', label: 'Not Hispanic or Latino' },
        { value: 'prefer_not_to_say', label: 'Prefer not to provide' }
    ];

    const GENDER_OPTIONS = [
        { value: 'female', label: 'Female' },
        { value: 'male', label: 'Male' },
        { value: 'non_binary', label: 'Non-binary' },
        { value: 'prefer_not_to_say', label: 'Prefer not to provide' }
    ];

    const VETERAN_STATUS_OPTIONS = [
        { value: 'veteran', label: 'I identify as a veteran' },
        { value: 'non_veteran', label: 'I identify as a non-veteran' },
        { value: 'prefer_not_to_say', label: 'Prefer not to provide' }
    ];

    return (
        <Section
            title="Contacts & Ownership"
            icon={Users}
            isOpen={true}
            onToggle={onToggle}
            badge={!isTotalValid && <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">Total: {totalOwnership.toFixed(2)}%</span>}
        >
            <div className="space-y-8">

                {/* --- 1. Economic Ownership Structure (Preserved) --- */}
                {variant === 'detailed' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Economic Ownership Structure</h3>
                                <p className="text-xs text-slate-500 mt-1">
                                    Total Ownership: <span className={isTotalValid ? "text-green-600 font-bold" : "text-red-600 font-bold"}>{totalOwnership.toFixed(2)}%</span>
                                </p>
                            </div>
                            {!readOnly && (
                                <button
                                    onClick={onAddOwner}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                                >
                                    <Plus size={16} /> Add Owner (Row)
                                </button>
                            )}
                        </div>



                        <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3">First Name</th>
                                        <th className="px-4 py-3">Last Name</th>
                                        <th className="px-4 py-3 w-24">Own %</th>
                                        <th className="px-4 py-3 text-center w-24">Household?</th>
                                        <th className="px-4 py-3 text-center w-24">Other Bus?</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {ownership.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-4 text-center text-slate-400 italic">No owners added. Click 'Add Owner' to begin.</td>
                                        </tr>
                                    )}
                                    {ownership.map((owner) => (
                                        <React.Fragment key={owner.id}>
                                            <tr className="hover:bg-slate-50 transition-colors">
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={owner.firstName}
                                                        onChange={(e) => onUpdateOwner(owner.id, 'firstName', e.target.value)}
                                                        className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none"
                                                        placeholder="First Name"
                                                        readOnly={readOnly}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={owner.lastName}
                                                        onChange={(e) => onUpdateOwner(owner.id, 'lastName', e.target.value)}
                                                        className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none"
                                                        placeholder="Last Name"
                                                        readOnly={readOnly}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={owner.percent}
                                                        onChange={(e) => onUpdateOwner(owner.id, 'percent', parseFloat(e.target.value))}
                                                        className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 outline-none text-right"
                                                        placeholder="0"
                                                        readOnly={readOnly}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center group relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={owner.isCommonHb}
                                                        onChange={(e) => onUpdateOwner(owner.id, 'isCommonHb', e.target.checked)}
                                                        className={`w-4 h-4 rounded cursor-pointer ${owner.isCommonHb && ownership.filter(o => o.isCommonHb).length === 1 && ownership.length >= 2 ? 'ring-2 ring-amber-400 text-amber-500' : 'text-blue-600'}`}
                                                        disabled={readOnly}
                                                    />
                                                    {/* Rule H2: Inline Prompt */}
                                                    {owner.isCommonHb && ownership.filter(o => o.isCommonHb).length === 1 && ownership.length >= 2 && (
                                                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-max z-20 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-1 rounded border border-amber-200 shadow-md flex items-center gap-1">
                                                            <AlertCircle size={10} />
                                                            Select one more to group
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={owner.otherBusinesses}
                                                        onChange={(e) => {
                                                            onUpdateOwner(owner.id, 'otherBusinesses', e.target.checked);
                                                            setExpandedOwnerRows(prev => ({ ...prev, [owner.id]: e.target.checked }));
                                                        }}
                                                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                                        disabled={readOnly}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => toggleOwnerRow(owner.id)}
                                                            className={`p-1 rounded transition-colors ${expandedOwnerRows[owner.id] ? 'bg-blue-100 text-blue-600' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-50'}`}
                                                            title={expandedOwnerRows[owner.id] ? "Collapse Details" : "View Financials"}
                                                        >
                                                            {expandedOwnerRows[owner.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                        </button>
                                                        {!readOnly && (
                                                            <button onClick={() => onRemoveOwner(owner.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Expanded Owner Details (Financials + Other Bus) */}
                                            {expandedOwnerRows[owner.id] && (
                                                <tr className="bg-slate-50/50">
                                                    <td colSpan="6" className="px-4 py-4 border-t border-slate-100 shadow-inner">
                                                        <div className="space-y-6">
                                                            {/* 1. Personal Financials */}
                                                            <div className="bg-white border border-slate-200 rounded-lg p-4">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Personal Financials (Always Required)</h5>
                                                                    <span className="text-[10px] bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded border border-amber-100 font-medium">Underwriting</span>
                                                                </div>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                                    <Field label="Annual Personal Income" type="number" value={owner.incGros_hhd} onChange={(v) => { if (v >= 0) onUpdateOwner(owner.id, 'incGros_hhd', v); }} placeholder="0.00" readOnly={readOnly} />
                                                                    <Field label="Personal Net Worth" type="number" value={owner.netWorth_hhd} onChange={(v) => onUpdateOwner(owner.id, 'netWorth_hhd', v)} placeholder="0.00" readOnly={readOnly} />
                                                                    <Field label="Existing Pers. Loans" type="number" value={owner.amtExistLoans_hhd} onChange={(v) => { if (v >= 0) onUpdateOwner(owner.id, 'amtExistLoans_hhd', v); }} placeholder="0.00" readOnly={readOnly} />
                                                                    <Field label="Mo. Debt Service" type="number" value={owner.dServExistLoans_mo_hhd} onChange={(v) => { if (v >= 0) onUpdateOwner(owner.id, 'dServExistLoans_mo_hhd', v); }} placeholder="0.00" readOnly={readOnly} />
                                                                </div>
                                                            </div>

                                                            {/* 2. Other Business (Conditional) */}
                                                            {owner.otherBusinesses && (
                                                                <div className="bg-white border border-slate-200 rounded-lg p-4">
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Other Business Interests</h5>
                                                                    </div>
                                                                    <div className="grid grid-cols-12 gap-4">
                                                                        <div className="col-span-3">
                                                                            <Field label="Other Bus. % Owned" value={owner.otherBusPercentage} onChange={(v) => onUpdateOwner(owner.id, 'otherBusPercentage', v)} placeholder="50" type="number" readOnly={readOnly} />
                                                                        </div>
                                                                        <div className="col-span-9">
                                                                            <Field label="Desc. of Other Business(es)" value={owner.otherBusDescription} onChange={(v) => onUpdateOwner(owner.id, 'otherBusDescription', v)} placeholder="e.g. Owner of ABC Logistics LLC" readOnly={readOnly} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* --- Financial Summary Section (New Layout) --- */}
                        <div className="space-y-6 mt-6 pt-6 border-t border-slate-200">

                            {/* Individual Summary */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">Individual Financial Summary</h4>
                                <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm">
                                    <table className="w-full text-xs text-left">
                                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                            <tr>
                                                <th className="px-4 py-2">Owner Name</th>
                                                <th className="px-4 py-2 text-right">Gross Income</th>
                                                <th className="px-4 py-2 text-right">Net Worth</th>
                                                <th className="px-4 py-2 text-right">Exist. Loans</th>
                                                <th className="px-4 py-2 text-right">Mo. Debt Service</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 bg-white">
                                            {householdGroups.filter(g => g.type === 'Individual').map(group => {
                                                const owner = group.owners[0];
                                                return (
                                                    <tr key={owner.id} className="hover:bg-slate-50/50">
                                                        <td className="px-4 py-2 font-medium text-slate-700">{owner.firstName} {owner.lastName}</td>
                                                        <td className="px-4 py-2 text-right font-mono text-slate-600">${(parseFloat(owner.incGros_hhd) || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                        <td className="px-4 py-2 text-right font-mono text-slate-600">${(parseFloat(owner.netWorth_hhd) || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                        <td className="px-4 py-2 text-right font-mono text-slate-600">${(parseFloat(owner.amtExistLoans_hhd) || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                        <td className="px-4 py-2 text-right font-mono text-slate-600">${(parseFloat(owner.dServExistLoans_mo_hhd) || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                    </tr>
                                                );
                                            })}
                                            {householdGroups.filter(g => g.type === 'Individual').length === 0 && householdGroups.some(g => g.type === 'Household') && (
                                                <tr><td colSpan="5" className="px-4 py-2 text-center text-slate-400 italic">All owners are grouped in households.</td></tr>
                                            )}
                                            {ownership.length === 0 && <tr><td colSpan="5" className="px-4 py-2 text-center text-slate-400 italic">No owners.</td></tr>}
                                        </tbody>
                                        {/* Total Summary Row */}
                                        <tfoot className="bg-slate-50 border-t border-slate-200 font-bold text-slate-700">
                                            {(() => {
                                                const individualOwners = householdGroups.filter(g => g.type === 'Individual').map(g => g.owners[0]);
                                                return (
                                                    <tr>
                                                        <td className="px-4 py-2">Total (Individuals Only)</td>
                                                        <td className="px-4 py-2 text-right font-mono">${individualOwners.reduce((sum, o) => sum + (parseFloat(o.incGros_hhd) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                        <td className="px-4 py-2 text-right font-mono">${individualOwners.reduce((sum, o) => sum + (parseFloat(o.netWorth_hhd) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                        <td className="px-4 py-2 text-right font-mono">${individualOwners.reduce((sum, o) => sum + (parseFloat(o.amtExistLoans_hhd) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                        <td className="px-4 py-2 text-right font-mono">${individualOwners.reduce((sum, o) => sum + (parseFloat(o.dServExistLoans_mo_hhd) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                    </tr>
                                                );
                                            })()}
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Household Summary (Conditional) */}
                            {householdGroups.some(g => g.type === 'Household') && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <Users size={16} className="text-blue-500" /> Household Financial Summary
                                    </h4>
                                    <div className="overflow-hidden border border-slate-200 rounded-lg shadow-sm">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                                <tr>
                                                    <th className="px-4 py-2">Household Group</th>
                                                    <th className="px-4 py-2 text-right">Total Income</th>
                                                    <th className="px-4 py-2 text-right">Total Net Worth</th>
                                                    <th className="px-4 py-2 text-right">Total Exist. Loans</th>
                                                    <th className="px-4 py-2 text-right">Total Debt Service</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 bg-white">
                                                {householdGroups.filter(g => g.type === 'Household').map(group => {
                                                    const totalInc = group.owners.reduce((sum, o) => sum + (parseFloat(o.incGros_hhd) || 0), 0);
                                                    const totalNet = group.owners.reduce((sum, o) => sum + (parseFloat(o.netWorth_hhd) || 0), 0);
                                                    const totalDebt = group.owners.reduce((sum, o) => sum + (parseFloat(o.amtExistLoans_hhd) || 0), 0);
                                                    const totalDS = group.owners.reduce((sum, o) => sum + (parseFloat(o.dServExistLoans_mo_hhd) || 0), 0);
                                                    return (
                                                        <tr key={group.id} className="hover:bg-slate-50/50">
                                                            <td className="px-4 py-2 font-medium text-slate-700">{group.label}</td>
                                                            <td className="px-4 py-2 text-right font-mono text-slate-600">${totalInc.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                            <td className="px-4 py-2 text-right font-mono text-slate-600">${totalNet.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                            <td className="px-4 py-2 text-right font-mono text-slate-600">${totalDebt.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                            <td className="px-4 py-2 text-right font-mono text-slate-600">${totalDS.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}



                {/* --- 3. Authorized Contacts (Enhanced 1071) --- */}
                <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">{variant === 'detailed' ? 'Authorized Contacts' : 'Key Contacts'}</h3>
                            <p className="text-xs text-slate-500 mt-1">{contacts.length} Contact{contacts.length !== 1 ? 's' : ''} listed</p>
                        </div>
                        {!readOnly && (
                            <button onClick={onAddContact} className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                <Plus size={16} /> Add Contact
                            </button>
                        )}
                    </div>

                    <div className="space-y-3">
                        {contacts.length === 0 && (
                            <div className="text-center py-6 border border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-400 italic">
                                No contacts listed. Owners added above will appear here automatically.
                            </div>
                        )}
                        {contacts.map((contact) => {
                            const isContactOwner = isOwner(contact);
                            const linkedOwner = isContactOwner ? ownership.find(o => o.id === contact.ownerLink) : null;
                            const isExpanded = expandedContactRows[contact.id];

                            return (
                                <div key={contact.id} className={`bg-white border rounded-lg transition-all ${isExpanded ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}>
                                    {/* Tile Main Content */}
                                    <div className="p-4">
                                        <div className="flex items-start gap-4">
                                            {/* Grid for Fields */}
                                            <div className="grid grid-cols-12 gap-4 flex-1">
                                                {/* First Name */}
                                                <div className="col-span-2" title={isContactOwner ? "Name is locked because this contact is an Owner." : undefined}>
                                                    <Field label="First Name" value={contact.firstName} onChange={(v) => onUpdateContact(contact.id, 'firstName', v)} placeholder="First" readOnly={isContactOwner || readOnly} />
                                                </div>
                                                {/* Last Name */}
                                                <div className="col-span-2" title={isContactOwner ? "Name is locked because this contact is an Owner." : undefined}>
                                                    <Field label="Last Name" value={contact.lastName} onChange={(v) => onUpdateContact(contact.id, 'lastName', v)} placeholder="Last" readOnly={isContactOwner || readOnly} />
                                                </div>

                                                {/* Record Type (Non-Owner Only) */}
                                                <div className="col-span-2">
                                                    {!isContactOwner ? (
                                                        <div className="space-y-1.5">
                                                            <label className="block text-[10px] uppercase text-slate-400 font-bold">Relationship <span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <select
                                                                    value={contact.recordType || ''}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        onUpdateContact(contact.id, 'recordType', val);
                                                                        if (onAudit) onAudit('CONTACT_RECORD_TYPE_SET', { contactId: contact.id, newValue: val });
                                                                    }}
                                                                    className={`w-full text-sm border ${!contact.recordType ? 'border-red-300 bg-red-50/50' : 'border-slate-200 bg-white'} rounded-lg px-2 py-1.5 appearance-none outline-none focus:border-blue-400 text-slate-700 truncate`}
                                                                >
                                                                    <option value="" disabled>Select...</option>
                                                                    {RECORD_TYPE_OPTIONS.map(opt => (
                                                                        <option key={opt} value={opt}>{opt}</option>
                                                                    ))}
                                                                </select>
                                                                <ChevronDown size={14} className="absolute right-2 top-2 text-slate-400 pointer-events-none" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="h-full"></div> /* Structural spacer */
                                                    )}
                                                </div>

                                                {/* Title / Role */}
                                                <div className="col-span-2">
                                                    <Field
                                                        label={
                                                            <>
                                                                Title / Role
                                                                {isContactOwner && <span className="ml-1 text-[9px] bg-slate-100 text-slate-500 px-1 rounded border border-slate-200">OWNER</span>}
                                                            </>
                                                        }
                                                        value={contact.title || contact.role || ''}
                                                        onChange={(v) => onUpdateContact(contact.id, 'role', v)}
                                                        placeholder="Title"
                                                        readOnly={readOnly}
                                                    />
                                                </div>

                                                {/* PHONE - AUDIT SAFE */}
                                                <div className="col-span-2">
                                                    <InputWithCopy
                                                        label="Phone"
                                                        value={contact.phone}
                                                        onChange={(v) => onUpdateContact(contact.id, 'phone', v)}
                                                        placeholder="(555)..."
                                                        onAudit={onAudit}
                                                        auditField="CONTACT_PHONE"
                                                        contactId={contact.id}
                                                    />
                                                </div>

                                                {/* EMAIL - AUDIT SAFE */}
                                                <div className="col-span-2">
                                                    <InputWithCopy
                                                        label="Email"
                                                        value={contact.email}
                                                        onChange={(v) => onUpdateContact(contact.id, 'email', v)}
                                                        placeholder="user@..."
                                                        onAudit={onAudit}
                                                        auditField="CONTACT_EMAIL"
                                                        contactId={contact.id}
                                                        type="email"
                                                    />
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 pt-1">
                                                <button onClick={() => toggleContactRow(contact.id)} className={`p-1.5 rounded-md transition-colors ${isExpanded ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`} title={isExpanded ? "Collapse Details" : "Contact Details"}>
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                                {!isContactOwner && !readOnly && (
                                                    <button onClick={() => onRemoveContact(contact.id)} className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors" title="Remove Contact">
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6 pt-0 border-t border-slate-100/50 bg-slate-50/30 rounded-b-lg">

                                            {/* Owner Personal Details (Internal Only) */}
                                            {isContactOwner && linkedOwner && (
                                                <div className="mb-6 pt-4 border-b border-slate-200 pb-6">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <h4 className="text-sm font-bold text-slate-800">Personal & Professional Details (Owner Only)</h4>
                                                        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-semibold">INTERNAL</span>
                                                    </div>
                                                    <p className="text-xs text-slate-500 mb-4 flex items-center gap-1">
                                                        <Info size={12} /> Internal fields. Collected for underwriting and regulatory analysis.
                                                    </p>

                                                    <div className="grid grid-cols-12 gap-6">
                                                        {/* SSN - Secure */}
                                                        <div className="col-span-4">
                                                            <SSNField
                                                                value={linkedOwner.ssn}
                                                                onChange={(v) => onUpdateOwner(linkedOwner.id, 'ssn', v)}
                                                                onAudit={onAudit}
                                                                leadId="LEAD-7782"
                                                                contactId={contact.id}
                                                            />
                                                        </div>

                                                        {/* Portal Access */}
                                                        <div className="col-span-8 flex items-start pt-1">
                                                            <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-lg w-full flex items-start gap-3">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={linkedOwner.portalAccess === true}
                                                                    onChange={(e) => {
                                                                        const val = e.target.checked;
                                                                        onUpdateOwner(linkedOwner.id, 'portalAccess', val);
                                                                        if (onAudit) onAudit('OWNER_PORTAL_FLAG_UPDATED', { leadId: 'LEAD-7782', contactId: contact.id, newValue: val });
                                                                    }}
                                                                    className="mt-0.5 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                                                                />
                                                                <div>
                                                                    <span className="text-sm font-bold text-slate-700 block">Portal User?</span>
                                                                    <p className="text-xs text-slate-500 leading-snug">Indicates whether this owner should have borrower portal access.</p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* DOB */}
                                                        <div className="col-span-4">
                                                            <Field
                                                                label="Date of Birth"
                                                                type="date"
                                                                value={linkedOwner.dob || ''}
                                                                onChange={(v) => {
                                                                    onUpdateOwner(linkedOwner.id, 'dob', v);
                                                                    if (onAudit) onAudit('OWNER_PERSONAL_DETAILS_UPDATED', { leadId: 'LEAD-7782', contactId: contact.id, field: 'dob', newValue: '***MASKED***' });
                                                                }}
                                                                className={!linkedOwner.dob ? "border-red-300" : ""}
                                                            />
                                                        </div>

                                                        {/* Experience */}
                                                        <div className="col-span-4">
                                                            <Field
                                                                label="Years Industry Exp."
                                                                type="number"
                                                                value={linkedOwner.industryExperience || ''}
                                                                onChange={(v) => {
                                                                    if (v < 0) return;
                                                                    onUpdateOwner(linkedOwner.id, 'industryExperience', v);
                                                                    if (onAudit) onAudit('OWNER_PERSONAL_DETAILS_UPDATED', { leadId: 'LEAD-7782', contactId: contact.id, field: 'industryExperience', newValue: v });
                                                                }}
                                                                placeholder="0"
                                                            />
                                                        </div>
                                                        <div className="col-span-4">
                                                            <Field
                                                                label="Years Ownership Exp."
                                                                type="number"
                                                                value={linkedOwner.ownershipExperience || ''}
                                                                onChange={(v) => {
                                                                    if (v < 0) return;
                                                                    onUpdateOwner(linkedOwner.id, 'ownershipExperience', v);
                                                                    if (onAudit) onAudit('OWNER_PERSONAL_DETAILS_UPDATED', { leadId: 'LEAD-7782', contactId: contact.id, field: 'ownershipExperience', newValue: v });
                                                                }}
                                                                placeholder="0"
                                                            />
                                                        </div>

                                                        {/* Sources & LMI */}
                                                        <div className="col-span-6">
                                                            <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1.5">Demographic Source</label>
                                                            <select
                                                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white appearance-none outline-none focus:border-blue-400 text-slate-700"
                                                                value={linkedOwner.demographicSource || ''}
                                                                onChange={(e) => {
                                                                    onUpdateOwner(linkedOwner.id, 'demographicSource', e.target.value);
                                                                    if (onAudit) onAudit('OWNER_PERSONAL_DETAILS_UPDATED', { leadId: 'LEAD-7782', contactId: contact.id, field: 'demographicSource', newValue: e.target.value });
                                                                }}
                                                            >
                                                                <option value="" disabled>Select Source...</option>
                                                                <option value="Self-reported by applicant">Self-reported by applicant</option>
                                                                <option value="Observed by staff">Observed by staff</option>
                                                                <option value="Not provided">Not provided</option>
                                                            </select>
                                                        </div>
                                                        <div className="col-span-6">
                                                            <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1.5">LMI Household Status</label>
                                                            <select
                                                                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white appearance-none outline-none focus:border-blue-400 text-slate-700"
                                                                value={linkedOwner.lmiStatus || ''}
                                                                onChange={(e) => {
                                                                    onUpdateOwner(linkedOwner.id, 'lmiStatus', e.target.value);
                                                                    if (onAudit) onAudit('OWNER_PERSONAL_DETAILS_UPDATED', { leadId: 'LEAD-7782', contactId: contact.id, field: 'lmiStatus', newValue: e.target.value });
                                                                }}
                                                            >
                                                                <option value="" disabled>Select Status...</option>
                                                                <option value="Low-to-Moderate Income">Low-to-Moderate Income (LMI)</option>
                                                                <option value="Not LMI">Not LMI</option>
                                                                <option value="Unknown">Unknown</option>
                                                            </select>
                                                        </div>


                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4 flex items-start gap-2 mb-4 bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                                <Shield size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-blue-900">Section 1071 Demographics (Optional)</p>
                                                    <p className="text-xs text-blue-700 leading-snug mt-0.5">
                                                        Used for regulatory reporting. Not visible to borrower.
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-12 gap-6">
                                                {/* RACE - Multi-Select */}
                                                <div className="col-span-4">
                                                    <MultiSelect
                                                        label="Confidential Race"
                                                        options={RACE_OPTIONS}
                                                        value={contact.race || []}
                                                        onChange={(v) => {
                                                            onUpdateContact(contact.id, 'race', v);
                                                            if (onAudit) onAudit('CONTACT_RACE_UPDATED', { contactId: contact.id, newValue: '***MASKED***' });
                                                        }}
                                                        onAudit={onAudit}
                                                    />
                                                </div>

                                                {/* ETHNICITY - Multi-Select */}
                                                <div className="col-span-4">
                                                    <MultiSelect
                                                        label="Confidential Ethnicity"
                                                        options={ETHNICITY_OPTIONS}
                                                        value={contact.ethnicity || []}
                                                        onChange={(v) => {
                                                            onUpdateContact(contact.id, 'ethnicity', v);
                                                            if (onAudit) onAudit('CONTACT_ETHNICITY_UPDATED', { contactId: contact.id, newValue: '***MASKED***' });
                                                        }}
                                                        onAudit={onAudit}
                                                    />
                                                </div>

                                                {/* GENDER - Single Picklist */}
                                                <div className="col-span-4">
                                                    <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1.5">Confidential Gender</label>
                                                    <div className="relative">
                                                        <select
                                                            value={contact.gender || ''}
                                                            onChange={(e) => {
                                                                onUpdateContact(contact.id, 'gender', e.target.value);
                                                                if (onAudit) onAudit('CONTACT_GENDER_UPDATED', { contactId: contact.id, newValue: '***MASKED***' });
                                                            }}
                                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white appearance-none outline-none focus:border-blue-400 text-slate-700"
                                                        >
                                                            <option value="" disabled>Select Gender...</option>
                                                            {GENDER_OPTIONS.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                                                    </div>
                                                </div>

                                                {/* VETERAN STATUS - Single Picklist */}
                                                <div className="col-span-4">
                                                    <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1.5">Confidential Veteran Status</label>
                                                    <div className="relative">
                                                        <select
                                                            value={contact.veteranStatus || ''}
                                                            onChange={(e) => {
                                                                onUpdateContact(contact.id, 'veteranStatus', e.target.value);
                                                                if (onAudit) onAudit('CONTACT_VETERAN_STATUS_UPDATED', { contactId: contact.id, newValue: '***MASKED***' });
                                                            }}
                                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white appearance-none outline-none focus:border-blue-400 text-slate-700"
                                                        >
                                                            <option value="" disabled>Select Status...</option>
                                                            {VETERAN_STATUS_OPTIONS.map(opt => (
                                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                            ))}
                                                        </select>
                                                        <ChevronDown size={14} className="absolute right-3 top-3 text-slate-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>


                </div>
            </div>
        </Section>
    );
};

export default ContactsSection;
