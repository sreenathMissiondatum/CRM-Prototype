import React, { useState, useMemo } from 'react';
import {
    ShieldCheck, Calendar, Lock,
    TrendingUp, Activity,
    DollarSign, Percent, BarChart3, Pen,
    Building2, Wallet, Scale,
    Briefcase, ArrowRightLeft,
    FileText, Users, CheckCircle,
    ChevronDown, ChevronRight, Clock, History, AlertCircle,
    Archive, ArrowUpRight, ArrowDownRight, Minus, MoreHorizontal, Info, FileSpreadsheet, X
} from 'lucide-react';
import TrendEngineTab from './TrendEngineTab';

const TEMPLATES = [
    { id: 'TAX_RETURN', name: 'Tax Return', type: 'STRUCTURED', desc: 'IRS structured classification.', icon: FileText, sections: ['Revenue', 'COGS', 'OpEx', 'Assets', 'Liabilities', 'Equity'] },
    { id: 'PL_ACTUALS', name: 'P&L (Actuals)', type: 'STRUCTURED', desc: 'Chart of accounts driven import (QuickBooks).', icon: FileSpreadsheet, sections: ['Revenue', 'COGS', 'OpEx', 'Other Income'] },
    { id: 'BALANCE_SHEET', name: 'Balance Sheet', type: 'STRUCTURED', desc: 'Assets & Liabilities structured snapshot.', icon: Scale, sections: ['Assets', 'Liabilities', 'Equity'] },
    { id: 'PRO_FORMA', name: 'Pro Forma', type: 'PROJECTED', desc: 'Projection model based on historical run rates.', icon: TrendingUp, sections: ['Revenue Projections', 'Expense Assumptions', 'CapEx'] }
];

