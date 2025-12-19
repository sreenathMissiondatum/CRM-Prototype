import React, { useState, useMemo } from 'react';
import {
    FileText, CheckCircle2, AlertCircle, Clock,
    Eye, Download, XCircle, ShieldAlert,
    ChevronDown, ChevronRight, Send, Plus, UploadCloud
} from 'lucide-react';

const DocumentsTab = ({ loan }) => {
    // --------------------------------------------------------------------------
    // MOCK DATA: Document Types & Versions
    // --------------------------------------------------------------------------
    const [docTypes, setDocTypes] = useState([
        {
            id: 'd1',
            category: 'Financials',
            name: 'Business Tax Returns (Last 2 Years)',
            required: true,
            nudges: [],
            versions: [
                { id: 'v2', version: 2, file: 'Tax_Returns_2022_23_FINAL.pdf', size: '4.2 MB', uploadedBy: 'John Doe (Borrower)', date: '2 hours ago', status: 'uploaded', comments: 0 },
                { id: 'v1', version: 1, file: 'Tax_Returns_Draft.pdf', size: '4.0 MB', uploadedBy: 'John Doe (Borrower)', date: '2 days ago', status: 'rejected', rejectionReason: 'Missing Schedule C', comments: 1 }
            ]
        },
        {
            id: 'd2',
            category: 'Financials',
            name: 'YTD Profit & Loss Statement',
            required: true,
            nudges: [],
            versions: [] // Missing
        },
        {
            id: 'd3',
            category: 'Financials',
            name: 'Business Bank Statements (Last 3 Months)',
            required: true,
            nudges: [],
            versions: [
                { id: 'v1', version: 1, file: 'Bank_Stmts_Q3.pdf', size: '12.4 MB', uploadedBy: 'System (Plaid)', date: '1 hour ago', status: 'review', comments: 0 }
            ]
        },
        {
            id: 'd4',
            category: 'Collateral',
            name: 'Equipment List & Valuation',
            required: false,
            nudges: [],
            versions: [
                { id: 'v1', version: 1, file: 'Equip_Valuation_v2.pdf', size: '1.1 MB', uploadedBy: 'Alex Morgan (LO)', date: '1 week ago', status: 'approved', approvedBy: 'Sarah Smith (UW)', comments: 2 }
            ]
        },
        {
            id: 'd5',
            category: 'Collateral',
            name: 'Proof of Insurance',
            required: true,
            nudges: [],
            versions: [
                { id: 'v1', version: 1, file: 'Ins_Cert_Expired.pdf', size: '0.8 MB', uploadedBy: 'John Doe', date: 'Yesterday', status: 'rejected', rejectionReason: 'Policy expired on Oct 1st', comments: 0 }
            ]
        },
        {
            id: 'd6',
            category: 'Legal & Identity',
            name: 'Articles of Incorporation',
            required: true,
            nudges: [],
            versions: [
                { id: 'v1', version: 1, file: 'Articles_Inc.pdf', size: '2.5 MB', uploadedBy: 'John Doe', date: '2 weeks ago', status: 'uploaded', comments: 0 }
            ]
        },
        {
            id: 'd7',
            category: 'Legal & Identity',
            name: 'Operating Agreement',
            required: true,
            nudges: [],
            versions: [] // Missing
        }
    ]);

    const [filterBlockers, setFilterBlockers] = useState(false);

    // --------------------------------------------------------------------------
    // DERIVED STATE
    // --------------------------------------------------------------------------
    const getDocStatus = (doc) => {
        if (doc.versions.length === 0) return 'missing';
        return doc.versions[0].status;
    };

    const blockers = useMemo(() => {
        return docTypes.filter(doc => {
            const status = getDocStatus(doc);
            if (doc.required && status === 'missing') return true;
            if (status === 'rejected') return true;
            return false;
        });
    }, [docTypes]);

    const groupedDocs = useMemo(() => {
        let docsToRender = filterBlockers ? blockers : docTypes;

        return docsToRender.reduce((acc, doc) => {
            if (!acc[doc.category]) acc[doc.category] = [];
            acc[doc.category].push(doc);
            return acc;
        }, {});
    }, [docTypes, blockers, filterBlockers]);


    // --------------------------------------------------------------------------
    // ACTIONS (Mock)
    // --------------------------------------------------------------------------
    const handleNudge = (docId) => {
        const now = new Date();

        setDocTypes(prev => prev.map(doc => {
            if (doc.id !== docId) return doc;

            // Cooldown Check (24 hours)
            if (doc.nudges && doc.nudges.length > 0) {
                const lastNudge = new Date(doc.nudges[0].timestamp);
                const diffHours = (now - lastNudge) / (1000 * 60 * 60);
                if (diffHours < 24) {
                    alert("Cooldown active: A reminder was sent recently.");
                    return doc;
                }
            }

            // Create New Nudge Task
            const newNudge = {
                id: `nudge_${Date.now()}`,
                timestamp: now.toISOString(),
                taskId: `TASK-${Math.floor(Math.random() * 10000)}`,
                taskTitle: `Request document: ${doc.name}`,
                sentBy: 'Alex Morgan (LO)'
            };

            alert(`Task Created: "${newNudge.taskTitle}"\nAssigned to: Borrower\nChannel: Portal Notification + Email`);

            return {
                ...doc,
                nudges: [newNudge, ...(doc.nudges || [])]
            };
        }));
    };

    const handleOfflineUpload = (docId) => {
        const fileName = prompt("Simulating Offline Upload\nEnter file name (e.g. Scanned_Doc.pdf):", "Scanned_Document.pdf");
        if (!fileName) return;

        setDocTypes(prev => prev.map(doc => {
            if (doc.id !== docId) return doc;

            const newVersion = {
                id: `v_${Date.now()}`,
                version: (doc.versions[0]?.version || 0) + 1,
                file: fileName,
                size: '1.2 MB',
                uploadedBy: 'Alex Morgan (LO)',
                date: 'Just now',
                status: 'uploaded',
                comments: 0
            };

            return {
                ...doc,
                versions: [newVersion, ...doc.versions]
            };
        }));
    };

    const handleAssignReview = (docName) => {
        alert(`Task Created: "Review ${docName} - Assigned to Underwriting"`);
    };

    const handleReviewAction = (docId, action, reason = null) => {
        setDocTypes(prev => prev.map(doc => {
            if (doc.id !== docId) return doc;
            const newVersions = [...doc.versions];
            newVersions[0] = { ...newVersions[0], status: action === 'approve' ? 'approved' : 'rejected', rejectionReason: reason };
            return { ...doc, versions: newVersions };
        }));
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-20">

            {/* 1. BLOCKING SUMMARY */}
            <div
                onClick={() => setFilterBlockers(!filterBlockers)}
                className={`
                    p-4 rounded-xl border cursor-pointer transition-all duration-200 group
                    ${filterBlockers
                        ? 'bg-red-50 border-red-200 shadow-md ring-1 ring-red-100'
                        : 'bg-white border-slate-200 hover:border-red-200 hover:shadow-sm'
                    }
                `}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`
                            p-3 rounded-lg transition-colors
                            ${filterBlockers || blockers.length > 0 ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-400'}
                        `}>
                            <ShieldAlert size={24} />
                        </div>
                        <div>
                            <h2 className={`text-lg font-bold ${blockers.length > 0 ? 'text-red-700' : 'text-slate-700'}`}>
                                {blockers.length} Blocking Documents
                            </h2>
                            <p className="text-sm text-slate-500">
                                {filterBlockers ? 'Showing only blocking items.' : 'Items preventing stage progression.'}
                            </p>
                        </div>
                    </div>

                    <div className={`
                        px-4 py-2 rounded-lg text-sm font-bold border transition-colors
                        ${filterBlockers
                            ? 'bg-white text-red-600 border-red-100'
                            : 'bg-slate-50 text-slate-600 border-slate-200 group-hover:bg-white'}
                    `}>
                        {filterBlockers ? 'Show All' : 'Filter Blockers'}
                    </div>
                </div>
            </div>

            {/* 2. DOCUMENT CHECKLIST */}
            <div className="space-y-8">
                {Object.entries(groupedDocs).map(([category, docs]) => (
                    <div key={category} className="space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                            {category}
                        </h3>
                        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100">
                            {docs.map(doc => (
                                <DocumentRow
                                    key={doc.id}
                                    doc={doc}
                                    status={getDocStatus(doc)}
                                    // PASS DOC ID AND NEW UPLOAD HANDLER
                                    onNudge={() => handleNudge(doc.id)}
                                    onUpload={() => handleOfflineUpload(doc.id)}
                                    onAssign={() => handleAssignReview(doc.name)}
                                    onApprove={() => handleReviewAction(doc.id, 'approve')}
                                    onReject={(reason) => handleReviewAction(doc.id, 'reject', reason)}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {Object.keys(groupedDocs).length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <p>No documents match your filter.</p>
                        <button
                            onClick={() => setFilterBlockers(false)}
                            className="text-blue-600 font-bold hover:underline mt-2"
                        >
                            Clear Filter
                        </button>
                    </div>
                )}
            </div>

            {/* Upload Area */}
            <div className="fixed bottom-6 right-8 z-30">
                <button className="h-14 w-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105">
                    <Plus size={24} />
                </button>
            </div>

        </div>
    );
};

// --------------------------------------------------------------------------
// SUB-COMPONENTS
// --------------------------------------------------------------------------

const DocumentRow = ({ doc, status, onNudge, onUpload, onAssign, onApprove, onReject }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const latestVersion = doc.versions[0];
    const isBlocker = (doc.required && status === 'missing') || status === 'rejected';

    const latestNudge = doc.nudges && doc.nudges[0];
    const nudgeCount = doc.nudges ? doc.nudges.length : 0;

    // Check if nudged within last 24h
    const isRecentlyNudged = useMemo(() => {
        if (!latestNudge) return false;
        const diffHours = (new Date() - new Date(latestNudge.timestamp)) / (1000 * 60 * 60);
        return diffHours < 24;
    }, [latestNudge]);


    // Status Icon Helper
    const StatusIcon = ({ status }) => {
        switch (status) {
            case 'approved':
                return <div title="Approved" className="text-emerald-500"><CheckCircle2 size={20} className="fill-emerald-50" /></div>;
            case 'review':
                return <div title="Under Review" className="text-blue-500"><Clock size={20} className="fill-blue-50" /></div>;
            case 'rejected':
                return <div title="Rejected" className="text-red-500"><XCircle size={20} className="fill-red-50" /></div>;
            case 'uploaded':
                return <div title="Uploaded" className="text-slate-400"><FileText size={20} className="fill-slate-50" /></div>;
            case 'missing':
            default:
                return <div title="Missing" className="text-amber-400 animate-pulse"><AlertCircle size={20} className="fill-amber-50" /></div>;
        }
    }

    return (
        <div className={`group transition-colors border-b border-slate-50 last:border-0 ${isExpanded ? 'bg-slate-50' : 'bg-white'}`}>

            {/* MAIN ROW */}
            <div className="p-4">
                {/* Header: Name & Status */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                        <StatusIcon status={status} />
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800 text-sm">{doc.name}</span>
                                {doc.required && <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">Required</span>}
                                {isBlocker && (
                                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 flex items-center gap-1">
                                        <ShieldAlert size={10} /> Blocker
                                    </span>
                                )}
                            </div>

                            {/* Missing State Message with Actions */}
                            {(status === 'missing' || status === 'rejected') && (
                                <div className="mt-1 flex flex-col items-start gap-1">
                                    <div className="text-xs text-slate-400 flex items-center gap-2">
                                        <span>No valid document.</span>

                                        {/* OFFLINE UPLOAD API */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUpload();
                                            }}
                                            className="text-slate-500 hover:text-blue-600 font-bold flex items-center gap-1 hover:bg-slate-100 px-2 py-0.5 rounded transition-colors"
                                            title="Upload on behalf of borrower"
                                        >
                                            <UploadCloud size={12} />
                                            Upload
                                        </button>

                                        <span className="text-slate-300">|</span>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (!isRecentlyNudged) onNudge();
                                            }}
                                            disabled={isRecentlyNudged}
                                            className={`
                                                font-bold flex items-center gap-1 px-1 py-0.5 rounded
                                                ${isRecentlyNudged
                                                    ? 'text-slate-400 cursor-not-allowed'
                                                    : 'text-blue-600 hover:underline cursor-pointer'}
                                            `}
                                            title={isRecentlyNudged ? "Reminder sent recently (24h cooldown)" : "Send Notification"}
                                        >

                                            {isRecentlyNudged ? (
                                                <>
                                                    <CheckCircle2 size={12} />
                                                    Reminder Sent
                                                </>
                                            ) : (
                                                <>
                                                    <Send size={12} />
                                                    Nudge
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Task Link Feedback */}
                                    {latestNudge && (
                                        <div className="text-[10px] flex items-center gap-1.5 bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100 mt-1">
                                            <span className="font-semibold">Related Task:</span>
                                            <a href="#" className="hover:underline flex items-center gap-1">
                                                {latestNudge.taskTitle}
                                                <span className="text-blue-400">({latestNudge.taskId})</span>
                                            </a>
                                            <span className="text-blue-300 mx-1">•</span>
                                            <span className="text-blue-500">
                                                {nudgeCount > 1 ? `${nudgeCount} reminders sent` : '1 reminder sent'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Primary Row Actions */}
                    <div className="flex items-center gap-2">
                        {status === 'uploaded' && (
                            <button
                                onClick={onAssign}
                                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-lg hover:border-blue-300 hover:text-blue-600 shadow-sm whitespace-nowrap"
                            >
                                Assign Review
                            </button>
                        )}
                    </div>
                </div>

                {/* File Card (If Uploaded) */}
                {status !== 'missing' && latestVersion && (
                    <div className="ml-9 bg-slate-50 border border-slate-200 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/file">

                        {/* File Left */}
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-white border border-slate-200 rounded-lg text-blue-500 shadow-sm">
                                <FileText size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                    {latestVersion.file}
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

                        {/* File Right: Toggles & Actions */}
                        <div className="flex items-center gap-3 border-t sm:border-t-0 border-slate-200 pt-3 sm:pt-0">
                            {/* Context Actions */}
                            {(status === 'review' || status === 'uploaded') && (
                                <div className="flex items-center gap-1 mr-2 border-r border-slate-200 pr-3">
                                    <button
                                        onClick={() => {
                                            const reason = prompt("Enter rejection reason:");
                                            if (reason) onReject(reason);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                        title="Reject"
                                    >
                                        <XCircle size={16} />
                                    </button>
                                    <button
                                        onClick={onApprove}
                                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                                        title="Approve"
                                    >
                                        <CheckCircle2 size={16} />
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-2">
                                <button className="p-1.5 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded shadow-sm">
                                    <Eye size={14} />
                                </button>
                                <button className="p-1.5 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded shadow-sm">
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

            {/* EXPANDED HISTORY (Evidence Trail) */}
            {isExpanded && doc.versions.length > 0 && (
                <div className="bg-slate-50/50 border-t border-slate-100 shadow-inner px-4 py-3 pb-4 ml-9 rounded-b-lg mb-2 mr-2">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Previous Versions</h4>
                    <div className="space-y-2">
                        {doc.versions.slice(1).map((ver) => (
                            <div key={ver.id} className="flex items-center justify-between text-xs bg-white border border-slate-100 p-2 rounded-lg text-slate-600">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono font-bold w-6 text-slate-400">v{ver.version}</span>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-700">{ver.file}</span>
                                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                                            <span>{ver.date}</span>
                                            <span>•</span>
                                            <span>{ver.uploadedBy}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {ver.rejectionReason && (
                                        <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 font-medium text-[10px]">
                                            Rejected: {ver.rejectionReason}
                                        </span>
                                    )}
                                    <button className="text-slate-400 hover:text-blue-600">
                                        <Download size={14} />
                                    </button>
                                </div>
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

export default DocumentsTab;
