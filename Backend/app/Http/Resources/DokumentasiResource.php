<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DokumentasiResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'file_gambar_url' => $this->file_gambar
                ? url('storage/'.$this->file_gambar)
                : null,
            'keterangan' => $this->keterangan,
        ];
    }
}