const FinancialIntelligence = ({ accountId = 'ACC-12345', onEditSource }) => {
    // 1. GLOBAL STATE & NAVIGATION
    // 'time_rail' (default) or 'history_list' (vertical audit view)
    const [viewMode, setViewMode] = useState('time_rail');
    const [globalTab, setGlobalTab] = useState('statement'); // 'statement' | 'trend'

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

    // --- STATE & ACTIONS ---
    const [profiles, setProfiles] = useState(() => {
        const baseProfiles = ALL_PROFILES.map(p => ({
            ...p,
            timePeriodId: p.meta.fiscalYear,
            sourceType: p.meta.type,
            name: p.meta.source, 
            status: p.meta.status === 'Archived' ? 'HISTORICAL' : (p.meta.status === 'Active' ? 'PRIMARY' : 'DRAFT'),
            isPrimary: p.meta.status === 'Active' || p.meta.status === 'Archived',
            version: 1,
            mappingCompleteness: p.meta.mappingProgress || 100
        }));

        const mockData = baseProfiles[2].data;
        const mockDetails = baseProfiles[2].details;

        return [
            ...baseProfiles,
            // 2025 - P&L (Actuals)
            {
                id: 'draft_2025_pl1',
                timePeriodId: '2025 (YTD)',
                sourceType: 'P&L (Actuals)',
                name: 'Profile 1 \u2013 QB Import',
                status: 'PRIMARY',
                isPrimary: true,
                version: 1,
                mappingCompleteness: 65,
                data: mockData, details: mockDetails
            },
            {
                id: 'draft_2025_pl2',
                timePeriodId: '2025 (YTD)',
                sourceType: 'P&L (Actuals)',
                name: 'Profile 2 \u2013 Adjusted',
                status: 'DRAFT',
                isPrimary: false,
                version: 2,
                mappingCompleteness: 100,
                data: mockData, details: mockDetails
            },
            // 2025 - Pro Forma
            {
                id: 'draft_2025_pf1',
                timePeriodId: '2025 (YTD)',
                sourceType: 'Pro Forma',
                name: 'Profile 1 \u2013 Base Case',
                status: 'DRAFT',
                isPrimary: false,
                version: 1,
                mappingCompleteness: 100,
                data: mockData, details: mockDetails
            },
            {
                id: 'draft_2025_pf2',
                timePeriodId: '2025 (YTD)',
                sourceType: 'Pro Forma',
                name: 'Profile 2 \u2013 Stress Case',
                status: 'DRAFT',
                isPrimary: false,
                version: 1,
                mappingCompleteness: 100,
                data: mockData, details: mockDetails
            },
            // 2024 - Tax Return
            {
                id: 'draft_2024_tx1',
                timePeriodId: '2024',
                sourceType: 'Tax Return',
                name: 'Profile 1 \u2013 IRS Filed',
                status: 'LOCKED',
                isPrimary: false,
                version: 1,
                mappingCompleteness: 100,
                data: mockData, details: mockDetails
            },
            {
                id: 'draft_2024_tx2',
                timePeriodId: '2024',
                sourceType: 'Tax Return',
                name: 'Profile 2 \u2013 OCR Parsed',
                status: 'SUPPORTING',
                isPrimary: false,
                version: 1,
                mappingCompleteness: 100,
                data: mockData, details: mockDetails
            },
            {
                id: 'draft_2024_tx3',
                timePeriodId: '2024',
                sourceType: 'Tax Return',
                name: 'Profile 3 \u2013 Adjusted',
                status: 'DRAFT',
                isPrimary: false,
                version: 2,
                mappingCompleteness: 100,
                data: mockData, details: mockDetails
            },
            // 2024 - P&L (Actuals)
            {
                id: 'draft_2024_pl1',
                timePeriodId: '2024',
                sourceType: 'P&L (Actuals)',
                name: 'Profile 1 \u2013 QB Year-End',
                status: 'PRIMARY',
                isPrimary: true,
                version: 1,
                mappingCompleteness: 100,
                data: { revenue: 1250000, ebitda: 320000, netProfit: 185000, dscrBus: 1.45, dscrGlob: 1.32, grossMargin: 61.2, netMargin: 14.8, totalAssets: 1820000, totalEquity: 640000, curRatio: 2.1, ccc: 29 },
                details: {
                    income: { revenue: '$1,250,000', cogs: '$485,000', grossProfit: '$765,000', opEx: '$445,000', noi: '$320,000', ebitda: '$320,000', deprAmort: '$42,000', interest: '$28,000', ebt: '$250,000', tax: '$52,000', ownerDraw: '$13,000', netProfit: '$185,000' },
                    balance: { cash: '$210,000', ar: '$185,000', inv: '$340,000', caOth: '$0', assetsCur: '$735,000', assetsFix: '$1,085,000', assetsNFix: '$0', assetsTot: '$1,820,000', liabtsCur: '$350,000', crCards: '$42,000', LTD: '$787,000', liabtsTot: '$1,180,000', equityTot: '$640,000', balS_checkYn: true },
                    coverage: { dscrBus: '1.45', dscrGlob: '1.32', dscrProj: '1.28' },
                    profitability: { margGross: '61.2%', margNet: '14.8%', roa: '10.2%', roe: '28.9%', revAssets: '0.69x', revEquity: '1.95x', opExAssets: '24.4%', opExEquity: '69.5%' },
                    leverage: { levBus: '2.46x', levGlob: '2.81x', levProj: '2.65x', liabFa: '1.09x', liabRev: '0.94x', liabGlobFa: '1.18x', liabGlobRev: '1.02x' },
                    liquidity: { wCap: '$385,000', curRatio: '2.10x', quickRatio: '1.13x', liqAssets: '40.4%' },
                    activity: { dio: '52 Days', dso: '27 Days', dpo: '50 Days', ccc: '29 Days' }
                }
            },
            // 2023 - Tax Return (already from baseProfiles, but adding P&L)
            {
                id: 'draft_2023_pl1',
                timePeriodId: '2023',
                sourceType: 'P&L (Actuals)',
                name: 'Profile 1 \u2013 QB Year-End',
                status: 'PRIMARY',
                isPrimary: true,
                version: 1,
                mappingCompleteness: 100,
                data: { revenue: 1080000, ebitda: 268000, netProfit: 148000, dscrBus: 1.38, dscrGlob: 1.21, grossMargin: 58.5, netMargin: 13.7, totalAssets: 1540000, totalEquity: 520000, curRatio: 1.9, ccc: 34 },
                details: {
                    income: { revenue: '$1,080,000', cogs: '$448,000', grossProfit: '$632,000', opEx: '$364,000', noi: '$268,000', ebitda: '$268,000', deprAmort: '$38,000', interest: '$31,000', ebt: '$199,000', tax: '$41,000', ownerDraw: '$10,000', netProfit: '$148,000' },
                    balance: { cash: '$160,000', ar: '$155,000', inv: '$295,000', caOth: '$0', assetsCur: '$610,000', assetsFix: '$930,000', assetsNFix: '$0', assetsTot: '$1,540,000', liabtsCur: '$320,000', crCards: '$36,000', LTD: '$700,000', liabtsTot: '$1,020,000', equityTot: '$520,000', balS_checkYn: true },
                    coverage: { dscrBus: '1.38', dscrGlob: '1.21', dscrProj: '1.15' },
                    profitability: { margGross: '58.5%', margNet: '13.7%', roa: '9.6%', roe: '28.5%', revAssets: '0.70x', revEquity: '2.08x', opExAssets: '23.6%', opExEquity: '70.0%' },
                    leverage: { levBus: '2.63x', levGlob: '2.96x', levProj: '2.80x', liabFa: '1.10x', liabRev: '0.94x', liabGlobFa: '1.19x', liabGlobRev: '1.03x' },
                    liquidity: { wCap: '$290,000', curRatio: '1.90x', quickRatio: '0.98x', liqAssets: '26.2%' },
                    activity: { dio: '58 Days', dso: '30 Days', dpo: '54 Days', ccc: '34 Days' }
                }
            },
            // 2022 - P&L (Actuals)
            {
                id: 'draft_2022_pl1',
                timePeriodId: '2022',
                sourceType: 'P&L (Actuals)',
                name: 'Profile 1 \u2013 QB Year-End',
                status: 'PRIMARY',
                isPrimary: true,
                version: 1,
                mappingCompleteness: 100,
                data: { revenue: 920000, ebitda: 195000, netProfit: 110000, dscrBus: 1.22, dscrGlob: 1.10, grossMargin: 54.3, netMargin: 11.9, totalAssets: 1270000, totalEquity: 410000, curRatio: 1.7, ccc: 41 },
                details: {
                    income: { revenue: '$920,000', cogs: '$420,000', grossProfit: '$500,000', opEx: '$305,000', noi: '$195,000', ebitda: '$195,000', deprAmort: '$32,000', interest: '$33,000', ebt: '$130,000', tax: '$20,000', ownerDraw: '$0', netProfit: '$110,000' },
                    balance: { cash: '$120,000', ar: '$130,000', inv: '$250,000', caOth: '$0', assetsCur: '$500,000', assetsFix: '$770,000', assetsNFix: '$0', assetsTot: '$1,270,000', liabtsCur: '$292,000', crCards: '$30,000', LTD: '$568,000', liabtsTot: '$860,000', equityTot: '$410,000', balS_checkYn: true },
                    coverage: { dscrBus: '1.22', dscrGlob: '1.10', dscrProj: '1.05' },
                    profitability: { margGross: '54.3%', margNet: '11.9%', roa: '8.7%', roe: '26.8%', revAssets: '0.72x', revEquity: '2.24x', opExAssets: '24.0%', opExEquity: '74.4%' },
                    leverage: { levBus: '2.84x', levGlob: '3.10x', levProj: '2.95x', liabFa: '1.12x', liabRev: '0.93x', liabGlobFa: '1.21x', liabGlobRev: '1.05x' },
                    liquidity: { wCap: '$208,000', curRatio: '1.71x', quickRatio: '0.86x', liqAssets: '24.0%' },
                    activity: { dio: '65 Days', dso: '35 Days', dpo: '59 Days', ccc: '41 Days' }
                }
            }
        ];
    });

    const [expandedPeriods, setExpandedPeriods] = useState({ '2025 (YTD)': true, '2024': true, '2023': true, '2022': true });
    const togglePeriod = (p) => setExpandedPeriods(prev => ({ ...prev, [p]: !prev[p] }));
    
    const [expandedSources, setExpandedSources] = useState({ 
        '2025 (YTD)-Interim': true, 
        '2024-Tax Return': true,
        '2025 (YTD)-P&L (Actuals)': true,
        '2025 (YTD)-Pro Forma': true
    });
    const toggleSource = (s) => setExpandedSources(prev => ({ ...prev, [s]: !prev[s] }));
    
    const [openMenuId, setOpenMenuId] = useState(null);

    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [targetPeriodForTemplate, setTargetPeriodForTemplate] = useState(null);

    const handleOpenTemplateModal = (e, period) => {
        e.stopPropagation();
        setTargetPeriodForTemplate(period);
        setIsTemplateModalOpen(true);
    };

    const handleCreateProfileFromTemplate = (template) => {
        const newId = 'draft_' + Date.now();
        const existingInGroup = profiles.filter(p => p.timePeriodId === targetPeriodForTemplate && p.sourceType === template.name);
        const hasPrimary = existingInGroup.some(p => p.isPrimary);

        const newProfile = {
            id: newId,
            timePeriodId: targetPeriodForTemplate,
            sourceType: template.name,
            name: `${template.name} \u2013 Initial Draft`,
            status: 'DRAFT',
            isPrimary: false,
            version: existingInGroup.length + 1,
            mappingCompleteness: 0,
            data: { revenue: 0, ebitda: 0, dscrBus: 0, dscrGlob: 0 },
            details: {
                income: { revenue: '$0', cogs: '$0', grossProfit: '$0', opEx: '$0', noi: '$0', ebitda: '$0', deprAmort: '$0', interest: '$0', netProfit: '$0' },
                balance: { assetsCur: '$0', assetsTot: '$0', liabtsCur: '$0', liabtsTot: '$0', equityTot: '$0' },
                coverage: { dscrBus: '0.00', dscrGlob: '0.00', dscrProj: '0.00' },
                profitability: { margGross: '0%', margNet: '0%', roa: '0%', roe: '0%' },
                leverage: { levBus: '0.00x', levGlob: '0.00x', levProj: '0.00x' },
                liquidity: { wCap: '$0', curRatio: '0.00x', quickRatio: '0.00x', liqAssets: '0%' },
                activity: { dio: '0', dso: '0', dpo: '0', ccc: '0' }
            }
        };

        setProfiles(prev => [newProfile, ...prev]);
        setExpandedPeriods(prev => ({ ...prev, [targetPeriodForTemplate]: true }));
        setExpandedSources(prev => ({ ...prev, [`${targetPeriodForTemplate}-${template.name}`]: true }));
        setSelectedProfileId(newId);
        setIsTemplateModalOpen(false);
        
        // Mock routing to mapping flow
        setTimeout(() => alert(`Redirecting to Mapping Flow (Edit Source) for ${template.name}...`), 300);
    };

    const handleDuplicate = (e, profile) => {
        e.stopPropagation();
        const newId = 'draft_' + Date.now();
        setProfiles(prev => [
            ...prev,
            {
                ...profile,
                id: newId,
                name: `Copy of ${profile.name}`,
                status: 'DRAFT',
                isPrimary: false,
                version: profile.version + 1,
            }
        ]);
        setOpenMenuId(null);
    };

    const handleSetPrimary = (e, profile) => {
        e.stopPropagation();
        if (profile.mappingCompleteness !== 100) {
            alert("Cannot set as primary. Mapping must be 100%.");
            return;
        }
        if (window.confirm("This will replace the current primary profile for this period. Proceed?")) {
            setProfiles(prev => prev.map(p => {
                if (p.timePeriodId === profile.timePeriodId && p.isPrimary) {
                    return { ...p, isPrimary: false, status: 'SUPPORTING' };
                }
                if (p.id === profile.id) {
                    return { ...p, isPrimary: true, status: 'PRIMARY' };
                }
                return p;
            }));
        }
        setOpenMenuId(null);
    };

    const handleLock = (e, profile) => {
        e.stopPropagation();
        setProfiles(prev => prev.map(p => p.id === profile.id ? { ...p, status: 'LOCKED' } : p));
        setOpenMenuId(null);
    };

    const handleDelete = (e, profileId) => {
        e.stopPropagation();
        if (window.confirm("Delete this draft profile?")) {
            setProfiles(prev => prev.filter(p => p.id !== profileId));
            if (selectedProfileId === profileId) {
                const remains = profiles.filter(p => p.id !== profileId);
                setSelectedProfileId(remains.length ? remains[0].id : null);
            }
        }
        setOpenMenuId(null);
    };

    // --- DERIVED VIEW LOGIC ---

    // Grouping
    const groupedHierarchy = useMemo(() => {
        const groups = {};
        profiles.forEach(p => {
            if (!groups[p.timePeriodId]) groups[p.timePeriodId] = {};
            if (!groups[p.timePeriodId][p.sourceType]) groups[p.timePeriodId][p.sourceType] = [];
            groups[p.timePeriodId][p.sourceType].push(p);
        });
        return groups;
    }, [profiles]);

    const sortedPeriods = useMemo(() => {
        return Object.keys(groupedHierarchy).sort((a, b) => b.localeCompare(a));
    }, [groupedHierarchy]);

    const currentProfile = profiles.find(p => p.id === selectedProfileId) || profiles[0];
    const currentIndex = profiles.findIndex(p => p.id === selectedProfileId);
    const previousProfile = currentIndex > 0 ? profiles[currentIndex - 1] : null;

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

    const handleGlobalTabSwitch = (tab) => {
        setGlobalTab(tab);
        console.log(`[AUDIT LOG] User switched to Tab: ${tab} at ${new Date().toISOString()}`);
    };

    return (
        <div className="flex flex-col bg-slate-50 min-h-screen -m-6 animate-in fade-in duration-500">

            {/* GLOBAL HEADER */}
            <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center justify-between shadow-sm relative z-30">
                <div className="flex items-center gap-3">
                    <div className="p-1 bg-slate-900 rounded text-white shadow-sm flex items-center justify-center">
                        <Building2 size={16} strokeWidth={2} />
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                        <h1 className="text-[13px] font-bold text-slate-900 tracking-tight leading-none">Financial Intelligence</h1>
                        <span className="text-slate-300 leading-none">|</span>
                        <span className="text-[11px] text-slate-500 font-medium leading-none">{accountId}</span>
                        <span className="text-slate-300 leading-none">•</span>
                        <span className="text-[11px] text-slate-500 font-medium leading-none">Cross-Profile Analytics</span>
                    </div>
                </div>
                {/* Global Tabs */}
                <div className="flex items-center gap-6 self-end h-full mt-1.5">
                    <button 
                        onClick={() => handleGlobalTabSwitch('statement')}
                        className={`border-b-2 text-[11px] font-bold uppercase tracking-wider relative transition-colors h-full px-1 ${globalTab === 'statement' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
                    >
                        Statement View
                    </button>
                    <button 
                        onClick={() => handleGlobalTabSwitch('trend')}
                        className={`border-b-2 text-[11px] font-bold uppercase tracking-wider relative transition-colors h-full px-1 ${globalTab === 'trend' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'}`}
                    >
                        Trend Engine
                    </button>
                </div>
            </div>

            {/* CONTENT AREA */}
            {globalTab === 'statement' ? (
                <div className="flex flex-1 overflow-hidden">
                    {/* LEFT PANEL - VERTICAL TIME RAIL */}
                    <div className="w-[320px] shrink-0 border-r border-slate-200 bg-white shadow-sm flex flex-col sticky top-0 h-screen overflow-y-auto z-20">
                        <div className="flex flex-col">
                    {sortedPeriods.map(period => (
                        <div key={period} className="border-b border-slate-200 bg-slate-50/30">
                            <div 
                                className="px-5 py-3 border-b border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/80 transition-colors"
                                onClick={() => togglePeriod(period)}
                            >
                                <span className="font-bold text-slate-900 text-[13px]">{period}</span>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={(e) => handleOpenTemplateModal(e, period)}
                                        className="text-[10px] text-slate-600 hover:text-slate-900 font-bold bg-white px-2 py-1 rounded border border-slate-200 shadow-sm transition-all"
                                    >
                                        + Add Profile
                                    </button>
                                    {expandedPeriods[period] ? <ChevronDown size={14} className="text-slate-500"/> : <ChevronRight size={14} className="text-slate-500"/>}
                                </div>
                            </div>
                            
                            {expandedPeriods[period] && (
                                <div className="flex flex-col bg-white">
                                    {Object.keys(groupedHierarchy[period]).sort().map(sourceType => {
                                        const sourceKey = `${period}-${sourceType}`;
                                        return (
                                            <div key={sourceType} className="border-b border-slate-100 last:border-b-0">
                                                <div 
                                                    className="px-5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                                                    onClick={() => toggleSource(sourceKey)}
                                                >
                                                    <span className="font-bold text-slate-600 text-[11px] uppercase tracking-wider">{sourceType}</span>
                                                    <div className="flex items-center gap-2">
                                                        {expandedSources[sourceKey] ? <ChevronDown size={14} className="text-slate-400"/> : <ChevronRight size={14} className="text-slate-400"/>}
                                                    </div>
                                                </div>
                                                
                                                {expandedSources[sourceKey] && (
                                                    <div className="flex flex-col pb-2">
                                                        {groupedHierarchy[period][sourceType].map(profile => {
                                                            const isActive = selectedProfileId === profile.id;
                                                            return (
                                                                <div 
                                                                    key={profile.id}
                                                                    onClick={() => setSelectedProfileId(profile.id)}
                                                                    className={`
                                                                        relative pl-7 pr-4 py-2.5 cursor-pointer transition-all group select-none
                                                                        ${isActive ? 'bg-blue-50/60' : 'hover:bg-slate-50'}
                                                                    `}
                                                                >
                                                                    {isActive && <div className="absolute left-0 top-0 w-1 h-full bg-blue-600 shadow-[2px_0_8px_rgba(37,99,235,0.4)]"></div>}
                                                                    
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="flex flex-col max-w-[12rem]">
                                                                            <div className="flex items-center gap-1.5">
                                                                                <span className={`text-[11px] font-bold truncate ${isActive ? 'text-blue-800' : 'text-slate-800'}`}>
                                                                                    {profile.name}
                                                                                </span>
                                                                                <span className="text-[9px] text-slate-400 font-mono">v{profile.version}</span>
                                                                            </div>
                                                                        </div>

                                                                        <div className="flex items-center gap-2 shrink-0">
                                                                            {/* Status Badges */}
                                                                            {profile.status === 'PRIMARY' && (
                                                                                <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 shadow-sm">PRIMARY</span>
                                                                            )}
                                                                            {profile.status === 'SUPPORTING' && (
                                                                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">SUPP</span>
                                                                            )}
                                                                            {profile.status === 'DRAFT' && profile.mappingCompleteness === 100 && (
                                                                                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">DRAFT</span>
                                                                            )}
                                                                            {profile.status === 'DRAFT' && profile.mappingCompleteness < 100 && (
                                                                                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">MAP {profile.mappingCompleteness}%</span>
                                                                            )}
                                                                            {profile.status === 'LOCKED' && (
                                                                                <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200 flex items-center gap-0.5"><Lock size={8} />LOCK</span>
                                                                            )}
                                                                            {profile.status === 'HISTORICAL' && (
                                                                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">HIST</span>
                                                                            )}

                                                                            {/* Kebab Menu */}
                                                                            <div className="relative">
                                                                                <button 
                                                                                    onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === profile.id ? null : profile.id); }}
                                                                                    className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-700 transition-colors"
                                                                                >
                                                                                    <MoreHorizontal size={14} />
                                                                                </button>
                                                                                
                                                                                {openMenuId === profile.id && (
                                                                                    <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-slate-200 shadow-xl rounded-md z-[60] py-1" onMouseLeave={() => setOpenMenuId(null)}>
                                                                                        <button onClick={(e) => handleDuplicate(e, profile)} className="w-full text-left px-4 py-2 text-[11px] font-semibold hover:bg-slate-50 text-slate-700">Duplicate Profile</button>
                                                                                        <button onClick={(e) => handleSetPrimary(e, profile)} className="w-full text-left px-4 py-2 text-[11px] font-semibold hover:bg-emerald-50 text-emerald-700">Set as Primary</button>
                                                                                        {profile.status !== 'LOCKED' && profile.status !== 'HISTORICAL' && (
                                                                                             <button onClick={(e) => handleLock(e, profile)} className="w-full text-left px-4 py-2 text-[11px] font-semibold hover:bg-slate-50 text-slate-700">Lock Profile</button>
                                                                                        )}
                                                                                        {profile.status === 'DRAFT' && (
                                                                                            <button onClick={(e) => handleDelete(e, profile.id)} className="w-full text-left px-4 py-2 text-[11px] font-semibold hover:bg-rose-50 text-rose-600">Delete Profile</button>
                                                                                        )}
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT PANEL - CONTEXTUAL DATA */}
            <div className="flex-1 min-w-0 overflow-y-auto pb-20">

                {/* 1. HEADER */}
                <div className="bg-white border-b border-slate-200 relative shadow-sm hover:z-30 z-10 w-full sticky top-0">
                    <div className="px-6 py-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-2 text-sm text-slate-800 font-bold">
                                        <span>Context: {currentProfile?.timePeriodId} / {currentProfile?.sourceType} / <span className="text-blue-700">{currentProfile?.name}</span></span>
                                        {currentProfile?.status === 'PRIMARY' && (
                                            <span className="ml-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm leading-none flex items-center">
                                                PRIMARY
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                {/* Only show Edit Source for Drafts */}
                                {currentProfile?.status === 'DRAFT' && onEditSource && (
                                    <button
                                        onClick={() => onEditSource({ accountId, fiscalYear: currentProfile?.timePeriodId })}
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
                    </div>
                    {/* 2. CONTEXT BANNERS */}
                    {currentProfile?.status === 'DRAFT' && (
                        <div className="bg-amber-50 border-t border-amber-100 px-8 py-2 flex justify-center items-center gap-2 text-[11px] text-amber-800 font-semibold tracking-wide uppercase">
                            <AlertCircle size={14} />
                            <span>PREVIEW MODE — This profile is a DRAFT. {currentProfile.mappingCompleteness < 100 ? `Mapping In Progress (${currentProfile.mappingCompleteness}%).` : 'Data not finalized for underwriting.'}</span>
                        </div>
                    )}
                    {currentProfile?.status === 'SUPPORTING' && (
                        <div className="bg-blue-50 border-t border-blue-100 px-8 py-2 flex justify-center items-center gap-2 text-[11px] text-blue-800 font-semibold tracking-wide uppercase">
                            <Info size={14} />
                            <span>SUPPORTING PROFILE — This profile is for reference only and does not drive DSCR computations.</span>
                        </div>
                    )}
                </div>

                <div className="animate-in fade-in duration-300">
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
            </div>
            </div>
        </div>
    ) : (
        <div className="flex-1 overflow-y-auto w-full">
            <TrendEngineTab profiles={profiles} templates={TEMPLATES} />
        </div>
    )}
            <TemplateSelectionModal 
                isOpen={isTemplateModalOpen} 
                onClose={() => setIsTemplateModalOpen(false)} 
                onSelect={handleCreateProfileFromTemplate} 
                period={targetPeriodForTemplate} 
            />
        </div>
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
                        {isOpen && <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{context.timePeriodId || context.meta?.fiscalYear} • {context.sourceType || context.meta?.type}</div>}
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
                        {['snapshot', 'variance'].map(tab => (
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
                            <div className="font-bold text-slate-900">{profile.timePeriodId || profile.meta?.fiscalYear}</div>
                            <div className="text-xs text-slate-500">{profile.meta?.period || 'N/A'}</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-slate-700">{profile.name || profile.meta?.source}</div>
                            <div className="text-[10px] text-slate-400 uppercase">{profile.sourceType || profile.meta?.type}</div>
                        </div>
                        <div>
                            <div className="text-xs font-mono text-slate-600">Rev: {profile.details?.income?.revenue}</div>
                            <div className="text-xs font-mono text-slate-600">DSCR: {profile.details?.coverage?.dscrGlob}</div>
                        </div>
                        <div className="flex justify-end">
                            <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full border border-slate-200">{profile.status}</span>
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

import { MappingTemplatesStore, computeCoverage } from '../../data/mockMappingTemplates';

// 4. Template Selection Modal — 2-Step Flow
// Step 1: Select Financial Structure | Step 2: Select Mapping Template
const TemplateSelectionModal = ({ isOpen, onClose, onSelect, period }) => {
    const [step, setStep] = useState(1);
    const [selectedStructure, setSelectedStructure] = useState(null);
    const [selectedMappingTemplate, setSelectedMappingTemplate] = useState(null); // null = none chosen yet

    if (!isOpen) return null;

    const handleClose = () => {
        // Reset on close
        setStep(1);
        setSelectedStructure(null);
        setSelectedMappingTemplate(null);
        onClose();
    };

    const handleContinueStep1 = () => {
        setSelectedMappingTemplate(null); // reset template choice
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
        setSelectedMappingTemplate(null);
    };

    const handleFinalContinue = () => {
        // Audit log
        console.log('[AUDIT LOG] Profile Creation:', {
            userId: 'current_user@myflow.com',
            timestamp: new Date().toISOString(),
            structureType: selectedStructure?.id,
            templateId: selectedMappingTemplate?.id ?? null,
        });
        onSelect({ structure: selectedStructure, mappingTemplate: selectedMappingTemplate });
        setStep(1);
        setSelectedStructure(null);
        setSelectedMappingTemplate(null);
    };

    // Mapping templates filtered by structureType + Active status
    const mappingTemplates = MappingTemplatesStore.getAll().filter(
        t => t.structureType === selectedStructure?.id && t.status === 'Active'
    );

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

                {/* ── MODAL HEADER ── */}
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-0.5">
                            {/* Step pill */}
                            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                                Step {step} of 2
                            </span>
                            <h2 className="text-lg font-bold text-slate-900">
                                {step === 1 ? 'Select Financial Structure' : 'Select Mapping Template'}
                            </h2>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 pl-[72px]">
                            {step === 1
                                ? `Choose the financial structure for the new profile in ${period}.`
                                : 'Choose a template to auto-map ledger entries (optional)'}
                        </p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* ── STEP 1: STRUCTURE SELECTION ── */}
                {step === 1 && (
                    <>
                        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                            {TEMPLATES.map(template => {
                                const isSelected = selectedStructure?.id === template.id;
                                return (
                                    <div
                                        key={template.id}
                                        onClick={() => setSelectedStructure(template)}
                                        className={`p-5 border-2 rounded-xl cursor-pointer transition-all bg-white shadow-sm flex flex-col h-full group ${
                                            isSelected
                                                ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/30'
                                                : 'border-slate-200 hover:border-blue-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-lg transition-colors ${isSelected ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-700 group-hover:bg-blue-100'}`}>
                                                    <template.icon size={20} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{template.name}</h3>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${template.type === 'STRUCTURED' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200'}`}>
                                                    {template.type}
                                                </span>
                                                {isSelected && (
                                                    <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                                                        <CheckCircle size={13} className="text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-600 mb-4 flex-1">{template.desc}</p>
                                        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                                            {template.sections.map(sec => (
                                                <span key={sec} className={`text-[10px] px-2 py-0.5 rounded font-medium ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{sec}</span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                            <button onClick={handleClose} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">
                                Cancel
                            </button>
                            <button
                                onClick={handleContinueStep1}
                                disabled={!selectedStructure}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md shadow-blue-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Continue →
                            </button>
                        </div>
                    </>
                )}

                {/* ── STEP 2: MAPPING TEMPLATE SELECTION ── */}
                {step === 2 && (
                    <>
                        {/* Context bar */}
                        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center gap-2 text-xs text-slate-600">
                            <span className="font-medium text-slate-400">Selected Structure:</span>
                            <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                <selectedStructure.icon size={13} className="text-blue-600" />
                                {selectedStructure.name}
                            </span>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-4">
                            {/* "Start Without Template" — first class option */}
                            <div
                                onClick={() => setSelectedMappingTemplate('none')}
                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex items-center gap-4 ${
                                    selectedMappingTemplate === 'none'
                                        ? 'border-slate-700 bg-slate-50 ring-2 ring-slate-200'
                                        : 'border-slate-200 hover:border-slate-400'
                                }`}
                            >
                                <div className={`p-2.5 rounded-lg ${selectedMappingTemplate === 'none' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-900">Start Without Template</h3>
                                        {selectedMappingTemplate === 'none' && <CheckCircle size={15} className="text-slate-700" />}
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">Proceed with full manual mapping — no pre-populated entries</p>
                                </div>
                                <button className={`px-4 py-1.5 text-xs font-bold rounded-lg border transition-all ${selectedMappingTemplate === 'none' ? 'bg-slate-800 text-white border-slate-800' : 'border-slate-300 text-slate-600 hover:border-slate-500'}`}>
                                    {selectedMappingTemplate === 'none' ? '✓ Selected' : 'Continue Without'}
                                </button>
                            </div>

                            {/* Divider */}
                            {mappingTemplates.length > 0 && (
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-px bg-slate-200" />
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or choose a template</span>
                                    <div className="flex-1 h-px bg-slate-200" />
                                </div>
                            )}

                            {/* Mapping Template Cards */}
                            {mappingTemplates.length === 0 ? (
                                <div className="text-center py-8 text-slate-400">
                                    <FileText size={28} className="mx-auto mb-2 opacity-30" />
                                    <p className="text-sm font-medium">No active templates for <strong>{selectedStructure.name}</strong></p>
                                    <p className="text-xs mt-1">Create templates in Admin → Financial Mapping Templates</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {mappingTemplates.map(t => {
                                        const latestVersion = t.versions[t.versions.length - 1];
                                        const cov = computeCoverage(latestVersion.mappings);
                                        const isSelected = selectedMappingTemplate?.id === t.id;
                                        const covColor = cov >= 85 ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : cov >= 60 ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-rose-600 bg-rose-50 border-rose-200';
                                        // Build category tags from mappings
                                        const categoryGroups = [...new Set(latestVersion.mappings.map(m => {
                                            const opt = { IS_REV: 'Revenue', IS_COGS: 'COGS', IS_OPEX_RENT: 'OpEx', IS_OPEX_PAYROLL: 'Payroll', IS_OPEX_UTIL: 'Utilities', IS_OPEX_MKTG: 'Marketing', IS_OPEX_INSUR: 'Insurance', IS_DEPR: 'Non-Cash', IS_INT: 'Interest', IS_TAX: 'Tax', IS_NET: 'Net P&L', BS_CASH: 'Cash', BS_AR: 'Receivables', BS_INV: 'Inventory', BS_FIXASSET: 'Fixed Assets', BS_AP: 'Payables', BS_LTD: 'Long-Term Debt', BS_EQUITY: 'Equity' };
                                            return opt[m.canonicalCategoryId] || null;
                                        }).filter(Boolean))].slice(0, 4);

                                        return (
                                            <div
                                                key={t.id}
                                                onClick={() => setSelectedMappingTemplate(t)}
                                                className={`p-5 border-2 rounded-xl cursor-pointer transition-all bg-white flex flex-col gap-3 ${
                                                    isSelected
                                                        ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50/20'
                                                        : 'border-slate-200 hover:border-blue-300'
                                                }`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-bold text-slate-900 text-sm">{t.name}</h3>
                                                            {isSelected && <CheckCircle size={14} className="text-blue-600" />}
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 mt-0.5">{t.sourceType} · v{latestVersion.version} · {latestVersion.mappings.length} mappings</p>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${covColor}`}>{cov}% coverage</span>
                                                </div>
                                                {t.industry && (
                                                    <p className="text-[11px] text-slate-400 italic truncate">{t.industry}</p>
                                                )}
                                                <div className="flex flex-wrap gap-1.5">
                                                    {categoryGroups.map(cat => (
                                                        <span key={cat} className={`text-[10px] px-2 py-0.5 rounded font-medium ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{cat}</span>
                                                    ))}
                                                    {latestVersion.mappings.length > 4 && (
                                                        <span className="text-[10px] px-2 py-0.5 rounded font-medium bg-slate-100 text-slate-400">+more</span>
                                                    )}
                                                </div>
                                                <button
                                                    className={`mt-1 w-full py-1.5 text-xs font-bold rounded-lg border transition-all ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'border-blue-200 text-blue-700 hover:bg-blue-50'}`}
                                                >
                                                    {isSelected ? '✓ Template Selected' : 'Select Template'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                            <button onClick={handleBack} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5">
                                ← Back
                            </button>
                            <button
                                onClick={handleFinalContinue}
                                disabled={!selectedMappingTemplate}
                                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md shadow-blue-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Continue →
                            </button>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

