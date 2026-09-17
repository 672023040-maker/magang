<?php

namespace App\Http\Requests;

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
        return [
            'nama' => ['required', 'string', 'max:255'],
            'jabatan' => ['required', 'string', 'max:255'],
            'foto' => ['nullable', 'image', 'max:2048'],
            'instagram' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'divisi' => ['nullable', 'array'],
            'divisi.*.nama_divisi' => ['required_with:divisi', 'string', 'max:255'],
            'divisi.*.deskripsi' => ['required_with:divisi', 'string'],
        ];
    }
}
