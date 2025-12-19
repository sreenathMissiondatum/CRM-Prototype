import React from 'react';
import {
    TrendingUp,
    Target,
    ArrowUpRight,
    Briefcase,
    DollarSign,
    Users,
    Lightbulb
} from 'lucide-react';

const OpportunityCard = ({ title, value, prob, stage, icon: Icon, color }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-24 h-24 -mr-6 -mt-6 bg-${color}-100 rounded-full opacity-50 group-hover:scale-110 transition-transform`}></div>

        <div className="relative z-10">
            <div className={`w-10 h-10 rounded-lg bg-${color}-50 text-${color}-600 flex items-center justify-center mb-4`}>
                <Icon size={20} />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
            <div className="text-2xl font-bold text-slate-900 mb-4">{value}</div>

            <div className="flex justify-between items-end">
                <div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">Probability</div>
                    <div className={`text-sm font-bold text-${color}-600`}>{prob}%</div>
                </div>
                <span className="px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">{stage}</span>
            </div>
        </div>
    </div>
);

const GrowthMode = ({ account }) => {
    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in zoom-in-95 duration-300">

            {/* 1. Header & Summary */}
            <section className="flex flex-col md:flex-row justify-between items-end gap-6">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <TrendingUp className="text-purple-500" size={20} />
                        Growth Engine
                    </h2>
                    <p className="text-sm text-slate-500 max-w-2xl">
                        AI-driven analysis suggests <span className="font-bold text-slate-700">$1.2M</span> of untapped potential based on peer benchmarking and transaction patterns.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors shadow-sm shadow-purple-200">
                        <Target size={16} /> Create Goal
                    </button>
                </div>
            </section>

            {/* 2. Active Pipeline */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <OpportunityCard
                    title="Equipment Financing"
                    value="$450k"
                    prob="75"
                    stage="Proposal"
                    icon={Briefcase}
                    color="blue"
                />
                <OpportunityCard
                    title="Treasury Management"
                    value="$25k/yr"
                    prob="40"
                    stage="Discovery"
                    icon={DollarSign}
                    color="emerald"
                />
                <div className="bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-6 text-slate-400 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center mb-3">
                        <ArrowUpRight size={24} />
                    </div>
                    <span className="font-bold text-sm">Add New Opportunity</span>
                </div>
            </section>

            {/* 3. White Space Analysis (The "Matrix") */}
            <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">Product Matrix & White Space</h3>
                    <button className="text-sm text-blue-600 font-medium hover:underline">View Full Relationship</button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Penetration Chart (Visual Only) */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Current Penetration</h4>
                            <div className="bg-slate-50 rounded-lg p-6 flex items-center justify-center h-48">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-slate-800 mb-1">3 / 8</div>
                                    <div className="text-sm text-slate-500">Products Held</div>
                                    <div className="w-full bg-slate-200 h-2 rounded-full mt-3 overflow-hidden">
                                        <div className="bg-purple-500 h-full w-[37.5%]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Next Best Actions</h4>
                            <div className="space-y-4">

                                <div className="flex gap-4 p-3 rounded-lg border border-purple-100 bg-purple-50/50 hover:bg-purple-50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                                        <Lightbulb size={16} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-sm">Corporate Card Program</h5>
                                        <p className="text-xs text-slate-600 mt-1 mb-2">Detailed expenditure analysis shows high travel volume. Pitch T&E card consolidation.</p>
                                        <button className="text-xs font-bold text-purple-700 bg-purple-200/50 px-2 py-1 rounded hover:bg-purple-200">Generate Pitch Deck</button>
                                    </div>
                                </div>

                                <div className="flex gap-4 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-slate-800 text-sm">Key Person Insurance</h5>
                                        <p className="text-xs text-slate-600 mt-1">Pending leadership transition in Q2 presents a coverage gap risk.</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </section>

        </div>
    );
};

export default GrowthMode;
