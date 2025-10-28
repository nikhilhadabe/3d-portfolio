@echo off
echo 🚀 Building 3D Portfolio...

echo 📦 Building backend...
cd server
call npm run build

echo 📦 Building frontend...
cd ..\client
call npm run build

echo ✅ Build completed successfully!
echo 🐳 Starting Docker containers...
cd ..
docker-compose up -d

echo 🎉 Application is running!
echo 📍 Frontend: http://localhost:3000
echo 📍 Backend API: http://localhost:5000
echo 📍 MongoDB: localhost:27017
pause