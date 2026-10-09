<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Schedule;

Schedule::command('sessions:cleanup-history --days=30')
    ->monthlyOn(17, '02:00')
    ->timezone('Asia/Jakarta')
    ->withoutOverlapping()
    ->runInBackground();

Schedule::command('digfin:backup')
    ->dailyAt('02:30')
    ->timezone('Asia/Jakarta')
    ->withoutOverlapping()
    ->runInBackground()
    ->onOneServer();

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');
