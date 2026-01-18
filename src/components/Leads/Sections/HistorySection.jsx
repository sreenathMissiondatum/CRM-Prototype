import React from 'react';
import { RefreshCw, Lock, Eye, Trash2 } from 'lucide-react';
import Section from '../../Shared/Section';

const HistorySection = ({
    isOpen,
    onToggle,
    formData,
    handleChange,
    // New Props for Logic
    onPriorBorrowerChange,
    onAddLoan,
    onDeleteLoan,
    onViewLoan,
    newLoanId,
    setNewLoanId,
    loanIdError,
    deleteConfirm
}) => {
    return (
        <Section title="Borrowing History" icon={RefreshCw} isOpen={isOpen} onToggle={onToggle}>
            {/* Internal Banner */}
            <div className="p-3 mb-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-xs text-slate-500 font-medium">
                <Lock size={12} />
                Internal fields only visible to staff.
            </div>

            {/* Checkbox Toggle */}
            <div className="flex items-center gap-2 mb-6">
                <input
                    type="checkbox"
                    id="borrowerPrevious_yn"
                    checked={formData.history.priorBorrower}
                    onChange={(e) => onPriorBorrowerChange(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor="borrowerPrevious_yn" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Prior Borrower with this CDFI?
                </label>
            </div>

            {/* Conditional Sub-section */}
            {formData.history.priorBorrower && (
                <div className="space-y-6 animate-in slide-in-from-top-2 duration-200">

                    {/* Header */}
                    <div>
                        <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            Previous Loans with this CDFI
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                            Add each prior loan separately. This information is internal and used for underwriting.
                        </p>
                    </div>

                    {/* Loan Lookup / Add */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                            Loan Lookup
                        </label>
                        <div className="flex gap-2">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    placeholder="Search or enter Loan ID (e.g., LN-2022-014)"
                                    className={`w-full text-sm border rounded-lg pl-3 pr-3 py-2 outline-none transition-all ${loanIdError ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
                                        }`}
                                    value={newLoanId}
                                    onChange={(e) => setNewLoanId(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && onAddLoan()}
                                />
                            </div>
                            <button
                                onClick={onAddLoan}
                                disabled={!newLoanId.trim()}
                                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg text-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Add Loan
                            </button>
                        </div>
                        {loanIdError && (
                            <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
                                <span className="w-1 h-1 bg-red-600 rounded-full inline-block" />
                                {loanIdError}
                            </p>
                        )}
                    </div>

                    {/* Previous Loans Table */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-3">Loan ID</th>
                                    <th className="px-4 py-3">Loan Date</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {formData.history.previousLoans.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="px-4 py-8 text-center text-slate-400 italic">
                                            No prior loans added yet.
                                        </td>
                                    </tr>
                                ) : (
                                    formData.history.previousLoans.map((loan) => (
                                        <tr key={loan.id} className="group hover:bg-slate-50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-700">
                                                {loan.id}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600">
                                                {loan.date || '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${loan.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    loan.status === 'Closed' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                                                        'bg-amber-100 text-amber-700 border-amber-200'
                                                    }`}>
                                                    {loan.status || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => onViewLoan(loan.id)}
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="View Loan Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>

                                                    {deleteConfirm === loan.id ? (
                                                        <button
                                                            onClick={() => onDeleteLoan(loan.id)}
                                                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors animate-in fade-in"
                                                        >
                                                            Confirm
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => onDeleteLoan(loan.id)}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Remove Loan"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </Section>
    );
};

export default HistorySection;
