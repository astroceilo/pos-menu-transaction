<?php

namespace Database\Seeders;

use App\Models\Food;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class FoodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $foods = [
            ['name' => 'Sate Ayam','price' => 30000,'thumbnail' => '/storage/foods/sate-ayam.jpg'],
            ['name' => 'Bakso','price' => 10000,'thumbnail' => '/storage/foods/bakso.jpeg'],
            ['name' => 'Tempe Goreng','price' => 5000,'thumbnail' => '/storage/foods/tempe-goreng.jpg'],
            ['name' => 'Tahu Isi','price' => 10000,'thumbnail' => '/storage/foods/tahu-isi-goreng.jpg'],
            ['name' => 'Soto Ayam','price' => 30000,'thumbnail' => '/storage/foods/soto-ayam.jpg'],
            ['name' => 'Nasi Padang','price' => 30000,'thumbnail' => '/storage/foods/nasi-padang.jpg'],
            ['name' => 'Taco','price' => 30000,'thumbnail' => '/storage/foods/taco.jpg'],
        ];

        foreach ($foods as $food) {
            Food::create($food);
        }

        // foreach ($foods as $food) {
        //     Food::factory()->create([
        //         'name' => $food,
        //     ]);
        // }

        // Food::create([
        //     'name' => 'Sate Ayam',
        //     'price' => 30000,
        //     'thumbnail' => '/storage/foods/sate-ayam.jpg',
        // ]);
    }
}
