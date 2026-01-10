import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

const CreditCommitteeModal = ({ isOpen, onClose, onSubmit, loan }) => {
    const [level1Reviewer, setLevel1Reviewer] = useState('');
    const [level2Reviewer, setLevel2Reviewer] = useState('');
    const [notes, setNotes] = useState('');
    const [error, setError] = useState(null);

    // Mock Data for Reviewers
    const level1Reviewers = [
        { id: 'rev_001', name: 'Sarah Smith (Senior Underwriter)' },
        { id: 'rev_002', name: 'Michael Ross (Credit Officer)' },
        { id: 'rev_003', name: 'Jessica Pearson (Risk Manager)' }
    ];

    const level2Reviewers = [
        { id: 'rev_101', name: 'Daniel Hardman (VP of Credit)' },
        { id: 'rev_102', name: 'Louis Litt (Senior Partner)' }
    ];

    if (!isOpen) return null;

    const handleSubmit = () => {
        // Validation: Level 1 is mandatory
        if (!level1Reviewer) {
            setError('Please select a Level 1 Reviewer.');
            return;
        }

        // Clear error
        setError(null);

        // Submit Data
        onSubmit({
            level1Reviewer: level1Reviewers.find(r => r.id === level1Reviewer)?.name || level1Reviewer,
            level2Reviewer: level2Reviewers.find(r => r.id === level2Reviewer)?.name || level2Reviewer,
            notes
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 transform transition-all scale-100">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900">Submit for Credit Committee Review</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">

                    {/* Context / Read-Only Info */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Borrower:</span>
                            <span className="font-medium text-slate-900">{loan?.borrower || 'Unknown'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Loan ID:</span>
                            <span className="font-mono text-slate-700">{loan?.id || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-500">Current Stage:</span>
                            <span className="font-bold text-blue-600 uppercase text-xs tracking-wider mt-0.5">Underwriting</span>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">

                        {/* Level 1 Reviewer (Required) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Level 1 Reviewer <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={level1Reviewer}
                                onChange={(e) => setLevel1Reviewer(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            >
                                <option value="">Select a reviewer...</option>
                                {level1Reviewers.map(rev => (
                                    <option key={rev.id} value={rev.id}>{rev.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Level 2 Reviewer (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Level 2 Reviewer <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <select
                                value={level2Reviewer}
                                onChange={(e) => setLevel2Reviewer(e.target.value)}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            >
                                <option value="">Select a reviewer...</option>
                                {level2Reviewers.map(rev => (
                                    <option key={rev.id} value={rev.id}>{rev.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Notes (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Submission Notes <span className="text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                placeholder="Add any context for the committee..."
                                rows={3}
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-all"
                    >
                        Submit to Credit Committee
                    </button>
                </div>

            </div>
        </div>
    );
};

export default CreditCommitteeModal;
