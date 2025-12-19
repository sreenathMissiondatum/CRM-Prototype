import React from 'react';
import {
    ShieldCheck,
    Activity,
    TrendingUp,
    Lock,
    ChevronDown,
    AlertTriangle,
    Zap,
    MoreVertical
} from 'lucide-react';

const RelationshipControlBar = ({ account, activeMode, onChangeMode }) => {

    const modes = [
        { id: 'pulse', label: 'PULSE', icon: Activity, color: 'text-blue-400' },
        { id: 'defense', label: 'DEFENSE', icon: ShieldCheck, color: 'text-emerald-400' },
        { id: 'growth', label: 'GROWTH', icon: TrendingUp, color: 'text-purple-400' },
        { id: 'vault', label: 'VAULT', icon: Lock, color: 'text-slate-400' },
    ];

    return (
        <div className="bg-[#0f172a] text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
            {/* Top Protocol Row */}
            <div className="px-6 py-2 flex items-center justify-between border-b border-slate-800/50 bg-[#020617]">
                <div className="flex items-center gap-4 text-xs font-mono tracking-wide text-slate-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        LIVE CONNECTION
                    </span>
                    <span className="text-slate-600">|</span>
                    <span>LAST SYNC: 10:42 AM</span>
                    <span className="text-slate-600">|</span>
                    <span>ID: {account.id}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded transition-colors flex items-center gap-1">
                        <Zap size={12} /> QUICK NOTE
                    </button>
                </div>
            </div>

            {/* Main Control Deck */}
            <div className="px-6 py-4 md:py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                {/* Entity Context */}
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center font-bold text-2xl text-slate-200">
                            {account.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#0f172a]" title="Active Status"></div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                            {account.name}
                            <ChevronDown size={16} className="text-slate-500 cursor-pointer hover:text-white" />
                        </h1>
                        <div className="flex items-center gap-3 mt-1 tex-sm">
                            <span className="text-slate-400 text-sm">{account.type} • {account.location || 'San Francisco, CA'}</span>

                            {/* Health Indicator Pill */}
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                                <span className="text-xs text-slate-400 uppercase font-bold">Health</span>
                                <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[88%]"></div>
                                </div>
                                <span className="text-xs font-mono text-white">88/100</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mode Switcher */}
                <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700/50 relative">
                    {modes.map(mode => {
                        const isActive = activeMode === mode.id;
                        const Icon = mode.icon;
                        return (
                            <button
                                key={mode.id}
                                onClick={() => onChangeMode(mode.id)}
                                className={`
                   relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-all duration-200
                   ${isActive
                                        ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-600'
                                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                    }
                 `}
                            >
                                <Icon size={16} className={isActive ? mode.color : 'text-slate-500'} />
                                {mode.label}
                                {isActive && (
                                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${mode.color.replace('text-', 'bg-')}`}></span>
                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${mode.color.replace('text-', 'bg-')}`}></span>
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right Actions */}
                <div className="hidden md:flex items-center gap-4 pl-4 border-l border-slate-800">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] uppercase font-bold text-slate-500">Risk Level</span>
                        <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
                            <ShieldCheck size={14} /> LOW RISK
                        </div>
                    </div>
                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                        <MoreVertical size={20} />
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RelationshipControlBar;
