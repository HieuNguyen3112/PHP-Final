<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    // Tên bảng
    protected $table = 'bookings';

    // Các trường có thể được gán hàng loạt
    protected $fillable = [
        'cabin_id',
        'guest_name',
        'guest_email',
        'start_date',
        'end_date',
        'nights',
        'status',
        'amount'
    ];

    // Thiết lập mối quan hệ với model Cabin
    public function cabin()
    {
        return $this->belongsTo(Cabin::class);
    }

    // Các hằng số cho trạng thái booking
    const STATUS_UNCONFIRMED = 'unconfirmed';
    const STATUS_CHECKED_IN = 'checked_in';
    const STATUS_CHECKED_OUT = 'checked_out';
}
