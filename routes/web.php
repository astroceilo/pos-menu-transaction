<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\TransactionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/foods', [FoodController::class, 'index'])->name('foods.index');
    Route::get('/foods/create', [FoodController::class, 'create'])->name('foods.create');
    Route::post('/foods', [FoodController::class, 'store'])->name('foods.store');
    Route::get('/foods/{food:slug}/edit', [FoodController::class, 'edit'])->name('foods.edit');
    // Route::put('/foods/{id}', [FoodController::class, 'update'])->name('foods.update');
    // Route::match(['put', 'patch'], '/foods/{id}', [FoodController::class, 'update'])->name('foods.update');
    Route::patch('/foods/{food}', [FoodController::class, 'update'])->name('foods.update');
    Route::delete('/foods/{food}', [FoodController::class, 'destroy'])->name('foods.destroy');

    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transactions/create', [TransactionController::class, 'create'])->name('transactions.create');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::get('/transactions/{id}', [TransactionController::class, 'show'])->name('transactions.show');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
