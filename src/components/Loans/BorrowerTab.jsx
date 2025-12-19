import React from 'react';
import {
    Building2, MapPin, Users, ShieldCheck,
    Clock, Activity, Globe, Briefcase,
    Phone, Mail, BadgeCheck, TrendingUp,
    ExternalLink, AlertCircle
} from 'lucide-react';
import BorrowerSnapshot from '../Shared/BorrowerSnapshot';

const BorrowerTab = ({ loan, onViewAccount, onViewContact }) => {
    // Mock Data (merged with Loan Prop)
    const isJenkins = loan?.borrower?.includes('Jenkins');
    const data = {
        identity: {
            legalName: loan.borrower || 'Acme Manufacturing, LLC',
            dba: isJenkins ? null : (loan.applicantName || loan.borrower || 'Acme Heavy Industries'),
            entityType: 'LLC',
            naics: '332710',
            industry: loan.industry || 'Machine Shops',
            city: 'Portland',
            state: 'OR',
            censusTract: 'Tract 0011.00 (LIC)',
            badges: ['Minority-owned', 'Veteran-owned']
        },
        contact: {
            name: isJenkins ? 'Sarah Jenkins' : 'John Doe',
            pronouns: 'she/her',
            role: isJenkins ? 'Owner' : 'Managing Member',
            phone: '(555) 123-4567',
            email: isJenkins ? 'sarah@jenkinscatering.com' : 'john@acme.com',
            preferred: 'Email',
            creditRange: '720-749'
        },
        owners: [
            { name: isJenkins ? 'Sarah Jenkins' : 'John Doe', role: 'Owner', percent: '60%', guarantor: 'Personal' },
            { name: 'Jane Smith', role: 'Co-Owner', percent: '40%', guarantor: 'Personal' },
            { name: 'Acme Holdings', role: 'Parent Entity', percent: '-', guarantor: 'Corporate' },
            // Dummy entries to trigger "+3 contacts"
            { name: 'Extra 1' }, { name: 'Extra 2' }
        ],
        relationship: {
            since: '2017',
            totalLoans: 5,
            volume: '$4.2M',
            active: 2,
            performance: '100% On-time',
            isRepeat: true
        },
        capacity: {
            dscr: '1.35x',
            exposure: '$2.1M',
            revenueTrend: 'Up',
            leverageTrend: 'Flat',
            lastRefreshed: 'Dec 1, 2024'
        },
        business: {
            legalName: loan.borrower || 'Acme Manufacturing, LLC',
            stateInc: 'Delaware',
            taxId: '**-***4582',
            fye: 'December 31',
            naics: '332710'
        },
        compliance: {
            kyb: 'Verified',
            watchlist: 'Clear',
            creditRefresh: '30 days ago'
        }
    };

    // Handler for View Account
    const handleViewAccount = () => {
        if (onViewAccount) {
            onViewAccount({
                name: data.identity.legalName,
                dba: data.identity.dba,
                // Pass other fields if needed for full hydration
            });
        }
    };

    const handleViewContact = () => {
        if (onViewContact) {
            onViewContact({
                name: data.contact.name
            });
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* TILE 1: Borrower Snapshot */}
                <BorrowerSnapshot
                    data={{
                        legalName: data.identity.legalName,
                        entityType: data.identity.entityType,
                        dba: data.identity.dba,
                        naicsCode: data.identity.naics,
                        industry: data.identity.industry,
                        city: data.identity.city,
                        state: data.identity.state,
                        censusTract: data.identity.censusTract,
                        badges: data.identity.badges
                    }}
                    contact={{
                        name: data.contact.name,
                        pronouns: data.contact.pronouns,
                        role: data.contact.role,
                        phone: data.contact.phone,
                        email: data.contact.email,
                        preferredMethod: data.contact.preferred,
                        creditRange: data.contact.creditRange
                    }}
                    onViewAccount={onViewAccount}
                    onViewContact={onViewContact}
                    relatedContactCount={isJenkins ? 3 : (loan.borrower?.includes('Solo') ? 0 : 1)}
                    onViewAllContacts={onViewContact}
                    className="h-full"
                />

                {/* TILE 2: Ownership & Guarantees */}
                <Card title="Ownership & Guarantees" icon={Users}>
                    <div className="overflow-hidden rounded-lg border border-slate-100 mb-4">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold text-[10px] uppercase tracking-wider border-b border-slate-100">
                                <tr>
                                    <th className="px-3 py-2">Name</th>
                                    <th className="px-3 py-2">Role</th>
                                    <th className="px-3 py-2 text-right">%</th>
                                    <th className="px-3 py-2">Guarantor</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {data.owners.map((owner, idx) => (
                                    <tr key={idx}>
                                        <td className="px-3 py-2 font-medium text-slate-900">{owner.name}</td>
                                        <td className="px-3 py-2 text-xs text-slate-500">{owner.role}</td>
                                        <td className="px-3 py-2 text-right font-medium text-slate-700">{owner.percent}</td>
                                        <td className="px-3 py-2">
                                            {owner.guarantor ? (
                                                <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded w-fit">
                                                    <ShieldCheck size={10} /> {owner.guarantor}
                                                </div>
                                            ) : (
                                                <span className="text-slate-300">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-50">
                        <span className="text-slate-500">Total Ownership: <span className="font-bold text-slate-900">100%</span></span>
                        <span className="flex items-center gap-1 text-emerald-600 font-medium"><BadgeCheck size={12} /> Full Coverage</span>
                    </div>
                </Card>

                {/* TILE 3: Relationship History */}
                <Card title="Relationship History" icon={Clock}>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        <Stat label="Total Loans" value={data.relationship.totalLoans} />
                        <Stat label="Funded Vol" value={data.relationship.volume} />
                        <Stat label="Active" value={data.relationship.active} highlight />
                        <Stat label="Repayment" value={data.relationship.performance} color="text-emerald-600" />
                    </div>
                    <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                        <span className="text-slate-500">Customer since <span className="font-bold text-slate-700">{data.relationship.since}</span></span>
                        {data.relationship.isRepeat && (
                            <span className="flex items-center gap-1 text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded">
                                <BadgeCheck size={12} /> Repeat Borrower
                            </span>
                        )}
                    </div>
                </Card>

                {/* TILE 4: Capacity Snapshot */}
                <Card title="Capacity Snapshot" icon={Activity}
                    action={<span className="text-[10px] text-slate-400">Refreshed {data.capacity.lastRefreshed}</span>}>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Portfolio DSCR</div>
                            <div className="text-xl font-bold text-slate-900">{data.capacity.dscr}</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Exposure</div>
                            <div className="text-xl font-bold text-slate-900">{data.capacity.exposure}</div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <TrendRow label="Revenue Trend" trend={data.capacity.revenueTrend} />
                        <TrendRow label="Leverage Trend" trend={data.capacity.leverageTrend} inverse />
                    </div>
                </Card>

                {/* TILE 5: Business Details */}
                <Card title="Business Details" icon={Briefcase}>
                    <div className="space-y-3">
                        <DetailRow label="Legal Name" value={data.business.legalName} />
                        <DetailRow label="State of Inc." value={data.business.stateInc} />
                        <DetailRow label="Tax ID" value={data.business.taxId} />
                        <DetailRow label="Fiscal Year End" value={data.business.fye} />
                        <DetailRow label="NAICS Code" value={data.business.naics} />
                    </div>
                </Card>

                {/* TILE 6: Compliance & External */}
                <Card title="Compliance & External" icon={Globe}>
                    <div className="space-y-4">
                        <ComplianceItem label="KYB / Entity Check" status={data.compliance.kyb} />
                        <ComplianceItem label="Watchlist Screening" status={data.compliance.watchlist} />

                        <div className="pt-3 border-t border-slate-100">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-medium text-slate-600">External Credit Check</span>
                                <span className="text-[10px] text-slate-400">Refreshed {data.compliance.creditRefresh}</span>
                            </div>
                        </div>
                    </div>
                </Card>

            </div>
        </div>
    );
};

// --- Reusable Components ---

const Card = ({ title, icon: Icon, action, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col h-full hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Icon size={16} className="text-slate-400" /> {title}
            </h3>
            {action}
        </div>
        <div className="flex-1">
            {children}
        </div>
    </div>
);

const Badge = ({ text, color }) => {
    const colors = {
        slate: 'bg-slate-100 text-slate-600 border-slate-200',
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
        blue: 'bg-blue-50 text-blue-700 border-blue-100'
    };
    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${colors[color] || colors.slate}`}>
            {text}
        </span>
    );
};

const Stat = ({ label, value, highlight, color = 'text-slate-900' }) => (
    <div className={highlight ? 'bg-blue-50 p-2 rounded-lg border border-blue-100' : ''}>
        <div className={`text-[10px] uppercase font-bold mb-0.5 ${highlight ? 'text-blue-500' : 'text-slate-400'}`}>{label}</div>
        <div className={`font-bold text-sm ${color}`}>{value}</div>
    </div>
);

const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-start border-b border-slate-50 last:border-0 pb-2 last:pb-0">
        <span className="text-xs text-slate-500 font-medium">{label}</span>
        <span className="text-sm font-medium text-slate-900 text-right">{value}</span>
    </div>
);

const TrendRow = ({ label, trend, inverse }) => {
    const isGood = (!inverse && trend === 'Up') || (inverse && trend === 'Down');
    const color = isGood ? 'text-emerald-600' : (trend === 'Flat' ? 'text-slate-500' : 'text-amber-600');
    return (
        <div className="flex justify-between items-center p-2 rounded bg-slate-50 border border-slate-100">
            <span className="text-xs font-medium text-slate-600">{label}</span>
            <span className={`text-xs font-bold flex items-center gap-1 ${color}`}>
                {trend === 'Up' ? <TrendingUp size={12} /> : null} {trend}
            </span>
        </div>
    );
};

const ComplianceItem = ({ label, status }) => (
    <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            <BadgeCheck size={12} /> {status}
        </span>
    </div>
);

export default BorrowerTab;
