import React, { useState } from 'react';
import {
    Phone, Mail, Calendar, FileText, CheckCircle2,
    ArrowRight, MessageSquare, Clock, AlertCircle,
    Download, ExternalLink, User, Shield
} from 'lucide-react';

const ActivityCard = ({ activity }) => {
    const [expanded, setExpanded] = useState(false);

    // Config based on activity type
    const getConfig = (type) => {
        switch (type) {
            case 'call':
                return {
                    icon: Phone,
                    color: 'text-emerald-600',
                    bg: 'bg-emerald-100',
                    border: 'border-emerald-200'
                };
            case 'email':
                return {
                    icon: Mail,
                    color: 'text-blue-600',
                    bg: 'bg-blue-100',
                    border: 'border-blue-200'
                };
            case 'meeting':
                return {
                    icon: Calendar,
                    color: 'text-purple-600',
                    bg: 'bg-purple-100',
                    border: 'border-purple-200'
                };
            case 'document':
                return {
                    icon: FileText,
                    color: 'text-amber-600',
                    bg: 'bg-amber-100',
                    border: 'border-amber-200'
                };
            case 'note':
                return {
                    icon: MessageSquare,
                    color: 'text-slate-600',
                    bg: 'bg-slate-100',
                    border: 'border-slate-200'
                };
            case 'system':
            default:
                return {
                    icon: Shield,
                    color: 'text-slate-500',
                    bg: 'bg-slate-100',
                    border: 'border-slate-200'
                };
        }
    };

    const config = getConfig(activity.type);
    const Icon = config.icon;

    return (
        <div className="relative pl-8 pb-8 group last:pb-0">
            {/* Timeline Line */}
            <div className="absolute left-[11px] top-8 bottom-0 w-px bg-slate-200 group-last:hidden"></div>

            {/* Icon Bubble */}
            <div className={`absolute left-0 top-0 w-6 h-6 rounded-full flex items-center justify-center border ${config.bg} ${config.border} ${config.color} z-10 shadow-sm`}>
                <Icon size={12} />
            </div>

            {/* Card Content */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200">
                <div className="p-4">
                    {/* Header: Title + Meta */}
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-800">{activity.title}</h4>
                            {activity.outcome && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                                    {activity.outcome}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="text-xs text-slate-400 font-medium whitespace-nowrap">
                                {activity.timestamp}
                            </div>
                        </div>
                    </div>

                    {/* Subtitle / Actor */}
                    <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                        <User size={12} className="text-slate-400" />
                        <span>{activity.actor}</span>
                        {activity.duration && (
                            <>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} /> {activity.duration}
                                </span>
                            </>
                        )}
                    </div>

                    {/* Description / Summary */}
                    <div className="text-sm text-slate-600 leading-relaxed">
                        {activity.summary}
                    </div>

                    {/* Expandable Content (e.g. detailed notes) */}
                    {activity.details && (
                        <div className={`mt-3 pt-3 border-t border-slate-50 text-sm text-slate-600 bg-slate-50/50 -mx-4 -mb-4 px-4 py-3 rounded-b-lg ${expanded ? '' : 'hidden'}`}>
                            {activity.details}
                        </div>
                    )}

                    {/* Actions Footer */}
                    <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-100">
                        {activity.type === 'email' && (
                            <button className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                                <ExternalLink size={12} /> View Email
                            </button>
                        )}
                        {activity.type === 'document' && (
                            <button className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors">
                                <Download size={12} /> Download
                            </button>
                        )}
                        {activity.details && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="text-xs font-medium text-slate-500 hover:text-slate-800 ml-auto transition-colors"
                            >
                                {expanded ? 'Less Details' : 'More Details'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
