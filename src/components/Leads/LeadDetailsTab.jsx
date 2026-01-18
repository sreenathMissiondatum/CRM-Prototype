import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
    ChevronDown, ChevronUp, MapPin, Building2,
    Briefcase, Users, User, Share2, FileCheck,
    Calendar, CreditCard, Info, Plus, Trash2,
    Lock, Check, AlertCircle, RefreshCw, BadgeCheck,
    Eye, EyeOff, Copy, ShieldCheck, Pencil, X, AlertTriangle, Search
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
import { CANONICAL_CONTACTS } from '../../data/canonicalContacts';
import { MOCK_ACCOUNTS, MOCK_CONTACTS } from '../../data/mockReferralData';
import { deriveCensusData } from '../../utils/censusUtils';

const LeadDetailsTab = ({ lead, readOnly }) => {
    // --- State: Sections Expansion ---
    const [sections, setSections] = useState({
        system: false,
        identity: true,
        contact: true,
        industry: true,
        background: false,
        intent: false,
        history: false,
        credit: false,
        referral: false,
        demographics: false,
        compliance: false
    });

    // --- State: Form Data (Complex) ---
    // Initialized lazy to simulate parsing existing 'lead' prop into new structure
    const [formData, setFormData] = useState(() => {

        // 1. Initial Contact Mapping from Canonical Data
        // In a real app, this would match on ID or Fuzzy Name/Email matching
        // Here we just pull in the canonical set relevant to this "Jenkins Catering" lead
        const initialContacts = CANONICAL_CONTACTS.map(c => ({
            ...c,
            // Map canonical fields to Lead view structure if needed, or just use as is
            // Ensure Role logic aligns
            role: c.roles.includes('Owner') ? 'Owner' : c.roles[0] || 'Partner',
            recordType: c.roles.includes('Owner') ? 'Owner' : '',
            isOwner: c.roles.includes('Owner'),
            ownerLink: c.roles.includes('Owner') ? c.id : null // Auto-link if Owner
        }));

        // 2. Derive Ownership Table from Contacts who are Owners
        const initialOwnership = initialContacts
            .filter(c => c.roles.includes('Owner'))
            .map((c, idx) => ({
                id: c.id, // Use Contact ID as Owner ID for strict linking
                firstName: c.firstName,
                lastName: c.lastName,
                percent: c.ownershipPercent || 0,
                isCommonHb: false,
                otherBusinesses: false,
                otherBusPercentage: '',
                otherBusDescription: '',
                // Personal & Professional
                dob: '',
                industryExperience: '',
                ownershipExperience: '',
                demographicSource: '',
                lmiStatus: '',
                ssn: '',
                portalAccess: false
            }));


        return {
            // S1: System
            system: {
                createdDate: '2023-11-15',
                createdBy: 'System',
                modifiedDate: '2023-12-01',
                modifiedBy: 'Sarah Smith',
                consentTimestamp: '2023-10-15 14:30:22 UTC'
            },
            // S2: Identity
            identity: {
                businessName: lead?.company || lead?.businessName || 'Jenkins Catering Services, LLC',
                dba: '',
                phone: lead?.phone || '(313) 555-0199',
                email: lead?.email || 'sarah@jenkinscatering.com',
                website: 'www.jenkinscatering.com',
                entityType: 'LLC',
                ein: '84-1734592', // Real mocked value
                taxIdLocked: true,
                // Moved from Industry
                address: '123 Industrial Blvd',
                city: 'Detroit',
                state: 'MI',
                zip: '48201',
                website: 'www.jenkinscatering.com', // Consolidated here
                // Census Data (Moved from Industry)
                censusTract: '48201223100', // Initial Mock
                isLowIncome: true
            },
            // S3: Ownership & Contacts
            ownership: initialOwnership.length > 0 ? initialOwnership : [
                {
                    id: 1,
                    firstName: 'Sarah',
                    lastName: 'Jenkins',
                    percent: 100,
                    isCommonHb: false,
                    otherBusinesses: false,
                    otherBusPercentage: '',
                    otherBusDescription: '',
                    // Personal & Professional
                    dob: '1980-05-15',
                    industryExperience: 15,
                    ownershipExperience: 10,
                    demographicSource: 'Self-reported by applicant',
                    lmiStatus: 'Not LMI',
                    ssn: '123-45-6789',
                    portalAccess: true,
                    // Household
                    incGros_hhd: 120000,
                    netWorth_hhd: 450000,
                    amtExistLoans_hhd: 0,
                    dServExistLoans_mo_hhd: 0
                }
            ],
            contacts: initialContacts,

            // S4: Industry
            industry: {
                naics: { code: '484110', title: 'General Freight Trucking, Local' },
                sector: 'Transportation and Warehousing',
                // Address moved to Identity
                // Census moved to Identity
            },
            // S5: Background
            background: {
                dateEstablished: '2020-03-15', // Renamed from establishedDate
                yearsInBusiness: 3, // Calculated
                fteCount: 12,
                isStartup: false,
                description: 'Small logistics company specializing in last-mile delivery.',
                // Impact Flags
                isMinorityOwned: false,
                isWomanOwned: true, // Example based on Sarah Jenkins
                isVeteranOwned: false,
                isNativeAmericanOwned: false,
                isLGBTQOwned: false,
                isDisabilityOwned: false,
                isLowIncomeCommunity: true
            },
            // S6: Intent
            // S6: Intent (Funding Scenarios)
            intent: {
                fundingScenarios: [
                    {
                        id: 1,
                        name: 'Preliminary Working Capital',
                        amount: lead?.amount || 75000,
                        term: 36,
                        useOfFunds: ['Working Capital'],
                        useOfFundsDetail: 'Initial capital request.',
                        ownerContribution: 10000,
                        otherFunding: 0,
                        status: 'Draft'
                    }
                ]
            },
            // S7: History (Internal)
            history: {
                priorBorrower: false,
                previousLoans: [], // New array for IDs
                performance: 'N/A'
            },
            // S8: Credit (Self-reported)
            credit: {
                creditScoreRange: '650-699', // Corrected range
                businessScore: '78',
                creditReportDate: '2023-11-10'
            },
            // S9: Referral
            referral: {
                sourceType: '', // Start empty to force selection
                partnerOrg: '', // ID
                partnerOrgName: '', // Display Name
                contact: '', // ID
                contactName: '', // Display Name
                outcome: ''
            },
            // S10: Demographics (1071) - now derived from Canonical Contact Data directly
            // We won't duplicate state here, we'll read from contacts array
        };
    });

    // --- State: Secure EIN ---
    const [isEINRevealed, setIsEINRevealed] = useState(false);
    const einTimer = React.useRef(null);
    const [toastMessage, setToastMessage] = useState(null);

    // --- State: Previous Loan IDs (New) ---
    const [newLoanId, setNewLoanId] = useState('');
    const [loanIdError, setLoanIdError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // loanId to confirm delete



    const [editing1071Contact, setEditing1071Contact] = useState(null); // Objects { id, ...data }

    const [isDirty, setIsDirty] = useState(false);

    // --- Helpers ---
    // --- Helper: Audit Logging ---
    const auditLog = (action) => {
        console.log(`[AUDIT] ${action} at ${new Date().toISOString()}`);
    };

    const toggleSection = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }));

    const handleChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
        setIsDirty(true);
    };

    // --- Effect: Derive Census Data from ZIP ---
    useEffect(() => {
        if (formData.identity.zip) {
            const derived = deriveCensusData(formData.identity.zip);
            setFormData(prev => {
                // Avoid infinite loop if values match
                if (prev.identity.censusTract === derived.censusTract) return prev;

                return {
                    ...prev,
                    identity: {
                        ...prev.identity,
                        censusTract: derived.censusTract,
                        isLowIncome: derived.isLowIncome
                    }
                };
            });
        }
    }, [formData.identity.zip]);

    // --- Ownership & Contact Logic ---

    // 1. Add Owner Row
    const addOwner = () => {
        const newOwnerId = Math.max(...formData.ownership.map(o => typeof o.id === 'number' ? o.id : 0), 0) + 1;

        // Determine if this is the first owner (to set Primary)
        const isFirstOwner = formData.ownership.length === 0;

        const newOwner = {
            id: newOwnerId,
            firstName: '',
            lastName: '',
            percent: 0,
            isCommonHb: false,
            otherBusinesses: false,
            otherBusPercentage: '',
            otherBusDescription: '',
            // Household Financials
            incGros_hhd: '',
            netWorth_hhd: '',
            amtExistLoans_hhd: '',
            dServExistLoans_mo_hhd: '',
            // Personal & Professional (Owner Only)
            dob: '',
            industryExperience: '',
            ownershipExperience: '',
            demographicSource: '',
            lmiStatus: '',
            ssn: '',
            portalAccess: false
        };

        const newContact = {
            id: `c-own-${newOwnerId}-${Date.now()}`,
            role: 'Owner',
            recordType: 'Owner',
            isOwner: true,
            ownerLink: newOwnerId,
            isPrimary: isFirstOwner, // First owner is Primary by default
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            method: 'Email'
        };

        setFormData(prev => ({
            ...prev,
            ownership: [...prev.ownership, newOwner],
            contacts: [newContact, ...prev.contacts]
        }));

        auditLog("OWNER_ADDED");
        if (isFirstOwner) {
            auditLog("PRIMARY_OWNER_CHANGED");
        }
        setIsDirty(true);
    };

    // 2. Remove Owner Row (Updated for Household Dissolution)
    const removeOwner = (id) => {
        setFormData(prev => {
            const ownerToDelete = prev.ownership.find(o => o.id === id);
            const remainingOwners = prev.ownership.filter(o => o.id !== id);

            // Delete linked contact
            let updatedContacts = prev.contacts.filter(c => c.ownerLink !== id);

            // Handle Primary Reassignment
            const wasPrimary = prev.contacts.find(c => c.ownerLink === id)?.isPrimary;
            if (wasPrimary && remainingOwners.length > 0) {
                const nextOwnerId = remainingOwners[0].id;
                updatedContacts = updatedContacts.map(c =>
                    c.ownerLink === nextOwnerId ? { ...c, isPrimary: true } : c
                );
                auditLog("PRIMARY_OWNER_CHANGED");
            }

            // --- Household Dissolution Logic ---
            let finalOwnership = remainingOwners;

            if (ownerToDelete && ownerToDelete.isCommonHb) {
                const newTotalOwners = remainingOwners.length;
                const newCheckedCount = remainingOwners.filter(o => o.isCommonHb).length;

                // Case: 0 Owners (Clear all - handled by empty array)
                // Case: 1 Owner, 1 Checked (Valid Single-Person) -> No action needed, preserves inputs.

                // Case: Multi-owner Invalid (Total >= 2 BUT Checked < 2)
                if (newTotalOwners >= 2 && newCheckedCount < 2) {
                    // Start Dissolution
                    finalOwnership = remainingOwners.map(o => ({
                        ...o,
                        isCommonHb: false
                    }));
                    auditLog("COMMON_HOUSEHOLD_DISSOLVED");
                    setToastMessage("Household dissolved due to insufficient members.");
                    setTimeout(() => setToastMessage(null), 4000);
                } else if (newTotalOwners === 1) {
                    // Revert to Implicit Single Household
                    // Clear checkbox state for cleanliness, though logic ignores it
                    finalOwnership = remainingOwners.map(o => ({ ...o, isCommonHb: false }));
                    // No Toast needed, just seamless transition
                    auditLog("HOUSEHOLD_REVERTED_TO_IMPLICIT");
                }
            }

            return {
                ...prev,
                ownership: finalOwnership,
                contacts: updatedContacts
            };
        });

        auditLog("OWNER_REMOVED");
        setIsDirty(true);
    };

    // 3. Update Owner Field
    const updateOwner = (id, field, value) => {
        setFormData(prev => {
            let updatedOwnership = prev.ownership.map(o => {
                if (o.id !== id) return o;

                // Logic: Trigger for Other Businesses
                if (field === 'otherBusinesses') {
                    if (value === false) {
                        return { ...o, [field]: value, otherBusPercentage: '', otherBusDescription: '' };
                    }
                }

                // Logic: Common Household Toggle
                if (field === 'isCommonHb') {
                    // Checkbox should be functionally ignored if totalOwners == 1 (though UI should hide it)
                    if (prev.ownership.length === 1) return o;

                    // Logging
                    if (value === true) auditLog("COMMON_HOUSEHOLD_SELECTED");
                    else auditLog("COMMON_HOUSEHOLD_DESELECTED");
                }

                return { ...o, [field]: value };
            });

            // Sync with linked contacts if Name changes
            let updatedContacts = prev.contacts;
            if (field === 'firstName' || field === 'lastName') {
                updatedContacts = prev.contacts.map(c => {
                    if (c.ownerLink === id) {
                        return { ...c, [field]: value };
                    }
                    return c;
                });
                // Log only if it's a meaningful name change? Or just implicitly part of owner update
            }

            return { ...prev, ownership: updatedOwnership, contacts: updatedContacts };
        });
        setIsDirty(true);
        // We log explicit OWNER_UPDATED actions elsewhere or debounce them, 
        // but for granular field updates usually we don't log every keystroke.
        // Assuming 'Save' will be the main commit, but prompt asks for logs on actions.
        // For input fields, usually onBlur or atomic updates trigger logs.
        // Leaving explicit per-keystroke logging out to avoid spam, unless requested.
    };

    // 4. Update Contact
    const updateContact = (id, field, value) => {
        setFormData(prev => {
            let updatedContacts = prev.contacts.map(c => {
                if (c.id !== id) return c; // Unchanged contacts

                // Logic: Allow Title/Role edit without breaking ownership
                // Legacy strict `role` check removed to support free text Titles (e.g. "Owner & CEO")


                return { ...c, [field]: value };
            });

            // Logic: Sync BACK to Owner if Name changes
            let updatedOwnership = prev.ownership;
            if (field === 'firstName' || field === 'lastName') {
                const contact = prev.contacts.find(c => c.id === id);
                if (contact && contact.ownerLink) {
                    updatedOwnership = prev.ownership.map(o => {
                        if (o.id === contact.ownerLink) {
                            return { ...o, [field]: value };
                        }
                        return o;
                    });
                }
            }

            // Logic: Primary Toggle (Only 1 primary)
            if (field === 'isPrimary' && value === true) {
                updatedContacts = updatedContacts.map(c => ({
                    ...c,
                    isPrimary: c.id === id // Only this one is primary
                }));
                auditLog("PRIMARY_OWNER_CHANGED");
            }

            return { ...prev, contacts: updatedContacts, ownership: updatedOwnership };
        });
        setIsDirty(true);
    };

    // 5. Link Contact to Owner
    const linkContactToOwner = (contactId, ownerId) => {
        const owner = formData.ownership.find(o => o.id === (typeof ownerId === 'string' ? ownerId : parseInt(ownerId)));
        if (!owner) return;

        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.map(c => {
                if (c.id !== contactId) return c;
                return {
                    ...c,
                    ownerLink: owner.id,
                    firstName: owner.firstName,
                    lastName: owner.lastName
                };
            })
        }));
        setIsDirty(true);
    };

    // 6. Add Contact
    const addContact = () => {
        const newId = `c${Date.now()}`;
        setFormData(prev => ({
            ...prev,
            contacts: [...prev.contacts, { id: newId, role: 'Partner', recordType: '', isPrimary: false, firstName: '', lastName: '', email: '', phone: '', method: 'Email' }]
        }));
        setIsDirty(true);
    };

    // 7. Remove Contact
    const removeContact = (id) => {
        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.filter(c => c.id !== id)
        }));
        auditLog("CONTACT_REMOVED");
        setIsDirty(true);
    };


    // --- Secure EIN Logic ---

    const handleRevealEIN = () => {
        // Mock permission check
        const hasPermission = true;
        if (!hasPermission) return;

        setIsEINRevealed(true);
        auditLog("EIN_REVEALED");

        // Start Auto-Hide Timer (30s)
        if (einTimer.current) clearTimeout(einTimer.current);
        einTimer.current = setTimeout(() => {
            handleHideEIN(true); // Auto-hide
        }, 30000);
    };

    const handleHideEIN = (isAuto = false) => {
        setIsEINRevealed(false);
        if (einTimer.current) clearTimeout(einTimer.current);
        auditLog(isAuto ? "EIN_HIDDEN_AUTO" : "EIN_HIDDEN");
    };

    const handleCopyEIN = () => {
        if (!isEINRevealed) return;

        navigator.clipboard.writeText(formData.identity.ein);
        auditLog("EIN_COPIED");

        // Show Toast
        setToastMessage("EIN copied. This action has been logged.");
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Clean up timer on unmount
    useEffect(() => {
        return () => {
            if (einTimer.current) clearTimeout(einTimer.current);
        };
    }, []);

    // --- CFPB 1071 Edit Logic ---
    const open1071Edit = (contact) => {
        // Mock permission check
        const hasPermission = true;
        if (!hasPermission) return;

        auditLog(`CFPB_1071_EDIT_OPENED for Contact ${contact.id}`);
        // Clone data to avoid direct mutation during edit
        setEditing1071Contact({
            ...contact,
            demographics: {
                race: contact.demographics?.race || [],
                ethnicity: contact.demographics?.ethnicity || [],
                sex: contact.demographics?.sex || '',
                veteran: contact.demographics?.veteran || ''
            }
        });
    };

    const cancel1071Edit = () => {
        setEditing1071Contact(null);
    };

    const save1071Edit = () => {
        if (!editing1071Contact) return;

        setFormData(prev => ({
            ...prev,
            contacts: prev.contacts.map(c =>
                c.id === editing1071Contact.id ? editing1071Contact : c
            )
        }));

        auditLog(`CFPB_1071_UPDATED for Contact ${editing1071Contact.id}`);
        setEditing1071Contact(null);
        setIsDirty(true);
    };

    const update1071Field = (field, value) => {
        setEditing1071Contact(prev => ({
            ...prev,
            demographics: {
                ...prev.demographics,
                [field]: value
            }
        }));
    };


    // --- Helper: Previous Loans ---
    const handlePriorBorrowerChange = (isChecked) => {
        setFormData(prev => ({
            ...prev,
            history: {
                ...prev.history,
                priorBorrower: isChecked,
                // RESET STATE ON UNCHECK
                previousLoans: isChecked ? prev.history.previousLoans : [],
            }
        }));
        if (!isChecked) {
            setNewLoanId('');
            setLoanIdError(null);
            setDeleteConfirm(null);
        }
    };

    const addPreviousLoan = () => {
        const trimmedId = newLoanId.trim();
        if (!trimmedId) return;

        // 1. Validation: Format (Alphanumeric + Hyphen)
        const isValidFormat = /^[a-zA-Z0-9-]+$/.test(trimmedId);
        if (!isValidFormat) {
            setLoanIdError("Enter a valid Loan ID.");
            return;
        }

        // 2. Validation: Duplicate
        const isDuplicate = formData.history.previousLoans?.some(l => l.id.toUpperCase() === trimmedId.toUpperCase());
        if (isDuplicate) {
            setLoanIdError("This loan ID has already been added.");
            return;
        }

        // 3. Add & Clear
        setFormData(prev => ({
            ...prev,
            history: {
                ...prev.history,
                previousLoans: [
                    ...(prev.history.previousLoans || []),
                    { id: trimmedId, status: 'Closed', date: '2023-01-01', loanPerformance: '' } // Mock details
                ].sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by most recent
            }
        }));
        setNewLoanId('');
        setLoanIdError(null);

        // 4. Audit Log (Strict JSON)
        console.log(JSON.stringify({
            action: "PRIOR_LOAN_ADDED",
            entity: "Lead",
            // field: "previousLoanIds", // Removed strict field logging in favor of action-based
            loanId: trimmedId,
            leadId: lead?.id || 'LEAD-7782',
            userId: 'USER-CURRENT-ID', // Mock
            timestamp: new Date().toISOString()
        }));
    };

    const deleteLoan = (loanId) => {
        if (deleteConfirm === loanId) {
            // Confirm Delete
            setFormData(prev => ({
                ...prev,
                history: {
                    ...prev.history,
                    previousLoans: prev.history.previousLoans.filter(l => l.id !== loanId)
                }
            }));

            // Audit Log (Strict JSON)
            console.log(JSON.stringify({
                action: "PRIOR_LOAN_REMOVED",
                entity: "Lead",
                loanId: loanId,
                leadId: lead?.id || 'LEAD-7782',
                userId: 'USER-CURRENT-ID', // Mock
                timestamp: new Date().toISOString()
            }));

            setDeleteConfirm(null);
        } else {
            // Request Confirmation
            setDeleteConfirm(loanId);
        }
    };

    const updateLoanPerformance = (loanId, value) => {
        setFormData(prev => ({
            ...prev,
            history: {
                ...prev.history,
                previousLoans: prev.history.previousLoans.map(l =>
                    l.id === loanId ? { ...l, loanPerformance: value } : l
                )
            }
        }));

        // Audit Log (Strict JSON)
        console.log(JSON.stringify({
            action: "PRIOR_LOAN_PERFORMANCE_SELECTED",
            entity: "Lead",
            loanId: loanId,
            value: value,
            leadId: lead?.id || 'LEAD-7782',
            userId: 'USER-CURRENT-ID', // Mock
            timestamp: new Date().toISOString()
        }));

        setIsDirty(true);
    };

    const viewPreviousLoan = (loanId) => {
        // Navigates to linked loan record if accessible
        setToastMessage(`Opening details for Loan ${loanId}...`);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // --- Validation (Updated for Matrix) ---
    const totalOwners = formData.ownership.length;
    const checkedOwners = formData.ownership.filter(o => o.isCommonHb);
    const checkedCount = checkedOwners.length;



    // Household Financials Completeness
    // Validation Helpers
    // Household Matrix: Always valid now (0, 1, or many in household group allowed)
    const isHouseholdMatrixValid = true;

    const areHouseholdFinancialsComplete = () => {
        return formData.ownership.every(owner => {
            // REQUIRED: All fields for ALL owners
            // Note: 0 is valid, '' is not.
            if (owner.incGros_hhd === '' || owner.incGros_hhd === undefined) return false;
            if (owner.netWorth_hhd === '' || owner.netWorth_hhd === undefined) return false;
            if (owner.amtExistLoans_hhd === '' || owner.amtExistLoans_hhd === undefined) return false;
            if (owner.dServExistLoans_mo_hhd === '' || owner.dServExistLoans_mo_hhd === undefined) return false;
            return true;
        });
    };

    // --- Dynamic Household Grouping ---
    const getHouseholdGroups = () => {
        const groups = [];

        // 1. Household Group (Aggregated)
        // Includes ANY owner with isCommonHb = true
        const householdOwners = formData.ownership.filter(o => o.isCommonHb);
        if (householdOwners.length > 0) {
            groups.push({
                id: 'household-group',
                type: 'Household',
                owners: householdOwners,
                label: householdOwners.map(o => o.firstName).join(', ')
            });
        }

        // 2. Individual Groups (Separate)
        // Includes ANY owner with isCommonHb = false
        const individualOwners = formData.ownership.filter(o => !o.isCommonHb);
        individualOwners.forEach(owner => {
            groups.push({
                id: `individual-${owner.id}`,
                type: 'Individual',
                owners: [owner],
                label: `${owner.firstName} ${owner.lastName}`
            });
        });

        return groups;
    };

    const householdGroups = getHouseholdGroups();

    const totalOwnershipPct = formData.ownership.reduce((sum, owner) => sum + (parseFloat(owner.percent) || 0), 0);
    const isTotalOwnershipValid = Math.abs(totalOwnershipPct - 100) < 0.01;

    const isOwnershipValid = () => {
        // Contact Check: Record Type required for Non-Owners
        const areContactsValid = formData.contacts.every(c => {
            if (c.isOwner) return true; // Owners implicit
            return !!c.recordType; // Non-owners must have recordType
        });
        if (!areContactsValid) return false;

        // Total Check
        if (!isTotalOwnershipValid) return false;

        // Household Checks
        if (!isHouseholdMatrixValid) return false;
        if (!areHouseholdFinancialsComplete()) return false;

        return formData.ownership.every(owner => {
            // Base Name Check
            if (!owner.firstName || !owner.lastName) return false;
            // Percent Check
            if (owner.percent === '' || isNaN(owner.percent) || owner.percent < 0 || owner.percent > 100) return false;

            // Other Business Logic
            if (owner.otherBusinesses) {
                if (!owner.otherBusPercentage || isNaN(owner.otherBusPercentage) || owner.otherBusPercentage <= 0 || owner.otherBusPercentage > 100) return false;
                if (!owner.otherBusDescription || owner.otherBusDescription.trim() === '') return false;
            }

            // --- New Personal Details Validation ---
            // DOB (Required, Not Future)
            if (!owner.dob) return false;
            if (new Date(owner.dob) > new Date()) return false;

            // Experience (Required, >= 0, <= 99)
            if (owner.industryExperience === '' || isNaN(owner.industryExperience) || owner.industryExperience < 0 || owner.industryExperience > 99) return false;
            if (owner.ownershipExperience === '' || isNaN(owner.ownershipExperience) || owner.ownershipExperience < 0 || owner.ownershipExperience > 99) return false;

            // Demographics & LMI (Required Picklists)
            if (!owner.demographicSource) return false;
            if (!owner.lmiStatus) return false;

            // SSN (Required, 9 digits)
            const ssnClean = (owner.ssn || '').replace(/\D/g, '');
            if (ssnClean.length !== 9) return false;

            return true;
        });
    };

    const isBorrowingHistoryValid = () => {
        if (!formData.history.priorBorrower) return true;

        // Rule: At least one loan if checked
        if (formData.history.previousLoans.length === 0) return false;



    };

    const isReferralValid = () => {
        // Block save if Referral Source Type is selected AND Referring_Partner_Org is empty
        if (formData.referral.sourceType && !formData.referral.partnerOrg) {
            return false;
        }
        return true;
    };

    const isValid = isOwnershipValid() && isBorrowingHistoryValid() && isReferralValid(); // Add other validations here if needed



    // --- Render ---
    return (
        <div className="max-w-5xl mx-auto pb-20 space-y-6">

            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Lead Documentation</h2>
                <div className="flex gap-3">
                    <button
                        className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${isDirty && isValid && !readOnly ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                        disabled={!isDirty || !isValid || readOnly}
                        title={readOnly ? "Lead is converted and read-only" : (!isValid ? "Please fix errors in Ownership section" : "Save Changes")}
                    >
                        {readOnly ? 'Read Only' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* S1: Identification & Timeline (System - Read Only) */}
            <IdentificationSection
                isOpen={sections.system}
                onToggle={() => toggleSection('system')}
                formData={{
                    source: lead?.source || 'Web Portal',
                    createdDate: formData.system.createdDate,
                    assignedOfficer: lead?.assignedOfficer || 'Alex Morgan'
                }}
            />

            {/* S2: Business Identity */}
            <BusinessIdentitySection
                isOpen={sections.identity}
                onToggle={() => toggleSection('identity')}
                formData={formData.identity}
                handleChange={(field, value) => handleChange('identity', field, value)}
            />

            {/* S3: Contacts & Ownership (Restored Feature Parity) */}
            <ContactsSection
                isOpen={sections.contact}
                onToggle={() => toggleSection('contact')}
                variant="detailed"
                householdGroups={householdGroups}
                ownership={formData.ownership}
                contacts={formData.contacts}
                onUpdateOwner={updateOwner}
                onUpdateContact={updateContact}
                onAddOwner={addOwner}
                onAddContact={addContact}
                onRemoveOwner={removeOwner}
                onRemoveContact={(id) => {
                    const contact = formData.contacts.find(c => c.id === id);
                    if (contact && contact.ownerLink) {
                        // Owners cannot be removed from Contact list directly (tooltip handles this),
                        // but if we did allow it, it should route to removeOwner?
                        // User story says "Cannot be deleted from Authorized Contacts".
                        // So this handler mostly handles non-owners.
                        // But for safety:
                        removeOwner(contact.ownerLink);
                    } else {
                        removeContact(id);
                    }
                }}
                readOnly={readOnly}
                onAudit={auditLog}
            />


            {/* S4: Industry & Location */}
            <IndustrySection
                isOpen={sections.industry}
                onToggle={() => toggleSection('industry')}
                formData={{
                    naicsCode: formData.industry.naics?.code || '',
                    naicsDescription: formData.industry.naics?.title || '',
                    sector: formData.industry.sector || '',
                    address: formData.industry.address?.street || '',
                    city: formData.industry.address?.city || '',
                    state: formData.industry.address?.state || '',
                    zip: formData.industry.address?.zip || ''
                }}
                handleChange={(field, value) => {
                    // Map flat updates back to nested state
                    if (field === 'naicsCode') {
                        handleChange('industry', 'naics', { ...formData.industry.naics, code: value });
                    } else if (field === 'naicsDescription') {
                        handleChange('industry', 'naics', { ...formData.industry.naics, title: value });
                    } else if (field === 'sector') {
                        handleChange('industry', 'sector', value);
                    } else {
                        // Address fields
                        const addressFieldMap = {
                            'address': 'street',
                            'city': 'city',
                            'state': 'state',
                            'zip': 'zip'
                        };
                        const nestedField = addressFieldMap[field];
                        if (nestedField) {
                            handleChange('industry', 'address', { ...formData.industry.address, [nestedField]: value });
                        }
                    }
                }}
            />

            {/* S5: Business Background & Impact */}
            <BackgroundSection
                isOpen={sections.background}
                onToggle={() => toggleSection('background')}
                formData={formData.background}
                handleChange={(field, value) => handleChange('background', field, value)}
            />

            {/* S6: Loan Intent (Funding Scenarios) */}
            <LoanIntentSection
                isOpen={sections.intent}
                onToggle={() => toggleSection('intent')}
                formData={formData.intent}
                onUpdateScenarios={(scenarios) => handleChange('intent', 'fundingScenarios', scenarios)}
            />

            {/* S7: Borrowing History */}
            <HistorySection
                isOpen={sections.history}
                onToggle={() => toggleSection('history')}
                formData={formData}
                handleChange={(field, value) => handleChange('history', field, value)}
                // Borrowing History Specific Props
                onPriorBorrowerChange={handlePriorBorrowerChange}
                onAddLoan={addPreviousLoan}
                onDeleteLoan={deleteLoan}
                onViewLoan={viewPreviousLoan}
                newLoanId={newLoanId}
                setNewLoanId={setNewLoanId}
                loanIdError={loanIdError}
                deleteConfirm={deleteConfirm}
            />

            {/* S8: Credit Signals */}
            <CreditSection
                isOpen={sections.credit}
                onToggle={() => toggleSection('credit')}
                formData={formData.credit}
                handleChange={(field, value) => handleChange('credit', field, value)}
            />

            {/* S9: Referral */}
            <ReferralSection
                isOpen={sections.referral}
                onToggle={() => toggleSection('referral')}
                formData={formData}
                handleChange={(field, value) => handleChange('referral', field, value)}
            />

            {/* S10: 1071 Demographics */}
            <DemographicsSection
                isOpen={sections.demographics}
                onToggle={() => toggleSection('demographics')}
            />

            {/* S11: Compliance */}
            <ConsentSection
                isOpen={sections.compliance}
                onToggle={() => toggleSection('compliance')}
                formData={formData}
                handleChange={(field, value) => handleChange('system', field, value)}
            />

        </div>
    );
};

export default LeadDetailsTab;
