<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;

Storage::fake('public');

// Test makeDirectory
$disk = Storage::disk('public');
echo "Before makeDirectory: exists=" . ($disk->exists('dokumentasi') ? 'true' : 'false') . "\n";

$result = $disk->makeDirectory('dokumentasi');
echo "makeDirectory result: " . ($result ? 'true' : 'false') . "\n";

echo "After makeDirectory: exists=" . ($disk->exists('dokumentasi') ? 'true' : 'false') . "\n";

// Now try put
$result2 = $disk->put('dokumentasi/test.jpg', 'hello');
echo "put result: " . ($result2 ? 'true' : 'false') . "\n";
echo "exists after put: " . ($disk->exists('dokumentasi/test.jpg') ? 'true' : 'false') . "\n";