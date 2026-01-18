import React, { useState, useEffect } from 'react';
import {
    Table, Save, Lock, AlertTriangle, CheckCircle,
    ArrowRight, RefreshCw, Layers, ChevronDown, ChevronRight
} from 'lucide-react';
import { FinancialLedgerService, CATEGORY_OPTIONS } from '../../services/FinancialLedgerService';

const NormalizationWorkbench = ({ statementId = 'STM-2024-001', onClose }) => {
    const [statement, setStatement] = useState(null);
    const [items, setItems] = useState([]);
    const [checklist, setChecklist] = useState({ total: 0, mapped: 0, percent: 0 });
    const [canonList, setCanonList] = useState([]); // [NEW] Canonical List
    const [notification, setNotification] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL'); // [NEW] Filter State: ALL | MAPPED | UNMAPPED

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
            console.log("Materialized Profile:", result);

            // Wait briefly for user to see success, then close
            setTimeout(() => {
                if (onClose) onClose();
            }, 1000);
        } catch (error) {
            setNotification({ type: 'error', message: error.message });
        }
    };

    if (!statement) return <div className="p-10 text-center">Loading Ledger...</div>;

    const isLocked = statement.status_finStmnt_rp1 === 'Locked';

    // Group Canon List by Main Section
    const groupedCanon = canonList.reduce((acc, curr) => {
        if (!acc[curr.type]) acc[curr.type] = {};
        if (!acc[curr.type][curr.group]) acc[curr.type][curr.group] = [];
        acc[curr.type][curr.group].push(curr);
        return acc;
    }, {});

    // [NEW] Calculate Counts
    const countTotal = items.length;
    const countMapped = items.filter(i => i.Master_Category).length;
    const countUnmapped = countTotal - countMapped;

    // [NEW] Filter Logic
    const filteredItems = items.filter(item => {
        if (filterStatus === 'ALL') return true;
        if (filterStatus === 'MAPPED') return !!item.Master_Category;
        if (filterStatus === 'UNMAPPED') return !item.Master_Category;
        return true;
    });

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

                {/* LEFT: CANONICAL CHECKLIST */}
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
                                                    {/*<span className="text-[10px] text-slate-300 font-mono">{line.id}</span>*/}
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
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <h3 className="font-bold text-slate-700">Raw Ledger Items ({filteredItems.length})</h3>

                            {/* [NEW] STATUS FILTER CONTROL */}
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
                                    {filteredItems.map(item => (
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
                                    ))}
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
