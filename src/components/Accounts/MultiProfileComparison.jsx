import React, { useState, useMemo } from 'react';
import { 
    X, TrendingUp, AlertCircle, Expand, 
    Shrink, Filter, Download, Plus, Minus,
    ArrowUpRight, ArrowDownRight, ArrowRightLeft,
    PieChart, AlertTriangle, HelpCircle, Activity 
} from 'lucide-react';

// === MOCK DATA GENERATOR FOR GRID ===
// To make the comparables look realistic and utilize the union logic requested.
const generateRawLedger = (profile, id) => {
    const isMock1 = id.includes('draft');
    const isMock2 = id.includes('active');
    
    // Using base revenue values from existing mocked profiles to scale raw lines
    const baseRev = profile.data.revenue || 1000000;
    const baseEbitda = profile.data.ebitda || 250000;
    
    return [
        { name: 'Core Product Sales', cat: 'Revenue', sub: 'Operating Revenue', val: baseRev * 0.70 },
        { name: 'Services Revenue', cat: 'Revenue', sub: 'Operating Revenue', val: baseRev * 0.25 },
        { name: isMock1 ? 'Other Income (Misc)' : null, cat: 'Revenue', sub: 'Other Revenue', val: isMock1 ? baseRev * 0.05 : 0 },
        { name: isMock2 ? 'Freight Income' : null, cat: 'Revenue', sub: 'Other Revenue', val: isMock2 ? baseRev * 0.05 : 0 },
        
        { name: 'Direct Labor', cat: 'COGS', sub: 'Labor', val: baseRev * 0.15 },
        { name: 'Raw Materials', cat: 'COGS', sub: 'Materials', val: baseRev * 0.18 },
        
        { name: 'Executive Salary', cat: 'OpEx', sub: 'Payroll', val: baseRev * 0.10 },
        { name: 'Sales Commissions', cat: 'OpEx', sub: 'Payroll', val: baseRev * 0.05 },
        { name: 'Office Rent - Main HQ', cat: 'OpEx', sub: 'Facilities', val: 50000 },
        { name: isMock1 ? 'Warehouse Rent' : 'Lease Expense (Warehouse)', cat: 'OpEx', sub: 'Facilities', val: 35000 },
        { name: 'Software Subs', cat: 'OpEx', sub: 'G&A', val: 12000 },
        { name: 'Legal & Professional', cat: 'OpEx', sub: 'G&A', val: 25000 },
        { name: 'Marketing & Ads', cat: 'OpEx', sub: 'Marketing', val: baseRev * 0.02 },
        { name: isMock1 ? 'Uncategorized Exp' : null, cat: 'OpEx', sub: 'Misc', val: isMock1 ? 15000 : 0 }
    ].filter(i => i.name !== null);
};

