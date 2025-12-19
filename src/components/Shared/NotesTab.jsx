import React, { useState, useMemo } from 'react';
import {
    Search, Filter, Plus, Pin, MoreVertical,
    Trash2, Edit2, Link as LinkIcon, StickyNote,
    User, Calendar, Tag, ChevronDown, ChevronRight,
    Building2, CreditCard, ArrowRight, FileText
} from 'lucide-react';

const NotesTab = ({ context = 'Account', entityId, showAddButton = true }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterAuthor, setFilterAuthor] = useState('All');

    // Collapsed State for groups (keeping track of IDs that are expanded)
    // Default: Loan groups collapsed, Lead groups collapsed
    const [expandedGroups, setExpandedGroups] = useState({});

    const toggleGroup = (groupId) => {
        setExpandedGroups(prev => ({
            ...prev,
            [groupId]: !prev[groupId]
        }));
    };

    // Mock Data
    const [notes, setNotes] = useState([
        // Account Notes
        {
            id: 'n1',
            content: 'Discussed Q4 expansion plans. The client is looking at a new location in Midtown. **Action:** Need to follow up on zoning requirements.',
            author: 'Sarah Jenkins',
            authorAvatar: 'SJ',
            date: '2024-03-15T10:30:00',
            scope: 'Account',
            linkedEntity: null,
            tags: ['Strategy', 'Expansion'],
            pinned: true
        },
        {
            id: 'n3',
            content: 'Client mentioned a potential partnership with "City Coffee". This could increase foot traffic.',
            author: 'Sarah Jenkins',
            authorAvatar: 'SJ',
            date: '2024-02-28T09:00:00',
            scope: 'Account',
            linkedEntity: null,
            tags: ['Relationship'],
            pinned: false
        },
        // Loan Notes: LN-2024-001
        {
            id: 'n2',
            content: 'Received updated tax returns for 2023. Revenue is up 15% YoY. This improves the DSCR significantly.',
            author: 'Mike Ross',
            authorAvatar: 'MR',
            date: '2024-03-10T14:15:00',
            scope: 'Loan',
            linkedEntityId: 'LN-2024-001',
            linkedEntityName: 'Working Capital Loan',
            tags: ['Financials', 'Underwriting'],
            pinned: false
        },
        {
            id: 'n6',
            content: 'Collateral valuation came back lower than expected. Need to discuss LTV options.',
            author: 'Mike Ross',
            authorAvatar: 'MR',
            date: '2024-03-12T11:00:00',
            scope: 'Loan',
            linkedEntityId: 'LN-2024-001',
            linkedEntityName: 'Working Capital Loan',
            tags: ['Risk', 'Collateral'],
            pinned: false
        },
        // Loan Notes: LN-2023-099 (Historical)
        {
            id: 'n7',
            content: 'Loan paid off in full. Closing file.',
            author: 'System Admin',
            authorAvatar: 'SA',
            date: '2023-12-15T09:00:00',
            scope: 'Loan',
            linkedEntityId: 'LN-2023-099',
            linkedEntityName: 'Equipment Loan 2023',
            tags: ['Servicing'],
            pinned: false
        },
        // Lead Notes: LD-101
        {
            id: 'n5',
            content: 'Initial intake call. Lead seems solid, good credit history reported verbally.',
            author: 'Sarah Miller',
            authorAvatar: 'SM',
            date: '2023-11-01T10:00:00',
            scope: 'Lead',
            linkedEntityId: 'LD-101',
            linkedEntityName: 'Detroit Bakery Co (Lead)',
            tags: ['Intake'],
            pinned: false
        },
        // Account Document Note (Keeping as Account scope for now logic)
        {
            id: 'n4',
            content: 'Compliance concern regarding the "Business License" expiry. Client renewed it.',
            author: 'System Admin',
            authorAvatar: 'SA',
            date: '2024-02-15T16:45:00',
            scope: 'Account',
            linkedEntity: 'Business License',
            tags: ['Compliance'],
            pinned: false
        }
    ]);

    // Helpers
    const togglePin = (id) => {
        setNotes(prev => prev.map(n =>
            n.id === id ? { ...n, pinned: !n.pinned } : n
        ));
    };

    const deleteNote = (id) => {
        if (confirm('Are you sure you want to delete this note?')) {
            setNotes(prev => prev.filter(n => n.id !== id));
        }
    };

    // Filter & Group Logic
    const { accountNotes, loanGroups, leadGroups } = useMemo(() => {
        let filtered = notes.filter(note => {
            const matchesSearch = note.content.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesAuthor = filterAuthor === 'All' || note.author === filterAuthor;
            return matchesSearch && matchesAuthor;
        }).sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first

        // 1. Account Notes
        const acctNotes = filtered.filter(n => n.scope === 'Account');

        // 2. Loan Groups
        const loans = {};
        filtered.filter(n => n.scope === 'Loan').forEach(n => {
            if (!loans[n.linkedEntityId]) {
                loans[n.linkedEntityId] = {
                    id: n.linkedEntityId,
                    name: n.linkedEntityName,
                    notes: []
                };
            }
            loans[n.linkedEntityId].notes.push(n);
        });

        // 3. Lead Groups
        const leads = {};
        filtered.filter(n => n.scope === 'Lead').forEach(n => {
            if (!leads[n.linkedEntityId]) {
                leads[n.linkedEntityId] = {
                    id: n.linkedEntityId,
                    name: n.linkedEntityName,
                    notes: []
                };
            }
            leads[n.linkedEntityId].notes.push(n);
        });

        return {
            accountNotes: acctNotes,
            loanGroups: Object.values(loans),
            leadGroups: Object.values(leads)
        };
    }, [notes, searchQuery, filterAuthor]);

    const authors = ['All', ...new Set(notes.map(n => n.author))];

    return (
        <div className="flex flex-col h-[calc(100vh-220px)] bg-slate-50 relative">

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <StickyNote size={20} className="text-blue-600" />
                        Notes
                        <span className="text-xs font-medium text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">
                            {notes.length} total
                        </span>
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 shadow-sm"
                        />
                    </div>

                    <select
                        className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none shadow-sm cursor-pointer"
                        value={filterAuthor}
                        onChange={(e) => setFilterAuthor(e.target.value)}
                    >
                        {authors.map(a => <option key={a} value={a}>{a === 'All' ? 'All Authors' : a}</option>)}
                    </select>

                    {showAddButton && (
                        <button
                            onClick={() => alert('Add Note Modal: Defaulting to Account Scope')}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                        >
                            <Plus size={16} /> Add Note
                        </button>
                    )}
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto space-y-8 pb-20 pr-2">

                {/* SECTION 1: ACCOUNT NOTES (Expanded by default) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Building2 size={18} className="text-slate-500" />
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Account Notes</h3>
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-xs text-slate-400">{accountNotes.length} notes</span>
                    </div>
                    <div className="space-y-4 pl-2">
                        {accountNotes.length === 0 ? (
                            <div className="text-center py-6 text-slate-400 italic text-sm">No account notes found.</div>
                        ) : (
                            accountNotes.map(note => (
                                <NoteCard
                                    key={note.id}
                                    note={note}
                                    onPin={() => togglePin(note.id)}
                                    onDelete={() => deleteNote(note.id)}
                                />
                            ))
                        )}
                    </div>
                </div>

                {/* SECTION 2: LOAN NOTES */}
                {loanGroups.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <CreditCard size={18} className="text-blue-500" />
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Loan Notes</h3>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>
                        <div className="space-y-3 pl-2">
                            {loanGroups.map(group => {
                                const isExpanded = !!expandedGroups[group.id];
                                return (
                                    <div key={group.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => toggleGroup(group.id)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">{group.id}</div>
                                                    <div className="text-xs text-slate-500">{group.name}</div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                                                {group.notes.length}
                                            </span>
                                        </button>

                                        {isExpanded && (
                                            <div className="p-4 space-y-4 bg-slate-50/50 border-t border-slate-200">
                                                {group.notes.map(note => (
                                                    <NoteCard
                                                        key={note.id}
                                                        note={note}
                                                        onPin={() => togglePin(note.id)}
                                                        onDelete={() => deleteNote(note.id)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* SECTION 3: LEAD NOTES */}
                {leadGroups.length > 0 && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 px-1">
                            <ArrowRight size={18} className="text-purple-500" />
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Lead Context</h3>
                            <div className="h-px bg-slate-200 flex-1"></div>
                        </div>
                        <div className="space-y-3 pl-2">
                            {leadGroups.map(group => {
                                const isExpanded = !!expandedGroups[group.id];
                                return (
                                    <div key={group.id} className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => toggleGroup(group.id)}
                                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                                        >
                                            <div className="flex items-center gap-3">
                                                {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800">{group.id}</div>
                                                    <div className="text-xs text-slate-500">{group.name}</div>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                                                {group.notes.length}
                                            </span>
                                        </button>

                                        {isExpanded && (
                                            <div className="p-4 space-y-4 bg-slate-50/50 border-t border-slate-200">
                                                {group.notes.map(note => (
                                                    <NoteCard
                                                        key={note.id}
                                                        note={note}
                                                        onPin={() => togglePin(note.id)}
                                                        onDelete={() => deleteNote(note.id)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

const NoteCard = ({ note, onPin, onDelete }) => (
    <div className={`group bg-white rounded-xl border p-5 shadow-sm transition-all hover:shadow-md ${note.pinned ? 'border-blue-200 bg-blue-50/10' : 'border-slate-200'}`}>
        <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200">
                    {note.authorAvatar}
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-800">{note.author}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(note.date).toLocaleString()}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={onPin}
                    className={`p-1.5 rounded-lg transition-colors ${note.pinned ? 'text-blue-600 bg-blue-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                    title={note.pinned ? "Unpin note" : "Pin note"}
                >
                    <Pin size={14} className={note.pinned ? "fill-blue-600" : ""} />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-1"></div>
                <div className="relative group/menu">
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                        <MoreVertical size={14} />
                    </button>
                    {/* Simplified Kebab Menu for Verification */}
                    <div className="hidden group-hover/menu:block absolute right-0 top-full w-32 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-10">
                        <button className="flex items-center gap-2 w-full px-3 py-2 text-xs text-slate-600 hover:bg-slate-50 text-left">
                            <Edit2 size={12} /> Edit
                        </button>
                        <button
                            onClick={onDelete}
                            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 text-left font-medium"
                        >
                            <Trash2 size={12} /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="mb-4">
            {/* Rich text simulation */}
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {note.content.split('**').map((part, i) =>
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                )}
            </p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
            {/* Tags */}
            {note.tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-slate-500 bg-white border border-slate-200">
                    <Tag size={10} /> {tag}
                </span>
            ))}

            {/* Simple Scope Badge (Optional since now grouped) */}
            {note.linkedEntity && (
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-100">
                    Linked to: {note.linkedEntity}
                </span>
            )}
        </div>
    </div>
);

export default NotesTab;
