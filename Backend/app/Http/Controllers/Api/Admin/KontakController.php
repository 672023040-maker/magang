<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\KontakRequest;
use App\Http\Resources\KontakResource;
use App\Models\Kontak;
use Illuminate\Http\JsonResponse;

class KontakController extends Controller
{
    public function index(): JsonResponse
    {
        $kontak = Kontak::first();

        return response()->json([
            'data' => $kontak ? new KontakResource($kontak) : null,
        ]);
    }

    public function store(KontakRequest $request): JsonResponse
    {
        // Kontak adalah data singleton (baca publik memakai `first()`).
        // Simpan selalu ke satu baris yang sama, jangan menumpuk baris baru.
        $kontak = Kontak::first();

        if ($kontak) {
            $kontak->update($request->only(['email']));
        } else {
            $kontak = Kontak::create($request->only(['email']));
        }

        return response()->json([
            'message' => 'Kontak berhasil disimpan',
            'data' => new KontakResource($kontak->refresh()),
        ], 201);
    }

    public function update(KontakRequest $request, int $id): JsonResponse
    {
        $kontak = Kontak::findOrFail($id);

        $kontak->update($request->only(['email']));

        return response()->json([
            'message' => 'Kontak berhasil diperbarui',
            'data' => new KontakResource($kontak->refresh()),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Kontak::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Kontak berhasil dihapus',
        ]);
    }
}
