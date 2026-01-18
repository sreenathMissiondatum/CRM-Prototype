import React from 'react';
import { MapPin } from 'lucide-react';
import Section from '../../Shared/Section';
import Field from '../../Shared/Field';
import NAICSSelector from '../../Shared/NAICSSelector';

const IndustrySection = ({
    isOpen,
    onToggle,
    formData,
    handleChange,
    setFormData // Needed for NAICSSelector specialized update
}) => {
    return (
        <Section title="Industry & Location" icon={MapPin} isOpen={isOpen} onToggle={onToggle}>
            <div className="space-y-4">
                <NAICSSelector
                    value={formData.naicsCode}
                    onSelect={(data) => {
                        if (handleChange) {
                            handleChange('naicsCode', data.naicsCode);
                            handleChange('naicsDescription', data.naicsTitle);
                            handleChange('sector', data.parentCategory || 'Unknown Sector');
                        }
                    }}
                />
                <Field
                    label="NAICS Industry Sector"
                    value={formData.sector}
                    readOnly={true}
                    className="bg-slate-50 text-slate-500"
                />
            </div>
        </Section>
    );
};

export default IndustrySection;
