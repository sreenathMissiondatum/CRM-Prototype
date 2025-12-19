import React, { useState, useMemo } from 'react';
import {
    Search, Filter, ArrowUpDown, MoreHorizontal,
    Eye, FileText, History, ShieldCheck,
    DollarSign, Briefcase, AlertTriangle,
    Wallet, TrendingUp, Calendar, ArrowRightCircle
} from 'lucide-react';

const AccountLoansTab = ({ onViewLoan, onNavigateToLeads }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Mock Data
    const loans = [
        {
            id: 'LN-2023-882',
            program: 'Small Business Growth Fund',
            status: 'Active',
            originalAmount: 250000,
            balance: 185420.50,
            riskRating: 3,
            stage: 'Servicing',
            originationDate: '2023-11-15',
            maturityDate: '2028-11-15'
        },
        {
            id: 'LN-2022-401',
            program: 'Equipment Leasing',
            status: 'Paid Off',
            originalAmount: 45000,
            balance: 0,
            riskRating: 1,
            stage: 'Closed',
            originationDate: '2022-03-10',
            maturityDate: '2024-03-10'
        },
        {
            id: 'LN-2024-005',
            program: 'Working Capital Line',
            status: 'Active',
            originalAmount: 50000,
            balance: 12500.00,
            riskRating: 4,
            stage: 'Servicing',
            originationDate: '2024-01-20',
            maturityDate: '2025-01-20'
        },
        {
            id: 'LN-2021-999',
            program: 'Microloan Program',
            status: 'Charged Off',
            originalAmount: 10000,
            balance: 2450.00,
            riskRating: 8,
            stage: 'Loss Mitigation',
            originationDate: '2021-06-01',
            maturityDate: '2023-06-01'
        }
    ];

    // KPI Calculations
    const kpis = useMemo(() => {
        const totalLoans = loans.length;
        const activeLoans = loans.filter(l => l.status === 'Active').length;
        const totalDisbursed = loans.reduce((acc, curr) => acc + curr.originalAmount, 0);
        const outstandingBalance = loans.reduce((acc, curr) => acc + curr.balance, 0);
        const maxRisk = Math.max(...loans.filter(l => l.status === 'Active').map(l => l.riskRating), 0);

        return { totalLoans, activeLoans, totalDisbursed, outstandingBalance, maxRisk };
    }, [loans]);

    // Formatters
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            'Active': 'bg-emerald-100 text-emerald-700 border-emerald-200',
            'Paid Off': 'bg-blue-100 text-blue-700 border-blue-200',
            'Closed': 'bg-slate-100 text-slate-600 border-slate-200',
            'Charged Off': 'bg-red-100 text-red-700 border-red-200',
            'Default': 'bg-amber-100 text-amber-700 border-amber-200'
        };
        return (
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status] || styles['Closed']}`}>
                {status}
            </span>
        );
    };

    // Filter Logic
    const filteredLoans = loans.filter(loan => {
        const matchesSearch = loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            loan.program.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'All' || loan.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Empty State
    if (loans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
                    <Briefcase size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">No loans exist for this account yet.</h3>
                <p className="text-slate-500 max-w-md mb-6">
                    This account currently has no active or historical loans. You can view related leads to check for any in-progress applications.
                </p>
                <button
                    onClick={onNavigateToLeads}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    View Related Leads <ArrowRightCircle size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <KPICard
                    label="Total Loans"
                    value={kpis.totalLoans}
                    icon={Briefcase}
                    color="blue"
                />
                <KPICard
                    label="Active Loans"
                    value={kpis.activeLoans}
                    icon={TrendingUp}
                    color="emerald"
                />
                <KPICard
                    label="Total Disbursed"
                    value={formatCurrency(kpis.totalDisbursed)}
                    icon={Wallet}
                    color="purple"
                    isCurrency
                />
                <KPICard
                    label="Outstanding Bal"
                    value={formatCurrency(kpis.outstandingBalance)}
                    icon={DollarSign}
                    color="amber"
                    isCurrency
                />
                <KPICard
                    label="Max Risk Rating"
                    value={kpis.maxRisk > 0 ? kpis.maxRisk : '-'}
                    icon={AlertTriangle}
                    color={kpis.maxRisk >= 5 ? 'red' : 'slate'}
                    subtext={kpis.maxRisk >= 5 ? 'Monitor Closely' : 'Low Risk'}
                />
            </div>

            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="relative w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search loans..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>
                    <FilterDropdown
                        value={filterStatus}
                        onChange={setFilterStatus}
                        options={['All', 'Active', 'Paid Off', 'Closed', 'Charged Off']}
                    />
                </div>
                <div className="text-xs text-slate-500 font-medium">
                    Showing <span className="text-slate-900">{filteredLoans.length}</span> loans
                </div>
            </div>

            {/* Loans Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-500 w-32">Loan #</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Program</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-right">Orig. Amount</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-right">Balance</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-center">Risk</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Stage</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Dates</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 w-24"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredLoans.map((loan) => (
                            <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors group">
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => onViewLoan && onViewLoan(loan.id)}
                                        className="font-mono text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                        {loan.id}
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-slate-800">{loan.program}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={loan.status} />
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-600">
                                    {formatCurrency(loan.originalAmount)}
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-slate-800">
                                    {formatCurrency(loan.balance)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border ${loan.riskRating <= 3 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            loan.riskRating <= 6 ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                        {loan.riskRating}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                                        {loan.stage}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col text-xs">
                                        <span className="text-slate-500">Orig: <span className="text-slate-700 font-medium">{formatDate(loan.originationDate)}</span></span>
                                        <span className="text-slate-500">Mat: <span className="text-slate-700 font-medium">{formatDate(loan.maturityDate)}</span></span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
                                            <button title="View Loan" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-l-lg transition-colors border-r border-slate-100">
                                                <Eye size={14} />
                                            </button>
                                            <button title="Documents" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors border-r border-slate-100">
                                                <FileText size={14} />
                                            </button>
                                            <button title="More" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-r-lg transition-colors">
                                                <MoreHorizontal size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Sub-components
const KPICard = ({ label, value, icon: Icon, color, isCurrency, subtext }) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-50',
        emerald: 'text-emerald-600 bg-emerald-50',
        purple: 'text-purple-600 bg-purple-50',
        amber: 'text-amber-600 bg-amber-50',
        red: 'text-red-600 bg-red-50',
        slate: 'text-slate-600 bg-slate-50'
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow cursor-default">
            <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
                <div className={`p-1.5 rounded-lg ${colors[color] || colors.slate}`}>
                    <Icon size={16} />
                </div>
            </div>
            <div>
                <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
                {subtext && <div className="text-xs font-medium text-slate-500 mt-1">{subtext}</div>}
            </div>
        </div>
    );
};

const FilterDropdown = ({ value, onChange, options }) => (
    <div className="relative group z-10">
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={14} />
            {value}
            <ArrowUpDown size={12} className="text-slate-400" />
        </button>
        <div className="hidden group-hover:block absolute top-full left-0 w-40 bg-white border border-slate-200 rounded-lg shadow-xl py-1 mt-1">
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

export default AccountLoansTab;
