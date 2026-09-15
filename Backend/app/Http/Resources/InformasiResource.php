<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InformasiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'judul' => $this->judul,
            'kategori' => $this->kategori,
            'isi' => $this->isi,
            'gambar_url' => $this->gambar
                ? url('storage/'.$this->gambar)
                : null,
            'tanggal' => $this->tanggal?->toDateString(),
        ];
    }
}
