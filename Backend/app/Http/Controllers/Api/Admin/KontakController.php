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
        $kontak = Kontak::with('sosialMedia')->first();

        return response()->json([
            'data' => $kontak ? new KontakResource($kontak) : null,
        ]);
    }

    public function store(KontakRequest $request): JsonResponse
    {
        $kontak = Kontak::create($request->only(['email', 'phone', 'alamat']));

        $this->syncSosialMedia($kontak, $request->input('sosial_media', []));

        return response()->json([
            'message' => 'Kontak berhasil disimpan',
            'data' => new KontakResource(
                $kontak->load('sosialMedia')
            ),
        ], 201);
    }

    public function update(KontakRequest $request, int $id): JsonResponse
    {
        $kontak = Kontak::findOrFail($id);

        $kontak->update($request->only(['email', 'phone', 'alamat']));

        $this->syncSosialMedia($kontak, $request->input('sosial_media', []));

        return response()->json([
            'message' => 'Kontak berhasil diperbarui',
            'data' => new KontakResource(
                $kontak->refresh()->load('sosialMedia')
            ),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Kontak::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Kontak berhasil dihapus',
        ]);
    }

    /**
     * @param  array<int, array{platform: string, url: string}>  $items
     */
    private function syncSosialMedia(Kontak $kontak, array $items): void
    {
        $kontak->sosialMedia()->delete();

        foreach ($items as $item) {
            $kontak->sosialMedia()->create([
                'platform' => $item['platform'],
                'url' => $item['url'],
            ]);
        }
    }
}
