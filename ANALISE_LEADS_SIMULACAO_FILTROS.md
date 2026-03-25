# 🔍 ANÁLISE DETALHADA - LEADS SIMULAÇÃO (Filtros e Métricas)

**Data de Análise:** 24/03/2026
**Status:** ✅ Viável - Análise sem alterações
**Rota:** `/site/leads` (Frontend) → `GET /api/SimulationRequesters` (Backend)

---

## 📊 ESTRUTURA ATUAL

### Frontend
```
LeadsPage.js (/site/leads)
├── Filtros atuais:
│   ├─ Busca por nome (debouncedSearch)
│   └─ Filtro por status (statusFilter: "uncontacted" ou vazio)
├── Exibição:
│   ├─ Tabela com: Nome, Data, Valor, Status, Ações
│   └─ Paginação (pageNumber, pageSize=10)
└─ Serviço:
    └─ leadsService.getAllLeads(filters)
        └─ GET /api/SimulationRequesters?pageNumber=1&pageSize=10&...
```

### Backend
```
SimulationRequestersController
├── GET /api/SimulationRequesters
│   ├─ Parâmetros atuais:
│   │  ├─ pageNumber (paginação)
│   │  ├─ pageSize (tamanho página)
│   │  ├─ name (busca)
│   │  ├─ startDate (já existe! ✅)
│   │  ├─ endDate (já existe! ✅)
│   │  └─ uncontactedOnly (status)
│   └─ Retorna:
│       ├─ Items[] (dados dos leads)
│       └─ Header X-Pagination (metadata)
│
└── Service: SimulationRequesterService
    └── GetPagedAsync()
        └─ Já filtra por: nome, startDate, endDate, uncontactedOnly
```

### Model (SimulationRequester)
```
Campos disponíveis:
- Id                 (int)
- Name              (string, obrigatório)
- Email             (string, obrigatório)
- Phone             (string?)
- DateCreated       (DateTime?)  ← Para filtrar por período
- Contacted         (bool?)      ← Já tem filtro
- FromCity          (string?)
- SimulatedAmount   (decimal?)   ← PARA FILTRO DE VALOR
- SimulatedMonths   (int?)
- WithPhysicalGem   (bool?)
```

---

## 🎯 O QUE JÁ EXISTE

### ✅ Filtros Implementados no Backend

| Filtro | Parâmetro | Status | Localização |
|--------|-----------|--------|-------------|
| Por período (data inicial) | `startDate` | ✅ Implementado | SimulationRequesterService.GetPagedAsync() linha 86-88 |
| Por período (data final) | `endDate` | ✅ Implementado | SimulationRequesterService.GetPagedAsync() linha 91-96 |
| Por status contactado | `uncontactedOnly` | ✅ Implementado | SimulationRequesterService.GetPagedAsync() linha 99-102 |
| Por nome | `name` | ✅ Implementado | SimulationRequesterService.GetPagedAsync() linha 78-83 |
| Paginação | pageNumber, pageSize | ✅ Implementado | SimulationRequesterService.GetPagedAsync() linha 108-111 |
| Ordenação por data | (implícito) | ✅ OrderByDescending | SimulationRequesterService.GetPagedAsync() linha 108 |

### ❌ O QUE FALTA NO BACKEND

| Funcionalidade | Status | Detalhes |
|---------------|--------|----------|
| Filtro por valor simulado (ascendente) | ❌ Falta | Precisa de novo parâmetro `sortByAmount=asc` |
| Filtro por valor simulado (descendente) | ❌ Falta | Precisa de novo parâmetro `sortByAmount=desc` |
| Colocar SEM valor por último | ❌ Falta | Lógica especial na ordenação |
| Ordenação por data (decrescente - atual) | ✅ Existe | `OrderByDescending(r => r.DateCreated)` |
| Ordenação por data (crescente) | ❌ Falta | Precisa de novo parâmetro `sortBy=date` |
| Endpoint de métricas | ❌ Falta | Total de leads, contactados, valor total |
| Métricas com filtros aplicados | ❌ Falta | Necessário novo endpoint ou return no header |

