<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{

    protected $fillable = [
        'booking_id',
        'name',
        'email',
        'phone_number',
        'address',
        'national_id',
        'country'
    ];
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }


    use HasFactory;
}
