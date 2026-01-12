import React from 'react';
import { RefreshCw } from 'lucide-react';
import Section from '../../Shared/Section';

const HistorySection = ({
    isOpen,
    onToggle,
    formData,
    handleChange
}) => {
    return (
        <Section title="Borrowing History" icon={RefreshCw} isOpen={isOpen} onToggle={onToggle}>
            <div className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    checked={formData.history.hasPriorLoans}
                    onChange={e => handleChange('history', { ...formData.history, hasPriorLoans: e.target.checked })}
                    className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-slate-700">Prior Borrower with this CDFI?</label>
            </div>
            {formData.history.hasPriorLoans && (
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-center text-slate-500 text-sm">
                    Loan history collection UI would go here (rows of ID, Date, Status, Performance)
                </div>
            )}
        </Section>
    );
};

export default HistorySection;