### ❌ O QUE FALTA NO FRONTEND

| Funcionalidade | Status | Localização |
|---------------|--------|-------------|
| Input data inicial | ❌ Falta | LeadsPage.js - seção filters |
| Input data final | ❌ Falta | LeadsPage.js - seção filters |
| Select ordenação por valor | ❌ Falta | LeadsPage.js - seção filters |
| Select ordenação por data | ❌ Falta | LeadsPage.js - seção filters |
| Header com métricas | ❌ Falta | LeadsPage.js - no topo (acima dos filtros) |
| Indicador "Filtro Aplicado" | ❌ Falta | LeadsPage.js - no header |
| Enviar filtros ao backend | ⚠️ Parcial | leadsService.js precisa de novos parâmetros |

---

## 🔧 PROPOSTA DE IMPLEMENTAÇÃO

### FASE 1: Backend - Adicionar Filtro de Valor

#### 1.1 Modificar Interface
```csharp
// arquivo: ISimulationRequesterService.cs

public interface ISimulationRequesterService
{
    // ... métodos existentes ...

    Task<PagedResult<SimulationRequester>> GetPagedAsync(
        int pageNumber,
        int pageSize,
        string? name,
        DateTime? startDate,
        DateTime? endDate,
        bool? uncontactedOnly,
        string? sortBy = null);  // ✅ NOVO PARÂMETRO

    // ✅ NOVO ENDPOINT: Obter métricas (com filtros opcionais)
    Task<SimulationRequesterMetricsDto> GetMetricsAsync(
        string? name = null,
        DateTime? startDate = null,
        DateTime? endDate = null,
        bool? uncontactedOnly = null);
}
```

#### 1.2 Implementar no Service
```csharp
// arquivo: SimulationRequesterService.cs

public async Task<PagedResult<SimulationRequester>> GetPagedAsync(
    int pageNumber,
    int pageSize,
    string? name,
    DateTime? startDate,
    DateTime? endDate,
    bool? uncontactedOnly,
    string? sortBy = null)  // ✅ NOVO
{
    var query = _context.SimulationRequesters.AsQueryable();

    // ... filtros existentes (nome, data, status) ...

    var totalCount = await query.CountAsync();

    // ✅ NOVO: Implementar ordenação por valor
    IQueryable<SimulationRequester> orderedQuery = sortBy?.ToLower() switch
    {
        // Valor menor para maior (sem valor por último)
        "amount_asc" => query
            .OrderByDescending(r => r.SimulatedAmount.HasValue)  // null por último
            .ThenBy(r => r.SimulatedAmount),

        // Valor maior para menor (sem valor por último)
        "amount_desc" => query
            .OrderByDescending(r => r.SimulatedAmount.HasValue)  // null por último
            .ThenByDescending(r => r.SimulatedAmount),

        // Data crescente (mais antigos primeiro)
        "date_asc" => query
            .OrderBy(r => r.DateCreated),

        // Data decrescente (padrão - mais recentes primeiro)
        _ => query
            .OrderByDescending(r => r.DateCreated)
    };

    var items = await orderedQuery
        .Skip((pageNumber - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return new PagedResult<SimulationRequester>
    {
        Items = items,
        TotalCount = totalCount,
        PageNumber = pageNumber,
        PageSize = pageSize
    };
}

// ✅ NOVO: Obter métricas com filtros
public async Task<SimulationRequesterMetricsDto> GetMetricsAsync(
    string? name = null,
    DateTime? startDate = null,
    DateTime? endDate = null,
    bool? uncontactedOnly = null)
{
    var query = _context.SimulationRequesters.AsQueryable();

    // Aplicar mesmos filtros
    if (!string.IsNullOrWhiteSpace(name))
    {
        var normalizedName = NormalizeString(name);
        query = query.Where(r => r.NameNormalized != null &&
                                 r.NameNormalized.Contains(normalizedName));
    }

    if (startDate.HasValue)
    {
        query = query.Where(r => r.DateCreated >= startDate.Value.ToUniversalTime());
    }

    if (endDate.HasValue)
    {
        var endOfDay = endDate.Value.Date.AddDays(1).AddSeconds(-1);
        query = query.Where(r => r.DateCreated <= endOfDay.ToUniversalTime());
    }

    if (uncontactedOnly.HasValue && uncontactedOnly.Value)
    {
        query = query.Where(r => r.Contacted == false);
    }

    // Calcular métricas
    var metrics = new SimulationRequesterMetricsDto
    {
        TotalLeads = await query.CountAsync(),
        UncontactedLeads = await query.CountAsync(r => r.Contacted == false),
        ContactedLeads = await query.CountAsync(r => r.Contacted == true),
        TotalSimulatedAmount = await query
            .Where(r => r.SimulatedAmount.HasValue)
            .SumAsync(r => r.SimulatedAmount) ?? 0
    };

    return metrics;
}
```

