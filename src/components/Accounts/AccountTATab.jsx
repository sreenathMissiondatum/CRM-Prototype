import React, { useState, useMemo } from 'react';
import {
    Briefcase, GraduationCap, CheckCircle, Clock,
    AlertCircle, Plus, MoreVertical, FileText,
    Calendar, User, ArrowRight, Wallet, Shield
} from 'lucide-react';

const AccountTATab = () => {
    const [searchQuery, setSearchQuery] = useState('');

    // Mock Data: TA Engagements
    const engagements = [
        {
            id: 'TA-2024-001',
            program: 'Small Business Resilience',
            type: 'Strategic Planning',
            status: 'Active',
            startDate: '2024-01-15',
            targetDate: '2024-06-30',
            owner: 'Jane Doe',
            funding: 'SBA Prime Grant',
            lastActivity: '2024-03-10T14:00:00'
        },
        {
            id: 'TA-2023-045',
            program: 'Financial Literacy 101',
            type: 'Training',
            status: 'Completed',
            startDate: '2023-11-01',
            targetDate: '2023-12-15',
            owner: 'Mike Ross',
            funding: 'Internal',
            lastActivity: '2023-12-15T09:30:00'
        },
        {
            id: 'TA-2024-012',
            program: 'QuickBooks Setup',
            type: 'Operational Support',
            status: 'On Hold',
            startDate: '2024-02-01',
            targetDate: '2024-03-01',
            owner: 'Sarah Miller',
            funding: 'CDBG Grant',
            lastActivity: '2024-02-20T11:15:00'
        }
    ];

    // Mock Data: TA Timeline
    const activities = [
        {
            id: 1,
            type: 'session',
            title: 'Strategy Session Held',
            desc: 'Met with owner to define Q2 marketing goals.',
            date: '2024-03-10T14:00:00',
            actor: 'Jane Doe'
        },
        {
            id: 2,
            type: 'document',
            title: 'Business Plan Draft Reviewed',
            desc: 'Provided feedback on section 3 (Financials).',
            date: '2024-02-28T10:00:00',
            actor: 'Jane Doe'
        },
        {
            id: 3,
            type: 'milestone',
            title: 'Training Completed',
            desc: 'Completed "Financial Literacy 101" module.',
            date: '2023-12-15T09:30:00',
            actor: 'System'
        }
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-220px)] overflow-hidden">
            {/* Top Summary Panel */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 shrink-0">
                <SummaryCard
                    label="Active Engagements"
                    value="1"
                    icon={Briefcase}
                    color="blue"
                    subtext="1 On Hold"
                />
                <SummaryCard
                    label="Primary TA Owner"
                    value="Jane Doe"
                    icon={User}
                    color="emerald"
                    subtext="Last active: 2 days ago"
                />
                <SummaryCard
                    label="Total Hours (YTD)"
                    value="12.5 hrs"
                    icon={Clock}
                    color="purple"
                    subtext="Target: 20 hrs"
                />
                <SummaryCard
                    label="Primary Funding"
                    value="SBA Prime"
                    icon={Wallet}
                    color="amber"
                    subtext="Grant Exp: Dec 2024"
                />
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Main Content: Engagements Table */}
                <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <GraduationCap size={18} className="text-blue-600" />
                            TA Engagements
                        </h3>
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            <Plus size={16} /> New Engagement
                        </button>
                    </div>

                    <div className="overflow-y-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-3">Program / Type</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Dates</th>
                                    <th className="px-6 py-3">Owner</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {engagements.map(eng => (
                                    <tr key={eng.id} className="hover:bg-slate-50/50 group transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{eng.program}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{eng.id}</span>
                                                <span>• {eng.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusPill status={eng.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-slate-700">{eng.startDate}</div>
                                            <div className="text-xs text-slate-400">Target: {eng.targetDate}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                    {eng.owner.slice(0, 2).toUpperCase()}
                                                </div>
                                                <span className="text-slate-700">{eng.owner}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                                <MoreVertical size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Helper Footer */}
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                        <AlertCircle size={14} />
                        TA engagements are separate from Loan Underwriting and are tracked for impact reporting.
                    </div>
                </div>

                {/* Secondary Sidebar: TA Activity Timeline */}
                <div className="w-80 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden shrink-0">
                    <div className="px-5 py-4 border-b border-slate-100">
                        <h3 className="font-bold text-slate-800 text-sm">Recent TA Activity</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-5 space-y-6">
                        {activities.map((act, idx) => (
                            <div key={idx} className="relative pl-4 border-l-2 border-slate-100 pb-1 last:pb-0">
                                <div className={`absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-2 ring-white ${act.type === 'session' ? 'bg-blue-400' :
                                        act.type === 'milestone' ? 'bg-emerald-400' : 'bg-slate-300'
                                    }`}></div>

                                <div className="text-xs text-slate-400 mb-0.5">
                                    {new Date(act.date).toLocaleDateString()}
                                </div>
                                <div className="text-sm font-bold text-slate-800 leading-tight mb-1">
                                    {act.title}
                                </div>
                                <div className="text-xs text-slate-600 mb-2 leading-relaxed">
                                    {act.desc}
                                </div>
                                <div className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                    <User size={10} /> {act.actor}
                                </div>
                            </div>
                        ))}

                        <button className="w-full py-2 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            View Full Timeline
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Sub-components
const SummaryCard = ({ label, value, icon: Icon, color, subtext }) => {
    const colorStyles = {
        blue: 'text-blue-600 bg-blue-50',
        emerald: 'text-emerald-600 bg-emerald-50',
        purple: 'text-purple-600 bg-purple-50',
        amber: 'text-amber-600 bg-amber-50',
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
                <div className={`p-1.5 rounded-lg ${colorStyles[color] || 'text-slate-600 bg-slate-100'}`}>
                    <Icon size={16} />
                </div>
            </div>
            <div>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                {subtext && <div className="text-xs text-slate-400 mt-1">{subtext}</div>}
            </div>
        </div>
    );
};

const StatusPill = ({ status }) => {
    const styles = {
        'Active': 'bg-emerald-100 text-emerald-700 border-emerald-200',
        'Completed': 'bg-blue-100 text-blue-700 border-blue-200',
        'On Hold': 'bg-amber-100 text-amber-700 border-amber-200',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
            {status}
        </span>
    );
};

export default AccountTATab;
