import React, { useState } from 'react';
import { Mail, User, Type, FileText, ArrowRight } from 'lucide-react';

const Step1_Details = ({ data, onUpdate, onNext }) => {
    const [touched, setTouched] = useState({});

    const handleChange = (field, value) => {
        onUpdate({ ...data, [field]: value });
    };

    const handleBlur = (field) => {
        setTouched({ ...touched, [field]: true });
    };

    const isValid = data.name && data.name.trim().length > 0;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">
                    Campaign Details
                </h2>

                <div className="space-y-4">
                    {/* Campaign Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Campaign Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all ${touched.name && !data.name ? 'border-red-300 bg-red-50' : 'border-slate-200'
                                    }`}
                                placeholder="e.g. Q4 Customer Appreciation"
                                value={data.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                                onBlur={() => handleBlur('name')}
                                autoFocus
                            />
                            <Type className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        </div>
                        {touched.name && !data.name && (
                            <p className="text-xs text-red-500 mt-1">Campaign name is required.</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">
                            Description <span className="text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <textarea
                                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                rows="3"
                                placeholder="What is the goal of this campaign?"
                                value={data.description || ''}
                                onChange={(e) => handleChange('description', e.target.value)}
                            />
                            <FileText className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                        {/* Channel (Read Only) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Channel</label>
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                                <Mail size={16} />
                                <span className="font-medium text-sm">Email</span>
                            </div>
                        </div>

                        {/* Owner (Read Only) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Owner</label>
                            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600">
                                <User size={16} />
                                <span className="font-medium text-sm">Alex Morgan</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onNext}
                        disabled={!isValid}
                        className={`
                            px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all
                            ${isValid
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                                : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                        `}
                    >
                        Next: Select Template <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Step1_Details;
