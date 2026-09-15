<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProfilRequest;
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

    public function update(ProfilRequest $request): JsonResponse
    {
        $profil = Profil::updateOrCreate(['id' => 1], $request->only([
            'tentang_kami',
            'visi',
            'misi',
            'nilai',
        ]));

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'data' => new ProfilResource($profil),
        ]);
    }
}
