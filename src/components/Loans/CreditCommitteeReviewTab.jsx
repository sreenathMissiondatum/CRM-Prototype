import React, { useState, useEffect } from 'react';
import {
    CheckCircle, XCircle, AlertTriangle, FileText,
    DollarSign, Calendar, Users, Gavel, Shield
} from 'lucide-react';

const CreditCommitteeReviewTab = ({ loan, user, onApprove, onDeny, isReadOnly }) => {
    // --------------------------------------------------------------------------
    // STATE: Form Data
    // --------------------------------------------------------------------------
    const [formData, setFormData] = useState({
        decisionLevel: 'Loan Committee',
        meetingDate: new Date().toISOString().split('T')[0],
        voteResult: '',
        approvedAmount: loan.amount || '',
        approvedRate: '', // Pre-fill if available in loan data
        approvedTerm: '',
        policyExceptions: '',
        conditionsOfApproval: '',
        committeeMinutesLink: '',
        signOffOfficer: `${user.firstName} ${user.lastName}`
    });

    const [errors, setErrors] = useState({});

    // --------------------------------------------------------------------------
    // HANDLERS
    // --------------------------------------------------------------------------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = (action) => {
        const newErrors = {};

        if (!formData.decisionLevel) newErrors.decisionLevel = 'Required';
        if (!formData.meetingDate) newErrors.meetingDate = 'Required';
        if (!formData.voteResult) newErrors.voteResult = 'Required';

        if (action === 'Approve') {
            if (formData.voteResult === 'Declined') {
                newErrors.voteResult = 'Cannot approve if vote is Declined';
            }
            if (formData.voteResult === 'Tabled') {
                newErrors.voteResult = 'Cannot approve if vote is Tabled';
            }
            if (!formData.approvedAmount) newErrors.approvedAmount = 'Required for approval';
            if (!formData.approvedRate) newErrors.approvedRate = 'Required for approval';
            if (!formData.approvedTerm) newErrors.approvedTerm = 'Required for approval';
        }

        if (action === 'Deny') {
            if (formData.voteResult !== 'Declined') {
                newErrors.voteResult = 'Vote result must be Declined to deny loan';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAction = (action) => {
        if (!validate(action)) return;

        // Prepare Payload
        const payload = {
            ...formData,
            action,
            decisionBy: user.email,
            timestamp: new Date().toISOString()
        };

        // Audit Log
        console.log(`[AUDIT] Credit Committee Decision: ${action.toUpperCase()}`, payload);

        // Execute Callback
        if (action === 'Approve') {
            onApprove(payload);
        } else if (action === 'Deny') {
            onDeny(payload);
        }
    };

    // --------------------------------------------------------------------------
    // UI HELPERS
    // --------------------------------------------------------------------------
    const isDeclined = formData.voteResult === 'Declined';
    const isTabled = formData.voteResult === 'Tabled';
    const isApproved = ['Unanimous Approval', 'Majority Approval'].includes(formData.voteResult);

    return (
        <div className="flex flex-col gap-6 p-1 max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* HEADER */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Gavel size={20} className="text-indigo-600" />
                            Credit Committee Decision Record
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Use this form to record the official outcome of the credit committee meeting.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-200">
                            Audit Critical
                        </span>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* LEFT COLUMN: MEETING DETAILS */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                            Meeting Details
                        </h3>

                        {/* Decision Level */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Decision Level <span className="text-red-500">*</span></label>
                            <select
                                name="decisionLevel"
                                value={formData.decisionLevel}
                                onChange={handleChange}
                                disabled={isReadOnly}
                                className={`w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.decisionLevel ? 'border-red-300 bg-red-50' : 'border-slate-300'} ${isReadOnly ? 'bg-slate-50 text-slate-500' : ''}`}
                            >
                                <option value="Staff (Micro)">Staff (Micro)</option>
                                <option value="Loan Committee">Loan Committee</option>
                                <option value="Board of Directors">Board of Directors</option>
                            </select>
                            {errors.decisionLevel && <p className="text-xs text-red-500 mt-1">{errors.decisionLevel}</p>}
                        </div>

                        {/* Meeting Date */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Meeting Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                name="meetingDate"
                                value={formData.meetingDate}
                                onChange={handleChange}
                                disabled={isReadOnly}
                                className={`w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.meetingDate ? 'border-red-300 bg-red-50' : 'border-slate-300'} ${isReadOnly ? 'bg-slate-50 text-slate-500' : ''}`}
                            />
                            {errors.meetingDate && <p className="text-xs text-red-500 mt-1">{errors.meetingDate}</p>}
                        </div>

                        {/* Vote Result */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Vote Result <span className="text-red-500">*</span></label>
                            <select
                                name="voteResult"
                                value={formData.voteResult}
                                onChange={handleChange}
                                disabled={isReadOnly}
                                className={`w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.voteResult ? 'border-red-300 bg-red-50' : 'border-slate-300'} ${isReadOnly ? 'bg-slate-50 text-slate-500' : ''}`}
                            >
                                <option value="">-- Select Result --</option>
                                <option value="Unanimous Approval">Unanimous Approval</option>
                                <option value="Majority Approval">Majority Approval</option>
                                <option value="Declined">Declined</option>
                                <option value="Tabled">Tabled</option>
                            </select>
                            {errors.voteResult && <p className="text-xs text-red-500 mt-1">{errors.voteResult}</p>}
                        </div>

                        {/* Sign-Off Officer (Read Only) */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Sign-Off Officer</label>
                            <div className="w-full p-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-600 flex items-center gap-2">
                                <Users size={16} />
                                {formData.signOffOfficer}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: APPROVAL TERMS */}
                    <div className={`space-y-6 ${isDeclined ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                            Approved Terms
                        </h3>

                        {/* Approved Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">
                                Approved Amount {isApproved && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                <input
                                    type="text"
                                    name="approvedAmount"
                                    value={formData.approvedAmount}
                                    onChange={handleChange}
                                    disabled={isDeclined || isReadOnly}
                                    placeholder="0.00"
                                    className={`w-full pl-7 p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.approvedAmount ? 'border-red-300 bg-red-50' : 'border-slate-300'} ${isReadOnly ? 'bg-slate-50 text-slate-500' : ''}`}
                                />
                            </div>
                            <p className="text-xs text-slate-400 mt-1">May differ from requested amount.</p>
                            {errors.approvedAmount && <p className="text-xs text-red-500 mt-1">{errors.approvedAmount}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Rate */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Approved Rate {isApproved && <span className="text-red-500">*</span>}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="approvedRate"
                                        value={formData.approvedRate}
                                        onChange={handleChange}
                                        disabled={isDeclined || isReadOnly}
                                        placeholder="%"
                                        className={`w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.approvedRate ? 'border-red-300 bg-red-50' : 'border-slate-300'} ${isReadOnly ? 'bg-slate-50 text-slate-500' : ''}`}
                                    />
                                </div>
                                {errors.approvedRate && <p className="text-xs text-red-500 mt-1">{errors.approvedRate}</p>}
                            </div>

                            {/* Term */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">
                                    Term (Months) {isApproved && <span className="text-red-500">*</span>}
                                </label>
                                <input
                                    type="number"
                                    name="approvedTerm"
                                    value={formData.approvedTerm}
                                    onChange={handleChange}
                                    disabled={isDeclined || isReadOnly}
                                    className={`w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${errors.approvedTerm ? 'border-red-300 bg-red-50' : 'border-slate-300'} ${isReadOnly ? 'bg-slate-50 text-slate-500' : ''}`}
                                />
                                {errors.approvedTerm && <p className="text-xs text-red-500 mt-1">{errors.approvedTerm}</p>}
                            </div>
                        </div>

                        {/* Minutes Link */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Committee Minutes Link</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500"><FileText size={14} /></span>
                                <input
                                    type="url"
                                    name="committeeMinutesLink"
                                    value={formData.committeeMinutesLink}
                                    onChange={handleChange}
                                    disabled={isDeclined || isReadOnly}
                                    placeholder="https://..."
                                    className={`w-full pl-9 p-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${isReadOnly ? 'bg-slate-50 text-slate-500' : ''}`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* FULL WIDTH SECTIONS */}
                <div className="px-8 pb-8 space-y-6">
                    {/* Policy Exceptions */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                            Policy Exceptions
                            <span className="text-xs font-normal text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Audit Critical</span>
                        </label>
                        <textarea
                            name="policyExceptions"
                            value={formData.policyExceptions}
                            onChange={handleChange}
                            disabled={isReadOnly}
                            rows="3"
                            placeholder="Explain any deviations from credit policy..."
                            className={`w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${isReadOnly ? 'bg-slate-50 text-slate-500' : ''}`}
                        ></textarea>
                        <p className="text-xs text-slate-400 mt-1">If approved with exceptions, detail the mitigants here.</p>
                    </div>

                    {/* Conditions */}
                    <div className={isDeclined ? 'opacity-50 pointer-events-none' : ''}>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Conditions of Approval</label>
                        <textarea
                            name="conditionsOfApproval"
                            value={formData.conditionsOfApproval}
                            onChange={handleChange}
                            rows="3"
                            disabled={isDeclined || isReadOnly}
                            placeholder="List conditions precedent and subsequent..."
                            className={`w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500 ${isReadOnly ? 'bg-slate-50 text-slate-500' : ''}`}
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* ACTION BAR */}
            {!isReadOnly && (
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky bottom-4 z-20">
                    <div className="text-sm text-slate-500">
                        {isTabled ? (
                            <span className="flex items-center gap-2 text-amber-600 font-medium">
                                <AlertTriangle size={16} /> Decision Tabled. No actions available.
                            </span>
                        ) : (
                            <span>Please confirm all details before finalizing. This action contributes to the legal audit trail.</span>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => handleAction('Deny')}
                            disabled={isTabled}
                            className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${isTabled
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:shadow-md'
                                }`}
                        >
                            <XCircle size={18} />
                            Deny Loan
                        </button>

                        <button
                            onClick={() => handleAction('Approve')}
                            disabled={isTabled || isDeclined}
                            className={`px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 text-white shadow-md transition-all ${isTabled || isDeclined
                                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                                : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                                }`}
                        >
                            <CheckCircle size={18} />
                            Approve Loan
                        </button>
                    </div>
                </div>
            )}

            {isReadOnly && (
                <div className="flex items-center gap-2 p-4 bg-slate-100 rounded-lg text-slate-500 text-sm font-medium border border-slate-200">
                    <Shield size={16} /> Decision Finalized. Record is locked for audit.
                </div>
            )}

        </div>
    );
};

export default CreditCommitteeReviewTab;
