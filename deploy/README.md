# Froppo - Deployment

## 🚀 Avvio Rapido

### Opzione 1: Docker Compose (Raccomandato)
```bash
./start-production.sh
```

### Opzione 2: Manuale
```bash
# Backend
cd backend
dotnet Froppo.API.dll

# Frontend (in un altro terminale)
cd frontend
serve -s . -l 3000
```

## 📁 Struttura Deployment
- `backend/` - Backend .NET compilato
- `frontend/` - Frontend React build
- `docker-compose.yml` - Configurazione Docker
- `start-production.sh` - Script di avvio

## 🔧 Configurazione

### Backend
- Porta: 5248
- Ambiente: Production
- Database: In-memory (per demo)

### Frontend
- Porta: 3000
- Serve: Nginx o serve

## 📱 Accesso
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5248
- **Swagger**: http://localhost:5248/swagger

## 🔑 Credenziali
- **Admin**: admin / admin123
- **User1**: user1 / user123
- **User2**: user2 / user123
