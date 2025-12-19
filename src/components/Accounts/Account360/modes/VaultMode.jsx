import React, { useState } from 'react';
import {
    FileText,
    Briefcase,
    BarChart2,
    Zap,
    Users,
    Folder
} from 'lucide-react';

// Wrap existing tabs to inject into the Vault
import AccountFinancialsTab from '../../AccountFinancialsTab';
import AccountLoansTab from '../../AccountLoansTab';
import AccountActivitiesTab from '../../AccountActivitiesTab';
import AccountDocumentsTab from '../../AccountDocumentsTab';
import RelationshipsTab from '../components/RelationshipsTab';

const VaultMode = () => {
    const [activeTab, setActiveTab] = useState('financials');

    const tabs = [
        { id: 'financials', label: 'Financial Profiles', icon: BarChart2 },
        { id: 'loans', label: 'Loan Portfolio', icon: Briefcase },
        { id: 'docs', label: 'Document Library', icon: Folder },
        { id: 'activity', label: 'Activity Logs', icon: FileText },
        { id: 'relationships', label: 'Relationships', icon: Users },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'financials': return <AccountFinancialsTab />;
            case 'loans': return <AccountLoansTab />;
            case 'docs': return <AccountDocumentsTab />;
            case 'activity': return <AccountActivitiesTab />;
            case 'relationships': return <RelationshipsTab />;
            default: return <AccountFinancialsTab />;
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in zoom-in-95 duration-300">

            <div className="px-6 md:px-8 py-6 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Folder className="text-slate-500" size={20} />
                        Relationship Vault
                    </h2>
                    <p className="text-sm text-slate-500">
                        Secure repository for all master records, files, and historical data.
                    </p>
                </div>

                <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto max-w-full">
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        const active = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                        flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap
                        ${active ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}
                     `}
                            >
                                <Icon size={14} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-white p-6 md:p-8">
                {renderContent()}
            </div>

        </div>
    );
};

export default VaultMode;
