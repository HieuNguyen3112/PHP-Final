<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Pic;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $token = $user->createToken('Personal Access Token')->plainTextToken;
            
            // Load avatar relationship if exists
            if ($user->avatar_id) {
                $user->load('avatar');
            }
            
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

        // Create new user
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
        try {
            $user = Auth::user();

            $request->validate([
                'name' => 'required|string|max:255',
                'pic_id' => 'nullable|exists:pics,id',
                'avatarImage' => 'nullable|string', // For base64 image data
            ]);

            DB::beginTransaction();

            // Update name
            $user->name = $request->name;

            // Handle image update
            if ($request->has('pic_id') && $request->pic_id) {
                // Use existing image from pics table
                $user->avatar_id = $request->pic_id;
            } 
            elseif ($request->has('avatarImage') && $request->avatarImage) {
                // Handle base64 image
                $imageData = $request->avatarImage;
                if (Str::startsWith($imageData, 'data:image')) {
                    $imageData = substr($imageData, strpos($imageData, ',') + 1);
                }
                
                // Decode base64 data
                $decodedImage = base64_decode($imageData);
                
                // Generate a unique filename
                $filename = time() . '_' . Str::random(10) . '.jpg';
                
                // Define the path relative to public directory
                $directory = 'uploads/avatars';
                $path = $directory . '/' . $filename;
                
                // Ensure directory exists
                if (!file_exists(public_path($directory))) {
                    mkdir(public_path($directory), 0755, true);
                }
                
                // Save the image to public directory
                file_put_contents(public_path($path), $decodedImage);
                
                // Get image dimensions
                try {
                    $manager = new ImageManager(new GdDriver());
                    $image = $manager->read(public_path($path));
                    $width = $image->width();
                    $height = $image->height();
                } catch (\Exception $e) {
                    $imageInfo = getimagesize(public_path($path));
                    $width = $imageInfo ? $imageInfo[0] : 0;
                    $height = $imageInfo ? $imageInfo[1] : 0;
                }
                
                // Create new pic record
                $pic = Pic::create([
                    'filename' => $filename,
                    'path' => $path,
                    'type_image' => 'uploaded',
                    'mime_type' => 'image/jpeg',
                    'original_filename' => 'avatar_upload.jpg',
                    'size' => filesize(public_path($path)),
                    'width' => $width,
                    'height' => $height,
                    'alt_text' => 'User avatar for ' . $user->name,
                    'is_active' => true
                ]);
                
                // Associate the pic with the user
                $user->avatar_id = $pic->id;
            }

            $user->save();
            
            DB::commit();
            
            // Load avatar relationship for response
            if ($user->avatar_id) {
                $user->load('avatar');
            }

            return response()->json([
                'success' => true,
                'message' => 'User data updated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating user data: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error updating user data: ' . $e->getMessage()
            ], 500);
        }
    }

    public function updatePassword(Request $request)
    {
        try {
            $user = Auth::user();

            $request->validate([
                'password' => 'required|string|min:8|confirmed',
            ]);

            // Update password
            $user->password = bcrypt($request->password);
            $user->save();

            return response()->json([
                'success' => true,
                'message' => 'Password updated successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error updating password: ' . $e->getMessage()
            ], 500);
        }
    }

    public function currentUser(Request $request)
    {
        $user = $request->user();
        
        // Load avatar relationship if exists
        if ($user && $user->avatar_id) {
            $user->load('avatar');
        }

        return response()->json([
            'success' => true,
            'user' => $user
        ]);
    }
    
    /**
     * Get avatar URL for current user
     */
    public function getUserAvatar(Request $request)
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User not authenticated'
            ], 401);
        }
        
        if (!$user->avatar_id) {
            return response()->json([
                'success' => false,
                'message' => 'User has no avatar',
                'avatar_url' => null
            ]);
        }
        
        $pic = Pic::find($user->avatar_id);
        
        if (!$pic) {
            return response()->json([
                'success' => false,
                'message' => 'Avatar not found',
                'avatar_url' => null
            ]);
        }
        
        return response()->json([
            'success' => true,
            'avatar_url' => $pic->url,
            'avatar' => $pic
        ]);
    }

    public function getAllUsers()
    {
        $users = User::all();

        return response()->json([
            'success' => true,
            'users' => $users
        ]);
    }
}