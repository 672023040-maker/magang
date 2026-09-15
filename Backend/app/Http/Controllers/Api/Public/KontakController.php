<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
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
}