#### 1.3 Criar DTO para Métricas
```csharp
// arquivo: DTOs/SimulationRequesterMetricsDto.cs

namespace backend.DTOs
{
    public class SimulationRequesterMetricsDto
    {
        public int TotalLeads { get; set; }
        public int UncontactedLeads { get; set; }
        public int ContactedLeads { get; set; }
        public decimal TotalSimulatedAmount { get; set; }
    }
}
```

#### 1.4 Modificar Controller
```csharp
// arquivo: SimulationRequestersController.cs

[HttpGet]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> Get(
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? name = null,
    [FromQuery] DateTime? startDate = null,
    [FromQuery] DateTime? endDate = null,
    [FromQuery] bool? uncontactedOnly = null,
    [FromQuery] string? sortBy = null)  // ✅ NOVO
{
    var pagedResult = await _service.GetPagedAsync(
        pageNumber, pageSize, name, startDate, endDate, uncontactedOnly, sortBy);

    var paginationMetadata = new
    {
        pagedResult.TotalCount,
        pagedResult.PageSize,
        pagedResult.PageNumber,
        pagedResult.TotalPages
    };

    Response.Headers.Append("X-Pagination", JsonSerializer.Serialize(paginationMetadata));

    return Ok(pagedResult.Items);
}

// ✅ NOVO ENDPOINT: Obter métricas
[HttpGet("metrics")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> GetMetrics(
    [FromQuery] string? name = null,
    [FromQuery] DateTime? startDate = null,
    [FromQuery] DateTime? endDate = null,
    [FromQuery] bool? uncontactedOnly = null)
{
    var metrics = await _service.GetMetricsAsync(name, startDate, endDate, uncontactedOnly);
    return Ok(metrics);
}
```

---

### FASE 2: Frontend - Implementar Filtros e Header

#### 2.1 Modificar leadsService.js
```javascript
// arquivo: dbServices/leadsService.js

const leadsService = {
  getAllLeads: async (filters) => {
    const {
      pageNumber = 1,
      pageSize = 10,
      searchTerm = '',
      status = '',
      startDate = null,      // ✅ NOVO
      endDate = null,        // ✅ NOVO
      sortBy = 'date_desc'   // ✅ NOVO (padrão)
    } = filters;

    try {
      const params = new URLSearchParams({ pageNumber, pageSize });
      if (searchTerm) params.append('name', searchTerm);
      if (status === 'uncontacted') params.append('uncontactedOnly', true);
      if (startDate) params.append('startDate', startDate);  // ✅ NOVO
      if (endDate) params.append('endDate', endDate);        // ✅ NOVO
      if (sortBy) params.append('sortBy', sortBy);           // ✅ NOVO

      const response = await api.get('SimulationRequesters', { params });

      const paginationHeader = response.headers['x-pagination'] ||
                               response.headers['X-Pagination'];

      let meta;
      if (paginationHeader) {
        meta = JSON.parse(paginationHeader);
      } else {
        meta = {
          PageNumber: Number(pageNumber),
          PageSize: Number(pageSize),
          HasNext: response.data.length >= Number(pageSize),
          TotalPages: 9999
        };
      }

      return { data: response.data, meta };

    } catch (error) {
      console.error("Erro ao buscar os leads:", error.response?.data || error);
      throw error;
    }
  },

  // ✅ NOVO: Obter métricas
  getMetrics: async (filters) => {
    const {
      searchTerm = '',
      status = '',
      startDate = null,
      endDate = null
    } = filters;

    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('name', searchTerm);
      if (status === 'uncontacted') params.append('uncontactedOnly', true);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get('SimulationRequesters/metrics', { params });
      return response.data;

    } catch (error) {
      console.error("Erro ao buscar métricas:", error);
      throw error;
    }
  },

  // ... métodos existentes (updateLeadStatus, deleteLead, getLeads) ...
};

export default leadsService;
```

