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
        $kontak = Kontak::first();

        $data = $request->only([
            'email',
            'jam_buka',
            'jam_tutup',
            'hari_operasional',
            'lokasi',
        ]);

        if ($kontak) {
            $kontak->update($data);
        } else {
            $kontak = Kontak::create($data);
        }

        return response()->json([
            'message' => 'Kontak berhasil disimpan',
            'data' => new KontakResource($kontak->refresh()),
        ], 201);
    }

    public function update(KontakRequest $request, int $id): JsonResponse
    {
        $kontak = Kontak::findOrFail($id);

        $data = $request->only([
            'email',
            'jam_buka',
            'jam_tutup',
            'hari_operasional',
            'lokasi',
        ]);

        $kontak->update($data);

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
