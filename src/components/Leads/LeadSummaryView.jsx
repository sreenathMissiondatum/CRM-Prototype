import React, { useState } from 'react';
import {
    Phone, Mail, Calendar, Clock, MapPin,
    FileText, SquareCheck,
    ArrowRight, MessageSquare, StickyNote,
    ArrowLeft, ShieldCheck, AlertCircle,
    TrendingUp, Briefcase, Building2, User,
    CircleCheck, TriangleAlert, Plus, SquarePen, RefreshCw, X, MoreHorizontal, MousePointerClick
} from 'lucide-react';
import CallPrimaryWidget from '../Shared/CallPrimaryWidget';
import LeadBorrowerSnapshot from './LeadBorrowerSnapshot';
import ScoreBreakdownDrawer from './ScoreBreakdownDrawer';
import LoanProgramSelector from '../LoanPrograms/LoanProgramSelector';
import { programs } from '../../data/loanPrograms';
import ProgressiveButton from './ProgressiveButton';
import ReadinessChecklistDrawer from './ReadinessChecklistDrawer';
import SelectedProgramCard from '../LoanPrograms/SelectedProgramCard';
import RequiredDocumentsModal from '../LoanPrograms/RequiredDocumentsModal';
import ProgramDetailsDrawer from '../LoanPrograms/ProgramDetailsDrawer';

