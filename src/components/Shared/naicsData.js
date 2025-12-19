export const NAICS_DATA = [
    {
        code: '72',
        title: 'Accommodation & Food Services',
        description: 'Establishments providing customers with lodging and/or preparing meals, snacks, and beverages for immediate consumption.',
        children: [
            {
                code: '721',
                title: 'Accommodation',
                description: 'Establishments primarily engaged in providing lodging or short-term accommodations for travelers, vacationers, and others.',
                children: [
                    { code: '721110', title: 'Hotels (except Casino Hotels) and Motels', description: 'Establishments primarily engaged in providing short-term lodging in facilities known as hotels, motor hotels, resort hotels, and motels.' },
                    { code: '721191', title: 'Bed-and-Breakfast Inns', description: 'Establishments primarily engaged in providing short-term lodging in private homes or small buildings converted for this purpose.' }
                ]
            },
            {
                code: '722',
                title: 'Food Services & Drinking Places',
                description: 'Industries in the Food Services and Drinking Places subsector prepare meals, snacks, and beverages to customer order for immediate on-premises and off-premises consumption.',
                children: [
                    { code: '722310', title: 'Food Service Contractors', description: 'Establishments primarily engaged in providing food services at institutional, governmental, commercial, or industrial locations of others.' },
                    { code: '722320', title: 'Caterers', description: 'Establishments primarily engaged in providing single event-based food services.' },
                    { code: '722330', title: 'Mobile Food Services', description: 'Establishments primarily engaged in preparing and serving meals and snacks for immediate consumption from motorized vehicles or nonmotorized carts.' },
                    { code: '722511', title: 'Full-Service Restaurants', description: 'Establishments primarily engaged in providing food services to patrons who order and are served while seated (i.e., waiter/waitress service) and pay after eating.' },
                    { code: '722513', title: 'Limited-Service Restaurants', description: 'Establishments primarily engaged in providing food services (except snack and nonalcoholic beverage bars) where patrons generally order or select items and pay before eating.' }
                ]
            }
        ]
    },
    {
        code: '23',
        title: 'Construction',
        description: 'Establishments primarily engaged in the construction of buildings or engineering projects.',
        children: [
            {
                code: '236',
                title: 'Construction of Buildings',
                description: 'Establishments primarily engaged in the construction of buildings.',
                children: [
                    { code: '236115', title: 'New Single-Family Housing Construction (except For-Sale Builders)', description: 'General contractors responsible for the entire construction of new single-family housing.' },
                    { code: '236116', title: 'New Multifamily Housing Construction (except For-Sale Builders)', description: 'General contractors responsible for the entire construction of new multifamily housing.' },
                    { code: '236220', title: 'Commercial and Institutional Building Construction', description: 'Establishments primarily responsible for the construction of commercial and institutional buildings.' }
                ]
            },
            {
                code: '238',
                title: 'Specialty Trade Contractors',
                description: 'Establishments whose primary activity is performing specific activities involved in building construction or other activities that are similar for all types of construction.',
                children: [
                    { code: '238110', title: 'Poured Concrete Foundation and Structure Contractors', description: 'Pouring and finishing concrete foundations and structural elements.' },
                    { code: '238210', title: 'Electrical Contractors and Other Wiring Installation Contractors', description: 'Installing and servicing electrical wiring and equipment.' },
                    { code: '238220', title: 'Plumbing, Heating, and Air-Conditioning Contractors', description: 'Installing and servicing plumbing, heating, and air-conditioning equipment.' }
                ]
            }
        ]
    },
    {
        code: '44-45',
        title: 'Retail Trade',
        description: 'Establishments engaged in retailing merchandise, generally without transformation, and rendering services incidental to the sale of merchandise.',
        children: [
            {
                code: '445',
                title: 'Food and Beverage Stores',
                description: 'Establishments usually known as grocery stores, supermarkets, convenience stores, meat markets, etc.',
                children: [
                    { code: '445110', title: 'Supermarkets and Other Grocery (except Convenience) Stores', description: 'Retailing a general line of food, such as canned and frozen foods; fresh fruits and vegetables; and fresh and prepared meats, fish, and poultry.' },
                    { code: '445120', title: 'Convenience Stores', description: 'Retailing a limited line of goods, generally including milk, bread, soda, and snacks.' },
                    { code: '445210', title: 'Meat Markets', description: 'Retailing fresh, frozen, or cured meats and poultry.' }
                ]
            },
            {
                code: '448',
                title: 'Clothing and Clothing Accessories Stores',
                description: 'Establishments primarily engaged in retailing new clothing and clothing accessories.',
                children: [
                    { code: '448110', title: 'Men\'s Clothing Stores', description: 'Retailing new men\'s and boys\' clothing.' },
                    { code: '448120', title: 'Women\'s Clothing Stores', description: 'Retailing new women\'s, misses\', and juniors\' clothing.' }
                ]
            }
        ]
    }
];

