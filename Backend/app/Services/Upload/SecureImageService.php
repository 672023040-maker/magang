<?php

namespace App\Services\Upload;

use App\Contracts\AntivirusScanner;
use App\Exceptions\UploadRejectedException;
use App\Exceptions\VirusDetectedException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

/**
 * Pipeline penyimpanan gambar yang sangat ketat (JPEG only).
 *
 * Seluruh perintah "JANGAN percaya frontend" diterapkan di sini:
 * - extension hanya .jpg/.jpeg
 * - MIME harus image/jpeg (finfo, bukan value dari browser)
 * - magic bytes JPEG harus ada
 * - gambar harus benar-benar bisa didecode imagecreatefromjpeg
 * - ukuran & dimensi dibatasi
 * - ditulis ulang (re-encode) untuk membuang metadata/payload asing
 * - nama file random UUID, bukan nama original
 */
class SecureImageService
{
    public function __construct(
        private readonly AntivirusScanner $scanner,
    ) {}

    private const DANGEROUS_EXTENSIONS = [
        'php', 'php3', 'php4', 'php5', 'php7', 'php8', 'phtml', 'phar',
        'pl', 'py', 'cgi', 'sh', 'asp', 'aspx', 'jsp', 'exe', 'bat', 'cmd',
        'htaccess', 'html', 'htm', 'shtml', 'svg', 'svgz',
    ];

    /**
     * Jalankan seluruh validasi (tanpa menyimpan) sebagai "rule" backend.
     *
     * @throws UploadRejectedException
     */
    public function validateOnly(UploadedFile $file): void
    {
        $this->assertAllowedExtension($file);
        $this->assertSafeFilename($file);
        $this->assertAllowedMime($file);
        $this->assertJpegMagicBytes($file);
        $this->assertSizeLimit($file);
        $this->decodeDimensions($file);
    }

    /**
     * Proses penuh: validasi -> antisudah -> re-encode -> simpan.
     *
     * @return string path relatif di disk tujuan (mis. "dokumentasi/xxxx.jpg")
     *
     * @throws UploadRejectedException
     */
    public function sanitizeAndStore(UploadedFile $file, string $directory, string $disk = 'public'): string
    {
        // 1-4. Validasi berlapis (sumber kebenaran : server, bukan React).
        $this->assertAllowedExtension($file);
        $this->assertSafeFilename($file);
        $this->assertAllowedMime($file);
        $this->assertJpegMagicBytes($file);
        $this->assertSizeLimit($file);

        // 5. Antivirus (optional, nonaktif default).
        $this->scanFile($file);

        // 6. Dekode & validasi dimensi.
        $dimensions = $this->decodeDimensions($file);

        // 7-8. Re-encode gambar baru + buang metadata/payload.
        $tempPath = $this->reencodeJpeg($file);

        try {
            $content = (string) file_get_contents($tempPath);
            if ($content === '' || ! $this->hasJpegMagicBytesFromString($content)) {
                throw new UploadRejectedException('Hasil pemrosesan gambar tidak valid.');
            }

            $filename = Str::uuid()->toString().'.jpg';
            $storedPath = $directory.'/'.$filename;

            if (! Storage::disk($disk)->put($storedPath, $content, ['visibility' => 'public'])) {
                throw new UploadRejectedException('Gagal menyimpan gambar.');
            }

            return $storedPath;
        } finally {
            if (is_file($tempPath)) {
                @unlink($tempPath);
            }
        }
    }

    private function assertAllowedExtension(UploadedFile $file): void
    {
        $ext = strtolower((string) $file->getClientOriginalExtension());
        $allowed = (array) config('security.upload.allowed_extensions', ['jpg', 'jpeg']);

        if (! in_array($ext, $allowed, true)) {
            throw new UploadRejectedException('Hanya file gambar JPG/JPEG yang diperbolehkan.');
        }
    }

    private function assertAllowedMime(UploadedFile $file): void
    {
        $allowed = (array) config('security.upload.allowed_mimes', ['image/jpeg']);
        $mime = strtolower((string) $file->getMimeType());

        if (! in_array($mime, $allowed, true)) {
            throw new UploadRejectedException('Tipe file tidak sesuai (harus image/jpeg).');
        }
    }

    private function assertJpegMagicBytes(UploadedFile $file): void
    {
        $handle = fopen($file->getRealPath(), 'rb');
        if ($handle === false) {
            throw new UploadRejectedException('Gambar tidak dapat dibaca.');
        }

        $header = (string) fread($handle, 3);
        fclose($handle);

        if (! $this->isJpegSignature($header)) {
            throw new UploadRejectedException('Struktur file bukan JPEG yang valid.');
        }
    }

