<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\PesanKontakResource;
use App\Models\PesanKontak;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class PesanKontakController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return PesanKontakResource::collection(
            PesanKontak::latest()->get()
        );
    }

    public function show(int $id): JsonResponse
    {
        $pesan = PesanKontak::findOrFail($id);

        return response()->json([
            'data' => new PesanKontakResource($pesan),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        PesanKontak::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Pesan berhasil dihapus',
        ]);
    }
}
