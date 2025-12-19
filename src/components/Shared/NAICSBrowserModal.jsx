import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, ChevronRight, ArrowLeft, Check, AlertTriangle, Building2, LayoutGrid, List } from 'lucide-react';
import { NAICS_DATA, findNaicsByCode } from './naicsData';

const NAICSSelector = ({ isOpen, onClose, onSelect }) => {
    // Modes: 'browse' | 'manual'
    const [mode, setMode] = useState('browse');

    // Browse State
    // Path: Array of items [Category, SubIndustry]
    const [path, setPath] = useState([]);
    const [selectedCode, setSelectedCode] = useState(null);

    // Manual State
    const [manualInput, setManualInput] = useState('');
    const [manualError, setManualError] = useState(null);

    if (!isOpen) return null;

    // --- Helpers ---
    const currentView = path.length === 0 ? 'category' : (path.length === 1 ? 'sub' : 'code');
    const displayData = path.length === 0
        ? NAICS_DATA
        : (path.length === 1 ? path[0].children : path[path.length - 1].children);

    const handleBack = () => {
        if (selectedCode) {
            setSelectedCode(null);
            return;
        }
        if (path.length > 0) {
            setPath(prev => prev.slice(0, -1));
        }
    };

    const handleSelectPath = (item) => {
        if (currentView === 'category' || currentView === 'sub') {
            setPath(prev => [...prev, item]);
        } else {
            // Final code selection
            setSelectedCode({ ...item, category: path[0] });
        }
    };

    const handleManualSearch = (val) => {
        setManualInput(val);
        setManualError(null);
        setSelectedCode(null);

        if (val.length === 6) {
            const result = findNaicsByCode(val);
            if (result) {
                setSelectedCode(result);
            } else {
                setManualError('NAICS code not found. Please verify the code.');
            }
        }
    };

    const confirmSelection = () => {
        if (selectedCode) {
            const result = {
                naicsCode: selectedCode.code,
                naicsDescription: selectedCode.title,
                naicsIndustrySector: selectedCode.category?.title || 'Unknown Sector',
                selectionMethod: mode
            };
            onSelect(result);
            onClose();
        }
    };

    // --- Content Components ---

    const Breadcrumbs = () => (
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
            <button
                onClick={() => { setPath([]); setSelectedCode(null); }}
                className="hover:text-blue-600 transition-colors flex items-center gap-1"
            >
                <LayoutGrid size={12} />
                All Industries
            </button>
            {path.map((item, idx) => (
                <div key={item.code} className="flex items-center gap-2">
                    <ChevronRight size={10} className="text-slate-300" />
                    <button
                        onClick={() => {
                            setPath(prev => prev.slice(0, idx + 1));
                            setSelectedCode(null);
                        }}
                        className="hover:text-blue-600 transition-colors"
                    >
                        {item.title}
                    </button>
                </div>
            ))}
        </div>
    );

    const ItemCard = ({ item, onClick }) => (
        <button
            onClick={onClick}
            className="w-full text-left p-4 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-md transition-all group bg-white"
        >
            <div className="flex justify-between items-start">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                        {currentView === 'category' && <span className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600"><Building2 size={18} /></span>}
                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-blue-700">{item.title}</h4>
                    </div>
                    {item.code && currentView !== 'category' && (
                        <div className="text-xs font-mono text-slate-400 mb-1">Code: {item.code}</div>
                    )}
                    <p className="text-xs text-slate-500 line-clamp-2">{item.description}</p>
                </div>
                {(currentView === 'code' || item.children) && (
                    <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500 mt-1" />
                )}
            </div>
        </button>
    );

    const SelectionConfirm = () => (
        <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-2">
                    <Check size={32} strokeWidth={3} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-1">{selectedCode.code}</h3>
                    <div className="text-lg font-medium text-slate-700">{selectedCode.title}</div>
                    <div className="inline-block mt-3 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-500">
                        {selectedCode.category?.title}
                    </div>
                </div>
                <div className="w-full max-w-sm bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-600 text-left">
                    <p className="font-medium mb-1">Description:</p>
                    {selectedCode.description}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2 text-left w-full max-w-sm">
                    <AlertTriangle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-blue-800">
                        This NAICS may have program-specific eligibility considerations.
                    </p>
                </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50 flex gap-3">
                <button
                    onClick={() => setSelectedCode(null)}
                    className="flex-1 py-3 px-4 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-white transition-colors"
                >
                    Change Selection
                </button>
                <button
                    onClick={confirmSelection}
                    className="flex-1 py-3 px-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all"
                >
                    Confirm NAICS
                </button>
            </div>
        </div>
    );

    const DrawerContent = (
        <div className="fixed inset-0 z-[80] flex justify-end font-sans">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 pb-20 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-bold">Select NAICS Code</h2>
                            <p className="text-slate-400 text-xs mt-1">Choose industry classification</p>
                        </div>
                        <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
                            <X size={16} />
                        </button>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex bg-slate-800/50 p-1 rounded-lg mt-6 border border-white/5">
                        <button
                            onClick={() => { setMode('browse'); setPath([]); setSelectedCode(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${mode === 'browse' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            <LayoutGrid size={14} /> Browse
                        </button>
                        <button
                            onClick={() => { setMode('manual'); setSelectedCode(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-md transition-all ${mode === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Search size={14} /> Manual Entry
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden -mt-4 rounded-t-3xl relative z-20">

                    {/* Confirmation / Final State (Overridden) */}
                    {selectedCode ? (
                        <SelectionConfirm />
                    ) : (
                        <div className="flex-1 flex flex-col overflow-hidden">
                            {mode === 'browse' ? (
                                <div className="flex-1 flex flex-col min-h-0">
                                    <div className="px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
                                        <Breadcrumbs />
                                        <div className="text-sm font-bold text-slate-800">
                                            {path.length === 0 ? 'Select Category' : (path.length === 1 ? 'Select Sub-Industry' : 'Select Code')}
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                        {displayData.map(item => (
                                            <ItemCard
                                                key={item.code}
                                                item={item}
                                                onClick={() => handleSelectPath(item)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 p-6">
                                    <label className="text-sm font-bold text-slate-700 mb-2 block">Enter NAICS Code</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            maxLength={6}
                                            value={manualInput}
                                            onChange={(e) => handleManualSearch(e.target.value.replace(/\D/g, ''))}
                                            placeholder="e.g. 722320"
                                            className="w-full text-lg border border-slate-300 rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest text-slate-900 placeholder:tracking-normal placeholder:font-sans"
                                        />
                                        <Search size={20} className="absolute left-3 top-3.5 text-slate-400" />
                                    </div>
                                    {manualError && (
                                        <div className="mt-2 text-xs font-bold text-red-500 flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                                            <AlertTriangle size={12} /> {manualError}
                                        </div>
                                    )}
                                    <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-sm text-blue-800">
                                        <h5 className="font-bold flex items-center gap-2 mb-2"><List size={16} /> Tip</h5>
                                        <p>Enter the full 6-digit NAICS code to find specific industry classifications.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer (Only for browse mode navigation, if needed, otherwise hidden) */}
                {mode === 'browse' && !selectedCode && path.length > 0 && (
                    <div className="p-4 bg-white border-t border-slate-200">
                        <button
                            onClick={handleBack}
                            className="w-full py-2.5 rounded-lg border border-slate-300 text-slate-600 font-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(DrawerContent, document.body);
};

export default NAICSSelector;
