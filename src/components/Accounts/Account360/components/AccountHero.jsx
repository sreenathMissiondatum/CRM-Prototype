import React from 'react';
import {
    Building2,
    ShieldCheck,
    TrendingUp,
    MoreHorizontal,
    Mail,
    Phone,
    MapPin,
    ExternalLink,
    Wallet,
    Activity
} from 'lucide-react';

const AccountHero = ({ account }) => {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white shadow-xl mb-6 group">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl group-hover:bg-blue-600/30 transition-all duration-700"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-indigo-600/20 blur-3xl group-hover:bg-indigo-600/30 transition-all duration-700"></div>

            <div className="relative p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                    {/* Identity Section */}
                    <div className="flex items-start gap-5">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/50 shrink-0">
                            <Building2 size={32} className="text-white" />
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold tracking-tight text-white">{account.name}</h1>
                                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-500/30">
                                    {account.type || 'LLC'}
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Active
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-slate-500">ID:</span>
                                    <span className="font-mono text-slate-300">{account.id}</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                                <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                                    <MapPin size={14} />
                                    <span>San Francisco, CA</span>
                                </div>
                                <div className="w-1 h-1 rounded-full bg-slate-700"></div>
                                <div className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                                    <ExternalLink size={14} />
                                    <span>Website</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats & Actions */}
                    <div className="flex items-center gap-6 w-full md:w-auto">
                        {/* Health Score */}
                        <div className="flex flex-col items-end">
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Health Score</div>
                            <div className="flex items-center gap-2">
                                <div className="relative w-10 h-10 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-700" />
                                        <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="transparent" className="text-emerald-500" strokeDasharray="100" strokeDashoffset={100 - (account.healthScore || 88)} strokeLinecap="round" />
                                    </svg>
                                    <span className="absolute text-xs font-bold text-white">{account.healthScore || 88}</span>
                                </div>
                            </div>
                        </div>

                        {/* Total Exposure */}
                        <div className="flex flex-col items-end border-l border-slate-700 pl-6">
                            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Total Exposure</div>
                            <div className="flex items-center gap-1.5">
                                <Wallet size={16} className="text-blue-400" />
                                <span className="text-xl font-bold text-white">{account.totalExposure || '$450,000'}</span>
                            </div>
                        </div>

                        {/* Action Button */}
                        <div className="pl-2">
                            <button className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700 hover:border-slate-600 shadow-sm">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Secondary Info Row - Glass effect */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-8">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                            <ShieldCheck size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">KYC Status</p>
                            <p className="text-sm font-medium text-white">{account.kycStatus || 'Verified'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-300">
                            <Activity size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Next Review</p>
                            <p className="text-sm font-medium text-white">Dec 15, 2024</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
                            <TrendingUp size={16} />
                        </div>
                        <div>
                            <p className="text-xs text-slate-400">Relationship Stage</p>
                            <p className="text-sm font-medium text-white">{account.lifecycleStage || 'Servicing'}</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AccountHero;
