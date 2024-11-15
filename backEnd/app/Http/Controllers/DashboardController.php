<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Cabin;

class DashboardController extends Controller
{
    public function index()
    {
        // Số lượng booking
        $totalBookings = Booking::count();

        // Tổng doanh thu
        $totalSales = Booking::where('status', 'checked_in')->sum('money');

        // Số lượng check-ins
        $totalCheckIns = Booking::where('status', 'checked_in')->count();

        // Tỷ lệ phòng sử dụng
        $totalRooms = Cabin::count();
        $occupiedRooms = Booking::where('status', 'checked_in')->distinct('cabin_id')->count();
        $occupancyRate = $totalRooms > 0 ? ($occupiedRooms / $totalRooms) * 100 : 0;

        return response()->json([
            'totalBookings' => $totalBookings,
            'totalSales' => $totalSales,
            'totalCheckIns' => $totalCheckIns,
            'occupancyRate' => $occupancyRate
        ]);
    }
}

