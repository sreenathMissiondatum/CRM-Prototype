import React, { useState, useRef, useEffect } from 'react';
import {
    Upload, FileText, Check, AlertCircle, X, ChevronRight,
    Download, RefreshCw, FileSpreadsheet, ArrowRight, ShieldCheck,
    AlertTriangle, Loader2
} from 'lucide-react';
import { downloadLeadTemplate } from '../../utils/leadTemplateUtils';

const STEPS = {
    MODE_SELECTION: 'mode_selection',
    UPLOAD: 'upload',
    MAPPING: 'mapping',
    PREVIEW: 'preview',
    IMPORTING: 'importing',
    RESULT: 'result'
};

const MODES = {
    TEMPLATE: 'template',
    CUSTOM: 'custom'
};

const REQUIRED_FIELDS = ['firstName', 'lastName', 'email'];
const AVAILABLE_FIELDS = [
    { id: 'firstName', label: 'First Name', required: true },
    { id: 'lastName', label: 'Last Name', required: true },
    { id: 'email', label: 'Email', required: true },
    { id: 'phone', label: 'Phone', required: false },
    { id: 'businessName', label: 'Business Name', required: false },
    { id: 'source', label: 'Source', required: false },
    { id: 'title', label: 'Job Title', required: false },
    { id: 'city', label: 'City', required: false },
    { id: 'state', label: 'State', required: false }
];

