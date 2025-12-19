import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * StageScroll Component (Mathematical Precision Version)
 * 
 * Implements a strict measure-and-calculate strategy provided by the user.
 * 
 * CORE LOGIC:
 * 1. Measure all pill widths and the container width.
 * 2. Calculate cumulative positions.
 * 3. Scroll commands calculate the EXACT pixel offset needed to land safely.
 * 
 * This avoids visual overlapping by ensuring scroll stops align with pill boundaries + padding.
 */

const StageScroll = ({
    items = [],
    activeItem,
    onSelect,
    counts = {}
}) => {
    // --- Layout Constants ---
    const GAP = 16; // 16px safety gap (gap-4)

    // --- State & Refs ---
    const containerRef = useRef(null);
    const itemRefs = useRef([]); // Array of refs for each pill

    // Measurements state
    // We store measurements to trigger re-renders only if layout shifts significantly,
    // but for scrolling we mostly read refs directly for speed.
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    // --- Measurement Logic ---

    // Initialize refs array matches items length
    itemRefs.current = itemRefs.current.slice(0, items.length);

    const checkScrollButtons = useCallback(() => {
        if (!containerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
        // 2px buffer for variation
        setCanScrollLeft(scrollLeft > 2);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 2);
    }, []);

    // Initial measure & Window resize
    useLayoutEffect(() => {
        const handleResize = () => checkScrollButtons();
        window.addEventListener('resize', handleResize);

        // Initial check
        checkScrollButtons();

        return () => window.removeEventListener('resize', handleResize);
    }, [checkScrollButtons]);


    // --- ALGORITHMIC SCROLLING ---

    const getMetrics = () => {
        if (!containerRef.current) return null;
        const container = containerRef.current;
        const pills = Array.from(container.children);

        const containerWidth = container.clientWidth;
        const scrollOffset = container.scrollLeft;

        const pillMetrics = pills.map(pill => ({
            el: pill,
            left: pill.offsetLeft,
            width: pill.offsetWidth,
            right: pill.offsetLeft + pill.offsetWidth
        }));

        const totalWidth = container.scrollWidth;

        return { container, containerWidth, scrollOffset, pillMetrics, totalWidth };
    };

    const handleNext = () => {
        const m = getMetrics();
        if (!m) return;
        const { container, containerWidth, scrollOffset, pillMetrics, totalWidth } = m;

        const viewportEnd = scrollOffset + containerWidth;

        // ALGO: Find first pill whose right edge is > viewportEnd (scrolled out of view)
        // We want to bring this pill into view.
        let targetPill = pillMetrics.find(p => p.right > viewportEnd);

        // If all are visible (unlikely if canScrollRight is true), or essentially at end:
        if (!targetPill) {
            // Just go to end
            container.scrollTo({ left: totalWidth, behavior: 'smooth' });
            return;
        }

        // Calculate Target: Align the END of this target pill with the viewport end (minus GAP)
        // Formula: NewScroll = (PillRight) - (ContainerWidth - GAP)
        // This puts the pill's right edge exactly GAP pixels from the right arrow.
        let newScroll = targetPill.right - (containerWidth - GAP);

        // Clamp
        const maxScroll = totalWidth - containerWidth;
        newScroll = Math.max(0, Math.min(newScroll, maxScroll));

        container.scrollTo({ left: newScroll, behavior: 'smooth' });
    };

    const handlePrev = () => {
        const m = getMetrics();
        if (!m) return;
        const { container, scrollOffset, pillMetrics } = m;

        // ALGO: Find first pill whose left edge is to the LEFT of current scroll (scrolled out left)
        // We traverse backwards to find the one closest to entering.
        // Actually, simpler: find the first pill whose left < scrollOffset.
        // We want to bring it fully into view.

        // Find the last pill that is fully/partially hidden to the left
        // i.e., its Left position is less than current scroll.
        // We search from end to start to find the "rightmost" of the "left-hidden" ones?
        // No, standard prev algorithm:
        // We want to decrement scroll.
        // Let's find the pill currently at the left edge, and target the one BEFORE it.

        const firstVisiblePill = pillMetrics.find(p => p.right > scrollOffset + GAP);
        if (!firstVisiblePill) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
            return;
        }

        const prevIndex = pillMetrics.indexOf(firstVisiblePill) - 1;
        const targetPill = pillMetrics[prevIndex < 0 ? 0 : prevIndex];

        // Calculate Target: Align the START of this target pill with GAP.
        // Formula: NewScroll = PillLeft - GAP
        let newScroll = targetPill.left - GAP;

        // Clamp
        newScroll = Math.max(0, newScroll);

        container.scrollTo({ left: newScroll, behavior: 'smooth' });
    };

    // Auto-Scroll Active Item
    useEffect(() => {
        if (!activeItem) return;
        const m = getMetrics();
        if (!m) return;

        const index = items.indexOf(activeItem);
        const pill = m.pillMetrics[index];
        if (!pill) return;

        // Check visibility
        const isFullyVisible =
            pill.left >= m.scrollOffset &&
            pill.right <= (m.scrollOffset + m.containerWidth);

        if (!isFullyVisible) {
            // Scroll to center it safely
            pill.el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [activeItem, items]);

    return (
        <div className="w-full group/carousel flex items-center bg-slate-50/50 p-1.5 rounded-2xl border border-slate-100 gap-4 relative">

            {/* Left Control */}
            <div className="flex-none z-10">
                <button
                    onClick={handlePrev}
                    disabled={!canScrollLeft}
                    aria-label="Scroll left"
                    className={`
                        w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm transition-all duration-200
                        disabled:opacity-30 disabled:cursor-default disabled:shadow-none
                        ${canScrollLeft
                            ? 'hover:scale-105 hover:border-blue-300 hover:text-blue-600 hover:shadow-md cursor-pointer'
                            : ''
                        }
                    `}
                >
                    <ChevronLeft size={18} />
                </button>
            </div>

            {/* Scroll Container */}
            <div
                ref={containerRef}
                role="tablist"
                aria-label="Lead Stages"
                tabIndex={0}
                onScroll={checkScrollButtons}
                className="flex-1 overflow-x-auto scrollbar-hide py-3 px-1 select-none flex items-center relative gap-3 scroll-smooth focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {items.map((stage, index) => {
                    const isActive = activeItem === stage;
                    const count = counts[stage] ?? 0;

                    return (
                        <button
                            key={stage}
                            ref={el => itemRefs.current[index] = el}
                            role="tab"
                            aria-selected={isActive}
                            onClick={() => onSelect(stage)}
                            className={`
                                relative flex-none h-10 pl-4 pr-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 border whitespace-nowrap outline-none
                                ${isActive
                                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-md scale-[1.03] z-10 font-bold'
                                    : 'bg-white text-slate-600 border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md hover:scale-[1.03] hover:text-slate-800 font-medium'
                                }
                            `}
                        >
                            <span className="text-[13px] tracking-wide">
                                {stage}
                            </span>

                            <span className={`
                                flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] rounded-full font-bold transition-colors
                                ${isActive
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-slate-100 text-slate-400'
                                }
                            `}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Right Control */}
            <div className="flex-none z-10">
                <button
                    onClick={handleNext}
                    disabled={!canScrollRight}
                    aria-label="Scroll right"
                    className={`
                        w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm transition-all duration-200
                        disabled:opacity-30 disabled:cursor-default disabled:shadow-none
                        ${canScrollRight
                            ? 'hover:scale-105 hover:border-blue-300 hover:text-blue-600 hover:shadow-md cursor-pointer'
                            : ''
                        }
                    `}
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
};

export default StageScroll;