#### 2.2 Modificar LeadsPage.js
```javascript
// arquivo: Components/SiteConfig/Leads/LeadsPage.js

function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [meta, setMeta] = useState({ PageNumber: 1, PageSize: 10 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // ✅ NOVOS ESTADOS
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("date_desc");

  const [metrics, setMetrics] = useState({
    TotalLeads: 0,
    UncontactedLeads: 0,
    ContactedLeads: 0,
    TotalSimulatedAmount: 0
  });

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);

  // ... debounce existente ...

  // ✅ NOVO: Buscar métricas
  const fetchMetrics = useCallback(
    async () => {
      try {
        const data = await leadsService.getMetrics({
          searchTerm: debouncedSearch,
          status: statusFilter,
          startDate,
          endDate
        });
        setMetrics(data);
      } catch (error) {
        console.error("Falha ao buscar métricas.");
      }
    },
    [debouncedSearch, statusFilter, startDate, endDate]
  );

  const fetchLeads = useCallback(
    async (pageNumber = 1) => {
      setIsLoading(true);
      try {
        const response = await leadsService.getAllLeads({
          pageNumber,
          searchTerm: debouncedSearch,
          status: statusFilter,
          startDate,    // ✅ NOVO
          endDate,      // ✅ NOVO
          sortBy        // ✅ NOVO
        });
        setLeads(response.data);
        setMeta((prev) => ({ ...prev, ...response.meta }));
      } catch (error) {
        console.error("Falha ao buscar leads.");
      } finally {
        setIsLoading(false);
      }
    },
    [debouncedSearch, statusFilter, startDate, endDate, sortBy]  // ✅ ATUALIZADO
  );

  // ✅ NOVO: Chamar fetch de métricas quando filtros mudam
  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  useEffect(() => {
    fetchLeads(1);
  }, [debouncedSearch, statusFilter, startDate, endDate, sortBy, fetchLeads]);

  // ✅ NOVO: Verificar se filtro está ativo
  const hasActiveFilters = () => {
    return debouncedSearch || statusFilter || startDate || endDate ||
           (sortBy !== 'date_desc');
  };

  // ... handlers existentes ...

  return (
    <div className="LeadsPage-container">
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleUpdateStatus}
          onDelete={handleDelete}
        />
      )}

      {/* ✅ NOVO: Header com Métricas */}
      <div className="LeadsPage-header">
        <h1>Leads da Simulação</h1>
        {hasActiveFilters() && (
          <span className="LeadsPage-filter-indicator">🔍 Filtro Aplicado</span>
        )}
      </div>

      {/* ✅ NOVO: Card de Métricas */}
      <div className="LeadsPage-metrics-container">
        <div className="LeadsPage-metric-card">
          <div className="metric-label">Total de Leads</div>
          <div className="metric-value">{metrics.TotalLeads}</div>
        </div>
        <div className="LeadsPage-metric-card">
          <div className="metric-label">Pendentes de Contato</div>
          <div className="metric-value">{metrics.UncontactedLeads}</div>
        </div>
        <div className="LeadsPage-metric-card">
          <div className="metric-label">Contactados</div>
          <div className="metric-value">{metrics.ContactedLeads}</div>
        </div>
        <div className="LeadsPage-metric-card highlight">
          <div className="metric-label">Valor Total Simulado</div>
          <div className="metric-value">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(metrics.TotalSimulatedAmount)}
          </div>
        </div>
      </div>

      {/* ✅ MODIFICADO: Seção de filtros com novos inputs */}
      <div className="LeadsPage-filters-container">
        <input
          type="text"
          className="LeadsPage-search-input"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="LeadsPage-status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="uncontacted">Não Contactado</option>
        </select>

        {/* ✅ NOVO: Data inicial */}
        <input
          type="date"
          className="LeadsPage-date-input"
          placeholder="Data inicial"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          title="Filtrar a partir desta data"
        />

        {/* ✅ NOVO: Data final */}
        <input
          type="date"
          className="LeadsPage-date-input"
          placeholder="Data final"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          title="Filtrar até esta data"
        />

        {/* ✅ NOVO: Ordenação */}
        <select
          className="LeadsPage-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          title="Ordenar por..."
        >
          <optgroup label="Valor Simulado">
            <option value="amount_asc">💰 Menor para Maior</option>
            <option value="amount_desc">💰 Maior para Menor</option>
          </optgroup>
          <optgroup label="Data">
            <option value="date_desc">📅 Mais Recentes</option>
            <option value="date_asc">📅 Mais Antigos</option>
          </optgroup>
        </select>
      </div>

      {/* ... resto do componente (tabela, paginação) ... */}
    </div>
  );
}
```

