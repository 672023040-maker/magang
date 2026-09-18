<?php

namespace App\Contracts;

use App\Exceptions\VirusDetectedException;

interface AntivirusScanner
{
    /**
     * Scan satu file untuk malware.
     *
     * @throws VirusDetectedException bila terdeteksi mencurigakan.
     */
    public function scan(string $path): void;
}
