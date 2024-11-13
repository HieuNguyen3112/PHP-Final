<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use Carbon\Carbon;

class BookingsTableSeeder extends Seeder
{
    public function run()
    {
        Booking::create([
            'cabin_id' => 1,
            'guest_name' => 'Nina Williams',
            'guest_email' => 'nina@hotmail.com',
            'start_date' => Carbon::now()->addDays(30),
            'end_date' => Carbon::now()->addDays(40),
            'nights' => 10,
            'status' => 'unconfirmed',
            'amount' => 6050.00,
        ]);

        // Thêm các bản ghi mẫu khác tương tự nếu cần
    }
}
