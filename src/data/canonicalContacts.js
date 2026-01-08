export const CANONICAL_CONTACTS = [
    {
        id: 'CT-101',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        title: 'Owner & CEO',
        email: 'sarah@jenkinscatering.com',
        phone: '(313) 555-0199',
        roles: ['Authorized Signer', 'Guarantor', 'Primary Contact', 'Owner'],
        preferredMethod: 'Email',
        isActive: true,
        linkedLoans: 3,
        lastActive: '2024-03-10',
        // Address
        address: {
            street: '123 Culinary Ave',
            city: 'Detroit',
            state: 'MI',
            zip: '48201'
        },
        // Ownership Logic
        ownershipPercent: 100,
        isPrimary: true,
        // 1071 Demographics (Canonical Store)
        demographics: {
            race: ['Black or African American'],
            ethnicity: ['Not Hispanic or Latino'],
            gender: 'Female',
            veteran: 'Non-Veteran',
            ownershipFlags: ['Minority Owned', 'Woman Owned']
        }
    },
    {
        id: 'CT-102',
        firstName: 'Michael',
        lastName: 'Ross',
        title: 'CFO',
        email: 'mike.ross@jenkinscatering.com',
        phone: '(313) 555-0200',
        roles: ['Authorized Signer', 'Billing Contact'],
        preferredMethod: 'Phone',
        isActive: true,
        linkedLoans: 2,
        lastActive: '2024-03-05',
        address: {
            street: '4500 Cass Ave',
            city: 'Detroit',
            state: 'MI',
            zip: '48201'
        },
        ownershipPercent: 0,
        isPrimary: false,
        demographics: {
            race: [],
            ethnicity: [], // Not collected for non-owners usually, but schema supports it
            gender: 'Male',
            veteran: 'Non-Veteran',
            ownershipFlags: []
        }
    },
    {
        id: 'CT-103',
        firstName: 'Jessica',
        lastName: 'Pearson',
        title: 'Legal Counsel',
        email: 'jpearnson@pearsonhardman.com',
        phone: '(212) 555-9000',
        roles: ['Legal Rep'],
        preferredMethod: 'Email',
        isActive: true,
        linkedLoans: 0,
        lastActive: '2023-11-20',
        address: {
            street: '888 Broadway',
            city: 'New York',
            state: 'NY',
            zip: '10010'
        },
        ownershipPercent: 0,
        isPrimary: false,
        demographics: {}
    },
    {
        id: 'CT-104',
        firstName: 'David',
        lastName: 'Miller',
        title: 'Operations Manager',
        email: 'dave@jenkinscatering.com',
        phone: '(313) 555-0155',
        roles: ['Site Contact'],
        preferredMethod: 'Phone',
        isActive: false,
        linkedLoans: 0,
        lastActive: '2023-01-15',
        address: {
            street: '123 Culinary Ave',
            city: 'Detroit',
            state: 'MI',
            zip: '48201'
        },
        ownershipPercent: 0,
        isPrimary: false,
        demographics: {}
    }
];