const ImportLeadsModal = ({ isOpen, onClose, onImportComplete, existingEmails = [] }) => {
    // State
    const [step, setStep] = useState(STEPS.MODE_SELECTION);
    const [mode, setMode] = useState(null);
    const [file, setFile] = useState(null);
    const [csvData, setCsvData] = useState({ headers: [], rows: [] });
    const [mapping, setMapping] = useState({}); // { csvHeaderIndex: fieldId }
    const [validationResults, setValidationResults] = useState({ valid: [], invalid: [] });
    const [importStats, setImportStats] = useState({ success: 0, failed: 0 });
    const fileInputRef = useRef(null);

    // Reset state on open
    useEffect(() => {
        if (isOpen) {
            setStep(STEPS.MODE_SELECTION);
            setMode(null);
            setFile(null);
            setCsvData({ headers: [], rows: [] });
            setMapping({});
            setValidationResults({ valid: [], invalid: [] });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // --- LOGIC ---

    const handleModeSelect = (selectedMode) => {
        setMode(selectedMode);
        setStep(STEPS.UPLOAD);
    };

    const handleFileUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        setFile(uploadedFile);

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const { headers, rows } = parseCSV(text);
            setCsvData({ headers, rows });

            // Initial auto-mapping
            if (MODES.TEMPLATE === mode) {
                // In template mode, expect strict match or auto-map by exact name
            } else {
                const initialMapping = {};
                headers.forEach((header, index) => {
                    const normalized = header.toLowerCase().replace(/[^a-z0-9]/g, '');
                    const match = AVAILABLE_FIELDS.find(f =>
                        f.label.toLowerCase().replace(/[^a-z0-9]/g, '') === normalized ||
                        f.id.toLowerCase() === normalized
                    );
                    if (match) {
                        initialMapping[index] = match.id;
                    }
                });
                setMapping(initialMapping);
            }
        };
        reader.readAsText(uploadedFile);
    };

    const parseCSV = (text) => {
        const lines = text.split('\n').filter(l => l.trim());
        if (lines.length === 0) return { headers: [], rows: [] };

        // Simple CSV parser respecting quotes
        const parseLine = (line) => {
            const result = [];
            let current = '';
            let inQuotes = false;

            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result.map(val => val.replace(/^"|"$/g, '').replace(/""/g, '"'));
        };

        const headers = parseLine(lines[0]);
        const rows = lines.slice(1).map(parseLine);
        return { headers, rows };
    };

    const runValidation = () => {
        const valid = [];
        const invalid = [];
        const seenEmailsInFile = new Set();

        csvData.rows.forEach((row, rowIndex) => {
            const rowData = {};
            const errors = [];

            // Map data
            if (mode === MODES.TEMPLATE) {
                // Assume order matches template: First Name, Last Name, Email, Phone, Business, Source
                const templateFields = ['firstName', 'lastName', 'email', 'phone', 'businessName', 'source'];
                templateFields.forEach((field, index) => {
                    rowData[field] = row[index];
                });
            } else {
                // Use mapping
                Object.keys(mapping).forEach(colIndex => {
                    const fieldId = mapping[colIndex];
                    if (fieldId) {
                        rowData[fieldId] = row[colIndex];
                    }
                });
            }

            // Check Required
            REQUIRED_FIELDS.forEach(field => {
                if (!rowData[field]) {
                    errors.push(`Missing required field: ${AVAILABLE_FIELDS.find(f => f.id === field)?.label}`);
                }
            });

            // Check Email Format & Duplicates
            if (rowData.email) {
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rowData.email)) {
                    errors.push(`Invalid email format: ${rowData.email}`);
                } else if (existingEmails.includes(rowData.email)) {
                    errors.push(`Duplicate: ${rowData.email} exists in system`);
                } else if (seenEmailsInFile.has(rowData.email)) {
                    errors.push(`Duplicate in file: ${rowData.email}`);
                }
                seenEmailsInFile.add(rowData.email);
            }

            if (errors.length > 0) {
                invalid.push({ row: rowIndex + 2, data: rowData, errors });
            } else {
                valid.push(rowData);
            }
        });

        setValidationResults({ valid, invalid });
        setStep(STEPS.PREVIEW);
    };

    const executeImport = async () => {
        setStep(STEPS.IMPORTING);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setImportStats({
            success: validationResults.valid.length,
            failed: validationResults.invalid.length
        });

        if (onImportComplete) {
            onImportComplete(validationResults.valid);
        }

        setStep(STEPS.RESULT);
    };



    const downloadErrorReport = () => {
        // Generate CSV content for errors
        const headers = ['Row Number', 'Error Reasons', 'Email', 'First Name', 'Last Name', 'Business Name'];
        const rows = validationResults.invalid.map(item => {
            const rowData = item.data || {};
            return [
                item.row,
                `"${item.errors.join('; ')}"`, // Quote errors to handle commas
                rowData.email || '',
                rowData.firstName || '',
                rowData.lastName || '',
                rowData.businessName || ''
            ].join(',');
        });

        const csvContent = [headers.join(','), ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'import_error_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- RENDERERS ---

    const renderModeSelection = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
                onClick={() => handleModeSelect(MODES.TEMPLATE)}
                className="group flex flex-col items-center p-8 border-2 border-slate-200 hover:border-blue-500 rounded-xl hover:bg-blue-50/50 transition-all text-center"
            >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                    <FileSpreadsheet size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Upload Using Template</h3>
                <p className="text-sm text-slate-500">Download our standardized CSV template, fill it out, and upload. Best for bulk imports.</p>
                <div className="mt-6 flex items-center text-blue-600 font-medium text-sm">
                    Select Mode <ArrowRight size={16} className="ml-1" />
                </div>
            </button>

            <button
                onClick={() => handleModeSelect(MODES.CUSTOM)}
                className="group flex flex-col items-center p-8 border-2 border-slate-200 hover:border-purple-500 rounded-xl hover:bg-purple-50/50 transition-all text-center"
            >
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                    <RefreshCw size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">On-the-Fly Mapping</h3>
                <p className="text-sm text-slate-500">Upload any CSV or Excel file and map the columns to our fields manually.</p>
                <div className="mt-6 flex items-center text-purple-600 font-medium text-sm">
                    Select Mode <ArrowRight size={16} className="ml-1" />
                </div>
            </button>
        </div>
    );

    const renderUpload = () => (
        <div className="flex flex-col items-center">
            {mode === MODES.TEMPLATE && (
                <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Download Template</h4>
                            <p className="text-xs text-slate-500">Use this file to ensure your data is formatted correctly.</p>
                        </div>
                    </div>
                    <button
                        onClick={downloadLeadTemplate}
                        className="px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-sm font-medium rounded hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                        <Download size={14} /> Download CSV
                    </button>
                </div>
            )}

            <div
                className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors cursor-pointer
                    ${file ? 'border-emerald-300 bg-emerald-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}`}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".csv,.txt" // Simplified for prototype
                    onChange={handleFileUpload}
                />

                {file ? (
                    <>
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                            <Check size={24} />
                        </div>
                        <p className="text-emerald-800 font-bold">{file.name}</p>
                        <p className="text-emerald-600 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                    </>
                ) : (
                    <>
                        <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                            <Upload size={24} />
                        </div>
                        <p className="text-slate-700 font-medium">Click to upload or drag & drop</p>
                        <p className="text-slate-400 text-sm mt-1">CSV files supported</p>
                    </>
                )}
            </div>

            <div className="w-full flex justify-between mt-6">
                <button
                    onClick={() => setStep(STEPS.MODE_SELECTION)}
                    className="text-slate-500 font-medium hover:text-slate-800"
                >
                    Back
                </button>
                <button
                    disabled={!file}
                    onClick={() => {
                        if (mode === MODES.TEMPLATE) {
                            runValidation();
                        } else {
                            setStep(STEPS.MAPPING);
                        }
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Next Step <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );

    const renderMapping = () => (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                    <span className="font-bold">Action Required:</span> Map your file columns to the corresponding CRM fields. Required fields (Name, Email) must be mapped.
                </div>
            </div>

            <div className="flex-1 overflow-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium sticky top-0">
                        <tr>
                            <th className="px-4 py-3 border-b border-slate-200">File Column</th>
                            <th className="px-4 py-3 border-b border-slate-200">Preview (Row 1)</th>
                            <th className="px-4 py-3 border-b border-slate-200 w-1/3">Map To Field</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {csvData.headers.map((header, index) => (
                            <tr key={index} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-medium text-slate-700">{header}</td>
                                <td className="px-4 py-3 text-slate-500 italic max-w-xs truncate">
                                    {csvData.rows[0]?.[index] || '-'}
                                </td>
                                <td className="px-4 py-2">
                                    <select
                                        className={`w-full px-3 py-1.5 rounded border focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-colors 
                                            ${mapping[index] ? 'border-blue-300 bg-blue-50 text-blue-700 font-medium' : 'border-slate-300 text-slate-600'}`}
                                        value={mapping[index] || ''}
                                        onChange={(e) => setMapping({ ...mapping, [index]: e.target.value })}
                                    >
                                        <option value="">Do Not Import</option>
                                        <optgroup label="Required">
                                            {AVAILABLE_FIELDS.filter(f => f.required).map(field => (
                                                <option key={field.id} value={field.id}>{field.label} *</option>
                                            ))}
                                        </optgroup>
                                        <optgroup label="Optional">
                                            {AVAILABLE_FIELDS.filter(f => !f.required).map(field => (
                                                <option key={field.id} value={field.id}>{field.label}</option>
                                            ))}
                                        </optgroup>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="w-full flex justify-between mt-6 pt-4 border-t border-slate-100">
                <button onClick={() => setStep(STEPS.UPLOAD)} className="text-slate-500 font-medium hover:text-slate-800">
                    Back
                </button>
                <button
                    onClick={runValidation}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2"
                >
                    Validate Data <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );

    const renderPreview = () => {
        const errorCount = validationResults.invalid.length;
        const validCount = validationResults.valid.length;
        const totalCount = csvData.rows.length;

        return (
            <div className="flex flex-col h-full">
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                        <div className="text-slate-500 text-xs uppercase font-bold tracking-wider mb-1">Total Rows</div>
                        <div className="text-2xl font-bold text-slate-800">{totalCount}</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg">
                        <div className="text-emerald-600 text-xs uppercase font-bold tracking-wider mb-1">Ready to Import</div>
                        <div className="text-2xl font-bold text-emerald-700">{validCount}</div>
                    </div>
                    <div className={`border p-4 rounded-lg ${errorCount > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-slate-200'}`}>
                        <div className={`${errorCount > 0 ? 'text-red-600' : 'text-slate-400'} text-xs uppercase font-bold tracking-wider mb-1`}>Errors</div>
                        <div className={`text-2xl font-bold ${errorCount > 0 ? 'text-red-700' : 'text-slate-300'}`}>{errorCount}</div>
                    </div>
                </div>

                {errorCount > 0 && (
                    <div className="flex-1 overflow-auto border border-red-100 bg-red-50/30 rounded-lg mb-4 p-4 flex flex-col items-center justify-center text-center">
                        <div className="mb-4">
                            <AlertTriangle size={32} className="text-red-500 mx-auto mb-2" />
                            <h4 className="text-red-800 font-bold">Action Required</h4>
                            <p className="text-sm text-red-600 max-w-sm mx-auto">
                                {errorCount} rows have critical errors and cannot be imported.
                                Please download the error report, fix the issues, and re-upload.
                            </p>
                        </div>

                        <button
                            onClick={downloadErrorReport}
                            className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 shadow-lg shadow-red-200 flex items-center gap-2 transition-transform active:scale-95"
                        >
                            <Download size={18} /> Download Error Report
                        </button>

                        <div className="mt-6 w-full max-w-md text-left bg-white rounded border border-red-100 p-3 shadow-sm">
                            <div className="text-xs font-bold text-slate-400 uppercase mb-2">Detailed Error Preview (Showing first 5)</div>
                            <ul className="space-y-2">
                                {validationResults.invalid.slice(0, 5).map((item, i) => (
                                    <li key={i} className="text-xs border-b border-slate-50 pb-2 last:border-0">
                                        <span className="font-mono font-bold text-red-600 mr-2">Row {item.row}</span>
                                        <span className="text-slate-700">{item.errors[0]}</span>
                                    </li>
                                ))}
                            </ul>
                            {errorCount > 5 && (
                                <div className="mt-2 text-xs text-center text-slate-400 italic">
                                    ...and {errorCount - 5} more rows.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {errorCount === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center text-emerald-600/50">
                        <ShieldCheck size={64} className="mb-4" />
                        <p className="font-medium text-emerald-800">All data looks good!</p>
                    </div>
                )}

                <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between gap-3 items-center">
                    <button
                        onClick={() => setStep(mode === MODES.TEMPLATE ? STEPS.UPLOAD : STEPS.MAPPING)}
                        className="text-slate-500 font-medium hover:text-slate-800"
                    >
                        Back
                    </button>

                    <div className="flex items-center gap-4">
                        {errorCount > 0 && validCount > 0 && (
                            <span className="text-xs text-slate-500 font-medium">
                                {errorCount} skipped
                            </span>
                        )}
                        <div className="relative group">
                            <button
                                onClick={executeImport}
                                disabled={validCount === 0}
                                className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2
                                ${validCount > 0
                                        ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                                    }`}
                            >
                                <Upload size={16} />
                                {validCount > 0 ? `Import ${validCount} Leads` : 'Import 0 Leads'}
                            </button>
                            {validCount === 0 && (
                                <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    Resolve errors to enable import
                                    <div className="absolute right-4 bottom-[-4px] w-2 h-2 bg-slate-800 rotate-45 transform"></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderImporting = () => (
        <div className="flex flex-col items-center justify-center py-12">
            <Loader2 size={48} className="text-blue-600 animate-spin mb-6" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Importing Leads...</h3>
            <p className="text-slate-500">Processing {validationResults.valid.length} records in background.</p>
        </div>
    );

    const renderResult = () => (
        <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6">
                <Check size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Import Complete</h3>
            <p className="text-slate-500 max-w-sm mb-8">
                Successfully imported <strong className="text-emerald-700">{importStats.success}</strong> leads.
                {importStats.failed > 0 && <span className="text-red-500"> {importStats.failed} rows were skipped due to errors.</span>}
                <br />Audit log #009382 has been created.
            </p>
            <div className="flex gap-4">
                <button
                    onClick={() => {
                        setStep(STEPS.MODE_SELECTION);
                        setFile(null);
                        setCsvData({ headers: [], rows: [] });
                        setValidationResults({ valid: [], invalid: [] });
                    }}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50"
                >
                    Import Another
                </button>
                <button
                    onClick={() => {
                        onClose();
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                    Done
                </button>
            </div>
            {importStats.failed > 0 && (
                <div className="mt-4">
                    <button
                        onClick={() => {
                            window.location.href = window.URL.createObjectURL(new Blob([JSON.stringify(validationResults.invalid)], { type: 'application/json' }));
                        }}
                        className="text-sm text-red-600 hover:text-red-700 underline flex items-center gap-1 mx-auto"
                    >
                        <FileText size={14} /> Download Error Log ({importStats.failed} items)
                    </button>
                </div>
            )}
        </div>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Import Leads</h2>
                        <div className="flex items-center gap-2 text-sm mt-1">
                            <span className={`px-2 py-0.5 rounded-full ${step === STEPS.MODE_SELECTION ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-400'}`}>1. Mode</span>
                            <ChevronRight size={12} className="text-slate-300" />
                            <span className={`px-2 py-0.5 rounded-full ${step === STEPS.UPLOAD ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-400'}`}>2. Upload</span>

                            {/* Only show Map step if in Custom Mode */}
                            {mode !== MODES.TEMPLATE && (
                                <>
                                    <ChevronRight size={12} className="text-slate-300" />
                                    <span className={`px-2 py-0.5 rounded-full ${step === STEPS.MAPPING ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-400'}`}>3. Map</span>
                                </>
                            )}

                            <ChevronRight size={12} className="text-slate-300" />
                            <span className={`px-2 py-0.5 rounded-full ${step === STEPS.PREVIEW ? 'bg-blue-100 text-blue-700 font-bold' : 'text-slate-400'}`}>{mode === MODES.TEMPLATE ? '3.' : '4.'} Preview</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 overflow-auto min-h-[400px]">
                    {step === STEPS.MODE_SELECTION && renderModeSelection()}
                    {step === STEPS.UPLOAD && renderUpload()}
                    {step === STEPS.MAPPING && renderMapping()}
                    {step === STEPS.PREVIEW && renderPreview()}
                    {step === STEPS.IMPORTING && renderImporting()}
                    {step === STEPS.RESULT && renderResult()}
                </div>

            </div>
        </div>
    );
};

export default ImportLeadsModal;
