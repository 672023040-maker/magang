<?php

require_once __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Storage;

Storage::fake('public');

$result = Storage::disk('public')->put('test.txt', 'hello');
var_dump($result);

$exists = Storage::disk('public')->exists('test.txt');
var_dump($exists);

$content = Storage::disk('public')->get('test.txt');
var_dump($content);