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
            'tentang_kami' => $this->tentang_kami,
            'visi' => $this->visi,
            'misi' => $this->misi,
            'nilai' => $this->nilai,
        ];
    }
}
