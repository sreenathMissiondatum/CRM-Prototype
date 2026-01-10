import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, RefreshCw, Ban, ShieldAlert, CheckCircle, PauseCircle, Phone, Search } from 'lucide-react';

const LIFECYCLE_STAGES = [
    'New', 'Attempting Contact', 'Pre-Screening', 'Hold', 'Nurturing', 'Qualified', 'Converted'
];

const TERMINAL_OUTCOMES = [
    'Unqualified', 'Cold', 'Adverse Action'
];

const STATE_ICONS = {
    'New': <CheckCircle size={14} className="text-slate-400" />,
    'Attempting Contact': <Phone size={14} />,
    'Pre-Screening': <Search size={14} />,
    'Hold': <PauseCircle size={14} />,
    'Nurturing': <RefreshCw size={14} />,
    'Qualified': <CheckCircle size={14} />,
    'Converted': <CheckCircle size={14} />,
    'Adverse Action': <ShieldAlert size={14} className="text-amber-500" />,
    'Unqualified': <Ban size={14} className="text-slate-400" />,
    'Cold': <Ban size={14} className="text-blue-400" />
};

const LeadStateControl = ({ currentStage, outcomeStatus, onStageChange, userRole }) => {
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

    // Access Control
    const canEdit = ['Loan Officer', 'Relationship Manager', 'Administrator', 'Underwriter'].includes(userRole);
    if (!canEdit) return null;

    const isClosed = outcomeStatus !== null;

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Main Button */}
            <button
                disabled={isClosed}
                onClick={() => setIsOpen(!isOpen)}
                title={isClosed ? "This lead is closed and cannot be modified." : "Change Status"}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isClosed
                    ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-700 border-slate-300 shadow-sm hover:bg-slate-50 hover:border-blue-300 hover:text-blue-700'
                    }`}
            >
                {isClosed ? (
                    <>
                        {STATE_ICONS[outcomeStatus] || <Ban size={14} />}
                        {outcomeStatus}
                    </>
                ) : (
                    <>
                        Change Status
                        <ChevronDown size={14} />
                    </>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                    <div className="max-h-80 overflow-y-auto p-1">
                        {/* Section 1: Lifecycle */}
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Lifecycle Status
                        </div>
                        {LIFECYCLE_STAGES.map(stage => {
                            const isCurrent = currentStage === stage && !isClosed;
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

                        {/* Divider */}
                        <div className="h-px bg-slate-100 my-1 mx-1"></div>

                        {/* Section 2: Terminal */}
                        <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Close Lead (Terminal)
                        </div>
                        {TERMINAL_OUTCOMES.map(stage => {
                            const isCurrent = outcomeStatus === stage;
                            return (
                                <button
                                    key={stage}
                                    onClick={() => handleOptionSelect(stage)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors text-left ${isCurrent
                                        ? 'bg-amber-50 text-amber-700 font-medium'
                                        : 'text-slate-600 hover:bg-amber-50/50 hover:text-amber-800'
                                        }`}
                                >
                                    <div className={`${isCurrent ? 'text-amber-600' : 'text-slate-400'}`}>
                                        {STATE_ICONS[stage] || <Ban size={14} />}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {stage}
                                        <ShieldAlert size={12} className="text-slate-300" />
                                    </div>
                                    {isCurrent && <CheckCircle size={12} className="ml-auto text-amber-600" />}
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
