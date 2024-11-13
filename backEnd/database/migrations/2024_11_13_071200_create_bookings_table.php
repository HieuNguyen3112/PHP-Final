<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBookingsTable extends Migration
{
    public function up()
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cabin_id')->constrained('cabins')->onDelete('cascade'); // Liên kết với cabins
            $table->string('guest_name');
            $table->string('guest_email');
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('nights');
            $table->enum('status', ['unconfirmed', 'checked_in', 'checked_out'])->default('unconfirmed');
            $table->decimal('amount', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bookings');
    }
}
