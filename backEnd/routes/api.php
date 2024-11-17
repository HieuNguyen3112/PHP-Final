<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CabinController;
use App\Http\Controllers\SettingsController;
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
Route::middleware('auth:sanctum')->get('/all-users', [AuthController::class, 'getAllUsers']);



//Booking controller router
Route::post('/bookings/{id}/checkin', [BookingController::class, 'checkIn'])->name('bookings.checkin');
Route::post('/bookings/{id}/confirm-payment', [BookingController::class, 'confirmPayment'])->name('bookings.confirmPayment');
Route::post('/bookings/{id}/checkout', [BookingController::class, 'checkOut'])->name('bookings.checkout');
Route::get('/bookings', [BookingController::class, 'getAllBookings']);
Route::delete('/bookings/{id}', [BookingController::class, 'deleteBooking']);
Route::get('/bookings/{id}/details', [BookingController::class, 'detailBooking'])->name('bookings.details');


// Cabin controller router
Route::post('/cabins/{id}/duplicate', [CabinController::class, 'duplicate'])->name('cabins.duplicate');
Route::delete('/cabins/{id}', [CabinController::class, 'delete']);
Route::put('/cabins/{id}', [CabinController::class, 'update']);

//Setting controller router
Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

//other router
Route::get('/dashboard', [DashboardController::class, 'index']);
