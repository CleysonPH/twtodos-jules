## 2025-05-14 - [Maintaining API Compatibility while Optimizing]
**Learning:** When refactoring internal data structures for performance (e.g., Array to Map), changing public properties can break external consumers or tests. Using a getter to provide the old interface while using the new structure internally maintains compatibility.
**Action:** Always check for public properties before changing their types. If a change is necessary, consider providing a compatible getter or making the property private and providing specific accessors.

## 2025-05-14 - [Efficient Pagination with Maps]
**Learning:** Using `Array.from(map.values()).slice(start, end)` for pagination is $O(n)$ and allocates a new large array. For large Maps, using an iterator to skip items and only collect the required page is more memory-efficient and remains $O(n)$ in time but with better constant factors and lower memory pressure.
**Action:** Prefer iterators for paginating through Map or Set values to avoid unnecessary allocations.
