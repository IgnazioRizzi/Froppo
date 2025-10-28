# 🔒 Sistema di Autenticazione Sicuro

## Panoramica

È stato implementato un sistema di autenticazione completo e sicuro per l'applicazione Froppo, con misure di sicurezza avanzate per proteggere contro attacchi comuni.

## 🛡️ Misure di Sicurezza Implementate

### Backend (.NET 9)

#### 1. **Rate Limiting**
- **Login Policy**: 5 tentativi ogni 15 minuti per prevenire attacchi brute force
- **General Policy**: 100 richieste al minuto per endpoint generali
- **Queue Management**: Gestione intelligente delle richieste in coda

#### 2. **Validazione Input Robusta**
- Sanitizzazione di tutti gli input (trim, lowercase per username)
- Validazione lunghezza campi (username: 3-50, password: 6-100)
- Validazione formato email con regex
- Controllo ruoli validi (Admin, User)

#### 3. **Gestione Errori Sicura**
- Messaggi di errore generici per non esporre informazioni sensibili
- Logging dettagliato per monitoraggio sicurezza
- Timing attack prevention (stesso tempo di risposta)

#### 4. **JWT Token Sicuri**
- Token con scadenza configurabile (default 60 minuti)
- Validazione completa del token (issuer, audience, signature)
- Gestione automatica della scadenza

#### 5. **Password Security**
- Hashing con BCrypt (salt automatico)
- Verifica password sicura
- Nessun logging delle password

### Frontend (React + TypeScript)

#### 1. **Validazione Client-Side**
- Validazione real-time dei campi
- Feedback visivo immediato per errori
- Sanitizzazione input prima dell'invio

#### 2. **Gestione Token Avanzata**
- Storage sicuro dei token con scadenza
- Auto-refresh del token prima della scadenza
- Gestione automatica del logout su token scaduto

#### 3. **Protezione Anti-Brute Force**
- Contatore tentativi di login
- Lockout temporaneo dell'account
- Visualizzazione tentativi rimanenti
- Timer countdown per sblocco

#### 4. **UX Sicura**
- Indicatori di sicurezza visivi
- Messaggi di errore chiari ma non esplicativi
- Loading states per feedback utente
- Disabilitazione form durante lockout

#### 5. **Gestione Errori Robusta**
- Intercettori Axios per gestione automatica errori
- Retry automatico su errori di rete
- Fallback graceful su errori di autenticazione

## 🔧 Configurazione

### Backend Configuration

```csharp
// Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("LoginPolicy", opt =>
    {
        opt.PermitLimit = 5; // 5 tentativi
        opt.Window = TimeSpan.FromMinutes(15); // ogni 15 minuti
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 2;
    });
});
```

### Frontend Configuration

```typescript
// AuthService Configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secondi timeout
  headers: {
    'Content-Type': 'application/json',
  }
});
```

## 🚀 Funzionalità

### 1. **Login Sicuro**
- Validazione input real-time
- Protezione anti-brute force
- Feedback visivo immediato
- Gestione errori user-friendly

### 2. **Registrazione Controllata**
- Validazione completa dei dati
- Controllo duplicati username/email
- Generazione automatica token

### 3. **Gestione Sessioni**
- Auto-logout su token scaduto
- Refresh automatico token
- Gestione stato autenticazione

### 4. **Monitoraggio Sicurezza**
- Logging dettagliato tentativi login
- Tracking tentativi falliti
- Alerting per attività sospette

## 📊 Metriche di Sicurezza

### Rate Limiting
- **Login**: 5 tentativi / 15 minuti
- **General**: 100 richieste / minuto
- **Queue**: Max 2 richieste in coda

### Validazione
- **Username**: 3-50 caratteri, alfanumerico
- **Password**: 6-100 caratteri, qualsiasi carattere
- **Email**: Formato RFC compliant

### Token
- **Durata**: 60 minuti (configurabile)
- **Algoritmo**: HMAC SHA256
- **Refresh**: Automatico 1 minuto prima scadenza

## 🔍 Monitoraggio

### Log Events
- Tentativi di login (successo/fallimento)
- Tentativi di registrazione
- Errori di validazione
- Attività sospette

### Security Headers
- CORS configurato
- Content-Type validation
- Request size limits

## 🛠️ Manutenzione

### Aggiornamenti Sicurezza
1. Monitorare log per attività sospette
2. Aggiornare rate limits se necessario
3. Rivedere configurazioni JWT periodicamente
4. Testare validazioni input regolarmente

### Backup e Recovery
- Token non persistono in database
- Logout automatico su errori critici
- Gestione graceful degli errori

## 📈 Performance

### Ottimizzazioni
- Timeout configurabili
- Caching intelligente token
- Gestione efficiente errori
- UI responsive e veloce

### Scalabilità
- Rate limiting scalabile
- Gestione concorrente richieste
- Memory efficient token storage

## 🔐 Best Practices Implementate

1. **Never log passwords**
2. **Validate all inputs**
3. **Use HTTPS in production**
4. **Implement proper error handling**
5. **Rate limit sensitive endpoints**
6. **Use secure token storage**
7. **Implement proper logout**
8. **Monitor security events**
9. **Use strong password hashing**
10. **Implement proper CORS**

## 🚨 Incident Response

### In caso di attacchi
1. Controllare log per pattern sospetti
2. Aumentare temporaneamente rate limits
3. Monitorare tentativi di accesso
4. Implementare IP blocking se necessario

### Recovery
- Reset automatico contatori dopo lockout
- Logout forzato su token compromessi
- Cleanup automatico token scaduti

---

**Sistema implementato con standard di sicurezza enterprise-grade per proteggere l'applicazione e i dati degli utenti.**
