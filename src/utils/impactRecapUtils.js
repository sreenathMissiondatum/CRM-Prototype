
/**
 * Utilities for generating the "My Hits & Misses" Impact Recap.
 * 
 * This mock generator creates a narrative-driven data set for a Loan Officer.
 * In a real app, this would aggregate data from the backend.
 */
export const generateImpactRecap = (userRole, period = 'YTD') => {
    return {
        meta: {
            user: "Alex Morgan",
            role: "Loan Officer",
            period: "Year to Date (2025)",
            generatedDate: new Date().toLocaleDateString(),
        },
        yearAtAGlance: {
            leadsHandled: 142,
            borrowersContacted: 89,
            taEngagements: 34,
            loansConverted: 18,
            insight: "You worked across a TA-heavy pipeline compared to typical workloads, reflecting a strong commitment to development services."
        },
        hits: {
            insights: [
                {
                    title: "Fast First Contact",
                    metrics: [
                        { icon: "timer", label: "1.2 hrs avg response" },
                        { icon: "trend-down", label: "72% drop-off reduced" },
                        { icon: "bar-chart", label: "Org avg: 4.5 hrs" }
                    ],
                    interpretation: "Early responsiveness significantly reduced lead drop-off."
                },
                {
                    title: "TA as a Strength",
                    metrics: [
                        { icon: "trending-up", label: "2.1x conversion uplift" },
                        { icon: "users", label: "34 TA-supported leads" },
                        { icon: "clock", label: "18 days avg duration" }
                    ],
                    interpretation: "TA-supported leads converted at double the baseline rate."
                },
                {
                    title: "Doc Collection Speed",
                    metrics: [
                        { icon: "zap", label: "3 days faster" },
                        { icon: "check-circle", label: "92% checklist completion" },
                        { icon: "refresh-cw", label: "41% fewer rework loops" }
                    ],
                    interpretation: "Efficient follow-up minimized document delays."
                }
            ],
            missionAlignment: {
                title: "Mission Alignment",
                metrics: [
                    { icon: "map-pin", label: "68% in priority zones" },
                    { icon: "briefcase", label: "45% minority-owned" }
                ],
                detail: "Capital consistently reached priority communities."
            }
        },
        misses: {
            disclaimer: "These are signals, not failures.",
            signals: [
                {
                    title: "Eligibility Clarity",
                    metrics: [
                        { label: "11 cases affected" },
                        { label: "+9 days added to cycle" }
                    ],
                    detail: "Eligibility issues surfaced late in the process."
                },
                {
                    title: "Engagement Dip",
                    metrics: [
                        { label: "8 TA cases stalled" },
                        { label: ">30 days idle" }
                    ],
                    detail: "Borrower engagement dropped during extended TA."
                },
                {
                    title: "Timing Misalignment",
                    metrics: [
                        { label: "6 leads exited post-nurturing" }
                    ],
                    detail: "Debt readiness timing did not match expectations."
                }
            ]
        },
        reflections: [
            "Earlier TA referral correlated with better outcomes for startup applicants.",
            "Faster follow-up after first contact (within 1 hr) improved conversion by ~15%.",
            "Complex loan structures required more upfront education to prevent borrower drop-off."
        ],
        focusAreas: [
            "Reduce time in Pre-Screening by using the new Quick Check tool.",
            "Re-engage Nurturing leads sooner (every 2 weeks) to prevent staleness.",
            "Escalate Technical Assistance needs earlier for borderline credit cases."
        ]
    };
};
