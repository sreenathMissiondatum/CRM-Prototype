import React from 'react';
import {
    SquareCheck, StickyNote, Plus, Link as LinkIcon,
    ArrowUpRight, Building2, User
} from 'lucide-react';

const LeadContextSidebar = ({ lead }) => {
    return (
        <div className="flex flex-col h-full overflow-y-auto">
            {/* Quick Card */}
            <div className="p-4 border-b border-slate-100 bg-white">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Info</h3>
                <div className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                            <Building2 size={16} />
                        </div>
                        <div>
                            <div className="text-xs font-semibold text-slate-700">{lead.businessName}</div>
                            <div className="text-[10px] text-slate-500">Retail • 50-200 Employees</div>
                        </div>
                    </div>
                    <div className="text-xs text-slate-500">
                        <span className="block mb-1">Tax ID: <span className="text-slate-700 font-mono">XX-XXX1234</span></span>
                        <span className="block">Location: <span className="text-slate-700">Seattle, WA</span></span>
                    </div>
                </div>
            </div>

            {/* Tasks Section */}
            <div className="p-4 border-b border-slate-100">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <SquareCheck size={12} />
                        Next Steps
                    </h3>
                    <button className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="space-y-2">
                    <div className="group flex items-start gap-2 p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                        <div className="mt-0.5 w-4 h-4 rounded border border-slate-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                        <div>
                            <p className="text-xs text-slate-600 font-medium group-hover:text-slate-900">Follow-up Call</p>
                            <p className="text-[10px] text-red-400 font-medium">Due Today</p>
                        </div>
                    </div>
                    <div className="group flex items-start gap-2 p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                        <div className="mt-0.5 w-4 h-4 rounded border border-slate-300 group-hover:border-blue-400 flex items-center justify-center"></div>
                        <div>
                            <p className="text-xs text-slate-600 font-medium group-hover:text-slate-900">Send Docs List</p>
                            <p className="text-[10px] text-slate-400">Tomorrow</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Notes Section */}
            <div className="p-4 border-b border-slate-100">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <StickyNote size={12} />
                        Notes
                    </h3>
                    <button className="text-blue-600 hover:bg-blue-50 p-1 rounded transition-colors">
                        <Plus size={14} />
                    </button>
                </div>
                <div className="text-xs text-slate-500 italic bg-yellow-50/50 p-3 rounded-lg border border-yellow-100">
                    "Client mentioned they are also talking to Chase. We need to move fast."
                </div>
            </div>

            {/* Related Records */}
            <div className="p-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Related</h3>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600 cursor-pointer p-1.5 hover:bg-slate-100 rounded transition-colors">
                        <LinkIcon size={12} className="text-slate-400" />
                        <span>2 Previous Loans</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600 cursor-pointer p-1.5 hover:bg-slate-100 rounded transition-colors">
                        <User size={12} className="text-slate-400" />
                        <span>John Doe (Partner)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeadContextSidebar;
