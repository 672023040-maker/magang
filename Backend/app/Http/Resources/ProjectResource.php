<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_project' => $this->nama_project,
            'deskripsi' => $this->deskripsi,
            'status' => $this->status,
            'tgl_dibuat' => $this->tgl_dibuat?->toDateString(),
            'dokumentasi' => DokumentasiResource::collection($this->whenLoaded('dokumentasi')),
        ];
    }
}
