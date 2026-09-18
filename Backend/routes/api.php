<?php

use App\Http\Controllers\Api\Admin\DeviceController;
use App\Http\Controllers\Api\Admin\KontakController as AdminKontakController;
use App\Http\Controllers\Api\Admin\PasswordController;
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
| Autentikasi Admin (Sanctum cookie/session + CSRF)
|--------------------------------------------------------------------------
*/

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:auth:login');

Route::middleware(['auth:admin', 'track.session'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
});

/*
|--------------------------------------------------------------------------
| Area Admin
|
| Prefix route diambil dari config/environment (ADMIN_PATH). Ini hanyalah
| lapisan tambahan obscurity — authentication + authorization + rate limit
| tetap menjadi keamanan utama yang dijamin middleware.
|--------------------------------------------------------------------------
*/

$adminPath = trim((string) config('security.admin_path'), '/');

Route::middleware(['auth:admin', 'ensure.admin', 'track.session'])
    ->prefix($adminPath)
    ->group(function () {
        /*
         * Endpoint tetap boleh diakses walau must_change_password masih aktif:
         * ganti password, kelola perangkat, logout, me.
         */
        Route::put('/password', [PasswordController::class, 'update'])
            ->middleware('throttle:auth:sensitive');

        Route::get('/devices', [DeviceController::class, 'index']);
        Route::post('/devices/revoke-all', [DeviceController::class, 'revokeAll'])
            ->middleware('throttle:auth:sensitive');
        Route::post('/devices/{id}/revoke', [DeviceController::class, 'revoke'])
            ->middleware('throttle:auth:sensitive');

        /*
         * CRUD wajib password sudah diganti terlebih dahulu
         * (4xx/403 bila must_change_password masih aktif).
         */
        Route::middleware('ensure.password.changed')->group(function () {
            Route::get('/profil', [AdminProfilController::class, 'index']);
            Route::put('/profil', [AdminProfilController::class, 'update'])
                ->middleware('throttle:admin:write');

            Route::get('/struktur', [AdminStrukturController::class, 'index']);
            Route::post('/struktur', [AdminStrukturController::class, 'store'])
                ->middleware('throttle:admin:upload');
            Route::put('/struktur/{id}', [AdminStrukturController::class, 'update'])
                ->middleware('throttle:admin:upload');
            Route::delete('/struktur/{id}', [AdminStrukturController::class, 'destroy'])
                ->middleware('throttle:admin:write');

            Route::get('/project', [AdminProjectController::class, 'index']);
            Route::post('/project', [AdminProjectController::class, 'store'])
                ->middleware('throttle:admin:upload');
            Route::put('/project/{id}', [AdminProjectController::class, 'update'])
                ->middleware('throttle:admin:upload');
            Route::delete('/project/{id}', [AdminProjectController::class, 'destroy'])
                ->middleware('throttle:admin:write');

            Route::get('/kontak', [AdminKontakController::class, 'index']);
            Route::post('/kontak', [AdminKontakController::class, 'store'])
                ->middleware('throttle:admin:write');
            Route::put('/kontak/{id}', [AdminKontakController::class, 'update'])
                ->middleware('throttle:admin:write');
            Route::delete('/kontak/{id}', [AdminKontakController::class, 'destroy'])
                ->middleware('throttle:admin:write');
        });
    });
