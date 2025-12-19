import React from 'react';
import {
    FileText, Calendar, Info, HelpCircle, ArrowRight,
    DollarSign, Briefcase, Percent, Layers, Hash,
    Globe, Shield, AlertCircle
} from 'lucide-react';

const RequestedTermsTab = ({ loan }) => {
    // Mock Data for Immutable Application Record
    const applicationData = {
        requested: {
            amount: '$250,000',
            product: 'Term Loan Details',
            term: '36 Months',
            rateType: 'Fixed',
            purpose: 'Purchase new manufacturing equipment to expand production capacity for Q3 orders.',
            collateral: 'UCC-1 Blanket Lien on Business Assets, Specific Equipment Liens'
        },
        declarations: {
            revenue: '$1,200,000',
            cashFlow: '$180,000 / yr',
            existingDebt: '$45,000 (Auto Loan)',
            employees: '12 Full-time, 3 Part-time',
            notes: 'Borrower anticipates 20% growth next year due to new contracts.'
        },
        metadata: {
            appId: 'APP-2023-8492',
            date: 'Nov 12, 2023',
            channel: 'Borrower Portal',
            source: 'Direct Web',
            version: '1.0 (Original)'
        },
        comparison: {
            hasUnderwriting: true, // Toggle to show/hide comparison
            amount: { requested: '$250,000', approved: '$225,000', diff: '-$25,000' },
            term: { requested: '36 Months', approved: '36 Months', diff: 'Same' },
            collateral: {
                requested: 'Blanket Lien',
                approved: 'Blanket Lien + Personal Guarantee',
                diff: 'Added Guarantee'
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300 pb-12">

            {/* Header / Context */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-start gap-3">
                <Info size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                    <h3 className="text-sm font-bold text-slate-800">Immutable Application Record</h3>
                    <p className="text-xs text-slate-500 mt-1">
                        This view represents the data exactly as submitted by the borrower on <span className="font-medium text-slate-700">{applicationData.metadata.date}</span>.
                        It is read-only and serves as the baseline for underwriting.
                    </p>
                </div>
            </div>

            {/* 1. Requested Loan Terms */}
            <Section title="Requested Loan Terms">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <Field label="Requested Amount" value={applicationData.requested.amount} icon={DollarSign} />
                    <Field label="Product / Program" value={applicationData.requested.product} icon={Layers} />
                    <Field label="Requested Term" value={applicationData.requested.term} icon={Calendar} />
                    <Field label="Rate Type" value={applicationData.requested.rateType} icon={Percent} />
                    <div className="md:col-span-2">
                        <Field label="Stated Purpose" value={applicationData.requested.purpose} fullWidth />
                    </div>
                    <div className="md:col-span-2">
                        <Field label="Declared Collateral" value={applicationData.requested.collateral} icon={Shield} fullWidth />
                    </div>
                </div>
            </Section>

            {/* 2. Borrower Declarations */}
            <Section title="Borrower Declarations (Self-Reported)">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CardStat label="Annual Revenue" value={applicationData.declarations.revenue} sub="As stated" />
                    <CardStat label="Annual Cash Flow" value={applicationData.declarations.cashFlow} sub="As stated" />
                    <CardStat label="Employees" value={applicationData.declarations.employees} sub="As stated" />
                </div>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                    <Field label="Existing Business Debt" value={applicationData.declarations.existingDebt} />
                    <Field label="Additional Declarations" value={applicationData.declarations.notes} />
                </div>
            </Section>

            {/* 4. Changes vs Original Request (Comparison) */}
            {applicationData.comparison.hasUnderwriting && (
                <Section title="Changes vs Original Request">
                    <div className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100/50 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 w-1/3">Metric</th>
                                    <th className="px-6 py-3 w-1/3 border-l border-slate-200">Requested</th>
                                    <th className="px-6 py-3 w-1/3 border-l border-slate-200 bg-emerald-50/30 text-emerald-700">Underwritten</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <ComparisonRow
                                    label="Loan Amount"
                                    requested={applicationData.comparison.amount.requested}
                                    approved={applicationData.comparison.amount.approved}
                                    diff={applicationData.comparison.amount.diff}
                                />
                                <ComparisonRow
                                    label="Term"
                                    requested={applicationData.comparison.term.requested}
                                    approved={applicationData.comparison.term.approved}
                                    diff={applicationData.comparison.term.diff}
                                />
                                <ComparisonRow
                                    label="Collateral"
                                    requested={applicationData.comparison.collateral.requested}
                                    approved={applicationData.comparison.collateral.approved}
                                    diff={applicationData.comparison.collateral.diff}
                                />
                            </tbody>
                        </table>
                    </div>
                </Section>
            )}

            {/* 3. Metadata Footer */}
            <div className="border-t border-slate-200 pt-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Application Metadata</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <MetaField label="Application ID" value={applicationData.metadata.appId} />
                    <MetaField label="Date Submitted" value={applicationData.metadata.date} />
                    <MetaField label="Channel" value={applicationData.metadata.channel} />
                    <MetaField label="Source" value={applicationData.metadata.source} />
                    <MetaField label="Version" value={applicationData.metadata.version} />
                </div>
            </div>

        </div>
    );
};

// UI Components
const Section = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
            <div className="w-1 h-4 bg-teal-500 rounded-full"></div>
            {title}
        </h3>
        {children}
    </div>
);

const Field = ({ label, value, icon: Icon, fullWidth }) => (
    <div className={fullWidth ? 'w-full' : ''}>
        <div className="flex items-center gap-1.5 mb-1.5">
            {Icon && <Icon size={14} className="text-slate-400" />}
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{label}</span>
        </div>
        <div className="text-sm text-slate-900 font-medium leading-relaxed bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/60">
            {value}
        </div>
    </div>
);

const CardStat = ({ label, value, sub }) => (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200/60 text-center">
        <div className="text-xs text-slate-500 uppercase font-bold mb-1">{label}</div>
        <div className="text-lg font-bold text-slate-900 mb-0.5">{value}</div>
        <div className="text-[10px] text-slate-400 italic">{sub}</div>
    </div>
);

const ComparisonRow = ({ label, requested, approved, diff }) => (
    <tr>
        <td className="px-6 py-4 font-medium text-slate-700">{label}</td>
        <td className="px-6 py-4 text-slate-600 border-l border-slate-100">{requested}</td>
        <td className="px-6 py-4 border-l border-slate-100 bg-emerald-50/10">
            <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{approved}</span>
                {diff && diff !== 'Same' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                        {diff}
                    </span>
                )}
            </div>
        </td>
    </tr>
);

const MetaField = ({ label, value }) => (
    <div>
        <div className="text-[10px] text-slate-400 no-underline mb-0.5">{label}</div>
        <div className="text-xs font-mono text-slate-600">{value}</div>
    </div>
);

export default RequestedTermsTab;
