<?php

namespace Database\Seeders;

use App\Models\Food;
use Illuminate\Support\Str;
use Illuminate\Database\Seeder;

class Foodseeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $foods = [
            ['name' => 'Sate Ayam','price' => 30000,'thumbnail' => 'storage/images/foods/sate-ayam.jpg'],
            ['name' => 'Bakso','price' => 10000,'thumbnail' => 'storage/images/foods/bakso.jpeg'],
            ['name' => 'Tempe Goreng','price' => 5000,'thumbnail' => 'storage/images/foods/tempe-goreng.jpg'],
            ['name' => 'Tahu Isi','price' => 10000,'thumbnail' => 'storage/images/foods/tahu-isi-goreng.jpg'],
            ['name' => 'Soto Ayam','price' => 30000,'thumbnail' => 'storage/images/foods/soto-ayam.jpg'],
            ['name' => 'Nasi Padang','price' => 30000,'thumbnail' => 'storage/images/foods/nasi-padang.jpg'],
            ['name' => 'Taco','price' => 30000,'thumbnail' => 'storage/images/foods/taco.jpg'],
        ];

        foreach ($foods as $food) {
            // Food::create($food);

            Food::create([
                'name' => $food['name'],
                'price' => $food['price'],
                'slug' => Str::slug($food['name']),
                'thumbnail' => $food['thumbnail'],
            ]);
        }
    }
}
