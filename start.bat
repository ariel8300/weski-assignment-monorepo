@echo off
echo 🚀 Starting Hotel Search Application in Development Mode...

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    pause
    exit /b 1
)

REM Build and start services
echo 📦 Building and starting services...
docker-compose -f docker-compose.dev.yml up --build

echo ✅ Application is starting up!
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:3001
echo.
echo Press Ctrl+C to stop the services
pause 