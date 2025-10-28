#!/bin/bash
echo "🚀 Avvio Froppo in modalità produzione..."

# Avvia con Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "Avvio con Docker Compose..."
    docker-compose up -d
    echo "✅ Froppo avviato!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5248"
else
    echo "Docker Compose non trovato. Avvio manuale..."
    
    # Avvia backend
    echo "Avvio backend..."
    cd backend
    dotnet Froppo.API.dll &
    BACKEND_PID=$!
    cd ..
    
    # Avvia frontend con serve
    echo "Avvio frontend..."
    if command -v serve &> /dev/null; then
        serve -s frontend -l 3000 &
        FRONTEND_PID=$!
    else
        echo "Installa serve: npm install -g serve"
        exit 1
    fi
    
    echo "✅ Froppo avviato!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:5248"
    echo "🛑 Per fermare: kill $BACKEND_PID $FRONTEND_PID"
fi
