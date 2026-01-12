import React, { useState } from 'react';
import { Users, Plus, Trash2, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import Section from '../../Shared/Section';
import Field from '../../Shared/Field';

const ContactsSection = ({
    isOpen,
    onToggle,
    ownership = [], // Array of owner objects (for Top Grid)
    contacts = [],  // Array of ALL contact objects (owners + others) (for Bottom List)
    onUpdateOwner,  // Handler for Ownership Grid
    onUpdateContact, // Handler for Contact List
    onAddOwner,
    onAddContact,
    onRemoveOwner,
    onRemoveContact,
    readOnly = false,
    variant = 'simple', // 'simple' | 'detailed'
    householdGroups = [] // Only for detailed (Lead Details)
}) => {
    // State for expanded rows (for 1071 or Other Business details)
    const [expandedOwnerRows, setExpandedOwnerRows] = useState({});
    const [expandedContactRows, setExpandedContactRows] = useState({});

    const toggleOwnerRow = (id) => {
        setExpandedOwnerRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleContactRow = (id) => {
        setExpandedContactRows(prev => ({ ...prev, [id]: !prev[id] }));
    };

    // Calculation for Validation
    const totalOwnership = ownership.reduce((sum, o) => sum + (parseFloat(o.percent) || 0), 0);
    const isTotalValid = Math.abs(totalOwnership - 100) < 0.01;

    // Helper to check if a contact is an owner
    const isOwner = (contact) => !!contact.ownerLink || contact.isOwner;

    // Render Logic
    if (!isOpen) {
        return (
            <Section
                title="Contacts & Ownership"
                icon={Users}
                isOpen={false}
                onToggle={onToggle}
            />
        );
    }

    return (
        <Section
            title="Contacts & Ownership"
            icon={Users}
            isOpen={true}
            onToggle={onToggle}
            badge={!isTotalValid && <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">Total: {totalOwnership.toFixed(2)}%</span>}
        >
            <div className="space-y-8">

                {/* --- 1. Economic Ownership Structure --- */}
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
                                            <td colSpan="6" className="px-4 py-4 text-center text-slate-400 italic">
                                                No owners added. Click 'Add Owner' to begin.
                                            </td>
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
                                                        className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        placeholder="First Name"
                                                        readOnly={readOnly}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="text"
                                                        value={owner.lastName}
                                                        onChange={(e) => onUpdateOwner(owner.id, 'lastName', e.target.value)}
                                                        className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                                                        placeholder="Last Name"
                                                        readOnly={readOnly}
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        value={owner.percent}
                                                        onChange={(e) => onUpdateOwner(owner.id, 'percent', parseFloat(e.target.value))}
                                                        className="w-full px-2 py-1 border border-slate-200 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none text-right"
                                                        placeholder="0"
                                                        readOnly={readOnly}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={owner.isCommonHb}
                                                        onChange={(e) => onUpdateOwner(owner.id, 'isCommonHb', e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                                        disabled={readOnly}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={owner.otherBusinesses}
                                                        onChange={(e) => {
                                                            onUpdateOwner(owner.id, 'otherBusinesses', e.target.checked);
                                                            if (e.target.checked) setExpandedOwnerRows(prev => ({ ...prev, [owner.id]: true }));
                                                            else setExpandedOwnerRows(prev => ({ ...prev, [owner.id]: false }));
                                                        }}
                                                        className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                                                        disabled={readOnly}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 text-center">
                                                    {!readOnly && (
                                                        <button
                                                            onClick={() => onRemoveOwner(owner.id)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                            title="Remove Owner"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                            {/* Conditional Row: Other Businesses Details */}
                                            {owner.otherBusinesses && expandedOwnerRows[owner.id] && (
                                                <tr className="bg-slate-50">
                                                    <td colSpan="6" className="px-4 py-3 border-t border-slate-100">
                                                        <div className="grid grid-cols-12 gap-4">
                                                            <div className="col-span-3">
                                                                <Field label="Other Bus. % Owned" value={owner.otherBusPercentage} onChange={(v) => onUpdateOwner(owner.id, 'otherBusPercentage', v)} placeholder="e.g. 50" type="number" readOnly={readOnly} />
                                                            </div>
                                                            <div className="col-span-9">
                                                                <Field label="Desc. of Other Business(es)" value={owner.otherBusDescription} onChange={(v) => onUpdateOwner(owner.id, 'otherBusDescription', v)} placeholder="e.g. Owner of ABC Logistics LLC" readOnly={readOnly} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- 2. Household Financial Analysis (Conditional) --- */}
                {variant === 'detailed' && householdGroups.length > 0 && householdGroups.some(g => g.type === 'Shared') && (
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 space-y-3">
                        <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                            <Users size={16} /> Household Analysis
                        </h3>
                        {householdGroups.filter(g => g.type === 'Shared').map(group => {
                            // Calculate Aggregates
                            const netWorth = group.owners.reduce((sum, o) => sum + (parseFloat(o.netWorth_hhd) || 0), 0);
                            const income = group.owners.reduce((sum, o) => sum + (parseFloat(o.incGros_hhd) || 0), 0);
                            const debt = group.owners.reduce((sum, o) => sum + (parseFloat(o.dServExistLoans_mo_hhd) || 0), 0);

                            return (
                                <div key={group.id} className="grid grid-cols-3 gap-6 pt-2">
                                    <div>
                                        <p className="text-xs text-blue-600 font-semibold mb-1">Household Members</p>
                                        <p className="text-sm text-blue-900">{group.label}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-600 font-semibold mb-1">Combined Net Worth</p>
                                        <p className="text-sm text-blue-900 font-mono">${netWorth.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-blue-600 font-semibold mb-1">Total Debt Service / Mo</p>
                                        <p className="text-sm text-blue-900 font-mono">${debt.toLocaleString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* --- 3. Authorized Contacts (Unified Tile List) --- */}
                <div className="pt-4 border-t border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                                {variant === 'detailed' ? 'Authorized Contacts' : 'Key Contacts'}
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                                {contacts.length} Contact{contacts.length !== 1 ? 's' : ''} listed
                            </p>
                        </div>
                        {!readOnly && (
                            <button
                                onClick={onAddContact}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
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
                            const isExpanded = expandedContactRows[contact.id];

                            return (
                                <div
                                    key={contact.id}
                                    className={`bg-white border rounded-lg transition-all ${isExpanded ? 'border-blue-200 shadow-md ring-1 ring-blue-50' : 'border-slate-200 shadow-sm hover:border-slate-300'}`}
                                >
                                    {/* Tile Main Content */}
                                    <div className="p-4">
                                        <div className="flex items-start gap-4">
                                            {/* Grid for Fields */}
                                            <div className="grid grid-cols-12 gap-4 flex-1">
                                                {/* First Name */}
                                                <div className="col-span-2">
                                                    <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">First Name</label>
                                                    <input
                                                        type="text"
                                                        value={contact.firstName}
                                                        onChange={(e) => onUpdateContact(contact.id, 'firstName', e.target.value)}
                                                        className={`w-full text-sm bg-transparent outline-none py-0.5 ${isContactOwner ? 'text-slate-600 cursor-default' : 'text-slate-900 border-b border-transparent focus:border-blue-400'}`}
                                                        placeholder="First Name"
                                                        readOnly={isContactOwner || readOnly}
                                                    />
                                                </div>
                                                {/* Last Name */}
                                                <div className="col-span-2">
                                                    <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={contact.lastName}
                                                        onChange={(e) => onUpdateContact(contact.id, 'lastName', e.target.value)}
                                                        className={`w-full text-sm bg-transparent outline-none py-0.5 ${isContactOwner ? 'text-slate-600 cursor-default' : 'text-slate-900 border-b border-transparent focus:border-blue-400'}`}
                                                        placeholder="Last Name"
                                                        readOnly={isContactOwner || readOnly}
                                                    />
                                                </div>
                                                {/* Title / Role */}
                                                <div className="col-span-3">
                                                    <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Title / Role</label>
                                                    {isContactOwner ? (
                                                        <div className="py-0.5">
                                                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                                                                Owner
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={contact.title || contact.role}
                                                            onChange={(e) => onUpdateContact(contact.id, 'role', e.target.value)}
                                                            className="w-full text-sm bg-transparent outline-none border-b border-transparent focus:border-blue-400 py-0.5 text-slate-900"
                                                            placeholder="Title"
                                                            readOnly={readOnly}
                                                        />
                                                    )}
                                                </div>
                                                {/* Email */}
                                                <div className="col-span-3">
                                                    <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={contact.email}
                                                        onChange={(e) => onUpdateContact(contact.id, 'email', e.target.value)}
                                                        className="w-full text-sm bg-transparent outline-none border-b border-transparent focus:border-blue-400 py-0.5 text-slate-900"
                                                        placeholder="Email"
                                                        readOnly={readOnly}
                                                    />
                                                </div>
                                                {/* Phone */}
                                                <div className="col-span-2">
                                                    <label className="text-[10px] uppercase text-slate-400 font-bold block mb-1">Phone</label>
                                                    <input
                                                        type="text"
                                                        value={contact.phone}
                                                        onChange={(e) => onUpdateContact(contact.id, 'phone', e.target.value)}
                                                        className="w-full text-sm bg-transparent outline-none border-b border-transparent focus:border-blue-400 py-0.5 text-slate-900"
                                                        placeholder="Phone"
                                                        readOnly={readOnly}
                                                    />
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1 pt-1">
                                                <button
                                                    onClick={() => toggleContactRow(contact.id)}
                                                    className={`p-1.5 rounded-md transition-colors ${isExpanded ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
                                                    title={isExpanded ? "Collapse Details" : "Expand 1071 Details"}
                                                >
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>

                                                {!isContactOwner && !readOnly && (
                                                    <button
                                                        onClick={() => onRemoveContact(contact.id)}
                                                        className="p-1.5 rounded-md text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                        title="Remove Contact"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded: 1071 Details */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6 pt-0 border-t border-slate-100/50 bg-slate-50/30 rounded-b-lg">
                                            <div className="mt-4 flex items-start gap-2 mb-4">
                                                <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                                                <p className="text-xs text-slate-600 leading-snug">
                                                    <strong className="text-blue-700">CFPB 1071 Compliance:</strong> Providing this information is <strong>voluntary</strong> and will not affect credit decisions.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-12 gap-6">
                                                <div className="col-span-4">
                                                    <Field
                                                        label="Race"
                                                        value={contact.race || ''}
                                                        onChange={(v) => onUpdateContact(contact.id, 'race', v)}
                                                        type="select"
                                                        options={[
                                                            { value: 'american_indian', label: 'American Indian or Alaska Native' },
                                                            { value: 'asian', label: 'Asian' },
                                                            { value: 'black', label: 'Black or African American' },
                                                            { value: 'pacific_islander', label: 'Native Hawaiian or Other Pacific Islander' },
                                                            { value: 'white', label: 'White' },
                                                            { value: 'prefer_not_to_say', label: 'Prefer not to provide' }
                                                        ]}
                                                        readOnly={readOnly}
                                                        className="bg-white"
                                                    />
                                                </div>
                                                <div className="col-span-4">
                                                    <Field
                                                        label="Ethnicity"
                                                        value={contact.ethnicity || ''}
                                                        onChange={(v) => onUpdateContact(contact.id, 'ethnicity', v)}
                                                        type="select"
                                                        options={[
                                                            { value: 'hispanic', label: 'Hispanic or Latino' },
                                                            { value: 'not_hispanic', label: 'Not Hispanic or Latino' },
                                                            { value: 'prefer_not_to_say', label: 'Prefer not to provide' }
                                                        ]}
                                                        readOnly={readOnly}
                                                        className="bg-white"
                                                    />
                                                </div>
                                                <div className="col-span-4">
                                                    <Field
                                                        label="Sex"
                                                        value={contact.gender || ''}
                                                        onChange={(v) => onUpdateContact(contact.id, 'gender', v)}
                                                        type="select"
                                                        options={[
                                                            { value: 'female', label: 'Female' },
                                                            { value: 'male', label: 'Male' },
                                                            { value: 'prefer_not_to_say', label: 'Prefer not to provide' }
                                                        ]}
                                                        readOnly={readOnly}
                                                        className="bg-white"
                                                    />
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
