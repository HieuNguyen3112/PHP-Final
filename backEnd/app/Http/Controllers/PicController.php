<?php

namespace App\Http\Controllers;

use App\Models\Pic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver as GdDriver;

class PicController extends Controller
{
    /**
     * Display a listing of the images.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Pic::query();

        // Filter by type if provided
        if ($request->has('type') && in_array($request->type, ['uploaded', 'ai_generated'])) {
            $query->where('type_image', $request->type);
        }

        // Filter by active status if provided
        if ($request->has('active')) {
            $isActive = $request->active === 'true' || $request->active === '1';
            $query->where('is_active', $isActive);
        }

        // Search by filename or description
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('filename', 'like', "%{$search}%")
                  ->orWhere('original_filename', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('alt_text', 'like', "%{$search}%");
            });
        }

        // Sort images
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        // Only allow sorting by valid fields
        $allowedSortFields = ['created_at', 'filename', 'size', 'type_image'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc'); // Default sorting
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $pics = $query->paginate($perPage);

        // Add URL attribute to each image
        $pics->getCollection()->transform(function ($pic) {
            $pic->url = $pic->url;
            $pic->formatted_size = $pic->formatted_size;
            return $pic;
        });

        return response()->json([
            'success' => true,
            'data' => $pics
        ]);
    }

/**
 * Store a newly uploaded image.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return \Illuminate\Http\Response
 */
public function store(Request $request)
{
    try {
        $request->validate([
            'image' => 'required|image|max:10240', // Max 10MB
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        if (!$request->hasFile('image')) {
            return response()->json([
                'success' => false,
                'message' => 'No image file provided'
            ], 400);
        }

        $file = $request->file('image');
        $originalFilename = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        
        // Generate a unique filename
        $filename = time() . '_' . Str::random(10) . '.' . $extension;
        
        // Define the path relative to public directory
        $directory = 'uploads/images';
        $path = $directory . '/' . $filename;
        
        // Ensure directory exists
        if (!file_exists(public_path($directory))) {
            mkdir(public_path($directory), 0755, true);
        }

        // Save the image to public directory first
        $file->move(public_path($directory), $filename);
        
        // Process image using direct instantiation for Intervention Image v3
        try {
            // Create a new ImageManager instance with the GD driver
            $manager = new ImageManager(new GdDriver());
            
            // Read the image
            $image = $manager->read(public_path($path));
            
            // Get dimensions
            $width = $image->width();
            $height = $image->height();
        } catch (\Exception $e) {
            // Fallback to getting dimensions with getimagesize()
            $imageInfo = getimagesize(public_path($path));
            if ($imageInfo) {
                $width = $imageInfo[0];
                $height = $imageInfo[1];
            } else {
                $width = 0;
                $height = 0;
            }
        }
        
        // Get file size
        $size = filesize(public_path($path));
        
        // Create the image record in the database
        $pic = Pic::create([
            'filename' => $filename,
            'path' => $path,
            'type_image' => 'uploaded',
            'mime_type' => $file->getClientMimeType(),
            'original_filename' => $originalFilename,
            'size' => $size,
            'width' => $width,
            'height' => $height,
            'alt_text' => $request->alt_text,
            'description' => $request->description,
            'is_active' => true
        ]);

        // Add URL to response
        $pic->url = $pic->url;
        $pic->formatted_size = $pic->formatted_size;

        return response()->json([
            'success' => true,
            'message' => 'Image uploaded successfully',
            'data' => $pic
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error processing image: ' . $e->getMessage()
        ], 500);
    }
}
/**
 * Store an AI-generated image.
 *
 * @param  \Illuminate\Http\Request  $request
 * @return \Illuminate\Http\Response
 */
public function storeAiGenerated(Request $request)
{
    try {
        $request->validate([
            'image_data' => 'required|string',
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        // Extract base64 image data
        $imageData = $request->image_data;
        if (Str::startsWith($imageData, 'data:image')) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
        }
        
        // Decode base64 data
        $decodedImage = base64_decode($imageData);
        if (!$decodedImage) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid image data'
            ], 400);
        }

        // Generate a unique filename
        $filename = time() . '_' . Str::random(10) . '.jpg'; // Assuming JPEG format for AI images
        
        // Define the path relative to public directory
        $directory = 'uploads/ai_generated';
        $path = $directory . '/' . $filename;
        
        // Ensure directory exists
        if (!file_exists(public_path($directory))) {
            mkdir(public_path($directory), 0755, true);
        }
        
        // Save the image to public directory
        file_put_contents(public_path($path), $decodedImage);
        
        // Get image dimensions using direct instantiation
        try {
            // Create a new ImageManager instance with the GD driver
            $manager = new ImageManager(new GdDriver());
            
            // Read the image
            $image = $manager->read(public_path($path));
            
            // Get dimensions
            $width = $image->width();
            $height = $image->height();
        } catch (\Exception $e) {
            // Fallback to getting dimensions with getimagesize()
            $imageInfo = getimagesize(public_path($path));
            if ($imageInfo) {
                $width = $imageInfo[0];
                $height = $imageInfo[1];
            } else {
                $width = 0;
                $height = 0;
            }
        }
        
        $size = filesize(public_path($path));
        
        // Create the image record in the database
        $pic = Pic::create([
            'filename' => $filename,
            'path' => $path,
            'type_image' => 'ai_generated',
            'mime_type' => 'image/jpeg',
            'original_filename' => null,
            'size' => $size,
            'width' => $width,
            'height' => $height,
            'alt_text' => $request->alt_text,
            'description' => $request->description,
            'is_active' => true
        ]);

        // Add URL to response
        $pic->url = $pic->url;
        $pic->formatted_size = $pic->formatted_size;

        return response()->json([
            'success' => true,
            'message' => 'AI-generated image saved successfully',
            'data' => $pic
        ], 201);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Error processing image: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Display the specified image.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $pic = Pic::findOrFail($id);
        
        // Add URL to response
        $pic->url = $pic->url;
        $pic->formatted_size = $pic->formatted_size;
        
        // Get usage information
        $pic->usage = [
            'cabins' => $pic->cabins()->count(),
            'users' => $pic->users()->count(),
            'is_in_use' => $pic->isInUse()
        ];

        return response()->json([
            'success' => true,
            'data' => $pic
        ]);
    }

    /**
     * Update the specified image metadata.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_active' => 'nullable|boolean',
        ]);

        $pic = Pic::findOrFail($id);
        
        // Update only the provided fields
        $pic->fill($request->only([
            'alt_text',
            'description',
            'is_active'
        ]));
        
        $pic->save();

        // Add URL to response
        $pic->url = $pic->url;
        $pic->formatted_size = $pic->formatted_size;

        return response()->json([
            'success' => true,
            'message' => 'Image updated successfully',
            'data' => $pic
        ]);
    }

    /**
     * Remove the specified image.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $pic = Pic::findOrFail($id);
        
        // Check if the image is in use
        if ($pic->isInUse()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete image that is in use'
            ], 400);
        }
        
        // Delete the file from storage
        if (file_exists(public_path($pic->path))) {
            unlink(public_path($pic->path));
        }
        
        // Delete the database record
        $pic->delete();

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully'
        ]);
    }

    /**
     * Get unused images that can be safely deleted.
     *
     * @return \Illuminate\Http\Response
     */
    public function unused()
    {
        $unusedPics = Pic::whereDoesntHave('cabins')
            ->whereDoesntHave('users')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Add URL to each image
        $unusedPics->transform(function ($pic) {
            $pic->url = $pic->url;
            $pic->formatted_size = $pic->formatted_size;
            return $pic;
        });

        return response()->json([
            'success' => true,
            'count' => $unusedPics->count(),
            'data' => $unusedPics
        ]);
    }

    /**
     * Bulk delete unused images.
     *
     * @return \Illuminate\Http\Response
     */
    public function bulkDeleteUnused()
    {
        $unusedPics = Pic::whereDoesntHave('cabins')
            ->whereDoesntHave('users')
            ->get();
        
        $count = 0;
        
        foreach ($unusedPics as $pic) {
            // Delete the file from storage
            if (file_exists(public_path($pic->path))) {
                unlink(public_path($pic->path));
            }
            
            // Delete the database record
            $pic->delete();
            $count++;
        }

        return response()->json([
            'success' => true,
            'message' => "{$count} unused images deleted successfully"
        ]);
    }
}