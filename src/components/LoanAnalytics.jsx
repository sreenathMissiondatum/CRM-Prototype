import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Clock, Activity, Filter, ArrowDown, Info, ChevronRight, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// Mock Drill-down Data
const drillDownLoans = [
    { id: 'LN-2023-001', name: 'TechStart Systems', amount: '$250,000', stage: 'Underwriting', risk: 'High', daysInStage: 12, slaStatus: 'Breach' },
    { id: 'LN-2023-002', name: 'Anderson Logistics', amount: '$150,000', stage: 'Funded', risk: 'Low', daysInStage: 3, slaStatus: 'OK' },
    { id: 'LN-2023-003', name: 'GreenEarth Co.', amount: '$75,000', stage: 'Application', risk: 'Medium', daysInStage: 2, slaStatus: 'OK' },
    { id: 'LN-2023-005', name: 'Metro Foods', amount: '$500,000', stage: 'Review', risk: 'Medium', daysInStage: 5, slaStatus: 'Warning' },
    { id: 'LN-2023-006', name: 'Rapid Construct', amount: '$1.2M', stage: 'Underwriting', risk: 'High', daysInStage: 9, slaStatus: 'Breach' },
    { id: 'LN-2023-007', name: 'SoftSol Inc', amount: '$180,000', stage: 'Decision', risk: 'Low', daysInStage: 1, slaStatus: 'OK' },
    { id: 'LN-2023-008', name: 'BioLabs', amount: '$320,000', stage: 'Review', risk: 'Low', daysInStage: 3, slaStatus: 'OK' },
    { id: 'LN-2023-009', name: 'AutoFleet', amount: '$85,000', stage: 'Application', risk: 'Low', daysInStage: 1, slaStatus: 'OK' },
];

