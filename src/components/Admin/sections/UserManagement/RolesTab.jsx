import React, { useState } from 'react';
import RolesOrgChart from './RolesOrgChart';
import RolesMVP from './RolesMVP';

const RolesTab = () => {
    const [activeTab, setActiveTab] = useState('chart'); // 'chart' | 'mvp'

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* TAB SWITCHER HEADER */}
            <div className="px-6 py-4 flex gap-4 border-b border-slate-200 bg-white shrink-0">
                <button
                    onClick={() => setActiveTab('chart')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'chart'
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                >
                    Organisation Chart
                </button>
                <button
                    onClick={() => setActiveTab('mvp')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'mvp'
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                        }`}
                >
                    Roles (MVP)
                </button>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 overflow-hidden pt-6">
                {activeTab === 'chart' ? (
                    <RolesOrgChart />
                ) : (
                    <RolesMVP />
                )}
            </div>
        </div>
    );
};

export default RolesTab;
