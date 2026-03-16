<?php

declare(strict_types=1);

namespace App\Services;

use App\Services\User\Exceptions\AvatarUploadException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Spatie\Image\Drivers\Gd\GdDriver;
use Spatie\Image\Image;

class ImageService
{
    public function storeAsWebP(UploadedFile $file, string $folder, int $quality = 82): string
    {
        $filename = Str::uuid()->toString().'.webp';
        $relativePath = $folder.'/'.$filename;
        $absolutePath = Storage::disk('public')->path($relativePath);

        if (! is_dir(dirname($absolutePath))) {
            mkdir(dirname($absolutePath), 0755, true);
        }

        try {
            Image::useImageDriver(GdDriver::class)
                ->loadFile($file->getRealPath())
                ->quality($quality)
                ->save($absolutePath);
        } catch (\Throwable $e) {
            throw AvatarUploadException::storageError($e->getMessage());
        }

        if (! file_exists($absolutePath)) {
            throw AvatarUploadException::storageError('WebP file was not written to disk');
        }

        return $relativePath;
    }
}
