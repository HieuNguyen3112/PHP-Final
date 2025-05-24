<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pic extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'filename',
        'path',
        'type_image',
        'mime_type',
        'original_filename',
        'size',
        'width',
        'height',
        'alt_text',
        'description',
        'is_active'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'size' => 'integer',
        'width' => 'integer',
        'height' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = ['url', 'formatted_size', 'dimensions'];

    /**
     * Get the cabins that use this image.
     */
    public function cabins()
    {
        return $this->hasMany(Cabin::class, 'pic_id');
    }

    /**
     * Get the users that use this image as avatar.
     */
    public function users()
    {
        return $this->hasMany(User::class, 'avatar_id');
    }

    /**
     * Get the full URL to the image.
     *
     * @return string
     */
    public function getUrlAttribute()
    {
        return asset($this->path);
    }

    /**
     * Scope a query to only include active images.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include images of a given type.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $type
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOfType($query, $type)
    {
        return $query->where('type_image', $type);
    }

    /**
     * Scope a query to only include uploaded images.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUploaded($query)
    {
        return $query->where('type_image', 'uploaded');
    }

    /**
     * Scope a query to only include AI-generated images.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeAiGenerated($query)
    {
        return $query->where('type_image', 'ai_generated');
    }

    /**
     * Check if the image is used by any cabin or user.
     *
     * @return bool
     */
    public function isInUse()
    {
        return $this->cabins()->exists() || $this->users()->exists();
    }

    /**
     * Check if the image is an uploaded image.
     *
     * @return bool
     */
    public function isUploaded()
    {
        return $this->type_image === 'uploaded';
    }

    /**
     * Check if the image is AI-generated.
     *
     * @return bool
     */
    public function isAiGenerated()
    {
        return $this->type_image === 'ai_generated';
    }

    /**
     * Get the dimensions of the image as a string (e.g., "800x600").
     *
     * @return string|null
     */
    public function getDimensionsAttribute()
    {
        if ($this->width && $this->height) {
            return "{$this->width}x{$this->height}";
        }
        
        return null;
    }

    /**
     * Get the file size formatted in a human-readable way.
     *
     * @return string|null
     */
    public function getFormattedSizeAttribute()
    {
        if (!$this->size) {
            return null;
        }
        
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $size = $this->size;
        $i = 0;
        
        while ($size >= 1024 && $i < count($units) - 1) {
            $size /= 1024;
            $i++;
        }
        
        return round($size, 2) . ' ' . $units[$i];
    }

    /**
     * Check if the file exists on disk.
     *
     * @return bool
     */
    public function getFileExistsAttribute()
    {
        return file_exists(public_path($this->path));
    }

    /**
     * Get the usage information for this image.
     *
     * @return array
     */
    public function getUsageAttribute()
    {
        return [
            'cabins' => $this->cabins()->count(),
            'users' => $this->users()->count(),
            'is_in_use' => $this->isInUse()
        ];
    }

    /**
     * Scope a query to only include unused images.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUnused($query)
    {
        return $query->whereDoesntHave('cabins')
                    ->whereDoesntHave('users');
    }
    
    /**
     * Get the validation rules for uploaded images.
     *
     * @return array
     */
    public static function getUploadValidationRules()
    {
        return [
            'image' => 'required|image|max:10240', // Max 10MB
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ];
    }
    
    /**
     * Get the validation rules for AI-generated images.
     *
     * @return array
     */
    public static function getAiGeneratedValidationRules()
    {
        return [
            'image_data' => 'required|string',
            'alt_text' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ];
    }
}