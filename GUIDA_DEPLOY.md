# 🚀 GUIDA COMPLETA AL DEPLOY GRATUITO

## 📋 **PANORAMICA**
- **Backend (.NET)**: Railway (gratuito)
- **Frontend (React)**: Vercel (gratuito)
- **Database**: In-memory (per demo)

---

## 🔧 **STEP 1: PREPARAZIONE GITHUB**

### 1.1 Crea Repository GitHub
```bash
# Nel terminale, nella cartella del progetto
git init
git add .
git commit -m "Initial commit - Froppo Gestionale"
git branch -M main
git remote add origin https://github.com/TUO_USERNAME/froppo-gestionale.git
git push -u origin main
```

### 1.2 Struttura Repository
```
froppo-gestionale/
├── Backend/           # .NET API
├── frontend/          # React App
├── Dockerfile         # Per Railway
├── railway.json       # Config Railway
├── vercel.json        # Config Vercel
└── DEPLOY.md         # Questa guida
```

---

## 🚂 **STEP 2: DEPLOY BACKEND SU RAILWAY**

### 2.1 Registrazione Railway
1. Vai su [railway.app](https://railway.app)
2. Registrati con GitHub
3. Clicca "New Project"
4. Seleziona "Deploy from GitHub repo"
5. Scegli il tuo repository `froppo-gestionale`

### 2.2 Configurazione Railway
1. **Service Name**: `froppo-api`
2. **Build Command**: `dotnet build Backend/src/Froppo.API/Froppo.API.csproj`
3. **Start Command**: `dotnet run --project Backend/src/Froppo.API/Froppo.API.csproj`

### 2.3 Environment Variables
Nel pannello Railway, aggiungi:
```
ASPNETCORE_ENVIRONMENT=Production
ASPNETCORE_URLS=http://+:8080
JWT__SECRET=MySuperSecretKeyThatIsAtLeast32CharactersLong!
JWT__ISSUER=Froppo
JWT__AUDIENCE=FroppoUsers
PORT=8080
```

### 2.4 Deploy
1. Clicca "Deploy"
2. Aspetta il completamento (5-10 minuti)
3. Copia l'URL generato (es: `https://froppo-api-production.up.railway.app`)

---

## ⚡ **STEP 3: DEPLOY FRONTEND SU VERCEL**

### 3.1 Registrazione Vercel
1. Vai su [vercel.com](https://vercel.com)
2. Registrati con GitHub
3. Clicca "New Project"
4. Importa il repository `froppo-gestionale`

### 3.2 Configurazione Vercel
1. **Framework Preset**: Create React App
2. **Root Directory**: `frontend`
3. **Build Command**: `npm run build`
4. **Output Directory**: `build`

### 3.3 Environment Variables
Nel pannello Vercel, aggiungi:
```
NODE_ENV=production
REACT_APP_API_URL=https://froppo-api-production.up.railway.app
```

### 3.4 Deploy
1. Clicca "Deploy"
2. Aspetta il completamento (2-3 minuti)
3. Copia l'URL generato (es: `https://froppo-gestionale.vercel.app`)

---

## 🔄 **STEP 4: AGGIORNAMENTO CORS**

### 4.1 Aggiorna Backend
Nel file `Backend/src/Froppo.API/Program.cs`, sostituisci l'URL Vercel:
```csharp
policy.WithOrigins(
    "https://froppo-gestionale.vercel.app",  // Il tuo URL Vercel
    "https://froppo-gestionale-git-main.vercel.app",
    "https://froppo-gestionale-git-develop.vercel.app",
    "http://localhost:3000"
)
```

### 4.2 Aggiorna Frontend
Nel file `frontend/src/services/authService.ts`, sostituisci l'URL Railway:
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://froppo-api-production.up.railway.app'  // Il tuo URL Railway
  : 'http://localhost:5000';
```

### 4.3 Re-deploy
1. **Railway**: Push su GitHub → Deploy automatico
2. **Vercel**: Push su GitHub → Deploy automatico

---

## ✅ **STEP 5: TESTING**

### 5.1 Test Frontend
1. Vai su `https://froppo-gestionale.vercel.app`
2. Verifica che la pagina si carichi
3. Testa il login con le credenziali demo

### 5.2 Test Backend
1. Vai su `https://froppo-api-production.up.railway.app/swagger`
2. Verifica che l'API sia accessibile
3. Testa gli endpoint

### 5.3 Test Integrazione
1. Login nel frontend
2. Crea un nuovo dipendente
3. Carica un certificato PDF
4. Esporta Excel con PDF

---

## 🎯 **CREDENZIALI DEMO**

### Account Admin
- **Username**: `admin`
- **Password**: `admin123`

### Account User
- **Username**: `user1`
- **Password**: `user123`

---

## 🔧 **TROUBLESHOOTING**

### Problema: CORS Error
**Soluzione**: Verifica che gli URL in `Program.cs` corrispondano esattamente a quelli di Vercel

### Problema: API non raggiungibile
**Soluzione**: Controlla che Railway sia in esecuzione e l'URL sia corretto

### Problema: Build Fallisce
**Soluzione**: 
- Railway: Verifica che `Dockerfile` sia nella root
- Vercel: Verifica che `frontend/package.json` esista

### Problema: File Upload non funziona
**Soluzione**: Verifica che il backend sia raggiungibile e CORS configurato

---

## 📊 **MONITORAGGIO**

### Railway Dashboard
- CPU, RAM, Storage usage
- Logs in tempo reale
- Metrics delle richieste

### Vercel Dashboard
- Analytics traffico
- Performance metrics
- Build logs

---

## 💰 **COSTI**

### Railway (Gratuito)
- ✅ 500 ore/mese di runtime
- ✅ 1GB RAM
- ✅ 1GB Storage
- ✅ Database PostgreSQL incluso

### Vercel (Gratuito)
- ✅ Hosting illimitato
- ✅ CDN globale
- ✅ Deploy automatici
- ✅ Analytics base

---

## 🚀 **RISULTATO FINALE**

Dopo il deploy avrai:
- **Frontend**: `https://froppo-gestionale.vercel.app`
- **Backend**: `https://froppo-api-production.up.railway.app`
- **Swagger**: `https://froppo-api-production.up.railway.app/swagger`

**Applicazione completamente funzionante online!** 🎉

---

## 📞 **SUPPORTO**

Se hai problemi:
1. Controlla i logs in Railway/Vercel
2. Verifica le Environment Variables
3. Testa localmente prima del deploy
4. Controlla che tutti i file siano committati su GitHub
