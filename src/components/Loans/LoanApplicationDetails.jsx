import React, { useState, useEffect } from 'react';
import {
    FileText, ShieldCheck, History, Edit3, Lock,
    AlertCircle, CheckCircle2, ChevronDown, ChevronRight,
    Plus, Trash2, DollarSign, Calculator, Save, RefreshCw
} from 'lucide-react';

const LoanApplicationDetails = ({ loan, onUpdate }) => {
    // A1 Model: Local State for Editing
    // We initialize state from props but manage it locally to support the "Authoritative Workspace" requirement
    const [formData, setFormData] = useState(loan.application || {});
    const [activeSection, setActiveSection] = useState('facilities');
    const [expandedFacilities, setExpandedFacilities] = useState({});

    const [validationState, setValidationState] = useState({ isValid: true, message: '' });

    // Demo Mock: Lead Requested Amount
    const LEAD_REQUESTED_AMOUNT = 75000;

    // Derived State (Auto-Calculated)
    const [derived, setDerived] = useState(formData.derived || {});

    // Effect: Recalculate Derived Fields on Form Change
    useEffect(() => {
        calculateDerived(formData);
    }, [formData]);

    const calculateDerived = (data) => {
        if (!data.facilities) return;

        // 8) FACILITY SUMS (AUTO-CALCULATED)
        const amtLoan_fALL = data.facilities.reduce((sum, f) => sum + (Number(f.loan_terms?.amtLoan_fX) || 0), 0);
        const feesTotalClosing_fALL = data.facilities.reduce((sum, f) => sum + (Number(f.interest_fees?.feesTotalClosing_fX) || 0), 0);

        // Mock LTV Calc
        const totalCollateral = data.facilities.reduce((sum, f) => {
            return sum + (f.collateral?.reduce((cSum, c) => cSum + (Number(c.discontNetAmt_collatX_fX) || 0), 0) || 0);
        }, 0);

        const LTV_collateral_apl = amtLoan_fALL > 0 ? (totalCollateral / amtLoan_fALL) * 100 : 0;

        setDerived({
            amtLoan_fALL,
            feesTotalClosing_fALL,
            discontNetAmt_collatALL_fALL: totalCollateral,
            LTV_collateral_apl,
            payAmt_mo_fALL: 943.50 // Placeholder
        });

        // Validation Logic for Demo
        if (amtLoan_fALL !== LEAD_REQUESTED_AMOUNT) {
            setValidationState({
                isValid: false,
                message: `Total ($${amtLoan_fALL.toLocaleString()}) does not match Lead Request ($${LEAD_REQUESTED_AMOUNT.toLocaleString()})`
            });
        } else {
            setValidationState({ isValid: true, message: 'Facility totals reconcile with Lead Request' });
        }
    };

    const handleFieldChange = (path, value) => {
        // Deep update helper
        const newData = JSON.parse(JSON.stringify(formData));

        // Path example: "facilities[0].loan_terms.amtLoan_fX"
        // Simple manual traversal for prototype
        const parts = path.split('.');
        let current = newData;
        for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (part.includes('[')) {
                // Array handling: facilities[0] -> key="facilities", index=0
                const [key, indexStr] = part.split('[');
                const index = parseInt(indexStr.replace(']', ''));
                current = current[key][index];
            } else {
                current = current[part];
            }
        }

        const lastPart = parts[parts.length - 1];
        current[lastPart] = value;

        console.log(`[AUDIT] Field Edited: ${path} | New Value: ${value} | User: System`);
        setFormData(newData);
    };

    const toggleFacility = (idx) => {
        setExpandedFacilities(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (!loan?.application?.isHydrated) {
        return (
            <div className="p-8 text-center text-slate-500">
                <AlertCircle className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900">Application Data Not Available</h3>
                <p>This loan was created before the A1 model implementation.</p>
            </div>
        );
    }

    return (
        <div className="flex h-full bg-slate-50 relative">
            {/* Demo Banner */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50"></div>

            {/* Left Navigation */}
            <div className="w-72 border-r border-slate-200 bg-white pt-6 flex flex-col h-full overflow-y-auto">
                <div className="px-6 mb-6">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Application Workspace</h3>
                    <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block">
                        Converted from Lead (Auto-Split)
                    </div>
                </div>
                <nav className="flex-1 space-y-1 px-4">
                    <div className="pb-2">
                        <div className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Facilities (Loan Terms)</div>
                        {formData.facilities.map((fac, idx) => (
                            <NavButton
                                key={fac.id}
                                id={`facility-${idx}`}
                                label={`#${idx + 1}: ${fac.programName}`}
                                active={activeSection}
                                onClick={() => scrollToSection(`facility-${idx}`)}
                                subItem
                            />
                        ))}
                    </div>
                    <NavButton id="payment" label="Payment & Amortization" active={activeSection} onClick={() => scrollToSection('payment')} />
                    <NavButton id="sources" label="Sources & Uses" active={activeSection} onClick={() => scrollToSection('sources')} />
                    <NavButton id="collateral" label="Collateral Analysis" active={activeSection} onClick={() => scrollToSection('collateral')} />
                    <NavButton id="existing" label="Existing Debt (Bus/Hhd)" active={activeSection} onClick={() => scrollToSection('existing')} />
                    <NavButton id="background" label="Business Background" active={activeSection} onClick={() => scrollToSection('background')} />
                </nav>

                {/* Facility Sums Panel (Sticky Bottom/Side) */}
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                    <div className={`rounded-lg p-4 border ${validationState.isValid ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                        <div className="text-xs font-bold uppercase mb-2 flex justify-between items-center">
                            <span className={validationState.isValid ? 'text-emerald-700' : 'text-red-700'}>Total Loan Amount</span>
                            {validationState.isValid ? <CheckCircle2 size={14} className="text-emerald-600" /> : <AlertCircle size={14} className="text-red-600" />}
                        </div>
                        <div className={`text-2xl font-bold mb-1 ${validationState.isValid ? 'text-emerald-900' : 'text-red-900'}`}>
                            ${derived.amtLoan_fALL?.toLocaleString()}
                        </div>
                        <div className={`text-xs ${validationState.isValid ? 'text-emerald-600' : 'text-red-600'}`}>
                            {validationState.message}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-200/50 space-y-2">
                            {formData.facilities.map((fac, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                    <span className="text-slate-600 truncate max-w-[120px]">{fac.programName}</span>
                                    <span className="font-mono font-medium">${Number(fac.loan_terms?.amtLoan_fX).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Editor Area */}
            <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
                <div className="max-w-5xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Application Workspace</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-100 text-purple-700">DEMO MODE</span>
                                <span className="text-sm text-slate-500">Lead Request: <strong>${LEAD_REQUESTED_AMOUNT.toLocaleString()}</strong></span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50">
                                <History size={16} /> Audit Log
                            </button>
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm">
                                <Save size={16} /> Save Changes
                            </button>
                        </div>
                    </div>

                    {/* Facilities Loop - Enhanced Headers */}
                    {formData.facilities.map((facility, idx) => (
                        <div id={`facility-${idx}`} key={facility.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ring-1 ring-slate-900/5">
                            {/* Facility Header - Demo Enhanced */}
                            <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toggleFacility(idx)}>
                                <div className="flex items-center gap-3">
                                    <button className="text-slate-400 hover:text-slate-600">
                                        {expandedFacilities[idx] !== false ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                                    </button>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-1.5 py-0.5 rounded">#{idx + 1}</span>
                                            <h3 className="font-bold text-slate-900 text-lg">{facility.programName}</h3>
                                        </div>
                                        <p className="text-xs text-slate-500 font-mono flex items-center gap-1">
                                            {facility.id} • <span className="text-slate-400">Created from Lead</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-lg font-bold text-slate-900">${Number(facility.loan_terms?.amtLoan_fX).toLocaleString()}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Facility Content */}
                            {(expandedFacilities[idx] !== false) && (
                                <div className="p-6 space-y-8">

                                    {/* 1) LOAN TERMS */}
                                    <Section title="1) Loan Terms (loan_terms_fX)">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                            <Field label="Product" value={facility.loan_terms?.loanProduct_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].loan_terms.loanProduct_fX`, v)} type="select" options={['SBA 7(a)', 'Conv. Term', 'Working Capital', 'Line of Credit']} badge="Program Default" />
                                            <Field label="Loan Amount" value={facility.loan_terms?.amtLoan_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].loan_terms.amtLoan_fX`, v)} type="currency" />
                                            <Field label="Term (Mos)" value={facility.loan_terms?.termLoan_mo_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].loan_terms.termLoan_mo_fX`, v)} type="number" badge="Program Default" />
                                            <Field label="Pay Freq" value={facility.loan_terms?.payFrequency_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].loan_terms.payFrequency_fX`, v)} type="select" options={['Monthly', 'Weekly']} />
                                        </div>
                                        <div className="mt-4 p-3 bg-slate-50 rounded border border-slate-200 flex items-center gap-2">
                                            <Calculator size={16} className="text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700">Calculated Payment (payAmt_mo_fX):</span>
                                            <span className="text-sm font-bold text-slate-900">${facility.loan_terms?.payAmt_mo_fX}</span>
                                            <span className="text-xs text-slate-400 ml-auto flex items-center gap-1"><Lock size={10} /> System Derived</span>
                                        </div>
                                    </Section>


                                    {/* 4) INTEREST & FEES (Grouped with Terms usually, but separate section in req) */}
                                    {(activeSection === 'facilities') && (
                                        <Section title="4) Interest & Fees (interest_fees_fX)" className="mt-8 border-t border-slate-100 pt-8">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                                <Field label="Interest Rate %" value={facility.interest_fees?.interestRate_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].interest_fees.interestRate_fX`, v)} type="number" step="0.125" />
                                                <Field label="Rate Type" value={facility.interest_fees?.interestRate_type_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].interest_fees.interestRate_type_fX`, v)} type="select" options={['Fixed', 'Variable']} />
                                                <Field label="Orig. Fee %" value={facility.interest_fees?.originationFee_prcntg_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].interest_fees.originationFee_prcntg_fX`, v)} type="number" step="0.01" />
                                                <Field label="Orig. Fee Amt" value={facility.interest_fees?.originationFee_amt_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].interest_fees.originationFee_amt_fX`, v)} type="currency" />
                                            </div>
                                            <div className="mt-4">
                                                <Field label="Prepayment Penalty" value={facility.interest_fees?.prepaymentPenalty_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].interest_fees.prepaymentPenalty_fX`, v)} type="text" />
                                            </div>
                                        </Section>
                                    )}

                                    {/* 2) PAYMENT TERMS */}
                                    {activeSection === 'payment' && (
                                        <Section title="2) Payment Terms (payment_terms_fX)">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <Field label="First Payment Date" value={facility.payment_terms?.firstPay_date_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].payment_terms.firstPay_date_fX`, v)} type="date" />
                                                <Field label="Maturity Date" value={facility.payment_terms?.maturity_date_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].payment_terms.maturity_date_fX`, v)} type="date" />
                                                <Field label="Grace Period (Mo)" value={facility.payment_terms?.gracePeriod_mo_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].payment_terms.gracePeriod_mo_fX`, v)} type="number" />
                                                <Field label="Amort. Type" value={facility.payment_terms?.amortizationType_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].payment_terms.amortizationType_fX`, v)} type="select" options={['Principal + Interest', 'Interest Only']} />
                                                <Field label="Amort. Method" value={facility.payment_terms?.amortizationMethod_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].payment_terms.amortizationMethod_fX`, v)} type="select" options={['Straight Line', 'Mortgage Style']} />
                                            </div>
                                        </Section>
                                    )}

                                    {/* 3) SOURCES & USES */}
                                    {activeSection === 'sources' && (
                                        <Section title="3) Sources & Uses (sourcesUsesOfFunds_fX)">

                                            {/* Summary Rows */}
                                            <div className="grid grid-cols-3 gap-6 mb-6 p-4 bg-slate-50 border border-slate-200 rounded">
                                                <Field label="Owner Injection Amt" value={facility.sourcesUsesOfFunds?.ownerFunds_amt_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].sourcesUsesOfFunds.ownerFunds_amt_fX`, v)} type="currency" />
                                                <Field label="Owner Injection Detail" value={facility.sourcesUsesOfFunds?.ownerFunds_detail_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].sourcesUsesOfFunds.ownerFunds_detail_fX`, v)} type="text" />
                                                <div className="flex flex-col justify-end">
                                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Total Project Cost</div>
                                                    <div className="text-xl font-bold text-slate-900">${facility.sourcesUsesOfFunds?.projectCost_total_fX?.toLocaleString()}</div>
                                                </div>
                                            </div>

                                            {/* Mandatory Breakdown */}
                                            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Use of Funds Breakdown (Must Reconcile)</h4>
                                            <div className="space-y-3 border-l-2 border-slate-200 pl-4">
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-4 text-sm font-medium text-slate-700">Inventory</div>
                                                    <div className="col-span-3">
                                                        <Field noLabel value={facility.sourcesUsesOfFunds?.inventory_useFunds_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].sourcesUsesOfFunds.inventory_useFunds_fX`, v)} type="currency" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-4 text-sm font-medium text-slate-700">Equipment</div>
                                                    <div className="col-span-3">
                                                        <Field noLabel value={facility.sourcesUsesOfFunds?.equipment_useFunds_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].sourcesUsesOfFunds.equipment_useFunds_fX`, v)} type="currency" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-4 text-sm font-medium text-slate-700">Working Capital</div>
                                                    <div className="col-span-3">
                                                        <Field noLabel value={facility.sourcesUsesOfFunds?.wrkCapital_useFunds_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].sourcesUsesOfFunds.wrkCapital_useFunds_fX`, v)} type="currency" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-4 text-sm font-medium text-slate-700">Refinance</div>
                                                    <div className="col-span-3">
                                                        <Field noLabel value={facility.sourcesUsesOfFunds?.refinance_useFunds_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].sourcesUsesOfFunds.refinance_useFunds_fX`, v)} type="currency" />
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-12 gap-4 items-center">
                                                    <div className="col-span-4 text-sm font-medium text-slate-700">Other</div>
                                                    <div className="col-span-3">
                                                        <Field noLabel value={facility.sourcesUsesOfFunds?.other_useFunds_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].sourcesUsesOfFunds.other_useFunds_fX`, v)} type="currency" />
                                                    </div>
                                                    <div className="col-span-5">
                                                        <Field noLabel placeholder="Detail..." value={facility.sourcesUsesOfFunds?.otherDetail_useFunds_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].sourcesUsesOfFunds.otherDetail_useFunds_fX`, v)} type="text" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Section>
                                    )}

                                    {/* 5) COLLATERAL */}
                                    {activeSection === 'collateral' && (
                                        <Section title="5) Collateral (collateral_fX)">

                                            <div className="space-y-4">
                                                {facility.collateral?.map((col, cIdx) => (
                                                    <div key={col.id} className="grid grid-cols-12 gap-4 items-end bg-slate-50 p-3 rounded border border-slate-200">
                                                        <div className="col-span-5">
                                                            <Field label="Collateral Type" value={col.type_collatX_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].collateral[${cIdx}].type_collatX_fX`, v)} type="select" options={['UCC-1 Inventory', 'UCC-1 Equipment', 'Real Estate 1st', 'Personal Guarantee']} />
                                                        </div>
                                                        <div className="col-span-4">
                                                            <Field label="Discount Net Amount" value={col.discontNetAmt_collatX_fX} onChange={(v) => handleFieldChange(`facilities[${idx}].collateral[${cIdx}].discontNetAmt_collatX_fX`, v)} type="currency" />
                                                        </div>
                                                        <div className="col-span-2">
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase mb-1">ID (Sys)</div>
                                                            <div className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-1.5 rounded">{col.ID_collatX_fX}</div>
                                                        </div>
                                                        <div className="col-span-1">
                                                            <button className="p-2 text-slate-400 hover:text-red-600 rounded"><Trash2 size={16} /></button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:bg-blue-50 px-3 py-2 rounded transition-colors">
                                                    <Plus size={16} /> Add Collateral
                                                </button>
                                            </div>

                                            <div className="mt-4 flex justify-end">
                                                <div className="text-right">
                                                    <div className="text-xs font-bold text-slate-500 uppercase">Total Facility Collateral</div>
                                                    <div className="text-lg font-bold text-slate-900">
                                                        ${(facility.collateral?.reduce((sum, c) => sum + (Number(c.discontNetAmt_collatX_fX) || 0), 0) || 0).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </Section>
                                    )}

                                </div>
                            )}
                        </div>
                    ))}

                    {/* EXISTING LOANS SECTION */}
                    {activeSection === 'existing' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <Section title="6) Existing Loans – Business (bus_apl)">
                                <div className="grid grid-cols-4 gap-6">
                                    <Field label="Amount Existing" value={formData.existingLoansBusiness?.amtExistLoans_bus_apl} onChange={(v) => handleFieldChange(`existingLoansBusiness.amtExistLoans_bus_apl`, v)} type="currency" />
                                    <Field label="Debt Service (Mo)" value={formData.existingLoansBusiness?.dServExistLoans_mo_bus_apl} onChange={(v) => handleFieldChange(`existingLoansBusiness.dServExistLoans_mo_bus_apl`, v)} type="currency" />
                                    <div className="col-span-2">
                                        <Field label="Reason / Notes" value={formData.existingLoansBusiness?.existLoans_reason_bus_apl} onChange={(v) => handleFieldChange(`existingLoansBusiness.existLoans_reason_bus_apl`, v)} type="text" />
                                    </div>
                                </div>
                            </Section>

                            <div className="my-8 border-t border-slate-100"></div>

                            <Section title="7) Existing Loans – Household (hhd_apl_contX)">
                                {formData.existingLoansHousehold?.map((contact, i) => (
                                    <div key={i} className="mb-4">
                                        <h4 className="text-sm font-bold text-slate-900 mb-2">{contact.name}</h4>
                                        <div className="grid grid-cols-4 gap-6 bg-slate-50 p-3 rounded border border-slate-200">
                                            <Field label="Amount Existing" value={contact.amtExistLoans_hhd_apl_contX} onChange={(v) => handleFieldChange(`existingLoansHousehold[${i}].amtExistLoans_hhd_apl_contX`, v)} type="currency" />
                                            <Field label="Debt Service (Mo)" value={contact.dServExistLoans_mo_hhd_apl_contX} onChange={(v) => handleFieldChange(`existingLoansHousehold[${i}].dServExistLoans_mo_hhd_apl_contX`, v)} type="currency" />
                                            <div className="col-span-2">
                                                <Field label="Reason / Notes" value={contact.existLoans_reason_hhd_apl_contX} onChange={(v) => handleFieldChange(`existingLoansHousehold[${i}].existLoans_reason_hhd_apl_contX`, v)} type="text" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Section>
                        </div>
                    )}

                    {/* BUSINESS BACKGROUND */}
                    {activeSection === 'background' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <Section title="9) Business Background">
                                <div className="grid grid-cols-4 gap-6">
                                    <Field label="FTEs Created Count" value={formData.businessBackground?.FTEs_created_count} onChange={(v) => handleFieldChange(`businessBackground.FTEs_created_count`, v)} type="number" />
                                </div>
                            </Section>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// UI Components
const NavButton = ({ id, label, active, onClick, subItem }) => (
    <button
        onClick={() => onClick(id)}
        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${active === id
            ? 'bg-blue-50 text-blue-700'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            } ${subItem ? 'pl-8' : ''}`}
    >
        {label}
    </button>
);

const Section = ({ title, children, className }) => (
    <div className={className}>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide border-b border-slate-200 pb-2 mb-4">
            {title}
        </h3>
        {children}
    </div>
);

const Field = ({ label, value, onChange, type = 'text', options = [], noLabel = false, placeholder, step, badge }) => {
    return (
        <div className="space-y-1">
            {!noLabel && (
                <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</label>
                    {badge && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            <Lock size={8} className="mr-1" /> {badge}
                        </span>
                    )}
                </div>
            )}
            {type === 'select' ? (
                <div className="relative">
                    <select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                    >
                        <option value="">Select...</option>
                        {options.map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            ) : (
                <div className="relative">
                    {type === 'currency' && (
                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    )}
                    <input
                        type={type === 'currency' ? 'number' : type}
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        step={step}
                        className={`w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${type === 'currency' ? 'pl-8' : ''}`}
                    />
                </div>
            )}
        </div>
    );
};

export default LoanApplicationDetails;
