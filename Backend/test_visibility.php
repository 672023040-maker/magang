<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

Storage::fake('public');

$img = imagecreatetruecolor(16, 16);
imagefilledrectangle($img, 0, 0, 15, 15, imagecolorallocate($img, 200, 30, 30));
ob_start();
imagejpeg($img, null, 85);
$jpegBytes = (string) ob_get_clean();
imagedestroy($img);

$file = UploadedFile::fake()->createWithContent('test.jpg', $jpegBytes);
$originalContent = (string) file_get_contents($file->getRealPath());

// Test with visibility option
$result1 = Storage::disk('public')->put('test1.jpg', $originalContent);
var_dump('Put without visibility:', $result1);

$result2 = Storage::disk('public')->put('test2.jpg', $originalContent, ['visibility' => 'public']);
var_dump('Put with visibility:', $result2);

$result3 = Storage::disk('public')->put('dokumentasi/test3.jpg', $originalContent, ['visibility' => 'public']);
var_dump('Put with visibility and subdir:', $result3);