import React, { useState, useEffect } from 'react';
import { X, Download, Share2, TrendingUp, AlertCircle, CheckCircle2, Target, MessageSquare, ArrowRight, Zap, Shield, Timer, TrendingDown, Clock, BarChart, MapPin, Briefcase, RefreshCw } from 'lucide-react';
import { generateImpactRecap } from '../../utils/impactRecapUtils';

const ImpactRecap = ({ onClose }) => {
    const [data, setData] = useState(null);
    const [reflections, setReflections] = useState({});

    useEffect(() => {
        setData(generateImpactRecap('LO'));
    }, []);

    if (!data) return null;

    const handlePrint = () => {
        window.print();
    };

    // Helper to render dynamic icons
    const renderIcon = (iconName, size = 16) => {
        const icons = {
            timer: <Timer size={size} />,
            "trend-down": <TrendingDown size={size} />,
            "bar-chart": <BarChart size={size} />,
            "trending-up": <TrendingUp size={size} />,
            users: <Zap size={size} />, // Using Zap for "TA impact" vibe or Users
            clock: <Clock size={size} />,
            zap: <Zap size={size} />,
            "check-circle": <CheckCircle2 size={size} />,
            "refresh-cw": <RefreshCw size={size} />,
            "map-pin": <MapPin size={size} />,
            briefcase: <Briefcase size={size} />
        };
        return icons[iconName] || <CheckCircle2 size={size} />;
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center print:static print:bg-white print:p-0">
            <div className="bg-slate-50 w-full max-w-5xl h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 print:h-auto print:shadow-none print:rounded-none pr-print print:bg-white border border-slate-200">

                {/* LAYER 1: SUPER HEADER (Persistent) */}
                <div className="bg-white border-b border-slate-200 sticky top-0 z-20 flex flex-col md:flex-row items-center justify-between px-8 py-4 shadow-sm print:static print:border-none">

                    {/* User Context */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg shadow-sm">AM</div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900 leading-tight">{data.meta.user}</h1>
                            <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-wide font-medium">
                                <span>{data.meta.role}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{data.meta.period}</span>
                            </div>
                        </div>
                    </div>

                    {/* Impact Snapshot (Pills) */}
                    <div className="flex items-center gap-3 my-4 md:my-0 overflow-x-auto max-w-full px-2">
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200/60 shadow-sm">
                            <span className="text-lg font-bold text-slate-800">{data.yearAtAGlance.leadsHandled}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Leads</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-200/60 shadow-sm">
                            <span className="text-lg font-bold text-slate-800">{data.yearAtAGlance.taEngagements}</span>
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">TA Cases</span>
                        </div>
                        <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
                            <span className="text-lg font-bold text-indigo-700">{data.yearAtAGlance.loansConverted}</span>
                            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Converted</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end print:hidden">
                        <button
                            onClick={handlePrint}
                            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <Download size={16} />
                            <span>Download PDF</span>
                        </button>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-2">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* LAYER 2: SIGNAL PANELS (Scrollable) */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-8 print:p-0 print:overflow-visible bg-slate-50/50">

                    {/* MODE A: HITS (Signal Cards) */}
                    <section className="bg-white rounded-xl border border-emerald-100/60 shadow-sm overflow-hidden print:border-none print:shadow-none">
                        <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/30 px-8 py-5 border-b border-emerald-100/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                                    <Zap size={18} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">What Worked</h2>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Signal Cards */}
                            {data.hits.insights.map((hit, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all group flex flex-col h-full">
                                    <div className="flex items-center gap-2 mb-4 text-emerald-700 font-bold text-base border-b border-slate-50 pb-3">
                                        <CheckCircle2 size={18} className="text-emerald-500" />
                                        {hit.title}
                                    </div>

                                    {/* Micro-Metrics */}
                                    <div className="space-y-3 mb-6 flex-1">
                                        {hit.metrics.map((m, i) => (
                                            <div key={i} className="flex items-center gap-2.5 text-sm text-slate-600">
                                                <span className="text-slate-400 shrink-0">{renderIcon(m.icon, 16)}</span>
                                                <span className="font-medium bg-slate-50 px-2 py-0.5 rounded text-slate-700">{m.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-xs text-slate-500 border-t border-slate-50 pt-3 italic">
                                        "{hit.interpretation}"
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Mission Alignment */}
                        <div className="px-8 pb-8 pt-0">
                            <div className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100/50 flex flex-col md:flex-row items-center gap-6">
                                <div className="flex items-center gap-3 ">
                                    <div className="p-2 bg-white rounded-full text-teal-600 shadow-sm"><Shield size={18} /></div>
                                    <span className="font-bold text-slate-700 text-sm whitespace-nowrap">{data.hits.missionAlignment.title}</span>
                                </div>
                                <div className="h-4 w-px bg-emerald-200 hidden md:block"></div>
                                <div className="flex gap-4">
                                    {data.hits.missionAlignment.metrics.map((m, i) => (
                                        <div key={i} className="flex items-center gap-2 text-xs font-bold text-teal-800 bg-teal-100/50 px-3 py-1.5 rounded-full">
                                            {renderIcon(m.icon, 14)}
                                            {m.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* MODE B: MOMENTUM SLOWED (Pattern Cards) */}
                    <section className="bg-white rounded-xl border border-amber-100/60 shadow-sm overflow-hidden print:border-none print:shadow-none print:break-before-page">
                        <div className="bg-amber-50/40 px-8 py-5 border-b border-amber-100/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                                    <TrendingUp size={18} />
                                </div>
                                <h2 className="text-lg font-bold text-slate-800">Where Momentum Slowed</h2>
                            </div>
                            <div className="flex items-center gap-2 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                                <AlertCircle size={12} className="text-amber-600" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">Signals, Not Failures</span>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            {data.misses.signals.map((miss, idx) => (
                                <div key={idx} className="bg-amber-50/20 p-6 rounded-xl border border-amber-100/60 relative">
                                    <div className="absolute top-6 left-0 w-1 h-8 bg-amber-300 rounded-r"></div>
                                    <h3 className="font-bold text-slate-800 mb-4 pl-2">{miss.title}</h3>

                                    <div className="space-y-2 mb-4 pl-2">
                                        {miss.metrics.map((m, i) => (
                                            <div key={i} className="text-xs font-medium text-amber-800 bg-amber-50 inline-block px-2 py-1 rounded mr-2 mb-1">
                                                {m.label}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 pl-2 leading-relaxed">
                                        {miss.detail}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* LAYER 3: REFLECTION & FOCUS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:break-inside-avoid">

                        {/* Reflection Panel */}
                        <section className="bg-indigo-50/30 rounded-xl border border-indigo-100 p-8 flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <MessageSquare className="text-indigo-500" size={18} />
                                <h2 className="text-base font-bold text-slate-800">Reflection Notes</h2>
                            </div>

                            <div className="flex gap-2 flex-wrap mb-6">
                                {data.reflections.map((ref, i) => (
                                    <div key={i} className="bg-white px-3 py-2 rounded-lg border border-indigo-100 text-xs text-indigo-800 shadow-sm">
                                        {ref}
                                    </div>
                                ))}
                            </div>

                            <div className="relative flex-1">
                                <textarea
                                    className="w-full h-full min-h-[120px] p-4 bg-white border border-indigo-200 rounded-xl shadow-inner text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none print:border-none print:shadow-none print:bg-transparent print:p-0 leading-relaxed text-slate-700"
                                    placeholder="Private workspace. What story do these numbers tell?"
                                    value={reflections.personal || ''}
                                    onChange={(e) => setReflections({ ...reflections, personal: e.target.value })}
                                ></textarea>
                                <span className="absolute bottom-3 right-3 text-[10px] text-slate-400 uppercase font-bold tracking-wider">Private</span>
                            </div>
                        </section>

                        {/* Forward Focus Panel */}
                        <section className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm print:border-slate-300 flex flex-col">
                            <div className="flex items-center gap-3 mb-6">
                                <Target className="text-blue-600" size={18} />
                                <h2 className="text-base font-bold text-slate-800">Next Period Focus</h2>
                            </div>

                            <div className="space-y-3 flex-1">
                                {data.focusAreas.map((area, idx) => (
                                    <div key={idx} className="flex gap-4 items-center p-3 rounded-lg hover:bg-slate-50 transition-colors group cursor-default border border-transparent hover:border-slate-100">
                                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            {idx + 1}
                                        </div>
                                        <div className="text-slate-700 font-medium text-sm">
                                            {area}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                </div>

                {/* Print Footer */}
                <div className="hidden print:flex fixed bottom-0 w-full p-8 border-t border-slate-200 justify-between text-[10px] text-slate-400 uppercase tracking-widest bg-white z-50">
                    <span>Generated by MyFlow CRM</span>
                    <span>Confidential • {data.meta.generatedDate}</span>
                </div>

                <style>{`
                    @media print {
                        @page { margin: 0.5cm; size: auto; }
                        body { -webkit-print-color-adjust: exact; }
                        .custom-scrollbar::-webkit-scrollbar { display: none; }
                        .bg-slate-900\\/50 { background: none; }
                        .print\\:hidden { display: none !important; }
                    }
                `}</style>

            </div>
        </div>
    );
};

export default ImpactRecap;
