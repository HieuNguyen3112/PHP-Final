import { useState } from "react";
import axios from "axios";

const useUpdateUser = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");

  const updateUser = async (data) => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateMessage("");

    try {
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

      const token = localStorage.getItem("token");

      // Tạo payload JSON
      const payload = {
        name: data.name,
      };

      if (data.avatar) {
        // Chuyển đổi file ảnh thành base64
        const reader = new FileReader();
        reader.readAsDataURL(data.avatar);
        reader.onload = async () => {
          payload.avatarImage = reader.result;

          // Gửi dữ liệu JSON
          try {
            const response = await axios.put("http://127.0.0.1:8000/api/user/update-data", payload, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              withCredentials: true,
            });

            setUpdateMessage(response.data.message || "User updated successfully!");
          } catch (error) {
            setUpdateError("Lỗi khi cập nhật thông tin người dùng.");
          } finally {
            setIsUpdating(false);
          }
        };
      } else {
        // Gửi yêu cầu nếu không có ảnh đại diện
        const response = await axios.put("http://127.0.0.1:8000/api/user/update-data", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        });

        setUpdateMessage(response.data.message || "User updated successfully!");
      }
    } catch (error) {
      setUpdateError("Lỗi khi cập nhật thông tin người dùng.");
    } finally {
      setIsUpdating(false);
    }
  };

  return { updateUser, isUpdating, updateError, updateMessage };
};

export default useUpdateUser;
