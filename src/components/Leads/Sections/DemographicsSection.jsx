import React from 'react';
import { Users, Info } from 'lucide-react';
import Section from '../../Shared/Section';

const DemographicsSection = ({
    isOpen,
    onToggle
}) => {
    return (
        <Section title="1071 Compliance (See Contacts)" icon={Users} isOpen={isOpen} onToggle={onToggle}>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 flex items-start gap-3">
                <Info size={16} className="mt-0.5 shrink-0" />
                <p>To ensure strict data alignment, 1071 Demographic data is now managed directly within the <strong>Contacts & Ownership</strong> section above. Please expand that section to view or edit demographic data for each owner.</p>
            </div>
        </Section>
    );
};

export default DemographicsSection;
