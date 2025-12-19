import React, { useState, useMemo } from 'react';
import {
    Search, Filter, CheckCircle2, AlertCircle, MessageSquare,
    FileText, User, Settings, Mail, ShieldAlert, CheckSquare,
    ArrowUpRight, Calendar, ChevronDown, ChevronRight,
    Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Voicemail,
    Users, Clock, Video
} from 'lucide-react';

const ActivitiesTab = ({ loan, activities }) => {
    // --------------------------------------------------------------------------
    // MOCK DATA: Timeline Activities - REMOVED (Received via props)
    // --------------------------------------------------------------------------

    const [filterType, setFilterType] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Default expanded state: Today & This Week
    const [expandedGroups, setExpandedGroups] = useState({
        'Today': true,
        'This Week': true
    });

    const toggleGroup = (groupKey) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupKey]: !prev[groupKey]
        }));
    };

    // --------------------------------------------------------------------------
    // FILTERING & GROUPING LOGIC
    // --------------------------------------------------------------------------
    const groupedActivities = useMemo(() => {
        const groups = {
            'Today': [],
            'This Week': [],
            // Older groups added dynamically
        };

        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(startOfToday);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday as start

        activities.forEach(act => {
            // 1. Apply Filters First
            if (filterType !== 'all') {
                if (act.category !== filterType) return;
            }

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesTitle = act.title.toLowerCase().includes(query);
                const matchesDesc = act.description?.toLowerCase().includes(query);
                const matchesUser = act.user.toLowerCase().includes(query);
                if (!matchesTitle && !matchesDesc && !matchesUser) return;
            }

            // 2. Determine Group
            const actDate = new Date(act.timestamp);
            let groupKey = '';

            if (actDate >= startOfToday) {
                groupKey = 'Today';
            } else if (actDate >= startOfWeek) {
                groupKey = 'This Week';
            } else {
                // Month - Year
                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                groupKey = `${monthNames[actDate.getMonth()]} ${actDate.getFullYear()}`;
            }

            if (!groups[groupKey]) groups[groupKey] = [];
            groups[groupKey].push(act);
        });

        // 3. Cleanup Empty Groups & Sort Keys
        const sortedGroups = [];
        if (groups['Today'].length > 0) sortedGroups.push({ key: 'Today', items: groups['Today'] });
        if (groups['This Week'].length > 0) sortedGroups.push({ key: 'This Week', items: groups['This Week'] });

        const monthKeys = Object.keys(groups).filter(k => k !== 'Today' && k !== 'This Week');
        monthKeys.sort((a, b) => new Date(b) - new Date(a));

        monthKeys.forEach(key => {
            if (groups[key].length > 0) sortedGroups.push({ key: key, items: groups[key] });
        });

        return sortedGroups;
    }, [activities, filterType, searchQuery]);

    // --------------------------------------------------------------------------
    // UI HELPERS
    // --------------------------------------------------------------------------
    const getActivityIcon = (act) => {
        switch (act.category) {
            case 'decision': return <ShieldAlert className="text-purple-600" size={18} />;
            case 'action': return <User className="text-blue-500" size={18} />;
            case 'communication': return <Mail className="text-amber-500" size={18} />;
            case 'system': return <Settings className="text-slate-400" size={18} />;
            case 'call':
                if (act.metadata?.outcome === 'missed') return <PhoneMissed className="text-red-400" size={18} />;
                if (act.metadata?.outcome === 'voicemail') return <Voicemail className="text-amber-500" size={18} />;
                if (act.metadata?.direction === 'inbound') return <PhoneIncoming className="text-green-500" size={18} />;
                return <PhoneOutgoing className="text-blue-500" size={18} />;
            case 'meeting':
                return <Video className="text-indigo-500" size={18} />;
            default: return <FileText className="text-slate-400" size={18} />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'decision': return 'Decision';
            case 'action': return 'Action';
            case 'communication': return 'Message';
            case 'system': return 'System';
            case 'call': return 'Call';
            case 'meeting': return 'Meeting';
            default: return 'Event';
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* CONTROLS HEADER */}
            <div className="bg-white border text-center border-slate-200 rounded-xl p-4 mb-6 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

                    {/* Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-hide">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'action', label: 'Actions' },
                            { id: 'call', label: 'Calls' },
                            { id: 'meeting', label: 'Meetings' },
                            { id: 'communication', label: 'Msgs' },
                            { id: 'system', label: 'System' },
                            { id: 'decision', label: 'Decisions', highlight: true },
                        ].map(f => (
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
                            placeholder="Search timeline..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* TIMELINE */}
            <div className="relative pl-4 sm:pl-0 space-y-2 pb-12">

                {groupedActivities.map((group) => {
                    const isOpen = expandedGroups[group.key] ?? false;

                    return (
                        <div key={group.key} className="relative">

                            {/* Group Header */}
                            <div
                                onClick={() => toggleGroup(group.key)}
                                className="sticky top-0 z-20 flex items-center gap-3 py-2 bg-slate-50/95 backdrop-blur-sm border-y border-slate-200/50 cursor-pointer hover:bg-slate-100 transition-colors group/header mb-4"
                            >
                                <button className="p-1 text-slate-400 group-hover:header:text-slate-600 transition-transform duration-200">
                                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                </button>
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex-1 flex items-center gap-2">
                                    {group.key}
                                    <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full text-[10px] min-w-[1.5rem] text-center">
                                        {group.items.length}
                                    </span>
                                </h3>
                            </div>

                            {/* Group Items */}
                            {isOpen && (
                                <div className="space-y-6 pl-4 sm:pl-8 relative animate-in slide-in-from-top-2 duration-200">
                                    {/* Timeline Line for Group */}
                                    <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-px bg-slate-200 transform -translate-x-1/2"></div>

                                    {group.items.map((activity) => (
                                        <div key={activity.id} className="relative group">

                                            {/* Dot / Icon */}
                                            <div className={`
                                                absolute left-0 sm:left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-slate-50 flex items-center justify-center z-10 transition-transform group-hover:scale-110
                                                ${activity.type === 'decision' ? 'bg-purple-100 ring-2 ring-purple-100' : 'bg-white ring-1 ring-slate-200'}
                                            `}>
                                                {getActivityIcon(activity)}
                                            </div>

                                            {/* Card Content */}
                                            <div className={`
                                                ml-6 sm:ml-8 p-4 rounded-xl border transition-all duration-200 relative
                                                ${activity.type === 'decision'
                                                    ? 'bg-purple-50/50 border-purple-200 hover:shadow-md'
                                                    : 'bg-white border-slate-200 hover:border-blue-200 hover:shadow-sm'}
                                            `}>
                                                {/* Header */}
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border
                                                            ${activity.type === 'decision' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-slate-100 text-slate-500 border-slate-200'}
                                                        `}>
                                                            {getTypeLabel(activity.type)}
                                                        </span>
                                                        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {activity.displayTime}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Title & Description */}
                                                <h3 className={`text-sm font-semibold mb-1 ${activity.type === 'decision' ? 'text-purple-900' : 'text-slate-800'}`}>
                                                    {activity.title}
                                                </h3>

                                                {activity.description && (
                                                    <p className="text-sm text-slate-600 mb-3 bg-white/50 p-2 rounded border border-slate-200/50 italic">
                                                        {activity.description}
                                                    </p>
                                                )}

                                                {/* Call/Meeting Specific Metadata */}
                                                {(activity.type === 'call' || activity.type === 'meeting') && activity.metadata && (
                                                    <div className="mb-3 flex flex-wrap gap-2">
                                                        {/* Outcome / Status Badge */}
                                                        {activity.metadata.outcome && (
                                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border uppercase tracking-wider
                                                                ${activity.metadata.outcome === 'connected' ? 'bg-green-50 text-green-700 border-green-200' :
                                                                    activity.metadata.outcome === 'missed' ? 'bg-red-50 text-red-700 border-red-200' :
                                                                        'bg-amber-50 text-amber-700 border-amber-200'}
                                                            `}>
                                                                {activity.metadata.outcome}
                                                            </span>
                                                        )}
                                                        {activity.metadata.status && (
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                                                                {activity.metadata.status}
                                                            </span>
                                                        )}

                                                        {/* Duration */}
                                                        {activity.metadata.duration && (
                                                            <span className="text-xs text-slate-500 flex items-center gap-1">
                                                                <Clock size={12} />
                                                                {activity.metadata.duration}
                                                            </span>
                                                        )}

                                                        {/* Participants */}
                                                        {activity.metadata.participants && (
                                                            <span className="text-xs text-slate-500 flex items-center gap-1" title={activity.metadata.participants.join(', ')}>
                                                                <Users size={12} />
                                                                {activity.metadata.participants.length} Participants
                                                            </span>
                                                        )}
                                                    </div>
                                                )}

                                                {/* Meta & Actions */}
                                                <div className="flex flex-wrap items-center justify-between gap-4 mt-3 pt-3 border-t border-slate-100/50">
                                                    <div className="flex items-center gap-2 text-xs">
                                                        <div className="font-bold text-slate-700 flex items-center gap-1.5">
                                                            {activity.user === 'System' ? <Settings size={12} /> : <User size={12} />}
                                                            {activity.user}
                                                        </div>
                                                        {activity.role && (
                                                            <>
                                                                <span className="text-slate-300">•</span>
                                                                <span className="text-slate-500">{activity.role}</span>
                                                            </>
                                                        )}
                                                    </div>

                                                    {activity.related && (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Related:</span>
                                                            <a href="#" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">
                                                                {activity.related.label}
                                                                <ArrowUpRight size={12} />
                                                            </a>
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

                {groupedActivities.length === 0 && (
                    <div className="text-center py-12 ml-8">
                        <div className="bg-slate-50 inline-flex p-4 rounded-full mb-3 text-slate-300">
                            <Filter size={24} />
                        </div>
                        <h3 className="text-slate-900 font-medium">No activities found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
                        <button
                            onClick={() => { setFilterType('all'); setSearchQuery(''); }}
                            className="mt-4 text-blue-600 font-bold text-sm hover:underline"
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
