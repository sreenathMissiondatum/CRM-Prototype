import React from 'react';
import { Share2, Lock } from 'lucide-react';
import Section from '../../Shared/Section';
import SimpleLookup from '../../Shared/SimpleLookup';
import { MOCK_ACCOUNTS, MOCK_CONTACTS } from '../../../data/mockReferralData';

const ReferralSection = ({
    isOpen,
    onToggle,
    formData,
    handleChange, // Should handle updates to 'referral' object
    setFormData // Needed for lookup state updates
}) => {
    return (
        <Section title="Referral & Technical Assistance" icon={Share2} isOpen={isOpen} onToggle={onToggle}>
            <div className="p-3 mb-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Lock size={12} />
                Internal fields only visible to staff.
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Referral Source Type</label>
                    <select
                        className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                        value={formData.referral.sourceType}
                        onChange={e => handleChange('referral', { ...formData.referral, sourceType: e.target.value })}
                    >
                        <option value="">-- Select Type --</option>
                        <option value="Community Partner">Community Partner</option>
                        <option value="Bank">Bank</option>
                        <option value="CDFI Partner">CDFI Partner</option>
                        <option value="Government Agency">Government Agency</option>
                        <option value="Nonprofit">Nonprofit</option>
                        <option value="Internal Referral">Internal Referral</option>
                    </select>
                </div>

                <div className="space-y-1.5 relative">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Referring Organization {formData.referral.sourceType && <span className="text-red-500">*</span>}
                    </label>
                    <SimpleLookup
                        placeholder="Search Organizations..."
                        disabled={!formData.referral.sourceType}
                        value={formData.referral.partnerOrgName || formData.referral.partnerOrg} // fallback
                        options={MOCK_ACCOUNTS.filter(a => a.type === 'Referral Source' || a.type === formData.referral.sourceType)}
                        onSelect={(item) => {
                            handleChange('referral', {
                                ...formData.referral,
                                partnerOrg: item.id,
                                partnerOrgName: item.name,
                                contact: '',
                                contactName: ''
                            });
                        }}
                        onClear={() => {
                            handleChange('referral', { ...formData.referral, partnerOrg: '', partnerOrgName: '', contact: '', contactName: '' });
                        }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Referring Contact</label>
                    <SimpleLookup
                        placeholder="Search Contacts..."
                        disabled={!formData.referral.partnerOrg}
                        value={formData.referral.contactName || formData.referral.contact} // fallback
                        options={MOCK_CONTACTS.filter(c => c.accountId === formData.referral.partnerOrg).map(c => ({ id: c.id, name: `${c.name} - ${c.title}` }))}
                        onSelect={(item) => {
                            handleChange('referral', {
                                ...formData.referral,
                                contact: item.id,
                                contactName: item.name
                            });
                        }}
                        onClear={() => {
                            handleChange('referral', { ...formData.referral, contact: '', contactName: '' });
                        }}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Referral Outcome</label>
                    <select
                        className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                        value={formData.referral.outcome}
                        onChange={e => handleChange('referral', { ...formData.referral, outcome: e.target.value })}
                    >
                        <option value="">-- Select Outcome --</option>
                        <option value="Application Started">Application Started</option>
                        <option value="Technical Assistance Only">Technical Assistance Only</option>
                        <option value="Declined">Declined</option>
                        <option value="Withdrawn">Withdrawn</option>
                        <option value="Referred Elsewhere">Referred Elsewhere</option>
                    </select>
                </div>
            </div>
        </Section>
    );
};

export default ReferralSection;
