import React, { useState, useMemo } from 'react';
import {
    X, ArrowLeft, ArrowRight, Save, Lock, Trash2, Plus, GripVertical, CornerUpLeft, RefreshCw,
    AlertTriangle, CheckCircle2, ChevronRight, Check,
    Calculator, TrendingUp, Scale, Calendar, Info, List
} from 'lucide-react';
import { createPortal } from 'react-dom';

// --- Helper Components (Moved to Top for Safety) ---

const PlusIcon = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
);

const CheckItem = ({ label, checked }) => (
    <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${checked ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-200 text-slate-300'}`}>
            <Check size={12} strokeWidth={3} />
        </div>
        <span className={`text-sm font-medium ${checked ? 'text-slate-700' : 'text-slate-400'}`}>{label}</span>
    </div>
);

const FinancialRow = ({ label, value, small }) => (
    <div className={`flex justify-between items-center ${small ? 'text-xs' : 'text-sm'}`}>
        <span className="text-slate-500 font-medium">{label}</span>
        <span className="font-mono text-slate-700">{typeof value === 'number' ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value) : value}</span>
    </div>
);

const FinancialSummaryRow = ({ label, value, isTotal, isNegative, color }) => (
    <div className={`flex justify-between items-center ${isTotal ? 'text-sm font-bold ' + (color || 'text-slate-800') : 'text-sm text-slate-600'}`}>
        <span>{label}</span>
        <span className={`font-mono ${isNegative ? 'text-red-500' : ''}`}>
            {isNegative && value > 0 ? '-' : ''}{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)}
        </span>
    </div>
);

