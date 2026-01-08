import React, { useState } from 'react';
import {
    Settings, FileText, AlertTriangle, Shield,
    DollarSign, Activity, CheckCircle, Info,
    Lock, ChevronRight, Save, LayoutGrid
} from 'lucide-react';

const RulesConfiguration = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState('identification');

    // Mock Context Data (Sticky Header)
    const programContext = {
        name: 'Small Business Growth Fund 2025',
        profileId: 'PROG-2025-SBGF',
        authority: 'CDFI Fund',
        status: 'Active'
    };

    // Form State
    const [formData, setFormData] = useState({
        // Tab 2: Procedures
        programName_f1: 'Small Business Growth Fund 2025',
        activeStatus_f1: true,
        governingAuthority_f1: 'CDFI Fund',
        SBA_productType_f1: '',
        CDFI_awardSource_f1: ['FA (Financial Assistance)', 'RRP'],

        // Tab 3: Requirements
        accBalane_pull_yn_f1: true, // Require Cash Flow
        Req_Psychometric_f1: false,
        geoRestriction_f1: 'Investment Area',
        Mandatory_taFlag_f1: true,

        Guaranty_percent_f1: 0,
        Guarantor_EquityThreshold_f1: 20,
        Refinance_Allowed_f1: true,
        Balloon_Allowed_f1: false,

        sopVersion: '2024.1-REV'
    });

    // Handle standard inputs
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // --- Tabs Configuration ---
    const tabs = [
        { id: 'identification', label: '1. Identification', icon: FileText },
        { id: 'procedures', label: '2. Program Procedures', icon: Settings },
        { id: 'requirements', label: '3. Requirements & Triggers', icon: AlertTriangle },
        { id: 'facility', label: '4. Facility Frame', icon: LayoutGrid },
        { id: 'pricing', label: '5. Pricing & Fees', icon: DollarSign },
        { id: 'audit', label: '6. Audit & Simulation', icon: Activity },
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">

            {/* STICKY HEADER: Global Context */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-20 shadow-sm flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        <span>Program Rules Configuration (MVP)</span>
                        <ChevronRight size={12} />
                        <span>{programContext.profileId}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-slate-800">{programContext.name}</h1>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold border ${programContext.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                            {programContext.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            {programContext.authority}
                        </span>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        Close
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm">
                        <Save size={16} /> Save Rules
                    </button>
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-hidden flex">

                {/* SIDEBAR TABS (Vertical for clarity in complex configs, or Horizontal?) 
                    Prompt said "Tabs (exact order)", usually implies horizontal. Let's do a clean horizontal bar under sticky header?
                    Refining: Prompt implies standard tabs. Let's do horizontal below header.
                */}

            </div>
            <div className="bg-white border-b border-slate-200 px-6 sticky top-[80px] z-10">
                <div className="flex space-x-6 overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* SCROLLABLE BODY */}
            <div className="flex-1 overflow-y-auto p-8 max-w-5xl mx-auto w-full">

                {/* TAB 1: IDENTIFICATION */}
                {activeTab === 'identification' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                            <Info size={20} className="text-blue-600 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-bold text-blue-900 text-sm">Read-Only System Context</h3>
                                <p className="text-xs text-blue-700 mt-1">These fields are immutable system identifiers linked to the core facility structure.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <ReadOnlyField label="Business Name (name_bus)" value="Small Business Growth Fund" />
                            <ReadOnlyField label="Application ID" value="APP-2025-001" />
                            <ReadOnlyField label="Loan Facility ID" value="FAC-SBGF-01" />
                        </div>
                    </div>
                )}

                {/* TAB 2: PROGRAM PROCEDURES */}
                {activeTab === 'procedures' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        <Section title="Program Identity">
                            <div className="grid grid-cols-2 gap-6">
                                <ReadOnlyField label="Program Profile ID" value={programContext.profileId} />
                                <InputField
                                    label="Program Name"
                                    value={formData.programName_f1}
                                    onChange={v => handleChange('programName_f1', v)}
                                />
                                <div className="flex items-center gap-2 mt-4">
                                    <input
                                        type="checkbox"
                                        checked={formData.activeStatus_f1}
                                        onChange={e => handleChange('activeStatus_f1', e.target.checked)}
                                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                                    />
                                    <span className="text-sm font-bold text-slate-700">Active Status</span>
                                </div>
                            </div>
                        </Section>

                        <Section title="Governing Authority">
                            <div className="grid grid-cols-2 gap-6">
                                <SelectField
                                    label="Governing Authority"
                                    value={formData.governingAuthority_f1}
                                    onChange={v => handleChange('governingAuthority_f1', v)}
                                    options={['SBA', 'CDFI Fund', 'State SSBCI', 'Internal']}
                                />

                                {/* CONDITONAL: SBA */}
                                {formData.governingAuthority_f1 === 'SBA' && (
                                    <SelectField
                                        label="SBA Product Type"
                                        value={formData.SBA_productType_f1}
                                        onChange={v => handleChange('SBA_productType_f1', v)}
                                        options={['7(a)', '504', 'Microloan', 'Community Advantage']}
                                    />
                                )}

                                {/* CONDITONAL: CDFI */}
                                {formData.governingAuthority_f1 === 'CDFI Fund' && (
                                    <div className="col-span-2">
                                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">CDFI Award Source(s)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {['FA (Financial Assistance)', 'TA (Technical Assistance)', 'RRP', 'ERP'].map(opt => (
                                                <label key={opt} className={`px-3 py-1.5 text-xs font-bold rounded cursor-pointer border transition-colors ${formData.CDFI_awardSource_f1.includes(opt) ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                                                    <input
                                                        type="checkbox"
                                                        className="hidden"
                                                        checked={formData.CDFI_awardSource_f1.includes(opt)}
                                                        onChange={e => {
                                                            const current = formData.CDFI_awardSource_f1;
                                                            const next = e.target.checked ? [...current, opt] : current.filter(x => x !== opt);
                                                            handleChange('CDFI_awardSource_f1', next);
                                                        }}
                                                    />
                                                    {opt}
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Section>
                    </div>
                )}

                {/* TAB 3: REQUIREMENTS & TRIGGERS */}
                {activeTab === 'requirements' && (
                    <div className="space-y-8 animate-in fade-in duration-300">

                        <Section title="Data Requirements">
                            <div className="space-y-4">
                                <ToggleRow
                                    label="Require Cash Flow Data (accBalane_pull_yn_f1)"
                                    desc="Mandates Plaid/Bank connection before Underwriting."
                                    checked={formData.accBalane_pull_yn_f1}
                                    onChange={v => handleChange('accBalane_pull_yn_f1', v)}
                                />
                                <ToggleRow
                                    label="Require Psychometric Assessment"
                                    desc="Blocks progression until founder assessment is complete."
                                    checked={formData.Req_Psychometric_f1}
                                    onChange={v => handleChange('Req_Psychometric_f1', v)}
                                />
                            </div>
                        </Section>

                        <Section title="Geography & Compliance">
                            <div className="grid grid-cols-2 gap-6">
                                <SelectField
                                    label="Geo Restriction"
                                    value={formData.geoRestriction_f1}
                                    onChange={v => handleChange('geoRestriction_f1', v)}
                                    options={['None', 'Investment Area', 'LMI Zone', 'Rural Only']}
                                />
                            </div>
                        </Section>

                        <Section title="Technical Assistance">
                            <ToggleRow
                                label="Mandatory TA Flag"
                                desc="Borrower must log TA hours before Closing is permitted."
                                checked={formData.Mandatory_taFlag_f1}
                                onChange={v => handleChange('Mandatory_taFlag_f1', v)}
                            />
                        </Section>

                        <Section title="Credit & Risk Logic">
                            <div className="grid grid-cols-2 gap-6">
                                <InputField
                                    label="SBA Guaranty %"
                                    value={formData.Guaranty_percent_f1}
                                    type="number"
                                    onChange={v => handleChange('Guaranty_percent_f1', v)}
                                />
                                <InputField
                                    label="Guarantor Equity Threshold (%)"
                                    value={formData.Guarantor_EquityThreshold_f1}
                                    type="number"
                                    onChange={v => handleChange('Guarantor_EquityThreshold_f1', v)}
                                />
                                <div className="col-span-2 space-y-3 pt-2">
                                    <ToggleRow
                                        label="Refinance Allowed"
                                        desc="If disabled, blocks 'Refinance' as a Loan Purpose."
                                        checked={formData.Refinance_Allowed_f1}
                                        onChange={v => handleChange('Refinance_Allowed_f1', v)}
                                    />
                                    <ToggleRow
                                        label="Balloon Payments Allowed"
                                        desc="Permits amortization > term."
                                        checked={formData.Balloon_Allowed_f1}
                                        onChange={v => handleChange('Balloon_Allowed_f1', v)}
                                    />
                                </div>
                            </div>
                        </Section>

                        <Section title="SOP & Credit Elsewhere">
                            <div className="grid grid-cols-2 gap-6">
                                <InputField
                                    label="SOP Version"
                                    value={formData.sopVersion}
                                    onChange={v => handleChange('sopVersion', v)}
                                />
                            </div>
                        </Section>

                    </div>
                )}

                {/* PLACEHOLDER TABS */}
                {['facility', 'pricing', 'audit'].includes(activeTab) && (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 animate-in fade-in duration-300">
                        <div className="p-4 bg-slate-100 rounded-full mb-4">
                            <Settings size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-600">Configuration Module Pending</h3>
                        <p className="text-sm">This module is part of the MVP roadmap.</p>
                    </div>
                )}

            </div>
        </div>
    );
};

// --- Reusable Components ---

const Section = ({ title, children }) => (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex items-center gap-2">
            <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wide">{title}</h3>
        </div>
        <div className="p-6">
            {children}
        </div>
    </div>
);

const ReadOnlyField = ({ label, value }) => (
    <div className="group relative">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
            {label} <Lock size={10} />
        </label>
        <div className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
            {value}
        </div>
    </div>
);

const InputField = ({ label, value, onChange, type = 'text', placeholder }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
            {label}
        </label>
        <input
            type={type}
            className="w-full text-sm font-medium text-slate-800 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:font-normal"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
        />
    </div>
);

const SelectField = ({ label, value, onChange, options }) => (
    <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">
            {label}
        </label>
        <div className="relative">
            <select
                className="w-full text-sm font-medium text-slate-800 border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none bg-white"
                value={value}
                onChange={e => onChange(e.target.value)}
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDownIcon />
            </div>
        </div>
    </div>
);

const ToggleRow = ({ label, desc, checked, onChange }) => (
    <div className="flex items-start justify-between group p-2 hover:bg-slate-50 rounded-lg transition-colors -mx-2">
        <div>
            <div className="text-sm font-bold text-slate-700">{label}</div>
            {desc && <div className="text-xs text-slate-400 mt-0.5">{desc}</div>}
        </div>
        <button
            onClick={() => onChange(!checked)}
            className={`relative w-11 h-6 rounded-full transition-colors flex items-center ${checked ? 'bg-blue-600' : 'bg-slate-300'}`}
        >
            <div className={`w-4 h-4 rounded-full bg-white shadow-sm absolute transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    </div>
);

const ChevronDownIcon = () => (
    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default RulesConfiguration;
