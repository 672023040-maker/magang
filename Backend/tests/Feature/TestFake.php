<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class TestFake extends TestCase
{
    public function test_fake_works(): void
    {
        Storage::fake('public');
        
        $disk = Storage::disk('public');
        echo "Disk class: " . get_class($disk) . "\n";
        echo "Adapter class: " . get_class($disk->getAdapter()) . "\n";
        
        $result = $disk->put('test.txt', 'hello');
        echo "Put result: " . ($result ? 'true' : 'false') . "\n";
        echo "Exists: " . ($disk->exists('test.txt') ? 'true' : 'false') . "\n";
        
        $result2 = $disk->put('dokumentasi/test2.txt', 'hello2');
        echo "Put subdir result: " . ($result2 ? 'true' : 'false') . "\n";
        echo "Exists subdir: " . ($disk->exists('dokumentasi/test2.txt') ? 'true' : 'false') . "\n";
        echo "Dir exists: " . ($disk->exists('dokumentasi') ? 'true' : 'false') . "\n";
        
        $this->assertTrue(true);
    }
}