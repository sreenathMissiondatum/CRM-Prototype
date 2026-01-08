import React, { useState } from 'react';
import {
    LayoutDashboard,
    CheckSquare,
    Calendar,
    Target,
    Briefcase,
    Building2,
    Users,
    Mail,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
    MessageSquare,
    Circle,
    Menu,
    PanelLeftClose,
    PanelLeftOpen
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Sidebar = ({ active, onNavigate, isPinned, onTogglePin, className, userRole }) => {
    // --------------------------------------------------------------------------
    // MOCK USER PERMISSIONS
    // --------------------------------------------------------------------------
    // userRole prop is now passed from App.jsx

    // --------------------------------------------------------------------------
    // STATE
    // --------------------------------------------------------------------------
    // Default: only MAIN is open.
    const [collapsedGroups, setCollapsedGroups] = useState(['PIPELINE', 'RELATIONSHIPS', 'COMMUNICATIONS', 'INSIGHTS']);
    const [expandedMenus, setExpandedMenus] = useState({}); // Track expanded submenus
    const [isHovered, setIsHovered] = useState(false);

    const isExpanded = isPinned || isHovered;

    // Close all submenus when collapsing sidebar to avoid clean state issues
    // useEffect(() => { if (!isExpanded) setExpandedMenus({}); }, [isExpanded]); // Optional: auto-collapse submenus

    const toggleGroup = (title) => {
        setCollapsedGroups(prev =>
            prev.includes(title)
                ? prev.filter(t => t !== title)
                : [...prev, title]
        );
    };

    const toggleSubmenu = (itemId, e) => {
        e.stopPropagation(); // Prevent navigation if clicking expand toggle
        setExpandedMenus(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    const handleItemClick = (item) => {
        // If it has subitems, toggle expand logic (unless it's strictly a navigation item too)
        // For this design, "Loans" navigates to default AND has a submenu.

        // 1. Navigate
        if (item.id) onNavigate(item.id);

        // 2. Expand if it has subitems and isn't expanded
        if (item.subItems && !expandedMenus[item.id]) {
            setExpandedMenus(prev => ({ ...prev, [item.id]: true }));
        }
    };

    // --------------------------------------------------------------------------
    // NAVIGATION STRUCTURE
    // --------------------------------------------------------------------------
    const navGroups = [
        {
            title: 'Main',
            items: [
                { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
                { id: 'calendar', icon: Calendar, label: 'Calendar' },
            ]
        },
        {
            title: 'Pipeline',
            items: [
                {
                    id: 'leads', // Parent ID
                    icon: Target,
                    label: 'Leads',
                    subItems: [
                        { id: 'leads', label: 'All Leads' },
                        { id: 'leads-my', label: 'My Leads' }
                    ]
                },
                {
                    id: 'loans',
                    icon: Briefcase,
                    label: 'Loans',
                    // Submenu Configuration
                    subItems: [
                        { id: 'loans', label: 'All Loans' }, // Reroutes to main 'loans' view
                        { id: 'loans-my', label: 'My Loans' },
                        {
                            id: 'loan-programs',
                            label: 'Loan Programs',
                            roles: ['ADMIN', 'ORG_ADMIN', 'OPS', 'CREDIT', 'PRODUCT'] // Role Guard
                        },
                        {
                            id: 'loan-programs-mvp',
                            label: 'Loan Programs (MVP)',
                            roles: ['ADMIN', 'ORG_ADMIN', 'OPS', 'CREDIT', 'PRODUCT'] // Role Guard
                        }
                    ]
                },
            ]
        },
        {
            title: 'Relationships',
            items: [
                { id: 'accounts', icon: Building2, label: 'Accounts' },
                { id: 'contacts', icon: Users, label: 'Contacts' },
            ]
        },
        {
            title: 'Communications',
            items: [
                { id: 'chat', icon: MessageSquare, label: 'Chat Inbox' },
                { id: 'marketing-dashboard', icon: Mail, label: 'Email Marketing' },
                { id: 'documents', icon: FileText, label: 'Documents' },
            ]
        },
        {
            title: 'Insights',
            items: [
                { id: 'reports', icon: BarChart3, label: 'Reports' },
            ]
        }
    ];

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={twMerge(
                "h-screen flex flex-col bg-[#0f172a] text-slate-300 border-r border-slate-800/50 fixed left-0 top-0 z-[60] overflow-y-auto custom-scrollbar font-sans shadow-2xl transition-all duration-300 ease-in-out",
                isExpanded ? "w-64" : "w-20",
                className
            )}
        >
            {/* Logo Section */}
            <div className={twMerge(
                "py-6 mb-4 sticky top-0 bg-[#0f172a] z-10 flex items-center justify-between overflow-hidden whitespace-nowrap transition-all duration-300",
                isExpanded ? "px-6" : "px-0 justify-center"
            )}>
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onNavigate('dashboard')}>
                    <div className={twMerge(
                        "w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/40 transition-all duration-300 shrink-0",
                        !isExpanded && "mx-auto"
                    )}>
                        <span className="font-bold text-white text-xl">M</span>
                    </div>
                    <div className={twMerge(
                        "flex flex-col transition-opacity duration-200 delay-100",
                        isExpanded ? "opacity-100" : "opacity-0 w-0 hidden"
                    )}>
                        <span className="font-bold text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">Mission datum</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Enterprise</span>
                    </div>
                </div>

                {/* Pin Toggle - Only show when expanded */}
                <button
                    onClick={onTogglePin}
                    className={twMerge(
                        "p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-slate-800 transition-all absolute right-4",
                        isExpanded ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                    )}
                    title={isPinned ? "Unpin Sidebar" : "Pin Sidebar"}
                >
                    {isPinned ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 w-full flex flex-col gap-6 px-4 pb-6">
                {navGroups.map((group) => {
                    const isCollapsed = collapsedGroups.includes(group.title.toUpperCase());

                    return (
                        <div key={group.title} className="flex flex-col gap-1.5">
                            {isExpanded && (
                                <button
                                    onClick={() => toggleGroup(group.title.toUpperCase())}
                                    className="px-2 flex items-center justify-between w-full group/header select-none transition-opacity duration-200 animate-in fade-in slide-in-from-left-2"
                                >
                                    <span className="text-[11px] font-bold text-slate-500/80 tracking-[0.15em] uppercase group-hover/header:text-slate-400 transition-colors whitespace-nowrap">
                                        {group.title}
                                    </span>
                                    {isCollapsed ? (
                                        <ChevronRight size={14} className="text-slate-700 group-hover/header:text-slate-500 transition-colors" />
                                    ) : (
                                        <ChevronDown size={14} className="text-slate-700 group-hover/header:text-slate-500 transition-colors" />
                                    )}
                                </button>
                            )}

                            {(!isCollapsed || !isExpanded) && (
                                <div className="flex flex-col gap-1 animate-in slide-in-from-top-1 duration-200">
                                    {group.items.map((item) => {
                                        const isActive = active === item.id || (item.subItems && item.subItems.some(sub => sub.id === active));
                                        const hasSubItems = item.subItems && item.subItems.length > 0;
                                        const isMenuExpanded = expandedMenus[item.id];

                                        return (
                                            <div key={item.id} className="flex flex-col gap-1">
                                                {/* Parent Item */}
                                                <div className="relative flex items-center group/tooltip">
                                                    <button
                                                        onClick={() => handleItemClick(item)}
                                                        title={!isExpanded ? item.label : undefined}
                                                        className={twMerge(
                                                            "relative py-2.5 rounded-lg transition-all duration-200 flex items-center w-full text-left group/item overflow-hidden",
                                                            isExpanded ? "px-3 gap-3" : "px-0 justify-center", // Centered icon when collapsed
                                                            isActive && !hasSubItems
                                                                ? "bg-blue-600/90 text-white shadow-md shadow-blue-900/30"
                                                                : isActive
                                                                    ? "text-blue-400 bg-blue-900/10"
                                                                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                                                        )}
                                                    >
                                                        {isActive && !hasSubItems && (
                                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/5 bg-white/30 rounded-r-md"></div>
                                                        )}

                                                        <item.icon
                                                            size={18}
                                                            strokeWidth={1.5}
                                                            className={twMerge(
                                                                "transition-opacity duration-200 shrink-0",
                                                                isActive ? "opacity-100" : "opacity-70 group-hover/item:opacity-100 group-hover/item:text-blue-400"
                                                            )}
                                                        />

                                                        {/* Label */}
                                                        {isExpanded && (
                                                            <span className={twMerge(
                                                                "font-medium text-sm tracking-wide flex-1 whitespace-nowrap animate-in fade-in duration-300",
                                                                isActive ? "text-white" : ""
                                                            )}>
                                                                {item.label}
                                                            </span>
                                                        )}
                                                    </button>

                                                    {/* Tooltip for collapsed state (custom simple tooltip if standard title isn't enough, but title was requested) */}
                                                    {/* "Tooltips appear on hover... label text only" - title attribute serves this, providing browser native tooltip. 
                                                        If custom is needed we'd add absolute div here. Let's start with title prop above.
                                                    */}

                                                    {/* Expand Toggle */}
                                                    {hasSubItems && isExpanded && (
                                                        <button
                                                            onClick={(e) => toggleSubmenu(item.id, e)}
                                                            className="absolute right-2 p-1 text-slate-500 hover:text-slate-200 transition-colors"
                                                        >
                                                            {isMenuExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Sub Items */}
                                                {hasSubItems && isMenuExpanded && isExpanded && (
                                                    <div className="flex flex-col gap-0.5 ml-9 border-l border-slate-800 pl-2 animate-in slide-in-from-top-1 duration-150">
                                                        {item.subItems.map((sub) => {
                                                            // Role Check
                                                            if (sub.roles && !sub.roles.includes(userRole)) return null;

                                                            const isSubActive = active === sub.id;
                                                            return (
                                                                <button
                                                                    key={sub.id}
                                                                    onClick={() => onNavigate(sub.id)}
                                                                    className={twMerge(
                                                                        "px-3 py-2 rounded-md text-xs font-medium text-left transition-colors flex items-center gap-2",
                                                                        isSubActive
                                                                            ? "text-blue-400 bg-blue-900/20"
                                                                            : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                                                                    )}
                                                                >
                                                                    {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>}
                                                                    {sub.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer / User Profile */}
            <div className="mt-auto px-4 py-4 border-t border-slate-800 bg-[#0f172a] sticky bottom-0 overflow-hidden whitespace-nowrap">
                <div className="flex flex-col gap-1">
                    <button
                        title={!isExpanded ? 'Settings' : undefined}
                        onClick={() => onNavigate('admin')}
                        className={twMerge(
                            "py-2.5 text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 rounded-lg transition-all flex items-center w-full group",
                            isExpanded ? "px-3 gap-3" : "px-0 justify-center"
                        )}>
                        <Settings size={18} strokeWidth={1.5} className="group-hover:text-blue-400 transition-colors shrink-0" />
                        {isExpanded && <span className="font-medium text-sm transition-all duration-300 animate-in fade-in">Settings</span>}
                    </button>
                    <button
                        title={!isExpanded ? 'Logout' : undefined}
                        className={twMerge(
                            "py-2.5 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all flex items-center w-full group",
                            isExpanded ? "px-3 gap-3" : "px-0 justify-center"
                        )}>
                        <LogOut size={18} strokeWidth={1.5} className="group-hover:text-red-400 transition-colors shrink-0" />
                        {isExpanded && <span className="font-medium text-sm transition-all duration-300 animate-in fade-in">Logout</span>}
                    </button>
                </div>

                <button
                    onClick={() => onNavigate('profile')}
                    className={twMerge(
                        "mt-4 pt-4 border-t border-slate-800/50 flex items-center gap-3 transition-opacity duration-200 w-full text-left hover:bg-slate-800/30 rounded-lg p-2 group/profile",
                        isExpanded ? "px-2 opacity-100" : "px-0 justify-center opacity-100" // Keep avatar visible
                    )}
                >
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shadow-md shrink-0 overflow-hidden border border-slate-600 group-hover/profile:border-slate-400 transition-colors">
                        <img
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150"
                            alt="Alex Morgan"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {isExpanded && (
                        <div className="flex flex-col overflow-hidden transition-all duration-300 animate-in fade-in">
                            <span className="text-sm font-semibold text-slate-200 group-hover/profile:text-white transition-colors">Alex Morgan</span>
                            <span className="text-[10px] text-slate-500 group-hover/profile:text-slate-400 transition-colors">Admin</span>
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
