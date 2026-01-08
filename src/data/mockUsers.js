export const MOCK_USERS = [
    {
        id: 'u1',
        name: 'Alex Morgan',
        role: 'Loan Officer',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150',
        email: 'alex.morgan@acmelending.com'
    },
    {
        id: 'u2',
        name: 'Sarah Miller',
        role: 'Loan Officer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150',
        email: 'sarah.miller@acmelending.com'
    },
    {
        id: 'u3',
        name: 'Mike Ross',
        role: 'Underwriter',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150',
        email: 'mike.ross@acmelending.com'
    },
    {
        id: 'u4',
        name: 'Elena Fisher',
        role: 'Senior Loan Officer',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150',
        email: 'elena.fisher@acmelending.com'
    },
    {
        id: 'u5',
        name: 'System',
        role: 'Automated System',
        avatar: null,
        email: 'system@acmelending.com'
    },
    {
        id: 'u6',
        name: 'Unassigned',
        role: '',
        avatar: null,
        email: ''
    }
];

export const getAssignedUser = (nameOrId) => {
    if (!nameOrId || nameOrId === 'Unassigned') return MOCK_USERS.find(u => u.name === 'Unassigned');

    // Try finding by ID first, then Name
    const user = MOCK_USERS.find(u => u.id === nameOrId) || MOCK_USERS.find(u => u.name === nameOrId);

    // Partial name match fallback (e.g. "Sarah M" -> "Sarah Miller")
    if (!user) {
        return MOCK_USERS.find(u => u.name.startsWith(nameOrId.split(' ')[0])) || {
            id: 'temp',
            name: nameOrId,
            role: 'Unknown Role',
            avatar: null
        };
    }

    return user;
};
