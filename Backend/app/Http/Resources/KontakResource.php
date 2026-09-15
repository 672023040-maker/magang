<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class KontakResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'phone' => $this->phone,
            'alamat' => $this->alamat,
            'sosial_media' => SosialMediaResource::collection($this->whenLoaded('sosialMedia')),
        ];
    }
}
