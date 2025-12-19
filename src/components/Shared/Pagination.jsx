import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    onItemsPerPageChange
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
        const pages = [];
        const maxVisibleButtons = 5; // How many numbers to show including ends

        if (totalPages <= 7) {
            // Show all if few pages
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            // Always show first and last
            // Logic for ellipsis
            if (currentPage <= 4) {
                // Near start: 1, 2, 3, 4, 5, ..., 20
                for (let i = 1; i <= 5; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 3) {
                // Near end: 1, ..., 16, 17, 18, 19, 20
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
            } else {
                // Middle: 1, ..., 4, 5, 6, ..., 20
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    if (totalItems === 0) return null;

    return (
        <div className="px-6 py-4 flex items-center justify-between border-t border-slate-200 bg-slate-50 w-full">

            {/* Left: Result Count */}
            <div className="flex-1 text-sm text-slate-500">
                <span className="font-medium text-slate-700">Showing {startItem}–{endItem}</span> of <span className="font-medium text-slate-700">{totalItems}</span> results
            </div>

            {/* Center: Pagination Controls */}
            <div className="flex items-center gap-1.5 justify-center">
                {/* Previous */}
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                        {page === '...' ? (
                            <span className="px-2 text-slate-400 select-none">...</span>
                        ) : (
                            <button
                                onClick={() => handlePageChange(page)}
                                className={`
                                    min-w-[32px] h-8 px-2 flex items-center justify-center rounded-md text-sm font-medium transition-all
                                    ${page === currentPage
                                        ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200'}
                                `}
                            >
                                {page}
                            </button>
                        )}
                    </React.Fragment>
                ))}

                {/* Next */}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Right: Rows Per Page */}
            <div className="flex-1 flex justify-end items-center gap-2">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Rows per page</span>
                <div className="relative group">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="appearance-none bg-white border border-slate-200 rounded-md py-1.5 pl-3 pr-8 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-colors cursor-pointer shadow-sm"
                    >
                        {[10, 25, 50, 100].map(val => (
                            <option key={val} value={val}>{val}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-slate-600 transition-colors" />
                </div>
            </div>

        </div>
    );
};

export default Pagination;
