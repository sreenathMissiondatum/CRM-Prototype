
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
import AvatarWithPresence from '../Shared/AvatarWithPresence';
import { createPortal } from 'react-dom';
import LeadFilterDrawer from './LeadFilterDrawer';
import ImportLeadsModal from './ImportLeadsModal';
import BulkUpdateModal from './BulkUpdateModal';
import ReassignLOModal from './ReassignLOModal';
import { downloadLeadTemplate } from '../../utils/leadTemplateUtils';

const LeadList = ({ leads, selectedLeadId, onSelectLead, onCreateLead, compact, currentFilters, onUpdateFilters, onImportLeads, onBulkUpdate, onUpdateLead }) => {
    // State
    const [activeStage, setActiveStage] = useState('All');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false); // Import Modal State
    const [isBulkUpdateModalOpen, setIsBulkUpdateModalOpen] = useState(false); // Bulk Update Modal State
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false); // New "More" Menu
    const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false); // New Manager Modal
    const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false); // Restored Drawer
    const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
    const [leadForReassign, setLeadForReassign] = useState(null);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [sortConfig, setSortConfig] = useState({ key: 'lastActivity', direction: 'desc' }); // Updated Sort State
    const [activeRowMenu, setActiveRowMenu] = useState(null); // Track open row menu ID
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 }); // Track menu position
    const [draggedColumn, setDraggedColumn] = useState(null); // For Reordering
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState(''); // Global Search State

    // Columns Config ('actions' is fixed and permanent)
    const [columns, setColumns] = useState([
        { id: 'select', label: '', visible: true, width: 50, fixed: true, sortable: false },
        { id: 'name', label: 'Lead Name', visible: true, width: 300, sortable: true },
        { id: 'business', label: 'Business', visible: true, width: 200, sortable: true },
        { id: 'officer', label: 'Assigned LO', visible: true, width: 150, sortable: true },
        { id: 'source', label: 'Source', visible: true, width: 150, sortable: true },
        { id: 'stage', label: 'Stage', visible: true, width: 150, sortable: true },
        { id: 'lastActivity', label: 'Last Activity', visible: true, width: 150, sortable: true },
        { id: 'actions', label: 'Actions', visible: true, width: 110, fixed: true, sortable: false }
    ]);

    const stages = ['All', 'New', 'Attempting Contact', 'Pre-Screening', 'Hold', 'Nurturing', 'Qualified', 'Adverse Action', 'Cold', 'Unqualified', 'Converted'];

    // Helper functions
    const toggleColumn = (id) => {
        setColumns(cols => cols.map(col =>
            col.id === id ? { ...col, visible: !col.visible } : col
        ));
    };

    // --- SORTING ---
    const handleSort = (key) => {
        setSortConfig(current => {
            if (current.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            // Default sort direction for new columns
            // Dates/Time usually start Descending, Text starts Ascending
            if (key === 'lastActivity') return { key, direction: 'desc' };
            return { key, direction: 'asc' };
        });
    };

    // --- CONTEXTUAL DEFAULTS ---
    React.useEffect(() => {
        setSortConfig({ key: 'lastActivity', direction: 'desc' });
        setCurrentPage(1);
    }, [activeStage]);

    // --- DRAG & REORDER ---
    const handleDragStart = (e, index) => {
        setDraggedColumn(index);
        e.dataTransfer.effectAllowed = 'move';
        // HTML5 Drag ghost image customization if needed
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedColumn === null || draggedColumn === dropIndex) return;

        const newCols = [...columns];
        const draggedItem = newCols[draggedColumn];

        // Prevent moving fixed columns or dropping past them if logic strictly forbids, 
        // but for now just basic reorder
        if (draggedItem.fixed || newCols[dropIndex].fixed) return;

        newCols.splice(draggedColumn, 1);
        newCols.splice(dropIndex, 0, draggedItem);
        setColumns(newCols);
        setDraggedColumn(null);
    };

    // --- RESIZING ---
    const [resizingCol, setResizingCol] = useState(null);
    const resizingRef = useRef(null); // Ref to track mouse move across window

    const startResize = (e, colId) => {
        e.preventDefault();
        e.stopPropagation();
        const col = columns.find(c => c.id === colId);
        const startW = typeof col.width === 'number' ? col.width : parseInt(col.width, 10) || 150;
        setResizingCol({ id: colId, startX: e.pageX, startWidth: startW });
    };

    const onMouseMove = React.useCallback((e) => {
        if (!resizingCol) return;
        const diff = e.pageX - resizingCol.startX;
        const newWidth = Math.max(50, resizingCol.startWidth + diff); // Min width 50

        setColumns(cols => cols.map(col =>
            col.id === resizingCol.id ? { ...col, width: newWidth } : col
        ));
    }, [resizingCol]);

    const onMouseUp = React.useCallback(() => {
        setResizingCol(null);
    }, []);

    React.useEffect(() => {
        if (resizingCol) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [resizingCol, onMouseMove, onMouseUp]);

    const handleUpdateColumns = (newColumns) => {
        // Ensure 'actions' column is always preserved at the end
        const preservedColumns = newColumns.filter(c => c.id !== 'actions');
        const actionsCol = columns.find(c => c.id === 'actions') || { id: 'actions', label: 'Actions', visible: true, width: 110, fixed: true, sortable: false };

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

    // --- REASSIGN HANDLER ---
    const handleReassignLead = (newOfficer) => {
        if (!leadForReassign) return;

        // Optimistic Update / Callback
        if (onUpdateLead) {
            onUpdateLead(leadForReassign.id, {
                assignedOfficer: newOfficer.name
            });
        }

        alert("Loan Officer reassigned successfully.");
        setLeadForReassign(null);
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

        // Global Fuzzy Search (Multi-field, Token-based)
        if (searchQuery) {
            const queryTokens = searchQuery.toLowerCase().split(' ').filter(t => t.length > 0);
            result = result.filter(item => {
                const searchableText = [
                    item.name,
                    item.businessName,
                    item.email,
                    item.assignedOfficer,
                    item.stage,
                    item.source,
                    item.phone || '', // Phone might be missing in some mocks
                    item.id
                ].join(' ').toLowerCase();

                return queryTokens.every(token => searchableText.includes(token));
            });
        }

        result = [...result].sort((a, b) => {
            if (!sortConfig.direction) return 0;
            const { key, direction } = sortConfig;
            const multiplier = direction === 'asc' ? 1 : -1;

            if (key === 'lastActivity') {
                const parseActivityDate = (activity) => {
                    if (activity === 'Today') return new Date();
                    const currentYear = new Date().getFullYear();
                    // Handle "Dec 3" or similar
                    return new Date(`${activity} ${currentYear}`);
                };
                const dateA = parseActivityDate(a.lastActivity);
                const dateB = parseActivityDate(b.lastActivity);
                return (dateA - dateB) * multiplier;
            }
            if (key === 'stage') {
                // Custom Stage Order could be implemented here, simple string for now
                return a.stage.localeCompare(b.stage) * multiplier;
            }

            // Default String Sort
            const valA = a[key] ? a[key].toString().toLowerCase() : '';
            const valB = b[key] ? b[key].toString().toLowerCase() : '';
            return valA.localeCompare(valB) * multiplier;
        });
        return result;
    }, [leads, activeStage, sortConfig, currentFilters, searchQuery]);

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
    // Grid Template now uses explicit pixel widths from state
    const gridTemplateColumns = visibleColumns.map(c => typeof c.width === 'number' ? `${c.width}px` : c.width).join(' ');

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
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsImportModalOpen(true);
                                                setIsMoreMenuOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors flex items-center gap-3"
                                        >
                                            <Upload size={16} className="text-slate-400" /> Import Leads
                                        </button>
                                        <div className="relative group">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (selectedIds.size > 0) {
                                                        setIsBulkUpdateModalOpen(true);
                                                        setIsMoreMenuOpen(false);
                                                    }
                                                }}
                                                disabled={selectedIds.size === 0}
                                                aria-disabled={selectedIds.size === 0}
                                                className={`w-full text-left px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-3 
                                                    ${selectedIds.size > 0
                                                        ? 'text-slate-600 hover:bg-slate-50 cursor-pointer'
                                                        : 'text-slate-400 cursor-default opacity-60'}`}
                                            >
                                                <Database size={16} className={selectedIds.size > 0 ? "text-slate-400" : "text-slate-300"} />
                                                Bulk Update {selectedIds.size > 0 && `(${selectedIds.size})`}
                                            </button>

                                            {/* Disabled Tooltip */}
                                            {selectedIds.size === 0 && (
                                                <div className="absolute right-full top-1/2 -translate-y-1/2 mr-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                                                    Select one or more leads to enable bulk update
                                                    <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 transform"></div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="h-px bg-slate-100 my-1"></div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                downloadLeadTemplate();
                                                setIsMoreMenuOpen(false);
                                            }}
                                            className="w-full text-left px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded transition-colors flex items-center gap-3"
                                        >
                                            <FileText size={16} className="text-slate-400" /> Download Template
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
                            <div className="relative flex-1 xl:flex-none group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        setCurrentPage(1); // Reset page on search
                                    }}
                                    placeholder="Search by Lead Name, Business, Email, Assigned LO…"
                                    className="pl-10 pr-9 py-2 bg-white border border-slate-200 rounded-full text-sm w-full xl:w-96 focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm transition-all focus:border-blue-300 placeholder:text-slate-400"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery('');
                                            setCurrentPage(1);
                                        }}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            {/* Tools */}
                            <div className="flex gap-2">
                                {/* Sort Dropdown REMOVED - Visual only */}

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

                    {/* Import Leads Modal */}
                    <ImportLeadsModal
                        isOpen={isImportModalOpen}
                        onClose={() => setIsImportModalOpen(false)}
                        onImportComplete={onImportLeads}
                        existingEmails={leads.map(l => l.email)}
                    />

                    {/* Bulk Update Modal */}
                    <BulkUpdateModal
                        isOpen={isBulkUpdateModalOpen}
                        onClose={() => setIsBulkUpdateModalOpen(false)}
                        selectedLeads={leads.filter(l => selectedIds.has(l.id))}
                        onUpdate={(ids, updates) => {
                            onBulkUpdate(ids, updates);
                            setSelectedIds(new Set()); // Clear selection after update
                        }}
                    />

                    {/* Reassign LO Modal */}
                    <ReassignLOModal
                        isOpen={isReassignModalOpen}
                        onClose={() => setIsReassignModalOpen(false)}
                        onConfirm={handleReassignLead}
                        currentOfficerId={leadForReassign?.assignedOfficer}
                        leadName={leadForReassign?.name}
                    />

                    {/* Grid Table Container */}
                    <div className="flex flex-col relative rounded-b-2xl overflow-hidden bg-white">
                        <div className="overflow-x-auto custom-scrollbar">
                            <div className="min-w-max">
                                {/* Header (Sticky & Sortable & Draggable) */}
                                <div
                                    className="grid gap-0 px-0 bg-white border-b border-l-4 border-transparent border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider items-center sticky top-0 z-40 shadow-sm"
                                    style={{ gridTemplateColumns }}
                                >
                                    {visibleColumns.map((col, index) => (
                                        <div
                                            key={col.id}
                                            draggable={!col.fixed}
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDrop={(e) => handleDrop(e, index)}
                                            onClick={() => col.sortable && handleSort(col.id)}
                                            className={`group relative flex items-center h-full py-3 px-4 select-none ${!col.fixed ? 'cursor-grab active:cursor-grabbing hover:bg-slate-50' : ''} ${col.sortable ? 'cursor-pointer' : ''} ${col.id === 'actions' ? 'justify-end' : ''}`}
                                        >
                                            <div className="flex items-center gap-1.5 truncate">
                                                {col.id === 'select' ? (
                                                    <input
                                                        type="checkbox"
                                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                        onChange={toggleSelectAll}
                                                        checked={paginatedLeads.length > 0 && paginatedLeads.every(l => selectedIds.has(l.id))}
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                ) : col.label}

                                                {/* Sort Indicator */}
                                                {col.sortable && sortConfig.key === col.id && (
                                                    <span className="text-blue-600">
                                                        {sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Resize Handle */}
                                            {!col.fixed && (
                                                <div
                                                    className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-blue-400 group-hover:bg-slate-200 transition-colors z-10"
                                                    onMouseDown={(e) => startResize(e, col.id)}
                                                    onClick={(e) => e.stopPropagation()}
                                                ></div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Body Rows */}
                                <div className="divide-y divide-slate-100">
                                    {paginatedLeads.length === 0 ? (
                                        <div className="p-12 flex flex-col items-center justify-center text-center">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                                <Search size={24} className="text-slate-400" />
                                            </div>
                                            <h3 className="text-slate-900 font-medium mb-1">No leads match your search</h3>
                                            <p className="text-slate-500 text-sm">Try adjusting your search terms or filters.</p>
                                            {(searchQuery || activeFilterCount > 0) && (
                                                <button
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setActiveStage('All');
                                                        if (onUpdateFilters) onUpdateFilters(null);
                                                    }}
                                                    className="mt-4 text-blue-600 text-sm font-medium hover:underline"
                                                >
                                                    Clear all filters
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        paginatedLeads.map(lead => {
                                            const isSelected = selectedIds.has(lead.id);

                                            return (
                                                <div
                                                    key={lead.id}
                                                    onClick={() => onSelectLead(lead)}
                                                    className={`group hover:bg-slate-50 transition-all cursor-pointer relative border-b border-slate-50 ${isSelected ? 'bg-blue-50/40' : ''}`}
                                                >
                                                    <div
                                                        className={`grid gap-0 items-center px-0 py-3 border-l-4 border-transparent`}
                                                        style={{ gridTemplateColumns }}
                                                    >
                                                        {visibleColumns.map(col => {
                                                            const cellClass = "px-4 overflow-hidden truncate";

                                                            // --- SELECT COLUMN ---
                                                            if (col.id === 'select') {
                                                                return (
                                                                    <div key={col.id} onClick={(e) => e.stopPropagation()} className={cellClass}>
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
                                                                const initials = lead.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                                                                return (
                                                                    <div key={col.id} className={`flex items-center gap-3 ${cellClass}`}>
                                                                        {/* Avatar */}
                                                                        <AvatarWithPresence
                                                                            src={lead.avatar}
                                                                            initials={initials}
                                                                            name={lead.name}
                                                                            status={lead.status}
                                                                            lastActive={lead.lastActive}
                                                                            size="md"
                                                                        />
                                                                        {/* Text Info */}
                                                                        <div className="flex flex-col min-w-0">
                                                                            <div className="font-bold text-slate-800 text-sm group-hover:text-blue-700 transition-colors truncate">
                                                                                {lead.name}
                                                                            </div>
                                                                            <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                                                                                <Mail size={10} className="text-slate-400" />
                                                                                {lead.email}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }

                                                            // --- BUSINESS COLUMN ---
                                                            if (col.id === 'business') {
                                                                return (
                                                                    <div key={col.id} className={`text-sm font-medium text-slate-600 flex items-center gap-1.5 ${cellClass}`}>
                                                                        <Briefcase size={12} className="text-slate-400 shrink-0" />
                                                                        <span className="truncate">{lead.businessName}</span>
                                                                    </div>
                                                                );
                                                            }

                                                            // --- OFFICER COLUMN ---
                                                            if (col.id === 'officer') {
                                                                return (
                                                                    <div key={col.id} className={`flex items-center gap-2 ${cellClass}`}>
                                                                        {lead.assignedOfficer !== 'Unassigned' && (
                                                                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                                                                                {lead.assignedOfficer.charAt(0)}
                                                                            </div>
                                                                        )}
                                                                        <span className="text-xs font-medium text-slate-600 truncate">{lead.assignedOfficer}</span>
                                                                    </div>
                                                                );
                                                            }

                                                            // --- SOURCE COLUMN ---
                                                            if (col.id === 'source') {
                                                                return (
                                                                    <div key={col.id} className={cellClass}>
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                                                            {lead.source}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            }

                                                            // --- STAGE COLUMN ---
                                                            if (col.id === 'stage') {
                                                                return (
                                                                    <div key={col.id} className={cellClass}>
                                                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${lead.stage === 'New' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                                                                            lead.stage === 'Attempting Contact' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                                                lead.stage === 'Pre-Screening' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                                                    lead.stage === 'Hold' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                                                        lead.stage === 'Nurturing' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                                            lead.stage === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                                                                lead.stage === 'Adverse Action' ? 'bg-red-50 text-red-700 border-red-100' :
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
                                                                    <div key={col.id} className={`flex items-center gap-1.5 text-xs text-slate-500 ${cellClass}`}>
                                                                        <Calendar size={12} />
                                                                        {lead.lastActivity}
                                                                    </div>
                                                                );
                                                            }

                                                            // --- ACTIONS COLUMN ---
                                                            if (col.id === 'actions') {
                                                                return (
                                                                    <div key={col.id} className={`flex items-center justify-end gap-1 ${cellClass}`} onClick={(e) => e.stopPropagation()}>
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
                                                                                    if (activeRowMenu === lead.id) {
                                                                                        setActiveRowMenu(null);
                                                                                    } else {
                                                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                                                        setMenuPosition({ top: rect.bottom + window.scrollY, left: rect.right - 160 + window.scrollX }); // 160 is approx menu width
                                                                                        setActiveRowMenu(lead.id);
                                                                                    }
                                                                                }}
                                                                                className={`p-1.5 rounded-lg transition-colors ${activeRowMenu === lead.id ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'}`}
                                                                            >
                                                                                <Ellipsis size={16} />
                                                                            </button>

                                                                            {activeRowMenu === lead.id && createPortal(
                                                                                <div className="fixed inset-0 z-[9999]" onClick={(e) => { e.stopPropagation(); setActiveRowMenu(null); }}>
                                                                                    {/* Positioned Menu */}
                                                                                    <div
                                                                                        className="absolute bg-white border border-slate-200 rounded-lg shadow-xl p-1 animate-in fade-in zoom-in-95 duration-200"
                                                                                        style={{ top: `${menuPosition.top + 4}px`, left: `${menuPosition.left}px`, width: '160px' }}
                                                                                        onClick={(e) => e.stopPropagation()}
                                                                                    >
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
                                                                                            <button className="w-full text-left px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded flex items-center gap-2" onClick={() => {
                                                                                                setActiveRowMenu(null);
                                                                                                setLeadForReassign(lead);
                                                                                                setIsReassignModalOpen(true);
                                                                                            }}>
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
                                                                                </div>,
                                                                                document.body
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                );
                                                            }

                                                            // --- DEFAULT / DYNAMIC COLUMNS ---
                                                            return (
                                                                <div key={col.id} className={`text-sm text-slate-600 ${cellClass}`}>
                                                                    {lead[col.id] || '-'}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}

                                </div>
                            </div>
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
