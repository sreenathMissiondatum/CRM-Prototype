import React, { useState, useEffect } from 'react';
import {
    Activity, ArrowLeft, Building2, Users
} from 'lucide-react';

// Engines & Utils
import {
    generateRawFinItems,
    deriveBusinessProfile,
    // calculateRatios, // REMOVED: Merged into deriveBusinessProfile
    generatePersonalProfiles,
    aggregateHousehold
} from '../../utils/FinancialDataEngine';

// Sub Components
import NormalizationWorkbench from './NormalizationWorkbench';
import BusinessFinancials from './Financial/BusinessFinancials';
import PersonalFinancials from './Financial/PersonalFinancials';

const FinancialIntelligence = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('commercial'); // 'commercial' | 'personal'
    const [isWorkbenchOpen, setIsWorkbenchOpen] = useState(false);

    // Data State
    const [finItems, setFinItems] = useState([]);
    const [businessProfile, setBusinessProfile] = useState(null);
    // const [businessRatios, setBusinessRatios] = useState(null); // REMOVED
    const [personalProfiles, setPersonalProfiles] = useState([]);
    const [householdAgg, setHouseholdAgg] = useState(null);

    // Initial Load
    useEffect(() => {
        // Simulate API fetch delay
        setTimeout(() => {
            const items = generateRawFinItems();
            const busProfile = deriveBusinessProfile(items);
            // const ratios = calculateRatios(busProfile); // REMOVED
            const persons = generatePersonalProfiles();
            const household = aggregateHousehold(persons);

            setFinItems(items);
            setBusinessProfile(busProfile);
            // setBusinessRatios(ratios);
            setPersonalProfiles(persons);
            setHouseholdAgg(household);
            setIsLoading(false);
        }, 600);
    }, []);

    if (isLoading) return <div className="p-12 text-center text-slate-400">Loading Financial Engine...</div>;

    if (isWorkbenchOpen) {
        return <NormalizationWorkbench onBack={() => setIsWorkbenchOpen(false)} />;
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/50">

            {/* HEADER: CONTEXT & SWITCHER */}
            <div className="bg-white border-b border-slate-200 px-6 py-5 shadow-sm shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                    {/* Left: Financial Identity */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-md shadow-blue-200">
                            <Activity size={24} />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900 leading-tight">Financial Intelligence</h1>
                            <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                <span>Jenkins Catering Services, LLC</span>
                                <span className="text-slate-300">•</span>
                                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase tracking-wider">
                                    FY 2024 Verified
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center: View Switcher */}
                    <div className="flex p-1 bg-slate-100 rounded-lg border border-slate-200">
                        <button
                            onClick={() => setViewMode('commercial')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${viewMode === 'commercial'
                                ? 'bg-white text-blue-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Building2 size={14} />
                            Commercial Financials
                        </button>
                        <button
                            onClick={() => setViewMode('personal')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all ${viewMode === 'personal'
                                ? 'bg-white text-blue-700 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <Users size={14} />
                            Personal & Guarantors
                        </button>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        {viewMode === 'commercial' && (
                            <button className="text-slate-500 hover:text-blue-600 text-xs font-semibold px-3 py-2 transition-colors">
                                Download Report
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                <div className="max-w-[1600px] mx-auto">
                    {viewMode === 'commercial' && (
                        <BusinessFinancials
                            profile={businessProfile}
                            // ratios={businessRatios} // REMOVED
                            onViewWorkbench={() => setIsWorkbenchOpen(true)}
                        />
                    )}
                    {viewMode === 'personal' && (
                        <PersonalFinancials
                            profiles={personalProfiles}
                            household={householdAgg}
                        />
                    )}
                </div>
            </div>

        </div>
    );
};

export default FinancialIntelligence;
