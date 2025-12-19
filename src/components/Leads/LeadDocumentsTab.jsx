import React, { useState, useMemo } from 'react';
import { Plus, Search, ChevronDown, ChevronUp, FileText, LayoutList, Send } from 'lucide-react';
import DocumentStats from './DocumentStats';
import DocumentRow from './DocumentRow';
import DocumentUploadWidget, { DOC_TYPES } from '../Shared/DocumentUploadWidget';
import { programs } from '../../data/loanPrograms';

const LeadDocumentsTab = ({
    documents,
    assignedPrograms = [],
    onViewTask,
    onViewNudgeTask,
    onNudge,
    onUpload,
    onAssignReview,
    onRequestDocument,
    onUpsertDocuments // New prop for up-serting virtual docs
}) => {

    const [filter, setFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedDocForUpload, setSelectedDocForUpload] = useState(null);

    // Collapsible Section State
    const [expandedSections, setExpandedSections] = useState({
        common: true,
        supporting: true,
        // Program specific sections will be dynamically handled or defaulted to true
    });

    const toggleSection = (key) => {
        setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Helper to find matching type ID
    const getMatchingTypeId = (docName) => {
        const match = DOC_TYPES.find(t => t.label.toLowerCase() === docName.toLowerCase());
        return match ? match.id : '';
    };

    const handleRowUpload = (doc) => {
        setSelectedDocForUpload(doc);
        setShowUploadModal(true);
    };

    // --- AGGREGATION LOGIC ---

    // 1. Identify Active Programs
    const activePrograms = useMemo(() => {
        if (!assignedPrograms || assignedPrograms.length === 0) return [];
        return programs.filter(p => assignedPrograms.includes(p.id));
    }, [assignedPrograms]);

    // 2. Process Requirements & Merge with Existing Documents
    const { commonDocs, programDocs, supportingDocs, allDocsForStats } = useMemo(() => {
        // Map to track processed requirements: Key = "Category|Name" -> Value = { ...doc, requiredBy: [] }
        const requirementMap = new Map();

        // A. Gather all requirements from active programs
        activePrograms.forEach(prog => {
            prog.requiredDocuments.forEach(req => {
                const key = `${req.category}|${req.name}`;

                if (requirementMap.has(key)) {
                    // Existing requirement: Add program to requiredBy
                    const existing = requirementMap.get(key);
                    existing.requiredBy.push({ id: prog.id, name: prog.name, code: prog.code });
                } else {
                    // New requirement
                    requirementMap.set(key, {
                        ...req,
                        // Use a mock ID for virtual docs if they don't match an existing one later
                        id: `virtual_${req.id}_${prog.id}`,
                        status: 'missing', // Default status for a requirement not yet met
                        required: true,
                        versions: [],
                        requiredBy: [{ id: prog.id, name: prog.name, code: prog.code }],
                        isVirtual: true // Flag to indicate this came from program rules
                    });
                }
            });
        });

        // B. Match Existing Documents to Requirements
        // We clone documents to avoid mutating props
        const unlinkedDocs = [...documents];

        requirementMap.forEach((req, key) => {
            // Find a match in existing documents
            // Matching Logic: Strict Name match OR (Category + Fuzzy Name) - For now, Strict Name to be safe
            const matchIndex = unlinkedDocs.findIndex(d =>
                d.name.toLowerCase() === req.name.toLowerCase() &&
                d.category === req.category
            );

            if (matchIndex > -1) {
                // FOUND MATCH: linking existing doc to this requirement
                const matchedDoc = unlinkedDocs[matchIndex];

                // Merge info: Use existing doc's status/id/versions, but keep requirement metadata
                requirementMap.set(key, {
                    ...matchedDoc, // ID, status, versions, etc.
                    description: req.description, // Use program description if available
                    requiredBy: req.requiredBy,
                    source: req.source,
                    isVirtual: false // It's a real doc record now
                });

                // Remove from unlinked array so it doesn't appear in 'Supporting'
                unlinkedDocs.splice(matchIndex, 1);
            }
        });

        // C. Group Results
        const common = [];
        const byProgram = {}; // Key: PogramID, Value: [Docs]

        // Initialize byProgram for all active (to ensure empty sections show if needed)
        activePrograms.forEach(p => byProgram[p.id] = []);

        requirementMap.forEach((doc) => {
            // Filter by search query
            if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

            if (doc.requiredBy.length > 1) {
                common.push(doc);
            } else {
                const progId = doc.requiredBy[0].id;
                if (byProgram[progId]) {
                    byProgram[progId].push(doc);
                }
            }
        });

        // D. Supporting Docs (The leftovers)
        const supporting = unlinkedDocs.filter(doc =>
            !searchQuery || doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // All docs flat list for stats
        const allStatsList = [...common, ...Object.values(byProgram).flat(), ...supporting];

        return {
            commonDocs: common,
            programDocs: byProgram,
            supportingDocs: supporting,
            allDocsForStats: allStatsList
        };

    }, [activePrograms, documents, searchQuery]);


    // Derived Stats
    const stats = useMemo(() => {
        return {
            requested: allDocsForStats.filter(d => d.status === 'requested').length,
            uploaded: allDocsForStats.filter(d => d.status === 'uploaded' || d.status === 'approved' || d.status === 'review').length,
            pending: allDocsForStats.filter(d => d.status === 'missing' || d.status === 'requested').length,
            overdue: allDocsForStats.filter(d => d.status === 'missing' && d.required).length
        };
    }, [allDocsForStats]);


    // --- REQUEST ACTIONS ---

    const handleRequestAll = () => {
        const confirmRequest = window.confirm("Send document requests to borrower for ALL missing required documents?");
        if (!confirmRequest) return;

        // Find all 'missing' docs in common or programs
        const missingDocs = [
            ...commonDocs.filter(d => d.status === 'missing'),
            ...Object.values(programDocs).flat().filter(d => d.status === 'missing')
        ].map(d => ({
            ...d,
            status: 'requested', // Transition status
            id: d.id.startsWith('virtual_') ? `d_req_${Date.now()}_${d.id.slice(8)}` : d.id, // Generate real ID if virtual
            nudges: [{ // Add initial nudge record
                timestamp: new Date().toISOString(),
                taskId: `TASK-${Math.floor(Math.random() * 10000)}`,
                taskTitle: `Request document: ${d.name}`,
                sentBy: 'System (Bulk Request)'
            }]
        }));

        if (missingDocs.length > 0 && onUpsertDocuments) {
            onUpsertDocuments(missingDocs);
            alert(`Successfully sent requests for ${missingDocs.length} documents.`);
        } else {
            alert("No missing documents to request.");
        }
    };

    const handleRequestSingle = (doc) => {
        if (!onUpsertDocuments) return;

        const docToUpsert = {
            ...doc,
            status: 'requested',
            id: doc.id.startsWith('virtual_') ? `d_req_${Date.now()}_${Math.floor(Math.random() * 1000)}` : doc.id,
            nudges: [{
                timestamp: new Date().toISOString(),
                taskId: `TASK-${Math.floor(Math.random() * 10000)}`,
                taskTitle: `Request document: ${doc.name}`,
                sentBy: 'System'
            }]
        };
        onUpsertDocuments([docToUpsert]);
    };

    // Check if there are any missing docs to enable "Request All"
    const hasMissingDocs = allDocsForStats.some(d => d.status === 'missing');


    // --- RENDER HELPERS ---

    const renderSectionHeader = (title, count, isOpen, onToggle, badges = []) => (
        <button
            onClick={onToggle}
            className="w-full flex items-center justify-between group py-2"
        >
            <div className="flex items-center gap-3">
                <div className={`p-1 rounded bg-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors`}>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </div>
                <div className="flex items-center gap-3">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</h3>
                    <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200">
                        {count}
                    </span>
                    {badges.map((b, i) => (
                        <span key={i} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100">
                            {b}
                        </span>
                    ))}
                </div>
            </div>
            <div className="h-px bg-slate-100 flex-1 ml-4" />
        </button>
    );

    return (
        <div className="flex flex-col h-full space-y-6 relative">

            {/* Universal Upload Widget Integration */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <DocumentUploadWidget
                        context="internal"
                        preselectedType={selectedDocForUpload ? getMatchingTypeId(selectedDocForUpload.name) : ''}
                        onCancel={() => {
                            setShowUploadModal(false);
                            setSelectedDocForUpload(null);
                        }}
                        onUploadComplete={(data) => {
                            console.log('Lead Document Uploaded:', data);
                            // Call the parent handler to update state if needed
                            if (selectedDocForUpload && onUpload) {
                                // If uploading a virtual doc directly without requesting first
                                const docId = selectedDocForUpload.id.startsWith('virtual_')
                                    ? `d_up_${Date.now()}` // Generate real ID
                                    : selectedDocForUpload.id;

                                // We need to upsert this as a 'uploaded' (or 'review') doc
                                if (onUpsertDocuments && selectedDocForUpload.id.startsWith('virtual_')) {
                                    // Build new doc object
                                    const newDoc = {
                                        ...selectedDocForUpload,
                                        id: docId,
                                        status: data.reviewer ? 'review' : 'uploaded', // Immediate review state if assigned
                                        versions: [{
                                            id: `v1`,
                                            version: 1,
                                            filename: data.file ? data.file.name : "uploaded_file.pdf",
                                            size: data.file ? `${(data.file.size / 1024 / 1024).toFixed(2)} MB` : '1.2 MB',
                                            date: 'Just now',
                                            uploadedBy: 'Analyst (Internal Upload)'
                                        }]
                                    };

                                    // Add review task if reviewer assigned
                                    if (data.reviewer) {
                                        newDoc.reviewTask = {
                                            id: `rt_${Date.now()}`,
                                            assignedTo: data.reviewer === 'sarah' ? 'Sarah Miller' : 'Mike Ross',
                                            assignedToAvatar: data.reviewer === 'sarah' ? 'SM' : 'MR',
                                            dueDate: 'Tomorrow',
                                            comments: 0,
                                            status: 'Assigned',
                                            latestComment: data.notes || undefined
                                        };
                                    }

                                    onUpsertDocuments([newDoc]);
                                } else {
                                    // Regular upload for existing doc
                                    onUpload(docId, data);
                                }
                            }
                            setShowUploadModal(false);
                            setSelectedDocForUpload(null);
                        }}
                    />
                </div>
            )}


            <DocumentStats stats={stats} />


            {/* Toolbar */}
            <div className="flex justify-between items-center mb-2">
                <div className="relative w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    {/* "Request All" Button */}
                    <button
                        onClick={handleRequestAll}
                        disabled={!hasMissingDocs}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm 
                            ${!hasMissingDocs
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'}`}
                        title={hasMissingDocs ? "Send requests for all missing documents" : "All required documents requested"}
                    >
                        <Send size={16} />
                        Request All Required
                    </button>

                    <button
                        onClick={onRequestDocument}
                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg font-medium text-sm transition-colors shadow-sm"
                    >
                        <Plus size={16} />
                        Add Custom
                    </button>
                </div>
            </div>

            {/* Document Lists */}
            <div className="space-y-6 pb-20 overflow-y-auto pr-2 custom-scrollbar">

                {/* 1. Common Documents */}
                {commonDocs.length > 0 && (
                    <div className="space-y-2">
                        {renderSectionHeader(
                            "Common Program Requirements",
                            commonDocs.length,
                            expandedSections.common,
                            () => toggleSection('common')
                        )}

                        {expandedSections.common && (
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100 flex flex-col">
                                {commonDocs.map((doc, idx) => (
                                    <DocumentRow
                                        key={doc.id || idx}
                                        doc={doc}
                                        onNudge={() => onNudge(doc.id)}
                                        onUpload={() => handleRowUpload(doc)}
                                        onAssign={() => onAssignReview(doc.id)}
                                        onRequest={() => handleRequestSingle(doc)} // New Action
                                        onViewTask={(task) => onViewTask && onViewTask(task, doc)}
                                        onViewNudgeTask={(nudge) => onViewNudgeTask && onViewNudgeTask(nudge, doc)}
                                        showOriginBadges={true} // New prop to show "Required by X, Y"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Program Specific Sections */}
                {activePrograms.map(prog => {
                    const docs = programDocs[prog.id] || [];
                    const isExpanded = expandedSections[`prog_${prog.id}`] ?? true; // Default open

                    if (docs.length === 0) return null; // Hide empty sections? Or show "None required"? Going with hide for clean UI.

                    return (
                        <div key={prog.id} className="space-y-2">
                            {renderSectionHeader(
                                `Required for ${prog.name}`,
                                docs.length,
                                isExpanded,
                                () => toggleSection(`prog_${prog.id}`),
                                [prog.code] // Badge
                            )}

                            {isExpanded && (
                                <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100 flex flex-col">
                                    {docs.map((doc, idx) => (
                                        <DocumentRow
                                            key={doc.id || idx}
                                            doc={doc}
                                            onNudge={() => onNudge(doc.id)}
                                            onUpload={() => handleRowUpload(doc)}
                                            onAssign={() => onAssignReview(doc.id)}
                                            onRequest={() => handleRequestSingle(doc)} // New Action
                                            onViewTask={(task) => onViewTask && onViewTask(task, doc)}
                                            onViewNudgeTask={(nudge) => onViewNudgeTask && onViewNudgeTask(nudge, doc)}
                                        // No origin badges needed here as context is clear
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}


                {/* 3. Supporting Documents (Native / Unlinked) */}
                {supportingDocs.length > 0 && (
                    <div className="space-y-2 pt-2">
                        {renderSectionHeader(
                            "Supporting Documents",
                            supportingDocs.length,
                            expandedSections.supporting,
                            () => toggleSection('supporting')
                        )}

                        {expandedSections.supporting && (
                            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm divide-y divide-slate-100 flex flex-col">
                                {supportingDocs.map((doc, idx) => (
                                    <DocumentRow
                                        key={doc.id || idx}
                                        doc={doc}
                                        onNudge={() => onNudge(doc.id)}
                                        onUpload={() => handleRowUpload(doc)}
                                        onAssign={() => onAssignReview(doc.id)}
                                        onRequest={() => handleRequestSingle(doc)}
                                        onViewTask={(task) => onViewTask && onViewTask(task, doc)}
                                        onViewNudgeTask={(nudge) => onViewNudgeTask && onViewNudgeTask(nudge, doc)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {allDocsForStats.length === 0 && (
                    <div className="text-center py-12 text-slate-400">
                        <FileText size={48} className="mx-auto mb-4 opacity-50" />
                        <h3 className="font-bold text-slate-600">No documents found</h3>
                        <p className="text-sm">No documents required or uploaded for this query.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default LeadDocumentsTab;
