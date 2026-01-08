import React, { useState } from 'react';
import { Search, FileCode, ArrowRight, ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { templateStore } from '../../../../data/templateStore';

const Step2_Template = ({ data, onUpdate, onNext, onBack }) => {
    const [selectedTemplateId, setSelectedTemplateId] = useState(data.templateId || null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch and Filter Templates (Approved Only)
    const templates = templateStore.getAll().filter(t =>
        t.status === 'Approved' &&
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedTemplate = templates.find(t => t.id === selectedTemplateId);

    const handleSelect = (templateId) => {
        setSelectedTemplateId(templateId);
        onUpdate({
            ...data,
            templateId: templateId,
            templateName: templates.find(t => t.id === templateId)?.name
        });
    };

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-500">
            <div className="flex-1 flex overflow-hidden rounded-xl border border-slate-200 shadow-sm bg-white">

                {/* Left Panel: Template List */}
                <div className="w-1/3 border-r border-slate-200 flex flex-col">
                    <div className="p-4 border-b border-slate-200 bg-slate-50">
                        <h3 className="font-bold text-slate-700 mb-2">Select Template</h3>
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search templates..."
                                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {templates.length === 0 ? (
                            <div className="p-8 text-center text-slate-400 text-sm">
                                No approved templates found.
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {templates.map(t => (
                                    <div
                                        key={t.id}
                                        onClick={() => handleSelect(t.id)}
                                        className={`
                                            p-4 cursor-pointer transition-all hover:bg-slate-50
                                            ${selectedTemplateId === t.id ? 'bg-blue-50 border-l-4 border-blue-500' : 'border-l-4 border-transparent'}
                                        `}
                                    >
                                        <div className="font-semibold text-slate-800 text-sm truncate">{t.name}</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-xs text-slate-500 font-mono">{t.version}</span>
                                            <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold">Approved</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Preview */}
                <div className="w-2/3 bg-slate-50 flex flex-col">
                    {selectedTemplate ? (
                        <div className="flex-1 flex flex-col h-full">
                            <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-slate-800">{selectedTemplate.name}</h4>
                                    <p className="text-xs text-slate-500">Last Modified: {selectedTemplate.lastModifiedDate}</p>
                                </div>
                                <div className="text-xs flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                    <FileCode size={12} /> HTML Source
                                </div>
                            </div>
                            <div className="flex-1 p-8 overflow-y-auto">
                                <div className="bg-white shadow-sm border border-slate-200 rounded-lg min-h-[400px] p-8">
                                    {/* Safe Render Preview (Simplified) */}
                                    <div
                                        className="prose prose-sm max-w-none pointer-events-none select-none"
                                        dangerouslySetInnerHTML={{ __html: selectedTemplate.content }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                                <ArrowRight size={32} />
                            </div>
                            <p>Select a template from the list to preview.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 flex justify-between">
                <button
                    onClick={onBack}
                    className="px-6 py-2 text-slate-600 font-medium hover:text-slate-900 flex items-center gap-2"
                >
                    <ArrowLeft size={18} /> Back
                </button>
                <button
                    onClick={onNext}
                    disabled={!selectedTemplateId}
                    className={`
                        px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all
                        ${selectedTemplateId
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                    `}
                >
                    Next: Select Leads <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default Step2_Template;
