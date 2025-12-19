import React, { useState } from 'react';
import { CheckCircle2, Clock, AlertCircle, Calendar, ArrowRight, X } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export const TaskEngineWidget = ({ steps = [], loanId, onComplete }) => {
    // Group tasks logic
    const groupedTasks = {
        overdue: steps.filter(s => s.urgency === 'high' && !s.completed),
        today: steps.filter(s => s.urgency === 'medium' && !s.completed),
        upcoming: steps.filter(s => s.urgency === 'low' && !s.completed),
    };

    const hasTasks = steps.some(s => !s.completed);

    return (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
            <div className="p-6 pb-2 border-b border-slate-50">
                <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-slate-900 text-lg">Next Steps</h3>
                    <button className="text-blue-600 text-sm font-medium hover:text-blue-700">View All</button>
                </div>
                <p className="text-slate-500 text-xs">
                    {steps.filter(s => !s.completed).length} pending tasks for <span className="font-mono text-slate-700">{loanId}</span>
                </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {!hasTasks && (
                    <div className="text-center py-8 text-slate-500 text-sm italic">
                        All caught up! No pending tasks.
                    </div>
                )}

                {/* Overdue / High Priority */}
                {groupedTasks.overdue.length > 0 && (
                    <TaskGroup
                        title="Critical Attention"
                        color="red"
                        tasks={groupedTasks.overdue}
                        loanId={loanId}
                        onComplete={onComplete}
                    />
                )}

                {/* Today / Medium */}
                {groupedTasks.today.length > 0 && (
                    <TaskGroup
                        title="Due Today"
                        color="orange"
                        tasks={groupedTasks.today}
                        loanId={loanId}
                        onComplete={onComplete}
                    />
                )}

                {/* Upcoming / Low */}
                {groupedTasks.upcoming.length > 0 && (
                    <TaskGroup
                        title="Upcoming"
                        color="blue"
                        tasks={groupedTasks.upcoming}
                        loanId={loanId}
                        onComplete={onComplete}
                    />
                )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-slate-600 text-sm font-medium hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm">
                    + Add New Task
                </button>
            </div>
        </div>
    );
};

const TaskGroup = ({ title, color, tasks, loanId, onComplete }) => {
    const colorStyles = {
        red: "text-red-700 bg-red-50",
        orange: "text-amber-700 bg-amber-50",
        blue: "text-blue-700 bg-blue-50",
        slate: "text-slate-700 bg-slate-50"
    };

    const dotColors = {
        red: "bg-red-500",
        orange: "bg-amber-500",
        blue: "bg-blue-500",
        slate: "bg-slate-400"
    }

    return (
        <div>
            <div className={`px-3 py-1.5 rounded-md inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3 ${colorStyles[color]}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${dotColors[color]}`}></span>
                {title}
            </div>
            <div className="space-y-3">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} loanId={loanId} onComplete={onComplete} />
                ))}
            </div>
        </div>
    )
}

const TaskCard = ({ task, loanId, onComplete }) => (
    <div className="group bg-white border border-slate-100 hover:border-blue-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-200 relative">
        <div className="flex gap-3 mb-3">
            <div className="mt-0.5">
                <div className={`w-2 h-2 rounded-full ${task.urgency === 'high' ? 'bg-red-500' : task.urgency === 'medium' ? 'bg-amber-500' : 'bg-blue-400'} animate-pulse`}></div>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-slate-800 leading-tight mb-1">{task.text}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[10px]">{loanId}</span>
                    <span>•</span>
                    <span className="text-slate-400">Due {task.due}</span>
                </div>
            </div>
        </div>

        <div className="flex gap-2">
            <button className="flex-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm shadow-blue-200">
                Open Loan
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
                className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5"
            >
                <CheckCircle2 size={14} />
                Mark Done
            </button>
        </div>
    </div>
)

export const NotificationsWidget = ({ notifications = [] }) => {
    // ... (keep existing implementation)
    return (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                <button className="text-slate-400 hover:text-slate-600">
                    <Clock size={16} />
                </button>
            </div>
            <div className="space-y-6">
                {notifications.length > 0 ? (
                    notifications.map(notif => (
                        <div key={notif.id} className="flex gap-4">
                            <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${notif.type === 'error' ? 'bg-red-500' :
                                    notif.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                                }`} />
                            <div>
                                <p className="text-sm text-slate-600 leading-snug">{notif.text}</p>
                                <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-slate-500 text-sm italic">No new notifications.</p>
                )}
            </div>
        </div>
    );
};
