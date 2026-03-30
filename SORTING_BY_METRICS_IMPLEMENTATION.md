# Blog GemCapital - Sorting by Metrics Implementation

## Overview
Implemented comprehensive sorting/filtering by post metrics (likes, views) and additional sorting options to the Blog GemCapital admin panel.

## Features Added

### Sorting Options
- **Date (Mais Recentes)** - Default, orders by PublishedAt or CreatedAt descending
- **Mais Curtidos** - Orders by Likes descending
- **Menos Curtidos** - Orders by Likes ascending
- **Mais Visualizados** - Orders by Views descending
- **Menos Visualizados** - Orders by Views ascending
- **Título (A-Z)** - Alphabetical by title ascending
- **Título (Z-A)** - Alphabetical by title descending

### Metrics Display
- Posts now display **Views** (👁️) and **Likes** (👍) count on each card
- Metrics are visible and comparable across posts

## Implementation Details

### Backend Changes

#### 1. New Enum File
**File:** `/sessions/affectionate-jolly-fermi/mnt/backend/Enums/BlogSortOption.cs`
- Created enum defining all available sort options
- Provides type safety for sort parameters

#### 2. Service Interface Update
**File:** `/sessions/affectionate-jolly-fermi/mnt/backend/Interfaces/BlogGemCapital/IBlogGemCapitalPostService.cs`
- Updated `GetPostsPaginatedAsync` signature to include `string? sortBy` parameter
- Signature now includes all filter parameters: page, pageSize, categoryId, searchTerm, activeOnly, active, createdFromDate, createdToDate, sortBy

#### 3. Service Implementation
**File:** `/sessions/affectionate-jolly-fermi/mnt/backend/Services/BlogGemCapital/BlogGemCapitalPostService.cs`
- Added `sortBy` parameter to `GetPostsPaginatedAsync` method
- Implemented sorting logic using C# switch expression:
  ```csharp
  IQueryable<BlogGemCapitalPost> orderedQuery = sortBy?.ToLower() switch
  {
      "mostliked" => query.OrderByDescending(p => p.Likes),
      "leastliked" => query.OrderBy(p => p.Likes),
      "mostviewed" => query.OrderByDescending(p => p.Views),
      "leastviewed" => query.OrderBy(p => p.Views),
      "titleasc" => query.OrderBy(p => p.Title),
      "titledesc" => query.OrderByDescending(p => p.Title),
      _ => query.OrderByDescending(p => p.PublishedAt ?? p.CreatedAt)  // Default
  };
  ```
- Updated console logging to include sortBy parameter

#### 4. Controller Endpoint
**File:** `/sessions/affectionate-jolly-fermi/mnt/backend/Controllers/BlogGemCapital/BlogGemCapitalPostsController.cs`
- Added `[FromQuery] string? sortBy = null` parameter to `GetPostsPaginated` endpoint
- Passes sortBy to service method call
- Updated logging to include sortBy parameter

### Frontend Changes

#### 1. Service Layer Update
**File:** `/sessions/affectionate-jolly-fermi/mnt/frontend-admin-gemas/src/dbServices/gemCapitalBlogServices.js`
- Updated `getPostsPaginated` method signature to include `sortBy` parameter
- Added URL parameter construction: `if (sortBy) url += \`&sortBy=${encodeURIComponent(sortBy)}\`;`

#### 2. Page State Management
**File:** `/sessions/affectionate-jolly-fermi/mnt/frontend-admin-gemas/src/Components/Platform/BlogGemCapital/BlogGemCapitalPage.js`
- Added `sortBy: null` to filters state object
- Updated `handleFilterChange` to pass `newFilters.sortBy` to API call

#### 3. PostsList Component
**File:** `/sessions/affectionate-jolly-fermi/mnt/frontend-admin-gemas/src/Components/Platform/BlogGemCapital/PostsList.js`
- Added `sortBy` state: `const [sortBy, setSortBy] = useState(null);`
- Created new filter dropdown with sort options:
  - Date (Mais Recentes)
  - Mais Curtidos
  - Menos Curtidos
  - Mais Visualizados
  - Menos Visualizados
  - Título (A-Z)
  - Título (Z-A)
