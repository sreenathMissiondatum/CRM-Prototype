import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, Shield, Lock, Clock } from 'lucide-react';
import AvatarWithPresence from './AvatarWithPresence';

const ChatContextPanel = ({ isOpen, onClose, contact, leadTitle }) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'system',
            text: 'This is a secure, monitored channel. All messages are archived for compliance.',
            timestamp: new Date().toISOString()
        }
    ]);
    const messagesEndRef = useRef(null);

    // Scroll to bottom on new message
    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Add user message
        const newMsg = {
            id: messages.length + 1,
            sender: 'me',
            text: message,
            timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, newMsg]);
        setMessage('');

        // Mock reply for fun/demo (optional, keeping it enterprise-y so maybe no auto-reply)
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end pointer-events-none">
            {/* Backdrop - Click to close */}
            <div
                className="absolute inset-0 bg-black/20 pointer-events-auto transition-opacity"
                onClick={onClose}
            ></div>

            {/* Panel */}
            <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col pointer-events-auto transform transition-transform duration-300 slide-in-from-right">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-3">
                        <AvatarWithPresence
                            src={contact?.avatar}
                            initials={contact?.name?.charAt(0)}
                            name={contact?.name}
                            status={contact?.status}
                            lastActive={contact?.lastActive}
                            size="md"
                        />
                        <div>
                            <h3 className="font-bold text-slate-900">{contact?.name || 'Unknown Contact'}</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs text-slate-500 font-medium">{leadTitle || 'Lead Discussion'}</span>
                                {contact?.status === 'busy' && (
                                    <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                                        Responses may be delayed
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Sub-header: Compliance Banner */}
                <div className="bg-slate-50 px-6 py-2 border-b border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                    <Lock size={10} /> End-to-End Encrypted & Audited
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'system' ? (
                                <div className="w-full flex justify-center my-4">
                                    <div className="bg-slate-100 text-slate-500 text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
                                        <Shield size={12} /> {msg.text}
                                    </div>
                                </div>
                            ) : (
                                <div className={`max-w-[80%] space-y-1 ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                                    <div
                                        className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.sender === 'me'
                                                ? 'bg-blue-600 text-white rounded-tr-none'
                                                : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                    <div className={`text-[10px] text-slate-400 flex items-center gap-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                        {msg.sender === 'me' && <Clock size={10} />}
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Footer Input */}
                <div className="p-4 border-t border-slate-200 bg-white">
                    <form onSubmit={handleSend} className="relative">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type a secure message..."
                            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                            autoFocus
                        />
                        <div className="absolute right-2 top-1.5 flex items-center gap-1">
                            {/* Paperclip placeholder */}
                            <button type="button" className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="Attach File (Disabled)">
                                <Paperclip size={16} />
                            </button>
                            <button
                                type="submit"
                                disabled={!message.trim()}
                                className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                    <div className="mt-2 text-center">
                        <p className="text-[10px] text-slate-400">
                            Press Enter to send. Shift + Enter for new line.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatContextPanel;
