<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Customer;
use Carbon\Carbon;

class BookingController extends Controller
{
     // Check-in cho booking
     public function checkIn(Request $request, $id)
     {
         // Validate request
         $validatedData = $request->validate([
             'num_guests' => 'required|integer|min:1',
             'has_breakfast' => 'boolean',
             'amount' => 'required|numeric|min:0',
         ]);
     
         // Find booking by ID
         $booking = Booking::find($id);
     
         if (!$booking) {
             return response()->json(['message' => 'Booking does not exist'], 404);
         }
     
         // Update booking details
         $booking->status = 'checked_in';
         $booking->amount = $validatedData['amount']; 
         
         // Save changes
         $booking->save();
     
         return response()->json([
             'message' => 'Booking checked in successfully',
             'booking' => $booking
         ], 200);
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

   public function getAllBookings(Request $request)
{
    // Get filter and sort parameters from request
    $status = $request->query('status', 'all');
    $sortField = $request->query('sortField', 'created_at');
    $sortDirection = $request->query('sortDirection', 'desc');
    
    // Start with a base query
    $query = Booking::with('cabin', 'customer');
    
    // Apply status filter if not "all"
    if ($status !== 'all') {
        $query->where('status', $status);
    }
    
    // Map frontend sort fields to database columns
    $sortFieldMap = [
        'startDate' => 'start_date',
        'totalPrice' => 'amount',
        // Add more mappings as needed
    ];
    
    // Apply sorting
    $dbSortField = $sortFieldMap[$sortField] ?? $sortField;
    $query->orderBy($dbSortField, $sortDirection);
    
    // Get results
    $bookings = $query->get();

    return response()->json([
        'success' => true,
        'bookings' => $bookings
    ], 200);
}


    public function deleteBooking($id)
    {
        error_log("=== here is what request inculude: ===");
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
            'cabin_id' => $booking->cabin_id,
            'cabin_name' => $booking->cabin ? $booking->cabin->name : 'Unknown Cabin',
            'capacity' => $booking->cabin ? $booking->cabin->capacity : 1,
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

    public function createBooking(Request $request)
    {
        
        // Validate input
        $request->validate([
            'cabin_id' => 'required',
            'guest_email' => 'required|email',
            'guest_name' => 'required|string', 
            'start_date' => 'required', 
            'end_date' => 'required', 
            'nights' => 'required', 
            'amount' => 'required', 
            'phone_number' => 'required', 
            'address' => 'required', 
            'national_id' => 'required', 
            'country' => 'required', 
        ]);

        // Tạo người dùng mới
        $booking = Booking::create([
            'cabin_id' => $request->cabin_id,
            'guest_name' => $request->guest_name,
            'guest_email' => $request->guest_email,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'nights' => $request->nights,
            'status' => 'unconfirmed',
            'amount' => $request->amount,
        ]);

        $something = Customer::create([
            'booking_id' => $booking->id,
            'name' => $request->guest_name,
            'email' => $request->guest_email,
            'phone_number' => $request->phone_number,
            'address' => $request->address,
            'national_id' => $request->national_id,
            'country' => $request->country,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Booking created successfully'
        ], 201);
    }



}
