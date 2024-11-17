import { useState, useEffect } from "react";
import axios from "axios";

const useDetailBooking = (id) => {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Lấy cookie CSRF trước khi gọi API
        await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

        // Gọi API lấy thông tin chi tiết của booking
        const response = await axios.get(
          `http://127.0.0.1:8000/api/bookings/${id}/details`,
          { withCredentials: true }
        );

        // Kiểm tra dữ liệu trả về
        const bookingData = response.data.booking;
        if (!bookingData) {
          throw new Error("Booking data is missing");
        }

        // Cập nhật state với thông tin booking
        setBooking(bookingData);

        // Log thông tin booking để kiểm tra
        console.log("Booking details:", bookingData);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        setError(err.message || "Error fetching booking details");
      } finally {
        setLoading(false);
      }
    };

    // Gọi hàm fetch dữ liệu
    fetchBookingDetails();
  }, [id]);

  return { booking, loading, error };
};

export default useDetailBooking;
