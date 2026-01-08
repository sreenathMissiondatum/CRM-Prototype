import React, { useState } from 'react';
import { Plus, Search, MoreVertical, FileCode, CheckCircle, Clock, Archive, Eye, Edit2, Play, AlertCircle, Trash2 } from 'lucide-react';

import { templateStore } from '../../../data/templateStore';

const TemplatesList = ({ onNavigate }) => {
    // Load from store
    const [templates, setTemplates] = useState(templateStore.getAll());

    // Refresh list on mount (in case of nav back)
    React.useEffect(() => {
        setTemplates(templateStore.getAll());
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved': return 'bg-green-50 text-green-700 border-green-100';
            case 'Draft': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Archived': return 'bg-slate-100 text-slate-500 border-slate-200';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Approved': return <CheckCircle size={12} />;
            case 'Draft': return <Clock size={12} />;
            case 'Archived': return <Archive size={12} />;
            default: return null;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => onNavigate('marketing-dashboard')} className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors">
                            Marketing
                        </button>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-800 text-sm font-medium">Templates</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Email Templates</h2>
                    <p className="text-slate-500">Manage, secure, and version your raw HTML templates.</p>
                </div>
                <button
                    onClick={() => onNavigate('marketing-template-upload')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2 shadow-sm transition-all hover:shadow-md"
                >
                    <Plus size={18} /> Upload New Template
                </button>
            </div>

            {/* Filters */}
            <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex gap-4 items-center flex-1">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            className="w-full pl-9 pr-4 py-1.5 border-none focus:ring-0 text-sm bg-transparent"
                        />
                    </div>
                    <div className="border-l border-slate-200 h-5"></div>
                    <div className="flex gap-1">
                        {['All', 'Approved', 'Draft', 'Archived'].map(filter => (
                            <button key={filter} className="px-3 py-1 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Table View */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-600">Template Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Version</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Status</th>
                            <th className="px-6 py-4 font-semibold text-slate-600">Last Modified</th>
                            <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {templates.map(template => (
                            <tr key={template.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${template.status === 'Archived' ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                                            <FileCode size={18} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-800">{template.name}</div>
                                            <div className="text-xs text-slate-400 font-mono">{template.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded text-xs">
                                        {template.version}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(template.status)} uppercase tracking-wide`}>
                                        {getStatusIcon(template.status)}
                                        {template.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-700">{template.lastModifiedBy}</span>
                                        <span className="text-xs text-slate-500">{template.lastModifiedDate}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {template.status === 'Draft' && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        templateStore.setSelectedId(template.id);
                                                        onNavigate('marketing-template-editor');
                                                    }}
                                                    title="Edit"
                                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Are you sure you want to approve this template?')) {
                                                            templateStore.update(template.id, { status: 'Approved' });
                                                            setTemplates(templateStore.getAll());
                                                        }
                                                    }}
                                                    title="Approve"
                                                    className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('Are you sure you want to permanently delete this draft?')) {
                                                            templateStore.delete(template.id);
                                                            setTemplates(templateStore.getAll());
                                                        }
                                                    }}
                                                    title="Delete Draft"
                                                    className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                        {template.status === 'Approved' && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        templateStore.setSelectedId(template.id);
                                                        onNavigate('marketing-template-editor');
                                                    }}
                                                    title="View"
                                                    className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        templateStore.setSelectedId(template.id);
                                                        onNavigate('marketing-campaign-preview');
                                                    }}
                                                    title="Create Campaign"
                                                    className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                >
                                                    <Play size={16} />
                                                </button>
                                            </>
                                        )}
                                        <button title="Archive" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Archive size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Audit Log Hint */}
            <div className="flex items-center justify-center pt-8">
                <span className="text-xs text-slate-400 flex items-center gap-1">
                    <AlertCircle size={12} /> Access, view, and edit events are logged for full auditability.
                </span>
            </div>
        </div>
    );
};

export default TemplatesList;
