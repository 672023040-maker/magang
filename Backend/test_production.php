<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use App\Services\Upload\SecureImageService;

// Use real filesystem (not fake)
$disk = Storage::disk('public');
echo "Using real filesystem\n";
echo "Adapter: " . get_class($disk->getAdapter()) . "\n";

// Create directories
$disk->makeDirectory('dokumentasi');
$disk->makeDirectory('struktur');

// Create a simple JPEG (simulating a real upload)
$img = imagecreatetruecolor(100, 100);
imagefilledrectangle($img, 0, 0, 99, 99, imagecolorallocate($img, 200, 30, 30));
ob_start();
imagejpeg($img, null, 85);
$jpegBytes = (string) ob_get_clean();
imagedestroy($img);

// Create UploadedFile from real temp file
$tempFile = tempnam(sys_get_temp_dir(), 'upload_');
file_put_contents($tempFile, $jpegBytes);
$file = new UploadedFile($tempFile, 'test.jpg', 'image/jpeg', null, true);

$service = app(SecureImageService::class);

try {
    $path = $service->sanitizeAndStore($file, 'dokumentasi', 'public');
    echo "SUCCESS: $path\n";
    echo "Exists: " . ($disk->exists($path) ? 'true' : 'false') . "\n";
    
    // Verify file content
    $content = $disk->get($path);
    echo "Content length: " . strlen($content) . "\n";
    echo "Content starts with: " . bin2hex(substr($content, 0, 4)) . "\n";
    
    // Test with PNG
    $img2 = imagecreatetruecolor(100, 100);
    imagealphablending($img2, false);
    imagesavealpha($img2, true);
    imagefill($img2, 0, 0, imagecolorallocatealpha($img2, 0, 0, 0, 127));
    imagefilledrectangle($img2, 10, 10, 90, 90, imagecolorallocate($img2, 40, 120, 60));
    ob_start();
    imagepng($img2);
    $pngBytes = (string) ob_get_clean();
    imagedestroy($img2);
    
    $tempFile2 = tempnam(sys_get_temp_dir(), 'upload_');
    file_put_contents($tempFile2, $pngBytes);
    $file2 = new UploadedFile($tempFile2, 'test.png', 'image/png', null, true);
    
    $path2 = $service->sanitizeAndStore($file2, 'struktur', 'public');
    echo "\nPNG SUCCESS: $path2\n";
    echo "Exists: " . ($disk->exists($path2) ? 'true' : 'false') . "\n";
    
    $content2 = $disk->get($path2);
    echo "Content length: " . strlen($content2) . "\n";
    echo "Content starts with: " . bin2hex(substr($content2, 0, 8)) . "\n";
    
    // Cleanup
    @unlink($tempFile);
    @unlink($tempFile2);
    
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}