const RecycleBinModal = ({ isOpen, onClose, items, onRestore }) => {
    if (!isOpen) return null;
    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-700 flex items-center gap-2">
                        <Trash2 size={18} className="text-slate-400" />
                        Recycle Bin <span className="text-slate-400 font-normal text-sm">({items?.length || 0} items)</span>
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {(!items || items.length === 0) ? (
                        <div className="p-8 text-center text-slate-400 text-sm">Bin is empty.</div>
                    ) : (
                        <div className="space-y-1">
                            {items.map(item => {
                                // Safety guard: Skip rendering if item is somehow undefined
                                if (!item) return null;
                                return (
                                    <div key={item.id} className="p-3 bg-white border border-slate-100 rounded-lg flex justify-between items-center hover:bg-slate-50 transition-colors">
                                        <div>
                                            <div className="font-medium text-slate-700 text-sm">{item.raw || 'Untitled Item'}</div>
                                            <div className="text-xs text-slate-400 font-mono">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.amount || 0)}</div>
                                        </div>
                                        <button
                                            onClick={() => onRestore(item.id)}
                                            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors flex items-center gap-1"
                                        >
                                            <RefreshCw size={12} /> Restore
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                    <button onClick={onClose} className="text-xs font-bold text-slate-500 hover:text-slate-700">Close</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

// --- Main Component ---

const FinancialMappingDetail = ({ isOpen, onClose, statement, onLock, onDelete }) => {
    if (!isOpen || !statement) return null;

    // --- State ---
    const [selectedLineId, setSelectedLineId] = useState(null);
    const [lockModalOpen, setLockModalOpen] = useState(false);

    // Drag & Drop State
    const dragItem = React.useRef(null);
    const dragOverItem = React.useRef(null);

    // Undo State
    const [deletedItems, setDeletedItems] = useState([]);
    const [showUndoToast, setShowUndoToast] = useState(false);
    const [recycleBinOpen, setRecycleBinOpen] = useState(false);

    // Mock Line Items - Initialize empty if Manual Entry Draft
    const [lines, setLines] = useState(() => {
        if (statement.status === 'Draft' && statement.importMethod === 'Manual Entry') {
            return [
                { id: 1, raw: 'Revenue', amount: 0, status: 'unmapped', section: 'Income Statement', category: '', master: '' },
                { id: 2, raw: 'Expenses', amount: 0, status: 'unmapped', section: 'Income Statement', category: '', master: '' }
            ];
        }
        return [
            // Income Statement Items
            { id: 1, raw: 'Gross Revenue - Sales', amount: 1250000, status: 'auto', section: 'Income Statement', category: 'Revenue', master: 'Gross Sales' },
            { id: 2, raw: 'Service Income', amount: 450000, status: 'auto', section: 'Income Statement', category: 'Revenue', master: 'Service Revenue' },
            { id: 3, raw: 'Returns & Allowances', amount: -25000, status: 'manual', section: 'Income Statement', category: 'Revenue', master: 'Returns and Allowances' },
            { id: 4, raw: 'Cost of Goods Sold', amount: 650000, status: 'auto', section: 'Income Statement', category: 'COGS', master: 'COGS - Material' },
            { id: 5, raw: 'Util - Electric', amount: 12000, status: 'auto', section: 'Income Statement', category: 'Operating Expense', master: 'Utilities' },
            { id: 6, raw: 'Rent Expense', amount: 45000, status: 'auto', section: 'Income Statement', category: 'Operating Expense', master: 'Rent / Lease' },
            { id: 7, raw: 'Officer Comp - JD', amount: 120000, status: 'manual', section: 'Income Statement', category: 'Operating Expense', master: 'Officer Compensation', isOwnerComp: true },
            { id: 8, raw: 'Depreciation Exp', amount: 35000, status: 'auto', section: 'Income Statement', category: 'Operating Expense', master: 'Depreciation', isNonCash: true },
            { id: 9, raw: 'Interest - Bank Loan', amount: 18000, status: 'manual', section: 'Income Statement', category: 'Operating Expense', master: 'Interest Expense', isInterest: true },

            // Balance Sheet Items
            { id: 11, raw: 'Cash on Hand', amount: 150000, status: 'auto', section: 'Balance Sheet', category: 'Asset', master: 'Cash & Equivalents' },
            { id: 12, raw: 'Accounts Receivable', amount: 85000, status: 'auto', section: 'Balance Sheet', category: 'Asset', master: 'Accounts Receivable' },
            { id: 13, raw: 'Inventory', amount: 200000, status: 'manual', section: 'Balance Sheet', category: 'Asset', master: 'Inventory' },
            { id: 14, raw: 'Accounts Payable', amount: 45000, status: 'auto', section: 'Balance Sheet', category: 'Liability', master: 'Accounts Payable' },
            { id: 15, raw: 'Bank Loan Principal', amount: 250000, status: 'manual', section: 'Balance Sheet', category: 'Liability', master: 'Long Term Debt' }
        ];
    });

    // Period & Duration Logic
    const periodData = useMemo(() => {
        if (!statement.startDate || !statement.endDate) return { months: 12, factor: 1, label: 'Full Year' };

        const start = new Date(statement.startDate);
        const end = new Date(statement.endDate);

        // Defensive Date Check
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return { months: 12, factor: 1, label: 'Date Error' };
        }

        const diffTime = Math.abs(end - start);
        const months = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.44));

        // Annualization Logic: Scale to 12 months if less than 12
        const factor = months > 0 && months < 12 && !statement.isProForma ? (12 / months) : 1;

        let label = 'Full Year';
        if (statement.isProForma) label = 'Projection';
        else if (months < 12) label = 'Annualized';

        return { months, factor, label };
    }, [statement]);

    // Derived Calculations
    const calculations = useMemo(() => {
        // Defensive lines check
        if (!lines) return {
            totalRevenue: 0, totalCOGS: 0, grossProfit: 0, totalOpEx: 0, noi: 0,
            deprAddback: 0, interestAddback: 0, ebitda: 0, grossMargin: 0,
            hasBalanceSheet: false, totalAssets: 0, totalLiabilities: 0, totalEquity: 0, leverageRatio: 0
        };

        const mapped = lines.filter(l => l && l.status !== 'unmapped');
        const getSum = (pred) => mapped.filter(pred).reduce((sum, l) => {
            const val = parseFloat(l.amount);
            return sum + (isNaN(val) ? 0 : val);
        }, 0);

        // --- Income Statement Metrics (Applying Annualization) ---
        // We calculate raw first, then apply factor
        const rawRevenue = getSum(l => l.category === 'Revenue');
        const rawCOGS = getSum(l => l.category === 'COGS');
        const rawOpEx = getSum(l => l.category === 'Operating Expense');

        // Add-Backs (Raw)
        const rawDepr = getSum(l => l.isNonCash);
        const rawInterest = getSum(l => l.isInterest);

        // Apply Factor
        const factor = periodData.factor || 1;
        const totalRevenue = rawRevenue * factor;
        const totalCOGS = rawCOGS * factor;
        const totalOpEx = rawOpEx * factor;
        const deprAddback = rawDepr * factor;
        const interestAddback = rawInterest * factor;

        // Derived Logic
        const grossProfit = totalRevenue - totalCOGS;
        const noi = grossProfit - totalOpEx;
        const ebitda = noi + deprAddback + interestAddback;

        // Ratios (Percentages don't get annualized directly, but derived from annualized amounts mathematically equivalent)
        const grossMargin = totalRevenue ? ((grossProfit / totalRevenue) * 100) : 0;

        // --- Balance Sheet Metrics (Point-In-Time: NO Annualization) ---
        const hasBalanceSheet = mapped.some(l => l.section === 'Balance Sheet');
        const totalAssets = getSum(l => l.section === 'Balance Sheet' && l.category === 'Asset');
        const totalLiabilities = getSum(l => l.section === 'Balance Sheet' && l.category === 'Liability');
        const totalEquity = totalAssets - totalLiabilities;
        const leverageRatio = totalEquity !== 0 ? (totalLiabilities / totalEquity) : 0;

        return {
            totalRevenue, totalCOGS, grossProfit, totalOpEx, noi,
            deprAddback, interestAddback, ebitda,
            grossMargin,
            hasBalanceSheet, totalAssets, totalLiabilities, totalEquity, leverageRatio
        };
    }, [lines, periodData.factor]);

    const percentMapped = lines.length > 0 ? Math.round((lines.filter(l => l && l.status !== 'unmapped').length / lines.length) * 100) : 0;
    const isReadOnly = statement.status === 'Locked';
    const isDraft = statement.status === 'Draft';

    // Validation Logic
    const validation = useMemo(() => {
        const allMapped = percentMapped === 100;
        const hasRevenue = lines.some(l => l && l.category === 'Revenue');
        const hasExpenses = lines.some(l => l && (l.category === 'Operating Expense' || l.category === 'COGS'));
        // Allow negative numbers, just check for empty or NaN (unless it's a temp '-')
        const noMissingAmounts = lines.every(l => l && l.amount !== '' && l.amount !== null && !isNaN(parseFloat(l.amount)));
        const isValid = allMapped && hasRevenue && hasExpenses && noMissingAmounts;
        return { allMapped, hasRevenue, hasExpenses, noMissingAmounts, isValid };
    }, [lines, percentMapped]);

    // Handlers
    const handleLineSelect = (id) => setSelectedLineId(id);

    const handleUpdateMapping = (updates) => {
        if (isReadOnly) return;
        setLines(prev => prev.map(l => l.id === selectedLineId ? { ...l, ...updates, status: 'manual' } : l));
    };

    const handleLock = () => {
        setLockModalOpen(false);
        onLock({ ...statement, status: 'Locked', progress: 100 });
        onClose();
    };

    // Drag & Drop Handlers
    const handleSort = () => {
        // duplicate items
        let _lines = [...lines];

        // remove and save the dragged item content
        const draggedItemContent = _lines.splice(dragItem.current, 1)[0];

        // switch the position
        _lines.splice(dragOverItem.current, 0, draggedItemContent);

        // reset the references
        dragItem.current = null;
        dragOverItem.current = null;

        // update the actual array
        setLines(_lines);
    };

    // Delete Handlers
    const handleDeleteLine = (id, e) => {
        e.stopPropagation();

        const itemToDelete = lines.find(l => l.id === id);
        // SAFETY: Only proceed if item found
        if (!itemToDelete) return;

        setDeletedItems(prev => [itemToDelete, ...prev]);
        setLines(prev => prev.filter(l => l.id !== id));
        setShowUndoToast(true);
        setTimeout(() => setShowUndoToast(false), 5000);
        if (selectedLineId === id) setSelectedLineId(null);
    };

    const handleUndoDelete = () => {
        if (deletedItems.length > 0) {
            const itemToRestore = deletedItems[0];
            if (!itemToRestore) return; // Safety

            setLines(prev => [...prev, itemToRestore]);
            setDeletedItems(prev => prev.slice(1));
            setShowUndoToast(false);
        }
    };

    const handleRestoreItem = (id) => {
        const itemToRestore = deletedItems.find(i => i.id === id);
        if (itemToRestore) {
            setLines(prev => [...prev, itemToRestore]);
            setDeletedItems(prev => prev.filter(i => i.id !== id));
            if (deletedItems.length === 1) setRecycleBinOpen(false); // Close if empty
        }
    };

    // Formatters
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val || 0);
    const formatDate = (d) => {
        try {
            return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch (e) {
            return 'Invalid Date';
        }
    };

    const selectedLine = lines.find(l => l.id === selectedLineId);

    return createPortal(
        <div className="fixed inset-0 z-[60] bg-slate-50 flex flex-col animate-in fade-in duration-200">

            {/* Header Toolbar */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm z-10 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold text-slate-900">{statement.type}</h1>
                                {statement.status === 'Locked' ? (
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase rounded-full flex items-center gap-1">
                                        <Lock size={10} /> Locked
                                    </span>
                                ) : (
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold uppercase rounded-full flex items-center gap-1">
                                        <AlertTriangle size={10} /> DRAFT — Not used in underwriting
                                    </span>
                                )}
                            </div>

                            {/* SECTION 1: STATEMENT HEADER — PERIOD UI */}
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                                    <Calendar size={14} className="text-slate-400" />
                                    <span>Period: <span className="text-slate-900">{formatDate(statement.startDate)} – {formatDate(statement.endDate)}</span></span>
                                </div>
                                <div className="h-4 w-px bg-slate-200"></div>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-slate-500">Coverage:</span>
                                    <div className={`text-xs font-bold uppercase px-2 py-0.5 rounded border flex items-center gap-1.5
                                        ${periodData.months < 12 ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-100 text-slate-600 border-slate-200'}
                                    `}>
                                        {periodData.months} months · {periodData.label}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {statement.status === 'Locked' ? (
                            <button
                                onClick={() => onLock({ ...statement, status: 'Draft' })}
                                className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-sm flex items-center gap-2"
                            >
                                <Lock size={16} className="text-slate-400" />
                                Unlock for Editing
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => {
                                        console.log('Delete button clicked (Direct)');
                                        if (onDelete) {
                                            onDelete(statement);
                                            onClose();
                                        }
                                    }}
                                    className="px-3 py-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer relative z-50"
                                    title="Discard Draft"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
                                    Save Draft
                                </button>
                                <button
                                    onClick={() => setLockModalOpen(true)}
                                    disabled={!validation.isValid}
                                    title={!validation.isValid ? "Complete all mappings to enable locking" : ""}
                                    className="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2 transition-all"
                                >
                                    <Lock size={16} />
                                    Lock Statement
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Progress Bar Row */}
                <div className="flex items-center gap-4 border-t border-slate-50 pt-4">
                    <span className="text-xs font-bold uppercase text-slate-400 w-32 tracking-wider">Mapping Progress</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-sm">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${percentMapped === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                            style={{ width: `${percentMapped}%` }}
                        ></div>
                    </div>
                    <span className="text-xs font-bold text-slate-600">{percentMapped}%</span>
                </div>
            </div>

            {/* 3-Pane Layout */}
            <div className="flex-1 flex overflow-hidden">

                {/* PANE 1: Raw Line Items (Left) */}
                <div className="w-[35%] border-r border-slate-200 bg-white flex flex-col">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-500 tracking-wider">
                        Source Data (Read-Only)
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                        {/* Undo Toast */}
                        {showUndoToast && (
                            <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900 text-white px-4 py-3 rounded-lg shadow-lg flex justify-between items-center text-sm animate-in slide-in-from-bottom-2">
                                <span>Line item removed</span>
                                <button onClick={handleUndoDelete} className="text-blue-300 font-bold hover:text-blue-200 flex items-center gap-1">
                                    <CornerUpLeft size={14} /> Undo
                                </button>
                            </div>
                        )}

                        {isDraft && lines.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <List size={32} className="text-slate-300" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-600">No line items yet</h3>
                                <p className="text-xs mb-6 max-w-[200px]">Add items manually or import data to begin mapping.</p>
                                <div className="flex flex-col gap-3 w-full max-w-[200px]">
                                    <button
                                        onClick={() => {
                                            const newId = lines.length > 0 ? Math.max(...lines.map(l => l.id)) + 1 : 1;
                                            setLines([...lines, { id: newId, raw: '', amount: 0, status: 'unmapped', section: 'Income Statement', category: '', master: '' }]);
                                        }}
                                        className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 text-xs uppercase"
                                    >
                                        <Plus size={14} /> Add Line Item
                                    </button>
                                    {deletedItems.length > 0 && (
                                        <button
                                            onClick={() => setRecycleBinOpen(true)}
                                            className="px-4 py-2 bg-white border border-slate-200 text-slate-500 font-bold rounded-lg hover:text-slate-700 hover:border-slate-300 transition-colors flex items-center justify-center gap-2 text-xs uppercase"
                                        >
                                            <Trash2 size={14} /> Open Recycle Bin ({deletedItems.length})
                                        </button>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white sticky top-0 z-10 shadow-sm text-xs font-semibold text-slate-500 border-b border-slate-100">
                                    {isDraft && (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-2 bg-slate-50 text-[10px] text-slate-400 font-medium border-b border-slate-100">
                                                <div className="flex justify-between items-center">
                                                    <span>Drag items to reorder. Order does not affect calculations.</span>
                                                    <button
                                                        onClick={() => setRecycleBinOpen(true)}
                                                        className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Trash2 size={12} />
                                                        <span className="underline decoration-slate-300 underline-offset-2">Recycle Bin ({deletedItems.length})</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    <tr>
                                        {isDraft && <th className="px-1 py-2 w-8"></th>}
                                        <th className="px-4 py-2 w-full">Line Item Name</th>
                                        <th className="px-4 py-2 text-right">Amount</th>
                                        <th className="px-3 py-2 w-8"></th>
                                        {isDraft && <th className="px-2 py-2 w-8"></th>}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {lines.map((line, index) => {
                                        if (!line) return null; // Safety break
                                        return (
                                            <tr
                                                key={line.id}
                                                draggable={isDraft}
                                                onDragStart={(e) => {
                                                    dragItem.current = index;
                                                    e.target.classList.add('opacity-50');
                                                }}
                                                onDragEnter={(e) => {
                                                    dragOverItem.current = index;
                                                }}
                                                onDragEnd={(e) => {
                                                    e.target.classList.remove('opacity-50');
                                                    handleSort();
                                                }}
                                                onDragOver={(e) => e.preventDefault()}
                                                onClick={() => handleLineSelect(line.id)}
                                                className={`
                                                transition-colors group
                                                ${selectedLineId === line.id ? 'bg-blue-50' : 'hover:bg-slate-50'}
                                                ${line.status === 'unmapped' && !isDraft ? 'bg-amber-50/30' : ''}
                                                ${isDraft ? 'cursor-move' : 'cursor-pointer'}
                                            `}
                                            >
                                                {isDraft && (
                                                    <td className="px-1 py-3 text-center align-middle">
                                                        <GripVertical size={14} className="text-slate-300 mx-auto" />
                                                    </td>
                                                )}
                                                <td className="px-4 py-3 font-medium text-slate-700">
                                                    {isDraft ? (
                                                        <input
                                                            type="text"
                                                            className="w-full bg-transparent border-none p-0 focus:ring-0 font-medium text-slate-900 placeholder:text-slate-300 placeholder:font-normal"
                                                            value={line.raw}
                                                            onChange={(e) => {
                                                                const newVal = e.target.value;
                                                                setLines(prev => prev.map(l => l.id === line.id ? { ...l, raw: newVal } : l));
                                                            }}
                                                            // Prevent propagation to avoid line select when typing, 
                                                            // BUT we do want row selection. 
                                                            // Let's rely on row click handler, input click should probably not trigger row select if we want to be strict, but actually it's fine.
                                                            placeholder="Enter description..."
                                                        />
                                                    ) : (
                                                        <>
                                                            {line.status === 'unmapped' && <div className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block mr-2 mb-0.5"></div>}
                                                            {line.raw}
                                                        </>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right font-mono text-slate-600">
                                                    {isDraft ? (
                                                        <input
                                                            type="text"
                                                            className="w-24 text-right bg-transparent border-b border-transparent focus:border-blue-500 p-0 focus:ring-0 font-mono text-slate-900"
                                                            value={line.amount}
                                                            onChange={(e) => {
                                                                const val = e.target.value;
                                                                if (val === '' || val === '-') {
                                                                    setLines(prev => prev.map(l => l.id === line.id ? { ...l, amount: val } : l));
                                                                } else {
                                                                    const num = parseFloat(val);
                                                                    if (!isNaN(num)) {
                                                                        setLines(prev => prev.map(l => l.id === line.id ? { ...l, amount: num } : l));
                                                                    }
                                                                }
                                                            }}
                                                            onClick={(e) => e.stopPropagation()}
                                                            placeholder="0.00"
                                                        />
                                                    ) : (
                                                        formatCurrency(line.amount)
                                                    )}
                                                </td>
                                                <td className="px-3 py-3 text-center">
                                                    {!isDraft && (
                                                        <>
                                                            {line.status === 'auto' && <span className="text-slate-300 group-hover:text-emerald-500" title="Auto-mapped"><CheckCircle2 size={14} /></span>}
                                                            {selectedLineId === line.id && <ChevronRight size={16} className="text-blue-500" />}
                                                        </>
                                                    )}
                                                    {isDraft && selectedLineId === line.id && <ChevronRight size={16} className="text-blue-500" />}
                                                </td>
                                                {isDraft && (
                                                    <td className="px-2 py-3 text-center">
                                                        <button
                                                            onClick={(e) => handleDeleteLine(line.id, e)}
                                                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        );
                                    })}
                                    {isDraft && (
                                        <tr>
                                            <td colSpan="5" className="p-2">
                                                <button
                                                    onClick={() => {
                                                        const newId = lines.length > 0 ? Math.max(...lines.map(l => l.id)) + 1 : 1;
                                                        setLines([...lines, { id: newId, raw: '', amount: 0, status: 'unmapped', section: 'Income Statement', category: '', master: '' }]);
                                                    }}
                                                    className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-slate-400 font-bold text-xs uppercase hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                                                >
                                                    <Plus size={14} /> Add Line Item
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* PANE 2: Mapping & Config (Center) */}
                <div className="flex-1 bg-slate-50/50 flex flex-col border-r border-slate-200">
                    <div className="px-6 py-3 border-b border-slate-200 bg-white text-xs font-bold uppercase text-slate-500 tracking-wider flex justify-between">
                        <span>Mapping Configuration</span>
                        {selectedLine && (
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${selectedLine.status === 'unmapped' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                                }`}>
                                {selectedLine.status}
                            </span>
                        )}
                        {isReadOnly && <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] uppercase font-bold rounded">Read Only</span>}
                    </div>

                    <div className="p-8 flex-1 overflow-y-auto">
                        {selectedLine ? (
                            <div className={`max-w-lg mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-300 ${isReadOnly ? 'opacity-80 pointer-events-none grayscale-[0.5]' : ''}`}>

                                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Raw Line Source</label>
                                    <div className="text-lg font-bold text-slate-800">{selectedLine.raw}</div>
                                    <div className="text-2xl font-mono text-slate-600 mt-2">{formatCurrency(selectedLine.amount)}</div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-600 uppercase">Statement Section</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Income Statement', 'Balance Sheet'].map(sec => (
                                                <button
                                                    key={sec}
                                                    disabled={isReadOnly}
                                                    onClick={() => handleUpdateMapping({ section: sec, category: '', master: '' })}
                                                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all ${selectedLine.section === sec
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                                        : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                                                        }`}
                                                >
                                                    {sec}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Category Selector */}
                                    {selectedLine.section && (
                                        <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                            <label className="text-xs font-bold text-slate-600 uppercase">Master Category Map</label>
                                            <select
                                                className="w-full p-3 bg-white border border-slate-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-sm disabled:bg-slate-100"
                                                value={selectedLine.master}
                                                disabled={isReadOnly}
                                                onChange={(e) => {
                                                    const mappings = {
                                                        'Gross Sales': { category: 'Revenue' },
                                                        'Service Revenue': { category: 'Revenue' },
                                                        'COGS - Material': { category: 'COGS' },
                                                        'Rent / Lease': { category: 'Operating Expense' },
                                                        'Utilities': { category: 'Operating Expense' },
                                                        'Depreciation': { category: 'Operating Expense' },
                                                        'Interest Expense': { category: 'Operating Expense' },
                                                        'Officer Compensation': { category: 'Operating Expense', isOwnerComp: true }
                                                    };
                                                    // Auto-set category based on master selection (Mock Logic)
                                                    const val = e.target.value;
                                                    const auto = mappings[val] || { category: 'Operating Expense' };
                                                    handleUpdateMapping({ master: val, ...auto });
                                                }}
                                            >
                                                <option value="">-- Select Master Category --</option>
                                                <optgroup label="Revenue">
                                                    <option>Gross Sales</option>
                                                    <option>Service Revenue</option>
                                                </optgroup>
                                                <optgroup label="Cost of Goods Sold">
                                                    <option>COGS - Material</option>
                                                    <option>COGS - Labor</option>
                                                </optgroup>
                                                <optgroup label="Operating Expenses">
                                                    <option>Rent / Lease</option>
                                                    <option>Utilities</option>
                                                    <option>Depreciation</option>
                                                    <option>Interest Expense</option>
                                                    <option>Officer Compensation</option>
                                                </optgroup>
                                                <optgroup label="Balance Sheet">
                                                    <option>Cash & Equivalents</option>
                                                    <option>Accounts Receivable</option>
                                                    <option>Inventory</option>
                                                    <option>Accounts Payable</option>
                                                    <option>Long Term Debt</option>
                                                </optgroup>
                                            </select>
                                        </div>
                                    )}

                                    {/* Flags */}
                                    {selectedLine.master && (
                                        <div className="pt-2 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLine.isNonCash}
                                                    disabled={isReadOnly}
                                                    onChange={(e) => handleUpdateMapping({ isNonCash: e.target.checked })}
                                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                />
                                                <label className="text-sm text-slate-700">Non-Cash Item (Add-back)</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLine.isInterest}
                                                    disabled={isReadOnly}
                                                    onChange={(e) => handleUpdateMapping({ isInterest: e.target.checked })}
                                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                />
                                                <label className="text-sm text-slate-700">Interest Expense (Add-back)</label>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedLine.isOwnerComp}
                                                    disabled={isReadOnly}
                                                    onChange={(e) => handleUpdateMapping({ isOwnerComp: e.target.checked })}
                                                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                />
                                                <label className="text-sm text-slate-700">Owner Compensation (Discretionary)</label>
                                            </div>
                                        </div>
                                    )}
                                </div>

                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                                    <GripVertical size={24} className="text-slate-200" />
                                </div>
                                <h3 className="text-lg font-medium text-slate-600">Select a Line Item</h3>
                                <p className="text-sm max-w-xs text-center mt-1">
                                    Click any row on the left to map it to a standardized category.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* PANE 3: Validation & Preview (Right) */}
                <div className="w-[30%] bg-white border-l border-slate-200 flex flex-col">
                    <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase text-slate-500 tracking-wider">
                        {isDraft && !validation.isValid ? 'Validation & Readiness' : 'Live Financial Preview'}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">

                        {isDraft && !validation.isValid ? (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                                        <Info size={16} /> Mapping Instructions
                                    </h3>
                                    <p className="text-xs text-blue-800 leading-relaxed">
                                        Map each raw line item to a standard category. Ensure all items are accounted for before locking the statement.
                                    </p>
                                </div>

                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Requirements</h4>
                                    <div className="space-y-3">
                                        <CheckItem label="All items mapped" checked={validation.allMapped} />
                                        <CheckItem label="Revenue identified" checked={validation.hasRevenue} />
                                        <CheckItem label="Expenses identified" checked={validation.hasExpenses} />
                                        <CheckItem label="No zero/missing amounts" checked={validation.noMissingAmounts} />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Current Totals (Preview)</h4>
                                    <div className="space-y-2">
                                        <FinancialRow label="Total Revenue" value={calculations.totalRevenue} small />
                                        <FinancialRow label="Total EBITDA" value={calculations.ebitda} small />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                {/* SECTION: INCOME STATEMENT */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                                        <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                            <TrendingUp size={12} /> Income Statement
                                        </h4>
                                        <span className="text-[9px] text-slate-400 italic">Annualized ({periodData.months}mo)</span>
                                    </div>

                                    <FinancialSummaryRow label="Gross Profit" value={calculations.grossProfit} />
                                    <div className="pt-2">
                                        <FinancialSummaryRow label="Total Revenue" value={calculations.totalRevenue} />
                                        <FinancialSummaryRow label="COGS" value={calculations.totalCOGS} isNegative />
                                    </div>

                                    <div className="pt-2">
                                        <FinancialSummaryRow label="Operating Expenses" value={calculations.totalOpEx} isNegative />
                                    </div>
                                    <div className="border-t border-slate-200 my-1"></div>
                                    <FinancialSummaryRow label="Net Operating Income" value={calculations.noi} isTotal color="text-slate-800" />
                                </div>

                                {/* SECTION: CASH FLOW ADD-BACKS */}
                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-2">
                                    <div className="justify-between flex items-center">
                                        <div className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                                            <PlusIcon size={10} /> Cash Flow Add-Backs
                                        </div>
                                        <div className="text-[9px] text-slate-400 italic">Included in normalization</div>
                                    </div>
                                    <FinancialRow label="Depr. & Amortization" value={calculations.deprAddback} small />
                                    <FinancialRow label="Interest Expense" value={calculations.interestAddback} small />
                                </div>

                                {/* SECTION: EBITDA */}
                                <div className="p-4 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Calculator size={48} />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1 flex items-center justify-between">
                                            {statement.isProForma ? 'EBITDA (Projected)' : 'EBITDA (LTM)'}
                                            {periodData.months < 12 && !statement.isProForma && <Info size={12} />}
                                        </div>
                                        <div className="text-3xl font-bold font-mono tracking-tight">{formatCurrency(calculations.ebitda)}</div>
                                        <div className="text-[10px] opacity-60 mt-2 font-medium">
                                            {statement.isProForma ? 'Based on Pro Forma logic' :
                                                periodData.months === 12 ? 'Based on full-year financials' :
                                                    `Annualized from ${periodData.months}-month period`
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* SECTION: BALANCE SHEET SUMMARY */}
                                {calculations.hasBalanceSheet && (
                                    <div className="space-y-3 pt-4 border-t border-slate-200 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="flex justify-between items-end border-b border-slate-100 pb-1">
                                            <h4 className="text-[10px] font-bold uppercase text-slate-400 tracking-widest flex items-center gap-2">
                                                <Scale size={12} /> Balance Sheet
                                            </h4>
                                            <span className="text-[9px] text-slate-400 italic">Point-in-time (Not Annualized)</span>
                                        </div>

                                        <FinancialSummaryRow label="Total Assets" value={calculations.totalAssets} />
                                        <FinancialSummaryRow label="Total Liabilities" value={calculations.totalLiabilities} />
                                        <div className="border-t border-slate-100 my-1"></div>
                                        <FinancialSummaryRow label="Total Equity" value={calculations.totalEquity} isTotal />

                                        <div className="flex justify-between items-center py-2 bg-slate-50 rounded px-2 mt-2">
                                            <span className="text-xs text-slate-500 font-bold">Leverage Ratio</span>
                                            <span className={`text-sm font-mono font-bold ${calculations.leverageRatio > 3 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                {calculations.leverageRatio.toFixed(2)}x
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                    </div>
                    {/* Draft Footer Note */}
                    {isDraft && (
                        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 text-center font-medium">
                            This draft statement does not affect financial summaries until it is fully mapped and locked.
                        </div>
                    )}
                </div>

            </div>

            {/* Modals */}
            {lockModalOpen && (
                createPortal(
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 text-center space-y-4">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                    <Lock size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Lock Statement?</h3>
                                <p className="text-sm text-slate-600">
                                    This will enable financial analysis and use this data for underwriting ratios.
                                    <br /><br />
                                    You can unlock it later to make edits, but it will revert to "Draft" status.
                                </p>
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <button
                                        onClick={() => setLockModalOpen(false)}
                                        className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleLock}
                                        className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                                    >
                                        Confirm Lock
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            )}

            <RecycleBinModal
                isOpen={recycleBinOpen}
                onClose={() => setRecycleBinOpen(false)}
                items={deletedItems}
                onRestore={handleRestoreItem}
            />
        </div>,
        document.body
    );
};

export default FinancialMappingDetail;
