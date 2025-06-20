<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Food extends Model
{
    use HasFactory;

    protected $table = 'foods';

    protected $fillable = [
        'thumbnail',
        'name',
        'price'
    ];

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
