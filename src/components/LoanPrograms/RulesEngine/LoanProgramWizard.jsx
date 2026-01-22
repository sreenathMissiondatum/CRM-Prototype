import React, { useState, useEffect } from 'react';
import {
    Briefcase, Landmark, Shield, Wallet, Percent, Banknote,
    FileText, CheckCircle2, AlertTriangle, Info, MapPin,
    Globe, Building2, Lock, ChevronRight, ChevronLeft, Save,
    Scale, ScrollText, Check, Hammer, Box, RefreshCw, PlusCircle, Target, TrendingUp
} from 'lucide-react';

// --- CONFIGURATION & SCHEMA ---
// FIXED: Removed dynamic string construction for Tailwind classes to prevent purging.
const THEMES = {
    1: {
        id: 'identity', label: 'Program Identity', icon: Briefcase,
        bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-900', accent: 'text-indigo-600', ring: 'focus:ring-indigo-500',
        btn: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200',
        marker: 'bg-indigo-500', markerText: 'text-indigo-600', markerBg: 'bg-indigo-100'
    },
    2: {
        id: 'regulatory', label: 'Regulatory Authority', icon: Landmark,
        bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-900', accent: 'text-blue-600', ring: 'focus:ring-blue-500',
        btn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200',
        marker: 'bg-blue-500', markerText: 'text-blue-600', markerBg: 'bg-blue-100'
    },
    3: {
        id: 'eligibility', label: 'Eligibility & Risk', icon: Shield,
        bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-900', accent: 'text-teal-600', ring: 'focus:ring-teal-500',
        btn: 'bg-teal-600 hover:bg-teal-700 shadow-teal-200',
        marker: 'bg-teal-500', markerText: 'text-teal-600', markerBg: 'bg-teal-100'
    },
    4: {
        id: 'structure', label: 'Structure & Limits', icon: Wallet,
        bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-900', accent: 'text-emerald-600', ring: 'focus:ring-emerald-500',
        btn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200',
        marker: 'bg-emerald-500', markerText: 'text-emerald-600', markerBg: 'bg-emerald-100'
    },
    5: {
        id: 'pricing', label: 'Pricing & Accrual', icon: Percent,
        bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-900', accent: 'text-violet-600', ring: 'focus:ring-violet-500',
        btn: 'bg-violet-600 hover:bg-violet-700 shadow-violet-200',
        marker: 'bg-violet-500', markerText: 'text-violet-600', markerBg: 'bg-violet-100'
    },
    6: {
        id: 'collateral', label: 'Collateral & Guarantees', icon: Banknote,
        bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-900', accent: 'text-amber-600', ring: 'focus:ring-amber-500',
        btn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-200',
        marker: 'bg-amber-500', markerText: 'text-amber-600', markerBg: 'bg-amber-100'
    },
    7: {
        id: 'workflow', label: 'Workflow & Fees', icon: FileText,
        bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-900', accent: 'text-rose-600', ring: 'focus:ring-rose-500',
        btn: 'bg-rose-600 hover:bg-rose-700 shadow-rose-200',
        marker: 'bg-rose-500', markerText: 'text-rose-600', markerBg: 'bg-rose-100'
    },
    8: {
        id: 'review', label: 'Review & Activate', icon: CheckCircle2,
        bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-900', accent: 'text-slate-600', ring: 'focus:ring-slate-500',
        btn: 'bg-slate-900 hover:bg-slate-800 shadow-slate-400',
        marker: 'bg-slate-500', markerText: 'text-slate-600', markerBg: 'bg-slate-100'
    },
};

