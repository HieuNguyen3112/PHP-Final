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

      // Create payload
      const payload = {
        name: data.name,
      };

      // Handle avatar from file
      if (data.avatar && data.avatar instanceof File) {
        // Convert avatar file to base64
        const reader = new FileReader();
        return new Promise((resolve, reject) => {
          reader.readAsDataURL(data.avatar);
          reader.onload = async () => {
            payload.avatarImage = reader.result;

            try {
              const response = await axios.put(
                "http://127.0.0.1:8000/api/user/update-data", 
                payload, 
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                  },
                  withCredentials: true,
                }
              );

              setUpdateMessage(response.data.message || "User updated successfully!");
              resolve({ success: true, data: response.data });
            } catch (error) {
              const errorMessage = 
                error.response?.data?.message || 
                "Error updating user data";
              setUpdateError(errorMessage);
              reject({ success: false, error: errorMessage });
            } finally {
              setIsUpdating(false);
            }
          };
          reader.onerror = (error) => {
            setUpdateError("Error reading file");
            setIsUpdating(false);
            reject({ success: false, error: "Error reading file" });
          };
        });
      } 
      // Handle avatar from URL or imageUrl
      else if (data.avatarUrl || data.imageUrl) {
        // For AI-generated avatars, we need to fetch the image first
        try {
          const imageUrl = data.avatarUrl || data.imageUrl;
          const imageResponse = await axios.get(imageUrl, { responseType: 'blob' });
          const imageBlob = imageResponse.data;
          
          // Convert blob to base64
          const reader = new FileReader();
          return new Promise((resolve, reject) => {
            reader.readAsDataURL(imageBlob);
            reader.onload = async () => {
              payload.avatarImage = reader.result;
              
              try {
                const response = await axios.put(
                  "http://127.0.0.1:8000/api/user/update-data", 
                  payload, 
                  {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      Accept: "application/json",
                      "Content-Type": "application/json",
                    },
                    withCredentials: true,
                  }
                );

                setUpdateMessage(response.data.message || "User updated successfully!");
                resolve({ success: true, data: response.data });
              } catch (error) {
                const errorMessage = 
                  error.response?.data?.message || 
                  "Error updating user data";
                setUpdateError(errorMessage);
                reject({ success: false, error: errorMessage });
              } finally {
                setIsUpdating(false);
              }
            };
            reader.onerror = (error) => {
              setUpdateError("Error processing image");
              setIsUpdating(false);
              reject({ success: false, error: "Error processing image" });
            };
          });
        } catch (error) {
          setUpdateError("Error fetching image from URL");
          setIsUpdating(false);
          return { success: false, error: "Error fetching image from URL" };
        }
      }
      // Handle pic_id for existing images
      else if (data.pic_id) {
        payload.pic_id = data.pic_id;
        
        const response = await axios.put(
          "http://127.0.0.1:8000/api/user/update-data", 
          payload, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setUpdateMessage(response.data.message || "User updated successfully!");
        setIsUpdating(false);
        return { success: true, data: response.data };
      } 
      // Handle name update only
      else {
        const response = await axios.put(
          "http://127.0.0.1:8000/api/user/update-data", 
          payload, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );

        setUpdateMessage(response.data.message || "User updated successfully!");
        setIsUpdating(false);
        return { success: true, data: response.data };
      }
    } catch (error) {
      const errorMessage = 
        error.response?.data?.message || 
        "Error updating user data";
      setUpdateError(errorMessage);
      setIsUpdating(false);
      return { success: false, error: errorMessage };
    }
  };

  return { updateUser, isUpdating, updateError, updateMessage };
};

export default useUpdateUser;