import React from 'react';
import { Info, HelpCircle, ChevronRight } from 'lucide-react';

const LeadEligibilityTile = ({ status, onClick }) => {
    // Define styles based on status
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Likely Eligible':
                return {
                    bg: 'bg-emerald-50',
                    border: 'border-emerald-100',
                    text: 'text-emerald-700',
                    icon: 'text-emerald-500',
                    indicator: 'bg-emerald-500'
                };
            case 'Possibly Eligible':
                return {
                    bg: 'bg-amber-50',
                    border: 'border-amber-100',
                    text: 'text-amber-700',
                    icon: 'text-amber-500',
                    indicator: 'bg-amber-500'
                };
            case 'Unlikely Eligible':
                return {
                    bg: 'bg-red-50',
                    border: 'border-red-100',
                    text: 'text-red-700',
                    icon: 'text-red-500',
                    indicator: 'bg-red-500'
                };
            default: // Eligibility Unknown
                return {
                    bg: 'bg-slate-50',
                    border: 'border-slate-200',
                    text: 'text-slate-600',
                    icon: 'text-slate-400',
                    indicator: 'bg-slate-400'
                };
        }
    };

    const styles = getStatusStyles(status);

    return (
        <div
            className={`p-3 rounded-lg border ${styles.bg} ${styles.border} flex flex-col justify-between items-start text-left shadow-sm relative group cursor-pointer hover:shadow-md transition-all`}
            onClick={onClick}
        >
            <div className="w-full flex justify-between items-start mb-1">
                <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 flex items-center gap-1.5">
                    Eligibility
                    <Info size={12} className={styles.icon} />
                </div>
                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${styles.icon}`} />
            </div>

            <div className={`font-bold text-sm md:text-base leading-tight ${styles.text}`}>
                {status}
            </div>

            <div className="absolute top-0 right-0 bottom-0 w-1 bg-transparent group-hover:bg-current opacity-10 rounded-r-lg transition-colors"></div>

            <div className="mt-1 text-[10px] font-medium opacity-0 group-hover:opacity-60 transition-opacity flex items-center gap-1">
                View Explanation
            </div>
        </div>
    );
};

export default LeadEligibilityTile;
