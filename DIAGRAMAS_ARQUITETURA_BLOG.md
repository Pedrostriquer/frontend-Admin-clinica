# 🏗️ DIAGRAMAS DE ARQUITETURA - BLOG GEM CAPITAL

## 1️⃣ ARQUITETURA GERAL DO SISTEMA

```
┌──────────────────────────────────────────────────────────────────────┐
│                          NAVEGADOR DO USUÁRIO                         │
│  (Google Chrome, Firefox, Safari, Mobile Browser)                     │
└─────────────────────────────┬──────────────────────────────────────────┘
                              │ HTTPS
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React/JavaScript)                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Componentes:                                                 │   │
│  │  - BlogListPage (listagem com carousel)                       │   │
│  │  - BlogDetailPage (artigo completo)                           │   │
│  │  - BlogAdminForm (criação/edição)                             │   │
│  │  - CategoryNav (navegação por categoria)                      │   │
│  │  - SearchBar (busca de artigos)                               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Serviços JavaScript:                                         │   │
│  │  - blogGemCapitalService.ts (chamadas API)                    │   │
│  │  - blogServices.js (legacy - blog anterior)                   │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Estado (React Context ou Redux):                             │   │
│  │  - posts[], categories[], currentPost                         │   │
│  │  - loading, error, filters                                    │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────┬──────────────────────────────────────────┘
                              │ REST API (JSON)
                              ↓
┌──────────────────────────────────────────────────────────────────────┐
│              ASP.NET Core 8 API Gateway                               │
│  Port: 5000 / 5001 (HTTPS)                                            │
│  CORS configurado para frontend                                       │
└─────────────────────────────┬──────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┬──────────────┐
                    ↓                   ↓              ↓
        ┌──────────────────────┬──────────────────┬──────────────────┐
        │ PostsController      │ CategoriesContr. │ PixelsController │
        │ /api/blog-.../*      │ /api/blog-.../*  │ /api/blog-.../*  │
        └──────────┬───────────┴────────┬─────────┴────────┬──────────┘
                   ↓                    ↓                  ↓
        ┌──────────────────────┬──────────────────┬──────────────────┐
        │ BlogGemCapital       │ BlogGemCapital   │ BlogGemCapital   │
        │ PostService          │ CategoryService  │ PixelService     │
        │                      │                  │                  │
        │ - Logicamais biz     │ - CRUD de cat.   │ - Gerencia       │
        │ - Busca/Paginação    │ - Slug auto.     │   pixels GA, FB  │
        │ - Carousel auto.     │ - Reordena       │ - Ativo/inativo  │
        │ - Rastreamento views │ - Filtros        │                  │
        │ - Likes tracking     │                  │                  │
        └──────────┬───────────┴────────┬─────────┴────────┬──────────┘
                   │                    │                  │
                   └────────┬───────────┴──────────────────┘
                            ↓
        ┌──────────────────────────────────────┐
        │   Entity Framework Core DbContext    │
        │   - Migrations                       │
        │   - LINQ Queries                     │
        │   - Change Tracking                  │
        │   - Validation                       │
        └──────────┬───────────────────────────┘
                   ↓
        ┌──────────────────────────────────────┐
        │        PostgreSQL Database            │
        │  ┌──────────────────────────────┐   │
        │  │ Blog Tables:                  │   │
        │  │ • blog_gemcapital_posts      │   │
        │  │ • blog_gemcapital_categories │   │
        │  │ • blog_gemcapital_post_*     │   │
        │  │ • blog_gemcapital_*_views    │   │
        │  │ • blog_gemcapital_pixels     │   │
        │  │ • blog_gemcapital_view_*     │   │
        │  └──────────────────────────────┘   │
        └──────────────────────────────────────┘
```

---

## 2️⃣ FLUXO DE REQUISIÇÃO - POST

### Criar um novo artigo (Admin)

