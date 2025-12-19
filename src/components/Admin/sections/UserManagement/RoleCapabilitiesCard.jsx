import React from 'react';
import { Settings } from 'lucide-react';

const RoleCapabilitiesCard = ({ onClick }) => {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all group w-full max-w-md text-left mt-3"
        >
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <Settings size={20} />
            </div>
            <div>
                <div className="font-bold text-slate-700 group-hover:text-purple-700">Configure Capabilities</div>
                <div className="text-xs text-slate-500">Define access permissions for this role</div>
            </div>
        </button>
    );
};

export default RoleCapabilitiesCard;
