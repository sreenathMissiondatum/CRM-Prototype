import React, { useState, useEffect } from 'react';
import {
    User,
    Building2,
    Target,
    ArrowRight,
    Search,
    Check,
    AlertCircle,
    Briefcase,
    Users,
    MapPin,
    Calendar,
    DollarSign,
    Heart,
    Share2,
    ShieldCheck
} from 'lucide-react';

const CreateLead = ({ onNavigate }) => {
    // -------------------------------------------------------------------------
    // STATE MANAGEMENT
    // -------------------------------------------------------------------------
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Section 1: Business
        business: {
            name: '',
            dba: '',
            entityType: 'LLC',
            ein: '',
            naics: '',
            naicsSector: '',
            establishedDate: '',
            address: { street: '', city: '', state: '', zip: '' },
            phone: '',
            email: '',
            isStartup: false,
            revenue: '',
            isNew: true // vs Linked
        },
        // Section 2: Contact
        contact: {
            firstName: '',
            lastName: '',
            role: 'Owner',
            phone: '',
            email: '',
            race: '',
            ethnicity: '',
            gender: '',
            veteranStatus: '',
            isNew: true // vs Linked
        },
        // Section 3: Loan Intent
        lead: {
            amount: '',
            purpose: 'Working Capital',
            purposeDetail: '',
            useOfFunds: '',
            urgency: 'Medium',
            isTAClient: false,
            needsTA: false
        },
        // Section 4: Impact
        impact: {
            minorityOwned: false,
            womanOwned: false,
            veteranOwned: false,
            nativeOwned: false,
            lgbtqOwned: false,
            disabilityOwned: false,
            jobsCreated: 0,
            jobsRetained: 0,
            missionCategory: 'Small Business'
        },
        // Section 5: Referral
        referral: {
            sourceType: 'Outreach',
            sourceName: '',
            partnerOrg: '',
            outcome: 'Pending'
        },
        // Section 6: Consent
        consent: {
            dataCollection: false,
            demographics: false,
            contactString: new Date().toISOString()
        }
    });

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------
    const updateForm = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = () => {
        console.log("Submitting Lead Payload:", formData);
        // In a real app, this would call an API
        onNavigate('leads'); // Return to list
    };

    // -------------------------------------------------------------------------
    // MOCK SEARCH (Section 1 & 2)
    // -------------------------------------------------------------------------
    const handleBusinessSearch = (query) => {
        // Mocking a search result
        if (query.toLowerCase().includes('bakery')) {
            setFormData(prev => ({
                ...prev,
                business: {
                    ...prev.business,
                    name: 'Main St Bakery',
                    entityType: 'LLC',
                    address: { street: '123 Main St', city: 'Portland', state: 'OR', zip: '97204' },
                    isNew: false
                }
            }));
        }
    };

    // -------------------------------------------------------------------------
    // RENDER HELPERS
    // -------------------------------------------------------------------------
    const SectionHeader = ({ icon: Icon, title, description }) => (
        <div className="flex items-start gap-3 mb-6 border-b border-slate-100 pb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Icon size={24} />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-800">{title}</h2>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
        </div>
    );

    const steps = [
        { id: 1, label: 'Business' },
        { id: 2, label: 'Contact' },
        { id: 3, label: 'Intent' },
        { id: 4, label: 'Impact' },
        { id: 5, label: 'Referral' },
        { id: 6, label: 'Consent' }
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 animate-in fade-in duration-300">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate('leads')} className="text-slate-400 hover:text-slate-600">Back</button>
                    <h1 className="text-xl font-bold text-slate-800">New Intake / Lead</h1>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg font-medium text-sm transition-colors">
                        Save Draft
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!formData.consent.dataCollection}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Create Lead
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Stepper */}
                <div className="w-64 bg-white border-r border-slate-200 p-6 flex-col gap-6 hidden md:flex shrink-0">
                    <div className="space-y-1">
                        {steps.map((s, idx) => (
                            <button
                                key={s.id}
                                onClick={() => setStep(s.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-between
                                    ${step === s.id ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}
                                `}
                            >
                                <span>{s.id}. {s.label}</span>
                                {step > s.id && <Check size={14} className="text-green-500" />}
                            </button>
                        ))}
                    </div>

                    <div className="mt-auto bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h4 className="text-xs font-bold text-blue-800 uppercase mb-2">CDFI Note</h4>
                        <p className="text-xs text-blue-700 leading-relaxed">
                            Leads represent <strong>intent</strong>. Do not create a Loan record until basic eligibility is verified.
                        </p>
                    </div>
                </div>

                {/* Main Form Content */}
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl shadow-sm p-8 min-h-[600px]">

                        {/* SECTION 1: BUSINESS */}
                        {step === 1 && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <SectionHeader icon={Building2} title="Business Identification" description="Search for an existing business or create a new profile." />

                                <div className="space-y-6">
                                    {/* Search Box */}
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Search Existing Entities</label>
                                        <div className="flex gap-2">
                                            <div className="relative flex-1">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    placeholder="Search by Name or EIN..."
                                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    onChange={(e) => handleBusinessSearch(e.target.value)}
                                                />
                                            </div>
                                            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50">Search</button>
                                        </div>
                                        {!formData.business.isNew && (
                                            <div className="mt-3 p-3 bg-green-50 border border-green-100 rounded text-sm text-green-800 flex items-center justify-between">
                                                <span>✓ Found & Linked: <strong>{formData.business.name}</strong></span>
                                                <button
                                                    onClick={() => setFormData(prev => ({ ...prev, business: { ...prev.business, isNew: true, name: '' } }))}
                                                    className="text-xs underline hover:text-green-900"
                                                >
                                                    Clear & Create New
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Legal Business Name</label>
                                            <input
                                                type="text"
                                                value={formData.business.name}
                                                onChange={e => updateForm('business', 'name', e.target.value)}
                                                disabled={!formData.business.isNew}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-slate-50 disabled:text-slate-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Entity Type</label>
                                            <select
                                                value={formData.business.entityType}
                                                onChange={e => updateForm('business', 'entityType', e.target.value)}
                                                disabled={!formData.business.isNew}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg disabled:bg-slate-50"
                                            >
                                                <option>LLC</option>
                                                <option>Corporation</option>
                                                <option>Sole Proprietorship</option>
                                                <option>Nonprofit</option>
                                                <option>Partnership</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">EIN (Optional)</label>
                                            <input
                                                type="text"
                                                placeholder="XX-XXXXXXX"
                                                value={formData.business.ein}
                                                onChange={e => updateForm('business', 'ein', e.target.value)}
                                                disabled={!formData.business.isNew}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg disabled:bg-slate-50"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                                            <input
                                                type="text"
                                                placeholder="Street Address"
                                                value={formData.business.address.street}
                                                onChange={e => setFormData(prev => ({ ...prev, business: { ...prev.business, address: { ...prev.business.address, street: e.target.value } } }))}
                                                disabled={!formData.business.isNew}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg mb-2 disabled:bg-slate-50"
                                            />
                                            <div className="grid grid-cols-3 gap-2">
                                                <input
                                                    type="text" placeholder="City"
                                                    value={formData.business.address.city}
                                                    onChange={e => setFormData(prev => ({ ...prev, business: { ...prev.business, address: { ...prev.business.address, city: e.target.value } } }))}
                                                    disabled={!formData.business.isNew}
                                                    className="px-3 py-2 border border-slate-200 rounded-lg disabled:bg-slate-50"
                                                />
                                                <input
                                                    type="text" placeholder="State"
                                                    value={formData.business.address.state}
                                                    onChange={e => setFormData(prev => ({ ...prev, business: { ...prev.business, address: { ...prev.business.address, state: e.target.value } } }))}
                                                    disabled={!formData.business.isNew}
                                                    className="px-3 py-2 border border-slate-200 rounded-lg disabled:bg-slate-50"
                                                />
                                                <input
                                                    type="text" placeholder="ZIP"
                                                    value={formData.business.address.zip}
                                                    onChange={e => setFormData(prev => ({ ...prev, business: { ...prev.business, address: { ...prev.business.address, zip: e.target.value } } }))}
                                                    disabled={!formData.business.isNew}
                                                    className="px-3 py-2 border border-slate-200 rounded-lg disabled:bg-slate-50"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-2 mt-2 p-3 bg-blue-50/50 rounded border border-blue-100 flex justify-between items-center">
                                            <div>
                                                <span className="text-xs font-bold text-slate-500 uppercase">Auto-Derived Data</span>
                                                <div className="text-sm font-medium text-slate-700">Census Tract: 41051001100 (Low Income)</div>
                                            </div>
                                            <MapPin size={18} className="text-blue-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION 2: CONTACT */}
                        {step === 2 && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <SectionHeader icon={User} title="Primary Contact" description="Who is the main point of contact?" />
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Search Contacts</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input type="text" placeholder="Search by Name or Email..." className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                                            <input
                                                type="text"
                                                value={formData.contact.firstName}
                                                onChange={e => updateForm('contact', 'firstName', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                                            <input
                                                type="text"
                                                value={formData.contact.lastName}
                                                onChange={e => updateForm('contact', 'lastName', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                                            <select
                                                value={formData.contact.role}
                                                onChange={e => updateForm('contact', 'role', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                            >
                                                <option>Owner</option>
                                                <option>Applicant</option>
                                                <option>Manager</option>
                                                <option>Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                                            <input
                                                type="email"
                                                value={formData.contact.email}
                                                onChange={e => updateForm('contact', 'email', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Demographics / Impact Data */}
                                    <div className="border-t border-slate-100 pt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <Heart size={16} className="text-pink-500" />
                                            <h3 className="text-sm font-bold text-slate-800">Demographic Information (Optional)</h3>
                                        </div>
                                        <div className="bg-amber-50 p-3 rounded text-xs text-amber-800 mb-4">
                                            Impact data is voluntary. Ensure you have obtained verbal consent before asking.
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Race</label>
                                                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white">
                                                    <option value="">Select...</option>
                                                    <option>Black or African American</option>
                                                    <option>Asian</option>
                                                    <option>White</option>
                                                    <option>American Indian / Alaska Native</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Ethnicity</label>
                                                <select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white">
                                                    <option value="">Select...</option>
                                                    <option>Hispanic or Latino</option>
                                                    <option>Not Hispanic or Latino</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION 3: INTENT */}
                        {step === 3 && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <SectionHeader icon={Target} title="Loan Request & Intent" description="What are they looking to achieve?" />

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Request Amount (Est.)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                            <input
                                                type="number"
                                                value={formData.lead.amount}
                                                onChange={e => updateForm('lead', 'amount', e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-lg font-bold text-slate-800"
                                                placeholder="0.00"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Primary Purpose</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {['Working Capital', 'Equipment Purchase', 'Real Estate Acquisition', 'Debt Refinance', 'Leasehold Improvement', 'Startup Costs'].map(p => (
                                                <button
                                                    key={p}
                                                    onClick={() => updateForm('lead', 'purpose', p)}
                                                    className={`px-3 py-2 rounded-lg text-sm border transition-all text-left ${formData.lead.purpose === p ? 'bg-blue-50 border-blue-200 text-blue-700 font-bold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Detail / Use of Funds</label>
                                        <textarea
                                            rows={4}
                                            value={formData.lead.useOfFunds}
                                            onChange={e => updateForm('lead', 'useOfFunds', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                            placeholder="Describe specifically how the funds will be used..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Urgency</label>
                                            <select
                                                value={formData.lead.urgency}
                                                onChange={e => updateForm('lead', 'urgency', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                            >
                                                <option>High (Immediate)</option>
                                                <option>Medium (1-3 Months)</option>
                                                <option>Low (&gt; 3 Months)</option>
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-3 pt-6">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.lead.needsTA}
                                                    onChange={e => updateForm('lead', 'needsTA', e.target.checked)}
                                                    className="rounded text-blue-600 focus:ring-blue-500"
                                                />
                                                <span className="text-sm font-medium text-slate-700">Requires Technical Assistance?</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION 4: IMPACT */}
                        {step === 4 && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <SectionHeader icon={Users} title="Impact & Mission" description="Mission alignment factors." />

                                <div className="space-y-6">
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                        <h4 className="font-bold text-purple-900 text-sm mb-3">Ownership Demographics</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                            {[
                                                { id: 'minorityOwned', label: 'Minority-Owned' },
                                                { id: 'womanOwned', label: 'Woman-Owned' },
                                                { id: 'veteranOwned', label: 'Veteran-Owned' },
                                                { id: 'nativeOwned', label: 'Native American-Owned' },
                                                { id: 'lgbtqOwned', label: 'LGBTQ-Owned' },
                                                { id: 'disabilityOwned', label: 'Disability-Owned' },
                                            ].map(opt => (
                                                <label key={opt.id} className="flex items-center gap-2 cursor-pointer p-2 hover:bg-white/50 rounded transition-colors">
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.impact[opt.id]}
                                                        onChange={e => setFormData(prev => ({ ...prev, impact: { ...prev.impact, [opt.id]: e.target.checked } }))}
                                                        className="rounded text-purple-600 focus:ring-purple-500"
                                                    />
                                                    <span className="text-slate-700 font-medium">{opt.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="bg-white p-4 border border-slate-200 rounded-lg">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Jobs to be Created</label>
                                            <input
                                                type="number"
                                                value={formData.impact.jobsCreated}
                                                onChange={e => setFormData(prev => ({ ...prev, impact: { ...prev.impact, jobsCreated: parseInt(e.target.value) } }))}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Full-time equivalent (FTE)</p>
                                        </div>
                                        <div className="bg-white p-4 border border-slate-200 rounded-lg">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Jobs Retained</label>
                                            <input
                                                type="number"
                                                value={formData.impact.jobsRetained}
                                                onChange={e => setFormData(prev => ({ ...prev, impact: { ...prev.impact, jobsRetained: parseInt(e.target.value) } }))}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                            />
                                            <p className="text-xs text-slate-500 mt-1">Full-time equivalent (FTE)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION 5: REFERRAL */}
                        {step === 5 && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <SectionHeader icon={Share2} title="Referral Source" description="How did they find us?" />

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Source Type</label>
                                        <select
                                            value={formData.referral.sourceType}
                                            onChange={e => setFormData(prev => ({ ...prev, referral: { ...prev.referral, sourceType: e.target.value } }))}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        >
                                            <option>Outreach / Event</option>
                                            <option>Partner Referral</option>
                                            <option>Web Inbound</option>
                                            <option>Existing Client</option>
                                        </select>
                                    </div>
                                    {formData.referral.sourceType === 'Partner Referral' && (
                                        <div className="animate-in fade-in slide-in-from-top-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Partner Organization</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. SBDC, Chamber of Commerce"
                                                value={formData.referral.partnerOrg}
                                                onChange={e => setFormData(prev => ({ ...prev, referral: { ...prev.referral, partnerOrg: e.target.value } }))}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg mb-4"
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Source Details (Name/Event)</label>
                                        <input
                                            type="text"
                                            value={formData.referral.sourceName}
                                            onChange={e => setFormData(prev => ({ ...prev, referral: { ...prev.referral, sourceName: e.target.value } }))}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* SECTION 6: CONSENT */}
                        {step === 6 && (
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <SectionHeader icon={ShieldCheck} title="Consent & Compliance" description="Impact reporting requires consent." />

                                <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-6">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                                            checked={formData.consent.dataCollection}
                                            onChange={e => setFormData(prev => ({ ...prev, consent: { ...prev.consent, dataCollection: e.target.checked } }))}
                                        />
                                        <div>
                                            <span className="font-bold text-slate-800 text-sm">Consent to Collect Data</span>
                                            <p className="text-xs text-slate-500 mt-1">
                                                I confirm the applicant has consented to the storage and processing of their business and personal information for the purpose of loan inquiry.
                                            </p>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="mt-1 rounded text-blue-600 focus:ring-blue-500"
                                            checked={formData.consent.demographics}
                                            onChange={e => setFormData(prev => ({ ...prev, consent: { ...prev.consent, demographics: e.target.checked } }))}
                                        />
                                        <div>
                                            <span className="font-bold text-slate-800 text-sm">Demographic Consent (Optional)</span>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Applicant agrees to provide demographic data for impact reporting purposes. They understand this is voluntary and does not affect the decision.
                                            </p>
                                        </div>
                                    </label>

                                    <div className="pt-4 border-t border-slate-200 text-xs text-slate-400">
                                        Consent captured at {new Date(formData.consent.contactString).toLocaleString()} by {'Current User'}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between">
                            <button
                                onClick={handleBack}
                                disabled={step === 1}
                                className="px-4 py-2 text-slate-600 hover:text-slate-800 disabled:opacity-50 font-medium text-sm transition-colors"
                            >
                                Back
                            </button>
                            {step < 6 ? (
                                <button
                                    onClick={handleNext}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2"
                                >
                                    Continue <ArrowRight size={16} />
                                </button>
                            ) : null}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CreateLead;
