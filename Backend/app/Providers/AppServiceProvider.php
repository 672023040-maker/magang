<?php

namespace App\Providers;

use App\Contracts\AntivirusScanner;
use App\Services\Antivirus\ClamavScanner;
use App\Services\Antivirus\NullAntivirusScanner;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(AntivirusScanner::class, function () {
            $enabled = (bool) config('security.antivirus.enabled', false);

            return $enabled ? new ClamavScanner : new NullAntivirusScanner;
        });
    }

    public function boot(): void
    {
        $limits = (array) config('security.rate_limits');

        RateLimiter::for('auth:login', function (Request $request) use ($limits) {
            return Limit::perMinute((int) ($limits['login_per_minute'] ?? 10))
                ->by($request->ip() ?: 'unknown');
        });

        RateLimiter::for('auth:sensitive', function (Request $request) use ($limits) {
            return Limit::perMinute((int) ($limits['sensitive_per_minute'] ?? 5))
                ->by($request->user('admin')?->id ?? ($request->ip() ?: 'unknown'));
        });

        RateLimiter::for('admin:upload', function (Request $request) use ($limits) {
            return Limit::perMinute((int) ($limits['upload_per_minute'] ?? 10))
                ->by($request->user('admin')?->id ?? ($request->ip() ?: 'unknown'));
        });

        RateLimiter::for('admin:write', function (Request $request) use ($limits) {
            return Limit::perMinute((int) ($limits['write_per_minute'] ?? 30))
                ->by($request->user('admin')?->id ?? ($request->ip() ?: 'unknown'));
        });
    }
}
