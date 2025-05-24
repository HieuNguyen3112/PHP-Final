<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Cabin;
use App\Models\Pic;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CabinController extends Controller
{
    /**
     * Display a listing of all cabins.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
{
    try {
        $query = Cabin::query();
        $withImage = $request->has('with_image') && $request->with_image;
        
        if ($withImage) {
            $reflectionClass = new \ReflectionClass(Cabin::class);
            $hasPicMethod = $reflectionClass->hasMethod('pic');
            
            if ($hasPicMethod) {
                $query->with('pic');
            } else {
                error_log("WARNING: 'pic' relationship not found in Cabin model");
            }
        }
        
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        $allowedSortFields = ['name', 'capacity', 'price', 'discount', 'created_at'];
        
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection === 'asc' ? 'asc' : 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }
        
        $allCabins = $query->get();
        $cabinCount = count($allCabins);
    
        $cabinsWithUrls = $allCabins->map(function ($cabin, $index) {
            
            if ($cabin->pic_id) {
                
                // Find the pic
                $pic = Pic::find($cabin->pic_id);
                if ($pic) {
                    
                    // Check if url accessor exists
                    if (method_exists($pic, 'getUrlAttribute')) {
                        $imageUrl = $pic->url;
                        $cabin->image_url = $imageUrl;
                    } else {
                        $cabin->image_url = url($pic->path);
                    }
                } else {
                    $cabin->image_url = null;
                }
            } else {
                $cabin->image_url = null;
            }
            
            return $cabin;
        });
        
        
        $responseData = [
            'success' => true,
            'data' => [
                'data' => $cabinsWithUrls,
                'total' => count($cabinsWithUrls),
                'per_page' => count($cabinsWithUrls),
                'current_page' => 1,
                'last_page' => 1
            ]
        ];
        
        return response()->json($responseData);
        
    } catch (\Exception $e) {
       
        return response()->json([
            'success' => false,
            'message' => 'Error retrieving cabins: ' . $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], 500);
    }
}
    
    /**
     * Store a newly created cabin.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        try {
            // Validate input - removed description field
            $validatedData = $request->validate([
                'name' => 'required|string|max:100',
                'capacity' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0',
                'discount' => 'required|numeric|min:0|max:100',
                'image' => 'nullable|image|max:10240', // Optional image upload
                'pic_id' => 'nullable|integer|exists:pics,id', // Optional existing image reference
            ]);
            
            // Start transaction
            DB::beginTransaction();
            
            // Initialize picId
            $picId = 1;
            
            // Check if pic_id is directly provided
            if ($request->has('pic_id') && $request->pic_id) {
                $picId = $request->pic_id;
                Log::info('Using provided pic_id: ' . $picId);
            }
            // Handle image upload if provided and no pic_id
            elseif ($request->hasFile('image')) {
                Log::info('Image file detected, processing upload');
                
                // Create a new PicController instance
                $picController = new PicController();
                
                // Create a new request with just the image data
                $imageRequest = new Request();
                $imageRequest->files->set('image', $request->file('image'));
                
                // If alt_text is provided, include it
                if ($request->has('alt_text')) {
                    $imageRequest->merge(['alt_text' => $request->alt_text]);
                }
                
                // Call the store method on PicController
                $picResponse = $picController->store($imageRequest);
                
                // Check if the response is successful and extract the pic_id
                if ($picResponse->getStatusCode() === 201) {
                    $picData = json_decode($picResponse->getContent(), true);
                    
                    if (isset($picData['data']['id'])) {
                        $picId = $picData['data']['id'];
                        Log::info('Successfully uploaded image, got pic_id: ' . $picId);
                    } else {
                        Log::error('Image upload successful but no ID in response: ' . json_encode($picData));
                        throw new \Exception('Image upload successful but could not retrieve image ID');
                    }
                } else {
                    $picData = json_decode($picResponse->getContent(), true);
                    Log::error('Failed to upload image: ' . json_encode($picData));
                    throw new \Exception('Failed to upload image: ' . ($picData['message'] ?? 'Unknown error'));
                }
            }
            
            // Create cabin with the pic_id (which might be null if no image provided)
            // Removed description field
            $cabin = Cabin::create([
                'name' => $validatedData['name'],
                'capacity' => $validatedData['capacity'],
                'price' => $validatedData['price'],
                'discount' => $validatedData['discount'],
                'pic_id' => $picId,
            ]);
            
            // Log the created cabin data for debugging
            Log::info('Created cabin with data: ' . json_encode([
                'id' => $cabin->id,
                'name' => $cabin->name,
                'pic_id' => $cabin->pic_id
            ]));
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Cabin created successfully',
                'data' => $cabin
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create cabin: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create cabin: ' . $e->getMessage()
            ], 422);
        }
    }
    
    /**
     * Display the specified cabin.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        error_log('the id is');
        error_log($id);
        $cabin = Cabin::find($id);
        
        if (!$cabin) {
            return response()->json([
                'success' => false,
                'message' => 'Cabin not found'
            ], 404);
        }
        
        return response()->json([
            'success' => true,
            'data' => $cabin
        ]);
    }
    
    /**
     * Update the specified cabin.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        try {
            $cabin = Cabin::find($id);
            
            if (!$cabin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cabin not found'
                ], 404);
            }
            
            // Validate input
            $validatedData = $request->validate([
                'name' => 'sometimes|string|max:100',
                'capacity' => 'sometimes|integer|min:1',
                'price' => 'sometimes|numeric|min:0',
                'discount' => 'sometimes|numeric|min:0|max:100',
                'description' => 'nullable|string',
                'image' => 'nullable|image|max:10240', // Optional image upload
                'pic_id' => 'nullable|integer|exists:pics,id', // Optional existing image reference
            ]);
            
            // Start transaction
            DB::beginTransaction();
            
            // Handle image update if provided
            if ($request->hasFile('image')) {
                // Create a new image record
                $picController = new PicController();
                $picResponse = $picController->store($request);
                $picData = json_decode($picResponse->getContent(), true);
                
                if (!$picResponse->isSuccessful() || !isset($picData['data']['id'])) {
                    throw new \Exception('Failed to upload image: ' . ($picData['message'] ?? 'Unknown error'));
                }
                
                $cabin->pic_id = $picData['data']['id'];
            } elseif ($request->has('pic_id')) {
                // Use existing image
                $cabin->pic_id = $request->pic_id;
            }
            
            // Update other cabin details
            $cabin->fill($request->only([
                'name',
                'capacity',
                'price',
                'discount',
                'description'
            ]));
            
            $cabin->save();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Cabin updated successfully',
                'data' => $cabin
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update cabin: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to update cabin: ' . $e->getMessage()
            ], 422);
        }
    }
    
    /**
     * Duplicate the specified cabin.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function duplicate($id)
    {
        try {
            $cabin = Cabin::find($id);
            
            if (!$cabin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cabin not found'
                ], 404);
            }
            
            // Create new cabin based on existing one
            $newCabin = $cabin->replicate();
            $newCabin->name = 'Copy of ' . $cabin->name;
            $newCabin->save();
            
            return response()->json([
                'success' => true,
                'message' => 'Cabin duplicated successfully',
                'data' => $newCabin
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Failed to duplicate cabin: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to duplicate cabin: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remove the specified cabin.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function delete($id)
    {
        try {
            $cabin = Cabin::find($id);
            
            if (!$cabin) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cabin not found'
                ], 404);
            }
            
            $cabin->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Cabin deleted successfully'
            ]);
            
        } catch (\Exception $e) {
            Log::error('Failed to delete cabin: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete cabin: ' . $e->getMessage()
            ], 500);
        }
    }
}