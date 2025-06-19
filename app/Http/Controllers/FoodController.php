<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Requests\FoodFormRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class FoodController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $foods = Food::latest()->paginate(10); // Ganti 10 sesuai jumlah per halaman yang diinginkan
        return Inertia::render('Foods/index', [
            'foods' => $foods
        ]);
        // $foods = Food::all();
        // return Inertia::render('Foods/index', compact('foods'));
        // return Inertia::render('Foods/index', []);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Foods/create');
    }

    /**
     * Store a newly created resource in storage.
     * @param FoodFormRequest $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        $request->validate([
            'thumbnail' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
        ], [
            'thumbnail.required' => 'Foto makanan wajib diunggah.',
            'thumbnail.image' => 'File harus berupa gambar.',
            'thumbnail.mimes' => 'Format file harus jpeg, png, atau jpg.',
            'thumbnail.max' => 'Ukuran maksimal file 2MB.',
        ]);

        $path = null;

        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('foods', 'public');
        }

        Food::create([
            'thumbnail' => $path ? '/storage/' . $path : null,
            'name' => $request->name,
            'price' => $request->price,
        ]);

        // Food::create($request->all());
        return redirect()->route('foods.index')->with(['message' => 'Menu berhasil ditambahkan.']);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        // $food = Food::find($id);
        // dd($food);

        $food = Food::findOrFail($id); // akan throw 404 kalau tidak ada
        // Hapus file jika ada
        if ($food->thumbnail && Storage::disk('public')->exists(str_replace('/storage/', '', $food->thumbnail))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $food->thumbnail));
        }
        $food->delete();

        return redirect()->back()->with('message', 'Menu berhasil dihapus.');
    }
}
