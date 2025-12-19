import React from 'react';
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 pl-28 sticky top-0 z-50">
            <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Good Morning, Alex
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

                <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900">Alex Morgan</p>
                        <p className="text-xs text-slate-500">Loan Officer</p>
                    </div>
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                        AM
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
