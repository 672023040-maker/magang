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

try {
    $path = $service->sanitizeAndStore($file, 'dokumentasi', 'public');
    echo "SUCCESS: $path\n";
    
    // Check if file actually exists despite put() returning false
    echo "Exists: " . (Storage::disk('public')->exists($path) ? 'yes' : 'no') . "\n";
    echo "Has: " . (Storage::disk('public')->has($path) ? 'yes' : 'no') . "\n";
    
    if (Storage::disk('public')->exists($path)) {
        $content = Storage::disk('public')->get($path);
        echo "Content length: " . strlen($content) . "\n";
        echo "Content starts with: " . bin2hex(substr($content, 0, 4)) . "\n";
    }
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    
    // Check if file was actually stored
    $lastPath = $e->getTrace()[0]['args'][0] ?? 'unknown';
    echo "Attempted path: $lastPath\n";
}