const LeadSummaryView = ({ lead, assignedPrograms = [], onUpdateAssignedPrograms, onViewAccount, onViewContact, onLogActivity }) => {
    // Enhanced Mock Data (merged with prop)
    const data = {
        ...lead,
        industry: 'Food Services (722511)',
        yearsInBusiness: 5,
        location: 'Detroit, MI',
        censusTract: 'Low-Income (Qualified)',
        impactFlags: ['Minority-Owned', 'Woman-Owned'],
        gender: 'Female', // Added for pronoun display
        role: 'Owner',
        preferredContact: 'Email',
        creditScore: '680-720 (Self-reported)',
        loanAmount: '$75,000',
        loanPurpose: 'Working Capital',
        purposeDetail: 'Inventory expansion for holiday season',
        timeline: 'Immediate',
        isTaClient: true,
        readinessLevel: 'In Progress',
        eligibility: 'Likely Eligible',
        docStatus: 'In Progress',
        missionFit: 'Strong',
        taNeeded: 'No',
        nextSteps: [
            { id: 1, text: 'Collect Q3 Financials', due: 'Today', priority: 'high', type: 'system' },
            { id: 2, text: 'Schedule Site Visit', due: 'Tomorrow', priority: 'medium', type: 'user' },
        ],
        recentActivity: [
            { id: 1, type: 'email', summary: 'Sent doc request', time: '2h ago' },
            { id: 2, type: 'call', summary: 'Discussed timeline', time: 'Yesterday' },
            { id: 3, type: 'note', summary: 'Note: Strong referral', time: 'Nov 29' },
        ]
    };

    // AI Score State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [scoreData, setScoreData] = useState({
        score: 78,
        band: 'Low',
        confidence: 92,
        timestamp: '2h ago',
        isLoading: false,
        factors: [
            { label: 'Strong Cash Flow', detail: 'Positive trend in last 6 months', impact: 'positive' },
            { label: 'Established Business', detail: 'Operating > 3 years', impact: 'positive' },
            { label: 'Industry Risk', detail: 'Food Services has moderate volatility', impact: 'negative' }
        ]
    });

    // Lending Decision State
    const [isProgramSelectorOpen, setIsProgramSelectorOpen] = useState(false);
    // const [selectedProgram, setSelectedProgram] = useState(null); // REMOVED: Managed by parent (LeadDetail)

    const [isReadinessDrawerOpen, setIsReadinessDrawerOpen] = useState(false);

    // Detailed Views State
    const [selectedProgramForDocs, setSelectedProgramForDocs] = useState(null);
    const [selectedProgramForDetails, setSelectedProgramForDetails] = useState(null);

    // Calculate Readiness
    const calculateReadiness = () => {
        const required = [];
        const recommended = [];
        let score = 0;

        // 1. Program Selected (Required - 25pts)
        // 1. Program Selected (Required - 25pts)
        if (assignedPrograms.length > 0) {
            score += 25;
            required.push({ label: 'Loan Program Selected', done: true });
        } else {
            required.push({
                label: 'Assign Loan Program',
                done: false,
                description: 'A lending program must be proposed before conversion.',
                action: 'open_program_selector',
                cta: 'Select Program'
            });
        }

        // 2. Borrower Details (Required - 20pts)
        if (data.name && data.businessName) {
            score += 20;
            required.push({ label: 'Borrower Linked', done: true });
        } else {
            required.push({ label: 'Link Borrower', done: false, description: 'Account and Contact must be valid.' });
        }

        // 3. Amount & Purpose (Required - 20pts)
        if (data.loanAmount && data.loanPurpose) {
            score += 20;
            required.push({ label: 'Loan Details', done: true });
        } else {
            required.push({ label: 'Loan Details', done: false, description: 'Amount and Purpose are required.' });
        }

        // 4. Eligibility Check (Required - 15pts)
        if (data.eligibility !== 'Ineligible') {
            score += 15;
            required.push({ label: 'Eligibility Verified', done: true });
        } else {
            required.push({ label: 'Eligibility Check', done: false, description: 'Borrower is currently ineligible.' });
        }

        // 5. Recommended: Documents (10pts)
        if (data.docStatus !== 'Not Started') {
            score += 10;
            recommended.push({ label: 'Documents Requested', done: true });
        } else {
            recommended.push({ label: 'Request Documents', done: false });
        }

        // 6. Recommended: TA Assessment (10pts)
        if (data.taNeeded === 'No' || data.isTaClient) {
            score += 10;
            recommended.push({ label: 'TA Assessment', done: true });
        } else {
            recommended.push({ label: 'Review TA Needs', done: false });
        }

        return { score, required, recommended };
    };

    const readiness = calculateReadiness();

    const handleConvertClick = () => {
        if (readiness.score >= 100) {
            if (onLogActivity) {
                onLogActivity({
                    type: 'system',
                    title: 'Lead Converted to Loan',
                    description: `Converted to application for ${assignedPrograms.length} programs.`,
                    outcome: 'success'
                });
            }
            alert("Conversion Logic Triggered!"); // Placeholder
        } else {
            setIsReadinessDrawerOpen(true);
        }
    };

    const handleReadinessAction = (action) => {
        if (action === 'open_program_selector') {
            setIsProgramSelectorOpen(true);
        }
    };


    const handleProgramSelect = (selectedPrograms) => {
        // Map full objects to IDs for storage
        const ids = selectedPrograms.map(p => p.id);
        onUpdateAssignedPrograms(ids);

        if (onLogActivity) {
            onLogActivity({
                type: 'system',
                title: 'Loan Programs Updated',
                description: `Assigned ${selectedPrograms.length} program(s) to lead.`,
                outcome: 'decision'
            });
        }
        setIsProgramSelectorOpen(false);
    };

    const handleRemoveProgram = (programId) => {
        const newIds = assignedPrograms.filter(id => id !== programId);
        onUpdateAssignedPrograms(newIds);
    };

    const handleReRunScore = () => {
        setScoreData(prev => ({ ...prev, isLoading: true }));

        // Simulate API call
        setTimeout(() => {
            const newScore = Math.floor(Math.random() * (85 - 75 + 1) + 75); // Random 75-85
            const newScoreData = {
                ...scoreData,
                score: newScore,
                timestamp: 'Just now',
                isLoading: false
            };
            setScoreData(newScoreData);

            // Log Activity
            if (onLogActivity) {
                onLogActivity({
                    type: 'system', // or specific AI type if supported
                    title: `AI Pre-Screening Evaluated: ${newScore} (Low Risk)`,
                    description: 'Automated re-evaluation requested by user.',
                    outcome: 'completed'
                });
            }
        }, 1500);
    };

    const getPronouns = (gender) => {
        if (!gender) return '';
        const g = gender.toLowerCase();
        if (g === 'male') return '(He/Him)';
        if (g === 'female') return '(She/Her)';
        return '(They/Them)';
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* 1. Readiness Strip & Score Card */}
            <div className="grid grid-cols-5 gap-4">
                <ReadinessCard label="Eligibility" value={data.eligibility} status="success" />
                <ReadinessCard label="Documents" value={data.docStatus} status="warning" />
                <ReadinessCard label="TA Needed" value={data.taNeeded} status="neutral" />
                <ReadinessCard label="Mission Fit" value={data.missionFit} status="success" />

                {/* 5. Pre-Screen Score Card */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                    <div className="flex justify-between items-start z-10">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                            AI Score
                        </div>
                        <span className="text-[10px] text-slate-400">{scoreData.timestamp}</span>
                    </div>

                    <div className="flex items-end justify-between mt-2 z-10">
                        <div>
                            <div className="text-2xl font-black text-slate-800 leading-none">{scoreData.score}</div>
                            <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 rounded mt-1 inline-block border border-emerald-100">
                                {scoreData.band} Risk
                            </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <button
                                onClick={handleReRunScore}
                                disabled={scoreData.isLoading}
                                className="text-slate-400 hover:text-blue-600 transition-colors"
                                title="Re-run Analysis"
                            >
                                <RefreshCw size={14} className={scoreData.isLoading ? "animate-spin text-blue-500" : ""} />
                            </button>
                            <button
                                onClick={() => setIsDrawerOpen(true)}
                                className="text-[10px] font-medium text-blue-600 hover:underline"
                            >
                                View Details
                            </button>
                        </div>
                    </div>

                    {/* Decorative BG */}
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-50 to-transparent rounded-full opacity-50 pointer-events-none group-hover:scale-110 transition-transform"></div>
                </div>
            </div>

            <ScoreBreakdownDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                scoreData={scoreData}
                onReRun={handleReRunScore}
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Left Column (2/3) */}
                <div className="xl:col-span-2 space-y-6">

                    {/* 2. Borrower Snapshot */}
                    {/* 2. Borrower Snapshot (Reusable Board) */}
                    {/* 2. Borrower Snapshot (Lead Specific) */}
                    <LeadBorrowerSnapshot
                        data={{
                            legalName: data.businessName,
                            industry: data.industry,
                            entityType: 'LLC',
                            taxId: '**-***4592',
                            yearsInBusiness: data.yearsInBusiness,
                            website: 'jenkinscatering.com',
                            city: data.location ? data.location.split(',')[0] : 'Unknown City',
                            state: data.location ? data.location.split(',')[1]?.trim() : 'Unknown State',
                            censusTract: data.censusTract,
                            badges: data.impactFlags
                        }}
                        contact={{
                            name: data.name,
                            pronouns: getPronouns(data.gender),
                            role: data.role,
                            isOwner: true,
                            ownershipPercentage: 100,
                            phone: data.phone,
                            email: data.email,
                            preferredMethod: data.preferredContact,
                            creditRange: data.creditScore
                        }}
                    />

                    {/* 3. Loan Intent */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col gap-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>


                        <div className="flex flex-col md:flex-row gap-6 relative z-10">
                            <div className="flex-1 space-y-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <TrendingUp size={20} className="text-blue-600" />
                                    Loan Request
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Amount</div>
                                        <div className="text-2xl font-bold text-slate-900">{data.loanAmount}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-slate-500 uppercase tracking-wide">Timeline</div>
                                        <div className="text-base font-medium text-amber-600 flex items-center gap-1">
                                            <Clock size={14} />
                                            {data.timeline}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">Purpose</div>
                                    <div className="font-medium text-slate-800">{data.loanPurpose}</div>
                                    <div className="text-sm text-slate-500 mt-1">{data.purposeDetail}</div>
                                </div>
                            </div>

                            <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 flex flex-col justify-center space-y-4">
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Readiness Level</div>
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                        {data.readinessLevel}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-slate-500 mb-1">Active TA Client?</div>
                                    <div className="font-medium text-slate-700 flex items-center gap-2">
                                        {data.isTaClient ? (
                                            <><CircleCheck size={16} className="text-emerald-500" /> Yes</>
                                        ) : 'No'}
                                    </div>
                                </div>
                            </div>
                        </div>



                        {/* Lending Decision Section (Merged into Loan Intent Card or Separate?) - Going inside Intent for context */}
                        <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col md:flex-row gap-6 items-start relative z-10">
                            <div className="flex-1">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-2">
                                    <ShieldCheck size={14} className="text-blue-500" /> Lending Decision
                                </h4>

                                {!assignedPrograms || assignedPrograms.length === 0 ? (
                                    <div className="bg-slate-50 result-item rounded-lg p-4 border border-slate-200 border-dashed flex flex-col items-center justify-center gap-2 group hover:border-blue-300 transition-colors py-6">
                                        <div className="p-2 bg-white rounded-full text-slate-400 mb-1 border border-slate-100 shadow-sm">
                                            <MousePointerClick size={20} />
                                        </div>
                                        <div className="text-sm text-slate-500 italic text-center">No loan programs selected.<br />Assign eligible programs for this request.</div>
                                        <button
                                            onClick={() => setIsProgramSelectorOpen(true)}
                                            className="mt-2 text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 flex items-center gap-2"
                                        >
                                            <Plus size={14} /> Assign Program(s)
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center px-1">
                                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                                Selected Loan Programs ({assignedPrograms.length})
                                            </div>
                                            <button
                                                onClick={() => setIsProgramSelectorOpen(true)}
                                                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors"
                                            >
                                                + Add More
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            {assignedPrograms.map(progId => {
                                                const prog = programs.find(p => p.id === progId);
                                                if (!prog) return null;
                                                return (
                                                    <SelectedProgramCard
                                                        key={prog.id}
                                                        program={prog}
                                                        onViewDetails={(p) => setSelectedProgramForDetails(p)}
                                                        onViewDocs={(p) => setSelectedProgramForDocs(p)}
                                                        onRemove={(id) => {
                                                            if (confirm('Remove this program from the Lead? This does not affect the Loan Program definition.')) {
                                                                handleRemoveProgram(id);
                                                            }
                                                        }}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="w-full md:w-48 hidden md:block">
                                {/* Spacer to align with right column of intent card if needed, or just leave empty */}
                            </div>
                        </div>
                    </div>

                    <LoanProgramSelector
                        isOpen={isProgramSelectorOpen}
                        onClose={() => setIsProgramSelectorOpen(false)}
                        onSelect={handleProgramSelect}
                        currentProgramIds={assignedPrograms}
                    />

                    <ReadinessChecklistDrawer
                        isOpen={isReadinessDrawerOpen}
                        onClose={() => setIsReadinessDrawerOpen(false)}
                        readinessData={readiness}
                        onAction={handleReadinessAction}
                    />

                    <RequiredDocumentsModal
                        isOpen={!!selectedProgramForDocs}
                        onClose={() => setSelectedProgramForDocs(null)}
                        program={selectedProgramForDocs}
                        onOpenFullDetails={(p) => {
                            setSelectedProgramForDocs(null); // Close doc modal
                            setSelectedProgramForDetails(p); // Open details drawer
                        }}
                    />

                    <ProgramDetailsDrawer
                        isOpen={!!selectedProgramForDetails}
                        onClose={() => setSelectedProgramForDetails(null)}
                        program={selectedProgramForDetails}
                    />

                    {/* 4. Action Center (Tasks) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                <SquareCheck size={14} /> Next Steps
                            </h3>
                            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                <Plus size={16} />
                            </button>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {data.nextSteps.map(task => (
                                <div key={task.id} className="p-4 flex items-center justify-between hover:bg-slate-50 group transition-colors">
                                    <div className="flex items-center gap-3">
                                        <button className="w-5 h-5 rounded border border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-colors"></button>
                                        <div>
                                            <div className="text-sm font-medium text-slate-800 group-hover:text-blue-700 transition-colors">{task.text}</div>
                                            <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                                                <span className={`font-medium ${task.priority === 'high' ? 'text-amber-600' : 'text-slate-500'}`}>
                                                    {task.due}
                                                </span>
                                                {task.type === 'system' && (
                                                    <span className="px-1.5 rounded bg-slate-100 text-slate-500 text-[10px]">rec.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Do it
                                    </button>
                                </div>
                            ))}
                            <div className="p-3 text-center">
                                <button className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                                    + Add Review Task
                                </button>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column (1/3) */}
                <div className="space-y-6">

                    {/* 5. Quick Actions (Sticky-ish) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-3">
                        <CallPrimaryWidget
                            context={{ type: 'Lead', id: data.id, name: data.businessName }} // Business name as lead context name? Or lead name?
                            contact={{ name: data.name, phone: data.phone, role: data.role }}
                            onLogActivity={onLogActivity}
                            variant="full-width" // New variant needed for full width style?
                        />
                        <button className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 rounded-lg font-medium transition-colors">
                            <Mail size={16} /> Email Details
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 py-2 bg-white border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 rounded-lg font-medium transition-colors">
                            <FileText size={16} /> Request Docs
                        </button>
                        <div className="h-px bg-slate-100 my-2"></div>
                        <ProgressiveButton
                            progress={readiness.score}
                            onClick={handleConvertClick}
                        />
                    </div>

                    {/* 6. Recent Activity & Insight */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activity</h3>
                            <a href="#" className="text-xs text-blue-600 hover:underline">View All</a>
                        </div>
                        <div className="p-5 space-y-6">
                            <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                                {data.recentActivity.map(item => (
                                    <div key={item.id} className="relative">
                                        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 bg-white ${item.type === 'call' ? 'border-emerald-500' :
                                            item.type === 'email' ? 'border-blue-500' :
                                                'border-slate-400'
                                            }`}></div>
                                        <div className="text-xs font-medium text-slate-500 mb-0.5">{item.time}</div>
                                        <div className="text-sm text-slate-700 leading-snug">{item.summary}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-3 bg-amber-50 border-t border-amber-100">
                            <div className="flex gap-2 items-start">
                                <StickyNote size={14} className="text-amber-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                                    Latest Insight: Borrower is exploring other lenders. Quick follow-up on readiness needed.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 7. Related Context */}
                    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Related Context</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 shadow-sm">
                                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                    <Building2 size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-slate-500 uppercase">Referring Partner</div>
                                    <div className="text-sm font-bold text-slate-800 truncate">Detroit Econ Club</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white rounded border border-slate-200 shadow-sm">
                                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                    <ShieldCheck size={16} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium text-slate-500 uppercase">TA History</div>
                                    <div className="text-sm font-bold text-slate-800">2 Completed Sessions</div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Helper Components
const ReadinessCard = ({ label, value, status }) => {
    const colors = {
        success: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        warning: 'bg-amber-50 text-amber-700 border-amber-100',
        neutral: 'bg-slate-50 text-slate-600 border-slate-200',
        error: 'bg-red-50 text-red-700 border-red-100'
    };

    return (
        <div className={`p-3 rounded-lg border ${colors[status]} flex flex-col justify-center items-center text-center shadow-sm`}>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{label}</div>
            <div className="font-bold text-sm md:text-base leading-tight">{value}</div>
        </div>
    );
};

export default LeadSummaryView;
