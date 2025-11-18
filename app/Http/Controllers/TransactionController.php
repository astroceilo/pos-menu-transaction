<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Inertia\Inertia;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $foods = Food::all(); // Ambil semua menu makanan
        return Inertia::render('Transactions/index', [
            'foods' => $foods,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    //     $data = $request->validate([
    //     'items' => 'required|array|min:1',
    //     'items.*.food_id' => 'required|exists:foods,id',
    //     'items.*.quantity' => 'required|integer|min:1',
    //     'items.*.price' => 'required|numeric|min:0',
    //     'paid_amount' => 'required|numeric|min:0',
    // ]);

    // $total = collect($data['items'])->sum(fn ($item) => $item['quantity'] * $item['price']);
    // $change = $data['paid_amount'] - $total;

    // $transaction = Transaction::create([
    //     'user_id' => auth()->id(),
    //     'total_price' => $total,
    //     'paid_amount' => $data['paid_amount'],
    //     'change' => $change,
    //     'status' => 'paid',
    // ]);

    // foreach ($data['items'] as $item) {
    //     TransactionItem::create([
    //         'transaction_id' => $transaction->id,
    //         'food_id' => $item['food_id'],
    //         'quantity' => $item['quantity'],
    //         'price' => $item['price'],
    //         'subtotal' => $item['quantity'] * $item['price'],
    //     ]);
    // }

    // return back()->with('message', 'Transaksi berhasil disimpan.');

    // Hitung total
    $total = collect($request->items)->sum(function ($item) {
        return $item['quantity'] * $item['price'];
    });

    // Simpan transaksi
    $transaction = Transaction::create([
        'user_id' => auth()->id(),
        'total_price' => $total,
        'paid_amount' => $request->paid_amount,
        'change' => $request->paid_amount - $total,
        'status' => 'paid',
    ]);

    // Simpan item satuan
    foreach ($request->items as $item) {
        $transaction->items()->create([
            'food_id' => $item['food_id'],
            'quantity' => $item['quantity'],
            'price' => $item['price'],
            'subtotal' => $item['price'] * $item['quantity'],
        ]);
    }

    return redirect()->route('transactions.show', $transaction->id)
        ->with('last_transaction_id', $transaction->id)->with('message', 'Transaksi berhasil disimpan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $transaction = Transaction::with(['items.food'])->findOrFail($id);
        return Inertia::render('Transactions/receipt', [
            'transaction' => $transaction,
        ]);
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
        //
    }
}
