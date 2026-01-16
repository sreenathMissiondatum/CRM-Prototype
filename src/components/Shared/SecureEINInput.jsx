import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Lock, Copy, Check } from 'lucide-react';

const SecureEINInput = ({ value, onChange, label = "EIN / Tax ID" }) => {
    // Value coming in is assumed to be formatted (XX-XXXXXXX) or raw.
    // We'll manage raw state internally based on props for easier manipulation.
    const rawValue = value ? value.replace(/\D/g, '') : '';

    const [isRevealed, setIsRevealed] = useState(false);
    const [showCopied, setShowCopied] = useState(false);
    const inputRef = useRef(null);

    // --- Audit Helper ---
    const logAudit = (event) => {
        console.log(JSON.stringify({
            event: event,
            field: 'EIN',
            timestamp: new Date().toISOString(),
            user: 'Current User',
            // leadId, screen context would come from props or context in real app
        }));
    };

    // --- Input Handling ---
    const handleChange = (e) => {
        // 1. Get raw numeric input
        let val = e.target.value.replace(/\D/g, '');

        // 2. Limit to 9 digits
        if (val.length > 9) val = val.slice(0, 9);

        // 3. Format strictly: XX-XXXXXXX
        let formatted = val;
        if (val.length > 2) {
            formatted = `${val.slice(0, 2)}-${val.slice(2)}`;
        }

        // 4. Propagate
        onChange(formatted);
    };

    const toggleReveal = () => {
        const newState = !isRevealed;
        setIsRevealed(newState);
        logAudit(newState ? 'EIN_REVEALED' : 'EIN_HIDDEN');
    };

    const handleCopy = () => {
        if (rawValue.length !== 9) return;

        // Copy always copies the formatted, clear-text EIN: "12-3456789"
        const textToCopy = rawValue.length > 2 ? `${rawValue.slice(0, 2)}-${rawValue.slice(2)}` : rawValue;

        navigator.clipboard.writeText(textToCopy);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);

        logAudit('EIN_COPIED');
    };

    return (
        <div className="space-y-1.5 w-full">
            <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                    {label} <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] px-1.5 py-0.5 bg-orange-50 text-orange-600 rounded border border-orange-100 flex items-center gap-1 font-medium">
                    <Lock size={10} /> SENSITIVE
                </span>
            </div>

            <div className="space-y-2">
                {/* --- INPUT AREA --- */}
                <div className="relative group h-10 w-full">
                    {/* The "Real" Input - Invisible but interactable */}
                    <input
                        ref={inputRef}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-text z-10 font-mono"
                        value={rawValue}
                        onChange={handleChange}
                        autoComplete="off"
                        type={isRevealed ? "text" : "password"}
                        inputMode="numeric"
                    />

                    {/* The Visual Layer */}
                    <div className={`absolute inset-0 w-full h-full border rounded-lg px-3 py-2 flex items-center font-mono text-sm tracking-widest bg-white z-0 overflow-hidden
                        ${isRevealed ? 'border-blue-300 ring-2 ring-blue-50' : 'border-slate-300'}`}>

                        {/* Render Character by Character */}
                        <div className="flex select-none w-full">
                            {Array.from({ length: 9 }).map((_, i) => {
                                const hasChar = i < rawValue.length;
                                const char = rawValue[i];
                                const isMasked = !isRevealed;

                                return (
                                    <React.Fragment key={i}>
                                        {i === 2 && <span className="text-slate-400 mr-1">-</span>}

                                        <span className={`w-3 text-center ${hasChar ? (isMasked ? 'text-slate-800' : 'text-slate-900') : 'text-slate-300'}`}>
                                            {hasChar
                                                ? (isMasked ? '•' : char)
                                                : 'X'
                                            }
                                        </span>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* --- ACTIONS AREA (Below) --- */}
                <div className="flex items-center gap-2">
                    {/* Copy */}
                    <button
                        type="button"
                        onClick={handleCopy}
                        disabled={rawValue.length !== 9}
                        className={`h-9 px-3 rounded-lg border flex items-center gap-2 text-xs font-bold transition-all
                            ${rawValue.length === 9
                                ? 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                                : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                        title={rawValue.length !== 9 ? "Enter full EIN to copy" : "Copy to clipboard"}
                    >
                        {showCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                        <span>Copy</span>
                    </button>

                    {/* Reveal/Hide */}
                    <button
                        type="button"
                        className={`h-9 px-3 rounded-lg border flex items-center gap-2 text-xs font-bold transition-all
                            ${isRevealed
                                ? 'bg-slate-800 text-white border-slate-800 hover:bg-slate-900'
                                : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:text-blue-600 shadow-sm'
                            }`}
                        onClick={toggleReveal}
                    >
                        {isRevealed ? (
                            <>
                                <EyeOff size={14} /> <span>Hide</span>
                            </>
                        ) : (
                            <>
                                <Eye size={14} /> <span>Reveal</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Validation Msg */}
            {rawValue.length > 0 && rawValue.length < 9 && (
                <p className="text-[10px] text-red-500 font-medium mt-1 animate-in slide-in-from-top-1">
                    Enter valid 9-digit EIN
                </p>
            )}
        </div>
    )
}

export default SecureEINInput;
