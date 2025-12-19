import React, { useState } from 'react';
import {
    Search, Filter, SlidersHorizontal, ChevronDown, ChevronUp,
    MoreHorizontal, Building2, MapPin, AlertTriangle,
    FileText, TrendingUp, DollarSign, Activity, Users,
    Briefcase, PieChart, ShieldAlert, ArrowUpRight
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_ACCOUNTS = [
    {
        id: 'acc_1',
        name: 'Acme Construction Supply',
        industry: 'Construction Materials',
        location: 'Portland, OR',
        owner: { name: 'Sarah Miller', initials: 'SM' },
        status: 'Active',
        riskRating: 3,
        financials: {
            period: '2024 FY',
            type: 'Actuals',
            status: 'Up-to-date',
            revenue: 12500000,
            ebitda: 1850000,
            leverage: 2.4
        },
        activeLoans: 2,
        lastActivity: '2 days ago'
    },
    {
        id: 'acc_2',
        name: 'GreenValley Logistics',
        industry: 'Transportation',
        location: 'Sacramento, CA',
        owner: { name: 'David Chen', initials: 'DC' },
        status: 'Watchlist',
        riskRating: 5,
        financials: {
            period: '2023 FY',
            type: 'Tax Return',
            status: 'Outdated',
            revenue: 4200000,
            ebitda: 320000,
            leverage: 4.8
        },
        activeLoans: 1,
        lastActivity: '5 hours ago'
    },
    {
        id: 'acc_3',
        name: 'TechStart Solutions',
        industry: 'Software Services',
        location: 'Austin, TX',
        owner: { name: 'Sarah Miller', initials: 'SM' },
        status: 'Active',
        riskRating: 2,
        financials: {
            period: 'Q3 2025',
            type: 'Interim',
            status: 'Up-to-date',
            revenue: 8900000,
            ebitda: 1100000,
            leverage: 1.8
        },
        activeLoans: 3,
        lastActivity: '1 week ago'
    },
    {
        id: 'acc_4',
        name: 'Metro Retail Group',
        industry: 'Retail',
        location: 'Chicago, IL',
        owner: { name: 'James Wilson', initials: 'JW' },
        status: 'Closed',
        riskRating: 1,
        financials: {
            period: '2023 FY',
            type: 'Audited',
            status: 'Up-to-date',
            revenue: 15400000,
            ebitda: 2100000,
            leverage: 2.1
        },
        activeLoans: 0,
        lastActivity: '3 months ago'
    },
    {
        id: 'acc_5',
        name: 'Harbor Fish Co.',
        industry: 'Food & Beverage',
        location: 'Seattle, WA',
        owner: { name: 'David Chen', initials: 'DC' },
        status: 'Active',
        riskRating: 4,
        financials: {
            period: '2024 YTD',
            type: 'Annualized',
            status: 'Needs Update',
            revenue: 3100000,
            ebitda: 280000,
            leverage: 3.2
        },
        activeLoans: 1,
        lastActivity: '1 day ago'
    }
];

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status }) => {
    const styles = {
        'Active': 'bg-emerald-50 text-emerald-700 border-emerald-100',
        'Watchlist': 'bg-amber-50 text-amber-700 border-amber-100',
        'Closed': 'bg-slate-50 text-slate-600 border-slate-200'
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status] || styles['Closed']}`}>
            {status}
        </span>
    );
};

const FinancialTypeBadge = ({ type }) => {
    const styles = {
        'Actuals': 'bg-blue-50 text-blue-700 border-blue-100',
        'Annualized': 'bg-indigo-50 text-indigo-700 border-indigo-100',
        'Pro Forma': 'bg-purple-50 text-purple-700 border-purple-100',
        'Tax Return': 'bg-slate-50 text-slate-700 border-slate-100',
        'Interim': 'bg-sky-50 text-sky-700 border-sky-100',
        'Audited': 'bg-emerald-50 text-emerald-700 border-emerald-100'
    };
    return (
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${styles[type] || 'bg-slate-50 text-slate-500'}`}>
            {type}
        </span>
    );
};

