<?php

use App\Http\Middleware\EnsureAdminRole;
use App\Http\Middleware\EnsurePasswordChanged;
use App\Http\Middleware\SecurityHeaders;
use App\Http\Middleware\TrackAdminSession;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->api(prepend: [
            EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->appendToGroup('api', SecurityHeaders::class);

        $middleware->alias([
            'ensure.admin' => EnsureAdminRole::class,
            'ensure.password.changed' => EnsurePasswordChanged::class,
            'track.session' => TrackAdminSession::class,
        ]);

        $middleware->redirectGuestsTo(function (Request $request) {
            if ($request->is('api/*')) {
                return null;
            }

            return route('login');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Unauthenticated.',
                ], 401);
            }
        });

        // Respons produksi generic — jangan pernah membocorkan stack trace,
        // SQL error, path server, atau konfigurasi internal. Exception yang
        // sudah ditangani framework (validation 422, http 4xx, dsb.) dibiarkan
        // menggunakan respons default.
        $exceptions->render(function (Throwable $e, Request $request) {
            if ($request->is('api/*') && ! app()->environment('local')) {
                if ($e instanceof ValidationException
                    || $e instanceof AuthenticationException
                    || $e instanceof AuthorizationException
                    || $e instanceof HttpExceptionInterface) {
                    return null;
                }

                report($e);

                return response()->json([
                    'message' => 'Terjadi kesalahan pada server.',
                ], 500);
            }
        });
    })->create();
