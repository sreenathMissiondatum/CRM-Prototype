import React, { useState } from 'react';
import LoansList from './LoansList';
import LoanDetail from './LoanDetail';

const LoansLayout = ({
    viewMode,
    onNavigate,
    onViewAccount = () => { },
    onViewContact = () => { },
    selectedLoan,
    onSelectLoan
}) => {
    // State is now lifted to App.jsx for persistence

    return (
        <div className="h-full bg-slate-50 animate-in fade-in duration-300">
            {selectedLoan ? (
                <LoanDetail
                    loan={selectedLoan}
                    onBack={() => onSelectLoan(null)}
                    onViewAccount={onViewAccount}
                    onViewContact={onViewContact}
                />
            ) : (
                <LoansList
                    key={viewMode} // Force remount on view mode switch to prevent stale state
                    viewMode={viewMode}
                    onSelectLoan={onSelectLoan}
                />
            )}
        </div>
    );
};

export default LoansLayout;
