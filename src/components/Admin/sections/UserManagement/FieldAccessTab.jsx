import React, { useState } from 'react';
import { Eye, EyeOff, Edit2, Lock, ChevronDown, ChevronRight, Hash } from 'lucide-react';

const FieldAccessTab = () => {
    const [expandedObj, setExpandedObj] = useState('leads');

    const objects = [
        {
            id: 'leads',
            label: 'Leads',
            fields: [
                { id: 'ssn', label: 'SSN / Tax ID', type: 'Sensitive', access: 'mask' },
                { id: 'income', label: 'Annual Income', type: 'Financial', access: 'read' },
                { id: 'credit', label: 'Credit Score', type: 'Financial', access: 'read' },
                { id: 'phone', label: 'Phone Number', type: 'Contact', access: 'edit' },
            ]
        },
        {
            id: 'loans',
            label: 'Loans',
            fields: [
                { id: 'amt', label: 'Loan Amount', type: 'Financial', access: 'read' },
                { id: 'rate', label: 'Interest Rate', type: 'Financial', access: 'read' },
            ]
        },
    ];

    return (
        <div className="flex gap-6 px-6 pb-6">
            {/* Object List */}
            <div className="w-64 bg-white rounded-xl border border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-100 font-bold text-slate-700 text-sm">Objects</div>
                <div className="p-2 space-y-1">
                    {objects.map(obj => (
                        <button
                            key={obj.id}
                            onClick={() => setExpandedObj(obj.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-colors ${expandedObj === obj.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <span>{obj.label}</span>
                            <ChevronRight size={14} className={`transition-transform ${expandedObj === obj.id ? 'rotate-90 text-blue-500' : 'text-slate-300'}`} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Field List & Controls */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Field Level Security: {objects.find(o => o.id === expandedObj)?.label}</h2>
                    <p className="text-sm text-slate-500">Define default access levels for sensitive fields.</p>
                </div>

                <div className="">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 sticky top-0 z-10">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Field Name</th>
                                <th className="text-left py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Data Type</th>
                                <th className="text-center py-3 px-6 text-xs font-bold text-slate-400 uppercase tracking-wider">Default Access</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {objects.find(o => o.id === expandedObj)?.fields.map(field => (
                                <tr key={field.id} className="hover:bg-slate-50/30 group">
                                    <td className="py-4 px-6">
                                        <div className="font-bold text-slate-700 text-sm">{field.label}</div>
                                        <div className="text-xs text-slate-400 font-mono mt-0.5">{field.id}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${field.type === 'Sensitive' ? 'bg-red-50 text-red-600 border-red-100' :
                                            field.type === 'Financial' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                'bg-slate-100 text-slate-500 border-slate-200'
                                            }`}>
                                            {field.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-center gap-1 bg-slate-100 p-1 rounded-lg w-fit mx-auto">
                                            <button className={`p-1.5 rounded-md transition-all ${field.access === 'edit' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="Read & Edit">
                                                <Edit2 size={14} />
                                            </button>
                                            <button className={`p-1.5 rounded-md transition-all ${field.access === 'read' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="Read Only">
                                                <Eye size={14} />
                                            </button>
                                            <button className={`p-1.5 rounded-md transition-all ${field.access === 'mask' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="Masked">
                                                <Hash size={14} />
                                            </button>
                                            <button className={`p-1.5 rounded-md transition-all ${field.access === 'hidden' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`} title="Hidden">
                                                <EyeOff size={14} />
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
    );
};

export default FieldAccessTab;
