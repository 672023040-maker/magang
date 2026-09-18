<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user('admin') !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        $policy = config('security.password');

        $passwordRule = Password::min((int) $policy['min_length'])
            ->letters();

        if ($policy['require_uppercase']) {
            $passwordRule->mixedCase();
        }

        if ($policy['require_digit']) {
            $passwordRule->numbers();
        }

        if ($policy['require_symbol']) {
            $passwordRule->symbols();
        }

        return [
            'current_password' => ['required', 'current_password:admin'],
            'new_password' => ['required', 'confirmed', $passwordRule],
        ];
    }
}
