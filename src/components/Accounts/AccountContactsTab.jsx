import React, { useState, useMemo } from 'react';
import {
    Search, Filter, Plus, Phone, Mail,
    MoreHorizontal, User, ShieldCheck,
    Pen, Trash2, CheckCircle, XCircle,
    BadgeCheck, ExternalLink, Calendar
} from 'lucide-react';

const AccountContactsTab = ({ onAddContact, onViewContact }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('All');

    // Mock Data
    const contacts = [
        {
            id: 'CT-101',
            firstName: 'Sarah',
            lastName: 'Jenkins',
            title: 'Owner & CEO',
            email: 'sarah@jenkinscatering.com',
            phone: '(313) 555-0199',
            roles: ['Authorized Signer', 'Guarantor', 'Primary Contact'],
            preferredMethod: 'Email',
            isActive: true,
            linkedLoans: 3,
            lastActive: '2024-03-10'
        },
        {
            id: 'CT-102',
            firstName: 'Michael',
            lastName: 'Ross',
            title: 'CFO',
            email: 'mike.ross@jenkinscatering.com',
            phone: '(313) 555-0200',
            roles: ['Authorized Signer', 'Billing Contact'],
            preferredMethod: 'Phone',
            isActive: true,
            linkedLoans: 2,
            lastActive: '2024-03-05'
        },
        {
            id: 'CT-103',
            firstName: 'Jessica',
            lastName: 'Pearson',
            title: 'Legal Counsel',
            email: 'jpearnson@pearsonhardman.com',
            phone: '(212) 555-9000',
            roles: ['Legal Rep'],
            preferredMethod: 'Email',
            isActive: true,
            linkedLoans: 0,
            lastActive: '2023-11-20'
        },
        {
            id: 'CT-104',
            firstName: 'David',
            lastName: 'Miller',
            title: 'Operations Manager',
            email: 'dave@jenkinscatering.com',
            phone: '(313) 555-0155',
            roles: ['Site Contact'],
            preferredMethod: 'Phone',
            isActive: false,
            linkedLoans: 0,
            lastActive: '2023-01-15'
        }
    ];

    // Stats Calculations
    const stats = useMemo(() => {
        return {
            total: contacts.length,
            signers: contacts.filter(c => c.roles.includes('Authorized Signer')).length,
            guarantors: contacts.filter(c => c.roles.includes('Guarantor')).length,
            active: contacts.filter(c => c.isActive).length
        };
    }, [contacts]);

    // Role Badge Helper
    const RoleBadge = ({ role }) => {
        const styles = {
            'Authorized Signer': 'bg-amber-100 text-amber-800 border-amber-200',
            'Guarantor': 'bg-purple-100 text-purple-800 border-purple-200',
            'Primary Contact': 'bg-blue-100 text-blue-800 border-blue-200',
            'Billing Contact': 'bg-slate-100 text-slate-700 border-slate-200',
            'Legal Rep': 'bg-slate-100 text-slate-700 border-slate-200 font-mono',
            'Site Contact': 'bg-slate-100 text-slate-700 border-slate-200'
        };

        return (
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${styles[role] || styles['Site Contact']}`}>
                {role}
            </span>
        );
    };

    const filteredContacts = contacts.filter(contact => {
        const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
        const matchesSearch = fullName.includes(searchQuery.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'All' || contact.roles.includes(filterRole);
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard
                    label="Total Contacts"
                    value={stats.total}
                    icon={User}
                    color="blue"
                />
                <StatCard
                    label="Authorized Signers"
                    value={stats.signers}
                    icon={BadgeCheck}
                    color="amber"
                />
                <StatCard
                    label="Guarantors"
                    value={stats.guarantors}
                    icon={ShieldCheck}
                    color="purple"
                />
                <StatCard
                    label="Active Contacts"
                    value={stats.active}
                    icon={CheckCircle}
                    color="emerald"
                />
            </div>

            {/* Toolbar */}
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="relative w-72">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="h-6 w-px bg-slate-200 mx-1"></div>
                    <FilterDropdown
                        value={filterRole}
                        onChange={setFilterRole}
                        options={['All', 'Authorized Signer', 'Guarantor', 'Primary Contact']}
                    />
                </div>
                <button
                    onClick={onAddContact}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                >
                    <Plus size={16} /> Add Contact
                </button>
            </div>

            {/* Contacts Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-500">Name & Title</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Roles</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Contact Info</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-center">Active</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-center">Linked Loans</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 w-24">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredContacts.map((contact) => (
                            <tr key={contact.id} className={`hover:bg-slate-50/50 transition-colors group ${!contact.isActive ? 'bg-slate-50/30' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white shadow-sm ${contact.isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-500'
                                            }`}>
                                            {contact.firstName[0]}{contact.lastName[0]}
                                        </div>
                                        <div>
                                            <button
                                                onClick={() => onViewContact && onViewContact(contact.id)}
                                                className={`font-bold hover:underline ${contact.isActive ? 'text-slate-800 hover:text-blue-600' : 'text-slate-500'}`}
                                            >
                                                {contact.firstName} {contact.lastName}
                                            </button>
                                            <div className="text-xs text-slate-500">{contact.title}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                                        {contact.roles.map(role => (
                                            <RoleBadge key={role} role={role} />
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Mail size={12} className="text-slate-400" />
                                            <a href={`mailto:${contact.email}`} className="hover:text-blue-600 truncate max-w-[180px]">{contact.email}</a>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Phone size={12} className="text-slate-400" />
                                            <span>{contact.phone}</span>
                                            {contact.preferredMethod === 'Phone' && (
                                                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 rounded ml-1">Pref</span>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {contact.isActive ? (
                                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600">
                                            <CheckCircle size={14} />
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                                            <XCircle size={14} />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {contact.linkedLoans > 0 ? (
                                        <span className="inline-block px-2 py-1 rounded bg-slate-100 text-slate-700 font-bold text-xs">
                                            {contact.linkedLoans}
                                        </span>
                                    ) : (
                                        <span className="text-slate-300 text-xs">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button title="Edit" className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors">
                                            <Pen size={14} />
                                        </button>
                                        <button title="More" className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors">
                                            <MoreHorizontal size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Internal Components
const StatCard = ({ label, value, icon: Icon, color }) => {
    const colors = {
        blue: 'text-blue-600 bg-blue-50',
        amber: 'text-amber-600 bg-amber-50',
        purple: 'text-purple-600 bg-purple-50',
        emerald: 'text-emerald-600 bg-emerald-50',
    };

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">{label}</span>
                <span className="text-2xl font-bold text-slate-900">{value}</span>
            </div>
            <div className={`p-3 rounded-lg ${colors[color]}`}>
                <Icon size={20} />
            </div>
        </div>
    );
};

const FilterDropdown = ({ value, onChange, options }) => (
    <div className="relative group z-10">
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={14} />
            {value}
        </button>
        <div className="hidden group-hover:block absolute top-full left-0 w-40 bg-white border border-slate-200 rounded-lg shadow-xl py-1 mt-1">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${value === opt ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-600'
                        }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export default AccountContactsTab;
