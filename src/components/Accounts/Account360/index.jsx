import React, { useState } from 'react';
import RelationshipControlBar from './components/RelationshipControlBar';

// Modes
import PulseMode from './modes/PulseMode';
import DefenseMode from './modes/DefenseMode';
import GrowthMode from './modes/GrowthMode';
import VaultMode from './modes/VaultMode';

const Account360 = ({ onBack, initialAccount }) => {
    const [activeMode, setActiveMode] = useState('pulse');

    // Merged Data
    const accountData = {
        name: 'Jenkins Catering Services, LLC',
        type: 'LLC',
        id: 'ACC-882910',
        location: 'San Francisco, CA',
        healthScore: 88,
        ...initialAccount
    };

    const renderMode = () => {
        switch (activeMode) {
            case 'pulse': return <PulseMode account={accountData} />;
            case 'defense': return <DefenseMode account={accountData} />;
            case 'growth': return <GrowthMode account={accountData} />;
            case 'vault': return <VaultMode account={accountData} />;
            default: return <PulseMode account={accountData} />;
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-100 font-sans overflow-hidden">

            {/* 1. Persistent Control Bar (Super Header) */}
            <RelationshipControlBar
                account={accountData}
                activeMode={activeMode}
                onChangeMode={setActiveMode}
            />

            {/* 2. Mode Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                {renderMode()}
            </div>

        </div>
    );
};

export default Account360;
