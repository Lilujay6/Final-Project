#!/bin/bash

echo "=== BACKEND SETUP ==="
cd backend || exit

if [ ! -f .env ]; then
  cp .env.example .env
  echo ".env file created"
fi

composer install

php artisan key:generate
php artisan migrate:fresh --seed

cd ..

echo "=== FRONTEND SETUP ==="
cd frontend || exit

npm install
npm run build

cd ..

echo "=== SETUP COMPLETE ==="