const LoanAnalytics = () => {
    const [activeFilter, setActiveFilter] = useState(null); // { type: 'stage'|'risk'|'sla', value: string }

    // 1. Pipeline Volume by Stage Data
    const pipelineData = [
        { label: 'Application', amount: '$1.2M', count: 12, color: 'bg-slate-400', height: 'h-24' },
        { label: 'Review', amount: '$2.8M', count: 8, color: 'bg-blue-400', height: 'h-40' },
        { label: 'Underwriting', amount: '$4.5M', count: 5, color: 'bg-indigo-500', height: 'h-52' },
        { label: 'Decision', amount: '$1.8M', count: 3, color: 'bg-purple-500', height: 'h-32' },
        { label: 'Funded', amount: '$900k', count: 2, color: 'bg-emerald-500', height: 'h-16' },
    ];

    // 2. Stage Aging / Bottleneck Analysis
    const agingData = [
        { stage: 'Application', alias: 'App', avgDays: 2, sla: 3, color: 'bg-emerald-500', status: 'OK' },
        { stage: 'Review', alias: 'Review', avgDays: 5, sla: 4, color: 'bg-amber-500', status: 'Warning' },
        { stage: 'Underwriting', alias: 'Und', avgDays: 12, sla: 7, color: 'bg-red-500', status: 'Breach' },
        { stage: 'Decision', alias: 'Dec', avgDays: 1, sla: 2, color: 'bg-emerald-500', status: 'OK' },
        { stage: 'Funded', alias: 'Fund', avgDays: 3, sla: 5, color: 'bg-emerald-500', status: 'OK' },
    ];

    // 3. Risk Distribution
    const riskData = {
        low: { percent: 65, count: 42, color: 'bg-emerald-500', value: 'Low' },
        medium: { percent: 25, count: 16, color: 'bg-amber-500', value: 'Medium' },
        high: { percent: 10, count: 7, color: 'bg-red-500', value: 'High' }
    };

    // 4. Drop-off / Stalled Funnel
    const funnelData = [
        { stage: 'Application', count: 150, dropOff: 10 },
        { stage: 'Review', count: 135, dropOff: 25 },
        { stage: 'Underwriting', count: 101, dropOff: 15 },
        { stage: 'Decision', count: 86, dropOff: 5 },
        { stage: 'Funded', count: 82, dropOff: 0 },
    ];

    const handleFilterClick = (type, value) => {
        if (activeFilter?.type === type && activeFilter?.value === value) {
            setActiveFilter(null); // Toggle off
        } else {
            setActiveFilter({ type, value });
        }
    };

    const getFilteredLoans = () => {
        if (!activeFilter) return [];
        return drillDownLoans.filter(loan => {
            if (activeFilter.type === 'stage') return loan.stage === activeFilter.value;
            if (activeFilter.type === 'risk') return loan.risk === activeFilter.value;
            if (activeFilter.type === 'sla') return loan.slaStatus === activeFilter.value;
            return false;
        });
    };

    const filteredLoans = getFilteredLoans();

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-8">

                {/* Metrics Row (Static) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard icon={TrendingUp} label="Total Pipeline" value="$11.2M" trend="+12%" trendColor="text-emerald-600" />
                    <MetricCard icon={Clock} label="Avg. Time to Fund" value="23 Days" trend="-2 Days" trendColor="text-emerald-600" />
                    <MetricCard icon={AlertTriangle} label="SLA Breaches" value="3" trend="+1" trendColor="text-red-600" />
                    <MetricCard icon={Activity} label="Conversion Rate" value="54%" trend="+2%" trendColor="text-emerald-600" />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Chart 1: Pipeline Volume */}
                    <ChartContainer title="Pipeline Volume by Stage" subtitle="Click bars to filter by stage">
                        <div className="flex items-end justify-between gap-4 h-52 pt-6 px-2">
                            {pipelineData.map((item, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => handleFilterClick('stage', item.label)}
                                    className={twMerge(
                                        "group relative flex flex-col items-center justify-end w-full h-full cursor-pointer transition-all duration-200",
                                        (activeFilter?.type === 'stage' && activeFilter?.value === item.label) ? "opacity-100 scale-105" : (activeFilter ? "opacity-40" : "opacity-100")
                                    )}
                                >
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] py-2 px-3 rounded-lg shadow-xl pointer-events-none z-20 w-max transform translate-y-1 group-hover:translate-y-0 duration-200">
                                        <div className="font-bold text-sm mb-0.5">{item.amount}</div>
                                        <div className="text-slate-400 font-medium">{item.count} Loans</div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                    </div>

                                    <div className={`w-full rounded-t-sm transition-all duration-300 ${item.color} ${item.height} group-hover:opacity-90`}></div>
                                    <span className="text-[10px] text-slate-500 mt-2 font-medium truncate w-full text-center">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </ChartContainer>

                    {/* Chart 2: Stage Aging */}
                    <ChartContainer title="Stage Aging Analysis" subtitle="Click bars to filter by SLA status">
                        <div className="space-y-4 pt-2">
                            {agingData.map((item, idx) => {
                                const widthPercent = Math.min((item.avgDays / 15) * 100, 100);
                                const slaPercent = (item.sla / 15) * 100;
                                const isSelected = activeFilter?.type === 'sla' && activeFilter?.value === item.status;

                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleFilterClick('sla', item.status)}
                                        className={twMerge(
                                            "group cursor-pointer transition-opacity duration-200",
                                            (isSelected || !activeFilter) ? "opacity-100" : "opacity-40"
                                        )}
                                    >
                                        <div className="flex justify-between text-[11px] mb-1">
                                            <span className="font-medium text-slate-600 w-16">{item.alias}</span>
                                            <span className="text-slate-400">{item.avgDays} days</span>
                                        </div>
                                        <div className="relative h-6 w-full bg-slate-50 rounded-sm overflow-visible">
                                            <div className="absolute top-0 bottom-0 w-px bg-slate-400 border-r border-dashed border-slate-400 z-10" style={{ left: `${slaPercent}%` }}></div>
                                            <div className={`h-full rounded-sm transition-all duration-500 ${item.color}`} style={{ width: `${widthPercent}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="flex justify-end gap-3 mt-2">
                                <LegendItem color="bg-emerald-500" label="OK" />
                                <LegendItem color="bg-amber-500" label="Warning" />
                                <LegendItem color="bg-red-500" label="Breach" />
                            </div>
                        </div>
                    </ChartContainer>

                    {/* Chart 3: Risk Distribution */}
                    <ChartContainer title="Risk Distribution" subtitle="Click segments to filter by risk">
                        <div className="pt-8 pb-4">
                            <div className="flex w-full h-12 rounded-lg overflow-hidden cursor-pointer shadow-sm">
                                {Object.values(riskData).map((risk, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => handleFilterClick('risk', risk.value)}
                                        className={twMerge(
                                            "h-full flex items-center justify-center text-white text-xs font-bold transition-all duration-200",
                                            risk.color,
                                            (activeFilter?.type === 'risk' && activeFilter?.value === risk.value) ? "brightness-110" : (activeFilter ? "opacity-40 grayscale-[0.5]" : "hover:brightness-105")
                                        )}
                                        style={{ width: `${risk.percent}%` }}
                                    >
                                        {risk.percent}%
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 px-2">
                                <RiskLegend label="Low Risk" count={riskData.low.count} color="bg-emerald-500" />
                                <RiskLegend label="Medium Risk" count={riskData.medium.count} color="bg-amber-500" />
                                <RiskLegend label="High Risk" count={riskData.high.count} color="bg-red-500" />
                            </div>
                        </div>
                    </ChartContainer>

                    {/* Chart 4: Funnel (Static for visibility) */}
                    <ChartContainer title="Pipeline Funnel" subtitle="Conversion rates">
                        <div className="pt-2 flex flex-col items-center space-y-2">
                            {funnelData.map((stage, idx) => {
                                const maxCount = 150;
                                const widthPercent = (stage.count / maxCount) * 100;
                                return (
                                    <div key={idx} className="w-full flex items-center group cursor-default">
                                        <div className="w-24 text-right pr-4 text-[10px] font-medium text-slate-500">{stage.stage}</div>
                                        <div className="flex-1 flex justify-center relative">
                                            <div className="h-8 bg-blue-500/20 rounded flex items-center justify-center text-xs font-bold text-blue-700" style={{ width: `${widthPercent}%` }}>
                                                {stage.count}
                                            </div>
                                        </div>
                                        <div className="w-24"></div>
                                    </div>
                                )
                            })}
                        </div>
                    </ChartContainer>
                </div>

                {/* Drill-down Table Section */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeFilter ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="border-t border-slate-200 pt-8 mt-2">
                        <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">

                            {/* Table Header / Controls */}
                            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white">
                                <div className="flex items-center gap-2">
                                    <h4 className="font-bold text-slate-800 text-sm">Active Loans Filtered</h4>
                                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1">
                                        {activeFilter?.type === 'stage' && 'Stage: '}
                                        {activeFilter?.type === 'risk' && 'Risk: '}
                                        {activeFilter?.type === 'sla' && 'SLA: '}
                                        {activeFilter?.value}
                                        <button onClick={() => setActiveFilter(null)} className="hover:text-blue-900"><X size={12} /></button>
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500">{filteredLoans.length} results found</div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 font-medium text-xs uppercase tracking-wider border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3">Loan ID</th>
                                            <th className="px-4 py-3">Applicant</th>
                                            <th className="px-4 py-3">Amount</th>
                                            <th className="px-4 py-3">Stage</th>
                                            <th className="px-4 py-3">Risk</th>
                                            <th className="px-4 py-3">SLA Status</th>
                                            <th className="px-4 py-3 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-white">
                                        {filteredLoans.length > 0 ? (
                                            filteredLoans.map((loan) => (
                                                <tr key={loan.id} className="hover:bg-blue-50/50 transition-colors group cursor-pointer">
                                                    <td className="px-4 py-3 font-mono text-xs text-slate-500">{loan.id}</td>
                                                    <td className="px-4 py-3 font-medium text-blue-600">{loan.name}</td>
                                                    <td className="px-4 py-3 text-slate-700 font-bold">{loan.amount}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 uppercase">
                                                            {loan.stage}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={twMerge(
                                                            "px-1.5 py-0.5 rounded-full text-[10px] font-bold",
                                                            loan.risk === 'Low' ? "bg-emerald-100 text-emerald-700" :
                                                                loan.risk === 'Medium' ? "bg-amber-100 text-amber-700" :
                                                                    "bg-red-100 text-red-700"
                                                        )}>
                                                            {loan.risk}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className={twMerge(
                                                            "flex items-center gap-1.5 text-xs font-medium",
                                                            loan.slaStatus === 'OK' ? "text-emerald-600" :
                                                                loan.slaStatus === 'Warning' ? "text-amber-600" : "text-red-600 font-bold"
                                                        )}>
                                                            <div className={twMerge("w-1.5 h-1.5 rounded-full",
                                                                loan.slaStatus === 'OK' ? "bg-emerald-500" :
                                                                    loan.slaStatus === 'Warning' ? "bg-amber-500" : "bg-red-500"
                                                            )}></div>
                                                            {loan.daysInStage} Days ({loan.slaStatus})
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                                            <ChevronRight size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-4 py-8 text-center text-slate-400 italic">No matching loans found.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Table Footer */}
                            <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex justify-center">
                                <button className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors">View All {filteredLoans.length} Loans</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

const ChartContainer = ({ title, subtitle, children }) => (
    <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 hover:border-slate-200 transition-colors">
        <div className="mb-4 flex justify-between items-start">
            <div>
                <h4 className="text-sm font-bold text-slate-800">{title}</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-wide font-medium mt-0.5">{subtitle}</p>
            </div>
            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                <Filter size={14} />
            </button>
        </div>
        {children}
    </div>
);

const MetricCard = ({ icon: Icon, label, value, trend, trendColor }) => (
    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-slate-50 group-hover:bg-blue-50 rounded-md text-slate-500 group-hover:text-blue-600 transition-colors">
                <Icon size={18} />
            </div>
            <span className={twMerge("text-xs font-bold bg-opacity-10 px-2 py-0.5 rounded-full", trendColor)}>
                {trend}
            </span>
        </div>
        <div className="text-2xl font-bold text-slate-900 tracking-tight">{value}</div>
        <div className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mt-1">{label}</div>
    </div>
);

const LegendItem = ({ color, label }) => (
    <div className="flex items-center gap-1.5">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <span className="text-[10px] text-slate-500 font-medium">{label}</span>
    </div>
);

const RiskLegend = ({ label, count, color }) => (
    <div className="flex flex-col items-center">
        <div className="flex items-center gap-1.5 mb-1">
            <div className={`w-2 h-2 rounded-full ${color}`}></div>
            <span className="text-[10px] text-slate-500 uppercase font-bold">{label}</span>
        </div>
        <span className="text-sm font-bold text-slate-800">{count}</span>
    </div>
);

export default LoanAnalytics;