- Updated `handleFilterChange` to include `sortBy` in the filter object
- Added metrics display on post cards:
  ```javascript
  <div style={{ display: "flex", gap: "12px", marginTop: "8px", fontSize: "12px", color: "#666" }}>
    <span>👁️ {post.views || 0}</span>
    <span>👍 {post.likes || 0}</span>
  </div>
  ```

## How It Works

### User Flow
1. User opens the blog admin panel
2. User can now see a new "Ordenar por:" dropdown in the filters section
3. User selects a sorting option:
   - Options include metrics (likes, views) and other criteria (title, date)
   - Each post card displays views and likes count
4. User clicks "Aplicar Filtros"
5. Frontend calls API with `sortBy` parameter
6. Backend returns posts sorted by the selected criteria
7. Posts display with the new sorting applied

### Query Integration
- Sorting works seamlessly with existing filters:
  - Status filter (active/inactive)
  - Date range filter (from/to date)
  - Search term filter
- All filters and sorting can be combined
- Pagination resets to page 1 when filters change

## API Contract

### Request
```
GET /api/blog-gemcapital/posts/paginated?page=1&pageSize=20&sortBy=mostliked
```

Query Parameters:
- `page`: (optional) Page number (default: 1)
- `pageSize`: (optional) Items per page (default: 20)
- `categoryId`: (optional) Filter by category ID
- `searchTerm`: (optional) Filter by search term
- `active`: (optional) Filter by status (true/false/null)
- `createdFromDate`: (optional) Filter by start date (YYYY-MM-DD)
- `createdToDate`: (optional) Filter by end date (YYYY-MM-DD)
- `sortBy`: (optional) Sort option (mostliked, leastliked, mostviewed, leastviewed, titleasc, titledesc)

### Response
```json
{
  "items": [...],
  "totalItems": 45,
  "totalPages": 3,
  "currentPage": 1,
  "pageSize": 20,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

## Styling
- Sort dropdown uses existing filter styles for consistency
- Metrics display (views/likes) uses inline styles with emoji icons
- Font size: 12px, color: #666 (gray)
- Gap between metrics: 12px

## Testing Checklist

- [ ] Open blog admin and verify posts load with default sorting (most recent)
- [ ] Sorting by "Mais Curtidos" returns posts ordered by likes DESC
- [ ] Sorting by "Menos Curtidos" returns posts ordered by likes ASC
- [ ] Sorting by "Mais Visualizados" returns posts ordered by views DESC
- [ ] Sorting by "Menos Visualizados" returns posts ordered by views ASC
- [ ] Sorting by "Título (A-Z)" returns posts alphabetically ascending
- [ ] Sorting by "Título (Z-A)" returns posts alphabetically descending
- [ ] Views and likes metrics are displayed on each post card
- [ ] Sorting combines with status filter (active/inactive)
- [ ] Sorting combines with date range filter
- [ ] Sorting works with pagination (pagination resets to page 1 when sorting changes)
- [ ] Create/edit post with different likes/views values and verify sorting works
- [ ] Increment views/likes using API endpoints and verify sorting updates
- [ ] UI dropdown is properly aligned with other filter inputs
- [ ] Console logs show the sortBy parameter being passed correctly

## Future Enhancements

Could consider:
- Adding comments count sorting (if comments feature is added)
- Adding shares count sorting (if sharing feature is added)
- Save user's preferred sort order in local storage
- Default sort preference in admin settings
- Real-time metrics updates (if implementing WebSocket updates)
- Trending posts algorithm based on recent views/likes

## Files Modified Summary

**Backend:**
- ✅ `/backend/Enums/BlogSortOption.cs` - NEW
- ✅ `/backend/Interfaces/BlogGemCapital/IBlogGemCapitalPostService.cs` - Updated
- ✅ `/backend/Services/BlogGemCapital/BlogGemCapitalPostService.cs` - Updated
- ✅ `/backend/Controllers/BlogGemCapital/BlogGemCapitalPostsController.cs` - Updated

**Frontend:**
- ✅ `/frontend-admin-gemas/src/dbServices/gemCapitalBlogServices.js` - Updated
- ✅ `/frontend-admin-gemas/src/Components/Platform/BlogGemCapital/BlogGemCapitalPage.js` - Updated
- ✅ `/frontend-admin-gemas/src/Components/Platform/BlogGemCapital/PostsList.js` - Updated
