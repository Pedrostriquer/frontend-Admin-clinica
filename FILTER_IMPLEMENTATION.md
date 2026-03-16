# Blog GemCapital - Filter Implementation Summary

## Overview
Comprehensive filter implementation for the Blog GemCapital admin panel with support for:
- Status filtering (Active/Inactive/All)
- Date range filtering (from date, to date, or both)

## Architecture

### Frontend Flow
```
User Input (PostsList.js)
    ↓
[Status: Active/Inactive/All]
[From Date: YYYY-MM-DD]
[To Date: YYYY-MM-DD]
    ↓
Click "Aplicar Filtros"
    ↓
onFilterChange() prop called with filter object
    ↓
handleFilterChange() in BlogGemCapitalPage.js
    ↓
gemCapitalBlogServices.getPostsPaginated() with filters
    ↓
Backend API with query parameters
    ↓
Filtered results returned
    ↓
posts state updated
    ↓
PostsList re-renders with filtered posts
```

## Files Modified

### 1. Frontend Files

#### `/src/Components/Platform/BlogGemCapital/BlogGemCapitalPage.js`
- **Added State:**
  ```javascript
  const [filters, setFilters] = useState({
    active: null,
    createdFromDate: null,
    createdToDate: null,
  });
  ```

- **Added Handler Function:**
  ```javascript
  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    setLoading(true);
    try {
      const data = await gemCapitalBlogServices.getPostsPaginated(
        1, // Reset to page 1 when filters change
        20,
        null, // categoryId
        null, // searchTerm
        newFilters.active,
        newFilters.createdFromDate,
        newFilters.createdToDate
      );
      setPosts(data.items || []);
    } catch (error) {
      console.error("Erro ao aplicar filtros:", error);
      alert("Erro ao aplicar filtros");
    } finally {
      setLoading(false);
    }
  };
  ```

- **Updated PostsList Prop:**
  - Added: `onFilterChange={handleFilterChange}`

#### `/src/Components/Platform/BlogGemCapital/PostsList.js` (Already Implemented)
- **Filter State:**
  ```javascript
  const [filterStatus, setFilterStatus] = useState(null); // null = todos, true = ativos, false = inativos
  const [filterFromDate, setFilterFromDate] = useState("");
  const [filterToDate, setFilterToDate] = useState("");
  ```

- **Filter UI:**
  - Status dropdown (Todos, Ativos, Inativos)
  - Date input for "Data Inicial"
  - Date input for "Data Final"
  - "Aplicar Filtros" button

- **Handler:**
  ```javascript
  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        active: filterStatus,
        createdFromDate: filterFromDate ? new Date(filterFromDate) : null,
        createdToDate: filterToDate ? new Date(filterToDate) : null,
      });
    }
  };
  ```

#### `/src/dbServices/gemCapitalBlogServices.js` (Already Implemented)
- **Updated getPostsPaginated() method:**
  ```javascript
  getPostsPaginated: async (
    page = 1,
    pageSize = 20,
    categoryId = null,
    searchTerm = null,
    active = null,
    createdFromDate = null,
    createdToDate = null
  ) => {
    try {
      let url = `blog-gemcapital/posts/paginated?page=${page}&pageSize=${pageSize}`;
      if (categoryId) url += `&categoryId=${categoryId}`;
      if (searchTerm) url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
      if (active !== null) url += `&active=${active}`;
      if (createdFromDate) url += `&createdFromDate=${createdFromDate.toISOString().split('T')[0]}`;
      if (createdToDate) url += `&createdToDate=${createdToDate.toISOString().split('T')[0]}`;

      const response = await api.get(url);
      return response.data || { items: [], totalItems: 0, totalPages: 0 };
    } catch (error) {
      console.error("Erro ao buscar posts paginados:", error.response?.data || error.message);
      throw error;
    }
  }
  ```

### 2. Backend Files (Already Implemented)

#### `/Controllers/BlogGemCapital/BlogGemCapitalPostsController.cs`
- **GetPostsPaginated endpoint:**
  ```csharp
  [HttpGet("paginated")]
  public async Task<ActionResult<PaginatedBlogPostDto>> GetPostsPaginated(
    int page = 1,
    int pageSize = 20,
    int? categoryId = null,
    string? searchTerm = null,
    bool? activeOnly = null,
    bool? active = null,
    DateTime? createdFromDate = null,
    DateTime? createdToDate = null)
  ```

#### `/Services/BlogGemCapital/BlogGemCapitalPostService.cs`
- **GetPostsPaginatedAsync method:**
  - Filters by `active` status when provided
  - Filters by `createdFromDate` (>= comparison)
  - Filters by `createdToDate` (< comparison for end of day)
  - Returns paginated results with items, totalItems, totalPages

## Filter Behavior

### Status Filter
- **null (Todos):** Returns all posts
- **true (Ativos):** Returns only active posts (active = true)
- **false (Inativos):** Returns only inactive posts (active = false)

### Date Range Filter
- **From Date Only:** Returns posts created on or after the specified date
- **To Date Only:** Returns posts created before the end of the specified date
- **Both Dates:** Returns posts created between the two dates (inclusive)
- **No Date:** Returns all posts (no date filtering)

## How It Works

1. **User opens the admin page:**
   - `fetchPosts()` is called on component mount
   - All posts are loaded and displayed

2. **User sets filter values:**
   - User selects a status from dropdown
   - User enters start and/or end date
   - UI updates in real-time (no form submission required)

3. **User clicks "Aplicar Filtros":**
   - PostsList calls `onFilterChange` prop
   - BlogGemCapitalPage's `handleFilterChange` is invoked
   - Loading spinner appears
   - API call is made with filter parameters
   - Results are displayed
   - Pagination resets to page 1

4. **Results Update:**
   - Posts that match all active filters are displayed
   - If no posts match, "Nenhum post encontrado" message appears

## Testing Checklist

- [ ] Open blog admin and verify posts load normally
- [ ] Filter by "Ativos" - should show only active posts
- [ ] Filter by "Inativos" - should show only inactive posts
- [ ] Filter by "Todos" - should show all posts
- [ ] Set "Data Inicial" to a past date - should show posts from that date forward
- [ ] Set "Data Final" to a recent date - should show posts up to that date
- [ ] Set both dates - should show posts between those dates
- [ ] Clear filters (set to default values) and reapply - should reset to all posts
- [ ] Create a new post and verify it appears in filters correctly
- [ ] Edit a post's status and verify filter updates correctly
- [ ] Delete a post and verify it's removed from filtered results
- [ ] Check that pagination resets to page 1 when filters are applied
