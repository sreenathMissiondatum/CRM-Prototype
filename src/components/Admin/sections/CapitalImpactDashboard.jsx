
import React, { useState } from 'react';
import {
    Calendar, Filter, Download,
    TrendingUp, DollarSign, PieChart,
    Activity, ArrowUpRight, ArrowDownRight,
    Wallet, Building2, CheckCircle,
    Users, MapPin, Briefcase, Target,
    AlertTriangle, Map, Clock, Shield,
    Layers, Zap, Scale,
    FileText, FileSpreadsheet, Mail,
    X, ChevronRight, BarChart3, HelpCircle
} from 'lucide-react';

const CapitalImpactDashboard = () => {
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [drillDownMetric, setDrillDownMetric] = useState(null); // { label, value, breakdown }

    // ----------------------------------------------------------------------
    // STATE & FILTERS
    // ----------------------------------------------------------------------
    const [dateRange, setDateRange] = useState('This Quarter');
    const [selectedFund, setSelectedFund] = useState('All');
    const [selectedFunder, setSelectedFunder] = useState('All Funders');
    const [selectedCapitalType, setSelectedCapitalType] = useState('All Capital Types');

    // ----------------------------------------------------------------------
    // DYNAMIC DATA LOGIC
    // ----------------------------------------------------------------------
    // In a real app, this would be a useEffect fetching from an API
    // For prototype, we switch mock data based on selections
    const dashboardData = React.useMemo(() => {
        const isKresge = selectedFunder === 'Kresge Foundation';
        const isHousingFund = selectedFund === 'Affordable Housing Fund I';

        if (isKresge) {
            return {
                kpis: [
                    { label: 'Total Capital Committed', value: '$15.0M', change: '+0%', trend: 'flat', icon: Wallet, color: 'blue' },
                    { label: 'Capital Deployed', value: '$12.0M', change: '+5.2%', trend: 'up', icon: TrendingUp, color: 'emerald' },
                    { label: 'Capital Available', value: '$3.0M', change: '-12%', trend: 'down', icon: DollarSign, color: 'slate' },
                    { label: 'Utilization %', value: '80.0%', change: '+4.5%', trend: 'up', icon: Activity, color: 'purple' },
                    { label: 'Active Funds', value: '2', change: '0', trend: 'flat', icon: PieChart, color: 'amber' }
                ],
                flow: { committed: '$15.0M', allocated: '$14.2M', deployed: '$12.0M', pAlloc: 95, pDep: 80 },
                impact: { borrowers: 45, jobs: '450', income: '$38,000' },
                compliance: { geo: 100, type: 100, purpose: 98 },
                blended: { leverage: '4.2x', cost: '3.8%', loss: '$0.0' },
                capitalCosts: {
                    avgCost: '3.80%',
                    subsidyYTD: '$450k',
                    leverage: '4.2x',
                    breakdown: [
                        { type: 'Senior Debt', amount: '$10.0M', cost: '6.5%', provider: 'Chase Community Dev' },
                        { type: 'PRI', amount: '$5.0M', cost: '1.0%', provider: 'Kresge Foundation' }
                    ]
                }
            };
        }

        if (isHousingFund) {
            return {
                kpis: [
                    { label: 'Total Capital Committed', value: '$25.0M', change: '+5%', trend: 'up', icon: Wallet, color: 'blue' },
                    { label: 'Capital Deployed', value: '$22.5M', change: '+15%', trend: 'up', icon: TrendingUp, color: 'emerald' },
                    { label: 'Capital Available', value: '$2.5M', change: '-45%', trend: 'down', icon: DollarSign, color: 'slate' },
                    { label: 'Utilization %', value: '90.0%', change: '+8.2%', trend: 'up', icon: Activity, color: 'purple' },
                    { label: 'Active Projects', value: '12', change: '+2', trend: 'up', icon: PieChart, color: 'amber' }
                ],
                flow: { committed: '$25.0M', allocated: '$24.8M', deployed: '$22.5M', pAlloc: 99, pDep: 90 },
                impact: { borrowers: 120, jobs: '850', income: '$32,000' },
                compliance: { geo: 95, type: 100, purpose: 100 },
                blended: { leverage: '7.5x', cost: '2.9%', loss: '$120k' },
                capitalCosts: {
                    avgCost: '2.90%',
                    subsidyYTD: '$1.2M',
                    leverage: '7.5x',
                    breakdown: [
                        { type: 'Senior Debt', amount: '$15.0M', cost: '6.0%', provider: 'Bank Consortium' },
                        { type: 'Performance Grant', amount: '$10.0M', cost: '0.0%', provider: 'State Housing Finance' }
                    ]
                }
            };
        }

        // DEFAULT (ALL)
        return {
            kpis: [
                { label: 'Total Capital Committed', value: '$45.2M', change: '+12%', trend: 'up', icon: Wallet, color: 'blue' },
                { label: 'Capital Deployed', value: '$32.8M', change: '+8.5%', trend: 'up', icon: TrendingUp, color: 'emerald' },
                { label: 'Capital Available', value: '$12.4M', change: '-2.1%', trend: 'down', icon: DollarSign, color: 'slate' },
                { label: 'Utilization %', value: '72.5%', change: '+4.2%', trend: 'up', icon: Activity, color: 'purple' },
                { label: 'Active Funds', value: '8', change: '0', trend: 'flat', icon: PieChart, color: 'amber' }
            ],
            flow: { committed: '$45.2M', allocated: '$38.5M', deployed: '$32.8M', pAlloc: 85, pDep: 72 },
            impact: { borrowers: 142, jobs: '1,250', income: '$42,500' },
            compliance: { geo: 98, type: 100, purpose: 92 },
            blended: { leverage: '6.8x', cost: '4.2%', loss: '$2.2M' },
            capitalCosts: {
                avgCost: '4.20%',
                subsidyYTD: '$2.8M',
                leverage: '6.8x',
                breakdown: [
                    { type: 'Senior Debt', amount: '$25.0M', cost: '6.5%', provider: 'Various Banks' },
                    { type: 'Mezzanine PRI', amount: '$13.5M', cost: '3.0%', provider: 'Foundations' },
                    { type: 'Recoverable Grants', amount: '$4.0M', cost: '0.0%', provider: 'Public Agencies' },
                    { type: 'Philanthropic Grants', amount: '$2.7M', cost: 'N/A', provider: 'Donors' }
                ]
            }
        };
    }, [selectedFund, selectedFunder, selectedCapitalType, dateRange]);

    // Mock Export Handlers
    const handleExportPDF = () => {
        console.log("Exporting to PDF...");
    };

    const handleExportExcel = () => {
        console.log("Exporting to Excel...");
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Capital Impact Dashboard</h1>
                    <p className="text-slate-500 mt-1">Real-time visibility into capital deployment and performance</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsScheduleModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
                    >
                        <Mail size={16} />
                        Schedule Report
                    </button>
                    <div className="flex bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 border-r border-slate-200 transition-colors"
                            title="Export as PDF"
                        >
                            <FileText size={16} className="text-rose-600" />
                            <span className="text-sm font-medium">PDF</span>
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
                            title="Export as Excel"
                        >
                            <FileSpreadsheet size={16} className="text-emerald-600" />
                            <span className="text-sm font-medium">Excel</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Filter size={16} /> Filters:
                </div>

                <select
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 cursor-pointer hover:border-blue-400 transition-colors focus:ring-2 focus:ring-blue-100 outline-none"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                >
                    <option>This Quarter</option>
                    <option>Year to Date</option>
                    <option>Last 12 Months</option>
                    <option>All Time</option>
                </select>

                <select
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 cursor-pointer hover:border-blue-400 transition-colors focus:ring-2 focus:ring-blue-100 outline-none"
                    value={selectedFund}
                    onChange={(e) => setSelectedFund(e.target.value)}
                >
                    <option value="All">All Funds</option>
                    <option>Affordable Housing Fund I</option>
                    <option>Small Biz Growth Fund</option>
                    <option>Green Energy Catalyst</option>
                </select>

                <select
                    className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 cursor-pointer hover:border-blue-400 transition-colors focus:ring-2 focus:ring-blue-100 outline-none"
                    value={selectedFunder}
                    onChange={(e) => setSelectedFunder(e.target.value)}
                >
                    <option>All Funders</option>
                    <option>Kresge Foundation</option>
                    <option>Ford Foundation</option>
                    <option>Chase Community Dev</option>
                </select>

                <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 cursor-pointer hover:border-blue-400 transition-colors focus:ring-2 focus:ring-blue-100 outline-none">
                    <option>All Capital Types</option>
                    <option>Grants</option>
                    <option>PRI</option>
                    <option>Debt Facilities</option>
                </select>

                <div className="ml-auto text-xs text-slate-400 flex items-center gap-1">
                    <Activity size={12} />
                    Data updated: Just now
                </div>
            </div>

            {/* KPI Strip */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                {dashboardData.kpis.map((kpi, index) => (
                    <div key={index} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-2">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{kpi.label}</div>
                            <div className={`p-1.5 rounded-lg bg-${kpi.color}-50 text-${kpi.color}-600`}>
                                <kpi.icon size={16} />
                            </div>
                        </div>
                        <div className="mt-auto">
                            <div className="text-2xl font-bold text-slate-900">{kpi.value}</div>
                            <div className="flex items-center gap-1 mt-1">
                                {kpi.trend === 'up' && <ArrowUpRight size={14} className="text-emerald-500" />}
                                {kpi.trend === 'down' && <ArrowDownRight size={14} className="text-rose-500" />}
                                <span className={`text-xs font-medium ${kpi.trend === 'up' ? 'text-emerald-600' :
                                    kpi.trend === 'down' ? 'text-rose-600' : 'text-slate-500'
                                    }`}>
                                    {kpi.change}
                                </span>
                                <span className="text-xs text-slate-400 ml-1">vs last period</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* COST OF CAPITAL METRICS (NEW) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Avg Cost */}
                <div
                    onClick={() => setDrillDownMetric({ label: 'Avg Cost of Capital', value: dashboardData.capitalCosts.avgCost, breakdown: dashboardData.capitalCosts.breakdown })}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors cursor-pointer group"
                >
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide flex gap-1 items-center">
                            Avg Cost of Capital
                            <HelpCircle size={12} className="text-slate-300" />
                        </div>
                        <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors">
                            <Scale size={16} />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <div className="text-2xl font-bold text-slate-900">{dashboardData.capitalCosts.avgCost}</div>
                        <div className="text-xs text-blue-600 mt-1 font-medium group-hover:underline">View Breakdown</div>
                    </div>
                </div>

                {/* Subsidy Deployed */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Subsidy Deployed YTD</div>
                        <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                            <Zap size={16} />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <div className="text-2xl font-bold text-slate-900">{dashboardData.capitalCosts.subsidyYTD}</div>
                        <div className="text-xs text-slate-400 mt-1">Forgone return & grants</div>
                    </div>
                </div>

                {/* Grant Leverage */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Grant Leverage Ratio</div>
                        <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                            <TrendingUp size={16} />
                        </div>
                    </div>
                    <div className="mt-auto">
                        <div className="text-2xl font-bold text-slate-900">{dashboardData.capitalCosts.leverage}</div>
                        <div className="text-xs text-emerald-600 mt-1 font-medium">Exceeds 5.0x Target</div>
                    </div>
                </div>

                {/* Cost by Type Mini-Chart */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Cost by Capital Type</div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-600">Debt</span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-purple-500 w-[85%]"></div>
                                </div>
                                <span className="font-mono font-bold">6.5%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-600">PRI</span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[40%]"></div>
                                </div>
                                <span className="font-mono font-bold">3.0%</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-600">Grant</span>
                            <div className="flex items-center gap-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[0%]"></div>
                                </div>
                                <span className="font-mono font-bold">0.0%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Capital Utilization Section */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Capital Utilization Overview</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* WIDGET 1: CAPITAL FLOW FUNNEL */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <TrendingUp size={16} className="text-blue-500" />
                                Capital Flow
                            </h3>
                            <button className="text-xs text-blue-600 font-medium hover:underline">View Funds</button>
                        </div>

                        <div className="flex-1 flex flex-col justify-center space-y-4">
                            {/* Committed */}
                            <div className="relative">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-xs font-bold uppercase text-slate-500">Committed</span>
                                    <span className="text-sm font-bold text-slate-900">{dashboardData.flow.committed}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-8 rounded-lg overflow-hidden relative group cursor-pointer">
                                    <div className="absolute inset-y-0 left-0 bg-blue-100 w-full flex items-center px-3 text-xs font-medium text-blue-800">100%</div>
                                </div>
                            </div>

                            {/* Allocated arrow */}
                            <div className="flex justify-center -my-2 z-10">
                                <div className="bg-slate-50 p-1 rounded-full border border-slate-200">
                                    <ArrowDownRight size={14} className="text-slate-400" />
                                </div>
                            </div>

                            {/* Allocated */}
                            <div className="relative pl-4">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-xs font-bold uppercase text-slate-500">Allocated</span>
                                    <span className="text-sm font-bold text-slate-900">{dashboardData.flow.allocated}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-8 rounded-lg overflow-hidden relative group cursor-pointer">
                                    <div className="absolute inset-y-0 left-0 bg-purple-100 flex items-center px-3 text-xs font-medium text-purple-800" style={{ width: `${dashboardData.flow.pAlloc}%` }}>{dashboardData.flow.pAlloc}%</div>
                                </div>
                            </div>

                            {/* Deployed arrow */}
                            <div className="flex justify-center -my-2 z-10 pl-4">
                                <div className="bg-slate-50 p-1 rounded-full border border-slate-200">
                                    <ArrowDownRight size={14} className="text-slate-400" />
                                </div>
                            </div>

                            {/* Deployed */}
                            <div className="relative pl-8">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="text-xs font-bold uppercase text-slate-500">Deployed</span>
                                    <span className="text-sm font-bold text-slate-900">{dashboardData.flow.deployed}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-8 rounded-lg overflow-hidden relative group cursor-pointer">
                                    <div className="absolute inset-y-0 left-0 bg-emerald-100 flex items-center px-3 text-xs font-medium text-emerald-800" style={{ width: `${dashboardData.flow.pDep}%` }}>{dashboardData.flow.pDep}%</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WIDGET 2: UTILIZATION BY TYPE */}
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <PieChart size={16} className="text-purple-500" />
                                Utilization by Type
                            </h3>
                            <div className="flex gap-2 text-xs">
                                <span className="flex items-center gap-1 text-slate-500"><div className="w-2 h-2 rounded-full bg-slate-300"></div> Avail</span>
                                <span className="flex items-center gap-1 text-slate-500"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Used</span>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center space-y-6">
                            {[
                                { label: 'Grants', total: '$8.0M', deployed: 90, color: 'bg-emerald-500', bg: 'bg-emerald-100' },
                                { label: 'PRI', total: '$12.0M', deployed: 65, color: 'bg-blue-500', bg: 'bg-blue-100' },
                                { label: 'Debt', total: '$25.2M', deployed: 45, color: 'bg-purple-500', bg: 'bg-purple-100' },
                            ].map((type) => (
                                <div key={type.label}>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-bold text-slate-700">{type.label}</span>
                                        <span className="text-slate-500">{type.deployed}% of {type.total}</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                        <div className={`h-full ${type.color}`} style={{ width: `${type.deployed}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">Debt facilities have highest available capacity.</p>
                        </div>
                    </div>

                    {/* WIDGET 3: IDLE CAPITAL ALERT */}
                    <div className="bg-white p-0 rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-amber-50/50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Activity size={16} className="text-amber-500" />
                                Idle Capital Alerts
                            </h3>
                            <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">2 Alerts</span>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-xs text-slate-500 uppercase font-semibold">
                                    <tr>
                                        <th className="px-6 py-2">Fund</th>
                                        <th className="px-4 py-2 text-right">Idle Amt</th>
                                        <th className="px-4 py-2 text-right">Days</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[
                                        { name: 'Small Biz Growth', amount: '$1.2M', days: 45, risk: 'High' },
                                        { name: 'Green Energy Cat.', amount: '$7.5M', days: 12, risk: 'Low' },
                                        { name: 'Emergency Relief', amount: '$0.5M', days: 8, risk: 'Low' },
                                    ].map((item, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors cursor-pointer text-sm">
                                            <td className="px-6 py-3 font-medium text-slate-900">{item.name}</td>
                                            <td className="px-4 py-3 text-right font-mono text-slate-600">{item.amount}</td>
                                            <td className="px-4 py-3 text-right">
                                                <span className={`inline-flex items-center gap-1 ${item.risk === 'High' ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                                                    {item.days}
                                                    {item.risk === 'High' && <Activity size={12} />}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-3 bg-slate-50 text-center border-t border-slate-200">
                            <button className="text-xs text-blue-600 font-medium hover:underline">View All Allocation Rules</button>
                        </div>
                    </div>

                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Impact Metrics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Borrower Impact */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Users size={16} className="text-blue-500" />
                            Borrower Impact
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-500 mb-1">Borrowers Served</div>
                                <div className="text-xl font-bold text-slate-900">{dashboardData.impact.borrowers}</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="text-xs text-slate-500 mb-1">First-time</div>
                                <div className="text-xl font-bold text-slate-900">45%</div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-xs font-medium text-slate-700 mb-2">Demographics</div>
                                <div className="space-y-2">
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500">Minority-owned</span>
                                            <span className="font-bold text-slate-700">65%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-blue-500 h-full w-[65%]"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-slate-500">Women-owned</span>
                                            <span className="font-bold text-slate-700">42%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-purple-500 h-full w-[42%]"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Community Impact */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <MapPin size={16} className="text-emerald-500" />
                            Community Impact
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div>
                                    <div className="text-xs text-slate-500">Jobs Created / Retained</div>
                                    <div className="text-lg font-bold text-slate-900">{dashboardData.impact.jobs}</div>
                                </div>
                                <Briefcase size={20} className="text-slate-300" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div>
                                    <div className="text-xs text-slate-500">Median Borrower Income</div>
                                    <div className="text-lg font-bold text-slate-900">{dashboardData.impact.income}</div>
                                </div>
                                <DollarSign size={20} className="text-slate-300" />
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1 mt-2">
                                    <span className="text-slate-500">Rural / Underserved Areas</span>
                                    <span className="font-bold text-slate-700">38%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[38%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lending Outcomes */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Target size={16} className="text-amber-500" />
                            Lending Outcomes
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex justify-between items-center">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Average Loan Size</div>
                                    <div className="text-xl font-bold text-slate-900">$85,000</div>
                                </div>
                                <PieChart size={20} className="text-slate-300" />
                            </div>
                            <div>
                                <div className="text-xs font-medium text-slate-700 mb-2">Sector Distribution</div>
                                <div className="flex flex-wrap gap-2">
                                    {['Retail (30%)', 'Service (25%)', 'Construction (20%)', 'Tech (15%)'].map((sector, i) => (
                                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md border border-slate-200">
                                            {sector}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-medium text-slate-700 mb-2">Loan Purpose</div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs">
                                        <span className="text-slate-500">Working Capital</span>
                                        <span className="font-bold text-slate-700">60%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-amber-500 h-full w-[60%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Capital Compliance & Restrictions Section */}
            <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Capital Compliance & Restrictions</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* WIDGET 1: RESTRICTION COVERAGE MAP (Simulated) */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Map size={16} className="text-blue-500" />
                            Restriction Alignment
                        </h3>
                        <div className="flex-1 space-y-5">
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Geography Compliance</span>
                                    <span className="font-bold text-slate-700">{dashboardData.compliance.geo}%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full" style={{ width: `${dashboardData.compliance.geo}%` }}></div>
                                </div>
                                <div className="mt-1 text-xs text-slate-400">2 loans outside target zones (Exception approved)</div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Borrower Type Match</span>
                                    <span className="font-bold text-slate-700">100%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-emerald-500 h-full w-[100%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-slate-500">Loan Purpose Validation</span>
                                    <span className="font-bold text-slate-700">92%</span>
                                </div>
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div className="bg-amber-500 h-full w-[92%]"></div>
                                </div>
                                <div className="mt-1 text-xs text-amber-600 font-medium">Requires review: 3 loans</div>
                            </div>
                        </div>
                    </div>

                    {/* WIDGET 2: COMPLIANCE EXCEPTIONS */}
                    <div className="bg-white p-0 rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-200 bg-rose-50/50 flex justify-between items-center">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Shield size={16} className="text-rose-500" />
                                Compliance Exceptions
                            </h3>
                            <span className="bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">3 Active</span>
                        </div>
                        <div className="flex-1 overflow-y-auto max-h-[200px]">
                            <div className="divide-y divide-slate-100">
                                {[
                                    { fund: 'Small Biz Growth', loan: 'L-2024-001', rule: 'Max Loan Size Exceeded', severity: 'High' },
                                    { fund: 'Green Energy Cat.', loan: 'L-2024-045', rule: 'Ineligible Geo', severity: 'Medium' },
                                    { fund: 'Affordable Housing I', loan: 'L-2023-112', rule: 'Reporting Late', severity: 'Low' },
                                ].map((item, i) => (
                                    <div key={i} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-xs font-bold text-slate-700">{item.fund}</span>
                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${item.severity === 'High' ? 'bg-rose-100 text-rose-700' :
                                                item.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>{item.severity}</span>
                                        </div>
                                        <div className="text-sm font-medium text-slate-900 mb-0.5">{item.rule}</div>
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                            <span>Loan: {item.loan}</span>
                                            <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* WIDGET 3: EXPIRY & SUNSET ALERTS */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Clock size={16} className="text-slate-500" />
                            Expiry & Sunset Watch
                        </h3>
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-400 font-bold text-xs">
                                    30d
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-slate-500 uppercase">Expiring Soon</div>
                                    <div className="text-sm font-bold text-slate-900 truncate">Emergency Relief Fund II</div>
                                    <div className="text-xs text-slate-500">$250k remaining coverage</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center border border-slate-200 text-slate-400 font-bold text-xs">
                                    Q1
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-slate-500 uppercase">Sunset Scheduled</div>
                                    <div className="text-sm font-bold text-slate-900 truncate">Main St. Recovery</div>
                                    <div className="text-xs text-slate-500">Fully deployed. Closeout pending.</div>
                                </div>
                            </div>
                            <button className="w-full py-2 text-xs font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-dashed border-slate-200">
                                + Add Expiry Alert
                            </button>
                        </div>
                    </div>

                </div>
            </div >
            {/* Blended Capital Performance Section */}
            <div className="mb-8">
                <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Blended Capital Performance</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* WIDGET 1: CAPITAL STACK VISUALIZATION */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                            <Layers size={16} className="text-purple-500" />
                            Capital Stack Structure
                        </h3>
                        <div className="flex-1 flex flex-col justify-end space-y-1">
                            <div className="w-full bg-slate-100 p-3 rounded-t-lg border border-slate-200 relative group">
                                <div className="absolute top-0 right-0 -mt-6 text-xs font-bold text-slate-500">Senior Debt (55%)</div>
                                <div className="h-20 bg-purple-100 flex items-center justify-center text-sm font-bold text-purple-800 border-2 border-dashed border-purple-200 rounded">
                                    Bank Capital ($25M)
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 p-3 border-x border-slate-200 relative group">
                                <div className="absolute top-0 right-0 -mt-6 text-xs font-bold text-slate-500">Mezzanine / PRI (30%)</div>
                                <div className="h-12 bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-800 border-2 border-dashed border-blue-200 rounded">
                                    Foundations ($13.5M)
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 p-3 rounded-b-lg border border-slate-200 relative group">
                                <div className="absolute top-0 right-0 -mt-6 text-xs font-bold text-slate-500">First Loss (15%)</div>
                                <div className="h-8 bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-800 border-2 border-dashed border-emerald-200 rounded">
                                    Grants ($6.7M)
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 text-xs text-center text-slate-400">
                            Base layer protects senior lenders from default risk.
                        </div>
                    </div>

                    {/* WIDGET 2: LOSS ABSORPTION SIMULATION */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <Zap size={16} className="text-amber-500" />
                                Loss Absorption Sim
                            </h3>
                            <select className="text-xs bg-slate-50 border-slate-200 rounded p-1">
                                <option>Stress Test (5% Default)</option>
                                <option>Severe (10% Default)</option>
                                <option>Catastrophic (20%)</option>
                            </select>
                        </div>

                        <div className="flex-1 flex flex-col justify-center">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 font-bold border-4 border-rose-100">
                                    $2.2M
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase">Simulated Loss</div>
                                    <div className="text-sm text-slate-700">At 5% Portfolio Default Rate</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-slate-700">Grant Layer Covered</span>
                                        <span className="font-bold text-emerald-600">100% Absorbed</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="w-[33%] h-full bg-rose-500"></div>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-1">$4.5M remaining in first-loss reserve</div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="font-medium text-slate-400">Senior Lenders Impact</span>
                                        <span className="font-bold text-slate-700">$0.00</span>
                                    </div>
                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="w-0 h-full bg-slate-300"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WIDGET 3: EFFICIENCY METRICS (LEVERAGE) */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
                        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Scale size={16} className="text-slate-500" />
                            Capital Efficiency
                        </h3>
                        <div className="flex-1 grid grid-cols-1 gap-4 content-center">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-center">
                                <div className="text-3xl font-bold text-blue-600 mb-1">{dashboardData.blended.leverage}</div>
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">Leverage Ratio</div>
                                <p className="text-xs text-slate-400 mt-2">For every $1 of grant capital, we deploy {dashboardData.blended.leverage} in loans.</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                    <div className="text-lg font-bold text-slate-900">$12k</div>
                                    <div className="text-[10px] uppercase text-slate-500 font-medium">Cost per Job</div>
                                </div>
                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                                    <div className="text-lg font-bold text-slate-900">4.2%</div>
                                    <div className="text-[10px] uppercase text-slate-500 font-medium">blended cost</div>
                                </div>
                            </div>
                            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex gap-3 items-start">
                                <div className="bg-white p-1 rounded-full text-emerald-600 shadow-sm mt-0.5">
                                    <TrendingUp size={12} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-emerald-800">Efficiency Target Met</div>
                                    <div className="text-[10px] text-emerald-700 leading-tight mt-0.5">
                                        Current structure exceeds 5x leverage requirement for CDFI certification.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div >

            {/* Secondary Content - Recent Activity */}
            < div className="grid grid-cols-1 gap-6 flex-1 min-h-0 mb-6" >
                <div className="bg-white p-0 rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <img src="/api/placeholder/16/16" alt="" className="hidden" />
                            <Building2 size={16} className="text-slate-400" />
                            Recent Funding Sources
                        </h3>
                        <button className="text-xs text-blue-600 font-medium hover:underline">View All</button>
                    </div>

                    <div className="divide-y divide-slate-100 overflow-y-auto max-h-[200px]">
                        {[
                            { name: 'Kresge Foundation', type: 'Grant', amount: '$5.0M', date: 'Dec 12' },
                            { name: 'Wells Fargo', type: 'Debt', amount: '$10.0M', date: 'Nov 28' },
                            { name: 'Ford Foundation', type: 'PRI', amount: '$2.0M', date: 'Nov 15' },
                        ].map((item, i) => (
                            <div key={i} className="px-6 py-3 flex items-center justify-between hover:bg-slate-50/80 transition-colors">
                                <div>
                                    <div className="text-sm font-medium text-slate-900">{item.name}</div>
                                    <div className="text-xs text-slate-500">{item.type}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900">{item.amount}</div>
                                    <div className="text-xs text-slate-400">{item.date}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div >

            {/* Funder-Level Impact Table */}
            < FunderImpactSection />

            {/* Drill Down Modal */}
            <MetricDrillDownModal
                isOpen={!!drillDownMetric}
                onClose={() => setDrillDownMetric(null)}
                data={drillDownMetric}
            />
        </div >
    );
};

const MetricDrillDownModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh]">
                <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">{data.label}</h3>
                        <div className="text-2xl font-bold text-blue-600 font-mono mt-1">{data.value}</div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 overflow-y-auto">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Contributing Components</h4>

                    <div className="space-y-3">
                        {data.breakdown && data.breakdown.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors shadow-sm">
                                <div>
                                    <div className="text-sm font-bold text-slate-800">{item.type}</div>
                                    <div className="text-xs text-slate-500 mt-0.5">{item.provider}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-bold text-slate-900 font-mono">{item.cost}</div>
                                    <div className="text-xs text-slate-400 mt-0.5">{item.amount} allocated</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100 flex gap-3">
                        <div className="mt-0.5"><Scale size={16} className="text-blue-600" /></div>
                        <div>
                            <div className="text-xs font-bold text-blue-800 uppercase">Calculation Logic</div>
                            <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                                This metric is a weighted average based on the active principal deployment of each capital type. Grants are treated as 0% cost capital.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-white border border-slate-200 shadow-sm rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Sub-component for Funder Impact to keep main file clean
const FunderImpactSection = () => {
    const [expandedId, setExpandedId] = useState(null);

    const funders = [
        {
            id: 1, name: 'Kresge Foundation', committed: '$15.0M', deployed: '$12.0M',
            utilization: 80, loans: 145, impactScore: 92, compliance: 'Green',
            funds: ['Affordable Housing I', 'Green Energy'],
            history: 'Annual report submitted Jan 2023. Next audit due Mar 2024.'
        },
        {
            id: 2, name: 'Chase Community Dev', committed: '$25.0M', deployed: '$15.0M',
            utilization: 60, loans: 88, impactScore: 85, compliance: 'Yellow',
            funds: ['Small Biz Growth'],
            history: 'Quarterly compliance review pending data clarification.'
        },
        {
            id: 3, name: 'Ford Foundation', committed: '$10.0M', deployed: '$9.5M',
            utilization: 95, loans: 210, impactScore: 98, compliance: 'Green',
            funds: ['Minority Biz Access'],
            history: 'Highly active. Model funder status achieved.'
        },
        {
            id: 4, name: 'State Economic Dev', committed: '$5.0M', deployed: '$1.0M',
            utilization: 20, loans: 12, impactScore: 45, compliance: 'Red',
            funds: ['Rural Broadband'],
            history: 'Deployment stalled due to restrictive covenants. Renegotiation needed.'
        },
    ];

    const getComplianceBadge = (status) => {
        switch (status) {
            case 'Green': return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">On Track</span>;
            case 'Yellow': return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700">Review</span>;
            case 'Red': return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700">At Risk</span>;
            default: return null;
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Funder-Level Impact</h2>
                    <p className="text-sm text-slate-500">Performance and outcomes by capital source</p>
                </div>
                <button className="text-sm text-blue-600 font-medium hover:underline">Download Report</button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Funder Name</th>
                            <th className="px-6 py-4 text-right">Committed</th>
                            <th className="px-6 py-4 text-right">Deployed</th>
                            <th className="px-6 py-4 text-right">Util %</th>
                            <th className="px-6 py-4 text-right">Loans</th>
                            <th className="px-6 py-4 text-right">Impact Score</th>
                            <th className="px-6 py-4 text-center">Compliance</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {funders.map((funder) => (
                            <React.Fragment key={funder.id}>
                                <tr
                                    className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedId === funder.id ? 'bg-slate-50' : ''}`}
                                    onClick={() => setExpandedId(expandedId === funder.id ? null : funder.id)}
                                >
                                    <td className="px-6 py-4 font-medium text-slate-900">{funder.name}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">{funder.committed}</td>
                                    <td className="px-6 py-4 text-right text-slate-600">{funder.deployed}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 text-slate-700">
                                            {funder.utilization}%
                                            <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${funder.utilization < 30 ? 'bg-rose-500' : funder.utilization < 70 ? 'bg-blue-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${funder.utilization}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-slate-700">{funder.loans}</td>
                                    <td className="px-6 py-4 text-right font-bold text-slate-900">{funder.impactScore}</td>
                                    <td className="px-6 py-4 text-center">{getComplianceBadge(funder.compliance)}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1 rounded-full hover:bg-slate-200 text-slate-400">
                                            {expandedId === funder.id ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                                        </button>
                                    </td>
                                </tr>
                                {expandedId === funder.id && (
                                    <tr className="bg-slate-50/50">
                                        <td colSpan="8" className="px-6 py-4">
                                            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-inner animate-in slide-in-from-top-2 duration-200">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Funds Contributed</div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {funder.funds.map((f, i) => (
                                                                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                                    <Wallet size={12} className="mr-1" /> {f}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Impact Highlights</div>
                                                        <div className="text-sm text-slate-700 space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle size={14} className="text-emerald-500" />
                                                                <span>created <strong>450+</strong> jobs</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <CheckCircle size={14} className="text-emerald-500" />
                                                                <span><strong>12,000</strong> sqft affordable housing</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Reporting & Audit</div>
                                                        <p className="text-sm text-slate-600 leading-relaxed italic">
                                                            "{funder.history}"
                                                        </p>
                                                        <button className="mt-3 text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1">
                                                            View Full Audit Log <ArrowUpRight size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CapitalImpactDashboard;
