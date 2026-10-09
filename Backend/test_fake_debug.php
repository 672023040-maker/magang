<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;

Storage::fake('public');

$disk = Storage::disk('public');

// Get the underlying adapter
$adapter = $disk->getAdapter();
echo "Adapter class: " . get_class($adapter) . "\n";

// Try put with full path
$result = $disk->put('dokumentasi/test.jpg', 'hello');
echo "put result: " . ($result ? 'true' : 'false') . "\n";

// Check what's in the adapter
$reflection = new ReflectionClass($adapter);
$property = $reflection->getProperty('files');
$property->setAccessible(true);
$files = $property->getValue($adapter);
echo "Files in adapter:\n";
print_r($files);

// Try put without subdirectory
$result2 = $disk->put('test2.jpg', 'hello2');
echo "\nput test2.jpg result: " . ($result2 ? 'true' : 'false') . "\n";
$files2 = $property->getValue($adapter);
echo "Files in adapter after test2.jpg:\n";
print_r($files2);