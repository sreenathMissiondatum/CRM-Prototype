import React, { useState, useMemo } from 'react';
import {
    ShieldCheck, Calendar, Lock,
    TrendingUp, Activity,
    DollarSign, Percent, BarChart3, Pen,
    Building2, Wallet, Scale,
    Briefcase, ArrowRightLeft,
    FileText, Users, CheckCircle,
    ChevronDown, ChevronRight, Clock, History, AlertCircle,
    Archive, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react';

const FinancialIntelligence = ({ accountId = 'ACC-12345', onEditSource }) => {
    // 1. GLOBAL STATE & NAVIGATION
    // 'time_rail' (default) or 'history_list' (vertical audit view)
    const [viewMode, setViewMode] = useState('time_rail');

    // Currently Selected Profile ID (defaults to Active 2024)
    const [selectedProfileId, setSelectedProfileId] = useState('active_2024');

    // Section Collapse State
    const [openSections, setOpenSections] = useState({
        'income': true,
        'balance': true,
        'coverage': true,
        'profitability': false,
        'leverage': false,
        'liquidity': false,
        'activity': false
    });

    const toggleSection = (sectionId) => {
        setOpenSections(prev => ({ ...prev, [sectionId]: !prev[sectionId] }));
    };

    // --- MOCK DATA: CHRONOLOGICAL PROFILE HISTORY ---
    // Single source of truth for all profiles to enable prev/next logic & deltas.
    const ALL_PROFILES = [
        {
            id: 'hist_2022',
            meta: {
                status: 'Archived', source: 'Tax Return', fiscalYear: '2022', period: 'Full Year',
                isLocked: true, type: 'Tax Return'
            },
            data: {
                revenue: 1100000, ebitda: 250000, netProfit: 110000,
                dscrBus: 1.55, dscrGlob: 1.42,
                grossMargin: 65.4, netMargin: 10.0,
                totalAssets: 470000, totalEquity: 190000,
                curRatio: 3.00, ccc: 12
            },
            details: {
                income: {
                    revenue: '$1,100,000', cogs: '$380,000', grossProfit: '$720,000',
                    opEx: '$500,000', noi: '$220,000', ebitda: '$250,000',
                    deprAmort: '$30,000', interest: '$10,000', ebt: '$180,000',
                    tax: '$30,000', ownerDraw: '$40,000', netProfit: '$110,000'
                },
                balance: {
                    cash: '$100,000', ar: '$70,000', inv: '$180,000', caOth: '$10,000',
                    assetsCur: '$360,000', assetsFix: '$110,000', assetsNFix: '$0', assetsTot: '$470,000',
                    liabtsCur: '$120,000', crCards: '$10,000', LTD: '$150,000', liabtsTot: '$280,000',
                    equityTot: '$190,000', balS_checkYn: true
                },
                coverage: { dscrBus: '1.55', dscrGlob: '1.42', dscrProj: '—' },
                profitability: {
                    margGross: '65.4%', margNet: '10.0%',
                    roa: '23.4%', roe: '57.8%',
                    revAssets: '2.34x', revEquity: '5.78x',
                    opExAssets: '45.1%', opExEquity: '111.0%'
                },
                leverage: {
                    levBus: '1.47x', levGlob: '1.80x', levProj: '—',
                    liabFa: '2.54x', liabRev: '0.25x', liabGlobFa: '2.9x', liabGlobRev: '0.3x'
                },
                liquidity: {
                    wCap: '$240,000', curRatio: '3.00x', quickRatio: '1.41x', liqAssets: '76.5%'
                },
                activity: {
                    dio: '42 Days', dso: '28 Days', dpo: '58 Days', ccc: '12 Days'
                }
            }
        },
        {
            id: 'hist_2023',
            meta: {
                status: 'Archived', source: 'Tax Return', fiscalYear: '2023', period: 'Full Year',
                isLocked: true, type: 'Tax Return'
            },
            data: {
                revenue: 1180000, ebitda: 280000, netProfit: 140000,
                dscrBus: 1.48, dscrGlob: 1.35,
                grossMargin: 66.0, netMargin: 11.8,
                totalAssets: 520000, totalEquity: 205000,
                curRatio: 2.9, ccc: 14
            },
            details: {
                income: {
                    revenue: '$1,180,000', cogs: '$401,200', grossProfit: '$778,800',
                    opEx: '$530,000', noi: '$248,800', ebitda: '$280,000',
                    deprAmort: '$35,000', interest: '$11,000', ebt: '$202,800',
                    tax: '$32,000', ownerDraw: '$30,000', netProfit: '$140,800'
                },
                balance: {
                    cash: '$120,000', ar: '$75,000', inv: '$190,000', caOth: '$15,000',
                    assetsCur: '$400,000', assetsFix: '$120,000', assetsNFix: '$0', assetsTot: '$520,000',
                    liabtsCur: '$135,000', crCards: '$12,000', LTD: '$180,000', liabtsTot: '$315,000',
                    equityTot: '$205,000', balS_checkYn: true
                },
                coverage: { dscrBus: '1.48', dscrGlob: '1.35', dscrProj: '—' },
                profitability: {
                    margGross: '66.0%', margNet: '11.8%',
                    roa: '27.1%', roe: '68.7%',
                    revAssets: '2.27x', revEquity: '5.76x',
                    opExAssets: '44.9%', opExEquity: '98.5%'
                },
                leverage: {
                    levBus: '1.54x', levGlob: '1.92x', levProj: '—',
                    liabFa: '2.62x', liabRev: '0.27x', liabGlobFa: '3.0x', liabGlobRev: '0.32x'
                },
                liquidity: {
                    wCap: '$265,000', curRatio: '2.96x', quickRatio: '1.44x', liqAssets: '76.9%'
                },
                activity: {
                    dio: '43 Days', dso: '29 Days', dpo: '58 Days', ccc: '14 Days'
                }
            }
        },
        {
            id: 'active_2024',
            meta: {
                status: 'Active', source: 'Tax Return (OCR)', fiscalYear: '2024', period: 'Full Year',
                isLocked: true, type: 'Tax Return', isLatestActive: true
            },
            data: {
                revenue: 1250000, ebitda: 320000, netProfit: 188000,
                dscrBus: 1.45, dscrGlob: 1.32,
                grossMargin: 67.2, netMargin: 15.0,
                totalAssets: 570000, totalEquity: 220000,
                curRatio: 3.00, ccc: 15
            },
            details: {
                income: {
                    revenue: '$1,250,000', cogs: '$410,000', grossProfit: '$840,000',
                    opEx: '$560,000', noi: '$280,000', ebitda: '$320,000',
                    deprAmort: '$45,000', interest: '$12,000', ebt: '$223,000',
                    tax: '$35,000', ownerDraw: '$50,000', netProfit: '$188,000'
                },
                balance: {
                    cash: '$150,000', ar: '$80,000', inv: '$200,000', caOth: '$20,000',
                    assetsCur: '$450,000', assetsFix: '$120,000', assetsNFix: '$0', assetsTot: '$570,000',
                    liabtsCur: '$150,000', crCards: '$15,000', LTD: '$200,000', liabtsTot: '$350,000',
                    equityTot: '$220,000', balS_checkYn: true
                },
                coverage: { dscrBus: '1.45', dscrGlob: '1.32', dscrProj: '1.28' },
                profitability: {
                    margGross: '67.2%', margNet: '15.0%',
                    roa: '32.9%', roe: '85.4%',
                    revAssets: '2.19x', revEquity: '5.68x',
                    opExAssets: '44.8%', opExEquity: '116.2%'
                },
                leverage: {
                    levBus: '2.10x', levGlob: '2.45x', levProj: '2.35x',
                    liabFa: '2.17x', liabRev: '0.28x', liabGlobFa: '3.15x', liabGlobRev: '0.35x'
                },
                liquidity: {
                    wCap: '$300,000', curRatio: '3.00x', quickRatio: '1.53x', liqAssets: '78.9%'
                },
                activity: {
                    dio: '45 Days', dso: '30 Days', dpo: '60 Days', ccc: '15 Days'
                }
            }
        },
        {
            id: 'draft_2025',
            meta: {
                status: 'Draft', source: 'QuickBooks (Live)', fiscalYear: '2025 (YTD)', period: 'Q1 Interim',
                isLocked: false, mappingProgress: 65, type: 'Interim'
            },
            data: {
                revenue: 350000, ebitda: 115000, netProfit: 46000,
                dscrBus: 1.38, dscrGlob: 1.25,
                grossMargin: 68.5, netMargin: 13.1,
                totalAssets: 545000, totalEquity: 197000,
                curRatio: 3.03, ccc: 21
            },
            details: {
                income: {
                    revenue: '$350,000', cogs: '$110,000', grossProfit: '$240,000',
                    opEx: '$140,000', noi: '$100,000', ebitda: '$115,000',
                    deprAmort: '$15,000', interest: '$4,000', ebt: '$81,000',
                    tax: '$20,000', ownerDraw: '$15,000', netProfit: '$46,000'
                },
                balance: {
                    cash: '$110,000', ar: '$95,000', inv: '$210,000', caOth: '$10,000',
                    assetsCur: '$425,000', assetsFix: '$120,000', assetsNFix: '$0', assetsTot: '$545,000',
                    liabtsCur: '$140,000', crCards: '$18,000', LTD: '$190,000', liabtsTot: '$348,000',
                    equityTot: '$197,000', balS_checkYn: true
                },
                coverage: { dscrBus: '1.38', dscrGlob: '1.25', dscrProj: '1.20' },
                profitability: {
                    margGross: '68.5%', margNet: '13.1%',
                    roa: '—', roe: '—',
                    revAssets: '0.64x', revEquity: '1.77x',
                    opExAssets: '25.6%', opExEquity: '71.0%'
                },
                leverage: {
                    levBus: '2.20x', levGlob: '2.55x', levProj: '2.45x',
                    liabFa: '2.90x', liabRev: '0.31x', liabGlobFa: '3.1x', liabGlobRev: '0.38x'
                },
                liquidity: {
                    wCap: '$285,000', curRatio: '3.03x', quickRatio: '1.46x', liqAssets: '78.0%'
                },
                activity: {
                    dio: '48 Days', dso: '33 Days', dpo: '60 Days', ccc: '21 Days'
                }
            }
        }
    ];

    // --- DERIVED VIEW LOGIC ---

    const currentProfile = ALL_PROFILES.find(p => p.id === selectedProfileId);
    const currentIndex = ALL_PROFILES.findIndex(p => p.id === selectedProfileId);
    const previousProfile = currentIndex > 0 ? ALL_PROFILES[currentIndex - 1] : null;

    // Helper to calc delta
    const getDelta = (curr, prev) => {
        if (!prev) return null;
        const diff = curr - prev;
        const pct = (diff / prev) * 100;
        return { diff, pct, direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat' };
    };

    // Calculate Snapshot Deltas
    const deltas = useMemo(() => {
        if (!previousProfile || !currentProfile) return {};
        // Note: For Interim drafts, comparison logic might differ (e.g. YTD vs YTD), 
        // but for this MVP we compare against previous full profile as 'Trend' base.
        return {
            revenue: getDelta(currentProfile.data.revenue, previousProfile.data.revenue),
            ebitda: getDelta(currentProfile.data.ebitda, previousProfile.data.ebitda),
            dscrBus: getDelta(currentProfile.data.dscrBus, previousProfile.data.dscrBus),
            dscrGlob: getDelta(currentProfile.data.dscrGlob, previousProfile.data.dscrGlob)
        };
    }, [currentProfile, previousProfile]);


    // --- RENDERERS ---

    if (viewMode === 'history_list') {
        return (
            <HistoryListView
                profiles={ALL_PROFILES}
                onSelect={(id) => { setSelectedProfileId(id); setViewMode('time_rail'); }}
                onClose={() => setViewMode('time_rail')}
            />
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen pb-20 -m-6 animate-in fade-in duration-500">

            {/* 1. HEADER & TIME RAIL */}
            <div className="bg-white border-b border-slate-200 relative shadow-sm">
                <div className="max-w-7xl mx-auto px-6 pt-4 pb-0">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-slate-900 rounded-lg text-white shadow-sm">
                                <Building2 size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Financial Intelligence</h1>
                                <div className="text-xs text-slate-500 font-medium mt-0.5">
                                    {accountId} • {currentProfile.meta.fiscalYear} • {currentProfile.meta.source}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Only show Edit Source for Drafts */}
                            {currentProfile.meta.status === 'Draft' && onEditSource && (
                                <button
                                    onClick={() => onEditSource({ accountId, fiscalYear: currentProfile.meta.fiscalYear })}
                                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-md transition-colors"
                                >
                                    <Pen size={12} /> Edit Source
                                </button>
                            )}
                            <button
                                onClick={() => setViewMode('history_list')}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 rounded-md transition-colors border border-transparent hover:border-slate-200"
                            >
                                <History size={14} /> Full History
                            </button>
                        </div>
                    </div>

                    {/* TIME RAIL */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0">
                        {ALL_PROFILES.map((profile, idx) => (
                            <button
                                key={profile.id}
                                onClick={() => setSelectedProfileId(profile.id)}
                                className={`
                                    relative px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap z-10
                                    ${selectedProfileId === profile.id
                                        ? 'border-blue-600 text-blue-700 bg-slate-50/50'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                    }
                                `}
                            >
                                <div className="flex items-center gap-2">
                                    <span>{profile.meta.fiscalYear}</span>
                                    <span className={`h-3 w-px ${selectedProfileId === profile.id ? 'bg-blue-200' : 'bg-slate-200'}`}></span>
                                    <span className="font-medium opacity-80">{profile.meta.type}</span>
                                    {profile.meta.status === 'Draft' && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-1"></span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                {/* 2. CONTEXT BANNERS */}
                {currentProfile.meta.status === 'Draft' && (
                    <div className="bg-amber-50 border-t border-amber-100 px-6 py-2 flex justify-center items-center gap-2 text-xs text-amber-800 font-medium mt-1">
                        <AlertCircle size={14} />
                        <span>PREVIEW MODE — Mapping In Progress ({currentProfile.meta.mappingProgress}%). Data not for underwriting.</span>
                    </div>
                )}
            </div>


            {/* 3. SNAPSHOT WITH DELTA CHIPS */}
            <div className="bg-white border-b border-slate-200 px-6 py-6 custom-gradient-subtle">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        <DeltaSnapshotCard
                            label="Revenue"
                            value={currentProfile.details.income.revenue}
                            delta={deltas.revenue}
                            subtext="Operational"
                        />
                        <DeltaSnapshotCard
                            label="EBITDA"
                            value={currentProfile.details.income.ebitda}
                            delta={deltas.ebitda}
                            subtext="Operational"
                            highlight="text-emerald-700"
                        />
                        <div className="hidden md:block w-px bg-slate-100 mx-auto h-full"></div>
                        <DeltaSnapshotCard
                            label="Bus. DSCR"
                            value={currentProfile.details.coverage.dscrBus}
                            delta={deltas.dscrBus}
                            subtext="Operational"
                            highlight="text-blue-700"
                            isRatio
                        />
                        <DeltaSnapshotCard
                            label="Global DSCR"
                            value={currentProfile.details.coverage.dscrGlob}
                            delta={deltas.dscrGlob}
                            subtext="Bus + Household"
                            highlight="text-blue-700"
                            isRatio
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-4">
                {/* 4. ANALYST DRILL-DOWN SECTIONS */}

                {/* Income Statement */}
                <DrillDownSection
                    title="1. Income Statement Intelligence"
                    icon={TrendingUp}
                    isOpen={openSections['income']}
                    onToggle={() => toggleSection('income')}
                    summaryMetrics={[
                        { label: 'Revenue', value: currentProfile.details.income.revenue },
                        { label: 'Net Profit', value: currentProfile.details.income.netProfit }
                    ]}
                    context={currentProfile}
                >
                    <div className="p-6 pt-0">
                        {/* Default VIEW: Snapshot */}
                        <table className="w-full text-sm">
                            <tbody className="divide-y divide-slate-50">
                                <DataRow label="Revenue" value={currentProfile.details.income.revenue} bold />
                                <DataRow label="COGS" value={currentProfile.details.income.cogs} indent />
                                <DataRow label="Gross Profit" value={currentProfile.details.income.grossProfit} highlight />
                                <DataRow label="Operating Expenses" value={currentProfile.details.income.opEx} />
                                <DataRow label="NOI" value={currentProfile.details.income.noi} bold />
                                <DataRow label="EBITDA" value={currentProfile.details.income.ebitda} highlight />
                                <DataRow label="Depr. & Amort." value={currentProfile.details.income.deprAmort} indent />
                                <DataRow label="Interest" value={currentProfile.details.income.interest} indent />
                                <DataRow label="Net Profit" value={currentProfile.details.income.netProfit} highlight last />
                            </tbody>
                        </table>
                    </div>
                </DrillDownSection>

                {/* Balance Sheet */}
                <DrillDownSection
                    title="2. Balance Sheet Intelligence"
                    icon={Scale}
                    isOpen={openSections['balance']}
                    onToggle={() => toggleSection('balance')}
                    summaryMetrics={[
                        { label: 'Total Assets', value: currentProfile.details.balance.assetsTot },
                        { label: 'Total Equity', value: currentProfile.details.balance.equityTot }
                    ]}
                    context={currentProfile}
                >
                    <div className="p-6 pt-0 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <SectionTitle>Assets</SectionTitle>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-50">
                                    <DataRow label="Cash & Equiv." value={currentProfile.details.balance.cash} indent />
                                    <DataRow label="Accts Receivable" value={currentProfile.details.balance.ar} indent />
                                    <DataRow label="Inventory" value={currentProfile.details.balance.inv} indent />
                                    <DataRow label="Total Cur. Assets" value={currentProfile.details.balance.assetsCur} bold />
                                    <DataRow label="Fixed Assets" value={currentProfile.details.balance.assetsFix} />
                                    <DataRow label="Total Assets" value={currentProfile.details.balance.assetsTot} highlight />
                                </tbody>
                            </table>
                        </div>
                        <div>
                            <SectionTitle>Liabilities & Equity</SectionTitle>
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-slate-50">
                                    <DataRow label="Cur. Liabilities" value={currentProfile.details.balance.liabtsCur} bold />
                                    <DataRow label="Long Term Debt" value={currentProfile.details.balance.LTD} />
                                    <DataRow label="Total Liabilities" value={currentProfile.details.balance.liabtsTot} highlight />
                                    <DataRow label="Total Equity" value={currentProfile.details.balance.equityTot} highlight />
                                    {currentProfile.details.balance.balS_checkYn && (
                                        <tr><td colSpan={2} className="py-2 text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle size={12} /> Balanced</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </DrillDownSection>

                {/* Coverage Profile */}
                <DrillDownSection
                    title="3. Coverage Profile"
                    icon={ShieldCheck}
                    isOpen={openSections['coverage']}
                    onToggle={() => toggleSection('coverage')}
                    summaryMetrics={[{ label: 'Glob. DSCR', value: currentProfile.details.coverage.dscrGlob }]}
                    context={currentProfile}
                >
                    <div className="p-6 pt-0 grid grid-cols-3 gap-6">
                        <MetricCard label="Business DSCR" value={currentProfile.details.coverage.dscrBus} />
                        <MetricCard label="Global DSCR" value={currentProfile.details.coverage.dscrGlob} highlight />
                        <MetricCard label="Post-Loan Proj." value={currentProfile.details.coverage.dscrProj} subtext="Hypothetical" />
                    </div>
                </DrillDownSection>

                {/* 4. PROFITABILITY */}
                <DrillDownSection
                    title="4. Profitability Profile"
                    icon={Percent}
                    isOpen={openSections['profitability']}
                    onToggle={() => toggleSection('profitability')}
                    summaryMetrics={[
                        { label: 'Net Margin', value: currentProfile.details.profitability.margNet }
                    ]}
                    context={currentProfile}
                >
                    <div className="p-6 pt-0 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <MetricCard label="Gross Margin" value={currentProfile.details.profitability.margGross} />
                        <MetricCard label="Net Margin" value={currentProfile.details.profitability.margNet} />
                        <MetricCard label="ROA" value={currentProfile.details.profitability.roa} />
                        <MetricCard label="ROE" value={currentProfile.details.profitability.roe} />
                        <MetricCard label="Rev/Assets" value={currentProfile.details.profitability.revAssets} />
                        <MetricCard label="Rev/Equity" value={currentProfile.details.profitability.revEquity} />
                        <MetricCard label="OpEx/Assets" value={currentProfile.details.profitability.opExAssets} />
                        <MetricCard label="OpEx/Equity" value={currentProfile.details.profitability.opExEquity} />
                    </div>
                </DrillDownSection>

                {/* 5. LEVERAGE */}
                <DrillDownSection
                    title="5. Leverage Profile"
                    icon={BarChart3}
                    isOpen={openSections['leverage']}
                    onToggle={() => toggleSection('leverage')}
                    summaryMetrics={[
                        { label: 'Global Leverage', value: currentProfile.details.leverage.levGlob }
                    ]}
                    context={currentProfile}
                >
                    <div className="p-6 pt-0 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
                        <div className="space-y-3">
                            <SectionTitle>Business Leverage</SectionTitle>
                            <DataRow label="Ratio" value={currentProfile.details.leverage.levBus} />
                            <DataRow label="Liab / FA" value={currentProfile.details.leverage.liabFa} />
                            <DataRow label="Liab / Rev" value={currentProfile.details.leverage.liabRev} />
                        </div>
                        <div className="space-y-3 border-l border-slate-100 pl-6">
                            <SectionTitle>Global Leverage</SectionTitle>
                            <DataRow label="Ratio" value={currentProfile.details.leverage.levGlob} />
                            <DataRow label="Liab / FA" value={currentProfile.details.leverage.liabGlobFa} />
                            <DataRow label="Liab / Rev" value={currentProfile.details.leverage.liabGlobRev} />
                        </div>
                        <div className="space-y-3 border-l border-slate-100 pl-6">
                            <SectionTitle>Projected Leverage</SectionTitle>
                            <DataRow label="Ratio" value={currentProfile.details.leverage.levProj} />
                            <div className="text-[10px] text-slate-400 italic mt-2">Post-loan projection based on proposed terms.</div>
                        </div>
                    </div>
                </DrillDownSection>

                {/* 6. LIQUIDITY & 7. ACTIVITY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DrillDownSection
                        title="6. Liquidity Profile"
                        icon={Wallet}
                        isOpen={openSections['liquidity']}
                        onToggle={() => toggleSection('liquidity')}
                        summaryMetrics={[{ label: 'Current Ratio', value: currentProfile.details.liquidity.curRatio }]}
                        context={currentProfile}
                    >
                        <div className="p-6 pt-0 grid grid-cols-2 gap-4">
                            <MetricCard label="Working Capital" value={currentProfile.details.liquidity.wCap} />
                            <MetricCard label="Current Ratio" value={currentProfile.details.liquidity.curRatio} />
                            <MetricCard label="Quick Ratio" value={currentProfile.details.liquidity.quickRatio} />
                            <MetricCard label="Liquid Assets %" value={currentProfile.details.liquidity.liqAssets} />
                        </div>
                    </DrillDownSection>

                    <DrillDownSection
                        title="7. Activity Profile"
                        icon={ArrowRightLeft}
                        isOpen={openSections['activity']}
                        onToggle={() => toggleSection('activity')}
                        summaryMetrics={[{ label: 'Cash Conv.', value: currentProfile.details.activity.ccc }]}
                        context={currentProfile}
                    >
                        <div className="p-6 pt-0 grid grid-cols-2 gap-4">
                            <MetricCard label="DIO" value={currentProfile.details.activity.dio} subtext="Days Inventory" />
                            <MetricCard label="DSO" value={currentProfile.details.activity.dso} subtext="Days Sales" />
                            <MetricCard label="DPO" value={currentProfile.details.activity.dpo} subtext="Days Payable" />
                            <MetricCard label="CCC" value={currentProfile.details.activity.ccc} highlight subtext="Cash Conversion" />
                        </div>
                    </DrillDownSection>
                </div>
            </div>
        </div >
    );
};

// --- SUB-COMPONENTS ---

// 1. Delta Snapshot Card
const DeltaSnapshotCard = ({ label, value, delta, subtext, highlight, isRatio }) => {
    // Delta Visuals
    const isUp = delta?.direction === 'up';
    const isDown = delta?.direction === 'down';
    const isFlat = delta?.direction === 'flat';

    // For ratios, UP is usually good, for Expenses UP might be bad - keeping simple for MVP: Green=Up, Red=Down
    // In real app, semantic coloring logic resides here.
    const deltaColor = isUp ? 'text-emerald-600' : isDown ? 'text-rose-600' : 'text-slate-400';
    const DeltaIcon = isUp ? ArrowUpRight : isDown ? ArrowDownRight : Minus;

    return (
        <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</div>
            <div className={`text-2xl font-mono font-bold ${highlight || 'text-slate-800'}`}>{value}</div>
            <div className="flex items-center gap-2 mt-1.5 h-5">
                {delta ? (
                    <div className={`flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-50 ${deltaColor}`}>
                        <DeltaIcon size={10} strokeWidth={3} />
                        <span>{Math.abs(delta.pct).toFixed(1)}%</span>
                    </div>
                ) : (
                    <div className="h-4"></div> // Spacer
                )}
                <span className="text-[9px] font-bold text-slate-400 uppercase">{subtext}</span>
            </div>
        </div>
    );
};

// 2. Drill-Down Section Container (Tabs: Snapshot | Trend | Variance)
const DrillDownSection = ({ title, icon: Icon, children, isOpen, onToggle, summaryMetrics = [], context }) => {
    // Internal Tab State (Analyst Drill-Down)
    const [activeTab, setActiveTab] = useState('snapshot'); // snapshot, trend, variance

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
            {/* Header */}
            <div
                className={`flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-slate-50 transition-colors ${isOpen ? 'bg-slate-50 border-b border-slate-200' : ''}`}
                onClick={onToggle}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-1.5 rounded transition-colors ${isOpen ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>
                        {Icon && <Icon size={18} />}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
                        {isOpen && <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{context.meta.fiscalYear} • {context.meta.source}</div>}
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    {!isOpen && summaryMetrics.map((m, i) => (
                        <div key={i} className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">{m.label}</span>
                            <span className="text-xs font-mono font-bold text-slate-700">{m.value}</span>
                        </div>
                    ))}
                    {isOpen ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                </div>
            </div>

            {/* Drill-Down Content */}
            {isOpen && (
                <div>
                    {/* Internal Tabs */}
                    <div className="flex items-center px-6 border-b border-slate-100">
                        {['snapshot', 'trend', 'variance'].map(tab => (
                            <button
                                key={tab}
                                onClick={(e) => { e.stopPropagation(); setActiveTab(tab); }}
                                className={`
                                    px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide border-b-2 transition-all
                                    ${activeTab === tab
                                        ? 'border-blue-600 text-blue-700'
                                        : 'border-transparent text-slate-400 hover:text-slate-600'
                                    }
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* View Router */}
                    <div className="animate-in fade-in duration-200">
                        {activeTab === 'snapshot' && children}
                        {activeTab === 'trend' && (
                            <div className="p-8 text-center text-slate-400 text-sm py-12">
                                <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
                                Multi-year trend visualization would render here.
                            </div>
                        )}
                        {activeTab === 'variance' && (
                            <div className="p-8 text-center text-slate-400 text-sm py-12">
                                <ArrowRightLeft size={32} className="mx-auto mb-2 opacity-50" />
                                Year-over-Year variance analysis would render here.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

// 3. History List View (Audit)
const HistoryListView = ({ profiles, onSelect, onClose }) => (
    <div className="bg-slate-50 min-h-screen p-8 animate-in slide-in-from-bottom-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <History size={20} className="text-slate-500" /> Profile History
                </h2>
                <button onClick={onClose} className="text-sm font-bold text-blue-600 hover:text-blue-800">Close</button>
            </div>
            <div className="divide-y divide-slate-100">
                {profiles.slice().reverse().map(profile => (
                    <div
                        key={profile.id}
                        onClick={() => onSelect(profile.id)}
                        className="p-4 hover:bg-slate-50 cursor-pointer transition-colors grid grid-cols-4 items-center gap-4 group"
                    >
                        <div>
                            <div className="font-bold text-slate-900">{profile.meta.fiscalYear}</div>
                            <div className="text-xs text-slate-500">{profile.meta.period}</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-700">{profile.meta.source}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{profile.meta.type}</div>
                        </div>
                        <div>
                            <div className="text-xs font-mono text-slate-600">Rev: {profile.details.income.revenue}</div>
                            <div className="text-xs font-mono text-slate-600">DSCR: {profile.details.coverage.dscrGlob}</div>
                        </div>
                        <div className="flex justify-end">
                            {profile.meta.status === 'Active' && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full border border-emerald-200">ACTIVE</span>}
                            {profile.meta.status === 'Draft' && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full border border-amber-200">DRAFT</span>}
                            {profile.meta.status === 'Archived' && <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full border border-slate-200">ARCHIVED</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- HELPER COMPS ---
const SectionTitle = ({ children }) => (
    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-slate-50 pb-1">
        {children}
    </div>
);
const DataRow = ({ label, value, indent, bold, highlight, last }) => (
    <tr className={`group transition-colors hover:bg-slate-50 cursor-default ${highlight ? 'bg-slate-50/60' : ''} ${last ? 'rounded-b-lg' : ''}`}>
        <td className={`py-1.5 pr-4 ${indent ? 'pl-8' : 'pl-0'} ${bold || highlight ? 'font-bold text-slate-800' : 'text-slate-600 font-medium'} text-xs`}>
            {label}
        </td>
        <td className={`py-1.5 px-0 text-right font-mono text-xs ${bold || highlight ? 'font-bold text-slate-900' : 'text-slate-600'} ${last ? 'rounded-br-xl' : ''}`}>
            {value}
        </td>
    </tr>
);
const MetricCard = ({ label, value, subtext, highlight }) => (
    <div className="flex flex-col p-3 bg-slate-50 rounded-lg border border-slate-100">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 truncate" title={label}>{label}</div>
        <div className={`font-mono font-bold text-lg ${highlight ? 'text-blue-700' : 'text-slate-800'}`}>
            {value || '—'}
        </div>
        {subtext && <div className="text-[9px] text-slate-400 mt-1">{subtext}</div>}
    </div>
);

export default FinancialIntelligence;
