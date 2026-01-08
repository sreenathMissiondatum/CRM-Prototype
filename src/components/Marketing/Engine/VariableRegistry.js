/**
 * Variable Registry - Single Source of Truth for Allowed Placeholders
 * 
 * Defines the strict whitelist of fields that can be accessed in email templates.
 * Attempts to access fields not in this registry will fail validation.
 */

export const VARIABLE_REGISTRY = {
    Lead: {
        description: 'The primary recipient of the email',
        fields: [
            'FirstName',
            'LastName',
            'Email',
            'Phone',
            'Company',
            'Source',
            'Stage',
            'Status',
            'CreatedDate',
            'Value'
        ],
        relationships: {
            Business: {
                description: 'Business entity associated with the Lead',
                fields: [
                    'LegalName',
                    'DBA',
                    'TaxID', // Masked by default in renderer
                    'FormationDate',
                    'EntityType',
                    'NaicsCode',
                    'AnnualRevenue'
                ]
            },
            PrimaryContact: {
                description: 'Primary contact person details',
                fields: [
                    'FirstName',
                    'LastName',
                    'Title',
                    'Email',
                    'Phone'
                ]
            }
        }
    },
    Campaign: {
        description: 'The marketing campaign context',
        fields: [
            'Name',
            'StartDate',
            'EndDate',
            'Type',
			'SecureToken'
        ]
    },
    Org: {
        description: 'Your organization details',
        fields: [
            'DisplayName',
            'SupportEmail',
            'SupportPhone',
            'Website',
            'Address'
        ]
    },
    Sender: {
        description: 'The user sending the email',
        fields: [
            'FirstName',
            'LastName',
            'Email',
            'JobTitle'
        ]
    }
};

/**
 * Flattens the registry into a list of all valid paths (e.g., "Lead.FirstName", "Lead.Business.LegalName")
 */
export const getValidPaths = () => {
    const paths = [];

    const traverse = (obj, prefix = '') => {
        // Add Fields
        if (obj.fields) {
            obj.fields.forEach(field => {
                paths.push(prefix ? `${prefix}.${field}` : field);
            });
        }

        // Traverse Relationships
        if (obj.relationships) {
            Object.entries(obj.relationships).forEach(([relName, relConfig]) => {
                traverse(relConfig, prefix ? `${prefix}.${relName}` : relName);
            });
        }
    };

    Object.entries(VARIABLE_REGISTRY).forEach(([rootKey, config]) => {
        traverse(config, rootKey);
    });

    return paths;
};

// Cached valid paths for fast lookup
export const VALID_PATHS = getValidPaths();

// Helper to check if a path is valid
export const isPathValid = (path) => VALID_PATHS.includes(path);
