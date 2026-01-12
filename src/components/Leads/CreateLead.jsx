import React, { useState, useEffect } from 'react';
import {
    ChevronDown, ChevronUp, MapPin, Building2,
    Briefcase, Users, User, Share2, FileCheck,
    Calendar, CreditCard, Info, Plus, Trash2,
    Lock, Check, AlertCircle, RefreshCw, BadgeCheck,
    Eye, EyeOff, Copy, ShieldCheck, Pencil, X, AlertTriangle, Search,
    Save, ArrowLeft
} from 'lucide-react';

import SystemField from '../Shared/SystemField';

import IdentificationSection from './Sections/IdentificationSection';
import BusinessIdentitySection from './Sections/BusinessIdentitySection';
import ContactsSection from './Sections/ContactsSection';
import IndustrySection from './Sections/IndustrySection';
import BackgroundSection from './Sections/BackgroundSection';
import LoanIntentSection from './Sections/LoanIntentSection';
import HistorySection from './Sections/HistorySection';
import CreditSection from './Sections/CreditSection';
import ReferralSection from './Sections/ReferralSection';
import DemographicsSection from './Sections/DemographicsSection';
import ConsentSection from './Sections/ConsentSection';

import { MOCK_ACCOUNTS, MOCK_CONTACTS } from '../../data/mockReferralData';
import { CANONICAL_CONTACTS } from '../../data/canonicalContacts'; // For 1071 defaults/structure if needed

