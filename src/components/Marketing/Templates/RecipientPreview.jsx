import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Shield, CheckCircle, AlertTriangle, Eye, User, Lock, Mail } from 'lucide-react';
import { templateStore } from '../../../data/templateStore';
import { renderTemplate } from '../Engine/PersonalizationService';

const RecipientPreview = ({ onNavigate }) => {
    const selectedId = templateStore.getSelectedId();
    const template = templateStore.getById(selectedId);

    // Mock Recipient List
    const [recipients, setRecipients] = useState([
        {
            Lead: {
                id: 'L-001', FirstName: 'Robert', LastName: 'Fox', Email: 'robert.fox@example.com',
                Business: { LegalName: 'Fox Logistics LLC', TaxID: '123-45-6789' }
            }
        },
        {
            Lead: {
                id: 'L-002', FirstName: 'Sarah', LastName: 'Connor', Email: 'sarah.c@skynet.net',
                Business: { LegalName: 'Resistance Corp', TaxID: '987-65-4321' }
            }
        },
        {
            Lead: {
                id: 'L-003', FirstName: '', LastName: 'Unknown', Email: 'anon@example.com', // Missing First Name for Fallback Test
                Business: { LegalName: 'Stealth Startup', TaxID: '555-55-5555' }
            }
        },
    ]);

    const [previewResults, setPreviewResults] = useState([]);

    useEffect(() => {
        if (!template) return;

        // Perform Bulk Render Simulation
        const results = recipients.map(recipient => {
            // Simulate Subject Line Rendering (assuming we had a subject field, mocking it for now)
            const subjectMock = "Special Offer for {{Lead.Business.LegalName}}";
            const renderedSubject = renderTemplate(subjectMock, recipient);

            // Render Body
            const renderedBody = renderTemplate(template.content, recipient);

            return {
                recipient,
                subject: renderedSubject.renderedHtml,
                bodyPreview: renderedBody.renderedHtml.substring(0, 100) + '...', // First 100 chars
                log: renderedBody.log,
                status: 'Ready'
            };
        });

        setPreviewResults(results);
    }, [template, recipients]);

    if (!template) return <div>Loading...</div>;

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
                            Campaign Recipient Preview
                            <span className="text-xs bg-purple-100 text-purple-700 font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                <Eye size={12} /> Pre-Flight Check
                            </span>
                        </h2>
                        <p className="text-slate-500 mt-1">
                            Simulating render for <span className="font-bold text-slate-800 text-sm">3 recipients</span> using template: <span className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{template?.name}</span>
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 shadow-sm flex items-center gap-2">
                            <Mail size={16} /> Send Campaign
                        </button>
                    </div>
                </div>
            </div>

            {/* Preview Table */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Render Results</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Shield size={12} /> PII Masking Active
                    </div>
                </div>

                <table className="w-full text-left text-sm">
                    <thead className="bg-white border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-slate-600">Lead Name</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Rendered Subject</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Content Preview</th>
                            <th className="px-6 py-3 font-semibold text-slate-600">Issues / Fallbacks</th>
                            <th className="px-6 py-3 font-semibold text-slate-600 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {previewResults.map((result, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                            <User size={14} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">
                                                {result.recipient.Lead.FirstName || <span className="text-slate-400 italic">No Name</span>} {result.recipient.Lead.LastName}
                                            </div>
                                            <div className="text-xs text-slate-400">{result.recipient.Lead.Email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-medium text-slate-700">
                                    {result.subject}
                                </td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs truncate max-w-xs">
                                    {/* Strip HTML tags for preview table to keep it clean */}
                                    {result.bodyPreview.replace(/<[^>]+>/g, '')}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        {result.log.usedFallbacks.length > 0 && (
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-100 w-fit">
                                                <AlertTriangle size={10} />
                                                Fallback: {result.log.usedFallbacks.map(f => f.path).join(', ')}
                                            </span>
                                        )}
                                        {result.log.maskedFields.length > 0 && (
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100 w-fit">
                                                <Lock size={10} />
                                                Masked: {result.log.maskedFields.map(f => f.split('.').pop()).join(', ')}
                                            </span>
                                        )}
                                        {result.log.missingFields.length > 0 && (
                                            <span className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded border border-red-100 w-fit">
                                                <AlertTriangle size={10} />
                                                Missing: {result.log.missingFields.join(', ')}
                                            </span>
                                        )}
                                        {result.log.missingFields.length === 0 && result.log.usedFallbacks.length === 0 && (
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <CheckCircle size={10} /> Perfect Render
                                            </span>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                        <CheckCircle size={12} />
                                        ready
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-center pt-8">
                <p className="text-xs text-slate-400">
                    <Shield size={12} className="inline mr-1" />
                    Preview Audit Log ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
            </div>
        </div>
    );
};

export default RecipientPreview;
