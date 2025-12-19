import React, { useState } from 'react';
import { CloudDownload, CheckCircle2, ChevronRight, X, AlertOctagon, Server } from 'lucide-react';

const LoanProgramImport = ({ onClose, onImport }) => {
    const [step, setStep] = useState(1);
    const [selectedLMS, setSelectedLMS] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isImporting, setIsImporting] = useState(false);

    // Mock Data
    const lmsOptions = [
        { id: 'lms1', name: 'Core Banking (Fiserv)', status: 'Connected', badge: 'Primary' },
        { id: 'lms2', name: 'Legacy System (Jack Henry)', status: 'Connected', badge: 'ReadOnly' }
    ];

    const productOptions = [
        { id: 'p1', name: 'Commercial Real Estate - Floating', code: 'CRE-FLT-01' },
        { id: 'p2', name: 'Small Business Line of Credit', code: 'SBLOC-02' },
        { id: 'p3', name: 'Equipment Term Loan', code: 'EQ-TERM-04' }
    ];

    const handleImport = () => {
        setIsImporting(true);
        // Simulate network request
        setTimeout(() => {
            const newProgram = {
                id: `LP-IMP-${Math.floor(Math.random() * 1000)}`,
                name: selectedProduct.name,
                code: selectedProduct.code,
                source: 'LMS',
                version: '1.0',
                status: 'Draft',
                activeLoans: 0,
                lastModified: new Date().toISOString().split('T')[0],
                owner: 'System Import'
            };
            onImport(newProgram);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <CloudDownload size={20} className="text-indigo-600" />
                            Import from LMS
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">Sync loan products from external system</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 flex-1 overflow-y-auto">

                    {/* Step 1: Select LMS */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">Select Source System</div>
                            <div className="grid gap-3">
                                {lmsOptions.map(lms => (
                                    <button
                                        key={lms.id}
                                        onClick={() => setSelectedLMS(lms)}
                                        className={`flex items-center justify-between p-4 rounded-lg border text-left transition-all ${selectedLMS?.id === lms.id
                                            ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600'
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-md border border-slate-100 shadow-sm text-slate-600">
                                                <Server size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800 text-sm">{lms.name}</div>
                                                <div className="text-xs text-green-600 flex items-center gap-1">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                    {lms.status}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{lms.badge}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Product */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <div className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-2">Select Product to Import</div>
                            <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 text-xs text-indigo-700 mb-4 flex gap-2">
                                <AlertOctagon size={16} />
                                Only products not yet imported are shown.
                            </div>
                            <div className="space-y-2">
                                {productOptions.map(prod => (
                                    <button
                                        key={prod.id}
                                        onClick={() => setSelectedProduct(prod)}
                                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all ${selectedProduct?.id === prod.id
                                            ? 'border-indigo-600 bg-indigo-50'
                                            : 'border-slate-200 hover:bg-slate-50'
                                            }`}
                                    >
                                        <span className="font-medium text-slate-700 text-sm">{prod.name}</span>
                                        <span className="font-mono text-xs text-slate-400">{prod.code}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-slate-50 rounded-lg border border-slate-200 p-4">
                                <h3 className="font-bold text-slate-800 text-sm mb-4">Import Summary</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Source:</span>
                                        <span className="font-medium text-slate-900">{selectedLMS.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Product:</span>
                                        <span className="font-medium text-slate-900">{selectedProduct.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Code:</span>
                                        <span className="font-mono text-slate-900">{selectedProduct.code}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">Initial Version:</span>
                                        <span className="font-mono text-slate-900">1.0 (Draft)</span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-xs text-slate-500 leading-relaxed text-center px-4">
                                Importing will create a new Loan Program record. Core fields (Interest Rate Structure, Limits) will be read-only and synced from LMS. Configurable fields (Documents, Workflows) can be edited after import.
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="text-slate-500 hover:text-slate-800 text-sm font-medium px-4 py-2"
                        >
                            Back
                        </button>
                    ) : (
                        <div></div> // Spacer
                    )}

                    {step < 3 ? (
                        <button
                            disabled={step === 1 ? !selectedLMS : !selectedProduct}
                            onClick={() => setStep(step + 1)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-6 py-2 text-sm font-bold shadow-sm shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={handleImport}
                            disabled={isImporting}
                            className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-6 py-2 text-sm font-bold shadow-sm shadow-green-200 transition-all flex items-center gap-2"
                        >
                            {isImporting ? 'Importing...' : 'Confirm Import'}
                            {!isImporting && <CheckCircle2 size={16} />}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoanProgramImport;
