<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cabin extends Model
{
    use HasFactory;

    protected $table = 'cabins';

    protected $fillable = [
        'name',
        'capacity',
        'price',
        'discount',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
