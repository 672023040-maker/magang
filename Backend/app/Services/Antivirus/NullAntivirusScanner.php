<?php

namespace App\Services\Antivirus;

use App\Contracts\AntivirusScanner;

/**
 * Scanner no-op untuk environment yang tidak memasang antivirus.
 * Jangan pernah mengklaim telah melakukan scanning.
 */
class NullAntivirusScanner implements AntivirusScanner
{
    public function scan(string $path): void
    {
        // deliberate no-op
    }
}
