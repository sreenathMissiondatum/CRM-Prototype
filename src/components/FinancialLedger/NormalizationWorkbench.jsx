import React, { useState, useEffect } from 'react';
import {
    Table, Save, Lock, AlertTriangle, CheckCircle,
    ArrowRight, RefreshCw, Layers
} from 'lucide-react';
import { FinancialLedgerService, CATEGORY_OPTIONS } from '../../services/FinancialLedgerService';

const NormalizationWorkbench = ({ statementId = 'STM-2024-001', onClose }) => {
    const [statement, setStatement] = useState(null);
    const [items, setItems] = useState([]);
    const [checklist, setChecklist] = useState({ total: 0, mapped: 0, percent: 0 });
    const [notification, setNotification] = useState(null);

    // Initial Load
    useEffect(() => {
        loadData();
    }, [statementId]);

    const loadData = () => {
        const stmt = FinancialLedgerService.getStatement(statementId);
        const ledgerItems = FinancialLedgerService.getStatementItems(statementId);
        const check = FinancialLedgerService.getChecklist(statementId);

        setStatement({ ...stmt });
        setItems([...ledgerItems]);
        setChecklist(check);
    };

    const handleMappingChange = (itemId, newCategory) => {
        try {
            // Find category definition
            const catDef = CATEGORY_OPTIONS.find(c => c.id === newCategory);

            // Call Service
            FinancialLedgerService.updateItemMapping(itemId, {
                Master_Category: newCategory,
                Category_Type: catDef?.type === 'IS' ? (['Revenue', 'OtherIncome'].includes(newCategory) ? 'Revenue' : 'Expense') : 'Asset', // Simplified inference
                Mapping_Status: 'Manual'
            });

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

    return (
        <div className="bg-slate-50 min-h-screen p-8">
            <div className="max-w-6xl mx-auto space-y-6">

                {/* HEADLINE */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <Layers className="text-blue-600" />
                            Normalization Workbench
                        </h1>
                        <p className="text-slate-500 mt-1">
                            Map raw ledger items to standard categories. This is the **source of truth** for Financial Intelligence.
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

                {/* CONTROL PANEL */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex justify-between items-center">
                    <div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Statement Context</div>
                        <div className="font-bold text-slate-900">{statement.type_finStmnt_rp1} ({statement.rp1_fiscalYr})</div>
                        <div className="text-xs text-slate-500">{statementId} • {statement.importMethod_finStmnt_rp1}</div>
                    </div>

                    <div className="flex-1 mx-12">
                        <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-slate-600">Mapping Completeness</span>
                            <span className={checklist.percent === 100 ? 'text-emerald-600' : 'text-blue-600'}>{checklist.percent}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${checklist.percent === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                                style={{ width: `${checklist.percent}%` }}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {isLocked ? (
                            <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded-lg flex items-center gap-2 cursor-not-allowed">
                                <Lock size={16} /> Locked v{statement.version_number}
                            </button>
                        ) : (
                            <button
                                onClick={handleLock}
                                disabled={checklist.percent < 100}
                                className={`px-5 py-2 font-bold rounded-lg flex items-center gap-2 transition-colors ${checklist.percent === 100
                                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-200'
                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                <Lock size={16} /> Lock & Materialize
                            </button>
                        )}
                    </div>
                </div>

                {/* LEDGER TABLE */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between">
                        <h3 className="font-bold text-slate-700">Raw Ledger Items ({items.length})</h3>
                        <span className="text-xs text-slate-400 italic">Only "Master Category" affects finProfile_bus</span>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 font-medium">
                            <tr>
                                <th className="px-6 py-3">Raw Line Name</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                                <th className="px-6 py-3 text-center">Sec</th>
                                <th className="px-6 py-3">Mapped Category (Target)</th>
                                <th className="px-6 py-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {items.map(item => (
                                <tr key={item.ID_finItem} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-3 font-medium text-slate-700">{item.Raw_Line_Name}</td>
                                    <td className="px-6 py-3 text-right font-mono text-slate-600">${item.Line_Amount.toLocaleString()}</td>
                                    <td className="px-6 py-3 text-center text-xs text-slate-400 uppercase">{item.Statement_Section}</td>
                                    <td className="px-6 py-3">
                                        <select
                                            value={item.Master_Category || ''}
                                            onChange={(e) => handleMappingChange(item.ID_finItem, e.target.value)}
                                            disabled={isLocked}
                                            className={`w-full text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 ${!item.Master_Category ? 'bg-red-50 text-red-700 border-red-200' : 'bg-white'
                                                } ${isLocked ? 'bg-slate-50 text-slate-400 cursor-not-allowed' : ''}`}
                                        >
                                            <option value="">-- Select Category --</option>
                                            {CATEGORY_OPTIONS.map(opt => (
                                                <option key={opt.id} value={opt.id}>{opt.label} ({opt.type})</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-3 text-right">
                                        {item.Master_Category ? (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                                Mapped
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                                Pending
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
    );
};

export default NormalizationWorkbench;
