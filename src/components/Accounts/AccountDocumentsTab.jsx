import React, { useState, useMemo } from 'react';
import {
    Search, Filter, Upload, FileText,
    Clock, ChevronRight, Download,
    Eye, MoreHorizontal, FileCheck,
    AlertTriangle, History, Shield,
    CornerDownRight, X, AlertCircle,
    Bell, CheckCircle
} from 'lucide-react';

import DocumentUploadWidget from '../Shared/DocumentUploadWidget';

const AccountDocumentsTab = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const [filterCategory, setFilterCategory] = useState('All');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);


    // Mock Date for Demo Purpose: 2024-03-15
    const TODAY = new Date('2024-03-15');

    // Helper: Calculate Status
    const calculateStatus = (expiryDate) => {
        if (!expiryDate) return 'Valid';
        const exp = new Date(expiryDate);
        const diffTime = exp - TODAY;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Expired';
        if (diffDays <= 30) return 'Expiring Soon';
        return 'Valid';
    };

    // Mock Data with Expiry
    const rawDocuments = [
        {
            id: 'DOC-001',
            name: 'Articles of Incorporation',
            category: 'Business Formation',
            expiryDate: null, // Perpetual
            expiryApplicable: false,
            borrowerVisible: true,
            version: 'v2.0',
            lastReviewed: '2023-11-15',
            linkedLoans: 3,
            versions: [
                { version: 'v2.0', date: '2023-11-15', user: 'Sarah Jenkins', reason: 'Amendment filed', file: 'articles_inc_v2.pdf' },
                { version: 'v1.0', date: '2018-03-15', user: 'System Import', reason: 'Initial onboarding', file: 'articles_inc_v1.pdf' }
            ]
        },
        {
            id: 'DOC-002',
            name: 'Business License (City of Detroit)',
            category: 'Licenses',
            expiryDate: '2024-01-15', // Expired relative to 2024-03-15
            expiryApplicable: true,
            borrowerVisible: true,
            version: 'v4.0',
            lastReviewed: '2023-01-10',
            linkedLoans: 5,
            versions: [
                { version: 'v4.0', date: '2023-01-10', user: 'Mike Ross', reason: 'Annual renewal', file: 'license_2023.pdf' }
            ]
        },
        {
            id: 'DOC-003',
            name: 'Certificate of Good Standing',
            category: 'Business Formation',
            expiryDate: '2024-04-01', // Expiring Soon (within 30 days of March 15)
            expiryApplicable: true,
            borrowerVisible: false,
            version: 'v1.0',
            lastReviewed: '2023-04-01',
            linkedLoans: 1,
            versions: [
                { version: 'v1.0', date: '2023-04-01', user: 'Sarah Miller', reason: 'Loan Requirement', file: 'cert_good_standing.pdf' }
            ]
        },
        {
            id: 'DOC-004',
            name: 'General Liability Insurance',
            category: 'Insurance',
            expiryDate: '2025-01-05', // Valid
            expiryApplicable: true,
            borrowerVisible: true,
            version: 'v3.0',
            lastReviewed: '2024-01-05',
            linkedLoans: 3,
            versions: [
                { version: 'v3.0', date: '2024-01-05', user: 'Insurance Broker', reason: 'Policy Renewal', file: 'insurance_2024.pdf' },
                { version: 'v2.0', date: '2023-01-05', user: 'Mike Ross', reason: 'Policy Renewal', file: 'insurance_2023.pdf' }
            ]
        },
        {
            id: 'DOC-005',
            name: 'Operating Agreement',
            category: 'Ownership',
            expiryDate: null,
            expiryApplicable: false,
            borrowerVisible: false,
            version: 'v1.0',
            lastReviewed: '2018-03-20',
            linkedLoans: 3,
            versions: [
                { version: 'v1.0', date: '2018-03-20', user: 'Sarah Jenkins', reason: 'Initial Formation', file: 'operating_agreement.pdf' }
            ]
        }
    ];

    // Compute Derived State
    const documents = useMemo(() => {
        return rawDocuments.map(doc => ({
            ...doc,
            status: calculateStatus(doc.expiryDate)
        }));
    }, []);

    const alerts = useMemo(() => {
        const expired = documents.filter(d => d.status === 'Expired').length;
        const expiring = documents.filter(d => d.status === 'Expiring Soon').length;
        return { expired, expiring };
    }, [documents]);

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'All' || doc.category === filterCategory;
        const matchesStatus = filterStatus === 'All' || doc.status === filterStatus;
        return matchesSearch && matchesCategory && matchesStatus;
    });

    // Formatting
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // UI Helpers
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Valid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Expired': return 'bg-red-100 text-red-700 border-red-200';
            case 'Expiring Soon': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-slate-100 text-slate-700 border-slate-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Valid': return <CheckCircle size={14} />;
            case 'Expired': return <AlertCircle size={14} />;
            case 'Expiring Soon': return <Clock size={14} />;
            default: return <FileText size={14} />;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-220px)] relative">

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <DocumentUploadWidget
                        context="internal"
                        onCancel={() => setShowUploadModal(false)}
                        onUploadComplete={(data) => {
                            console.log('Uploaded:', data);
                            setShowUploadModal(false);
                        }}
                    />
                </div>
            )}

            {/* Compliance Alerts Section */}

            {(alerts.expired > 0 || alerts.expiring > 0) && (
                <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {alerts.expired > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-red-800">Action Required: {alerts.expired} Expired Document{alerts.expired > 1 ? 's' : ''}</h4>
                                <p className="text-xs text-red-600 mt-1">
                                    System has automatically generated {alerts.expired} high-priority compliance task{alerts.expired > 1 ? 's' : ''}.
                                </p>
                            </div>
                            <button className="text-xs font-bold text-red-700 hover:underline bg-white/50 px-2 py-1 rounded border border-red-200">
                                View Tasks
                            </button>
                        </div>
                    )}
                    {alerts.expiring > 0 && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                            <Clock className="text-amber-600 shrink-0 mt-0.5" size={20} />
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-amber-800">Attention: {alerts.expiring} Document{alerts.expiring > 1 ? 's' : ''} Expiring Soon</h4>
                                <p className="text-xs text-amber-600 mt-1">
                                    Renewal tasks have been assigned to the account owner.
                                </p>
                            </div>
                            <button className="text-xs font-bold text-amber-700 hover:underline bg-white/50 px-2 py-1 rounded border border-amber-200">
                                View Tasks
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="flex flex-1 overflow-hidden">
                {/* Main Content: Document Repository */}
                <div className={`flex-1 flex flex-col transition-all duration-300 ${selectedDoc ? 'pr-6 mr-96' : ''}`}>

                    {/* Toolbar */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="relative w-64">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="h-6 w-px bg-slate-200 mx-1"></div>
                            <FilterDropdown
                                value={filterCategory}
                                onChange={setFilterCategory}
                                label="Category"
                                options={['All', 'Business Formation', 'Licenses', 'Ownership', 'Insurance', 'Other']}
                            />
                            <FilterDropdown
                                value={filterStatus}
                                onChange={setFilterStatus}
                                label="Status"
                                options={['All', 'Valid', 'Expiring Soon', 'Expired']}
                            />
                        </div>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
                        >
                            <Upload size={16} /> Upload Document
                        </button>

                    </div>

                    {/* Documents Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
                        <div className="overflow-y-auto flex-1">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 font-semibold text-slate-500">Document Name</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500">Category</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500">Expiry Date</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500">Status</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 text-center">Version</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 text-center">Visibility</th>
                                        <th className="px-6 py-4 font-semibold text-slate-500 w-24">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredDocs.map((doc) => (
                                        <tr
                                            key={doc.id}
                                            onClick={() => setSelectedDoc(doc)}
                                            className={`cursor-pointer transition-colors group ${selectedDoc?.id === doc.id ? 'bg-blue-50/60' : 'hover:bg-slate-50/50'
                                                }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded ${selectedDoc?.id === doc.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                                        <FileText size={18} />
                                                    </div>
                                                    <div>
                                                        <div className={`font-bold ${selectedDoc?.id === doc.id ? 'text-blue-700' : 'text-slate-800'}`}>
                                                            {doc.name}
                                                        </div>
                                                        <div className="text-xs text-slate-400 font-mono">{doc.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-600 bg-slate-50 px-2 py-1 rounded text-xs border border-slate-200">
                                                    {doc.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-slate-700">
                                                {formatDate(doc.expiryDate)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(doc.status)}`}>
                                                    {getStatusIcon(doc.status)}
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="font-mono text-xs text-slate-600">{doc.version}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {doc.borrowerVisible ? (
                                                    <div title="Visible to Borrower" className="inline-flex justify-center text-emerald-600 bg-emerald-50 p-1.5 rounded-full">
                                                        <Eye size={14} />
                                                    </div>
                                                ) : (
                                                    <div title="Internal Only" className="inline-flex justify-center text-slate-400 bg-slate-100 p-1.5 rounded-full">
                                                        <Shield size={14} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        title="View Versions"
                                                        className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors mr-2"
                                                    >
                                                        <History size={14} />
                                                    </button>
                                                    <button
                                                        title="More"
                                                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                                                    >
                                                        <MoreHorizontal size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Drawer: Version History */}
                {selectedDoc && (
                    <div className="fixed right-0 top-[180px] bottom-0 w-[400px] bg-white border-l border-slate-200 shadow-2xl z-20 flex flex-col animate-in slide-in-from-right duration-300">
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                            <div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                    Document Details
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                                    {selectedDoc.name}
                                </h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-slate-500 text-xs">{selectedDoc.category}</span>
                                    <span className="text-slate-300">•</span>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(selectedDoc.status)}`}>
                                        {selectedDoc.status}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedDoc(null)}
                                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Drawer Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Alert Logic in Drawer */}
                            {selectedDoc.status !== 'Valid' && (
                                <div className={`border rounded-lg p-3 flex items-start gap-3 ${selectedDoc.status === 'Expired' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
                                    }`}>
                                    <Bell size={16} className={selectedDoc.status === 'Expired' ? 'text-red-600' : 'text-amber-600'} />
                                    <div>
                                        <div className={`text-sm font-bold ${selectedDoc.status === 'Expired' ? 'text-red-800' : 'text-amber-800'}`}>
                                            {selectedDoc.status === 'Expired' ? 'Document Expired' : 'Expires Soon'}
                                        </div>
                                        <div className={`text-xs mt-1 ${selectedDoc.status === 'Expired' ? 'text-red-700' : 'text-amber-700'}`}>
                                            Expiry Date: {formatDate(selectedDoc.expiryDate)}
                                            <br />
                                            A task has been created for the account owner.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Configurations */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Configuration</h4>
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-slate-700">Expiry Tracking</span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${selectedDoc.expiryApplicable ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                                            {selectedDoc.expiryApplicable ? 'Active' : 'Disabled'}
                                        </span>
                                    </div>
                                    {selectedDoc.expiryApplicable && (
                                        <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                                            <span className="text-sm font-medium text-slate-700">Expiry Date</span>
                                            <span className="text-sm font-mono text-slate-900">{formatDate(selectedDoc.expiryDate)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-700">Borrower Visible</span>
                                            <span className="text-[10px] text-slate-400">Can borrower view this in portal?</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full relative transition-colors ${selectedDoc.borrowerVisible ? 'bg-blue-600' : 'bg-slate-300'}`}>
                                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${selectedDoc.borrowerVisible ? 'left-[22px]' : 'left-0.5'}`}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">Version History</h4>
                                <div className="relative pl-6 border-l-2 border-slate-100 space-y-8">
                                    {selectedDoc.versions.map((ver, idx) => (
                                        <div key={ver.version} className="relative">
                                            {/* Node */}
                                            <div className={`absolute -left-[29px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${idx === 0 ? 'bg-blue-600' : 'bg-slate-300'
                                                }`}>
                                            </div>

                                            {/* Content */}
                                            <div className="flex flex-col gap-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-sm font-bold ${idx === 0 ? 'text-slate-900' : 'text-slate-500'}`}>
                                                                {ver.version}
                                                            </span>
                                                            {idx === 0 && (
                                                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                                                                    Current
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-xs text-slate-500">{ver.date}</div>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                                                    <div className="grid grid-cols-1 gap-1 text-xs">
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">User:</span>
                                                            <span className="text-slate-800 font-medium">{ver.user}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-500">Reason:</span>
                                                            <span className="text-slate-800 italic">{ver.reason}</span>
                                                        </div>
                                                        <div className="flex justify-between pt-1 mt-1 border-t border-slate-200">
                                                            <span className="text-slate-500">File:</span>
                                                            <span className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                                                {ver.file}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Drawer Footer */}
                        <div className="p-4 border-t border-slate-200 bg-slate-50">
                            <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-sm">
                                <Upload size={16} /> Upload New Version
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const FilterDropdown = ({ value, onChange, options, label }) => (
    <div className="relative group z-10">
        <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
            {label ? <span className="text-slate-400 font-medium text-xs uppercase mr-1">{label}:</span> : <Filter size={14} />}
            <span className="font-semibold text-slate-700">{value}</span>
        </button>
        <div className="hidden group-hover:block absolute top-full left-0 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 mt-1">
            {options.map(opt => (
                <button
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`block w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${value === opt ? 'text-blue-600 font-bold bg-blue-50/50' : 'text-slate-600'
                        }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

export default AccountDocumentsTab;
