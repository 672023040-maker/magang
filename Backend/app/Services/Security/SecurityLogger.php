<?php

namespace App\Services\Security;

use App\Models\SecurityEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SecurityLogger
{
    /**
     * Catat event keamanan ke tabel security_events + storage/logs/security.log.
     *
     * Tidak pernah menuliskan password, token session, atau secret API.
     */
    public function log(string $eventType, Request $request, array $details = [], ?int $userId = null): void
    {
        $ip = $request->ip();
        $userAgent = mb_substr((string) $request->userAgent(), 0, 500);

        $safeDetails = $this->sanitizeDetails($details);

        $event = [
            'event_type' => $eventType,
            'user_id' => $userId,
            'ip_address' => $ip,
            'user_agent' => $userAgent,
            'details' => empty($safeDetails) ? null : $safeDetails,
            'created_at' => now(),
        ];

        try {
            SecurityEvent::query()->create($event);
        } catch (\Throwable $e) {
            // Jangan biarkan kegagalan logging menggagalkan request utama.
            Log::channel('security')->warning('security_event_db_write_failed', [
                'event_type' => $eventType,
                'error' => $e->getMessage(),
            ]);
        }

        Log::channel('security')->info($eventType, [
            'user_id' => $userId,
            'ip' => $ip,
            'user_agent' => $userAgent,
            'details' => $safeDetails,
            'timestamp' => now()->toDateTimeString(),
        ]);
    }

    /**
     * @param  array<mixed>  $details
     * @return array<mixed>
     */
    private function sanitizeDetails(array $details): array
    {
        $blocked = ['password', 'token', 'secret', 'authorization', 'cookie'];

        $sanitize = function (mixed $value, string $key = '') use (&$sanitize, $blocked): mixed {
            if ($value === null) {
                return null;
            }

            if (is_array($value)) {
                $result = [];
                foreach ($value as $k => $v) {
                    $result[(string) $k] = $sanitize($v, (string) $k);
                }

                return $result;
            }

            foreach ($blocked as $needle) {
                if ($key !== '' && stripos($key, $needle) !== false) {
                    return '[REDACTED]';
                }
            }

            return $value;
        };

        return $sanitize($details);
    }
}
