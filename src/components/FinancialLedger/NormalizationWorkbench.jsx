import React, { useState, useEffect } from 'react';
import {
    Table, Save, Lock, AlertTriangle, CheckCircle,
    ArrowRight, RefreshCw, Layers, ChevronDown, ChevronRight,
    Filter, X
} from 'lucide-react';
import { FinancialLedgerService, CATEGORY_OPTIONS } from '../../services/FinancialLedgerService';

const NormalizationWorkbench = ({ statementId = 'STM-2024-001', onClose }) => {
    const [statement, setStatement] = useState(null);
    const [items, setItems] = useState([]);
    const [checklist, setChecklist] = useState({ total: 0, mapped: 0, percent: 0 });
    const [canonList, setCanonList] = useState([]); // [NEW] Canonical List
    const [notification, setNotification] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [checkedCategories, setCheckedCategories] = useState([]); // [NEW] Multi-Select State
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false); // [NEW] UI State

    // Initial Load
    useEffect(() => {
        loadData();
    }, [statementId]);

    const loadData = () => {
        const stmt = FinancialLedgerService.getStatement(statementId);
        const ledgerItems = FinancialLedgerService.getStatementItems(statementId);
        const check = FinancialLedgerService.getChecklist(statementId);
        const canon = FinancialLedgerService.getCanonList(statementId);

        setStatement({ ...stmt });
        setItems([...ledgerItems]);
        setChecklist(check);
        setCanonList(canon);
    };

    const handleMappingChange = (itemId, newCategory) => {
        try {
            // Call Service
            FinancialLedgerService.updateItemMapping(itemId, newCategory);

            // Refresh Local State
            loadData();
        } catch (error) {
            setNotification({ type: 'error', message: error.message });
        }
    };

    const handleLock = () => {
        try {
            const result = FinancialLedgerService.lockStatement(statementId);
            setNotification({ type: 'success', message: 'Statement Locked & Materialized Successfully!' });

            // Wait briefly for user to see success, then close
            setTimeout(() => {
                if (onClose) onClose();
            }, 1000);
        } catch (error) {
            setNotification({ type: 'error', message: error.message });
        }
    };

    // [NEW] Multi-Select Logic
    const toggleCategory = (catId) => {
        setCheckedCategories(prev =>
            prev.includes(catId)
                ? prev.filter(c => c !== catId)
                : [...prev, catId]
        );
    };

    const clearCategories = () => {
        setCheckedCategories([]);
        setIsCategoryDropdownOpen(false);
    };

    if (!statement) return <div className="p-10 text-center">Loading Ledger...</div>;

    const isLocked = statement.status_finStmnt_rp1 === 'Locked';

    // Group Canon List by Main Section (Left Pane)
    const groupedCanon = canonList.reduce((acc, curr) => {
        if (!acc[curr.type]) acc[curr.type] = {};
        if (!acc[curr.type][curr.group]) acc[curr.type][curr.group] = [];
        acc[curr.type][curr.group].push(curr);
        return acc;
    }, {});

    // Calculate Counts
    const countTotal = items.length;
    const countMapped = items.filter(i => i.Master_Category).length;
    const countUnmapped = countTotal - countMapped;

    // Filter Logic
    const filteredItems = items.filter(item => {
        let matchStatus = true;
        if (filterStatus === 'MAPPED') matchStatus = !!item.Master_Category;
        if (filterStatus === 'UNMAPPED') matchStatus = !item.Master_Category;

        let matchCategory = true;
        if (checkedCategories.length > 0) {
            // If item has no category (Unmapped), it shouldn't match a category filter generally,
            // unless we had an explicit "Unmapped" checkbox. 
            // For now, if categories are checked, we only show items matching those categories.
            matchCategory = checkedCategories.includes(item.Master_Category);
        }

        return matchStatus && matchCategory;
    });

    // [NEW] Grouping for Right Pane (Virtual Sections)
    // Only used when filters are active
    const isFilterActive = filterStatus !== 'ALL' || checkedCategories.length > 0;

    const virtualGroups = {};
    if (isFilterActive) {
        filteredItems.forEach(item => {
            const key = item.Master_Category ? item.Master_Category : 'UNMAPPED_GROUP';
            if (!virtualGroups[key]) {
                const catInfo = CATEGORY_OPTIONS.find(c => c.id === key);
                virtualGroups[key] = {
                    id: key,
                    label: catInfo ? `${catInfo.group}: ${catInfo.label}` : 'Unmapped Items',
                    items: [],
                    total: 0
                };
            }
            virtualGroups[key].items.push(item);
            virtualGroups[key].total += item.Line_Amount;
        });
    }

    return (
        <div className="bg-slate-50 min-h-screen p-6 flex flex-col gap-6">

            {/* HEADLINE */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                        <Layers className="text-blue-600" />
                        Normalization Workbench
                    </h1>
                    <p className="text-slate-500 mt-1">
                        Map raw ledger items to the **Canonical Financial Standard**. All lines must be accounted for.
                    </p>
                </div>
                {notification && (
                    <div className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${notification.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
                        {notification.message}
                    </div>
                )}
            </div>

            {/* DASHBOARD GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-140px)]">

                {/* LEFT: CANONICAL CHECKLIST (STATIC READ-ONLY) */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-700">Canonical Targets (Read-Only)</h3>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                            Guaranteed Coverage
                        </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-6">
                        {['IS', 'BS'].map(type => (
                            <div key={type} className="space-y-3">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-1">
                                    {type === 'IS' ? 'Income Statement' : 'Balance Sheet'}
                                </h4>
                                {Object.entries(groupedCanon[type] || {}).map(([group, lines]) => (
                                    <div key={group} className="space-y-1">
                                        <div className="text-xs font-bold text-slate-800 pl-2">{group}</div>
                                        {lines.map(line => (
                                            <div key={line.id} className="flex justify-between items-center text-sm pl-4 pr-2 py-1 hover:bg-slate-50 rounded group">
                                                <div className="flex flex-col">
                                                    <span className={`text-xs ${line.amount > 0 ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                                                        {line.label}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <div className={`font-mono text-xs ${line.amount > 0 ? 'text-slate-900 font-bold' : 'text-slate-300'}`}>
                                                        ${line.amount.toLocaleString()}
                                                    </div>
                                                    {line.itemCount > 0 && (
                                                        <div className="text-[10px] text-blue-500 font-medium">
                                                            {line.itemCount} item{line.itemCount !== 1 ? 's' : ''}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: MAPPING AREA */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* STATS & CONTROLS */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex justify-between items-center">
                        <div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Raw Item Status</div>
                            <div className="flex items-center gap-3">
                                <span className={`text-2xl font-bold ${checklist.percent === 100 ? 'text-emerald-600' : 'text-slate-900'}`}>{checklist.percent}%</span>
                                <span className="text-sm text-slate-500">of raw items mapped</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleLock}
                                disabled={checklist.percent < 100 || isLocked}
                                className={`px-5 py-2 font-bold rounded-lg flex items-center gap-2 transition-colors ${checklist.percent === 100 && !isLocked
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <Lock size={16} /> {isLocked ? 'Locked' : 'Lock & Materialize'}
                            </button>
                        </div>
                    </div>

                    {/* ITEM TABLE */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 flex flex-col overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 relative z-20">
                            <h3 className="font-bold text-slate-700">Raw Ledger Items ({filteredItems.length})</h3>

                            <div className="flex items-center gap-4">
                                {/* MULTI-SELECT CATEGORY FILTER */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                                        className={`flex items-center gap-2 text-xs py-1.5 px-3 border rounded-md shadow-sm transition-colors ${checkedCategories.length > 0
                                            ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold'
                                            : 'bg-white border-slate-300 text-slate-700'
                                            }`}
                                    >
                                        <Filter size={12} />
                                        {checkedCategories.length > 0
                                            ? `${checkedCategories.length} Selected`
                                            : 'Filter Categories'}
                                    </button>

                                    {isCategoryDropdownOpen && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setIsCategoryDropdownOpen(false)}
                                            />
                                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden flex flex-col max-h-[400px]">
                                                <div className="p-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-500 uppercase">Select Categories</span>
                                                    {checkedCategories.length > 0 && (
                                                        <button
                                                            onClick={clearCategories}
                                                            className="text-[10px] items-center flex gap-1 text-slate-400 hover:text-red-600 font-medium"
                                                        >
                                                            <X size={10} /> Clear All
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="overflow-y-auto p-2 space-y-0.5">
                                                    {CATEGORY_OPTIONS.map(opt => (
                                                        <label key={opt.id} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 rounded cursor-pointer group">
                                                            <input
                                                                type="checkbox"
                                                                checked={checkedCategories.includes(opt.id)}
                                                                onChange={() => toggleCategory(opt.id)}
                                                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <div className="flex flex-col">
                                                                <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">{opt.label}</span>
                                                                <span className="text-[10px] text-slate-400">{opt.group}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* STATUS FILTER CONTROL */}
                                <div className="flex bg-slate-200 rounded-lg p-1">
                                    <button
                                        onClick={() => setFilterStatus('ALL')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterStatus === 'ALL'
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        ALL ({countTotal})
                                    </button>
                                    <button
                                        onClick={() => setFilterStatus('MAPPED')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterStatus === 'MAPPED'
                                            ? 'bg-white text-blue-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        MAPPED ({countMapped})
                                    </button>
                                    <button
                                        onClick={() => setFilterStatus('UNMAPPED')}
                                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${filterStatus === 'UNMAPPED'
                                            ? 'bg-white text-red-700 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        UNMAPPED ({countUnmapped})
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="px-6 py-3">Raw Line Name</th>
                                        <th className="px-6 py-3 text-right">Amount</th>
                                        <th className="px-6 py-3">Mapped Category (Select)</th>
                                        <th className="px-6 py-3 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {isFilterActive ? (
                                        // VIRTUAL SECTION VIEW
                                        Object.values(virtualGroups).map(group => (
                                            <React.Fragment key={group.id}>
                                                {/* VIRTUAL HEADER */}
                                                <tr className="bg-blue-50/50">
                                                    <td colSpan="4" className="px-6 py-2 border-y border-blue-100">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <Layers size={14} className="text-blue-500" />
                                                                <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                                                                    {group.label}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Visible Section Total:</span>
                                                                <span className="font-mono text-sm font-bold text-blue-700">
                                                                    ${group.total.toLocaleString()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                {/* GROUP ITEMS */}
                                                {group.items.map(item => (
                                                    <tr key={item.ID_finItem} className="hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-3 font-medium text-slate-700 max-w-[200px] truncate pl-10" title={item.Raw_Line_Name}>
                                                            {item.Raw_Line_Name}
                                                        </td>
                                                        <td className="px-6 py-3 text-right font-mono text-slate-600">${item.Line_Amount.toLocaleString()}</td>
                                                        <td className="px-6 py-3">
                                                            <select
                                                                value={item.Master_Category || ''}
                                                                onChange={(e) => handleMappingChange(item.ID_finItem, e.target.value)}
                                                                disabled={isLocked}
                                                                className={`w-full text-xs py-1.5 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 ${!item.Master_Category ? 'bg-red-50 text-red-700 border-red-200 font-bold' : 'bg-white'
                                                                    } ${isLocked ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`}
                                                            >
                                                                <option value="">-- [REQUIRED] Select Target --</option>
                                                                {CATEGORY_OPTIONS.map(opt => (
                                                                    <option key={opt.id} value={opt.id}>
                                                                        {opt.group}: {opt.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="px-6 py-3 text-right">
                                                            {item.Master_Category ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                                    MAPPED
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                                                                    Unmapped
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </React.Fragment>
                                        ))
                                    ) : (
                                        // STANDARD VIEW (No Filters)
                                        filteredItems.map(item => (
                                            <tr key={item.ID_finItem} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-3 font-medium text-slate-700 max-w-[200px] truncate" title={item.Raw_Line_Name}>
                                                    {item.Raw_Line_Name}
                                                </td>
                                                <td className="px-6 py-3 text-right font-mono text-slate-600">${item.Line_Amount.toLocaleString()}</td>
                                                <td className="px-6 py-3">
                                                    <select
                                                        value={item.Master_Category || ''}
                                                        onChange={(e) => handleMappingChange(item.ID_finItem, e.target.value)}
                                                        disabled={isLocked}
                                                        className={`w-full text-xs py-1.5 border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 ${!item.Master_Category ? 'bg-red-50 text-red-700 border-red-200 font-bold' : 'bg-white'
                                                            } ${isLocked ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`}
                                                    >
                                                        <option value="">-- [REQUIRED] Select Target --</option>
                                                        {CATEGORY_OPTIONS.map(opt => (
                                                            <option key={opt.id} value={opt.id}>
                                                                {opt.group}: {opt.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-6 py-3 text-right">
                                                    {item.Master_Category ? (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                            MAPPED
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                                                            Unmapped
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NormalizationWorkbench;
