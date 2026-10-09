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

// Use reflection to call private reencode method
$reflection = new ReflectionClass($service);
$method = $reflection->getMethod('reencode');
$method->setAccessible(true);

try {
    $tempPath = $method->invoke($service, $file, 'jpg');
    echo "Reencode SUCCESS: $tempPath\n";
    echo "Temp file exists: " . (file_exists($tempPath) ? 'yes' : 'no') . "\n";
    if (file_exists($tempPath)) {
        echo "Temp file size: " . filesize($tempPath) . "\n";
        $content = file_get_contents($tempPath);
        echo "Temp content starts with: " . bin2hex(substr($content, 0, 4)) . "\n";
    }
} catch (\Throwable $e) {
    echo "Reencode ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}