<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
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
            'nama_project' => ['required', 'string', 'max:255'],
            'deskripsi' => ['required', 'string'],
            'status' => ['required', 'in:berjalan,selesai'],
            'tgl_mulai' => ['nullable', 'date'],
            'tgl_selesai' => ['nullable', 'date'],
            'dokumentasi' => ['nullable', 'array'],
            'dokumentasi.*.file_gambar' => ['required_with:dokumentasi', 'image', 'max:2048'],
            'dokumentasi.*.keterangan' => ['nullable', 'string'],
        ];
    }
}
