import React, { useState } from 'react';
import { Bell, Search, User, Check, ChevronDown, Repeat } from 'lucide-react';

const Header = ({ onNavigate, user, onSwitchUser }) => {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const demoUsers = [
        { firstName: 'Alex', lastName: 'Morgan', jobTitle: 'Loan Officer', role: 'Loan Officer', email: 'alex.morgan@acmelending.com', profilePhotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200' },
        { firstName: 'Mark', lastName: 'Taylor', jobTitle: 'Underwriter', role: 'Underwriter', email: 'mark.taylor@acmelending.com', profilePhotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200' },
        { firstName: 'Rachel', lastName: 'Kim', jobTitle: 'Credit Manager', role: 'Credit Manager', email: 'rachel.kim@acmelending.com', profilePhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200' },
        { firstName: 'Michael', lastName: 'Ross', jobTitle: 'Credit Officer', role: 'Credit Officer', email: 'michael.ross@acmelending.com', profilePhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200' },
        { firstName: 'Emily', lastName: 'Chen', jobTitle: 'CC (Level 1)', role: 'Credit Committee', email: 'emily.chen@acmelending.com', profilePhotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200' },
        { firstName: 'David', lastName: 'Ross', jobTitle: 'CC (Level 2)', role: 'Credit Committee', email: 'david.ross@acmelending.com', profilePhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200' }
    ];

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 pl-28 sticky top-0 z-50">
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Good Morning, {user?.firstName}
                </h1>
                <p className="text-slate-500 text-sm">Here's what's happening today.</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search loans, clients..."
                        className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-64 text-sm transition-all"
                    />
                </div>

                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="relative">
                    <div
                        className="flex items-center gap-3 pl-6 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-900">{user?.firstName} {user?.lastName}</p>
                            <p className="text-xs text-slate-500">{user?.jobTitle}</p>
                        </div>
                        {user?.profilePhotoUrl ? (
                            <img src={user.profilePhotoUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                        ) : (
                            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                                {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </div>
                        )}
                        <ChevronDown size={14} className="text-slate-400" />
                    </div>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-20 py-2 animate-in fade-in zoom-in-95 duration-200">

                                {/* Current User Section */}
                                <div className="px-4 py-3 border-b border-slate-100 mb-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Logged in as</p>
                                    <div className="flex items-center gap-2">
                                        <div className="font-bold text-slate-900">{user?.firstName} {user?.lastName}</div>
                                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded border border-blue-100">
                                            {user?.role}
                                        </span>
                                    </div>
                                </div>

                                {/* Switch User Section */}
                                <div className="px-2">
                                    <p className="px-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2 flex items-center gap-1">
                                        <Repeat size={12} /> Switch User (Demo Only)
                                    </p>
                                    {demoUsers.map(demoUser => {
                                        const isActive = user?.email === demoUser.email;
                                        return (
                                            <button
                                                key={demoUser.email}
                                                onClick={() => {
                                                    onSwitchUser(demoUser);
                                                    setIsUserMenuOpen(false);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between group transition-colors 
                                                ${isActive ? 'bg-blue-50 text-blue-700' : 'hover:bg-slate-50 text-slate-700'}`}
                                            >
                                                <div>
                                                    <div className={`font-medium ${isActive ? 'text-blue-900' : 'text-slate-900'}`}>
                                                        {demoUser.firstName} {demoUser.lastName}
                                                    </div>
                                                    <div className={`text-xs ${isActive ? 'text-blue-500' : 'text-slate-500'}`}>
                                                        {demoUser.jobTitle}
                                                    </div>
                                                </div>
                                                {isActive && <Check size={16} className="text-blue-600" />}
                                            </button>
                                        )
                                    })}
                                </div>

                                {/* Link to Profile */}
                                <div className="mt-2 pt-2 border-t border-slate-100 px-2">
                                    <button
                                        onClick={() => { onNavigate('profile'); setIsUserMenuOpen(false); }}
                                        className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                    >
                                        View Profile Settings
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
