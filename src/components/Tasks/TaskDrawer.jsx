import React, { useState, useEffect, useRef } from 'react';
import {
    X, CheckCircle2, AlertCircle, Clock, Calendar,
    User, MoreVertical, Paperclip, Send,
    FileText, Shield, RefreshCw, XCircle, ChevronRight,
    MessageSquare
} from 'lucide-react';

const TaskDrawer = ({ task, document, onClose, onComplete }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('comments'); // 'comments' or 'checklist'
    const [newComment, setNewComment] = useState('');
    const [checklist, setChecklist] = useState([
        { id: 1, text: "Verify document date is within last 3 months", checked: false },
        { id: 2, text: "Confirm account holder matches borrower name", checked: false },
        { id: 3, text: "Check for unexplained large cash deposits", checked: false },
        { id: 4, text: "Validate ending balance consistency", checked: false },
    ]);

    // Mock Comments Data
    const [comments, setComments] = useState([
        {
            id: 1,
            user: "System",
            role: "System",
            text: "Task assigned to John Doe",
            timestamp: "Yesterday, 9:00 AM",
            type: "system"
        },
        {
            id: 2,
            user: "Alex Morgan",
            role: "Loan Officer",
            avatar: "AM",
            text: "Please prioritize this review. Ideally we need this cleared by EOD to move to underwriting.",
            timestamp: "Yesterday, 10:15 AM",
            type: "user"
        },
        {
            id: 3,
            user: "System",
            role: "System",
            text: "Reminder sent to borrower",
            timestamp: "Today, 8:45 AM",
            type: "system"
        }
    ]);

    const [showDecisionModal, setShowDecisionModal] = useState(false);
    const [decisionType, setDecisionType] = useState('approve'); // 'approve', 'revise', 'reject'
    const [decisionComment, setDecisionComment] = useState('');
    const commentsEndRef = useRef(null);

    useEffect(() => {
        // Trigger slide-in
        setIsOpen(true);
        // Scroll to bottom of comments
        scrollToBottom();
    }, []);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(onClose, 300); // Wait for animation
    };

    const handleCheck = (id) => {
        setChecklist(checklist.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const handleAddComment = () => {
        if (!newComment.trim()) return;
        const comment = {
            id: Date.now(),
            user: "John Doe", // Current user mock
            role: "Reviewer",
            avatar: "JD",
            text: newComment,
            timestamp: "Just now",
            type: "user"
        };
        setComments([...comments, comment]);
        setNewComment('');
        setTimeout(scrollToBottom, 100);
    };

    const submitDecision = () => {
        if (decisionType !== 'approve' && !decisionComment.trim()) {
            alert("Please provide a reason for your decision.");
            return;
        }

        // Add decision as a system comment (mocking backend logic)
        const sysComment = {
            id: Date.now(),
            user: "System",
            role: "System",
            text: `Task marked as ${decisionType === 'approve' ? 'Completed' : 'Returned'}. Decision: ${decisionType.toUpperCase()}.`,
            timestamp: "Just now",
            type: "system"
        };
        setComments([...comments, sysComment]);

        // Close and callback
        setTimeout(() => {
            onComplete({ decision: decisionType, comment: decisionComment });
            handleClose();
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-slate-900/20 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                onClick={handleClose}
            ></div>

            {/* Drawer */}
            <div className={`relative w-full max-w-[480px] bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

                {/* 1. Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-white shrink-0 z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border border-slate-200">
                                {task.id || 'TASK-5512'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 uppercase tracking-wide">
                                {task.status || 'In Review'}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-slate-200 text-slate-500">
                                medium
                            </span>
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 leading-tight">Review: {task.title || document.name}</h2>
                    </div>
                    <button onClick={handleClose} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* 2. Context Panel */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs shrink-0 grid grid-cols-2 gap-y-2 gap-x-4">
                    <div>
                        <span className="text-slate-400 block mb-0.5">Related Document</span>
                        <div className="font-medium text-slate-700 flex items-center gap-1.5 truncate">
                            <FileText size={12} className="text-blue-500" />
                            <a href="#" className="hover:text-blue-600 hover:underline truncate" title={document.name}>{document.name}</a>
                        </div>
                    </div>
                    <div>
                        <span className="text-slate-400 block mb-0.5">Related Record</span>
                        <div className="font-medium text-slate-700 truncate">
                            <a href="#" className="hover:text-blue-600 hover:underline">LN-2298</a> • <a href="#" className="hover:text-blue-600 hover:underline">Apex Logistics</a>
                        </div>
                    </div>
                    <div>
                        <span className="text-slate-400 block mb-0.5">Assigned To</span>
                        <div className="font-medium text-slate-700 flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[8px] font-bold">JD</div>
                            {task.assignedTo || 'John Doe'}
                        </div>
                    </div>
                    <div>
                        <span className="text-slate-400 block mb-0.5">Due Date</span>
                        <div className="font-medium text-slate-700 flex items-center gap-1.5">
                            <Calendar size={12} className="text-slate-400" />
                            {task.dueDate || 'Sep 18, 2025'}
                        </div>
                    </div>
                </div>

                {/* 3. Main Body */}
                <div className="flex-1 overflow-y-auto bg-white p-6">

                    {/* Section 1: Task Description */}
                    <div className="mb-8">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Instructions</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            {task.description || "Verify the attached business bank statements for completeness. Ensure there are no large unexplained cash deposits and that the ending balances match the schedule of accounts provided."}
                        </p>
                    </div>

                    {/* Section 2: Checklist */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                Checklist
                                <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px]">{checklist.filter(i => i.checked).length}/{checklist.length}</span>
                            </h3>
                        </div>
                        <div className="space-y-2">
                            {checklist.map(item => (
                                <div
                                    key={item.id}
                                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer ${item.checked ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-200 hover:border-slate-300'}`}
                                    onClick={() => handleCheck(item.id)}
                                >
                                    <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 bg-white'}`}>
                                        {item.checked && <CheckCircle2 size={12} />}
                                    </div>
                                    <span className={`text-sm ${item.checked ? 'text-emerald-700 line-through decoration-emerald-300' : 'text-slate-700'}`}>
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Section 3: Comments Thread */}
                    <div className="mb-2">
                        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                            Comments & Activity
                        </h3>
                        <div className="space-y-4">
                            {comments.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.type === 'system' ? 'items-center justify-center my-4 opacity-75' : 'items-start'}`}>
                                    {msg.type === 'system' ? (
                                        <div className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                                            {msg.text} • {msg.timestamp}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold shrink-0 border border-blue-200">
                                                {msg.avatar}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-baseline gap-2 mb-1">
                                                    <span className="text-sm font-bold text-slate-900">{msg.user}</span>
                                                    <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 rounded">{msg.role}</span>
                                                    <span className="text-[10px] text-slate-400 ml-auto">{msg.timestamp}</span>
                                                </div>
                                                <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg rounded-tl-none border border-slate-100 shadow-sm">
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            <div ref={commentsEndRef} />
                        </div>
                    </div>
                </div>

                {/* Section 4: Add Comment (Fixed at bottom of scrollable area, actually part of body or footer? Design says Footer. Let's put slightly above footer or in footer stack) */}
                <div className="p-4 bg-white border-t border-slate-100">
                    <div className="relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAddComment())}
                            placeholder="Write a comment..."
                            className="w-full pl-4 pr-10 py-3 text-sm rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none bg-slate-50 scrollbar-hide"
                            rows={1}
                            style={{ minHeight: '44px' }}
                        />
                        <button
                            onClick={handleAddComment}
                            className={`absolute right-2 top-2 p-1.5 rounded-lg transition-colors ${newComment.trim() ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-300'}`}
                            disabled={!newComment.trim()}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>

                {/* Footer (Sticky Actions) */}
                <div className="p-4 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowDecisionModal(true)}
                            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Shield size={16} /> Submit Decision
                        </button>
                        <button className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors" title="Reassign">
                            <User size={18} />
                        </button>
                        <button className="p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors" title="More Actions">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>

                {/* Submit Decision Modal (Nested) */}
                {showDecisionModal && (
                    <div className="absolute inset-0 bg-white/95 z-30 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-900">Submit Review Decision</h3>
                            <button onClick={() => setShowDecisionModal(false)} className="bg-slate-100 p-1 rounded hover:bg-slate-200 text-slate-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="space-y-4">
                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${decisionType === 'approve' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <input type="radio" name="decision" checked={decisionType === 'approve'} onChange={() => setDecisionType('approve')} className="w-5 h-5 text-emerald-600" />
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                            Approve <CheckCircle2 size={16} className="text-emerald-600" />
                                        </div>
                                        <p className="text-xs text-slate-500">Document meets all requirements.</p>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${decisionType === 'revise' ? 'border-amber-500 bg-amber-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <input type="radio" name="decision" checked={decisionType === 'revise'} onChange={() => setDecisionType('revise')} className="w-5 h-5 text-amber-600" />
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                            Needs Revision <RefreshCw size={16} className="text-amber-600" />
                                        </div>
                                        <p className="text-xs text-slate-500">Document has issues or missing info.</p>
                                    </div>
                                </label>

                                <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${decisionType === 'reject' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                    <input type="radio" name="decision" checked={decisionType === 'reject'} onChange={() => setDecisionType('reject')} className="w-5 h-5 text-red-600" />
                                    <div className="flex-1">
                                        <div className="font-bold text-slate-900 flex items-center gap-2">
                                            Reject <XCircle size={16} className="text-red-600" />
                                        </div>
                                        <p className="text-xs text-slate-500">Document is invalid or incorrect.</p>
                                    </div>
                                </label>

                                <div className="mt-6">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        {decisionType === 'approve' ? 'Comments (Optional)' : 'Reason for Revision/Rejection (Required)'}
                                    </label>
                                    <textarea
                                        value={decisionComment}
                                        onChange={(e) => setDecisionComment(e.target.value)}
                                        className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none h-32 text-sm"
                                        placeholder="Add details for the borrower..."
                                    ></textarea>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="notify" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                                    <label htmlFor="notify" className="text-sm text-slate-600 cursor-pointer">Notify borrower immediately</label>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 border-t border-slate-100 bg-slate-50">
                            <button
                                onClick={submitDecision}
                                className={`w-full py-3 rounded-lg text-white font-bold shadow-md transition-transform active:scale-95 ${decisionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' :
                                        decisionType === 'revise' ? 'bg-amber-600 hover:bg-amber-700' :
                                            'bg-red-600 hover:bg-red-700'
                                    }`}
                            >
                                Confirm & Submit
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDrawer;
