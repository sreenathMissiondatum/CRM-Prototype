import React from 'react';
import {
    ArrowRight,
    TrendingUp,
    TrendingDown,
    Activity,
    ShieldAlert,
    Zap,
    AlertTriangle,
    ThermoSun,
    Anchor,
    Wind,
    CheckCircle2,
    Clock
} from 'lucide-react';

const PulseMode = ({ account }) => {
    return (
        <div className="h-full p-6 bg-slate-50 overflow-hidden flex flex-col">
            {/* Top Summary Line */}
            <div className="mb-6 flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Relationship Pulse</h2>
                    <p className="text-sm text-slate-500">Live decision cockpit. Synthesized signals from last 30 days.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Confidence</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 font-bold text-xs">
                        <Zap size={12} fill="currentColor" />
                        94% HIGH
                    </div>
                </div>
            </div>

            {/* Main Cockpit Grid */}
            <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">

                {/* LEFT PANEL: VITALS (Health & Trajectory) */}
                <div className="col-span-3 flex flex-col gap-6">

                    {/* Health Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
                        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500"></div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Relationship Health</h3>

                        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="64" cy="64" r="56" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                                <circle cx="64" cy="64" r="56" stroke="#10b981" strokeWidth="8" fill="transparent" strokeDasharray="351" strokeDashoffset={351 - (351 * 0.88)} strokeLinecap="round" />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-4xl font-black text-slate-800">88</span>
                                <span className="text-xs font-bold text-emerald-600">STABLE</span>
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center gap-1.5"><TrendingUp size={14} className="text-emerald-500" /> Drivers</span>
                            </div>
                            <div className="flex flex-wrap gap-2 justify-center">
                                <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">+ Profitability</span>
                                <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">+ Trust</span>
                                <span className="px-2 py-1 rounded bg-red-50 text-red-700 text-[10px] font-bold border border-red-100">- Usage</span>
                            </div>
                        </div>
                    </div>

                    {/* Trajectory Card */}
                    <div className="bg-slate-900 rounded-2xl p-6 h-1/3 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-10"><Wind size={64} /></div>
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Trajectory</h3>
                            <div className="text-2xl font-bold text-white flex items-center gap-2">
                                <ArrowRight size={20} className="text-blue-400 rotate-[-15deg]" />
                                Positive
                            </div>
                        </div>
                        <div className="text-xs text-slate-400 leading-relaxed">
                            Projected to enter "Expansion" stage in Q1 based on current interaction velocity.
                        </div>
                    </div>

                </div>

                {/* CENTRE PANEL: SYNTHESIS (Tension & Signals) */}
                <div className="col-span-5 flex flex-col gap-6">

                    {/* Tension Meter */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Strategic Tension</h3>
                            <div className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">BALANCED</div>
                        </div>

                        <div className="relative h-12 bg-slate-100 rounded-full flex items-center px-2 mb-2 overflow-hidden border border-slate-200">
                            {/* Background Zones */}
                            <div className="absolute inset-0 flex opacity-20">
                                <div className="w-1/2 bg-amber-200"></div>
                                <div className="w-1/2 bg-indigo-200"></div>
                            </div>

                            {/* Labels */}
                            <div className="relative w-full flex justify-between px-4 z-10 text-xs font-bold uppercase">
                                <span className="text-amber-800 flex items-center gap-1"><ShieldAlert size={12} /> Protection</span>
                                <span className="text-indigo-800 flex items-center gap-1">Growth <Zap size={12} /></span>
                            </div>

                            {/* Indicator Puck */}
                            <div className="absolute left-[55%] -translate-x-1/2 w-1.5 h-full bg-slate-800 z-20 shadow-xl scale-y-110"></div>
                        </div>
                        <p className="text-xs text-center text-slate-500 mt-2">
                            Current posture favors <strong className="text-indigo-600">Growth</strong> while maintaining baseline controls.
                        </p>
                    </div>

                    {/* Signal Strip (Deltas) */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-0 flex-1 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Signal Strip (Deltas Only)</h3>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Last 30 Days</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">

                            <div className="flex gap-4 items-start group">
                                <div className="w-8 h-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100 mt-0.5">
                                    <TrendingDown size={14} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800">Utilisation Drop</div>
                                    <div className="text-xs text-slate-500 leading-snug">Line utilization dropped by <strong>15%</strong> relative to 3-month avg.</div>
                                    <div className="mt-1 text-[10px] text-slate-400 font-mono">2 days ago • System</div>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start group">
                                <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 mt-0.5">
                                    <CheckCircle2 size={14} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800">Covenant Cleared</div>
                                    <div className="text-xs text-slate-500 leading-snug">Q3 Financials submitted and validated. All ratios passing.</div>
                                    <div className="mt-1 text-[10px] text-slate-400 font-mono">Yesterday • System</div>
                                </div>
                            </div>

                            <div className="flex gap-4 items-start group">
                                <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100 mt-0.5">
                                    <Zap size={14} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-slate-800">New Intent Signal</div>
                                    <div className="text-xs text-slate-500 leading-snug">Client checked "Commercial Real Estate" rates on portal twice.</div>
                                    <div className="mt-1 text-[10px] text-slate-400 font-mono">4 hours ago • Digital</div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>

                {/* RIGHT PANEL: ACTION (Readiness & Consequence) */}
                <div className="col-span-4 flex flex-col gap-6">

                    {/* Action Readiness */}
                    <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-xl bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                        <h3 className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-4">Action Readiness</h3>
                        <div className="flex items-end gap-2 mb-2">
                            <span className="text-4xl font-black">Ready</span>
                            <span className="text-sm font-medium text-indigo-200 mb-1.5">to Pitch</span>
                        </div>
                        <p className="text-xs text-indigo-100 leading-relaxed opacity-90 mb-6">
                            Client liquidity is high, debt load decreased. Market conditions optimized for CRE expansion.
                        </p>
                        <button className="w-full py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
                            <Zap size={16} /> Activate "CRE Growth" Play
                        </button>
                    </div>

                    {/* Immediate Next Step */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 flex-1 shadow-sm flex flex-col">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Prescribed Next Step</h3>

                        <div className="flex-1">
                            <div className="flex items-start gap-3 mb-4">
                                <div className="mt-1"><Clock size={16} className="text-slate-400" /></div>
                                <div>
                                    <div className="font-bold text-slate-800">Schedule Strategy Call</div>
                                    <div className="text-xs text-slate-500 mt-1">Discuss utilization drop and probe CRE interest.</div>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                                <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase mb-1">
                                    <AlertTriangle size={12} />
                                    Consequence of Inaction
                                </div>
                                <p className="text-xs text-amber-800 leading-relaxed">
                                    Risk of <strong className="font-bold">Wallet Share Erosion</strong>. Competitor likely pitching refinancing if utilization trend continues for 14 more days.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                            <button className="flex-1 py-2 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50">Snooze</button>
                            <button className="flex-1 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800">Execute</button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default PulseMode;
