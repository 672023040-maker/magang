<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\StrukturResource;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StrukturController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $struktur = StrukturOrganisasi::with('divisi')->get();

        return StrukturResource::collection($struktur);
    }
}
