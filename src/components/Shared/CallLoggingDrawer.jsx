import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    X, Clock, Phone, User, Calendar, CheckCircle,
    AlertCircle, MessageSquare, Briefcase, FileText
} from 'lucide-react';

const CallLoggingDrawer = ({ isOpen, onClose, onSave, context, contact }) => {
    // Local State
    const [outcome, setOutcome] = useState('');
    const [notes, setNotes] = useState('');
    const [duration, setDuration] = useState('00:00');
    const [isTimerRunning, setIsTimerRunning] = useState(true);
    const [followUp, setFollowUp] = useState(false);
    const [followUpType, setFollowUpType] = useState('Call');
    const [followUpDate, setFollowUpDate] = useState('');

    // Timer Logic
    useEffect(() => {
        let interval;
        if (isOpen && isTimerRunning) {
            let seconds = 0;
            interval = setInterval(() => {
                seconds++;
                const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
                const secs = (seconds % 60).toString().padStart(2, '0');
                setDuration(`${mins}:${secs}`);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isOpen, isTimerRunning]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!outcome) {
            alert('Please select a call outcome.');
            return;
        }

        const activityData = {
            type: 'Call',
            direction: 'Outbound',
            outcome,
            duration,
            notes,
            context,
            contact,
            date: new Date().toISOString(),
            followUp: followUp ? {
                type: followUpType,
                date: followUpDate || 'Tomorrow',
                status: 'Pending'
            } : null
        };

        onSave(activityData);
        onClose();
    };

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="relative z-10 w-[400px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Phone size={18} className="text-blue-600" />
                            Log Call
                        </h2>
                        <div className="text-xs text-slate-500 mt-1">
                            Logging to: <span className="font-semibold text-slate-700">{context?.type} • {context?.name}</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Contact Info Card */}
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-200">
                            {contact?.name.charAt(0)}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">{contact?.name}</div>
                            <div className="text-xs text-slate-500">{contact?.role}</div>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-blue-700 font-medium">
                                <Phone size={12} /> {contact?.phone}
                            </div>
                        </div>
                    </div>

                    {/* Timer / Duration */}
                    <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                            <Clock size={16} /> Duration
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-lg font-bold text-slate-800 tracking-wider">
                                {duration}
                            </span>
                            <button
                                onClick={() => setIsTimerRunning(!isTimerRunning)}
                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border ${isTimerRunning ? 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100'}`}
                            >
                                {isTimerRunning ? 'Stop' : 'Resume'}
                            </button>
                        </div>
                    </div>

                    {/* Outcome */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Call Outcome <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-2 gap-2">
                            {['Reached', 'Voicemail', 'No Answer', 'Wrong Number'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setOutcome(opt)}
                                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${outcome === opt
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">Call Notes</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Type details about the conversation..."
                            className="w-full h-32 p-3 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                        />
                    </div>

                    {/* Follow Up Toggle */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Calendar size={16} className="text-slate-500" />
                                <span className="text-sm font-bold text-slate-700">Schedule Follow-up?</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={followUp} onChange={(e) => setFollowUp(e.target.checked)} className="sr-only peer" />
                                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {followUp && (
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 animate-in slide-in-from-top-2">
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">Type</label>
                                    <select
                                        value={followUpType}
                                        onChange={(e) => setFollowUpType(e.target.value)}
                                        className="w-full px-2 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none"
                                    >
                                        <option>Call</option>
                                        <option>Meeting</option>
                                        <option>Task</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-slate-500 mb-1 block">When</label>
                                    <select
                                        value={followUpDate}
                                        onChange={(e) => setFollowUpDate(e.target.value)}
                                        className="w-full px-2 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none"
                                    >
                                        <option value="">Select...</option>
                                        <option value="Tomorrow">Tomorrow</option>
                                        <option value="Next Week">Next Week</option>
                                        <option value="In 2 Days">In 2 Days</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <CheckCircle size={16} /> Save Activity
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CallLoggingDrawer;