```
┌─────────────────────────────────────────────────────────────────┐
│  ADMIN PREENCHE FORMULÁRIO                                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Título: "Como Investir em Ouro"                          │   │
│  │ Conteúdo: "<h1>Ouro é Seguro?</h1><p>..."                │   │
│  │ Imagem: [upload_file.jpg]                                │   │
│  │ Categorias: [Investimentos, Ativos Reais]                │   │
│  │ Carousel Position: 1                                      │   │
│  │ Data Publicação: 24/03/2026                               │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
                    Valida dados
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│  POST /api/blog-gemcapital/posts                                 │
│  Header: Authorization: Bearer {token}                           │
│  Body: CreateBlogGemCapitalPostDto {                             │
│    title, excerpt, content, featuredImage, categoryIds,          │
│    readTime, carouselPosition, active, publishedAt              │
│  }                                                                │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│  BlogGemCapitalPostsController::CreatePost                       │
│  [Authorize]                                                      │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│  BlogGemCapitalPostService::CreatePostAsync                      │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ 1. Validar carouselPosition > 0                           │   │
│  │ 2. Se carouselPosition=1: reordena posts existentes       │   │
│  │    - Posts em posição 1,2,3 → 2,3,4                       │   │
│  │ 3. Cria novo BlogGemCapitalPost:                          │   │
│  │    { id=auto, title, views=0, likes=0, ... }             │   │
│  │ 4. Salva no EF Context                                    │   │
│  │ 5. Associa categorias via BlogGemCapitalPostCategory     │   │
│  │ 6. Retorna BlogGemCapitalPostDto                          │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│  DbContext.SaveChangesAsync()                                    │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ Insere em blog_gemcapital_posts (Transação)               │   │
│  │ Insere em blog_gemcapital_post_categories (2 registros)   │   │
│  │ Atualiza positions dos posts movidos                      │   │
│  │ Commit transação                                          │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│  Response 201 Created                                            │
│  Location: /api/blog-gemcapital/posts/42                         │
│  Body: {                                                          │
│    id: 42,                                                        │
│    title: "Como Investir em Ouro",                               │
│    categories: [{id:1,name:"Investimentos"}, ...],              │
│    carouselPosition: 1,                                           │
│    views: 0, likes: 0,                                            │
│    createdAt: "2026-03-24T10:30:00Z",                            │
│    publishedAt: "2026-03-24T00:00:00Z"                           │
│  }                                                                │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
                    Admin vê sucesso
```

---

## 3️⃣ FLUXO DE REQUISIÇÃO - GET (Visualizar Post)

### Visitante acessa artigo

```
┌─────────────────────────────────────────────────────────────────┐
│  VISITANTE CLICA EM POST NA PÁGINA DE BLOG                      │
│  • Não autenticado (anônimo)                                    │
│  • IP: 187.34.xx.xx                                             │
│  • UserAgent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)...    │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓
                    GET /blog/42/como-investir-ouro
                           ↓
┌──────────────────────────────────────────────────────────────────┐
│  Frontend BlogDetailComponent                                    │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │ Executa paralelamente:                                     │   │
│  │ • GET /api/blog-gemcapital/posts/42 (post)                 │   │
│  │ • POST /api/blog-gemcapital/posts/42/increment-views       │   │
│  │   { ipAddress: "187.34.xx.xx", userAgent: "..." }          │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────┬───────────────────────────────────────┘
                           ↓ (2 requisições simultâneas)
            ┌──────────────┴──────────────┐
            ↓                             ↓
   ┌────────────────────┐      ┌────────────────────┐
   │ GET /posts/42      │      │ POST /posts/42/    │
   │                    │      │ increment-views    │
   └─────────┬──────────┘      └─────────┬──────────┘
             ↓                           ↓
   ┌────────────────────┐      ┌────────────────────┐
   │ GetPostByIdAsync   │      │ IncrementViews     │
   │ Busca post:        │      │ Async(id, ip,...)  │
   │ • Include Categ.   │      │                    │
   │ • Load content     │      │ Lógica:            │
   │                    │      │ • Normaliza IP     │
   │                    │      │ • Busca view recente│
   │                    │      │   (últimas 24h)    │
   │                    │      │ • Se não houver:   │
   │                    │      │   - Insere em      │
   │                    │      │     PostViews      │
   │                    │      │   - Incrementa     │
   │                    │      │     Post.Views++   │
   │                    │      │   - Salva DB       │
   │                    │      │ • Se houver        │
   │                    │      │   (duplicata):     │
   │                    │      │   - Retorna false  │
   │                    │      │                    │
   └─────────┬──────────┘      └─────────┬──────────┘
             ↓                           ↓
   ┌────────────────────┐      ┌────────────────────┐
   │ Response 200 OK:   │      │ Response 200 OK:   │
   │ {                  │      │ {                  │
   │   id: 42,          │      │   success: true,   │
   │   title: "...",    │      │   viewCount: 123   │
   │   content: "...",  │      │ }                  │
   │   views: 123,      │      └────────────────────┘
   │   likes: 45,       │
   │   readTime: 12,    │
   │   categories: [...] │
   │   createdAt: "..." │
   │ }                  │
   └─────────┬──────────┘
             ↓
   ┌────────────────────────────────┐
   │ Frontend renderiza:            │
   │ • Título                       │
   │ • Conteúdo HTML                │
   │ • Imagem destacada             │
   │ • "123 visualizações"          │
   │ • Botão "Like" (45 curtidas)   │
   │ • Posts relacionados (mesma cat)│
   │ • Tags/Categorias              │
   └────────────────────────────────┘
```

