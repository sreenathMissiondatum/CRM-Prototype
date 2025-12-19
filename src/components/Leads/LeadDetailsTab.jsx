import React, { useState } from 'react';
import {
    ChevronDown, ChevronUp, MapPin, Building2,
    Briefcase, Users, User, Share2, FileCheck,
    Calendar, CreditCard, Info
} from 'lucide-react';

const LeadDetailsTab = ({ lead }) => {
    // --- State ---
    const [sections, setSections] = useState({
        identity: false,
        industry: false,
        intent: false,
        demographics: false,
        contact: false,
        referral: false,
        consent: false
    });

    const toggleSection = (key) => {
        setSections(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleAll = (shouldOpen) => {
        const newSections = Object.keys(sections).reduce((acc, key) => {
            acc[key] = shouldOpen;
            return acc;
        }, {});
        setSections(newSections);
    };

    const allExpanded = Object.values(sections).every(Boolean);

    // --- Derived Data / Mocking ---
    const yearsInBusiness = 5; // derived from 2020 established date
    const censusTract = "48201223100"; // Mock
    const isLowIncomeLine = true; // Mock

    return (
        <div className="max-w-4xl mx-auto pb-20">

            {/* Controls */}
            <div className="flex justify-end mb-4">
                <button
                    onClick={() => toggleAll(!allExpanded)}
                    className="text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                    {allExpanded ? (
                        <>Collapse All <ChevronUp size={14} /></>
                    ) : (
                        <>Expand All <ChevronDown size={14} /></>
                    )}
                </button>
            </div>

            {/* 1. Business Identity */}
            <Section
                title="Business Identity"
                icon={Building2}
                isOpen={sections.identity}
                onToggle={() => toggleSection('identity')}
            >
                <div className="grid grid-cols-2 gap-6">
                    <Field label="Business Name" value={lead?.company || "Acme Logistics, LLC"} required />
                    <Field label="DBA Name" value="" placeholder="Doing Business As" />

                    <Field label="Entity Type" value="Limited Liability Company (LLC)" />
                    <Field label="EIN / Tax ID" value="XX-XXX1234" />

                    <Field label="Date Established" value="2020-03-15" type="date" />
                    <div className="relative">
                        <Field label="Years in Business" value={yearsInBusiness} readOnly />
                        <div className="absolute top-0 right-0 mt-8 mr-3 text-xs text-slate-400 font-medium">Years</div>
                    </div>

                    <div className="col-span-2">
                        <Field label="Business Description" type="textarea" value="Small logistics company specializing in last-mile delivery services for local retail chains." />
                    </div>

                    <div className="col-span-2 flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300" />
                        <span className="text-sm font-medium text-slate-700">Startup (Less than 2 years in business)</span>
                    </div>
                </div>
            </Section>

            {/* 2. Industry & Location */}
            <Section
                title="Industry & Location"
                icon={MapPin}
                isOpen={sections.industry}
                onToggle={() => toggleSection('industry')}
            >
                <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 grid grid-cols-12 gap-6">
                        <div className="col-span-4">
                            <Field label="NAICS Code" value="484110" />
                        </div>
                        <div className="col-span-8">
                            <Field label="NAICS Sector" value="General Freight Trucking, Local" readOnly />
                        </div>
                    </div>

                    <div className="col-span-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3 border-b border-slate-100 pb-1">Physical Address</h4>
                    </div>

                    <div className="col-span-2">
                        <Field label="Street Address" value="123 Industrial Blvd, Suite 400" />
                    </div>

                    <Field label="City" value="Detroit" />
                    <div className="grid grid-cols-2 gap-4">
                        <Field label="State" value="MI" />
                        <Field label="ZIP Code" value="48201" />
                    </div>

                    <div className="col-span-2 bg-blue-50/50 p-4 rounded-lg border border-blue-100 mt-2">
                        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-3 flex items-center gap-2">
                            <Info size={14} /> Census Data (Auto-Derived)
                        </h4>
                        <div className="grid grid-cols-2 gap-6">
                            <Field label="Census Tract" value={censusTract} readOnly />
                            <div className="flex items-end pb-2">
                                {isLowIncomeLine && (
                                    <div className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-md flex items-center gap-2 border border-blue-200">
                                        <CheckCheckIcon /> Low Income Community (LIC)
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* 3. Loan Intent */}
            <Section
                title="Loan Intent"
                icon={Briefcase}
                isOpen={sections.intent}
                onToggle={() => toggleSection('intent')}
            >
                <div className="grid grid-cols-2 gap-6">
                    <Field label="Loan Amount Requested" value={lead?.amount ? `$${lead.amount.toLocaleString()}` : "$75,000"} />
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Loan Purpose</label>
                        <select className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 bg-white">
                            <option>Working Capital</option>
                            <option>Equipment Purchase</option>
                            <option>Real Estate Acquisition</option>
                            <option>Refinance</option>
                        </select>
                    </div>
                    <div className="col-span-2">
                        <Field label="Purpose Detail" type="textarea" value="Funds needed to purchase two new delivery vans and hire 3 additional drivers for Q4 expansion." />
                    </div>
                </div>
            </Section>

            {/* 4. Ownership & Demographics (1071) */}
            <Section
                title="Ownership & Demographics (Section 1071)"
                icon={Users}
                isOpen={sections.demographics}
                onToggle={() => toggleSection('demographics')}
            >
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6 text-sm text-amber-800 flex items-start gap-3">
                    <Info size={16} className="mt-0.5 shrink-0" />
                    <p>Information in this section is collected for compliance with CFPB Section 1071. All responses are voluntary.</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Race</label>
                        <div className="p-3 border border-slate-200 rounded-lg bg-white h-24 overflow-y-auto space-y-2">
                            <Checkbox label="American Indian or Alaska Native" />
                            <Checkbox label="Asian" />
                            <Checkbox label="Black or African American" checked />
                            <Checkbox label="Native Hawaiian or Other Pacific Islander" />
                            <Checkbox label="White" />
                            <Checkbox label="Prefer not to provide" />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Ethnicity</label>
                        <div className="p-3 border border-slate-200 rounded-lg bg-white h-24 overflow-y-auto space-y-2">
                            <Checkbox label="Hispanic or Latino" />
                            <Checkbox label="Not Hispanic or Latino" checked />
                            <Checkbox label="Prefer not to provide" />
                        </div>
                    </div>

                    <Field label="Gender" value="Male" />
                    <Field label="Veteran Status" value="Non-Veteran" />

                    <div className="col-span-2 border-t border-slate-100 pt-4 mt-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Ownership Flags</label>
                        <div className="flex flex-wrap gap-4">
                            <BadgeCheckbox label="Minority Owned" checked />
                            <BadgeCheckbox label="Woman Owned" />
                            <BadgeCheckbox label="Veteran Owned" />
                            <BadgeCheckbox label="LGBTQ+ Owned" />
                            <BadgeCheckbox label="Disability Owned" />
                        </div>
                    </div>
                </div>
            </Section>

            {/* 5. Primary Contact */}
            <Section
                title="Primary Contact"
                icon={User}
                isOpen={sections.contact}
                onToggle={() => toggleSection('contact')}
            >
                <div className="grid grid-cols-2 gap-6">
                    <Field label="First Name" value={lead?.contact ? lead.contact.split(' ')[0] : (lead?.name?.split(' ')[0] || "Marcus")} />
                    <Field label="Last Name" value={lead?.contact ? lead.contact.split(' ')[1] : (lead?.name?.split(' ')[1] || "Wellby")} />

                    <Field label="Email Address" value="marcus@acmelogistics.com" />
                    <Field label="Phone Number" value="(313) 555-0123" />

                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Preferred Contact Method</label>
                        <select className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 bg-white">
                            <option>Email</option>
                            <option>Phone Call</option>
                            <option>SMS / Text</option>
                        </select>
                    </div>
                    <Field label="Household Income" value="$85,000" />

                    <div className="col-span-2">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Self-Reported Credit Score Range</label>
                        <div className="flex gap-2">
                            {['< 600', '600-650', '650-700', '700-750', '750+'].map(bg => (
                                <button key={bg} type="button" className={`px-4 py-2 rounded-lg text-sm border font-medium transition-colors ${bg === '650-700' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                                    {bg}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* 6. Referral & Attribution */}
            <Section
                title="Referral & Attribution"
                icon={Share2}
                isOpen={sections.referral}
                onToggle={() => toggleSection('referral')}
            >
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Referral Source Type</label>
                        <select className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800 bg-white">
                            <option>Community Partner</option>
                            <option>Bank Referral</option>
                            <option>Online Application</option>
                            <option>Word of Mouth</option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Referring Partner Org</label>
                        <div className="relative">
                            <input type="text" className="w-full text-sm border border-slate-300 rounded-lg pl-3 pr-8 py-2 outline-none text-slate-800" value="Detroit Economic Growth Corp" readOnly />
                            <div className="absolute right-2 top-2 text-slate-400"><Share2 size={14} /></div>
                        </div>
                    </div>

                    <Field label="Referring Contact" value="Sarah Jenkins" />
                    <Field label="Referral Outcome" value="Application Started" readOnly />
                </div>
            </Section>

            {/* 7. Consent & Compliance */}
            <Section
                title="Consent & Compliance"
                icon={FileCheck}
                isOpen={sections.consent}
                onToggle={() => toggleSection('consent')}
            >
                <div className="grid grid-cols-2 gap-6">
                    <Field label="Consent Timestamp" value="2024-10-15 14:30:22 UTC" readOnly />
                    <Field label="Capture Channel" value="Web Portal" readOnly />
                    <Field label="Captured By" value="System (Self-Service)" readOnly />
                    <Field label="IP Address" value="192.168.1.1" readOnly />
                </div>
            </Section>

        </div>
    );
};

// --- Micro-Components ---

const Section = ({ title, icon: Icon, children, isOpen, onToggle }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <button
            type="button"
            onClick={onToggle}
            className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-100"
        >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white text-slate-500 rounded-lg border border-slate-200 shadow-sm">
                    <Icon size={18} />
                </div>
                <h3 className="font-bold text-slate-800 text-base">{title}</h3>
            </div>
            {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
        </button>

        {isOpen && (
            <div className="p-6">
                {children}
            </div>
        )}
    </div>
);

const Field = ({ label, value, type = 'text', readOnly = false, required = false, className = '' }) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
            <textarea
                className={`w-full text-sm border rounded-lg px-3 py-2 outline-none transition-all ${readOnly
                    ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800'
                    }`}
                value={value}
                readOnly={readOnly}
                rows={3}
                placeholder={readOnly ? '' : 'Enter details...'}
            />
        ) : (
            <input
                type={type}
                className={`w-full text-sm border rounded-lg px-3 py-2 outline-none transition-all ${readOnly
                    ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed font-medium'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800'
                    }`}
                value={value}
                readOnly={readOnly}
            />
        )}
    </div>
);

const ReadOnlyTag = ({ label }) => (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200 ml-2">
        {label}
    </span>
);

const Checkbox = ({ label, checked }) => (
    <label className="flex items-center gap-2 cursor-pointer group">
        <input type="checkbox" defaultChecked={checked} className="w-4 h-4 text-blue-600 rounded border-slate-300 group-hover:border-blue-400" />
        <span className="text-sm text-slate-700">{label}</span>
    </label>
);

const BadgeCheckbox = ({ label, checked }) => (
    <label className={`flex items-center gap-2 px-3 py-1.5 rounded-full border cursor-pointer transition-all ${checked ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}>
        <input type="checkbox" defaultChecked={checked} className="hidden" />
        <span className="text-xs font-bold">{label}</span>
        {checked && <CheckCheckIcon size={12} />}
    </label>
);

const CheckCheckIcon = ({ size = 16, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22c5.523 0 10-5 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="none" fill="none" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

export default LeadDetailsTab;
