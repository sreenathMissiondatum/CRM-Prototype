import React from 'react';
import { User, Building2, Link, Sliders } from 'lucide-react';

const RelationshipsTab = () => {
    // Recreated Mock Data
    const relationships = [
        { id: 1, name: 'Sarah Jenkins', role: 'Owner / CEO', type: 'Individual', ownership: '65%', relatedEntity: null },
        { id: 2, name: 'Mike Ross', role: 'CFO', type: 'Individual', ownership: '5%', relatedEntity: null },
        { id: 3, name: 'Jenkins Properties LLC', role: 'Holding Company', type: 'Entity', ownership: '0%', relatedEntity: 'Parent Co.' },
        { id: 4, name: 'David Miller', role: 'Guarantor', type: 'Individual', ownership: '30%', relatedEntity: null },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Entity Relationships</h2>
                    <p className="text-slate-500 mt-1">Manage owners, guarantors, and affiliated entities.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-200 font-bold rounded-lg hover:bg-blue-50 transition-colors">
                    <Link size={16} /> Map Relationship
                </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-slate-500">Name</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Role</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Ownership</th>
                            <th className="px-6 py-4 font-semibold text-slate-500">Type</th>
                            <th className="px-6 py-4 font-semibold text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {relationships.map((rel) => (
                            <tr key={rel.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                            {rel.type === 'Entity' ? <Building2 size={16} /> : <User size={16} />}
                                        </div>
                                        <span className="font-bold text-slate-800">{rel.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-600">{rel.role}</td>
                                <td className="px-6 py-4 text-slate-600 font-mono">{rel.ownership}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${rel.type === 'Entity' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                                        {rel.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-slate-400 hover:text-blue-600 rounded transition-colors">
                                        <Sliders size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RelationshipsTab;
