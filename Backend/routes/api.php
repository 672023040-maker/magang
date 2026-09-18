<?php

use App\Http\Controllers\Api\Admin\KontakController as AdminKontakController;
use App\Http\Controllers\Api\Admin\ProfilController as AdminProfilController;
use App\Http\Controllers\Api\Admin\ProjectController as AdminProjectController;
use App\Http\Controllers\Api\Admin\StrukturController as AdminStrukturController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Public\KontakController;
use App\Http\Controllers\Api\Public\ProfilController;
use App\Http\Controllers\Api\Public\ProjectController;
use App\Http\Controllers\Api\Public\StrukturController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Endpoint Publik (tanpa autentikasi)
|--------------------------------------------------------------------------
*/

Route::get('/profil', [ProfilController::class, 'index']);
Route::get('/struktur', [StrukturController::class, 'index']);
Route::get('/project', [ProjectController::class, 'index']);
Route::get('/kontak', [KontakController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Autentikasi Admin
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Area Admin (wajib token Sanctum)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    Route::prefix('admin')->group(function () {
        Route::get('profil', [AdminProfilController::class, 'index']);
        Route::put('profil', [AdminProfilController::class, 'update']);

        Route::get('struktur', [AdminStrukturController::class, 'index']);
        Route::post('struktur', [AdminStrukturController::class, 'store']);
        Route::put('struktur/{id}', [AdminStrukturController::class, 'update']);
        Route::delete('struktur/{id}', [AdminStrukturController::class, 'destroy']);

        Route::get('project', [AdminProjectController::class, 'index']);
        Route::post('project', [AdminProjectController::class, 'store']);
        Route::put('project/{id}', [AdminProjectController::class, 'update']);
        Route::delete('project/{id}', [AdminProjectController::class, 'destroy']);

        Route::get('kontak', [AdminKontakController::class, 'index']);
        Route::post('kontak', [AdminKontakController::class, 'store']);
        Route::put('kontak/{id}', [AdminKontakController::class, 'update']);
        Route::delete('kontak/{id}', [AdminKontakController::class, 'destroy']);
    });
});
