import React from 'react';
import { BadgeCheck } from 'lucide-react';
import Section from '../../Shared/Section';
import Field from '../../Shared/Field';

const CreditSection = ({
    isOpen,
    onToggle,
    formData,
    handleChange
}) => {
    return (
        <Section title="Credit Signals (Self-Reported)" icon={BadgeCheck} isOpen={isOpen} onToggle={onToggle}>
            <div className="space-y-6">
                <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Principal Credit Score Range</label>
                    <div className="flex flex-wrap gap-2">
                        {['< 600', '600-649', '650-699', '700-749', '750+'].map(range => (
                            <button
                                key={range}
                                onClick={() => handleChange('creditScoreRange', range)}
                                className={`px-3 py-1.5 text-sm rounded-full border transition-all ${formData.creditScoreRange === range
                                        ? 'bg-blue-100 border-blue-200 text-blue-700 font-medium shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                    }`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <Field label="Business Credit Score" value={formData.businessScore} onChange={v => handleChange('businessScore', v)} />
                    <Field type="date" label="Reported Date" value={formData.creditReportDate} onChange={v => handleChange('creditReportDate', v)} />
                </div>
            </div>
        </Section>
    );
};

export default CreditSection;
