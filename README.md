# Library Access System – Windows Setup & Run Guide

## Requirements

Pastikan sudah install:

- PHP (>= 8.x)
- Composer
- Node.js (>= 18)
- Git (optional)

---

# FIRST TIME SETUP (Jalankan Sekali Saja)

## 1. Setup Backend (Laravel)

Buka Command Prompt / PowerShell:

cd backend

Jika belum ada file .env:
copy .env.example .env

Install dependency:
composer install

Generate app key:
php artisan key:generate

Migrate database + seed:
php artisan migrate:fresh --seed

---

## 2. Setup Frontend (Next.js)

Buka terminal baru:

cd frontend

Install dependency:
npm install

Build project:
npm run build

---

# RUN PROJECT (Bisa diulang kapan saja)

## 1. Run Backend

cd backend
php artisan serve

Server akan jalan di:
http://127.0.0.1:8000

---

## 2. Run Frontend

Buka terminal baru:

cd frontend
npm run dev

Frontend akan jalan di:
http://localhost:3000

---

# Notes

- Jangan tutup kedua terminal saat project berjalan.
- Jika ada error database, jalankan:
  php artisan migrate:status
- Jika perlu reset database:
  php artisan migrate:fresh --seed
