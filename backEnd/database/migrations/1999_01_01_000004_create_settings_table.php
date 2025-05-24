<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class CreateSettingsTable extends Migration
{
    public function up()
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->integer('min_nights_booking')->default(3); 
            $table->integer('max_nights_booking')->default(90); 
            $table->integer('max_guests_booking')->default(8);
            $table->decimal('breakfast_price', 8, 2)->default(15.00);
            $table->timestamps();
        });

        // Insert the single settings record
        DB::table('settings')->insert([
            'min_nights_booking' => 1,
            'max_nights_booking' => 14,
            'max_guests_booking' => 4,
            'breakfast_price' => 15.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down()
    {
        Schema::dropIfExists('settings');
    }
}