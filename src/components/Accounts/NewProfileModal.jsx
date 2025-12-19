import React, { useState, useMemo } from 'react';
import {
    X, FileText, Calendar, Upload, Database,
    FileSpreadsheet, Keyboard, ShieldAlert, ArrowRight,
    TrendingUp, Calculator, Scale
} from 'lucide-react';
import { createPortal } from 'react-dom';

// --- UI Helpers ---

const TypeCard = ({ icon: Icon, label, desc, selected, onClick, isProForma }) => (
    <div
        onClick={onClick}
        className={`
            p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 relative overflow-hidden group
            ${selected
                ? (isProForma ? 'border-purple-600 bg-purple-50/50' : 'border-blue-600 bg-blue-50/50')
                : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
            }
        `}
    >
        {selected && (
            <div className={`absolute top-0 right-0 p-1 rounded-bl-lg ${isProForma ? 'bg-purple-600' : 'bg-blue-600'}`}>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
        )}
        <div className={`p-2.5 rounded-lg w-fit mb-3 ${selected ? (isProForma ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700') : 'bg-slate-100 text-slate-500 group-hover:bg-white'}`}>
            <Icon size={24} />
        </div>
        <div className="font-bold text-slate-800">{label}</div>
        <div className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</div>
        {isProForma && <div className="absolute top-3 right-3 text-[10px] font-bold uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">Projected</div>}
    </div>
);

const MethodItem = ({ icon: Icon, title, desc, badge, selected, onClick }) => (
    <div
        onClick={onClick}
        className={`
            flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all
            ${selected ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}
        `}
    >
        <div className={`p-2.5 rounded-lg ${selected ? 'bg-blue-200 text-blue-700' : 'bg-white border border-slate-100 text-slate-500'}`}>
            <Icon size={20} />
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <span className={`font-bold ${selected ? 'text-blue-900' : 'text-slate-700'}`}>{title}</span>
                {badge && <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">{badge}</span>}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
        </div>
        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}>
            {selected && <div className="w-2 h-2 bg-white rounded-full"></div>}
        </div>
    </div>
);

// --- Main Component ---

