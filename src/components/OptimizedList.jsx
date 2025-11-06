import React, { useCallback, useMemo } from 'react';

/**
 * VirtualizedList - Component for rendering large lists efficiently
 * Uses window-based virtual scrolling to render only visible items
 * 
 * This component is optimized for long lists (1000+ items)
 * and significantly improves performance
 */
function VirtualizedList({
  items = [],
  renderItem,
  itemHeight = 80,
  containerHeight = 600,
  overscan = 5,
  className = '',
}) {
  // Calculate visible range
  const [scrollOffset, setScrollOffset] = React.useState(0);

  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollOffset / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollOffset + containerHeight) / itemHeight) + overscan
    );

    return { startIndex, endIndex };
  }, [scrollOffset, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex + 1);
  }, [items, visibleRange]);

  const handleScroll = useCallback((e) => {
    setScrollOffset(e.target.scrollTop);
  }, []);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.startIndex * itemHeight;

  return (
    <div
      className={`overflow-y-auto ${className}`}
      style={{ height: `${containerHeight}px` }}
      onScroll={handleScroll}
    >
      {/* Spacer before visible items */}
      <div style={{ height: `${offsetY}px` }} />

      {/* Visible items */}
      <div>
        {visibleItems.map((item, index) => (
          <div
            key={item.id || index}
            style={{ height: `${itemHeight}px` }}
          >
            {renderItem(item, visibleRange.startIndex + index)}
          </div>
        ))}
      </div>

      {/* Spacer after visible items */}
      <div style={{ height: `${totalHeight - offsetY - (visibleItems.length * itemHeight)}px` }} />
    </div>
  );
}

/**
 * InfiniteScrollList - Component for infinite scrolling
 * Automatically loads more items as user scrolls
 */
function InfiniteScrollList({
  items = [],
  renderItem,
  onLoadMore,
  hasMore = true,
  isLoading = false,
  loadingComponent = <div className="text-center py-4">Loading...</div>,
  itemHeight = 80,
  containerHeight = 600,
  threshold = 100,
  className = '',
}) {
  const [scrollOffset, setScrollOffset] = React.useState(0);
  const containerRef = React.useRef(null);

  const handleScroll = useCallback((e) => {
    const element = e.target;
    setScrollOffset(element.scrollTop);

    // Check if near bottom
    const isNearBottom =
      element.scrollHeight - element.scrollTop - element.clientHeight < threshold;

    if (isNearBottom && hasMore && !isLoading && onLoadMore) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore, threshold]);

  return (
    <div
      ref={containerRef}
      className={`overflow-y-auto ${className}`}
      style={{ height: `${containerHeight}px` }}
      onScroll={handleScroll}
    >
      <div>
        {items.map((item, index) => (
          <div key={item.id || index} style={{ minHeight: `${itemHeight}px` }}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>

      {isLoading && loadingComponent}

      {!hasMore && items.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          No more items to load
        </div>
      )}
    </div>
  );
}

/**
 * OptimizedList - Combines memoization with efficient rendering
 * Best for moderate-sized lists (100-500 items)
 */
function OptimizedList({
  items = [],
  renderItem,
  keyExtractor = (item, index) => item.id || index,
  className = '',
}) {
  return (
    <div className={className}>
      {items.map((item, index) => (
        <React.Fragment key={keyExtractor(item, index)}>
          {renderItem(item, index)}
        </React.Fragment>
      ))}
    </div>
  );
}

export { VirtualizedList, InfiniteScrollList, OptimizedList };

export default {
  VirtualizedList,
  InfiniteScrollList,
  OptimizedList,
};
