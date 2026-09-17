<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StrukturRequest;
use App\Http\Resources\StrukturResource;
use App\Models\StrukturOrganisasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class StrukturController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return StrukturResource::collection(
            StrukturOrganisasi::with('divisi')->latest()->get()
        );
    }

    public function store(StrukturRequest $request): JsonResponse
    {
        $data = $request->only(['nama', 'jabatan', 'instagram', 'email']);

        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('struktur', 'public');
        }

        $struktur = StrukturOrganisasi::create($data);

        $this->syncDivisi($struktur, $request->input('divisi', []));

        return response()->json([
            'message' => 'Data struktur berhasil ditambahkan',
            'data' => new StrukturResource(
                $struktur->load('divisi')
            ),
        ], 201);
    }

    public function update(StrukturRequest $request, int $id): JsonResponse
    {
        $struktur = StrukturOrganisasi::findOrFail($id);

        $data = $request->only(['nama', 'jabatan', 'instagram', 'email']);

        if ($request->hasFile('foto')) {
            $data['foto'] = $request->file('foto')->store('struktur', 'public');
        }

        $struktur->update($data);

        $this->syncDivisi($struktur, $request->input('divisi', []));

        return response()->json([
            'message' => 'Data struktur berhasil diperbarui',
            'data' => new StrukturResource(
                $struktur->refresh()->load('divisi')
            ),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $struktur = StrukturOrganisasi::findOrFail($id);
        $struktur->delete();

        return response()->json([
            'message' => 'Data struktur berhasil dihapus',
        ]);
    }

    /**
     * @param  array<int, array{nama_divisi: string, deskripsi: string}>  $items
     */
    private function syncDivisi(StrukturOrganisasi $struktur, array $items): void
    {
        $struktur->divisi()->delete();

        foreach ($items as $item) {
            $struktur->divisi()->create([
                'nama_divisi' => $item['nama_divisi'],
                'deskripsi' => $item['deskripsi'],
            ]);
        }
    }
}
