import React from 'react';
import { ArrowRight, ChevronRight, CheckCircle2, Circle } from 'lucide-react';

const ProgressiveButton = ({ progress = 0, onClick, disabled = false }) => {
    const isReady = progress >= 100;

    // Dynamic width for the progress bar background
    const progressStyle = {
        width: `${progress}%`,
        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="group relative w-full h-14 rounded-lg overflow-hidden border border-slate-200 shadow-sm transition-all hover:shadow-md active:scale-[0.99] bg-white text-left"
        >
            {/* Background Track */}
            <div className="absolute inset-0 bg-slate-50 w-full h-full"></div>

            {/* Progress Fill - Neutral to Positive */}
            <div
                className={`absolute inset-y-0 left-0 transition-colors duration-500 ease-in-out ${isReady ? 'bg-emerald-500' : 'bg-slate-200/50 group-hover:bg-slate-200'
                    }`}
                style={progressStyle}
            ></div>

            {/* Content Layer */}
            <div className="relative flex items-center justify-between px-4 h-full z-10 w-full">

                {/* Primary Label */}
                <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-full ${isReady ? 'bg-white/20 text-white' : 'bg-white border border-slate-200 text-slate-400'}`}>
                        {isReady ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-slate-300" />}
                    </div>
                    <div className="flex flex-col">
                        <span className={`text-sm font-bold leading-tight ${isReady ? 'text-white' : 'text-slate-800'}`}>
                            Convert To Loan Application
                        </span>
                        {!isReady && (
                            <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">
                                Steps Remaining
                            </span>
                        )}
                    </div>
                </div>

                {/* Secondary Status & Action Indicator */}
                <div className="flex items-center gap-3">
                    {!isReady && (
                        <span className="text-xs font-bold text-slate-600 bg-white/60 px-2 py-0.5 rounded border border-slate-200/50 backdrop-blur-[1px]">
                            {Math.floor(progress)}% Ready
                        </span>
                    )}

                    <div className={`transition-transform duration-300 ${isReady ? 'text-white translate-x-1' : 'text-slate-400 group-hover:translate-x-1'}`}>
                        {isReady ? <ArrowRight size={20} /> : <ChevronRight size={20} />}
                    </div>
                </div>
            </div>
        </button>
    );
};

export default ProgressiveButton;
