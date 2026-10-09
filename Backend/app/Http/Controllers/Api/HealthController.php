<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Throwable;

/**
 * Readiness probe: memverifikasi dependensi yang wajib hidup agar aplikasi
 * bisa melayani request. Mengembalikan 503 bila ada komponen gagal sehingga
 * orkestrator (Docker/uptime monitor) bisa menindaklanjuti.
 *
 * Sengaja hanya membalas boolean per komponen — TANPA pesan error, host, atau
 * path — agar tidak membocorkan detail internal ke endpoint publik.
 */
class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $checks = [
            'database' => $this->check(fn (): bool => (bool) DB::select('SELECT 1')),
            'cache' => $this->check(function (): bool {
                $key = 'health:'.uniqid('', true);
                Cache::put($key, 'ok', 5);
                $value = Cache::get($key);
                Cache::forget($key);

                return $value === 'ok';
            }),
            'storage' => $this->check(function (): bool {
                $path = 'health/'.uniqid('probe_', true).'.txt';
                Storage::disk('local')->put($path, 'ok');
                $ok = Storage::disk('local')->get($path) === 'ok';
                Storage::disk('local')->delete($path);

                return $ok;
            }),
        ];

        $healthy = ! in_array(false, $checks, true);

        return response()->json([
            'status' => $healthy ? 'ok' : 'degraded',
            'checks' => $checks,
            'timestamp' => now()->toIso8601String(),
        ], $healthy ? 200 : 503);
    }

    private function check(callable $probe): bool
    {
        try {
            return $probe();
        } catch (Throwable $e) {
            report($e);

            return false;
        }
    }
}
