
export const downloadLeadTemplate = () => {
    // 1. Define Headers (User Friendly Name)
    const headers = [
        'First Name (Required)',
        'Last Name (Required)',
        'Email (Required)',
        'Business Name',
        'Phone',
        'Job Title',
        'Lead Source',
        'City',
        'State',
        'Notes'
    ];

    // 2. Define Example Row
    const exampleRow = [
        'Jane',
        'Doe',
        'jane.doe@example.com',
        'Acme Corp',
        '555-0123',
        'CEO',
        'Referral',
        'Austin',
        'TX',
        'Interested in small business loan'
    ];

    // 3. Define Description/Instruction Row (Optional, but per requirements "Field descriptions")
    // Note: Some importers hate this, but for a "Template" it's often useful. 
    // We will stick to just the example row as "Example values". 
    // The "Headers" themselves contain the "Required" instruction.

    // Combine
    const csvContent = [
        headers.join(','),
        exampleRow.join(',')
    ].join('\n');

    // 4. Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MyFlow_Lead_Import_Template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
