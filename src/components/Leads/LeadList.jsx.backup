import React, { useState, useMemo } from 'react';
import {
    Search, Filter, Plus, MoreHorizontal, User, Calendar,
    ChevronLeft, ChevronRight, Download, Columns as ColumnsIcon, Check,
    ArrowUpDown, Table, FileText, File, Mail, MessageSquare,
    TrendingUp, Star, Shield, Briefcase
} from 'lucide-react';

const LeadList = ({ leads, selectedLeadId, onSelectLead, compact }) => {
    // State
    const [activeStage, setActiveStage] = useState('All');
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState(new Set());
    const [sortConfig, setSortConfig] = useState({ key: 'lastActivity', label: 'Last Activity' });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // Slightly more density for leads

    // Columns Config
    const [columns, setColumns] = useState([
        { id: 'select', label: '', visible: true, width: '40px' },
        { id: 'name', label: 'Lead Name', visible: true, width: '3fr' },
        { id: 'business', label: 'Business', visible: true, width: '2fr' },
        { id: 'officer', label: 'Assigned LO', visible: true, width: '1.5fr' }, // Left
        { id: 'source', label: 'Source', visible: true, width: '1.5fr' },
        { id: 'stage', label: 'Stage', visible: true, width: '1.5fr' },
        { id: 'lastActivity', label: 'Last Activity', visible: true, width: '1.5fr' },
        { id: 'actions', label: 'Actions', visible: true, width: '100px' }
    ]);

    const stages = ['All', 'New', 'Contacted', 'Qualified', 'Converted', 'Disqualified'];

    // Helper functions
    const toggleColumn = (id) => {
        setColumns(cols => cols.map(col =>
            col.id === id ? { ...col, visible: !col.visible } : col
        ));
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
        console.log(`Exporting ${idsToExport.length} leads to ${format}:`, idsToExport);
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

        result = [...result].sort((a, b) => { // Clone to avoid mutating prop
            if (sortConfig.key === 'lastActivity') {
                // Mock date comparison mainly strings for now
                return b.lastActivity.localeCompare(a.lastActivity);
            }
            if (sortConfig.key === 'name') return a.name.localeCompare(b.name);
            if (sortConfig.key === 'stage') return a.stage.localeCompare(b.stage);
            return 0;
        });
        return result;
    }, [leads, activeStage, sortConfig]);

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

    // Compact View (Sidebar Mode) - Kept simple but styled
    if (compact) {
        return (
            <div className="flex flex-col h-full bg-white">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800">Leads</h2>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-lg transition-colors shadow-sm">
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
    return (
        <div className="flex-1 bg-slate-50 relative h-full flex flex-col">
            <div className="max-w-7xl mx-auto w-full p-8 flex-1 flex flex-col">

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

                    <div className="flex gap-3">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm shadow-blue-200">
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
                                {selectedIds.size > 0 ? `Export (${selectedIds.size})` : 'Export'}
                            </button>
                            {isExportMenuOpen && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setIsExportMenuOpen(false)}></div>
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
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
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-t-2xl border border-slate-200 border-b-0 p-4 pb-0 flex flex-col gap-4 shadow-sm z-10 relative">
                    <div className="flex justify-between items-center">
                        {/* Tabs */}
                        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
                            {stages.map(stage => {
                                const count = stage === 'All' ? leads.length : leads.filter(l => l.stage === stage).length;
                                return (
                                    <button
                                        key={stage}
                                        onClick={() => { setActiveStage(stage); setCurrentPage(1); }}
                                        className={`pb-4 text-sm font-medium transition-all relative whitespace-nowrap flex items-center gap-2 ${activeStage === stage
                                            ? 'text-blue-600'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {stage}
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeStage === stage ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                            }`}>
                                            {count}
                                        </span>
                                        {activeStage === stage && (
                                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tools */}
                        <div className="flex gap-2 pb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input type="text" placeholder="Search..." className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-blue-100" />
                            </div>

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
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2 animate-in fade-in slide-in-from-top-2 duration-200">
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

                            <button onClick={() => setIsColumnMenuOpen(!isColumnMenuOpen)} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 relative">
                                <ColumnsIcon size={16} />
                                {isColumnMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10 cursor-default" onClick={(e) => { e.stopPropagation(); setIsColumnMenuOpen(false); }}></div>
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2 text-left">
                                            {columns.map(col => col.id !== 'select' && (
                                                <button key={col.id} onClick={() => toggleColumn(col.id)} className="flex items-center justify-between w-full px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-50 rounded">
                                                    <span>{col.label}</span>
                                                    {col.visible && <Check size={14} className="text-blue-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </button>

                            <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                                <Filter size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid Table */}
                <div className="bg-white rounded-b-2xl rounded-tr-none shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
                    {/* Header */}
                    <div
                        className="grid gap-4 px-6 py-3 bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-400 uppercase tracking-wider items-center sticky top-0 backdrop-blur-sm"
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
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    checked={isSelected}
                    onChange={() => toggleSelectRow(lead.id)}
                                                />
                </div>
                                        )}

                {/* Name */}
                {columns.find(c => c.id === 'name')?.visible && (
                    <div>
                        <div className="font-bold text-slate-700 group-hover:text-blue-700 transition-colors text-sm">
                            {lead.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">CEO / Primary</div>
                    </div>
                )}

                {/* Business */}
                {columns.find(c => c.id === 'business')?.visible && (
                    <div className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                        <Briefcase size={12} className="text-slate-400" />
                        {lead.businessName}
                    </div>
                )}

                {/* Officer */}
                {columns.find(c => c.id === 'officer')?.visible && (
                    <div className="flex items-center gap-2">
                        {lead.assignedOfficer !== 'Unassigned' && (
                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                {lead.assignedOfficer.charAt(0)}
                            </div>
                        )}
                        <span className="text-xs font-medium text-slate-600">{lead.assignedOfficer}</span>
                    </div>
                )}

                {/* Source */}
                {columns.find(c => c.id === 'source')?.visible && (
                    <div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            {lead.source}
                        </span>
                    </div>
                )}

                {/* Stage */}
                {columns.find(c => c.id === 'stage')?.visible && (
                    <div>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${lead.stage === 'New' ? 'bg-sky-50 text-sky-700 border-sky-100' :
                            lead.stage === 'Contacted' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                lead.stage === 'Qualified' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    lead.stage === 'Converted' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                        'bg-slate-50 text-slate-600 border-slate-200'
                            }`}>
                            {lead.stage}
                        </span>
                    </div>
                )}

                {/* Activity */}
                {columns.find(c => c.id === 'lastActivity')?.visible && (
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar size={12} />
                        {lead.lastActivity}
                    </div>
                )}

                {/* Actions */}
                {columns.find(c => c.id === 'actions')?.visible && (
                    <div
                        className="text-right flex items-center justify-end gap-1 h-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={(e) => { e.stopPropagation(); console.log('Msg', lead.id) }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Message">
                            <MessageSquare size={16} />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); console.log('Email', lead.id) }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Email">
                            <Mail size={16} />
                        </button>
                        <div className="w-px h-4 bg-slate-200 mx-1"></div>
                        <button onClick={(e) => { e.stopPropagation(); console.log('More', lead.id) }} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded" title="More">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
})}
                    </div >

    {/* Pagination Footer */ }
    < div className = "p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between" >
                        <div className="text-xs text-slate-500">
                            Showing <span className="font-bold text-slate-700">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredAndSortedLeads.length)}</span> of <span className="font-bold text-slate-700">{filteredAndSortedLeads.length}</span>
                            <span className="mx-2 text-slate-300">|</span>
                            Sorted by <span className="font-semibold text-slate-700">{sortConfig.label}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50"><ChevronLeft size={16} /></button>
                            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-50 hover:bg-slate-50"><ChevronRight size={16} /></button>
                        </div>
                    </div >

                </div >
            </div >
        </div >
    );
};

export default LeadList;
