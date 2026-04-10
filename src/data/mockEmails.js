export const MOCK_EMAILS = [
    {
        id: 't-1-campaign',
        subject: 'Refinance Rate Alert v2',
        leadId: 'LEAD-7782',
        participants: [
            { name: 'Sarah Jenkins', email: 'sarah.j@email.com', role: 'recipient' },
            { name: 'Alex Smith', email: 'alex@myflow.com', role: 'sender' },
            { name: 'System', email: 'no-reply@myflow.com', role: 'system' }
        ],
        lastActivityDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        unreadCount: 0,
        isArchived: false,
        status: 'SLA_BREACH',
        campaign: {
            id: 'camp-1',
            name: 'Rate Drop Nurture - Oct 2023',
            trigger: `Lead Status changed to 'Nurturing'`,
            template: 'Refinance Rate Alert v2'
        },
        messages: [
            {
                id: 'm-1-1',
                from: { name: 'System Trigger', email: 'no-reply@myflow.com' },
                to: [{ name: 'Sarah Jenkins', email: 'sarah.j@email.com' }],
                subject: 'Refinance Rate Alert v2',
                body: `<p>Hi Sarah,</p>
                       <p>Rates have dropped recently, and I thought of your file. We might be able to get your monthly payment down significantly.</p>
                       <p>Let's schedule a 5-minute call this week to review the numbers.</p>
                       <p>Best,<br>Alex</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago (was 4)
                direction: 'outbound',
                source: 'CAMPAIGN',
                isRead: true,
                isSensitive: false,
                tags: []
            },
            {
                id: 'm-1-2',
                from: { name: 'Sarah Jenkins', email: 'sarah.j@email.com' },
                to: [{ name: 'Alex Smith', email: 'alex@myflow.com' }],
                subject: 'Re: Refinance Rate Alert v2',
                body: `<p>Thanks Alex, what rates are we looking at right now?</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
                direction: 'inbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            },
            {
                id: 'm-1-3',
                from: { name: 'Alex Smith', email: 'alex@myflow.com' },
                to: [{ name: 'Sarah Jenkins', email: 'sarah.j@email.com' }],
                subject: 'Re: Refinance Rate Alert v2',
                body: `<p>We are seeing around 6.5% for your LTV profile, which would save you roughly $400/month.</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), // 3 days ago + 2h
                direction: 'outbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            },
            {
                id: 'm-1-4',
                from: { name: 'Sarah Jenkins', email: 'sarah.j@email.com' },
                to: [{ name: 'Alex Smith', email: 'alex@myflow.com' }],
                subject: 'Re: Refinance Rate Alert v2',
                body: `<p>Sorry for the delay Alex. That sounds great. When are you free for a quick call to discuss the underwriting process?</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
                direction: 'inbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: [],
                slaBreached: true // Internal flag for the UI
            },
            {
                id: 'm-1-5',
                from: { name: 'Alex Smith', email: 'alex@myflow.com' },
                to: [{ name: 'Sarah Jenkins', email: 'sarah.j@email.com' }],
                subject: 'Re: Refinance Rate Alert v2',
                body: `<p>No problem at all Sarah.</p>
                       <p>Does Tuesday at 2 PM or Wednesday morning work for you?</p>
                       <p>I'll send over a calendar invite once you confirm.</p>
                       <p>Best,<br>Alex</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                direction: 'outbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            }
        ]
    },

    {
        id: 't-2-docs',
        subject: 'Updated W-2 documentation needed',
        leadId: 'LEAD-7782', 
        participants: [
            { name: 'Alex Smith', email: 'alex@myflow.com', role: 'sender' },
            { name: 'Sarah Jenkins', email: 'sarah.j@email.com', role: 'recipient' }
        ],
        lastActivityDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        unreadCount: 0,
        isArchived: false,
        status: 'AWAITING_REPLY',
        campaign: null,
        messages: [
            {
                id: 'm-2-1',
                from: { name: 'Alex Smith', email: 'alex@myflow.com' },
                to: [{ name: 'Sarah Jenkins', email: 'sarah.j@email.com' }],
                subject: 'Updated W-2 documentation needed',
                body: `<p>Hi Sarah, please send over the latest W-2 for 2022 and 2023 so we can finalize the income calculation.</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                direction: 'outbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            },
            {
                id: 'm-2-2',
                from: { name: 'Sarah Jenkins', email: 'sarah.j@email.com' },
                to: [{ name: 'Alex Smith', email: 'alex@myflow.com' }],
                subject: 'Re: Updated W-2 documentation needed',
                body: `<p>Hi Alex,</p>
                       <p>Here are the forms you requested.</p>
                       <p>Best,<br>Sarah</p>`,
                attachments: [
                    { id: 'att-2-1', name: 'W2_2023.pdf', size: '1.2 MB', type: 'application/pdf', status: 'PROCESSED', assignedTo: '2023 W-2' },
                    { id: 'att-2-2', name: 'W2_2022.pdf', size: '1.4 MB', type: 'application/pdf', status: 'UNPROCESSED' }
                ],
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 2.5 * 60 * 60 * 1000).toISOString(),
                direction: 'inbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            },
            {
                id: 'm-2-3',
                from: { name: 'Alex Smith', email: 'alex@myflow.com' },
                to: [{ name: 'Sarah Jenkins', email: 'sarah.j@email.com' }],
                subject: 'Re: Updated W-2 documentation needed',
                body: `<p>Received, thank you. I'll pass these to the processor today.</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
                direction: 'outbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            },
            {
                id: 'm-2-4',
                from: { name: 'Sarah Jenkins', email: 'sarah.j@email.com' },
                to: [{ name: 'Alex Smith', email: 'alex@myflow.com' }],
                subject: 'Re: Updated W-2 documentation needed',
                body: `<p>Great, is there anything else you need from me right now?</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                direction: 'inbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            },
            {
                id: 'm-2-5',
                from: { name: 'Alex Smith', email: 'alex@myflow.com' },
                to: [{ name: 'Sarah Jenkins', email: 'sarah.j@email.com' }],
                subject: 'Re: Updated W-2 documentation needed',
                body: `<p>Actually yes, could you also provide the latest 30 days of bank statements? We just got a condition from underwriting.</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
                direction: 'outbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            }
        ]
    },

    {
        id: 't-3-sensitive',
        subject: 'Confidential: Tax Info',
        leadId: 'LEAD-7782',
        participants: [
            { name: 'Sarah Jenkins', email: 'sarah.j@email.com', role: 'sender' },
            { name: 'Alex Smith', email: 'alex@myflow.com', role: 'recipient' }
        ],
        lastActivityDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
        unreadCount: 0,
        isArchived: false,
        status: 'REPLIED',
        campaign: null,
        messages: [
            {
                id: 'm-3-1',
                from: { name: 'Sarah Jenkins', email: 'sarah.j@email.com' },
                to: [{ name: 'Alex Smith', email: 'alex@myflow.com' }],
                subject: 'Confidential: Tax Info',
                body: `<p>Alex,</p><p>Here is my SSN: ***-**-1234. Please let me know if you need physical copies.</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                direction: 'inbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: true,
                tags: []
            },
            {
                id: 'm-3-2',
                from: { name: 'Alex Smith', email: 'alex@myflow.com' },
                to: [{ name: 'Sarah Jenkins', email: 'sarah.j@email.com' }],
                subject: 'Re: Confidential: Tax Info',
                body: `<p>Received securely, thank you. No physical copies needed right now.</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(),
                direction: 'outbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            },
            {
                id: 'm-3-3',
                from: { name: 'Sarah Jenkins', email: 'sarah.j@email.com' },
                to: [{ name: 'Alex Smith', email: 'alex@myflow.com' }],
                subject: 'Re: Confidential: Tax Info',
                body: `<p>Should I send the PIN for the IRS transcript line as well?</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000).toISOString(),
                direction: 'inbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            },
            {
                id: 'm-3-4',
                from: { name: 'Alex Smith', email: 'alex@myflow.com' },
                to: [{ name: 'Sarah Jenkins', email: 'sarah.j@email.com' }],
                subject: 'Re: Confidential: Tax Info',
                body: `<p>Yes please, via the secure upload portal link I sent earlier. Do not reply with it here via email.</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
                direction: 'outbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            }
        ]
    },

    {
        id: 't-4-quick',
        subject: 'Quick Follow-up',
        leadId: 'LEAD-7782',
        participants: [
            { name: 'Alex Smith', email: 'alex@myflow.com', role: 'sender' },
            { name: 'Sarah Jenkins', email: 'sarah.j@email.com', role: 'recipient' }
        ],
        lastActivityDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        unreadCount: 0,
        isArchived: false,
        status: 'REPLIED',
        campaign: null,
        messages: [
            {
                id: 'm-4-1',
                from: { name: 'Alex Smith', email: 'alex@myflow.com' },
                to: [{ name: 'Sarah Jenkins', email: 'sarah.j@email.com' }],
                subject: 'Quick Follow-up',
                body: `<p>Hi Sarah, just confirming you received the introductory disclosures packet I sent over via DocuSign?</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 - 4 * 60 * 60 * 1000).toISOString(),
                direction: 'outbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            },
            {
                id: 'm-4-2',
                from: { name: 'Sarah Jenkins', email: 'sarah.j@email.com' },
                to: [{ name: 'Alex Smith', email: 'alex@myflow.com' }],
                subject: 'Re: Quick Follow-up',
                body: `<p>Yes, that sounds good to me. I'll sign it tonight.</p>`,
                attachments: [],
                timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                direction: 'inbound',
                source: 'MANUAL',
                isRead: true,
                isSensitive: false,
                tags: []
            }
        ]
    }
];
