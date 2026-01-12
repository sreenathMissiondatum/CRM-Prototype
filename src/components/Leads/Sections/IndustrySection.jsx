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
                    onChange={(code, desc) => {
                        // This component uses a specific signature in CreateLead, adapting here logic
                        // If reusing CreateLead logic:
                        if (handleChange) {
                            handleChange('naicsCode', code);
                            handleChange('naicsDescription', desc);
                            handleChange('sector', 'Derived Sector');
                        }
                    }}
                />
                <div className="grid grid-cols-2 gap-4">
                    <Field label="Physical Address" value={formData.address} onChange={v => handleChange('address', v)} />
                    <div className="grid grid-cols-3 gap-2">
                        <Field label="City" value={formData.city} onChange={v => handleChange('city', v)} />
                        <Field label="State" value={formData.state} onChange={v => handleChange('state', v)} />
                        <Field label="ZIP" value={formData.zip} onChange={v => handleChange('zip', v)} />
                    </div>
                </div>
            </div>
        </Section>
    );
};

export default IndustrySection;
