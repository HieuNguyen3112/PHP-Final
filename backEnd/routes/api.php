<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CabinController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\PicController;
use App\Http\Controllers\DashboardController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

//Auth and user controller router
Route::post('/login', [AuthController::class, 'login'])->name('login');
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/create-user', [AuthController::class, 'createUser']);
Route::put('/user/update-data', [AuthController::class, 'updateUserData'])->middleware('auth:sanctum');
Route::put('/user/update-password', [AuthController::class, 'updatePassword'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->get('/current-user', [AuthController::class, 'currentUser']);
Route::middleware('auth:sanctum')->get('/user/avatar', [AuthController::class, 'getUserAvatar']);
Route::middleware('auth:sanctum')->get('/all-users', [AuthController::class, 'getAllUsers']);

// Cabin controller router
Route::get('/cabins', [CabinController::class, 'index'])->name('cabins.index');
Route::get('/cabins/{id}', [CabinController::class, 'show'])->name('cabins.show');
Route::post('/cabins', [CabinController::class, 'store'])->name('cabins.store');
Route::put('/cabins/{id}', [CabinController::class, 'update'])->name('cabins.update');
Route::delete('/cabins/{id}', [CabinController::class, 'delete'])->name('cabins.delete');
Route::post('/cabins/{id}/duplicate', [CabinController::class, 'duplicate'])->name('cabins.duplicate');

// Image routes (for reference)
Route::get('/pics', [PicController::class, 'index'])->name('pics.index');
Route::post('/pics', [PicController::class, 'store'])->name('pics.store');
Route::post('/pics/ai-generated', [PicController::class, 'storeAiGenerated'])->name('pics.storeAiGenerated');


//Booking controller router
Route::put('/bookings/{id}/checkin', [BookingController::class, 'checkIn'])->name('bookings.checkin');
Route::post('/bookings/{id}/confirm-payment', [BookingController::class, 'confirmPayment'])->name('bookings.confirmPayment');
Route::post('/bookings/{id}/checkout', [BookingController::class, 'checkOut'])->name('bookings.checkout');
Route::get('/bookings', [BookingController::class, 'getAllBookings']);
Route::delete('/bookings/{id}', [BookingController::class, 'deleteBooking']);
Route::get('/bookings/{id}/details', [BookingController::class, 'detailBooking'])->name('bookings.details');
Route::post('/create-booking', [BookingController::class, 'createBooking']);



//Setting controller router
Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

//other router
Route::get('/dashboard', [DashboardController::class, 'index']);

// Image routes (for reference)
Route::get('/pics', [PicController::class, 'index'])->name('pics.index');
Route::post('/pics', [PicController::class, 'store'])->name('pics.store');
Route::post('/pics/ai-generated', [PicController::class, 'storeAiGenerated'])->name('pics.storeAiGenerated');