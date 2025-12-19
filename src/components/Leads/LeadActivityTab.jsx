import React, { useState } from 'react';
import {
    Search, Filter, Plus
} from 'lucide-react';
import ActivityCard from './ActivityCard';

const LeadActivityTab = ({ activities }) => {
    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Logic
    const filteredActivities = activities.filter(activity => {
        const matchesType = filter === 'All' || activity.type === filter.toLowerCase();
        const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            activity.summary.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesSearch;
    });

    // Group by Date for Timeline
    const groupedActivities = filteredActivities.reduce((groups, activity) => {
        const date = activity.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(activity);
        return groups;
    }, {});

    const groupOrder = ['Today', 'Yesterday', 'Earlier'];

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">

                {/* Search & Filter */}
                <div className="flex items-center gap-2 w-full md:w-auto flex-1">
                    <div className="relative flex-1 md:max-w-xs">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search activities..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto max-w-full no-scrollbar">
                        {['All', 'Call', 'Email', 'Meeting', 'Note'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${filter === f
                                    ? 'bg-white text-blue-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Action */}
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm shadow-blue-200 whitespace-nowrap">
                    <Plus size={16} />
                    Log Activity
                </button>
            </div>

            {/* Timeline */}
            <div className="relative space-y-8 pl-2">
                {/* Global Vertical Line */}
                <div className="absolute left-[13px] top-4 bottom-0 w-px bg-slate-100 -z-10"></div>

                {groupOrder.map(dateGroup => {
                    const groupItems = groupedActivities[dateGroup];
                    if (!groupItems) return null;

                    return (
                        <div key={dateGroup} className="relative">
                            {/* Date Header */}
                            <div className="sticky top-0 z-20 bg-slate-50/95 backdrop-blur-sm py-2 mb-4 flex items-center gap-3">
                                <div className="w-2.5 h-2.5 rounded-full bg-slate-300 ring-4 ring-slate-50 border-2 border-white"></div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                                    {dateGroup}
                                </span>
                            </div>

                            {/* Activities in Group */}
                            <div className="space-y-0">
                                {groupItems.map(activity => (
                                    <ActivityCard key={activity.id} activity={activity} />
                                ))}
                            </div>
                        </div>
                    );
                })}

                {filteredActivities.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                            <Search size={20} />
                        </div>
                        <h3 className="text-slate-900 font-medium mb-1">No activities found</h3>
                        <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadActivityTab;
