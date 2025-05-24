import { useState } from "react";
import axios from "axios";
import { format, addDays } from "date-fns";

const useCreateBooking = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const calculateEndDate = (startDate, nights) => {
    const date = new Date(startDate);
    return format(addDays(date, parseInt(nights)), 'yyyy-MM-dd');
  };

  const calculateTotalAmount = (cabin, nights) => {
    if (!cabin) return 0;
    
    const basePrice = cabin.regularPrice || cabin.price;
    const discount = cabin.discount || 0;
    const discountedPrice = basePrice * (1 - discount / 100);
    return (discountedPrice * nights).toFixed(2);
  };

  const createBooking = async (bookingData, cabinData) => {
    setIsCreating(true);
    setError(null);
    setSuccess(false);

    try {
      // Calculate end date based on start date and nights
      const endDate = calculateEndDate(bookingData.start_date, bookingData.nights);
      
      // Find the selected cabin
      const selectedCabin = cabinData.find(
        cabin => cabin.id === parseInt(bookingData.cabin_id)
      );
      
      // Calculate total amount
      const totalAmount = calculateTotalAmount(selectedCabin, bookingData.nights);
      
      // Prepare the complete booking data
      const completeBookingData = {
        ...bookingData,
        end_date: endDate,
        amount: parseFloat(totalAmount)
      };
      
      console.log("Submitting booking data:", completeBookingData);
      
      // Get CSRF token first (for Laravel Sanctum)
      await axios.get('http://127.0.0.1:8000/sanctum/csrf-cookie', { withCredentials: true });
      
      // Submit the booking data to the correct endpoint
      const response = await axios.post(
        'http://127.0.0.1:8000/api/create-booking', 
        completeBookingData, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          withCredentials: true
        }
      );
      
      console.log("Booking created successfully:", response.data);
      setSuccess(true);
      return response.data;
      
    } catch (err) {
      console.error("Error creating booking:", err);
      setError(
        err.response?.data?.message || 
        "Failed to create booking. Please try again."
      );
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { 
    createBooking, 
    isCreating, 
    error, 
    success, 
    setError, 
    setSuccess,
    calculateEndDate,
    calculateTotalAmount
  };
};

export default useCreateBooking;