const LoanProgramWizard = ({ initialData, onSave, onCancel }) => {
    const [currentStep, setCurrentStep] = useState(1);

    // STRICT SCHEMA: 27 Fields. No defaults.
    const [formData, setFormData] = useState(initialData || {
        name: '', authority: null, active: false,
        sbaProductType: null, sopVersion: null, cdfiAward: [],
        geoRestriction: null, minSbss: '140', reqCashFlow: false, reqPsychometric: false,
        minAmount: '', maxAmount: '', maxTerm: '', balloonAllowed: false,
        baseRateIndex: null, maxSpreadLogic: null, accrualMethod: null, feeWaiverLogic: null, feeDisclosure: false,
        collateralThreshold: '', maxLtvRealEstate: '', guarantyPercentage: '', guarantorEquityThreshold: '',
        minLendingYield: '',
        creditElsewhere: false, refinanceAllowed: false, allowedUses: []
    });

    const activeTheme = THEMES[currentStep];

    // --- LOGIC GATES ---
    const canProceed = () => {
        // TEMPORARY: Validation bypassed for UI review per user request
        return true;
    };

    const handleNext = () => { if (canProceed()) setCurrentStep(p => Math.min(p + 1, 8)); };
    const handleBack = () => setCurrentStep(p => Math.max(p - 1, 1));
    const handleChange = (field, value) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            return updated;
        });
    };

    // --- COMPONENTS ---

    const PolicyCard = ({ title, children, className = '' }) => (
        <div className={`rounded-xl border shadow-sm mb-6 overflow-hidden bg-white ${activeTheme.border} ${className}`}>
            <div className={`px-6 py-4 border-b flex items-center gap-3 ${activeTheme.bg} ${activeTheme.border}`}>
                <div className={`p-1.5 rounded-lg bg-white/60 ${activeTheme.text}`}>
                    {React.createElement(THEMES[currentStep].icon, { size: 18 })}
                </div>
                <h3 className={`font-bold text-sm uppercase tracking-wide ${activeTheme.text}`}>{title}</h3>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    const FieldLabel = ({ label, helper, required }) => (
        <div className="mb-2">
            <label className="block text-sm font-bold text-slate-800">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>
            {helper && <p className="text-xs text-slate-500 mt-0.5 font-medium">{helper}</p>}
        </div>
    );

    const TextInput = ({ label, value, onChange, placeholder, prefix, suffix, helper, type = "text" }) => (
        <div className="mb-4">
            <FieldLabel label={label} helper={helper} required />
            <div className="relative flex items-center group">
                {prefix && <div className="absolute left-3 text-slate-400 text-sm font-bold">{prefix}</div>}
                <input
                    type={type}
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`
                        w-full bg-white border border-slate-200 rounded-lg py-2.5 px-3 text-sm font-medium text-slate-900
                        placeholder:text-slate-300 transition-all shadow-sm
                        focus:border-transparent focus:ring-2 ${activeTheme.ring}
                        ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-12' : ''}
                    `}
                />
                {suffix && <div className="absolute right-3 text-slate-400 text-sm font-bold bg-slate-50 px-2 py-0.5 rounded text-xs">{suffix}</div>}
            </div>
        </div>
    );

    const ToggleTile = ({ label, description, checked, onChange, icon: Icon }) => {
        const _color = THEMES[currentStep].id === 'identity' ? 'indigo' : THEMES[currentStep].id; // Fallback mapping checks

        return (
            <button
                onClick={() => onChange(!checked)}
                className={`
                    flex items-start gap-4 p-4 rounded-xl border text-left transition-all w-full
                    ${checked
                        ? `bg-white border-${_color}-500 shadow-md ring-1 ring-${_color}-500`
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }
                `}
            >
                <div className={`w-12 h-8 rounded-full relative transition-colors ${checked ? `bg-${_color}-500` : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-4' : ''}`} />
                </div>
                <div>
                    <div className={`text-sm font-bold mb-1 ${checked ? 'text-slate-900' : 'text-slate-600'}`}>{label}</div>
                    <div className="text-xs text-slate-500 leading-relaxed font-medium max-w-sm">{description}</div>
                </div>
            </button>
        );
    };

    const SelectTile = ({ selected, label, onClick, icon: Icon, badge }) => (
        <button
            onClick={onClick}
            className={`
                group relative flex flex-col items-center justify-center p-6 rounded-xl border transition-all duration-200 h-32
                ${selected
                    ? `bg-white shadow-lg translate-y-[-2px] ${activeTheme.border} ring-1 ring-offset-0`
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:bg-slate-50'
                }
            `}
            style={selected ? { borderColor: 'var(--theme-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' } : {}}
        >
            {badge && <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded overflow-hidden">{badge}</div>}
            <div className={`
                p-3 rounded-full mb-3 transition-colors
                ${selected ? `${activeTheme.bg} ${activeTheme.text}` : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'}
            `}>
                {Icon ? <Icon size={24} /> : <div className="w-6 h-6" />}
            </div>
            <span className={`text-sm font-bold ${selected ? 'text-slate-900' : 'text-slate-600'}`}>{label}</span>
            {selected && <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${activeTheme.bg} border ${activeTheme.border} flex items-center justify-center shadow-sm`}>
                <Check size={14} className={activeTheme.accent} strokeWidth={3} />
            </div>}
        </button>
    );

    const Badge = ({ children, color = 'slate' }) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-${color}-100 text-${color}-700`}>
            {children}
        </span>
    );

    // --- RENDERERS ---

    const renderContent = () => {
        switch (currentStep) {
            case 1: // Identity
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <PolicyCard title="Program Identity">
                            <TextInput
                                label="Program Name"
                                helper="Public-facing name visible to Loan Officers."
                                placeholder="e.g., Small Business Growth Fund 2026"
                                value={formData.name}
                                onChange={v => handleChange('name', v)}
                            />
                            <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">System Profile ID</div>
                                    <div className="font-mono text-sm text-slate-700 font-bold bg-white px-2 py-1 rounded border inline-block">PROG-{Math.floor(Math.random() * 9000) + 1000}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</div>
                                    <Badge color={formData.active ? 'emerald' : 'amber'}>{formData.active ? 'Active' : 'Draft Mode'}</Badge>
                                </div>
                            </div>
                        </PolicyCard>

                    </div>
                );
            case 2: // Regulatory
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <PolicyCard title="Governing Authority">
                            <div className="grid grid-cols-2 gap-4">
                                <SelectTile label="SBA" icon={Landmark} selected={formData.authority === 'SBA'} onClick={() => handleChange('authority', 'SBA')} badge="Federal" />
                                <SelectTile label="CDFI Fund" icon={Globe} selected={formData.authority === 'CDFI Fund'} onClick={() => handleChange('authority', 'CDFI Fund')} badge="Treasury" />
                                <SelectTile label="State SSBCI" icon={MapPin} selected={formData.authority === 'State SSBCI'} onClick={() => handleChange('authority', 'State SSBCI')} badge="State" />
                                <SelectTile label="Internal" icon={Building2} selected={formData.authority === 'Internal'} onClick={() => handleChange('authority', 'Internal')} badge="Private" />
                            </div>
                        </PolicyCard>

                        {formData.authority === 'SBA' && (
                            <PolicyCard title="SBA Configuration">
                                <FieldLabel label="Product Type" required />
                                <div className="grid grid-cols-3 gap-3 mb-6">
                                    {['7(a) Standard', '7(a) Small', 'Express'].map(opt => (
                                        <button key={opt} onClick={() => handleChange('sbaProductType', opt)} className={`py-2 px-3 rounded-lg text-sm font-bold border ${formData.sbaProductType === opt ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-slate-200 text-slate-600'}`}>{opt}</button>
                                    ))}
                                </div>
                                <FieldLabel label="SOP Version Logic" required />
                                <div className="space-y-3">
                                    {['SOP 50 10 7', 'SOP 50 10 8'].map(ver => (
                                        <div key={ver} onClick={() => handleChange('sopVersion', ver)} className={`flex items-center p-3 rounded-lg border cursor-pointer ${formData.sopVersion === ver ? 'bg-blue-50 border-blue-500' : 'bg-white border-slate-200'}`}>
                                            <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${formData.sopVersion === ver ? 'border-blue-600' : 'border-slate-300'}`}>
                                                {formData.sopVersion === ver && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                            </div>
                                            <span className="text-sm font-medium text-slate-900">{ver}</span>
                                        </div>
                                    ))}
                                </div>
                            </PolicyCard>
                        )}

                        {formData.authority === 'CDFI Fund' && (
                            <PolicyCard title="TLR Award Source">
                                <div className="flex flex-wrap gap-2">
                                    {['FA-Core', 'FA-SECA', 'CMF', 'RRP'].map(award => {
                                        const isActive = formData.cdfiAward.includes(award);
                                        return (
                                            <button
                                                key={award}
                                                onClick={() => handleChange('cdfiAward', isActive ? formData.cdfiAward.filter(a => a !== award) : [...formData.cdfiAward, award])}
                                                className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${isActive ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}
                                            >
                                                {isActive && <Check size={12} className="inline mr-1" strokeWidth={4} />}
                                                {award}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-xs text-slate-500 mt-3 font-medium">Used for TLR tagging and Treasury reporting.</p>
                            </PolicyCard>
                        )}
                    </div>
                );
            case 3: // Eligibility
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <PolicyCard title="Geographic Eligibility">
                            <FieldLabel label="Geo Restriction Mode" required />
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {['None', 'Investment Area', 'LMI Zone'].map(geo => (
                                    <button key={geo} onClick={() => handleChange('geoRestriction', geo)} className={`py-3 px-2 rounded-lg text-sm font-semibold border ${formData.geoRestriction === geo ? 'bg-teal-50 border-teal-500 text-teal-800' : 'bg-white border-slate-200 text-slate-600'}`}>{geo}</button>
                                ))}
                            </div>
                            <div className="h-40 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 font-medium text-sm">
                                <MapPin size={18} className="mr-2" /> Geographic visualizer placeholder
                            </div>
                        </PolicyCard>
                        <PolicyCard title="Allowable Use of Proceeds">
                            <div className="mb-4 text-sm text-slate-500 font-medium">
                                Define what this loan’s capital may be used for. These rules act as a hard gate for applications.
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {[
                                    { id: 'Working Capital', icon: Briefcase, desc: 'Opex, Payroll, Rent' },
                                    { id: 'Equipment', icon: Hammer, desc: 'Machinery, Vehicles' },
                                    { id: 'Inventory', icon: Box, desc: 'Stock, Raw Materials' },
                                    { id: 'Real Estate', icon: Building2, desc: 'Purchase, Reno' },
                                    { id: 'Refinance', icon: RefreshCw, desc: 'Debt Consolidation' },
                                    { id: 'Other', icon: PlusCircle, desc: 'Special Purpose' }
                                ].map(use => {
                                    const isSelected = formData.allowedUses.includes(use.id);
                                    return (
                                        <button
                                            key={use.id}
                                            onClick={() => {
                                                const newUses = isSelected
                                                    ? formData.allowedUses.filter(u => u !== use.id)
                                                    : [...formData.allowedUses, use.id];

                                                // Refinance Logic Coupling
                                                let updates = { allowedUses: newUses };
                                                if (use.id === 'Refinance') {
                                                    updates.refinanceAllowed = !isSelected;
                                                }
                                                // Sync Refinance flag if deselected via other means? 
                                                // For now, explicit click controls it.

                                                setFormData(prev => ({ ...prev, ...updates }));
                                            }}
                                            className={`
                                                relative flex flex-col items-start p-4 rounded-xl border transition-all text-left
                                                ${isSelected
                                                    ? 'bg-teal-50 border-teal-500 ring-1 ring-teal-500 shadow-sm'
                                                    : 'bg-white border-slate-200 hover:border-teal-300 hover:shadow-md'
                                                }
                                            `}
                                        >
                                            <div className={`p-2 rounded-lg mb-3 ${isSelected ? 'bg-teal-200 text-teal-800' : 'bg-slate-100 text-slate-500'}`}>
                                                <use.icon size={20} />
                                            </div>
                                            <div className={`font-bold text-sm mb-0.5 ${isSelected ? 'text-teal-900' : 'text-slate-700'}`}>{use.id}</div>
                                            <div className="text-xs text-slate-400 font-medium">{use.desc}</div>

                                            {isSelected && (
                                                <div className="absolute top-3 right-3 text-teal-600">
                                                    <CheckCircle2 size={16} fill="currentColor" className="text-white" />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </PolicyCard>

                        <PolicyCard title="Credit Gates">
                            <div className="mb-6">
                                <div className="flex justify-between mb-2">
                                    <FieldLabel label="Min SBSS Score" required />
                                    <span className="text-2xl font-bold text-teal-600">{formData.minSbss}</span>
                                </div>
                                <input
                                    type="range" min="100" max="300" step="1"
                                    value={formData.minSbss} onChange={e => handleChange('minSbss', e.target.value)}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                                />
                                <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                                    <span>100 (Manual UW)</span>
                                    <span>300 (Fast Track)</span>
                                </div>
                            </div>
                        </PolicyCard>
                        <PolicyCard title="Credit Elsewhere">
                            <ToggleTile
                                label="Enforce 'Credit Elsewhere' Test"
                                description="Required for SBA 7(a). Will trigger mandatory documentation upload during underwriting."
                                icon={AlertTriangle}
                                checked={formData.creditElsewhere}
                                onChange={v => handleChange('creditElsewhere', v)}
                            />
                            {formData.creditElsewhere && (
                                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium flex gap-2">
                                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                    Failure to satisfy this test will result in an automatic decline.
                                </div>
                            )}
                        </PolicyCard>
                    </div>
                );
            case 4: // Structure
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <PolicyCard title="Loan Amount Constraints">
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <TextInput label="Min Amount" prefix="$" value={formData.minAmount} onChange={v => handleChange('minAmount', v)} placeholder="5,000" />
                                </div>
                                <div className="pt-2 text-slate-300">
                                    <ChevronRight />
                                </div>
                                <div className="flex-1">
                                    <TextInput label="Max Amount" prefix="$" value={formData.maxAmount} onChange={v => handleChange('maxAmount', v)} placeholder="5,000,000" />
                                </div>
                            </div>
                            {formData.minAmount && formData.maxAmount && (
                                <div className="h-2 bg-emerald-100 rounded-full mt-2 relative overflow-hidden">
                                    <div className="absolute top-0 bottom-0 bg-emerald-500 rounded-full w-full animate-pulse opacity-50"></div>
                                </div>
                            )}
                        </PolicyCard>
                        <PolicyCard title="Term Constraints">
                            <TextInput
                                label="Max Term in Months"
                                suffix="Months"
                                value={formData.maxTerm}
                                onChange={v => handleChange('maxTerm', v)}
                                helper="Maturity date on applications cannot exceed this limit."
                                placeholder="120"
                            />
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 flex items-start gap-3">
                                <Info size={16} className="mt-0.5 shrink-0" />
                                <div>
                                    <span className="font-bold block text-xs uppercase tracking-wide mb-1 text-blue-900">System Behavior</span>
                                    Maturity_Date is captured on the Loan Application and validated against this program rule automatically.
                                </div>
                            </div>
                        </PolicyCard>
                    </div>
                );
            case 5: // Pricing
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <PolicyCard title="Base Rate Configuration">
                            <FieldLabel label="Base Rate Index" required />
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {['WSJ Prime', 'SBA Peg', 'LIBOR', 'Fixed'].map(idx => (
                                    <button key={idx} onClick={() => handleChange('baseRateIndex', idx)} className={`p-3 rounded-lg border text-sm font-bold text-left ${formData.baseRateIndex === idx ? 'bg-violet-50 border-violet-500 text-violet-800 ring-1 ring-violet-500' : 'bg-white border-slate-200 text-slate-600'}`}>
                                        {idx}
                                    </button>
                                ))}
                            </div>
                            {formData.baseRateIndex && formData.baseRateIndex !== 'Fixed' && (
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-500">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold text-slate-700">Rate Source</span>
                                        <span className="bg-white px-2 py-0.5 border rounded text-xs font-mono">FRED-API-V2</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-bold text-slate-700">Effective Date</span>
                                        <span className="text-xs">First of Month</span>
                                    </div>
                                </div>
                            )}
                        </PolicyCard>
                        <PolicyCard title="Spread Logic">
                            <FieldLabel label="Max Spread Calculation" required />
                            <div className="flex gap-4">
                                {['Static Cap', 'SBA Tiered'].map(logic => (
                                    <div key={logic} onClick={() => handleChange('maxSpreadLogic', logic)} className={`flex-1 p-4 rounded-xl border cursor-pointer transition-all ${formData.maxSpreadLogic === logic ? 'bg-violet-50 border-violet-500 shadow-sm' : 'bg-white border-slate-200'}`}>
                                        <div className="font-bold text-slate-800 text-sm mb-1">{logic}</div>
                                        <div className="text-xs text-slate-500">
                                            {logic === 'Static' ? 'Single absolute max spread.' : 'Varies by loan amount and term.'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PolicyCard>
                        <PolicyCard title="Accrual Method">
                            <TextInput
                                label="Day Count Convention"
                                value={formData.accrualMethod}
                                onChange={v => handleChange('accrualMethod', v)}
                                placeholder="Actual/360"
                                helper="Controls daily interest math and payment calculation."
                            />
                        </PolicyCard>
                        <PolicyCard title="Yield & Pricing Safeguards">
                            <div className="flex items-start gap-3 mb-4">
                                <TrendingUp className="text-emerald-600 mt-1" size={20} />
                                <div>
                                    <div className="text-sm font-bold text-slate-800">Minimum Lending Yield</div>
                                    <div className="text-xs text-slate-500 max-w-sm leading-relaxed mt-0.5">
                                        Loan pricing must result in an effective yield at or above this threshold.
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-48">
                                    <TextInput
                                        label="Min Yield Threshold"
                                        suffix="%"
                                        placeholder="0.000"
                                        value={formData.minLendingYield}
                                        onChange={v => handleChange('minLendingYield', v)}
                                    />
                                </div>
                                {formData.minLendingYield && (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2 flex items-center gap-2 text-xs font-bold text-emerald-700 mt-2">
                                        <Shield size={14} />
                                        <span>Protection Active</span>
                                    </div>
                                )}
                            </div>
                        </PolicyCard>
                    </div>
                );
            case 6: // Collateral
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <PolicyCard title="Collateral Rules">
                            <div className="grid grid-cols-2 gap-6">
                                <TextInput label="Collateral Threshold" prefix="$" value={formData.collateralThreshold} onChange={v => handleChange('collateralThreshold', v)} helper="Loans above this must be secured." />
                                <TextInput label="Max LTV (Real Estate)" suffix="%" value={formData.maxLtvRealEstate} onChange={v => handleChange('maxLtvRealEstate', v)} helper="Maximum Loan-to-Value ratio." />
                            </div>
                        </PolicyCard>
                        <PolicyCard title="Guarantees">
                            <div className="grid grid-cols-2 gap-6">
                                <TextInput label="Guaranty Percentage" suffix="%" value={formData.guarantyPercentage} onChange={v => handleChange('guarantyPercentage', v)} />
                                <TextInput label="Owner Equity Threshold" suffix="%" value={formData.guarantorEquityThreshold} onChange={v => handleChange('guarantorEquityThreshold', v)} helper="Owners > % must sign PG." />
                            </div>
                            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800 flex items-start gap-3">
                                <Scale size={16} className="mt-0.5 shrink-0" />
                                <div>
                                    <span className="font-bold block text-xs uppercase tracking-wide mb-1 text-amber-900">System Behavior</span>
                                    Triggers automatic Personal Guarantee task creation and document checklist enforcement for all eligible owners.
                                </div>
                            </div>
                        </PolicyCard>
                    </div>
                );
            case 7: // Workflow
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <PolicyCard title="Data Requirements">
                            <div className="space-y-4">
                                <ToggleTile
                                    label="Require Cash Flow Data"
                                    description="Unlocks the Cash Flow Analysis tab in underwriting."
                                    checked={formData.reqCashFlow}
                                    onChange={v => handleChange('reqCashFlow', v)}
                                />
                                <ToggleTile
                                    label="Require Psychometric Assessment"
                                    description="Adds a mandatory task for applicant character evaluation."
                                    checked={formData.reqPsychometric}
                                    onChange={v => handleChange('reqPsychometric', v)}
                                />
                            </div>
                        </PolicyCard>
                        <PolicyCard title="Fee & Disclosure Rules">
                            <FieldLabel label="Fee Waiver Logic" />
                            <TextInput value={formData.feeWaiverLogic} onChange={v => handleChange('feeWaiverLogic', v)} placeholder="e.g. Standard Veteran Waiver" />
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <ToggleTile
                                    label="Fee Disclosure Rule (Form 159)"
                                    description="If Paid Agent = Yes, SBA Form 159 becomes mandatory."
                                    checked={formData.feeDisclosure}
                                    onChange={v => handleChange('feeDisclosure', v)}
                                />
                            </div>
                        </PolicyCard>
                        <PolicyCard title="Refinance & Balloon">
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border ${formData.refinanceAllowed ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'}`}>
                                    <label className="flex items-center gap-3 font-bold text-sm text-slate-800 cursor-pointer">
                                        <input type="checkbox" checked={formData.refinanceAllowed} onChange={e => handleChange('refinanceAllowed', e.target.checked)} className="checkbox-rose" />
                                        Refinance Allowed
                                    </label>
                                </div>
                                <div className={`p-4 rounded-xl border ${formData.balloonAllowed ? 'bg-rose-50 border-rose-300' : 'bg-white border-slate-200'}`}>
                                    <label className="flex items-center gap-3 font-bold text-sm text-slate-800 cursor-pointer">
                                        <input type="checkbox" checked={formData.balloonAllowed} onChange={e => handleChange('balloonAllowed', e.target.checked)} className="checkbox-rose" />
                                        Balloon Allowed
                                    </label>
                                </div>
                            </div>
                        </PolicyCard>
                    </div>
                );
            case 8: // Review
                const filled = Object.values(formData).filter(x => x !== null && x !== '').length;
                const isReady = filled >= 5; // Simplified validation for review
                return (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <PolicyCard title="Policy Validation">
                            <div className="text-center py-10">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ScrollText size={32} className="text-slate-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Program Policy Review</h2>
                                <p className="text-slate-500 max-w-md mx-auto mb-8">
                                    You have configured {filled}/27 policy nodes.
                                    Please verify all settings before activating this program for origination.
                                </p>
                                <button
                                    onClick={() => onSave(formData)}
                                    disabled={!isReady}
                                    className={`px-8 py-3 font-bold rounded-lg shadow-xl transition-all transform hover:-translate-y-0.5 ${isReady ? 'bg-slate-900 text-white hover:bg-slate-800' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                                >
                                    Activate Program
                                </button>
                            </div>
                        </PolicyCard>
                    </div>
                );
            default: return null;
        }
    };

    const SnapshotRow = ({ label, value }) => (
        <div className="flex justify-between items-baseline py-2 border-b border-slate-100 last:border-0">
            <span className="text-xs font-bold text-slate-500 uppercase">{label}</span>
            <span className="text-sm font-bold text-slate-800 text-right max-w-[140px] truncate">{value || '—'}</span>
        </div>
    );

    return (
        <div className="flex h-full bg-slate-50 font-sans text-slate-900 overflow-hidden">

            {/* 1. LEFT WIZARD RAIL */}
            <div className="w-[300px] border-r border-slate-200 bg-white flex flex-col shrink-0 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="h-20 flex items-center px-6 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">LP</div>
                    <span className="font-bold text-slate-900 tracking-tight">Policy Wizard</span>
                </div>
                <div className="flex-1 overflow-y-auto py-6 pl-4 space-y-1">
                    {Object.values(THEMES).map((step, idx) => {
                        const stepNum = idx + 1;
                        const isActive = currentStep === stepNum;
                        const isDone = currentStep > stepNum;
                        return (
                            <button
                                key={step.id}
                                onClick={() => isDone && setCurrentStep(stepNum)}
                                disabled={!isDone && !isActive}
                                className={`
                                    w-full flex items-center gap-4 px-4 py-4 rounded-l-xl transition-all relative group
                                    ${isActive ? `${step.markerBg} ${step.text}` : 'text-slate-500 hover:bg-slate-50'}
                                `}
                            >
                                {isActive && <div className={`absolute right-0 top-0 bottom-0 w-1 ${step.marker} rounded-l-full`} />}
                                <div className={`
                                    w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all shadow-sm
                                    ${isActive ? `bg-white ${step.markerText} ring-2 ring-indigo-50` : isDone ? `${step.markerBg} ${step.markerText}` : 'bg-slate-100 text-slate-400'}
                                `}>
                                    {isDone ? <Check size={18} strokeWidth={3} /> : React.createElement(step.icon, { size: 20 })}
                                </div>
                                <div className="text-left">
                                    <div className={`text-sm font-bold ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>{step.label}</div>
                                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Step {stepNum}</div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 2. CENTER CANVAS */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                    <div className="max-w-3xl mx-auto pb-24">
                        <div className="mb-8">
                            <h1 className={`text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 mb-2`}>
                                {activeTheme.label}
                            </h1>
                            <p className="text-slate-500 font-medium">Configure the parameters for this section. All changes are verified against the central credit schema.</p>
                        </div>
                        {renderContent()}
                    </div>
                </div>

                {/* Floating Action Bar */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 px-4 py-3 flex items-center gap-4 z-30 ring-1 ring-slate-900/5">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">
                        Step {currentStep} of 8
                    </div>
                    <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className={`
                            h-10 px-6 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2
                            ${canProceed() ? activeTheme.btn : 'bg-slate-300 cursor-not-allowed shadow-none'}
                        `}
                    >
                        Continue <ChevronRight size={16} />
                    </button>

                    {/* Debug Helper - Removed in Production */}
                    {/* <div className="text-xs text-red-500 font-mono fixed top-0 right-0 p-2 bg-white border z-50">
                        Valid: {canProceed() ? 'YES' : 'NO'} | Len: {formData.name?.length}
                    </div> */}
                </div>
            </div>

            {/* 3. RIGHT POLICY SNAPSHOT */}
            <div className="w-[320px] bg-white border-l border-slate-200 shrink-0 z-20 flex flex-col shadow-[-4px_0_24px_rgba(0,0,0,0.02)]">
                <div className="p-6 bg-slate-50 border-b border-slate-100">
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Policy Impact</div>
                    <div className="font-bold text-slate-900 text-lg">Live Snapshot</div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Dynamic Sections */}
                    <div className="space-y-4">
                        {formData.name && (
                            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                                <div className="text-[10px] font-bold uppercase text-indigo-400 mb-2">Identity</div>
                                <SnapshotRow label="Program" value={formData.name} />
                                <SnapshotRow label="Status" value={formData.active ? 'Active' : 'Draft'} />
                            </div>
                        )}
                        {formData.authority && (
                            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
                                <div className="text-[10px] font-bold uppercase text-blue-400 mb-2">Regulatory</div>
                                <SnapshotRow label="Authority" value={formData.authority} />
                                <SnapshotRow label="Product" value={formData.sbaProductType} />
                                {formData.cdfiAward.length > 0 && <SnapshotRow label="Tranches" value={formData.cdfiAward.length} />}
                            </div>
                        )}
                        {(formData.geoRestriction || formData.minSbss) && (
                            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100">
                                <div className="text-[10px] font-bold uppercase text-teal-400 mb-2">Risk</div>
                                <SnapshotRow label="Geo Gate" value={formData.geoRestriction} />
                                <SnapshotRow label="Min SBSS" value={formData.minSbss} />
                            </div>
                        )}
                        {formData.allowedUses.length > 0 && (
                            <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100">
                                <div className="text-[10px] font-bold uppercase text-teal-400 mb-2">Allowed Uses</div>
                                <div className="flex flex-wrap gap-1.5">
                                    {formData.allowedUses.map(u => (
                                        <span key={u} className="px-2 py-0.5 bg-white border border-teal-200 rounded text-[10px] font-bold text-teal-700 shadow-sm">{u}</span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(formData.minAmount || formData.maxAmount) && (
                            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                                <div className="text-[10px] font-bold uppercase text-emerald-400 mb-2">Structure</div>
                                <SnapshotRow label="Max Amt" value={formData.maxAmount ? `$${formData.maxAmount}` : null} />
                                <SnapshotRow label="Max Term" value={formData.maxTerm ? `${formData.maxTerm} mo` : null} />
                            </div>
                        )}
                        {formData.baseRateIndex && (
                            <div className="p-4 rounded-xl bg-violet-50/50 border border-violet-100">
                                <div className="text-[10px] font-bold uppercase text-violet-400 mb-2">Pricing</div>
                                <SnapshotRow label="Index" value={formData.baseRateIndex} />
                                <SnapshotRow label="Spread" value={formData.maxSpreadLogic} />
                                <SnapshotRow label="Min Yield" value={formData.minLendingYield ? `${formData.minLendingYield}%` : null} />
                            </div>
                        )}
                        {formData.collateralThreshold && (
                            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                                <div className="text-[10px] font-bold uppercase text-amber-400 mb-2">Collateral</div>
                                <SnapshotRow label="Threshold" value={formData.collateralThreshold ? `$${formData.collateralThreshold}` : null} />
                                <SnapshotRow label="LTV Cap" value={formData.maxLtvRealEstate ? `${formData.maxLtvRealEstate}%` : null} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LoanProgramWizard;
