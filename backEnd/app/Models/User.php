<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar_id'
    ];

    /**
     * Get the avatar image associated with the user.
     */
    public function avatar()
    {
        return $this->belongsTo(Pic::class, 'avatar_id');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    
    /**
     * Get avatar URL attribute
     * 
     * @return string|null
     */
    public function getAvatarUrlAttribute()
    {
        if ($this->avatar_id) {
            $pic = $this->avatar;
            if ($pic) {
                return $pic->url;
            }
        }
        return null;
    }
    
    /**
     * Append avatar_url to JSON response
     */
    protected $appends = ['avatar_url'];
}