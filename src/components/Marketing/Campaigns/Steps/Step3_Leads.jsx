import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowRight, ArrowLeft, CheckCircle, XCircle, AlertTriangle, User, Mail, Ban } from 'lucide-react';

const Step3_Leads = ({ data, onUpdate, onNext, onBack }) => {
    // Mock Data - In real app, fetch from API
    const MOCK_LEADS = [
        { id: 'L1', firstName: 'Robert', lastName: 'Fox', email: 'robert.fox@example.com', company: 'Fox Logistics LLC', status: 'Eligible' },
        { id: 'L2', firstName: 'Sarah', lastName: 'Connor', email: 'sarah.c@skynet.net', company: 'Resistance Corp', status: 'Eligible' },
        { id: 'L3', firstName: 'Albert', lastName: 'Flores', email: 'albert.f@example.com', company: 'Flores Holdings', status: 'Opted Out' },
        { id: 'L4', firstName: 'Devon', lastName: 'Lane', email: 'devon@example.com', company: 'Lane & Co', status: 'Eligible' },
        { id: 'L5', firstName: 'Jerome', lastName: 'Bell', email: 'jerome.b@example.com', company: 'Bell Partners', status: 'Bounced' },
        { id: 'L6', firstName: 'Arlene', lastName: 'McCoy', email: 'arlene@example.com', company: 'McCoy Inc', status: 'Eligible' },
    ];

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLeadIds, setSelectedLeadIds] = useState(data.selectedLeads || []);
    const [viewedLead, setViewedLead] = useState(null);

    // Initial Selection (Select all eligible by default if none selected yet?? No, let's keep user choice)
    // Actually, widespread pattern is "Select All" or manual. Let's do manual for control.

    const filteredLeads = MOCK_LEADS.filter(lead =>
    (lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toggleSelect = (id) => {
        if (selectedLeadIds.includes(id)) {
            setSelectedLeadIds(selectedLeadIds.filter(lid => lid !== id));
        } else {
            setSelectedLeadIds([...selectedLeadIds, id]);
        }
    };

    const toggleSelectAll = () => {
        const eligibleIds = filteredLeads.filter(l => l.status === 'Eligible').map(l => l.id);

        // If all eligible in current view are selected, deselect them. Otherwise, select them.
        const allSelected = eligibleIds.every(id => selectedLeadIds.includes(id));

        if (allSelected) {
            setSelectedLeadIds(selectedLeadIds.filter(id => !eligibleIds.includes(id)));
        } else {
            // Add missing ones
            const toAdd = eligibleIds.filter(id => !selectedLeadIds.includes(id));
            setSelectedLeadIds([...selectedLeadIds, ...toAdd]);
        }
    };

    const handleNext = () => {
        // Hydrate the selected IDs into full objects for next steps
        const selectedObjects = MOCK_LEADS.filter(l => selectedLeadIds.includes(l.id));
        onUpdate({
            ...data,
            selectedLeads: selectedLeadIds,
            _hydratedLeads: selectedObjects // Pass roughly helpful data for preview
        });
        onNext();
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500">
            <div className="flex-1 flex overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">

                {/* Left Panel: Lead Table */}
                <div className="w-2/3 border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-700">Select Recipients</h3>
                            <p className="text-xs text-slate-500">{selectedLeadIds.length} recipients selected</p>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-3 w-12 text-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                            onChange={toggleSelectAll}
                                            checked={filteredLeads.some(l => l.status === 'Eligible') && filteredLeads.filter(l => l.status === 'Eligible').every(l => selectedLeadIds.includes(l.id))}
                                        />
                                    </th>
                                    <th className="px-6 py-3 font-semibold text-slate-600">Lead Name</th>
                                    <th className="px-6 py-3 font-semibold text-slate-600">Company</th>
                                    <th className="px-6 py-3 font-semibold text-slate-600">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredLeads.map(lead => {
                                    const isEligible = lead.status === 'Eligible';
                                    const isSelected = selectedLeadIds.includes(lead.id);

                                    return (
                                        <tr
                                            key={lead.id}
                                            onClick={() => setViewedLead(lead)}
                                            className={`hover:bg-slate-50 transition-colors cursor-pointer ${viewedLead?.id === lead.id ? 'bg-blue-50/50' : ''}`}
                                        >
                                            <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    className={`rounded border-slate-300 text-blue-600 focus:ring-blue-500 ${!isEligible ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    checked={isSelected}
                                                    onChange={() => toggleSelect(lead.id)}
                                                    disabled={!isEligible}
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-slate-800">{lead.firstName} {lead.lastName}</div>
                                                <div className="text-xs text-slate-500">{lead.email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-600">
                                                {lead.company}
                                            </td>
                                            <td className="px-6 py-4">
                                                {lead.status === 'Eligible' && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full border border-green-100 uppercase font-bold">
                                                        <CheckCircle size={10} /> Eligible
                                                    </span>
                                                )}
                                                {lead.status === 'Opted Out' && (
                                                    <div className="group relative w-fit">
                                                        <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full border border-slate-200 uppercase font-bold cursor-help">
                                                            <Ban size={10} /> Opted Out
                                                        </span>
                                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-lg hidden group-hover:block z-50 text-center">
                                                            User has unsubscribed from marketing emails.
                                                        </div>
                                                    </div>
                                                )}
                                                {lead.status === 'Bounced' && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full border border-red-100 uppercase font-bold">
                                                        <AlertTriangle size={10} /> Bounced
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right Panel: Lead Detail & Preview */}
                <div className="w-1/3 bg-slate-50 flex flex-col border-l border-slate-200">
                    {viewedLead ? (
                        <div className="p-6 space-y-6">
                            <div className="text-center pb-6 border-b border-slate-200">
                                <div className="w-16 h-16 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-3 shadow-sm">
                                    <User size={32} />
                                </div>
                                <h4 className="font-bold text-slate-800 text-lg">{viewedLead.firstName} {viewedLead.lastName}</h4>
                                <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mt-1">
                                    <Mail size={14} /> {viewedLead.email}
                                </div>
                                <div className="mt-3">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${viewedLead.status === 'Eligible' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'}`}>
                                        {viewedLead.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <h5 className="font-bold text-xs text-slate-500 uppercase mb-3">CRM Profile Data</h5>
                                <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Company</span>
                                        <span className="font-medium text-slate-800">{viewedLead.company}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Source</span>
                                        <span className="font-medium text-slate-800">Website Form</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Last Active</span>
                                        <span className="font-medium text-slate-800">2 days ago</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-xs text-blue-800">
                                <p className="font-bold mb-1">Personalization Preview:</p>
                                <p>This lead's data will populate variables like <code>{`{{Lead.FirstName}}`}</code> as <strong>{viewedLead.firstName}</strong>.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mb-3">
                                <User size={24} />
                            </div>
                            <p className="text-sm">Select a lead from the list to view their profile details.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 flex justify-between">
                <button
                    onClick={onBack}
                    className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900 flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> Back
                </button>
                <div className="flex items-center gap-4">
                    {selectedLeadIds.length === 0 && (
                        <span className="text-sm text-red-500 animate-pulse">Select at least 1 recipient</span>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={selectedLeadIds.length === 0}
                        className={`
                            px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all
                            ${selectedLeadIds.length > 0
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                        `}
                    >
                        Next: Preview <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step3_Leads;
