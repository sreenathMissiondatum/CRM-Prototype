import React, { useState, useEffect } from 'react';
import {
    X, ShieldCheck, DollarSign, Calendar, MapPin,
    Truck, FileText, AlertTriangle, Info, Save, Building2
} from 'lucide-react';
import { createPortal } from 'react-dom';

const CollateralDrawer = ({ isOpen, onClose, loan, initialData, onSave }) => {
    if (!isOpen) return null;

    // --- State ---
    const [formData, setFormData] = useState({
        // Core
        type: 'Real Estate - Commercial (CRE)',
        description: '',
        status: 'Pledged',

        // Valuation
        grossValue: '',
        valuationSource: 'Certified Appraisal',
        valuationDate: '',
        discountRate: 25, // Percentage (0-100)
        netValue: 0, // Calculated

        // Lien & Ownership
        ownerType: 'Business',
        account: loan?.borrower || '', // Mock lookup
        lienPosition: '1st',
        priorLiens: '',
        netEquity: 0, // Calculated

        // Real Estate Specifics
        address: '',
        city: '',
        state: '',
        zip: '',
        parcelId: '',
        propertyType: 'Retail',
        occupancy: 'Tenant Occupied',
        environmental: 'Phase I Clean',
        floodZone: false,

        // Vehicle / Equipment Specifics
        vin: '',
        makeModel: '',

        // UCC Specifics
        uccNumber: '',
        filingDate: '',
        uccExpiry: '', // Calculated

        // Insurance
        insuranceCompany: '',
        policyNumber: '',
        policyExpiry: '',
        lossPayee: false,

        // Notes
        notes: ''
    });

    // Load initial data if editing
    useEffect(() => {
        if (initialData) {
            const data = { ...initialData };
            // Normalize legacy 'haircut' (retention rate 0.75) to 'discountRate' (25)
            if (data.haircut !== undefined && data.discountRate === undefined) {
                data.discountRate = Math.round((1 - data.haircut) * 100);
            }
            setFormData(prev => ({ ...prev, ...data }));
        }
    }, [initialData]);

    // Update legacy 'haircut' field for backward compatibility whenever discountRate changes
    useEffect(() => {
        const rate = (100 - formData.discountRate) / 100;
        setFormData(prev => ({ ...prev, haircut: rate }));
    }, [formData.discountRate]);

    // --- Logic & Calculations ---

    // 1. Default Discount Rate based on Type
    useEffect(() => {
        if (initialData) return; // Don't override if editing existing
        let rate = 50;
        const t = formData.type;

        if (t.includes('Real Estate - Residential')) rate = 15;
        else if (t.includes('Real Estate - Commercial')) rate = 25;
        else if (t.includes('Equipment')) rate = 50;
        else if (t.includes('Inventory')) rate = 80;
        else if (t.includes('Cash')) rate = 0;
        else if (t.includes('Vehicle')) rate = 50; // Defaulting Vehicle to 50% as generic "Rolling Stock" usually

        setFormData(prev => ({ ...prev, discountRate: rate }));
    }, [formData.type]);

    // 2. Calculate Net Value (Gross * (1 - Discount))
    useEffect(() => {
        const gross = Number(String(formData.grossValue).replace(/[^0-9.-]+/g, "")) || 0;
        const discountDec = formData.discountRate / 100;
        const net = gross * (1 - discountDec);
        setFormData(prev => ({ ...prev, netValue: net }));
    }, [formData.grossValue, formData.discountRate]);

    // 3. Calculate Net Equity (Gross - Prior Liens)
    useEffect(() => {
        const gross = Number(String(formData.grossValue).replace(/[^0-9.-]+/g, "")) || 0;
        const prior = Number(String(formData.priorLiens).replace(/[^0-9.-]+/g, "")) || 0;
        setFormData(prev => ({ ...prev, netEquity: gross - prior }));
    }, [formData.grossValue, formData.priorLiens]);

    // 4. Calculate UCC Expiration (Filing Date + 5 years)
    useEffect(() => {
        if (formData.filingDate) {
            const date = new Date(formData.filingDate);
            date.setFullYear(date.getFullYear() + 5);
            setFormData(prev => ({ ...prev, uccExpiry: date.toISOString().split('T')[0] }));
        } else {
            setFormData(prev => ({ ...prev, uccExpiry: '' }));
        }
    }, [formData.filingDate]);


    // Validation Helpers
    const isStaleValuation = () => {
        if (!formData.valuationDate) return false;
        const date = new Date(formData.valuationDate);
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        return date < twoYearsAgo;
    };

    const isInsuranceExpired = () => {
        if (!formData.policyExpiry) return false;
        const today = new Date();
        return new Date(formData.policyExpiry) < today;
    };

    const isInsuranceWarning = () => {
        if (!formData.policyExpiry) return false;
        const today = new Date();
        const thirtyDaysOut = new Date();
        thirtyDaysOut.setDate(today.getDate() + 30);
        const expiry = new Date(formData.policyExpiry);
        return expiry > today && expiry < thirtyDaysOut;
    };

    // Handlers
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        onSave({ ...formData, id: initialData?.id || `col_${Date.now()}` });
        onClose();
    };

    // Formatting
    const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

    // --- Render Content ---

    const drawerContent = (
        <div className="fixed inset-0 z-[70] flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">
                            {initialData ? 'Edit Collateral' : 'Add Collateral'}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wide">
                                {loan?.id || 'LOAN-NEW'}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">

                    {/* SECTION: Core Info */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                            <Select
                                label="Collateral Type"
                                value={formData.type}
                                onChange={(e) => handleChange('type', e.target.value)}
                                options={[
                                    'Real Estate - Residential',
                                    'Real Estate - Commercial (CRE)',
                                    'Vehicle / Rolling Stock',
                                    'Equipment / Machinery',
                                    'Inventory',
                                    'Accounts Receivable',
                                    'Cash / CD',
                                    'Blanket Lien (UCC-1)'
                                ]}
                            />
                            <Select
                                label="Collateral Status"
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                options={['Pledged', 'Active', 'Released', 'Liquidated']}
                            />
                            <Input
                                label="Description"
                                className="col-span-2"
                                placeholder="e.g. 2018 Ford F-150 or 123 Main St Warehouse"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* SECTION: Valuation */}
                    <div className="space-y-4">
                        <SectionHeader icon={DollarSign} title="Valuation" />
                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                label="Gross Appraised Value"
                                placeholder="$0.00"
                                value={formData.grossValue}
                                onChange={(e) => handleChange('grossValue', e.target.value)}
                            />
                            <Select
                                label="Valuation Source"
                                value={formData.valuationSource}
                                onChange={(e) => handleChange('valuationSource', e.target.value)}
                                options={['Certified Appraisal', 'Tax Assessment', 'Broker Price Opinion (BPO)', 'Purchase Invoice', 'Borrower Estimate']}
                            />
                            <div>
                                <Input
                                    label="Valuation Date"
                                    type="date"
                                    value={formData.valuationDate}
                                    onChange={(e) => handleChange('valuationDate', e.target.value)}
                                />
                                {isStaleValuation() && (
                                    <div className="flex items-center gap-1 text-xs text-amber-600 font-medium mt-1">
                                        <AlertTriangle size={12} /> Stale Valuation ({'>'} 2 Years)
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <Input
                                    label="Haircut %"
                                    type="number"
                                    className="w-24"
                                    value={formData.discountRate}
                                    onChange={(e) => handleChange('discountRate', e.target.value)}
                                />
                                <div className="flex-1 p-2 bg-slate-50 border border-slate-200 rounded-lg flex flex-col justify-center">
                                    <span className="text-[10px] text-slate-500 font-bold uppercase">Discounted Net Value</span>
                                    <span className="text-base font-bold text-slate-800">{formatCurrency(formData.netValue)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* SECTION: Lien & Ownership */}
                    <div className="space-y-4">
                        <SectionHeader icon={ShieldCheck} title="Lien & Ownership" />
                        <div className="grid grid-cols-2 gap-6">
                            <Select
                                label="Owner of Record"
                                value={formData.ownerType}
                                onChange={(e) => handleChange('ownerType', e.target.value)}
                                options={['Business', 'Individual Contact']}
                            />
                            <Input
                                label={formData.ownerType === 'Business' ? 'Business Account' : 'Individual Contact'}
                                value={formData.account}
                                readOnly
                                className="opacity-70"
                            />

                            <Select
                                label="Lien Position"
                                value={formData.lienPosition}
                                onChange={(e) => handleChange('lienPosition', e.target.value)}
                                options={['1st', '2nd', '3rd', 'Unsecured']}
                            />
                            <Input
                                label="Prior Liens Amount"
                                placeholder="$0.00"
                                value={formData.priorLiens}
                                onChange={(e) => handleChange('priorLiens', e.target.value)}
                            />

                            <div className="col-span-2 p-3 bg-blue-50/50 border border-blue-100 rounded-lg flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <Info size={16} className="text-blue-500" />
                                    <span className="text-sm font-medium text-blue-900">Net Equity Available</span>
                                </div>
                                <span className="text-lg font-bold text-blue-700">{formatCurrency(formData.netEquity)}</span>
                            </div>
                        </div>
                    </div>

                    {/* SECTION: Conditionals (Real Estate) */}
                    {formData.type.includes('Real Estate') && (
                        <>
                            <hr className="border-slate-100" />
                            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                <SectionHeader icon={Building2} title="Property Details" />
                                <div className="grid grid-cols-2 gap-6">
                                    <Input
                                        label="Street Address"
                                        className="col-span-2"
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                    />
                                    <div className="grid grid-cols-3 gap-4 col-span-2">
                                        <Input label="City" value={formData.city} onChange={(e) => handleChange('city', e.target.value)} />
                                        <Input label="State" value={formData.state} onChange={(e) => handleChange('state', e.target.value)} />
                                        <Input label="ZIP" value={formData.zip} onChange={(e) => handleChange('zip', e.target.value)} />
                                    </div>
                                    <Input
                                        label="Parcel ID / APN"
                                        value={formData.parcelId}
                                        onChange={(e) => handleChange('parcelId', e.target.value)}
                                    />
                                    <Select
                                        label="Property Type"
                                        value={formData.propertyType}
                                        onChange={(e) => handleChange('propertyType', e.target.value)}
                                        options={['Single Family', 'Multi-Family', 'Retail', 'Industrial', 'Raw Land']}
                                    />
                                    <Select
                                        label="Occupancy Status"
                                        value={formData.occupancy}
                                        onChange={(e) => handleChange('occupancy', e.target.value)}
                                        options={['Owner Occupied', 'Tenant Occupied', 'Vacant']}
                                    />
                                    <Select
                                        label="Environmental Status"
                                        value={formData.environmental}
                                        onChange={(e) => handleChange('environmental', e.target.value)}
                                        options={['Phase I Clean', 'Phase II Required', 'N/A']}
                                    />
                                    <div className="col-span-2">
                                        <label className="flex items-center gap-2 cursor-pointer p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={formData.floodZone}
                                                onChange={(e) => handleChange('floodZone', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded border-slate-300"
                                            />
                                            <div>
                                                <span className="text-sm font-bold text-slate-700 block">Flood Zone Property</span>
                                                <span className="text-xs text-slate-500">Requires Flood Insurance coverage</span>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {/* SECTION: Conditionals (Vehicle/Equipment) */}
                    {(formData.type.includes('Vehicle') || formData.type.includes('Equipment')) && (
                        <>
                            <hr className="border-slate-100" />
                            <div className="space-y-4 animate-in fade-in">
                                <SectionHeader icon={Truck} title="Asset Specifics" />
                                <div className="grid grid-cols-2 gap-6">
                                    <Input
                                        label="VIN / Serial Number"
                                        value={formData.vin}
                                        onChange={(e) => handleChange('vin', e.target.value)}
                                    />
                                    <Input
                                        label="Make / Model / Year"
                                        value={formData.makeModel}
                                        onChange={(e) => handleChange('makeModel', e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {/* SECTION: Conditionals (UCC) */}
                    {formData.type.includes('UCC') && (
                        <>
                            <hr className="border-slate-100" />
                            <div className="space-y-4 animate-in fade-in">
                                <SectionHeader icon={FileText} title="UCC Filings" />
                                <div className="grid grid-cols-2 gap-6">
                                    <Input
                                        label="UCC Filing Number"
                                        value={formData.uccNumber}
                                        onChange={(e) => handleChange('uccNumber', e.target.value)}
                                    />
                                    <Input
                                        label="Filing Date"
                                        type="date"
                                        value={formData.filingDate}
                                        onChange={(e) => handleChange('filingDate', e.target.value)}
                                    />
                                    <Input
                                        label="Expiration Date (Auto)"
                                        value={formData.uccExpiry}
                                        readOnly
                                        className="bg-slate-50 text-slate-500"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <hr className="border-slate-100" />

                    {/* SECTION: Insurance */}
                    <div className="space-y-4">
                        <SectionHeader icon={ShieldCheck} title="Insurance Coverage" />
                        <div className="grid grid-cols-2 gap-6">
                            <Input
                                label="Insurance Company"
                                value={formData.insuranceCompany}
                                onChange={(e) => handleChange('insuranceCompany', e.target.value)}
                            />
                            <Input
                                label="Policy Number"
                                value={formData.policyNumber}
                                onChange={(e) => handleChange('policyNumber', e.target.value)}
                            />
                            <div>
                                <Input
                                    label="Policy Expiration"
                                    type="date"
                                    value={formData.policyExpiry}
                                    onChange={(e) => handleChange('policyExpiry', e.target.value)}
                                />
                                {isInsuranceExpired() && (
                                    <div className="flex items-center gap-1 text-xs text-red-600 font-medium mt-1">
                                        <AlertTriangle size={12} /> Policy Expired
                                    </div>
                                )}
                                {isInsuranceWarning() && (
                                    <div className="flex items-center gap-1 text-xs text-amber-600 font-medium mt-1">
                                        <AlertTriangle size={12} /> Expires Soon ({'<'}30 days)
                                    </div>
                                )}
                            </div>
                            <div className="flex items-end pb-3">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.lossPayee}
                                        onChange={(e) => handleChange('lossPayee', e.target.checked)}
                                        className="w-4 h-4 text-blue-600 rounded border-slate-300"
                                    />
                                    <span className="text-sm font-medium text-slate-700">Lender Loss Payee</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Notes */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Notes / Comments</label>
                        <textarea
                            className="w-full text-sm border border-slate-200 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-sans"
                            rows="3"
                            placeholder="Add internal notes..."
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                        ></textarea>
                    </div>

                </div>

                {/* Footer Controls */}
                <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-between items-center z-10">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 text-slate-600 hover:text-slate-800 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 text-blue-600 font-bold hover:bg-blue-50 border border-transparent hover:border-blue-100 rounded-lg transition-colors">
                            Save Draft
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Save size={18} />
                            Save
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
    return createPortal(drawerContent, document.body);
};


// Helper Components
const SectionHeader = ({ icon: Icon, title }) => (
    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
        <Icon size={14} /> {title}
    </h3>
);

const Input = ({ label, className, ...props }) => (
    <div className={`space-y-1 ${className}`}>
        <label className="text-xs font-bold text-slate-500 uppercase block">{label}</label>
        <input
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all read-only:bg-slate-50 read-only:text-slate-500 placeholder:text-slate-300"
            {...props}
        />
    </div>
);

const Select = ({ label, options, value, onChange }) => (
    <div className="space-y-1">
        <label className="text-xs font-bold text-slate-500 uppercase block">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={onChange}
                className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white appearance-none cursor-pointer"
            >
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);

export default CollateralDrawer;
