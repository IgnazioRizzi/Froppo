#!/bin/bash

# Script per fermare Froppo - Gestione Utenti

echo "🛑 Arresto Froppo - Gestione Utenti"
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
        echo -e "${YELLOW}⚠️  Terminazione processo sulla porta $port (PID: $process)${NC}"
        kill -9 $process
    else
        echo -e "${BLUE}ℹ️  Nessun processo sulla porta $port${NC}"
    fi
}

# Ferma i server
echo -e "${BLUE}🧹 Arresto server...${NC}"
kill_port 3000  # React
kill_port 5248  # .NET API

# Ferma anche i processi dotnet e node specifici del progetto
echo -e "${BLUE}🔍 Ricerca processi del progetto...${NC}"

# Ferma processi dotnet del progetto
pkill -f "dotnet.*Froppo" 2>/dev/null && echo -e "${GREEN}✅ Processi dotnet fermati${NC}"

# Ferma processi node del frontend
pkill -f "react-scripts.*start" 2>/dev/null && echo -e "${GREEN}✅ Processi React fermati${NC}"

echo -e "${GREEN}✅ Tutti i server sono stati fermati${NC}"
echo ""
echo -e "${BLUE}💡 Per riavviare il progetto usa:${NC}"
echo "   ./start.sh"
echo ""
