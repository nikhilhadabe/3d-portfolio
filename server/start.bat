@echo off
echo 🚀 Starting Portfolio Backend...

echo ⏳ Waiting for MongoDB...
:wait_mongo
timeout /t 1 /nobreak >nul
docker exec mongodb mongo --eval "db.adminCommand('ping')" >nul 2>&1
if errorlevel 1 (
    echo Waiting for MongoDB...
    goto wait_mongo
)
echo ✅ MongoDB is ready!

echo 🚀 Starting application...
npm start