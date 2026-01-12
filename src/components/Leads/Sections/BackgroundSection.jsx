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
            </div>
        </Section>
    );
};

export default BackgroundSection;
