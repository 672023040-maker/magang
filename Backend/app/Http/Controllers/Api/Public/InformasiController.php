<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\InformasiResource;
use App\Models\Informasi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class InformasiController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Informasi::query();

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->string('kategori'));
        }

        $informasi = $query->latest('tanggal')->get();

        return InformasiResource::collection($informasi);
    }

    public function show(int $id): JsonResponse
    {
        $informasi = Informasi::findOrFail($id);

        return response()->json([
            'data' => new InformasiResource($informasi),
        ]);
    }
}
