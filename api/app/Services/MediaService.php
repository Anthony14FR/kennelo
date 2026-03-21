<?php

declare(strict_types=1);

namespace App\Services;

use Spatie\MediaLibrary\Conversions\Conversion;
use Spatie\MediaLibrary\HasMedia;

class MediaService
{
    public const COLLECTION_AVATAR = 'avatar';

    public const COLLECTION_IMAGES = 'images';

    public const CONVERSION_WEBP = 'webp';

    public static function registerAvatarConversion(HasMedia $model): void
    {
        /** @var Conversion $conversion */
        $conversion = $model->addMediaConversion(self::CONVERSION_WEBP);
        $conversion->format('webp')->quality(82);
        $conversion->performOnCollections(self::COLLECTION_AVATAR)->nonQueued();
    }

    public static function registerImagesConversion(HasMedia $model): void
    {
        /** @var Conversion $conversion */
        $conversion = $model->addMediaConversion(self::CONVERSION_WEBP);
        $conversion->format('webp')->quality(82);
        $conversion->performOnCollections(self::COLLECTION_IMAGES)->nonQueued();
    }
}
