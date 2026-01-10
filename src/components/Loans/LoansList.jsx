import React, { useMemo, useState } from 'react';
import {
    Plus, Filter, Search, MoreHorizontal, ChevronRight, ArrowUpRight,
    Clock, AlertCircle, CheckCircle, FileText, Briefcase, Sparkles,
    MessageSquare, Mail, Bell, Shield, X, LayoutGrid, Check,
    Download, ChevronLeft, ArrowUpDown, File, Table,
    Eye, Pencil, UserCog, ArrowRightCircle, Trash2, GripVertical, ArrowUp, ArrowDown, Upload, Database, FileInput
} from 'lucide-react';
import { createPortal } from 'react-dom';
import Pagination from '../Shared/Pagination';
import StageScroll from '../Shared/StageScroll';

const LoansList = ({ onSelectLoan, viewMode = 'loans' }) => {
    // State
    const [activeStage, setActiveStage] = useState('All');
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

    // Advanced Features State
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [sortConfig, setSortConfig] = useState({ key: 'date', label: 'Recent' });
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeRowMenu, setActiveRowMenu] = useState(null);

    // 1. Column Configuration
    const [columns, setColumns] = useState([
        { id: 'select', label: '', visible: true, width: '40px', fixed: true },
        { id: 'id', label: 'Loan ID', visible: true, width: '100px' },
        { id: 'borrower', label: 'Borrower', visible: true, width: '3fr' },
        { id: 'officer', label: 'Officer', visible: true, width: '1.5fr' },
        { id: 'amount', label: 'Amount', visible: true, width: '1.5fr' },
        { id: 'stage', label: 'Stage', visible: true, width: '1.5fr' },
        { id: 'sla', label: 'SLA Status', visible: true, width: '1.5fr' },
        { id: 'actions', label: 'Actions', visible: true, width: '100px', fixed: true }
    ]);

    const stages = ['All', 'New', 'Packaging', 'Underwriting', 'Credit Committee Review', 'Approved', 'Closed / Funded', 'Withdrawn', 'Declined'];

    // 2. Data Logic (Mock Data Generation)
    const loans = useMemo(() => {
        const staticLoans = [
            {
                id: 'LN-2023-005',
                borrower: 'Jenkins Catering Services, LLC',
                industry: 'Caterers',
                relationship: 'Active TA Client',
                program: 'Working Capital',
                stage: 'New',
                slaStatus: 'track',
                slaText: 'On Track',
                amount: 85000,
                amountFormatted: '$85,000',
                date: '2023-12-09T09:00:00',
                officer: 'Sarah M'
            },
            {
                id: 'LN-2345',
                borrower: 'ABC Retail LLC',
                industry: 'Retail Trade',
                relationship: 'Returning Client',
                program: 'SBA 7(a)',
                stage: 'Credit Committee Review',
                slaStatus: 'warning',
                slaText: '4h remaining',
                amount: 350000,
                amountFormatted: '$350,000',
                date: '2023-12-06T10:00:00',
                officer: 'Sarah M'
            },
            {
                id: 'LN-2320',
                borrower: 'Hitech Motors',
                industry: 'Manufacturing',
                relationship: 'New Client',
                program: 'Equipment Finance',
                stage: 'Packaging',
                slaStatus: 'track',
                slaText: '2 days left',
                amount: 1200000,
                amountFormatted: '$1.2M',
                date: '2023-12-05T14:30:00',
                officer: 'John L'
            },
            {
                id: 'LN-2301',
                borrower: 'FreshFoods Inc',
                industry: 'Food Services',
                relationship: 'Referral',
                program: 'Working Capital',
                stage: 'Underwriting',
                slaStatus: 'track',
                slaText: '23h remaining',
                amount: 85000,
                amountFormatted: '$85,000',
                date: '2023-12-07T09:00:00',
                officer: 'Sarah M'
            }
        ];

        return staticLoans;
    }, []);

    // Helper functions
    const toggleColumn = (id) => {
        setColumns(cols => cols.map(col =>
            col.id === id ? { ...col, visible: !col.visible } : col
        ));
    };

    const handleUpdateColumns = (newColumns) => {
        const preservedColumns = newColumns.filter(c => c.id !== 'actions');
        const actionsCol = columns.find(c => c.id === 'actions') || { id: 'actions', label: 'Actions', visible: true, width: '100px', fixed: true };
        setColumns([...preservedColumns, actionsCol]);
        setIsColumnManagerOpen(false);
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(paginatedLoans.map(l => l.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const toggleSelectRow = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleExport = (format) => {
        const idsToExport = selectedIds.size > 0 ? Array.from(selectedIds) : sortedLoans.map(l => l.id);
        alert(`Successfully exported ${idsToExport.length} loans to ${format.toUpperCase()}.`);
        setIsExportMenuOpen(false);
    };

    const changeSort = (key, label) => {
        setSortConfig({ key, label });
        setIsSortMenuOpen(false);
        setCurrentPage(1);
    };

    const getStageIcon = (stage) => {
        switch (stage) {
            case 'New': return Sparkles;
            case 'Packaging': return FileText;
            case 'Underwriting': return Search;
            case 'Credit Committee Review': return Shield;
            case 'Approved': return CheckCircle;
            case 'Closed / Funded': return Briefcase;
            case 'Withdrawn': return X;
            case 'Declined': return AlertCircle;
            default: return FileText;
        }
    };

    // Data Processing
    const filteredAndSortedLoans = useMemo(() => {
        let result = activeStage === 'All' ? loans : loans.filter(l => l.stage === activeStage);

        if (viewMode === 'loans-my') {
            result = result.filter(l => l.officer === 'Alex Morgan');
        }

        result = [...result].sort((a, b) => {
            if (sortConfig.key === 'priority') {
                const urgencyScore = (status) => {
                    if (status === 'breach') return 3;
                    if (status === 'warning') return 2;
                    return 1;
                };
                const scoreA = urgencyScore(a.slaStatus);
                const scoreB = urgencyScore(b.slaStatus);
                if (scoreA !== scoreB) return scoreB - scoreA;
                return b.amount - a.amount;
            } else if (sortConfig.key === 'amount') {
                return b.amount - a.amount;
            } else if (sortConfig.key === 'date') {
                return new Date(b.date) - new Date(a.date);
            }
            return 0;
        });
        return result;
    }, [loans, activeStage, sortConfig, viewMode]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedLoans.length / itemsPerPage);
    const paginatedLoans = filteredAndSortedLoans.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const visibleColumns = columns.filter(c => c.visible);
    const gridTemplateColumns = visibleColumns.map(c => c.width).join(' ');

    const stats = {
        breached: loans.filter(l => l.slaStatus === 'breach').length,
        warning: loans.filter(l => l.slaStatus === 'warning').length,
        avgDays: '6.2'
    };

    // Scroll to top on page change
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, activeStage]);

    // RENDER
    return (
        <div className="flex-1 bg-slate-50 relative min-h-screen flex flex-col">
            <div className="max-w-7xl mx-auto w-full p-8 flex flex-col">

                {/* Header & Insights */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                            {viewMode === 'loans-my' ? 'My Loans' : 'All Loans'}
                        </h2>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-red-50 text-red-700 font-medium border border-red-100">
                                <AlertCircle size={14} />
                                <span>{stats.breached} SLA Breach</span>
                            </div>
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-medium border border-amber-100">
                                <Clock size={14} />
                                <span>{stats.warning} At Risk</span>
                            </div>
                            <span className="text-slate-400">|</span>
                            <span>Avg time to close: <strong>{stats.avgDays} days</strong></span>
                        </div>
                    </div>

                    <div className="flex gap-3 relative z-[45]">
                        {/* Create Loan Button */}
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-200">
                            <Plus size={16} />
                            <span>Create Loan</span>
                        </button>

                        {/* Export Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                <Download size={16} />
                                {selectedIds.size > 0 ? `Export (${selectedIds.size})` : 'Export'}
                            </button>

                            {isExportMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsExportMenuOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">Export As</div>
                                        <button onClick={() => handleExport('excel')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between items-center group">
                                            <div className="flex items-center gap-2">
                                                <Table size={14} className="text-emerald-600" />
                                                <span>Excel</span>
                                            </div>
                                        </button>
                                        <button onClick={() => handleExport('csv')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between items-center group">
                                            <div className="flex items-center gap-2">
                                                <FileText size={14} className="text-blue-600" />
                                                <span>CSV</span>
                                            </div>
                                        </button>
                                        <button onClick={() => handleExport('pdf')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between items-center group">
                                            <div className="flex items-center gap-2">
                                                <File size={14} className="text-red-600" />
                                                <span>PDF</span>
                                            </div>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* More Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                                className="p-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                <MoreHorizontal size={20} />
                            </button>
                            {isMoreMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsMoreMenuOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                                        <button className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors flex items-center gap-3">
                                            <Upload size={16} className="text-slate-400" /> Import Loans
                                        </button>
                                        <button className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors flex items-center gap-3">
                                            <Database size={16} className="text-slate-400" /> Bulk Update
                                        </button>
                                        <div className="h-px bg-slate-100 my-1"></div>
                                        <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3">
                                            <GripVertical size={16} className="text-slate-400" /> Settings
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Unified Card Container */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col">

                    {/* Toolbar Section */}
                    <div className="p-4 border-b border-slate-200 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white z-30 relative rounded-t-2xl">
                        {/* Stage Pipeline */}
                        <div className="flex-1 min-w-0 w-full xl:w-auto">
                            <StageScroll
                                items={stages}
                                activeItem={activeStage}
                                onSelect={(stage) => {
                                    setActiveStage(stage);
                                    setCurrentPage(1);
                                }}
                                counts={stages.reduce((acc, stage) => {
                                    acc[stage] = stage === 'All' ? loans.length : loans.filter(l => l.stage === stage).length;
                                    return acc;
                                }, {})}
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2 shrink-0 w-full xl:w-auto">
                            {/* Search */}
                            <div className="relative flex-1 xl:flex-none">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm w-full xl:w-64 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>

                            {/* Tools */}
                            <div className="flex gap-2">
                                {/* Sort Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                                    >
                                        <ArrowUpDown size={16} />
                                        <span>{sortConfig.label}</span>
                                    </button>
                                    {isSortMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10" onClick={() => setIsSortMenuOpen(false)}></div>
                                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">Sort By</div>
                                                <button onClick={() => changeSort('priority', 'Urgency')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between">
                                                    <span>Urgency</span>
                                                    {sortConfig.key === 'priority' && <Check size={14} className="text-blue-600" />}
                                                </button>
                                                <button onClick={() => changeSort('amount', 'Amount')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between">
                                                    <span>Amount</span>
                                                    {sortConfig.key === 'amount' && <Check size={14} className="text-blue-600" />}
                                                </button>
                                                <button onClick={() => changeSort('date', 'Recent')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between">
                                                    <span>Date Created</span>
                                                    {sortConfig.key === 'date' && <Check size={14} className="text-blue-600" />}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Column Manager Toggle */}
                                <button onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 relative">
                                    <LayoutGrid size={16} />
                                    {isColumnMenuOpen && (
                                        <>
                                            <div className="fixed inset-0 z-10 cursor-default" onClick={(e) => { e.stopPropagation(); setIsColumnMenuOpen(false); }}></div>
                                            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-1 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                                                {columns.map(col => col.id !== 'select' && col.id !== 'actions' && (
                                                    <button
                                                        key={col.id}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleColumn(col.id);
                                                        }}
                                                        className="flex items-center justify-between w-full px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded"
                                                    >
                                                        <span>{col.label}</span>
                                                        {col.visible && <Check size={14} className="text-blue-600" />}
                                                    </button>
                                                ))}
                                                <div className="h-px bg-slate-100 my-2"></div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setIsColumnMenuOpen(false);
                                                        setIsColumnManagerOpen(true);
                                                    }}
                                                    className="w-full text-center py-2 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                >
                                                    + Add Columns
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </button>

                                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
                                    <Filter size={16} />
                                    <span>Filter</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Column Manager Modal */}
                    <ColumnManagerModal
                        isOpen={isColumnManagerOpen}
                        onClose={() => setIsColumnManagerOpen(false)}
                        currentColumns={columns.filter(c => c.id !== 'actions')}
                        onSave={handleUpdateColumns}
                    />

                    {/* Grid Table Container - natural height */}
                    <div className="flex flex-col relative rounded-b-2xl">
                        <div className="bg-white">
                            {/* Header (Sticky) */}
                            <div
                                className="grid gap-4 px-6 py-3 bg-white border-b border-l-4 border-transparent border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider items-center sticky top-20 z-40 shadow-sm"
                                style={{ gridTemplateColumns }}
                            >
                                {columns.map(col => (
                                    col.visible && (
                                        <div key={col.id} className={col.id === 'actions' || col.id === 'amount' ? 'text-right' : ''}>
                                            {col.id === 'select' ? (
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    onChange={toggleSelectAll}
                                                    checked={paginatedLoans.length > 0 && paginatedLoans.every(l => selectedIds.has(l.id))}
                                                />
                                            ) : col.label}
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-slate-100">
                                {paginatedLoans.map(loan => {
                                    const StageIcon = getStageIcon(loan.stage);
                                    const isSelected = selectedIds.has(loan.id);

                                    let borderClass = 'border-transparent';
                                    let bgClass = '';

                                    if (loan.slaStatus === 'breach') {
                                        borderClass = 'border-l-red-500';
                                        bgClass = 'bg-red-50/10';
                                    } else if (loan.slaStatus === 'warning') {
                                        borderClass = 'border-l-amber-500';
                                        bgClass = 'bg-amber-50/10';
                                    }

                                    return (
                                        <div
                                            key={loan.id}
                                            onClick={() => onSelectLoan(loan)}
                                            className={`group hover:bg-blue-50/30 transition-all cursor-pointer relative ${isSelected ? 'bg-blue-50/40' : bgClass}`}
                                        >
                                            <div
                                                className={`grid gap-4 px-6 py-4 items-center border-l-4 ${borderClass} hover:border-blue-200`}
                                                style={{ gridTemplateColumns }}
                                            >
                                                {columns.map(col => {
                                                    if (!col.visible) return null;

                                                    if (col.id === 'select') {
                                                        return (
                                                            <div key={col.id} onClick={(e) => e.stopPropagation()}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                    checked={isSelected}
                                                                    onChange={() => toggleSelectRow(loan.id)}
                                                                />
                                                            </div>
                                                        );
                                                    }

                                                    if (col.id === 'id') {
                                                        return (
                                                            <div key={col.id} className="font-mono text-[11px] text-slate-400 font-medium group-hover:text-blue-600 transition-colors">
                                                                {loan.id.split('-')[1]}
                                                            </div>
                                                        );
                                                    }

                                                    if (col.id === 'borrower') {
                                                        return (
                                                            <div key={col.id}>
                                                                <div className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors text-sm">
                                                                    {loan.borrower}
                                                                </div>
                                                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                                                    <span>{loan.industry}</span>
                                                                    <span className="w-0.5 h-0.5 rounded-full bg-slate-300"></span>
                                                                    <span>{loan.relationship}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    if (col.id === 'officer') {
                                                        return (
                                                            <div key={col.id} className="flex items-center gap-2">
                                                                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                                    {loan.officer.charAt(0)}
                                                                </div>
                                                                <span className="text-xs font-medium text-slate-600">{loan.officer}</span>
                                                            </div>
                                                        );
                                                    }

                                                    if (col.id === 'amount') {
                                                        return (
                                                            <div key={col.id} className="text-right">
                                                                <div className="font-bold text-slate-700 font-mono text-sm tracking-tight">
                                                                    {loan.amountFormatted}
                                                                </div>
                                                                <div className="text-[10px] text-slate-500 font-medium bg-slate-100 inline-block px-1.5 rounded mt-1">
                                                                    {loan.program}
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    if (col.id === 'stage') {
                                                        return (
                                                            <div key={col.id}>
                                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide border ${loan.stage === 'New' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                    loan.stage === 'Packaging' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                                        loan.stage === 'Underwriting' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                                            loan.stage === 'Credit Committee Review' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                                                loan.stage === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                                                    loan.stage === 'Closed / Funded' ? 'bg-teal-50 text-teal-700 border-teal-100' :
                                                                                        ['Withdrawn', 'Declined'].includes(loan.stage) ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                                                            'bg-slate-50 text-slate-600 border-slate-200'
                                                                    }`}>
                                                                    <StageIcon size={12} strokeWidth={2.5} />
                                                                    {loan.stage}
                                                                </span>
                                                            </div>
                                                        );
                                                    }

                                                    if (col.id === 'sla') {
                                                        return (
                                                            <div key={col.id}>
                                                                <div className={`flex items-center gap-2 text-xs font-bold ${loan.slaStatus === 'breach' ? 'text-red-600' :
                                                                    loan.slaStatus === 'warning' ? 'text-amber-600' :
                                                                        'text-emerald-600'
                                                                    }`}>
                                                                    {loan.slaStatus === 'breach' && <AlertCircle size={14} />}
                                                                    {loan.slaStatus === 'warning' && <Clock size={14} />}
                                                                    {loan.slaStatus === 'track' && <CheckCircle size={14} />}
                                                                    <span>{loan.slaText}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    if (col.id === 'actions') {
                                                        return (
                                                            <div key={col.id} className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                                <button
                                                                    onClick={() => alert(`Message ${loan.id}`)}
                                                                    className="hidden xl:flex p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Message"
                                                                >
                                                                    <MessageSquare size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => alert(`Email ${loan.id}`)}
                                                                    className="hidden xl:flex p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Email"
                                                                >
                                                                    <Mail size={16} />
                                                                </button>

                                                                {/* More Menu (Click Triggered) */}
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setActiveRowMenu(activeRowMenu === loan.id ? null : loan.id);
                                                                        }}
                                                                        className={`p-1.5 rounded-lg transition-colors ${activeRowMenu === loan.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                                                                    >
                                                                        <MoreHorizontal size={16} />
                                                                    </button>

                                                                    {activeRowMenu === loan.id && (
                                                                        <>
                                                                            <div className="fixed inset-0 z-40 cursor-default" onClick={(e) => { e.stopPropagation(); setActiveRowMenu(null); }}></div>
                                                                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                                                                                <div className="flex flex-col gap-0.5">
                                                                                    <button onClick={(e) => { e.stopPropagation(); alert(`View ${loan.id}`); setActiveRowMenu(null); }} className="w-full text-left px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2">
                                                                                        <Eye size={13} className="text-slate-400" /> View Loan
                                                                                    </button>
                                                                                    <button onClick={(e) => { e.stopPropagation(); alert(`Edit ${loan.id}`); setActiveRowMenu(null); }} className="w-full text-left px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2">
                                                                                        <Pencil size={13} className="text-slate-400" /> Edit Loan
                                                                                    </button>
                                                                                    <button onClick={(e) => { e.stopPropagation(); alert(`Assign ${loan.id}`); setActiveRowMenu(null); }} className="w-full text-left px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2">
                                                                                        <UserCog size={13} className="text-slate-400" /> Assign LO
                                                                                    </button>
                                                                                    <div className="h-px bg-slate-100 my-0.5"></div>
                                                                                    <button onClick={(e) => { e.stopPropagation(); alert(`Delete ${loan.id}`); setActiveRowMenu(null); }} className="w-full text-left px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded flex items-center gap-2">
                                                                                        <Trash2 size={13} className="text-red-400" /> Delete
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    return (
                                                        <div key={col.id} className="text-sm text-slate-600">
                                                            {loan[col.id] || '-'}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination Footer */}
                            <Pagination
                                currentPage={currentPage}
                                totalItems={filteredAndSortedLoans.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={(newLimit) => {
                                    setItemsPerPage(newLimit);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

// --- Column Manager Modal Component (Reused/Adapted) ---
const ColumnManagerModal = ({ isOpen, onClose, currentColumns, onSave }) => {
    if (!isOpen) return null;

    // Available fields mock (Loan specific)
    const [availableFields] = useState([
        { id: 'phone', label: 'Borrower Phone', category: 'Contact Info' },
        { id: 'email', label: 'Borrower Email', category: 'Contact Info' },
        { id: 'industry', label: 'Industry', category: 'Business Info' },
        { id: 'relationship', label: 'Relationship', category: 'Business Info' },
        { id: 'program', label: 'Loan Program', category: 'Loan Info' },
        { id: 'taxId', label: 'Tax ID / EIN', category: 'Business Info' },
        { id: 'date', label: 'App Date', category: 'System' },
    ]);

    const [activeCols, setActiveCols] = useState(currentColumns);
    const [searchQuery, setSearchQuery] = useState('');

    React.useEffect(() => {
        if (isOpen) {
            setActiveCols(currentColumns);
        }
    }, [isOpen, currentColumns]);

    const isDirty = (col) => {
        const originalIndex = currentColumns.findIndex(c => c.id === col.id);
        const currentIndex = activeCols.findIndex(c => c.id === col.id);
        if (originalIndex === -1) return 'new';
        if (originalIndex !== currentIndex) return 'moved';
        return null;
    };

    const visibleCount = activeCols.filter(c => c.id !== 'select').length;
    const MAX_COLUMNS = 15;
    const isAtLimit = visibleCount >= MAX_COLUMNS;

    const toggleAvailability = (field) => {
        if (activeCols.some(c => c.id === field.id)) {
            setActiveCols(activeCols.filter(c => c.id !== field.id));
        } else {
            if (isAtLimit) return;
            setActiveCols([...activeCols, { ...field, visible: true, width: '1.5fr' }]);
        }
    };

    const removeCol = (id) => {
        if (activeCols.find(c => c.id === id)?.fixed) return;
        setActiveCols(activeCols.filter(c => c.id !== id));
    };

    const moveCol = (index, direction) => {
        const newCols = [...activeCols];
        if (direction === 'up') {
            if (index === 0) return;
            [newCols[index], newCols[index - 1]] = [newCols[index - 1], newCols[index]];
        } else {
            if (index === newCols.length - 1) return;
            [newCols[index], newCols[index + 1]] = [newCols[index + 1], newCols[index]];
        }
        setActiveCols(newCols);
    };

    const filteredAvailable = availableFields.filter(f =>
        f.label.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !activeCols.some(c => c.id === f.id)
    );

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col h-[600px] animate-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Manage Columns</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>
                <div className="flex-1 flex overflow-hidden">
                    <div className="w-1/2 p-6 border-r border-slate-200 bg-slate-50 flex flex-col">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Available Fields</h3>
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                placeholder="Search fields..."
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white"
                            />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {filteredAvailable.length === 0 ? (
                                <div className="text-center text-slate-400 text-sm py-8 italic">No fields match your search</div>
                            ) : (
                                filteredAvailable.map(field => (
                                    <button
                                        key={field.id}
                                        onClick={() => toggleAvailability(field)}
                                        disabled={isAtLimit}
                                        className="w-full flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:border-slate-200"
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-slate-700">{field.label}</div>
                                            <div className="text-[10px] text-slate-400">{field.category}</div>
                                        </div>
                                        <Plus size={16} className="text-slate-300 group-hover:text-blue-600" />
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="w-1/2 p-6 flex flex-col bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visible Columns</h3>
                            <span className="text-xs text-slate-400 font-medium">{visibleCount}/{MAX_COLUMNS}</span>
                        </div>
                        {isAtLimit && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-medium flex items-center justify-center animate-in fade-in slide-in-from-top-1">
                                You can show up to {MAX_COLUMNS} columns at a time.
                            </div>
                        )}
                        <div className="flex-1 overflow-y-auto space-y-2">
                            {activeCols.map((col, idx) => {
                                const status = isDirty(col);
                                let borderClass = 'border-slate-100 hover:border-slate-300';
                                if (status === 'new') borderClass = 'border-emerald-200 bg-emerald-50/30';
                                if (status === 'moved') borderClass = 'border-amber-200 bg-amber-50/30';

                                return (
                                    <div key={col.id} className={`flex items-center gap-3 p-2 border rounded-lg bg-white transition-all group ${borderClass}`}>
                                        <div className="text-slate-300 cursor-move"><GripVertical size={16} /></div>
                                        <div className="flex-1 text-sm font-medium text-slate-700">{col.label || <span className="text-slate-400 italic">Selection Checkbox</span>}</div>
                                        {!col.fixed && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => moveCol(idx, 'up')} disabled={idx === 0 || activeCols[idx - 1]?.fixed} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30"><ArrowUp size={14} /></button>
                                                <button onClick={() => moveCol(idx, 'down')} disabled={idx === activeCols.length - 1} className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30"><ArrowDown size={14} /></button>
                                                <div className="w-px h-3 bg-slate-200 mx-1"></div>
                                                <button onClick={() => removeCol(col.id)} className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"><X size={14} /></button>
                                            </div>
                                        )}
                                        {col.fixed && <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Fixed</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    <button onClick={() => onSave(activeCols)} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">Save Changes</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LoansList;
