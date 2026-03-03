<?php

declare(strict_types=1);

namespace App\Services\User\Exceptions;

use Exception;

class InvalidCurrentPasswordException extends Exception
{
    public static function wrongPassword(): self
    {
        return new self('Current password is incorrect');
    }
}
