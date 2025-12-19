import React, { useState } from 'react';
import { Share2, Users, Building, Globe, Lock } from 'lucide-react';

const SharingTab = () => {
    const objects = [
        { id: 'leads', label: 'Leads', scope: 'team' },
        { id: 'loans', label: 'Loans', scope: 'branch' },
        { id: 'contacts', label: 'Contacts', scope: 'org' },
        { id: 'tasks', label: 'Tasks', scope: 'own' },
    ];

    return (
        <div className="w-full">
            <div className="max-w-4xl mx-auto py-4">
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-slate-900">Sharing & Visibility</h2>
                    <p className="text-sm text-slate-500">Control which records users can see based on ownership and hierarchy.</p>
                </div>

                <div className="space-y-6">
                    {objects.map(obj => (
                        <div key={obj.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-600">
                                        <Share2 size={16} />
                                    </div>
                                    <h3 className="font-bold text-slate-800">{obj.label}</h3>
                                </div>
                                <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Default Visibility</div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <SharingOption
                                        icon={Lock}
                                        label="Private"
                                        desc="Users can only see records they own."
                                        selected={obj.scope === 'own'}
                                    />
                                    <SharingOption
                                        icon={Users}
                                        label="Team Only"
                                        desc="Users can see records owned by their team."
                                        selected={obj.scope === 'team'}
                                    />
                                    <SharingOption
                                        icon={Building}
                                        label="Branch / Territory"
                                        desc="Users see records within their branch."
                                        selected={obj.scope === 'branch'}
                                    />
                                    <SharingOption
                                        icon={Globe}
                                        label="Organization"
                                        desc="All users can see all records."
                                        selected={obj.scope === 'org'}
                                        warning={true}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SharingOption = ({ icon: Icon, label, desc, selected, warning }) => (
    <button className={`flex flex-col items-start text-left p-4 rounded-lg border-2 transition-all ${selected ? 'border-blue-600 bg-blue-50' : 'border-slate-100 hover:border-slate-300 bg-white'}`}>
        <div className={`mb-2 p-2 rounded-full ${selected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
            <Icon size={16} />
        </div>
        <div className={`font-bold text-sm mb-1 ${selected ? 'text-blue-900' : 'text-slate-700'}`}>{label}</div>
        <div className={`text-xs ${selected ? 'text-blue-700' : 'text-slate-500'}`}>{desc}</div>
        {warning && selected && (
            <div className="mt-3 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 uppercase tracking-wide">
                Caution: Broad Access
            </div>
        )}
    </button>
);

export default SharingTab;
