import React, { useState } from 'react';
import { Building2, Plus, Trash2, MapPin, X, Check, Info } from 'lucide-react';
import Section from '../../Shared/Section';
import Field from '../../Shared/Field';
import SecureEINInput from '../../Shared/SecureEINInput';
import { getLowIncomeBadge } from '../../../utils/censusUtils';

const ADDRESS_TYPES = [
    { value: 'Mailing', label: 'Mailing' },
    { value: 'Billing', label: 'Accounting / Billing' },
    { value: 'Registered', label: 'Registered / Legal' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Other', label: 'Other' }
];

const BusinessIdentitySection = ({
    isOpen,
    onToggle,
    formData,
    handleChange
}) => {
    const [isAddingAddress, setIsAddingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        type: 'Mailing',
        address: '',
        city: '',
        state: '',
        zip: ''
    });

    const handleAddAddress = () => {
        if (!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.zip) return;

        const updatedAddresses = [
            ...(formData.additionalAddresses || []),
            { ...newAddress, id: `addr-${Date.now()}` }
        ];
        handleChange('additionalAddresses', updatedAddresses);

        // Reset and Close
        setIsAddingAddress(false);
        setNewAddress({ type: 'Mailing', address: '', city: '', state: '', zip: '' });
    };

    const handleRemoveAddress = (id) => {
        const updatedAddresses = (formData.additionalAddresses || []).filter(a => a.id !== id);
        handleChange('additionalAddresses', updatedAddresses);
    };

    return (
        <Section title="Business Identity" icon={Building2} isOpen={isOpen} onToggle={onToggle}>
            <div className="space-y-8">
                {/* Core Identity */}
                <div className="space-y-6">
                    <Field
                        label="Legal Business Name"
                        value={formData.businessName}
                        onChange={v => handleChange('businessName', v)}
                        required
                    />
                    <Field
                        label="DBA Name"
                        value={formData.dbaName}
                        onChange={v => handleChange('dbaName', v)}
                    />
                </div>

                {/* Address Section */}
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <MapPin size={16} /> Locations & Addresses
                    </h4>

                    {/* Primary Address */}
                    <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold text-blue-700 uppercase bg-blue-100 px-2 py-0.5 rounded">Primary Physical Address (Required)</span>
                            <span className="text-[10px] text-blue-600">Used for Census & Impact Data</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <Field label="Street Address" value={formData.address} onChange={v => handleChange('address', v)} required />
                            <Field label="Business Website" value={formData.website} onChange={v => handleChange('website', v)} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <Field label="City" value={formData.city} onChange={v => handleChange('city', v)} required />
                            <Field label="State" value={formData.state} onChange={v => handleChange('state', v)} required />
                            <Field label="ZIP" value={formData.zip} onChange={v => handleChange('zip', v)} required />
                        </div>
                    </div>

                    {/* Census Data (Derived) */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 mb-4">
                        <div className="col-span-2 text-[10px] text-slate-400 font-medium italic mb-[-8px] flex items-center gap-1">
                            <Info size={12} /> Derived from Primary Physical Address
                        </div>
                        <Field
                            label="Census Tract"
                            value={formData.censusTract || 'N/A'}
                            readOnly
                            className="bg-white"
                        />
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Target Market Status</label>
                            <div className={`text-sm px-3 py-2 rounded-lg border font-medium ${getLowIncomeBadge(formData.isLowIncome).color}`}>
                                {getLowIncomeBadge(formData.isLowIncome).label}
                            </div>
                        </div>
                    </div>

                    {/* Additional Addresses */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h5 className="text-xs font-bold text-slate-600 uppercase">Additional Addresses</h5>
                            {!isAddingAddress && (
                                <button
                                    onClick={() => setIsAddingAddress(true)}
                                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    <Plus size={14} /> Add Address
                                </button>
                            )}
                        </div>

                        {/* List Existing Additional Addresses */}
                        <div className="space-y-3 mb-4">
                            {(formData.additionalAddresses || []).map(addr => (
                                <div key={addr.id} className="flex items-start justify-between bg-white p-3 rounded border border-slate-200 shadow-sm">
                                    <div className="flex gap-3">
                                        <div className="mt-1">
                                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded uppercase tracking-wide border border-slate-200">
                                                {addr.type}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-slate-800">{addr.address}</div>
                                            <div className="text-xs text-slate-500">{addr.city}, {addr.state} {addr.zip}</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveAddress(addr.id)}
                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                        title="Remove Address"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                            {(formData.additionalAddresses || []).length === 0 && !isAddingAddress && (
                                <div className="text-center text-xs text-slate-400 italic py-2">
                                    No additional addresses added.
                                </div>
                            )}
                        </div>

                        {/* Add Address Form */}
                        {isAddingAddress && (
                            <div className="bg-white p-4 rounded border border-blue-200 shadow-sm animate-in fade-in slide-in-from-top-2">
                                <h6 className="text-xs font-bold text-blue-800 uppercase mb-3">New Address</h6>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] uppercase text-slate-400 font-bold mb-1.5">Address Type</label>
                                        <select
                                            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                                            value={newAddress.type}
                                            onChange={e => setNewAddress({ ...newAddress, type: e.target.value })}
                                        >
                                            {ADDRESS_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                    <Field
                                        label="Street Address"
                                        value={newAddress.address}
                                        onChange={v => setNewAddress({ ...newAddress, address: v })}
                                        placeholder="e.g. 1234 Logistics Way, Suite 100"
                                    />
                                    <div className="grid grid-cols-3 gap-2">
                                        <Field label="City" value={newAddress.city} onChange={v => setNewAddress({ ...newAddress, city: v })} />
                                        <Field label="State" value={newAddress.state} onChange={v => setNewAddress({ ...newAddress, state: v })} />
                                        <Field label="ZIP" value={newAddress.zip} onChange={v => setNewAddress({ ...newAddress, zip: v })} />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button
                                            onClick={() => setIsAddingAddress(false)}
                                            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddAddress}
                                            disabled={!newAddress.address || !newAddress.city || !newAddress.state || !newAddress.zip}
                                            className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <Check size={12} /> Save Address
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>



                {/* Entity & EIN */}
                <div className="grid grid-cols-4 gap-6">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Entity Type</label>
                        <select
                            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none bg-white"
                            value={formData.entityType}
                            onChange={e => handleChange('entityType', e.target.value)}
                        >
                            <option>LLC</option>
                            <option>Corporation</option>
                            <option>Sole Proprietorship</option>
                            <option>Nonprofit</option>
                        </select>
                    </div>

                    {/* Secure EIN Component */}
                    <div className="space-y-1.5">
                        <SecureEINInput
                            value={formData.ein}
                            onChange={(val) => handleChange('ein', val)}
                        />
                    </div>


                    <Field
                        label="Business Phone"
                        value={formData.phone}
                        onChange={v => handleChange('phone', v)}
                    />
                    <Field
                        label="Business Email"
                        value={formData.email}
                        onChange={v => handleChange('email', v)}
                    />
                </div>
            </div>
        </Section>
    );
};

export default BusinessIdentitySection;
