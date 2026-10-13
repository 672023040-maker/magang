<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class SafeExternalUrl implements ValidationRule
{
    /**
     * Batasi nilai ke URL web biasa (http/https) tanpa kredensial.
     *
     * Rule `url` bawaan Laravel memakai filter_var() yang masih meloloskan
     * payload seperti "javascript://%0Aalert(1)" (lihat catatan XSS di
     * ProjectRequest). Rule ini menutup celah tersebut agar nilainya aman
     * dipakai sebagai href.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (! is_string($value) || $value === '') {
            return;
        }

        $parts = parse_url($value);

        if ($parts === false || ! isset($parts['host']) || $parts['host'] === '') {
            $fail('Kolom :attribute harus berupa URL yang lengkap.');

            return;
        }

        if (! in_array(strtolower($parts['scheme'] ?? ''), ['http', 'https'], true)) {
            $fail('Kolom :attribute hanya boleh menggunakan http atau https.');

            return;
        }

        if (isset($parts['user']) || isset($parts['pass'])) {
            $fail('Kolom :attribute tidak boleh memuat kredensial (user:pass@).');
        }
    }
}
