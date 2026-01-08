import React from 'react';
import { Mail, LayoutTemplate, Send, BarChart2, CheckCircle, AlertTriangle } from 'lucide-react';

const MarketingDashboard = ({ onNavigate }) => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Email Marketing</h2>
                    <p className="text-slate-500">Manage campaigns, templates, and track performance.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => onNavigate('marketing-templates')} className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 font-medium flex items-center gap-2">
                        <LayoutTemplate size={18} /> Templates
                    </button>
                    <button onClick={() => onNavigate('marketing-campaign-wizard')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2">
                        <Send size={18} /> New Campaign
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Send size={20} />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+12%</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">12,450</div>
                    <div className="text-xs text-slate-500 font-medium">Emails Sent (30d)</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <BarChart2 size={20} />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">+2.4%</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">24.8%</div>
                    <div className="text-xs text-slate-500 font-medium">Open Rate</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <CheckCircle size={20} />
                        </div>
                        <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">0.0%</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">4.2%</div>
                    <div className="text-xs text-slate-500 font-medium">Click Rate</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">-0.1%</span>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">0.8%</div>
                    <div className="text-xs text-slate-500 font-medium">Bounce Rate</div>
                </div>
            </div>

            {/* Recent Campaigns (Placeholder) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Recent Campaigns</h3>
                    <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                </div>
                <div className="p-8 text-center text-slate-400 italic">
                    No active campaigns found. Create your first campaign to get started.
                </div>
            </div>
        </div>
    );
};

export default MarketingDashboard;
