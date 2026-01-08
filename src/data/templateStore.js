/**
 * Simple in-memory store for Templates with localStorage persistence.
 */

const initialTemplates = [
    {
        id: 'TMP-001',
        name: 'Welcome Series - Email 1',
        status: 'Approved',
        version: 'v2.1',
        lastModifiedBy: 'Alex Morgan',
        lastModifiedDate: '2 days ago',
        content: `<h1>Welcome {{Lead.FirstName}},</h1>
<p>We are excited to work with you.</p>
<p>Your business, {{Lead.Business.LegalName}}, is important to us.</p>`
    },
    {
        id: 'TMP-002',
        name: 'Loan Approval Notification',
        status: 'Approved',
        version: 'v1.4',
        lastModifiedBy: 'Sarah Miller',
        lastModifiedDate: '5 days ago',
        content: `<h1>Good News, {{Lead.FirstName}}!</h1>
<p>Your loan application for {{Lead.Business.LegalName}} has been approved.</p>`
    },
    {
        id: 'TMP-003',
        name: 'Q4 Promotion - Draft',
        status: 'Draft',
        version: 'v0.1',
        lastModifiedBy: 'Alex Morgan',
        lastModifiedDate: 'Just now',
        content: `<h1>Special Offer for {{Lead.Business.LegalName}}</h1>
<p>Get rates as low as 4.5%!</p>`
    }
];

// Helper to get from local storage or default
const loadTemplates = () => {
    try {
        const saved = localStorage.getItem('crm_templates');
        return saved ? JSON.parse(saved) : initialTemplates;
    } catch (e) {
        console.error("Failed to load templates", e);
        return initialTemplates;
    }
};

// Helper to save
const saveTemplates = (templates) => {
    try {
        localStorage.setItem('crm_templates', JSON.stringify(templates));
    } catch (e) {
        console.error("Failed to save templates", e);
    }
};

let currentTemplateId = null;

export const templateStore = {
    getAll: () => loadTemplates(),

    getById: (id) => {
        const templates = loadTemplates();
        return templates.find(t => t.id === id);
    },

    add: (template) => {
        const templates = loadTemplates();
        const newTemplate = {
            ...template,
            id: `TMP-${String(templates.length + 1).padStart(3, '0')}`,
            lastModifiedDate: 'Just now',
            version: 'v0.1'
        };
        const updatedTemplates = [newTemplate, ...templates];
        saveTemplates(updatedTemplates);
        return newTemplate;
    },

    update: (id, updates) => {
        const templates = loadTemplates();
        const updatedTemplates = templates.map(t =>
            t.id === id ? { ...t, ...updates, lastModifiedDate: 'Just now' } : t
        );
        saveTemplates(updatedTemplates);
    },

    delete: (id) => {
        const templates = loadTemplates();
        const updatedTemplates = templates.filter(t => t.id !== id);
        saveTemplates(updatedTemplates);
    },

    // Selection State Management (In-memory is fine for navigation)
    setSelectedId: (id) => {
        currentTemplateId = id;
    },

    getSelectedId: () => currentTemplateId,

    // Debug helper
    reset: () => {
        localStorage.removeItem('crm_templates');
        window.location.reload();
    }
};
