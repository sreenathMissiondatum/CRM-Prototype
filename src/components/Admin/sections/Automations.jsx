import React, { useState } from 'react';
import { Play, ArrowRight, Plus, Sliders, MessageSquare, Briefcase, FileText } from 'lucide-react';

const Automations = () => {
    const [workflows, setWorkflows] = useState([
        {
            id: 1,
            name: 'New Lead Assignment',
            trigger: 'Lead Created',
            action: 'Assign to Round Robin',
            active: true,
            icon: Briefcase,
            runs: 142
        },
        {
            id: 2,
            name: 'Document Upload Notification',
            trigger: 'Document Uploaded',
            action: 'Notify Loan Officer',
            active: true,
            icon: FileText,
            runs: 856
        },
        {
            id: 3,
            name: 'Welcome Email Drip',
            trigger: 'Status Changed to App Started',
            action: 'Send Email Template',
            active: false,
            icon: MessageSquare,
            runs: 0
        },
    ]);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Automations & Workflows</h1>
                    <p className="text-slate-500">Configure trigger-based rules and background processes.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                    <Plus size={18} />
                    New Workflow
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {workflows.map(flow => (
                    <div key={flow.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all group">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${flow.active ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                                    <flow.icon size={24} />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{flow.name}</h3>
                                        <div className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${flow.active ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                            {flow.active ? 'Active' : 'Inactive'}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 mt-3 text-sm">
                                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-md text-slate-600">
                                            <Play size={14} className="text-blue-500" />
                                            <span className="font-semibold">IF</span> {flow.trigger}
                                        </div>
                                        <ArrowRight size={16} className="text-slate-300" />
                                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-md text-slate-600">
                                            <Sliders size={14} className="text-emerald-500" />
                                            <span className="font-semibold">THEN</span> {flow.action}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-2xl font-bold text-slate-800">{flow.runs}</div>
                                <div className="text-xs text-slate-500 uppercase tracking-wide font-medium">Total Runs</div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* New Workflow Teaser */}
                <button className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-blue-100 flex items-center justify-center mb-3 transition-colors">
                        <Plus size={24} />
                    </div>
                    <span className="font-medium">Create Logic Rule</span>
                </button>
            </div>
        </div>
    );
};

export default Automations;
