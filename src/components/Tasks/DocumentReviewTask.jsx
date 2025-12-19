import React, { useState } from 'react';
import {
    ArrowLeft, Clock, Calendar, Shield,
    User, MoreVertical, FileText, CheckCircle2,
    XCircle, AlertCircle, RefreshCw, Send,
    Download, Eye, History, ChevronDown
} from 'lucide-react';

const DocumentReviewTask = ({ task, document = {}, onBack, onComplete }) => {
    const [decision, setDecision] = useState(null); // 'approve', 'revise', 'reject'
    const [comment, setComment] = useState('');
    // Safely access versions
    const initialVersion = (document?.versions && document.versions.length > 0) ? document.versions[0].version : 1;
    const [version, setVersion] = useState(initialVersion);

    const handleDecisionClick = (type) => {
        setDecision(type);
    };

    const handleSubmit = () => {
        if (!comment.trim()) {
            alert("Comment is required for this action.");
            return;
        }
        // Mock submission
        onComplete({ decision, comment });
    };

    if (!document) return null; // Safety guard

    return (
        <div className="flex flex-col h-full bg-slate-50 absolute inset-0 z-50 overflow-hidden">
            {/* 1. Header (Sticky) */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                        title="Back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-bold text-slate-900">{task.title}</h1>
                            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                                {task.status}
                            </span>
                            {task.priority === 'High' && (
                                <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">
                                    <AlertCircle size={12} /> High Priority
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                            <div className="flex items-center gap-1">
                                <Clock size={12} className={task.slaStatus === 'danger' ? 'text-red-500' : 'text-slate-400'} />
                                <span className={task.slaStatus === 'danger' ? 'text-red-600 font-bold' : ''}>
                                    Due: {task.dueDate} (SLA: {task.sla})
                                </span>
                            </div>
                            <span className="text-slate-300">|</span>
                            <div className="flex items-center gap-1">
                                <User size={12} />
                                <span>Assigned to: <strong>{task.assignedTo}</strong></span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="px-3 py-1.5 text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-sm font-medium shadow-sm transition-colors">
                        Reassign
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>

            {/* 2. Document Context Strip */}
            <div className="bg-slate-100 border-b border-slate-200 px-6 py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-700">
                        <FileText size={14} className="text-slate-400" />
                        <span className="font-semibold">{document?.name || "Unnamed Document"}</span>
                        <span className="text-slate-400">•</span>
                        <span>{document?.filename || "No file"}</span>
                    </div>
                    <div className="text-slate-500">
                        Uploaded by <span className="text-slate-700 font-medium">{document?.uploadedBy || "Unknown"}</span> on {document?.uploadedDate || "N/A"}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium px-2 py-1 hover:bg-white rounded">
                        <Eye size={12} /> View
                    </button>
                    <button className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 font-medium px-2 py-1 hover:bg-white rounded">
                        <Download size={12} /> Download
                    </button>
                </div>
            </div>

            {/* 3. Main Content Grid */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Pane: Preview & Decision */}
                <div className="flex-1 flex flex-col min-w-0 border-r border-slate-200 overflow-y-auto bg-white">
                    {/* Document Preview Placeholder */}
                    <div className="bg-slate-50 m-6 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center h-96 min-h-[400px]">
                        <FileText size={48} className="text-slate-300 mb-4" />
                        <h3 className="text-slate-500 font-medium mb-2">Document Preview</h3>
                        <p className="text-sm text-slate-400">PDF Viewer would act here</p>

                        <div className="mt-6 flex items-center bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
                            <span className="text-xs font-bold text-slate-500 mr-2">Version:</span>
                            <select
                                value={version}
                                onChange={(e) => setVersion(e.target.value)}
                                className="text-sm font-semibold text-slate-700 outline-none bg-transparent cursor-pointer"
                            >
                                {(document?.versions || []).map(v => (
                                    <option key={v.id} value={v.version}>v{v.version} ({v.date})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Decision Panel */}
                    <div className="px-8 pb-8 mt-auto">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Shield size={16} className="text-slate-400" />
                            Review Decision
                        </h3>

                        <div className="p-6 bg-slate-50/80 rounded-xl border border-slate-200">
                            {/* Action Buttons */}
                            <div className="flex gap-3 mb-4">
                                <button
                                    onClick={() => handleDecisionClick('approve')}
                                    className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all
                                        ${decision === 'approve'
                                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-emerald-200 hover:bg-emerald-50/50'}`}
                                >
                                    <CheckCircle2 size={24} className={decision === 'approve' ? 'fill-emerald-100' : ''} />
                                    <span className="font-bold text-sm">Approve</span>
                                </button>

                                <button
                                    onClick={() => handleDecisionClick('revise')}
                                    className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all
                                        ${decision === 'revise'
                                            ? 'border-amber-500 bg-amber-50 text-amber-700'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-amber-200 hover:bg-amber-50/50'}`}
                                >
                                    <RefreshCw size={24} className={decision === 'revise' ? 'fill-amber-100' : ''} />
                                    <span className="font-bold text-sm">Request Revision</span>
                                </button>

                                <button
                                    onClick={() => handleDecisionClick('reject')}
                                    className={`flex-1 flex flex-col items-center justify-center gap-2 py-4 rounded-xl border-2 transition-all
                                        ${decision === 'reject'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-slate-200 bg-white text-slate-500 hover:border-red-200 hover:bg-red-50/50'}`}
                                >
                                    <XCircle size={24} className={decision === 'reject' ? 'fill-red-100' : ''} />
                                    <span className="font-bold text-sm">Reject</span>
                                </button>
                            </div>

                            {/* Comment Area */}
                            {decision && (
                                <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                                    <label className="block text-xs font-bold text-slate-500 mb-2">
                                        {decision === 'approve' ? 'Optional Comment' : 'Reason / Instructions (Required)'}
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className={`w-full p-3 text-sm rounded-lg border focus:ring-2 focus:outline-none transition-shadow
                                            ${decision === 'approve' ? 'border-emerald-200 focus:border-emerald-500 focus:ring-emerald-200' :
                                                decision === 'revise' ? 'border-amber-200 focus:border-amber-500 focus:ring-amber-200' :
                                                    'border-red-200 focus:border-red-500 focus:ring-red-200'}`}
                                        rows={3}
                                        placeholder={decision === 'revise' ? "Explain what needs to be changed..." : "Add a note..."}
                                    />
                                    <div className="flex justify-end mt-3">
                                        <button
                                            onClick={handleSubmit}
                                            className={`px-6 py-2 rounded-lg text-white font-bold text-sm shadow-md transition-transform active:scale-95
                                                ${decision === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' :
                                                    decision === 'revise' ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-200' :
                                                        'bg-red-600 hover:bg-red-700 shadow-red-200'}`}
                                        >
                                            Submit Decision
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Context & History */}
                <div className="w-80 bg-slate-50 flex flex-col border-l border-slate-200 overflow-y-auto">
                    {/* Metadata */}
                    <div className="p-5 border-b border-slate-200">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Task Details</h4>
                        <div className="space-y-3 text-sm">
                            <MetaRow label="Type" value="Document Review" />
                            <MetaRow label="Created" value={task.createdDate} />
                            <MetaRow label="Created By" value={task.createdBy} />
                            <MetaRow label="Related To" value={<a href="#" className="text-blue-600 hover:underline">Lead: {task.relatedLead}</a>} />
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-5 flex-1">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <History size={12} /> Activity
                        </h4>
                        <div className="space-y-6 border-l border-slate-200 ml-2 pl-4 relative">
                            {/* Mock History Items */}
                            <HistoryItem
                                icon={User}
                                title="Assigned to You"
                                date="Today, 9:00 AM"
                                user="System"
                                color="bg-indigo-100 text-indigo-600"
                            />
                            <HistoryItem
                                icon={FileText}
                                title="Document Uploaded"
                                date="Yesterday, 4:30 PM"
                                user="Borrower"
                                color="bg-slate-200 text-slate-600"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const MetaRow = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-800">{value}</span>
    </div>
);

const HistoryItem = ({ icon: Icon, title, date, user, color }) => (
    <div className="relative">
        <div className={`absolute -left-[25px] p-1 rounded-full border-2 border-slate-50 ${color}`}>
            <Icon size={10} />
        </div>
        <div>
            <div className="text-xs font-bold text-slate-700">{title}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{user} • {date}</div>
        </div>
    </div>
);

export default DocumentReviewTask;
