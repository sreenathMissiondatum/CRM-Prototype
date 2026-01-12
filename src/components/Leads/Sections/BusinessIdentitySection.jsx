import React, { useState } from 'react';
import { Building2, Lock, Eye, EyeOff } from 'lucide-react';
import Section from '../../Shared/Section';
import Field from '../../Shared/Field';

const BusinessIdentitySection = ({
    isOpen,
    onToggle,
    formData,
    handleChange
}) => {
    const [isEINMasked, setIsEINMasked] = useState(true);

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
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">EIN / Tax ID</label>
                            <span className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-100 flex items-center gap-1 font-medium">
                                <Lock size={10} /> SENSITIVE
                            </span>
                        </div>
                        <div className="relative group">
                            <input
                                className={`w-full text-sm border rounded-lg px-3 py-2 outline-none transition-all ${isEINMasked ? 'bg-slate-50 text-slate-500 tracking-widest' : 'bg-white text-slate-800 tracking-wide border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
                                value={isEINMasked ? (formData.ein ? `**-***-${formData.ein.slice(-4)}` : '') : formData.ein}
                                onChange={e => !isEINMasked && handleChange('ein', e.target.value)}
                                placeholder={!isEINMasked ? "XX-XXXXXXX" : ""}
                                readOnly={isEINMasked}
                            />
                            <button
                                className="absolute right-0 top-full mt-1 text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => setIsEINMasked(!isEINMasked)}
                            >
                                {isEINMasked ? <><Eye size={12} /> Reveal EIN</> : <><EyeOff size={12} /> Hide EIN</>}
                            </button>
                        </div>
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
