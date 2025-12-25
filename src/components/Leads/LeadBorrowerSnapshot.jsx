import React from 'react';
import { Building2, MapPin, Phone, Mail, User, CreditCard, BadgeCheck, Globe, Crown, Eye, EyeOff, Copy, Lock, Shield } from 'lucide-react';

const LeadBorrowerSnapshot = ({ data, contact }) => {
    // --- EIN Logic ---
    const [isRevealed, setIsRevealed] = React.useState(false);
    const [toast, setToast] = React.useState(null);

    // Mock Permissions
    const canViewEIN = true;
    const canCopyEIN = true;

    // Secure Data
    const fallbackEIN = '84-1734592';
    // If data.taxId is missing OR appears to be masked (contains *), use fallback
    const useFallback = !data.taxId || data.taxId.includes('*');
    const einFull = useFallback ? fallbackEIN : data.taxId;
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
            {/* Toast Notification */}
            {toast && (
                <div className="absolute top-4 right-4 z-50 bg-slate-800 text-white text-xs px-3 py-2 rounded shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                    <Shield size={12} className="text-emerald-400" />
                    {toast}
                </div>
            )}

            {/* Header */}
            <div className="px-6 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Building2 size={16} className="text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Borrower Snapshot</h3>
                </div>
                {data.yearsInBusiness && (
                    <span className="text-xs font-medium text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-sm">
                        Est. {new Date().getFullYear() - data.yearsInBusiness} ({data.yearsInBusiness} yrs)
                    </span>
                )}
            </div>

            <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">

                    {/* Left Column: Account / Business Info */}
                    <div className="flex-1 space-y-4">
                        <div>
                            <div className="flex items-start justify-between">
                                <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                                    {data.legalName || 'Unknown Entity'}
                                </h2>
                            </div>
                            <div className="flex items-center gap-2 mt-1 mb-3">
                                {data.entityType && (
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide border-r border-slate-300 pr-2 mr-0.5">
                                        {data.entityType}
                                    </span>
                                )}
                                {canViewEIN && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-slate-400">
                                            EIN:
                                        </span>
                                        <span className={`text-xs font-mono ${isRevealed ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                                            {isRevealed ? einFull : einMasked}
                                        </span>

                                        {!isRevealed ? (
                                            <button
                                                onClick={handleReveal}
                                                className="ml-1 text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-1.5 py-0.5 rounded transition-colors flex items-center gap-1"
                                                title="Reveal EIN (Logged)"
                                            >
                                                <Eye size={12} /> Reveal
                                            </button>
                                        ) : (
                                            <div className="flex items-center gap-1">
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

                                                <span className="ml-1 flex items-center gap-1 text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                                    <Lock size={10} /> Sensitive
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                    <Building2 size={12} className="text-slate-400" />
                                    {data.industry || 'General Business'}
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                    <MapPin size={12} className="text-slate-400" />
                                    {data.city}, {data.state}
                                </span>
                                {data.website && (
                                    <a href={`https://${data.website}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium border border-blue-100 hover:bg-blue-100 transition-colors">
                                        <Globe size={12} />
                                        {data.website}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Badges / Compliance Tags */}
                        {data.badges && data.badges.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2">
                                {data.badges.map((badge, index) => (
                                    <span
                                        key={index}
                                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border 
                                            ${badge.includes('Minority') ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                badge.includes('Woman') ? 'bg-pink-50 text-pink-700 border-pink-100' :
                                                    'bg-blue-50 text-blue-700 border-blue-100'}`}
                                    >
                                        {badge}
                                    </span>
                                ))}
                                {data.censusTract && (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {data.censusTract}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Vertical Divider (Hidden on mobile) */}
                    <div className="hidden md:block w-px bg-slate-100 self-stretch"></div>

                    {/* Right Column: Primary Contact */}
                    <div className="flex-1 md:max-w-md">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                Primary Contact
                            </h4>
                            {contact.isOwner && (
                                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 flex items-center gap-1">
                                    <Crown size={10} /> {contact.ownershipPercentage}% Owner
                                </span>
                            )}
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg border border-white shadow-sm shrink-0 relative overflow-hidden">
                                {contact.avatar ? (
                                    <img src={contact.avatar} alt={contact.name} className="w-full h-full object-cover" />
                                ) : (
                                    contact.name ? contact.name.slice(0, 1) : <User size={20} />
                                )}
                                <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <div className="text-lg font-bold text-slate-900 truncate">{contact.name}</div>
                                    {contact.pronouns && (
                                        <span className="text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-100">
                                            {contact.pronouns}
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm font-medium text-slate-500 mb-2">{contact.role || 'Owner'}</div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors">
                                        <Phone size={14} className="text-slate-400" />
                                        {contact.phone}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group">
                                        <Mail size={14} className="text-slate-400 group-hover:text-blue-500" />
                                        <span className="truncate">{contact.email}</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-50">
                                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-0.5">Est. Credit</div>
                                    <div className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 w-fit">
                                        <CreditCard size={14} />
                                        {contact.creditRange || 'N/A'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
};

export default LeadBorrowerSnapshot;
