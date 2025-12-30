import React, { useState } from 'react';
import { User, FileText, ArrowRight, Download, Shield, Award, Clock } from 'lucide-react';
import ImpactRecap from './ImpactRecap';

const UserProfile = () => {
    const [showRecap, setShowRecap] = useState(false);

    if (showRecap) {
        return <ImpactRecap onClose={() => setShowRecap(false)} />;
    }

    return (
        <div className="p-8 max-w-5xl mx-auto animate-in fade-in duration-500">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-8 flex items-start gap-8">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg shrink-0 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
                        alt="Alex Morgan"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-1">Alex Morgan</h1>
                            <p className="text-lg text-slate-500 font-medium">Loan Officer • Enterprise Team</p>
                        </div>
                        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                            Edit Profile
                        </button>
                    </div>

                    <div className="flex gap-6 mt-6">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Shield size={18} className="text-blue-500" />
                            <span className="text-sm">Admin Access</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Award size={18} className="text-amber-500" />
                            <span className="text-sm">Top Performer (Q3)</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                            <Clock size={18} className="text-emerald-500" />
                            <span className="text-sm">Active since 2021</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* My Hits & Misses CTA Card */}
            <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden group">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-white/10 transition-all duration-700"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl group-hover:bg-blue-400/20 transition-all duration-700"></div>

                <div className="relative z-10 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wider uppercase mb-4 text-blue-200">
                        <FileText size={12} />
                        New Feature
                    </div>

                    <h2 className="text-3xl font-bold mb-4 font-serif relative">
                        My Hits & Misses: <span className="text-blue-300">Your Impact Story</span>
                    </h2>

                    <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                        Explore a reflective narrative of your year. See where your efforts paid off, where opportunities slipped away, and uncover the hidden patterns in your work—without judgement or rankings.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={() => setShowRecap(true)}
                            className="px-8 py-3.5 bg-white text-blue-900 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            Open My Hits & Misses
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Other Profile Sections Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 opacity-50 pointer-events-none grayscale">
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                    <h3 className="font-bold text-slate-400 mb-4">Account Settings</h3>
                    <div className="space-y-4">
                        <div className="h-10 bg-slate-200 rounded w-full"></div>
                        <div className="h-10 bg-slate-200 rounded w-2/3"></div>
                    </div>
                </div>
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50">
                    <h3 className="font-bold text-slate-400 mb-4">Notifications</h3>
                    <div className="space-y-4">
                        <div className="h-24 bg-slate-200 rounded w-full"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
