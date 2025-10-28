# 🚀 Guida al Deployment - Froppo

## 📋 Panoramica
Questa guida ti aiuterà a pubblicare Froppo su domini gratuiti.

## 🎯 Opzioni Raccomandate

### Opzione 1: Vercel (Frontend) + Railway (Backend) - RACCOMANDATO
- **Frontend**: Vercel (gratuito, ottimo per React)
- **Backend**: Railway (gratuito, supporta .NET)
- **Dominio**: `.vercel.app` + `.railway.app`

### Opzione 2: Netlify (Frontend) + Render (Backend)
- **Frontend**: Netlify (gratuito)
- **Backend**: Render (gratuito)
- **Dominio**: `.netlify.app` + `.onrender.com`

## 🚀 Procedura: Vercel + Railway

### Passo 1: Preparare il Backend per Railway

1. **Crea un account su Railway**:
   - Vai su https://railway.app
   - Registrati con GitHub
   - Connetti il tuo repository

2. **Configura il progetto**:
   ```bash
   # Nel tuo progetto, crea un Dockerfile per il backend
   ```

3. **Variabili d'ambiente su Railway**:
   ```
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://0.0.0.0:$PORT
   ```

### Passo 2: Preparare il Frontend per Vercel

1. **Crea un account su Vercel**:
   - Vai su https://vercel.com
   - Registrati con GitHub
   - Connetti il tuo repository

2. **Configura il build**:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

3. **Variabili d'ambiente su Vercel**:
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app
   ```

### Passo 3: Aggiornare il Frontend

1. **Aggiorna i servizi per usare l'URL di produzione**:
   ```typescript
   // In frontend/src/services/userService.ts
   const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5248';
   ```

2. **Testa localmente**:
   ```bash
   cd frontend
   npm run build
   npm install -g serve
   serve -s build
   ```

## 🔧 Configurazione Avanzata

### CORS per Produzione
Nel backend, aggiorna la configurazione CORS:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("https://your-frontend-url.vercel.app")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
```

### Database (Opzionale)
Se vuoi un database persistente:
- **Railway**: PostgreSQL gratuito
- **Render**: PostgreSQL gratuito
- **Supabase**: PostgreSQL gratuito

## 📱 Domini Personalizzati (Opzionale)

### Vercel
- Dominio personalizzato gratuito
- SSL automatico
- CDN globale

### Railway
- Dominio personalizzato
- SSL automatico
- Scaling automatico

## 🎉 Risultato Finale

Dopo il deployment avrai:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **API**: `https://your-app.railway.app/api/users`
- **Swagger**: `https://your-app.railway.app/swagger`

## 🛠️ Comandi Utili

```bash
# Build frontend
cd frontend && npm run build

# Test backend
cd Backend && dotnet run

# Deploy su Railway
railway login
railway link
railway up

# Deploy su Vercel
vercel --prod
```

## 📞 Supporto

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Render Docs**: https://render.com/docs
