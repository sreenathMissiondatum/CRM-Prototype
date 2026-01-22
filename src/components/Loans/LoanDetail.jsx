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
    ChevronLeft, MoreVertical, FileText, CheckSquare, Clock, Check,
    Plus, Target, ArrowUpRight, AlertCircle, Calendar, Lightbulb, Pin, Lock, ShieldAlert, CheckCircle, ArrowRight
} from 'lucide-react';
import { useState } from 'react';
import CreditCommitteeModal from './CreditCommitteeModal';
import CreditCommitteeReviewTab from './CreditCommitteeReviewTab';
import ClosingTab from './ClosingTab';
import LoanApplicationDetails from './LoanApplicationDetails';
import RiskRatingsTab from './RiskRatingsTab';

const LoanDetail = ({ loan, onBack, onViewAccount, onViewContact, user }) => {
    // Data for Detail View
    const steps = ['New', 'Packaging', 'Underwriting', 'Credit Committee Review', 'Approved', 'Closed / Funded'];

    // Local Stage State
    const [currentStage, setCurrentStage] = useState(loan?.stage || 'Underwriting');
    // Derived from local state 'currentStage' instead of prop 'loan.stage'
    const currentStepIndex = steps.indexOf(currentStage) !== -1 ? steps.indexOf(currentStage) : 2;

    // Tab State
    const [activeTab, setActiveTab] = useState('Summary');

    // Inline Stage Transition State
    const [pendingStage, setPendingStage] = useState(null);
    const [justification, setJustification] = useState('');
    const [validationError, setValidationError] = useState(null);

    // Timeline Activities
    // Timeline Activities (Seed Data)
    const [activities, setActivities] = useState(() => {
        const now = new Date();
        const today = (h, m) => new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m).toISOString();
        const yesterday = (h, m) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, h, m).toISOString();
        const twoDaysAgo = (h, m) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, h, m).toISOString();

        return [
            {
                activityId: 'act_001',
                activityType: 'ACTION',
                title: 'Financial Statements Reviewed',
                description: 'Reviewed borrower’s 2022–2023 financial statements.',
                performedBy: 'Alex Morgan',
                role: 'Loan Officer',
                timestamp: today(10, 15),
                relatedEntity: { type: 'Documents', label: 'Financial Statements' }
            },
            {
                activityId: 'act_002',
                activityType: 'CALL',
                title: 'Call with Borrower',
                description: 'Discussed working capital usage and expected cash flow for Q4.',
                performedBy: 'Alex Morgan',
                timestamp: today(9, 30),
                relatedEntity: { type: 'Borrower', label: 'Borrower' },
                metadata: { outcome: 'connected', duration: '15m' }
            },
            {
                activityId: 'act_003',
                activityType: 'MESSAGE',
                title: 'Message Sent to Borrower',
                description: 'Requested clarification on inventory valuation assumptions.',
                performedBy: 'Alex Morgan',
                timestamp: yesterday(18, 10),
                relatedEntity: { type: 'Borrower', label: 'Borrower' }
            },
            {
                activityId: 'act_004',
                activityType: 'SYSTEM',
                title: 'Stage Changed',
                description: 'Loan stage changed from “New” to “Packaging”.',
                performedBy: 'System',
                timestamp: yesterday(17, 55),
                relatedEntity: { type: 'Loan Stage', label: 'Stage' }
            },
            {
                activityId: 'act_005',
                activityType: 'ACTION',
                title: 'Document Uploaded',
                description: 'Business Tax Returns (2022–2023) uploaded by borrower.',
                performedBy: 'John Doe',
                role: 'Borrower',
                timestamp: yesterday(15, 20),
                relatedEntity: { type: 'Documents', label: 'Tax Returns' }
            },
            {
                activityId: 'act_006',
                activityType: 'MEETING',
                title: 'Internal Underwriting Review',
                description: 'Initial underwriting discussion with credit team.',
                performedBy: 'Credit Team',
                timestamp: yesterday(11, 0),
                relatedEntity: { type: 'Loan', label: 'Loan' },
                metadata: { duration: '45m', participants: ['Alex Morgan', 'Sarah Smith'] }
            },
            {
                activityId: 'act_007',
                activityType: 'DECISION',
                title: 'Credit Memo Approved',
                description: 'Credit memo approved for committee review.',
                performedBy: 'Credit Manager',
                timestamp: twoDaysAgo(14, 0),
                relatedEntity: { type: 'Credit Memo', label: 'Credit Memo' }
            }
        ];
    });

    const handleLogActivity = (newActivity) => {
        const activityRecord = {
            id: `new_${Date.now()}`,
            type: 'call',
            category: 'call',
            title: `Outbound call - ${newActivity.outcome}`,
            user: 'Alex Morgan', // Can be dynamic if user context exists
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

    // Stage Transition Handler
    const handleStageClick = (stage, idx) => {
        // Prevent click if same stage or already completed (unless we want to support rollback, but prompt said "Future stages... Clickable")
        if (idx <= currentStepIndex) return;

        const isSequential = idx === currentStepIndex + 1;
        setPendingStage({ name: stage, index: idx, isSequential });
        setJustification('');
        setValidationError(null);

        // Mock Validation Logic
        if (stage === 'Credit Committee Review') {
            // Mock blocker - Randomly block for demo if they select this
            setValidationError({ type: 'warn', message: 'Requires final Credit Memo approval.' });
        }
        if (stage === 'Closed / Funded') {
            // Mock blocker
            setValidationError({ type: 'block', message: 'Missing required closing documents (Promissory Note).' });
        }
    };

    const confirmStageChange = () => {
        if (!pendingStage) return;

        // Log Audit
        const logMsg = `Stage changed to ${pendingStage.name}`;
        console.log(logMsg, justification ? `Reason: ${justification}` : '');
        alert(`[AUDIT LOG] ${logMsg}\nUser: System\nReason: ${justification || 'Sequential Progression'}`);

        // In a real app we'd update the loan object here or call an API
        // For prototype, we just reset
        setPendingStage(null);
    };

    const cancelStageChange = () => {
        setPendingStage(null);
        setJustification('');
        setValidationError(null);
    };

    // Kebab Menu Actions
    // Kebab Menu Actions
    const [showKebabMenu, setShowKebabMenu] = useState(false);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

    const handleKebabAction = (action) => {
        if (action === 'submit_credit_committee') {
            setShowKebabMenu(false);
            setIsCreditModalOpen(true);
        } else if (action === 'approve') {
            const newStage = 'Approved';
            setCurrentStage(newStage);
            console.log(`[AUDIT] Action: Approve | Stage: Credit Committee Review -> Approved | Decision By: ${user.firstName} ${user.lastName} (${user.role}) | Timestamp: ${new Date().toISOString()}`);
            setShowKebabMenu(false);
        } else if (action === 'deny') {
            const newStage = 'Denied';
            setCurrentStage(newStage);
            console.log(`[AUDIT] Action: Deny | Stage: Credit Committee Review -> Denied | Decision By: ${user.firstName} ${user.lastName} (${user.role}) | Timestamp: ${new Date().toISOString()}`);
            setShowKebabMenu(false);
        }
    };

    const handleSubmitCreditReview = (data) => {
        const newStage = 'Credit Committee Review';
        setCurrentStage(newStage);

        // Audit Log
        const logMsg = `[AUDIT] Action: Submit for Credit Committee Review | Stage: Underwriting -> ${newStage} | Reviewers: L1=${data.level1Reviewer}, L2=${data.level2Reviewer || 'None'} | Notes: ${data.notes || 'N/A'} | User: ${user?.firstName} ${user?.lastName} (${user?.role}) | Timestamp: ${new Date().toISOString()}`;
        console.log(logMsg);

        setIsCreditModalOpen(false);
    };

    const handleCommitteeDecision = (decisionData) => {
        const { action, ...rest } = decisionData;
        const newStage = action === 'Approve' ? 'Approved' : 'Denied';

        // 1. Log the full decision payload (Audit Trail)
        console.log(`[AUDIT] COMMITTEE DECISION: ${action.toUpperCase()}`, {
            stageTransition: `Credit Committee Review -> ${newStage}`,
            decisionBy: user?.email,
            timestamp: new Date().toISOString(),
            ...rest
        });

        // 2. Update Stage
        setCurrentStage(newStage);

        // 3. Stay on tab (Read Only mode)
        // setActiveTab('Summary');
    };

    const handleCloseAndFund = (closingData) => {
        const newStage = 'Closed / Funded';

        // 1. Log Audit
        console.log('[AUDIT] LOAN CLOSED & FUNDED', {
            stageTransition: 'Approved -> Closed / Funded',
            closedBy: user?.email,
            timestamp: new Date().toISOString(),
            closingDetails: closingData
        });

        // 2. Update Stage
        setCurrentStage(newStage);

        // 3. Stay on tab (Read Only views)
    };

    return (
        <div className="flex h-screen bg-slate-50 relative overflow-hidden">

            <CreditCommitteeModal
                isOpen={isCreditModalOpen}
                onClose={() => setIsCreditModalOpen(false)}
                onSubmit={handleSubmitCreditReview}
                loan={loan}
            />

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
                                {/* MVP Stage Dropdown */}
                                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-2 py-1 ml-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stage</span>
                                    <select
                                        value={currentStage}
                                        onChange={(e) => {
                                            const newStage = e.target.value;
                                            // MVP Validation: Block "Closed / Funded"
                                            if (newStage === 'Closed / Funded') {
                                                alert("Stage change not allowed due to missing requirements (MVP Blocker).");
                                                return; // Dropdown value remains unchanged because we didn't update state
                                            }

                                            // Update State
                                            setCurrentStage(newStage);

                                            // Audit Log
                                            console.log(`[AUDIT] Stage changed from '${currentStage}' to '${newStage}' by User`);
                                        }}
                                        className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer hover:text-blue-600 transition-colors"
                                    >
                                        {steps.map(step => (
                                            <option key={step} value={step}>{step}</option>
                                        ))}
                                    </select>
                                </div>
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

                            {/* Kebab Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowKebabMenu(!showKebabMenu)}
                                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 relative z-20"
                                >
                                    <MoreVertical size={20} />
                                </button>

                                {showKebabMenu && (
                                    <>
                                        {/* Backdrop to close */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setShowKebabMenu(false)}
                                        />

                                        {/* Menu Dropdown */}
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-30 py-1">
                                            {currentStage === 'Underwriting' ? (
                                                <button
                                                    onClick={() => handleKebabAction('submit_credit_committee')}
                                                    className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors"
                                                >
                                                    Submit for Credit Committee Review
                                                </button>
                                            ) : (
                                                <div className="contents">
                                                    {currentStage === 'Credit Committee Review' && user?.role === 'Credit Officer' ? (
                                                        <>
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2 font-medium"
                                                                onClick={() => handleKebabAction('approve')}
                                                            >
                                                                <CheckCircle size={16} /> Approve Loan
                                                            </button>
                                                            <button
                                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                                                                onClick={() => handleKebabAction('deny')}
                                                            >
                                                                <ShieldAlert size={16} /> Deny Loan
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="px-4 py-2 text-xs text-slate-400 italic text-center">
                                                            {currentStage === 'Credit Committee Review'
                                                                ? 'Review in Progress'
                                                                : 'No actions available in this stage'}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content Wrapper */}
                <div className="flex-1 overflow-y-auto min-h-0 pb-10">

                    {/* Inline Confirmation Strip - Shows when a future stage is clicked */}


                    {/* Interactive Progression Bar */}
                    <div className="px-8 mt-6 mb-6">
                        <div className="flex items-center w-full">
                            {steps.map((step, idx) => {
                                const isCompleted = idx < currentStepIndex;
                                const isActive = idx === currentStepIndex;
                                const isFuture = idx > currentStepIndex;
                                const isLast = idx === steps.length - 1;
                                const isLineSolid = idx < currentStepIndex;

                                return (
                                    <div key={step} className="contents">
                                        {/* Step Node */}
                                        <button
                                            onClick={() => handleStageClick(step, idx)}
                                            className={`relative flex flex-col items-center group transition-all duration-200 outline-none
                                            ${isActive ? 'cursor-default' : 'cursor-pointer hover:-translate-y-1'}
                                        `}
                                        >
                                            {/* Icon Circle */}
                                            <div
                                                title={isCompleted ? "Completed" : isActive ? "Current Stage" : "Move to this stage"}
                                                className={`
                                                w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 z-10 relative
                                                ${isCompleted
                                                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                                                        : isActive
                                                            ? 'bg-teal-600 ring-4 ring-teal-100 shadow-md transform scale-110'
                                                            : 'bg-white border-2 border-slate-300 group-hover:border-teal-400'
                                                    }
                                            `}
                                            >
                                                {isCompleted && <Check size={14} strokeWidth={3} />}
                                                {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            </div>

                                            {/* Label */}
                                            <div className={`absolute top-9 text-[10px] uppercase tracking-wider whitespace-nowrap transition-colors duration-300 
                                            ${isActive ? 'text-teal-700 font-extrabold translate-y-0.5'
                                                    : isCompleted ? 'text-slate-900 font-bold'
                                                        : 'text-slate-400 font-medium group-hover:text-teal-600'
                                                }`}>
                                                {step}
                                            </div>
                                        </button>

                                        {/* Connector Line */}
                                        {!isLast && (
                                            <div className={`flex-1 mx-2 h-[2px] mt-0 ${isLineSolid ? 'bg-teal-600' : 'border-t-2 border-dashed border-slate-200 bg-transparent'
                                                }`}></div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-8">

                        {/* Tabs */}
                        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-1">
                            {[
                                'Summary', 'Details', 'Risk', 'Borrower', 'Financials', 'Documents', 'Activities', 'Collateral',
                                ...(
                                    // Visible to Credit Officer OR (Alex Morgan/LO when Approved/Denied)
                                    (
                                        (user?.role === 'Credit Officer' && ['Credit Committee Review', 'Approved', 'Denied', 'Closed / Funded'].includes(currentStage)) ||
                                        (user?.firstName === 'Alex' && ['Approved', 'Denied', 'Closed / Funded'].includes(currentStage))
                                    )
                                        ? ['Credit Committee Review']
                                        : []
                                ),
                                ...(
                                    // Visible to Loan Officer (Alex) when Approved or Closed
                                    (user?.role === 'Loan Officer' && ['Approved', 'Closed / Funded'].includes(currentStage))
                                        ? ['Closing']
                                        : []
                                )
                            ].map((tab) => (
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

                        {activeTab === 'Details' && (
                            <LoanApplicationDetails loan={loan} />
                        )}

                        {activeTab === 'Risk' && (
                            <RiskRatingsTab loan={loan} />
                        )}

                        {activeTab === 'Borrower' && (
                            <BorrowerTab loan={loan} onViewAccount={onViewAccount} onViewContact={onViewContact} />
                        )}

                        {activeTab === 'Financials' && (
                            <FinancialsTab loan={loan} />
                        )}

                        {/* {activeTab === 'Credit Memo' && (
                    <CreditMemo loan={loan} />
                )} */}

                        {/* {activeTab === 'Requested Terms' && (
                    <RequestedTermsTab loan={loan} />
                )} */}

                        {activeTab === 'Documents' && (
                            <DocumentsTab loan={loan} />
                        )}

                        {activeTab === 'Activities' && (
                            <ActivitiesTab loan={loan} activities={activities} />
                        )}

                        {/* {activeTab === 'Underwriting' && (
                    <UnderwritingTab loan={loan} />
                )} */}

                        {activeTab === 'Collateral' && (
                            <CollateralTab loan={loan} />
                        )}

                        {activeTab === 'Credit Committee Review' && (
                            <CreditCommitteeReviewTab
                                loan={loan}
                                user={user}
                                isReadOnly={['Approved', 'Denied', 'Closed / Funded'].includes(currentStage)}
                                onApprove={handleCommitteeDecision}
                                onDeny={handleCommitteeDecision}
                            />
                        )}

                        {activeTab === 'Closing' && (
                            <ClosingTab
                                loan={loan}
                                user={user}
                                onCloseAndFund={handleCloseAndFund}
                                isReadOnly={currentStage === 'Closed / Funded'}
                            />
                        )}



                    </div>
                </div>
            </div>

            {/* Right Context Sidebar */}
            <div className="w-80 bg-white border-l border-slate-200 h-full overflow-y-auto p-6 hidden xl:block shadow-[-4px_0_12px_rgba(0,0,0,0.02)] z-20">
                <div className="space-y-8">

                    {/* Borrower Quick Card */}
                    <BorrowerTile loan={loan} onLogActivity={handleLogActivity} />

                    {/* Stage Gate Checklist */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                        <h4 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                            <ShieldAlert size={14} className="text-amber-500" />
                            Stage Gate — {loan.stage}
                        </h4>
                        <div className="space-y-3">
                            <div className="flex items-start gap-2">
                                <CheckCircle size={14} className="text-emerald-500 mt-0.5" />
                                <span className="text-sm text-slate-700 font-medium">Financials Reviewed</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <CheckCircle size={14} className="text-emerald-500 mt-0.5" />
                                <span className="text-sm text-slate-700 font-medium">Identify Verification (KYC)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <AlertCircle size={14} className="text-amber-500 mt-0.5" />
                                <span className="text-sm text-slate-700 font-medium">Collateral Valuation</span>
                            </div>
                        </div>
                    </div>
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
