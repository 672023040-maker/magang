<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exceptions\UploadRejectedException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StrukturRequest;
use App\Http\Resources\StrukturResource;
use App\Models\StrukturOrganisasi;
use App\Services\Security\SecurityLogger;
use App\Services\Upload\SecureImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class StrukturController extends Controller
{
    public function __construct(
        private readonly SecureImageService $images,
        private readonly SecurityLogger $logger,
    ) {}

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
            try {
                $data['foto'] = $this->storeFoto($request);
            } catch (UploadRejectedException $e) {
                return response()->json(['message' => $e->getMessage()], 422);
            }
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
            try {
                $data['foto'] = $this->storeFoto($request);
            } catch (UploadRejectedException $e) {
                return response()->json(['message' => $e->getMessage()], 422);
            }

            if ($struktur->foto) {
                Storage::disk('public')->delete($struktur->foto);
            }
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

        if ($struktur->foto) {
            Storage::disk('public')->delete($struktur->foto);
        }

        $struktur->delete();

        return response()->json([
            'message' => 'Data struktur berhasil dihapus',
        ]);
    }

    private function storeFoto(StrukturRequest $request): string
    {
        try {
            $path = $this->images->sanitizeAndStore($request->file('foto'), 'struktur', 'public');
        } catch (UploadRejectedException $e) {
            $this->logger->log('UPLOAD_REJECTED', $request, [
                'resource' => 'struktur_foto',
                'reason' => $e->getMessage(),
            ]);

            throw $e;
        }

        $this->logger->log('UPLOAD_SUCCESS', $request, [
            'resource' => 'struktur_foto',
            'stored' => $path,
        ]);

        return $path;
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
