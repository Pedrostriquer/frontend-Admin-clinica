# Análise: Queries Repetidas no Backend

## 🔍 Problemas Identificados

### **Problema 1: EmailService registrado como Scoped (CRÍTICO)**

**Arquivo**: `Program.cs` linha 141
```csharp
builder.Services.AddScoped<IEmailService, EmailService>();
```

**Por quê é um problema**:
- `Scoped` significa que uma **nova instância** é criada para cada requisição HTTP
- No construtor do EmailService (linha 32), há uma query direta ao banco:
  ```csharp
  _emailConfig = dbContext.EmailConfigurations.FirstOrDefault();
  ```
- Resultado: **Toda requisição HTTP dispara uma query à tabela `email_configurations`**

**Padrão observado**:
- Se o frontend está fazendo requisições a cada ~125-135ms
- Cada requisição = novo scope = nova instância EmailService = nova query ao banco
- Isso explica as queries repetidas que você está vendo!

---

### **Problema 2: ValorizationScheduler com loop muito agressivo**

**Arquivo**: `Services/BackgroundServices/ValorizationScheduler.cs` linhas 32-76

**Comportamento atual**:
```csharp
while (!stoppingToken.IsCancellationRequested)
{
    // Query ao banco SEMPRE
    var config = await dbContext.ValorizationConfigs.FirstOrDefaultAsync(stoppingToken);

    // Delays varia conforme:
    if (config == null)
        await Task.Delay(TimeSpan.FromHours(1), stoppingToken);  // 1 hora
    else if (!config.ValorizationStatus)
        await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken); // 1 minuto
    else if (hora não bate)
        await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken); // ← 10 SEGUNDOS!
    else if (hora bate)
        await Task.Delay(TimeSpan.FromSeconds(61), stoppingToken);
}
```

**Por quê é um problema**:
- A cada **10 segundos**, há uma query à tabela `valorization_configs`
- O valorizationScheduler **nunca cacheia a configuração** - sempre vai ao banco
- Isso é desnecessário porque a configuração raramente muda em tempo de execução

---

## 📊 Resumo do Impacto

| Serviço | Frequência | Causa |
|---------|-----------|-------|
| **email_configurations** | A cada ~125-135ms | Cada request HTTP cria novo scope → nova instância EmailService → query |
| **valorization_configs** | A cada 10 segundos | Loop do ValorizationScheduler sem cache |

---

## ✅ Soluções Recomendadas

### **Solução 1: Mudar EmailService para Singleton**

**Arquivo**: `Program.cs` linha 141

Altere de:
```csharp
builder.Services.AddScoped<IEmailService, EmailService>();
```

Para:
```csharp
builder.Services.AddSingleton<IEmailService, EmailService>();
```

**Benefícios**:
- Uma única instância de EmailService durante toda a vida da aplicação
- A query ao banco ocorre **apenas uma vez** quando a aplicação inicia
- Reduz drasticamente as queries ao banco
- ⚠️ **Limitação**: Se você atualizar a configuração de email em tempo de execução, precisará reiniciar a aplicação

---

### **Solução 2: Implementar Cache no ValorizationScheduler**

**Arquivo**: `Services/BackgroundServices/ValorizationScheduler.cs`

Adicione um cache de 1 hora (ou outro intervalo):

```csharp
public class ValorizationScheduler : BackgroundService
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<ValorizationScheduler> _logger;
    private readonly TimeZoneInfo _saoPauloTimeZone;

    // NOVO: Cache da configuração
    private ValorizationConfig _cachedConfig;
    private DateTime _lastConfigFetch = DateTime.MinValue;
    private readonly TimeSpan _cacheTimeout = TimeSpan.FromHours(1); // Cache por 1 hora

    // ... construtor ...

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Serviço de agendamento de valorização iniciado...");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using (var scope = _serviceProvider.CreateScope())
                {
                    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    var contractService = scope.ServiceProvider.GetRequiredService<ContractService>();

                    // NOVO: Carrega configuração apenas se cache expirou
                    if (_cachedConfig == null || DateTime.UtcNow - _lastConfigFetch > _cacheTimeout)
                    {
                        _cachedConfig = await dbContext.ValorizationConfigs.FirstOrDefaultAsync(stoppingToken);
                        _lastConfigFetch = DateTime.UtcNow;

                        if (_cachedConfig != null)
                        {
                            _logger.LogInformation("Configuração de valorização recarregada do banco de dados.");
                        }
                    }

                    var config = _cachedConfig; // Usa cache em vez de query

                    if (config == null)
                    {
                        _logger.LogWarning("Nenhuma configuração de valorização encontrada. Verificando novamente em 1 hora.");
                        await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
                        continue;
                    }

                    if (!config.ValorizationStatus)
                    {
                        _logger.LogInformation("Valorização diária está desativada. Verificando novamente em 10 minutos.");
                        await Task.Delay(TimeSpan.FromMinutes(10), stoppingToken); // Aumentado de 1 minuto
                        continue;
                    }

                    var utcNow = DateTime.UtcNow;
                    var saoPauloNow = TimeZoneInfo.ConvertTimeFromUtc(utcNow, _saoPauloTimeZone);
                    var nowInSaoPaulo = TimeOnly.FromDateTime(saoPauloNow);
                    var scheduledTime = config.ValorizationTime;

                    if (nowInSaoPaulo.Hour == scheduledTime.Hour && nowInSaoPaulo.Minute == scheduledTime.Minute)
                    {
                        _logger.LogInformation("Hora agendada atingida! Executando valorização...");
                        var processedCount = await contractService.AppreciateAllActiveContracts();
                        _logger.LogInformation("{Count} contratos foram valorizados com sucesso.", processedCount);
                        await Task.Delay(TimeSpan.FromSeconds(61), stoppingToken);
                    }
                    else
                    {
                        await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken); // Aumentado de 10 segundos
                    }
                }
            }
            catch (OperationCanceledException)
            {
                break;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro inesperado no agendamento de valorização.");
                await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken);
            }
        }

        _logger.LogInformation("Serviço de agendamento de valorização finalizado.");
    }
}
```

**Benefícios**:
- Reduz queries à tabela `valorization_configs` de a cada 10 segundos para a cada 1 hora
- Cache pode ser customizado conforme necessidade
- Aplicação ainda recarrega a configuração periodicamente

---

## 🎯 Impacto Esperado

Depois de aplicar ambas as soluções:

| Métrica | Antes | Depois |
|---------|-------|--------|
| Queries `email_configurations` por segundo | ~8 (ou mais) | 0 (carregada 1x na inicialização) |
| Queries `valorization_configs` por segundo | 1 (a cada 10s) | ~0.00028 (a cada 1 hora) |
| **Economia de queries** | - | **~99%** |

---

## ⚠️ Considerações Importantes

1. **EmailService como Singleton**:
   - A configuração de email é carregada uma única vez
   - Se você precisar atualizar a configuração de email em tempo de execução, **a aplicação precisará ser reiniciada**
   - Alternativa: Implementar um cache com TTL (time-to-live) similar ao ValorizationScheduler

2. **ValorizationScheduler com Cache**:
   - O intervalo de 1 hora pode ser ajustado conforme necessidade
   - O aumento do delay de 10s para 30s não deve afetar a precisão do agendamento

---

## 📝 Próximos Passos

1. Aplique a **Solução 1** (mudar EmailService para Singleton)
2. Teste com o logging para confirmar que as queries diminuíram
3. Aplique a **Solução 2** (adicionar cache no ValorizationScheduler)
4. Monitore novamente para confirmar o impacto
