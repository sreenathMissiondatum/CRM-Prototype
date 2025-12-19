import React, { useState } from 'react';
import {
    FileText, Plus, Upload, Link as LinkIcon, AlertCircle,
    CheckCircle, TrendingUp, TrendingDown, Minus, Clock,
    MoreHorizontal, ChevronRight, Download, Trash2, X,
    FileSpreadsheet, ArrowUpRight, Search, Info, ShieldCheck
} from 'lucide-react';

import NewProfileModal from './NewProfileModal';
import FinancialMappingModal from './FinancialMappingModal';

const AccountFinancialsTab = () => {
    const [selectedProfile, setSelectedProfile] = useState(null); // For drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isNewProfileModalOpen, setIsNewProfileModalOpen] = useState(false);
    const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
    const [mappingProfile, setMappingProfile] = useState(null);

    // --- Mock Data ---

    const [activeProfile, setActiveProfile] = useState({
        id: 'FP-2024-Q3',
        name: 'FY 2024 QuickBooks YTD (9m)',
        period: 'Jan 1, 2024 - Sep 30, 2024',
        source: 'QuickBooks API',
        annualized: true,
        annualizationYear: '2024',
        fingerprint: '3a9f78b',
        dscr: '1.45',
        revenue: '$1,250,000',
        ebitda: '$320,000',
        leverage: '2.1x',
        trends: { dscr: 'up', revenue: 'up', ebitda: 'flat', leverage: 'down' },
        trendAnalytics: {
            revenue: { value: '+15% YoY', sub: 'vs 2023' },
            ebitda: { value: '+6% YoY', sub: 'margin expansion' },
            dscr: { value: 'Improved', sub: '1.15 -> 1.45' },
            leverage: { value: 'Decreased', sub: '2.8x -> 2.1x' }
        }
    });

    const [draftProfiles, setDraftProfiles] = useState([
        {
            id: 'draft-1',
            name: 'Tax Return 1120-S (2024)',
            source: 'OCR Upload',
            progress: 85,
            period: 'Jan 1, 2024 - Dec 31, 2024',
            errors: 2,
            status: 'Mapping'
        },
        {
            id: 'draft-2',
            name: 'Manual Pro-Forma 2025',
            source: 'Manual Builder',
            progress: 40,
            period: 'Jan 1, 2025 - Dec 31, 2025',
            errors: 0,
            status: 'Draft'
        }
    ]);

    const [profileHistory, setProfileHistory] = useState([
        {
            id: 'FP-2023-FY',
            name: 'FY 2023 Tax Return (Final)',
            period: 'Jan 1, 2023 - Dec 31, 2023',
            source: 'Tax Return',
            annualized: false,
            fingerprint: '8b2c19a',
            dscr: '1.32',
            revenue: '$1,100,000',
            ebitda: '$280,000',
            trend: 'up',
            isActive: false,
            trendAnalytics: {
                revenue: { value: '+8% YoY', sub: 'vs 2022' },
                ebitda: { value: '+12% YoY', sub: 'opt. efficiency' },
                dscr: { value: 'Stable', sub: '1.10 -> 1.15' },
                leverage: { value: 'Improved', sub: '3.2x -> 2.8x' }
            }
        },
        {
            id: 'FP-2022-FY',
            name: 'FY 2022 Tax Return',
            period: 'Jan 1, 2022 - Dec 31, 2022',
            source: 'Tax Return',
            annualized: false,
            fingerprint: 'cc49102',
            dscr: '1.15',
            revenue: '$950,000',
            ebitda: '$180,000',
            trend: 'flat',
            isActive: false,
            trendAnalytics: {
                revenue: { value: '-2% YoY', sub: 'market correction' },
                ebitda: { value: '-5% YoY', sub: 'cost increases' },
                dscr: { value: 'Declined', sub: '1.25 -> 1.15' },
                leverage: { value: 'Increased', sub: '2.5x -> 3.2x' }
            }
        }
    ]);

    // --- Components ---

    const TrendIcon = ({ trend }) => {
        if (trend === 'up') return <TrendingUp size={14} className="text-emerald-500" />;
        if (trend === 'down') return <TrendingDown size={14} className="text-red-500" />;
        return <Minus size={14} className="text-slate-400" />;
    };

    const StatusBadge = ({ trend }) => {
        const colors = {
            'up': 'bg-emerald-50 text-emerald-700 border-emerald-100',
            'down': 'bg-red-50 text-red-700 border-red-100',
            'flat': 'bg-slate-100 text-slate-600 border-slate-200'
        };
        return (
            <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border ${colors[trend]}`}>
                <TrendIcon trend={trend} />
                <span className="uppercase">{trend}</span>
            </div>
        );
    };

    const handleProfileClick = (profile) => {
        setSelectedProfile(profile);
        setIsDrawerOpen(true);
    };

    const handleNewProfile = (data) => {
        const newDraft = {
            id: `draft-${Date.now()}`,
            name: `${data.type} (${new Date().getFullYear()})`,
            source: data.importMethod,
            progress: 0,
            period: `${data.startDate} - ${data.endDate}`,
            errors: 0,
            status: 'Draft'
        };
        setDraftProfiles(prev => [newDraft, ...prev]);
        setIsNewProfileModalOpen(false);
    };

    const handleSelectProfile = (newActive) => {
        // Swap logic with Data Normalization

        // 1. Prepare old active for history (needs 'trend' string)
        const oldActive = {
            ...activeProfile,
            isActive: false,
            trend: activeProfile.trends?.dscr || 'flat'
        };

        // 2. Prepare new active for active slot
        const updatedNewActive = {
            ...newActive,
            isActive: true,
            trends: newActive.trends || {
                dscr: newActive.trend || 'flat',
                revenue: 'flat',
                ebitda: 'flat',
                leverage: 'flat'
            },
            // Ensure trendAnalytics exists, fallback to empty/defaults if missing
            trendAnalytics: newActive.trendAnalytics || {
                revenue: { value: 'N/A', sub: '' },
                ebitda: { value: 'N/A', sub: '' },
                dscr: { value: 'N/A', sub: '' },
                leverage: { value: 'N/A', sub: '' }
            }
        };

        setProfileHistory(prev => [oldActive, ...prev.filter(p => p.id !== newActive.id)]);
        setActiveProfile(updatedNewActive);
    };

    return (
        <div className="space-y-8 pb-10">

            {/* SECTION 1: HEADER */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Financial Profiles</h2>
                    <p className="text-slate-500 mt-1">Upload, map, and maintain financial data for underwriting.</p>
                    <div className="flex items-center gap-2 mt-4 text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg border border-blue-100 max-w-fit">
                        <Info size={14} />
                        Financial Profiles belong to this business entity and can be reused across multiple loan applications.
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setIsNewProfileModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                    >
                        <Plus size={16} /> New Profile
                    </button>
                </div>
            </div>

            {/* SECTION 2: ACTIVE PROFILE SNAPSHOT */}
            <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">Active Underwriting Profile</h3>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                    {/* Left: Metadata */}
                    <div className="p-6 border-b md:border-b-0 md:border-r border-slate-100 flex-1 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                            <ShieldCheck size={120} />
                        </div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide rounded border border-emerald-200">Active</span>
                                    <span className="text-xs text-slate-400 font-mono" title="Statement Fingerprint">#{activeProfile.fingerprint}</span>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">{activeProfile.name}</h3>
                                <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                                    <Clock size={14} />
                                    {activeProfile.period}
                                </div>
                            </div>
                        </div>
                        {/* "Change Profile" button removed per user request */}

                        <div className="flex flex-wrap gap-4 mt-6 relative z-10">
                            <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                <div className="text-[10px] text-slate-500 uppercase font-bold text-center">Source</div>
                                <div className="text-sm font-semibold text-slate-700 flex items-center gap-1.5 justify-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div> {activeProfile.source}
                                </div>
                            </div>
                            <div className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                <div className="text-[10px] text-slate-500 uppercase font-bold text-center">Annualization</div>
                                <div className="text-sm font-semibold text-slate-700 text-center">{activeProfile.annualizationYear}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Metrics */}
                    <div className="p-6 flex-[1.5] bg-slate-50/50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <MetricBlock label="Revenue" value={activeProfile.revenue} trend={activeProfile.trends.revenue} />
                            <MetricBlock label="EBITDA" value={activeProfile.ebitda} trend={activeProfile.trends.ebitda} />
                            <MetricBlock label="Global DSCR" value={activeProfile.dscr} trend={activeProfile.trends.dscr} highlight />
                            <MetricBlock label="Leverage" value={activeProfile.leverage} trend={activeProfile.trends.leverage} inverse />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECTION 3: PROFILE BUILDER (DRAFTS) */}
            {
                draftProfiles.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">In Progress (Drafts)</h3>
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-500">Profile Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500">Period</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500">Source</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 w-1/4">Status & Progress</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {draftProfiles.map(draft => (
                                        <tr key={draft.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                        <FileText size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-slate-800">{draft.name}</div>
                                                        {draft.errors > 0 && (
                                                            <div className="flex items-center gap-1 text-[10px] text-amber-600 font-medium mt-0.5">
                                                                <AlertCircle size={10} /> {draft.errors} Issues
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 font-mono text-xs">{draft.period}</td>
                                            <td className="px-6 py-4 text-slate-600">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-700">{draft.importMethod || 'Manual Entry'}</span>
                                                    <span className="text-[10px] text-slate-400">{draft.source}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 align-middle">
                                                <div className="w-full max-w-[180px]">
                                                    <div className="flex justify-between text-xs mb-1.5">
                                                        <span className="font-semibold text-slate-600">{draft.status}</span>
                                                        <span className="font-bold text-slate-800">{draft.progress}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                        <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${draft.progress}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setMappingProfile(draft);
                                                            setIsMappingModalOpen(true);
                                                        }}
                                                        className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors shadow-sm whitespace-nowrap"
                                                    >
                                                        Continue Mapping
                                                    </button>
                                                    <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            }

            {/* SECTION 4: HISTORY TABLE */}
            <div>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 px-1">Profile History</h3>
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-500">Profile Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-500">Period</th>
                                <th className="px-6 py-4 font-semibold text-slate-500">Source</th>
                                <th className="px-6 py-4 font-semibold text-slate-500">DSCR</th>
                                <th className="px-6 py-4 font-semibold text-slate-500">Revenue</th>
                                <th className="px-6 py-4 font-semibold text-slate-500">EBITDA</th>
                                <th className="px-6 py-4 font-semibold text-slate-500">Trend</th>
                                <th className="px-6 py-4 font-semibold text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {/* Render Active Profile First (if valid history) - usually it's in the list too */}
                            <tr onClick={() => handleProfileClick(activeProfile)} className="bg-blue-50/30 hover:bg-blue-50/60 transition-colors cursor-pointer">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-slate-800 flex items-center gap-2">
                                        {activeProfile.name}
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase">Active</span>
                                    </div>
                                    <div className="text-xs text-slate-400 font-mono mt-0.5" title="Fingerprint">#{activeProfile.fingerprint}</div>
                                </td>
                                <td className="px-6 py-4 text-slate-600 text-xs">{activeProfile.period}</td>
                                <td className="px-6 py-4 text-slate-600">{activeProfile.source}</td>
                                <td className="px-6 py-4 font-bold text-slate-800">{activeProfile.dscr}</td>
                                <td className="px-6 py-4 text-slate-600">{activeProfile.revenue}</td>
                                <td className="px-6 py-4 text-slate-600">{activeProfile.ebitda}</td>
                                <td className="px-6 py-4"><StatusBadge trend="up" /></td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-blue-600 p-1.5 rounded-full hover:bg-blue-100 transition-colors">
                                        <ChevronRight size={16} />
                                    </button>
                                </td>
                            </tr>

                            {/* History Items */}
                            {profileHistory.map(profile => (
                                <tr key={profile.id} onClick={() => handleProfileClick(profile)} className="hover:bg-slate-50 transition-colors cursor-pointer group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-800">{profile.name}</div>
                                        <div className="text-xs text-slate-400 font-mono mt-0.5">#{profile.fingerprint}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 text-xs">{profile.period}</td>
                                    <td className="px-6 py-4 text-slate-600">{profile.source}</td>
                                    <td className="px-6 py-4 font-medium text-slate-700">{profile.dscr}</td>
                                    <td className="px-6 py-4 text-slate-600">{profile.revenue}</td>
                                    <td className="px-6 py-4 text-slate-600">{profile.ebitda}</td>
                                    <td className="px-6 py-4"><StatusBadge trend={profile.trend} /></td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectProfile(profile);
                                                }}
                                                className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline px-2 py-1"
                                            >
                                                Select
                                            </button>
                                            <button className="text-slate-400 hover:text-slate-600 p-1">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* SECTION 5: TRENDS (WIDGETS) */}
            <div>
                <div className="flex gap-2 items-center mb-4 px-1">
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Trend Analytics</h3>
                    <div className="group relative">
                        <Info size={14} className="text-slate-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-xs p-3 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                            Trends are calculated using locked Financial Profiles of consistent reporting periods. Profiles with unmatched periods are excluded.
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <TrendWidget
                        title="Revenue Trend"
                        value={activeProfile.trendAnalytics?.revenue?.value || '--'}
                        sub={activeProfile.trendAnalytics?.revenue?.sub}
                        type="line"
                        color="blue"
                    />
                    <TrendWidget
                        title="EBITDA Trend"
                        value={activeProfile.trendAnalytics?.ebitda?.value || '--'}
                        sub={activeProfile.trendAnalytics?.ebitda?.sub}
                        type="bar"
                        color="emerald"
                    />
                    <TrendWidget
                        title="Global DSCR"
                        value={activeProfile.trendAnalytics?.dscr?.value || '--'}
                        sub={activeProfile.trendAnalytics?.dscr?.sub}
                        type="line"
                        color="purple"
                    />
                    <TrendWidget
                        title="Leverage"
                        value={activeProfile.trendAnalytics?.leverage?.value || '--'}
                        sub={activeProfile.trendAnalytics?.leverage?.sub}
                        type="area"
                        color="cyan"
                    />
                </div>
            </div>

            {/* SECTION 6: DRAWER */}
            {
                isDrawerOpen && selectedProfile && (
                    <div className="fixed inset-0 z-[100] flex justify-end">
                        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)}></div>
                        <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                            <div className="p-6 border-b border-slate-200 flex justify-between items-start">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900">{selectedProfile.name}</h2>
                                    <div className="text-sm text-slate-500 mt-1">{selectedProfile.period}</div>
                                </div>
                                <button onClick={() => setIsDrawerOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <SectionCard title="Profile Metadata">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div><div className="text-slate-400 text-xs uppercase font-bold">Source</div><div className="font-medium text-slate-800">{selectedProfile.source}</div></div>
                                        <div><div className="text-slate-400 text-xs uppercase font-bold">Fingerprint</div><div className="font-mono text-slate-600 bg-slate-100 px-1 rounded inline-block">{selectedProfile.fingerprint}</div></div>
                                        <div><div className="text-slate-400 text-xs uppercase font-bold">Created</div><div className="font-medium text-slate-800">Oct 12, 2024</div></div>
                                        <div><div className="text-slate-400 text-xs uppercase font-bold">By</div><div className="font-medium text-slate-800">Alex Morgan</div></div>
                                    </div>
                                </SectionCard>

                                <SectionCard title="Key Financials">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-slate-600">Total Revenue</span>
                                            <span className="font-bold text-slate-800">{selectedProfile.revenue}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-slate-600">Gross Profit</span>
                                            <span className="font-medium text-slate-800">$840,000</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-slate-50">
                                            <span className="text-slate-600">Net Income</span>
                                            <span className="font-medium text-slate-800">$180,000</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 bg-emerald-50 px-3 -mx-3 rounded font-bold">
                                            <span className="text-emerald-800">Adjusted EBITDA</span>
                                            <span className="text-emerald-800">{selectedProfile.ebitda}</span>
                                        </div>
                                    </div>
                                </SectionCard>

                                <SectionCard title="Addbacks & Adjustments">
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">+ Depreciation</span>
                                            <span className="font-mono text-slate-700">$45,000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">+ Interest Expense</span>
                                            <span className="font-mono text-slate-700">$12,000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">+ Owner One-time Expense</span>
                                            <span className="font-mono text-slate-700">$8,000</span>
                                        </div>
                                    </div>
                                </SectionCard>
                            </div>
                            <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
                                <button className="flex-1 flex justify-center items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 shadow-sm transition-colors">
                                    <Download size={16} /> Download PDF
                                </button>
                                <button className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Profile">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            <NewProfileModal
                isOpen={isNewProfileModalOpen}
                onClose={() => setIsNewProfileModalOpen(false)}
                onCreate={handleNewProfile}
            />

            <FinancialMappingModal
                isOpen={isMappingModalOpen}
                statement={mappingProfile}
                onClose={() => setIsMappingModalOpen(false)}
                onLock={(updatedProfile) => {
                    // Update the draft in list with new status/progress or move to history if locked
                    console.log('Profile Locked:', updatedProfile);

                    // Remove from drafts
                    setDraftProfiles(prev => prev.filter(p => p.id !== updatedProfile.id));

                    // Add to history
                    const historyItem = {
                        ...updatedProfile,
                        isActive: false,
                        fingerprint: Math.random().toString(36).substring(7), // Mock fingerprint
                        dscr: '1.40', // Mock calc
                        revenue: '$1,200,000', // Mock calc
                        ebitda: '$300,000', // Mock calc
                        trend: 'flat'
                    };
                    setProfileHistory(prev => [historyItem, ...prev]);

                    setIsMappingModalOpen(false);
                }}
                onDelete={(profileToDelete) => {
                    setDraftProfiles(prev => prev.filter(p => p.id !== profileToDelete.id));
                    setIsMappingModalOpen(false);
                }}
            />
        </div >
    );
};

// --- Helpers ---

const MetricBlock = ({ label, value, trend, highlight, inverse }) => {
    let trendColor = 'text-slate-400';
    if (trend === 'up') trendColor = inverse ? 'text-red-500' : 'text-emerald-500';
    if (trend === 'down') trendColor = inverse ? 'text-emerald-500' : 'text-red-500';

    return (
        <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">{label}</span>
            <div className={`text-2xl font-bold ${highlight ? 'text-blue-600' : 'text-slate-800'}`}>{value}</div>
            <div className={`flex items-center gap-1 text-xs font-medium ${trendColor} mt-1`}>
                {trend === 'up' && <TrendingUp size={12} />}
                {trend === 'down' && <TrendingDown size={12} />}
                {trend === 'flat' && <Minus size={12} />}
                <span className="uppercase">{trend}</span>
            </div>
        </div>
    );
};

const TrendWidget = ({ title, value, sub, color }) => {
    const isDown = value.includes('Decreased') || value.includes('Down') || value.includes('-');
    const isFlat = value.includes('Stable') || value.includes('Flat');

    return (
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-3 opacity-10 text-${color}-600`}>
                {isDown ? <TrendingDown size={48} /> : isFlat ? <Minus size={48} /> : <TrendingUp size={48} />}
            </div>
            <div className="relative z-10">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{title}</div>
                <div className="text-xl font-bold text-slate-800">{value}</div>
                {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}

                <div className="mt-4 h-8 flex items-end gap-1">
                    {[40, 60, 45, 70, 80, 65, 85].map((h, i) => (
                        <div key={i} className={`flex-1 bg-${color}-100 rounded-t-sm hover:bg-${color}-200 transition-colors`} style={{ height: `${h}%` }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SectionCard = ({ title, children }) => (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wide">
            {title}
        </div>
        <div className="p-4">
            {children}
        </div>
    </div>
);

export default AccountFinancialsTab;


