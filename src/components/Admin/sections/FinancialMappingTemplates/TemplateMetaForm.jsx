import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Map, AlertCircle } from 'lucide-react';
import { SOURCE_TYPES, INDUSTRIES } from '../../../../data/mockMappingTemplates';

/**
 * Step 1 of the Create/Edit Template flow.
 * Captures metadata: name, source type, industry, description.
 */
const TemplateMetaForm = ({ existingNames = [], initialValues = {}, onSubmit, onCancel }) => {
    const [form, setForm] = useState({
        name: initialValues.name || '',
        sourceType: initialValues.sourceType || '',
        industry: initialValues.industry || '',
        description: initialValues.description || '',
    });
    const [touched, setTouched] = useState({});

    const set = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
        setTouched(t => ({ ...t, [field]: true }));
    };

    const isDuplicateName = existingNames.includes(form.name.trim()) && form.name.trim() !== (initialValues.name || '');
    const nameError = touched.name && !form.name.trim() ? 'Template name is required.' : isDuplicateName ? 'This name is already in use.' : null;
    const sourceError = touched.sourceType && !form.sourceType ? 'Source type is required.' : null;

    const isValid = form.name.trim() && form.sourceType && !isDuplicateName;

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ name: true, sourceType: true });
        if (!isValid) return;
        onSubmit({ ...form, name: form.name.trim() });
    };

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* HEADER */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center gap-4 shadow-sm">
                <button onClick={onCancel} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
                    <ArrowLeft size={18} />
                </button>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-white"><Map size={18} /></div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900">Create Template — Step 1 of 2</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Set the template metadata before defining mapping rules</p>
                    </div>
                </div>
                {/* Breadcrumb */}
                <div className="ml-auto flex items-center gap-2 text-xs">
                    <span className="px-3 py-1.5 bg-blue-600 text-white font-bold rounded-full">1 Metadata</span>
                    <span className="text-slate-300">→</span>
                    <span className="px-3 py-1.5 bg-slate-100 text-slate-400 font-bold rounded-full">2 Mapping Rules</span>
                </div>
            </div>

            {/* FORM */}
            <div className="flex-1 overflow-y-auto flex items-start justify-center py-10 px-8">
                <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col gap-6">

                    {/* Template Name */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Template Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => set('name', e.target.value)}
                            onBlur={() => setTouched(t => ({ ...t, name: true }))}
                            placeholder="e.g. QuickBooks Standard — Small Business"
                            className={`w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${nameError ? 'border-rose-400 bg-rose-50' : 'border-slate-300 bg-white'}`}
                        />
                        {nameError && (
                            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                                <AlertCircle size={12} /> {nameError}
                            </p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1">Must be unique across all templates.</p>
                    </div>

                    {/* Source Type */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                            Source Type <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex gap-3 flex-wrap">
                            {SOURCE_TYPES.map(st => (
                                <button
                                    type="button"
                                    key={st}
                                    onClick={() => set('sourceType', st)}
                                    className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${form.sourceType === st ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' : 'bg-white text-slate-600 border-slate-300 hover:border-blue-400 hover:text-blue-600'}`}
                                >
                                    {st}
                                </button>
                            ))}
                        </div>
                        {sourceError && (
                            <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                                <AlertCircle size={12} /> {sourceError}
                            </p>
                        )}
                    </div>

                    {/* Industry */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Industry <span className="text-slate-400 font-normal normal-case">(Optional)</span></label>
                        <select
                            value={form.industry}
                            onChange={e => set('industry', e.target.value)}
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                            <option value="">Select industry...</option>
                            {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">Description <span className="text-slate-400 font-normal normal-case">(Optional)</span></label>
                        <textarea
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            rows={3}
                            placeholder="Describe when and how this template should be used..."
                            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!isValid}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-md shadow-blue-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Continue <ArrowRight size={16} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TemplateMetaForm;
