import React, { useState } from 'react';
import {
    Building2, MapPin, Globe, Phone, Mail,
    ShieldCheck, TriangleAlert, FileText,
    History, Users, ChevronRight,
    Pen, EllipsisVertical, Plus, Briefcase,
    DollarSign, Landmark, Flag, CircleCheck,
    StickyNote, ArrowLeft
} from 'lucide-react';
import AccountLeadsTab from './AccountLeadsTab';
import AccountLoansTab from './AccountLoansTab';
import AccountContactsTab from './AccountContactsTab';
import AccountFinancialsTab from './AccountFinancialsTab'; // [NEW] Financials

import AccountDocumentsTab from './AccountDocumentsTab';
import AccountActivitiesTab from './AccountActivitiesTab';
import AccountTATab from './AccountTATab';
import AccountAuditTab from './AccountAuditTab';
import NotesTab from '../Shared/NotesTab';
import AccountEditDrawer from './AccountEditDrawer';

const AccountDetail = ({ onBack, initialAccount }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

    // Default Mock Data
    const defaultAccount = {
        name: 'Jenkins Catering Services, LLC',
        dba: 'Jenkins Catering',
        type: 'LLC',
        status: 'Active',
        taxId: '**-***4592',
        established: '2018-03-15',
        yearsInBusiness: 5,
        isStartup: false,
        naics: '722320',
        naicsSector: 'Caterers',
        isLowIncome: true,
        censusTract: '261635',
        lat: '42.3314',
        long: '-83.0458',
        address: {
            street: '123 Main St, Suite 400',
            city: 'Detroit',
            state: 'MI',
            zip: '48226'
        },
        phone: '(313) 555-0123',
        email: 'billing@jenkinscatering.com',
        website: 'www.jenkinscatering.com',
        revenue: '$850,000',
        bankName: 'Chase Bank',
        accountNumber: '****8892',
        routingNumber: '*****2211',
        jobs: 12,
        flags: ['Minority-Owned', 'Woman-Owned'],
        isTaClient: true,
        prevBorrower: false
    };

    // Initialize state with prop or default
    const [account, setAccount] = useState(() => {
        if (initialAccount) {
            return {
                ...defaultAccount,
                ...initialAccount,
                // Ensure name/dba map correctly if simplistic data passed
                name: initialAccount.name || defaultAccount.name,
                dba: initialAccount.dba || initialAccount.name || defaultAccount.dba
            };
        }
        return defaultAccount;
    });

    // Update if prop changes (e.g. re-navigation)
    React.useEffect(() => {
        if (initialAccount) {
            setAccount(prev => ({
                ...prev,
                ...initialAccount,
                name: initialAccount.name || prev.name,
                dba: initialAccount.dba || initialAccount.name || prev.dba
            }));
        }
    }, [initialAccount]);

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'leads', label: 'Leads' },
        { id: 'financials', label: 'Financials' }, // [NEW]
        { id: 'loans', label: 'Loans' },
        { id: 'contacts', label: 'Contacts' },
        { id: 'documents', label: 'Documents' },
        { id: 'activities', label: 'Activities' },
        { id: 'ta', label: 'Technical Assistance' },
        { id: 'audit', label: 'Audit History' },
        { id: 'notes', label: 'Notes' }
    ];

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
            {/* 1. Sticky Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shrink-0">
                {/* Breadcrumb / Back */}
                <div className="px-6 py-2 border-b border-slate-50 flex items-center gap-2">
                    <button onClick={onBack} className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors">
                        <ArrowLeft size={12} /> Back
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="text-xs text-slate-400">Accounts</span>
                    <span className="text-slate-300">/</span>
                    <span className="text-xs text-slate-600 font-medium">{account.name}</span>
                </div>

                <div className="px-6 py-4 flex justify-between items-start">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {account.name}
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                                    {account.type}
                                </span>
                            </h1>
                            <div className="text-sm text-slate-500 font-medium mt-1 mb-2">DBA: {account.dba}</div>
                            <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                    {account.status}
                                </span>
                                {account.isLowIncome && (
                                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1">
                                        <MapPin size={10} /> LIC Qualified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
                            <StickyNote size={16} /> Add Note
                        </button>

                        <button
                            onClick={() => setIsEditDrawerOpen(true)}
                            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors"
                        >
                            <Pen size={16} /> Edit Account
                        </button>
                        <div className="w-px h-8 bg-slate-200 mx-1"></div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                            <EllipsisVertical size={20} />
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="px-6 flex gap-6 overflow-x-auto no-scrollbar">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* 2. Main Content (Scrollable) */}
            <main className="flex-1 overflow-y-auto p-6">
                {activeTab === 'overview' && (
                    <div className="max-w-[1600px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-6">

                        {/* Left Column (Main Info) */}
                        <div className="xl:col-span-8 space-y-6">

                            {/* Business Info Card */}
                            <SectionCard title="Business Information" icon={Building2}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Legal Name" value={account.name} />
                                    <Field label="DBA Name" value={account.dba} />
                                    <Field label="Entity Type" value={account.type} />
                                    <Field label="Tax ID (EIN)" value={account.taxId} isMasked />
                                    <Field label="Date Established" value={account.established} />
                                    <Field label="Years in Business" value={`${account.yearsInBusiness} Years`} />
                                    <Field label="Startup?" value={account.isStartup ? 'Yes' : 'No'} />
                                </div>
                            </SectionCard>

                            {/* Industry & Market */}
                            <SectionCard title="Industry & Market" icon={Briefcase}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="NAICS Code" value={account.naics} />
                                    <Field label="Industry Sector" value={account.naicsSector} />
                                    <Field label="Target Market LIC" value={account.isLowIncome ? 'Yes' : 'No'} />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Census Tract</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-slate-800">{account.censusTract}</span>
                                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px] font-bold border border-emerald-200">Eligible</span>
                                        </div>
                                    </div>
                                    <Field label="Latitude" value={account.lat} />
                                    <Field label="Longitude" value={account.long} />
                                </div>
                            </SectionCard>

                            {/* Location & Contact */}
                            <SectionCard title="Location & Contact" icon={MapPin}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Field label="Business Address" value={`${account.address.street}, ${account.address.city}, ${account.address.state} ${account.address.zip}`} />
                                    </div>
                                    <Field label="Business Phone" value={account.phone} />
                                    <Field label="Business Email" value={account.email} isLink />
                                    <Field label="Website" value={account.website} isLink />
                                </div>
                            </SectionCard>

                            {/* Financial Snapshot */}
                            <SectionCard title="Financial Snapshot" icon={DollarSign}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field label="Annual Revenue" value={account.revenue} />
                                    <Field label="Jobs (FTE)" value={account.jobs} />
                                    <div className="md:col-span-2 pt-4 border-t border-slate-100 mt-2">
                                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Banking Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <Field label="Bank Name" value={account.bankName} />
                                            <Field label="Account Number" value={account.accountNumber} isMasked />
                                            <Field label="Routing Number" value={account.routingNumber} isMasked />
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>

                        </div>

                        {/* Right Column (Sidebar Context) */}
                        <div className="xl:col-span-4 space-y-6">

                            {/* Ownership & Impact */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <Flag size={18} className="text-purple-600" />
                                    Impact & Ownership
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {account.flags.map(flag => (
                                        <span key={flag} className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                            {flag}
                                        </span>
                                    ))}
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                        Low Income Community
                                    </span>
                                </div>
                            </div>

                            {/* Relationship Summary */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <Users size={18} className="text-blue-600" />
                                    Relationship
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                        <span className="text-sm text-slate-500">Active TA Client</span>
                                        {account.isTaClient ? (
                                            <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-700">
                                                <CircleCheck size={14} /> Yes
                                            </span>
                                        ) : (
                                            <span className="text-sm font-medium text-slate-700">No</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                        <span className="text-sm text-slate-500">Prior Borrower</span>
                                        <span className="text-sm font-medium text-slate-700">No</span>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">Referral Source</span>
                                        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                            <div className="text-sm font-bold text-slate-800">Detroit Econ Club</div>
                                            <div className="text-xs text-slate-500">Ref: Sarah Smith (Director)</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activity Mini-Feed */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
                                    <History size={18} className="text-slate-400" />
                                    Recent Activity
                                </h3>
                                <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                                    <ActivityItem type="note" text="Added note about expansion plans" time="2h ago" />
                                    <ActivityItem type="edit" text="Updated Annual Revenue" time="Yesterday" />
                                    <ActivityItem type="system" text="Account Created from Lead" time="Nov 15" />
                                </div>
                                <button className="w-full mt-4 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 py-2 rounded transition-colors">
                                    View All History
                                </button>
                            </div>

                        </div>

                    </div>
                )}

                {activeTab === 'leads' && (
                    <AccountLeadsTab />
                )}

                {/* [NEW] Financials Tab */}
                {activeTab === 'financials' && (
                    <AccountFinancialsTab />
                )}

                {activeTab === 'loans' && (
                    <AccountLoansTab
                        onViewLoan={(id) => console.log('View Loan', id)}
                        onNavigateToLeads={() => setActiveTab('leads')}
                    />
                )}

                {activeTab === 'contacts' && (
                    <AccountContactsTab
                        onAddContact={() => console.log('Add Contact')}
                        onViewContact={(id) => console.log('View Contact', id)}
                    />
                )}

                {activeTab === 'documents' && (
                    <AccountDocumentsTab />
                )}

                {activeTab === 'activities' && (
                    <AccountActivitiesTab
                        onViewLoan={(id) => {
                            console.log('Navigating to Loan:', id);
                            setActiveTab('loans');
                        }}
                        onViewDocument={(id) => {
                            console.log('Navigating to Document:', id);
                            setActiveTab('documents');
                        }}
                        onViewTask={(id) => {
                            console.log('Navigating to Task:', id);
                            alert(`Simulated Navigation: Opening Task ${id}`);
                        }}
                        onViewLead={(id) => {
                            console.log('Navigating to Lead:', id);
                            setActiveTab('leads');
                        }}
                        onViewTA={(id) => {
                            console.log('Navigating to Technical Assistance:', id);
                            setActiveTab('ta');
                        }}
                    />
                )}

                {activeTab === 'ta' && (
                    <AccountTATab />
                )}

                {activeTab === 'audit' && (
                    <AccountAuditTab />
                )}

                {activeTab === 'notes' && (
                    <NotesTab context="Account" entityId="ACC-12345" showAddButton={false} />
                )}

            </main>

            {/* Edit Drawer */}
            <AccountEditDrawer
                isOpen={isEditDrawerOpen}
                onClose={() => setIsEditDrawerOpen(false)}
                account={account}
                onSave={(updatedData) => {
                    console.log('Account Updated:', updatedData);
                    setAccount(prev => ({ ...prev, ...updatedData }));
                    setIsEditDrawerOpen(false);
                }}
            />
        </div>
    );
};

// Helper Components
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

const Field = ({ label, value, isMasked, isLink }) => (
    <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</span>
        {isMasked ? (
            <div className="flex items-center gap-2 group">
                <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{value}</span>
                <span className="text-[10px] text-blue-600 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">Show</span>
            </div>
        ) : isLink ? (
            <a href="#" className="text-sm font-medium text-blue-600 hover:underline truncate">{value}</a>
        ) : (
            <span className="text-sm font-medium text-slate-800 truncate">{value}</span>
        )}
    </div>
);

const ActivityItem = ({ type, text, time }) => (
    <div className="relative">
        <div className={`absolute -left-[21px] top-1.5 w-3 h-3 rounded-full border-2 bg-white ${type === 'note' ? 'border-amber-400' : type === 'edit' ? 'border-blue-400' : 'border-slate-300'}`}></div>
        <div className="text-xs font-medium text-slate-800">{text}</div>
        <div className="text-[10px] text-slate-400">{time}</div>
    </div>
);

export default AccountDetail;
