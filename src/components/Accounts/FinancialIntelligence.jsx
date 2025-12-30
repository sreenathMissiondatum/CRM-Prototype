import React, { useState, useEffect } from 'react';
import {
    TrendingUp, TrendingDown, Minus, ArrowRight,
    DollarSign, Activity, ShieldCheck, AlertCircle,
    Briefcase, FileText, ChevronRight
} from 'lucide-react';
import { generateFinancialIntelligence } from '../../utils/financialIntelligenceUtils';

import NormalizationWorkbench from './NormalizationWorkbench'; // [NEW]

const FinancialIntelligence = () => {
    const [data, setData] = useState(null);
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'workbench'

    useEffect(() => {
        setData(generateFinancialIntelligence());
    }, []);

    if (!data) return null;

    if (currentView === 'workbench') {
        return <NormalizationWorkbench onBack={() => setCurrentView('dashboard')} />;
    }

    const renderTrendIcon = (trend) => {
        if (trend === 'up') return <TrendingUp size={14} className="text-emerald-500" />;
        if (trend === 'down') return <TrendingDown size={14} className="text-amber-500" />; // Context dependent, but amber for down often implies watch
        return <Minus size={14} className="text-slate-400" />;
    };

    const renderStatusBadge = (status) => {
        const styles = {
            Healthy: "bg-emerald-50 text-emerald-700 border-emerald-100",
            good: "bg-emerald-50 text-emerald-700 border-emerald-100",
            Watch: "bg-amber-50 text-amber-700 border-amber-100",
            Pressure: "bg-rose-50 text-rose-700 border-rose-100"
        };
        const style = styles[status] || styles.Healthy;
        return (
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${style}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50">

            {/* LAYER 1: FINANCIAL CONTEXT HEADER */}
            <div className="bg-white border-b border-slate-200 p-6 shadow-sm">
                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">

                    {/* Left: Context */}
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 border border-blue-100">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 leading-tight">{data.meta.businessName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-100 px-2 py-0.5 rounded">
                                    {data.meta.statementType}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">•</span>
                                <span className="text-xs font-medium text-slate-600">{data.meta.period}</span>
                            </div>
                        </div>
                    </div>

                    {/* Center: Context Pills */}
                    <div className="flex flex-wrap items-center gap-4">
                        {data.contextPills.map((pill, idx) => (
                            <div key={idx} className="flex flex-col items-center bg-slate-50 px-5 py-2 rounded-lg border border-slate-100/60 min-w-[100px]">
                                <span className="text-base font-bold text-slate-800">{pill.value}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{pill.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setCurrentView('workbench')}
                            className="flex items-center gap-2 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white px-3 py-2 rounded-lg transition-colors border border-slate-200 shadow-sm"
                        >
                            <FileText size={14} /> Statements (1)
                        </button>
                        <button className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-2 rounded-lg transition-colors border border-blue-100">
                            <Activity size={14} /> Full Report
                        </button>
                    </div>
                </div>
            </div>

            {/* LAYER 2 & 3: SIGNALS & TRENDS (Scrollable) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">

                {/* Signals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

                    {/* PANEL A: PROFITABILITY */}
                    <SignalPanel
                        title="Profitability"
                        icon={TrendingUp}
                        color="emerald"
                        footer={data.signals.profitability.interpretation}
                    >
                        <div className="space-y-4">
                            {data.signals.profitability.items.map((item, i) => (
                                <div key={i} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-slate-500">{item.label}</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-bold text-slate-800">{item.value}</span>
                                            {renderTrendIcon(item.trend)}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 italic">{item.detail}</span>
                                </div>
                            ))}
                        </div>
                    </SignalPanel>

                    {/* PANEL B: CASH FLOW */}
                    <SignalPanel
                        title="Cash Flow & Debt"
                        icon={DollarSign}
                        color="blue"
                        badge={renderStatusBadge(data.signals.cashFlow.status)}
                        footer={data.signals.cashFlow.interpretation}
                    >
                        <div className="space-y-4">
                            {data.signals.cashFlow.items.map((item, i) => (
                                <div key={i} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-slate-500">{item.label}</span>
                                        <span className={`text-sm font-bold ${item.status === 'good' ? 'text-emerald-700' : 'text-slate-800'}`}>
                                            {item.value}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 italic">{item.detail}</span>
                                </div>
                            ))}
                        </div>
                    </SignalPanel>

                    {/* PANEL C: LEVERAGE */}
                    <SignalPanel
                        title="Leverage structure"
                        icon={ShieldCheck}
                        color="indigo"
                        footer={data.signals.leverage.interpretation}
                    >
                        <div className="space-y-4">
                            {data.signals.leverage.items.map((item, i) => (
                                <div key={i} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-slate-500">{item.label}</span>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm font-bold text-slate-800">{item.value}</span>
                                            {renderTrendIcon(item.trend)}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 italic">{item.detail || 'Stable'}</span>
                                </div>
                            ))}
                        </div>
                    </SignalPanel>

                    {/* PANEL D: LIQUIDITY */}
                    <SignalPanel
                        title="Liquidity"
                        icon={Briefcase}
                        color="amber"
                        footer={data.signals.liquidity.interpretation}
                    >
                        <div className="space-y-4">
                            {data.signals.liquidity.items.map((item, i) => (
                                <div key={i} className="flex flex-col gap-1 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium text-slate-500">{item.label}</span>
                                        <span className="text-sm font-bold text-slate-800">{item.value}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 italic">{item.detail}</span>
                                </div>
                            ))}
                        </div>
                    </SignalPanel>

                </div>

                {/* LAYER 3: TRENDS & INTERPRETATION */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp size={20} className="text-slate-400" />
                        <h3 className="text-base font-bold text-slate-800">Financial Trajectory (3-Year Lookback)</h3>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Trend Strip (Minimalist) */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-8">
                            {data.trends.series.map((serie, idx) => (
                                <div key={idx} className="relative">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{serie.name}</h4>
                                    <div className="flex items-end justify-between h-16 border-b border-slate-100 pb-2">
                                        {serie.data.map((val, i) => (
                                            <div key={i} className="flex flex-col items-center gap-2 group">
                                                <div
                                                    className={`w-2 rounded-t-sm bg-${serie.color}-500 transition-all group-hover:bg-${serie.color}-600`}
                                                    style={{ height: `${40 + (i * 20)}%` }} // Mock height visual
                                                ></div>
                                                <span className="text-xs font-medium text-slate-600">{val}</span>
                                                <span className="text-[10px] text-slate-300 transform -translate-y-1">{data.trends.periods[i]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Interpretation Panel */}
                        <div className="lg:w-1/3 bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-center">
                            <h4 className="text-sm font-bold text-slate-700 mb-2">System Interpretation</h4>
                            <p className="text-sm text-slate-600 leading-relaxed italic">
                                "{data.trends.interpretation}"
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-400">
                                <AlertCircle size={12} />
                                <span>Automated insight based on Year-Over-Year variance.</span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Sub-component for consistent panels
const SignalPanel = ({ title, icon: Icon, color, children, footer, badge }) => {
    const colors = {
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
    };
    const colorClasses = colors[color] || colors.blue;

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
            <div className={`px-5 py-4 border-b border-slate-50 flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${colorClasses.replace('border', '')}`}>
                        <Icon size={16} />
                    </div>
                    <h3 className="text-sm font-bold text-slate-800">{title}</h3>
                </div>
                {badge}
            </div>
            <div className="p-5 flex-1">
                {children}
            </div>
            {footer && (
                <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-50 text-xs font-medium text-slate-500 italic rounded-b-xl border-b border-transparent">
                    "{footer}"
                </div>
            )}
        </div>
    );
};

export default FinancialIntelligence;