// === COMPONENT ===
const MultiProfileComparison = ({ selectedProfiles, onExit }) => {
    const [baselineId, setBaselineId] = useState(selectedProfiles[0].id);
    const [viewMode, setViewMode] = useState('PERCENT'); // PERCENT, ABSOLUTE, VAR_DOLLAR, VAR_PERCENT
    const [structureMode, setStructureMode] = useState('RAW'); // RAW, NORMALIZED
    const [collapsedNodes, setCollapsedNodes] = useState({});

    const toggleNode = (nodeId) => {
        setCollapsedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
    };

    // Derived baseline profile
    const baselineProfile = selectedProfiles.find(p => p.id === baselineId) || selectedProfiles[0];
    const compareProfiles = selectedProfiles.filter(p => p.id !== baselineId);

    // Build Union of Raw Lines aligned to profiles
    const gridData = useMemo(() => {
        const union = {};
        
        // 1. Build dictionary of all lines across profiles
        selectedProfiles.forEach(p => {
            const rawLines = generateRawLedger(p, p.id);
            rawLines.forEach(line => {
                const catKey = line.cat;
                const subKey = `${line.cat}|${line.sub}`;
                const rawKey = `${line.cat}|${line.sub}|${line.name}`;
                
                if (!union[catKey]) union[catKey] = { id: catKey, type: 'category', name: line.cat, subcategories: {}, profiles: {} };
                if (!union[catKey].subcategories[subKey]) union[catKey].subcategories[subKey] = { id: subKey, type: 'subcategory', name: line.sub, lines: {}, profiles: {} };
                if (!union[catKey].subcategories[subKey].lines[rawKey]) {
                    union[catKey].subcategories[subKey].lines[rawKey] = { id: rawKey, type: 'raw', name: line.name, cat: line.cat, sub: line.sub, profiles: {} };
                }
                
                // Assign value (0 if missing in others later)
                union[catKey].profiles[p.id] = (union[catKey].profiles[p.id] || 0) + line.val;
                union[catKey].subcategories[subKey].profiles[p.id] = (union[catKey].subcategories[subKey].profiles[p.id] || 0) + line.val;
                union[catKey].subcategories[subKey].lines[rawKey].profiles[p.id] = line.val;
            });
        });
        
        // 2. Fill empty slots with 0 and convert to sorted array
        const result = [];
        const cats = ['Revenue', 'COGS', 'OpEx']; // Forced sort order
        
        cats.forEach(catName => {
            const catObj = union[catName];
            if (!catObj) return;
            
            // Fill missing profiles
            selectedProfiles.forEach(p => { catObj.profiles[p.id] = catObj.profiles[p.id] || 0; });
            
            const subs = Object.values(catObj.subcategories).map(subObj => {
                selectedProfiles.forEach(p => { subObj.profiles[p.id] = subObj.profiles[p.id] || 0; });
                
                const lines = Object.values(subObj.lines).map(lineObj => {
                    selectedProfiles.forEach(p => { lineObj.profiles[p.id] = lineObj.profiles[p.id] || 0; });
                    return lineObj;
                }).sort((a,b) => b.profiles[baselineId] - a.profiles[baselineId]);
                
                subObj.children = lines;
                return subObj;
            }).sort((a,b) => b.profiles[baselineId] - a.profiles[baselineId]);
            
            catObj.children = subs;
            result.push(catObj);
        });
        
        return result;
    }, [selectedProfiles, baselineId]);

    // Formatters
    const formatValue = (val, mode, revVal) => {
        if (val === 0 || !val) return '—';
        if (mode === 'PERCENT' && revVal) {
            return (val / revVal * 100).toFixed(1) + '%';
        }
        if (mode === 'ABSOLUTE') {
            return '$' + Math.round(val).toLocaleString();
        }
        return Math.round(val).toLocaleString();
    };

    const formatVar = (val, baseVal, mode) => {
        const diff = val - baseVal;
        if (baseVal === 0 && val === 0) return '—';
        if (mode === 'VAR_DOLLAR') {
            return (diff > 0 ? '+' : '') + '$' + Math.round(diff).toLocaleString();
        }
        if (mode === 'VAR_PERCENT') {
            if (baseVal === 0) return 'N/M';
            const pct = (diff / baseVal) * 100;
            return (pct > 0 ? '+' : '') + pct.toFixed(1) + '%';
        }
        return '—';
    };

    const formatKpi = (val, isRatio = false) => {
        if (isRatio) return val.toFixed(2) + 'x';
        if (val >= 1000000) return (val/1000000).toFixed(2) + 'M';
        if (val >= 1000) return (val/1000).toFixed(0) + 'K';
        return val.toString();
    };

    const calcKpiDelta = (curr, base, isRatio) => {
        if (base === 0) return null;
        const diff = curr - base;
        const pct = (diff / base) * 100;
        return { diff, pct, direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat' };
    };

    // Render Row Function
    const renderRow = (node, level) => {
        // Hide raw lines if normalized struct mode
        if (structureMode === 'NORMALIZED' && node.type === 'raw') return null;
        
        const isCollapsed = collapsedNodes[node.id];
        
        const rowClass = 
            node.type === 'category' ? 'bg-slate-100 font-bold text-slate-900 border-b-2 border-white' :
            node.type === 'subcategory' ? 'bg-slate-50 font-semibold text-slate-800 border-b border-white' :
            'bg-white text-slate-600 border-b border-slate-50 hover:bg-blue-50/30';
            
        const indentClass = 
            node.type === 'category' ? 'pl-4' :
            node.type === 'subcategory' ? 'pl-8' :
            'pl-12';

        return (
            <React.Fragment key={node.id}>
                <tr className={`text-xs ${rowClass}`}>
                    <td className={`py-2 ${indentClass} sticky left-0 z-10 w-[300px] truncate max-w-[300px] shadow-[2px_0_4px_rgba(0,0,0,0.02)] ${node.type === 'category' ? 'bg-slate-100' : node.type === 'subcategory' ? 'bg-slate-50' : 'bg-white group-hover:bg-blue-50/30'}`}>
                        <div className="flex items-center gap-2">
                            {(node.type === 'category' || node.type === 'subcategory') && structureMode === 'RAW' ? (
                                <button onClick={() => toggleNode(node.id)} className="p-0.5 hover:bg-slate-200 rounded">
                                    {isCollapsed ? <Plus size={12} /> : <Minus size={12} />}
                                </button>
                            ) : (
                                <div className="w-3" />
                            )}
                            <span title={node.name}>{node.name}</span>
                            
                            {/* Flags */}
                            {node.type === 'raw' && node.name.includes('Misc') && (
                                <AlertTriangle size={12} className="text-amber-500" title="High Misc Usage" />
                            )}
                            {node.type === 'raw' && Object.values(node.profiles).some(v => v===0) && (
                                <HelpCircle size={12} className="text-rose-400" title="Missing in some profiles" />
                            )}
                        </div>
                    </td>
                    
                    {/* Baseline Profile Col */}
                    <td className="py-2 px-4 text-right font-mono bg-blue-50/20 border-r border-blue-100 min-w-[120px]">
                        {formatValue(node.profiles[baselineId], viewMode === 'VAR_DOLLAR' || viewMode === 'VAR_PERCENT' ? 'ABSOLUTE' : viewMode, 
                                     gridData[0]?.profiles[baselineId])}
                    </td>
                    
                    {/* Compare Profiles Cols */}
                    {compareProfiles.map(p => {
                        const val = node.profiles[p.id];
                        const baseVal = node.profiles[baselineId];
                        
                        let displayVal;
                        let colorClass = '';
                        
                        if (viewMode === 'VAR_DOLLAR' || viewMode === 'VAR_PERCENT') {
                            displayVal = formatVar(val, baseVal, viewMode);
                            if (val > baseVal && val > 0 && baseVal > 0) colorClass = node.cat === 'OpEx' || node.cat === 'COGS' ? 'text-rose-600' : 'text-emerald-600';
                            if (val < baseVal && val > 0 && baseVal > 0) colorClass = node.cat === 'OpEx' || node.cat === 'COGS' ? 'text-emerald-600' : 'text-rose-600';
                        } else {
                            displayVal = formatValue(val, viewMode, gridData[0]?.profiles[p.id]);
                        }
                        
                        return (
                            <td key={p.id} className={`py-2 px-4 text-right font-mono border-r border-slate-100 min-w-[120px] ${colorClass}`}>
                                {displayVal}
                            </td>
                        )
                    })}
                    
                    {/* Diff Metrics if > 2 profiles total */}
                    {selectedProfiles.length >= 3 && (
                        <>
                            <td className="py-2 px-4 text-right font-mono text-[10px] text-slate-400 bg-slate-50 border-r border-slate-100 min-w-[80px]">
                                {formatValue(Math.min(...Object.values(node.profiles).filter(v=>v>0)), 'ABSOLUTE', 1)}
                            </td>
                            <td className="py-2 px-4 text-right font-mono text-[10px] text-slate-400 bg-slate-50 min-w-[80px]">
                                {formatValue(Math.max(...Object.values(node.profiles)), 'ABSOLUTE', 1)}
                            </td>
                        </>
                    )}
                </tr>
                
                {/* Children render */}
                {!isCollapsed && node.children && node.children.map(child => renderRow(child, level + 1))}
            </React.Fragment>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#fafafa]">
            
            {/* --- TOP HEADER BAR --- */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-20">
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <Activity size={18} className="text-blue-600" />
                        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Multi-Profile Comparison</h2>
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ml-2">
                            {selectedProfiles.length} Profiles Selected
                        </span>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-md">
                        <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Baseline:</span>
                        <select 
                            className="bg-white border border-slate-200 text-xs font-bold text-slate-800 rounded px-2 py-1 outline-none drop-shadow-sm cursor-pointer"
                            value={baselineId}
                            onChange={(e) => setBaselineId(e.target.value)}
                        >
                            {selectedProfiles.map(p => <option key={p.id} value={p.id}>{p.name} ({p.timePeriodId})</option>)}
                        </select>
                    </div>
                    <div className="w-px h-6 bg-slate-200"></div>
                    <button 
                        onClick={onExit}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-md transition-colors shadow-sm"
                    >
                        <X size={14} /> Exit Compare
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0 bg-white shadow-[0_0_15px_rgba(0,0,0,0.02)] z-10 border-r border-slate-200">
                    
                    {/* --- KPI STRIP --- */}
                    <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-200">
                        {['revenue', 'ebitda', 'dscrBus'].map(metric => {
                            const isRatio = metric === 'dscrBus';
                            const labels = { revenue: 'Total Revenue', ebitda: 'EBITDA', dscrBus: 'Business DSCR' };
                            
                            const baseVal = baselineProfile.data[metric] || 0;
                            
                            return (
                                <div key={metric} className="p-4 bg-slate-50/50">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase mb-2">{labels[metric]}</div>
                                    <div className="flex items-center gap-6 overflow-x-auto pb-2">
                                        <div className="flex flex-col relative pr-4 after:content-[''] after:absolute after:right-0 after:top-1 after:bottom-1 after:w-px after:bg-blue-200">
                                            <span className="text-[10px] text-blue-600 font-bold mb-0.5 truncate max-w-[100px]" title="Baseline">BASE</span>
                                            <span className="text-lg font-mono font-bold text-slate-800">{formatKpi(baseVal, isRatio)}</span>
                                        </div>
                                        
                                        {compareProfiles.map(p => {
                                            const val = p.data[metric] || 0;
                                            const delta = calcKpiDelta(val, baseVal, isRatio);
                                            const isUp = delta?.direction === 'up';
                                            const deltaColor = isUp ? 'text-emerald-600' : delta?.direction === 'down' ? 'text-rose-600' : 'text-slate-400';
                                            const Icon = isUp ? ArrowUpRight : delta?.direction === 'down' ? ArrowDownRight : Minus;
                                            
                                            // Bad=Red for Expenses? For Rev/EBITDA/DSCR Up is always Good
                                            
                                            return (
                                                <div key={p.id} className="flex flex-col">
                                                    <span className="text-[10px] text-slate-500 font-bold mb-0.5 truncate max-w-[120px]" title={p.name}>{p.name.split(' ')[0]} {p.timePeriodId}</span>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-lg font-mono font-bold text-slate-800">{formatKpi(val, isRatio)}</span>
                                                        {delta && (
                                                            <div className={`flex items-center text-[10px] font-bold bg-slate-100 px-1 py-0.5 rounded ${deltaColor}`}>
                                                                <Icon size={10} /> {Math.abs(delta.pct).toFixed(1)}%
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    
                    {/* --- GRID TOOLBAR --- */}
                    <div className="px-4 py-2 border-b border-slate-200 bg-white flex items-center justify-between shadow-sm z-10">
                        <div className="flex items-center gap-2 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                            {[
                                { id: 'PERCENT', label: '% of Rev' },
                                { id: 'ABSOLUTE', label: 'Abs ($)' },
                                { id: 'VAR_DOLLAR', label: 'Var ($)' },
                                { id: 'VAR_PERCENT', label: 'Var (%)' }
                            ].map(btn => (
                                <button
                                    key={btn.id}
                                    onClick={() => setViewMode(btn.id)}
                                    className={`px-3 py-1 font-bold text-[10px] uppercase rounded-md transition-all ${viewMode === btn.id ? 'bg-white text-blue-700 shadow border border-slate-200/50' : 'text-slate-500 hover:bg-slate-200/50'}`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                        
                        <div className="flex items-center gap-2 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                            {[
                                { id: 'RAW', label: 'Raw Mapping' },
                                { id: 'NORMALIZED', label: 'Normalized' }
                            ].map(btn => (
                                <button
                                    key={btn.id}
                                    onClick={() => setStructureMode(btn.id)}
                                    className={`px-3 py-1 font-bold text-[10px] uppercase rounded-md transition-all ${structureMode === btn.id ? 'bg-white text-slate-800 shadow border border-slate-200/50' : 'text-slate-500 hover:bg-slate-200/50'}`}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    {/* --- SPREADSHEET GRID --- */}
                    <div className="flex-1 overflow-auto bg-white relative">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 z-20 bg-slate-50 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
                                <tr>
                                    <th className="py-2.5 px-4 font-bold text-[11px] uppercase text-slate-500 border-b border-slate-200 sticky left-0 z-10 bg-slate-50 min-w-[300px]">
                                        Classification Map
                                    </th>
                                    
                                    <th className="py-2.5 px-4 font-bold text-[11px] uppercase text-blue-700 bg-blue-50/50 border-b border-slate-200 border-r border-blue-100 text-right min-w-[120px]">
                                        <div className="flex flex-col items-end">
                                            <span className="truncate max-w-full" title={baselineProfile.name}>{baselineProfile.name}</span>
                                            <span className="text-[9px] font-mono text-blue-500">{baselineProfile.timePeriodId} | BASE</span>
                                        </div>
                                    </th>
                                    
                                    {compareProfiles.map(p => (
                                        <th key={p.id} className="py-2.5 px-4 font-bold text-[11px] uppercase text-slate-700 border-b border-slate-200 border-r border-slate-100 text-right min-w-[120px]">
                                            <div className="flex flex-col items-end">
                                               <span className="truncate max-w-full" title={p.name}>{p.name}</span>
                                               <span className="text-[9px] font-mono text-slate-400">{p.timePeriodId}</span>
                                            </div>
                                        </th>
                                    ))}
                                    
                                    {selectedProfiles.length >= 3 && (
                                        <>
                                            <th className="py-2.5 px-4 font-bold text-[10px] uppercase text-slate-400 border-b border-slate-200 border-r border-slate-100 text-right min-w-[80px]">MIN</th>
                                            <th className="py-2.5 px-4 font-bold text-[10px] uppercase text-slate-400 border-b border-slate-200 text-right min-w-[80px]">MAX</th>
                                        </>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {gridData.map(node => renderRow(node, 0))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* --- RIGHT PANEL: INTELLIGENCE --- */}
                <div className="w-[320px] shrink-0 bg-slate-50 border-l border-slate-200 overflow-y-auto z-10 flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10 shadow-sm flex items-center gap-2">
                        <PieChart size={16} className="text-indigo-600" />
                        <h3 className="font-bold text-slate-800 text-sm">Comparison Intelligence</h3>
                    </div>
                    
                    <div className="p-5 space-y-6">
                        {/* Summary Block */}
                        <div className="bg-white border text-center border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/10 rounded-full blur-2xl"></div>
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Comparability Score</div>
                            <div className="text-3xl font-black text-slate-800">
                                {compareProfiles.length > 2 ? '78' : '92'}<span className="text-base text-slate-400">/100</span>
                            </div>
                            <div className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 border border-emerald-200">
                                High Confidence
                            </div>
                        </div>

                        {/* Driver Analysis */}
                        <div className="space-y-3">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                <TrendingUp size={12}/> Top Drivers
                            </h4>
                            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-3 gap-2 flex flex-col">
                                <div className="flex justify-between items-center bg-rose-50 px-2 py-1.5 rounded border border-rose-100">
                                    <span className="text-[11px] font-semibold text-rose-800 max-w-[150px] truncate">Payroll (OpEx)</span>
                                    <span className="text-xs font-mono font-bold text-rose-700">+$125k YoY</span>
                                </div>
                                <div className="flex justify-between items-center bg-emerald-50 px-2 py-1.5 rounded border border-emerald-100">
                                    <span className="text-[11px] font-semibold text-emerald-800 max-w-[150px] truncate">Services Revenue</span>
                                    <span className="text-xs font-mono font-bold text-emerald-700">+$80k YoY</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Structural differences */}
                        <div className="space-y-3">
                            <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                <Activity size={12}/> Taxonomy Flags
                            </h4>
                            <div className="bg-white rounded-lg border border-amber-200 shadow-sm overflow-hidden text-sm">
                                <div className="bg-amber-50 px-3 py-2 flex items-start gap-2 border-b border-amber-100">
                                    <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
                                    <div>
                                        <div className="font-bold text-[11px] text-amber-800 uppercase tracking-wide">High Misc Usage</div>
                                        <div className="text-[11px] text-amber-700 mt-0.5">Draft profile uses generic 'Other Income' replacing distinct lines.</div>
                                    </div>
                                </div>
                                {selectedProfiles.length > 2 && (
                                     <div className="px-3 py-2 flex items-start gap-2">
                                        <HelpCircle size={14} className="text-slate-400 mt-0.5 shrink-0" />
                                        <div>
                                            <div className="font-bold text-[11px] text-slate-700 uppercase tracking-wide">Orphaned Lines</div>
                                            <div className="text-[11px] text-slate-500 mt-0.5">"Freight Income" exists in 2024 active but missing entirely in 2025 drafts.</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default MultiProfileComparison;
