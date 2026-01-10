import React, { useState } from 'react';
import LeadList from './LeadList';
import LeadDetail from './LeadDetail';


const LeadsLayout = ({
    onCreateLead,
    viewMode = 'all',
    onViewAccount,
    onViewContact,
    leads,
    selectedLeadId,
    onSelectLead,
    currentFilters,
    onUpdateFilters,
    onImportLeads,
    onBulkUpdate,
    onUpdateLead,
    onConvertLead
}) => {
    // Current user context (mock)
    const currentUser = { name: 'Alex Morgan' };
    const selectedLead = leads.find(l => l.id === selectedLeadId) || null;

    // Filtering
    const displayedLeads = viewMode === 'my'
        ? leads.filter(l => l.assignedOfficer === currentUser.name)
        : leads;

    return (
        <div className="flex h-full bg-slate-50 overflow-hidden">
            {!selectedLead ? (
                // List View (Full Width)
                <div className="w-full h-full flex flex-col">
                    <LeadList
                        leads={displayedLeads}
                        title={viewMode === 'my' ? 'My Leads' : 'Leads'}
                        selectedLeadId={null}
                        onSelectLead={(lead) => onSelectLead(lead.id)}
                        onCreateLead={onCreateLead}
                        compact={false}
                        currentFilters={currentFilters}
                        onUpdateFilters={onUpdateFilters}
                        onImportLeads={onImportLeads}
                        onBulkUpdate={onBulkUpdate}
                    />
                </div>
            ) : (
                // Detail View (Detail + Context Sidebar)
                <div className="flex-1 flex flex-col min-w-0 bg-white animate-in slide-in-from-right-4 duration-300">
                    <LeadDetail
                        lead={selectedLead}
                        onBack={() => onSelectLead(null)}
                        onViewAccount={onViewAccount}
                        onViewContact={onViewContact}
                        onUpdateLead={onUpdateLead}
                        onConvertLead={onConvertLead}
                    />
                </div>
            )}
        </div>
    );
};

export default LeadsLayout;
