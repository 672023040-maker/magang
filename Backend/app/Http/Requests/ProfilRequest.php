<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProfilRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, string>
     */
    public function rules(): array
    {
        return [
            'visi' => ['required', 'string'],
            'misi' => ['required', 'string'],
            'tujuan' => ['required', 'string'],
            'visi_bulat' => ['sometimes', 'boolean'],
            'misi_bulat' => ['sometimes', 'boolean'],
            'tujuan_bulat' => ['sometimes', 'boolean'],
        ];
    }
}
