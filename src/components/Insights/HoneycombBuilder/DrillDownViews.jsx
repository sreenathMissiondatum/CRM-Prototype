import React from 'react';
import { Activity, Plus, Layers, Hexagon, ChevronRight, Check, Key } from 'lucide-react';

const DrillDownViews = ({ viewMode, data, onUpdate, selectedFeatureId, onSelectFeature, featureData, selectedAttributeId, onSelectAttribute, onUpdateFeature }) => {
    
    if (!data && viewMode !== 'attribute') {
        return (
            <div className="bg-white border border-slate-200 rounded-xl flex items-center justify-center p-5 shadow-lg h-full min-h-[450px]">
                <p className="text-sm font-medium text-slate-400 italic">Select an item to view details.</p>
            </div>
        );
    }

    if (viewMode === 'module') {
        const module = data;
        return (
            <div className="bg-white border border-slate-200 rounded-xl flex flex-col p-5 shadow-lg h-full min-h-[450px]">
                
                {/* Header Context */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4 text-[10px] font-bold text-slate-400">
                    <Hexagon size={12} className="text-slate-400" />
                    <span className="uppercase tracking-widest text-[#3b82f6]">2. Module Detail <span className="lowercase font-normal text-slate-400">(Drill Down)</span></span>
                </div>
                
                <div className="flex items-center text-xs text-slate-400 mb-4 font-bold">
                    Honeycomb <ChevronRight size={12} className="mx-1" /> <span className="text-slate-700">{module.moduleName}</span>
                </div>

                {/* Module Config Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 shrink-0 relative overflow-hidden">
                    {/* Confidence Indicator Background Glow */}
                    {module.confidence < 80 && <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 blur-xl rounded-full"></div>}
                    
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded text-teal-400">
                                    <Activity size={18} />
                                </div>
                                <h2 className="text-base font-bold text-slate-900 max-w-[150px] truncate" title={module.moduleName}>{module.moduleName}</h2>
                            </div>
                            <span className={`text-[9px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded border max-w-max ${module.confidence >= 90 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : module.confidence >= 80 ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                                Statistical Confidence: {module.confidence}%
                            </span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Weight</span>
                            <div className="flex items-center gap-1 border-b border-slate-200">
                                <input type="number" className="w-10 bg-transparent border-0 p-0 text-slate-900 font-bold text-sm text-right focus:ring-0" value={module.weight} onChange={(e) => onUpdate({ ...module, weight: parseInt(e.target.value) || 0 })} />
                                <span className="text-slate-400 font-bold text-xs">%</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 relative z-10">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 mb-1 block">Description</label>
                            <input className="w-full bg-transparent border-b border-slate-200 text-xs text-slate-700 pb-1 focus:ring-0 px-0 focus:border-blue-500 transition-colors" value={module.description} onChange={(e) => onUpdate({ ...module, description: e.target.value })} />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 mb-1 block">Score Aggregation Method</label>
                            <select className="w-full bg-white border border-slate-200 rounded text-xs text-slate-700 p-1.5 focus:ring-1 focus:ring-blue-500 outline-none" value={module.aggregationType} onChange={(e) => onUpdate({ ...module, aggregationType: e.target.value })}>
                                <option value="SUM">Sum</option>
                                <option value="AVERAGE">Average</option>
                                <option value="WEIGHTED_AVERAGE">Weighted Average</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Features List */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-2 shrink-0">
                        <h3 className="text-xs font-bold text-slate-900">Features ({module.features?.length || 0})</h3>
                        <button className="text-[10px] font-bold text-slate-700 border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2 py-1 rounded transition-colors flex items-center gap-1">
                            <Plus size={10} /> Add
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                        {module.features?.map(feat => (
                            <div 
                                key={feat.featureId} 
                                onClick={() => onSelectFeature(feat.featureId)}
                                className={`flex justify-between items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedFeatureId === feat.featureId ? 'bg-blue-600/10 border-blue-500/50' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className="flex items-center gap-3 w-3/4">
                                    <Layers size={14} className={selectedFeatureId === feat.featureId ? 'text-blue-400 shrink-0' : 'text-slate-400 shrink-0'} />
                                    <div className="flex flex-col overflow-hidden">
                                        <span className={`text-[11px] font-bold truncate ${selectedFeatureId === feat.featureId ? 'text-blue-400' : 'text-slate-700'}`}>{feat.featureName}</span>
                                        <span className="text-[9px] text-slate-400 font-bold">Weight: {feat.weight}%</span>
                                    </div>
                                </div>
                                <span className="text-lg font-bold text-emerald-400">{feat.score}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        );
    }

    if (viewMode === 'feature') {
        const feature = data;

        return (
            <div className="bg-white border border-slate-200 rounded-xl flex flex-col p-5 shadow-lg h-full min-h-[450px]">
                {/* Header Context */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4 text-[10px] font-bold text-slate-400">
                    <span className="uppercase tracking-widest text-[#3b82f6]">3. Feature Detail</span>
                </div>
                
                <div className="flex items-center text-xs text-slate-400 mb-4 font-bold overflow-hidden whitespace-nowrap">
                    Honeycomb <ChevronRight size={12} className="mx-1 shrink-0" /> 
                    <span className="truncate max-w-[80px] hover:max-w-none transition-all">{featureData?.moduleName || '...'}</span> 
                    <ChevronRight size={12} className="mx-1 shrink-0" /> 
                    <span className="text-slate-700 truncate max-w-[120px]">{feature.featureName}</span>
                </div>

                {/* Feature Config Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 shrink-0">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-base font-bold text-slate-900 max-w-[180px] truncate" title={feature.featureName}>{feature.featureName}</h2>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wider">Weight</span>
                            <div className="flex items-center gap-1 border-b border-slate-200">
                                <input type="number" className="w-10 bg-transparent border-0 p-0 text-slate-900 font-bold text-sm text-right focus:ring-0" value={feature.weight} onChange={(e) => onUpdate({ ...feature, weight: parseInt(e.target.value) || 0 })} />
                                <span className="text-slate-400 font-bold text-xs">%</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 mb-1 block">Description</label>
                        <input className="w-full bg-transparent border-slate-200 border rounded text-xs text-slate-700 p-2 focus:ring-1 focus:border-blue-500 outline-none" value={feature.description} onChange={(e) => onUpdate({ ...feature, description: e.target.value })} />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 border-b border-slate-200 mb-4 text-xs font-bold">
                    <button className="text-blue-400 border-b-2 border-blue-400 pb-2">Attributes</button>
                    <button className="text-slate-400 pb-2 hover:text-slate-700">Rules & Insights</button>
                    <button className="text-slate-400 pb-2 hover:text-slate-700">Settings</button>
                </div>

                {/* Attributes List */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-2 shrink-0">
                        <h3 className="text-[10px] font-bold text-slate-900 uppercase tracking-wider">Engineered Attributes ({feature.attributes?.length || 0})</h3>
                        <button className="text-[10px] font-bold text-white border border-blue-500 shadow-sm shadow-blue-500/20 bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded transition-colors flex items-center gap-1">
                            + Add Attribute
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
                        {feature.attributes?.map((v) => (
                            <div 
                                key={v.id} 
                                onClick={() => onSelectAttribute(v.id)}
                                className={`flex justify-between items-center px-3 py-2.5 rounded-lg border cursor-pointer transition-colors ${selectedAttributeId === v.id ? 'bg-white border-slate-400' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className="flex items-center gap-2 overflow-hidden w-2/3">
                                    <span className="text-[8px] w-4 h-4 shrink-0 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 font-mono">fx</span>
                                    <span className="text-xs font-bold text-slate-700 leading-none truncate">{v.name}</span>
                                </div>
                                <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded ${v.type === 'Derived' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : 'bg-white border-slate-200 text-slate-400'}`}>{v.type}</span>
                                <ChevronRight size={14} className={selectedAttributeId === v.id ? 'text-blue-400' : 'text-slate-300'} />
                            </div>
                        ))}
                        
                        {/* Aux Inputs */}
                        <div className="mt-2">
                            <h3 className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Auxiliary Indicators</h3>
                            {feature.auxiliaryInputs?.map((a) => (
                                <div key={a.id} className="flex justify-between items-center px-3 py-2.5 rounded-lg border bg-slate-50 border-slate-200 opacity-70 mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-slate-400 font-mono">i</span>
                                        <span className="text-xs font-bold text-slate-700 leading-none">{a.name}</span>
                                    </div>
                                    <span className="text-[9px] font-bold bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-400">{a.type}</span>
                                    <ChevronRight size={14} className="text-slate-300" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        );
    }

    if (viewMode === 'attribute') {
        const attribute = data;
        
        if (!attribute) {
            return (
                <div className="bg-white border border-slate-200 rounded-xl flex items-center justify-center p-5 shadow-lg h-full min-h-[450px]">
                    <p className="text-sm font-medium text-slate-400 italic">Select an attribute</p>
                </div>
            );
        }

        return (
            <div className="bg-white border border-slate-200 rounded-xl flex flex-col p-5 shadow-lg h-full min-h-[450px]">
                {/* Header Context */}
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-4 text-[10px] font-bold text-slate-400">
                    <span className="uppercase tracking-widest text-[#3b82f6]">4. Attribute Configuration <span className="lowercase font-normal text-slate-400">(Bins)</span></span>
                </div>

                <div className="flex items-center text-[10px] text-slate-400 mb-4 font-bold overflow-hidden whitespace-nowrap">
                    ... <ChevronRight size={10} className="mx-1 shrink-0" />
                    <span className="truncate max-w-[80px] hover:max-w-none transition-all">{featureData?.featureName || '...'}</span> 
                    <ChevronRight size={10} className="mx-1 shrink-0" /> 
                    <span className="text-slate-700 tracking-tight truncate max-w-[120px]">{attribute.name}</span>
                </div>

                {/* Info Block */}
                <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900 mb-1 truncate" title={attribute.name}>{attribute.name}</h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold">
                        <span className="text-slate-400">MAPPED VAR:</span>
                        <span className="text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 rounded">{attribute.sourceVariable}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Compute Type</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 p-1.5 outline-none" value={attribute.type} readOnly>
                            <option value="Direct">Direct Mapping</option>
                            <option value="Derived">Derived Script</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Bin Format</label>
                        <select className="w-full bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 p-1.5 outline-none" value={attribute.format} readOnly>
                            <option value="Categorical_Band">Categorical Band</option>
                            <option value="Continuous">Continuous Score</option>
                        </select>
                    </div>
                </div>

                {/* Bins Table */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-2 shrink-0">
                        <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">Segmentation Bins</h3>
                        <button className="text-[10px] font-bold text-white border border-blue-500 shadow-sm shadow-blue-500/20 bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded transition-colors flex items-center gap-1">
                            + Add Bin
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar rounded border border-slate-200 bg-slate-50">
                        <table className="w-full text-left">
                            <thead className="bg-white border-b border-slate-200 text-[9px] font-bold text-slate-400 uppercase">
                                <tr>
                                    <th className="py-2 px-3">Label</th>
                                    <th className="py-2 px-3">Min</th>
                                    <th className="py-2 px-3">Max</th>
                                    <th className="py-2 px-2 text-center" title="Inclusive">[ ]</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs text-slate-700">
                                {attribute.bins?.map((b, i) => (
                                    <tr key={i} className="border-b border-slate-200 last:border-0 hover:bg-white transition-colors">
                                        <td className="py-2 px-3 font-semibold text-[11px]">{b.label}</td>
                                        <td className="py-2 px-3 font-mono text-[10px]">{b.min}</td>
                                        <td className="py-2 px-3 font-mono text-[10px]">{b.max === 9999999 || b.max === 999 || b.max === 99 ? '+\u221E' : b.max}</td>
                                        <td className="py-2 px-2 text-center">
                                            <div className={`w-3 h-3 mx-auto rounded flex items-center justify-center ${b.inclusive ? 'bg-blue-600 text-white' : 'border border-slate-300'}`}>
                                                {b.inclusive && <Check size={8} strokeWidth={3} />}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        );
    }

    return null;
};

export default DrillDownViews;
