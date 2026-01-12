import React from 'react';
import { Calendar } from 'lucide-react';
import Section from '../../Shared/Section';
import Field from '../../Shared/Field';
import SystemField from '../../Shared/SystemField';

const IdentificationSection = ({
    isOpen,
    onToggle,
    formData
}) => {
    return (
        <Section title="Identification & Timeline" icon={Calendar} isOpen={isOpen} onToggle={onToggle}>
            <div className="grid grid-cols-2 gap-6">
                <SystemField label="Lead Source" value={formData.source} />
                <SystemField label="Created Date" value={formData.createdDate} />
                <Field label="Assigned Loan Officer" value={formData.assignedOfficer} readOnly />
            </div>
        </Section>
    );
};

export default IdentificationSection;
