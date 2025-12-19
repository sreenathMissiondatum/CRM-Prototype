import React, { useState } from 'react';
import { Users, Shield, Key, Share2, Eye, Info } from 'lucide-react';
import UsersTab from './UsersTab';
import RolesTab from './RolesTab';
import PermissionSetsTab from './PermissionSetsTab';
import VisibilityGroupsTab from './VisibilityGroupsTab';
import SharingTab from './SharingTab';
import FieldAccessTab from './FieldAccessTab';

const UserManagement = () => {
    const [activeTab, setActiveTab] = useState('users');

    const tabs = [
        { id: 'users', label: 'Users', icon: Users },
        { id: 'roles', label: 'Roles', icon: Shield },
        { id: 'permissions', label: 'Permission Sets', icon: Key },
        { id: 'visibility', label: 'Visibility Groups', icon: Eye },
        { id: 'sharing', label: 'Sharing & Visibility', icon: Share2 },
        { id: 'fields', label: 'Field Access', icon: Eye },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'users': return <UsersTab />;
            case 'roles': return <RolesTab />;
            case 'permissions': return <PermissionSetsTab />;
            case 'visibility': return <VisibilityGroupsTab />;
            case 'sharing': return <SharingTab />;
            case 'fields': return <FieldAccessTab />;
            default: return <UsersTab />;
        }
    };

    return (
        <div className="flex flex-col animate-in slide-in-from-bottom-2 duration-500">
            {/* Page Header */}
            <div className="flex-none px-6 pt-4 mb-4">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Users & Permissions</h1>
                <p className="text-slate-500 text-xs">Manage users, roles, and access across your organization</p>
            </div>

            {/* Info Banner */}
            <div className="flex-none px-6 mb-4">
                <div className="p-2 bg-blue-50/50 border border-blue-100 rounded-lg flex items-start gap-3">
                    <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                    <div className="text-[11px] text-blue-700 leading-4">
                        <strong>Manage Access:</strong> Permissions define what users can do (Roles). Record visibility (Sharing) and field access (FLS) are managed separately to ensure granular security control.
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex-none px-6 mb-4 border-b border-slate-200">
                <div className="flex gap-1 overflow-x-auto pb-0.5">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="relative">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default UserManagement;
