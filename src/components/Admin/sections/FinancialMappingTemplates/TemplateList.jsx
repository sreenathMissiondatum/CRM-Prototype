import React, { useState } from 'react';
import {
    Plus, MoreHorizontal, Search, Filter, Copy, Edit2,
    Trash2, ToggleLeft, ToggleRight, Eye, ChevronUp, ChevronDown, Map
} from 'lucide-react';
import { MappingTemplatesStore } from '../../../../data/mockMappingTemplates';
const statusBadge = (status) => {
    if (status === 'Active') return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    return 'bg-slate-100 text-slate-500 border border-slate-200';
};

const coverageColor = (pct) => {
    if (pct >= 80) return 'text-emerald-600';
    if (pct >= 50) return 'text-amber-600';
    return 'text-rose-600';
};

const CloneModal = ({ template, existingNames, onConfirm, onClose }) => {
    const [name, setName] = useState(`${template.name} — Copy`);
    const isDuplicate = existingNames.includes(name.trim());

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Clone Template</h3>
                <p className="text-sm text-slate-500 mb-4">All mappings from <span className="font-semibold">"{template.name}"</span> will be copied.</p>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">New Template Name *</label>
                <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDuplicate ? 'border-rose-400 bg-rose-50' : 'border-slate-300'}`}
                />
                {isDuplicate && <p className="text-xs text-rose-600 mt-1 font-medium">A template with this name already exists.</p>}
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                    <button
                        onClick={() => onConfirm(name.trim())}
                        disabled={!name.trim() || isDuplicate}
                        className="px-5 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Clone Template
                    </button>
                </div>
            </div>
        </div>
    );
};

const TemplateList = ({ templates, onCreateNew, onEdit, onClone, onSetStatus, onDelete }) => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // all | Active | Inactive
    const [sortField, setSortField] = useState('updatedAt');
    const [sortDir, setSortDir] = useState('desc');
    const [openMenuId, setOpenMenuId] = useState(null);
    const [cloneTarget, setCloneTarget] = useState(null);

    const existingNames = templates.map(t => t.name);

    const toggleSort = (field) => {
        if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
        else { setSortField(field); setSortDir('asc'); }
    };

    const SortIcon = ({ field }) => {
        if (sortField !== field) return <ChevronUp size={11} className="text-slate-300" />;
        return sortDir === 'asc' ? <ChevronUp size={11} className="text-blue-500" /> : <ChevronDown size={11} className="text-blue-500" />;
    };

    const filtered = templates
        .filter(t => {
            const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                (t.industry || '').toLowerCase().includes(search.toLowerCase()) ||
                t.sourceType.toLowerCase().includes(search.toLowerCase());
            const matchStatus = statusFilter === 'all' || t.status === statusFilter;
            return matchSearch && matchStatus;
        })
        .sort((a, b) => {
            let va = a[sortField], vb = b[sortField];
            if (sortField === 'updatedAt') { va = new Date(va); vb = new Date(vb); }
            if (typeof va === 'string') va = va.toLowerCase();
            if (typeof vb === 'string') vb = vb.toLowerCase();
            if (va < vb) return sortDir === 'asc' ? -1 : 1;
            if (va > vb) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });

    const latestVersion = (t) => t.versions[t.versions.length - 1];
    const coverage = (t) => MappingTemplatesStore.computeCoverage(latestVersion(t).mappings);

    return (
        <div className="h-full flex flex-col bg-slate-50">
            {/* PAGE HEADER */}
            <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-lg text-white">
                        <Map size={18} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Financial Mapping Templates</h1>
                        <p className="text-xs text-slate-500 mt-0.5">Define reusable Raw → Canonical mappings for financial statement normalization</p>
                    </div>
                </div>
                <button
                    onClick={onCreateNew}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg shadow-md shadow-blue-200 transition-colors"
                >
                    <Plus size={16} /> Create Template
                </button>
            </div>

            {/* FILTERS */}
            <div className="bg-white border-b border-slate-200 px-8 py-3 flex items-center gap-4">
                <div className="relative w-72">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search templates..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                    />
                </div>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    {['all', 'Active', 'Inactive'].map(s => (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-3 py-1 text-xs font-bold rounded-md capitalize transition-all ${statusFilter === s ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            {s === 'all' ? 'All' : s}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-slate-400 ml-auto">{filtered.length} template{filtered.length !== 1 ? 's' : ''}</span>
            </div>

            {/* TABLE */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                {[
                                    { label: 'Template Name', field: 'name' },
                                    { label: 'Source Type', field: 'sourceType' },
                                    { label: 'Industry', field: 'industry' },
                                    { label: 'Coverage', field: null },
                                    { label: 'Usage', field: 'usageCount' },
                                    { label: 'Last Updated', field: 'updatedAt' },
                                    { label: 'Status', field: 'status' },
                                    { label: '', field: null },
                                ].map(({ label, field }) => (
                                    <th
                                        key={label}
                                        className={`px-5 py-3 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider ${field ? 'cursor-pointer hover:text-slate-800 select-none' : ''}`}
                                        onClick={() => field && toggleSort(field)}
                                    >
                                        <div className="flex items-center gap-1">
                                            {label}
                                            {field && <SortIcon field={field} />}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-8 py-16 text-center">
                                        <Map size={32} className="mx-auto mb-3 text-slate-300" />
                                        <p className="text-slate-400 font-medium">No templates found</p>
                                        <button onClick={onCreateNew} className="mt-3 text-blue-600 text-sm font-semibold hover:underline">Create your first template →</button>
                                    </td>
                                </tr>
                            )}
                            {filtered.map(t => {
                                const ver = latestVersion(t);
                                const cov = coverage(t);
                                return (
                                    <tr key={t.id} className="hover:bg-slate-50/60 transition-colors group">
                                        <td className="px-5 py-4">
                                            <div className="font-semibold text-slate-900">{t.name}</div>
                                            <div className="text-[11px] text-slate-400 mt-0.5">v{ver.version} · {ver.mappings.length} mappings</div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2 py-1 rounded">{t.sourceType}</span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-600 text-xs">{t.industry || <span className="text-slate-300">—</span>}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-20 bg-slate-100 rounded-full h-1.5">
                                                    <div className={`h-1.5 rounded-full ${cov >= 80 ? 'bg-emerald-500' : cov >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${cov}%` }}></div>
                                                </div>
                                                <span className={`text-xs font-bold ${coverageColor(cov)}`}>{cov}%</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-slate-600 text-xs font-mono">{t.usageCount}</td>
                                        <td className="px-5 py-4 text-slate-500 text-xs">{new Date(t.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                        <td className="px-5 py-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${statusBadge(t.status)}`}>{t.status}</span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            <div className="relative inline-block">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === t.id ? null : t.id)}
                                                    className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                                                >
                                                    <MoreHorizontal size={16} />
                                                </button>
                                                {openMenuId === t.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-30" onClick={() => setOpenMenuId(null)} />
                                                        <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 shadow-xl rounded-xl z-40 py-1.5 overflow-hidden">
                                                            <button onClick={() => { onEdit(t); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-[12px] font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2"><Edit2 size={13} className="text-slate-400" /> Edit</button>
                                                            <button onClick={() => { setCloneTarget(t); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-[12px] font-semibold hover:bg-slate-50 text-slate-700 flex items-center gap-2"><Copy size={13} className="text-slate-400" /> Clone</button>
                                                            <div className="my-1 border-t border-slate-100" />
                                                            {t.status === 'Active'
                                                                ? <button onClick={() => { onSetStatus(t, 'Inactive'); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-[12px] font-semibold hover:bg-amber-50 text-amber-700 flex items-center gap-2"><ToggleLeft size={13} /> Deactivate</button>
                                                                : <button onClick={() => { onSetStatus(t, 'Active'); setOpenMenuId(null); }} className="w-full text-left px-4 py-2 text-[12px] font-semibold hover:bg-emerald-50 text-emerald-700 flex items-center gap-2"><ToggleRight size={13} /> Activate</button>
                                                            }
                                                            <div className="my-1 border-t border-slate-100" />
                                                            <button onClick={() => { if (window.confirm(`Delete "${t.name}"? This action is permanent (soft delete).`)) { onDelete(t); setOpenMenuId(null); } }} className="w-full text-left px-4 py-2 text-[12px] font-semibold hover:bg-rose-50 text-rose-600 flex items-center gap-2"><Trash2 size={13} /> Delete</button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* CLONE MODAL */}
            {cloneTarget && (
                <CloneModal
                    template={cloneTarget}
                    existingNames={existingNames}
                    onConfirm={(newName) => { onClone(cloneTarget, newName); setCloneTarget(null); }}
                    onClose={() => setCloneTarget(null)}
                />
            )}
        </div>
    );
};

export default TemplateList;
