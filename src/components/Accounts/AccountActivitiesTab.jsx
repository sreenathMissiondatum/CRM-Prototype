import React, { useState, useMemo } from 'react';
import {
    Search, Filter, Calendar, FileText,
    Phone, Mail, CheckCircle, AlertTriangle,
    CreditCard, User, MoreHorizontal, ArrowRight,
    Briefcase, Shield, Clock, Layout
} from 'lucide-react';

const AccountActivitiesTab = ({
    onViewLoan,
    onViewDocument,
    onViewTask,
    onViewLead,
    onViewTA
}) => {

    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [filterContext, setFilterContext] = useState('All');

    // Rich Mock Data
    const rawActivities = [
        {
            id: 'a1',
            type: 'compliance',
            title: 'Document Expired: Business License',
            description: 'System flagged "Business License" as expired. Compliance task created.',
            date: '2024-03-14T09:30:00',
            actor: 'System',
            context: 'Documents',
            entityId: 'DOC-002',
            icon: AlertTriangle,
            color: 'text-red-600 bg-red-100',
        },
        {
            id: 'a2',
            type: 'loan',
            title: 'Loan Application Submitted',
            description: 'New working capital loan application (LN-2024-001) submitted for underwriting.',
            date: '2024-03-10T14:15:00',
            actor: 'Sarah Jenkins',
            context: 'Loan',
            entityId: 'LN-2024-001',
            icon: CreditCard,
            color: 'text-blue-600 bg-blue-100',
        },
        {
            id: 'a3',
            type: 'document',
            title: 'Uploaded: Tax Returns 2023',
            description: 'Uploaded version 1.0 of 2023 Corporate Tax Returns.',
            date: '2024-03-08T11:00:00',
            actor: 'Borrower (Portal)',
            context: 'Documents',
            entityId: 'DOC-005',
            icon: FileText,
            color: 'text-slate-600 bg-slate-100',
        },
        {
            id: 'a4',
            type: 'communication',
            title: 'Call with Guarantor',
            description: 'Discussed Q4 financials and upcoming expansion plans. Client is optimistic.',
            date: '2024-02-28T16:45:00',
            actor: 'Sarah Miller',
            context: 'Account',
            entityId: 'LOG-102',
            icon: Phone,
            color: 'text-emerald-600 bg-emerald-100',
        },
        {
            id: 'a5',
            type: 'task',
            title: 'Completed: Annual Review',
            description: 'Annual account review completed. Risk rating updated to A-.',
            date: '2024-02-15T10:00:00',
            actor: 'Mike Ross',
            context: 'Task',
            entityId: 'TSK-991',
            icon: CheckCircle,
            color: 'text-indigo-600 bg-indigo-100',
        },
        {
            id: 'a6',
            type: 'ta',
            title: 'TA Session: Marketing Strategy',
            description: 'Consultant session held regarding digital marketing implementation.',
            date: '2024-01-20T13:30:00',
            actor: 'Jane Doe (Consultant)',
            context: 'Technical Assistance',
            entityId: 'TA-202',
            icon: Briefcase,
            color: 'text-amber-600 bg-amber-100',
        },
        {
            id: 'a7',
            type: 'lead',
            title: 'Lead Converted to Account',
            description: 'Lead "Detroit Bakery Co" converted to active Account. Handover complete.',
            date: '2023-12-15T09:00:00',
            actor: 'System',
            context: 'Lead',
            entityId: 'LD-554',
            icon: ArrowRight,
            color: 'text-purple-600 bg-purple-100',
        },
        {
            id: 'a8',
            type: 'lead',
            title: 'Lead Qualified',
            description: 'Lead status changed to Qualified. Credit check passed.',
            date: '2023-11-30T15:20:00',
            actor: 'Sarah Miller',
            context: 'Lead',
            entityId: 'LD-554',
            icon: CheckCircle,
            color: 'text-slate-600 bg-slate-100',
        },
        {
            id: 'a9',
            type: 'system',
            title: 'Account Created',
            description: 'Account record initialized in system.',
            date: '2023-11-01T08:00:00',
            actor: 'System',
            context: 'Account',
            entityId: 'ACC-001',
            icon: Layout,
            color: 'text-slate-500 bg-slate-100',
        }
    ];

    // Filter Logic
    const filteredActivities = useMemo(() => {
        return rawActivities.filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesType = filterType === 'All' || item.type === filterType;
            const matchesContext = filterContext === 'All' || item.context === filterContext;
            return matchesSearch && matchesType && matchesContext;
        });
    }, [searchQuery, filterType, filterContext]);

    // Group by Month Year
    const groupedActivities = useMemo(() => {
        const groups = {};

        filteredActivities.forEach(item => {
            const date = new Date(item.date);
            const key = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        // Ensure keys are sorted (though data is already cron)
        return groups;
    }, [filteredActivities]);

    // UI Components
    const ActivityIcon = ({ icon: Icon, color }) => (
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm z-10 ${color}`}>
            <Icon size={14} />
        </div>
    );

    return (
        <div className="flex flex-col h-[calc(100vh-220px)]">

            {/* Filters */}
            <div className="relative z-50 flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="relative w-72">

                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search timeline..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>
                    <FilterDropdown
                        value={filterContext}
                        onChange={setFilterContext}
                        label="Context"
                        options={['All', 'Account', 'Loan', 'Lead', 'Documents', 'Task', 'Technical Assistance']}
                    />
                    <FilterDropdown
                        value={filterType}
                        onChange={setFilterType}
                        label="Type"
                        options={['All', 'communication', 'document', 'task', 'loan', 'compliance', 'system']}
                    />
                </div>
                <div className="text-xs font-medium text-slate-500">
                    Showing {filteredActivities.length} events
                </div>
            </div>

            {/* Timeline View */}
            <div className="flex-1 overflow-y-auto pr-2 pb-10">
                <div className="relative pl-4">
                    {/* Vertical Connector Line */}
                    <div className="absolute left-[31px] top-4 bottom-0 w-px bg-slate-200"></div>

                    {Object.keys(groupedActivities).length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            <History size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No activity found matching your filters.</p>
                        </div>
                    ) : (
                        Object.entries(groupedActivities).map(([month, activities]) => (
                            <div key={month} className="mb-8 relative">
                                {/* Month Header */}
                                <div className="sticky top-0 bg-slate-50/95 backdrop-blur-sm z-20 py-2 mb-4 border-b border-slate-100 flex items-center gap-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                                        {month}
                                    </h3>
                                </div>

                                <div className="space-y-6">
                                    {activities.map((activity, idx) => (
                                        <div key={activity.id} className="flex gap-4 group">
                                            {/* Icon Node */}
                                            <div className="relative pt-1">
                                                <ActivityIcon icon={activity.icon} color={activity.color} />
                                            </div>

                                            {/* Content Card */}
                                            <div className="flex-1 bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-default">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${activity.type === 'compliance' ? 'bg-red-50 text-red-600 border-red-100' :
                                                            'bg-slate-50 text-slate-500 border-slate-100'
                                                            }`}>
                                                            {activity.context}
                                                        </span>
                                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                                            <Clock size={10} /> {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                                        <User size={10} /> {activity.actor}
                                                    </div>
                                                </div>

                                                <h4 className="text-sm font-bold text-slate-800 mb-1 leading-snug">
                                                    {activity.title}
                                                </h4>
                                                <p className="text-sm text-slate-600 mb-2 leading-relaxed">
                                                    {activity.description}
                                                </p>

                                                {/* Meta Links */}
                                                <div className="flex items-center gap-3 pt-2 mt-2 border-t border-slate-50">
                                                    <span className="text-xs text-slate-400 font-mono">
                                                        ID: {activity.entityId}
                                                    </span>
                                                    {activity.type === 'document' && (
                                                        <button
                                                            onClick={() => onViewDocument && onViewDocument(activity.entityId)}
                                                            className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <FileText size={10} /> View Document
                                                        </button>
                                                    )}
                                                    {activity.type === 'loan' && (
                                                        <button
                                                            onClick={() => onViewLoan && onViewLoan(activity.entityId)}
                                                            className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <CreditCard size={10} /> View Loan
                                                        </button>
                                                    )}
                                                    {(activity.type === 'task' || activity.type === 'compliance') && (
                                                        <button
                                                            onClick={() => onViewTask && onViewTask(activity.entityId)}
                                                            className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <CheckCircle size={10} /> View Task
                                                        </button>
                                                    )}
                                                    {activity.type === 'lead' && (
                                                        <button
                                                            onClick={() => onViewLead && onViewLead(activity.entityId)}
                                                            className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <ArrowRight size={10} /> View Lead
                                                        </button>
                                                    )}
                                                    {activity.type === 'ta' && (
                                                        <button
                                                            onClick={() => onViewTA && onViewTA(activity.entityId)}
                                                            className="text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                                                        >
                                                            <Briefcase size={10} /> View Session
                                                        </button>
                                                    )}

                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

const FilterDropdown = ({ value, onChange, options, label }) => (
    <div className="relative group z-10">
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            {label ? <span className="text-slate-400 font-medium text-xs uppercase mr-1">{label}:</span> : <Filter size={14} />}
            <span className="font-semibold text-slate-700">{value}</span>
        </button>
        <div className="hidden group-hover:block absolute top-full left-0 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 mt-1 z-30">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${value === opt ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-600'
                        }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export default AccountActivitiesTab;