const CreateLead = ({ onNavigate, onSetSelectedLead }) => {
    const [isDirty, setIsDirty] = useState(false);

    // --- Sections State ---
    const [sections, setSections] = useState({
        identification: true, // Auto-open first few
        identity: true,
        contact: false,
        industry: false,
        background: false,
        intent: false,
        history: false,
        credit: false,
        referral: false,
        demographics: false,
        compliance: false
    });

    const toggleSection = (section) => {
        setSections(prev => ({ ...prev, [section]: !prev[section] }));
    };



    // --- Form Data State (Exact Mirror of LeadDetailsTab) ---
    const [formData, setFormData] = useState({
        // S1: Identification
        id: 'LEAD-NEW', // Placeholder
        createdDate: new Date().toISOString().split('T')[0],
        source: 'Web Portal', // Default
        assignedOfficer: 'CurrentUser', // Default to current user

        // S2: Identity
        businessName: '',
        dbaName: '',
        entityType: 'LLC', // Default
        ein: '',
        phone: '',
        email: '',

        // S3: Contacts & Ownership
        contacts: [
            // Start with one empty owner row
            { id: 1, firstName: '', lastName: '', title: 'Owner', ownership: '', isHousehold: false, otherBusiness: false, annualIncome: '', netWorth: '', existingLoans: '', monthlyDebt: '', ...CANONICAL_CONTACTS[0].demographics }
        ],

        // S4: Industry & Location
        naicsCode: '',
        naicsDescription: '',
        sector: '', // Derived
        address: '',
        city: '',
        state: 'MI', // Default
        zip: '',
        censusTract: '', // Derived
        isLowIncome: false, // Derived

        // S5: Background
        dateEstablished: '',
        yearsInBusiness: 0, // Derived
        isStartup: true, // Derived < 2 years
        fteCount: '',
        description: '',

        // S6: Loan Intent
        loanAmount: '',
        loanTerm: '',
        useOfFunds: [],
        useOfFundsDetail: '',
        ownerContribution: '',
        otherFunding: '',
        // totalProjectCost derived

        // S7: Borrowing History
        history: {
            hasPriorLoans: false,
            previousLoans: []
        },

        // S8: Credit Signals
        creditScoreRange: '',
        businessScore: '',
        creditReportDate: '',

        // S9: Referral
        referral: {
            sourceType: '',
            partnerOrg: '',
            partnerOrgName: '',
            contact: '',
            contactName: '',
            outcome: ''
        },

        // S11: Compliance
        consentCaptured: false,
        consentDate: '',
        consentMethod: ''
    });

    // --- Logic & Effects ---

    // Derived: Total Project Cost
    const totalProjectCost = (Number(formData.loanAmount) || 0) + (Number(formData.ownerContribution) || 0) + (Number(formData.otherFunding) || 0);

    // Derived: Years in Business & Startup
    useEffect(() => {
        if (formData.dateEstablished) {
            const start = new Date(formData.dateEstablished);
            const now = new Date();
            const years = now.getFullYear() - start.getFullYear();
            setFormData(prev => ({
                ...prev,
                yearsInBusiness: years,
                isStartup: years < 2
            }));
        }
    }, [formData.dateEstablished]);

    // Handle Change Helper
    const handleChange = (section, field, value) => {
        setIsDirty(true);
        if (section) {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    // Contacts & Ownership Helpers
    const updateContact = (id, field, value) => {
        setIsDirty(true);
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.map(c => c.id === id ? { ...c, [field]: value } : c)
        }));
    };

    const addContact = () => {
        const newId = Math.max(...formData.contacts.map(c => c.id)) + 1;
        setFormData(prev => ({
            ...prev,
            contacts: [...prev.contacts, { id: newId, firstName: '', lastName: '', title: '', ownership: '', isHousehold: false, ...CANONICAL_CONTACTS[0].demographics }]
        }));
    };

    const removeContact = (id) => {
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.filter(c => c.id !== id)
        }));
    };

    // Save Action
    const handleSave = () => {
        // Validation logic would go here

        // Simulate Save
        console.log("Saving Lead:", formData);

        // Simulate creating ID
        const newLeadId = 'LEAD-7782';

        // Update selection and navigate
        if (onSetSelectedLead) onSetSelectedLead(newLeadId);
        if (onNavigate) onNavigate('leads-all'); // or 'leads-my'
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 pb-24">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => onNavigate && onNavigate('leads-all')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Create New Lead</h1>
                        <p className="text-slate-500">New Intake Form</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
                        Save Draft
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
                    >
                        <Save size={18} />
                        Create Lead
                    </button>
                </div>
            </div>

            {/* S1: Identification */}
            <IdentificationSection
                isOpen={sections.identification}
                onToggle={() => toggleSection('identification')}
                formData={formData}
            />

            {/* S2: Business Identity (Shared) */}
            <BusinessIdentitySection
                isOpen={sections.identity}
                onToggle={() => toggleSection('identity')}
                formData={formData}
                handleChange={(field, value) => handleChange(null, field, value)}
            />

            {/* S3: Contacts & Ownership */}
            <ContactsSection
                isOpen={sections.contact}
                onToggle={() => toggleSection('contact')}
                contacts={formData.contacts}
                onUpdateContact={updateContact}
                onAddContact={addContact}
                onRemoveContact={removeContact}
            />

            {/* S4: Industry & Location */}
            <IndustrySection
                isOpen={sections.industry}
                onToggle={() => toggleSection('industry')}
                formData={formData}
                handleChange={(field, value) => handleChange(null, field, value)}
            />

            {/* S5: Business Background */}
            <BackgroundSection
                isOpen={sections.background}
                onToggle={() => toggleSection('background')}
                formData={formData}
                handleChange={(field, value) => handleChange(null, field, value)}
            />

            {/* S6: Loan Intent */}
            <LoanIntentSection
                isOpen={sections.intent}
                onToggle={() => toggleSection('intent')}
                formData={formData}
                handleChange={(field, value) => handleChange(null, field, value)}
                totalProjectCost={totalProjectCost}
            />

            {/* S7: Borrowing History */}
            <HistorySection
                isOpen={sections.history}
                onToggle={() => toggleSection('history')}
                formData={formData}
                handleChange={(field, value) => handleChange('history', field, value)}
            />

            {/* S8: Credit Signals */}
            <CreditSection
                isOpen={sections.credit}
                onToggle={() => toggleSection('credit')}
                formData={formData}
                handleChange={(field, value) => handleChange(null, field, value)}
            />

            {/* S9: Referral (Parity with LeadDetailsTab) */}
            <ReferralSection
                isOpen={sections.referral}
                onToggle={() => toggleSection('referral')}
                formData={formData}
                handleChange={(field, value) => handleChange('referral', field, value)}
            />

            {/* S10: 1071 Compliance Summary */}
            <DemographicsSection
                isOpen={sections.demographics}
                onToggle={() => toggleSection('demographics')}
            />

            {/* S11: Compliance */}
            <ConsentSection
                isOpen={sections.compliance}
                onToggle={() => toggleSection('compliance')}
                formData={formData}
                handleChange={(field, value) => handleChange(null, field, value)}
            />
        </div>
    );
};

export default CreateLead;