---

## 4️⃣ MAPEAMENTO DE TABELAS ↔ ENDPOINTS

```
┌──────────────────────────────────────────────────────────────────┐
│ TABELA: blog_gemcapital_posts                                    │
├──────────────────────────────────────────────────────────────────┤
│ Endpoints que leem:                                              │
│  • GET    /posts              → Select all → Listagem           │
│  • GET    /posts/{id}         → Select by id → Detalhe          │
│  • GET    /posts/carousel     → Select by position → Featured   │
│  • GET    /posts/paginated    → Select with pagination → Grid   │
│  • GET    /posts/search       → Select by search                │
│                                                                  │
│ Endpoints que escrevem:                                          │
│  • POST   /posts              → Insert → Criar novo post        │
│  • PUT    /posts/{id}         → Update → Editar post            │
│  • DELETE /posts/{id}         → Delete → Deletar post           │
│  • POST   /posts/{id}/increment-views → Update views             │
│  • POST   /posts/{id}/increment-likes → Update likes             │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ TABELA: blog_gemcapital_categories                               │
├──────────────────────────────────────────────────────────────────┤
│ Endpoints que leem:                                              │
│  • GET    /categories         → Select all active → Nav         │
│  • GET    /categories/{id}    → Select by id → Detalhe          │
│  • GET    /categories/slug/{slug} → Select by slug → SEO         │
│                                                                  │
│ Endpoints que escrevem:                                          │
│  • POST   /categories         → Insert → Admin criar cat.       │
│  • PUT    /categories/{id}    → Update → Admin editar cat.      │
│  • DELETE /categories/{id}    → Delete → Admin deletar cat.     │
│  • POST   /categories/reorder → Update multiple → Reordena      │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ TABELA: blog_gemcapital_post_categories (Many-to-Many)           │
├──────────────────────────────────────────────────────────────────┤
│ Manipulada via:                                                  │
│  • POST   /posts (categoryIds[] no DTO)    → Insert associações │
│  • PUT    /posts/{id} (categoryIds[] DTO)  → Update associações │
│  • GET    /posts/{id} (Include em LINQ)    → Carrega categorias │
│                                                                  │
│ Não há endpoints específicos para esta tabela (relação implícita)│
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ TABELA: blog_gemcapital_post_views                               │
├──────────────────────────────────────────────────────────────────┤
│ Manipulada via:                                                  │
│  • POST   /posts/{id}/increment-views     → Insert view record  │
│  • Lê para deduplicar views (janela 24h)                        │
│                                                                  │
│ Sem endpoints de leitura direta (dados internos)                 │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│ TABELA: blog_gemcapital_pixels                                   │
├──────────────────────────────────────────────────────────────────┤
│ Endpoints:                                                       │
│  • GET    /pixels             → Select all → Listar             │
│  • GET    /pixels/{id}        → Select by id → Detalhe          │
│  • POST   /pixels             → Insert → Criar pixel            │
│  • PUT    /pixels/{id}        → Update → Editar pixel           │
│  • DELETE /pixels/{id}        → Delete → Deletar pixel          │
│                                                                  │
│ Associado a posts no POST body (pixel_code por post)           │
└──────────────────────────────────────────────────────────────────┘
```

