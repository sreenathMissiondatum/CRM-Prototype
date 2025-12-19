import React from 'react';
import { DollarSign, AlertTriangle, TrendingUp, CreditCard } from 'lucide-react';

const MetricCard = ({ title, value, change, icon: Icon, colorClass }) => (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 text-opacity-100`}>
                <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
            </div>
            {change && (
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${change.type === 'positive' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {change.value}
                </span>
            )}
        </div>
        <div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const MetricGrid = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
                title="Total Deposits"
                value="$1,250,000"
                change={{ type: 'positive', value: '+12.5%' }}
                icon={DollarSign}
                colorClass="bg-emerald-500 text-emerald-600"
            />
            <MetricCard
                title="Outstanding Loans"
                value="$450,000"
                change={{ type: 'negative', value: '+5.2%' }}
                icon={CreditCard}
                colorClass="bg-blue-500 text-blue-600"
            />
            <MetricCard
                title="Risk Rating"
                value="Level 4"
                change={{ type: 'neutral', value: 'Stable' }}
                icon={AlertTriangle}
                colorClass="bg-amber-500 text-amber-600"
            />
            <MetricCard
                title="YTD Revenue"
                value="$124,500"
                change={{ type: 'positive', value: '+8.3%' }}
                icon={TrendingUp}
                colorClass="bg-purple-500 text-purple-600"
            />
        </div>
    );
};

export default MetricGrid;
