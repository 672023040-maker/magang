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
            'tgl_mulai',
            'tgl_selesai',
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
            'tgl_mulai',
            'tgl_selesai',
        ]);

        $project->update($data);

        $this->syncDokumentasi($project, $request->input('dokumentasi', []));

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
