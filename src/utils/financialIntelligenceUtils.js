/**
 * Mock data generator for the Financial Intelligence View.
 * Simulates "finProfile_bus" and derived intelligence metrics.
 */

export const generateFinancialIntelligence = (period = 'FY 2024') => {
    return {
        meta: {
            businessName: "Jenkins Catering Services, LLC",
            statementType: "Tax Return (Verified)",
            period: period,
            generatedDate: new Date().toLocaleDateString(),
        },
        contextPills: [
            { label: "Revenue", value: "$850,000", trend: "up" },
            { label: "EBITDA", value: "$145,000", trend: "up" },
            { label: "DSCR", value: "1.42x", trend: "stable" },
            { label: "Total Assets", value: "$320,000", trend: "up" }
        ],
        signals: {
            profitability: {
                title: "Profitability Signals",
                items: [
                    { label: "Gross Margin", value: "42%", trend: "up", detail: "Costs down 4% vs PY" },
                    { label: "Net Margin", value: "12%", trend: "stable", detail: "Consistent with industry" },
                    { label: "EBITDA Margin", value: "17%", trend: "up", detail: "Operating leverage improving" }
                ],
                interpretation: "Strong margin expansion driven by COGS efficiency."
            },
            cashFlow: {
                title: "Cash Flow & Debt Service",
                status: "Healthy",
                items: [
                    { label: "DSCR (Biz)", value: "1.42x", status: "good", detail: "Comfortably covers obligations" },
                    { label: "Global DSCR", value: "1.35x", status: "good", detail: "Owners personal debt moderate" }
                ],
                interpretation: "Cash flow sufficient to increased debt service."
            },
            leverage: {
                title: "Leverage & Capital",
                items: [
                    { label: "Total Liabilities", value: "$180,000", trend: "down" },
                    { label: "Debt / Revenue", value: "0.21", trend: "stable", detail: "Low leverage ratio" }
                ],
                interpretation: "Debt levels remain conservative relative to revenue."
            },
            liquidity: {
                title: "Liquidity (Resilience)",
                items: [
                    { label: "Current Ratio", value: "1.8", status: "good", detail: "Strong short-term coverage" },
                    { label: "Working Capital", value: "$45,000", trend: "down", detail: "Recent inventory build" }
                ],
                interpretation: "Liquidity tightened slightly due to inventory investment."
            }
        },
        trends: {
            periods: ["2022", "2023", "2024"],
            series: [
                { name: "Revenue", data: ["$720k", "$780k", "$850k"], color: "blue" },
                { name: "EBITDA", data: ["$98k", "$110k", "$145k"], color: "emerald" },
                { name: "DSCR", data: ["1.2x", "1.3x", "1.42x"], color: "indigo" }
            ],
            interpretation: "Consistent 3-year growth trajectory with expanding profitability."
        }
    };
};
