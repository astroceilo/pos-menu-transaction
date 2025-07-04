<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TransactionItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'transaction_id',
        'food_id',
        'quantity',
        'price',
        'subtotal',
    ];


    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function food()
    {
        return $this->belongsTo(Food::class);
    }
}
