import React from 'react';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const DocumentStats = ({ stats }) => {
    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard
                label="Requested"
                value={stats.requested}
                icon={FileText}
                color="blue"
            />
            <StatCard
                label="Uploaded"
                value={stats.uploaded}
                icon={CheckCircle2}
                color="emerald"
            />
            <StatCard
                label="Pending"
                value={stats.pending}
                icon={Clock}
                color="amber"
                isLoading={true} // Visual emphasis
            />
            <StatCard
                label="Overdue"
                value={stats.overdue}
                icon={AlertCircle}
                color="red"
            />
        </div>
    );
};

const StatCard = ({ label, value, icon: Icon, color, isLoading }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100',
        red: 'bg-red-50 text-red-700 border-red-100',
    };

    const iconColors = {
        blue: 'text-blue-500',
        emerald: 'text-emerald-500',
        amber: 'text-amber-500',
        red: 'text-red-500',
    };

    return (
        <div className={`
            p-4 rounded-xl border flex items-center justify-between shadow-sm transition-all
            ${colors[color]}
        `}>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">{label}</p>
                <h3 className="text-2xl font-bold">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg bg-white/60 ${iconColors[color]}`}>
                <Icon size={20} />
            </div>
        </div>
    );
};

export default DocumentStats;
