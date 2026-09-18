<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\UploadedFile;

class ProjectController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return ProjectResource::collection(
            Project::with('dokumentasi')->latest()->get()
        );
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        $data = $request->only([
            'nama_project',
            'deskripsi',
            'status',
            'tgl_dibuat',
        ]);

        $project = Project::create($data);

        $this->syncDokumentasi($project, $request->input('dokumentasi', []));

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

        $data = $request->only([
            'nama_project',
            'deskripsi',
            'status',
            'tgl_dibuat',
        ]);

        $project->update($data);

        $this->syncCover($project, $request);

        return response()->json([
            'message' => 'Project berhasil diperbarui',
            'data' => new ProjectResource(
                $project->refresh()->load('dokumentasi')
            ),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        Project::findOrFail($id)->delete();

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
            $this->syncDokumentasi($project, $request->input('dokumentasi', []));

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
    private function syncDokumentasi(Project $project, array $items): void
    {
        $project->dokumentasi()->delete();

        foreach ($items as $item) {
            $file = $item['file_gambar'] ?? null;

            if (! $file instanceof UploadedFile) {
                continue;
            }

            $project->dokumentasi()->create([
                'file_gambar' => $file->store('dokumentasi', 'public'),
                'keterangan' => $item['keterangan'] ?? null,
            ]);
        }
    }
}
