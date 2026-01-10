import React from 'react';
import { Check, Circle } from 'lucide-react';

const LEAD_STAGES = [
    'New',
    'Attempting Contact',
    'Pre-Screening',
    'Hold',
    'Nurturing',
    'Qualified',
    'Converted'
];

// Terminal states that map to specific "active" steps visually or simply stop the flow
const TERMINAL_MAPPING = {
    'Adverse Action': 'Pre-Screening', // Fails at Pre-Screening
    'Cold': 'Hold', // Fails at Hold
    'Unqualified': 'Nurturing' // Fails at Nurturing
};

const LeadStateChevron = ({ currentStage }) => {
    // Determine the index of the current stage in the main flow
    // If it's a terminal state, map it to where it "failed" or stopped
    let effectiveStage = currentStage;
    let isTerminal = false;

    if (TERMINAL_MAPPING[currentStage]) {
        effectiveStage = TERMINAL_MAPPING[currentStage];
        isTerminal = true;
    }

    const currentIndex = LEAD_STAGES.indexOf(effectiveStage);
    // If state is unknown, default to 0
    const activeIndex = currentIndex === -1 ? 0 : currentIndex;

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex items-center min-w-max">
                {LEAD_STAGES.map((step, index) => {
                    const isCompleted = index < activeIndex;
                    const isActive = index === activeIndex;
                    const isLast = index === LEAD_STAGES.length - 1;

                    // Styling for Terminal Failure (Red instead of Blue/Green if active & terminal)
                    let activeColorClass = 'bg-blue-600 text-white border-blue-600';
                    let activeTextClass = 'text-blue-900 font-bold';

                    if (isActive && isTerminal) {
                        // If we are at the step where it failed
                        activeColorClass = 'bg-red-100 text-red-600 border-red-300';
                        activeTextClass = 'text-red-700 font-bold';
                    }

                    return (
                        <div key={step} className="flex items-center group relative">
                            <div className="flex flex-col items-center relative z-10 w-40">
                                {/* Connector Line (Behind) */}
                                {!isLast && (
                                    <div
                                        className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 transition-colors duration-300 ${index < activeIndex ? 'bg-emerald-500' : 'bg-slate-200'
                                            }`}
                                    />
                                )}

                                {/* Icon / Circle */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : isActive
                                                ? isTerminal
                                                    ? 'bg-red-100 border-red-500 text-red-600'
                                                    : 'bg-white border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-50'
                                                : 'bg-white border-slate-300 text-slate-300'
                                        }`}
                                >
                                    {isCompleted ? (
                                        <Check size={16} strokeWidth={3} />
                                    ) : (
                                        <div className={`w-2.5 h-2.5 rounded-full ${isActive
                                                ? isTerminal ? 'bg-red-500' : 'bg-blue-600'
                                                : 'bg-slate-300'
                                            }`} />
                                    )}
                                </div>

                                {/* Label */}
                                <div className={`mt-2 text-xs text-center transition-colors duration-300 px-2 ${isActive
                                        ? 'text-slate-900 font-bold'
                                        : isCompleted
                                            ? 'text-slate-700 font-medium'
                                            : 'text-slate-400 font-medium'
                                    }`}>
                                    {/* If strictly active and terminal, show actual terminal name (e.g. Adverse Action) instead of effective step */}
                                    {(isActive && isTerminal) ? currentStage : step}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LeadStateChevron;
