<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cabin extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'capacity',
        'price',
        'discount',
        'description',
        'pic_id'
    ];
    
    protected $casts = [
        'capacity' => 'integer',
        'price' => 'float',
        'discount' => 'float',
    ];
    
    /**
     * Get the image associated with the cabin.
     */
    public function pic()
    {
        return $this->belongsTo(Pic::class);
    }

    
    /**
     * Get the discounted price.
     *
     * @return float
     */
    public function getDiscountedPriceAttribute()
    {
        return $this->price * (1 - $this->discount / 100);
    }
    
    /**
     * Scope a query to order cabins by price.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $direction
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOrderByPrice($query, $direction = 'asc')
    {
        return $query->orderBy('price', $direction);
    }
    
    /**
     * Scope a query to filter cabins by capacity.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $capacity
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithMinCapacity($query, $capacity)
    {
        return $query->where('capacity', '>=', $capacity);
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}


