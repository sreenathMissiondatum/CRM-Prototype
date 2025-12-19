import React, { useState, useMemo } from 'react';
import {
    ShieldCheck, Search, Filter, Download,
    ArrowRightLeft, Database, Lock, UserCog,
    FileDiff, Globe, Calendar
} from 'lucide-react';

const AccountAuditTab = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterEntity, setFilterEntity] = useState('All');
    const [filterUser, setFilterUser] = useState('All');

    // Mock Audit Data
    // Represents immutable system logs
    const auditLogs = [
        {
            id: 'AUD-2024-992',
            timestamp: '2024-03-15T14:32:10',
            type: 'System Action',
            entity: 'Account',
            field: 'LIC Qualification',
            oldValue: 'FALSE',
            newValue: 'TRUE',
            changedBy: 'System (Geo-Rule)',
            source: 'Auto-Calculation',
            context: 'Census Tract update triggered recalc'
        },
        {
            id: 'AUD-2024-991',
            timestamp: '2024-03-15T14:32:05',
            type: 'Field Update',
            entity: 'Account',
            field: 'Census Tract',
            oldValue: '261634',
            newValue: '261635',
            changedBy: 'Sarah Jenkins',
            source: 'UI Edit',
            context: 'Address Correction'
        },
        {
            id: 'AUD-2024-885',
            timestamp: '2024-03-10T09:15:00',
            type: 'Status Change',
            entity: 'Document',
            field: 'Status (Business License)',
            oldValue: 'Active',
            newValue: 'Expired',
            changedBy: 'System (Expiry Job)',
            source: 'Batch Job',
            context: 'Date > 3/10/2024'
        },
        {
            id: 'AUD-2024-722',
            timestamp: '2024-02-28T11:20:45',
            type: 'Field Update',
            entity: 'Contact',
            field: 'Email (Primary)',
            oldValue: 'billing@old-domain.com',
            newValue: 'billing@jenkinscatering.com',
            changedBy: 'Mike Ross',
            source: 'UI Edit',
            context: null
        },
        {
            id: 'AUD-2024-650',
            timestamp: '2024-01-15T16:00:00',
            type: 'Permission Change',
            entity: 'Access Control',
            field: 'Account Owner',
            oldValue: 'Unassigned',
            newValue: 'Sarah Jenkins',
            changedBy: 'Admin User',
            source: 'Assignment API',
            context: 'Lead Conversion Handover'
        },
        {
            id: 'AUD-2023-112',
            timestamp: '2023-11-20T10:00:00',
            type: 'Field Update',
            entity: 'Account',
            field: 'Tax ID (EIN)',
            oldValue: '***-***0000',
            newValue: '***-***4592',
            changedBy: 'Sarah Jenkins',
            source: 'UI Edit',
            isSensitive: true
        }
    ];

    // Derived Lists for Filters
    const entities = ['All', ...new Set(auditLogs.map(l => l.entity))];
    const users = ['All', ...new Set(auditLogs.map(l => l.changedBy))];

    // Filter Logic
    const filteredLogs = useMemo(() => {
        return auditLogs.filter(log => {
            const matchesSearch =
                log.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.oldValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                log.newValue.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesEntity = filterEntity === 'All' || log.entity === filterEntity;
            const matchesUser = filterUser === 'All' || log.changedBy === filterUser;

            return matchesSearch && matchesEntity && matchesUser;
        });
    }, [searchQuery, filterEntity, filterUser]);

    return (
        <div className="flex flex-col h-[calc(100vh-220px)] bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

            {/* Header / Toolbar */}
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3 text-slate-700">
                    <ShieldCheck size={20} className="text-slate-400" />
                    <h3 className="font-bold text-sm uppercase tracking-wide">System Audit Log</h3>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] font-bold">
                        Read-Only
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search changes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <select
                        className="px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                        value={filterEntity}
                        onChange={(e) => setFilterEntity(e.target.value)}
                    >
                        {entities.map(e => <option key={e} value={e}>{e === 'All' ? 'All Entities' : e}</option>)}
                    </select>
                    <select
                        className="px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none"
                        value={filterUser}
                        onChange={(e) => setFilterUser(e.target.value)}
                    >
                        {users.map(u => <option key={u} value={u}>{u === 'All' ? 'All Users' : u}</option>)}
                    </select>
                    <div className="h-6 w-px bg-slate-300 mx-1"></div>
                    <button
                        onClick={() => alert("Exporting Audit Log to CSV...")}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-900 transition-colors"
                    >
                        <Download size={14} /> Export Log
                    </button>

                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-3 w-48">Timestamp</th>
                            <th className="px-6 py-3 w-40">Event Type</th>
                            <th className="px-6 py-3 w-32">Entity</th>
                            <th className="px-6 py-3 w-48">Field</th>
                            <th className="px-6 py-3">Change Detail</th>
                            <th className="px-6 py-3 w-48">Actor & Source</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLogs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 group transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-mono text-slate-700">
                                            {new Date(log.timestamp).toLocaleDateString()}
                                        </span>
                                        <span className="text-xs text-slate-400">
                                            {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge type={log.type} />
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm font-medium text-slate-700">{log.entity}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-slate-600 font-medium">{log.field}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="w-8 text-slate-400 uppercase font-bold tracking-wider text-[10px]">Old</span>
                                            <span className={`font-mono px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-100 line-through decoration-red-300 opacity-70`}>
                                                {log.oldValue}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <span className="w-8 text-slate-400 uppercase font-bold tracking-wider text-[10px]">New</span>
                                            <span className="font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">
                                                {log.newValue}
                                            </span>
                                        </div>
                                        {log.context && (
                                            <div className="text-[10px] text-slate-400 mt-1 italic">
                                                Context: {log.context}
                                            </div>
                                        )}
                                        {log.isSensitive && (
                                            <div className="flex items-center gap-1 text-[10px] text-amber-600 mt-1">
                                                <Lock size={10} /> Sensitive Data Masked
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                                            {log.changedBy.includes('System') ? <Database size={12} className="text-purple-500" /> : <UserCog size={12} className="text-blue-500" />}
                                            {log.changedBy}
                                        </div>
                                        <span className="text-xs text-slate-400 mt-0.5">
                                            via {log.source}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredLogs.length === 0 && (
                    <div className="py-20 text-center text-slate-400">
                        <FileDiff size={48} className="mx-auto mb-3 opacity-20" />
                        <p>No audit records found.</p>
                    </div>
                )}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
                <span>Displaying 1-{filteredLogs.length} of {filteredLogs.length} records</span>
                <span className="text-slate-400">Audit logs are immutable and retained for 7 years.</span>
            </div>
        </div>
    );
};

const Badge = ({ type }) => {
    const styles = {
        'System Action': 'bg-purple-100 text-purple-700 border-purple-200',
        'Field Update': 'bg-blue-50 text-blue-700 border-blue-100',
        'Status Change': 'bg-amber-50 text-amber-700 border-amber-100',
        'Permission Change': 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${styles[type] || 'bg-slate-50 text-slate-600'}`}>
            {type}
        </span>
    );
};

export default AccountAuditTab;
