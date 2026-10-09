<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use App\Services\Upload\SecureImageService;

Storage::fake('public');

$result = Storage::disk('public')->put('direct_test.txt', 'hello');
var_dump('Direct put:', $result);

$img = imagecreatetruecolor(16, 16);
imagefilledrectangle($img, 0, 0, 15, 15, imagecolorallocate($img, 200, 30, 30));
ob_start();
imagejpeg($img, null, 85);
$jpegBytes = (string) ob_get_clean();
imagedestroy($img);

$file = UploadedFile::fake()->createWithContent('test.jpg', $jpegBytes);

echo "File size: " . $file->getSize() . "\n";
echo "File mime: " . $file->getMimeType() . "\n";
echo "File extension: " . $file->getClientOriginalExtension() . "\n";
echo "File real path: " . $file->getRealPath() . "\n";
echo "File exists: " . ($file->getRealPath() && file_exists($file->getRealPath()) ? 'yes' : 'no') . "\n";

$originalContent = (string) file_get_contents($file->getRealPath());
echo "Original content length: " . strlen($originalContent) . "\n";
echo "Original content starts with: " . bin2hex(substr($originalContent, 0, 4)) . "\n";

$result2 = Storage::disk('public')->put('test_original.jpg', $originalContent);
var_dump('Put original content:', $result2);

echo "About to call sanitizeAndStore...\n";

$service = app(SecureImageService::class);

try {
    $path = $service->sanitizeAndStore($file, 'dokumentasi', 'public');
    echo "SUCCESS: $path\n";
    var_dump(Storage::disk('public')->exists($path));
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}