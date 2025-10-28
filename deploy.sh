#!/bin/bash

# Script per il deployment su Vercel + Railway
echo "🚀 Avvio Deployment Froppo"
echo "=============================="

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Preparazione file per deployment...${NC}"

# Build del frontend
echo -e "${YELLOW}🔨 Building frontend...${NC}"
cd frontend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Frontend build completato${NC}"
else
    echo -e "${RED}❌ Errore nel build del frontend${NC}"
    exit 1
fi

cd ..

echo -e "${BLUE}📋 Istruzioni per il deployment:${NC}"
echo ""
echo -e "${YELLOW}1. BACKEND (Railway):${NC}"
echo "   • Vai su https://railway.app"
echo "   • Connetti il tuo repository GitHub"
echo "   • Seleziona la cartella 'Backend'"
echo "   • Railway rileverà automaticamente il Dockerfile"
echo "   • Aggiungi le variabili d'ambiente:"
echo "     - ASPNETCORE_ENVIRONMENT=Production"
echo "     - ASPNETCORE_URLS=http://0.0.0.0:\$PORT"
echo ""
echo -e "${YELLOW}2. FRONTEND (Vercel):${NC}"
echo "   • Vai su https://vercel.com"
echo "   • Connetti il tuo repository GitHub"
echo "   • Root Directory: 'frontend'"
echo "   • Build Command: 'npm run build'"
echo "   • Output Directory: 'build'"
echo "   • Aggiungi la variabile d'ambiente:"
echo "     - REACT_APP_API_URL=https://your-backend-url.railway.app"
echo ""
echo -e "${YELLOW}3. ALTERNATIVA (Netlify + Render):${NC}"
echo "   • Frontend: https://netlify.com"
echo "   • Backend: https://render.com"
echo "   • Stessa configurazione"
echo ""
echo -e "${GREEN}🎉 Dopo il deployment avrai:${NC}"
echo "   • Frontend: https://your-app.vercel.app"
echo "   • Backend: https://your-app.railway.app"
echo "   • API: https://your-app.railway.app/api/users"
echo "   • Swagger: https://your-app.railway.app/swagger"
echo ""
echo -e "${BLUE}📚 Documentazione completa in DEPLOYMENT.md${NC}"