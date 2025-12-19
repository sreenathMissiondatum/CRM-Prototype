import React from 'react';
import {
    Building2, MapPin, Globe, Phone, Mail,
    Briefcase, Flag, Users, CircleCheck, History
} from 'lucide-react';

const AccountOverviewTab = ({ account }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Business & Industry */}
            <div className="space-y-6">

                {/* 1. Business Information Card */}
                <SectionCard title="Business Information" icon={Building2}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                        <Field label="Legal Name" value={account.name} />
                        <Field label="DBA Name" value={account.dba} />
                        <Field label="Entity Type" value={account.type} />
                        <Field label="Tax ID (EIN)" value={account.taxId} isMasked />
                        <Field label="Date Established" value={account.established} />
                        <Field label="Years in Business" value={`${account.yearsInBusiness} Years`} />
                        <Field label="Startup?" value={account.isStartup ? 'Yes' : 'No'} />
                    </div>
                </SectionCard>

                {/* 2. Industry & Market Card */}
                <SectionCard title="Industry & Market" icon={Briefcase}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                        <Field label="NAICS Code" value={account.naics} />
                        <Field label="Industry Sector" value={account.naicsSector} />
                        <Field label="Target Market" value={account.isLowIncome ? 'Low-Income Area' : 'General'} />
                        <div className="flex flex-col">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Census Tract</span>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-800">{account.censusTract}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${account.isLowIncome ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                    {account.isLowIncome ? 'Qualified' : 'Not Qualified'}
                                </span>
                            </div>
                        </div>
                    </div>
                </SectionCard>
            </div>

            {/* Right Column: Impact & Relationship */}
            <div className="space-y-6">

                {/* 3. Impact & Ownership Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <Flag size={18} className="text-purple-600" />
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Impact & Ownership</h3>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-wrap gap-2">
                            {account.flags.map(flag => (
                                <span key={flag} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                    {flag}
                                </span>
                            ))}
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                Low Income Community
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                                LMI Jobs Support
                            </span>
                        </div>
                    </div>
                </div>

                {/* 4. Relationship Card */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <Users size={18} className="text-blue-600" />
                        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Relationship</h3>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-500">Active TA Client</span>
                            {account.isTaClient ? (
                                <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                                    <CircleCheck size={14} /> Yes
                                </span>
                            ) : <span className="text-sm font-medium text-slate-700">No</span>}
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                            <span className="text-sm text-slate-500">Previous CDFI Borrower</span>
                            <span className="text-sm font-medium text-slate-700">{account.prevBorrower ? 'Yes' : 'No'}</span>
                        </div>
                        {account.prevBorrower && (
                            <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                <span className="text-sm text-slate-500">Previous Loan Performance</span>
                                <span className="text-sm font-medium text-emerald-600">Paid in Full</span>
                            </div>
                        )}

                        <div className="pt-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Referral Context</span>
                            <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                <div className="text-sm font-bold text-slate-800">Detroit Econ Club</div>
                                <div className="text-xs text-slate-500">Ref: Sarah Smith (Director)</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper Components (internal to this file to be self-contained)
const SectionCard = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <Icon size={18} className="text-slate-400" />
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const Field = ({ label, value, isMasked }) => (
    <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
        {isMasked ? (
            <div className="flex items-center gap-2 group">
                <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{value}</span>
                <span className="text-[10px] text-blue-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">Show</span>
            </div>
        ) : (
            <span className="text-sm font-medium text-slate-800 truncate">{value}</span>
        )}
    </div>
);

export default AccountOverviewTab;
