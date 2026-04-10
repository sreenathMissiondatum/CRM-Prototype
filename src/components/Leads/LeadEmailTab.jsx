import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    Search, Filter, Paperclip, Send,
    Download, Eye, MoreVertical, Archive,
    Link as LinkIcon, Reply, ReplyAll, Forward,
    ChevronDown, ChevronUp, Lock, Unlock, X,
    FileText, Image as ImageIcon, ShieldAlert,
    Trash2, Clock, Zap, Tag, Phone, Mail, FolderOpen,
    AlertCircle, CheckCircle2, Bot
} from 'lucide-react';
import { MOCK_EMAILS } from '../../data/mockEmails';

const LeadEmailTab = ({ lead }) => {
    const [selectedThreadId, setSelectedThreadId] = useState(MOCK_EMAILS[0]?.id);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('All');
    const [viewMode, setViewMode] = useState('conversations'); // 'conversations' | 'timeline'
    
    // Composer State
    const [composerOpen, setComposerOpen] = useState(false);
    const [composerMode, setComposerMode] = useState('Reply'); // Reply, ReplyAll, Forward
    const [composerCcBccVisible, setComposerCcBccVisible] = useState(false);
    const [composerCc, setComposerCc] = useState('');
    const [composerBcc, setComposerBcc] = useState('');
    const [composerDraftSaved, setComposerDraftSaved] = useState('just now');
    const [filesModalOpen, setFilesModalOpen] = useState(false);
    const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
    
    // Mock attachments for the composer
    const [composerAttachments, setComposerAttachments] = useState([
        { id: 'att-1', name: 'W2_2023.pdf', size: '2.4 MB', type: 'pdf', tag: 'Tax Doc', link: 'Loan #104' },
        { id: 'att-2', name: 'LE_Disclosure.pdf', size: '1.1 MB', type: 'pdf', tag: 'Disclosure', link: null }
    ]);
    
    // UI State
    const [revealedMessages, setRevealedMessages] = useState({});
    const [expandedMessages, setExpandedMessages] = useState({}); // To manage which older emails are expanded

    const messagesEndRef = useRef(null);

    // --- Derived State ---
    const threads = useMemo(() => {
        let filtered = MOCK_EMAILS.filter(t => t.leadId === (lead?.id || 'LEAD-7782')); // Fallback to LEAD-7782 to ensure mock data shows
        if (filtered.length === 0) filtered = MOCK_EMAILS; // Fallback

        if (filter === 'Unread') filtered = filtered.filter(t => t.unreadCount > 0);
        if (filter === 'System') filtered = filtered.filter(t => t.messages.some(m => m.source === 'SYSTEM_TRIGGER' || m.source === 'CAMPAIGN'));

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(t =>
                t.subject.toLowerCase().includes(q) ||
                t.participants.some(p => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q))
            );
        }
        return filtered.sort((a, b) => new Date(b.lastActivityDate) - new Date(a.lastActivityDate));
    }, [lead, filter, searchQuery]);

    const selectedThread = useMemo(() =>
        threads.find(t => t.id === selectedThreadId) || threads[0]
        , [threads, selectedThreadId]);

    // Auto-expand last message logic
    useEffect(() => {
        if (selectedThread) {
            const lastMsgId = selectedThread.messages[selectedThread.messages.length - 1]?.id;
            if (lastMsgId) {
                setExpandedMessages(prev => ({ ...prev, [lastMsgId]: true }));
            }
        }
    }, [selectedThread?.id]);

    // Scroll to bottom of conversation (Disabled so oldest email is seen first)
    useEffect(() => {
        // if (messagesEndRef.current && viewMode === 'conversations') {
        //     messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        // }
    }, [selectedThread?.id, expandedMessages, composerOpen, viewMode]);


    // --- Handlers ---
    const handleReveal = (msgId) => {
        if (window.confirm("This action will be logged. Reveal sensitive content?")) {
            setRevealedMessages(prev => ({ ...prev, [msgId]: true }));
        }
    };

    const toggleMessageExpand = (msgId) => {
        setExpandedMessages(prev => {
            const isCurrentlyExpanded = prev[msgId] !== false; // default true
            return { ...prev, [msgId]: !isCurrentlyExpanded };
        });
    };

    const handleSend = (e) => {
        e.preventDefault();
        alert("Email sent! (Simulated)");
        setComposerOpen(false);
    };

    // --- Renders: Left Pane (List) ---

    const renderThreadList = () => (
        <div className="w-full lg:w-[30%] border-r border-slate-200 flex flex-col h-full bg-slate-50 z-10 shrink-0">
            {/* View Toggle */}
            <div className="p-4 pb-2 border-b border-slate-200 bg-white">
                <div className="bg-slate-100 p-1 rounded-lg flex text-sm font-medium mb-3">
                    <button 
                        onClick={() => setViewMode('timeline')}
                        className={`flex-1 py-1.5 rounded-md text-center transition-colors ${viewMode === 'timeline' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Timeline
                    </button>
                    <button 
                        onClick={() => setViewMode('conversations')}
                        className={`flex-1 py-1.5 rounded-md text-center transition-colors ${viewMode === 'conversations' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Conversations
                    </button>
                </div>

                {/* Toolbar */}
                <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search emails..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['All', 'Unread', 'System'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors whitespace-nowrap border ${filter === f
                                    ? 'bg-blue-600 text-white border-blue-600'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto bg-white">
                {threads.map(thread => {
                    const isSelected = selectedThread?.id === thread.id;
                    const lastMsg = thread.messages[thread.messages.length - 1];
                    const isSystem = lastMsg.source === 'SYSTEM_TRIGGER' || lastMsg.source === 'CAMPAIGN';

                    return (
                        <button
                            key={thread.id}
                            onClick={() => { setSelectedThreadId(thread.id); setViewMode('conversations'); }}
                            className={`w-full text-left p-4 border-b border-slate-100 hover:bg-slate-50 transition-colors relative group ${isSelected ? 'bg-blue-50/50 hover:bg-blue-50/60' : ''}`}
                        >
                            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r"></div>}

                            {/* Badges */}
                            <div className="flex justify-between items-start mb-2">
                                {thread.status === 'AWAITING_REPLY' && (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                                        Awaiting processing
                                    </span>
                                )}
                                {thread.campaign && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                        <Zap size={10} /> Campaign
                                    </span>
                                )}
                            </div>

                            <div className="flex justify-between items-start gap-2 mb-1">
                                <h3 className={`text-sm truncate leading-tight ${thread.unreadCount > 0 ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'}`}>
                                    {thread.subject}
                                </h3>
                                <div className="text-[11px] font-medium text-slate-400 whitespace-nowrap flex items-center gap-1 shrink-0 pt-0.5">
                                    {new Date(thread.lastActivityDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </div>
                            </div>

                            <div className="text-[11px] text-slate-500 truncate mb-2">
                                {isSystem ? (
                                    <span className="font-semibold text-slate-500 flex items-center gap-1">
                                       <Bot size={12}/> System • {thread.participants.map(p => p.name.split(' ')[0]).join(', ')}
                                    </span>
                                ) : (
                                    <span className="font-medium">
                                        {thread.participants.map(p => p.name.split(' ')[0]).join(', ')}
                                        <span className="text-slate-400 font-normal">, You</span>
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-slate-500 truncate leading-relaxed">
                                {lastMsg.body.replace(/<[^>]*>?/gm, '')}
                            </p>
                            
                            {/* Attachment indicator */}
                            {lastMsg.attachments?.length > 0 && (
                                <div className="mt-2 text-[11px] font-medium text-slate-400 flex items-center gap-1.5 bg-slate-100/50 w-fit px-2 py-0.5 rounded border border-slate-200/50">
                                    <Paperclip size={10} /> {lastMsg.attachments.length} Attachments
                                </div>
                            )}
                        </button>
                    );
                })}

                {threads.length === 0 && (
                    <div className="p-10 text-center text-slate-400 flex flex-col items-center">
                        <Mail size={40} className="text-slate-200 mb-4" />
                        <p className="text-sm font-bold text-slate-600">No conversations found.</p>
                        <p className="text-xs mt-1">Try adjusting your filters.</p>
                    </div>
                )}
            </div>
        </div>
    );

    // --- Renders: Center Pane (Thread content) ---

    const renderMessageCard = (msg, index, isLast) => {
        const isMe = msg.direction === 'outbound' && msg.source === 'MANUAL';
        const isClient = msg.direction === 'inbound';
        const isSystem = msg.source === 'SYSTEM_TRIGGER' || msg.source === 'CAMPAIGN';
        const isRevealed = revealedMessages[msg.id];
        const isExpanded = expandedMessages[msg.id] !== false; 

        let bgClass = "bg-white border border-slate-200"; 
        let alignClass = "self-start ml-6 mr-12"; // Client standard
        if (isMe) {
            bgClass = "bg-[#F8FAFC] border border-[#E2E8F0]"; 
            alignClass = "self-end mr-6 ml-12"; // LO standard right-aligned
        }
        if (isSystem) {
            bgClass = "bg-[#F1F5F9] border border-[#E2E8F0] shadow-none"; 
            alignClass = "self-center mx-12"; // System standard center
        }

        if (!isExpanded) {
            return (
                <div key={msg.id} onClick={() => toggleMessageExpand(msg.id)} 
                     className={`mb-2 p-3 border border-slate-200 rounded-lg bg-white flex justify-between items-center cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm group w-full ${alignClass}`}>
                    <div className="flex items-center gap-4 truncate">
                        <span className="font-bold text-[13px] text-slate-700 shrink-0 w-28 truncate">
                            {isSystem ? 'System' : (isMe ? 'You' : msg.from.name)}
                        </span>
                        <span className="text-xs text-slate-500 truncate max-w-[400px] group-hover:text-slate-700">
                            {msg.isSensitive && !isRevealed ? '[🔒 Sensitive Content Hidden]' : msg.body.replace(/<[^>]*>?/gm, '').substring(0, 80) + '...'}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                        {msg.attachments?.length > 0 && <Paperclip size={14} className="text-slate-400" />}
                        <span className="text-xs font-medium text-slate-400">{new Date(msg.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>
                </div>
            );
        }

        return (
            <div key={msg.id} className={`mb-6 flex flex-col w-full ${alignClass}`}>
                
                {msg.slaBreached && (
                    <div className="mb-2 bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 self-start w-full">
                        <AlertCircle size={14} /> SLA Warning: Unanswered for &gt; 3 Days
                    </div>
                )}

                <div className={`rounded-xl p-6 shadow-sm ${bgClass} w-full`}>
                    
                    {msg.tags && msg.tags.length > 0 && (
                        <div className="flex gap-2 mb-4">
                            {msg.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider">
                                    <Tag size={10} /> {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-between items-start mb-6 group relative">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm
                                ${isSystem ? 'bg-slate-200 text-slate-600' : isMe ? 'bg-blue-100 text-blue-700' : 'bg-indigo-100 text-indigo-700'}`}>
                                {isSystem ? <Bot size={20} /> : msg.from.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="font-bold text-sm text-slate-900">{msg.from.name}</span>
                                    <span className="text-xs text-slate-500 font-medium">&lt;{msg.from.email}&gt;</span>
                                </div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1 cursor-pointer hover:text-slate-700 transition-colors">
                                    to {msg.to.map(t => t.name).join(', ')} <ChevronDown size={10} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                            <div className="text-[11px] text-slate-400 font-semibold whitespace-nowrap">
                                {new Date(msg.timestamp).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 bg-white border border-slate-200 rounded shadow-sm"><Reply size={14} /></button>
                                <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 bg-white border border-slate-200 rounded shadow-sm"><MoreVertical size={14} /></button>
                            </div>
                        </div>
                    </div>

                    {msg.isSensitive && !isRevealed ? (
                        <div className="bg-amber-50 border-2 border-dashed border-amber-200 rounded-xl p-6 flex flex-col items-center justify-center text-center my-4">
                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                                <ShieldAlert className="text-amber-600" size={24} />
                            </div>
                            <h4 className="text-sm font-bold text-amber-900 mb-2">Restricted Financial Data</h4>
                            <p className="text-xs text-amber-700 mb-5 max-w-sm leading-relaxed">
                                This message has been automatically masked for compliance. Access requires explicit audit logging.
                            </p>
                            <button
                                onClick={() => handleReveal(msg.id)}
                                className="inline-flex items-center gap-2 text-xs font-bold bg-white text-slate-800 border border-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                <Unlock size={14} /> Reveal Content (Audit Logged)
                            </button>
                        </div>
                    ) : (
                        <div
                            className="prose prose-sm prose-slate max-w-none text-slate-700 leading-relaxed font-[Inter,sans-serif]"
                            dangerouslySetInnerHTML={{ __html: msg.body }}
                        />
                    )}

                    {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-6 border-t border-slate-200/60 pt-5">
                            <div className="text-[10px] font-bold text-slate-400 mb-3 uppercase tracking-widest flex items-center gap-2">
                                <Paperclip size={12}/> Attachments ({msg.attachments.length})
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {msg.attachments.map(att => (
                                    <div key={att.id} className="flex flex-col bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-blue-400 transition-all group overflow-hidden">
                                        <div className="flex items-start gap-3 p-3">
                                            <div className={`w-10 h-10 rounded flex items-center justify-center shrink-0 mt-0.5
                                                ${att.type?.includes('pdf') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                                                <FileText size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="text-sm font-bold text-slate-800 truncate mb-1">{att.name}</div>
                                                <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
                                                    <span>{att.size}</span>
                                                    <span>•</span>
                                                    {att.status === 'PROCESSED' ? (
                                                        <span className="flex items-center gap-1 text-emerald-600"><CheckCircle2 size={10} /> Attached to {att.assignedTo}</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-amber-600"><AlertCircle size={10} /> Needs Processing</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 px-3 py-2 border-t border-slate-100 flex items-center justify-between text-xs transition-colors group-hover:bg-slate-100">
                                            <button className="font-bold text-blue-600 hover:text-blue-800">Preview</button>
                                            <div className="flex items-center gap-4 text-slate-500 font-semibold">
                                                <button className="flex items-center gap-1.5 hover:text-slate-800"><Download size={14} /> DL</button>
                                                {!att.status || att.status === 'UNPROCESSED' ? (
                                                    <button className="flex items-center gap-1.5 hover:text-blue-600"><Tag size={14} /> Tag to Loan</button>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderComposer = () => (
        <div className="mx-6 mt-2 mb-8 bg-white border border-slate-300 rounded-xl shadow-md overflow-hidden flex flex-col z-30 relative">
            {/* Context-Aware Hint Banner */}
            <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                    <span>💡</span> Suggestion: Client has pending documents.
                </div>
                <button className="text-[10px] font-bold bg-amber-200 text-amber-800 px-2 py-1 rounded hover:bg-amber-300 transition-colors">
                    Insert Request Template
                </button>
            </div>

            {/* Header */}
            <div className="flex flex-col border-b border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center gap-3 w-full">
                        <select 
                            className="bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded px-2 py-1 focus:outline-none"
                            value={composerMode}
                            onChange={(e) => setComposerMode(e.target.value)}
                        >
                            <option value="Reply">Reply</option>
                            <option value="Reply All">Reply All</option>
                            <option value="Forward">Forward</option>
                        </select>
                        
                        <div className="flex-1 flex items-center text-sm">
                            <span className="text-slate-400 mr-2 w-8">To:</span> 
                            <span className="font-bold text-slate-800">{selectedThread?.participants.find(p=>p.role==='sender')?.name || 'Alex Smith'}</span>
                        </div>
                        
                        <button onClick={() => setComposerCcBccVisible(!composerCcBccVisible)} className="text-[11px] font-bold text-blue-600 hover:underline shrink-0">
                            Cc/Bcc
                        </button>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                        <button onClick={() => setComposerOpen(false)} className="p-1 text-slate-400 hover:text-red-500 rounded transition-colors"><X size={16} /></button>
                    </div>
                </div>
                
                {composerCcBccVisible && (
                    <div className="flex flex-col px-4 py-2 bg-white border-t border-slate-100 gap-2">
                         <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center flex-1">
                                <span className="text-slate-400 mr-2 w-8">Cc:</span> 
                                <input type="text" value={composerCc} onChange={e=>setComposerCc(e.target.value)} className="flex-1 focus:outline-none border-b border-transparent focus:border-blue-300" placeholder="Add Cc recipients..."/>
                            </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center flex-1">
                                <span className="text-slate-400 mr-2 w-8">Bcc:</span> 
                                <input type="text" value={composerBcc} onChange={e=>setComposerBcc(e.target.value)} className="flex-1 focus:outline-none border-b border-transparent focus:border-blue-300" placeholder="Add Bcc recipients..."/>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between px-4 py-2 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-1">
                    <button className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-sm font-serif font-bold">B</button>
                    <button className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-sm font-serif italic">I</button>
                    <button className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-sm font-serif underline">U</button>
                    <div className="w-px h-4 bg-slate-200 mx-2"></div>
                    <button className="px-2 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-xs font-medium">List</button>
                    <button className="px-2 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 rounded text-xs font-medium">Link</button>
                </div>
                
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded text-xs font-bold transition-colors">
                        <Paperclip size={14} /> Upload
                    </button>
                    <button onClick={() => setFilesModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded text-xs font-bold transition-colors">
                        <FolderOpen size={14} /> Loan Files
                    </button>
                    <div className="relative">
                        <button onClick={() => setTemplatesModalOpen(!templatesModalOpen)} className="flex items-center gap-1.5 px-3 py-1.5 text-blue-700 hover:bg-blue-50 bg-blue-50/50 rounded text-xs font-bold border border-blue-100 transition-colors">
                            <FileText size={14} /> Templates
                        </button>
                        {templatesModalOpen && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-lg shadow-lg z-50 overflow-hidden">
                                <div className="p-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border-b border-slate-100">Categories</div>
                                <button onClick={() => setTemplatesModalOpen(false)} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">Follow-up</button>
                                <button onClick={() => setTemplatesModalOpen(false)} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">Document Request</button>
                                <button onClick={() => setTemplatesModalOpen(false)} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">Approve/Deny</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Editor */}
            <textarea
                className="w-full p-4 min-h-[160px] max-h-[400px] text-sm text-slate-800 focus:outline-none resize-y bg-white font-[Inter,sans-serif]"
                placeholder="Write your reply or request missing documents..."
                defaultValue="Hi Alex,&#10;&#10;Please find attached the missing disclosures we discussed. Can you also upload the missing W2 forms?&#10;&#10;Best,&#10;Sarah"
            />

            {/* Lending-Aware Attachments */}
            {composerAttachments.length > 0 && (
                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100">
                    <div className="flex flex-col gap-2">
                        {composerAttachments.map(att => (
                            <div key={att.id} className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 shadow-sm text-xs group">
                                <div className="flex items-center gap-3">
                                    <div className="text-slate-400">
                                        {att.id === 'att-2' ? <FolderOpen size={16}/> : <Paperclip size={16} />}
                                    </div>
                                    <span className="font-bold text-slate-800">{att.name}</span>
                                    <span className="text-slate-400">({att.size})</span>
                                    
                                    <div className="flex items-center gap-2 ml-4">
                                        <button className="text-blue-600 hover:underline font-medium">[Preview]</button>
                                        <button className="text-red-600 hover:underline font-medium">[Remove]</button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                    {att.tag && (
                                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium border border-slate-200">
                                            Tag: {att.tag}
                                        </span>
                                    )}
                                    {att.link && (
                                        <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-medium border border-blue-100">
                                            Link: {att.link}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center px-4 py-3 bg-white border-t border-slate-200">
                <div className="flex items-center gap-4">
                    <button onClick={handleSend} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold transition-colors text-sm shadow-sm cursor-pointer">
                        Send
                    </button>
                    <button className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-bold transition-colors text-sm cursor-pointer">
                        Save Draft
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded font-bold transition-colors text-sm cursor-pointer">
                        Schedule <ChevronDown size={14} />
                    </button>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <span className="text-xs font-medium"><Clock size={12} className="inline mr-1 mb-0.5"/> Saved as draft {composerDraftSaved}</span>
                    <button className="p-1.5 hover:bg-slate-100 hover:text-slate-700 rounded transition-colors" title="More options">
                        <MoreVertical size={16} />
                    </button>
                </div>
            </div>
            
            {/* Mock Loan Files Modal overlay */}
            {filesModalOpen && (
                <div className="absolute inset-x-0 bottom-0 top-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col pointer-events-auto rounded-xl">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white rounded-t-xl">
                        <div className="flex items-center gap-2">
                            <FolderOpen size={18} className="text-blue-600"/> 
                            <span className="font-bold text-slate-800">MyFlow Document Library</span>
                        </div>
                        <button onClick={() => setFilesModalOpen(false)} className="p-1 hover:bg-slate-100 rounded cursor-pointer"><X size={16}/></button>
                    </div>
                    <div className="p-3 border-b border-slate-100 bg-slate-50 flex gap-2">
                        <button className="px-3 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-700 shadow-sm cursor-pointer">Client Uploads</button>
                        <button className="px-3 py-1 text-slate-500 rounded text-xs font-bold hover:bg-slate-200 cursor-pointer">Underwriting Docs</button>
                    </div>
                    <div className="flex-1 p-6 overflow-y-auto">
                        <p className="text-sm font-bold text-slate-400 mb-4">Select documents to attach:</p>
                        <div className="space-y-2">
                             <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:border-blue-400 cursor-pointer text-sm">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 cursor-pointer" />
                                <FileText size={16} className="text-slate-400" />
                                <div className="flex-1 font-medium text-slate-700">Bank_Statement_Jan.pdf</div>
                             </div>
                             <div className="flex items-center gap-3 p-3 border border-blue-200 rounded-lg hover:border-blue-400 cursor-pointer text-sm bg-blue-50/30">
                                <input type="checkbox" className="w-4 h-4 rounded border-blue-500 cursor-pointer" checked onChange={()=>{}} />
                                <FileText size={16} className="text-blue-500" />
                                <div className="flex-1 font-bold text-slate-900">LE_Disclosure.pdf</div>
                             </div>
                        </div>
                    </div>
                    <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2 rounded-b-xl">
                        <button onClick={() => setFilesModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded cursor-pointer">Cancel</button>
                        <button onClick={() => setFilesModalOpen(false)} className="px-4 py-2 text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 rounded shadow-sm cursor-pointer">Attach Selected</button>
                    </div>
                </div>
            )}
        </div>
    );

    // --- Renders: Right Pane (Context) ---
    
    const renderContextPanel = () => (
        <div className="w-full lg:w-[25%] border-l border-slate-200 bg-white flex flex-col h-full shrink-0 overflow-y-auto z-10 shadow-[-10px_0_15px_-5px_rgba(0,0,0,0.02)]">
            
            {/* Contact Snapshot */}
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Contact Profile</h4>
                <div className="flex items-center gap-4 mb-5">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-xl font-bold text-blue-700 shadow-sm">
                        {selectedThread?.participants.find(p=>p.role==='sender')?.name?.split(' ').map(n=>n[0]).join('') || 'SJ'}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 leading-tight">
                            {selectedThread?.participants.find(p=>p.role==='sender')?.name || 'Sarah Jenkins'}
                        </div>
                        <div className="text-xs text-slate-500 font-medium">Owner, Jenkins Catering</div>
                    </div>
                </div>
                <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center"><Phone size={12} className="text-slate-400" /></div>
                        <span className="font-medium">(555) 123-4567</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-700">
                        <div className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center"><Mail size={12} className="text-slate-400" /></div>
                        <span className="font-medium truncate">{selectedThread?.participants.find(p=>p.role==='sender')?.email || 'sarah.j@email.com'}</span>
                    </div>
                </div>
                <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                    View Full Profile
                </button>
            </div>

            {/* Loan Context */}
            <div className="p-6 border-b border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center justify-between">
                    Active Loan 
                    <button className="text-blue-600 hover:underline">Switch</button>
                </h4>
                
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                        <div className="font-bold text-slate-900">Refinance $450k</div>
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Active</span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium">Stage:</span>
                            <span className="text-slate-800 font-semibold text-right">Underwriting</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500 font-medium">Rate Lock:</span>
                            <span className="text-red-600 font-bold text-right flex items-center gap-1"><Clock size={10}/> 12 Days Left</span>
                        </div>
                    </div>
                    
                    <div className="w-full bg-slate-100 rounded-full h-2 mb-1">
                        <div className="bg-blue-600 h-2 rounded-full w-[60%] shadow-[0_0_10px_rgba(37,99,235,0.4)]"></div>
                    </div>
                    <div className="text-[10px] text-slate-400 text-right font-medium">60% Complete</div>
                </div>
            </div>

            {/* Pending Documents Dropzone */}
            <div className="p-6 bg-slate-50/50 flex-1">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Conditions</h4>
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold">1 / 3</span>
                </div>
                
                <div className="space-y-3">
                    <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-start gap-3 opacity-50 relative overflow-hidden">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                         <div className="mt-0.5 text-green-500 bg-green-50 rounded-full p-0.5"><CheckCircle2 size={14} /></div>
                         <div>
                            <div className="text-sm font-bold text-slate-700 line-through">2023 W-2 Forms</div>
                            <div className="text-[10px] font-medium text-slate-500 mt-0.5">Fulfilled today by Sarah</div>
                         </div>
                    </div>
                    
                    <div className="bg-blue-50/30 border-2 border-dashed border-blue-300 rounded-xl p-5 flex flex-col items-center justify-center text-center group transition-colors hover:bg-blue-50/50 hover:border-blue-400 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-white shadow-sm text-blue-600 flex items-center justify-center mb-3">
                            <Download size={18} />
                        </div>
                        <div className="font-bold text-slate-800 text-sm mb-1">2024 Tax Returns</div>
                        <p className="text-xs text-slate-500 font-medium max-w-[150px]">Drag & drop attachment here to fulfill condition</p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-lg p-3 flex items-start gap-3 shadow-sm relative overflow-hidden">
                         <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                         <div className="mt-0.5 text-amber-500 bg-amber-50 rounded-full p-0.5"><AlertCircle size={14} /></div>
                         <div>
                            <div className="text-sm font-bold text-slate-900">Business License</div>
                            <div className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mt-1">Requested Oct 10</div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- Renders: Timeline View (Alternative) ---
    
    const renderTimelineView = () => (
        <div className="flex-1 bg-slate-50 overflow-y-auto p-8 border-l border-slate-200 relative">
            <div className="max-w-2xl mx-auto">
                <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-slate-400"/> Activity Timeline
                </h2>
                
                <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-8">
                    {/* Dummy Timeline items based on threads */}
                    {threads.map((t, i) => (
                        <div key={'tl-'+i} className="relative">
                            <div className="absolute -left-[41px] bg-slate-50 border-[3px] border-blue-100 rounded-full p-1">
                                <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white">
                                    <Mail size={8} />
                                </div>
                            </div>
                            
                            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                                <div className="flex justify-between mb-2">
                                    <div className="font-bold text-slate-800">{t.subject}</div>
                                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        {new Date(t.lastActivityDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-sm text-slate-600 mb-3 line-clamp-2">
                                    {t.messages[t.messages.length-1].body.replace(/<[^>]*>?/gm, '')}
                                </div>
                                <button 
                                    onClick={() => { setSelectedThreadId(t.id); setViewMode('conversations'); }}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                >
                                    Open Conversation →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

    // --- Main Layout ---

    return (
        <div className="flex bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[calc(100vh-140px)] min-h-[600px] font-sans">
            {renderThreadList()}

            {viewMode === 'conversations' ? (
                <>
                    <div className="flex-1 flex flex-col bg-[#F8FAFC] relative overflow-hidden z-20 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)]">
                        {selectedThread ? (
                            <>
                                {/* Header */}
                                <div className="px-6 py-4 bg-white border-b border-slate-200 flex justify-between items-center z-10 shrink-0">
                                    <div className="min-w-0 pr-4 flex flex-col items-start">
                                        {selectedThread.campaign && (
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-600 mb-1.5 uppercase tracking-widest bg-amber-50 w-fit px-2 py-0.5 rounded border border-amber-200">
                                                <Zap size={10} /> CAMPAIGN • {selectedThread.campaign.name}
                                            </div>
                                        )}
                                        <h2 className="text-xl font-bold text-slate-900 truncate leading-snug">{selectedThread.subject.replace(/^(Re|Fwd):\s*/i, '')}</h2>
                                        <div className="text-sm text-slate-500 font-medium flex items-center gap-2 mt-1">
                                            <span>
                                                {selectedThread.participants.map(p => p.email === 'alex@myflow.com' ? 'Alex (You)' : p.name).join(', ')}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button onClick={() => { setComposerOpen(true); setComposerMode('Reply'); }} className="h-8 px-4 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
                                            <Reply size={14} /> Reply
                                        </button>
                                        <div className="w-px h-6 bg-slate-200 mx-1"></div>
                                        <button title="Link to Loan" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><LinkIcon size={16} /></button>
                                        <button title="Archive" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"><Archive size={16} /></button>
                                        <button title="More Options" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"><MoreVertical size={16} /></button>
                                    </div>
                                </div>

                                {/* Scroll Area */}
                                <div className="flex-1 overflow-y-auto scroll-smooth bg-slate-50">
                                    <div className="w-full max-w-4xl mx-auto py-8">
                                        {selectedThread.campaign && (
                                            <div className="mx-6 mb-8 p-6 bg-white border border-slate-200 rounded-xl flex items-start gap-4 shadow-sm relative overflow-hidden">
                                                <div className="absolute top-0 left-0 bottom-0 w-1 bg-amber-400"></div>
                                                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100 mt-1">
                                                    <Zap size={24} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 mb-2">ORIGINATED FROM AUTOMATED CAMPAIGN</div>
                                                    <div className="text-slate-600 font-medium space-y-1 text-sm bg-slate-50 p-3 rounded border border-slate-100">
                                                        <div className="flex"><span className="text-slate-400 uppercase tracking-wide text-[10px] w-20 pt-0.5 inline-block">Campaign:</span> <span className="font-bold text-slate-700">{selectedThread.campaign.name}</span></div>
                                                        <div className="flex"><span className="text-slate-400 uppercase tracking-wide text-[10px] w-20 pt-0.5 inline-block">Trigger:</span> <span className="font-bold text-slate-700">Lead Status changed to 'Nurturing'</span></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Removed redundant Load Older Messages button since all are expanded by default */}

                                        <div className="flex flex-col gap-2 w-full pr-6 place-items-stretch">
                                            {[...selectedThread.messages].sort((a,b) => new Date(a.timestamp) - new Date(b.timestamp)).map((msg, idx) => 
                                                renderMessageCard(msg, idx, idx === selectedThread.messages.length - 1)
                                            )}
                                        </div>

                                        {!composerOpen && (
                                            <div className="mx-6 mt-6 p-4 bg-white border border-slate-300 rounded-xl shadow-sm hover:shadow hover:border-blue-400 transition-all cursor-text flex items-center gap-3 w-[calc(100%-48px)] self-end"
                                                 onClick={() => { setComposerOpen(true); setComposerMode('Reply'); }}>
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                    <Reply size={14}/>
                                                </div>
                                                <span className="text-sm font-semibold text-slate-400">Reply to {selectedThread.participants.find(p=>p.role==='recipient' && p.email !== 'alex@myflow.com')?.name.split(' ')[0] || 'Sarah'}...</span>
                                            </div>
                                        )}

                                        {composerOpen && renderComposer()}

                                        <div ref={messagesEndRef} className="h-10" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50/50">
                                <div className="text-center max-w-sm">
                                    <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <Search size={32} className="text-slate-300" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">No Thread Selected</h3>
                                    <p className="text-sm text-slate-500 font-medium">Pick a conversation from the list to view the full thread, download attachments, and reply.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            ) : renderTimelineView()}
        </div>
    );
};

export default LeadEmailTab;
