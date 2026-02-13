<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ScanController;
use App\Http\Controllers\DashboardController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/scan', [ScanController::class, 'scan']);

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/users', [UserController::class, 'index']);
    Route::post('/users', [UserController::class, 'store']);
    Route::put('/users/{id}', [UserController::class, 'update']); // REQUIRED
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    Route::post('/users/{id}/toggle', [UserController::class, 'toggleStatus']); // rename
    Route::post('/users/{id}/toggle-location', [UserController::class, 'toggleLocation']);

    Route::get('/stats', [DashboardController::class, 'stats']);
});
