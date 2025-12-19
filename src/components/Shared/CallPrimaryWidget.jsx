import React, { useState } from 'react';
import { Phone, ChevronDown } from 'lucide-react';
import CallLoggingDrawer from './CallLoggingDrawer';

const CallPrimaryWidget = ({ context, contact, onLogActivity, variant = 'primary' }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleCall = () => {
        // Simulate initiating call logic here (e.g. system handler)
        console.log(`Initiating call to ${contact?.phone} for ${context?.name}`);

        // Open the logging drawer immediately
        setIsDrawerOpen(true);
    };

    const handleSaveActivity = (activityData) => {
        console.log('Call Activity Logged:', activityData);
        if (onLogActivity) {
            onLogActivity(activityData);
        }
    };

    if (!contact) {
        return (
            <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-400 rounded-lg text-sm font-bold cursor-not-allowed border border-slate-200" title="No primary contact linked">
                <Phone size={16} />
                <span className="hidden sm:inline">No Contact</span>
            </button>
        );
    }

    return (
        <>
            {variant === 'minimal' ? (
                <button
                    onClick={handleCall}
                    className="flex-1 flex items-center justify-center gap-2 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-md text-xs font-medium transition-colors"
                >
                    <Phone size={14} />
                    <span>Call</span>
                </button>
            ) : variant === 'full-width' ? (
                <button
                    onClick={handleCall}
                    className="w-full flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm shadow-blue-200 transition-colors"
                >
                    <Phone size={16} /> Call Primary
                </button>
            ) : (
                <div className="flex bg-blue-600 rounded-lg shadow-sm shadow-blue-200 overflow-hidden hover:bg-blue-700 transition-colors">
                    <button
                        onClick={handleCall}
                        className="flex items-center gap-2 px-3 py-2 text-white text-sm font-bold border-r border-blue-500 hover:bg-blue-800 transition-colors"
                    >
                        <Phone size={16} />
                        Call Primary
                    </button>
                    <div className="relative group">
                        <button className="px-2 py-2 h-full text-blue-100 hover:bg-blue-800 hover:text-white transition-colors">
                            <ChevronDown size={14} />
                        </button>
                        {/* Hover Dropdown for Context */}
                        <div className="absolute right-0 top-full pt-1 hidden group-hover:block z-20 w-48">
                            <div className="bg-white rounded-lg shadow-xl border border-slate-100 p-3">
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Contact</div>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                        {contact.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-800">{contact.name}</div>
                                        <div className="text-[10px] text-slate-500">{contact.phone}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsDrawerOpen(true)}
                                    className="w-full text-center py-1.5 text-xs font-medium bg-slate-50 text-slate-600 rounded hover:bg-slate-100"
                                >
                                    Log Call Manually
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CallLoggingDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onSave={handleSaveActivity}
                context={context}
                contact={contact}
            />
        </>
    );
};

export default CallPrimaryWidget;
