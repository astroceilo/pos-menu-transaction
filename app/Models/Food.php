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
        'slug',
        'price'
    ];

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
}
