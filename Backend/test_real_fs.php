<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;

$disk = Storage::disk('public');
echo "Adapter: " . get_class($disk->getAdapter()) . "\n";

// Test put in existing directory
$result = $disk->put('dokumentasi/test.jpg', 'hello');
echo "Put result: " . ($result ? 'true' : 'false') . "\n";
echo "Exists: " . ($disk->exists('dokumentasi/test.jpg') ? 'true' : 'false') . "\n";

// Test put in non-existing directory
$result2 = $disk->put('struktur/test2.jpg', 'hello2');
echo "Put struktur result: " . ($result2 ? 'true' : 'false') . "\n";
echo "Exists struktur: " . ($disk->exists('struktur/test2.jpg') ? 'true' : 'false') . "\n";

// Check directory
echo "Dokumentasi exists: " . ($disk->exists('dokumentasi') ? 'true' : 'false') . "\n";
echo "Struktur exists: " . ($disk->exists('struktur') ? 'true' : 'false') . "\n";

// Try with makeDirectory first
$disk->makeDirectory('testdir');
$result3 = $disk->put('testdir/test3.jpg', 'hello3');
echo "Put with makeDirectory: " . ($result3 ? 'true' : 'false') . "\n";
echo "Exists: " . ($disk->exists('testdir/test3.jpg') ? 'true' : 'false') . "\n";