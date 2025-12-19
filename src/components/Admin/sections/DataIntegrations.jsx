import React, { useState } from 'react';
import { RefreshCw, Link, Settings, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const DataIntegrations = () => {
    const [providers, setProviders] = useState([
        { id: 'quickbooks', name: 'QuickBooks Online', category: 'Accounting', status: 'Connected', lastSync: '10 mins ago', icon: 'https://cdn.worldvectorlogo.com/logos/quickbooks-1.svg' },
        { id: 'codat', name: 'Codat', category: 'Universal API', status: 'Connected', lastSync: '5 mins ago', icon: 'https://cdn.worldvectorlogo.com/logos/codat.svg' },
        { id: 'plaid', name: 'Plaid', category: 'Banking', status: 'Error', lastSync: '2 days ago', error: 'Credentials expired', icon: 'https://cdn.worldvectorlogo.com/logos/plaid-logo-1.svg' },
        { id: 'sendgrid', name: 'SendGrid', category: 'Communication', status: 'Disconnected', lastSync: '-', icon: 'https://cdn.worldvectorlogo.com/logos/sendgrid-2.svg' },
        { id: 'slack', name: 'Slack', category: 'Notifications', status: 'Connected', lastSync: '1 hr ago', icon: 'https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg' },
    ]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Data Integrations</h1>
                    <p className="text-slate-500">Manage connections to external data providers and services.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {providers.map(provider => (
                    <div key={provider.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-48 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-slate-50 rounded-lg flex items-center justify-center p-2 border border-slate-100">
                                {provider.icon.startsWith('http') ? (
                                    <img src={provider.icon} alt={provider.name} className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-slate-400 font-bold">{provider.name[0]}</div>
                                )}
                            </div>
                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${stateColors(provider.status)}`}>
                                {provider.status === 'Connected' && <CheckCircle size={12} />}
                                {provider.status === 'Error' && <AlertCircle size={12} />}
                                {provider.status === 'Disconnected' && <XCircle size={12} />}
                                {provider.status}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">{provider.name}</h3>
                            <div className="text-xs text-slate-500 font-medium">{provider.category}</div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            {provider.status === 'Connected' ? (
                                <div className="text-xs text-slate-500 flex items-center gap-1">
                                    <RefreshCw size={12} className="text-slate-400" />
                                    Synced {provider.lastSync}
                                </div>
                            ) : (
                                <div className="text-xs text-red-500 font-medium">
                                    {provider.error || 'Not Configured'}
                                </div>
                            )}

                            <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                <Settings size={18} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add New */}
                <button className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all h-48">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                        <Link size={24} />
                    </div>
                    <span className="font-medium">Connect New Provider</span>
                </button>
            </div>
        </div>
    );
};

const stateColors = (status) => {
    switch (status) {
        case 'Connected': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
        case 'Error': return 'bg-red-50 text-red-700 border-red-100';
        default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
};

export default DataIntegrations;
