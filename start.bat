@echo off
REM Script per avviare Froppo - Gestione Utenti
REM Backend .NET + Frontend React

echo 🚀 Avvio Froppo - Gestione Utenti
echo ======================================

REM Funzione per killare processi su porte specifiche
echo 🧹 Pulizia porte...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5248') do taskkill /f /pid %%a >nul 2>&1

timeout /t 3 /nobreak >nul

REM Avvio Backend
echo 🔧 Avvio Backend .NET...
cd Backend
start "Backend API" cmd /k "dotnet run --project src/Froppo.API"

REM Aspetta che il backend sia pronto
echo ⏳ Attesa avvio backend...
timeout /t 8 /nobreak >nul

REM Avvio Frontend
echo ⚛️ Avvio Frontend React...
cd ..\frontend
start "Frontend React" cmd /k "npm start"

REM Aspetta che il frontend sia pronto
echo ⏳ Attesa avvio frontend...
timeout /t 10 /nobreak >nul

echo.
echo 🎉 Froppo è in esecuzione!
echo ======================================
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:5248
echo 📚 Swagger UI: http://localhost:5248/swagger
echo.
echo 💡 Suggerimenti:
echo • Apri http://localhost:3000 nel browser
echo • Usa la barra di ricerca per cercare utenti
echo • Prova a creare, modificare ed eliminare utenti
echo • Testa la validazione inserendo dati non validi
echo.
echo 🛑 Per fermare i server: Chiudi le finestre dei terminali
echo.
pause