const LeverageBadge = ({ value }) => {
    const isHigh = value > 4.0;
    const isMedium = value > 2.5;

    let colorClass = 'text-emerald-600 bg-emerald-50';
    if (isHigh) colorClass = 'text-red-600 bg-red-50';
    else if (isMedium) colorClass = 'text-amber-600 bg-amber-50';

    return (
        <div className="flex items-center gap-2">
            <span className="font-mono font-medium text-slate-700">{value.toFixed(1)}x</span>
            <span className={`w-2 h-2 rounded-full ${colorClass.split(' ')[1].replace('text', 'bg').replace('50', '500')}`}></span>
        </div>
    );
};

const formatCurrency = (val) => {
    if (!val) return '-';
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
    return `$${val}`;
};

// --- MAIN COMPONENT ---

const AccountsList = () => {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Filter Stats (Mock)
    const stats = {
        total: MOCK_ACCOUNTS.length,
        watchlist: MOCK_ACCOUNTS.filter(a => a.status === 'Watchlist').length,
        outdated: MOCK_ACCOUNTS.filter(a => a.financials.status === 'Outdated' || a.financials.status === 'Needs Update').length
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden">

            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 px-8 py-5 flex-shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2">
                            Borrower relationships created through loan applications.
                        </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search accounts, owners, EIN..."
                                className="pl-9 pr-4 py-2 w-72 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <span className="text-xs text-slate-400 italic">
                            Accounts are created automatically from Lead conversion
                        </span>
                    </div>
                </div>

                {/* PORTFOLIO SUMMARY & FILTER TOGGLE */}
                <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 pr-6 border-r border-slate-200">
                            <span className="text-xs font-bold uppercase text-slate-400 tracking-wider">Your Portfolio</span>
                        </div>

                        <button className="flex items-center gap-2 group">
                            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                                <Briefcase size={16} />
                            </div>
                            <div className="text-left">
                                <div className="text-lg font-bold text-slate-900 leading-none">{stats.total}</div>
                                <div className="text-[10px] uppercase font-bold text-slate-500">Total Accounts</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-2 group">
                            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                                <ShieldAlert size={16} />
                            </div>
                            <div className="text-left">
                                <div className="text-lg font-bold text-slate-900 leading-none">{stats.watchlist}</div>
                                <div className="text-[10px] uppercase font-bold text-slate-500">On Watchlist</div>
                            </div>
                        </button>

                        <button className="flex items-center gap-2 group">
                            <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 group-hover:bg-slate-200 transition-colors">
                                <Activity size={16} />
                            </div>
                            <div className="text-left">
                                <div className="text-lg font-bold text-slate-900 leading-none">{stats.outdated}</div>
                                <div className="text-[10px] uppercase font-bold text-slate-500">Financials Outdated</div>
                            </div>
                        </button>
                    </div>

                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${isFilterOpen ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <SlidersHorizontal size={14} />
                        Filters
                        {isFilterOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                </div>

                {/* COLLAPSIBLE FILTERS */}
                {isFilterOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-6 gap-4 animate-in slide-in-from-top-2 duration-200">
                        {['Relationship Owner', 'Status', 'Risk Rating', 'Program', 'Industry', 'Geography'].map(label => (
                            <div key={label} className="space-y-1">
                                <label className="text-xs font-semibold text-slate-500">{label}</label>
                                <select className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md text-sm text-slate-700 focus:outline-none focus:border-blue-400">
                                    <option>All</option>
                                    <option>Option 1</option>
                                    <option>Option 2</option>
                                </select>
                            </div>
                        ))}
                    </div>
                )}
            </header>

            {/* TABLE CONTENT */}
            <main className="flex-1 overflow-auto p-8">
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500 tracking-wider">
                                <th className="px-6 py-4 font-extrabold text-slate-400">Account Name</th>
                                <th className="px-6 py-4 font-extrabold text-slate-400">Owner</th>
                                <th className="px-6 py-4 font-extrabold text-slate-400">Status</th>
                                <th className="px-6 py-4 font-extrabold text-slate-400">Latest Financials</th>
                                <th className="px-6 py-4 font-extrabold text-slate-400 text-right">Revenue</th>
                                <th className="px-6 py-4 font-extrabold text-slate-400 text-right">EBITDA</th>
                                <th className="px-6 py-4 font-extrabold text-slate-400">Leverage</th>
                                <th className="px-6 py-4 font-extrabold text-slate-400 text-center">Active Loans</th>
                                <th className="px-6 py-4 font-extrabold text-slate-400 text-right">Last Activity</th>
                                <th className="px-4 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {MOCK_ACCOUNTS.map((account) => (
                                <tr key={account.id} className="group hover:bg-slate-50/80 transition-colors">
                                    {/* Account Name */}
                                    <td className="px-6 py-4">
                                        <button className="text-left group/link">
                                            <div className="font-bold text-slate-900 text-sm group-hover/link:text-blue-600 transition-colors">{account.name}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                                <MapPin size={10} /> {account.location}
                                                <span className="text-slate-300">•</span>
                                                <Building2 size={10} /> {account.industry}
                                            </div>
                                        </button>
                                    </td>

                                    {/* Owner */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                                                {account.owner.initials}
                                            </div>
                                            <span className="text-sm text-slate-600">{account.owner.name}</span>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <StatusBadge status={account.status} />
                                    </td>

                                    {/* Financial Profile */}
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col items-start gap-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-slate-900">{account.financials.period}</span>
                                                {(account.financials.status === 'Outdated' || account.financials.status === 'Needs Update') && (
                                                    <AlertTriangle size={12} className="text-amber-500" />
                                                )}
                                            </div>
                                            <FinancialTypeBadge type={account.financials.type} />
                                        </div>
                                    </td>

                                    {/* Revenue (Read-only) */}
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-mono text-sm text-slate-600">
                                            {formatCurrency(account.financials.revenue)}
                                        </span>
                                    </td>

                                    {/* EBITDA (Read-only) */}
                                    <td className="px-6 py-4 text-right">
                                        <span className="font-mono text-sm text-slate-600">
                                            {formatCurrency(account.financials.ebitda)}
                                        </span>
                                    </td>

                                    {/* Leverage */}
                                    <td className="px-6 py-4">
                                        <LeverageBadge value={account.financials.leverage} />
                                    </td>

                                    {/* Active Loans */}
                                    <td className="px-6 py-4 text-center">
                                        {account.activeLoans > 0 ? (
                                            <button className="inline-flex items-center justify-center px-2.5 py-1 min-w-[32px] bg-white border border-slate-200 rounded-md text-xs font-bold text-blue-600 hover:border-blue-300 hover:text-blue-700 hover:bg-blue-50 transition-all shadow-sm">
                                                {account.activeLoans}
                                            </button>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>

                                    {/* Last Activity */}
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-xs text-slate-400">{account.lastActivity}</span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-4 py-4 text-right">
                                        <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Empty State / Pagination Placeholder */}
                    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
                        <span>Showing {MOCK_ACCOUNTS.length} of 42 accounts</span>
                        <div className="flex gap-1">
                            <button className="px-2 py-1 rounded hover:bg-white hover:shadow-sm disabled:opacity-50">Previous</button>
                            <button className="px-2 py-1 rounded bg-white shadow-sm font-medium text-slate-900 border border-slate-200">1</button>
                            <button className="px-2 py-1 rounded hover:bg-white hover:shadow-sm">2</button>
                            <button className="px-2 py-1 rounded hover:bg-white hover:shadow-sm">3</button>
                            <button className="px-2 py-1 rounded hover:bg-white hover:shadow-sm">Next</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountsList;