    private function assertSizeLimit(UploadedFile $file): void
    {
        $maxBytes = max((int) config('security.upload.max_size'), 1) * 1024;

        if ($file->getSize() > $maxBytes) {
            throw new UploadRejectedException('Ukuran gambar melebihi batas maksimum.');
        }
    }

    /**
     * @return array{width: int, height: int, detected_type: int}
     *
     * @throws UploadRejectedException
     */
    private function decodeDimensions(UploadedFile $file): array
    {
        $imageInfo = @getimagesize($file->getRealPath());

        if ($imageInfo === false) {
            throw new UploadRejectedException('Gambar tidak dapat dibaca sebagai image.');
        }

        [$width, $height] = $imageInfo;
        $detectedType = $imageInfo[2] ?? IMAGETYPE_UNKNOWN;

        if ($detectedType !== IMAGETYPE_JPEG) {
            throw new UploadRejectedException('Format internal gambar bukan JPEG.');
        }

        $maxWidth = (int) config('security.upload.max_width');
        $maxHeight = (int) config('security.upload.max_height');

        if ($width <= 0 || $height <= 0 || $width > $maxWidth || $height > $maxHeight) {
            throw new UploadRejectedException('Dimensi gambar melebihi batas yang diizinkan.');
        }

        // Pastikan struktur JPEG benar-benar dapat didecode (bukan header palsu).
        $image = @imagecreatefromjpeg($file->getRealPath());
        if ($image === false) {
            throw new UploadRejectedException('Gambar rusak / tidak dapat diproses.');
        }
        imagedestroy($image);

        return ['width' => $width, 'height' => $height, 'detected_type' => $detectedType];
    }

    /**
     * Re-encode JPEG baru, membuang seluruh metadata (EXIF, comment,
     * thumbnail, payload tambahan dari file asli).
     *
     * @return string path temp hasil re-encode
     *
     * @throws UploadRejectedException
     */
    private function reencodeJpeg(UploadedFile $file): string
    {
        $previousMemory = ini_get('memory_limit');
        @ini_set('memory_limit', '512M');

        $tempPath = tempnam(sys_get_temp_dir(), 'digfin_img');

        try {
            $source = @imagecreatefromjpeg($file->getRealPath());
            if ($source === false) {
                throw new UploadRejectedException('Gambar tidak dapat diproses.');
            }

            $width = imagesx($source);
            $height = imagesy($source);

            $canvas = imagecreatetruecolor($width, $height);
            if ($canvas === false) {
                imagedestroy($source);
                throw new UploadRejectedException('Gagal memproses gambar.');
            }

            imagecopyresampled($canvas, $source, 0, 0, 0, 0, $width, $height, $width, $height);

            $quality = max(1, min(100, (int) config('security.upload.jpeg_quality', 85)));

            if (! imagejpeg($canvas, $tempPath, $quality)) {
                throw new UploadRejectedException('Gagal menulis ulang gambar.');
            }

            imagedestroy($canvas);
            imagedestroy($source);

            return $tempPath;
        } catch (UploadRejectedException $e) {
            if (is_file($tempPath)) {
                @unlink($tempPath);
            }

            throw $e;
        } finally {
            if ($previousMemory !== false) {
                @ini_set('memory_limit', $previousMemory);
            }
        }
    }

    private function scanFile(UploadedFile $file): void
    {
        if (! (bool) config('security.antivirus.enabled', false)) {
            return;
        }

        try {
            $this->scanner->scan($file->getRealPath());
        } catch (VirusDetectedException $e) {
            throw new UploadRejectedException($e->getMessage());
        }
    }

    private function assertSafeFilename(UploadedFile $file): void
    {
        $original = (string) $file->getClientOriginalName();

        if ($original === '' || str_contains($original, "\0")) {
            throw new UploadRejectedException('Nama file tidak valid.');
        }

        $basename = basename($original);
        if ($basename !== $original) {
            throw new UploadRejectedException('Nama file tidak valid.');
        }

        $segments = explode('.', $basename);

        // Cegah ekstensi berbahaya di segmen lain (image.php.jpg / image.jpg.php).
        foreach ($segments as $segment) {
            if (in_array(strtolower($segment), self::DANGEROUS_EXTENSIONS, true)) {
                throw new UploadRejectedException('Nama file tidak diizinkan.');
            }
        }
    }

    private function isJpegSignature(string $bytes): bool
    {
        return str_starts_with($bytes, "\xFF\xD8\xFF");
    }

    private function hasJpegMagicBytesFromString(string $content): bool
    {
        return $this->isJpegSignature(mb_substr($content, 0, 3));
    }
}