#### 2.3 Adicionar CSS para Métricas
```css
/* arquivo: Components/SiteConfig/Leads/LeadsPage.css */

/* ✅ NOVO: Container de Métricas */
.LeadsPage-metrics-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f5f7fa 0%, #f0f4f8 100%);
  border-radius: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.LeadsPage-metric-card {
  background: white;
  padding: 1.25rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #6c757d;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.LeadsPage-metric-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.LeadsPage-metric-card.highlight {
  border-left-color: #28a745;
  background: linear-gradient(135deg, #f8fff9 0%, #f0fdf4 100%);
}

.metric-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.metric-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #212529;
}

.LeadsPage-metric-card.highlight .metric-value {
  color: #28a745;
}

/* ✅ NOVO: Indicador de filtro */
.LeadsPage-filter-indicator {
  display: inline-block;
  margin-left: 1rem;
  padding: 0.4rem 0.8rem;
  background: #ffc107;
  color: #212529;
  border-radius: 0.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* ✅ NOVO: Inputs de data */
.LeadsPage-date-input {
  padding: 0.6rem 0.9rem;
  border: 1px solid #dee2e6;
  border-radius: 0.4rem;
  font-size: 0.95rem;
  font-family: inherit;
}

.LeadsPage-date-input:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}

/* ✅ NOVO: Select de ordenação */
.LeadsPage-sort-select {
  padding: 0.6rem 0.9rem;
  border: 1px solid #dee2e6;
  border-radius: 0.4rem;
  font-size: 0.95rem;
  font-family: inherit;
  background-color: white;
}

.LeadsPage-sort-select:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
}
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Backend
- [ ] Modificar interface `ISimulationRequesterService`
- [ ] Implementar lógica de `sortBy` no `SimulationRequesterService`
- [ ] Criar novo método `GetMetricsAsync()`
- [ ] Criar DTO `SimulationRequesterMetricsDto`
- [ ] Adicionar novo endpoint `GET /metrics` no controller
- [ ] Adicionar parâmetro `sortBy` ao endpoint `GET /`
- [ ] Testar todos os cenários:
  - [ ] `sortBy=amount_asc` (menor para maior, sem valor por último)
  - [ ] `sortBy=amount_desc` (maior para menor, sem valor por último)
  - [ ] `sortBy=date_asc` (mais antigos primeiro)
  - [ ] `sortBy=date_desc` (padrão - mais recentes primeiro)
  - [ ] Métricas sem filtros
  - [ ] Métricas com startDate
  - [ ] Métricas com endDate
  - [ ] Métricas com status
  - [ ] Métricas com múltiplos filtros

### Frontend
- [ ] Atualizar `leadsService.js` com novos parâmetros
- [ ] Adicionar novo método `getMetrics()` em `leadsService.js`
- [ ] Adicionar estados para `startDate`, `endDate`, `sortBy` em `LeadsPage.js`
- [ ] Adicionar estado para `metrics` em `LeadsPage.js`
- [ ] Criar função `fetchMetrics()` com `useCallback`
- [ ] Adicionar inputs de data (startDate, endDate)
- [ ] Adicionar select de ordenação
- [ ] Criar componente de métricas no topo
- [ ] Adicionar indicador "Filtro Aplicado"
- [ ] Estilizar cards de métricas
- [ ] Testar todos os cenários:
  - [ ] Exibir métricas sem filtros
  - [ ] Atualizar métricas ao aplicar filtro de data
  - [ ] Atualizar métricas ao aplicar filtro de status
  - [ ] Exibir "Filtro Aplicado" quando filtro ativo
  - [ ] Ordenar por valor (crescente/decrescente)
  - [ ] Ordenar por data (crescente/decrescente)
  - [ ] Combinação de múltiplos filtros

---

## 🎨 LAYOUT ESPERADO

```
┌─────────────────────────────────────────────────────────┐
│  Leads da Simulação  🔍 Filtro Aplicado                │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Total de   │  │   Pendentes  │  │ Contactados  │   │
│  │    Leads     │  │  de Contato  │  │              │   │
│  │      45      │  │      18      │  │      27      │   │
│  └──────────────┘  └──────────────┘  └──────────────┘   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │ Valor Total Simulado                      R$ 1.5M │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Buscar por nome...] [Todos Status ▼] [Data ini...]  │
│  [Data final...] [Ordenar por: Maior para Menor ▼]    │
│                                                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Nome          Data        Valor         Status   Ações │
│  ─────────────────────────────────────────────────────  │
│  João Silva    24/03/2026  R$ 50.000    Contactado  ✓  │
│  Maria Santos  23/03/2026  R$ 75.000    Pendente    ⊙  │
│  ...                                                     │
│                                                          │
│  ◄ Anterior  |  Página 1  |  Próxima ►                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 IMPLEMENTAÇÃO PASSO A PASSO

