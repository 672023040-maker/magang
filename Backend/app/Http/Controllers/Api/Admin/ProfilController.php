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
        $data = $request->only([
            'visi',
            'misi',
            'tujuan',
            'visi_bulat',
            'misi_bulat',
            'tujuan_bulat',
        ]);

        // Baris tunggal (baca publik memakai `first()`), jadi jangan
        // meng-hardcode id=1 — pakai baris yang ada atau buat baru.
        $profil = Profil::first();

        if ($profil) {
            $profil->update($data);
        } else {
            $profil = Profil::create($data);
        }

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'data' => new ProfilResource($profil->refresh()),
        ]);
    }
}
