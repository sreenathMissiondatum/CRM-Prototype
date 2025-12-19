import React, { useState } from 'react';
import {
    ShieldCheck,
    ShieldAlert,
    Info,
    TrendingUp,
    TrendingDown,
    Activity,
    FileText,
    AlertOctagon,
    CheckCircle2,
    Lock,
    Scale,
    BrainCircuit,
    Gavel
} from 'lucide-react';

const DefenseMode = ({ account }) => {
    const [stressValue, setStressValue] = useState(20);

    return (
        <div className="h-full bg-slate-50 flex flex-col overflow-hidden">

            {/* 1. CREDIT VERDICT PANEL (The "Stance") */}
            <div className="bg-slate-900 text-white p-6 md:p-8 shrink-0">
                <div className="flex flex-col md:flex-row justify-between items-start gap-8">

                    {/* Verdict Signal */}
                    <div className="flex gap-6 items-center">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-900/50">
                                <ShieldCheck size={40} className="text-white" />
                            </div>
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-800 rounded text-[10px] font-bold uppercase border border-slate-600 tracking-wider whitespace-nowrap">
                                Policy Aligned
                            </div>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Credit Stance</h2>
                            <div className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                                APPROVE / MONITOR
                                <span className="text-sm font-medium text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">Confidence: 92%</span>
                            </div>
                            <div className="mt-2 text-sm text-slate-300 max-w-xl leading-relaxed">
                                <strong className="text-white">AI Verdict:</strong> Supported by strong DSCR (1.45x) and improving leverage trends. Risk factors are fully mitigated by collateral coverage (75% LTV).
                            </div>
                        </div>
                    </div>

                    {/* Metrics Snapshot */}
                    <div className="flex gap-8 border-l border-slate-700 pl-8">
                        <div>
                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Risk Rating</div>
                            <div className="text-2xl font-bold text-white">4 <span className="text-sm text-slate-500 font-normal">/ 10</span></div>
                            <div className="flex items-center gap-1 text-[10px] text-emerald-400"><TrendingUp size={10} /> Improving</div>
                        </div>
                        <div>
                            <div className="text-xs text-slate-400 uppercase font-bold mb-1">Next Review</div>
                            <div className="text-2xl font-bold text-white">Dec 15</div>
                            <div className="text-[10px] text-slate-500">Auto-Scheduled</div>
                        </div>
                    </div>

                </div>
            </div>

            {/* 2. MAIN BRAIN GRID */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0">

                {/* LEFT: CAUSALITY & FACTORS */}
                <div className="col-span-8 p-6 md:p-8 overflow-y-auto space-y-8">

                    {/* Risk Decomposition */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Activity size={18} className="text-blue-500" />
                            Risk Factor Decomposition
                        </h3>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Factor 1 */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="relative">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Primary Strength</div>
                                    <div className="font-bold text-slate-800 text-lg mb-2">Debt Service</div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full mb-2 overflow-hidden">
                                        <div className="h-full bg-emerald-500 w-[85%] rounded-full"></div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-snug">
                                        EBITDA growth outpacing interest expense. Rolling 12m coverage is strongest in peer group.
                                    </p>
                                </div>
                            </div>

                            {/* Factor 2 */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="relative">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Primary Weakness</div>
                                    <div className="font-bold text-slate-800 text-lg mb-2">Customer Conc.</div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full mb-2 overflow-hidden">
                                        <div className="h-full bg-amber-500 w-[60%] rounded-full"></div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-snug">
                                        Top client represents 22% of revenue. Mitigated by long-term contract (exp 2027).
                                    </p>
                                </div>
                            </div>

                            {/* Factor 3 */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="relative">
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Market Context</div>
                                    <div className="font-bold text-slate-800 text-lg mb-2">Industry Risk</div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full mb-2 overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[45%] rounded-full"></div>
                                    </div>
                                    <p className="text-xs text-slate-500 leading-snug">
                                        Sector outlook is neutral. Supply chain volatility has stabilized in Q3.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Trajectory Analysis */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <TrendingUp size={18} className="text-purple-500" />
                            Risk Trajectory (12m Forecast)
                        </h3>
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <div className="flex items-end gap-2 mb-6">
                                <div className="flex-1">
                                    <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                                        <span>Likelihood of Default (PD)</span>
                                        <span className="text-slate-800">1.2% (Low)</span>
                                    </div>
                                    <div className="w-full h-32 flex items-end gap-1 border-b border-slate-100 pb-1">
                                        {/* Mock Charts */}
                                        {[20, 22, 18, 15, 12, 10, 8, 9, 7, 6, 5, 5].map((h, i) => (
                                            <div key={i} className="flex-1 bg-indigo-50 hover:bg-indigo-100 relative group">
                                                <div style={{ height: `${h * 4}px` }} className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
                                        <span>Q1 2024</span>
                                        <span>TODAY</span>
                                        <span>Q1 2025 (PROJ)</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-lg text-xs text-indigo-800 font-medium leading-relaxed flex gap-2">
                                <Info size={14} className="shrink-0 mt-0.5" />
                                <div>
                                    Projection assumes stable margins. Sensitivity analysis shows resilience up to -15% revenue shock before PD increases significantly.
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Policy & Governance */}
                    <section>
                        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Gavel size={18} className="text-slate-600" />
                            Policy & Governance
                        </h3>
                        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                            <div className="p-4 flex justify-between items-center bg-emerald-50/30">
                                <div className="flex gap-3 items-center">
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">Commercial Credit Policy 4.1</div>
                                        <div className="text-xs text-slate-500">LTV Thresholds</div>
                                    </div>
                                </div>
                                <span className="px-2 py-1 rounded-full bg-white border border-emerald-200 text-emerald-700 text-xs font-bold">Pass</span>
                            </div>
                            <div className="p-4 flex justify-between items-center bg-amber-50/30">
                                <div className="flex gap-3 items-center">
                                    <AlertOctagon size={18} className="text-amber-500" />
                                    <div>
                                        <div className="text-sm font-bold text-slate-800">Credit Policy 2.3 (EXCEPTION)</div>
                                        <div className="text-xs text-slate-500">Operating Account Requirement</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="px-2 py-1 rounded-full bg-white border border-amber-200 text-amber-700 text-xs font-bold">Waiver Active</span>
                                    <div className="text-[10px] text-slate-400 mt-0.5">Exp: Dec 31, 2025</div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>

                {/* RIGHT: STRESS LAB & ACTION */}
                <div className="col-span-4 bg-slate-100 border-l border-slate-200 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">

                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                        <BrainCircuit size={16} />
                        <h3 className="text-xs font-bold uppercase tracking-widest">Stress Lab</h3>
                    </div>

                    {/* Interactive Stress Test */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-bold text-slate-700">Revenue Shock</span>
                            <span className="text-sm font-bold text-red-500">-{stressValue}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="40"
                            value={stressValue}
                            onChange={(e) => setStressValue(e.target.value)}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-500 mb-6"
                        />

                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Resulting DSCR</span>
                                <span className={`text-sm font-mono font-bold ${stressValue > 25 ? 'text-red-600' : 'text-slate-800'}`}>
                                    {stressValue > 25 ? '0.98x' : stressValue > 15 ? '1.15x' : '1.35x'}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-500">Provision Impact</span>
                                <span className="text-sm font-mono font-bold text-slate-800">
                                    +${stressValue * 1500}
                                </span>
                            </div>
                        </div>

                        {stressValue > 25 && (
                            <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex gap-2">
                                <AlertOctagon size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-red-700 font-medium leading-snug">
                                    Breach threshold exceeded. Action plan required for this scenario.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Prescriptive Actions */}
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex-1">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <Scale size={16} />
                            <h3 className="text-xs font-bold uppercase tracking-widest">Recommended Actions</h3>
                        </div>

                        <div className="space-y-3">
                            <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-slate-700 text-sm group-hover:text-blue-700">Extend Waiver</span>
                                    <span className="bg-blue-100 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-bold">High Priority</span>
                                </div>
                                <p className="text-xs text-slate-500">Operating account waiver expires soon. Prepare renewal memo.</p>
                            </button>

                            <button className="w-full text-left p-3 rounded-lg border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all group">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-slate-700 text-sm">Request Updated AR</span>
                                </div>
                                <p className="text-xs text-slate-500">Customer concentration risk requires fresh aging report.</p>
                            </button>

                            <button className="w-full py-2 mt-4 text-xs font-bold text-slate-400 border border-dashed border-slate-300 rounded-lg hover:border-slate-400 hover:text-slate-600 transition-colors">
                                + Add Compliance Task
                            </button>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DefenseMode;
