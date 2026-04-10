import React, { useState, useMemo } from 'react';
import { Filter, TrendingUp, AlertCircle, Info, BarChart3, CheckCircle } from 'lucide-react';

const TrendEngineTab = ({ profiles, templates }) => {
    // 1. DYNAMIC FILTER OPTIONS
    const availablePeriods = ['2022', '2023', '2024', '2025 (YTD)'];
    const availableStatementTypes = ['P&L (Actuals)', 'Tax Return', 'Pro Forma', 'Balance Sheet', 'Interim'];
    const availablePresets = [
        { key: 'all', label: 'All Data' },
        { key: 'verified', label: 'Verified' },
        { key: 'operational', label: 'Operational' },
    ];

    // 2. ACTIVE FILTERS STATE
    const [selectedPeriods, setSelectedPeriods] = useState(availablePeriods);
    const [selectedStatementTypes, setSelectedStatementTypes] = useState(availableStatementTypes);
    const [activePreset, setActivePreset] = useState('all');
    const [activeMetric, setActiveMetric] = useState('revenue'); // revenue, ebitda, dscrGlob, netProfit

    // Audit Log & Async API Fetch Simulation
    const prevFilters = React.useRef({ periods: selectedPeriods, stmtTypes: selectedStatementTypes });
    React.useEffect(() => {
        if (prevFilters.current.periods !== selectedPeriods || prevFilters.current.stmtTypes !== selectedStatementTypes) {
            console.log(`[AUDIT LOG] Filters Changed:`, {
                userId: 'user_analyst_1', 
                timestamp: new Date().toISOString(),
                previous: prevFilters.current, 
                new: { periods: selectedPeriods, stmtTypes: selectedStatementTypes, preset: activePreset }
            });
            prevFilters.current = { periods: selectedPeriods, stmtTypes: selectedStatementTypes };
            console.log(`[API FETCH] Fetching trend data: Payload = { timePeriods: ${JSON.stringify(selectedPeriods)}, statementTypes: ${JSON.stringify(selectedStatementTypes)}, preset: "${activePreset}" }`);
        }
    }, [selectedPeriods, selectedStatementTypes, activePreset]);

    // Filter toggles
    const togglePeriod = (p) => {
        setSelectedPeriods(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
    };
    const toggleStatementType = (s) => {
        setSelectedStatementTypes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
    };
    const handlePreset = (key) => {
        setActivePreset(key);
        if (key === 'all') setSelectedStatementTypes(availableStatementTypes);
        if (key === 'verified') setSelectedStatementTypes(['Tax Return', 'P&L (Actuals)']);
        if (key === 'operational') setSelectedStatementTypes(['P&L (Actuals)', 'Pro Forma', 'Interim']);
    };

    // 3. DATA RESOLUTION ENGINE
    const resolvedData = useMemo(() => {
        // Direct source type matching — selectedStatementTypes now maps 1:1 to profile sourceTypes
        let targetSources = [...selectedStatementTypes];

        // Apply preset quality filters
        // 'verified' => only LOCKED or PRIMARY or mappingCompleteness === 100
        // 'operational' => exclude HISTORICAL / LOCKED
        const presetStatusFilter = (p) => {
            if (activePreset === 'verified') return p.status === 'PRIMARY' || p.status === 'LOCKED' || p.mappingCompleteness === 100;
            if (activePreset === 'operational') return p.status !== 'HISTORICAL' && p.status !== 'LOCKED';
            return true; // 'all'
        };

        const result = [];
        
        selectedPeriods.forEach(period => {
            targetSources.forEach(source => {
                // Get all matching profiles for this intersection
                const matches = profiles.filter(p => p.timePeriodId === period && p.sourceType === source && presetStatusFilter(p));
                if (matches.length === 0) return;
                
                // Exclude incomplete profiles (<80%)
                const validMatches = matches.filter(p => p.mappingCompleteness >= 80);
                if (validMatches.length === 0) return;

                // Priority: PRIMARY -> else highest version
                let resolvedProfile = validMatches.find(p => p.status === 'PRIMARY');
                if (!resolvedProfile) {
                    resolvedProfile = validMatches.reduce((highest, curr) => (curr.version > highest.version ? curr : highest), validMatches[0]);
                }

                // Metric Extraction & Formatting
                let rawValue = 0;
                switch (activeMetric) {
                    case 'revenue': rawValue = resolvedProfile.data.revenue; break;
                    case 'ebitda': rawValue = resolvedProfile.data.ebitda; break;
                    case 'dscrGlob': rawValue = resolvedProfile.data.dscrGlob; break;
                    case 'netProfit': rawValue = resolvedProfile.data.netProfit; break;
                    default: break;
                }

                if (rawValue === undefined) return;

                // Handle YTD Annualization
                let finalValue = rawValue;
                let isAnnualized = false;
                if (period.includes('YTD') && activeMetric !== 'dscrGlob') {
                    // Simple mock annualization: assume YTD is 9 months
                    finalValue = (rawValue / 9) * 12;
                    isAnnualized = true;
                }

                result.push({
                    period,
                    source,
                    value: finalValue,
                    profileName: resolvedProfile.name,
                    version: resolvedProfile.version,
                    isAnnualized,
                    isProjection: source.includes('Pro Forma')
                });
            });
        });

        // Group by source for series plotting
        const seriesBySource = {};
        result.forEach(r => {
            if (!seriesBySource[r.source]) seriesBySource[r.source] = [];
            seriesBySource[r.source].push(r);
        });

        return { flat: result, series: seriesBySource };
    }, [profiles, selectedPeriods, selectedStatementTypes, activePreset, activeMetric]);

    // 4. CHART MATH (Custom SVG Implementation)
    const { chartData, yMin, yMax } = useMemo(() => {
        if (resolvedData.flat.length === 0) return { chartData: { flat: [], series: {} }, yMin: 0, yMax: 100 };
        
        const allValues = resolvedData.flat.map(d => d.value);
        let min = Math.min(...allValues);
        let max = Math.max(...allValues);
        
        // Add 10% padding
        const padding = (max - min) * 0.1 || (max * 0.1) || 10;
        min = Math.max(0, min - padding); // Don't dip below zero unless there are negative numbers
        if (activeMetric === 'dscrGlob') { min = 0; max = Math.max(max, 2.0); }
        else { max = max + padding; }

        return { chartData: resolvedData, yMin: min, yMax: max };
    }, [resolvedData, activeMetric]);

    // Generate Insights based on filtered data
    const insights = useMemo(() => {
        const statements = [];
        if (selectedPeriods.length < 2) return statements;
        
        const firstPeriod = selectedPeriods[0];
        const lastPeriod = selectedPeriods[selectedPeriods.length - 1];

        const resolvedSources = Object.keys(chartData.series);

        // 1. Overall Trend Insight (Using Primary/First Source)
        const activeSource = resolvedSources[0];
        if (activeSource && chartData.series[activeSource] && chartData.series[activeSource].length > 1) {
            const series = chartData.series[activeSource];
            const first = series.find(s => s.period === firstPeriod)?.value;
            const last = series.find(s => s.period === lastPeriod)?.value;
            
            if (first && last && first > 0) {
                const change = ((last - first) / first) * 100;
                statements.push({
                    type: change >= 0 ? 'positive' : 'warning',
                    text: `${activeSource} ${activeMetric.toUpperCase()} has ${change >= 0 ? 'grown' : 'contracted'} by ${Math.abs(change).toFixed(1)}% from ${firstPeriod} to ${lastPeriod}.`
                });
            }
        }

        // 2. Source Comparison
        if (resolvedSources.length > 1 && selectedPeriods.length > 0) {
            const s1 = chartData.series[resolvedSources[0]]?.find(s => s.period === lastPeriod)?.value;
            const s2 = chartData.series[resolvedSources[1]]?.find(s => s.period === lastPeriod)?.value;
            if (s1 && s2) {
                const variance = Math.abs((s1 - s2) / s2) * 100;
                if (variance > 5) {
                    statements.push({
                        type: 'warning',
                        text: `Significant variance (${variance.toFixed(1)}%) detected between ${resolvedSources[0]} and ${resolvedSources[1]} for ${lastPeriod}.`
                    });
                } else {
                    statements.push({
                        type: 'positive',
                        text: `${resolvedSources[0]} closely aligns with ${resolvedSources[1]} in ${lastPeriod}.`
                    });
                }
            }
        }

        // 3. DSCR Constraint
        if (activeMetric === 'dscrGlob') {
            const hasRisk = chartData.flat.some(d => d.value < 1.25);
            if (hasRisk) {
                statements.push({ type: 'danger', text: 'DSCR falls below the 1.25x minimum threshold in selected periods.' });
            }
        }

        return statements;
    }, [chartData, selectedPeriods, activeMetric]);

    // Validation States
    if (selectedPeriods.length < 2) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-500 animate-in fade-in">
                <BarChart3 size={48} className="text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-700">Trend Engine Requires Context</h3>
                <p className="text-sm mt-2 max-w-md">Please select at least 2 Time Periods from the filter bar above to compute historical trends and projections.</p>
                <div className="mt-8 flex gap-2">
                    {availablePeriods.map(p => (
                        <button key={p} onClick={() => togglePeriod(p)} className={`px-3 py-1.5 text-xs font-bold rounded-md border ${selectedPeriods.includes(p) ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 shadow-sm'}`}>
                            {p}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-300 bg-slate-50/50 pb-12">
            {/* FILTER BAR - SLEEK HORIZONTAL RIBBON */}
            <div className="border-b border-slate-200 bg-white px-8 py-3.5 flex flex-col xl:flex-row items-center gap-6 shadow-sm">
                
                {/* Metric Selector */}
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Metric</span>
                    <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                        {['revenue', 'ebitda', 'netProfit', 'dscrGlob'].map(metric => (
                            <button
                                key={metric}
                                onClick={() => setActiveMetric(metric)}
                                className={`px-4 py-1 text-[11px] font-bold rounded-md capitalize transition-all ${
                                    activeMetric === metric 
                                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200/50' 
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {metric.replace('Glob', ' Global')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-px h-6 bg-slate-200 hidden xl:block"></div>

                {/* Scope Filters */}
                <div className="flex-1 flex flex-wrap items-center gap-x-6 gap-y-2">

                    {/* Time Periods */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Filter size={12}/> Periods
                        </span>
                        <div className="flex items-center gap-1.5">
                            {availablePeriods.map(p => (
                                <button 
                                    key={p} 
                                    onClick={() => togglePeriod(p)}
                                    className={`px-3 py-1 text-[10px] font-bold rounded border transition-all ${
                                        selectedPeriods.includes(p)
                                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-px h-5 bg-slate-200 hidden sm:block"></div>

                    {/* Statement Types */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {availableStatementTypes.map(s => (
                                <button 
                                    key={s} 
                                    onClick={() => { toggleStatementType(s); setActivePreset('all'); }}
                                    className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition-all ${
                                        selectedStatementTypes.includes(s)
                                            ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'
                                    }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="w-px h-5 bg-slate-200 hidden sm:block"></div>

                    {/* Preset / Data Quality */}
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preset</span>
                        <div className="flex items-center gap-1.5">
                            {availablePresets.map(preset => (
                                <button
                                    key={preset.key}
                                    onClick={() => handlePreset(preset.key)}
                                    className={`px-2.5 py-1 text-[10px] font-bold rounded border transition-all ${
                                        activePreset === preset.key
                                            ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'
                                    }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* CHART & INSIGHTS AREA */}
            <div className="flex-1 px-8 py-6 w-full max-w-6xl mx-auto flex flex-col gap-6">
                
                {/* Header Context */}
                <div className="flex justify-between items-end">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 capitalize tracking-tight flex items-center gap-2">
                            <TrendingUp size={20} className="text-blue-600"/>
                            {activeMetric.replace('Glob', ' Global')} Trend
                        </h2>
                        <p className="text-[11px] text-slate-500 font-medium mt-1">
                            Resolved across {selectedPeriods.length} periods and {Object.keys(chartData.series).length} distinct profile types.
                        </p>
                    </div>
                    {selectedPeriods.some(p => p.includes('YTD')) && activeMetric !== 'dscrGlob' && (
                        <div className="text-[10px] font-bold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md flex items-center gap-1.5 shadow-sm">
                            <AlertCircle size={12} /> YTD Annualized for Comparison
                        </div>
                    )}
                </div>

                {/* THE CHART COMPONENT */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 relative h-[300px] w-full flex flex-col pt-8">
                    {chartData.flat.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <AlertCircle size={32} className="mb-2 opacity-50"/>
                            <p className="text-sm font-bold">No comparable data points resolved.</p>
                            <p className="text-xs mt-1">Adjust filters or mapping completeness.</p>
                        </div>
                    ) : (
                        <CustomTrendChart data={chartData} periods={selectedPeriods} activeMetric={activeMetric} yMin={yMin} yMax={yMax} />
                    )}
                </div>

                {/* SMART INSIGHTS */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-4">
                    <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                            <Info size={14} className="text-blue-600" />
                            Smart Engine Insights
                        </h3>
                    </div>
                    <div className="p-2">
                        {insights.length === 0 ? (
                            <p className="text-xs text-slate-500 p-4 font-medium italic">Insufficient data variance to generate insights.</p>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {insights.map((ins, i) => (
                                    <div key={i} className="px-5 py-4 flex items-start gap-3">
                                        <div className="mt-0.5 shrink-0">
                                            {ins.type === 'positive' && <CheckCircle size={14} className="text-emerald-500" />}
                                            {ins.type === 'warning' && <AlertCircle size={14} className="text-amber-500" />}
                                            {ins.type === 'danger' && <AlertCircle size={14} className="text-rose-500" />}
                                        </div>
                                        <p className="text-sm font-medium text-slate-700 leading-snug">{ins.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrendEngineTab;

// --- CUSTOM SVG CHART ENGINE ---

const CustomTrendChart = ({ data, periods, activeMetric, yMin, yMax }) => {
    // Colors for different sources
    const COLORS = ['#2563eb', '#059669', '#d97706', '#7c3aed', '#475569'];

    // Map periods to X coordinates
    const paddingX = 60;
    const paddingY = 20; // Internal padding inside the viewBox
    const width = 1000;
    const height = 300;
    
    // We'll render using SVG percentage system so it auto-scales
    const formatY = (val) => {
        if (activeMetric === 'dscrGlob') return val.toFixed(2) + 'x';
        if (val > 1000000) return '$' + (val/1000000).toFixed(2) + 'M';
        if (val > 1000) return '$' + (val/1000).toFixed(0) + 'K';
        return '$' + val;
    };

    return (
        <div className="w-full h-full relative group">
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
                
                {/* Y-Axis Guidelines */}
                {[0, 0.25, 0.5, 0.75, 1].map(pct => {
                    const y = height - paddingY - (pct * (height - paddingY * 2));
                    const val = yMin + pct * (yMax - yMin);
                    return (
                        <g key={pct}>
                            <line x1={paddingX} y1={y} x2={width} y2={y} stroke="#e2e8f0" strokeWidth="1" strokeDasharray={pct > 0 ? "4,4" : ""} />
                            <text x={paddingX - 10} y={y + 4} textAnchor="end" fontSize="11" fill="#94a3b8" fontWeight="bold" fontFamily="monospace">
                                {formatY(val)}
                            </text>
                        </g>
                    );
                })}

                {/* DSCR 1.25 Threshold Line */}
                {activeMetric === 'dscrGlob' && (
                    <g>
                        <line 
                            x1={paddingX} 
                            y1={height - paddingY - ((1.25 - yMin) / (yMax - yMin) * (height - paddingY * 2))} 
                            x2={width} 
                            y2={height - paddingY - ((1.25 - yMin) / (yMax - yMin) * (height - paddingY * 2))} 
                            stroke="#ef4444" strokeWidth="1.5" strokeDasharray="6,4" 
                        />
                        <text x={width} y={height - paddingY - ((1.25 - yMin) / (yMax - yMin) * (height - paddingY * 2)) - 8} textAnchor="end" fontSize="10" fill="#ef4444" fontWeight="bold">
                            1.25x MIN RISK THRESHOLD
                        </text>
                    </g>
                )}

                {/* X-Axis Periods */}
                {periods.map((p, i) => {
                    const spacing = periods.length > 1 ? (width - paddingX) / (periods.length - 1) : width/2;
                    const x = paddingX + (i * spacing);
                    return (
                        <g key={p}>
                            <line x1={x} y1={height - paddingY} x2={x} y2={height - paddingY + 5} stroke="#cbd5e1" strokeWidth="2" />
                            <text x={x} y={height - paddingY + 22} textAnchor="middle" fontSize="12" fill="#64748b" fontWeight="bold">
                                {p}
                            </text>
                        </g>
                    );
                })}

                {/* Plot Lines */}
                {Object.entries(data.series).map(([source, points], sIdx) => {
                    const color = COLORS[sIdx % COLORS.length];
                    const isProj = points[0]?.isProjection;
                    
                    // Sort points by period index
                    const sortedPoints = [...points].sort((a,b) => periods.indexOf(a.period) - periods.indexOf(b.period));
                    
                    // Construct SVG path
                    let d = '';
                    sortedPoints.forEach((pt, pIdx) => {
                        const pLocalIdx = periods.indexOf(pt.period);
                        if (pLocalIdx === -1) return;
                        
                        const spacing = periods.length > 1 ? (width - paddingX) / (periods.length - 1) : width/2;
                        const x = paddingX + (pLocalIdx * spacing);
                        const y = height - paddingY - ((pt.value - yMin) / (yMax - yMin) * (height - paddingY * 2));
                        
                        if (pIdx === 0) d += `M ${x} ${y} `;
                        else d += `L ${x} ${y} `;
                    });

                    return (
                        <g key={source}>
                            <path d={d} fill="none" stroke={color} strokeWidth="3" strokeDasharray={isProj ? "6,6" : ""} strokeLinejoin="round" strokeLinecap="round" className="transition-all duration-300" />
                            {sortedPoints.map((pt, pIdx) => {
                                const pLocalIdx = periods.indexOf(pt.period);
                                if (pLocalIdx === -1) return null;
                                const spacing = periods.length > 1 ? (width - paddingX) / (periods.length - 1) : width/2;
                                const x = paddingX + (pLocalIdx * spacing);
                                const y = height - paddingY - ((pt.value - yMin) / (yMax - yMin) * (height - paddingY * 2));
                                
                                return (
                                    <g key={`${source}-${pt.period}`}>
                                        <circle cx={x} cy={y} r="6" fill={color} stroke="#fff" strokeWidth="2.5" className="cursor-pointer transition-all hover:r-[9px] hover:stroke-slate-100" 
                                            onClick={() => alert(`Resolved Profile Context:\nPeriod: ${pt.period}\nSource: ${source} (${pt.profileName} v${pt.version})\nValue: ${formatY(pt.value)} ${pt.isAnnualized ? '(Annualized YTD)' : ''}`)}
                                        />
                                        {/* Value Label (only visible if multi-source or specifically desired) */}
                                        {Object.keys(data.series).length === 1 && (
                                            <text x={x} y={y - 15} textAnchor="middle" fontSize="12" fill={color} fontWeight="bold" className="shadow-sm">
                                                {formatY(pt.value)}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </g>
                    );
                })}

            </svg>
            
            {/* Simple Inline Legend */}
            <div className="absolute -top-4 right-0 bg-white/90 backdrop-blur px-3 py-2 rounded-lg shadow-sm border border-slate-100 flex flex-col gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {Object.keys(data.series).map((source, i) => (
                    <div key={source} className="flex items-center gap-2 text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                        <div className="w-3 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                        {source}
                    </div>
                ))}
                {Object.keys(data.series).length > 1 && (
                    <div className="text-[9px] text-amber-700 font-bold mt-1 bg-amber-50 px-2 py-1 rounded-sm flex items-center gap-1 border border-amber-200">
                        <AlertCircle size={10} /> Mixed Sources
                    </div>
                )}
            </div>
            
            {/* Click CTA */}
            <div className="absolute -bottom-4 right-0 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Click graph nodes for audit payload
            </div>
        </div>
    );
};
