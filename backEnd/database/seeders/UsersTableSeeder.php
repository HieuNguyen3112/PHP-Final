<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create admin user with known credentials
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // You can change this to any password you want
            'is_active' => true,
            'remember_token' => Str::random(10),
        ]);

        // Create a test user
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'), // You can change this to any password you want
            'is_active' => true,
            'remember_token' => Str::random(10),
        ]);

        // Create 8 random users using the factory
        User::factory()->count(8)->create();

        // Output message
        $this->command->info('Users seeded successfully!');
    }
}