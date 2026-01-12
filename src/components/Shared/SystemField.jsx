import React from 'react';

const SystemField = ({ label, value }) => (
    <div>
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">{label}</div>
        <div className="text-sm font-medium text-slate-700 truncate" title={value}>{value}</div>
    </div>
);

export default SystemField;
