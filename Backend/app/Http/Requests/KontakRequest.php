<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class KontakRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'email', 'max:255'],
            'jam_buka' => ['nullable', 'string', 'max:10'],
            'jam_tutup' => ['nullable', 'string', 'max:10'],
            'hari_operasional' => ['nullable', 'string', 'max:50'],
            'lokasi' => ['nullable', 'string', 'max:1000'],
        ];
    }
}
