import { useState, useEffect } from "react";
import axios from "axios";

const useGetAllBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        // Lấy CSRF cookie
        await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

        // Gọi API lấy danh sách booking với credentials
        const response = await axios.get("http://127.0.0.1:8000/api/bookings", {
          withCredentials: true, // Bật chế độ gửi credentials
        });

        // Chuẩn hóa dữ liệu bookings để đồng bộ với giao diện
        const normalizedBookings = response.data.bookings.map((booking) => {
          const startDate = booking.start_date
            ? new Date(booking.start_date).toISOString().split("T")[0]
            : null; // Nếu không có, gán null
          const endDate = booking.end_date
            ? new Date(booking.end_date).toISOString().split("T")[0]
            : null;

          return {
            id: booking.id,
            created_at: booking.created_at || "Unknown Date",
            startDate,
            endDate,
            numNights: booking.nights || 1,
            numGuests: booking.num_guests || 1,
            totalPrice: booking.amount || 0,
            status: booking.status || "unknown",
            guest: {
              fullName: booking.guest_name || "Unknown Guest",
              email: booking.guest_email || "No Email Provided",
            },
            cabins: {
              name: booking.cabin ? booking.cabin.name : "Unknown Cabin",
            },
          };
        });

        // Gán dữ liệu đã chuẩn hóa vào state
        setBookings(normalizedBookings);
      } catch (err) {
        // Gán thông báo lỗi vào state
        setError("Error fetching bookings");
      } finally {
        // Tắt trạng thái loading
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, loading, error };
};

export default useGetAllBooking;