const NewProfileModal = ({ isOpen, onClose, onCreate }) => {
    if (!isOpen) return null;

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        type: '',
        startDate: '',
        endDate: '',
        importMethod: ''
    });

    const isProForma = formData.type === 'Pro Forma';

    // Period Calculation Logic
    const periodData = useMemo(() => {
        if (!formData.startDate || !formData.endDate) return null;

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end - start);
        const months = Math.round(diffTime / (1000 * 60 * 60 * 24 * 30.44));

        // Label Logic
        let label = 'Full Year';
        if (isProForma) label = 'Projection';
        else if (months < 12) label = 'Annualized';

        const isFuture = start > new Date();

        return { months, label, isFuture };
    }, [formData.startDate, formData.endDate, isProForma]);


    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);

    const handleSubmit = () => {
        if (onCreate) {
            onCreate({
                ...formData,
                status: 'Draft',
                progress: 0,
                revenue: 0,
                ebitda: 0,
                isProForma: formData.type === 'Pro Forma'
            });
        }
        onClose();
        // Reset state
        setStep(1);
        setFormData({ type: '', startDate: '', endDate: '', importMethod: '' });
    };

    const isStep1Valid = !!formData.type;
    const isStep2Valid = !!formData.startDate && !!formData.endDate;
    const isStep3Valid = !!formData.importMethod;

    return createPortal(
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Create New Financial Profile</h2>
                        <p className="text-sm text-slate-500 mt-1">Add a new period for analysis. Does not affect ratios until locked.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="px-6 pt-6 pb-2">
                    <div className="flex items-center gap-2">
                        {[1, 2, 3].map(s => (
                            <div key={s} className="flex items-center gap-2 flex-1">
                                <div className={`h-1.5 flex-1 rounded-full ${s <= step ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-2 uppercase tracking-wide">
                        <span className={step >= 1 ? 'text-blue-600' : ''}>Type</span>
                        <span className={step >= 2 ? 'text-blue-600' : ''}>Period</span>
                        <span className={step >= 3 ? 'text-blue-600' : ''}>Source</span>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 min-h-[320px]">

                    {/* STEP 1: STATEMENT TYPE */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Select Statement Type</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <TypeCard
                                    icon={FileText}
                                    label="Tax Return"
                                    desc="Official filed returns (1120/1065/Sch C)"
                                    selected={formData.type === 'Tax Return'}
                                    onClick={() => setFormData({ ...formData, type: 'Tax Return' })}
                                />
                                <TypeCard
                                    icon={Calculator}
                                    label="P&L (Actuals)"
                                    desc="Internal YTD or interim profit & loss"
                                    selected={formData.type === 'P&L (Actuals)'}
                                    onClick={() => setFormData({ ...formData, type: 'P&L (Actuals)' })}
                                />
                                <TypeCard
                                    icon={Scale}
                                    label="Balance Sheet"
                                    desc="Assets, Liabilities & Equity statement"
                                    selected={formData.type === 'Balance Sheet'}
                                    onClick={() => setFormData({ ...formData, type: 'Balance Sheet' })}
                                />
                                <TypeCard
                                    icon={TrendingUp}
                                    label="Pro Forma"
                                    desc="Forward-looking projections"
                                    isProForma
                                    selected={formData.type === 'Pro Forma'}
                                    onClick={() => setFormData({ ...formData, type: 'Pro Forma' })}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: PERIOD DEFINITION */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Define Period Coverage</h3>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600">Period Start Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-600">Period End Date</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm font-medium"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Computed Logic Display */}
                            {periodData && (
                                <div className={`p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border ${isProForma
                                    ? 'bg-purple-50 border-purple-100 text-purple-900'
                                    : 'bg-indigo-50 border-indigo-100 text-indigo-900'
                                    }`}>
                                    <div className={`p-2 rounded-full ${isProForma ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold uppercase opacity-70 mb-0.5">Computed Coverage</div>
                                        <div className="font-bold flex items-center gap-2">
                                            {periodData.months} months
                                            <span className="w-1 h-1 bg-current rounded-full opacity-50"></span>
                                            {periodData.label}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isProForma && (
                                <div className="flex items-start gap-3 p-3 bg-amber-50 text-amber-800 rounded-lg border border-amber-100 text-sm">
                                    <ShieldAlert size={16} className="mt-0.5 flex-shrink-0" />
                                    <p>Pro Forma statements are for <strong>projections only</strong> and will differ in underwriting weight from actuals.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 3: DATA ENTRY METHOD */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Choose Import Method</h3>
                            <div className="grid grid-cols-1 gap-3">
                                <MethodItem
                                    icon={Database}
                                    title="Connect Accounting Source"
                                    desc="QuickBooks Online, Xero, Sage"
                                    selected={formData.importMethod === 'Accounting Source'}
                                    onClick={() => setFormData({ ...formData, importMethod: 'Accounting Source' })}
                                />
                                <MethodItem
                                    icon={Upload}
                                    title="Upload PDF (OCR Extraction)"
                                    desc="Scanned tax returns or P&L documents"
                                    badge="Popular"
                                    selected={formData.importMethod === 'OCR Extraction'}
                                    onClick={() => setFormData({ ...formData, importMethod: 'OCR Extraction' })}
                                />
                                <MethodItem
                                    icon={FileSpreadsheet}
                                    title="Upload Excel / CSV"
                                    desc="Standardized templates"
                                    selected={formData.importMethod === 'Excel Upload'}
                                    onClick={() => setFormData({ ...formData, importMethod: 'Excel Upload' })}
                                />
                                <MethodItem
                                    icon={Keyboard}
                                    title="Manual Entry"
                                    desc="Type line items one-by-one"
                                    selected={formData.importMethod === 'Manual Entry'}
                                    onClick={() => setFormData({ ...formData, importMethod: 'Manual Entry' })}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-slate-50 p-6 border-t border-slate-200">
                    <div className="flex justify-between items-center">
                        <div className="text-xs text-slate-400 font-medium hidden sm:block">
                            * Profile will be created as Draft
                        </div>
                        <div className="flex gap-3 ml-auto">
                            {step > 1 && (
                                <button
                                    onClick={handleBack}
                                    className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-lg transition-colors"
                                >
                                    Back
                                </button>
                            )}

                            {step < 3 ? (
                                <button
                                    onClick={handleNext}
                                    disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                                    className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
                                >
                                    Next Step <ArrowRight size={16} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isStep3Valid}
                                    className="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center gap-2"
                                >
                                    Create Draft Profile
                                </button>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default NewProfileModal;
