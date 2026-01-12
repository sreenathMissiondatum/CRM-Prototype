export const MOCK_ACCOUNTS = [
    { id: 'acc-1', name: 'Detroit Economic Growth Corp', type: 'Referral Source' },
    { id: 'acc-2', name: 'Chase Bank - Downtown Branch', type: 'Referral Source' },
    { id: 'acc-3', name: 'TechTown Detroit', type: 'Referral Source' },
    { id: 'acc-4', name: 'Michigan Women Forward', type: 'Referral Source' },
    { id: 'acc-5', name: 'Fifth Third Bank', type: 'Referral Source' },
    { id: 'acc-6', name: 'Wayne County Land Bank', type: 'Government Agency' }, // Not a purely "Referral Source" type for testing filter
    { id: 'acc-7', name: 'Small Business Admin (SBA)', type: 'Government Agency' },
    // Some non-referral accounts to test filtering
    { id: 'acc-8', name: 'Jenkins Catering Services, LLC', type: 'Client' },
    { id: 'acc-9', name: 'ABC Logistics LLC', type: 'Client' }
];

export const MOCK_CONTACTS = [
    { id: 'ct-1', accountId: 'acc-1', name: 'Jessica Davis', title: 'Director of Lending' }, // Renamed from Sarah Jenkins to avoid confusion with Lead Owner 
    { id: 'ct-2', accountId: 'acc-1', name: 'David Smith', title: 'Program Manager' },
    { id: 'ct-3', accountId: 'acc-2', name: 'Jennifer Wu', title: 'Branch Manager' },
    { id: 'ct-4', accountId: 'acc-2', name: 'Michael Brown', title: 'Loan Officer' },
    { id: 'ct-5', accountId: 'acc-3', name: 'Emily White', title: 'Incubator Lead' },
    { id: 'ct-6', accountId: 'acc-5', name: 'Robert Johnson', title: 'VP Commercial Lending' }
];
