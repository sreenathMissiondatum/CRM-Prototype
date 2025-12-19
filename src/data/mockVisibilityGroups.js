import { Building, Globe, Users, DollarSign, Layout, UserSquare } from 'lucide-react';

export const VISIBILITY_SCOPES = [
    { id: 'own', label: 'Own Records', description: 'Records owned by the current user.', iconName: 'Users' },
    { id: 'branch', label: 'Branch Records', description: 'Records where Record.Branch = User.Branch.', iconName: 'Building' },
    { id: 'dept', label: 'Department Records', description: 'Records where Record.Department = User.Department.', iconName: 'Briefcase' },
    { id: 'org', label: 'Organization Records', description: 'All records in the organization.', iconName: 'Globe', warning: 'Broad access' },
];

export const MOCK_VISIBILITY_GROUPS = [
    {
        id: 'vg_1',
        name: 'Branch Standard Access',
        description: 'See all records in assigned branch for standard objects.',
        permissions: {
            leads: ['branch', 'own'],
            loans: ['branch', 'own'],
            accounts: ['branch', 'own'],
            opportunities: ['branch', 'own']
        },
        rolesCount: 3,
        lastModified: '2023-11-20'
    },
    {
        id: 'vg_2',
        name: 'Loan Officer (Restricted)',
        description: 'Own records only for sensitive data, but Branch visibility for generic accounts.',
        permissions: {
            leads: ['own'],
            loans: ['own'],
            accounts: ['branch', 'own'],
            opportunities: ['own']
        },
        rolesCount: 5,
        lastModified: '2023-12-05'
    },
    {
        id: 'vg_3',
        name: 'Compliance Audit',
        description: 'Organization-wide read access for Loan files.',
        permissions: {
            loans: ['org']
        },
        rolesCount: 1,
        lastModified: '2023-10-15'
    }
];

export const VISIBILITY_OBJECTS = [
    { id: 'leads', label: 'Leads', iconName: 'UserSquare' },
    { id: 'loans', label: 'Loans', iconName: 'DollarSign' },
    { id: 'accounts', label: 'Accounts', iconName: 'Building' },
    { id: 'opportunities', label: 'Opportunities', iconName: 'Layout' },
];
