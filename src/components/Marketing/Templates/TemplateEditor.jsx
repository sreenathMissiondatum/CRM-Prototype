import React, { useState, useEffect } from 'react';
import { Save, Code, Eye, ArrowLeft, RefreshCw, CheckCircle, AlertTriangle, Play } from 'lucide-react';
import { validateTemplate } from '../Engine/TemplateValidator.js';
import { renderTemplate } from '../Engine/PersonalizationService.js';
import { VALID_PATHS } from '../Engine/VariableRegistry.js';

import { templateStore } from '../../../data/templateStore';

const TemplateEditor = ({ onNavigate }) => {
    // Get the selected template from store
    const selectedId = templateStore.getSelectedId();
    const template = templateStore.getById(selectedId);

    // Initialize state with template content or default
    const [htmlContent, setHtmlContent] = useState(template ? template.content : '');
    const [templateName, setTemplateName] = useState(template ? template.name : 'Untitled');
    const [version, setVersion] = useState(template ? template.version : 'v0.1');

    const [validationResult, setValidationResult] = useState({ isValid: true, errors: [], detectedPlaceholders: [] });
    const [previewContext, setPreviewContext] = useState(null);
    const [renderedHtml, setRenderedHtml] = useState('');
    const [activeTab, setActiveTab] = useState('variables'); // variables | data
    const [isSaving, setIsSaving] = useState(false);

    // Mock Live Data Snapshot
    const mockLeadData = {
        Lead: {
            FirstName: 'Robert',
            LastName: 'Fox',
            Email: 'robert.fox@example.com',
            Business: {
                LegalName: 'Fox Logistics LLC',
                AnnualRevenue: 1200000,
                TaxID: '***-**-1234'
            }
        },
        Org: {
            SupportEmail: 'support@myflow.com'
        }
    };

    useEffect(() => {
        // Run validation on mount and changes
        const result = validateTemplate(htmlContent);
        setValidationResult(result);

        // Render preview
        const rendered = renderTemplate(htmlContent, mockLeadData);
        setRenderedHtml(rendered.renderedHtml);
    }, [htmlContent]);

    const handleSave = () => {
        if (!validationResult.isValid) return;
        setIsSaving(true);

        // Update store
        templateStore.update(selectedId, {
            content: htmlContent,
            version: version // In real app we'd increment this
        });

        setTimeout(() => {
            setIsSaving(false);
            onNavigate('marketing-templates'); // Go back to list on save
        }, 500);
    };

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Top Bar */}
            <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('marketing-templates')} className="text-slate-500 hover:text-slate-800 transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                            {templateName}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${template?.status === 'Approved' ? 'text-green-700 bg-green-50 border-green-100' : 'text-amber-700 bg-amber-50 border-amber-100'}`}>
                                {template?.status || 'Draft'}
                            </span>
                        </h1>
                        <p className="text-xs text-slate-500 font-mono">{version} • Last modified: {template?.lastModifiedDate || 'Just now'}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {template?.status !== 'Approved' && (
                        <>
                            <button
                                onClick={() => onNavigate('marketing-templates')}
                                className="px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Discard Changes
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!validationResult.isValid || isSaving}
                                className={`
                                    px-4 py-2 text-white font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all
                                    ${!validationResult.isValid || isSaving ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                                `}
                            >
                                {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                                Save Draft
                            </button>
                        </>
                    )}
                    {template?.status === 'Approved' && (
                        <span className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg border border-green-100 flex items-center gap-2">
                            <CheckCircle size={14} /> Approved & Locked
                        </span>
                    )}
                </div>
            </div>

            {/* Main Content Split */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Editor */}
                <div className="w-1/2 flex flex-col border-r border-slate-200 bg-white">
                    <div className="px-4 py-2 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wide">
                            <Code size={14} /> HTML Editor {template?.status === 'Approved' && '(Read Only)'}
                        </div>
                        {/* Simple Toolbar Placeholder */}
                        <div className="flex gap-1">
                            <span className="text-xs text-slate-400">Strict HTML Only. No scripts.</span>
                        </div>
                    </div>
                    <textarea
                        className={`flex-1 w-full p-4 font-mono text-sm text-slate-700 border-none focus:ring-0 resize-none leading-relaxed ${template?.status === 'Approved' ? 'bg-slate-50' : 'bg-white'}`}
                        value={htmlContent}
                        onChange={(e) => setHtmlContent(e.target.value)}
                        placeholder="<html>...</html>"
                        disabled={template?.status === 'Approved'}
                    />
                    {/* Validation Footer */}
                    <div className={`px-4 py-3 border-t border-slate-100 ${validationResult.isValid ? 'bg-green-50/50' : 'bg-red-50/50'}`}>
                        {validationResult.errors.length > 0 ? (
                            <div className="flex items-start gap-2 text-sm text-red-600">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                <div>
                                    <span className="font-bold">Validation Errors:</span>
                                    <ul className="list-disc list-inside mt-1 text-xs space-y-1">
                                        {validationResult.errors.map((err, i) => <li key={i}>{err}</li>)}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-green-700">
                                <CheckCircle size={16} /> Template is valid and secure.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Tools & Preview */}
                <div className="w-1/2 flex flex-col bg-slate-100">
                    <div className="flex border-b border-slate-200 bg-white">
                        <button
                            onClick={() => setActiveTab('variables')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'variables' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            Detected Variables
                        </button>
                        <button
                            onClick={() => setActiveTab('preview')}
                            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'preview' ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                        >
                            Live Preview
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'variables' && (
                            <div className="space-y-6">
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-blue-800 text-sm mb-4">
                                    <strong>Auto-Detection Active:</strong> Variables are extracted from your HTML code in real-time. Unrecognized variables will block saving.
                                </div>

                                {validationResult.detectedPlaceholders.length === 0 ? (
                                    <div className="text-center text-slate-400 py-10 italic">No variables detected in template.</div>
                                ) : (
                                    <div className="space-y-2">
                                        {validationResult.detectedPlaceholders.map((ph, idx) => (
                                            <div key={idx} className={`bg-white p-3 rounded-lg border shadow-sm flex items-center justify-between ${ph.isValid ? 'border-slate-200' : 'border-red-300 ring-1 ring-red-100'}`}>
                                                <div className="flex flex-col">
                                                    <code className="font-mono text-sm font-bold text-slate-700">{ph.path}</code>
                                                    {ph.hasFallback && <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded w-fit mt-1">Has Fallback</span>}
                                                </div>

                                                {ph.isValid ? (
                                                    <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full uppercase tracking-wide border border-green-100">Valid</span>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-white bg-red-500 px-2 py-1 rounded-full uppercase tracking-wide shadow-sm">Invalid</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="pt-6 border-t border-slate-200">
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Available Registry Variables</h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {VALID_PATHS.slice(0, 10).map(path => (
                                            <div key={path} className="text-xs text-slate-600 font-mono bg-white px-2 py-1 rounded border border-slate-200 cursor-help" title="Click to copy (implied)">
                                                {path}
                                            </div>
                                        ))}
                                        <div className="text-xs text-slate-400 italic px-2 py-1">...and {VALID_PATHS.length - 10} more</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preview' && (
                            <div className="h-full flex flex-col">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex-1 flex flex-col">
                                    <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase">Preview: Robert Fox (Lead)</span>
                                        <button title="Refresh Data" className="text-slate-400 hover:text-blue-600"><RefreshCw size={14} /></button>
                                    </div>
                                    <div className="p-8 bg-white flex-1 overflow-y-auto">
                                        {/* Dangerously setting HTML for preview - In real app, run through sanitizer AGAIN here just to be safe */}
                                        <div dangerouslySetInnerHTML={{ __html: renderedHtml }} className="prose prose-sm max-w-none" />
                                    </div>
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-slate-400">
                                        <Play size={10} className="inline mr-1" />
                                        Preview uses mock lead data. PII fields like TaxID are masked automatically.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateEditor;
