import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Upload, FileText, CheckCircle, AlertCircle, ArrowRight, Download } from 'lucide-react';

const ImportUsersModal = ({ isOpen, onClose, onImportComplete }) => {
    const [step, setStep] = useState(1); // 1: Upload, 2: Mapping, 3: Review
    const [file, setFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [mapping, setMapping] = useState({
        name: 'Full Name',
        email: 'Email Address',
        role: 'Role',
        department: 'Department',
        manager: 'Manager Email'
    });

    if (!isOpen) return null;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
            setFile(droppedFile);
            setStep(2);
        }
    };

    const handleFileSelect = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setStep(2);
        }
    };

    const handleImport = () => {
        // Mock Import Logic
        setTimeout(() => {
            onImportComplete && onImportComplete();
            onClose();
            setStep(1);
            setFile(null);
        }, 1500);
    };

    return createPortal(
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Import Users</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Bulk create users from CSV or Excel</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    {/* Steps Indicator */}
                    <div className="flex items-center justify-between mb-8 px-8">
                        {['Upload File', 'Map Columns', 'Review & Import'].map((label, index) => {
                            const stepNum = index + 1;
                            const isActive = step === stepNum;
                            const isCompleted = step > stepNum;
                            return (
                                <div key={label} className="flex flex-col items-center gap-2 relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${isActive ? 'bg-blue-600 text-white ring-4 ring-blue-50' : isCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                        {isCompleted ? <CheckCircle size={14} /> : stepNum}
                                    </div>
                                    <span className={`text-xs font-medium ${isActive ? 'text-blue-700' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`}>{label}</span>
                                </div>
                            );
                        })}
                        {/* Progress Line */}
                        <div className="absolute top-[135px] left-[10%] right-[10%] h-0.5 bg-slate-100 -z-0">
                            <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
                        </div>
                    </div>

                    {/* Step 1: Upload */}
                    {step === 1 && (
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-all ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-slate-50/30'}`}
                        >
                            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
                                <Upload size={28} />
                            </div>
                            <h3 className="text-sm font-bold text-slate-800 mb-1">Click to upload or drag and drop</h3>
                            <p className="text-xs text-slate-500 mb-6">Supported formats: CSV, XLSX (Max 10MB)</p>
                            <label className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg text-sm hover:bg-slate-50 cursor-pointer shadow-sm transition-colors">
                                Browse Files
                                <input type="file" className="hidden" accept=".csv, .xlsx" onChange={handleFileSelect} />
                            </label>

                            <div className="mt-8 pt-6 border-t border-slate-200 w-full max-w-xs">
                                <button className="flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-blue-600 transition-colors mx-auto">
                                    <Download size={14} /> Download Sample Template
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Mapping (Simplified Mock) */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start gap-3">
                                <FileText className="text-blue-600 mt-0.5" size={16} />
                                <div>
                                    <div className="text-sm font-bold text-blue-900">{file?.name}</div>
                                    <div className="text-xs text-blue-700">12 KB • 24 Rows Detected</div>
                                </div>
                                <button onClick={() => setFile(null) || setStep(1)} className="ml-auto text-blue-400 hover:text-blue-700 hover:underline text-xs">Change</button>
                            </div>

                            <div className="border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase font-bold">
                                        <tr>
                                            <th className="px-4 py-3 w-1/3">Target Field</th>
                                            <th className="px-4 py-3 w-1/3">Source Column</th>
                                            <th className="px-4 py-3 w-1/3">Sample Value</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {Object.entries(mapping).map(([field, source], idx) => (
                                            <tr key={field} className="bg-white">
                                                <td className="px-4 py-3 font-medium text-slate-700">{field.charAt(0).toUpperCase() + field.slice(1)}</td>
                                                <td className="px-4 py-3">
                                                    <select className="w-full text-xs border border-slate-200 rounded p-1.5 focus:ring-1 focus:ring-blue-500 outline-none">
                                                        <option>{source}</option>
                                                        <option>Ignore Column</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 italic">Example Data {idx + 1}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3 bg-slate-50 rounded-b-xl">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    {step === 1 && <button disabled className="px-6 py-2 text-sm font-bold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed">Next Step</button>}
                    {step === 2 && (
                        <button onClick={handleImport} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-2">
                            Start Import <ArrowRight size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ImportUsersModal;
