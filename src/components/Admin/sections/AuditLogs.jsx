import React from 'react';
import { Clock, Search, Filter } from 'lucide-react';

const AuditLogs = () => {
    const logs = [
        { id: 1, user: 'Alex Morgan', action: 'Updated Loan Program', target: 'SBA 7(a)', time: '2 mins ago', details: 'Changed Rate from 6.5% to 6.75%' },
        { id: 2, user: 'Sarah Connor', action: 'Modified Permissions', target: 'Underwriter Role', time: '1 hour ago', details: 'Added "Approve Loans" capability' },
        { id: 3, user: 'System', action: 'Sync Completed', target: 'QuickBooks Integration', time: '3 hours ago', details: 'Imported 450 transactions' },
        { id: 4, user: 'Alex Morgan', action: 'Deleted User', target: 'John Doe', time: 'Yesterday', details: 'User account deactivated' },
        { id: 5, user: 'James Wright', action: 'Created Rule', target: 'Auto-Decline Policy', time: '2 days ago', details: 'New bankruptcy threshold' },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Audit Logs</h1>
                    <p className="text-slate-500">Track system changes and user activity.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50">
                        <Clock size={16} /> Date Range
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 sticky top-0 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Target</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                                <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {logs.map(log => (
                                <tr key={log.id} className="hover:bg-slate-50/50">
                                    <td className="px-6 py-3 font-medium text-slate-900">{log.user}</td>
                                    <td className="px-6 py-3 text-slate-600">{log.action}</td>
                                    <td className="px-6 py-3 text-blue-600 font-medium">{log.target}</td>
                                    <td className="px-6 py-3 text-slate-500 text-xs">{log.time}</td>
                                    <td className="px-6 py-3 text-slate-500 text-sm">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
