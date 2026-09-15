<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProfilResource;
use App\Models\Profil;
use Illuminate\Http\JsonResponse;

class ProfilController extends Controller
{
    public function index(): JsonResponse
    {
        $profil = Profil::first();

        return response()->json([
            'data' => $profil ? new ProfilResource($profil) : null,
        ]);
    }
}
