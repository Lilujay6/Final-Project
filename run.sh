#!/bin/bash

echo "=== CHECK MIGRATION STATUS ==="
cd backend || exit
php artisan migrate:status

echo "=== STARTING LARAVEL SERVER ==="
php artisan serve &
BACKEND_PID=$!

cd ../frontend || exit

echo "=== STARTING FRONTEND DEV SERVER ==="
npm run dev &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
