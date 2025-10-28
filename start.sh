#!/bin/bash

# Script per avviare Froppo - Gestione Utenti
# Backend .NET + Frontend React

echo "🚀 Avvio Froppo - Gestione Utenti"
echo "======================================"

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per killare processi su porte specifiche
kill_port() {
    local port=$1
    local process=$(lsof -ti:$port)
    if [ ! -z "$process" ]; then
        echo -e "${YELLOW}⚠️  Processo esistente sulla porta $port, terminazione...${NC}"
        kill -9 $process
        sleep 2
    fi
}

# Funzione per verificare se una porta è libera
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        return 1
    else
        return 0
    fi
}

# Funzione per aspettare che una porta sia disponibile
wait_for_port() {
    local port=$1
    local max_attempts=30
    local attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if check_port $port; then
            echo -e "${GREEN}✅ Porta $port disponibile${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Attesa porta $port... ($((attempt+1))/$max_attempts)${NC}"
        sleep 1
        ((attempt++))
    done
    
    echo -e "${RED}❌ Timeout: porta $port non disponibile${NC}"
    return 1
}

# Pulizia porte
echo -e "${BLUE}🧹 Pulizia porte...${NC}"
kill_port 3000  # React
kill_port 5248  # .NET API

# Aspetta che le porte siano libere
wait_for_port 3000
wait_for_port 5248

# Avvio Backend
echo -e "${BLUE}🔧 Avvio Backend .NET...${NC}"
cd Backend
dotnet run --project src/Froppo.API &
BACKEND_PID=$!

# Aspetta che il backend sia pronto
echo -e "${YELLOW}⏳ Attesa avvio backend...${NC}"
sleep 5

# Verifica che il backend sia attivo
if curl -s http://localhost:5248/api/users > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend avviato con successo su http://localhost:5248${NC}"
else
    echo -e "${YELLOW}⚠️  Backend in avvio, continuo con frontend...${NC}"
fi

# Avvio Frontend
echo -e "${BLUE}⚛️  Avvio Frontend React...${NC}"
cd ../frontend
npm start &
FRONTEND_PID=$!

# Aspetta che il frontend sia pronto
echo -e "${YELLOW}⏳ Attesa avvio frontend...${NC}"
sleep 10

# Verifica che il frontend sia attivo
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend avviato con successo su http://localhost:3000${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend in avvio...${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Froppo è in esecuzione!${NC}"
echo "======================================"
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 Backend API:${NC} http://localhost:5248"
echo -e "${BLUE}📚 Swagger UI:${NC} http://localhost:5248/swagger"
echo ""
echo -e "${YELLOW}💡 Suggerimenti:${NC}"
echo "• Apri http://localhost:3000 nel browser"
echo "• Usa la barra di ricerca per cercare utenti"
echo "• Prova a creare, modificare ed eliminare utenti"
echo "• Testa la validazione inserendo dati non validi"
echo ""
echo -e "${RED}🛑 Per fermare i server: Ctrl+C${NC}"

# Funzione per cleanup al termine
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Arresto server...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    kill_port 3000
    kill_port 7000
    echo -e "${GREEN}✅ Server fermati${NC}"
    exit 0
}

# Gestione segnali per cleanup
trap cleanup SIGINT SIGTERM

# Mantieni lo script attivo
wait
