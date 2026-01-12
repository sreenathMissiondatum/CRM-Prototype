import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const Section = ({ title, icon: Icon, children, isOpen, onToggle }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
        <button
            type="button"
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors border-b border-transparent hover:border-slate-100"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 text-slate-500 rounded-lg border border-slate-200 shadow-sm">
                    <Icon size={18} />
                </div>
                <h3 className="font-bold text-slate-800 text-base">{title}</h3>
            </div>
            {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
        </button>

        {isOpen && (
            <div className="p-6 border-t border-slate-100">
                {children}
            </div>
        )}
    </div>
);

export default Section;
