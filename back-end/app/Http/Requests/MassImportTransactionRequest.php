<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class MassImportTransactionRequest extends FormRequest
{
    const ERR_CODE = 'transactions';
    const ERR_MESSAGE_EMPTY = 'The transactions array must contain at least one item.';
    const ERR_MESSAGE_UNIQUE = 'All transactions must belong to the same account.';

    private array $data;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            '*.date' => 'required|date_format:d/m/Y',
            '*.type' => 'required|string|max:10',
            '*.description' => 'required|string|max:255',
            '*.value' => 'required|numeric',
            '*.balance' => 'required|numeric',
            '*.account_name' => 'required|string|max:100',
            '*.account_number' => 'required|string|max:20',
        ];
    }

    public function withValidator(Validator $validator)
    {
        $this->data = $this->input();
        $validator->after(fn ($val) => $this->customValidation($val));
    }

    private function customValidation($validator)
    {
        $this->validateSameAccount($validator);
        $this->validateNoEmptyArray($validator);
    }

    private function validateSameAccount(Validator $validator)
    {
        if (empty($this->data)) {
            return;
        }

        $mapFn = fn($tr) => $tr['account_name'] . '|' . $tr['account_number'];
        $accounts = array_map($mapFn, $this->data);
        $unique = array_unique($accounts);

        if (count($unique) > 1) {
            $validator->errors()->add(
                self::ERR_CODE,
                self::ERR_MESSAGE_UNIQUE
            );
        }
    }

    private function validateNoEmptyArray(Validator $validator)
    {
        if (empty($this->data)) {
            $validator->errors()->add(
                self::ERR_CODE,
                self::ERR_MESSAGE_EMPTY
            );
            return;
        }
    }

    public function messages(): array
    {
        return [
            '*.date.required' => "'date' is a required field",
            '*.type.required' => "'type' is a required field",
            '*.description.required' => "'description' is a required field",
            '*.value.required' => "'value' is a required field",
            '*.balance.required' => "'balance' is a required field",
            '*.account_name.required' => "'account_name' is a required field",
            '*.account_number.required' => "'account_number' is a required field",

            '*.value.numeric' => "'value' must be a number",
            '*.balance.numeric' => "'balance' must be a number",

            '*.type.max' => "'type' has a maximum of 10 characters",
            '*.description.max' => "'type' has a maximum of 255 characters",
            '*.account_name.max' => "'type' has a maximum of 100 characters",
            '*.account_number.max' => "'type' has a maximum of 20 characters",
        ];
    }
}
