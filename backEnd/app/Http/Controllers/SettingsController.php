<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::first();
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $request->validate([
            'min_nights_booking' => 'required|integer|min:1',
            'max_nights_booking' => 'required|integer|min:1',
            'max_guests_booking' => 'required|integer|min:1',
            'breakfast_price' => 'required|numeric|min:0',
        ]);

        $settings = Setting::first();
        $settings->update([
            'min_nights_booking' => $request->input('min_nights_booking'),
            'max_nights_booking' => $request->input('max_nights_booking'),
            'max_guests_booking' => $request->input('max_guests_booking'),
            'breakfast_price' => $request->input('breakfast_price'),
        ]);

        return response()->json(['message' => 'Setting successfully updated']);
    }
}
