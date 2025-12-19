import React, { useState, useRef, useEffect } from 'react';
import {
    Calendar, MoreVertical, Edit2, ArrowRightLeft,
    AlertTriangle, FileText, Trash2, CheckCircle, Clock, Check
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const TaskItem = ({ task }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
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

    const toggleMenu = (e) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuAction = (e, action) => {
        e.stopPropagation();
        console.log(`Action: ${action} for task`);
        setIsMenuOpen(false);
    };

    const handleToggleComplete = (e) => {
        e.stopPropagation();
        setIsCompleted(!isCompleted);
    };

    const PriorityBadge = ({ priority }) => {
        const styles = {
            High: 'text-red-600 bg-red-50 border-red-100',
            Med: 'text-orange-600 bg-orange-50 border-orange-100',
            Low: 'text-slate-600 bg-slate-50 border-slate-100'
        };
        return (
            <span className={twMerge("text-[10px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider", styles[priority])}>
                {priority}
            </span>
        );
    };

    return (
        <div className={twMerge(
            "bg-white border border-slate-200 rounded-lg p-3 shadow-sm transition-all group cursor-pointer relative",
            isCompleted ? "bg-slate-50" : "hover:border-slate-300"
        )}>
            <div className="flex items-start gap-3">
                <div className="mt-0.5">
                    <div className={twMerge(
                        "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                        task.priority === 'High' ? "border-red-400 bg-red-50" : "border-slate-300 bg-slate-50"
                    )}>
                        {/* Static Priority/Status Indicator */}
                        {isCompleted && <Check size={10} className="text-emerald-600" strokeWidth={4} />}
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                        <div className={twMerge(
                            "text-sm font-medium leading-tight mb-1 transition-colors truncate",
                            isCompleted ? "text-slate-400 line-through" : "text-slate-900 group-hover:text-blue-600"
                        )}>
                            {task.title}
                        </div>

                        {/* Kebab Menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={toggleMenu}
                                className={twMerge(
                                    "text-slate-400 hover:text-blue-600 transition-colors p-0.5 rounded opacity-0 group-hover:opacity-100",
                                    isMenuOpen ? "opacity-100 bg-slate-100 text-blue-600" : ""
                                )}
                            >
                                <MoreVertical size={14} />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-6 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 animate-in fade-in zoom-in-95 duration-200 z-50 text-left">
                                    <button onClick={(e) => handleMenuAction(e, 'edit')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <Edit2 size={12} className="text-slate-400" /> Edit Task
                                    </button>
                                    <button onClick={(e) => handleMenuAction(e, 'reschedule')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <Clock size={12} className="text-slate-400" /> Change Due Date
                                    </button>
                                    <button onClick={(e) => handleMenuAction(e, 'reassign')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <ArrowRightLeft size={12} className="text-slate-400" /> Reassign
                                    </button>

                                    <div className="h-px bg-slate-100 my-1"></div>

                                    <button onClick={(e) => handleMenuAction(e, 'blocker')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-amber-600 flex items-center gap-2">
                                        <AlertTriangle size={12} className="text-amber-500" /> Mark as Blocker
                                    </button>
                                    <button onClick={(e) => handleMenuAction(e, 'convert')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                        <FileText size={12} className="text-slate-400" /> Convert to Note
                                    </button>

                                    <div className="h-px bg-slate-100 my-1"></div>

                                    <button onClick={(e) => handleMenuAction(e, 'delete')} className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                                        <Trash2 size={12} className="text-red-500" /> Delete Task
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer with Button */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                            <PriorityBadge priority={task.priority} />
                            <span className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                                <Calendar size={10} /> {task.due}
                            </span>
                        </div>

                        {!isCompleted && (
                            <button
                                onClick={handleToggleComplete}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-600 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all shadow-sm"
                            >
                                <Check size={10} /> Mark Done
                            </button>
                        )}
                        {isCompleted && (
                            <button
                                onClick={handleToggleComplete}
                                className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 transition-all"
                            >
                                <CheckCircle size={10} /> Completed
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskItem;