---

## 5️⃣ FLUXO DE CAROUSEL AUTOMÁTICO

```
                    Criar novo post com carouselPosition = 1
                                    │
                                    ↓
                    ┌──────────────────────────┐
                    │ Posts existentes:        │
                    │ • Post A: position = 1   │
                    │ • Post B: position = 2   │
                    │ • Post C: position = 3   │
                    │ • Post D: null (recente) │
                    │ • Post E: null (recente) │
                    └──────────┬───────────────┘
                               ↓
        ┌──────────────────────────────────────────┐
        │ Service detecta conflito: position = 1   │
        │ ação requerida!                           │
        └──────────┬───────────────────────────────┘
                   ↓
        Query: WHERE carouselPosition >= 1
               ORDER BY carouselPosition DESC
                   ↓
        ┌──────────────────────────────────────────┐
        │ Encontra:                                │
        │ • Post A: position = 1                   │
        │ • Post B: position = 2                   │
        │ • Post C: position = 3                   │
        └──────────┬───────────────────────────────┘
                   ↓
        ┌──────────────────────────────────────────┐
        │ Reordena do final para o início:          │
        │ Post C: 3 → 4                             │
        │ Post B: 2 → 3                             │
        │ Post A: 1 → 2                             │
        └──────────┬───────────────────────────────┘
                   ↓
        ┌──────────────────────────────────────────┐
        │ Insere novo post:                         │
        │ Post F: position = 1                      │
        │                                           │
        │ Resultado final:                          │
        │ • Post F: position = 1   ← NOVO          │
        │ • Post A: position = 2   ← MOVIDO        │
        │ • Post B: position = 3   ← MOVIDO        │
        │ • Post C: position = 4   ← MOVIDO        │
        │ • Post D: null                            │
        │ • Post E: null                            │
        └──────────────────────────────────────────┘
                   ↓
        GET /posts/carousel retorna:
        [Post F, Post A, Post B]  ← 3 melhores
```

---

## 6️⃣ FLUXO DE RASTREAMENTO DE VIEWS

```
        POST /posts/42/increment-views
        {
          ipAddress: "187.34.12.56",
          clientId: null,  // anônimo
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
        }
                        │
                        ↓
        ┌───────────────────────────────────────┐
        │ Normaliza IP:                         │
        │ "187.34.12.56:54321" → "187.34.12.56"│
        │ "X-Forwarded-For: a,b,c" → "a"       │
        │ "::1" → "::1" (IPv6 ok)               │
        └───────┬───────────────────────────────┘
                │
                ↓
        ┌───────────────────────────────────────┐
        │ Lê configuração:                      │
        │ • DuplicatePreventionHours = 24       │
        │ • TrackAnonymousUsers = true          │
        │ • StoreUserAgent = true               │
        └───────┬───────────────────────────────┘
                │
                ↓ Calcula janela de tempo
                │
        ┌───────────────────────────────────────┐
        │ Busca em PostViews:                   │
        │ WHERE postId = 42                     │
        │   AND ipAddress = "187.34.12.56"      │
        │   AND viewedAt > (Now - 24h)          │
        └───────┬───────────────────────────────┘
                │
        ┌───────┴────────────────┐
        │                        │
        ↓                        ↓
   Encontra record      Não encontra record
   (visualização recente)  (nova visualização)
        │                        │
        ↓                        ↓
   Return false          Insert BlogGemCapitalPostView
   (não incrementa)      {
   (duplicata)            postId: 42,
                          ipAddress: "187.34.12.56",
                          clientId: null,
                          userAgent: "Mozilla/...",
                          viewedAt: now
                        }
                        │
                        ↓
                   Post.Views++ (123 → 124)
                        │
                        ↓
                   SaveChanges()
                        │
                        ↓
                   Return true
                   (novo view registrado)
```

---

## 7️⃣ RELACIONAMENTOS DE BANCO DE DADOS

