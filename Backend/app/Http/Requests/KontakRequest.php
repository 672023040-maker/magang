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
            'phone' => ['required', 'string', 'max:30'],
            'alamat' => ['required', 'string'],
            'sosial_media' => ['nullable', 'array'],
            'sosial_media.*.platform' => ['required_with:sosial_media', 'string', 'max:50'],
            'sosial_media.*.url' => ['required_with:sosial_media', 'url', 'max:255'],
        ];
    }
}
