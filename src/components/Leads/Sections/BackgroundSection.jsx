import React from 'react';
import { Briefcase } from 'lucide-react';
import Section from '../../Shared/Section';
import Field from '../../Shared/Field';
import SystemField from '../../Shared/SystemField';

const BackgroundSection = ({
    isOpen,
    onToggle,
    formData,
    handleChange
}) => {
    return (
        <Section title="Business Background & Impact" icon={Briefcase} isOpen={isOpen} onToggle={onToggle}>
            <div className="grid grid-cols-2 gap-6">
                <Field type="date" label="Date Established" value={formData.dateEstablished} onChange={v => handleChange('dateEstablished', v)} />
                <div className="grid grid-cols-2 gap-4">
                    <SystemField label="Years in Business" value={formData.yearsInBusiness} />
                    <SystemField label="Startup Indicator" value={formData.isStartup ? 'YES' : 'NO'} />
                </div>
                <Field type="number" label="Pre-Loan FTE" value={formData.fteCount} onChange={v => handleChange('fteCount', v)} />
                <div className="col-span-2">
                    <Field type="textarea" label="Business Description" value={formData.description} onChange={v => handleChange('description', v)} />
                </div>

                <div className="col-span-2 space-y-3 pt-2 border-t border-slate-200">
                    <h4 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Impact & Demographics</h4>
                    <div className="grid grid-cols-2 gap-y-2">
                        {[
                            { label: 'Minority Owned', key: 'isMinorityOwned' },
                            { label: 'Woman Owned', key: 'isWomanOwned' },
                            { label: 'Veteran Owned', key: 'isVeteranOwned' },
                            { label: 'Native American Owned', key: 'isNativeAmericanOwned' },
                            { label: 'LGBTQ+ Owned', key: 'isLGBTQOwned' },
                            { label: 'Disability Owned', key: 'isDisabilityOwned' },
                            { label: 'Low Income Community', key: 'isLowIncomeCommunity' }
                        ].map(item => (
                            <label key={item.key} className="flex items-center gap-3 cursor-pointer group">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData[item.key] ? 'bg-blue-600 border-blue-600' : 'border-slate-300 bg-white group-hover:border-blue-400'}`}>
                                    {formData[item.key] && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                </div>
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={formData[item.key] || false}
                                    onChange={(e) => handleChange(item.key, e.target.checked)}
                                />
                                <span className="text-sm text-slate-700 font-medium">{item.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default BackgroundSection;
