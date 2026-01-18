import React, { useState } from 'react';
import {
    User, Mail, Phone, Calendar, MapPin,
    ShieldCheck, Crown, BadgeCheck, ArrowLeft,
    Building2, Users, AlertTriangle, Save, X,
    ChevronRight, ExternalLink, Lock, Pen, Briefcase,
    MoreVertical, History, Trash2, Ban, Wallet, FileText, Activity, StickyNote
} from 'lucide-react';
import ContactFormDrawer from './ContactFormDrawer';
import PersonalFinancialIntelligence from './PersonalFinancialIntelligence';
// import ContactFinancialsTab from './Tabs/ContactFinancialsTab'; // [REPLACED]

// --- Sub-Component: Contact Overview (Original Content) ---
const ContactOverview = ({ contact, isBorrower, otherContacts, onEditCurrent, handleCreateContact, handleEditOther, handlePromoteToPrimary, setSelectedId }) => {
    // Helper Row Components
    const DetailRow = ({ label, value, sensitive }) => (
        <div className="flex flex-col gap-1">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                {label}
                {sensitive && <Lock size={10} className="text-amber-500" />}
            </div>
            <div className={`text-sm font-medium text-slate-800 ${sensitive ? 'blur-[2px] hover:blur-none transition-all cursor-pointer select-none' : ''}`}>
                {value || <span className="text-slate-300 italic">Not Provided</span>}
            </div>
        </div>
    );

    const Section = ({ title, icon: Icon, children, locked }) => (
        <div className="bg-white rounded-xl border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden mb-6">
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Icon size={16} className="text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest">{title}</h3>
                </div>
                {locked && <Lock size={14} className="text-slate-300" />}
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    return (
        <div className="max-w-[1600px] mx-auto grid grid-cols-12 gap-8 animate-in fade-in duration-300">
            {/* LEFT COLUMN: CARDS (8 Columns) */}
            <div className="col-span-12 xl:col-span-8 space-y-2">
                {/* 1. Contact Info */}
                <Section title="Contact Information" icon={User}>
                    <div className="grid grid-cols-2 gap-x-16 gap-y-2">
                        <DetailRow label="Phone" value={contact.phone} />
                        <DetailRow label="Email" value={contact.email} />
                        <DetailRow label="Preferred Method" value={contact.preferredMethod} />
                        <DetailRow label="Home Address" value={contact.homeAddress ? '**** (Masked)' : 'Not Provided'} sensitive />
                    </div>
                </Section>

                {/* 2. Relationship */}
                <Section title="Account Relationship" icon={Building2}>
                    <div className="grid grid-cols-2 gap-x-16 gap-y-2">
                        <DetailRow label="Role" value={contact.title} />
                        {isBorrower && <DetailRow label="Ownership %" value={`${contact.ownershipPercentage || 0}%`} />}
                        {isBorrower && <DetailRow label="Industry Experience" value={`${contact.yearsIndustry} yrs`} />}
                        {isBorrower && <DetailRow label="Ownership Experience" value={`${contact.yearsOwnership} yrs`} />}
                    </div>
                </Section>

                {/* 3. Compliance */}
                {isBorrower && (
                    <Section title="Demographics & Compliance (Section 1071)" icon={ShieldCheck} locked>
                        <div className="grid grid-cols-2 gap-x-16 gap-y-2">
                            <DetailRow label="Race" value={contact.race?.join(', ')} />
                            <DetailRow label="Ethnicity" value={contact.ethnicity?.join(', ')} />
                            <DetailRow label="Gender" value={contact.gender} />
                            <DetailRow label="Veteran Status" value={contact.veteran} />
                            <div className="col-span-2 pt-2 mt-2 border-t border-slate-50 grid grid-cols-2 gap-x-16">
                                <DetailRow label="Credit Score" value={contact.creditScore} sensitive />
                                <DetailRow label="Income Range" value={contact.income} sensitive />
                            </div>
                        </div>
                    </Section>
                )}

                {isBorrower && contact.otherBusinessOwnership && (
                    <Section title="Other Business Interests" icon={Briefcase}>
                        <div className="grid grid-cols-1 gap-y-2">
                            <DetailRow label="Ownership in other entities" value={`${contact.otherBusPercentage_owner1}%`} />
                            <div className="mt-2 text-sm text-slate-600 bg-slate-50 p-3 rounded border border-slate-100">
                                <span className="text-xs font-bold text-slate-400 block mb-1 uppercase">Description</span>
                                {contact.otherBusDescription_owner1}
                            </div>
                        </div>
                    </Section>
                )}
            </div>

            {/* RIGHT COLUMN: SIDEBAR (4 Columns) */}
            <div className="col-span-12 xl:col-span-4 pl-4 border-l border-slate-200/60">
                <div className="sticky top-6">
                    <div className="flex items-center justify-between mb-4 px-1">
                        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                            Other Contacts
                        </h3>
                        <button
                            onClick={handleCreateContact}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wide flex items-center gap-1"
                        >
                            <Users size={14} /> Add New
                        </button>
                    </div>

                    <div className="space-y-3">
                        {otherContacts.map(oc => (
                            <div
                                key={oc.id}
                                onClick={() => setSelectedId(oc.id)}
                                className="group p-4 bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 rounded-xl shadow-sm transition-all cursor-pointer relative"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs font-bold group-hover:bg-white group-hover:text-blue-600 transition-colors overflow-hidden">
                                            {oc.avatar ? (
                                                <img src={oc.avatar} alt={oc.firstName} className="w-full h-full object-cover" />
                                            ) : (
                                                <>{oc.firstName?.[0]}{oc.lastName?.[0]}</>
                                            )}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                                {oc.firstName} {oc.lastName}
                                            </div>
                                            <div className="text-xs text-slate-500 group-hover:text-blue-500/80">
                                                {oc.title}
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-slate-500">
                                        {oc.recordType}
                                    </span>
                                    {oc.ownershipPercentage > 0 && (
                                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-amber-50 border border-amber-100 rounded text-amber-700">
                                            {oc.ownershipPercentage}% Own
                                        </span>
                                    )}
                                </div>

                                {/* Inline Actions (Show on Hover) */}
                                <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleEditOther(oc); }}
                                        className="p-1.5 bg-white border border-slate-200 rounded shadow-sm hover:text-blue-600 text-slate-400"
                                        title="Edit"
                                    >
                                        <Pen size={12} />
                                    </button>
                                    {!oc.isPrimaryContact && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handlePromoteToPrimary(oc.id); }}
                                            className="p-1.5 bg-white border border-slate-200 rounded shadow-sm hover:text-blue-600 text-slate-400"
                                            title="Promote to Primary"
                                        >
                                            <BadgeCheck size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {otherContacts.length === 0 && (
                            <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                                <Users size={24} className="mx-auto text-slate-300 mb-2" />
                                <p className="text-sm text-slate-500">No other contacts on this account.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


const ContactDetail = ({ onBack, initialContactName }) => {
    // --- Mock Data ---
    const initialContacts = [
        {
            id: 'C-101',
            recordType: 'Owner',
            status: 'Active',
            firstName: 'Sarah',
            lastName: 'Jenkins',
            title: 'Owner / CEO',
            email: 'sarah@jenkinscatering.com',
            phone: '(313) 555-0123',
            preferredMethod: 'Email',
            ownershipPercentage: 50,
            yearsIndustry: 12,
            yearsOwnership: 5,
            isPrimaryOwner: true,
            isPrimaryContact: true,
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
            // Other Business
            otherBusinessOwnership: true,
            otherBusPercentage_owner1: 45,
            otherBusDescription_owner1: '50% owner in ABC Logistics LLC (freight transport)',
            // Demographics
            race: ['White'],
            ethnicity: ['Not Hispanic or Latino'],
            gender: 'Female',
            veteran: 'Non-Veteran',
            disability: 'No',
            income: '$100k-$150k',
            creditScore: '720',
            dob: '1985-04-12',
            ssn: '***-**-1234',
            monthlyHousingPayment: 2400.00,
            homeAddress: '123 Maple Dr, Detroit, MI 48201',
            demographicSource: 'Applicant Provided',
            lmiHouseholdStatus: 'Middle',

            creditReportDate: '2023-11-15',
            creditScoreRange: '640-740',
            creditPullConsentTimestamp: '2023-01-15T10:00:00',
            portalUser: true,
            createdDate: '2023-01-15T10:00:00',
            createdBy: 'System Admin',
            lastModifiedDate: '2023-11-20T14:30:00',
            lastModifiedBy: 'Sarah Miller'
        },
        {
            id: 'C-102',
            firstName: 'Mike',
            lastName: 'Jenkins',
            name: 'Mike Jenkins',
            status: 'Active',
            title: 'Co-Founder / VP Sales',
            recordType: 'Partner / Referral Agent',
            role: 'Partner',
            ownershipPercentage: 40,
            isPrimaryOwner: false,
            isPrimaryContact: false,
            email: 'mike@jenkinscatering.com',
            phone: '(313) 555-0199',
            preferredMethod: 'Phone',
            homeAddress: '456 Oak Lane, Portland OR',
            yearsIndustry: 8,
            yearsOwnership: 5,
            race: ['White'],
            ethnicity: ['Not Hispanic or Latino'],
            gender: 'Male',
            veteran: 'Veteran',
            creditScore: '710',
            income: '$80k-$100k',
            dob: '1982-11-05',
            ssn: '***-**-5678',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150'
        },
        {
            id: 'C-103',
            firstName: 'Lisa',
            lastName: 'Ray',
            name: 'Lisa Ray',
            status: 'Active',
            title: 'Office Manager',
            recordType: 'Board / Committee Member',
            role: 'Board Member',
            ownershipPercentage: 0,
            isPrimaryOwner: false,
            isPrimaryContact: false,
            email: 'lisa.ray@email.com',
            phone: '(503) 555-9000',
            preferredMethod: 'Email',
            homeAddress: '789 Pine St, Portland OR',
            yearsIndustry: 15,
            yearsOwnership: 0,
            race: ['Asian'],
            ethnicity: ['Not Hispanic or Latino'],
            gender: 'Female',
            veteran: 'Non-Veteran',
            creditScore: '750',
            income: '$60k-$80k',
            dob: '1978-03-22',
            ssn: '***-**-9012',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150'
        },
        {
            id: 'C-104',
            firstName: 'James',
            lastName: 'Carter',
            name: 'James Carter',
            status: 'Inactive',
            title: 'Angel Investor',
            recordType: 'Investor / Donor',
            role: 'Investor',
            ownershipPercentage: 10,
            isPrimaryOwner: false,
            isPrimaryContact: false,
            email: 'jcarter@capital.com',
            phone: '(212) 555-0000',
            preferredMethod: 'Email',
            homeAddress: '100 Wall St, NY NY',
            yearsIndustry: 20,
            yearsOwnership: 15,
            race: ['Black or African American'],
            ethnicity: ['Not Hispanic or Latino'],
            gender: 'Male',
            veteran: 'Non-Veteran',
            creditScore: '800',
            income: '$200k+',
            dob: '1970-07-15',
            ssn: '***-**-3456',
            avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150'
        },
        {
            id: 'C-105',
            firstName: 'QuickFix',
            lastName: 'IT',
            name: 'QuickFix IT',
            status: 'Active',
            title: 'Vendor Rep',
            recordType: 'Vendor',
            role: 'Vendor',
            ownershipPercentage: 0,
            isPrimaryOwner: false,
            isPrimaryContact: false,
            email: 'support@quickfix.com',
            phone: '(800) 555-HELP',
            preferredMethod: 'Text',
            homeAddress: '123 Tech Blvd, Austin TX',
            yearsIndustry: 5,
            yearsOwnership: 0,
            race: [],
            ethnicity: [],
            gender: 'Prefer not to say',
            veteran: 'Prefer not to say',
            creditScore: '',
            income: '',
            dob: '',
            ssn: ''
        },
    ];

    // --- State ---
    const [allContacts, setAllContacts] = useState(initialContacts);
    const [activeTab, setActiveTab] = useState('overview'); // overview | financials | documents | activities | audit | notes

    // Determine initial ID based on prop name match, or default to C-101
    const getInitialId = () => {
        if (initialContactName) {
            const match = initialContacts.find(c =>
                `${c.firstName} ${c.lastName}` === initialContactName ||
                c.name === initialContactName
            );
            if (match) return match.id;
        }
        return 'C-101';
    };

    const [selectedId, setSelectedId] = useState(getInitialId());
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
    const [drawerData, setDrawerData] = useState(null);
    const [drawerMode, setDrawerMode] = useState('create'); // 'create' | 'edit'

    // Derived State
    const contact = allContacts.find(c => c.id === selectedId) || allContacts[0];

    // Safety check for rendering
    if (!contact) return <div className="p-8 text-center text-slate-500">Contact not found</div>;

    const otherContacts = allContacts.filter(c => c.id !== contact.id); // Safe filter
    const currentPrimary = allContacts.find(c => c.isPrimaryContact);
    const currentPrimaryName = currentPrimary ? `${currentPrimary.firstName} ${currentPrimary.lastName}` : '';
    const contactCount = allContacts.length;

    // --- Logic ---
    const isBorrower = contact.recordType === 'Owner';
    const canHaveFinancials = ['Owner', 'Guarantor', 'Co-Signer', 'Investor / Donor'].includes(contact.recordType); // Including Investor/Donor for James Carter case

    const handleCreateContact = () => {
        setDrawerData(null); // Empty for new
        setDrawerMode('create');
        setIsEditDrawerOpen(true);
    };

    const handleEditCurrent = () => {
        setDrawerData(contact);
        setDrawerMode('edit');
        setIsEditDrawerOpen(true);
    };

    const handleEditOther = (other) => {
        setDrawerData(other);
        setDrawerMode('edit');
        setIsEditDrawerOpen(true);
    };

    const handleSaveContact = (formData) => {
        // 1. Handle Primary Reassignment
        let updatedContacts = [...allContacts];

        if (formData.isPrimaryContact) {
            // If new contact is primary, demote existing primary
            updatedContacts = updatedContacts.map(c =>
                (c.id !== formData.id && c.isPrimaryContact)
                    ? { ...c, isPrimaryContact: false }
                    : c
            );
        }

        // 2. Save Data
        if (drawerMode === 'create') {
            const newContact = {
                ...formData,
                id: `C-${100 + allContacts.length + 1}`,
                // If first contact, force primary
                isPrimaryContact: contactCount === 0 || formData.isPrimaryContact
            };
            updatedContacts.push(newContact);
            setSelectedId(newContact.id); // Switch view to new contact
        } else {
            // Edit
            updatedContacts = updatedContacts.map(c =>
                c.id === formData.id ? { ...c, ...formData } : c
            );
        }

        setAllContacts(updatedContacts);
        setIsEditDrawerOpen(false);
    };

    // --- Actions ---
    const handlePromoteToPrimary = (targetId) => {
        if (window.confirm("Are you sure? This will remove the Primary status from the current primary contact.")) {
            const updated = allContacts.map(c => ({
                ...c,
                isPrimaryContact: c.id === targetId
            }));
            setAllContacts(updated);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm flex flex-col">
                <div className="px-8 py-5 flex justify-between items-start">
                    <div>
                        <button onClick={onBack} className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 mb-3 transition-colors">
                            <ArrowLeft size={12} /> Back to Account
                        </button>
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-100 to-indigo-50 border-2 border-white shadow-sm flex items-center justify-center text-blue-700 font-bold text-xl overflow-hidden shrink-0">
                                {contact.avatar ? (
                                    <img src={contact.avatar} alt={contact.firstName} className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        {contact.firstName?.[0]}{contact.lastName?.[0]}
                                    </>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                                        {contact.firstName} {contact.lastName}
                                    </h1>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide
                                        ${contact.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                        {contact.status}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-500 flex items-center gap-2 mt-1 font-medium">
                                    {contact.title} <span className="text-slate-300">|</span> {contact.recordType}
                                </div>
                                <div className="flex gap-2 mt-2.5">
                                    {contact.isPrimaryOwner && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1"><Crown size={10} /> Owner</span>}
                                    {contact.isPrimaryContact && <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1"><BadgeCheck size={10} /> Primary Contact</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleEditCurrent}
                            className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 active:bg-slate-100 rounded-lg shadow-sm flex items-center gap-2 transition-all"
                        >
                            <Pen size={14} /> Edit {contact.firstName}
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <MoreVertical size={20} />
                        </button>
                    </div>
                </div>





                {/* --- Tabs Navigation --- */}
                <div className="flex items-center gap-6 px-8 mt-1 border-t border-slate-100">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'overview' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-200'}`}
                    >
                        <User size={16} /> Overview
                    </button>

                    {/* Financial Intelligence Tab (Conditional) */}
                    {canHaveFinancials && (
                        <button
                            onClick={() => setActiveTab('financials')}
                            className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'financials' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-200'}`}
                        >
                            <Wallet size={16} /> Financial Intelligence
                        </button>
                    )}

                    {/* Other Tabs */}
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'documents' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-200'}`}
                    >
                        <FileText size={16} /> Documents
                    </button>
                    <button
                        onClick={() => setActiveTab('activities')}
                        className={`py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'activities' ? 'text-blue-600 border-blue-600' : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-200'}`}
                    >
                        <Activity size={16} /> Activities
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                <div className="max-w-[1600px] mx-auto">
                    {activeTab === 'overview' && (
                        <ContactOverview
                            contact={contact}
                            isBorrower={isBorrower}
                            otherContacts={otherContacts}
                            onEditCurrent={handleEditCurrent}
                            handleCreateContact={handleCreateContact}
                            handleEditOther={handleEditOther}
                            handlePromoteToPrimary={handlePromoteToPrimary}
                            setSelectedId={setSelectedId}
                        />
                    )}

                    {activeTab === 'financials' && canHaveFinancials && (
                        // [NEW] Personal Financial Intelligence
                        <PersonalFinancialIntelligence contactId={contact.id} />
                    )}

                    {!['overview', 'financials'].includes(activeTab) && (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                            <ConstructionIcon size={48} className="mb-4 text-slate-300" />
                            <h3 className="text-lg font-bold text-slate-500 mb-1">Coming Soon</h3>
                            <p className="text-sm">The {activeTab} view is under construction.</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Drawer */}
            <ContactFormDrawer
                isOpen={isEditDrawerOpen}
                onClose={() => setIsEditDrawerOpen(false)}
                initialData={drawerData}
                onSave={handleSaveContact}
                currentPrimaryName={currentPrimaryName}
                isFirstContact={contactCount === 0}
                contactCount={contactCount}
            />
        </div>
    );
};

// Simple placeholder icon for empty states
const ConstructionIcon = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="6" width="20" height="8" rx="1" />
        <path d="M17 14v7" />
        <path d="M7 14v7" />
        <path d="M17 3v3" />
        <path d="M7 3v3" />
        <path d="M10 14 2.3 6.3" />
        <path d="M14 6l7.7 7.7" />
        <path d="M8 6l8 8" />
    </svg>
);

export default ContactDetail;
