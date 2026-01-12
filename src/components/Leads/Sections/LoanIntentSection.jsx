import React from 'react';
import { CreditCard } from 'lucide-react';
import Section from '../../Shared/Section';
import Field from '../../Shared/Field';
import SystemField from '../../Shared/SystemField';

const LoanIntentSection = ({
    isOpen,
    onToggle,
    formData,
    handleChange,
    totalProjectCost
}) => {
    return (
        <Section title="Loan Intent & Funding" icon={CreditCard} isOpen={isOpen} onToggle={onToggle}>
            <div className="grid grid-cols-3 gap-6">
                <Field label="Requested Amount" value={formData.loanAmount} onChange={v => handleChange('loanAmount', v)} type="number" required />
                <Field label="Term (Months)" value={formData.loanTerm} onChange={v => handleChange('loanTerm', v)} type="number" />
                <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Use of Funds</label>
                    <select className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white">
                        <option>Working Capital</option>
                        <option>Equipment</option>
                        <option>Real Estate</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-4 pt-4 border-t border-slate-100">
                <Field label="Owner Contribution" value={formData.ownerContribution} onChange={v => handleChange('ownerContribution', v)} type="number" />
                <Field label="Other Funding" value={formData.otherFunding} onChange={v => handleChange('otherFunding', v)} type="number" />
                <SystemField label="Total Project Cost" value={totalProjectCost} />
            </div>
        </Section>
    );
};

export default LoanIntentSection;
