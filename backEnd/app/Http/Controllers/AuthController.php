<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Attempt to log the user in
        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $token = $user->createToken('Personal Access Token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => $user
            ], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password'
            ], 401);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function createUser(Request $request)
    {
        // Validate input
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed', 
        ]);

        // Tạo người dùng mới
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    public function updateUserData(Request $request)
{
    $user = Auth::user();

    $request->validate([
        'name' => 'required|string|max:255',
        'avatarImage' => 'nullable|string', // Kiểm tra chuỗi base64
    ]);

    // Cập nhật tên
    $user->name = $request->name;

    // Kiểm tra xem có avatarImage trong request không và xử lý base64
    if ($request->avatarImage) {
        $image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $request->avatarImage));
        
        $imageName = uniqid() . '.png';
        
        \Storage::disk('public')->put("avatars/{$imageName}", $image);

        $user->avatarImage = "avatars/{$imageName}";
    }

    $user->save();

    return response()->json([
        'success' => true,
        'message' => 'User data updated successfully',
        'user' => $user
    ]);
}



    public function updatePassword(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Cập nhật mật khẩu
        $user->password = bcrypt($request->password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Password updated successfully',
        ]);
    }

    // Phương thức lấy thông tin người dùng hiện tại
    public function currentUser(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }

    // Phương thức lấy toàn bộ người dùng
    public function getAllUsers()
    {
        $users = User::all();

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }
}
