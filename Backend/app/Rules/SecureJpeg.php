<?php

namespace App\Rules;

use App\Exceptions\UploadRejectedException;
use App\Services\Upload\SecureImageService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Http\UploadedFile;

class SecureJpeg implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! $value instanceof UploadedFile) {
            $fail('File tidak valid.');

            return;
        }

        try {
            app(SecureImageService::class)->validateOnly($value);
        } catch (UploadRejectedException $e) {
            $fail($e->getMessage());
        }
    }
}
