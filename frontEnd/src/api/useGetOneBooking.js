import { useState, useEffect } from "react";
import axios from "axios";

function useGetOneBooking(bookingId) {
  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/bookings/${bookingId}/details`, {
          withCredentials: true
        });
        
        if (response.data.success) {
          const bookingData = response.data.booking;
          
          // Transform the data to match the structure expected by BookingDataBox
          // Now including cabin capacity from the enhanced API response
          const transformedBooking = {
            id: bookingData.id,
            cabin_id: bookingData.cabin_id,
            cabinName: bookingData.cabin_name,
            cabinCapacity: bookingData.capacity, // Now directly available from API
            guest: { 
              fullname: bookingData.guest_name,
              email: bookingData.guest_email,
              // Add other guest details from customer object if needed
              ...(bookingData.customer ? {
                phone: bookingData.customer.phone_number,
                nationalID: bookingData.customer.national_id,
                country: bookingData.customer.country
              } : {})
            },
            totalPrice: bookingData.amount,
            numNights: bookingData.nights,
            status: bookingData.status,
            startDate: new Date(bookingData.start_date),
            endDate: new Date(bookingData.end_date),
            numGuests: 1, // Default to 1 guest
            hasBreakfast: false, // Default to false if not available
            isPaid: bookingData.status === 'checked_in' || bookingData.status === 'checked_out',
          };
          
          setBooking(transformedBooking);
        } else {
          throw new Error(response.data.message || "Failed to fetch booking details");
        }
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(err.message || "Failed to fetch booking details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  return { booking, isLoading, error };
}

export default useGetOneBooking;