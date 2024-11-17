<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    public function run()
    {
        // Thêm dữ liệu mẫu khác
        Customer::create([
            'booking_id' => 2,
            'name' => 'Alice Johnson',
            'email' => 'alice.johnson@example.com',
            'phone_number' => '987654321',
            'address' => '456 Oak Avenue',
            'national_id' => 'CD789012',
            'country' => 'Canada',
        ]);

        Customer::create([
            'booking_id' => 2,
            'name' => 'Bob Smith',
            'email' => 'bob.smith@example.com',
            'phone_number' => '555666777',
            'address' => '789 Pine Road',
            'national_id' => 'EF345678',
            'country' => 'UK',
        ]);

        Customer::create([
            'booking_id' => 2,
            'name' => 'Cathy Brown',
            'email' => 'cathy.brown@example.com',
            'phone_number' => '112233445',
            'address' => '321 Willow Lane',
            'national_id' => 'GH901234',
            'country' => 'Australia',
        ]);

        Customer::create([
            'booking_id' => 2,
            'name' => 'David Clark',
            'email' => 'david.clark@example.com',
            'phone_number' => '998877665',
            'address' => '654 Maple Boulevard',
            'national_id' => 'IJ567890',
            'country' => 'New Zealand',
        ]);
    }
}
