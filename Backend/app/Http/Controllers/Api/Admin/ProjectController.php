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
use Illuminate\Support\Facades\DB;
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
            Project::with('dokumentasi', 'author')->latest()->get()
        );
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        $attributes = $request->only([
            'nama_project',
            'deskripsi',
            'status',
            'tgl_dibuat',
            'author_id',
        ]);

        // Simpan file terlebih dahulu. Bila ada yang ditolak, request gagal
        // sebelum project sempat dibuat (tidak ada state setengah jadi).
        try {
            $paths = $this->storeAllFiles($request);
        } catch (UploadRejectedException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        try {
            $project = DB::transaction(function () use ($attributes, $paths): Project {
                $project = Project::create($attributes);

                foreach ($paths as $path) {
                    $project->dokumentasi()->create(['file_gambar' => $path]);
                }

                return $project;
            });
        } catch (\Throwable $e) {
            $this->deletePaths($paths);

            throw $e;
        }

        return response()->json([
            'message' => 'Project berhasil ditambahkan',
            'data' => new ProjectResource(
                $project->load('dokumentasi', 'author')
            ),
        ], 201);
    }

    public function update(ProjectRequest $request, int $id): JsonResponse
    {
        $project = Project::findOrFail($id);
        $attributes = $request->only([
            'nama_project',
            'deskripsi',
            'status',
            'tgl_dibuat',
            'author_id',
        ]);

        // File baru dijajal & disimpan ke disk dulu. Kalau ada yang ditolak,
        // kembali 422 tanpa mengubah DB satupun (aturan lama tetap utuh).
        try {
            $paths = $this->storeAllFiles($request);
        } catch (UploadRejectedException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        $oldPaths = [];

        try {
            DB::transaction(function () use ($project, $attributes, $paths, &$oldPaths): void {
                $project->update($attributes);

                // Tanpa file baru, dokumentasi lama dibiarkan apa adanya.
                if ($paths === []) {
                    return;
                }

                $oldPaths = $project->dokumentasi()
                    ->pluck('file_gambar')
                    ->filter()
                    ->all();

                $project->dokumentasi()->delete();

                foreach ($paths as $path) {
                    $project->dokumentasi()->create(['file_gambar' => $path]);
                }
            });
        } catch (\Throwable $e) {
            $this->deletePaths($paths);

            throw $e;
        }

        // Transaksi sukses — baru hapus file fisik yang digantikan.
        $this->deletePaths($oldPaths);

        return response()->json([
            'message' => 'Project berhasil diperbarui',
            'data' => new ProjectResource(
                $project->refresh()->load('dokumentasi', 'author')
            ),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $project = Project::findOrFail($id);

        $oldPaths = $project->dokumentasi()->pluck('file_gambar')->filter()->all();

        $project->delete();

        $this->deletePaths($oldPaths);

        $this->logger->log('PROJECT_DELETED', request(), ['project_id' => $id]);

        return response()->json([
            'message' => 'Project berhasil dihapus',
        ]);
    }

    /**
     * Simpan semua file dokumentasi ke disk. Bila salah satu ditolak, seluruh
     * file yang sudah tersimpan dibersihkan lalu UploadRejectedException dilepas.
     *
     * @return list<string>
     */
    private function storeAllFiles(ProjectRequest $request): array
    {
        $paths = [];

        foreach ($this->filesFromRequest($request) as $file) {
            try {
                $storedPath = $this->images->sanitizeAndStore($file, 'dokumentasi', 'public');
            } catch (UploadRejectedException $e) {
                $this->deletePaths($paths);

                $this->logger->log('UPLOAD_REJECTED', $request, [
                    'resource' => 'project_dokumentasi',
                    'reason' => $e->getMessage(),
                ]);

                throw $e;
            }

            $paths[] = $storedPath;

            $this->logger->log('UPLOAD_SUCCESS', $request, [
                'resource' => 'project_dokumentasi',
                'stored' => $storedPath,
            ]);
        }

        return $paths;
    }

    /**
     * @return list<UploadedFile>
     */
    private function filesFromRequest(ProjectRequest $request): array
    {
        $files = [];

        foreach ($request->file('dokumentasi', []) as $fileGroup) {
            $file = $fileGroup['file_gambar'] ?? null;

            if ($file instanceof UploadedFile) {
                $files[] = $file;
            }
        }

        return $files;
    }

    /**
     * @param list<string|null> $paths
     */
    private function deletePaths(array $paths): void
    {
        $disk = Storage::disk('public');

        foreach (array_unique(array_filter($paths)) as $path) {
            $disk->delete($path);
        }
    }
}