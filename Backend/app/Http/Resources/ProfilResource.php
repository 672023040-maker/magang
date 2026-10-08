<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProfilResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'visi' => $this->visi,
            'misi' => $this->misi,
            'tujuan' => $this->tujuan,
            'visi_bulat' => (bool) $this->visi_bulat,
            'misi_bulat' => (bool) $this->misi_bulat,
            'tujuan_bulat' => (bool) $this->tujuan_bulat,
        ];
    }
}
