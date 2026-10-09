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

// Manually step through reencode
$format = 'jpg';
$tempPath = tempnam(sys_get_temp_dir(), 'digfin_img');

echo "Temp path: $tempPath\n";

$source = @imagecreatefromjpeg($file->getRealPath());
if ($source === false) {
    $error = error_get_last();
    echo "Step 1 - imagecreatefromjpeg failed: " . ($error['message'] ?? 'unknown') . "\n";
    exit;
}
echo "Step 1 - imagecreatefromjpeg OK\n";

$width = imagesx($source);
$height = imagesy($source);
echo "Dimensions: ${width}x${height}\n";

$canvas = imagecreatetruecolor($width, $height);
if ($canvas === false) {
    echo "Step 2 - imagecreatetruecolor failed\n";
    imagedestroy($source);
    exit;
}
echo "Step 2 - imagecreatetruecolor OK\n";

imagecopyresampled($canvas, $source, 0, 0, 0, 0, $width, $height, $width, $height);
echo "Step 3 - imagecopyresampled OK\n";

$quality = 85;
$result = imagejpeg($canvas, $tempPath, $quality);
if (!$result) {
    $error = error_get_last();
    echo "Step 4 - imagejpeg failed: " . ($error['message'] ?? 'unknown') . "\n";
    imagedestroy($canvas);
    imagedestroy($source);
    exit;
}
echo "Step 4 - imagejpeg OK\n";

imagedestroy($canvas);
imagedestroy($source);

echo "Step 5 - verifying temp file\n";
$content = (string) file_get_contents($tempPath);
if ($content === '') {
    echo "Content is empty!\n";
    exit;
}
echo "Content length: " . strlen($content) . "\n";
echo "Content starts with: " . bin2hex(substr($content, 0, 4)) . "\n";

// Check magic bytes
$hasJpegSig = str_starts_with($content, "\xFF\xD8\xFF");
echo "Has JPEG signature: " . ($hasJpegSig ? 'yes' : 'no') . "\n";

if ($content === '' || !$hasJpegSig) {
    echo "Validation FAILED - would throw exception\n";
} else {
    echo "Validation PASSED\n";
}

if (file_exists($tempPath)) {
    @unlink($tempPath);
}