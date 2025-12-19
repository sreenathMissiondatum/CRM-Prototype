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
import AccountsList from './components/Accounts/AccountsList';
import Account360 from './components/Accounts/Account360';
import AdminPanel from './components/Admin/AdminPanel';
import { Plus, LayoutGrid, BarChart3 } from 'lucide-react';

function App() {
  const [activeTab, setActiveTabOriginal] = useState('dashboard');
  const [previousTab, setPreviousTab] = useState(null);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null); // New state for account context
  const [selectedLoanDetail, setSelectedLoanDetail] = useState(null); // Lifted state for Loan Detail persistence

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
      // We do NOT clear selectedLoanDetail here, so it re-opens the detail view
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
    // Reuse selectedAccount state to pass contact data for now, or create dedicated state
    // Ideally create selectedContact state, but for quick fix using existing pattern if appropriate
    // Actually, looking at handleViewAccount, it sets SelectedAccount.
    // Let's reuse selectedAccount for simplicity if it supports storing the contact name, OR create selectedContact.
    // Given the component structure, creating a dedicated state is safer.
    setSelectedAccount(contactData); // Using selectedAccount slot to pass generic "context" data
    setActiveTab('contact-detail');
  };

  const [selectedLoanId, setSelectedLoanId] = useState('LN-2023-001');
  const [activeLoansView, setActiveLoansView] = useState('grid'); // 'grid' | 'analytics'

  // Persistent Lead Filters
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

  const loans = [
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
      insights: {
        hasWarning: false,
        blockers: [],
        lastActivity: 'Borrower uploaded tax returns (1h ago)',
        quickActions: ['Review Docs']
      },
      steps: [
        { id: 1, text: 'Review 2022 Tax Returns', due: 'Today', urgency: 'high', completed: false }
      ],
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
      insights: {
        hasWarning: true,
        blockers: ['Missing Q4 Tax Returns', 'SLA Risk: 2 days overdue'],
        lastActivity: 'Borrower uploaded partial docs (2h ago)',
        quickActions: ['Request Tax Docs', 'Escalate to Manager']
      },
      steps: [
        { id: 1, text: 'Review TechStart financials', due: 'Today', urgency: 'high', completed: false },
        { id: 2, text: 'Schedule site visit', due: 'Tomorrow', urgency: 'medium', completed: false },
      ],
      notifications: [
        { id: 1, text: "New document uploaded: Tax Returns", time: "10m ago", type: 'info' },
        { id: 2, text: "Credit score updated", time: "2h ago", type: 'warning' }
      ]
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
      insights: {
        hasWarning: false,
        blockers: [],
        lastActivity: 'Funds disbursed to client account (1d ago)',
        quickActions: ['Send Welcome Kit', 'Schedule Check-in']
      },
      steps: [
        { id: 1, text: 'Verify insurance renewal', due: 'Dec 15', urgency: 'low', completed: false },
      ],
      notifications: [
        { id: 1, text: "Payment received", time: "1d ago", type: 'info' }
      ]
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
      insights: {
        hasWarning: true,
        blockers: ['Application signature pending'],
        lastActivity: 'Application sent to borrower (3d ago)',
        quickActions: ['Resend Link', 'Call Borrower']
      },
      steps: [
        { id: 1, text: 'Await signed application', due: 'Pending', urgency: 'high', completed: false }
      ],
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
      insights: {
        hasWarning: true,
        blockers: ['Inventory valuation discrepancy'],
        lastActivity: 'Analyst requested clarification (30m ago)',
        quickActions: ['Review Valuation', 'Message Analyst']
      },
      steps: [
        { id: 1, text: 'Analysis of Q3 sales', due: 'Friday', urgency: 'medium', completed: false },
        { id: 2, text: 'Manager approval needed', due: 'Today', urgency: 'high', completed: false }
      ],
      notifications: [
        { id: 1, text: "Clarification requested on inventory", time: "30m ago", type: 'warning' }
      ]
    },
  ];

  const [leads, setLeads] = useState([
    {
      id: 'LD-001',
      name: 'Sarah Jenkins',
      businessName: 'Jenkins Catering',
      source: 'Referral',
      stage: 'New',
      assignedOfficer: 'Sarah M',
      lastActivity: 'Dec 3',
      email: 'sarah@jenkinscatering.com',
      phone: '(555) 123-4567',
      createdDate: 'Nov 24, 2023',
      urgencyStatus: 'track',
      value: '$50,000',
      company: 'Jenkins Catering'
    },
    {
      id: 'LD-002',
      name: 'Mike Ross',
      businessName: 'Ross Legal',
      source: 'Web Form',
      stage: 'Contacted',
      assignedOfficer: 'Alex Morgan',
      lastActivity: 'Dec 1',
      email: 'mike@rosslegal.com',
      phone: '(555) 987-6543',
      createdDate: 'Nov 20, 2023',
      urgencyStatus: 'medium',
      value: '$120,000',
      company: 'Ross Legal'
    },
    {
      id: 'LD-003',
      name: 'David Miller',
      businessName: 'Miller Construction',
      source: 'Cold Outreach',
      stage: 'Qualified',
      assignedOfficer: 'Unassigned',
      lastActivity: 'Nov 29',
      email: 'dave@millerconst.com',
      phone: '(555) 456-7890',
      createdDate: 'Nov 15, 2023',
      urgencyStatus: 'high',
      value: '$350,000',
      company: 'Miller Construction'
    },
    {
      id: 'LD-004',
      name: 'Elena Fisher',
      businessName: 'Fisher Design',
      source: 'Existing Client',
      stage: 'New',
      assignedOfficer: 'Sarah M',
      lastActivity: 'Today',
      email: 'elena@fisherdesign.com',
      phone: '(555) 222-3333',
      createdDate: 'Dec 05, 2023',
      urgencyStatus: 'track',
      value: '$80,000',
      company: 'Fisher Design'
    }
  ]);

  // Helper to get selected loan data
  // When in analytics mode, we might not need distinct selection, but keeping it logic for now.
  const selectedLoan = loans.find(l => l.id === selectedLoanId) || loans[0];
  const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

  const handleCompleteTask = (taskId) => {
    console.log(`Marking task ${taskId} as done`);
  };

  // Sidebar State
  const [isSidebarPinned, setIsSidebarPinned] = useState(false);
  const isAdminMode = activeTab === 'admin';

  return (
    <div className="flex bg-slate-50 min-h-screen font-sans overflow-hidden">
      {/* Main App Sidebar - Slides out when in Admin Mode */}
      <div className={`fixed left-0 top-0 h-full z-[60] transition-transform duration-300 ease-in-out ${isAdminMode ? '-translate-x-full' : 'translate-x-0'}`}>
        <Sidebar
          active={activeTab}
          onNavigate={setActiveTab}
          isPinned={isSidebarPinned}
          onTogglePin={() => setIsSidebarPinned(!isSidebarPinned)}
          className="static h-full"
        />
      </div>

      <main
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out h-screen overflow-hidden ${isAdminMode ? 'ml-0' : (isSidebarPinned ? 'ml-64' : 'ml-20')
          }`}
      >
        <Header />

        <div className="relative flex-1 flex flex-col min-h-0">
          {activeTab === 'loan-programs' ? (
            <div className="h-full overflow-y-auto">
              <LoanProgramsList />
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
            <AdminPanel onBack={() => setActiveTab('dashboard')} />
          ) : activeTab === 'account-360' ? (
            <Account360 onBack={() => setActiveTab('accounts')} initialAccount={selectedAccount} />
          ) : activeTab === 'create-lead' ? (
            <div className="h-full overflow-y-auto">
              <CreateLead onNavigate={setActiveTab} />
            </div>
          ) : activeTab.startsWith('loans') ? (
            <LoansLayout
              viewMode={activeTab}
              onNavigate={setActiveTab}
              onViewAccount={handleViewAccount}
              onViewContact={handleViewContact}
              selectedLoan={selectedLoanDetail}
              onSelectLoan={setSelectedLoanDetail}
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
            />
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="p-8 max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
                  <button
                    onClick={() => setActiveTab('create-lead')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm shadow-blue-200">
                    <Plus size={20} />
                    <span>Create Lead</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                  {/* Main Content Area - Full width in analytics view, 2/3 in grid view */}
                  <div className={activeLoansView === 'analytics' ? "lg:col-span-3 space-y-10" : "lg:col-span-2 space-y-10"}>

                    {/* Active Loans Section */}
                    <section>
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-4">
                          <h3 className="text-lg font-bold text-slate-800">Active Loans</h3>
                          {/* View Toggle */}
                          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                            <button
                              onClick={() => setActiveLoansView('grid')}
                              className={`p-1.5 rounded-md transition-all ${activeLoansView === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                              title="Operational View"
                            >
                              <LayoutGrid size={16} />
                            </button>
                            <button
                              onClick={() => setActiveLoansView('analytics')}
                              className={`p-1.5 rounded-md transition-all ${activeLoansView === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                              title="Insights View"
                            >
                              <BarChart3 size={16} />
                            </button>
                          </div>
                        </div>
                        {/* View All - Hide in Analytics mode */}
                        {activeLoansView === 'grid' && (
                          <a href="#" className="text-sm text-blue-600 font-medium hover:underline">View All</a>
                        )}
                      </div>

                      {activeLoansView === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
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

                    {/* Recent Leads Section - Hide in Analytics mode */}
                    {activeLoansView === 'grid' && (
                      <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold text-slate-800">Recent Leads</h3>
                          <a href="#" className="text-sm text-blue-600 font-medium hover:underline">View All</a>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {leads.map(lead => (
                            <LeadCard key={lead.id} lead={lead} />
                          ))}
                        </div>
                      </section>
                    )}

                  </div>

                  {/* Right Column: Widgets - Hide in Analytics mode */}
                  {activeLoansView === 'grid' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                      <div className="sticky top-6 space-y-6">
                        <TaskEngineWidget
                          steps={selectedLoan.steps}
                          loanId={selectedLoan.id}
                          onComplete={handleCompleteTask}
                        />
                        <NotificationsWidget notifications={selectedLoan.notifications} />
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div >
  );
}

export default App;
