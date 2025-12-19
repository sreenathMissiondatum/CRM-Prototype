import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * StageScroll Component
 * 
 * A horizontal scrolling stage selector with intelligent snapping, accessibility,
 * and guarded arrow zones to prevent visual overlap.
 * 
 * @param {string[]} items - Array of stage names
 * @param {string} activeItem - Currently selected stage
 * @param {function} onSelect - Callback when a stage is selected
 * @param {object} counts - Optional mapping of stage names to counts
 */
const StageScroll = ({
    items = [],
    activeItem,
    onSelect,
    counts = {}
}) => {
    // --- Constants ---
    const ARROW_ZONE_WIDTH = 56; // Width reserved for arrows (px)
    const ARROW_GAP = 12; // Gap between arrow and content (px)
    const SAFE_ZONE = ARROW_ZONE_WIDTH + ARROW_GAP; // Total safe padding
    const SCROLL_DURATION = 320; // ms

    // --- State & Refs ---
    const containerRef = useRef(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    // Track fully visible items for intelligent navigation
    // using a ref to avoid re-renders on rapid scroll
    const visibleItemsRef = useRef(new Set());

    // --- Measurements & Visibility Logic ---

    // Check scroll availability
    const checkScrollState = useCallback(() => {
        if (!containerRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

        // Allow 1px buffer for float rounding
        setCanScrollLeft(scrollLeft > 1);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }, []);

    // Intersection Observer to track visibility
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observerOptions = {
            root: container,
            // Threshold 0.99 means item is ~100% visible
            threshold: 0.99,
            // Root margin adjusts the "visible" area to respect our safe zones
            // We shrink the detection box by the safe zone amount so items under arrows aren't "visible"
            rootMargin: `0px -${ARROW_ZONE_WIDTH}px 0px -${ARROW_ZONE_WIDTH}px`
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const index = parseInt(entry.target.dataset.index);
                if (entry.isIntersecting) {
                    visibleItemsRef.current.add(index);
                } else {
                    visibleItemsRef.current.delete(index);
                }
            });
            // Update arrows after visibility changes
            checkScrollState();
        }, observerOptions);

        const pills = container.querySelectorAll('[role="tab"]');
        pills.forEach(pill => observer.observe(pill));

        checkScrollState();

        return () => observer.disconnect();
    }, [items, checkScrollState]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            checkScrollState();
            // Re-snap could happen here, but might be jarring during drag resizing
        };
        const resizeObserver = new ResizeObserver(handleResize);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }
        return () => resizeObserver.disconnect();
    }, [checkScrollState]);


    // --- Scrolling Logic ---

    // Scroll to specific position smoothly
    const smoothScrollTo = (targetLeft) => {
        if (!containerRef.current) return;
        containerRef.current.scrollTo({
            left: targetLeft,
            behavior: 'smooth'
        });
    };

    const handleNext = () => {
        if (!containerRef.current) return;

        // Find the first item that comes AFTER the current set of visible items
        const visibleIndices = Array.from(visibleItemsRef.current).sort((a, b) => a - b);
        const lastVisibleIndex = visibleIndices[visibleIndices.length - 1] ?? -1;
        const nextIndex = Math.min(lastVisibleIndex + 1, items.length - 1);

        const pills = containerRef.current.querySelectorAll('[role="tab"]');
        const targetPill = pills[nextIndex];

        if (targetPill) {
            // Calculate position to snap this pill to the LEFT safe zone start
            // targetPill.offsetLeft is relative to the scroll container's total width
            // We want targetPill to start at ARROW_ZONE_WIDTH + ARROW_GAP
            // So we scroll to: pill.offsetLeft - SAFE_ZONE
            const targetLeft = targetPill.offsetLeft - SAFE_ZONE;
            smoothScrollTo(Math.max(0, targetLeft));
        } else {
            // Fallback to max scroll
            smoothScrollTo(containerRef.current.scrollWidth);
        }
    };

    const handlePrev = () => {
        if (!containerRef.current) return;

        // Find the item that should become the NEW first visible item
        // We look for the first currently visible item, then jump back X slots
        // Or simpler: Find the first currently visible index, assume we want to show 
        // the item BEFORE it as the new *last* item, or just scroll back by a page.

        // Better logic: Find the first fully visible item 'i'.
        // We want to scroll such that the item 'i-1' is fully visible, 
        // ideally aligning the *start* of a previous set of items.

        // Let's scroll to the item before the first visible one, aligning it to the RIGHT safe zone?
        // No, typically we align to left.

        const visibleIndices = Array.from(visibleItemsRef.current).sort((a, b) => a - b);
        const firstVisibleIndex = visibleIndices[0] ?? 0;
        const prevIndex = Math.max(firstVisibleIndex - 1, 0);

        const pills = containerRef.current.querySelectorAll('[role="tab"]');
        const targetPill = pills[prevIndex];

        // Note: For "Previous", purely scrolling to the prev pill might only move 1 item. 
        // To be smarter (page flip), we could calculate available width. 
        // But for pills, usually stepping back 1-by-1 or by a chunk is fine.
        // Let's try to calculate a "page" back.

        // Determine how many items currently fit?
        // const pageSize = visibleIndices.length || 1;
        // const targetIndex = Math.max(0, firstVisibleIndex - pageSize);
        // Let's stick to the "Previous one becomes first" for strictness, or "Page" logic?
        // User asked: "Move to show as many as fit."

        // Simple robust approach for < : Scan backwards from current scroll position
        // and find the pill that would fit if aligned to left. 
        // For now, let's align the `prevIndex` element to the Left Safe Zone.

        if (targetPill) {
            // To show 'prevIndex' fully, we scroll to its left edge - SafeZone
            const targetLeft = targetPill.offsetLeft - SAFE_ZONE;
            smoothScrollTo(Math.max(0, targetLeft));
        }
    };

    // Snap to nearest pill on drag/scroll end
    const handleScrollEnd = useCallback(() => {
        if (!containerRef.current || isDragging) return;

        // We can implement a "magnet" snap here if desired
        // For now, the "button-driven" interaction is the primary requirement.
        // Native CSS snap points usually handle the "fling" best.
        // However, we want to respect safe zones.
        // CSS scroll-padding-left handles the snap offset.

        checkScrollState();
    }, [isDragging, checkScrollState]);

    // Debounced scroll end detection
    useEffect(() => {
        const container = containerRef.current;
        let timeout;
        const onScroll = () => {
            checkScrollState();
            clearTimeout(timeout);
            timeout = setTimeout(handleScrollEnd, 100);
        };

        if (container) {
            container.addEventListener('scroll', onScroll, { passive: true });
        }
        return () => {
            if (container) {
                container.removeEventListener('scroll', onScroll);
                clearTimeout(timeout);
            }
        };
    }, [handleScrollEnd, checkScrollState]);


    // --- Mouse Drag Logic (Duplicate of existing for familiarity) ---
    const startDrag = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - containerRef.current.offsetLeft);
        setScrollLeft(containerRef.current.scrollLeft);
        containerRef.current.style.cursor = 'grabbing';
        containerRef.current.style.scrollBehavior = 'auto'; // Disable smooth for direct drag
    };

    const stopDrag = () => {
        if (!isDragging) return;
        setIsDragging(false);
        if (containerRef.current) {
            containerRef.current.style.cursor = 'grab';
            containerRef.current.style.scrollBehavior = 'smooth';
            // Trigger a snap check?
            handleScrollEnd();
        }
    };

    const doDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Speed multiplier
        containerRef.current.scrollLeft = scrollLeft - walk;
    };


    return (
        <div className="relative w-full group/carousel flex items-center">

            {/* --- Left Arrow --- */}
            {/* Positioned absolutely within the safe zone */}
            <div
                className="absolute left-0 z-20 h-full flex items-center justify-center pointer-events-none"
                style={{ width: `${ARROW_ZONE_WIDTH}px` }}
            >
                <button
                    onClick={handlePrev}
                    disabled={!canScrollLeft}
                    aria-label="Previous stages"
                    className={`
                        pointer-events-auto w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm transition-all duration-200
                        ${canScrollLeft
                            ? 'hover:scale-105 hover:border-blue-300 hover:text-blue-600 hover:shadow-md active:scale-95'
                            : 'opacity-0 cursor-default' // Hide efficiently when disabled
                        }
                    `}
                >
                    <ChevronLeft size={18} />
                </button>
            </div>

            {/* --- Scroll Container --- */}
            <div
                ref={containerRef}
                onMouseDown={startDrag}
                onMouseLeave={stopDrag}
                onMouseUp={stopDrag}
                onMouseMove={doDrag}
                role="tablist"
                aria-label="Lead Stages"
                className="flex-1 overflow-x-auto scrollbar-hide py-3 select-none cursor-grab active:cursor-grabbing snap-x snap-mandatory flex items-center"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    // Safe Zones are applied as PADDING on the container
                    // This ensures content can scroll INTO the safe zone but default snap is OUTSIDE it.
                    // Wait, if we pad, the content is permanently pushed in. 
                    // Better: Padding ensures the first item starts after the arrow.
                    paddingLeft: `${SAFE_ZONE}px`,
                    paddingRight: `${SAFE_ZONE}px`,
                    // Snap alignment needs to match padding
                    scrollPaddingLeft: `${SAFE_ZONE}px`,
                    scrollPaddingRight: `${SAFE_ZONE}px`,
                    gap: '12px'
                }}
            >
                {items.map((stage, index) => {
                    const isActive = activeItem === stage;
                    const count = counts[stage] ?? 0;

                    return (
                        <button
                            key={stage}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`panel-${stage}`}
                            tabIndex={0}
                            data-index={index}
                            onClick={() => {
                                if (!isDragging) onSelect(stage);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onSelect(stage);
                                }
                            }}
                            className={`
                                snap-start relative flex-none h-10 pl-4 pr-3 rounded-xl flex items-center gap-2.5 transition-all duration-300 border whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
                                ${isActive
                                    ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-md scale-[1.03] z-10'
                                    : 'bg-white text-slate-600 border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md hover:scale-[1.03] hover:text-slate-800'
                                }
                            `}
                        >
                            <span className={`text-[13px] tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
                                {stage}
                            </span>

                            {/* Count Badge */}
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

            {/* --- Right Arrow --- */}
            <div
                className="absolute right-0 z-20 h-full flex items-center justify-center pointer-events-none"
                style={{ width: `${ARROW_ZONE_WIDTH}px` }}
            >
                <button
                    onClick={handleNext}
                    disabled={!canScrollRight}
                    aria-label="Next stages"
                    className={`
                        pointer-events-auto w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 shadow-sm transition-all duration-200
                        ${canScrollRight
                            ? 'hover:scale-105 hover:border-blue-300 hover:text-blue-600 hover:shadow-md active:scale-95'
                            : 'opacity-0 cursor-default'
                        }
                    `}
                >
                    <ChevronRight size={18} />
                </button>
            </div>

            {/* Visual gradient to mask fadeout under arrows? 
                User req says "no awkward gap", strict visibility. 
                With strict padding, no mask needed. 
            */}
        </div>
    );
};

export default StageScroll;
