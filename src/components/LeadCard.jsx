import React from 'react';
import { Phone, Mail, ArrowRight, User } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import CallPrimaryWidget from './Shared/CallPrimaryWidget';


const LeadCard = ({ lead }) => {
    const getStageColor = (stage) => {
        switch (stage.toLowerCase()) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'contacted': return 'bg-purple-100 text-purple-700';
            case 'qualified': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User size={16} />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">{lead.name}</h3>
                        <p className="text-xs text-slate-500">{lead.company}</p>
                    </div>
                </div>
                <span className={twMerge(
                    "px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
                    getStageColor(lead.stage)
                )}>
                    {lead.stage}
                </span>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="text-xs text-slate-500">
                    Potential Value
                </div>
                <div className="font-bold text-slate-900 text-sm">{lead.value}</div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                <CallPrimaryWidget
                    context={{ type: 'Lead', id: lead.id, name: lead.name }}
                    contact={{ name: lead.name, phone: lead.phone, role: 'Lead' }}
                    variant="minimal"
                    onLogActivity={(activity) => console.log('Lead Card Activity:', activity)}
                />

                <button className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-md text-xs font-medium transition-colors">
                    <Mail size={14} />
                    <span>Email</span>
                </button>
            </div>
        </div>
    );
};

export default LeadCard;
