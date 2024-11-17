import { useState } from "react";
import axios from "axios";

const useCheckIn = () => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [checkInError, setCheckInError] = useState(null);

  const checkInBooking = async (bookingId) => {
    setIsCheckingIn(true);
    setCheckInError(null);

    try {
      // Lấy CSRF cookie trước khi gửi yêu cầu
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

      // Gửi yêu cầu check-in
      const response = await axios.post(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/checkin`,
        {},
        { withCredentials: true }
      );

      console.log("Check-in successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error during check-in:", error);
      setCheckInError("Failed to check in booking. Please try again.");
    } finally {
      setIsCheckingIn(false);
    }
  };

  return { checkInBooking, isCheckingIn, checkInError };
};

export default useCheckIn;
