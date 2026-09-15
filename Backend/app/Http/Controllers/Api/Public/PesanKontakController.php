<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\PesanKontakRequest;
use App\Http\Resources\PesanKontakResource;
use App\Models\PesanKontak;
use Illuminate\Http\JsonResponse;

class PesanKontakController extends Controller
{
    public function store(PesanKontakRequest $request): JsonResponse
    {
        $pesan = PesanKontak::create([
            'nama_pengirim' => $request->nama_pengirim,
            'email' => $request->email,
            'subjek' => $request->subjek,
            'pesan' => $request->pesan,
            'tanggal' => now(),
        ]);

        return response()->json([
            'message' => 'Pesan berhasil dikirim',
            'data' => new PesanKontakResource($pesan),
        ], 201);
    }
}
