import React from 'react';
import { Building2, MapPin, User, Phone, Mail, Building, Eye, EyeOff, Copy, Lock, Shield } from 'lucide-react';

const BorrowerSnapshot = ({
    data,
    contact,
    onViewAccount,
    onViewContact,
    relatedContactCount = 0,
    onViewAllContacts,
    className = ""
}) => {
    // Helper to format pronouns
    const formatPronouns = (pronouns) => {
        if (!pronouns) return null;
        // Ensure strictly formatted like (he/him) or similar pill style if passed raw
        return pronouns.startsWith('(') ? pronouns : `(${pronouns})`;
    };


    // --- EIN Logic ---
    const [isRevealed, setIsRevealed] = React.useState(false);
    const [toast, setToast] = React.useState(null);

    // Mock Permissions
    const canViewEIN = true;
    const canCopyEIN = true;

    // Secure Data
    const fallbackEIN = '84-1734592';
    // If data.ein is missing OR appears to be masked (contains *), use fallback
    const useFallback = !data.ein || data.ein.includes('*');
    const einFull = useFallback ? fallbackEIN : data.ein;
    const einMasked = `**-***-${einFull.slice(-4)}`;

    const handleReveal = () => {
        setIsRevealed(true);
        console.log(`[AUDIT] EIN_REVEALED | User: CurrentUser | Target: ${data.legalName} (${data.id || 'N/A'}) | Source: UI`);
    };

    const handleHide = () => {
        setIsRevealed(false);
        console.log(`[AUDIT] EIN_HIDDEN | User: CurrentUser | Target: ${data.legalName} (${data.id || 'N/A'}) | Source: UI`);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(einFull);
        setToast('EIN copied. This action has been logged.');
        console.log(`[AUDIT] EIN_COPIED | User: CurrentUser | Target: ${data.legalName} (${data.id || 'N/A'}) | Source: UI`);

        setTimeout(() => setToast(null), 3000);
    };

    // Auto-re-mask on unmount
    React.useEffect(() => {
        return () => setIsRevealed(false);
    }, []);

    return (
        <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative ${className}`}>
            {/* Toast Notification */}
            {toast && (
                <div className="absolute top-4 right-4 z-50 bg-slate-800 text-white text-xs px-3 py-2 rounded shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                    <Shield size={12} className="text-emerald-400" />
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Building2 size={14} className="text-slate-400" />
                    Borrower Snapshot
                </h3>

                {/* Action Links - Only render if handlers provided */}
                {(onViewAccount || onViewContact) && (
                    <div className="flex gap-2">
                        {onViewAccount && (
                            <button
                                onClick={onViewAccount}
                                className="text-xs text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                            >
                                View Account
                            </button>
                        )}
                        {onViewAccount && onViewContact && (
                            <span className="text-slate-300">|</span>
                        )}
                        {onViewContact && (
                            <button
                                onClick={onViewContact}
                                className="text-xs text-blue-600 font-bold hover:text-blue-700 hover:underline transition-colors"
                            >
                                View Contact
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Content Body - Stacked Layout */}
            <div className="p-5 flex flex-col gap-6">

                {/* 1. Borrower (Account) Section */}
                <div className="space-y-4">
                    <div>
                        <div className="flex items-start gap-2 mb-1">
                            <h4 className="text-lg font-bold text-slate-900 leading-tight break-words">
                                {data.legalName}
                            </h4>
                            {data.entityType && (
                                <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide mt-0.5">
                                    {data.entityType}
                                </span>
                            )}
                        </div>
                        {data.dba && data.dba !== data.legalName && (
                            <div className="text-sm text-slate-500 font-medium">{data.dba}</div>
                        )}

                        {/* Secure EIN Display */}
                        <div className="mt-2 flex items-center gap-2">
                            <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">EIN:</div>
                            <div className={`font-mono text-sm ${isRevealed ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                                {isRevealed ? einFull : einMasked}
                            </div>

                            {/* Controls */}
                            {canViewEIN && (
                                <div className="flex items-center gap-1 ml-1">
                                    {!isRevealed ? (
                                        <button
                                            onClick={handleReveal}
                                            className="ml-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-1.5 py-0.5 rounded transition-colors flex items-center gap-1"
                                            title="Reveal EIN (Logged)"
                                        >
                                            <Eye size={12} /> Reveal
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleHide}
                                                className="ml-1 text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-1.5 py-0.5 rounded transition-colors flex items-center gap-1"
                                            >
                                                <EyeOff size={12} /> Hide
                                            </button>

                                            {canCopyEIN && (
                                                <button
                                                    onClick={handleCopy}
                                                    className="text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-1.5 py-0.5 rounded transition-colors flex items-center gap-1"
                                                    title="Copy to Clipboard"
                                                >
                                                    <Copy size={12} /> Copy
                                                </button>
                                            )}

                                            <span className="ml-2 flex items-center gap-1 text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                                <Lock size={10} /> Sensitive Data – Access Logged
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap gap-2 text-xs">
                        {(data.naicsCode || data.industry) && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 text-slate-700 border border-slate-100">
                                <Building size={12} className="text-slate-400" />
                                <span className="font-medium">
                                    {data.naicsCode && `${data.naicsCode} · `}{data.industry}
                                </span>
                            </div>
                        )}
                        {(data.city || data.state) && (
                            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 text-slate-700 border border-slate-100">
                                <MapPin size={12} className="text-slate-400" />
                                <span className="font-medium">
                                    {data.city}{data.city && data.state && ', '}{data.state}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Impact Badges */}
                    <div className="flex flex-wrap gap-2 pt-1">
                        {data.censusTract && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
                                {data.censusTract}
                            </span>
                        )}
                        {data.badges?.map((badge, index) => (
                            <span key={index} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 uppercase tracking-wide">
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Horizontal Divider */}
                <div className="h-px bg-slate-100 w-full"></div>

                {/* 2. Primary Contact Section */}
                <div className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Primary Contact</h5>
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border-2 border-white shadow-sm shrink-0">
                            <User size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="font-bold text-slate-800 flex flex-wrap items-center gap-2">
                                <span className="truncate">{contact.name}</span>
                                {contact.pronouns && (
                                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full text-[10px] font-medium border border-slate-200 whitespace-nowrap">
                                        {contact.pronouns}
                                    </span>
                                )}
                            </div>
                            <div className="text-xs text-slate-500 mb-2 truncate">{contact.role}</div>

                            <div className="space-y-1">
                                <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                    <Phone size={12} /> {contact.phone}
                                </a>
                                <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                    <Mail size={12} /> <span className="truncate max-w-[200px]">{contact.email}</span>
                                </a>
                            </div>
                        </div>

                        {/* Right Side Info (Credit/Pref) */}
                        <div className="text-right space-y-2 hidden sm:block">
                            <div>
                                <div className="text-[10px] uppercase text-slate-400 font-bold">Preferred</div>
                                <div className="text-xs font-medium text-slate-700">{contact.preferredMethod}</div>
                            </div>
                            {contact.creditRange && (
                                <div>
                                    <div className="text-[10px] uppercase text-slate-400 font-bold">Est. Credit</div>
                                    <div className="text-xs font-bold text-emerald-600">{contact.creditRange}</div>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Additional Contacts Indicator */}
                    {relatedContactCount > 0 && (
                        <div className="pt-2">
                            <button
                                onClick={onViewAllContacts}
                                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 -ml-2 rounded transition-colors inline-flex items-center gap-1"
                            >
                                +{relatedContactCount} more contact{relatedContactCount !== 1 ? 's' : ''}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BorrowerSnapshot;
