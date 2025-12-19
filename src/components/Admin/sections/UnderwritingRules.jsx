import React, { useState } from 'react';
import { Save, ShieldCheck, AlertTriangle, UserCheck, Banknote } from 'lucide-react';

const UnderwritingRules = () => {
    const [config, setConfig] = useState({
        minDscr: 1.25,
        minFico: 680,
        bankruptcyPeriod: 7,
        maxLeverage: 4.5,
        liquidityMin: 50000,
        industryExclusions: ['Gambling', 'Cannabis', 'Adult Entertainment']
    });

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Underwriting Rules</h1>
                    <p className="text-slate-500">Define global risk thresholds and automated knockout criteria.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <Save size={18} />
                    Save Configuration
                </button>
            </div>

            {/* RATIOS */}
            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <Banknote size={18} className="text-slate-400" />
                        <h2 className="font-semibold text-slate-800">Financial Ratios</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-slate-700">Minimum DSCR</label>
                                <span className={`text-sm font-bold ${config.minDscr >= 1.20 ? 'text-emerald-600' : 'text-amber-600'}`}>{config.minDscr}x</span>
                            </div>
                            <input
                                type="range"
                                min="1" max="2" step="0.05"
                                value={config.minDscr}
                                onChange={e => setConfig({ ...config, minDscr: e.target.value })}
                                className="w-full accent-blue-600"
                            />
                            <p className="text-xs text-slate-500 mt-1">Global Debt Service Coverage Ratio floor.</p>
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-slate-700">Max Sr. Leverage</label>
                                <span className="text-sm font-bold text-slate-800">{config.maxLeverage}x</span>
                            </div>
                            <input
                                type="range"
                                min="2" max="8" step="0.25"
                                value={config.maxLeverage}
                                onChange={e => setConfig({ ...config, maxLeverage: e.target.value })}
                                className="w-full accent-blue-600"
                            />
                            <p className="text-xs text-slate-500 mt-1">Total Debt / EBITDA maximum.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <UserCheck size={18} className="text-slate-400" />
                        <h2 className="font-semibold text-slate-800">Borrower Hygiene</h2>
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-slate-700">Minimum FICO</label>
                                <span className="text-sm font-bold text-slate-800">{config.minFico}</span>
                            </div>
                            <input
                                type="range"
                                min="500" max="850" step="10"
                                value={config.minFico}
                                onChange={e => setConfig({ ...config, minFico: e.target.value })}
                                className="w-full accent-blue-600"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-sm font-medium text-slate-700">Bankruptcy Lookback</label>
                                <span className="text-sm font-bold text-slate-800">{config.bankruptcyPeriod} Years</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="10" step="1"
                                value={config.bankruptcyPeriod}
                                onChange={e => setConfig({ ...config, bankruptcyPeriod: e.target.value })}
                                className="w-full accent-blue-600"
                            />
                            <p className="text-xs text-slate-500 mt-1">Years since discharge required.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* KNOCKOUTS */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <AlertTriangle size={18} className="text-slate-400" />
                    <h2 className="font-semibold text-slate-800">Strict Knockout Rules</h2>
                </div>
                <div className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Restricted Industries</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {config.industryExclusions.map(ind => (
                                <span key={ind} className="bg-red-50 text-red-700 border border-red-100 px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                                    {ind}
                                    <button className="hover:text-red-900"><ShieldCheck size={12} /></button>
                                </span>
                            ))}
                        </div>
                        <input
                            type="text"
                            placeholder="Type industry and press Enter..."
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnderwritingRules;
