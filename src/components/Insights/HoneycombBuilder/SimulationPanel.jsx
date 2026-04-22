import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Activity, GitCommit } from 'lucide-react';

const SimulationPanel = ({ framework }) => {
    
    // UI Mock data for the trace
    const [payload, setPayload] = useState({
        revenue_totalAnnual: '750,000',
        ftes_current: '7',
        busAge_yrs: '4',
        industry_code: 'Manufacturing'
    });

    // Score Mocking simulating the backend calculation through the Attributes -> Rule layer
    const computedResults = {
        totalScore: 66,
        modules: [
            { name: 'Business Strength', score: 72, color: 'bg-[#3b82f6]' },
            { name: 'Cash Flow Strength', score: 68, color: 'bg-[#0d9488]' },
            { name: 'Financial Health', score: 65, color: 'bg-[#8b5cf6]' },
            { name: 'Digital Footprint', score: 58, color: 'bg-[#10b981]' },
            { name: 'Community Impact', score: 75, color: 'bg-[#f59e0b]' }
        ],
        // Mock trace of the primary rule that fired (e.g. from Cash Flow feature)
        traceHit: {
            featureName: 'Operating Cash Flow',
            ruleId: 'R1',
            scoreHit: 2.8,
            confidence: 94,
            sampleSize: 62,
            matchedBucket: 'A1: High, A2: 5-10 FTEs, A3: Growth'
        }
    };

    // Calculate the matching decision band from the framework
    const matchingBand = framework.decisionBands?.find(b => computedResults.totalScore >= b.min && computedResults.totalScore <= b.max) 
                         || { label: 'Unknown', color: 'text-slate-400', bg: 'bg-slate-500/10' };

    return (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl flex flex-col p-5 shadow-lg h-full">
            <div className="flex flex-col border-b border-[#334155] pb-3 mb-4">
                <h2 className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-1">
                    6. Preview Scoring & Decision Engine
                </h2>
                <span className="text-[10px] text-slate-400">Validate real-time mathematical computations and cut-off band execution.</span>
            </div>

            <div className="flex gap-4">
                {/* Inputs Area */}
                <div className="w-[180px] shrink-0 border-r border-[#334155] pr-4">
                    <div className="flex gap-1 mb-4 text-[10px] font-bold text-slate-300">
                        <button className="flex-1 py-1 rounded bg-[#0f172a] border border-[#334155]">JSON</button>
                        <button className="flex-1 py-1 rounded bg-blue-600/20 text-blue-400 border border-blue-500/50">Form</button>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-[10px]">
                            <label className="text-slate-300 font-bold truncate pr-2">revenue_totalAnnual</label>
                            <input type="text" className="w-16 shrink-0 bg-[#0f172a] border border-[#334155] rounded px-1.5 py-1 text-white text-right outline-none font-mono text-[9px]" value={payload.revenue_totalAnnual} onChange={(e) => setPayload({...payload, revenue_totalAnnual: e.target.value})} />
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                            <label className="text-slate-300 font-bold truncate pr-2">ftes_current</label>
                            <input type="text" className="w-16 shrink-0 bg-[#0f172a] border border-[#334155] rounded px-1.5 py-1 text-white text-right outline-none font-mono text-[9px]" value={payload.ftes_current} onChange={(e) => setPayload({...payload, ftes_current: e.target.value})} />
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                            <label className="text-slate-300 font-bold truncate pr-2">busAge_yrs</label>
                            <input type="text" className="w-16 shrink-0 bg-[#0f172a] border border-[#334155] rounded px-1.5 py-1 text-white text-right outline-none font-mono text-[9px]" value={payload.busAge_yrs} onChange={(e) => setPayload({...payload, busAge_yrs: e.target.value})} />
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                            <label className="text-slate-300 font-bold truncate pr-2">industry_code</label>
                            <select className="w-16 shrink-0 bg-[#0f172a] border border-[#334155] rounded px-1.5 py-1 text-white text-right outline-none text-[9px]" value={payload.industry_code} onChange={(e) => setPayload({...payload, industry_code: e.target.value})}>
                                <option value="Manufacturing">MFG</option>
                                <option value="Retail">RET</option>
                            </select>
                        </div>
                    </div>

                    <button className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-bold py-1.5 rounded text-[10px] transition-colors border border-blue-500 shadow-md shadow-blue-500/20">
                        Execute Trace
                    </button>
                </div>

                {/* Score Breakdown Area */}
                <div className="flex-[2] flex flex-col justify-center border-r border-[#334155] pr-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-[#334155] pb-1">Mathematical Breakdown</h4>
                    <div className="space-y-1">
                        {computedResults.modules.map(mod => (
                            <div key={mod.name} className="flex justify-between items-center py-1.5 border-b border-[#334155]/50 last:border-0">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2.5 h-2.5 rounded-sm ${mod.color}`}></div>
                                    <span className="text-[10px] text-slate-300 font-semibold">{mod.name}</span>
                                </div>
                                <span className="text-[10px] font-mono text-white font-bold">{mod.score}</span>
                            </div>
                        ))}
                    </div>

                    {/* Explainer Block */}
                    <div className="mt-3 bg-[#0f172a] border border-[#334155] p-2 rounded text-[9px] text-slate-400 flex flex-col gap-1.5 shadow-inner">
                        <div className="flex items-center gap-1.5 text-blue-400 font-bold border-b border-[#334155] pb-1">
                            <GitCommit size={10} /> Explaining: {computedResults.traceHit.featureName}
                        </div>
                        <span className="leading-tight">Feature mapped payload to <span className="text-slate-200">[{computedResults.traceHit.matchedBucket}]</span> triggering Rule <span className="text-slate-200 font-mono">{computedResults.traceHit.ruleId}</span> (PT: +{computedResults.traceHit.scoreHit}).</span>
                        <div className="flex gap-2 text-emerald-400/80 font-mono mt-1 pt-1 border-t border-[#334155]/50">
                            <span>n={computedResults.traceHit.sampleSize}</span> | <span>Conf: {computedResults.traceHit.confidence}%</span>
                        </div>
                    </div>
                </div>

                {/* Decision Zone Area */}
                <div className="flex-[2] flex flex-col items-center justify-center pl-2 relative">
                    {/* Glowing effect matched to decision */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-3xl opacity-20 pointer-events-none rounded-full ${matchingBand.bg}`}></div>

                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 z-10">Global Score Cut-Off</span>
                    <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-3 z-10 ${matchingBand.color.replace('text-', 'border-')}`}>
                        <span className={`text-4xl font-bold ${matchingBand.color}`}>{computedResults.totalScore}</span>
                    </div>
                    
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 z-10">Final Decision</span>
                    <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded font-bold text-xs shadow-md border z-10 ${matchingBand.bg} ${matchingBand.color} ${matchingBand.color.replace('text-', 'border-')}/30`}>
                        {computedResults.totalScore >= 65 ? <ShieldCheck size={14}/> : <ShieldAlert size={14}/>}
                        {matchingBand.label}
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default SimulationPanel;
