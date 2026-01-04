export const MOCK_PERMISSION_SETS = [
    {
        id: 1,
        name: 'Marketing Manager',
        description: 'Access to marketing campaigns and email templates.',
        users: 2,
        lastModified: '2023-11-15',
        applicableRoles: ['r2', 'r3'],
        status: 'Active',
        capabilities: null // In MVP we might load this lazily or store it here
    },
    {
        id: 2,
        name: 'Compliance Auditor',
        description: 'Read-only access to all loan files for audit purposes.',
        users: 1,
        lastModified: '2023-12-01',
        applicableRoles: ['r1', 'r2', 'r3'],
        status: 'Active',
        capabilities: null
    },
    {
        id: 3,
        name: 'Branch Manager Override',
        description: 'Ability to override rate locks for specific branch managers.',
        users: 5,
        lastModified: '2023-10-20',
        applicableRoles: ['r2'],
        status: 'Active',
        capabilities: null
    },
];

export const MOCK_USERS_SHORT = [
    { id: 1, name: 'Alex Morgan', role: 'System Administrator' },
    { id: 2, name: 'Sarah Connor', role: 'Branch Manager' },
    { id: 3, name: 'James Wright', role: 'Loan Officer' },
    { id: 4, name: 'Emily Chen', role: 'Loan Officer' },
    { id: 5, name: 'Michael Ross', role: 'Branch Manager' },
    { id: 6, name: 'David Miller', role: 'Loan Officer' },
    { id: 7, name: 'Elena Fisher', role: 'System Administrator' },
];

export const MOCK_ASSIGNMENTS = {
    1: [2, 5], // Marketing Manager: Sarah, Michael
    2: [7],    // Compliance Auditor: Elena
    3: [2, 5, 3, 4, 6] // Override: Many users
};
