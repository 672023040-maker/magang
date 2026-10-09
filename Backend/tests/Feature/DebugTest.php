<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use App\Services\Upload\SecureImageService;
use Tests\TestCase;

class DebugTest extends TestCase
{
    public function test_debug_upload(): void
    {
        Storage::fake('public');
        
        $disk = Storage::disk('public');
        echo "Disk class: " . get_class($disk) . "\n";
        echo "Adapter class: " . get_class($disk->getAdapter()) . "\n";
        
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
            echo "Exists after: " . ($disk->exists($path) ? 'true' : 'false') . "\n";
            
            // Check actual filesystem
            $realPath = storage_path('app/public/' . $path);
            echo "Real path: $realPath\n";
            echo "Real exists: " . (file_exists($realPath) ? 'true' : 'false') . "\n";
        } catch (\Throwable $e) {
            echo "ERROR: " . $e->getMessage() . "\n";
            echo "Line: " . $e->getLine() . "\n";
        }
        
        $this->assertTrue(true);
    }
}