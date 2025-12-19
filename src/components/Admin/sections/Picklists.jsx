import React, { useState } from 'react';
import { List, GripVertical, Plus, Trash2 } from 'lucide-react';

const Picklists = () => {
    const [activeList, setActiveList] = useState('Lead Source');
    const [items, setItems] = useState([
        { id: 1, label: 'Website Form', active: true },
        { id: 2, label: 'Referral Partner', active: true },
        { id: 3, label: 'Cold Outreach', active: true },
        { id: 4, label: 'LinkedIn', active: true },
        { id: 5, label: 'Conference / Event', active: false },
    ]);

    const lists = ['Lead Source', 'Lead Status', 'Industry', 'Loan Purpose', 'Decline Reasons'];

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Picklists & Metadata</h1>
                    <p className="text-slate-500">Manage dropdown options and system classifications.</p>
                </div>
            </div>

            <div className="flex gap-6 h-full items-start">
                {/* LIST SELECTOR */}
                <div className="w-64 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-xs text-slate-500 uppercase tracking-wider">
                        System Lists
                    </div>
                    <div className="divide-y divide-slate-100">
                        {lists.map(list => (
                            <button
                                key={list}
                                onClick={() => setActiveList(list)}
                                className={`w-full text-left px-4 py-3 text-sm font-medium transition-colors ${activeList === list
                                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                                        : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent'
                                    }`}
                            >
                                {list}
                            </button>
                        ))}
                    </div>
                </div>

                {/* EDITOR */}
                <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                        <h2 className="font-bold text-slate-800">{activeList} Options</h2>
                        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors">
                            <Plus size={14} /> Add Option
                        </button>
                    </div>
                    <div className="p-4 space-y-2">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg group hover:border-blue-300 hover:shadow-sm transition-all">
                                <GripVertical size={16} className="text-slate-300 cursor-move" />
                                <div className="flex-1 font-medium text-slate-700">{item.label}</div>
                                <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${item.active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                    {item.active ? 'Active' : 'Archived'}
                                </div>
                                <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Picklists;
