<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FoodFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'harga' => 'required|numeric|min:0'
        ];
    }

    /**
     * Function: messages
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'nama.required' => 'Tolong masukkan nama makanan.',
            'nama.string' => 'Nama makanan harus string.',
            'nama.max' => 'Nama makanan tidak boleh lebih dari 255 karakter.',
            'foto.image' => 'Gambar harus mempunyai format file image.',
            'foto.mimes' => 'Gambar harus mempunyai format file tipe: jpeg, png, jpg.',
            'foto.max' => 'Gambar tidak boleh lebih dari 2048 KB.',
            'harga.required' => 'Tolong masukkan harga makanan.',
            'harga.numeric' => 'Harap memasukkan angka.',
            'harga.min' => 'Harga makanan tidak boleh kurang dari 0.'
        ];
    }
}
