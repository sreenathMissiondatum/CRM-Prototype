import React, { useState } from 'react';
import {
    FileText, CheckCircle2, AlertCircle, Clock,
    Eye, Download, ChevronDown, ChevronRight,
    Send, UploadCloud, ShieldAlert, XCircle
} from 'lucide-react';

const DocumentRow = ({ doc, onNudge, onUpload, onAssign, onApprove, onReject, onRequest, onViewTask, onViewNudgeTask, showOriginBadges }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Derived Status
    const status = doc.status; // 'missing', 'requested', 'uploaded', 'review', 'approved', 'rejected'
    const isBlocker = (doc.required && (status === 'missing' || status === 'rejected' || status === 'requested'));
    const latestVersion = doc.versions && doc.versions.length > 0 ? doc.versions[0] : null;
    const reviewTask = doc.reviewTask;

    // Nudge Logic helpers
    const latestNudge = doc.nudges && doc.nudges.length > 0 ? doc.nudges[0] : null;
    const nudgeCount = doc.nudges ? doc.nudges.length : 0;

    const getTimeSince = (dateString) => {
        if (!dateString) return '';
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;
        const diffHrs = diffMs / (1000 * 60 * 60);

        if (diffHrs < 1) return 'Just now';
        if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`;
        const diffDays = Math.floor(diffHrs / 24);
        return `${diffDays}d ago`;
    };

    const timeSinceNudge = latestNudge ? getTimeSince(latestNudge.timestamp) : '';

    // Nudge Button State Logic
    const isRecentNudge = latestNudge && (new Date() - new Date(latestNudge.timestamp)) / (1000 * 60 * 60) < 24;
    const isStatusDisabled = status === 'missing' || status === 'approved' || status === 'rejected';

    // Determine Disabled State & Tooltip
    let nudgeDisabled = false;
    let nudgeTitle = "Send Reminder";

    if (isStatusDisabled) {
        nudgeDisabled = true;
        nudgeTitle = status === 'missing' ? "Request document first" : "Document already processed";
    } else if (isRecentNudge) {
        nudgeDisabled = true;
        nudgeTitle = "Reminder sent recently (wait 24h)";
    }

    // Status Icon Helper
    const StatusIcon = ({ status }) => {
        switch (status) {
            case 'approved':
                return <div title="Approved" className="text-emerald-500"><CheckCircle2 size={20} className="fill-emerald-50" /></div>;
            case 'review':
                return <div title="Under Review" className="text-blue-500 flex relative">
                    <Clock size={20} className="fill-blue-50" />
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                    </span>
                </div>;
            case 'rejected':
                return <div title="Needs Revision" className="text-red-500"><XCircle size={20} className="fill-red-50" /></div>;
            case 'uploaded':
                return <div title="Uploaded" className="text-slate-400"><FileText size={20} className="fill-slate-50" /></div>;
            case 'requested':
                return <div title="Requested" className="text-amber-500"><Clock size={20} className="fill-amber-50" /></div>;
            case 'missing':
            default:
                return <div title="Not Requested" className="text-slate-300"><AlertCircle size={20} className="fill-slate-50" /></div>;
        }
    };

    return (
        <div className={`group transition-colors border-b border-slate-50 last:border-0 ${isExpanded ? 'bg-slate-50' : 'bg-white'}`}>
            <div className="p-4">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <StatusIcon status={status} />
                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-bold text-slate-800 text-sm">{doc.name}</span>
                                {doc.required && <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Required</span>}

                                {/* Program Badges (Common Docs) */}
                                {showOriginBadges && doc.requiredBy && doc.requiredBy.length > 0 && (
                                    <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-slate-400">Required by:</span>
                                        {doc.requiredBy.map((p, i) => (
                                            <span key={i} className="text-[9px] font-bold uppercase text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100" title={`Required for ${p.name}`}>
                                                {p.code}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {status === 'rejected' && (
                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100">Needs Revision</span>
                                )}
                            </div>

                            {/* Missing / Requested State Actions */}
                            {(!latestVersion) && (
                                <div className="mt-1 flex flex-col gap-1 text-xs">
                                    <div className="flex items-center gap-3">
                                        {status === 'missing' && <span className="text-slate-400">Not yet requested.</span>}
                                        {status === 'requested' && <span className="text-amber-600 font-medium">Waiting on borrower...</span>}

                                        <div className="flex items-center gap-2">
                                            {/* Request Action (Only valid for missing/virtual docs) */}
                                            {status === 'missing' && onRequest && (
                                                <>
                                                    <button
                                                        onClick={onRequest}
                                                        className="text-white bg-indigo-600 hover:bg-indigo-700 font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors shadow-sm"
                                                    >
                                                        <Send size={12} /> Request
                                                    </button>
                                                    <span className="text-slate-300">|</span>
                                                </>
                                            )}

                                            <button
                                                onClick={onUpload}
                                                disabled={status === 'missing'}
                                                className={`font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors
                                                    ${status === 'missing' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-blue-600 hover:bg-slate-100'}`}
                                            >
                                                <UploadCloud size={12} /> Upload
                                            </button>

                                            <span className="text-slate-300">|</span>

                                            <span
                                                title={nudgeTitle}
                                                className={`inline-flex rounded ${nudgeDisabled ? 'cursor-not-allowed' : ''}`}
                                            >
                                                <button
                                                    onClick={onNudge}
                                                    disabled={nudgeDisabled}
                                                    className={`font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-colors
                                                        ${nudgeDisabled
                                                            ? 'text-slate-400 pointer-events-none' // pointer-events-none on button, allow wrapper to catch hover
                                                            : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'}`}
                                                >
                                                    <Send size={12} /> Nudge
                                                </button>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Task Link Feedback (Nudge) */}
                                    {latestNudge && (
                                        <div className="text-[10px] flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 mt-1">
                                            <span className="font-semibold">Related Task:</span>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    onViewNudgeTask && onViewNudgeTask(latestNudge);
                                                }}
                                                className="hover:underline flex items-center gap-1 text-left"
                                            >
                                                {latestNudge.taskTitle}
                                                <span className="text-blue-400">({latestNudge.taskId})</span>
                                            </button>
                                            <span className="text-blue-300 mx-1">•</span>
                                            <span className="text-blue-500">
                                                {nudgeCount > 1 ? `${nudgeCount} reminders sent` : '1 reminder sent'}
                                            </span>
                                            {timeSinceNudge && (
                                                <>
                                                    <span className="text-blue-300 mx-1">•</span>
                                                    <span className="text-slate-500 font-medium">
                                                        {timeSinceNudge}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Review Actions (if uploaded) */}
                    {(status === 'uploaded' || status === 'review' || status === 'approved') && (
                        <div className="flex gap-2 items-center">
                            {reviewTask ? (
                                <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                    <div className="text-right hidden sm:block">
                                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reviewer</div>
                                        <div className="text-xs font-bold text-slate-700">{reviewTask.assignedTo}</div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center justify-center text-xs font-bold" title={reviewTask.assignedTo}>
                                        {reviewTask.assignedToAvatar}
                                    </div>

                                    <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>

                                    {/* Task Status */}
                                    <div className="flex flex-col items-end">
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <span className="text-slate-500 hidden sm:inline">Due:</span>
                                            <span className={`font-medium ${reviewTask.dueDate === 'Today' ? 'text-amber-600' : 'text-slate-700'}`}>
                                                {reviewTask.dueDate}
                                            </span>
                                        </div>
                                        {(status === 'review') ? (
                                            <button
                                                onClick={() => {
                                                    try {
                                                        console.log("Opening task:", reviewTask);
                                                        if (onViewTask) {
                                                            onViewTask(reviewTask);
                                                        } else {
                                                            alert("onViewTask handler is missing!");
                                                        }
                                                    } catch (e) {
                                                        console.error(e);
                                                        alert(`Error opening task:\n${e.message}\n\nStack:\n${e.stack?.slice(0, 200)}`);
                                                    }
                                                }}
                                                className="text-[10px] text-blue-600 hover:underline font-medium flex items-center gap-1"
                                            >
                                                View Task <ChevronRight size={10} />
                                            </button>
                                        ) : (
                                            <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                                                Review Complete <CheckCircle2 size={10} />
                                            </span>
                                        )}

                                    </div>
                                </div>
                            ) : (
                                status !== 'approved' && (
                                    <button
                                        onClick={onAssign}
                                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:border-blue-300 hover:text-blue-600 shadow-sm transition-all"
                                    >
                                        Assign Review
                                    </button>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Latest Comment Preview */}
                {reviewTask && reviewTask.latestComment && !isExpanded && (
                    <div className="mb-3 ml-0 sm:ml-9 bg-amber-50/60 border border-amber-100 rounded-lg p-2.5 flex items-start gap-2.5 relative">
                        <div className="p-1 rounded-full bg-amber-100 text-amber-600 shrink-0 mt-0.5">
                            <Send size={10} />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-0.5">
                                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">Latest Comment</span>
                                <span className="text-[10px] text-amber-600/70">Just now</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-snug">"{reviewTask.latestComment}"</p>
                        </div>
                    </div>
                )}

                {/* File Card (If Uploaded) */}
                {latestVersion && (
                    <div className="ml-0 sm:ml-9 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/file">
                        {/* File Info */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white border border-slate-200 rounded-lg text-blue-500 shadow-sm">
                                <FileText size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    {latestVersion.filename}
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-600 font-bold">
                                        v{latestVersion.version}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                    <span>{latestVersion.size}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span>{latestVersion.date}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                    <span>{latestVersion.uploadedBy}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 border-t sm:border-t-0 border-slate-200 pt-3 sm:pt-0">
                            <div className="flex items-center gap-2">
                                <button className="p-1.5 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded shadow-sm transition-colors" title="View">
                                    <Eye size={14} />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded shadow-sm transition-colors" title="Download">
                                    <Download size={14} />
                                </button>
                            </div>
                            <div className="h-4 w-px bg-slate-300 mx-1"></div>
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${isExpanded ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                History
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* History Expansion */}
            {isExpanded && doc.versions && doc.versions.length > 0 && (
                <div className="bg-slate-50/50 border-t border-slate-100 shadow-inner px-4 py-3 pb-4 ml-0 sm:ml-9 rounded-b-lg mb-2 mr-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Version History</h4>
                    <div className="space-y-2">
                        {doc.versions.slice(1).map(ver => ( // Skip latest, already shown
                            <div key={ver.id} className="flex items-center justify-between text-xs bg-white border border-slate-100 p-2 rounded-lg text-slate-600">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono font-bold w-6 text-slate-400">v{ver.version}</span>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-700">{ver.filename}</span>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                            <span>{ver.date}</span>
                                            <span>•</span>
                                            <span>{ver.uploadedBy}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="text-slate-400 hover:text-blue-600">
                                    <Download size={14} />
                                </button>
                            </div>
                        ))}
                        {doc.versions.length <= 1 && (
                            <div className="text-xs text-slate-400 italic pl-1">No previous versions.</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentRow;
