import React from 'react';
import { User, Minus } from 'lucide-react';

const AvatarWithPresence = ({
    src,
    alt,
    initials,
    size = 'md', // sm: 32px, md: 40px, lg: 48px, xl: 56px
    status = 'offline', // online, offline, busy, dnd
    name,
    lastActive
}) => {
    // Size mapping for the avatar container
    const sizeClasses = {
        sm: 'w-8 h-8 text-[10px]',
        md: 'w-10 h-10 text-xs',
        lg: 'w-12 h-12 text-sm',
        xl: 'w-14 h-14 text-base'
    };

    // Size mapping for the fallback icon
    const iconSize = {
        sm: 12,
        md: 16,
        lg: 20,
        xl: 24
    };

    // Badge size mapping
    const badgeSizeClasses = {
        sm: 'w-3 h-3',
        md: 'w-3.5 h-3.5',
        lg: 'w-4 h-4',
        xl: 'w-5 h-5'
    };

    // Status Label Helper
    const getStatusLabel = (s) => {
        if (!s) return 'Offline';
        switch (s) {
            case 'dnd': return 'Do Not Disturb';
            default: return s.charAt(0).toUpperCase() + s.slice(1);
        }
    };

    const tooltipText = `${name || 'User'} — ${getStatusLabel(status)}${lastActive ? `\nLast active ${lastActive}` : ''}`;

    // Status Logic
    // Online: Solid Green Ring
    // Busy: Dashed Amber Ring
    // DND: Solid Red Ring + Icon
    // Offline: No Ring

    return (
        <div className="relative inline-flex items-center justify-center group" title={tooltipText}>

            {/* Busy Status: Dashed Ring Layer (Behind avatar or Overlay) */}
            {/* We place it absolutely to ensure we can control the stroke without affecting layout */}
            {status === 'busy' && (
                <div className="absolute -inset-1 rounded-full border-2 border-amber-400 border-dashed pointer-events-none"></div>
            )}

            {/* Avatar Container */}
            <div className={`
                relative rounded-full flex items-center justify-center shrink-0 bg-slate-100 select-none overflow-hidden
                ${sizeClasses[size]}
                ${status === 'online' ? 'ring-2 ring-emerald-500 ring-offset-2 ring-offset-white' : ''}
                ${status === 'dnd' ? 'ring-2 ring-red-500 ring-offset-2 ring-offset-white' : ''}
                border border-slate-200 // Default border for offline/base definition
            `}>
                {src ? (
                    <img src={src} alt={alt || name} className="w-full h-full object-cover" />
                ) : (
                    <div className="font-bold text-slate-500 uppercase">
                        {initials || (name ? name.charAt(0) : <User size={iconSize[size]} />)}
                    </div>
                )}
            </div>

            {/* DND Badge: Red Circle with Minus Icon */}
            {status === 'dnd' && (
                <div className={`absolute -bottom-0.5 -right-0.5 bg-red-500 text-white rounded-full border-2 border-white flex items-center justify-center z-10 ${badgeSizeClasses[size]}`}>
                    <Minus size={8} strokeWidth={4} />
                </div>
            )}

            {/* Optional: Online Pulse (Subtle) - Prompt said "Optional", leaving out for strict noise reduction unless desired */}
        </div>
    );
};

export default AvatarWithPresence;
