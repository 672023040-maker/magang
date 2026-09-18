<?php

namespace App\Services\Security;

use Illuminate\Contracts\Cache\Repository;
use Illuminate\Support\Facades\Cache;

class LoginBruteForceService
{
    private Repository $cache;

    private SecurityLogger $logger;

    private array $config;

    public function __construct(SecurityLogger $logger)
    {
        $this->cache = Cache::store();
        $this->logger = $logger;
        $this->config = config('security.login');
    }

    public function isLocked(string $username, string $ip): bool
    {
        return $this->secondsToUnlock($username, $ip) > 0;
    }

    public function secondsToUnlock(string $username, string $ip): int
    {
        $lockedUntil = (int) $this->cache->get($this->lockKey($username, $ip), 0);

        return max(0, $lockedUntil - now()->getTimestamp());
    }

    /**
     * Catat kegagalan login dan naikkan progressive backoff.
     * Mengembalikan jumlah total percobaan yang telah tercatat.
     */
    public function registerFailure(string $username, string $ip, ?string $userAgent = null, ?int $userId = null): int
    {
        $attemptKey = $this->attemptKey($username, $ip);
        $count = ((int) $this->cache->get($attemptKey, 0)) + 1;
        $this->cache->put($attemptKey, $count, $this->cooldownFor($count) + 1);

        $cooldown = $this->cooldownFor($count);

        if ($cooldown > 0) {
            $this->cache->put($this->lockKey($username, $ip), now()->addMinutes($cooldown)->getTimestamp(), $cooldown + 1);
        }

        $attemptsWindow = max($this->config['max_attempts'], 1);
        $this->cache->put($this->attemptTimestampsKey($username, $ip), $count, $attemptsWindow);

        $this->logger->log('LOGIN_FAILED', request(), [
            'username' => $username,
            'attempts' => $count,
            'ip' => $ip,
        ], $userId);

        $this->detectMultiUsernamePerIp($username, $ip, $userAgent, $userId);
        $this->detectMultiIpPerUsername($username, $ip, $userAgent, $userId);

        return $count;
    }

    public function registerSuccess(string $username, string $ip): void
    {
        $this->cache->forget($this->attemptKey($username, $ip));
        $this->cache->forget($this->lockKey($username, $ip));
        $this->cache->forget($this->attemptTimestampsKey($username, $ip));
    }

    public function cooldownFor(int $count): int
    {
        $max = max((int) $this->config['max_attempts'], 1);

        if ($count < $max) {
            return 0;
        }

        if ($count < $max * 2) {
            return (int) $this->config['cooldown_short'];
        }

        if ($count < $max * 3) {
            return (int) $this->config['cooldown_medium'];
        }

        if ($count < $max * 4) {
            return (int) $this->config['cooldown_long'];
        }

        return (int) $this->config['cooldown_extended'];
    }

    private function detectMultiUsernamePerIp(string $username, string $ip, ?string $userAgent, ?int $userId): void
    {
        $key = 'security.login.usernames:'.md5($ip);
        $window = max((int) $this->config['username_probe_window'], 1);

        $usernames = $this->cache->get($key, []);
        $usernames[md5($username)] = true;
        $this->cache->put($key, $usernames, $window * 60);

        $flagKey = 'security.login.flag.usernames:'.md5($ip);
        $seen = $this->cache->get($flagKey, false);

        $limit = max((int) $this->config['max_usernames_per_ip'], 1);

        if (count($usernames) >= $limit && ! $seen) {
            $this->cache->put($flagKey, true, $window * 60);
            $this->logger->log('BRUTE_FORCE_DETECTED', request(), [
                'pattern' => 'many_usernames_one_ip',
                'ip' => $ip,
                'distinct_usernames' => count($usernames),
            ], $userId);
        }
    }

    private function detectMultiIpPerUsername(string $username, string $ip, ?string $userAgent, ?int $userId): void
    {
        $key = 'security.login.ips:'.md5($username);
        $window = max((int) $this->config['ip_probe_window'], 1);

        $ips = $this->cache->get($key, []);
        $ips[md5($ip)] = true;
        $this->cache->put($key, $ips, $window * 60);

        $flagKey = 'security.login.flag.ips:'.md5($username);
        $seen = $this->cache->get($flagKey, false);

        $limit = max((int) $this->config['max_ips_per_username'], 1);

        if (count($ips) >= $limit && ! $seen) {
            $this->cache->put($flagKey, true, $window * 60);
            $this->logger->log('BRUTE_FORCE_DETECTED', request(), [
                'pattern' => 'one_username_many_ips',
                'username' => $username,
                'distinct_ips' => count($ips),
            ], $userId);
        }
    }

    private function attemptKey(string $username, string $ip): string
    {
        return 'security.login.attempts:'.md5($ip.'|'.$username);
    }

    private function lockKey(string $username, string $ip): string
    {
        return 'security.login.lock_until:'.md5($ip.'|'.$username);
    }

    private function attemptTimestampsKey(string $username, string $ip): string
    {
        return 'security.login.timestamps:'.md5($ip.'|'.$username);
    }
}
