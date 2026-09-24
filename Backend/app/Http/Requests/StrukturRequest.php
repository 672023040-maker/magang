<?php

namespace App\Http\Requests;

use App\Rules\SecureImage;
use Illuminate\Foundation\Http\FormRequest;

class StrukturRequest extends FormRequest
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
        $maxSize = (int) config('security.upload.max_size');

        return [
            'nama' => ['required', 'string', 'max:255'],
            'jabatan' => ['required', 'string', 'max:255'],
            'foto' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:'.$maxSize, new SecureImage],
            'email' => ['nullable', 'email', 'max:255'],
        ];
    }

    public function attributes(): array
    {
        return [
            'foto' => 'foto',
        ];
    }
}