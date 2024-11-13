<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cabin;

class CabinController extends Controller
{
    // Hàm để sao chép cabin
    public function duplicate($id)
    {
        $cabin = Cabin::find($id);

        if (!$cabin) {
            return response()->json(['message' => 'Cabin not found'], 404);
        }

        // Tạo cabin mới dựa trên thông tin của cabin hiện tại
        $newCabin = $cabin->replicate();
        $newCabin->name = 'Copy of ' . $cabin->name;
        $newCabin->save();

        return response()->json(['message' => 'Cabin duplicated successfully', 'data' => $newCabin], 201);
    }

    // Hàm để xóa cabin
    public function delete($id)
    {
        $cabin = Cabin::find($id);

        if (!$cabin) {
            return response()->json(['message' => 'Cabin not found'], 404);
        }

        $cabin->delete();

        return response()->json(['message' => 'Cabin deleted successfully'], 200);
    }

    // Hàm để chỉnh sửa cabin
    public function update(Request $request, $id)
    {
        $cabin = Cabin::find($id);

        if (!$cabin) {
            return response()->json(['message' => 'Cabin not found'], 404);
        }

        // Cập nhật các thông tin cabin từ request
        $cabin->name = $request->input('name', $cabin->name);
        $cabin->capacity = $request->input('capacity', $cabin->capacity);
        $cabin->price = $request->input('price', $cabin->price);
        $cabin->discount = $request->input('discount', $cabin->discount);
        
        $cabin->save();

        return response()->json(['message' => 'Cabin updated successfully', 'data' => $cabin], 200);
    }
}
