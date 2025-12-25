
import React, { useState, useEffect } from 'react';
import {
    Plus, Search, Filter, MoreVertical,
    FileText, Calendar, DollarSign, ShieldAlert,
    Clock, CheckCircle, AlertTriangle, X
} from 'lucide-react';

const CapitalCommitmentModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState({
        funder: '',
        type: 'Grant (Unrestricted)', // Default
        amount: '',
        startDate: '',
        endDate: '',
        restrictions: '',
        // Financial Terms
        interestStructure: 'Fixed Rate',
        interestRate: '',
        referenceRate: 'SOFR',
        rateSpread: '',
        rateFloor: '',
        compounding: 'Annual',
        accrualStartDate: '',
        // Optional Costs
        servicingFee: '',
        commitmentFee: '',
        guaranteeFee: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            // Reset for new entry
            setFormData({
                funder: '',
                type: 'Grant (Unrestricted)',
                amount: '',
                startDate: '',
                endDate: '',
                restrictions: '',
                interestStructure: 'Fixed Rate',
                interestRate: '',
                referenceRate: 'SOFR',
                rateSpread: '',
                rateFloor: '',
                compounding: 'Annual',
                accrualStartDate: '',
                servicingFee: '',
                commitmentFee: '',
                guaranteeFee: ''
            });
        }
        setErrors({});
    }, [initialData, isOpen]);

    // Conditional Logic Helpers
    const isUnrestrictedGrant = formData.type === 'Grant (Unrestricted)';
    const showFinancialTerms = !isUnrestrictedGrant;

    // Financial Terms Visibility
    const showFixedRate = formData.interestStructure === 'Fixed Rate';
    const showFloatingRate = formData.interestStructure === 'Floating Rate';

    // Read-Only Status
    // Financial Terms are read-only if the commitment is already Active
    const isFinancialTermsReadOnly = initialData && initialData.status === 'Active';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when field is edited
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.funder) newErrors.funder = 'Funder is required';
        if (!formData.amount) newErrors.amount = 'Amount is required';

        if (showFinancialTerms) {
            if (showFixedRate && !formData.interestRate) newErrors.interestRate = 'Interest Rate is required';
            if (showFixedRate && parseFloat(formData.interestRate) < 0) newErrors.interestRate = 'Rate must be positive';

            if (showFloatingRate) {
                if (!formData.rateSpread) newErrors.rateSpread = 'Spread is required';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSave(formData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-slate-800">
                        {initialData ? 'Edit Capital Commitment' : 'New Capital Commitment'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* SECTION 1: BASIC INFO */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-2">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Funder Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="funder"
                                    value={formData.funder}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none transition-all ${errors.funder ? 'border-red-300' : 'border-slate-200'}`}
                                    placeholder="e.g. Kresge Foundation"
                                />
                                {errors.funder && <p className="text-xs text-red-500 mt-1">{errors.funder}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Commitment Type</label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    // Lock type if active to prevent breaking financial structure validity
                                    disabled={isFinancialTermsReadOnly}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white disabled:bg-slate-50 disabled:text-slate-500"
                                >
                                    <option value="Grant (Unrestricted)">Grant (Unrestricted)</option>
                                    <option value="Grant (Restricted)">Grant (Restricted)</option>
                                    <option value="PRI (Program Related Investment)">PRI</option>
                                    <option value="Debt Facility">Debt Facility</option>
                                    <option value="Guarantee">Guarantee</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none ${errors.amount ? 'border-red-300' : 'border-slate-200'}`}
                                    placeholder="$0.00"
                                />
                                {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-slate-600"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-slate-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: FINANCIAL TERMS (CONDITIONAL) */}
                    {showFinancialTerms && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                                    <DollarSign size={16} className="text-blue-500" />
                                    Financial Terms
                                </h3>
                                {isFinancialTermsReadOnly && (
                                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                                        Active - Read Only
                                    </span>
                                )}
                            </div>

                            <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl border border-slate-100 ${isFinancialTermsReadOnly ? 'bg-slate-50 opacity-90' : 'bg-slate-50'}`}>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Interest Structure</label>
                                    <select
                                        name="interestStructure"
                                        value={formData.interestStructure}
                                        onChange={handleChange}
                                        disabled={isFinancialTermsReadOnly}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                                    >
                                        <option value="Fixed Rate">Fixed Rate</option>
                                        <option value="Floating Rate">Floating Rate</option>
                                        <option value="No Interest">No Interest / 0%</option>
                                    </select>
                                </div>

                                {showFixedRate && (
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate (%) <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="interestRate"
                                                value={formData.interestRate}
                                                onChange={handleChange}
                                                disabled={isFinancialTermsReadOnly}
                                                step="0.01"
                                                className={`w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-slate-100 disabled:text-slate-500 ${errors.interestRate ? 'border-red-300' : 'border-slate-200'}`}
                                                placeholder="0.00"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                                        </div>
                                        {errors.interestRate && <p className="text-xs text-red-500 mt-1">{errors.interestRate}</p>}
                                    </div>
                                )}

                                {showFloatingRate && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Reference Rate</label>
                                            <select
                                                name="referenceRate"
                                                value={formData.referenceRate}
                                                onChange={handleChange}
                                                disabled={isFinancialTermsReadOnly}
                                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                                            >
                                                <option value="SOFR">SOFR</option>
                                                <option value="Prime">Prime</option>
                                                <option value="Custom">Custom</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Spread (%) <span className="text-red-500">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    name="rateSpread"
                                                    value={formData.rateSpread}
                                                    onChange={handleChange}
                                                    disabled={isFinancialTermsReadOnly}
                                                    step="0.01"
                                                    className={`w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-slate-100 disabled:text-slate-500 ${errors.rateSpread ? 'border-red-300' : 'border-slate-200'}`}
                                                    placeholder="+1.50"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                                            </div>
                                            {errors.rateSpread && <p className="text-xs text-red-500 mt-1">{errors.rateSpread}</p>}
                                        </div>
                                    </>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Rate Floor (%)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="rateFloor"
                                            value={formData.rateFloor}
                                            onChange={handleChange}
                                            disabled={isFinancialTermsReadOnly}
                                            step="0.01"
                                            className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-slate-100 disabled:text-slate-500"
                                            placeholder="0.00"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Compounding</label>
                                    <select
                                        name="compounding"
                                        value={formData.compounding}
                                        onChange={handleChange}
                                        disabled={isFinancialTermsReadOnly}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none bg-white disabled:bg-slate-100 disabled:text-slate-500"
                                    >
                                        <option value="Annual">Annual</option>
                                        <option value="Semi-Annual">Semi-Annual</option>
                                        <option value="Quarterly">Quarterly</option>
                                    </select>
                                </div>

                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Accrual Start</label>
                                    <input
                                        type="date"
                                        name="accrualStartDate"
                                        value={formData.accrualStartDate || formData.startDate}
                                        onChange={handleChange}
                                        disabled={isFinancialTermsReadOnly}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-slate-600 disabled:bg-slate-100 disabled:text-slate-500"
                                    />
                                    <p className="text-[10px] text-slate-400 mt-1">Defaults to Commitment Start if empty</p>
                                </div>
                            </div>

                            {/* OPTIONAL COSTS */}
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Additional Cost Considerations</h4>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Servicing Fee</label>
                                        <input
                                            type="text"
                                            name="servicingFee"
                                            value={formData.servicingFee}
                                            onChange={handleChange}
                                            disabled={isFinancialTermsReadOnly}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-slate-100"
                                            placeholder="e.g. 0.25%"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Commitment Fee</label>
                                        <input
                                            type="text"
                                            name="commitmentFee"
                                            value={formData.commitmentFee}
                                            onChange={handleChange}
                                            disabled={isFinancialTermsReadOnly}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-slate-100"
                                            placeholder="e.g. 1.00%"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Guarantee Fee</label>
                                        <input
                                            type="text"
                                            name="guaranteeFee"
                                            value={formData.guaranteeFee}
                                            onChange={handleChange}
                                            disabled={isFinancialTermsReadOnly}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-100 outline-none disabled:bg-slate-100"
                                            placeholder="Fixed or %"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl sticky bottom-0">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                    >
                        <CheckCircle size={16} />
                        {initialData ? 'Update' : 'Create'} Commitment
                    </button>
                </div>
            </div>
        </div>
    );
};

const CapitalCommitments = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCommitment, setEditingCommitment] = useState(null);

    // ----------------------------------------------------------------------
    // MOCK DATA
    // ----------------------------------------------------------------------
    const [commitments, setCommitments] = useState([
        {
            id: 'CMT-2023-001',
            funder: 'Kresge Foundation',
            type: 'PRI (Program Related Investment)',
            amount: '$5,000,000',
            startDate: '2023-01-15',
            endDate: '2028-01-15',
            restrictions: 'Affordable Housing Only',
            status: 'Active',
            interestStructure: 'Fixed Rate',
            interestRate: '1.00'
        },
        {
            id: 'CMT-2023-002',
            funder: 'Chase Community Dev',
            type: 'Grant',
            amount: '$250,000',
            startDate: '2023-03-01',
            endDate: '2024-03-01',
            restrictions: 'Operating Support (Unrestricted)',
            status: 'Active'
        },
        {
            id: 'CMT-2022-015',
            funder: 'Ford Foundation',
            type: 'Guarantee',
            amount: '$2,000,000',
            startDate: '2022-06-01',
            endDate: '2025-06-01',
            restrictions: 'Small Business Lending',
            status: 'Active',
            interestStructure: 'Floating Rate',
            referenceRate: 'SOFR',
            rateSpread: '1.50'
        },
        {
            id: 'CMT-2024-001',
            funder: 'Wells Fargo',
            type: 'Debt Facility',
            amount: '$10,000,000',
            startDate: '-',
            endDate: '-',
            restrictions: 'Pending Final Agreement',
            status: 'Draft',
            interestStructure: 'Fixed Rate',
            interestRate: '3.50'
        },
        {
            id: 'CMT-2020-005',
            funder: 'State Economic Dev Corp',
            type: 'Grant',
            amount: '$1,000,000',
            startDate: '2020-01-01',
            endDate: '2022-12-31',
            restrictions: 'COVID Relief',
            status: 'Expired'
        }
    ]);

    const [filterStatus, setFilterStatus] = useState('All');

    // Filter Logic
    const filteredCommitments = filterStatus === 'All'
        ? commitments
        : commitments.filter(c => c.status === filterStatus);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'Draft': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Expired': return 'bg-slate-100 text-slate-500 border-slate-200';
            default: return 'bg-slate-100 text-slate-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Active': return <CheckCircle size={14} className="mr-1" />;
            case 'Draft': return <Clock size={14} className="mr-1" />;
            case 'Expired': return <AlertTriangle size={14} className="mr-1" />;
            default: return null;
        }
    };

    const handleOpenModal = (commitment = null) => {
        setEditingCommitment(commitment);
        setIsModalOpen(true);
    };

    const handleSaveCommitment = (data) => {
        if (editingCommitment) {
            // Edit Mode
            setCommitments(prev => prev.map(c => c.id === editingCommitment.id ? { ...c, ...data } : c));
        } else {
            // Create Mode - Generate mock ID
            const newId = `CMT-2025-${String(commitments.length + 1).padStart(3, '0')}`;
            setCommitments(prev => [{ id: newId, status: 'Draft', ...data }, ...prev]);
        }
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 px-1">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Capital Commitments</h1>
                    <p className="text-slate-500 mt-1">Track grants, PRIs, debt facilities, and guarantees</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
                >
                    <Plus size={18} />
                    <span>Add Commitment</span>
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative flex-1 min-w-[240px]">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by ID, Funder, or Type..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>

                    <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            className="text-sm border-none focus:ring-0 text-slate-600 font-medium bg-transparent cursor-pointer"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Expired">Expired</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Commitment ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Funder Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Total Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Restrictions</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCommitments.map((commitment) => (
                                <tr
                                    key={commitment.id}
                                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                    onClick={() => handleOpenModal(commitment)}
                                >
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-900 font-mono">{commitment.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-semibold text-blue-600 hover:underline">{commitment.funder}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FileText size={14} className="text-slate-400" />
                                            <span className="text-sm text-slate-700">{commitment.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-bold text-slate-900">{commitment.amount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{commitment.startDate}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">{commitment.endDate}</span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="flex items-center gap-1.5 text-sm text-slate-600 truncate" title={commitment.restrictions}>
                                            <ShieldAlert size={14} className="text-slate-400 shrink-0" />
                                            <span className="truncate">{commitment.restrictions}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(commitment.status)}`}>
                                            {getStatusIcon(commitment.status)}
                                            {commitment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleOpenModal(commitment); }}
                                            className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                            title="Edit Commitment"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Footer / Pagination */}
                <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-xs text-slate-500">
                    <div>Showing {filteredCommitments.length} results</div>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-slate-200 rounded hover:bg-white disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            <CapitalCommitmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveCommitment}
                initialData={editingCommitment}
            />
        </div>
    );
};

export default CapitalCommitments;
