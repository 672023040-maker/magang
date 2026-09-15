<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PesanKontakResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_pengirim' => $this->nama_pengirim,
            'email' => $this->email,
            'subjek' => $this->subjek,
            'pesan' => $this->pesan,
            'tanggal' => $this->tanggal?->toDateTimeString(),
        ];
    }
}
