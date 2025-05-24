import { useState } from "react";
import axios from "axios";

const useCheckIn = () => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInError, setCheckInError] = useState(null);

  const checkInBooking = async (bookingId, checkInData) => {
    setIsCheckingIn(true);
    setCheckInError(null);

    try {
      // Get CSRF cookie before sending the request
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

      // Send PUT request for check-in
      const response = await axios.put(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/checkin`,
        checkInData,
        { withCredentials: true }
      );

      console.log("Check-in successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during check-in:", error);
      setCheckInError("Failed to check in booking. Please try again.");
      throw error;
    } finally {
      setIsCheckingIn(false);
    }
  };

  return { checkInBooking, isCheckingIn, checkInError };
};

export default useCheckIn;