import React from 'react';

const Field = ({ label, value, onChange, type = 'text', readOnly = false, required = false, className = '' }) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
            <textarea
                className={`w-full text-sm border rounded-lg px-3 py-2 outline-none transition-all ${readOnly
                    ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed resize-none'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800'
                    }`}
                value={value}
                onChange={e => !readOnly && onChange(e.target.value)}
                readOnly={readOnly}
                rows={3}
            />
        ) : (
            <input
                type={type}
                className={`w-full text-sm border rounded-lg px-3 py-2 outline-none transition-all ${readOnly
                    ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed font-medium'
                    : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-slate-800'
                    }`}
                value={value}
                onChange={e => !readOnly && onChange(e.target.value)}
                readOnly={readOnly}
            />
        )}
    </div>
);

export default Field;
