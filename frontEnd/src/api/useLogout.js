import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const [isPending, setIsPending] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsPending(true);

    try {
      // Gọi Sanctum CSRF nếu cần thiết cho xác thực
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        withCredentials: true,
      });

      // Gọi API đăng xuất
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Gửi token nếu cần
          },
          withCredentials: true,
        }
      );

      // Xóa token khỏi local storage
      localStorage.removeItem("token");

      // Chuyển hướng đến trang đăng nhập
      navigate("/login");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
      alert("Có lỗi xảy ra trong quá trình đăng xuất. Vui lòng thử lại.");
    } finally {
      setIsPending(false);
    }
  };

  return {
    handleLogout,
    isPending,
  };
};

export default useLogout;
