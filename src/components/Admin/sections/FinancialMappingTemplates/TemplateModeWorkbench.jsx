import React, { useState, useMemo } from 'react';
import {
    ArrowLeft, Save, AlertTriangle, CheckCircle, Plus, Trash2,
    Info, Shield, Map, ChevronDown
} from 'lucide-react';
import {
    SAMPLE_LEDGER_ROWS, TEMPLATE_CANONICAL_OPTIONS, MappingTemplatesStore
} from '../../../../data/mockMappingTemplates';

const uid = () => `m_${Math.random().toString(36).slice(2, 8)}`;

// Group canonical options by group for <optgroup> rendering
const GROUPED_CANONICAL = TEMPLATE_CANONICAL_OPTIONS.reduce((acc, opt) => {
    if (!acc[opt.group]) acc[opt.group] = [];
    acc[opt.group].push(opt);
    return acc;
}, {});

/**
 * Template Mode Workbench.
 * Strictly manual: user maps each Raw Line Name → Canonical Category.
 * No rule engine. No match types. No pattern logic.
 * Stores ONLY { rawLineName, canonicalCategoryId }.
 */
const TemplateModeWorkbench = ({
    meta,
    initialMappings = [],
    editMode = false,
    currentVersion = null,
    onSave,
    onCancel,
}) => {
    // Each row in the workbench = one SAMPLE_LEDGER_ROW with an assigned category
    // We track the assignment map: { [rowId]: canonicalCategoryId | '' }
    const [assignments, setAssignments] = useState(() => {
        const init = {};
        SAMPLE_LEDGER_ROWS.forEach(row => { init[row.id] = ''; });
        // Pre-populate from initialMappings (match by rawLineName)
        initialMappings.forEach(m => {
            const found = SAMPLE_LEDGER_ROWS.find(r => r.rawLineName === m.rawLineName);
            if (found) init[found.id] = m.canonicalCategoryId;
        });
        return init;
    });

    const [notification, setNotification] = useState(null);
    const [saveAttempted, setSaveAttempted] = useState(false);

    // ── DERIVED STATE ────────────────────────────────────────────────────────
    const mappedRows = useMemo(() =>
        SAMPLE_LEDGER_ROWS.filter(row => !!assignments[row.id]),
        [assignments]
    );

    const coverage = useMemo(() =>
        Math.round((mappedRows.length / SAMPLE_LEDGER_ROWS.length) * 100),
        [mappedRows]
    );

    const hasMinOneMapping = mappedRows.length >= 1;

    // ── HANDLERS ─────────────────────────────────────────────────────────────
    const handleAssign = (rowId, categoryId) => {
        setAssignments(prev => ({ ...prev, [rowId]: categoryId }));
    };

    const handleClear = (rowId) => {
        setAssignments(prev => ({ ...prev, [rowId]: '' }));
    };

    const handleSave = () => {
        setSaveAttempted(true);
        if (!hasMinOneMapping) {
            setNotification({ type: 'error', message: 'At least 1 mapping is required before saving.' });
            setTimeout(() => setNotification(null), 4000);
            return;
        }
        // Build output: only mapped rows, only rawLineName + canonicalCategoryId
        const outputMappings = SAMPLE_LEDGER_ROWS
            .filter(row => !!assignments[row.id])
            .map(row => ({ rawLineName: row.rawLineName, canonicalCategoryId: assignments[row.id] }));

        onSave(outputMappings);
    };

    const categoryLabel = (id) => {
        const opt = TEMPLATE_CANONICAL_OPTIONS.find(o => o.id === id);
        return opt ? `${opt.group}: ${opt.label}` : '';
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden">

            {/* ── PAGE HEADER ── */}
            <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center gap-4 shadow-sm">
                <button onClick={onCancel} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-white"><Map size={18} /></div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">
                            {editMode ? `Edit Template — ${meta?.name}` : `Create Template — ${meta?.name}`}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {editMode
                                ? `Will create v${(currentVersion || 0) + 1} · v${currentVersion} preserved`
                                : 'Step 2 of 2 — Define Template Mappings'}
                        </p>
                    </div>
                </div>

                {/* Breadcrumb (create mode only) */}
                {!editMode && (
                    <div className="ml-auto flex items-center gap-2 text-xs mr-4">
                        <span className="px-3 py-1.5 bg-slate-100 text-slate-400 font-bold rounded-full">1 Metadata</span>
                        <span className="text-slate-300">→</span>
                        <span className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-full">2 Template Mapping</span>
                    </div>
                )}

                {/* Notification */}
                {notification && (
                    <div className={`${!editMode ? '' : 'ml-auto'} flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold animate-in fade-in ${notification.type === 'error' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {notification.type === 'error' ? <AlertTriangle size={15} /> : <CheckCircle size={15} />}
                        {notification.message}
                    </div>
                )}
            </div>

            {/* ── TEMPLATE MODE BANNER ── */}
            <div className="bg-amber-50 border-b border-amber-200 px-8 py-2.5 flex items-center gap-3">
                <Shield size={15} className="text-amber-600 shrink-0" />
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                    TEMPLATE MODE — Define mappings. No financial data will be stored.
                </p>
                {/* Coverage indicator */}
                <div className="ml-auto flex items-center gap-2.5">
                    <span className="text-[11px] font-bold text-amber-700">Template Coverage:</span>
                    <div className="w-28 bg-amber-200 rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-300 ${coverage >= 80 ? 'bg-emerald-500' : coverage >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${coverage}%` }}
                        />
                    </div>
                    <span className={`text-sm font-black min-w-[3rem] text-right ${coverage >= 80 ? 'text-emerald-700' : coverage >= 50 ? 'text-amber-700' : 'text-rose-600'}`}>
                        {coverage}%
                    </span>
                </div>
            </div>

            {/* ── MAIN GRID ── */}
            <div className="flex-1 overflow-hidden grid grid-cols-12">

                {/* LEFT PANEL — Template Source Ledger */}
                <div className="col-span-4 border-r border-slate-200 flex flex-col bg-white overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Template Source Ledger</h3>
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {mappedRows.length} / {SAMPLE_LEDGER_ROWS.length} mapped
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-xs">
                            <thead className="sticky top-0 bg-white border-b border-slate-100 z-10 shadow-sm">
                                <tr>
                                    <th className="px-4 py-2.5 text-left font-bold text-slate-500 uppercase tracking-wider text-[10px]">Raw Line Name</th>
                                    <th className="px-4 py-2.5 text-right font-bold text-slate-500 uppercase tracking-wider text-[10px]">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {SAMPLE_LEDGER_ROWS.map(row => {
                                    const isMapped = !!assignments[row.id];
                                    return (
                                        <tr
                                            key={row.id}
                                            className={`transition-colors ${isMapped ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                                        >
                                            <td className="px-4 py-2.5 text-slate-700 font-medium max-w-[190px] truncate" title={row.rawLineName}>
                                                {row.rawLineName}
                                            </td>
                                            <td className="px-4 py-2.5 text-right whitespace-nowrap">
                                                {isMapped ? (
                                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                                                        <CheckCircle size={9} /> MAPPED
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] font-medium text-slate-300 uppercase">UNMAPPED</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 border-t border-slate-100 bg-slate-50">
                        <div className="flex items-start gap-2 text-[11px] text-slate-400">
                            <Info size={11} className="shrink-0 mt-0.5" />
                            Amounts hidden in Template Mode. Map each line to a canonical category on the right.
                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL — Mapping Editor */}
                <div className="col-span-8 flex flex-col overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-6 py-3 bg-white border-b border-slate-200 flex justify-between items-center">
                        <div>
                            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                Template Mapping
                                <span className="text-slate-400 font-normal normal-case ml-1.5">
                                    ({mappedRows.length} of {SAMPLE_LEDGER_ROWS.length} lines mapped)
                                </span>
                            </h3>
                        </div>
                        <button
                            onClick={handleSave}
                            disabled={saveAttempted && !hasMinOneMapping}
                            className={`flex items-center gap-2 px-5 py-2 font-bold text-sm rounded-lg transition-colors ${hasMinOneMapping
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200'
                                : 'bg-slate-200 text-slate-400'
                            }`}
                        >
                            <Save size={15} /> Save Template
                        </button>
                    </div>

                    {/* Validation Banner */}
                    {saveAttempted && !hasMinOneMapping && (
                        <div className="mx-6 mt-4 flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg px-4 py-2.5">
                            <AlertTriangle size={14} className="text-rose-600 shrink-0" />
                            <p className="text-xs font-bold text-rose-700">At least 1 mapping is required to save this template.</p>
                        </div>
                    )}

                    {/* Column headers */}
                    <div className="grid grid-cols-12 gap-4 px-6 pt-4 pb-1">
                        <div className="col-span-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Raw Line Name</div>
                        <div className="col-span-5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">→ Canonical Category</div>
                        <div className="col-span-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</div>
                    </div>

                    {/* Mapping rows */}
                    <div className="flex-1 overflow-y-auto px-6 pb-6 pt-1 space-y-1.5">
                        {SAMPLE_LEDGER_ROWS.map(row => {
                            const assigned = assignments[row.id];
                            const isMapped = !!assigned;
                            return (
                                <div
                                    key={row.id}
                                    className={`grid grid-cols-12 gap-4 items-center px-4 py-2.5 rounded-xl border transition-all ${isMapped
                                        ? 'bg-emerald-50/40 border-emerald-200'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                    }`}
                                >
                                    {/* Raw Line Name — read only */}
                                    <div className="col-span-5">
                                        <span
                                            className="text-xs font-mono font-medium text-slate-700 truncate block max-w-full"
                                            title={row.rawLineName}
                                        >
                                            {row.rawLineName}
                                        </span>
                                    </div>

                                    {/* Canonical Category dropdown */}
                                    <div className="col-span-5">
                                        <div className="relative">
                                            <select
                                                value={assigned}
                                                onChange={e => handleAssign(row.id, e.target.value)}
                                                className={`w-full appearance-none border rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 pr-7 transition-colors ${isMapped
                                                    ? 'border-emerald-300 bg-white text-slate-800 font-semibold'
                                                    : 'border-slate-200 bg-slate-50 text-slate-400'
                                                }`}
                                            >
                                                <option value="">— Select Category —</option>
                                                {Object.entries(GROUPED_CANONICAL).map(([group, opts]) => (
                                                    <optgroup key={group} label={group}>
                                                        {opts.map(opt => (
                                                            <option key={opt.id} value={opt.id}>{opt.label}</option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                            <ChevronDown size={11} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    {/* Clear action */}
                                    <div className="col-span-2 flex justify-end">
                                        {isMapped ? (
                                            <button
                                                onClick={() => handleClear(row.id)}
                                                className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                                                title="Clear mapping"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        ) : (
                                            <span className="text-[10px] text-slate-200 font-medium uppercase">—</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TemplateModeWorkbench;
