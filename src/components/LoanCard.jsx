import React, { useState, useRef, useEffect } from 'react';
import {
    MoreHorizontal, MessageSquare, FileText, Eye, Clock, AlertCircle, Info, ChevronUp, ChevronDown, Activity, ShieldAlert, ArrowRight,
    MoreVertical, ArrowRightLeft, PauseCircle, XCircle, History, FileOutput
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const LoanCard = ({ loan, isSelected, onClick }) => {
    const [showPercent, setShowPercent] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const handleMenuToggle = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuAction = (e, action) => {
        e.stopPropagation();
        console.log(`Action: ${action} for loan ${loan.id}`);
        setIsMenuOpen(false);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'active':
            case 'funded': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'review': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'underwriting': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'pending':
            case 'stalled': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const handleExpandClick = (e) => {
        e.stopPropagation();
        setIsExpanded(!isExpanded);
    };

    const hasWarning = loan.insights?.hasWarning;

    return (
        <div
            onClick={onClick}
            className={twMerge(
                "bg-white rounded-xl border transition-all duration-300 group cursor-pointer relative overflow-hidden",
                isSelected
                    ? "border-blue-500 ring-1 ring-blue-500 shadow-lg shadow-blue-900/5"
                    : "border-slate-200 hover:border-blue-300 hover:shadow-md",
                isExpanded ? "shadow-xl ring-0 border-slate-300 p-0" : "p-4"
            )}
        >
            {isSelected && !isExpanded && (
                <div className="absolute -left-px top-4 bottom-4 w-1 bg-blue-600 rounded-r"></div>
            )}

            {/* Main Card Content */}
            <div className={twMerge("transition-all duration-300", isExpanded ? "p-5 pb-3 bg-slate-50/50" : "")}>
                {/* Header: ID and Status */}
                <div className="flex justify-between items-center mb-3 pl-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-slate-100 text-slate-500 text-[10px] font-mono py-0.5 px-1.5 rounded">
                            {loan.id}
                        </span>
                        <span className={twMerge(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide",
                            getStatusColor(loan.status)
                        )}>
                            {loan.status}
                        </span>
                    </div>

                    {/* Expansion Trigger & Menu */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={handleExpandClick}
                            className={twMerge(
                                "p-1.5 rounded-full transition-colors relative z-10",
                                isExpanded ? "bg-slate-200 text-slate-600" : "hover:bg-slate-100",
                                !isExpanded && hasWarning ? "text-amber-500 animate-pulse" : "text-slate-400"
                            )}
                        >
                            {hasWarning ? <AlertCircle size={16} /> : <Info size={16} />}
                        </button>

                        <div className="relative z-20" ref={menuRef}>
                            <button
                                onClick={handleMenuToggle}
                                className={twMerge(
                                    "p-1.5 rounded-md transition-colors",
                                    isMenuOpen ? "bg-slate-100 text-blue-600" : "text-slate-400 hover:text-blue-600 hover:bg-slate-50"
                                )}
                            >
                                <MoreVertical size={16} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 animate-in fade-in zoom-in-95 duration-200 z-50 text-left">
                                    <div className="px-3 py-2 border-b border-slate-50">
                                        <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Loan Actions</span>
                                    </div>

                                    <button onClick={(e) => handleMenuAction(e, 'view_details')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <Eye size={14} className="text-slate-400" /> View Details
                                    </button>
                                    <button onClick={(e) => handleMenuAction(e, 'view_docs')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <FileText size={14} className="text-slate-400" /> Documents
                                    </button>
                                    <button onClick={(e) => handleMenuAction(e, 'view_timeline')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <Activity size={14} className="text-slate-400" /> Timeline
                                    </button>

                                    <div className="h-px bg-slate-100 my-1"></div>

                                    <button onClick={(e) => handleMenuAction(e, 'change_stage')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <ArrowRight size={14} className="text-slate-400" /> Change Stage
                                    </button>
                                    <button onClick={(e) => handleMenuAction(e, 'reassign')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <ArrowRightLeft size={14} className="text-slate-400" /> Reassign
                                    </button>

                                    <div className="h-px bg-slate-100 my-1"></div>

                                    <button onClick={(e) => handleMenuAction(e, 'hold')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <PauseCircle size={14} className="text-slate-400" /> Put on Hold
                                    </button>
                                    <button onClick={(e) => handleMenuAction(e, 'withdraw')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <XCircle size={14} className="text-slate-400" /> Withdraw
                                    </button>

                                    <div className="h-px bg-slate-100 my-1"></div>

                                    <button onClick={(e) => handleMenuAction(e, 'audit')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <History size={14} className="text-slate-400" /> Audit History
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Info */}
                <div className="flex justify-between items-start mb-4 pl-2">
                    <div>
                        <h3 className="text-base font-bold text-blue-600 truncate max-w-[180px]">{loan.applicantName}</h3>
                        <p className="text-slate-400 text-xs truncate">Business Expansion</p>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-slate-900 leading-tight">{loan.amount}</div>
                        <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Amount</div>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-4 pl-2">
                    <div
                        className="flex justify-between text-xs mb-1.5 align-bottom cursor-pointer select-none"
                        onMouseEnter={() => setShowPercent(true)}
                        onMouseLeave={() => setShowPercent(false)}
                    >
                        {showPercent ? (
                            <span className="text-blue-600 font-bold text-[11px] animate-in fade-in duration-200">
                                Completion: {loan.progress}%
                            </span>
                        ) : (
                            <span className="text-slate-900 font-semibold text-[11px] animate-in fade-in duration-200">
                                <span className="text-slate-500 font-normal mr-1">Stage:</span>
                                {loan.stageName}
                            </span>
                        )}

                        <span className="text-slate-400 font-medium text-[10px]">
                            ({loan.currentStep}/{loan.totalSteps})
                        </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${loan.progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Expanded Quick Insights Section */}
            <div
                className={twMerge(
                    "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out bg-white",
                    isExpanded ? "max-h-96 opacity-100 border-t border-slate-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="p-5 pt-4 space-y-4">
                    <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Activity size={14} className="text-blue-500" />
                            Quick Insights
                        </h4>
                    </div>

                    {/* Blockers */}
                    {(loan.insights?.blockers && loan.insights.blockers.length > 0) ? (
                        <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                            <h5 className="text-[11px] font-bold text-red-800 mb-1 flex items-center gap-1.5">
                                <ShieldAlert size={12} />
                                CRITICAL BLOCKERS
                            </h5>
                            <ul className="space-y-1">
                                {loan.insights.blockers.map((blocker, idx) => (
                                    <li key={idx} className="text-xs text-red-700 pl-4 relative before:content-['•'] before:absolute before:left-1 before:text-red-400">
                                        {blocker}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            On Track: No critical blockers.
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 uppercase font-semibold">Latest Activity</p>
                        <p className="text-xs text-slate-600">{loan.insights?.lastActivity || 'No recent activity recorded.'}</p>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                        {loan.insights?.quickActions?.map((action, idx) => (
                            <button key={idx} className="text-xs font-medium bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 py-1.5 px-3 rounded-md transition-colors text-center truncate">
                                {action}
                            </button>
                        ))}
                    </div>

                    {/* Collapse Trigger at Bottom */}
                    <div className="flex justify-center pt-1">
                        <button
                            onClick={handleExpandClick}
                            className="text-slate-300 hover:text-slate-500 transition-colors"
                        >
                            <ChevronUp size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Footer (Hidden when Expanded for cleaner look, or could be kept) */}
            {!isExpanded && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-100 pl-2 p-4">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-200 rounded-md text-slate-600 hover:text-blue-600 transition-all text-xs font-medium">
                        <Eye size={14} />
                        <span>View Details</span>
                    </button>

                    <div className="flex gap-1">
                        <ActionBtn icon={MessageSquare} />
                        <ActionBtn icon={FileText} />
                    </div>
                </div>
            )}
        </div>
    );
};

const ActionBtn = ({ icon: Icon }) => (
    <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-md transition-colors">
        <Icon size={16} />
    </button>
);

export default LoanCard;
