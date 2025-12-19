import React, { useState } from 'react';
import { Save, AlertCircle, TrendingUp, Calendar, Hash } from 'lucide-react';

const FinancialRules = () => {
    const [config, setConfig] = useState({
        annualizationMethod: 'Run Rate (Last 3m)',
        minMonthsForAnnualization: 3,
        ebitdaAdjustments: true,
        autoCategorizeThreshold: 85,
        defaultDebtServiceThreshold: 1.25,
        trendWindow: 'Last 2 Years',
        fingerprintSensitivity: 'Medium'
    });

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Financial Profile Rules</h1>
                    <p className="text-slate-500">Configure how financial data is processed, annualized, and analyzed.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <Save size={18} />
                    Save Rules
                </button>
            </div>

            {/* ANNUALIZATION */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Calendar size={18} className="text-slate-400" />
                    <h2 className="font-semibold text-slate-800">Annualization Logic</h2>
                </div>
                <div className="p-6 grid grid-cols-2 gap-8">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Default Annualization Method</label>
                        <select
                            value={config.annualizationMethod}
                            onChange={e => setConfig({ ...config, annualizationMethod: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                        >
                            <option>Run Rate (Last 3m)</option>
                            <option>Run Rate (Last 6m)</option>
                            <option>Run Rate (YTD)</option>
                            <option>Previous Year Actuals</option>
                        </select>
                        <p className="text-xs text-slate-500 mt-2">
                            Used when projecting full-year performance from partial year data.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Months Required</label>
                        <input
                            type="number"
                            value={config.minMonthsForAnnualization}
                            onChange={e => setConfig({ ...config, minMonthsForAnnualization: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                        <p className="text-xs text-slate-500 mt-2">
                            Minimum data points needed before system attempts auto-annualization.
                        </p>
                    </div>
                </div>
            </div>

            {/* ANALYSIS & MAPPING */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <Hash size={18} className="text-slate-400" />
                    <h2 className="font-semibold text-slate-800">Analysis & Mapping</h2>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                        <div>
                            <div className="font-medium text-slate-800">Auto-Categorization Sensitivity</div>
                            <div className="text-xs text-slate-500 mt-1">Confidence threshold for automatic line item mapping.</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-slate-700">{config.autoCategorizeThreshold}%</span>
                            <input
                                type="range"
                                min="50" max="100"
                                value={config.autoCategorizeThreshold}
                                onChange={e => setConfig({ ...config, autoCategorizeThreshold: e.target.value })}
                                className="w-32 accent-blue-600"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-slate-800">Enable EBITDA Adjustments</div>
                            <div className="text-xs text-slate-500 mt-1">Allow underwriters to create manual addbacks for non-recurring expenses.</div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={config.ebitdaAdjustments}
                                onChange={e => setConfig({ ...config, ebitdaAdjustments: e.target.checked })}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* TRENDS */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                    <TrendingUp size={18} className="text-slate-400" />
                    <h2 className="font-semibold text-slate-800">Trend Definitions</h2>
                </div>
                <div className="p-6">
                    <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3 text-sm text-amber-800 mb-4">
                        <AlertCircle size={18} className="shrink-0 mt-0.5" />
                        Changes to trend definitions will trigger a recalculation of all active financial profiles.
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Trend Analysis Window</label>
                            <select
                                value={config.trendWindow}
                                onChange={e => setConfig({ ...config, trendWindow: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                            >
                                <option>Last 2 Years</option>
                                <option>Last 3 Years</option>
                                <option>All Available History</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Fingerprint Sensitivity</label>
                            <select
                                value={config.fingerprintSensitivity}
                                onChange={e => setConfig({ ...config, fingerprintSensitivity: e.target.value })}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-white"
                            >
                                <option>Low (Fuzzy Match)</option>
                                <option>Medium</option>
                                <option>High (Exact Match)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialRules;