### Passo 1: Backend
1. Criar arquivo `DTOs/SimulationRequesterMetricsDto.cs`
2. Modificar `ISimulationRequesterService.cs`
3. Atualizar `SimulationRequesterService.cs`
4. Atualizar `SimulationRequestersController.cs`
5. Testar com Postman/curl

### Passo 2: Frontend Service
1. Atualizar `leadsService.js` com novos parâmetros
2. Adicionar método `getMetrics()`
3. Testar com console.log()

### Passo 3: Frontend Component
1. Atualizar `LeadsPage.js` com novos estados
2. Adicionar função `fetchMetrics()`
3. Atualizar `fetchLeads()` com novos parâmetros
4. Criar JSX de métricas
5. Adicionar inputs de data e select de ordenação
6. Testar funcionalidade

### Passo 4: Styling
1. Atualizar `LeadsPage.css`
2. Estilizar cards de métricas
3. Adicionar indicador de filtro
4. Testes responsivos

---

## ✅ CONCLUSÃO

A implementação é **100% viável** e segue estas evidências:

✅ **Backend já tem:**
- ✅ Filtros de data (`startDate`, `endDate`) já implementados
- ✅ Filtro de status (`uncontactedOnly`) já implementado
- ✅ Estrutura de Service/Interface/Controller estabelecida
- ✅ PagedResult pronto para usar

❌ **Backend precisa:**
- ❌ Parâmetro `sortBy` para ordenação por valor
- ❌ Lógica de "itens sem valor por último"
- ❌ Novo endpoint `/metrics` para obter totalizações
- ❌ DTO para retornar métricas

✅ **Frontend já tem:**
- ✅ Estrutura de filtros estabelecida
- ✅ Serviço de API configurado
- ✅ Componente de paginação pronto

❌ **Frontend precisa:**
- ❌ Inputs de data
- ❌ Select de ordenação
- ❌ Component de métricas no header
- ❌ Indicador "Filtro Aplicado"
- ❌ Chamada para novo endpoint de métricas

**Tempo estimado:** 2-3 horas (back + front)

---

*Análise criada em 24/03/2026*
*Sem modificações - Apenas verificação e proposição*
