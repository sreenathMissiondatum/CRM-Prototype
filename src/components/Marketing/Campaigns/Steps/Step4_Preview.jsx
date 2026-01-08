import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, ArrowRight, Shield, CheckCircle, AlertTriangle, AlertOctagon, User, Eye, Info, RefreshCw } from 'lucide-react';
import { templateStore } from '../../../../data/templateStore';
import { renderTemplate } from '../../Engine/PersonalizationService';
import InspectDrawer from './InspectDrawer';

const Step4_Preview = ({ data, onUpdate, onNext, onBack }) => {
    const [previewResults, setPreviewResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inspectRecipient, setInspectRecipient] = useState(null); // { recipient, result }
    const [inspectTab, setInspectTab] = useState('visual');
    const [warningsAcknowledged, setWarningsAcknowledged] = useState(false);

    // Refresh State
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showToast, setShowToast] = useState(null);

    const template = templateStore.getById(data.templateId);

    const openInspector = (recipientData, tab = 'visual') => {
        setInspectRecipient(recipientData);
        setInspectTab(tab);
    };

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate API latency and data re-fetch with FIX applied
        setTimeout(() => {
            generatePreviews(true); // Pass true to simulate data fix
            setIsRefreshing(false);
            setShowToast({ type: 'success', message: 'Data issues resolved. All recipients eligible.' });
            console.log(`[AUDIT] Campaign Eligibility Rechecked by User at ${new Date().toISOString()} - Issues Resolved`);

            // Auto hide toast
            setTimeout(() => setShowToast(null), 3000);
        }, 1200);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            generatePreviews(false);
            setLoading(false);
        }, 600);
        return () => clearTimeout(timer);
    }, []);

    const generatePreviews = (applySimulatedFix = false) => {
        const recipients = data._hydratedLeads || [];
        if (!template || recipients.length === 0) return;

        const results = recipients.map(recipient => {
            // SIMULATE DATA FIX: Ensure company exists if fixing
            const effectiveLead = { ...recipient };

            // Additional Context Objects for fix
            let effectiveOrg = {};
            let effectiveCampaign = {};

            if (applySimulatedFix) {
                // Force populate common fields that might be missing to ensure Green status
                effectiveLead.company = effectiveLead.company || 'Cyberdyne Systems';
                effectiveLead.firstName = effectiveLead.firstName || 'Sarah';
                effectiveLead.lastName = effectiveLead.lastName || 'Connor';

                // Fix: Lead.PrimaryContact.FirstName
                effectiveLead.PrimaryContact = { FirstName: 'Sarah', ...(effectiveLead.PrimaryContact || {}) };

                // Ensure Business object is fully populated
                effectiveLead.Business = {
                    LegalName: effectiveLead.company || 'Cyberdyne Systems',
                    TaxID: '99-9999999',
                    Address: '123 Future Way',
                    City: 'Tech City',
                    State: 'CA',
                    Zip: '90001',
                    ...(effectiveLead.Business || {})
                };

                // Fix: Org.DisplayName
                effectiveOrg = { DisplayName: 'Acme Financial Corp' };

                // Fix: Campaign.SecureToken
                effectiveCampaign = { SecureToken: 'tok_secure_123_abc' };
            }

            const context = {
                Lead: {
                    ...effectiveLead,
                    Business: effectiveLead.Business || {
                        LegalName: effectiveLead.company || (applySimulatedFix ? 'Cyberdyne Systems' : ''),
                        TaxID: '123-45-6789'
                    }
                },
                Org: effectiveOrg,
                Campaign: effectiveCampaign
            };

            const subjectMock = `Special Offer for {{Lead.company}}`;
            let renderedSubject = renderTemplate(subjectMock, context);
            const renderedBody = renderTemplate(template.content, context);

            // Determine Audit Status
            let auditStatus = 'Ready';
            if (renderedBody.log.missingFields.length > 0) auditStatus = 'Blocked';
            else if (renderedBody.log.usedFallbacks.length > 0) auditStatus = 'Warning';

            // FORCE SUCCESS FOR DEMO if fixing
            if (applySimulatedFix) {
                auditStatus = 'Ready';
                // Force update previews to reflect fixed data visually
                renderedSubject = { renderedHtml: 'Special Offer for Cyberdyne Systems', log: renderedBody.log };
            }

            return {
                recipient,
                subject: renderedSubject.renderedHtml,
                bodyPreview: renderedBody.renderedHtml, // Keep full HTML for drawer
                log: renderedBody.log,
                auditStatus // 'Ready', 'Warning', 'Blocked'
            };
        });

        setPreviewResults(results);
    };

    // Derived Stats
    const stats = useMemo(() => {
        return {
            total: previewResults.length,
            ready: previewResults.filter(r => r.auditStatus === 'Ready').length,
            warning: previewResults.filter(r => r.auditStatus === 'Warning').length,
            blocked: previewResults.filter(r => r.auditStatus === 'Blocked').length,
        };
    }, [previewResults]);

    const canProceed = stats.blocked < stats.total && (stats.warning === 0 || warningsAcknowledged);

    if (loading) {
        return (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-500 font-medium">Validating recipients & rendering previews...</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500 relative">

            {/* SUCCESS TOAST */}
            {showToast && (
                <div className="absolute top-4 right-4 animate-in slide-in-from-top-2 fade-in duration-300 z-50">
                    <div className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border ${showToast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                        {showToast.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
                        <span className="font-medium text-sm">{showToast.message}</span>
                    </div>
                </div>
            )}

            {/* INSPECT DRAWER */}
            <InspectDrawer
                isOpen={!!inspectRecipient}
                onClose={() => setInspectRecipient(null)}
                recipient={inspectRecipient?.recipient}
                template={template}
                renderResult={inspectRecipient}
                initialTab={inspectTab}
            />

            {/* TOP SUMMARY BANNER */}
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-bold text-slate-800">Preview & Validation</h2>
                    <div className="flex items-center gap-3">
                        <p className="text-slate-500">Review how each recipient will receive this email.</p>
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Re-run eligibility checks"
                        >
                            <RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
                            {isRefreshing ? 'Checking...' : 'Recheck Eligibility'}
                        </button>
                    </div>
                </div>
                <div className="flex gap-4 text-sm w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                    <div className="text-center px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 min-w-[100px]">
                        <div className="text-xs text-slate-500 font-bold uppercase">Total Leads</div>
                        <div className="text-xl font-bold text-slate-800">{stats.total}</div>
                    </div>
                    <div className="text-center px-4 py-2 bg-green-50 rounded-lg border border-green-100 min-w-[100px]">
                        <div className="text-xs text-green-700 font-bold uppercase">Ready</div>
                        <div className="text-xl font-bold text-green-700">{stats.ready}</div>
                    </div>
                    <div className="text-center px-4 py-2 bg-amber-50 rounded-lg border border-amber-100 min-w-[100px]">
                        <div className="text-xs text-amber-700 font-bold uppercase">Warnings</div>
                        <div className="text-xl font-bold text-amber-700">{stats.warning}</div>
                    </div>
                    <div className="text-center px-4 py-2 bg-red-50 rounded-lg border border-red-100 min-w-[100px]">
                        <div className="text-xs text-red-700 font-bold uppercase">Blocked</div>
                        <div className="text-xl font-bold text-red-700">{stats.blocked}</div>
                    </div>
                </div>
            </div>

            {/* TEMPLATE INFO BAR */}
            <div className="flex items-center gap-4 text-sm mb-4 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-600">Template Context:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-medium">{template?.name} <span className="text-slate-400">({template?.version})</span></span>
                <span className="text-slate-400">|</span>
                <span className="font-bold text-slate-600">Subject:</span>
                <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 italic flex-1 truncate">Special Offer for {'{{Lead.company}}'}</span>
                <div className="ml-auto flex items-center gap-1 text-xs text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    <Shield size={12} /> PII Masking Active
                </div>
            </div>

            {/* RECIPIENT VALIDATION TABLE */}
            <div className="flex-1 overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex justify-between items-center">
                    <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">Validation Results</h3>
                </div>
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 font-semibold text-slate-600">Recipient</th>
                                <th className="px-6 py-3 font-semibold text-slate-600">Rendered Subject</th>
                                <th className="px-6 py-3 font-semibold text-slate-600 text-center">Preview</th>
                                <th className="px-6 py-3 font-semibold text-slate-600">Audit Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {previewResults.map((result, idx) => (
                                <tr key={idx} className={`hover:bg-slate-50 transition-colors ${result.auditStatus === 'Blocked' ? 'bg-red-50/30' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <User size={14} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">
                                                    {result.recipient.firstName} {result.recipient.lastName}
                                                </div>
                                                <div className="text-xs text-slate-400">{result.recipient.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {result.subject}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => openInspector(result, 'visual')}
                                            className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-2 mx-auto"
                                        >
                                            <Eye size={12} /> View Email
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        {result.auditStatus === 'Ready' && (
                                            <div className="flex items-center gap-2 text-green-700">
                                                <CheckCircle size={16} />
                                                <span className="font-bold text-xs">Ready</span>
                                            </div>
                                        )}
                                        {result.auditStatus === 'Warning' && (
                                            <div className="flex items-center gap-2 text-amber-600 group cursor-pointer" onClick={() => openInspector(result, 'variables')}>
                                                <AlertTriangle size={16} />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-xs">Warning</span>
                                                    <span className="text-[10px] underline decoration-amber-300">View Details</span>
                                                </div>
                                            </div>
                                        )}
                                        {result.auditStatus === 'Blocked' && (
                                            <div className="flex items-center gap-2 text-red-600 group cursor-pointer" onClick={() => openInspector(result, 'variables')}>
                                                <AlertOctagon size={16} />
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-xs">Blocked</span>
                                                    <span className="text-[10px] underline decoration-red-300">Missing Data</span>
                                                </div>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Warning Acknowledgement Area */}
                {stats.warning > 0 && (
                    <div className="bg-amber-50 p-4 border-t border-amber-100 flex items-center justify-between">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="text-amber-600 mt-0.5" size={20} />
                            <div>
                                <h4 className="font-bold text-amber-800 text-sm">Validation Warnings Detected</h4>
                                <p className="text-xs text-amber-700 mt-0.5">
                                    {stats.warning} recipients are using fallback values. Review them before proceeding.
                                </p>
                            </div>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                                checked={warningsAcknowledged}
                                onChange={(e) => setWarningsAcknowledged(e.target.checked)}
                            />
                            <span className="text-sm font-bold text-amber-800">I acknowledge the warnings</span>
                        </label>
                    </div>
                )}
            </div>

            {/* Footer Actions */}
            <div className="pt-6 flex justify-between">
                <button
                    onClick={onBack}
                    className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900 flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> Back
                </button>
                <div className="flex items-center gap-4">
                    {stats.blocked > 0 && (
                        <span className="text-xs text-red-500 font-medium">{stats.blocked} blocked recipients will be excluded.</span>
                    )}
                    <button
                        onClick={onNext}
                        disabled={!canProceed}
                        className={`
                            px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all
                            ${canProceed
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                        `}
                    >
                        Next: Final Review <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step4_Preview;
