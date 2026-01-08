import React, { useState, useEffect } from 'react';
import { X, Eye, Code, List, AlertTriangle, CheckCircle, Shield, AlertOctagon, Info } from 'lucide-react';

const InspectDrawer = ({ isOpen, onClose, recipient, template, renderResult, initialTab = 'visual' }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    if (!isOpen || !recipient || !renderResult) return null;

    // Helper to determine status color
    const getStatusColor = (status) => {
        if (status === 'Blocked') return 'text-red-600 bg-red-50 border-red-100';
        if (status === 'Warning') return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-green-600 bg-green-50 border-green-100';
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer Panel */}
            <div className="relative w-full max-w-2xl bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold text-slate-800">Inspect Email</h2>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${getStatusColor(renderResult.auditStatus)}`}>
                                {renderResult.auditStatus}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500">
                            Recipient: <span className="font-semibold text-slate-700">{recipient.firstName} {recipient.lastName}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="text-[10px] flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                                <Shield size={10} /> PII Masking: <strong>ACTIVE</strong>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono">Template: {template.version}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200 px-6">
                    <button
                        onClick={() => setActiveTab('visual')}
                        className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'visual' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Eye size={16} /> Visual Preview
                    </button>
                    <button
                        onClick={() => setActiveTab('variables')}
                        className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'variables' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <List size={16} /> Variables ({renderResult.log.replacements})
                    </button>
                    <button
                        onClick={() => setActiveTab('raw')}
                        className={`px-4 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${activeTab === 'raw' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                        <Code size={16} /> Original Source
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-6">

                    {/* INFO BANNER FOR ISSUES */}
                    {(renderResult.log.missingFields.length > 0 || renderResult.log.usedFallbacks.length > 0) && (
                        <div className="mb-6 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                            <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-wide">
                                <AlertTriangle size={12} /> Detected Issues
                            </div>
                            <div className="p-4 space-y-3">
                                {renderResult.log.missingFields.map((field, idx) => (
                                    <div key={`missing-${idx}`} className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-100">
                                        <AlertOctagon size={16} className="mt-0.5 shrink-0" />
                                        <div>
                                            <span className="font-bold">Missing Value:</span> Variable <code>{`{{${field}}}`}</code> has no value and no fallback.
                                            <div className="text-xs text-red-500 mt-1">Recommendation: Exclude recipient or add data to CRM.</div>
                                        </div>
                                    </div>
                                ))}
                                {renderResult.log.usedFallbacks.map((item, idx) => (
                                    <div key={`fallback-${idx}`} className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 p-2 rounded border border-amber-100">
                                        <Info size={16} className="mt-0.5 shrink-0" />
                                        <div>
                                            <span className="font-bold">Fallback Applied:</span> Used default <code>"{item.value}"</code> for <code>{`{{${item.path}}}`}</code>.
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    {/* TAB: VISUAL PREVIEW */}
                    {activeTab === 'visual' && (
                        <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden min-h-[500px] flex flex-col">
                            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 text-xs text-slate-500 flex justify-between">
                                <span>Subject: <strong className="text-slate-700">{renderResult.subject}</strong></span>
                                <span>HTML Email</span>
                            </div>
                            <div className="p-8 flex-1">
                                <div
                                    className="prose prose-sm max-w-none pointer-events-none select-none isolate"
                                    dangerouslySetInnerHTML={{ __html: renderResult.bodyPreview }} // Use full body in real app
                                />
                            </div>
                        </div>
                    )}

                    {/* TAB: VARIABLES */}
                    {activeTab === 'variables' && (
                        <div className="bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Variable Path</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Resolved Value</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {/* MOCKING VARIABLE LIST based on logs + inferred successes */}
                                    {/* In a real app, renderLog would return a full trace of all variables found */}

                                    {/* 1. Show Failures */}
                                    {renderResult.log.missingFields.map(f => (
                                        <tr key={f} className="bg-red-50">
                                            <td className="px-4 py-3 font-mono text-red-700">{`{{${f}}}`}</td>
                                            <td className="px-4 py-3 italic text-slate-400">Testing... (Empty)</td>
                                            <td className="px-4 py-3"><span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">MISSING</span></td>
                                        </tr>
                                    ))}

                                    {/* 2. Show Fallbacks */}
                                    {renderResult.log.usedFallbacks.map(f => (
                                        <tr key={f.path} className="bg-amber-50">
                                            <td className="px-4 py-3 font-mono text-amber-700">{`{{${f.path}}}`}</td>
                                            <td className="px-4 py-3 font-medium">{f.value}</td>
                                            <td className="px-4 py-3"><span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">FALLBACK</span></td>
                                        </tr>
                                    ))}

                                    {/* 3. Show Successes (Simulated for Demo) */}
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-mono text-slate-600">{`{{Lead.FirstName}}`}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">{recipient.firstName}</td>
                                        <td className="px-4 py-3"><span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">OK</span></td>
                                    </tr>
                                    <tr className="hover:bg-slate-50">
                                        <td className="px-4 py-3 font-mono text-slate-600">{`{{Lead.Company}}`}</td>
                                        <td className="px-4 py-3 font-medium text-slate-800">{recipient.company}</td>
                                        <td className="px-4 py-3"><span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">OK</span></td>
                                    </tr>
                                    {renderResult.log.maskedFields.map(f => (
                                        <tr key={f} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-mono text-slate-600">{`{{${f}}}`}</td>
                                            <td className="px-4 py-3 font-medium text-slate-800">***-**-1234</td>
                                            <td className="px-4 py-3"><span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">MASKED</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* TAB: RAW TEMPLATE */}
                    {activeTab === 'raw' && (
                        <div className="bg-slate-900 rounded-lg overflow-hidden shadow-sm">
                            <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
                                <span className="text-xs text-slate-400">ReadOnly Source</span>
                            </div>
                            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap">
                                {template.content}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InspectDrawer;
