import React, { useState, useMemo } from 'react';
import {
    Building2, Car, Banknote, ShieldCheck, AlertTriangle,
    MoreVertical, Plus, ExternalLink, Calendar, Calculator,
    TrendingUp, FileText, CheckCircle2, XCircle
} from 'lucide-react';
import CollateralDrawer from './CollateralDrawer';

const CollateralTab = ({ loan }) => {
    // Drawer State
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Mock Data
    const [assets, setAssets] = useState([
        {
            id: 'col_1',
            type: 'Real Estate - Commercial (CRE)',
            description: 'Commercial Property - 123 Main St, Detroit',
            status: 'Active',
            grossValue: 450000,
            haircut: 0.75, // 25% haircut
            lienPosition: 1,
            valuationDate: '2023-01-15', // Stale (> 2 years logic simplified for demo)
            insuranceExpiry: '2024-12-31',
            linkedLoans: 1
        },
        {
            id: 'col_2',
            type: 'Equipment / Machinery',
            description: 'Industrial Oven - Model X500',
            status: 'Active',
            grossValue: 85000,
            haircut: 0.50, // 50% haircut
            lienPosition: 1,
            valuationDate: '2024-06-10',
            insuranceExpiry: '2023-11-20', // Expired
            linkedLoans: 1
        },
        {
            id: 'col_3',
            type: 'Cash / CD',
            description: 'CD Accounts - First Bank',
            status: 'Pledged',
            grossValue: 25000,
            haircut: 1.0, // 0% haircut
            lienPosition: 1,
            valuationDate: '2024-12-01',
            insuranceExpiry: null, // N/A
            linkedLoans: 2
        }
    ]);

    // Calculations
    const totalGross = useMemo(() => assets.reduce((sum, item) => sum + Number(item.grossValue), 0), [assets]);

    // Net Value Logic: Use stored netValue if available (from Drawer), else calc on fly
    const totalNet = useMemo(() => assets.reduce((sum, item) => {
        const net = item.netValue || (item.grossValue * item.haircut);
        return sum + Number(net);
    }, 0), [assets]);

    // Parse loan amount from string (e.g. "$75,000") or use number
    const loanAmount = useMemo(() => {
        if (!loan?.amount) return 75000;
        if (typeof loan.amount === 'number') return loan.amount;
        return Number(String(loan.amount).replace(/[^0-9.-]+/g, ""));
    }, [loan]);

    const ltv = totalNet > 0 ? (loanAmount / totalNet) * 100 : 0;

    // Helper Functions
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    const isStale = (dateStr) => {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        return date < twoYearsAgo;
    };

    const isExpired = (dateStr) => {
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const today = new Date();
        return date < today;
    };

    const getTypeIcon = (type) => {
        if (type.includes('Real Estate')) return <Building2 size={16} />;
        if (type.includes('Equipment') || type.includes('Vehicle')) return <Car size={16} />;
        if (type.includes('Cash')) return <Banknote size={16} />;
        return <ShieldCheck size={16} />;
    };

    // Handlers
    const handleSaveCollateral = (newAsset) => {
        setAssets(prev => {
            const index = prev.findIndex(a => a.id === newAsset.id);
            if (index >= 0) {
                const updated = [...prev];
                updated[index] = newAsset;
                return updated;
            }
            return [...prev, newAsset];
        });
    };

    const handleEdit = (asset) => {
        setEditingItem(asset);
        setIsDrawerOpen(true);
    };

    const handleNew = () => {
        setEditingItem(null);
        setIsDrawerOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-slate-800">Collateral Management</h2>
                    <p className="text-sm text-slate-500">Manage assets securing this loan</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:border-blue-300 hover:text-blue-600 transition-colors text-sm">
                        View All Account Collateral
                    </button>
                    <button
                        onClick={handleNew}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm shadow-sm"
                    >
                        <Plus size={16} /> Add Collateral
                    </button>
                </div>
            </div>

            {/* KPI Summary Strip */}
            <div className="grid grid-cols-4 gap-4">
                <KPICard
                    label="Total Gross Value"
                    value={formatCurrency(totalGross)}
                    icon={Building2}
                    colorClass="bg-blue-50 text-blue-600"
                />
                <KPICard
                    label="Discounted Net Value"
                    value={formatCurrency(totalNet)}
                    icon={Calculator}
                    colorClass="bg-emerald-50 text-emerald-600"
                    subtext="After policy haircuts"
                />
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Loan To Value (LTV)</div>
                        <TrendingUp size={16} className={`${ltv > 80 ? 'text-red-500' : ltv > 60 ? 'text-amber-500' : 'text-emerald-500'}`} />
                    </div>
                    <div>
                        <div className={`text-2xl font-bold ${ltv > 80 ? 'text-red-600' : ltv > 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {ltv.toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400 mt-1">Target: &lt; 80%</div>
                    </div>
                </div>

                {/* Policy Status */}
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Policy Status</div>
                    <div className="space-y-2 mt-2">
                        {assets.some(a => isExpired(a.insuranceExpiry || a.policyExpiry)) ? (
                            <div className="flex items-center gap-2 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                                <XCircle size={14} /> Insurance Expired
                            </div>
                        ) : assets.some(a => isStale(a.valuationDate)) ? (
                            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                                <AlertTriangle size={14} /> Stale Appraisals
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                <CheckCircle2 size={14} /> Compliant
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Collateral Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-bold text-slate-500">
                        <tr>
                            <th className="px-6 py-3">Asset</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Gross Value</th>
                            <th className="px-6 py-3 text-right">Net Value</th>
                            <th className="px-6 py-3 text-center">Lien</th>
                            <th className="px-6 py-3">Valuation</th>
                            <th className="px-6 py-3">Insurance</th>
                            <th className="px-6 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {assets.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => handleEdit(item)}>
                                <td className="px-6 py-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-slate-100 text-slate-500 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            {getTypeIcon(item.type)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{item.type}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.description}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            item.status === 'Pledged' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-slate-100 text-slate-500 border-slate-200'
                                        }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-slate-700">
                                    {formatCurrency(item.grossValue)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="font-bold text-slate-900">{formatCurrency(item.netValue || (item.grossValue * item.haircut))}</div>
                                    <div className="text-[10px] text-slate-400">{(item.haircut * 100)}% rate</div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-xs rounded border border-slate-200">
                                        {item.lienPosition}{item.lienPosition === 1 ? 'st' : 'nd'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {isStale(item.valuationDate) ? (
                                        <div className="flex items-center gap-1.5 text-amber-600 font-medium text-xs" title="Valuation is older than 2 years">
                                            <AlertTriangle size={14} />
                                            <span>Stale</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                                            <CheckCircle2 size={14} />
                                            <span>Valid</span>
                                        </div>
                                    )}
                                    <div className="text-[10px] text-slate-400 mt-0.5">{item.valuationDate}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {item.insuranceExpiry || item.policyExpiry ? (
                                        isExpired(item.insuranceExpiry || item.policyExpiry) ? (
                                            <div className="flex items-center gap-1.5 text-red-600 font-medium text-xs">
                                                <XCircle size={14} />
                                                <span>Expired</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                                                <ShieldCheck size={14} />
                                                <span>Active</span>
                                            </div>
                                        )
                                    ) : (
                                        <span className="text-xs text-slate-400 font-normal italic">N/A</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-1 text-slate-400 hover:text-blue-600 rounded hover:bg-slate-100 transition-colors">
                                        <MoreVertical size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {assets.length === 0 && (
                    <div className="p-12 text-center text-slate-400">
                        <Building2 size={48} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-lg font-medium text-slate-600">No Collateral Added</h3>
                        <p className="text-sm">Add assets to secure this loan.</p>
                    </div>
                )}
            </div>

            {/* Disclaimer Footer */}
            <div className="flex gap-2 items-start p-4 bg-slate-50 text-slate-500 text-xs rounded-lg border border-slate-100">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <p>
                    Values shown are estimates based on the most recent appraisal or valuation event recorded in the system.
                    Discounted Net Value applies current credit policy haircuts which may update periodically.
                </p>
            </div>

            <CollateralDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                loan={loan}
                initialData={editingItem}
                onSave={handleSaveCollateral}
            />
        </div>
    );
};

// Helper Sub-component
const KPICard = ({ label, value, icon: Icon, colorClass, subtext }) => (
    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="flex justify-between items-start z-10">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</div>
            <div className={`p-1.5 rounded-lg ${colorClass}`}>
                <Icon size={16} />
            </div>
        </div>
        <div className="z-10 mt-2">
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            {subtext && <div className="text-xs text-slate-400 mt-1">{subtext}</div>}
        </div>
    </div>
);

export default CollateralTab;
