<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Carbon\Carbon;

class BookingController extends Controller
{
     // Check-in cho booking
    public function checkIn($id)
    {
        // Tìm booking theo ID
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking does not exist'], 404);
        }

        // Cập nhật trạng thái thành "checked_in"
        $booking->status = 'checked_in';
        $booking->save();

        return response()->json(['message' => 'Booking checked in successfully'], 200);
    }

    // Xác nhận thanh toán cho booking
    public function confirmPayment($id)
    {
        // Tìm booking theo ID
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking does not exist'], 404);
        }

        // Cập nhật trạng thái thành "paid" hoặc trạng thái khác nếu cần thiết
        $booking->status = 'paid';
        $booking->save();

        return response()->json(['message' => 'Payment confirmed successfully'], 200);
    }

    // Confirm checkout for booking
    public function checkOut($id)
    {
        $booking = Booking::find($id);

        // Kiểm tra nếu booking không tồn tại hoặc chưa được check-in
        if (!$booking || $booking->status !== 'checked_in') {
            return response()->json(['message' => 'Cannot check-out unless checked in or booking does not exist'], 400);
        }

        // Cập nhật trạng thái booking thành "checked_out"
        $booking->status = 'checked_out';
        $booking->save();

        return response()->json(['message' => 'Booking checked out successfully', 'booking' => $booking]);
    }
}
