<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;

Storage::fake('public');

// Try putting directly with subdirectory
$disk = Storage::disk('public');
echo "Before put: exists dokumentasi = " . ($disk->exists('dokumentasi') ? 'true' : 'false') . "\n";

$result = $disk->put('dokumentasi/test.jpg', 'hello');
echo "put result: " . ($result ? 'true' : 'false') . "\n";

echo "After put: exists dokumentasi = " . ($disk->exists('dokumentasi') ? 'true' : 'false') . "\n";
echo "After put: exists file = " . ($disk->exists('dokumentasi/test.jpg') ? 'true' : 'false') . "\n";

// Try listing
$files = $disk->files('dokumentasi');
echo "Files in dokumentasi: " . count($files) . "\n";
print_r($files);