import React from 'react';
import { Building2 } from 'lucide-react';
import Section from '../../Shared/Section';
import Field from '../../Shared/Field';
import SecureEINInput from '../../Shared/SecureEINInput';

const BusinessIdentitySection = ({
    isOpen,
    onToggle,
    formData,
    handleChange
}) => {
    return (
        <Section title="Business Identity" icon={Building2} isOpen={isOpen} onToggle={onToggle}>
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
