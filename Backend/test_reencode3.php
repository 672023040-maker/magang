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

// Check config values
echo "jpeg_quality config: " . config('security.upload.jpeg_quality', 85) . "\n";
echo "png_compression config: " . config('security.upload.png_compression', 6) . "\n";

// Use reflection to call private reencode method with debugging
$reflection = new ReflectionClass($service);
$method = $reflection->getMethod('reencode');
$method->setAccessible(true);

// Let's trace the actual reencode method by copying its logic
$format = 'jpg';
$previousMemory = ini_get('memory_limit');
@ini_set('memory_limit', '512M');
echo "Memory limit before: $previousMemory, after: " . ini_get('memory_limit') . "\n";

$tempPath = tempnam(sys_get_temp_dir(), 'digfin_img');
echo "Temp path: $tempPath\n";

try {
    $source = $format === 'png'
        ? @imagecreatefrompng($file->getRealPath())
        : @imagecreatefromjpeg($file->getRealPath());
    if ($source === false) {
        $gdError = error_get_last()['message'] ?? 'unknown';
        echo "SOURCE FAILED: $gdError\n";
        throw new Exception("Source failed: $gdError");
    }
    echo "Source OK\n";

    $width = imagesx($source);
    $height = imagesy($source);
    echo "Dimensions: ${width}x${height}\n";

    $canvas = imagecreatetruecolor($width, $height);
    if ($canvas === false) {
        imagedestroy($source);
        echo "CANVAS FAILED\n";
        throw new Exception("Canvas failed");
    }
    echo "Canvas OK\n";

    if ($format === 'png') {
        imagealphablending($canvas, false);
        imagesavealpha($canvas, true);
    }

    imagecopyresampled($canvas, $source, 0, 0, 0, 0, $width, $height, $width, $height);
    echo "Copy resampled OK\n";

    if ($format === 'png') {
        $compression = max(0, min(9, (int) config('security.upload.png_compression', 6)));
        echo "PNG compression: $compression\n";
        if (! imagepng($canvas, $tempPath, $compression)) {
            $gdError = error_get_last()['message'] ?? 'unknown';
            echo "PNG SAVE FAILED: $gdError\n";
            throw new Exception("PNG save failed: $gdError");
        }
    } else {
        $quality = max(1, min(100, (int) config('security.upload.jpeg_quality', 85)));
        echo "JPEG quality: $quality\n";
        if (! imagejpeg($canvas, $tempPath, $quality)) {
            $gdError = error_get_last()['message'] ?? 'unknown';
            echo "JPEG SAVE FAILED: $gdError\n";
            throw new Exception("JPEG save failed: $gdError");
        }
    }
    echo "Save OK\n";

    imagedestroy($canvas);
    imagedestroy($source);

    // Verify the re-encoded file is valid
    $content = (string) file_get_contents($tempPath);
    echo "Content length: " . strlen($content) . "\n";
    echo "Content starts with: " . bin2hex(substr($content, 0, 4)) . "\n";

    $hasMagicBytes = $format === 'png'
        ? str_starts_with($content, "\x89PNG\r\n\x1a\n")
        : str_starts_with($content, "\xFF\xD8\xFF");
    echo "Has magic bytes: " . ($hasMagicBytes ? 'yes' : 'no') . "\n";

    if ($content === '' || !$hasMagicBytes) {
        echo "VALIDATION FAILED - would throw exception\n";
        throw new Exception("Validation failed");
    }

    echo "SUCCESS!\n";

} catch (Exception $e) {
    echo "CAUGHT: " . $e->getMessage() . "\n";
} finally {
    if ($previousMemory !== false) {
        @ini_set('memory_limit', $previousMemory);
    }
    if (is_file($tempPath)) {
        @unlink($tempPath);
    }
}