import { useState } from "react";
import axios from "axios";

const useCheckoutBooking = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkoutMessage, setCheckoutMessage] = useState("");

  const checkoutBooking = async (bookingId) => {
    setIsCheckingOut(true);
    setCheckoutError(null);
    setCheckoutMessage("");

    try {
      // Lấy CSRF cookie trước khi gửi yêu cầu
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

      // Gửi yêu cầu checkout
      const response = await axios.post(
        `http://127.0.0.1:8000/api/bookings/${bookingId}/checkout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, 
        }
      );

      setCheckoutMessage(response.data.message || "Booking checked out successfully");
    } catch (error) {
      setCheckoutError("Lỗi khi thực hiện checkout booking.");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return { checkoutBooking, isCheckingOut, checkoutError, checkoutMessage };
};

export default useCheckoutBooking;
