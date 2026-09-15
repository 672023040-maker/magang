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
            'tgl_mulai' => $this->tgl_mulai?->toDateString(),
            'tgl_selesai' => $this->tgl_selesai?->toDateString(),
            'dokumentasi' => DokumentasiResource::collection($this->whenLoaded('dokumentasi')),
        ];
    }
}
