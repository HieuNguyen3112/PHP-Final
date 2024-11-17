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

    public function getAllBookings()
    {
        $bookings = Booking::with('cabin')
            ->get();

        return response()->json([
            'success' => true,
            'bookings' => $bookings
        ], 200);
    }


    public function deleteBooking($id)
    {
        // Tìm booking theo ID
        $booking = Booking::find($id);

        // Kiểm tra nếu booking không tồn tại
        if (!$booking) {
            return response()->json(['message' => 'Booking does not exist'], 404);
        }

        // Xóa booking
        $booking->delete();

        return response()->json([
            'success' => true,
            'message' => 'Booking deleted successfully'
        ], 200);
    }

    public function detailBooking($id)
    {
        // Tìm booking theo ID, đồng thời lấy thông tin cabin và customer
        $booking = Booking::with(['cabin', 'customer'])->find($id);

        // Kiểm tra nếu booking không tồn tại
        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking does not exist',
            ], 404);
        }

        // Định nghĩa dữ liệu trả về, bao gồm thông tin từ bảng customers
        $details = [
            'id' => $booking->id,
            'cabin_name' => $booking->cabin ? $booking->cabin->name : 'Unknown Cabin',
            'guest_name' => $booking->guest_name,
            'guest_email' => $booking->guest_email,
            'start_date' => $booking->start_date,
            'end_date' => $booking->end_date,
            'nights' => $booking->nights,
            'status' => $booking->status,
            'amount' => $booking->amount,
            'created_at' => $booking->created_at->format('Y-m-d H:i:s'),
            'updated_at' => $booking->updated_at->format('Y-m-d H:i:s'),
            'customer' => $booking->customer ? [
                'name' => $booking->customer->name,
                'email' => $booking->customer->email,
                'phone_number' => $booking->customer->phone_number,
                'address' => $booking->customer->address,
                'national_id' => $booking->customer->national_id,
                'country' => $booking->customer->country,
            ] : null,
        ];

        // Trả về thông tin chi tiết của booking
        return response()->json([
            'success' => true,
            'booking' => $details,
        ], 200);
    }



}
