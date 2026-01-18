
/**
 * Mock utility to derive Census Tract and Poverty Data from ZIP Code.
 * In a real application, this would call the FFIEC Geocoding API or similar service.
 * 
 * @param {string} zip - The ZIP code to lookup.
 * @returns {object} - { censusTract, povertyRate, isLowIncome }
 */
export const deriveCensusData = (zip) => {
    // Mock Data Map
    const MOCK_DATA = {
        '48201': { tract: '48201223100', povertyRate: 35.5, isLowIncome: true },
        '48202': { tract: '48202551200', povertyRate: 28.2, isLowIncome: true },
        '48226': { tract: '48226987600', povertyRate: 15.0, isLowIncome: false },
        '90210': { tract: '06037261100', povertyRate: 5.1, isLowIncome: false },
        '10001': { tract: '36061009900', povertyRate: 12.8, isLowIncome: false }
    };

    if (!zip || !MOCK_DATA[zip]) {
        return {
            censusTract: 'N/A',
            povertyRate: 0,
            isLowIncome: false
        };
    }

    return {
        censusTract: MOCK_DATA[zip].tract,
        povertyRate: MOCK_DATA[zip].povertyRate,
        isLowIncome: MOCK_DATA[zip].isLowIncome
    };
};

/**
 * Returns a badge color/label based on status
 */
export const getLowIncomeBadge = (isLowIncome) => {
    if (isLowIncome) {
        return { label: 'Target Market (Poor > 20%)', color: 'bg-green-100 text-green-800 border-green-200' };
    }
    return { label: 'Non-Target Market', color: 'bg-slate-100 text-slate-600 border-slate-200' };
};
