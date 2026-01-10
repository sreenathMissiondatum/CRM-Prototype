import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, RefreshCw, Ban, ShieldAlert, CheckCircle, PauseCircle, Phone, Search } from 'lucide-react';

const LEAD_STAGES = [
    'New', 'Attempting Contact', 'Pre-Screening', 'Hold', 'Nurturing', 'Qualified', 'Converted', 'Unqualified', 'Adverse Action', 'Cold'
];

const STATE_ICONS = {
    'New': <CheckCircle size={14} className="text-slate-400" />,
    'Attempting Contact': <Phone size={14} />,
    'Pre-Screening': <Search size={14} />,
    'Hold': <PauseCircle size={14} />,
    'Nurturing': <RefreshCw size={14} />,
    'Qualified': <CheckCircle size={14} />,
    'Converted': <CheckCircle size={14} />,
    'Adverse Action': <ShieldAlert size={14} />,
    'Unqualified': <Ban size={14} />,
    'Cold': <Ban size={14} />
};

const LeadStateControl = ({ currentStage, onStageChange, userRole, readOnly }) => {
    // Dropdown State
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Click Outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handlers
    const handleOptionSelect = (stage) => {
        onStageChange(stage);
        setIsOpen(false);
    };

    // Access Control (Simplistic for MVP: Only LO/Admin/RM)
    // Same rule as before, if strict RBAC is desired.
    const canEdit = ['Loan Officer', 'Relationship Manager', 'Administrator', 'Underwriter'].includes(userRole);

    if (!canEdit) return null;

    if (readOnly) {
        return (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-500 rounded-lg text-xs font-bold border border-slate-200 cursor-not-allowed">
                {STATE_ICONS[currentStage] || <CheckCircle size={14} />}
                {currentStage}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Main Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-white text-slate-700 rounded-lg text-xs font-bold border border-slate-300 shadow-sm hover:bg-slate-50 hover:border-blue-300 hover:text-blue-700 transition-all"
            >
                Change Status
                <ChevronDown size={14} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                    <div className="max-h-80 overflow-y-auto p-1">
                        {LEAD_STAGES.map(stage => {
                            const isCurrent = currentStage === stage;
                            return (
                                <button
                                    key={stage}
                                    onClick={() => handleOptionSelect(stage)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left ${isCurrent
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                        }`}
                                >
                                    <div className={`${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                                        {STATE_ICONS[stage] || <CheckCircle size={14} />}
                                    </div>
                                    {stage}
                                    {isCurrent && <CheckCircle size={12} className="ml-auto text-blue-600" />}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadStateControl;
