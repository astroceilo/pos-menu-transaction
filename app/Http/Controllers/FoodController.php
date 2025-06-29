<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
     * generateUniqueSlug for slug unique set at database
     */
    private function generateUniqueSlug($name, $excludeId = null)
    {
        $slug = Str::slug($name);
        $originalSlug = $slug;
        $i = 1;

        // Loop untuk mencari slug unik
        while (
            Food::where('slug', $slug)
                ->when($excludeId, fn ($query) => $query->where('id', '!=', $excludeId))
                ->exists()
        ) {
            $slug = $originalSlug . '-' . $i;
            $i++;
        }

        return $slug;
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
            'name' => 'required|string|max:255|unique:foods,name',
            // 'name' => [
            //     'required',
            //     'string',
            //     'max:255',
            //     Rule::unique('foods')->where(fn ($query) =>
            //         $query->whereRaw('LOWER(name) = ?', [strtolower($request->name)])
            //     ),
            // ],
            'price' => 'required|numeric',
        ], [
            'thumbnail.required' => 'Foto makanan wajib diunggah.',
            'thumbnail.image' => 'File harus berupa gambar.',
            'thumbnail.mimes' => 'Format file harus jpeg, png, atau jpg.',
            'thumbnail.max' => 'Ukuran maksimal file 2MB.',
            'name.unique' => 'Nama menu sudah digunakan.',
        ]);

         // Cek manual apakah nama makanan sudah ada (case-insensitive)
        $existing = Food::whereRaw('LOWER(name) = ?', [strtolower($request->name)])->exists();
        if ($existing) {
            return back()->withErrors(['name' => 'Nama menu sudah digunakan.'])->withInput();
        }

        // Lanjut buat path thumbnail
        $path = null;
        if ($request->hasFile('thumbnail')) {
            $path = $request->file('thumbnail')->store('foods', 'public');
        }

        // Simpan data dengan slug
        Food::create([
            'thumbnail' => $path ? '/storage/' . $path : null,
            'name' => Str::title($request->name),
            'slug' => $this->generateUniqueSlug($request->name),
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
    public function edit(string $slug)
    {
        $foods = Food::where('slug', $slug)->firstOrFail();

        return Inertia::render('Foods/edit', [
            'foods' => $foods,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'thumbnail' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            // 'name' => 'required|string|max:255|unique:foods,name' . $id,
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('foods')->ignore($id),
            ],
            'price' => 'required|numeric',
        ], [
            'thumbnail.required' => 'Foto makanan wajib diunggah.',
            'thumbnail.image' => 'File harus berupa gambar.',
            'thumbnail.mimes' => 'Format file harus jpeg, png, atau jpg.',
            'thumbnail.max' => 'Ukuran maksimal file 2MB.',
            'name.unique' => 'Nama menu sudah digunakan.',
        ]);

        // Cek manual nama duplikat (case-insensitive) kecuali current ID
        $exists = Food::whereRaw('LOWER(name) = ?', [strtolower($request->name)])
            ->where('id', '!=', $id)
            ->exists();

        if ($exists) {
            return back()->withErrors(['name' => 'Nama menu sudah digunakan.'])->withInput();
        }

        $foods = Food::findOrFail($id);

        if ($request->hasFile('thumbnail')) {
            // Hapus thumbnail lama
            if ($foods->thumbnail && Storage::disk('public')->exists(str_replace('/storage/', '', $foods->thumbnail))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $foods->thumbnail));
            }

            // Simpan thumbnail baru
            // $path = $request->file('thumbnail')->store('foods', 'public');
            // $foods->thumbnail = '/storage/' . $path;

            // Ambil original name + extension
            $file = $request->file('thumbnail');
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $file->getClientOriginalExtension();
            $safeName = Str::slug($originalName) . '.' . $extension;

            // Simpan thumbnail dengan original name
            $path = $file->storeAs('foods', $safeName, 'public');
            $foods->thumbnail = '/storage/' . $path;
        }

        // Update data lainnya
        $foods->name = Str::title($request->name);
        $foods->slug = $this->generateUniqueSlug($request->name, $foods->id);
        $foods->price = $request->price;
        $foods->save();

        return redirect()->route('foods.index')->with('message', 'Menu berhasil diperbarui.');
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
