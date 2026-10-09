<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Http\UploadedFile;

// Create a simple JPEG
$img = imagecreatetruecolor(16, 16);
imagefilledrectangle($img, 0, 0, 15, 15, imagecolorallocate($img, 200, 30, 30));
ob_start();
imagejpeg($img, null, 85);
$jpegBytes = (string) ob_get_clean();
imagedestroy($img);

$file = UploadedFile::fake()->createWithContent('test.jpg', $jpegBytes);

echo "File real path: " . $file->getRealPath() . "\n";
echo "File exists: " . (file_exists($file->getRealPath()) ? 'yes' : 'no') . "\n";
echo "File size: " . filesize($file->getRealPath()) . "\n";

// Try to read with GD
$source = @imagecreatefromjpeg($file->getRealPath());
if ($source === false) {
    $error = error_get_last();
    echo "GD Error: " . ($error['message'] ?? 'unknown') . "\n";
} else {
    echo "GD Success! Width: " . imagesx($source) . ", Height: " . imagesy($source) . "\n";
    imagedestroy($source);
}

// Try reading content directly
$content = file_get_contents($file->getRealPath());
echo "Content length: " . strlen($content) . "\n";
echo "Content starts with: " . bin2hex(substr($content, 0, 4)) . "\n";

// Try creating from string using imagecreatefromstring
$source2 = @imagecreatefromstring($content);
if ($source2 === false) {
    $error = error_get_last();
    echo "GD from string Error: " . ($error['message'] ?? 'unknown') . "\n";
} else {
    echo "GD from string Success! Width: " . imagesx($source2) . ", Height: " . imagesy($source2) . "\n";
    imagedestroy($source2);
}