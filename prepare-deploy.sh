#!/bin/bash

# 🚀 Script di Deploy Automatico per Froppo Gestionale
# Questo script prepara il progetto per il deploy su Railway e Vercel

set -e  # Exit on any error

echo "🚀 FROPPO GESTIONALE - PREPARAZIONE DEPLOY"
echo "=========================================="

# Colori per output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funzione per stampare messaggi colorati
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verifica che siamo nella directory corretta
if [ ! -f "package.json" ] && [ ! -d "Backend" ] && [ ! -d "frontend" ]; then
    print_error "Esegui questo script dalla root del progetto Froppo!"
    exit 1
fi

print_status "Verifico la struttura del progetto..."

# Verifica struttura progetto
if [ ! -d "Backend" ]; then
    print_error "Directory Backend non trovata!"
    exit 1
fi

if [ ! -d "frontend" ]; then
    print_error "Directory frontend non trovata!"
    exit 1
fi

if [ ! -f "Dockerfile" ]; then
    print_error "Dockerfile non trovato!"
    exit 1
fi

print_success "Struttura progetto verificata"

# Verifica Git
print_status "Verifico configurazione Git..."

if ! git status > /dev/null 2>&1; then
    print_warning "Repository Git non inizializzato. Inizializzo..."
    git init
    git branch -M main
fi

# Verifica se ci sono modifiche non committate
if ! git diff --quiet || ! git diff --cached --quiet; then
    print_warning "Ci sono modifiche non committate. Le committo..."
    git add .
    git commit -m "Preparazione deploy automatico - $(date)"
fi

print_success "Git configurato correttamente"

# Build Frontend
print_status "Building frontend per produzione..."
cd frontend

if ! npm run build; then
    print_error "Build frontend fallita!"
    exit 1
fi

print_success "Frontend build completato"

cd ..

# Build Backend
print_status "Building backend per produzione..."
cd Backend

if ! dotnet build; then
    print_error "Build backend fallita!"
    exit 1
fi

print_success "Backend build completato"

cd ..

# Verifica file di configurazione
print_status "Verifico file di configurazione..."

if [ ! -f "railway.json" ]; then
    print_error "railway.json non trovato!"
    exit 1
fi

if [ ! -f "vercel.json" ]; then
    print_error "vercel.json non trovato!"
    exit 1
fi

print_success "File di configurazione verificati"

# Informazioni per il deploy
echo ""
echo "🎯 INFORMAZIONI PER IL DEPLOY"
echo "============================"
echo ""
echo "📁 Repository GitHub:"
echo "   git remote -v"
echo ""
echo "🚂 Railway Deploy:"
echo "   1. Vai su https://railway.app"
echo "   2. New Project → Deploy from GitHub repo"
echo "   3. Seleziona il tuo repository"
echo "   4. Environment Variables:"
echo "      ASPNETCORE_ENVIRONMENT=Production"
echo "      ASPNETCORE_URLS=http://+:8080"
echo "      JWT__SECRET=MySuperSecretKeyThatIsAtLeast32CharactersLong!"
echo "      JWT__ISSUER=Froppo"
echo "      JWT__AUDIENCE=FroppoUsers"
echo ""
echo "⚡ Vercel Deploy:"
echo "   1. Vai su https://vercel.com"
echo "   2. New Project → Import Git Repository"
echo "   3. Seleziona il tuo repository"
echo "   4. Root Directory: frontend"
echo "   5. Environment Variables:"
echo "      NODE_ENV=production"
echo "      REACT_APP_API_URL=https://TUO_URL_RAILWAY.up.railway.app"
echo ""
echo "📋 Credenziali Demo:"
echo "   Admin: admin / admin123"
echo "   User:  user1 / user123"
echo ""

# Chiedi se vuole pushare su GitHub
read -p "Vuoi pushare le modifiche su GitHub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Push su GitHub..."
    
    # Verifica se remote origin esiste
    if ! git remote get-url origin > /dev/null 2>&1; then
        print_warning "Remote origin non configurato!"
        echo "Configura il remote con:"
        echo "git remote add origin https://github.com/TUO_USERNAME/froppo-gestionale.git"
        exit 1
    fi
    
    if git push origin main; then
        print_success "Push su GitHub completato!"
    else
        print_error "Push su GitHub fallito!"
        exit 1
    fi
else
    print_warning "Push su GitHub saltato. Ricordati di farlo manualmente!"
fi

echo ""
print_success "🎉 PREPARAZIONE DEPLOY COMPLETATA!"
echo ""
echo "📖 Leggi la GUIDA_DEPLOY.md per istruzioni dettagliate"
echo "🚀 Il tuo progetto è pronto per il deploy online!"
echo ""
