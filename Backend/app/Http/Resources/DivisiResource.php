<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DivisiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'struktur_organisasi_id' => $this->struktur_organisasi_id,
            'nama_divisi' => $this->nama_divisi,
            'deskripsi' => $this->deskripsi,
        ];
    }
}
