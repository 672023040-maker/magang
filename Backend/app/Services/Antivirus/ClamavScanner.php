<?php

namespace App\Services\Antivirus;

use App\Contracts\AntivirusScanner;
use App\Exceptions\VirusDetectedException;
use Symfony\Component\Process\Process;

/**
 * Scanner ClamAV native binary (clamscan/clamdscan).
 * Hanya aktif ketika config('security.antivirus.enabled') true.
 */
class ClamavScanner implements AntivirusScanner
{
    public function scan(string $path): void
    {
        $binary = (string) config('security.antivirus.binary', 'clamscan');
        $timeout = (int) config('security.antivirus.timeout', 60);

        $process = new Process([$binary, '--quiet', '--no-summary', $path]);
        $process->setTimeout($timeout);
        $process->run();

        if (! $process->isSuccessful()) {
            throw new VirusDetectedException('File mengandung pola malware / gagal discan antivirus.');
        }
    }
}
