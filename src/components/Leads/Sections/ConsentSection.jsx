import React from 'react';
import { FileCheck } from 'lucide-react';
import Section from '../../Shared/Section';

const ConsentSection = ({
    isOpen,
    onToggle,
    formData,
    handleChange
}) => {
    return (
        <Section title="Consent & Compliance" icon={FileCheck} isOpen={isOpen} onToggle={onToggle}>
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <input
                    type="checkbox"
                    checked={formData.consentCaptured}
                    onChange={e => handleChange('consentCaptured', e.target.checked)}
                    className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div>
                    <p className="text-sm font-medium text-blue-900">Applicant Consent Captured</p>
                    <p className="text-xs text-blue-700">I confirm the applicant has consented to background checks and credit pulls.</p>
                </div>
            </div>
        </Section>
    );
};

export default ConsentSection;
