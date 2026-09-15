<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\InformasiRequest;
use App\Http\Resources\InformasiResource;
use App\Models\Informasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class InformasiController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return InformasiResource::collection(
            Informasi::latest('tanggal')->get()
        );
    }

    public function store(InformasiRequest $request): JsonResponse
    {
        $data = $request->only(['judul', 'kategori', 'isi', 'tanggal']);

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('informasi', 'public');
        }

        $informasi = Informasi::create($data);

        return response()->json([
            'message' => 'Informasi berhasil ditambahkan',
            'data' => new InformasiResource($informasi),
        ], 201);
    }

    public function update(InformasiRequest $request, int $id): JsonResponse
    {
        $informasi = Informasi::findOrFail($id);

        $data = $request->only(['judul', 'kategori', 'isi', 'tanggal']);

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('informasi', 'public');
        }

        $informasi->update($data);

        return response()->json([
            'message' => 'Informasi berhasil diperbarui',
            'data' => new InformasiResource($informasi->refresh()),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Informasi::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Informasi berhasil dihapus',
        ]);
    }
}
