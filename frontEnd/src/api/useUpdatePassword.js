import { useState } from "react";
import axios from "axios";

const useUpdatePassword = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const updatePassword = async ({ password, passwordConfirm }) => {
    setIsUpdating(true);
    setError(null);
    setMessage("");

    try {
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://127.0.0.1:8000/api/user/update-password",
        {
          password,
          password_confirmation: passwordConfirm,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setMessage(response.data.message || "Password updated successfully!");
      return { success: true };
    } catch (err) {
      const errorMessage = 
        err.response?.data?.message || 
        "Error updating password. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsUpdating(false);
    }
  };

  return { updatePassword, isUpdating, error, message };
};

export default useUpdatePassword;