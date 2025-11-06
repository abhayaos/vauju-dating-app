# Performance Optimization - Quick Reference Card

## 🎯 One-Liner Guide

**Replace hardcoded URLs** → `apiConfig.js`  
**Fetch with caching** → `useFetchWithCache`  
**Lazy load images** → `<LazyImage>`  
**Large lists** → `<VirtualizedList>`  
**Debounce input** → `useDebounce`  
**Monitor perf** → `performanceMonitor`

---

## 📝 Copy-Paste Examples

### Example 1: Fetch Posts with Caching
```jsx
import { useFetchWithCache } from './hooks/useFetchWithCache';

function Home() {
  const { data: posts, loading, error } = useFetchWithCache(
    '/api/posts',
    { headers: { 'Authorization': `Bearer ${token}` } },
    { ttl: 1800000 } // 30 minutes
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {posts?.map(post => (
        <PostCard key={post._id} {...post} />
      ))}
    </div>
  );
}
```

### Example 2: Lazy Load Image with Blur
```jsx
import LazyImage from './components/LazyImage';

<LazyImage
  src={profilePicUrl}
  alt="Profile"
  className="rounded-full"
  width={100}
  height={100}
  showBlur={true}  // Blur placeholder
/>
```

### Example 3: Virtual Scroll for Lists
```jsx
import { VirtualizedList } from './components/OptimizedList';

<VirtualizedList
  items={1000items}
  renderItem={(post) => <PostCard {...post} />}
  itemHeight={200}        // Height of each item
  containerHeight={600}   // Container height
/>
```

### Example 4: Debounced Search
```jsx
import { useDebounce } from './hooks/performanceHooks';

function SearchUsers() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500); // 500ms delay

  useEffect(() => {
    if (debouncedSearch) {
      searchUsers(debouncedSearch); // Only called after 500ms no typing
    }
  }, [debouncedSearch]);

  return <input onChange={e => setSearch(e.target.value)} />;
}
```

### Example 5: Memoized Component
```jsx
import React from 'react';

const PostCard = React.memo(({ post }) => (
  <div className="post-card">
    <h3>{post.title}</h3>
    <p>{post.content}</p>
  </div>
));

export default PostCard;
```

### Example 6: Monitor Performance
```jsx
import { monitor } from './utils/performanceMonitor';

// Time a function
monitor.start('data-fetch');
const data = await fetchData();
const duration = monitor.end('data-fetch');
console.log(`Took ${duration}ms`);

// Log all metrics
monitor.logMetrics();
```

---

## 🗺️ File Navigation

| Need | File | Feature |
|------|------|---------|
| API endpoints | `utils/apiConfig.js` | Centralized config |
| Cache API responses | `hooks/useFetchWithCache.js` | Smart caching |
| Lazy load images | `components/LazyImage.jsx` | Blur effect |
| Large lists | `components/OptimizedList.jsx` | Virtual scroll |
| Debounce input | `hooks/performanceHooks.js` | useDebounce |
| Monitor perf | `utils/performanceMonitor.js` | Track metrics |

---

## ⚡ Common Patterns

### Pattern A: Fetch & Display
```jsx
const { data, loading, error } = useFetchWithCache(
  '/api/data',
  { headers: { 'Authorization': `Bearer ${token}` } }
);
return loading ? '...' : data;
```

### Pattern B: Lazy Images in Lists
```jsx
{items.map(item => (
  <LazyImage key={item.id} src={item.image} />
))}
```

### Pattern C: Infinite Scroll
```jsx
const { data, loading } = useFetchWithCache(`/api/posts?page=${page}`);
return (
  <InfiniteScrollList
    items={posts}
    onLoadMore={() => setPage(p => p + 1)}
    hasMore={!isLastPage}
  />
);
```

---

## 🎯 Integration Checklist

- [ ] Replace `fetch()` with `useFetchWithCache`
- [ ] Replace `<img>` with `<LazyImage>`
- [ ] Wrap components with `React.memo()`
- [ ] Add `useDebounce` to search inputs
- [ ] Use `VirtualizedList` for 500+ items
- [ ] Test with `npm run build`
- [ ] Check bundle size: `dist/` folder

---

## 📊 Performance Targets

| Metric | Target | How to Achieve |
|--------|--------|----------------|
| LCP | < 2.5s | Use code splitting + LazyImage |
| FID | < 100ms | Use React.memo() + useDebounce |
| CLS | < 0.1 | Lazy load images properly |
| JS | < 150KB | Already done with code splitting |

---

## 🐛 Debugging

### Check Cache Status
```javascript
import { cacheManager } from './src/utils/cacheManager';
cacheManager.getStats();
```

### View Performance Metrics
```javascript
import { monitor } from './src/utils/performanceMonitor';
monitor.logMetrics();
```

### Test Build Size
```bash
npm run build
# Check dist/ folder sizes
```

---

## ❌ Common Mistakes

1. **Using LazyImage without Cloudinary URLs**
   - Fix: Works with any URL, blur effect requires Cloudinary

2. **Memoizing with objects in props**
   ```jsx
   // ❌ Bad
   <Memo component={{ id: 1 }} />
   
   // ✅ Good
   const config = useMemo(() => ({ id: 1 }), []);
   <Memo component={config} />
   ```

3. **Not setting useDebounce default value**
   ```jsx
   // ❌ Bad
   const debounced = useDebounce(search); // No delay
   
   // ✅ Good
   const debounced = useDebounce(search, 500); // 500ms
   ```

4. **Using VirtualizedList with variable heights**
   - Fix: All items must have same height, use OptimizedList for mixed

5. **Forgetting auth tokens**
   ```jsx
   // ❌ Bad
   useFetchWithCache('/api/private')
   
   // ✅ Good
   useFetchWithCache('/api/private', {
     headers: { 'Authorization': `Bearer ${token}` }
   })
   ```

---

## 🚀 Priority Actions

**MUST DO:**
- [ ] Use `useFetchWithCache` instead of `useState` + `useEffect`
- [ ] Replace `<img>` with `<LazyImage>`
- [ ] Wrap components with `React.memo()`

**SHOULD DO:**
- [ ] Add `useDebounce` to search
- [ ] Use `VirtualizedList` for large lists
- [ ] Cache profile/user data

**NICE TO HAVE:**
- [ ] Add performance monitoring
- [ ] Set up Lighthouse CI
- [ ] Optimize remaining images

---

## 📚 Documentation

| Document | Length | Content |
|----------|--------|---------|
| PERFORMANCE_SUMMARY.md | 5 min | Overview |
| OPTIMIZATION_IMPLEMENTATION_GUIDE.md | 30 min | Examples & patterns |
| PERFORMANCE_OPTIMIZATION.md | 1 hour | Deep dive |
| IMPLEMENTATION_CHECKLIST.md | 15 min | Progress tracking |

---

## 💬 Need Help?

**Question about...** | **Read...**
---|---
What optimizations? | PERFORMANCE_SUMMARY.md
How to use feature? | OPTIMIZATION_IMPLEMENTATION_GUIDE.md
Why this works? | PERFORMANCE_OPTIMIZATION.md
Progress tracking? | IMPLEMENTATION_CHECKLIST.md
Everything? | PERFORMANCE_INDEX.md

---

**Last Updated**: 2025-11-06  
**Status**: ✅ All tools ready
