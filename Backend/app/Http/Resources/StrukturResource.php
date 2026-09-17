<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StrukturResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'jabatan' => $this->jabatan,
            'instagram' => $this->instagram,
            'email' => $this->email,
            'foto_url' => $this->foto
                ? url('storage/'.$this->foto)
                : null,
            'divisi' => DivisiResource::collection($this->whenLoaded('divisi')),
        ];
    }
}
