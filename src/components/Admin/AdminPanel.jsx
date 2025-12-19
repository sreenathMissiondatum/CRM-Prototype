import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import GeneralSettings from './sections/GeneralSettings';
import UserManagement from './sections/UserManagement/index';
import LoanProgramManager from './sections/LoanProgramManager';
import DocumentTemplates from './sections/DocumentTemplates';
import FinancialRules from './sections/FinancialRules';
import Automations from './sections/Automations';
import UnderwritingRules from './sections/UnderwritingRules';
import DataIntegrations from './sections/DataIntegrations';
import Picklists from './sections/Picklists';
import AuditLogs from './sections/AuditLogs';
import CreditMemoTemplates from './sections/CreditMemoTemplates';

// Temporary placeholders for sections
const SectionPlaceholder = ({ title }) => (
    <div className="p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">{title}</h1>
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 border-dashed">
            Configuration UI for {title} coming soon.
        </div>
    </div>
);

const AdminPanel = ({ onBack }) => {
    const [activeSection, setActiveSection] = useState('general');

    const renderSection = () => {
        switch (activeSection) {
            case 'general':
                return <GeneralSettings />;
            case 'users':
                return <UserManagement />;
            case 'loan-programs':
                return <LoanProgramManager />;
            case 'doc-templates':
                return <DocumentTemplates />;
            case 'financial-rules':
                return <FinancialRules />;
            case 'integrations':
                return <DataIntegrations />;
            case 'automations':
                return <Automations />;
            case 'underwriting':
                return <UnderwritingRules />;
            case 'credit-memo':
                return <CreditMemoTemplates />;
            case 'picklists':
                return <Picklists />;
            case 'notifications':
                return <SectionPlaceholder title="Notifications & Email Templates" />;
            case 'audit':
                return <AuditLogs />;
            default:
                return <SectionPlaceholder title="Settings" />;
        }
    };

    const fullHeightSections = ['loan-programs']; // Sections that handle their own scrolling
    const isFullHeight = fullHeightSections.includes(activeSection);

    return (
        <div className="flex h-full bg-slate-50 relative z-50">
            <AdminSidebar activeSection={activeSection} onSelectSection={setActiveSection} onBack={onBack} />
            <div className={`flex-1 bg-slate-50/50 flex flex-col ${isFullHeight ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                <div className={`${isFullHeight ? 'h-full flex flex-col' : 'max-w-6xl mx-auto min-h-full p-8 w-full'}`}>
                    {renderSection()}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;
