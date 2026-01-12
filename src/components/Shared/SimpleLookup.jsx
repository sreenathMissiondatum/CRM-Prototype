import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, X } from 'lucide-react';

const SimpleLookup = ({ placeholder, disabled, value, options, onSelect, onClear }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                // Check if click was inside the portal
                const portal = document.getElementById('lookup-portal');
                if (portal && portal.contains(event.target)) return;

                setIsOpen(false);
            }
        }
        function handleScroll() {
            if (isOpen) setIsOpen(false); // Close on scroll to avoid detached dropdown
        }

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [isOpen]);

    // Update coords when opening
    useEffect(() => {
        if (isOpen && wrapperRef.current) {
            const updatePosition = () => {
                const rect = wrapperRef.current.getBoundingClientRect();
                setCoords({
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width
                });
            };
            updatePosition();
            // Optional: Resize observer if needed, but simple for now
        }
    }, [isOpen]);

    if (disabled) {
        return (
            <div className="relative">
                <input
                    disabled
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-400 cursor-not-allowed"
                    placeholder={placeholder}
                    value=""
                    readOnly
                />
            </div>
        );
    }

    if (value && !isOpen) {
        return (
            <div
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white flex justify-between items-center cursor-pointer hover:border-blue-400 group relative"
                onClick={() => {
                    setSearch('');
                    setIsOpen(true);
                }}
            >
                <span className="truncate">{value}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClear();
                    }}
                    className="text-slate-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <X size={14} />
                </button>
            </div>
        );
    }

    const filteredOptions = options.filter(o => o.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    className="w-full text-sm border border-blue-500 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-100"
                    placeholder={placeholder}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    autoFocus
                />
                <div className="absolute right-3 top-2.5 text-slate-400">
                    <Search size={14} />
                </div>
            </div>

            {isOpen && createPortal(
                <div
                    id="lookup-portal"
                    className="absolute bg-white border border-slate-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-[9999] animate-in fade-in zoom-in-95 duration-100"
                    style={{
                        top: coords.top + 4,
                        left: coords.left,
                        width: coords.width,
                        position: 'absolute'
                    }}
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(opt => (
                            <button
                                key={opt.id}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-slate-50 last:border-0"
                                onClick={() => {
                                    onSelect(opt);
                                    setIsOpen(false);
                                    setSearch('');
                                }}
                            >
                                {opt.name}
                            </button>
                        ))
                    ) : (
                        <div className="px-3 py-2 text-xs text-slate-400 italic">No results found</div>
                    )}
                </div>,
                document.body
            )}

        </div>
    );
};

export default SimpleLookup;
