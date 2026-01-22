import React, { useState } from 'react';
import { ShieldAlert, TrendingUp, AlertTriangle } from 'lucide-react';

const RiskRatingsTab = ({ loan, onUpdate }) => {

    if (!loan?.application?.riskRating) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-slate-500">
                <ShieldAlert className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">Risk Model Not Initialized</h3>
                <p>This loan record does not have an active risk rating model.</p>
            </div>
        );
    }

    const { riskRating } = loan.application;
    const { dimensions } = riskRating;

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Risk & Character Rating</h2>
                    <p className="text-slate-500 mt-1">CDFI Standard Risk Model v2.1</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-slate-100 rounded-lg px-4 py-2 border border-slate-200">
                        <span className="text-xs text-slate-500 block uppercase tracking-wide font-semibold">Overall Score</span>
                        <span className="text-xl font-bold text-slate-900">{riskRating.overallScore || '--'}/100</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dimensions.map((dim) => (
                    <div key={dim.key} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h3 className="font-semibold text-slate-900">{dim.label}</h3>
                            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                                Weight: {(dim.weight * 100).toFixed(0)}%
                            </span>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-sm text-slate-500">Current Score</span>
                                <span className={`text-2xl font-bold ${dim.score ? 'text-slate-900' : 'text-slate-300'}`}>
                                    {dim.score || '--'}
                                </span>
                            </div>

                            {/* Slider Placeholder */}
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500"
                                    style={{ width: `${(dim.score || 0) * 10}%` }}
                                ></div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <button className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <TrendingUp size={14} /> Assess Factor
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                    <h4 className="text-sm font-semibold text-blue-900">Audit Trail Active</h4>
                    <p className="text-sm text-blue-800 mt-1">
                        All changes to risk scores are immutable and logged. Previous scores are retained for historical analysis.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RiskRatingsTab;
