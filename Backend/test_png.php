<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use App\Services\Upload\SecureImageService;

$disk = Storage::disk('public');
$disk->makeDirectory('struktur');

// Create PNG
$img = imagecreatetruecolor(100, 100);
imagealphablending($img, false);
imagesavealpha($img, true);
imagefill($img, 0, 0, imagecolorallocatealpha($img, 0, 0, 0, 127));
imagefilledrectangle($img, 10, 10, 90, 90, imagecolorallocate($img, 40, 120, 60));
ob_start();
imagepng($img);
$pngBytes = (string) ob_get_clean();
imagedestroy($img);

$tempFile = tempnam(sys_get_temp_dir(), 'upload_');
file_put_contents($tempFile, $pngBytes);
$file = new UploadedFile($tempFile, 'test.png', 'image/png', null, true);

$service = app(SecureImageService::class);

// Test reencode directly
$reflection = new ReflectionClass($service);
$method = $reflection->getMethod('reencode');
$method->setAccessible(true);

try {
    $tempPath = $method->invoke($service, $file, 'png');
    echo "Reencode SUCCESS: $tempPath\n";
    
    $content = file_get_contents($tempPath);
    echo "Content length: " . strlen($content) . "\n";
    echo "Content starts with: " . bin2hex(substr($content, 0, 8)) . "\n";
    
    // Now test put
    $storedPath = 'struktur/' . \Illuminate\Support\Str::uuid()->toString() . '.png';
    $result = $disk->put($storedPath, $content);
    echo "Put result: " . ($result ? 'true' : 'false') . "\n";
    echo "Exists: " . ($disk->exists($storedPath) ? 'true' : 'false') . "\n";
    
    @unlink($tempPath);
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}

@unlink($tempFile);