import React from 'react';
import { LayoutTemplate, Plus } from 'lucide-react';

const CreditMemoTemplates = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Credit Memo Templates</h1>
                    <p className="text-slate-500">Design dynamic layouts for credit approval memorandums.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    <Plus size={18} />
                    New Template
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2].map(i => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden group cursor-pointer hover:border-blue-300 transition-colors">
                        <div className="h-40 bg-slate-100 border-b border-slate-200 flex items-center justify-center">
                            <LayoutTemplate size={48} className="text-slate-300 group-hover:text-blue-200 transition-colors" />
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-slate-800">Commercial Standard {i}</h3>
                            <p className="text-xs text-slate-500 mt-1">Last edited 2 days ago by Alex Morgan</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CreditMemoTemplates;
