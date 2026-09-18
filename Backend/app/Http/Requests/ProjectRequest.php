<?php

namespace App\Http\Requests;

use App\Rules\SecureJpeg;
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
        $maxSize = (int) config('security.upload.max_size');
        $maxFiles = (int) config('security.upload.max_files_per_request');

        return [
            'nama_project' => ['required', 'string', 'max:255'],
            'deskripsi' => ['required', 'string'],
            'status' => ['required', 'in:berjalan,selesai'],
            'tgl_dibuat' => ['nullable', 'date'],
            'dokumentasi' => ['nullable', 'array', 'max:'.$maxFiles],
            'dokumentasi.*.file_gambar' => ['required_with:dokumentasi', 'file', 'mimes:jpg,jpeg', 'max:'.$maxSize, new SecureJpeg],
            'dokumentasi.*.keterangan' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'dokumentasi' => 'dokumentasi',
            'dokumentasi.*.file_gambar' => 'gambar sampul',
        ];
    }
}
