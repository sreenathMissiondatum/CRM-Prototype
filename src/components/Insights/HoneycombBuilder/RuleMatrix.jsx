import React, { useState, useMemo } from 'react';
import { LayoutGrid, AlertTriangle, Lightbulb, TrendingUp, Users, List, Grid, Layers, ExternalLink } from 'lucide-react';

const RuleMatrix = ({ feature, onUpdateFeature }) => {
    const { attributes = [], rules = [] } = feature || {};
    const [selectedCell, setSelectedCell] = useState(null);
    const [projectionAttributeId, setProjectionAttributeId] = useState(null);
    const [projectionBinId, setProjectionBinId] = useState(null);

    // Dynamic UI Limits
    const isOverLimit = attributes.length > 4;
    const isComplex = attributes.length >= 3;

    // View Modes
    const getActiveMode = () => {
        if (attributes.length === 0) return 'EMPTY';
        if (attributes.length === 1) return 'LIST';
        if (attributes.length === 2 && !projectionAttributeId) return 'MATRIX';
        return projectionAttributeId ? 'MATRIX_PROJECTION' : 'RULE_CLASS';
    };

    const activeMode = getActiveMode();

    // Helpers
    const getRuleForCombination = (conditions) => {
        if (!rules) return null;
        return rules.find(r => Object.keys(conditions).every(k => r.conditions[k] === conditions[k]));
    };

    const updateScoreForCombination = (conditions, valStr) => {
        let val = parseFloat(valStr);
        if (isNaN(val)) val = '';

        const newRules = [...rules];
        const index = newRules.findIndex(r => Object.keys(conditions).every(k => r.conditions[k] === conditions[k]));
        
        if (index >= 0) {
            newRules[index] = { ...newRules[index], propensityScore: val };
        } else {
            newRules.push({
                ruleId: `R-MANUAL-${index > 0 ? index : newRules.length}`, 
                conditions,
                propensityScore: val,
                modelSuggestedScore: val ? Math.round(val * 1.1 * 10) / 10 : null,
                sampleCount: 10,
                goodBadRatio: '0.40',
                confidenceFlag: 'medium'
            });
        }
        onUpdateFeature({ ...feature, rules: newRules });
    };

    const autoGenerateCombinations = () => {
        if (!attributes || attributes.length === 0) return;

        // Recursive cartesian product logic
        const cartesian = (arrays) => arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
        const binArrays = attributes.map(attr => attr.bins.map(b => ({ [attr.id]: b.id })));
        
        let allCombos = [];
        if (attributes.length === 1) {
            allCombos = binArrays[0];
        } else {
            const rawCombos = cartesian(binArrays);
            allCombos = rawCombos.map(rc => Object.assign({}, ...rc));
        }

        const newRules = [...rules];
        allCombos.forEach((combo, comboIdx) => {
            const exists = newRules.find(r => Object.keys(combo).every(k => r.conditions[k] === combo[k]));
            if (!exists) {
                newRules.push({
                    ruleId: `R-AUTO-${newRules.length + comboIdx}`,
                    conditions: combo,
                    propensityScore: '',
                    modelSuggestedScore: ((comboIdx % 10) + 1).toFixed(1),
                    sampleCount: (comboIdx * 3) + 12,
                    goodBadRatio: '0.50',
                    confidenceFlag: 'medium'
                });
            }
        });
        
        // Ensure default fallback rule exists
        if (!newRules.find(r => r.ruleId === 'DEFAULT_FALLBACK')) {
            newRules.push({
                ruleId: 'DEFAULT_FALLBACK',
                conditions: { IS_FALLBACK: true },
                propensityScore: 5.0,
                modelSuggestedScore: 5.0,
                sampleCount: 1000,
                goodBadRatio: '0.45',
                confidenceFlag: 'high',
                isFallback: true
            });
        }

        onUpdateFeature({ ...feature, rules: newRules });
    };

    const getHeatmapColor = (score) => {
        if (score === '' || score === undefined || score === null) return 'bg-white text-slate-400';
        const num = parseFloat(score);
        if (num <= 1.0) return 'bg-[#0f3b39] text-[#4ade80]';
        if (num <= 2.0) return 'bg-[#14532d] text-[#22c55e]';
        if (num <= 3.0) return 'bg-[#4d7c0f] text-[#a3e635]';
        if (num <= 4.0) return 'bg-[#ca8a04] text-slate-900';
        if (num <= 5.0) return 'bg-[#b45309] text-slate-900';
        if (num <= 7.0) return 'bg-[#9a3412] text-rose-200';
        return 'bg-[#7f1d1d] text-rose-400';
    };


    // --------------------------------------------------------------------------------
    // RENDERERS
    // --------------------------------------------------------------------------------

    const renderListMode = () => {
        const colAttr = attributes[0];
        return (
            <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-200 rounded bg-slate-50 p-4">
                <table className="w-full text-left table-auto">
                    <thead>
                        <tr className="border-b border-slate-200 text-[10px] text-slate-400 uppercase tracking-widest">
                            <th className="pb-2">{colAttr.name}</th>
                            <th className="pb-2 text-center w-32">Configured Score</th>
                            <th className="pb-2 text-center w-24">Suggested</th>
                            <th className="pb-2 text-center w-16">Samples</th>
                        </tr>
                    </thead>
                    <tbody>
                        {colAttr.bins.map(cb => {
                            const conds = { [colAttr.id]: cb.id };
                            const rule = getRuleForCombination(conds);
                            return (
                                <tr key={cb.id} className="border-b border-slate-200/50 last:border-0 cursor-pointer hover:bg-white transition-colors" onClick={() => setSelectedCell(conds)}>
                                    <td className="py-3 text-xs font-bold text-slate-700">{cb.label} <span className="text-[10px] text-slate-400 font-normal ml-2">({cb.min} - {cb.max})</span></td>
                                    <td className="py-2 text-center">
                                        <input 
                                            type="number" step="0.1"
                                            value={rule?.propensityScore ?? ''}
                                            onChange={e => updateScoreForCombination(conds, e.target.value)}
                                            className={`w-20 text-center text-xs font-bold py-1 rounded border-0 outline-none ring-1 ring-inset ring-[#334155] focus:ring-blue-500 ${getHeatmapColor(rule?.propensityScore)}`}
                                            placeholder="-"
                                        />
                                    </td>
                                    <td className="py-3 text-center text-xs font-bold text-blue-400">{rule?.modelSuggestedScore ?? '-'}</td>
                                    <td className="py-3 text-center text-[10px] font-mono text-slate-400">{rule?.sampleCount ?? '-'}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderMatrixMode = (baseConstraints = {}) => {
        // Find which attributes are the active axes (those NOT in projection constraints)
        const activeAxes = attributes.filter(a => !baseConstraints[a.id]);
        
        if (activeAxes.length === 0) return null;
        
        const colAttr = activeAxes[0];
        const rowAttr = activeAxes.length > 1 ? activeAxes[1] : null;

        return (
            <div className="border border-slate-200 rounded-lg shadow-sm bg-slate-50 overflow-hidden flex-1 flex flex-col">
                <table className="w-full text-left border-collapse table-fixed h-full min-h-[250px]">
                    <thead>
                        <tr>
                            <th className="p-3 bg-white border-b border-r border-slate-200 text-center w-[160px]">
                                {rowAttr ? (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                                        <span className="truncate">{rowAttr.name}</span>
                                        <span className="text-[#334155] font-normal">\\</span>
                                        <span className="truncate">{colAttr.name}</span>
                                    </div>
                                ) : (
                                    <span className="text-[10px] font-bold text-slate-400">{colAttr.name}</span>
                                )}
                            </th>
                            {colAttr.bins.map(cb => (
                                <th key={cb.id} className="p-2 bg-white border-b border-l border-slate-200 text-[10px] font-bold text-slate-400 text-center leading-tight">
                                    {cb.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {rowAttr ? (
                            rowAttr.bins.map(rb => (
                                <tr key={rb.id}>
                                    <td className="p-2 border-b border-r border-slate-200 bg-white text-[10px] font-bold text-slate-700 text-center leading-tight">
                                        {rb.label}
                                    </td>
                                    {colAttr.bins.map(cb => {
                                        const conds = { ...baseConstraints, [colAttr.id]: cb.id, [rowAttr.id]: rb.id };
                                        const rule = getRuleForCombination(conds);
                                        const score = rule ? rule.propensityScore : '';
                                        const colorClass = getHeatmapColor(score);
                                        
                                        // Visual Warning Logic
                                        const isLowSample = rule && rule.confidenceFlag === 'low';
                                        const hasDeviation = rule && rule.modelSuggestedScore && Math.abs(rule.propensityScore - rule.modelSuggestedScore) >= 1.0;

                                        return (
                                            <td key={cb.id} className="p-0 border-b border-l border-slate-200 relative group cursor-pointer" onClick={() => setSelectedCell(conds)}>
                                                {/* Cell Overlays */}
                                                {(isLowSample || hasDeviation) && (
                                                    <div className="absolute top-1 left-1 flex gap-0.5 pointer-events-none">
                                                        {isLowSample && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_4px_rgba(251,191,36,0.8)]" title="Low Sample Size"></div>}
                                                        {hasDeviation && <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_4px_rgba(96,165,250,0.8)]" title="High deviation from ML suggestion"></div>}
                                                    </div>
                                                )}

                                                <input 
                                                    type="number"
                                                    step="0.1"
                                                    value={score}
                                                    onChange={e => updateScoreForCombination(conds, e.target.value)}
                                                    className={`w-full h-10 lg:h-[50px] text-center text-[13px] font-bold focus:ring-3 focus:ring-inset focus:ring-white border-0 transition-colors ${colorClass} ${JSON.stringify(selectedCell) === JSON.stringify(conds) ? 'ring-inset ring-2 ring-blue-500' : ''}`}
                                                    placeholder="-"
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={colAttr.bins.length + 1} className="text-center text-slate-400 text-xs italic py-8">
                                    Unexpected mode routing error. 
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    const renderClassMode = () => {
        // Table mode for dense configurations (3 or 4 dimensions)
        return (
            <div className="flex-1 overflow-y-auto custom-scrollbar border border-slate-200 rounded bg-slate-50">
                <table className="w-full text-left table-fixed">
                    <thead className="bg-white sticky top-0 z-10 border-b border-slate-200">
                        <tr className="text-[9px] text-slate-400 uppercase tracking-widest">
                            <th className="py-3 px-3 w-28">Rule ID</th>
                            <th className="py-3 px-3">Combinations (Conditions)</th>
                            <th className="py-3 px-3 w-24 text-center">Score</th>
                            <th className="py-3 px-3 w-[70px] text-right">Samples</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs">
                        {rules.map(rule => {
                            const isFallback = rule.isFallback;
                            const isActive = JSON.stringify(selectedCell) === JSON.stringify(rule.conditions);

                            return (
                                <tr key={rule.ruleId} 
                                    className={`border-b border-slate-200/50 last:border-0 hover:bg-white/70 cursor-pointer transition-colors ${isActive ? 'bg-white' : ''} ${isFallback ? 'bg-white/30' : ''}`}
                                    onClick={() => setSelectedCell(rule.conditions)}
                                >
                                    <td className="py-2.5 px-3">
                                        <div className="flex flex-col gap-1">
                                            <span className={`font-mono text-[9px] ${isFallback ? 'text-amber-400 font-bold' : 'text-slate-400'} leading-none`}>{rule.ruleId}</span>
                                            {rule.confidenceFlag === 'low' && <span className="text-[8px] uppercase font-bold text-amber-500 line-clamp-1 block">Low Conf</span>}
                                        </div>
                                    </td>
                                    <td className="py-2.5 px-3">
                                        {isFallback ? (
                                            <span className="text-[10px] text-amber-500/80 italic">DEFAULT CATCH-ALL (Unmapped Payloads)</span>
                                        ) : (
                                            <div className="flex flex-wrap gap-1">
                                                {Object.entries(rule.conditions).map(([attrId, binId]) => {
                                                    const attr = attributes.find(a => a.id === attrId);
                                                    if (!attr) return null;
                                                    const bin = attr.bins.find(b => b.id === binId);
                                                    return (
                                                        <span key={attrId} className="px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-[9px] text-slate-700" title={`${attr.name}: ${bin?.label}`}>
                                                            {attr.name.substring(0,6)}.. = {bin?.label}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-2.5 px-3 text-center">
                                        <input 
                                            type="number" step="0.1"
                                            value={rule.propensityScore ?? ''}
                                            onChange={e => updateScoreForCombination(rule.conditions, e.target.value)}
                                            className={`w-full text-center text-xs font-bold py-1.5 rounded border-0 outline-none ring-1 ring-inset ring-[#334155] focus:ring-blue-500 ${getHeatmapColor(rule.propensityScore)}`}
                                            placeholder="-"
                                        />
                                    </td>
                                    <td className="py-2.5 px-3 text-right">
                                        <span className={`text-[10px] font-mono ${rule.sampleCount < 10 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>{rule.sampleCount}</span>
                                    </td>
                                </tr>
                            );
                        })}

                        {rules.length === 0 && (
                            <tr>
                                <td colSpan="4" className="py-10 text-center text-slate-400 italic text-sm">
                                    No rules defined for these parameters. Run "Generate All" to instantiate matrix logic.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    };

    // --------------------------------------------------------------------------------
    // MAIN WRAPPER
    // --------------------------------------------------------------------------------

    if (activeMode === 'EMPTY') {
        return (
            <div className="bg-white border border-slate-200 rounded-xl flex items-center justify-center p-5 shadow-lg h-[400px]">
                <p className="text-sm font-medium text-slate-400 italic">Select a feature to configure Intelligence Engine rules.</p>
            </div>
        );
    }

    if (isOverLimit) {
        return (
            <div className="bg-white border border-rose-500/50 rounded-xl flex items-center justify-center p-5 shadow-lg h-[400px]">
                <div className="text-center max-w-md">
                    <AlertTriangle size={32} className="text-rose-500 mx-auto mb-3" />
                    <h3 className="text-sm font-bold text-slate-900 mb-2">Architectural Guardrail Errror</h3>
                    <p className="text-xs text-rose-300">Feature exceeds maximum dimensionality bounds (4 Attributes max). Combinatorial explosion will degrade performance. Split this logic into distinct modular features.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-lg flex flex-col w-full h-[550px]">
            {/* Context Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5 shrink-0">
                <div className="flex items-center gap-4">
                    <div>
                        <h2 className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest flex items-center gap-2 mb-1">
                            5. Rules & Scores <span className="text-slate-400 font-normal lowercase">(Dynamic Engine)</span>
                        </h2>
                        <div className="flex items-center text-[11px] text-slate-400 font-bold overflow-hidden">
                            ... <span className="mx-1 shrink-0">/</span> {feature.featureName} <span className="mx-1 shrink-0">/</span> <span className="text-slate-700">Statistical Matrix</span>
                        </div>
                    </div>
                    {isComplex && (
                        <span className="bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Layers size={10}/> High Dimensionality Mode
                        </span>
                    )}
                </div>
                
                <div className="flex items-center gap-3">
                    <button 
                        onClick={autoGenerateCombinations}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition-colors shadow"
                    >
                        <LayoutGrid size={12} /> Generate All Combinations
                    </button>
                </div>
            </div>

            {/* Projection Selector (For Complex features) */}
            {isComplex && (
                <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center gap-4 shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1"><ExternalLink size={12}/> Projection Target</span>
                    <select 
                        className="bg-white border border-slate-200 rounded text-xs text-slate-700 px-3 py-1.5 outline-none font-bold"
                        value={projectionAttributeId || ''}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val) {
                                setProjectionAttributeId(val);
                                setProjectionBinId(attributes.find(a => a.id === val)?.bins[0]?.id);
                            } else {
                                setProjectionAttributeId(null);
                                setProjectionBinId(null);
                            }
                        }}
                    >
                        <option value="">-- Rule Class View (All) --</option>
                        {attributes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>

                    {projectionAttributeId && (
                        <>
                            <span className="text-slate-400 font-bold">=</span>
                            <select 
                                className="bg-white border border-slate-200 rounded text-xs text-blue-400 px-3 py-1.5 outline-none font-bold"
                                value={projectionBinId || ''}
                                onChange={(e) => setProjectionBinId(e.target.value)}
                            >
                                {attributes.find(a => a.id === projectionAttributeId)?.bins.map(b => (
                                    <option key={b.id} value={b.id}>{b.label}</option>
                                ))}
                            </select>
                        </>
                    )}
                </div>
            )}

            {/* Matrix Body Content Area */}
            <div className="flex-1 p-5 flex gap-4 lg:gap-6 overflow-hidden">
                
                {/* Active Attributes Legend */}
                <div className="w-[180px] shrink-0 flex flex-col gap-4">
                    <div className="flex border border-slate-200 rounded-md overflow-hidden text-[10px] font-bold text-slate-700 bg-slate-50">
                        <div className={`flex-1 py-1.5 text-center flex items-center justify-center gap-1 ${activeMode === 'RULE_CLASS' ? 'bg-white text-blue-400 border-b-2 border-blue-500' : ''}`}>
                            <List size={12}/> Rule Class
                        </div>
                        <div className={`flex-1 py-1.5 text-center flex items-center justify-center gap-1 ${(activeMode === 'MATRIX' || activeMode === 'MATRIX_PROJECTION' || activeMode === 'LIST') ? 'bg-white text-blue-400 border-b-2 border-blue-500' : ''}`}>
                            <Grid size={12}/> Matrix
                        </div>
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-200 rounded p-3 overflow-y-auto custom-scrollbar">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-200 pb-2">Active Attributes ({attributes.length})</h4>
                        <div className="space-y-3 mb-6">
                            {attributes.map((attr, idx) => (
                                <div key={attr.id} className={`flex flex-col text-[10px] p-1.5 rounded border ${projectionAttributeId === attr.id ? 'bg-blue-500/10 border-blue-500/30' : 'border-transparent'}`}>
                                    <span className="text-blue-400 font-bold mb-0.5">A{idx+1} [ {attr.sourceVariable} ]</span>
                                    <span className="text-slate-700 truncate" title={attr.name}>{attr.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* THE CORE ENGINE ROUTER */}
                <div className="flex-[2_2_0%] flex flex-col min-w-0">
                    {activeMode === 'LIST' && renderListMode()}
                    {activeMode === 'MATRIX' && renderMatrixMode()}
                    {activeMode === 'MATRIX_PROJECTION' && renderMatrixMode({ [projectionAttributeId]: projectionBinId })}
                    {activeMode === 'RULE_CLASS' && renderClassMode()}

                    {/* Gradient Legend for Matrix modes */}
                    {(activeMode === 'MATRIX' || activeMode === 'MATRIX_PROJECTION') && (
                        <div className="mt-4 flex items-center gap-3 text-[10px] font-bold shrink-0">
                            <span className="text-slate-400 hidden lg:block">Propensity Scale: 0 → 10</span>
                            <div className="flex-1 h-2 rounded-full overflow-hidden flex drop-shadow-md">
                                <div className="flex-1 bg-[#14532d]"></div>
                                <div className="flex-1 bg-[#4d7c0f]"></div>
                                <div className="flex-1 bg-[#ca8a04]"></div>
                                <div className="flex-1 bg-[#b45309]"></div>
                                <div className="flex-1 bg-[#9a3412]"></div>
                                <div className="flex-1 bg-[#7f1d1d]"></div>
                            </div>
                        </div>
                    )}
                </div>

                {/* DECISION INTELLIGENCE INSPECTOR */}
                <div className="w-[260px] shrink-0 bg-slate-50 border border-slate-200 rounded p-4 flex flex-col relative overflow-hidden">
                    <div className="absolute top-[-50px] right-[-50px] w-32 h-32 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
                    <h4 className="text-[10px] font-bold text-[#3b82f6] uppercase tracking-widest border-b border-slate-200 pb-2 mb-3 flex items-center gap-2">
                        <Lightbulb size={12}/> Intelligence Context
                    </h4>
                    
                    {!selectedCell ? (
                        <div className="text-[10px] text-slate-400 italic mt-10 text-center px-4">
                            Click a combination in the engine to view the deep statistical context and model calibration details.
                        </div>
                    ) : (
                        <div className="flex flex-col h-full overflow-y-auto custom-scrollbar pr-1">
                            {/* Combination Data */}
                            <div className="space-y-2 text-[10px] bg-white p-3 rounded border border-slate-200 mb-4">
                                {selectedCell.IS_FALLBACK && (
                                    <span className="text-amber-500 font-bold block mb-1">CATCH-ALL DEFAULT RULE</span>
                                )}
                                {Object.entries(selectedCell).filter(([k]) => k !== 'IS_FALLBACK').map(([attrId, binId]) => {
                                    const aLayer = attributes.find(a => a.id === attrId);
                                    const bLayer = aLayer?.bins.find(b => b.id === binId);
                                    return (
                                        <div key={attrId} className="flex flex-col">
                                            <span className="text-slate-400 font-bold mb-0.5 uppercase tracking-wider text-[8px]">{aLayer?.name}:</span> 
                                            <span className="text-slate-700 font-mono text-[9px] bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 max-w-max">
                                                {bLayer?.label || 'ANY'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Rule Data (Requires computing fresh rule selection to handle generated rules that don't exist yet) */}
                            {(() => {
                                const activeRule = getRuleForCombination(selectedCell);
                                return (
                                    <div className="flex-1 mb-4 flex flex-col gap-4 relative z-10">
                                        <div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Statistical Validation</span>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="bg-white p-2 rounded border border-slate-200">
                                                    <span className="text-slate-400 text-[9px] block mb-1 flex items-center gap-1"><Users size={10}/> Samples (n)</span>
                                                    <span className={`text-lg font-bold ${activeRule?.confidenceFlag === 'low' ? 'text-amber-400' : 'text-slate-800'}`}>{activeRule ? activeRule.sampleCount : '-'}</span>
                                                </div>
                                                <div className="bg-white p-2 rounded border border-slate-200">
                                                    <span className="text-slate-400 text-[9px] block mb-1 flex items-center gap-1"><TrendingUp size={10}/> Good/Bad</span>
                                                    <span className="text-lg font-bold text-slate-800">{activeRule ? activeRule.goodBadRatio : '-'}</span>
                                                </div>
                                            </div>
                                            {activeRule?.confidenceFlag === 'low' && (
                                                <div className="mt-2 text-[8px] text-amber-500 bg-amber-500/10 px-2 py-1 rounded flex items-start gap-1 font-bold border border-amber-500/20">
                                                    <AlertTriangle size={10} className="shrink-0 mt-0.5" />
                                                    <span>Insufficient sample volume to guarantee statistical ground truth.</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Score Calibration</span>
                                            <div className="bg-white p-3 rounded border border-slate-200 flex flex-col gap-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-700">Model Suggestion</span>
                                                    <span className="text-sm font-bold text-blue-400">{activeRule ? activeRule.modelSuggestedScore : '-'}</span>
                                                </div>
                                                <div className="flex justify-between items-center pt-2 border-t border-slate-200 border-dashed">
                                                    <span className="text-[10px] font-bold text-slate-900">Configured Score</span>
                                                    <span className="text-lg font-bold text-emerald-400">{activeRule?.propensityScore !== undefined && activeRule.propensityScore !== '' ? activeRule.propensityScore : '0.0'}</span>
                                                </div>
                                            </div>
                                            {(activeRule && activeRule.propensityScore && Math.abs(activeRule.propensityScore - activeRule.modelSuggestedScore) >= 1.0) && (
                                                <div className="mt-2 text-[8px] text-blue-400 bg-blue-500/10 px-2 py-1 rounded font-bold border border-blue-500/20 text-center">
                                                    Manual override detects high deviation.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })()}

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default RuleMatrix;