```
┌─────────────────────────────────────────────────────────────────┐
│                  DIAGRAMA DE ENTIDADES (ER)                     │
└─────────────────────────────────────────────────────────────────┘

  blog_gemcapital_posts                blog_gemcapital_categories
  ┌──────────────────┐                 ┌──────────────────┐
  │ id (PK)          │                 │ id (PK)          │
  │ title            │                 │ name             │
  │ excerpt          │                 │ slug             │
  │ content          │                 │ description      │
  │ featured_image   │                 │ order            │
  │ author           │                 │ active           │
  │ read_time        │                 │ created_at       │
  │ views            │                 │ updated_at       │
  │ likes            │                 └──────────────────┘
  │ carousel_pos     │                         ↑
  │ active           │                         │ 1..* (One-to-Many)
  │ published_at     │                         │
  │ created_at       │                         │
  │ updated_at       │                         │
  └──────────────────┘                         │
          │ 1                                  │
          │                                    │
          │ Many ┌───────────────────────────┐│
          ├──────→ blog_gemcapital_post_      ││
          │       categories (Junção)         │
          │       ┌──────────────────────┐    │
          │       │ post_id (FK, PK)     │───┘
          │       │ category_id (FK, PK)→┘
          │       │ created_at           │
          │       └──────────────────────┘
          │
          │ 1
          │
          │ Many ┌──────────────────────────┐
          └──────→ blog_gemcapital_post_views│
                  (Rastreamento)            │
                  ┌──────────────────────┐  │
                  │ id (PK)              │  │
                  │ post_id (FK)────────→┘ │
                  │ ip_address           │  │
                  │ client_id (FK, opt.) │  │
                  │ user_agent           │  │
                  │ viewed_at            │  │
                  └──────────────────────┘  │

          │ 1
          │
          │ Many ┌──────────────────────────┐
          └──────→ blog_gemcapital_pixels   │
                  (Rastreamento)            │
                  ┌──────────────────────┐  │
                  │ id (PK)              │  │
                  │ post_id (FK)────────→┘ │
                  │ pixel_code           │  │
                  │ active               │  │
                  │ created_at           │  │
                  └──────────────────────┘  │

  blog_gemcapital_view_tracking_config
  ┌──────────────────────────────┐
  │ id (PK)                      │
  │ duplicate_prevention_hours   │
  │ track_anonymous_users        │
  │ track_authenticated_sep.      │
  │ store_user_agent             │
  │ active                       │
  └──────────────────────────────┘

Legenda:
├──→ Relacionamento
(FK) = Foreign Key
(PK) = Primary Key
1..* = Um para muitos
opt. = Opcional
```

---

## 8️⃣ CAMADAS DE ABSTRAÇÃO

```
┌────────────────────────────────────────────────────────┐ Layer 4
│            Presentation (Controllers)                   │ API
├────────────────────────────────────────────────────────┤
│  BlogGemCapitalPostsController                         │
│  BlogGemCapitalCategoriesController                    │
│  BlogGemCapitalPixelsController                        │
│  ↓ [Authorize] ↓                                       │
└────────────────────────────────────────────────────────┘
         ↓ HTTP Requests & Responses
┌────────────────────────────────────────────────────────┐ Layer 3
│           Business Logic (Services)                     │ Logic
├────────────────────────────────────────────────────────┤
│  IBlogGemCapitalPostService                           │
│  ├─ GetPostByIdAsync()                                │
│  ├─ GetAllPostsAsync()                                │
│  ├─ GetCarouselPostsAsync()                           │
│  ├─ CreatePostAsync()                                 │
│  ├─ UpdatePostAsync()                                 │
│  ├─ DeletePostAsync()                                 │
│  ├─ IncrementViewsAsync()                             │
│  ├─ IncrementLikesAsync()                             │
│  ├─ GetPostsPaginatedAsync()                          │
│  └─ SearchPostsAsync()                                │
│                                                        │
│  IBlogGemCapitalCategoryService                       │
│  IBlogGemCapitalPixelService                          │
└────────────────────────────────────────────────────────┘
         ↓ Dependencies Injection
┌────────────────────────────────────────────────────────┐ Layer 2
│           Data Access (Entity Framework)               │ Data
├────────────────────────────────────────────────────────┤
│  ApplicationDbContext                                  │
│  ├─ DbSet<BlogGemCapitalPost>                        │
│  ├─ DbSet<BlogGemCapitalCategory>                    │
│  ├─ DbSet<BlogGemCapitalPostCategory>               │
│  ├─ DbSet<BlogGemCapitalPostView>                   │
│  ├─ DbSet<BlogGemCapitalPixel>                      │
│  ├─ DbSet<BlogGemCapitalViewTrackingConfig>        │
│  ├─ SaveChangesAsync()                               │
│  └─ LINQ Queries (Include, Where, Select, etc)      │
└────────────────────────────────────────────────────────┘
         ↓ SQL Queries
┌────────────────────────────────────────────────────────┐ Layer 1
│              Database (PostgreSQL)                      │ DB
├────────────────────────────────────────────────────────┤
│  • blog_gemcapital_posts                              │
│  • blog_gemcapital_categories                         │
│  • blog_gemcapital_post_categories                    │
│  • blog_gemcapital_post_views                         │
│  • blog_gemcapital_pixels                             │
│  • blog_gemcapital_view_tracking_config              │
│  + Índices + Constraints + Triggers                   │
└────────────────────────────────────────────────────────┘
```

