import FinancialsTab from './FinancialsTab';
import BorrowerTab from './BorrowerTab';
import RequestedTermsTab from './RequestedTermsTab';
import DocumentsTab from './DocumentsTab';
import ActivitiesTab from './ActivitiesTab';
import UnderwritingTab from './UnderwritingTab';
import CollateralTab from './CollateralTab';
import BorrowerTile from './BorrowerTile';
import TaskItem from './TaskItem';
import NoteItem from './NoteItem';
import CreditMemo from './CreditMemo';
import {
    ChevronLeft, MoreVertical, FileText, CheckSquare, Clock,
    Plus, Target, ArrowUpRight, AlertCircle, Calendar, Lightbulb, Pin
} from 'lucide-react';
import { useState } from 'react';

const LoanDetail = ({ loan, onBack, onViewAccount, onViewContact }) => {
    // Mock Data for Detail View
    const steps = ['New', 'Docs', 'Underwriting', 'Approval', 'Closing'];
    const currentStepIndex = 2; // Underwriting

    // Tab State
    const [activeTab, setActiveTab] = useState('Summary');

    // MOCK DATA: Timeline Activities
    const [activities, setActivities] = useState([
        {
            id: 'c1',
            type: 'call',
            category: 'call',
            title: 'Outbound call with Borrower',
            user: 'Alex Morgan',
            role: 'Loan Officer',
            timestamp: new Date().toISOString(), // Today
            displayTime: 'Today at 11:15 AM',
            related: { type: 'Contact', label: 'John Doe' },
            metadata: { direction: 'outbound', outcome: 'connected', duration: '6m 12s' }
        },
        {
            id: 'a0',
            type: 'communication',
            category: 'communication',
            title: 'Nudge sent: Missing Tax Returns',
            user: 'Alex Morgan',
            role: 'Loan Officer',
            timestamp: new Date(Date.now() - 3600000).toISOString(), // Today - 1hr
            displayTime: 'Today at 9:45 AM',
            related: { type: 'Task', label: 'Tax Returns' }
        },
        {
            id: 'm1',
            type: 'meeting',
            category: 'meeting',
            title: 'Meeting scheduled: Underwriting Review',
            user: 'Alex Morgan',
            role: 'Organizer',
            timestamp: new Date().toISOString(), // Today
            displayTime: 'Today at 9:00 AM',
            related: null,
            metadata: { status: 'scheduled', participants: ['John Doe', 'Sarah (UW)'], date: 'Dec 14, 2024', time: '2:00 PM' }
        },
        {
            id: 'c2',
            type: 'call',
            category: 'call',
            title: 'Missed call from Borrower',
            user: 'System',
            role: 'Telephony',
            timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            displayTime: 'Yesterday at 5:20 PM',
            related: { type: 'Contact', label: 'John Doe' },
            metadata: { direction: 'inbound', outcome: 'missed', duration: '0s' }
        },
        {
            id: 'a1',
            type: 'decision', // Critical
            category: 'decision',
            title: 'Exception approved: DSCR below policy threshold',
            description: 'Reason: Strong cash flow history and additional guarantor support provided.',
            user: 'Credit Committee',
            role: ' approver',
            timestamp: new Date(Date.now() - 90000000).toISOString(), // Yesterday early
            displayTime: 'Yesterday at 4:30 PM',
            related: { type: 'Policy', label: 'Credit Policy 4.2' },
            metadata: { result: 'approved' }
        },
        {
            id: 'a8',
            type: 'action',
            category: 'action',
            title: 'Lead converted to Loan Application',
            user: 'Alex Morgan',
            role: 'Loan Officer',
            timestamp: '2023-11-12T10:00:00Z',
            displayTime: 'Nov 12, 2023',
            related: { type: 'Lead', label: 'LD-001' }
        }
    ]);

    const handleLogActivity = (newActivity) => {
        const activityRecord = {
            id: `new_${Date.now()}`,
            type: 'call',
            category: 'call',
            title: `Outbound call - ${newActivity.outcome}`,
            user: 'Alex Morgan', // Mock user
            role: 'Loan Officer',
            timestamp: new Date().toISOString(),
            displayTime: 'Just now',
            related: { type: 'Loan', label: loan.borrower },
            metadata: {
                direction: 'outbound',
                outcome: newActivity.outcome.toLowerCase(),
                duration: newActivity.duration
            },
            description: newActivity.notes
        };
        setActivities([activityRecord, ...activities]);
    };

    return (
        <div className="flex min-h-screen bg-slate-50 relative">
            {/* Main Content Area (Scrollable) */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">

                {/* Header */}
                <div className="bg-white border-b border-slate-200 p-6 shadow-sm z-10">
                    <div className="flex items-center gap-2 mb-4">
                        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-sm font-medium">
                            <ChevronLeft size={16} /> Back to Loans
                        </button>
                    </div>

                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-slate-900">{loan.borrower}</h1>
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700 uppercase tracking-wide">
                                    {loan.stage}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                <span className="font-mono text-slate-400">{loan.id}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span>{loan.program}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                <span className="text-slate-700 font-semibold">{loan.amount}</span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="text-right mr-4">
                                <div className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">SLA Status</div>
                                <div className="text-sm font-bold text-emerald-600">On Track (2 Days Left)</div>
                            </div>
                            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500">
                                <MoreVertical size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Progression Bar */}
                    <div className="mt-8 relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                        <div className="absolute top-1/2 left-0 h-1 bg-teal-500 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: '50%' }}></div>
                        <div className="relative flex justify-between z-10">
                            {steps.map((step, idx) => {
                                const isCompleted = idx <= currentStepIndex;
                                const isCurrent = idx === currentStepIndex;
                                return (
                                    <div key={step} className="flex flex-col items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full border-2 transition-colors duration-300 ${isCompleted ? 'bg-teal-500 border-teal-500' : 'bg-white border-slate-300'}`}></div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-teal-700' : 'text-slate-400'}`}>{step}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6 border-b border-slate-200 pb-1">
                        {['Summary', 'Borrower', 'Financials', 'Credit Memo', 'Requested Terms', 'Documents', 'Activities', 'Underwriting', 'Collateral'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-t-lg text-sm font-medium border-b-2 transition-colors 
                                    ${activeTab === tab
                                        ? 'border-teal-500 text-teal-700 bg-teal-50/50'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'Summary' && (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Left Card: Snapshot */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <FileText size={16} className="text-teal-500" /> Loan Snapshot
                                    </h3>
                                    <div className="space-y-4">
                                        <DetailRow label="Borrower Name" value={loan.borrower} />
                                        <DetailRow label="Primary Owner" value={loan.borrower?.includes('Jenkins') ? 'Sarah Jenkins' : 'John Doe'} />
                                        <DetailRow label="Industry" value={loan.industry || 'General Business'} />
                                        <DetailRow label="Loan Purpose" value={loan.purpose || 'Working Capital'} />
                                        <DetailRow label="Collateral" value="Company Inventory, Personal Guarantee" />
                                    </div>
                                </div>

                                {/* Right Card: Eligibility */}
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                        <CheckSquare size={16} className="text-blue-500" /> Key Ratios & Eligibility
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <MetricBox label="DSCR" value="1.25x" trend="↑" status="good" />
                                        <MetricBox label="Credit Score" value="720" trend="-" status="neutral" />
                                        <MetricBox label="Risk Rating" value="B+" status="good" />
                                        <MetricBox label="Rev (12m)" value="$1.2M" trend="↑" status="good" />
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="mt-8">
                                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                    <Clock size={16} className="text-slate-400" /> Recent Activity
                                </h3>
                                <div className="border-l-2 border-slate-100 ml-2 space-y-6 pl-6 relative">
                                    <TimelineItem
                                        title="Underwriting Started"
                                        time="2 hours ago"
                                        user="Alex Morgan"
                                        type="status"
                                    />
                                    <TimelineItem
                                        title="Documents Uploaded"
                                        time="Yesterday"
                                        user="John Doe (Borrower)"
                                        description="Tax Returns 2022.pdf, Bank Statements.pdf"
                                        type="doc"
                                    />
                                    <TimelineItem
                                        title="Application Submitted"
                                        time="2 days ago"
                                        user="Sales Team"
                                        type="info"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'Borrower' && (
                        <BorrowerTab loan={loan} onViewAccount={onViewAccount} onViewContact={onViewContact} />
                    )}

                    {activeTab === 'Financials' && (
                        <FinancialsTab loan={loan} />
                    )}

                    {activeTab === 'Credit Memo' && (
                        <CreditMemo loan={loan} />
                    )}

                    {activeTab === 'Requested Terms' && (
                        <RequestedTermsTab loan={loan} />
                    )}

                    {activeTab === 'Documents' && (
                        <DocumentsTab loan={loan} />
                    )}

                    {activeTab === 'Activities' && (
                        <ActivitiesTab loan={loan} activities={activities} />
                    )}

                    {activeTab === 'Underwriting' && (
                        <UnderwritingTab loan={loan} />
                    )}

                    {activeTab === 'Collateral' && (
                        <CollateralTab loan={loan} />
                    )}



                </div>
            </div>

            {/* Right Context Sidebar */}
            <div className="w-80 bg-white border-l border-slate-200 h-full overflow-y-auto p-6 hidden xl:block shadow-[-4px_0_12px_rgba(0,0,0,0.02)] z-20">
                <div className="space-y-8">

                    {/* Borrower Quick Card */}
                    <BorrowerTile loan={loan} onLogActivity={handleLogActivity} />

                    {/* Tasks */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tasks</h4>
                            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                <Plus size={14} />
                            </button>
                        </div>
                        <div className="space-y-2">
                            <TaskItem
                                task={{
                                    title: "Review Financial Statements",
                                    priority: "High",
                                    due: "Due Today"
                                }}
                            />
                            <TaskItem
                                task={{
                                    title: "Verify Collateral Docs",
                                    priority: "Med",
                                    due: "Dec 14"
                                }}
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notes</h4>
                            <button className="text-blue-600 hover:text-blue-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Plus size={12} /> Add
                            </button>
                        </div>

                        <div className="space-y-3">
                            <NoteItem
                                note={{
                                    type: 'insight',
                                    content: (
                                        <>
                                            Borrower mentioned plans to expand inventory by <span className="font-bold text-slate-900">20% in Q4</span>. Upsell opportunity for line of credit.
                                        </>
                                    ),
                                    timestamp: '2h ago',
                                    author: 'Alex Morgan',
                                    authorInitials: 'AM'
                                }}
                            />

                            <NoteItem
                                note={{
                                    type: 'standard',
                                    content: 'Updated collateral value based on recent appraisal docs affecting LTV.',
                                    timestamp: 'Yesterday',
                                    author: 'System',
                                    role: null // System notes might not have a specific role or initials
                                }}
                            />
                        </div>
                    </div>

                    {/* Related Records */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Related Records</h4>
                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-slate-300 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                        <Target size={14} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-700">Originating Lead</span>
                                </div>
                                <ArrowUpRight size={14} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                            </div>
                            <div className="pl-8">
                                <div className="font-medium text-sm text-slate-900">LD-001 • {loan.borrower}</div>
                                <div className="text-xs text-slate-500 mt-0.5">Converted on Nov 12, 2023</div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

// Helper Components
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
        <span className="text-sm text-slate-500">{label}</span>
        <span className="text-sm font-medium text-slate-900">{value}</span>
    </div>
);

const MetricBox = ({ label, value, trend, status }) => (
    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
        <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">{label}</div>
        <div className="flex items-end gap-2">
            <span className="text-lg font-bold text-slate-900 leading-none">{value}</span>
            {trend && (
                <span className={`text-xs font-bold ${trend === '↑' ? 'text-emerald-500' : 'text-slate-400'}`}>{trend}</span>
            )}
        </div>
    </div>
);

const TimelineItem = ({ title, time, user, description, type }) => (
    <div className="relative">
        <div className="absolute -left-[33px] top-1 w-3 h-3 rounded-full bg-slate-200 border-2 border-white ring-1 ring-slate-100"></div>
        <div className="mb-0.5 font-medium text-slate-800 text-sm">{title}</div>
        <div className="text-xs text-slate-400 mb-1">{user} • {time}</div>
        {description && (
            <div className="text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mt-1 inline-block">
                {description}
            </div>
        )}
    </div>
);

export default LoanDetail;
