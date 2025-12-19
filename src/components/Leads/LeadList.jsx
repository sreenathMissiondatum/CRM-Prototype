
import React, { useState, useMemo, useRef } from 'react';
import Pagination from '../Shared/Pagination';
import StageScroll from '../Shared/StageScroll';
import {
    Search, Filter, Plus, Ellipsis, User, Calendar,
    ChevronLeft, ChevronRight, Download, LayoutGrid, Check,
    ArrowUpDown, Table, FileText, File, Mail, MessageSquare,
    TrendingUp, Star, Briefcase, Settings, Upload, FileInput,
    Database, X, ArrowUp, ArrowDown, GripVertical, Eye, Pencil,
    UserCog, ArrowRightCircle, Trash2
} from 'lucide-react';
import { createPortal } from 'react-dom';
import LeadFilterDrawer from './LeadFilterDrawer';

const LeadList = ({ leads, selectedLeadId, onSelectLead, onCreateLead, compact, currentFilters, onUpdateFilters }) => {
    // State
    const [activeStage, setActiveStage] = useState('All');
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false); // New "More" Menu
    const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false); // New Manager Modal
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false); // Restored Drawer
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [sortConfig, setSortConfig] = useState({ key: 'lastActivity', label: 'Last Activity' });
    const [activeRowMenu, setActiveRowMenu] = useState(null); // Track open row menu ID
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Columns Config ('actions' is fixed and permanent)
    const [columns, setColumns] = useState([
        { id: 'select', label: '', visible: true, width: '40px', fixed: true },
        { id: 'name', label: 'Lead Name', visible: true, width: '3fr' },
        { id: 'business', label: 'Business', visible: true, width: '2fr' },
        { id: 'officer', label: 'Assigned LO', visible: true, width: '1.5fr' },
        { id: 'source', label: 'Source', visible: true, width: '1.5fr' },
        { id: 'stage', label: 'Stage', visible: true, width: '1.5fr' },
        { id: 'lastActivity', label: 'Last Activity', visible: true, width: '1.5fr' },
        { id: 'actions', label: 'Actions', visible: true, width: '110px', fixed: true }
    ]);

    const stages = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Disqualified', 'Nurture', 'Lost', 'On Hold']; // Added more to test scroll

    // Helper functions
    const toggleColumn = (id) => {
        setColumns(cols => cols.map(col =>
            col.id === id ? { ...col, visible: !col.visible } : col
        ));
    };

    const handleUpdateColumns = (newColumns) => {
        // Ensure 'actions' column is always preserved at the end
        const preservedColumns = newColumns.filter(c => c.id !== 'actions');
        const actionsCol = columns.find(c => c.id === 'actions') || { id: 'actions', label: 'Actions', visible: true, width: '110px', fixed: true };

        setColumns([...preservedColumns, actionsCol]);
        setIsColumnManagerOpen(false);
    };

    const toggleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(paginatedLeads.map(l => l.id)));
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
        const idsToExport = selectedIds.size > 0 ? Array.from(selectedIds) : filteredAndSortedLeads.map(l => l.id);
        alert(`Successfully exported ${idsToExport.length} leads to ${format.toUpperCase()}.`);
        setIsExportMenuOpen(false);
    };

    const changeSort = (key, label) => {
        setSortConfig({ key, label });
        setIsSortMenuOpen(false);
        setCurrentPage(1);
    };

    // Filter & Sort
    const filteredAndSortedLeads = useMemo(() => {
        let result = activeStage === 'All'
            ? leads
            : leads.filter(l => l.stage === activeStage);

        // Apply Global Drawer Filters if they exist
        if (currentFilters) {
            result = result.filter(item => {
                // Ownership Filter
                if (currentFilters.ownership && currentFilters.ownership !== 'Any User') {
                    const targetOwner = currentFilters.ownership === 'Me' ? 'Alex Morgan' : currentFilters.ownership;
                    if (item.assignedOfficer !== targetOwner) return false;
                }

                if (currentFilters.stages && currentFilters.stages.length > 0 && !currentFilters.stages.includes(item.stage)) return false;
                if (currentFilters.sources && currentFilters.sources.length > 0 && !currentFilters.sources.includes(item.source)) return false;
                if (currentFilters.businessName && !item.businessName.toLowerCase().includes(currentFilters.businessName.toLowerCase())) return false;
                if (currentFilters.activity === 'Today' && item.lastActivity !== 'Today') return false;
                if (currentFilters.activity === 'No Activity' && item.lastActivity !== 'None') return false;
                if (currentFilters.risk === 'High Risk' && item.urgencyStatus !== 'high') return false;
                if (currentFilters.risk === 'Normal' && item.urgencyStatus === 'high') return false;
                return true;
            });
        }

        result = [...result].sort((a, b) => {
            if (sortConfig.key === 'lastActivity') {
                const parseActivityDate = (activity) => {
                    if (activity === 'Today') return new Date();
                    const currentYear = new Date().getFullYear();
                    return new Date(`${activity} ${currentYear}`);
                };
                const dateA = parseActivityDate(a.lastActivity);
                const dateB = parseActivityDate(b.lastActivity);
                return dateB - dateA;
            }
            if (sortConfig.key === 'name') return a.name.localeCompare(b.name);
            if (sortConfig.key === 'stage') return a.stage.localeCompare(b.stage);
            return 0;
        });
        return result;
    }, [leads, activeStage, sortConfig, currentFilters]);

    // Active filter count for badge
    const activeFilterCount = useMemo(() => {
        if (!currentFilters) return 0;
        let count = 0;
        if (currentFilters.ownership !== 'Any User') count++;
        if (currentFilters.stages?.length > 0) count++;
        if (currentFilters.sources?.length > 0) count++;
        if (currentFilters.activity !== 'Any Time') count++;
        if (currentFilters.businessName) count++;
        if (currentFilters.risk !== 'All') count++;
        return count;
    }, [currentFilters]);

    // Pagination
    const totalPages = Math.ceil(filteredAndSortedLeads.length / itemsPerPage);
    const paginatedLeads = filteredAndSortedLeads.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const visibleColumns = columns.filter(c => c.visible);
    const gridTemplateColumns = visibleColumns.map(c => c.width).join(' ');

    const stats = {
        total: leads.length,
        new: leads.filter(l => l.stage === 'New').length,
        qualified: leads.filter(l => l.stage === 'Qualified').length
    };

    // Compact View
    if (compact) {
        return (
            <div className="flex flex-col h-full bg-white">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Leads</h2>
                    <button onClick={onCreateLead} className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition-colors shadow-sm">
                        <Plus size={16} />
                    </button>
                </div>
                <div className="p-2 space-y-2 overflow-y-auto flex-1">
                    {filteredAndSortedLeads.map(lead => (
                        <div
                            key={lead.id}
                            onClick={() => onSelectLead(lead)}
                            className={`p-3 cursor-pointer hover:bg-slate-50 rounded-lg border transition-all ${selectedLeadId === lead.id
                                ? 'bg-blue-50/50 border-blue-200 ring-1 ring-blue-100'
                                : 'border-slate-100 hover:border-slate-200'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`font-semibold text-sm ${selectedLeadId === lead.id ? 'text-blue-700' : 'text-slate-900'}`}>{lead.name}</span>
                                <span className="text-[10px] text-slate-500">{lead.stage}</span>
                            </div>
                            <div className="text-xs text-slate-500 mb-2 truncate">{lead.businessName}</div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <User size={10} />
                                <span>{lead.assignedOfficer}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Full View (Grid)
    // Scroll to top on pagination
    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, activeStage]);

    return (
        <div className="flex-1 bg-slate-50 relative min-h-screen flex flex-col">
            <div className="max-w-7xl mx-auto w-full p-8 flex flex-col">

                {/* Header Actions */}
                <div className="flex justify-between items-end mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Leads</h2>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                                <TrendingUp size={14} className="text-emerald-500" />
                                {stats.new} New Leads
                            </span>
                            <span className="text-slate-300">|</span>
                            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                                <Star size={14} className="text-amber-500" />
                                {stats.qualified} Qualified
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 relative z-[45]">
                        <button onClick={onCreateLead} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-200">
                            <Plus size={16} />
                            <span>Create Lead</span>
                        </button>

                        {/* Export Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                <Download size={16} />
                                {selectedIds.size > 0 ? `Export(${selectedIds.size})` : 'Export'}
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

                        {/* More Dropdown (NEW) */}
                        <div className="relative">
                            <button
                                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                                className="p-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                <Ellipsis size={20} />
                            </button>
                            {isMoreMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsMoreMenuOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 p-1 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                                        <button className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors flex items-center gap-3">
                                            <Upload size={16} className="text-slate-400" /> Import Leads
                                        </button>
                                        <button className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors flex items-center gap-3">
                                            <Database size={16} className="text-slate-400" /> Bulk Update
                                        </button>
                                        <div className="h-px bg-slate-100 my-1"></div>
                                        <button className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors flex items-center gap-3">
                                            <FileInput size={16} className="text-slate-400" /> Manage Lead Sources
                                        </button>
                                        <button className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors flex items-center gap-3">
                                            <FileText size={16} className="text-slate-400" /> Download Template
                                        </button>
                                        <div className="h-px bg-slate-100 my-1"></div>
                                        <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-3">
                                            <Settings size={16} className="text-slate-400" /> Settings
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
                                    acc[stage] = stage === 'All' ? leads.length : leads.filter(l => l.stage === stage).length;
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
                                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-20 p-1 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">Sort By</div>
                                                <button onClick={() => changeSort('lastActivity', 'Last Activity')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between">
                                                    <span>Last Activity</span>
                                                    {sortConfig.key === 'lastActivity' && <Check size={14} className="text-blue-600" />}
                                                </button>
                                                <button onClick={() => changeSort('name', 'Lead Name')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between">
                                                    <span>Lead Name</span>
                                                    {sortConfig.key === 'name' && <Check size={14} className="text-blue-600" />}
                                                </button>
                                                <button onClick={() => changeSort('stage', 'Stage')} className="w-full text-left px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors flex justify-between">
                                                    <span>Stage</span>
                                                    {sortConfig.key === 'stage' && <Check size={14} className="text-blue-600" />}
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
                                            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-xl z-20 p-1 text-left animate-in fade-in slide-in-from-top-2 duration-200">
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

                                {/* Filter Button (Restored) */}
                                <button
                                    onClick={() => setIsFilterDrawerOpen(true)}
                                    className={`flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 relative ${activeFilterCount > 0 ? 'text-blue-600 border-blue-200 bg-blue-50' : ''}`}
                                >
                                    <Filter size={16} />
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold border-2 border-white">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Filter Drawer */}
                    {currentFilters && (
                        <LeadFilterDrawer
                            isOpen={isFilterDrawerOpen}
                            onClose={() => setIsFilterDrawerOpen(false)}
                            filters={currentFilters}
                            onApplyFilters={onUpdateFilters}
                        />
                    )}

                    {/* Column Manager Modal (NEW) */}
                    <ColumnManagerModal
                        isOpen={isColumnManagerOpen}
                        onClose={() => setIsColumnManagerOpen(false)}
                        currentColumns={columns.filter(c => c.id !== 'actions')}
                        onSave={handleUpdateColumns}
                    />

                    {/* Grid Table Container */}
                    <div className="flex flex-col relative rounded-b-2xl">

                        {/* Combined Header & Body - Natural Height */}
                        <div className="bg-white">

                            {/* Header (Sticky) */}
                            <div
                                className="grid gap-4 px-6 py-3 bg-white border-b border-l-4 border-transparent border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider items-center sticky top-20 z-40 shadow-sm"
                                style={{ gridTemplateColumns }}
                            >
                                {columns.map(col => (
                                    col.visible && (
                                        <div key={col.id} className={col.id === 'actions' ? 'text-right' : ''}>
                                            {col.id === 'select' ? (
                                                <input
                                                    type="checkbox"
                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                    onChange={toggleSelectAll}
                                                    checked={paginatedLeads.length > 0 && paginatedLeads.every(l => selectedIds.has(l.id))}
                                                />
                                            ) : col.label}
                                        </div>
                                    )
                                ))}
                            </div>

                            {/* Body Rows */}
                            <div className="divide-y divide-slate-100">
                                {paginatedLeads.map(lead => {
                                    const isSelected = selectedIds.has(lead.id);

                                    // Color coding based on urgency
                                    let borderClass = 'border-transparent';
                                    let bgClass = '';

                                    if (lead.urgencyStatus === 'high') {
                                        borderClass = 'border-l-red-500';
                                        bgClass = 'bg-red-50/10';
                                    } else if (lead.urgencyStatus === 'medium') {
                                        borderClass = 'border-l-amber-500';
                                        bgClass = 'bg-amber-50/10';
                                    }

                                    return (
                                        <div
                                            key={lead.id}
                                            onClick={() => onSelectLead(lead)}
                                            className={`group hover:bg-blue-50/30 transition-all cursor-pointer relative ${isSelected ? 'bg-blue-50/40' : bgClass}`}
                                        >
                                            <div
                                                className={`grid gap-4 px-6 py-4 items-center border-l-4 ${borderClass} hover:border-blue-200`}
                                                style={{ gridTemplateColumns }}
                                            >
                                                {columns.map(col => {
                                                    if (!col.visible) return null;

                                                    // --- SELECT COLUMN ---
                                                    if (col.id === 'select') {
                                                        return (
                                                            <div key={col.id} onClick={(e) => e.stopPropagation()}>
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                                    checked={isSelected}
                                                                    onChange={() => toggleSelectRow(lead.id)}
                                                                />
                                                            </div>
                                                        );
                                                    }

                                                    // --- NAME COLUMN ---
                                                    if (col.id === 'name') {
                                                        return (
                                                            <div key={col.id}>
                                                                <div className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors text-sm">
                                                                    {lead.name}
                                                                </div>
                                                                <div className="text-[11px] text-slate-500 mt-0.5">CEO / Primary</div>
                                                            </div>
                                                        );
                                                    }

                                                    // --- BUSINESS COLUMN ---
                                                    if (col.id === 'business') {
                                                        return (
                                                            <div key={col.id} className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                                                                <Briefcase size={12} className="text-slate-400" />
                                                                {lead.businessName}
                                                            </div>
                                                        );
                                                    }

                                                    // --- OFFICER COLUMN ---
                                                    if (col.id === 'officer') {
                                                        return (
                                                            <div key={col.id} className="flex items-center gap-2">
                                                                {lead.assignedOfficer !== 'Unassigned' && (
                                                                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                                        {lead.assignedOfficer.charAt(0)}
                                                                    </div>
                                                                )}
                                                                <span className="text-xs font-medium text-slate-600">{lead.assignedOfficer}</span>
                                                            </div>
                                                        );
                                                    }

                                                    // --- SOURCE COLUMN ---
                                                    if (col.id === 'source') {
                                                        return (
                                                            <div key={col.id}>
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                                    {lead.source}
                                                                </span>
                                                            </div>
                                                        );
                                                    }

                                                    // --- STAGE COLUMN ---
                                                    if (col.id === 'stage') {
                                                        return (
                                                            <div key={col.id}>
                                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${lead.stage === 'New' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                                                                    lead.stage === 'Contacted' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                                        lead.stage === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                                            lead.stage === 'Converted' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                                                'bg-slate-50 text-slate-600 border-slate-200'
                                                                    }`}>
                                                                    {lead.stage}
                                                                </span>
                                                            </div>
                                                        );
                                                    }

                                                    // --- ACTIVITY COLUMN ---
                                                    if (col.id === 'lastActivity') {
                                                        return (
                                                            <div key={col.id} className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                <Calendar size={12} />
                                                                {lead.lastActivity}
                                                            </div>
                                                        );
                                                    }

                                                    // --- ACTIONS COLUMN ---
                                                    if (col.id === 'actions') {
                                                        return (
                                                            <div key={col.id} className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                                                {/* Chat - Hidden on small screens */}
                                                                <button
                                                                    onClick={() => alert(`Open Chat for ${lead.name}`)}
                                                                    className="hidden xl:flex p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Chat"
                                                                >
                                                                    <MessageSquare size={16} />
                                                                </button>

                                                                {/* Email - Hidden on small screens */}
                                                                <button
                                                                    onClick={() => alert(`Compose Email to ${lead.name}`)}
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
                                                                            setActiveRowMenu(activeRowMenu === lead.id ? null : lead.id);
                                                                        }}
                                                                        className={`p-1.5 rounded-lg transition-colors ${activeRowMenu === lead.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                                                                    >
                                                                        <Ellipsis size={16} />
                                                                    </button>

                                                                    {activeRowMenu === lead.id && (
                                                                        <>
                                                                            <div className="fixed inset-0 z-40 cursor-default" onClick={(e) => { e.stopPropagation(); setActiveRowMenu(null); }}></div>
                                                                            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-1 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                                                                                <div className="flex flex-col gap-0.5">
                                                                                    <button onClick={(e) => { e.stopPropagation(); alert(`Open Chat for ${lead.name}`); setActiveRowMenu(null); }} className="xl:hidden w-full text-left px-2 py-1 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded flex items-center gap-2">
                                                                                        <MessageSquare size={13} className="text-slate-400" /> Chat
                                                                                    </button>
                                                                                    <button onClick={(e) => { e.stopPropagation(); alert(`Compose Email to ${lead.name}`); setActiveRowMenu(null); }} className="xl:hidden w-full text-left px-2 py-1 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded flex items-center gap-2">
                                                                                        <Mail size={13} className="text-slate-400" /> Email
                                                                                    </button>
                                                                                    <div className="xl:hidden h-px bg-slate-100 my-0.5"></div>
                                                                                    <button className="w-full text-left px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2" onClick={() => setActiveRowMenu(null)}>
                                                                                        <Eye size={13} className="text-slate-400" /> View Lead
                                                                                    </button>
                                                                                    <button className="w-full text-left px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2" onClick={() => setActiveRowMenu(null)}>
                                                                                        <Pencil size={13} className="text-slate-400" /> Edit Lead
                                                                                    </button>
                                                                                    <button className="w-full text-left px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2" onClick={() => setActiveRowMenu(null)}>
                                                                                        <UserCog size={13} className="text-slate-400" /> Reassign LO
                                                                                    </button>
                                                                                    <button className="w-full text-left px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2" onClick={() => setActiveRowMenu(null)}>
                                                                                        <ArrowRightCircle size={13} className="text-slate-400" /> Convert to Loan
                                                                                    </button>
                                                                                    <div className="h-px bg-slate-100 my-0.5"></div>
                                                                                    <button className="w-full text-left px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded flex items-center gap-2" onClick={() => setActiveRowMenu(null)}>
                                                                                        <Trash2 size={13} className="text-red-400 group-hover:text-red-600" /> Delete Lead
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    }

                                                    // --- DEFAULT / DYNAMIC COLUMNS ---
                                                    return (
                                                        <div key={col.id} className="text-sm text-slate-600">
                                                            {lead[col.id] || '-'}
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
                                totalItems={filteredAndSortedLeads.length}
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
        </div>
    );
};

// --- Column Manager Modal Component ---
const ColumnManagerModal = ({ isOpen, onClose, currentColumns, onSave }) => {
    if (!isOpen) return null;

    // Available fields mock
    const [availableFields] = useState([
        // Contact Info
        { id: 'phone', label: 'Phone Number', category: 'Contact Info' },
        { id: 'email', label: 'Email Address', category: 'Contact Info' },
        { id: 'mobile', label: 'Mobile Phone', category: 'Contact Info' },
        { id: 'jobTitle', label: 'Job Title', category: 'Contact Info' },
        { id: 'department', label: 'Department', category: 'Contact Info' },
        { id: 'linkedIn', label: 'LinkedIn Profile', category: 'Contact Info' },

        // Business Info
        { id: 'revenue', label: 'Annual Revenue', category: 'Business Info' },
        { id: 'employees', label: 'Employee Count', category: 'Business Info' },
        { id: 'industry', label: 'Industry', category: 'Business Info' },
        { id: 'website', label: 'Website', category: 'Business Info' },
        { id: 'taxId', label: 'Tax ID / EIN', category: 'Business Info' },
        { id: 'founded', label: 'Year Founded', category: 'Business Info' },

        // Location
        { id: 'address', label: 'Street Address', category: 'Location' },
        { id: 'city', label: 'City', category: 'Location' },
        { id: 'state', label: 'State', category: 'Location' },
        { id: 'zip', label: 'Zip Code', category: 'Location' },
        { id: 'country', label: 'Country', category: 'Location' },
        { id: 'timezone', label: 'Timezone', category: 'Location' },

        // System / Metadata
        { id: 'createdAt', label: 'Created Date', category: 'System' },
        { id: 'updatedAt', label: 'Last Updated', category: 'System' },
        { id: 'lastContacted', label: 'Last Contacted', category: 'System' },
        { id: 'leadScore', label: 'Lead Score', category: 'System' },
        { id: 'referrer', label: 'Referrer', category: 'System' },
        { id: 'campaign', label: 'Campaign Source', category: 'System' }
    ]);

    // Local state for mainpulation before save
    const [activeCols, setActiveCols] = useState(currentColumns);
    const [searchQuery, setSearchQuery] = useState('');

    // Sync state when modal opens
    React.useEffect(() => {
        if (isOpen) {
            setActiveCols(currentColumns);
        }
    }, [isOpen, currentColumns]);

    // Check for changes to highlight
    const isDirty = (col) => {
        const originalIndex = currentColumns.findIndex(c => c.id === col.id);
        const currentIndex = activeCols.findIndex(c => c.id === col.id);

        // New column (was not visible before)
        if (originalIndex === -1) return 'new';

        // Moved column
        if (originalIndex !== currentIndex) return 'moved';

        return null;
    };

    // Validation: Max 15 columns (excluding 'select' and 'actions', but actions is already filtered out)
    const visibleCount = activeCols.filter(c => c.id !== 'select').length;
    const MAX_COLUMNS = 15;
    const isAtLimit = visibleCount >= MAX_COLUMNS;

    const toggleAvailability = (field) => {
        // If already in active, remove it
        if (activeCols.some(c => c.id === field.id)) {
            setActiveCols(activeCols.filter(c => c.id !== field.id));
        } else {
            // Check limit before adding
            if (isAtLimit) return;
            // Add to active
            setActiveCols([...activeCols, { ...field, visible: true, width: '1.5fr' }]);
        }
    };

    const removeCol = (id) => {
        // Don't remove fixed columns
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
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Manage Columns</h2>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex overflow-hidden">

                    {/* LEFT PANEL: Available */}
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

                    {/* RIGHT PANEL: Selected */}
                    <div className="w-1/2 p-6 flex flex-col bg-white">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Visible Columns</h3>
                            <span className="text-xs text-slate-400 font-medium">
                                {visibleCount}/{MAX_COLUMNS}
                            </span>
                        </div>

                        {/* Validation Warning */}
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
                                        <div className="text-slate-300 cursor-move">
                                            <GripVertical size={16} />
                                        </div>
                                        <div className="flex-1 text-sm font-medium text-slate-700">
                                            {col.label || <span className="text-slate-400 italic">Selection Checkbox</span>}
                                        </div>

                                        {!col.fixed && (
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => moveCol(idx, 'up')}
                                                    disabled={idx === 0 || activeCols[idx - 1]?.fixed}
                                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30"
                                                >
                                                    <ArrowUp size={14} />
                                                </button>
                                                <button
                                                    onClick={() => moveCol(idx, 'down')}
                                                    disabled={idx === activeCols.length - 1}
                                                    className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-30"
                                                >
                                                    <ArrowDown size={14} />
                                                </button>
                                                <div className="w-px h-3 bg-slate-200 mx-1"></div>
                                                <button
                                                    onClick={() => removeCol(col.id)}
                                                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        )}
                                        {col.fixed && <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">Fixed</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    <button onClick={() => onSave(activeCols)} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">Save Changes</button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LeadList;
