<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;

Storage::fake('public');

// Test 1: simple string, no subdirectory
$result1 = Storage::disk('public')->put('test1.txt', 'hello');
echo "Test 1 (no subdir): put=" . ($result1 ? 'true' : 'false') . ", exists=" . (Storage::disk('public')->exists('test1.txt') ? 'true' : 'false') . "\n";

// Test 2: simple string, with subdirectory
$result2 = Storage::disk('public')->put('dokumentasi/test2.txt', 'hello');
echo "Test 2 (with subdir): put=" . ($result2 ? 'true' : 'false') . ", exists=" . (Storage::disk('public')->exists('dokumentasi/test2.txt') ? 'true' : 'false') . "\n";

// Test 3: binary content, no subdirectory
$binary = "\xFF\xD8\xFF\xE0\x00\x10JFIF\x00\x01\x01\x01\x00";
$result3 = Storage::disk('public')->put('test3.jpg', $binary);
echo "Test 3 (binary, no subdir): put=" . ($result3 ? 'true' : 'false') . ", exists=" . (Storage::disk('public')->exists('test3.jpg') ? 'true' : 'false') . "\n";

// Test 4: binary content, with subdirectory
$result4 = Storage::disk('public')->put('dokumentasi/test4.jpg', $binary);
echo "Test 4 (binary, with subdir): put=" . ($result4 ? 'true' : 'false') . ", exists=" . (Storage::disk('public')->exists('dokumentasi/test4.jpg') ? 'true' : 'false') . "\n";