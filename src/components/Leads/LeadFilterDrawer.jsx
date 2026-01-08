import React, { useState, useEffect, useRef } from 'react';
import { X, Check, Search, ChevronDown, ChevronUp, User, Calendar, Plus } from 'lucide-react';
import { MOCK_USERS } from '../../data/mockUsers';

/**
 * LeadFilterDrawer
 * 
 * A modern, sticky-header/footer, accordion-based filter drawer.
 * Supports: Ownership, Stage, Source, Activity.
 */
const LeadFilterDrawer = ({ isOpen, onClose, filters, onApplyFilters }) => {
    // Local draft state
    const [draft, setDraft] = useState(filters);
    // Accordion state: only one section open at a time (or allow multiple? Prompt says "Collapse... when another opens" -> Mutually exclusive recommended, but let's allow toggling).
    // Prompt: "Collapse a section automatically when another opens"
    const [openSection, setOpenSection] = useState('stage'); // Default open

    useEffect(() => {
        if (isOpen) {
            setDraft(filters);
        }
    }, [isOpen, filters]);

    if (!isOpen) return null;

    const handleApply = () => {
        onApplyFilters(draft);
        onClose();
    };

    const handleClearAll = () => {
        setDraft({
            ownership: 'Any User',
            stages: [],
            sources: [],
            activity: 'Any Time',
            // Reset others
            businessName: '',
            minLoan: '',
            maxLoan: '',
            risk: 'All'
        });
    };

    const toggleSection = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // --- Sub-Components ---

    // 1. Ownership (User Picker)
    const OwnershipSection = () => {
        const users = ['Me', ...MOCK_USERS.filter(u => u.name !== 'System' && u.name !== 'Unassigned').map(u => u.name), 'Any User'];
        const [search, setSearch] = useState('');

        return (
            <div className="space-y-3 pt-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-shadow"
                    />
                </div>
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                    {users.filter(u => u.toLowerCase().includes(search.toLowerCase())).map(user => (
                        <button
                            key={user}
                            onClick={() => setDraft({ ...draft, ownership: user })}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${draft.ownership === user
                                ? 'bg-blue-50 text-blue-700 font-medium ring-1 ring-blue-200'
                                : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${draft.ownership === user ? 'bg-blue-200 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                                    {user.charAt(0)}
                                </div>
                                {user}
                            </div>
                            {draft.ownership === user && <Check size={14} />}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    // 2. Stage (Grid Pills)
    const StageSection = () => {
        const stages = ['New', 'Contacted', 'Qualified', 'Converted', 'Disqualified', 'Nurture', 'Lost', 'On Hold'];

        const toggleStage = (stage) => {
            const current = draft.stages || [];
            if (current.includes(stage)) {
                setDraft({ ...draft, stages: current.filter(s => s !== stage) });
            } else {
                setDraft({ ...draft, stages: [...current, stage] });
            }
        };

        return (
            <div className="grid grid-cols-2 gap-2 pt-2">
                {stages.map(stage => {
                    const isSelected = draft.stages?.includes(stage);
                    return (
                        <button
                            key={stage}
                            onClick={() => toggleStage(stage)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border text-center ${isSelected
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm transform scale-[1.02]'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:shadow-sm hover:scale-[1.02]'
                                }`}
                        >
                            {stage}
                        </button>
                    );
                })}
            </div>
        );
    };

    // 3. Source (Token Dropdown)
    const SourceSection = () => {
        const sources = ['Web Form', 'Referral', 'Cold Outreach', 'Existing Client', 'Campaign', 'Partner', 'Event'];
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);

        const toggleSource = (source) => {
            const current = draft.sources || [];
            if (current.includes(source)) {
                setDraft({ ...draft, sources: current.filter(s => s !== source) });
            } else {
                setDraft({ ...draft, sources: [...current, source] });
            }
        };

        const activeSources = draft.sources || [];

        return (
            <div className="pt-2">
                {/* Token Display Area */}
                <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="min-h-[42px] px-3 py-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors flex flex-wrap gap-2 items-center"
                >
                    {activeSources.length === 0 && <span className="text-slate-400 text-sm">Select sources...</span>}
                    {activeSources.map(src => (
                        <span key={src} className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium border border-slate-200">
                            {src}
                            <div
                                role="button"
                                onClick={(e) => { e.stopPropagation(); toggleSource(src); }}
                                className="hover:text-red-500"
                            >
                                <X size={12} />
                            </div>
                        </span>
                    ))}
                    <div className="ml-auto text-slate-400">
                        {isDropdownOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>

                {/* Dropdown Content */}
                {isDropdownOpen && (
                    <div className="mt-2 p-2 bg-white border border-slate-200 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-200">
                        <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto custom-scrollbar">
                            {sources.map(src => (
                                <button
                                    key={src}
                                    onClick={() => toggleSource(src)}
                                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm text-left transition-colors ${activeSources.includes(src) ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                >
                                    {src}
                                    {activeSources.includes(src) && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // 4. Activity (Date Range)
    const ActivitySection = () => {
        const presets = ['Any Time', 'Today', 'Last 7 Days', 'Last 30 Days', 'No Activity'];

        return (
            <div className="pt-2 space-y-4">
                <div className="flex flex-wrap gap-2">
                    {presets.map(p => (
                        <button
                            key={p}
                            onClick={() => setDraft({ ...draft, activity: p })}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${draft.activity === p
                                ? 'bg-blue-50 border-blue-200 text-blue-700'
                                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>

                {/* Custom Range (Visual Mock) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-sm">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Custom Range</div>
                    <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input type="text" placeholder="Start Date" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                        <span className="text-slate-400">-</span>
                        <div className="relative flex-1">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input type="text" placeholder="End Date" className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-100" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // Generic Accordion Wrapper
    const AccordionItem = ({ id, title, count, children, icon: Icon }) => {
        const isOpen = openSection === id;

        return (
            <div className={`border border-slate-200 bg-white rounded-xl overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-md ring-1 ring-slate-900/5' : 'hover:border-blue-300'}`}>
                <button
                    onClick={() => toggleSection(id)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-1.5 rounded-lg ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                            <Icon size={16} />
                        </div>
                        <div className="text-left">
                            <div className={`text-sm font-semibold transition-colors ${isOpen ? 'text-slate-900' : 'text-slate-600'}`}>{title}</div>
                            {!isOpen && count > 0 && (
                                <div className="text-[10px] font-medium text-blue-600">{count} selected</div>
                            )}
                        </div>
                    </div>
                    <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`}>
                        <ChevronDown size={16} />
                    </div>
                </button>

                {isOpen && (
                    <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
                        {children}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-[60] flex justify-end isolate">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Drawer Panel */}
            <div className="relative w-full max-w-[400px] h-full bg-slate-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-200">

                {/* Sticky Header */}
                <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between shrink-0 z-10 sticky top-0">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Filters</h2>
                        <p className="text-xs text-slate-500">Refine your lead list</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleClearAll}
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

                    {/* 1. Ownership */}
                    <AccordionItem
                        id="ownership"
                        title="Lead Ownership"
                        icon={User}
                        count={draft.ownership && draft.ownership !== 'Any User' ? 1 : 0}
                    >
                        <OwnershipSection />
                    </AccordionItem>

                    {/* 2. Stage */}
                    <AccordionItem
                        id="stage"
                        title="Lead Stage"
                        icon={Check}
                        count={draft.stages?.length || 0}
                    >
                        <StageSection />
                    </AccordionItem>

                    {/* 3. Source */}
                    <AccordionItem
                        id="source"
                        title="Lead Source"
                        icon={Plus} // Placeholder icon
                        count={draft.sources?.length || 0}
                    >
                        <SourceSection />
                    </AccordionItem>

                    {/* 4. Activity */}
                    <AccordionItem
                        id="activity"
                        title="Activity & Dates"
                        icon={Calendar}
                        count={draft.activity && draft.activity !== 'Any Time' ? 1 : 0}
                    >
                        <ActivitySection />
                    </AccordionItem>
                </div>

                {/* Sticky Footer */}
                <div className="p-6 bg-white border-t border-slate-200 shrink-0 flex gap-3 z-10 pb-8">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-[0.98]"
                    >
                        Apply Filters
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LeadFilterDrawer;
