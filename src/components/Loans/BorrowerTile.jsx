import React, { useState, useRef, useEffect } from 'react';
import {
    Building2, User, Phone, MoreVertical,
    Mail, ExternalLink, BadgeCheck, FileText,
    Users, Briefcase, Tag, AlertTriangle, History,
    FileOutput, Copy
} from 'lucide-react';
import CallPrimaryWidget from '../Shared/CallPrimaryWidget';

const BorrowerTile = ({ loan, onLogActivity }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const MenuAction = ({ icon: Icon, label, onClick, danger = false }) => (
        <button
            onClick={onClick}
            className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 transition-colors
                ${danger ? 'text-red-600 hover:bg-red-50' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'}
            `}
        >
            <Icon size={14} className={danger ? 'text-red-500' : 'text-slate-400'} />
            {label}
        </button>
    );

    const MenuDivider = () => <div className="h-px bg-slate-100 my-1"></div>;

    return (
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm relative group z-10">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 leading-tight text-sm">{loan.borrower}</h3>
                        <div className="flex items-center gap-1.5 mt-1">
                            <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wide border border-slate-200">
                                LLC
                            </span>
                            <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                <BadgeCheck size={10} /> Active
                            </span>
                        </div>
                    </div>
                </div>

                {/* Kebab Menu */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={toggleMenu}
                        className={`text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md ${isMenuOpen ? 'bg-slate-100 text-blue-600' : ''}`}
                        title="More actions"
                    >
                        <MoreVertical size={16} />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-8 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-1 animate-in fade-in zoom-in-95 duration-200 z-50">
                            <div className="px-4 py-2 border-b border-slate-50">
                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Borrower Actions</span>
                            </div>



                            <MenuAction icon={Users} label="Change Owner" />
                            <MenuAction icon={Tag} label="Manage Tags" />

                            <MenuDivider />

                            <MenuAction icon={History} label="View Audit History" />
                            <MenuAction icon={FileOutput} label="Export Summary (PDF)" />

                            <MenuDivider />

                            <MenuAction icon={Copy} label="Merge Duplicate" />
                            <MenuAction icon={AlertTriangle} label="Mark as Inactive" danger={true} />
                        </div>
                    )}
                </div>
            </div>

            {/* Context Line */}
            <div className="mb-4 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                <span className="text-slate-500">Active Loan: </span>
                <span className="font-medium text-slate-700">{loan.id}</span>
                <span className="mx-1.5 text-slate-300">|</span>
                <span className="text-purple-600 font-bold">{loan.stage}</span>
            </div>

            {/* Contact Info & Actions */}
            <div className="space-y-3">
                <div className="flex items-center justify-between group/row">
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                            <User size={12} />
                        </div>
                        <div className="text-xs">
                            <div className="font-bold text-slate-700">John Doe</div>
                            <div className="text-[10px] text-slate-400">Primary Owner</div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <CallPrimaryWidget
                        context={{ type: 'Loan', id: loan.id, name: loan.borrower }}
                        contact={{ name: 'John Doe', phone: '(555) 123-4567', role: 'Primary Owner' }}
                        variant="minimal"
                        onLogActivity={onLogActivity}
                    />
                    <button className="flex-1 flex items-center justify-center gap-2 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all">
                        <Mail size={12} /> Email
                    </button>
                    <button className="p-1.5 rounded-md border border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 transition-all" title="View full Borrower Profile">
                        <ExternalLink size={12} />
                    </button>
                </div>
            </div>

            {/* Footer Tag */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Program</span>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                    {loan.program}
                </span>
            </div>
        </div>
    );
};

export default BorrowerTile;
