import React, { useState } from 'react';
import { FileText, File, Upload, Search, Download, MoreVertical, Plus } from 'lucide-react';

const DocumentTemplates = () => {
    const [templates, setTemplates] = useState([
        { id: 1, name: 'SBA 1919 - Borrower Information', type: 'PDF Form', size: '2.4 MB', updated: '2 days ago' },
        { id: 2, name: 'Personal Financial Statement (PFS)', type: 'Excel Template', size: '1.1 MB', updated: '1 week ago' },
        { id: 3, name: 'Debt Schedule Template', type: 'Excel Template', size: '850 KB', updated: '3 weeks ago' },
        { id: 4, name: 'Credit Authorization Form', type: 'E-Sign', size: '-', updated: '1 month ago' },
        { id: 5, name: 'Business Plan Outline', type: 'Word Doc', size: '45 KB', updated: '2 months ago' },
    ]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Document Templates</h1>
                    <p className="text-slate-500">Manage standard forms and templates for borrowers.</p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">
                        <Upload size={18} />
                        Upload
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        <Plus size={18} />
                        Create Template
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                {/* TOOLBAR */}
                <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search templates..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                        />
                    </div>
                </div>

                {/* GRID */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {templates.map(template => (
                            <div key={template.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group cursor-pointer flex flex-col items-center text-center relative">
                                <button className="absolute top-2 right-2 p-1.5 text-slate-400 hover:bg-slate-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={16} />
                                </button>

                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${template.type.includes('PDF') ? 'bg-red-50 text-red-600' :
                                        template.type.includes('Excel') ? 'bg-emerald-50 text-emerald-600' :
                                            template.type.includes('Word') ? 'bg-blue-50 text-blue-600' :
                                                'bg-indigo-50 text-indigo-600'
                                    }`}>
                                    <FileText size={24} />
                                </div>
                                <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 mb-1">{template.name}</h3>
                                <div className="text-xs text-slate-500 mb-4">{template.type} • {template.size}</div>

                                <button className="mt-auto w-full py-2 flex items-center justify-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors">
                                    <Download size={14} />
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentTemplates;
