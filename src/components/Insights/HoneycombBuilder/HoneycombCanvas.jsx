import React from 'react';
import { Plus, Settings2, PlayCircle, ShieldCheck, AlertTriangle } from 'lucide-react';

const HoneycombCanvas = ({ framework, selectedModuleId, onSelectModule }) => {
    
    return (
        <div className="bg-white border border-slate-200 rounded-xl flex flex-col p-5 shadow-lg w-full relative overflow-hidden">
            {/* Context Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4 mb-6 relative z-10 w-full">
                <div>
                    <h2 className="text-[13px] font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
                        1. Honeycomb Canvas <span className="text-slate-400 font-normal lowercase">(Intelligence Overview)</span>
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 rounded text-xs font-bold transition-colors">
                        <PlayCircle size={14} /> Preview Decision
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-slate-50 hover:bg-white text-slate-700 rounded text-xs font-bold transition-colors">
                        <Settings2 size={14} /> Settings
                    </button>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold shadow-md shadow-blue-500/20 border border-blue-500 transition-colors">
                        <Plus size={14} /> Add Module
                    </button>
                </div>
            </div>

            {/* Framework Info & Decision Bands Summary */}
            <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex">
                    <div className="flex flex-col mr-6 shrink-0 mt-1">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg mx-auto">
                            M
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-wide">{framework.frameworkName}</h1>
                        <p className="text-sm text-slate-400 font-medium">Underwriting Engine • v{framework.version}</p>
                    </div>
                </div>
                
                {/* Decision Cut-Off Band Legend */}
                <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-2 bg-slate-50">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-2 self-center block pt-0.5">Cut-Offs</span>
                    {framework.decisionBands?.map((band, idx) => (
                        <div key={idx} className={`flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded ${band.bg} ${band.color} border border-slate-200`}>
                            {band.max >= 65 ? <ShieldCheck size={12}/> : <AlertTriangle size={12}/>}
                            {band.label} ({band.min}-{band.max})
                        </div>
                    ))}
                </div>
            </div>

            {/* Hexagon Grid Area */}
            <div className="flex items-center gap-6 pb-4 relative z-10 overflow-x-auto min-h-[220px] custom-scrollbar pl-12 -ml-4">
                
                {framework.modules.map((mod, i) => {
                    const isSelected = selectedModuleId === mod.moduleId;
                    // Hex points
                    const points = "30 5, 70 5, 95 50, 70 95, 30 95, 5 50";
                    
                    return (
                        <div 
                            key={mod.moduleId}
                            onClick={() => onSelectModule(mod.moduleId)}
                            className="group relative cursor-pointer flex flex-col items-center shrink-0 w-[140px]"
                            style={{ 
                                marginTop: i % 2 === 1 ? '50px' : '0px', 
                                marginLeft: i > 0 ? '-10px' : '0px'
                            }}
                        >
                            {/* Confidence Warning Overlays */}
                            {mod.confidence < 80 && (
                                <div className="absolute top-2 right-2 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center z-20 shadow-[0_0_10px_rgba(245,158,11,0.8)]" title="Low statistical confidence layer">
                                    <AlertTriangle size={10} className="text-amber-900" />
                                </div>
                            )}

                            {/* SVG Container */}
                            <svg className="w-full h-[160px] drop-shadow-md group-hover:drop-shadow-xl transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id={`grad-${mod.moduleId}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor={isSelected ? '#e2e8f0' : '#ffffff'} />
                                        <stop offset="100%" stopColor={isSelected ? '#f1f5f9' : '#f8fafc'} />
                                    </linearGradient>
                                </defs>
                                <polygon 
                                    points={points} 
                                    fill={`url(#grad-${mod.moduleId})`} 
                                    stroke={mod.colorTheme || '#cbd5e1'}
                                    strokeWidth={isSelected ? "3" : "2"}
                                    className={`transition-all duration-300 ${isSelected ? 'drop-shadow-[0_0_10px_rgba(0,0,0,0.1)]' : ''}`}
                                />
                            </svg>

                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 pointer-events-none transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 h-[160px]">
                                <h3 className={`font-bold text-sm leading-tight mb-2 px-2 max-w-[110px] ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {mod.moduleName}
                                </h3>
                                
                                <span className={`text-[9px] font-bold mb-1 border px-1.5 rounded-sm bg-slate-50 ${mod.confidence >= 90 ? 'text-emerald-400 border-emerald-500/30' : mod.confidence >= 80 ? 'text-blue-400 border-blue-500/30' : 'text-amber-400 border-amber-500/30'}`}>
                                    Conf: {mod.confidence}%
                                </span>

                                <span className="text-[9px] font-bold text-slate-400 mb-2 border-t border-slate-200 pt-1 w-16 text-center">
                                    Wt: {mod.weight}%
                                </span>
                                
                                <span className={`text-3xl font-bold ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                                    {mod.score}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {/* ADD MODULE HEXAGON */}
                <div 
                    className="group relative cursor-pointer flex flex-col items-center shrink-0 w-[140px] opacity-60 hover:opacity-100 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                    style={{ 
                        marginTop: framework.modules.length % 2 === 1 ? '50px' : '0px', 
                        marginLeft: '-10px'
                    }}
                >
                    <svg className="w-full h-[160px] drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300" viewBox="0 0 100 100">
                        <polygon 
                            points="30 5, 70 5, 95 50, 70 95, 30 95, 5 50" 
                            fill="transparent" 
                            stroke="#cbd5e1" 
                            strokeWidth="2"
                            strokeDasharray="4,4"
                            className="group-hover:stroke-blue-400 group-hover:fill-slate-50 transition-colors"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 z-10 pointer-events-none h-[160px] transition-all duration-300 group-hover:text-blue-500">
                        <span className="text-sm font-bold text-slate-400 group-hover:text-blue-500 leading-tight transition-colors">+ Add<br/>Module</span>
                    </div>
                </div>

            </div>

            {/* Bottom Legend */}
            <div className="mt-8 flex items-center gap-4 text-xs font-bold text-slate-400 relative z-10">
                <span className="text-[10px] uppercase tracking-widest">Base Legend:</span>
                <div className="flex gap-4 text-[10px]">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> &gt; 80 (Strong)</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-teal-500"></div> &gt; 60 (Good)</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> &gt; 40 (Fair)</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500"></div> &gt; 20 (Weak)</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-500"></div> 0-19 (Very Weak)</span>
                </div>
            </div>
            
        </div>
    );
};

export default HoneycombCanvas;
