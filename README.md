# 🚀 Froppo Gestionale

![Froppo Gestionale](https://img.shields.io/badge/Froppo-Gestionale-blue?style=for-the-badge&logo=react)
![.NET](https://img.shields.io/badge/.NET-9.0-purple?style=for-the-badge&logo=dotnet)
![React](https://img.shields.io/badge/React-18.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)

> **Sistema completo di gestione dipendenti** con autenticazione JWT, upload certificati PDF e esportazione Excel con glassmorphism UI.

## ✨ Features

- 🔐 **Autenticazione JWT sicura** con rate limiting
- 👥 **Gestione dipendenti completa** (CRUD operations)
- 📄 **Upload/Download certificati PDF** con validazione
- 📊 **Esportazione Excel con PDF** inclusi in archivio ZIP
- 🎨 **UI Glassmorphism moderna** e responsive
- 📱 **Design mobile-first** ottimizzato
- 🔒 **Sicurezza avanzata** con CORS e validazioni
- 🚀 **Deploy automatico** su Railway + Vercel

## 🛠️ Tech Stack

### Backend
- **.NET 9** con Minimal API
- **JWT Authentication** con refresh tokens
- **Rate Limiting** per sicurezza
- **File Storage** in-memory con metadata
- **CORS** configurato per produzione

### Frontend
- **React 18** con TypeScript
- **PrimeReact** per componenti UI
- **Glassmorphism Design** personalizzato
- **Custom Hooks** per state management
- **Toast Notifications** sistema completo

### Deploy
- **Railway** per backend (.NET)
- **Vercel** per frontend (React)
- **GitHub Actions** per CI/CD

## 🚀 Quick Start

### Prerequisiti
- Node.js 18+
- .NET 9 SDK
- Git

### Installazione Locale

```bash
# Clone repository
git clone https://github.com/TUO_USERNAME/froppo-gestionale.git
cd froppo-gestionale

# Backend
cd Backend
dotnet restore
dotnet run --project src/Froppo.API

# Frontend (nuovo terminale)
cd frontend
npm install
npm start
```

### Deploy Online

```bash
# Esegui script di preparazione
./prepare-deploy.sh
```

Segui la [Guida Deploy](GUIDA_DEPLOY.md) per istruzioni dettagliate.

## 📋 Credenziali Demo

| Ruolo | Username | Password |
|-------|----------|----------|
| **Admin** | `admin` | `admin123` |
| **User** | `user1` | `user123` |

## 🎯 Funzionalità Principali

### 👤 Gestione Dipendenti
- ✅ Creazione nuovo dipendente
- ✅ Modifica dati esistenti
- ✅ Eliminazione singola/multipla
- ✅ Ricerca e filtri avanzati
- ✅ Ordinamento per colonne

### 📄 Gestione Certificati
- ✅ Upload PDF con validazione
- ✅ Storage sicuro sul server
- ✅ Download individuale
- ✅ Esportazione batch in ZIP

### 📊 Esportazione Dati
- ✅ Excel con tutti i dati
- ✅ ZIP con certificati PDF
- ✅ README dettagliato
- ✅ Gestione errori robusta

## 🎨 UI/UX Features

- **Glassmorphism Design** con effetti blur
- **Toast Notifications** per feedback utente
- **Progress Bars** per operazioni lunghe
- **Responsive Layout** per tutti i dispositivi
- **Dark/Light Theme** supporto
- **Animazioni fluide** e transizioni

## 🔒 Sicurezza

- **JWT Tokens** con scadenza
- **Rate Limiting** per prevenire attacchi
- **CORS** configurato per produzione
- **Validazione input** client e server
- **File upload** con controlli tipo/dimensione
- **HTTPS** obbligatorio in produzione

## 📁 Struttura Progetto

```
froppo-gestionale/
├── Backend/                 # .NET API
│   ├── src/
│   │   ├── Froppo.API/     # API principale
│   │   ├── Froppo.Application/ # Servizi business
│   │   ├── Froppo.Domain/  # Entità e DTOs
│   │   └── Froppo.Infrastructure/ # Repository
│   └── Dockerfile
├── frontend/               # React App
│   ├── src/
│   │   ├── components/    # Componenti riutilizzabili
│   │   ├── pages/         # Pagine principali
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom hooks
│   │   └── types/         # TypeScript types
│   └── package.json
├── railway.json           # Config Railway
├── vercel.json           # Config Vercel
└── GUIDA_DEPLOY.md       # Guida deploy
```

## 🌐 Deploy Online

### Railway (Backend)
- **URL**: `https://froppo-api-production.up.railway.app`
- **Swagger**: `https://froppo-api-production.up.railway.app/swagger`
- **Costo**: Gratuito (500 ore/mese)

### Vercel (Frontend)
- **URL**: `https://froppo-gestionale.vercel.app`
- **Costo**: Gratuito (hosting illimitato)

## 📊 Performance

- **Frontend**: 418KB gzipped
- **Backend**: Cold start < 3s
- **API Response**: < 200ms
- **File Upload**: Progress tracking
- **Export**: Download parallelo

## 🤝 Contribuire

1. Fork del progetto
2. Crea feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push branch (`git push origin feature/AmazingFeature`)
5. Apri Pull Request

## 📝 Licenza

Distribuito sotto licenza MIT. Vedi `LICENSE` per maggiori informazioni.

## 👨‍💻 Autore

**Ignazio Rizzi**
- GitHub: [@ignaziorizzi](https://github.com/ignaziorizzi)
- Email: ignaziorizzi@example.com

## 🙏 Ringraziamenti

- [PrimeReact](https://primereact.org/) per i componenti UI
- [Railway](https://railway.app/) per l'hosting backend
- [Vercel](https://vercel.com/) per l'hosting frontend
- [.NET](https://dotnet.microsoft.com/) per il framework backend
- [React](https://reactjs.org/) per il framework frontend

---

⭐ **Se ti piace questo progetto, lascia una stella!** ⭐