import React, { useState, useCallback } from 'react';
import {
    Upload, FileText, X, AlertCircle,
    CheckCircle, Calendar, User, Eye,
    Shield, Clock, ArrowRight
} from 'lucide-react';

// Document Type Definitions (Simulating Backend Config)
export const DOC_TYPES = [
    { id: 'business_license', label: 'Business License', expires: true, defaultValidityDays: 365, category: 'Licenses' },
    { id: 'insurance_gl', label: 'General Liability Insurance', expires: true, defaultValidityDays: 180, category: 'Insurance' },

    { id: 'articles_inc', label: 'Articles of Incorporation', expires: false, category: 'Business Formation' },
    { id: 'good_standing', label: 'Certificate of Good Standing', expires: true, defaultValidityDays: 90, category: 'Business Formation' },
    { id: 'tax_return', label: 'Tax Return (Business)', expires: false, category: 'Financials' },
    { id: 'operating_agreement', label: 'Operating Agreement', expires: false, category: 'Ownership' }
];

const DocumentUploadWidget = ({ context = 'internal', entityId, onUploadComplete, onCancel, preselectedType = '' }) => {
    const [file, setFile] = useState(null);
    const [docTypeId, setDocTypeId] = useState(preselectedType);
    const [expiryDate, setExpiryDate] = useState('');

    const [effectiveDate, setEffectiveDate] = useState('');
    const [notes, setNotes] = useState('');
    const [reviewer, setReviewer] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Derived Logic
    const selectedTypeConfig = DOC_TYPES.find(d => d.id === docTypeId);
    const requiresExpiry = selectedTypeConfig?.expires;

    // Handlers
    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragOver(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) setFile(droppedFile);
    }, []);

    const handleFileInput = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) setFile(selectedFile);
    };

    const handleUpload = () => {
        setUploading(true);
        // Simulate API call
        setTimeout(() => {
            setUploading(false);
            onUploadComplete && onUploadComplete({
                file,
                type: selectedTypeConfig,
                expiryDate,
                notes,
                reviewer
            });
        }, 1500);
    };

    return (
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">

            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Upload Document</h3>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        {context === 'internal' ? <Shield size={12} className="text-blue-500" /> : <Eye size={12} />}
                        {context === 'internal' ? 'Internal Upload Mode' : 'Borrower Portal Mode'}
                    </div>
                </div>
                <button
                    onClick={onCancel}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* 1. File Drop Zone */}
                {!file ? (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                        className={`h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${isDragOver
                            ? 'border-blue-500 bg-blue-50 scale-[1.01]'
                            : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                            }`}
                    >
                        <Upload size={32} className={`mb-3 ${isDragOver ? 'text-blue-600' : 'text-slate-400'}`} />
                        <div className="text-sm font-medium text-slate-700">
                            Drag & Drop file here or <label className="text-blue-600 hover:underline cursor-pointer">
                                browse
                                <input type="file" className="hidden" onChange={handleFileInput} />
                            </label>
                        </div>
                        <div className="text-xs text-slate-400 mt-2">PDF, DOCX, JPG, PNG (Max 25MB)</div>
                    </div>
                ) : (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-white rounded-lg border border-blue-100 text-blue-600">
                                <FileText size={20} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-slate-900">{file.name}</div>
                                <div className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to process</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}

                {/* 2. Metadata Form */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Document Type <span className="text-red-500">*</span></label>
                        <select
                            className="w-full p-2.5 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                            value={docTypeId}
                            onChange={(e) => setDocTypeId(e.target.value)}
                        >
                            <option value="">Select a document type...</option>
                            {DOC_TYPES.map(type => (
                                <option key={type.id} value={type.id}>{type.label}</option>
                            ))}
                        </select>
                        {selectedTypeConfig && (
                            <div className="text-[10px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit border border-blue-100 mt-1">
                                Category: {selectedTypeConfig.category}
                            </div>
                        )}
                    </div>

                    {/* Conditional Expiry Fields */}
                    {requiresExpiry && (
                        <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Expiry Date <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="date"
                                        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Effective Date</label>
                                <div className="relative">
                                    <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="date"
                                        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                        value={effectiveDate}
                                        onChange={(e) => setEffectiveDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Internal Only Fields */}
                    {context === 'internal' && (
                        <div className="pt-4 border-t border-slate-100 space-y-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Assign Reviewer</label>
                                <div className="relative">
                                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <select
                                        className="w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                                        value={reviewer}
                                        onChange={(e) => setReviewer(e.target.value)}
                                    >
                                        <option value="">Unassigned</option>
                                        <option value="sarah">Sarah Miller (Account Owner)</option>
                                        <option value="mike">Mike Ross (Compliance)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Internal Notes</label>
                                <textarea
                                    rows="2"
                                    className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none resize-none"
                                    placeholder="Add context for the reviewer..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    disabled={uploading}
                    className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleUpload}
                    disabled={!file || !docTypeId || uploading || (requiresExpiry && !expiryDate)}
                    className={`px-6 py-2 text-sm font-bold text-white rounded-lg flex items-center gap-2 shadow-sm transition-all ${!file || !docTypeId || uploading || (requiresExpiry && !expiryDate)
                        ? 'bg-slate-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                        }`}
                >
                    {uploading ? (
                        <>
                            <cw-spinner class="w-4 h-4 animate-spin border-2 border-white/30 border-t-white rounded-full"></cw-spinner>
                            Processing...
                        </>
                    ) : (
                        <>
                            Upload Document <ArrowRight size={16} />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

export default DocumentUploadWidget;
