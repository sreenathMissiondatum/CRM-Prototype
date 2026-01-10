import React, { useState, useMemo } from 'react';
import {
    Search, Filter, MessageSquare, FileText, User, Settings, Mail,
    ShieldAlert, ArrowUpRight, Calendar, ChevronDown, ChevronRight,
    Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Voicemail,
    Users, Clock, Video, CheckCircle2
} from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

const ActivitiesTab = ({ activities }) => {
    const [filterType, setFilterType] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedGroups, setExpandedGroups] = useState({ 'Today': true, 'Yesterday': true, 'This Week': true });

    const toggleGroup = (groupKey) => {
        setExpandedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
    };

    // --------------------------------------------------------------------------
    // FILTERING & SEARCH LOGIC
    // --------------------------------------------------------------------------
    const filteredActivities = useMemo(() => {
        return activities.filter(act => {
            // 1. Filter by Type
            if (filterType !== 'All') {
                if (filterType === 'Actions' && act.activityType !== 'ACTION') return false;
                if (filterType === 'Calls' && act.activityType !== 'CALL') return false;
                if (filterType === 'Meetings' && act.activityType !== 'MEETING') return false;
                if (filterType === 'Msgs' && act.activityType !== 'MESSAGE') return false;
                if (filterType === 'System' && act.activityType !== 'SYSTEM') return false;
                if (filterType === 'Decisions' && act.activityType !== 'DECISION') return false;
            }

            // 2. Search
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchTitle = act.title.toLowerCase().includes(query);
                const matchDesc = act.description?.toLowerCase().includes(query);
                const matchUser = act.performedBy?.toLowerCase().includes(query);
                if (!matchTitle && !matchDesc && !matchUser) return false;
            }

            return true;
        });
    }, [activities, filterType, searchQuery]);

    // --------------------------------------------------------------------------
    // GROUPING LOGIC (By Time)
    // --------------------------------------------------------------------------
    const groupedActivities = useMemo(() => {
        const groups = { 'Today': [], 'Yesterday': [], 'This Week': [], 'Earlier': [] };

        filteredActivities.forEach(act => {
            const date = new Date(act.timestamp);
            if (isToday(date)) groups['Today'].push(act);
            else if (isYesterday(date)) groups['Yesterday'].push(act);
            else if (isThisWeek(date)) groups['This Week'].push(act);
            else groups['Earlier'].push(act);
        });

        // Remove empty groups
        return Object.entries(groups).filter(([_, items]) => items.length > 0);
    }, [filteredActivities]);

    // --------------------------------------------------------------------------
    // UI HELPERS
    // --------------------------------------------------------------------------
    const getActivityIcon = (type) => {
        switch (type) {
            case 'DECISION': return <ShieldAlert className="text-purple-600" size={18} />;
            case 'ACTION': return <FileText className="text-blue-500" size={18} />;
            case 'MESSAGE': return <Mail className="text-amber-500" size={18} />;
            case 'SYSTEM': return <Settings className="text-slate-400" size={18} />;
            case 'CALL': return <Phone className="text-emerald-600" size={18} />;
            case 'MEETING': return <Users className="text-indigo-500" size={18} />;
            default: return <FileText className="text-slate-400" size={18} />;
        }
    };

    const formatTime = (isoString) => {
        if (!isoString) return '';
        return format(new Date(isoString), 'h:mm a');
    };

    const filters = [
        { id: 'All', label: 'All' },
        { id: 'Actions', label: 'Actions' },
        { id: 'Calls', label: 'Calls' },
        { id: 'Meetings', label: 'Meetings' },
        { id: 'Msgs', label: 'Msgs' },
        { id: 'System', label: 'System' },
        { id: 'Decisions', label: 'Decisions', highlight: true },
    ];

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* CONTROLS HEADER */}
            <div className="bg-white border text-center border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
                        {filters.map(f => (
                            <button
                                key={f.id}
                                onClick={() => setFilterType(f.id)}
                                className={`
                                    px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap
                                    ${filterType === f.id
                                        ? (f.highlight ? 'bg-purple-100 text-purple-700 ring-1 ring-purple-200' : 'bg-slate-800 text-white shadow-md')
                                        : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200'}
                                `}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* TIMELINE */}
            <div className="relative pl-4 sm:pl-0 space-y-2 pb-12">
                {groupedActivities.map(([groupKey, items]) => {
                    const isOpen = expandedGroups[groupKey] ?? true;

                    return (
                        <div key={groupKey} className="relative">
                            {/* Group Header */}
                            <div
                                onClick={() => toggleGroup(groupKey)}
                                className="sticky top-0 z-20 flex items-center gap-3 py-2 bg-slate-50/95 backdrop-blur-sm border-y border-slate-200/50 cursor-pointer hover:bg-slate-100 transition-colors group/header mb-4"
                            >
                                <button className="p-1 text-slate-400 group-hover:header:text-slate-600 transition-transform duration-200">
                                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex-1 flex items-center gap-2">
                                    {groupKey}
                                    <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px] min-w-[1.5rem] text-center">
                                        {items.length}
                                    </span>
                                </h3>
                            </div>

                            {/* Group Items */}
                            {isOpen && (
                                <div className="space-y-6 pl-4 sm:pl-8 relative animate-in slide-in-from-top-2 duration-200">
                                    {/* Timeline Line */}
                                    <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-slate-200 transform -translate-x-1/2"></div>

                                    {items.map((act) => (
                                        <div key={act.activityId} className="relative group">
                                            {/* Icon */}
                                            <div className={`
                                                absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-slate-50 flex items-center justify-center z-10 transition-transform group-hover:scale-110
                                                ${act.activityType === 'DECISION' ? 'bg-purple-100 ring-2 ring-purple-100' : 'bg-white ring-1 ring-slate-200'}
                                            `}>
                                                {getActivityIcon(act.activityType)}
                                            </div>

                                            {/* Card */}
                                            <div className={`
                                                ml-6 sm:ml-8 p-4 rounded-xl border transition-all duration-200 relative
                                                ${act.activityType === 'DECISION'
                                                    ? 'bg-purple-50/50 border-purple-200 hover:shadow-md'
                                                    : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm'}
                                                ${act.activityType === 'SYSTEM' ? 'opacity-80' : 'opacity-100'}
                                            `}>
                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border
                                                            ${act.activityType === 'DECISION' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-500 border-slate-200'}
                                                        `}>
                                                            {act.activityType}
                                                        </span>
                                                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {formatTime(act.timestamp)}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Title */}
                                                <h3 className={`text-sm font-semibold mb-1 ${act.activityType === 'DECISION' ? 'text-purple-900' : 'text-slate-800'}`}>
                                                    {act.title}
                                                </h3>

                                                {/* Description */}
                                                {act.description && (
                                                    <p className="text-sm text-slate-600 mb-3 bg-white/50 p-2 rounded border border-slate-200/50 italic">
                                                        {act.description}
                                                    </p>
                                                )}

                                                {/* Metadata (Calls/Meetings) */}
                                                {act.metadata && (
                                                    <div className="mb-3 flex flex-wrap gap-2">
                                                        {Object.entries(act.metadata).map(([key, value]) => (
                                                            <span key={key} className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                                                                {key}: {Array.isArray(value) ? value.length : value}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Footer: User & Related */}
                                                <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-100/50">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <div className="font-bold text-slate-700 flex items-center gap-1.5">
                                                            {act.performedBy === 'System' ? <Settings size={12} /> : <User size={12} />}
                                                            {act.performedBy}
                                                        </div>
                                                        {act.role && (
                                                            <span className="text-slate-400">• {act.role}</span>
                                                        )}
                                                    </div>

                                                    {act.relatedEntity && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Related:</span>
                                                            <span className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer">
                                                                {act.relatedEntity.label}
                                                                <ArrowUpRight size={12} />
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Empty State */}
                {groupedActivities.length === 0 && (
                    <div className="text-center py-12 ml-8 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <div className="bg-white inline-flex p-4 rounded-full mb-3 text-slate-300 shadow-sm border border-slate-100">
                            <Filter size={24} />
                        </div>
                        <h3 className="text-slate-900 font-medium">No activities found for this filter.</h3>
                        <p className="text-slate-500 text-sm mb-4">Try adjusting your filters or search query.</p>
                        <button
                            onClick={() => { setFilterType('All'); setSearchQuery(''); }}
                            className="text-blue-600 font-bold text-sm hover:underline"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivitiesTab;

