import React from 'react';
import { Check, Circle } from 'lucide-react';

const LIFECYCLE_STAGES = [
    'New',
    'Attempting Contact',
    'Pre-Screening',
    'Hold',
    'Nurturing',
    'Qualified',
    'Converted'
];

const LeadStateChevron = ({ currentStage }) => {
    // Determine the index of the current stage in the main flow
    const activeIndex = LIFECYCLE_STAGES.indexOf(currentStage);

    // If the stage is Converted, everything before it is completed.
    // If the stage is in the middle, everything before it is completed.

    return (
        <div className="w-full overflow-x-auto pb-4">
            <div className="flex items-center min-w-max">
                {LIFECYCLE_STAGES.map((step, index) => {
                    const isCompleted = index < activeIndex || currentStage === 'Converted' && index <= activeIndex;
                    const isActive = index === activeIndex && currentStage !== 'Converted';
                    const isLast = index === LIFECYCLE_STAGES.length - 1;

                    // Handling "Converted" specifically as a terminal but successful state
                    const isFullyCompleted = currentStage === 'Converted' && index === activeIndex;

                    return (
                        <div key={step} className="flex items-center group relative">
                            <div className="flex flex-col items-center relative z-10 w-40">
                                {/* Connector Line (Behind) */}
                                {!isLast && (
                                    <div
                                        className={`absolute top-4 left-1/2 w-full h-[2px] -z-10 transition-colors duration-300 ${index < activeIndex || (currentStage === 'Converted' && index < activeIndex) ? 'bg-emerald-500' : 'bg-slate-200'
                                            }`}
                                    />
                                )}

                                {/* Icon / Circle */}
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isCompleted || isFullyCompleted
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : isActive
                                            ? 'bg-white border-blue-600 text-blue-600 shadow-md ring-4 ring-blue-50'
                                            : 'bg-white border-slate-300 text-slate-300'
                                        }`}
                                >
                                    {isCompleted || isFullyCompleted ? (
                                        <Check size={16} strokeWidth={3} />
                                    ) : (
                                        <div className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-blue-600' : 'bg-slate-300'}`} />
                                    )}
                                </div>

                                {/* Label */}
                                <div className={`mt-2 text-xs text-center transition-colors duration-300 px-2 ${isActive || isFullyCompleted
                                    ? 'text-slate-900 font-bold'
                                    : isCompleted
                                        ? 'text-slate-700 font-medium'
                                        : 'text-slate-400 font-medium'
                                    }`}>
                                    {step}
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
