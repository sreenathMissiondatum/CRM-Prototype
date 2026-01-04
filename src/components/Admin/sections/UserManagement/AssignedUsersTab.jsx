import React, { useState, useMemo } from 'react';
import { Search, Filter, Download, ChevronLeft, ChevronRight, ArrowUpDown, FileText, User } from 'lucide-react';
import { MOCK_ASSIGNED_USERS } from '../../../../data/mockRoleAssignments';

const AssignedUsersTab = ({ selectedRole }) => {
    // --- State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        status: 'All',
        department: 'All'
    });
    const [sortConfig, setSortConfig] = useState({ key: 'dateAssigned', direction: 'desc' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // --- Derived Data ---
    const filteredUsers = useMemo(() => {
        let data = MOCK_ASSIGNED_USERS;

        // 1. Filter by Role (using roleId matching or broad match for generic roles if needed)
        // For MVP, if roleId matches selectedRole.id. 
        // Note: For 'admin' or root roles, we might show more, but let's stick to direct assignment for now.
        if (selectedRole) {
            data = data.filter(u => u.roleId === selectedRole.id);
        }

        // 2. Filter by Search
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            data = data.filter(u =>
                u.name.toLowerCase().includes(lowerQuery) ||
                u.email.toLowerCase().includes(lowerQuery) ||
                u.id.toLowerCase().includes(lowerQuery)
            );
        }

        // 3. Filter by Dropdowns
        if (filters.status !== 'All') {
            data = data.filter(u => u.status === filters.status);
        }
        if (filters.department !== 'All') {
            data = data.filter(u => u.department === filters.department);
        }

        // 4. Sort
        data.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        return data;
    }, [selectedRole, searchQuery, filters, sortConfig]);

    // Pagination Logic
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Unique values for dropdowns
    const departments = ['All', ...new Set(MOCK_ASSIGNED_USERS.map(u => u.department))];
    const statuses = ['All', 'Active', 'Suspended', 'Inactive'];

    // --- Handlers ---
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const handleExport = (format) => {
        console.log(`[AUDIT] ASSIGNED_USERS_EXPORTED | Role: ${selectedRole?.id} | Admin: CurrentUser | Format: ${format} | Timestamp: ${new Date().toISOString()}`);
        alert(`Exporting ${filteredUsers.length} users as ${format}... Check console for audit log.`);
    };

    // --- Render ---
    return (
        <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden">
            {/* TOOLBAR */}
            <div className="px-6 py-4 flex flex-wrap items-center gap-4 border-b border-slate-200 bg-white shrink-0">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-slate-50 text-sm"
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2">
                    <select
                        value={filters.department}
                        onChange={(e) => { setFilters(prev => ({ ...prev, department: e.target.value })); setCurrentPage(1); }}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        {departments.map(d => <option key={d} value={d}>{d === 'All' ? 'All Depts' : d}</option>)}
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => { setFilters(prev => ({ ...prev, status: e.target.value })); setCurrentPage(1); }}
                        className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                        {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
                    </select>
                </div>

                {/* Export */}
                <div className="flex items-center gap-1 border-l border-slate-200 pl-4 ml-2">
                    <button onClick={() => handleExport('CSV')} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Export CSV">
                        <FileText size={18} />
                    </button>
                    <button onClick={() => handleExport('EXCEL')} className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded transition-colors" title="Export Excel">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* DATA GRID */}
            <div className="flex-1 overflow-auto">
                <table className="w-full min-w-[800px] border-collapse relative">
                    <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                            {[
                                { key: 'name', label: 'User Name', width: 'w-1/4' },
                                { key: 'email', label: 'Email', width: 'w-1/4' },
                                { key: 'department', label: 'Department' },
                                { key: 'branch', label: 'Branch' },
                                { key: 'status', label: 'Status' },
                                { key: 'dateAssigned', label: 'Assigned Date' },
                                { key: 'assignedBy', label: 'Assigned By' }
                            ].map(col => (
                                <th
                                    key={col.key}
                                    onClick={() => handleSort(col.key)}
                                    className={`px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors ${col.width || ''}`}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.label}
                                        {sortConfig.key === col.key && (
                                            <ArrowUpDown size={12} className={sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-blue-600 rotate-180'} />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {paginatedUsers.length > 0 ? (
                            paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{user.name}</div>
                                                <div className="text-xs text-slate-400">ID: {user.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{user.department}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{user.branch}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                            ${user.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                                                user.status === 'Suspended' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(user.dateAssigned).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{user.assignedBy}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                                    <User size={48} className="mx-auto mb-3 opacity-20" />
                                    <p className="font-medium mb-1">No users found</p>
                                    <p className="text-xs">Try adjusting your search or filters</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between shrink-0">
                <div className="text-xs text-slate-500">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of <span className="font-medium">{filteredUsers.length}</span> results
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft size={16} className="text-slate-600" />
                    </button>
                    <div className="text-xs font-medium text-slate-700 px-2">Page {currentPage} of {Math.max(1, totalPages)}</div>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="p-2 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight size={16} className="text-slate-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AssignedUsersTab;
