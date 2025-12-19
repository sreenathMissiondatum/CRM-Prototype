import React, { useState, useRef, useEffect } from 'react';
import {
    Lightbulb, Pin, CheckSquare, MoreVertical, Edit2,
    ArrowRight, AlertTriangle, Trash2, Clock, FileText, CheckCircle
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const NoteItem = ({ note }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const isInsight = note.type === 'insight';

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
        console.log(`Action: ${action} for note`);
        setIsMenuOpen(false);
    };

    return (
        <div className={twMerge(
            "rounded-xl p-3 border relative group transition-all",
            isInsight ? "bg-indigo-50/50 border-indigo-100" : "bg-slate-50 border-slate-100"
        )}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
                {isInsight && (
                    <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                        <Lightbulb size={12} />
                    </div>
                )}
                {isInsight && (
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wide">Insight</span>
                )}

                <span className="text-[10px] text-slate-400 ml-auto">{note.timestamp}</span>

                {/* Kebab Menu */}
                <div className="relative ml-1" ref={menuRef}>
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
                                <Edit2 size={12} className="text-slate-400" /> Edit Note
                            </button>
                            <button onClick={(e) => handleMenuAction(e, 'pin')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                <Pin size={12} className="text-slate-400" /> Pin Note
                            </button>
                            <button onClick={(e) => handleMenuAction(e, 'convert')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                <CheckSquare size={12} className="text-slate-400" /> Convert to Task
                            </button>

                            <div className="h-px bg-slate-100 my-1"></div>

                            <button onClick={(e) => handleMenuAction(e, 'decision')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-2">
                                <CheckCircle size={12} className="text-emerald-500" /> Mark as Decision
                            </button>
                            <button onClick={(e) => handleMenuAction(e, 'history')} className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2">
                                <Clock size={12} className="text-slate-400" /> View Edit History
                            </button>

                            <div className="h-px bg-slate-100 my-1"></div>

                            <button onClick={(e) => handleMenuAction(e, 'delete')} className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2">
                                <Trash2 size={12} className="text-red-500" /> Delete Note
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="text-sm text-slate-700 leading-relaxed mb-3">
                {note.content}
            </div>

            {/* Footer */}
            <div className={twMerge(
                "flex items-center justify-between pt-2 border-t",
                isInsight ? "border-indigo-100/50" : "border-slate-100"
            )}>
                <div className="flex items-center gap-1.5">
                    {note.authorInitials && (
                        <div className={twMerge(
                            "w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold",
                            isInsight ? "bg-indigo-200 text-indigo-700" : "bg-slate-200 text-slate-600"
                        )}>
                            {note.authorInitials}
                        </div>
                    )}
                    <span className="text-[10px] font-medium text-slate-500">
                        {note.author} {note.role && `• ${note.role}`}
                    </span>
                </div>

                {/* Secondary Quick Actions (on hover) */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                    <button
                        onClick={(e) => handleMenuAction(e, 'pin')}
                        className={twMerge("hover:text-indigo-600", isInsight ? "text-slate-400" : "text-slate-300")}
                        title="Pin Note"
                    >
                        <Pin size={12} />
                    </button>
                    <button
                        onClick={(e) => handleMenuAction(e, 'convert')}
                        className={twMerge("hover:text-indigo-600", isInsight ? "text-slate-400" : "text-slate-300")}
                        title="Create Task"
                    >
                        <CheckSquare size={12} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NoteItem;
