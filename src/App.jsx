import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoanCard from './components/LoanCard';
import LeadCard from './components/LeadCard';
import { TaskEngineWidget, NotificationsWidget } from './components/Widgets';
import LoanAnalytics from './components/LoanAnalytics';
import LoansLayout from './components/Loans/LoansLayout';
import LeadsLayout from './components/Leads/LeadsLayout';
import CreateLead from './components/Leads/CreateLead';
import AccountDetail from './components/Accounts/AccountDetail';
import ContactDetail from './components/Contacts/ContactDetail';
import LoanProgramsList from './components/LoanPrograms/LoanProgramsList';
import LoanProgramsListMVP from './components/Loans/LoanPrograms/LoanProgramMVP/LoanProgramsListMVP';
import AccountsList from './components/Accounts/AccountsList';
import Account360 from './components/Accounts/Account360';
import AdminPanel from './components/Admin/AdminPanel';
import UserProfile from './components/User/UserProfile';
import MarketingDashboard from './components/Marketing/MarketingDashboard';
import TemplatesList from './components/Marketing/Templates/TemplatesList';
import TemplateUpload from './components/Marketing/Templates/TemplateUpload';
import TemplateEditor from './components/Marketing/Templates/TemplateEditor';
import RecipientPreview from './components/Marketing/Templates/RecipientPreview';
import CampaignWizard from './components/Marketing/Campaigns/CampaignWizard';
import { Plus, LayoutGrid, BarChart3 } from 'lucide-react';

