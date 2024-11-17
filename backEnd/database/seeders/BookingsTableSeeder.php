<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use Carbon\Carbon;

class BookingsTableSeeder extends Seeder
{
    public function run()
    {
        // Thêm dữ liệu mẫu khác
        Booking::create([
            'cabin_id' => 2,
            'guest_name' => 'Alice Johnson',
            'guest_email' => 'alice.johnson@example.com',
            'start_date' => Carbon::now()->addDays(5),
            'end_date' => Carbon::now()->addDays(10),
            'nights' => 5,
            'status' => 'checked-in',
            'amount' => 2500.00,
        ]);

        Booking::create([
            'cabin_id' => 3,
            'guest_name' => 'Bob Smith',
            'guest_email' => 'bob.smith@example.com',
            'start_date' => Carbon::now()->addDays(15),
            'end_date' => Carbon::now()->addDays(20),
            'nights' => 5,
            'status' => 'checked-out',
            'amount' => 3000.00,
        ]);

        Booking::create([
            'cabin_id' => 4,
            'guest_name' => 'Cathy Brown',
            'guest_email' => 'cathy.brown@example.com',
            'start_date' => Carbon::now()->addDays(45),
            'end_date' => Carbon::now()->addDays(50),
            'nights' => 5,
            'status' => 'unconfirmed',
            'amount' => 4000.00,
        ]);

        Booking::create([
            'cabin_id' => 5,
            'guest_name' => 'David Clark',
            'guest_email' => 'david.clark@example.com',
            'start_date' => Carbon::now()->addDays(20),
            'end_date' => Carbon::now()->addDays(25),
            'nights' => 5,
            'status' => 'checked-in',
            'amount' => 3500.00,
        ]);
    }
}
