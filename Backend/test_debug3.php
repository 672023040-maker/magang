<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use App\Services\Upload\SecureImageService;

Storage::fake('public');

// Create a simple JPEG
$img = imagecreatetruecolor(16, 16);
imagefilledrectangle($img, 0, 0, 15, 15, imagecolorallocate($img, 200, 30, 30));
ob_start();
imagejpeg($img, null, 85);
$jpegBytes = (string) ob_get_clean();
imagedestroy($img);

$file = UploadedFile::fake()->createWithContent('test.jpg', $jpegBytes);

$service = app(SecureImageService::class);

// Test reencode first
$reflection = new ReflectionClass($service);
$method = $reflection->getMethod('reencode');
$method->setAccessible(true);

try {
    $tempPath = $method->invoke($service, $file, 'jpg');
    echo "Reencode SUCCESS: $tempPath\n";
    
    // Now test the final put
    $content = (string) file_get_contents($tempPath);
    $filename = 'dokumentasi/' . \Illuminate\Support\Str::uuid()->toString() . '.jpg';
    
    echo "Attempting to store: $filename\n";
    Storage::disk('public')->put($filename, $content);
    echo "Put done\n";
    
    echo "Exists: " . (Storage::disk('public')->exists($filename) ? 'yes' : 'no') . "\n";
    echo "Has: " . (Storage::disk('public')->has($filename) ? 'yes' : 'no') . "\n";
    
    if (Storage::disk('public')->exists($filename)) {
        $storedContent = Storage::disk('public')->get($filename);
        echo "Stored content length: " . strlen($storedContent) . "\n";
    }
    
    @unlink($tempPath);
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}