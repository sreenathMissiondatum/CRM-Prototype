
import React, { useState } from 'react';
import {
    Plus, Search, Filter, MoreVertical, Download,
    CloudDownload, FileText, CheckCircle, AlertCircle, Clock,
    LayoutGrid, List, Shield, Trash2, Eye, Edit3, Archive,
    AlertTriangle, X
} from 'lucide-react';
import LoanProgramImport from './LoanProgramImport';
import LoanProgramWizard from './RulesEngine/LoanProgramWizard';
import LoanProgramDetail from './LoanProgramDetail';

// --- SHARED HELPERS ---
const auditLog = (action, programId, details = {}) => {
    console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        user: 'CURRENT_USER',
        action,
        programId,
        details
    }));
};

const StatusBadge = ({ status }) => {
    const styles = {
        Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Draft: 'bg-amber-50 text-amber-700 border-amber-200',
        Retired: 'bg-slate-100 text-slate-500 border-slate-200'
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${styles[status] || styles.Retired}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${status === 'Active' ? 'bg-emerald-500' : status === 'Draft' ? 'bg-amber-500' : 'bg-slate-400'}`}></div>
            {status}
        </span>
    );
};

// --- MODALS ---

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, icon: Icon, confirmText, confirmStyle = 'primary' }) => {
    if (!isOpen) return null;

    const styles = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        destructive: 'bg-red-600 hover:bg-red-700 text-white',
        success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        warning: 'bg-amber-500 hover:bg-amber-600 text-white'
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 p-6 animate-in zoom-in-95 duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${confirmStyle === 'destructive' ? 'bg-red-50 text-red-600' : confirmStyle === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-500 mb-6 leading-relaxed">{message}</p>

                    <div className="flex gap-3 w-full">
                        <button onClick={onClose} className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg transition-transform hover:-translate-y-0.5 ${styles[confirmStyle]}`}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const LoanProgramsList = () => {
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [isWizardOpen, setIsWizardOpen] = useState(false);

    // Lifecycle State
    const [activeModal, setActiveModal] = useState(null); // 'activate' | 'retire' | 'delete'
    const [selectedActionProgram, setSelectedActionProgram] = useState(null);
    const [viewDetailProgram, setViewDetailProgram] = useState(null);

    // Initial Data
    const [programs, setPrograms] = useState([
        {
            id: 'LP-001',
            name: 'SBA 7(a) Standard',
            code: 'SBA-7A',
            source: 'LMS',
            version: '2.4',
            status: 'Active',
            activeLoans: 142,
            lastModified: '2023-12-01',
            owner: 'System Sync',
            authority: 'SBA',
        },
        {
            id: 'LP-002',
            name: 'CRE Bridge Loan',
            code: 'CRE-BRG',
            source: 'Native',
            version: '1.1',
            status: 'Active',
            activeLoans: 28,
            lastModified: '2023-11-20',
            owner: 'Sarah Jenkins',
            authority: 'Internal'
        },
        {
            id: 'LP-003',
            name: 'Equipment Finance Express',
            code: 'EQ-EXP',
            source: 'Native',
            version: '0.9',
            status: 'Draft',
            activeLoans: 0,
            lastModified: '2023-12-06',
            owner: 'Mike Ross',
            authority: 'Internal'
        },
        {
            id: 'LP-004',
            name: 'SBA 504',
            code: 'SBA-504',
            source: 'LMS',
            version: '3.0',
            status: 'Retired',
            activeLoans: 5,
            lastModified: '2023-10-15',
            owner: 'System Sync',
            authority: 'SBA'
        }
    ]);

    // Permissions (Mock)
    const userRole = 'Admin'; // 'Admin' | 'LoanOfficer'
    const canManage = userRole === 'Admin';

    // --- ACTIONS ---

    const handleCreate = (newProgram) => {
        // Ensure new programs are Draft
        setPrograms(prev => [{ ...newProgram, status: 'Draft', activeLoans: 0 }, ...prev]);
        setIsWizardOpen(false);
        auditLog('PROGRAM_CREATED', newProgram.id);
    };

    const handleImport = (newProgram) => {
        // Imports might be Active or Draft depending on logic, default to Draft for safety
        setPrograms(prev => [{ ...newProgram, status: 'Draft' }, ...prev]);
        setIsImportOpen(false);
        auditLog('PROGRAM_IMPORTED', newProgram.id);
    };

    const confirmActivate = () => {
        if (!selectedActionProgram) return;
        setPrograms(prev => prev.map(p =>
            p.id === selectedActionProgram.id ? { ...p, status: 'Active' } : p
        ));
        auditLog('PROGRAM_ACTIVATED', selectedActionProgram.id, { from: 'Draft', to: 'Active' });
        setActiveModal(null);
        setSelectedActionProgram(null);
    };

    const confirmRetire = () => {
        if (!selectedActionProgram) return;
        setPrograms(prev => prev.map(p =>
            p.id === selectedActionProgram.id ? { ...p, status: 'Retired' } : p
        ));
        auditLog('PROGRAM_RETIRED', selectedActionProgram.id, { from: 'Active', to: 'Retired' });
        setActiveModal(null);
        setSelectedActionProgram(null);
    };

    const confirmDelete = () => {
        if (!selectedActionProgram) return;
        setPrograms(prev => prev.filter(p => p.id !== selectedActionProgram.id));
        auditLog('PROGRAM_DELETED', selectedActionProgram.id, { status: 'Draft' });
        setActiveModal(null);
        setSelectedActionProgram(null);
    };

    // --- RENDER TILE ---
    const ProgramTile = ({ prog }) => {
        const [showMenu, setShowMenu] = useState(false);

        // Kebab Menu Logic
        const menuActions = [];

        if (prog.status === 'Draft' && canManage) {
            menuActions.push({
                label: 'Edit Program',
                icon: Edit3,
                onClick: () => setViewDetailProgram(prog) // For MVP, Edit opens Detail (could be Wizard)
            });
            menuActions.push({
                label: 'Activate Program',
                icon: Shield,
                color: 'text-emerald-600',
                onClick: () => { setSelectedActionProgram(prog); setActiveModal('activate'); }
            });
            menuActions.push({
                label: 'Delete Draft',
                icon: Trash2,
                color: 'text-red-600',
                separator: true,
                onClick: () => { setSelectedActionProgram(prog); setActiveModal('delete'); }
            });
        }

        if (prog.status === 'Active') {
            menuActions.push({
                label: 'View Program',
                icon: Eye,
                onClick: () => setViewDetailProgram(prog)
            });
            if (canManage) {
                menuActions.push({
                    label: 'Retire Program',
                    icon: Archive,
                    color: 'text-amber-600',
                    separator: true,
                    onClick: () => { setSelectedActionProgram(prog); setActiveModal('retire'); }
                });
            }
        }

        if (prog.status === 'Retired') {
            menuActions.push({
                label: 'View Program',
                icon: Eye,
                onClick: () => setViewDetailProgram(prog)
            });
        }

        return (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 group relative">
                <div className="p-6">
                    {/* Header: Name & Menu */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="pr-8">
                            <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1 group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => setViewDetailProgram(prog)}>
                                {prog.name}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                <span>{prog.code}</span>
                                <span className="text-slate-300">•</span>
                                <span>v{prog.version}</span>
                            </div>
                        </div>

                        {/* Kebab Menu */}
                        <div className="relative">
                            <button
                                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
                                title="Program actions"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {/* Dropdown */}
                            {showMenu && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-100 z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                                        {menuActions.length > 0 ? menuActions.map((action, idx) => (
                                            <div key={idx}>
                                                {action.separator && <div className="h-px bg-slate-100 my-1 mx-2"></div>}
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setShowMenu(false); action.onClick(); }}
                                                    className={`w-full text-left px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-slate-50 ${action.color || 'text-slate-700'}`}
                                                >
                                                    <action.icon size={14} />
                                                    {action.label}
                                                </button>
                                            </div>
                                        )) : (
                                            <div className="px-4 py-2 text-xs text-slate-400 italic">Insufficient privileges</div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Meta: Authority & Status */}
                    <div className="flex justify-between items-center mb-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${prog.authority === 'SBA' ? 'bg-blue-50 text-blue-700 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                            {prog.authority}
                        </span>
                        <StatusBadge status={prog.status} />
                    </div>

                    {/* Footer: Stats & Date */}
                    <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-500">
                        <div className="flex flex-col">
                            <span className="uppercase tracking-wider font-bold text-slate-400 text-[10px]">Last Modified</span>
                            <span>{prog.lastModified}</span>
                        </div>
                        {prog.status !== 'Draft' && (
                            <div className="text-right">
                                <span className="block font-bold text-slate-700 text-sm">{prog.activeLoans}</span>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Active Loans</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (viewDetailProgram) {
        return <LoanProgramDetail program={viewDetailProgram} onBack={() => setViewDetailProgram(null)} />;
    }

    return (
        <div className="flex-1 bg-slate-50 overflow-hidden flex flex-col h-full animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-8 py-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Loan Programs</h1>
                        <p className="text-sm text-slate-500 mt-1">Manage product definitions, policies, and eligibility rules.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsImportOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-blue-600 transition-all shadow-sm"
                        >
                            <CloudDownload size={18} />
                            Import
                        </button>
                        <button
                            onClick={() => setIsWizardOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
                        >
                            <Plus size={18} />
                            Create Program
                        </button>
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex gap-4 items-center">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search programs..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">
                        <Filter size={16} />
                        <span>Filter</span>
                    </button>
                    {/* View Switcher Removed - Forcing Grid as MVP Standard */}
                </div>
            </div>

            {/* Content Body: Grid Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {programs.map(prog => (
                        <ProgramTile key={prog.id} prog={prog} />
                    ))}

                    {/* Empty State Helper */}
                    <button
                        onClick={() => setIsWizardOpen(true)}
                        className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/50 transition-all group min-h-[220px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                            <Plus size={24} className="group-hover:text-blue-600" />
                        </div>
                        <span className="font-bold text-sm">Create New Program</span>
                    </button>
                </div>
            </div>

            {/* Render Modals */}
            {isImportOpen && <LoanProgramImport onClose={() => setIsImportOpen(false)} onImport={handleImport} />}
            {isWizardOpen && <LoanProgramWizard onClose={() => setIsWizardOpen(false)} onCreate={handleCreate} />}

            {/* Confirmation Modals */}
            <ConfirmationModal
                isOpen={activeModal === 'activate'}
                onClose={() => setActiveModal(null)}
                onConfirm={confirmActivate}
                title="Activate Loan Program"
                message="This program will become available for new loan applications. You will not be able to edit it after activation."
                icon={Shield}
                confirmText="Activate Program"
                confirmStyle="success"
            />
            <ConfirmationModal
                isOpen={activeModal === 'retire'}
                onClose={() => setActiveModal(null)}
                onConfirm={confirmRetire}
                title="Retire Loan Program"
                message="This program will no longer be available for new applications. Existing loans and reports are unaffected."
                icon={Archive}
                confirmText="Retire Program"
                confirmStyle="warning"
            />
            <ConfirmationModal
                isOpen={activeModal === 'delete'}
                onClose={() => setActiveModal(null)}
                onConfirm={confirmDelete}
                title="Delete Draft Program"
                message="This action permanently deletes the draft program. This cannot be undone."
                icon={Trash2}
                confirmText="Delete Permanently"
                confirmStyle="destructive"
            />
        </div>
    );
};

export default LoanProgramsList;
