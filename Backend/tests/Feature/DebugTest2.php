<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Storage;
use Illuminate\Filesystem\FilesystemAdapter;
use League\Flysystem\InMemory\InMemoryAdapter;
use League\Flysystem\Filesystem;
use Illuminate\Http\UploadedFile;
use App\Services\Upload\SecureImageService;
use Tests\TestCase;

class DebugTest2 extends TestCase
{
    public function test_debug_upload_manual_fake(): void
    {
        // Manually create a fake disk
        $fakeAdapter = new InMemoryAdapter();
        $fakeFilesystem = new Filesystem($fakeAdapter);
        $fakeDisk = new FilesystemAdapter($fakeFilesystem, $fakeAdapter, 'public');
        
        // Replace the 'public' disk in the filesystem manager
        $manager = $this->app->make('filesystem');
        $manager->forgetInstance('public');
        $manager->extend('public', function () use ($fakeDisk) {
            return $fakeDisk;
        });
        
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
            
            // Check fake adapter contents
            $reflection = new \ReflectionClass($fakeAdapter);
            $property = $reflection->getProperty('files');
            $property->setAccessible(true);
            $files = $property->getValue($fakeAdapter);
            echo "Files in fake adapter:\n";
            print_r($files);
        } catch (\Throwable $e) {
            echo "ERROR: " . $e->getMessage() . "\n";
            echo "Line: " . $e->getLine() . "\n";
            echo "Trace: " . $e->getTraceAsString() . "\n";
        }
        
        $this->assertTrue(true);
    }
}