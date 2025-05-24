import { useState } from "react";
import axios from "axios";

function useCreateUser() {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(null);

  const createUser = async (userData) => {
    setIsCreating(true);
    setError(null);
    setSuccess(false);
    setUserData(null);

    try {
      // Get CSRF token
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        withCredentials: true
      });

      // Map frontend field names to backend field names
      const requestData = {
        name: userData.fullName,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.passwordConfirm
      };

      // Send the create user request
      const response = await axios.post(
        "http://127.0.0.1:8000/api/create-user",
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );

      // Handle successful response
      setSuccess(true);
      setUserData(response.data.user);
      return response.data;
    } catch (err) {
      // Handle errors
      console.error("Error creating user:", err);
      
      // Extract error message from response if available
      if (err.response && err.response.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else if (err.response.data.errors) {
          // Handle validation errors
          const firstError = Object.values(err.response.data.errors)[0];
          setError(Array.isArray(firstError) ? firstError[0] : firstError);
        } else {
          setError("Failed to create user. Please try again.");
        }
      } else {
        setError("Network error. Please check your connection.");
      }
      
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return { 
    createUser, 
    isCreating, 
    error, 
    success, 
    userData 
  };
}

export default useCreateUser;