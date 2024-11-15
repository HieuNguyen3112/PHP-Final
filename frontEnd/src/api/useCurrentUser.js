import { useState, useEffect } from "react";
import axios from "axios";

const useCurrentUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

        const token = localStorage.getItem("token");
        const response = await axios.get("http://127.0.0.1:8000/api/current-user", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          withCredentials: true,
        });
        
        setUser(response.data.user);
      } catch (err) {
        setError("Lỗi khi lấy thông tin người dùng.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, isLoading, error };
};

export default useCurrentUser;
