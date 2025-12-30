import React, { useState, useEffect } from 'react';
import {
    X, Check, AlertCircle, Users, ArrowRight,
    Database, ShieldCheck, ChevronRight, Loader2
} from 'lucide-react';

const STEPS = {
    SELECT_FIELD: 'select_field',
    CONFIRM: 'confirm',
    UPDATING: 'updating',
    RESULT: 'result'
};

const UPDATEABLE_FIELDS = [
    {
        id: 'assignedOfficer',
        label: 'Assigned Loan Officer',
        type: 'select',
        options: ['Sarah M', 'Alex Morgan', 'Unassigned', 'James Wilson', 'Elena Rodriguez']
    },
    {
        id: 'stage',
        label: 'Stage',
        type: 'select',
        options: ['New', 'Attempting Contact', 'Pre-Screening', 'Hold', 'Nurturing', 'Qualified', 'Adverse Action', 'Cold', 'Unqualified', 'Converted']
    },
    {
        id: 'source',
        label: 'Lead Source',
        type: 'select',
        options: ['Referral', 'Web Form', 'Cold Outreach', 'Existing Client', 'Partner']
    },
    {
        id: 'urgencyStatus',
        label: 'Priority / Risk',
        type: 'select',
        options: ['low', 'medium', 'high', 'track']
    }
];

const BulkUpdateModal = ({ isOpen, onClose, selectedLeads = [], onUpdate }) => {
    const [step, setStep] = useState(STEPS.SELECT_FIELD);
    const [fieldToUpdate, setFieldToUpdate] = useState('');
    const [newValue, setNewValue] = useState('');
    const [stats, setStats] = useState({ success: 0 });

    useEffect(() => {
        if (isOpen) {
            setStep(STEPS.SELECT_FIELD);
            setFieldToUpdate('');
            setNewValue('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const selectedFieldConfig = UPDATEABLE_FIELDS.find(f => f.id === fieldToUpdate);

    // --- ACTIONS ---

    const handleExecute = async () => {
        setStep(STEPS.UPDATING);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const updates = { [fieldToUpdate]: newValue };
        onUpdate(selectedLeads.map(l => l.id), updates);

        setStats({ success: selectedLeads.length });
        setStep(STEPS.RESULT);
    };

    // --- RENDERERS ---

    const renderSelectField = () => (
        <div className="flex flex-col h-full">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
                <Users size={20} className="text-blue-600 mt-0.5" />
                <div>
                    <h4 className="font-bold text-blue-900 text-sm">Selected Records: {selectedLeads.length}</h4>
                    <p className="text-xs text-blue-700 mt-1">
                        You are about to update {selectedLeads.length} leads. Please select the field you wish to modify.
                        <br />Sensitive fields (PII, Credit) cannot be bulk updated.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Field to Update</label>
                    <select
                        value={fieldToUpdate}
                        onChange={(e) => {
                            setFieldToUpdate(e.target.value);
                            setNewValue(''); // Reset value when field changes
                        }}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Select a field...</option>
                        {UPDATEABLE_FIELDS.map(f => (
                            <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                    </select>
                </div>

                {fieldToUpdate && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                        <label className="block text-sm font-medium text-slate-700 mb-1">New Value</label>
                        {selectedFieldConfig?.type === 'select' ? (
                            <select
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Select new value...</option>
                                {selectedFieldConfig.options.map(opt => (
                                    <option key={opt} value={opt}>
                                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                        {/* Helper for priority labels */}
                                        {fieldToUpdate === 'urgencyStatus' && (
                                            opt === 'high' ? ' (High Risk)' :
                                                opt === 'medium' ? ' (Medium)' :
                                                    opt === 'low' ? ' (Low)' : ' (Watch List)'
                                        )}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                        )}
                    </div>
                )}
            </div>

            <div className="mt-auto pt-6 flex justify-end">
                <button
                    disabled={!fieldToUpdate || !newValue}
                    onClick={() => setStep(STEPS.CONFIRM)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Review Changes <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );

    const renderConfirm = () => (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Confirm Bulk Update</h3>
                <p className="text-slate-500 max-w-sm mb-6">
                    You are ensuring consistency across <strong className="text-slate-900">{selectedLeads.length} leads</strong>.
                </p>

                <div className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-lg p-4 text-left">
                    <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 text-sm">
                        <div>
                            <div className="text-xs text-slate-400 uppercase font-bold">Field</div>
                            <div className="font-medium text-slate-700">{selectedFieldConfig?.label}</div>
                        </div>
                        <ArrowRight size={16} className="text-slate-300" />
                        <div className="text-right">
                            <div className="text-xs text-slate-400 uppercase font-bold">New Value</div>
                            <div className="font-bold text-blue-600">{newValue}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                    <ShieldCheck size={12} />
                    <span>This action will be audit logged.</span>
                </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between">
                <button onClick={() => setStep(STEPS.SELECT_FIELD)} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">
                    Back
                </button>
                <button
                    onClick={handleExecute}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 shadow-lg shadow-blue-200"
                >
                    Confirm & Update
                </button>
            </div>
        </div>
    );

    const renderUpdating = () => (
        <div className="flex flex-col items-center justify-center py-12 h-64">
            <Loader2 size={48} className="text-blue-600 animate-spin mb-6" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Applying Changes...</h3>
            <p className="text-slate-500">Updating {selectedLeads.length} records.</p>
        </div>
    );

    const renderResult = () => (
        <div className="flex flex-col items-center justify-center py-8 text-center h-full">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <Check size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Update Complete</h3>
            <p className="text-slate-500 max-w-sm mb-8">
                Successfully updated <strong className="text-emerald-700">{stats.success}</strong> leads with new {selectedFieldConfig?.label}.
            </p>
            <button
                onClick={onClose}
                className="px-8 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 shadow-lg"
            >
                Done
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col border border-slate-200 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <Database size={18} className="text-slate-400" />
                        Bulk Update Leads
                    </h2>
                    <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 min-h-[400px]">
                    {step === STEPS.SELECT_FIELD && renderSelectField()}
                    {step === STEPS.CONFIRM && renderConfirm()}
                    {step === STEPS.UPDATING && renderUpdating()}
                    {step === STEPS.RESULT && renderResult()}
                </div>
            </div>
        </div>
    );
};

export default BulkUpdateModal;