function App() {
  console.log('App Rendering (Full Restoration)');
  const [activeTab, setActiveTabOriginal] = useState('dashboard');
  const [previousTab, setPreviousTab] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [userRole, setUserRole] = useState('ORG_ADMIN');
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [selectedLoanDetail, setSelectedLoanDetail] = useState(null);
  const [selectedLoanId, setSelectedLoanId] = useState(null);

  const setActiveTab = (tab) => {
    if (tab === 'account-detail' || tab === 'contact-detail') {
      setPreviousTab(activeTab);
    }
    if (tab.startsWith('loans')) {
      setSelectedLoanDetail(null);
    }
    setActiveTabOriginal(tab);
  };

  const handleBackFromDetail = () => {
    if (previousTab && previousTab.startsWith('loans')) {
      setActiveTabOriginal(previousTab);
    } else if (selectedLeadId && previousTab && previousTab.startsWith('leads')) {
      setActiveTabOriginal(previousTab);
    } else {
      setActiveTabOriginal('dashboard');
    }
  };

  const handleViewAccount = (accountData) => {
    setSelectedAccount(accountData);
    setActiveTab('account-detail');
  };

  const handleViewContact = (contactData) => {
    setSelectedAccount(contactData);
    setActiveTab('contact-detail');
  };

  const [activeLoansView, setActiveLoansView] = useState('grid');

  // --- Current User State ---
  const [currentUser, setCurrentUser] = useState({
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@acmelending.com',
    phone: '(555) 123-4567',
    altEmail: 'alex@gmail.com',
    jobTitle: 'Loan Officer',
    role: 'Loan Officer',
    department: 'Enterprise Team',
    status: 'Active',
    location: 'New York, NY',
    timezone: 'UTC-5 (EST)',
    locale: 'en-US',
    profilePhotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200',
    permissions: ['Loan Origination', 'CRM Access']
  });

  const handleUpdateProfile = (updatedFields) => {
    // Basic audit log simulation
    console.log('Updating profile:', updatedFields);
    setCurrentUser(prev => ({ ...prev, ...updatedFields }));
  };

  const handleSwitchUser = (demoUser) => {
    console.log(`[AUDIT] Switched user context to: ${demoUser.firstName} ${demoUser.lastName} (${demoUser.role})`);
    setCurrentUser(prev => ({
      ...prev,
      ...demoUser,
      // In a real app we'd fetch the full profile, for demo we mix in the demoUser props
      profilePhotoUrl: demoUser.profilePhotoUrl || null
    }));
  };



  const [leadFilters, setLeadFilters] = useState({
    ownership: 'Any User',
    stages: [],
    sources: [],
    activity: 'Any Time',
    businessName: '',
    minLoan: '',
    maxLoan: '',
    risk: 'All'
  });



  const [loans, setLoans] = useState([
    {
      id: 'LN-2023-005',
      applicantName: 'Jenkins Catering Services, LLC',
      industry: 'Retail Trade',
      purpose: 'Inventory Expansion',
      amount: '$85,000',
      status: 'Underwriting',
      progress: 30,
      stageName: 'Docs In Review',
      currentStep: 2,
      totalSteps: 5,
      insights: { hasWarning: false, blockers: [], lastActivity: 'Borrower uploaded tax returns (1h ago)', quickActions: ['Review Docs'] },
      steps: [{ id: 1, text: 'Review 2022 Tax Returns', due: 'Today', urgency: 'high', completed: false }],
      notifications: []
    },
    {
      id: 'LN-2023-001',
      applicantName: 'TechStart Systems',
      industry: 'Software & Technology',
      purpose: 'Working Capital',
      amount: '$250,000',
      status: 'Underwriting',
      progress: 65,
      stageName: 'Financial Review',
      currentStep: 3,
      totalSteps: 5,
      insights: { hasWarning: true, blockers: ['Missing Q4 Tax Returns', 'SLA Risk: 2 days overdue'], lastActivity: 'Borrower uploaded partial docs (2h ago)', quickActions: ['Request Tax Docs', 'Escalate to Manager'] },
      steps: [{ id: 1, text: 'Review TechStart financials', due: 'Today', urgency: 'high', completed: false }, { id: 2, text: 'Schedule site visit', due: 'Tomorrow', urgency: 'medium', completed: false }],
      notifications: [{ id: 1, text: "New document uploaded: Tax Returns", time: "10m ago", type: 'info' }, { id: 2, text: "Credit score updated", time: "2h ago", type: 'warning' }]
    },
    {
      id: 'LN-2023-002',
      applicantName: 'Anderson Logistics',
      industry: 'Transportation',
      purpose: 'Equipment Purchase',
      amount: '$150,000',
      status: 'Active',
      progress: 100,
      stageName: 'Funded',
      currentStep: 5,
      totalSteps: 5,
      insights: { hasWarning: false, blockers: [], lastActivity: 'Funds disbursed to client account (1d ago)', quickActions: ['Send Welcome Kit', 'Schedule Check-in'] },
      steps: [{ id: 1, text: 'Verify insurance renewal', due: 'Dec 15', urgency: 'low', completed: false }],
      notifications: [{ id: 1, text: "Payment received", time: "1d ago", type: 'info' }]
    },
    {
      id: 'LN-2023-003',
      applicantName: 'GreenEarth Co.',
      amount: '$75,000',
      status: 'Pending',
      progress: 10,
      stageName: 'Application',
      currentStep: 1,
      totalSteps: 5,
      insights: { hasWarning: true, blockers: ['Application signature pending'], lastActivity: 'Application sent to borrower (3d ago)', quickActions: ['Resend Link', 'Call Borrower'] },
      steps: [{ id: 1, text: 'Await signed application', due: 'Pending', urgency: 'high', completed: false }],
      notifications: []
    },
    {
      id: 'LN-2023-004',
      applicantName: 'Starlight Retail',
      amount: '$120,000',
      status: 'Review',
      progress: 45,
      stageName: 'Risk Assessment',
      currentStep: 2,
      totalSteps: 5,
      insights: { hasWarning: true, blockers: ['Inventory valuation discrepancy'], lastActivity: 'Analyst requested clarification (30m ago)', quickActions: ['Review Valuation', 'Message Analyst'] },
      steps: [{ id: 1, text: 'Analysis of Q3 sales', due: 'Friday', urgency: 'medium', completed: false }, { id: 2, text: 'Manager approval needed', due: 'Today', urgency: 'high', completed: false }],
      notifications: [{ id: 1, text: "Clarification requested on inventory", time: "30m ago", type: 'warning' }]
    },
  ]);

  const handleConvertLeadToLoan = (leadId) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    // 1. Update Lead Stage
    handleUpdateLead(leadId, { stage: 'Converted' });

    // 2. Create New Loan
    const newLoanId = `LN-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    const newLoan = {
      id: newLoanId,
      applicantName: lead.businessName || lead.name,
      industry: 'General', // Would come from lead details
      purpose: 'Working Capital', // Default or from lead
      amount: lead.value || '$0',
      status: 'Pending',
      progress: 10,
      stageName: 'Application',
      currentStep: 1,
      totalSteps: 5,
      insights: { hasWarning: false, blockers: [], lastActivity: 'Converted from Lead (Just now)', quickActions: ['Initial Review'] },
      steps: [{ id: 1, text: 'Initial Application Review', due: 'Pending', urgency: 'medium', completed: false }],
      notifications: []
    };

    setLoans(prev => [newLoan, ...prev]);

    // 3. Navigate to Loan
    setSelectedLoanDetail(newLoan);
    setSelectedLoanId(newLoan.id);
    setActiveTab('loans-overview'); // Switch to main loans view? Or 'loans-pipeline'?

    // Optional: Show toast here if we had one
    console.log(`[CONVERSION] Lead ${leadId} converted to Loan ${newLoanId}`);
  };

  const [leads, setLeads] = useState([
    { id: 'LD-001', name: 'Sarah Jenkins', businessName: 'Jenkins Catering', source: 'Referral', stage: 'New', assignedOfficer: 'Alex Morgan', status: 'online', lastActive: 'Now', email: 'sarah@jenkinscatering.com', phone: '(555) 123-4567', createdDate: 'Nov 24, 2023', urgencyStatus: 'track', value: '$50,000', company: 'Jenkins Catering', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150' },
    { id: 'LD-002', name: 'Mike Ross', businessName: 'Ross Legal', source: 'Web Form', stage: 'Attempting Contact', assignedOfficer: 'Alex Morgan', status: 'busy', lastActive: '10m ago', email: 'mike@rosslegal.com', phone: '(555) 987-6543', createdDate: 'Nov 20, 2023', urgencyStatus: 'medium', value: '$120,000', company: 'Ross Legal', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150' },
    { id: 'LD-003', name: 'David Miller', businessName: 'Miller Construction', source: 'Cold Outreach', stage: 'Qualified', assignedOfficer: 'Unassigned', lastActivity: 'Nov 29', email: 'dave@millerconst.com', phone: '(555) 456-7890', createdDate: 'Nov 15, 2023', urgencyStatus: 'high', value: '$350,000', company: 'Miller Construction', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150' },
    { id: 'LD-004', name: 'Elena Fisher', businessName: 'Fisher Design', source: 'Existing Client', stage: 'New', assignedOfficer: 'Sarah Miller', status: 'dnd', lastActive: '1h ago', email: 'elena@fisherdesign.com', phone: '(555) 222-3333', createdDate: 'Dec 05, 2023', urgencyStatus: 'track', value: '$80,000', company: 'Fisher Design', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150' }
  ]);

  const selectedLoan = loans.find(l => l.id === selectedLoanId) || loans[0];
  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  const handleCompleteTask = (taskId) => { console.log(`Marking task ${taskId} as done`); };
  const handleImportLeads = (newLeads) => {
    // Basic Import Logic
    const formattedLeads = newLeads.map((l, i) => ({
      id: `LD-IMP-${Date.now()}-${i}`,
      name: `${l.firstName} ${l.lastName}`,
      businessName: l.businessName || 'N/A',
      source: l.source || 'Import',
      stage: 'New',
      assignedOfficer: 'Unassigned',
      status: 'offline',
      lastActive: 'Just now',
      email: l.email,
      phone: l.phone || '',
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      urgencyStatus: 'low',
      value: '-',
      company: l.businessName || 'N/A',
      avatar: null
    }));
    setLeads(prev => [...formattedLeads, ...prev]);
  };
  const handleBulkUpdateLeads = (ids, updates) => {
    setLeads(prev => prev.map(lead => {
      if (ids.includes(lead.id)) {
        return { ...lead, ...updates };
      }
      return lead;
    }));
  };

  const handleUpdateLead = (leadId, updates) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, ...updates } : l));
  };

  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const isAdminMode = activeTab === 'admin';

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans overflow-hidden">
      <div className={`fixed left-0 top-0 h-full z-[60] transition-transform duration-300 ease-in-out ${isAdminMode ? '-translate-x-full' : 'translate-x-0'}`}>
        <Sidebar active={activeTab} onNavigate={setActiveTab} isPinned={isSidebarPinned} onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)} className="static h-full" userRole={userRole} />
      </div>

      <main className={`flex-1 flex flex-col transition-all duration-300 ease-in-out h-screen overflow-hidden ${isAdminMode ? 'ml-0' : (isSidebarPinned ? 'ml-64' : 'ml-20')}`}>
        <Header onNavigate={setActiveTab} user={currentUser} onSwitchUser={handleSwitchUser} />

        <div className="relative flex-1 flex flex-col min-h-0">
          {activeTab === 'loan-programs' ? (
            <div className="h-full overflow-y-auto">
              <LoanProgramsList />
            </div>
          ) : activeTab === 'loan-programs-mvp' ? (
            <div className="h-full overflow-y-auto">
              <LoanProgramsListMVP />
            </div>
          ) : activeTab === 'account-detail' ? (
            <AccountDetail
              onBack={handleBackFromDetail}
              initialAccount={selectedAccount}
              onOpen360={() => setActiveTab('account-360')}
            />
          ) : activeTab === 'accounts' ? (
            <div className="h-full overflow-y-auto">
              <AccountsList />
            </div>
          ) : (activeTab === 'contact-detail' || activeTab === 'contacts') ? (
            <ContactDetail onBack={handleBackFromDetail} initialContactName={selectedAccount?.name} />
          ) : activeTab === 'admin' ? (
            <AdminPanel onBack={() => setActiveTab('dashboard')} userRole={userRole} />
          ) : activeTab === 'profile' ? (
            <div className="h-full overflow-y-auto">
              <UserProfile user={currentUser} onUpdateProfile={handleUpdateProfile} />
            </div>
          ) : activeTab === 'account-360' ? (
            <Account360 onBack={() => setActiveTab('accounts')} initialAccount={selectedAccount} />
          ) : activeTab === 'create-lead' ? (
            <div className="h-full overflow-y-auto">
              <CreateLead onNavigate={setActiveTab} />
            </div>
          ) : activeTab.startsWith('marketing') ? (
            <div className="h-full overflow-y-auto">
              {activeTab === 'marketing-templates' ? (
                <TemplatesList onNavigate={setActiveTab} />
              ) : activeTab === 'marketing-template-editor' ? (
                <TemplateEditor onNavigate={setActiveTab} />
              ) : activeTab === 'marketing-template-upload' ? (
                <TemplateUpload onNavigate={setActiveTab} />
              ) : activeTab === 'marketing-campaign-preview' ? (
                <RecipientPreview onNavigate={setActiveTab} />
              ) : activeTab === 'marketing-campaign-wizard' ? (
                <CampaignWizard onNavigate={setActiveTab} />
              ) : (
                <MarketingDashboard onNavigate={setActiveTab} />
              )}
            </div>
          ) : activeTab.startsWith('loans') ? (
            <LoansLayout
              viewMode={activeTab}
              onNavigate={setActiveTab}
              onViewAccount={handleViewAccount}
              onViewContact={handleViewContact}
              selectedLoan={selectedLoanDetail}
              onSelectLoan={setSelectedLoanDetail}
              user={currentUser}
            />
          ) : activeTab.startsWith('leads') ? (
            <LeadsLayout
              viewMode={activeTab === 'leads-my' ? 'my' : 'all'}
              onCreateLead={() => setActiveTab('create-lead')}
              onViewAccount={() => setActiveTab('account-detail')}
              onViewContact={() => setActiveTab('contact-detail')}
              leads={leads}
              selectedLeadId={selectedLeadId}
              onSelectLead={setSelectedLeadId}
              currentFilters={leadFilters}
              onUpdateFilters={setLeadFilters}
              onImportLeads={handleImportLeads}
              onBulkUpdate={handleBulkUpdateLeads}
              onUpdateLead={handleUpdateLead}
              onConvertLead={handleConvertLeadToLoan}
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
                  <button onClick={() => setActiveTab('create-lead')} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                    <Plus size={20} /> <span>Create Lead</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-10">
                    <section>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Active Loans</h3>
                        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                          <button onClick={() => setActiveLoansView('grid')} className={`p-1.5 rounded-md transition-all ${activeLoansView === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                            <LayoutGrid size={16} />
                          </button>
                          <button onClick={() => setActiveLoansView('analytics')} className={`p-1.5 rounded-md transition-all ${activeLoansView === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                            <BarChart3 size={16} />
                          </button>
                        </div>
                      </div>

                      {activeLoansView === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                          {loans.map(loan => (
                            <LoanCard
                              key={loan.id}
                              loan={loan}
                              isSelected={selectedLoanId === loan.id}
                              onClick={() => setSelectedLoanId(loan.id)}
                            />
                          ))}
                        </div>
                      ) : (
                        <LoanAnalytics />
                      )}
                    </section>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4">Notifications</h3>
                      <NotificationsWidget notifications={selectedLoan?.notifications || []} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
