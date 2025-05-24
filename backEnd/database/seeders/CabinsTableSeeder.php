<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CabinsTableSeeder extends Seeder
{
    public function run()
    {
        DB::table('cabins')->insert([
            [
                'id' => 1,
                'name' => 'Cabin 001',
                'capacity' => 2,
                'price' => 250.00,
                'discount' => null,
            ],
            [
                'id' => 2,
                'name' => 'Cabin 002',
                'capacity' => 2,
                'price' => 350.00,
                'discount' => 25.00,
            ],
            [
                'id' => 3,
                'name' => 'Cabin 003',
                'capacity' => 4,
                'price' => 300.00,
                'discount' => null,
            ],
            [
                'id' => 4,
                'name' => 'Cabin 004',
                'capacity' => 4,
                'price' => 500.00,
                'discount' => 50.00,
            ],
            [
                'id' => 5,
                'name' => 'Cabin 005',
                'capacity' => 4,
                'price' => 530.00,
                'discount' => 53.00,
            ],
        ]);
    }
}