export const findNaicsByCode = (code) => {
    let found = null;
    let category = null;

    for (const cat of NAICS_DATA) {
        for (const sub of cat.children) {
            const match = sub.children.find(c => c.code === code);
            if (match) {
                found = match;
                category = cat;
                break;
            }
        }
        if (found) break;
    }

    return found ? { ...found, category } : null;
};

/* 
  HIERARCHICAL SEARCH LOGIC 
  Returns a flattened list of items with levels, 
  preserving tree structure for UI.
*/
export const searchNaics = (query) => {
    if (!query) return [];

    // Handle "Code - Title" format (e.g. from selection)
    // If the query matches the pattern "123456 - Title", we extract the code.
    let cleanQuery = query;
    const codeTitlePattern = /^(\d+)\s-\s/;
    const match = query.match(codeTitlePattern);
    if (match) {
        cleanQuery = match[1];
    }

    const lowerQ = cleanQuery.toLowerCase();

    // Recursive Filter & Map
    const processNode = (node, depth) => {
        const titleMatch = node.title.toLowerCase().includes(lowerQ);
        const codeMatch = node.code && node.code.includes(lowerQ);
        const isMatch = titleMatch || codeMatch;

        let matchingChildren = [];
        if (node.children) {
            // If parent matches, we want all children (Expansion)
            if (isMatch) {
                matchingChildren = node.children.map(child => processNode({ ...child, forceMatch: true }, depth + 1));
            } else {
                // Otherwise, only keep children that match
                matchingChildren = node.children
                    .map(child => processNode(child, depth + 1))
                    .filter(res => res !== null);
            }
        }

        // If this node matches OR has matching children, return structure
        if (isMatch || matchingChildren.length > 0 || node.forceMatch) {
            // Sorting: If children exist, we might want to bubble up the matches?
            // Requirement: "Acc" -> Accommodation first.
            // We sort children: Matches -> Non-matches (inherited context)

            matchingChildren.sort((a, b) => {
                const aMatch = a.node.title.toLowerCase().includes(lowerQ);
                const bMatch = b.node.title.toLowerCase().includes(lowerQ);
                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
                return 0; // Keep original order otherwise
            });

            return {
                node: node,
                level: depth,
                children: matchingChildren,
                isMatch: isMatch // Is this specific node a direct hit?
            };
        }

        return null;
    };

    // Flatten logic
    const flattened = [];
    const flatten = (treeNode) => {
        // Add self
        flattened.push({
            ...treeNode.node,
            level: treeNode.level,
            isMatch: treeNode.isMatch,
            type: treeNode.node.children ? 'category' : 'code'
        });
        // Add children
        treeNode.children.forEach(child => flatten(child));
    };

    // Run
    const sortedRoots = NAICS_DATA
        .map(root => processNode(root, 0))
        .filter(res => res !== null);

    // Sort roots too
    sortedRoots.sort((a, b) => {
        const aMatch = a.node.title.toLowerCase().includes(lowerQ);
        const bMatch = b.node.title.toLowerCase().includes(lowerQ);
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
    });

    sortedRoots.forEach(root => flatten(root));

    return flattened;
};
