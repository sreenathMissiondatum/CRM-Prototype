import React from 'react';
import {
    Settings, Users, Briefcase, FileText, Activity,
    Plug, Workflow, ShieldAlert, FileCode, List,
    Bell, Database, ChevronRight, ArrowLeft
} from 'lucide-react';

const AdminSidebar = ({ activeSection, onSelectSection, onBack }) => {
    const categories = [
        {
            title: 'Organization',
            items: [
                { id: 'general', label: 'General Settings', icon: Settings },
                { id: 'users', label: 'Users & Permissions', icon: Users },
                { id: 'audit', label: 'Audit Logs', icon: Database }
            ]
        },
        {
            title: 'Lending',
            items: [
                { id: 'loan-programs', label: 'Loan Programs', icon: Briefcase },
                { id: 'underwriting', label: 'Underwriting Rules', icon: ShieldAlert },
                { id: 'financial-rules', label: 'Financial Profiles', icon: Activity }
            ]
        },
        {
            title: 'Documents',
            items: [
                { id: 'doc-templates', label: 'Document Templates', icon: FileText },
                { id: 'credit-memo', label: 'Credit Memo', icon: FileCode }
            ]
        },
        {
            title: 'Platform',
            items: [
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'automations', label: 'Automations', icon: Workflow },
                { id: 'integrations', label: 'Integrations', icon: Plug },
                { id: 'picklists', label: 'Picklists & Metadata', icon: List }
            ]
        }
    ];

    return (
        <div className="w-64 bg-slate-50 border-r border-slate-200 h-full flex flex-col animate-in slide-in-from-left duration-300">
            {/* Back Navigation Header */}
            <div className="p-4 border-b border-slate-200 bg-white sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 px-2 py-1.5 rounded-lg transition-colors mb-3 text-xs font-semibold uppercase tracking-wide w-full"
                >
                    <ArrowLeft size={14} />
                    Back to App
                </button>

                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 px-2">
                    <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm">
                        <Settings size={18} className="text-white" />
                    </div>
                    Admin Console
                </h2>
                <div className="text-xs text-slate-500 mt-1 pl-12 font-medium">System Configuration</div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {categories.map((group) => (
                    <div key={group.title}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-2">
                            {group.title}
                        </h3>
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = activeSection === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => onSelectSection(item.id)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                            ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
                                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={16} className={isActive ? 'text-blue-500' : 'text-slate-400'} />
                                            {item.label}
                                        </div>
                                        {isActive && <ChevronRight size={14} className="text-blue-500" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-slate-200 bg-white">
                <div className="text-xs text-slate-400 text-center">
                    MyFlow CRM v2.4.0 (Build 8821)
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
