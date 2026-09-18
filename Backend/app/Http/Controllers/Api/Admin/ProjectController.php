<?php

namespace App\Http\Controllers\Api\Admin;

use App\Exceptions\UploadRejectedException;
use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use App\Services\Security\SecurityLogger;
use App\Services\Upload\SecureImageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    public function __construct(
        private readonly SecureImageService $images,
        private readonly SecurityLogger $logger,
    ) {}

    public function index(): AnonymousResourceCollection
    {
        return ProjectResource::collection(
            Project::with('dokumentasi')->latest()->get()
        );
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        $project = Project::create($request->only([
            'nama_project',
            'deskripsi',
            'status',
            'tgl_dibuat',
        ]));

        try {
            $this->syncDokumentasi($project, $request->input('dokumentasi', []), $request);
        } catch (UploadRejectedException $e) {
            $project->delete();

            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Project berhasil ditambahkan',
            'data' => new ProjectResource(
                $project->load('dokumentasi')
            ),
        ], 201);
    }

    public function update(ProjectRequest $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);

        $project->update($request->only([
            'nama_project',
            'deskripsi',
            'status',
            'tgl_dibuat',
        ]));

        try {
            $this->syncCover($project, $request);
        } catch (UploadRejectedException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Project berhasil diperbarui',
            'data' => new ProjectResource(
                $project->refresh()->load('dokumentasi')
            ),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $project = Project::findOrFail($id);

        foreach ($project->dokumentasi()->pluck('file_gambar') as $path) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
        }

        $project->delete();

        $this->logger->log('PROJECT_DELETED', request(), ['project_id' => $id]);

        return response()->json([
            'message' => 'Project berhasil dihapus',
        ]);
    }

    /**
     * Sinkronkan gambar sampul. Jika ada file baru, dokumentasi dibuat ulang.
     * Jika tidak ada file baru, sampul lama dipertahankan dan hanya keterangan
     * yang diperbarui bila diisi.
     */
    private function syncCover(Project $project, ProjectRequest $request): void
    {
        $files = $request->file('dokumentasi', []);

        if (isset($files[0]['file_gambar']) && $files[0]['file_gambar'] instanceof UploadedFile) {
            $this->syncDokumentasi($project, $request->input('dokumentasi', []), $request);

            return;
        }

        $keterangan = $request->input('dokumentasi.0.keterangan');

        if ($keterangan !== null) {
            $project->dokumentasi()->first()?->update(['keterangan' => $keterangan]);
        }
    }

    /**
     * @param  array<int, array{file_gambar: mixed, keterangan?: string|null}>  $items
     */
    private function syncDokumentasi(Project $project, array $items, $request): void
    {
        // Hapus file fisik lama sebelum membuang record.
        foreach ($project->dokumentasi()->pluck('file_gambar') as $path) {
            if ($path) {
                Storage::disk('public')->delete($path);
            }
        }

        $project->dokumentasi()->delete();

        $createdPaths = [];

        try {
            // File multipart tinggal di file bag (bukan input), jadi ambil dari
            // $request->file() dan samakan urutannya dengan keterangan dari input.
            $files = $request->file('dokumentasi', []);

            foreach ($files as $index => $fileGroup) {
                $file = $fileGroup['file_gambar'] ?? null;

                if (! $file instanceof UploadedFile) {
                    continue;
                }

                try {
                    $storedPath = $this->images->sanitizeAndStore($file, 'dokumentasi', 'public');
                } catch (UploadRejectedException $e) {
                    $this->logger->log('UPLOAD_REJECTED', $request, [
                        'resource' => 'project_dokumentasi',
                        'reason' => $e->getMessage(),
                    ]);

                    throw $e;
                }

                $createdPaths[] = $storedPath;

                $this->logger->log('UPLOAD_SUCCESS', $request, [
                    'resource' => 'project_dokumentasi',
                    'stored' => $storedPath,
                ]);

                $project->dokumentasi()->create([
                    'file_gambar' => $storedPath,
                    'keterangan' => $items[$index]['keterangan'] ?? null,
                ]);
            }
        } catch (UploadRejectedException $e) {
            foreach (array_unique($createdPaths) as $path) {
                Storage::disk('public')->delete($path);
            }
            $project->dokumentasi()->delete();

            throw $e;
        }
    }
}
