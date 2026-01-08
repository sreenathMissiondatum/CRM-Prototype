import React, { useState, useCallback } from 'react';
import { Upload, FileCode, CheckCircle, AlertTriangle, XCircle, ArrowLeft, Shield } from 'lucide-react';
import { validateTemplate } from '../Engine/TemplateValidator.js'; // Importing provided Validator
import { templateStore } from '../../../data/templateStore';

const TemplateUpload = ({ onNavigate }) => {
    const [file, setFile] = useState(null);
    const [htmlContent, setHtmlContent] = useState('');
    const [validationResult, setValidationResult] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) processFile(droppedFile);
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) processFile(selectedFile);
    };

    const processFile = (file) => {
        if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
            alert("Only HTML files are currently supported.");
            return;
        }

        setFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            setHtmlContent(content);
            runValidation(content);
        };
        reader.readAsText(file);
    };

    const handlePaste = (e) => {
        const content = e.target.value;
        setHtmlContent(content);
        runValidation(content);
    };

    const runValidation = (content) => {
        const result = validateTemplate(content);
        setValidationResult(result);
    };

    const handleSave = () => {
        if (!htmlContent) {
            alert("Please enter some HTML content first.");
            return;
        }

        if (!validationResult?.isValid) {
            alert("Cannot save: Template execution blocked by security validation rules. Please fix the red errors.");
            return;
        }

        // Prompt for name
        const defaultName = file ? file.name.replace('.html', '') : 'Untitled Template';
        const templateName = window.prompt("Enter a name for this template:", defaultName);

        if (!templateName) return; // Cancelled

        try {
            // Save to store
            templateStore.add({
                name: templateName,
                status: 'Draft',
                lastModifiedBy: 'Alex Morgan',
                content: htmlContent
            });

            // Verify navigation function exists
            if (typeof onNavigate === 'function') {
                onNavigate('marketing-templates');
            } else {
                console.error("Navigation function missing!");
                alert("Saved, but cannot navigate back. Please click 'Back to Templates'.");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save template: " + error.message);
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <button onClick={() => onNavigate('marketing-templates')} className="text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-4 font-medium transition-colors">
                    <ArrowLeft size={16} /> Back to Templates
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                            Upload New Template
                            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                <Shield size={12} /> Secure Mode
                            </span>
                        </h2>
                        <p className="text-slate-500 mt-1">Upload raw HTML. Content will be sanitized and validated against the Variable Registry.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Zone */}
                <div className="space-y-6">
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all bg-white
                            ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-300 hover:border-blue-400'}
                        `}
                    >
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-full mb-4">
                            <Upload size={32} />
                        </div>
                        <h3 className="font-bold text-slate-800 text-lg mb-2">Drag & Drop HTML File</h3>
                        <p className="text-slate-500 mb-6 max-w-xs">Supported format: .html. No scripts or external resources allowed.</p>

                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            accept=".html,.htm"
                            onChange={handleFileSelect}
                        />
                        <label
                            htmlFor="file-upload"
                            className="px-6 py-2 bg-white border border-slate-300 text-slate-700 font-bold rounded-lg hover:bg-slate-50 cursor-pointer shadow-sm transition-all"
                        >
                            Select File
                        </label>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-slate-50 text-slate-500 font-medium">OR PASTE CODE</span>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center gap-2">
                            <FileCode size={16} className="text-slate-500" />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Raw HTML Input</span>
                        </div>
                        <textarea
                            value={htmlContent}
                            onChange={handlePaste}
                            placeholder="Paste your HTML code here..."
                            className="w-full h-64 p-4 font-mono text-xs text-slate-700 border-none focus:ring-0 resize-none bg-white"
                        />
                    </div>
                </div>

                {/* Validation Panel */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full">
                    <div className="p-6 border-b border-slate-200">
                        <h3 className="font-bold text-slate-800 text-lg">Security & Validation</h3>
                        <p className="text-sm text-slate-500">Real-time analysis of your template.</p>
                    </div>

                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                        {!validationResult && (
                            <div className="text-center py-10 text-slate-400 flex flex-col items-center">
                                <Shield size={48} className="mb-4 opacity-20" />
                                <p>Upload or paste content to begin analysis.</p>
                            </div>
                        )}

                        {validationResult && (
                            <>
                                {/* Status Banner */}
                                <div className={`p-4 rounded-xl border ${validationResult.isValid ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'} flex items-start gap-3`}>
                                    {validationResult.isValid ? (
                                        <CheckCircle className="text-green-600 shrink-0 mt-0.5" size={20} />
                                    ) : (
                                        <XCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                                    )}
                                    <div>
                                        <h4 className={`font-bold ${validationResult.isValid ? 'text-green-800' : 'text-red-800'}`}>
                                            {validationResult.isValid ? 'Validation Passed' : 'Validation Failed'}
                                        </h4>
                                        <p className={`text-sm mt-1 ${validationResult.isValid ? 'text-green-700' : 'text-red-700'}`}>
                                            {validationResult.isValid
                                                ? "This template is safe and valid. You can proceed to save."
                                                : "Critical errors found. Please fix them before saving."}
                                        </p>
                                    </div>
                                </div>

                                {/* Errors List */}
                                {validationResult.errors.length > 0 && (
                                    <div>
                                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Critical Issues</h5>
                                        <div className="space-y-2">
                                            {validationResult.errors.map((err, idx) => (
                                                <div key={idx} className="flex items-start gap-2 text-sm text-red-600 bg-red-50/50 p-2 rounded-lg border border-red-100">
                                                    <AlertTriangle size={14} className="mt-0.5" />
                                                    {err}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Detected Placeholders */}
                                <div>
                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Detected Variables</h5>
                                    {validationResult.detectedPlaceholders.length === 0 ? (
                                        <p className="text-sm text-slate-400 italic">No variables detected.</p>
                                    ) : (
                                        <div className="grid grid-cols-1 gap-2">
                                            {validationResult.detectedPlaceholders.map((ph, idx) => (
                                                <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border text-sm ${ph.isValid ? 'bg-slate-50 border-slate-200' : 'bg-amber-50 border-amber-200'}`}>
                                                    <code className="font-mono text-blue-600">{ph.path}</code>
                                                    {ph.isValid ? (
                                                        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">VALID</span>
                                                    ) : (
                                                        <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">INVALID</span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-end gap-3">
                        <button
                            onClick={() => onNavigate('marketing-templates')}
                            className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className={`
                                px-6 py-2 text-white font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all
                                ${!validationResult?.isValid
                                    ? 'bg-red-500 hover:bg-red-600' // Visual warning color instead of disabled gray
                                    : 'bg-green-600 hover:bg-green-700 hover:shadow-md'}
                            `}
                        >
                            <CheckCircle size={18} />
                            Save as Draft
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateUpload;
