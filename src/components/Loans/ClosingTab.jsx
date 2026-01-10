import React, { useState } from 'react';
import {
    CheckCircle, XCircle, AlertTriangle, FileText,
    DollarSign, Calendar, Upload, Shield, Lock, ExternalLink
} from 'lucide-react';

const ClosingTab = ({ loan, user, onCloseAndFund, isReadOnly }) => {
    // --------------------------------------------------------------------------
    // STATE: Form Data
    // --------------------------------------------------------------------------
    const [formData, setFormData] = useState({
        relatedApplication: loan.applicationId || 'APP-2023-005', // Mock Default
        closingStatus: 'Doc Prep',
        closingDate: '',
        attorneyFirm: '',
        docGenerationSystem: 'LaserPro',
        promissoryNoteSigned: '', // System field
        personalGuaranteeSigned: '', // System field
        securityAgreementSigned: '', // System field
        conditionsPrecedentMet: false,
        evidenceOfInsurance: null, // File object or mock string
        achFormSigned: false,
        finalClosingFees: '',
        disbursementMethod: '',
        bankAccountVerified: false,
        fundingAuthorization: '',
        netDisbursementAmt: '' // Calculated
    });

    const [errors, setErrors] = useState({});

    // --------------------------------------------------------------------------
    // HANDLERS
    // --------------------------------------------------------------------------
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData(prev => {
            const newData = { ...prev, [name]: val };

            // Auto-calculate Net Disbursement
            if (name === 'finalClosingFees') {
                const fees = parseFloat(val) || 0;
                const loanAmt = parseFloat(loan.amount) || 0;
                newData.netDisbursementAmt = (loanAmt - fees).toFixed(2);
            }

            return newData;
        });

        // Clear error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};

        // Mandatory fields for "Close & Fund"
        if (!formData.closingStatus) newErrors.closingStatus = 'Required';
        if (formData.closingStatus === 'Funded' || formData.closingStatus === 'Pending Funding') {
            if (!formData.conditionsPrecedentMet) newErrors.conditionsPrecedentMet = 'Must be met before funding';
            if (!formData.evidenceOfInsurance) newErrors.evidenceOfInsurance = 'Required before funding';
            if (!formData.bankAccountVerified) newErrors.bankAccountVerified = 'Required verification';
            if (!formData.fundingAuthorization) newErrors.fundingAuthorization = 'Required';
            if (!formData.disbursementMethod) newErrors.disbursementMethod = 'Required';
            if (!formData.finalClosingFees) newErrors.finalClosingFees = 'Required';
        }

        if (formData.closingStatus === 'Fully Executed' || formData.closingStatus === 'Funded') {
            if (!formData.closingDate) newErrors.closingDate = 'Required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCloseAndFund = () => {
        if (!validate()) return;

        // Prepare Payload
        const payload = {
            ...formData,
            action: 'CLOSE_AND_FUND',
            closedBy: user.email,
            timestamp: new Date().toISOString()
        };

        console.log('[AUDIT] Closing & Funding Executed:', payload);
        onCloseAndFund(payload);
    };

    // --------------------------------------------------------------------------
    // UI HELPERS
    // --------------------------------------------------------------------------
    const isFunded = formData.closingStatus === 'Funded';
    const canFund = formData.closingStatus === 'Pending Funding' || formData.closingStatus === 'Funded';

    // Derived UI state
    // If the record is passed in read-only mode (loan is closed) or status is funded locally
    const isLocked = isReadOnly || isFunded;

    return (
        <div className="flex flex-col gap-6 p-1 max-w-5xl mx-auto pb-20 animate-in fade-in slide-in-from-bottom-2 duration-300">

            {/* HEADER */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Lock size={20} className="text-emerald-600" />
                            Closing & Funding Record
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Capture final specific terms, execution details, and funding authorization.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full border border-emerald-200">
                            Post-Approval
                        </span>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* LEFT COLUMN: CLOSING LOGISTICS */}
                    <div className="space-y-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                            Closing Logistics
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Related App */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Related Application</label>
                                <input disabled value={formData.relatedApplication} className="w-full p-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-500" />
                            </div>

                            {/* Status */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Closing Status <span className="text-red-500">*</span></label>
                                <select
                                    name="closingStatus"
                                    value={formData.closingStatus}
                                    onChange={handleChange}
                                    disabled={isLocked}
                                    className={`w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${errors.closingStatus ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                                >
                                    <option value="Doc Prep">Doc Prep</option>
                                    <option value="Sent for Signature">Sent for Signature</option>
                                    <option value="Fully Executed">Fully Executed</option>
                                    <option value="Pending Funding">Pending Funding</option>
                                    <option value="Funded">Funded</option>
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Closing Date</label>
                                <input
                                    type="date"
                                    name="closingDate"
                                    value={formData.closingDate}
                                    onChange={handleChange}
                                    disabled={isLocked}
                                    className={`w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${errors.closingDate ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                                />
                                {errors.closingDate && <p className="text-xs text-red-500 mt-1">{errors.closingDate}</p>}
                            </div>

                            {/* System */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Doc Gen System</label>
                                <select
                                    name="docGenerationSystem"
                                    value={formData.docGenerationSystem}
                                    onChange={handleChange}
                                    disabled={isLocked}
                                    className="w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="LaserPro">LaserPro</option>
                                    <option value="ComplianceOne">ComplianceOne</option>
                                    <option value="Internal Template">Internal Template</option>
                                </select>
                            </div>

                            {/* Attorney */}
                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Attorney / Settlement Agent</label>
                                <input
                                    name="attorneyFirm"
                                    value={formData.attorneyFirm}
                                    onChange={handleChange}
                                    disabled={isLocked}
                                    placeholder="Search accounts..."
                                    className="w-full p-2 border border-slate-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        {/* System Dates (Read Only Mock) */}
                        <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <h4 className="text-xs font-bold text-slate-500 mb-3 flex items-center gap-2">
                                <ExternalLink size={12} /> DocuSign Intergration Status
                            </h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Promissory Note:</span>
                                    <span className="font-mono text-emerald-600">Signed {new Date().toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Personal Guarantee:</span>
                                    <span className="font-mono text-emerald-600">Signed {new Date().toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Security Agreement:</span>
                                    <span className="font-mono text-emerald-600">Signed {new Date().toLocaleDateString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FUNDING REQUIREMENTS */}
                    <div className={`space-y-6 ${(!canFund && !isLocked) ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-4">
                            Funding Requirements
                        </h3>

                        {/* Pre-Funding Checks */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    name="conditionsPrecedentMet"
                                    checked={formData.conditionsPrecedentMet}
                                    onChange={handleChange}
                                    disabled={isLocked}
                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <div>
                                    <span className="block text-sm font-semibold text-slate-700">All Conditions Precedent Met</span>
                                    <span className="text-xs text-slate-500">Verified against approval memo</span>
                                </div>
                            </label>
                            {errors.conditionsPrecedentMet && <p className="text-xs text-red-500 ml-1">{errors.conditionsPrecedentMet}</p>}

                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    name="bankAccountVerified"
                                    checked={formData.bankAccountVerified}
                                    onChange={handleChange}
                                    disabled={isLocked}
                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <div>
                                    <span className="block text-sm font-semibold text-slate-700">Bank Account Verified</span>
                                    <span className="text-xs text-slate-500">Call-back verification performed</span>
                                </div>
                            </label>
                            {errors.bankAccountVerified && <p className="text-xs text-red-500 ml-1">{errors.bankAccountVerified}</p>}

                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                                <input
                                    type="checkbox"
                                    name="achFormSigned"
                                    checked={formData.achFormSigned}
                                    onChange={handleChange}
                                    disabled={isLocked}
                                    className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                />
                                <div>
                                    <span className="block text-sm font-semibold text-slate-700">ACH Form Signed</span>
                                    <span className="text-xs text-slate-500">Auto-debit authorization</span>
                                </div>
                            </label>
                        </div>

                        {/* Evidence of Insurance */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Evidence of Insurance <span className="text-red-500">*</span></label>
                            <div className={`border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer ${errors.evidenceOfInsurance ? 'border-red-300 bg-red-50' : ''}`}>
                                {formData.evidenceOfInsurance ? (
                                    <div className="flex items-center gap-2 justify-center text-emerald-600 font-medium">
                                        <CheckCircle size={16} /> Insurance_Cert_2023.pdf
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => !isLocked && setFormData(prev => ({ ...prev, evidenceOfInsurance: 'File Uploaded' }))}
                                        className="text-slate-500"
                                    >
                                        <Upload size={24} className="mx-auto mb-2 text-slate-400" />
                                        <span className="text-sm">Click to upload policy document</span>
                                    </div>
                                )}
                            </div>
                            {errors.evidenceOfInsurance && <p className="text-xs text-red-500 mt-1">{errors.evidenceOfInsurance}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Total Closing Fees</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                    <input
                                        type="number"
                                        name="finalClosingFees"
                                        value={formData.finalClosingFees}
                                        onChange={handleChange}
                                        disabled={isLocked}
                                        placeholder="0.00"
                                        className={`w-full pl-7 p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${errors.finalClosingFees ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Net Disbursement</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-500">$</span>
                                    <input
                                        readOnly
                                        value={formData.netDisbursementAmt}
                                        placeholder="0.00"
                                        className="w-full pl-7 p-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-700 font-bold"
                                    />
                                </div>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Disbursement Method</label>
                                <select
                                    name="disbursementMethod"
                                    value={formData.disbursementMethod}
                                    onChange={handleChange}
                                    disabled={isLocked}
                                    className={`w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${errors.disbursementMethod ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                                >
                                    <option value="">-- Select Method --</option>
                                    <option value="Wire">Wire Transfer</option>
                                    <option value="Check">Check</option>
                                    <option value="Direct Payment">Direct Payment to Vendor</option>
                                </select>
                                {errors.disbursementMethod && <p className="text-xs text-red-500 mt-1">{errors.disbursementMethod}</p>}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Funding Authorization</label>
                                <input
                                    name="fundingAuthorization"
                                    value={formData.fundingAuthorization}
                                    onChange={handleChange}
                                    disabled={isLocked}
                                    placeholder="Search Director / CFO..."
                                    className={`w-full p-2 border rounded-md text-sm outline-none focus:ring-2 focus:ring-emerald-500 ${errors.fundingAuthorization ? 'border-red-300 bg-red-50' : 'border-slate-300'}`}
                                />
                                {errors.fundingAuthorization && <p className="text-xs text-red-500 mt-1">{errors.fundingAuthorization}</p>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            {!isLocked && (
                <div className="flex justify-end bg-white p-4 rounded-xl border border-slate-200 shadow-sm sticky bottom-4 z-20">
                    <button
                        onClick={handleCloseAndFund}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <Shield size={18} />
                        Close & Fund Loan
                    </button>
                </div>
            )}

            {isLocked && (
                <div className="flex items-center gap-2 p-4 bg-slate-100 rounded-lg text-slate-500 text-sm font-medium border border-slate-200">
                    <Lock size={16} /> Loan Closed & Funded. Record is locked.
                </div>
            )}

        </div>
    );
};

export default ClosingTab;
