<?php

namespace App\Http\Requests;

use App\Rules\SecureImage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            // Nullable: kolom project.author_id nullable dan sebagian project lama
            // belum punya author. mewajibkan author membuat form tidak bisa
            // mengedit project tersebut, jadi author hanya divalidasi bila dikirim.
            'author_id' => ['nullable', 'integer', Rule::exists('struktur_organisasi', 'id')],
            'deskripsi' => ['required', 'string'],
            'status' => ['required', 'in:publish,unpublish'],
            'tgl_dibuat' => ['nullable', 'date'],
            'dokumentasi' => ['nullable', 'array', 'max:'.$maxFiles],
            'dokumentasi.*.file_gambar' => ['nullable', 'file', 'mimes:jpg,jpeg,png', 'max:'.$maxSize, new SecureImage],
        ];
    }

    public function attributes(): array
    {
        return [
            'author_id' => 'author',
            'dokumentasi' => 'dokumentasi',
            'dokumentasi.*.file_gambar' => 'gambar sampul',
        ];
    }
}
