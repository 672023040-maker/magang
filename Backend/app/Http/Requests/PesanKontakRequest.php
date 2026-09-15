<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PesanKontakRequest extends FormRequest
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
            'nama_pengirim' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'subjek' => ['required', 'string', 'max:255'],
            'pesan' => ['required', 'string'],
        ];
    }
}