---

## 9️⃣ FLUXO DE DEPENDÊNCIAS

```
                    Controllers
                    (HTTP layer)
                         ↑
                         │
                    [Authorize]
                    [Validation]
                         │
                         ↓
                    DTOs (validation)
                    ├─ CreateBlogGemCapitalPostDto
                    ├─ UpdateBlogGemCapitalPostDto
                    ├─ BlogGemCapitalPostDto
                    └─ ...
                         │
                         ↓
                    Services (Business logic)
                    ├─ BlogGemCapitalPostService
                    ├─ BlogGemCapitalCategoryService
                    └─ BlogGemCapitalPixelService
                         │
                         ↓
                    Interfaces
                    ├─ IBlogGemCapitalPostService
                    ├─ IBlogGemCapitalCategoryService
                    └─ IBlogGemCapitalPixelService
                         │
                         ↓
                    DbContext
                    (Entity Framework)
                         │
                         ├─ Models
                         │  ├─ BlogGemCapitalPost
                         │  ├─ BlogGemCapitalCategory
                         │  ├─ BlogGemCapitalPostCategory
                         │  ├─ BlogGemCapitalPostView
                         │  ├─ BlogGemCapitalPixel
                         │  └─ BlogGemCapitalViewTrackingConfig
                         │
                         ├─ LINQ Queries
                         ├─ Migrations
                         └─ Change Tracking
                         │
                         ↓
                    PostgreSQL Database

Dependency Injection em Program.cs:
────────────────────────────────────
builder.Services.AddScoped<IBlogGemCapitalPostService,
                           BlogGemCapitalPostService>();
builder.Services.AddScoped<IBlogGemCapitalCategoryService,
                           BlogGemCapitalCategoryService>();
builder.Services.AddScoped<IBlogGemCapitalPixelService,
                           BlogGemCapitalPixelService>();
```

---

## 🔟 MAPA MENTAL DO PROJETO

```
                    BLOG GEM CAPITAL
                           │
            ┌──────────────┼──────────────┐
            ↓              ↓              ↓
        FRONTEND       BACKEND        DATABASE
            │              │              │
    ┌──────┴──────┐   ┌────┴────┐   ┌────┴────┐
    │             │   │         │   │         │
React HTML    Services  API   Business  Data   Tables
Components         │      │      Logic    Access  │
    │         ┌───┘  ├───┐  │      │        │     │
    │         │      │   │  └─→────┴──────→─┴────→│
    │         │      │   │                 │
    ├─────────┤      │   └─ Controllers    ├─ Models
    │  Pages  │      │      ├─ Posts       │  DTOs
    │  Forms  │      │      ├─ Categories  │  Services
    │  Comps  │      │      └─ Pixels      │  Migrations
    │         │      │                     │
    └─────────┘      └───────────────────→─┴───
                            Entity Framework Core
                                 │
                                 ↓
                           PostgreSQL 14+
```

---

*Diagramas criados em 24/03/2026*
*Versão: 1.0*
