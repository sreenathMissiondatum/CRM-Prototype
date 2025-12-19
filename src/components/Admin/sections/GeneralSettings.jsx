import React, { useState } from 'react';
import { Upload, Save, Globe, Building, Clock, DollarSign } from 'lucide-react';

const GeneralSettings = () => {
    const [saved, setSaved] = useState(false);
    const [config, setConfig] = useState({
        orgName: 'Acme Lending Corp',
        timezone: 'America/New_York (EST)',
        currency: 'USD ($)',
        dateFormat: 'MM/DD/YYYY',
        website: 'https://acmelending.com',
        portalDomain: 'portal.acmelending.com',
        supportEmail: 'support@acmelending.com'
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">General Settings</h1>
                    <p className="text-slate-500">Manage organization details and regional preferences.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Save size={18} />
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            {/* ORGANIZATION PROFILE */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-semibold text-slate-800">Organization Profile</h2>
                </div>
                <div className="p-6 grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Organization Name</label>
                        <div className="relative">
                            <Building className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={config.orgName}
                                onChange={e => setConfig({ ...config, orgName: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Website</label>
                        <div className="relative">
                            <Globe className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <input
                                type="text"
                                value={config.website}
                                onChange={e => setConfig({ ...config, website: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                        <input
                            type="email"
                            value={config.supportEmail}
                            onChange={e => setConfig({ ...config, supportEmail: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* BRANDING */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-semibold text-slate-800">Branding</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-start gap-6">
                        <div className="w-32 h-32 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:bg-slate-50 hover:border-slate-400 transition-colors">
                            <div className="w-8 h-8 bg-blue-600 rounded mb-2"></div>
                            <span className="text-xs font-medium">Change Logo</span>
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Custom Portal Domain</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Globe className="absolute left-3 top-2.5 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        value={config.portalDomain}
                                        onChange={e => setConfig({ ...config, portalDomain: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50">
                                    Verify DNS
                                </button>
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Enter the custom domain where your borrowers will access their portal. You will need to add a CNAME record to your DNS provider pointing to <code className="bg-slate-100 px-1 py-0.5 rounded">custom.myflowcrm.com</code>.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* REGIONAL */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-semibold text-slate-800">Regional & Formats</h2>
                </div>
                <div className="p-6 grid grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Timezone</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <select
                                value={config.timezone}
                                onChange={e => setConfig({ ...config, timezone: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                            >
                                <option>America/New_York (EST)</option>
                                <option>America/Chicago (CST)</option>
                                <option>America/Denver (MST)</option>
                                <option>America/Los_Angeles (PST)</option>
                                <option>Europe/London (GMT)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Currency</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 text-slate-400" size={18} />
                            <select
                                value={config.currency}
                                onChange={e => setConfig({ ...config, currency: e.target.value })}
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                            >
                                <option>USD ($)</option>
                                <option>EUR (€)</option>
                                <option>GBP (£)</option>
                                <option>CAD ($)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Date Format</label>
                        <select
                            value={config.dateFormat}
                            onChange={e => setConfig({ ...config, dateFormat: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        >
                            <option>MM/DD/YYYY</option>
                            <option>DD/MM/YYYY</option>
                            <option>YYYY-MM-DD</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GeneralSettings;
