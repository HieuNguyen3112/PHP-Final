import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useDetailBooking = (id) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use useCallback to memoize the fetchBookingDetails function
  const fetchBookingDetails = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);

    try {
      // Get CSRF cookie before calling API
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        withCredentials: true
      });

      // Call API to get booking details
      const response = await axios.get(
        `http://127.0.0.1:8000/api/bookings/${id}/details`,
        { withCredentials: true }
      );

      // Check if response is successful
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch booking details");
      }

      // Check if booking data exists
      const bookingData = response.data.booking;
      if (!bookingData) {
        throw new Error("Booking data is missing");
      }

      // Update state with booking information
      setBooking(bookingData);

      // Log booking information for debugging
      console.log("Booking details fetched successfully:", bookingData);
    } catch (err) {
      console.error("Error fetching booking details:", err);
      setError(err.message || "Error fetching booking details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Initial fetch on component mount or id change
  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  // Return the refetch function along with state
  return { 
    booking, 
    loading, 
    error, 
    refetch: fetchBookingDetails 
  };
};

export default useDetailBooking;