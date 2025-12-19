import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Check, Briefcase, AlertCircle } from 'lucide-react';
import { searchNaics, findNaicsByCode } from './naicsData';

const NAICSSelector = ({
    value,
    onSelect,
    disabled = false,
    placeholderText = "Search industry or NAICS (e.g., Catering, Construction)",
    helperText,
    required = false
}) => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef(null);

    // Initialize query if value exists
    useEffect(() => {
        if (value && typeof value === 'string') {
            // If it's just a code, try to prettify it? Or just show it.
            // Assuming value might be just code. 
            // For this demo, if value is passed, we might assume it's pre-filled.
            // Ideally, we'd accept `value` as { code, title } object or string.
            // If string, let's keep it simple.
            setQuery(value);
        } else if (value && value.code) {
            setQuery(`${value.code} - ${value.title}`);
        }
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSearch = (val) => {
        setQuery(val);
        setIsOpen(true);
        if (val.length > 1) {
            const matches = searchNaics(val);
            setResults(matches);
        } else {
            setResults([]);
        }
        setSelectedIndex(-1);
    };

    const handleSelect = (item) => {
        // Construct standard output
        const output = {
            naicsCode: item.code,
            naicsTitle: item.title,
            naicsLevel: item.type === 'category' ? 'Category' : 'Code',
            // Resolve full category path if possible, but hierarchy string is decent proxy
            parentCategory: item.hierarchy?.split(' > ').pop() || ''
        };

        // Format display
        const display = item.type === 'category'
            ? item.title
            : `${item.code} - ${item.title}`;

        setQuery(display);
        setIsOpen(false);
        onSelect && onSelect(output);
    };

    const handleKeyDown = (e) => {
        if (!isOpen) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && results[selectedIndex]) {
                handleSelect(results[selectedIndex]);
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                        setIsOpen(true);
                        if (query.length > 1 && results.length === 0) {
                            setResults(searchNaics(query));
                        }
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    placeholder={placeholderText}
                    className={`
                        w-full pl-10 pr-4 py-2 text-sm bg-white border rounded-lg outline-none transition-all
                        ${disabled ? 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200' : 'border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder:text-slate-400'}
                        ${required && !query ? 'border-amber-300' : ''}
                    `}
                />
                <Search size={16} className={`absolute left-3.5 top-2.5 ${disabled ? 'text-slate-300' : 'text-slate-400'}`} />
                {helperText && <p className="mt-1 text-xs text-slate-400">{helperText}</p>}
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    <div className="py-2">
                        {results.map((item, index) => {
                            // Dynamic Indentation
                            const paddingLeft = item.level === 0 ? 'pl-4' : (item.level === 1 ? 'pl-8' : 'pl-12');
                            const isSelectable = item.type === 'code'; // Only codes selectable? User implies "select these".

                            return (
                                <button
                                    key={`${item.code}-${index}`}
                                    onClick={() => handleSelect(item)}
                                    disabled={!isSelectable}
                                    className={`
                                         w-full text-left pr-4 py-2 flex items-center transition-colors border-l-4
                                         ${paddingLeft}
                                         ${index === selectedIndex ? 'bg-blue-50 border-blue-500' : 'border-transparent hover:bg-slate-50'}
                                         ${!isSelectable ? 'cursor-default' : 'cursor-pointer'}
                                     `}
                                >
                                    <div className="flex-1">
                                        <div className="flex items-baseline gap-2">
                                            {item.code && (
                                                <span className={`font-mono text-xs font-bold ${item.type === 'category' ? 'text-slate-400' : 'text-blue-600'}`}>
                                                    {item.code}
                                                </span>
                                            )}
                                            <span className={`
                                                 text-sm truncate
                                                 ${item.level === 0 ? 'font-bold text-slate-900 uppercase tracking-tight' : ''}
                                                 ${item.level === 1 ? 'font-bold text-slate-700' : ''}
                                                 ${item.level === 2 ? 'font-medium text-slate-600' : ''}
                                             `}>
                                                {item.title}
                                            </span>
                                        </div>
                                        {/* Description or extra context could go here */}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {isOpen && query.length > 1 && results.length === 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-center">
                    <div className="text-slate-400 mb-2"><AlertCircle size={24} className="mx-auto" /></div>
                    <p className="text-sm font-medium text-slate-600">No matching NAICS categories found</p>
                    <p className="text-xs text-slate-400 mt-1">Try searching for generic terms like "Food", "Tech", or "Retail".</p>
                </div>
            )}
        </div>
    );
};

export default NAICSSelector;
