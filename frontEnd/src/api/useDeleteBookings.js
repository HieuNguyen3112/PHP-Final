import { useState } from "react";
import axios from "axios";

const useDeleteBooking = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState("");

  const deleteBooking = async (bookingId) => {
    setIsDeleting(true);
    setDeleteError(null);
    setDeleteMessage("");

    try {
      // Lấy CSRF cookie trước khi gửi yêu cầu xóa
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

      // Gửi yêu cầu xóa booking
      const response = await axios.delete(`http://127.0.0.1:8000/api/bookings/${bookingId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Gửi cookie cùng với yêu cầu
      });

      setDeleteMessage(response.data.message || "Booking deleted successfully");
    } catch (error) {
      setDeleteError("Lỗi khi xóa booking.");
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteBooking, isDeleting, deleteError, deleteMessage };
};

export default useDeleteBooking;
