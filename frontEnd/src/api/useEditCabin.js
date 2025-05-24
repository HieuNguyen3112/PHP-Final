import { useState } from "react";
import axios from "axios";
import { useCabinContext } from "../context/CabinContext";

const useEditCabin = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState(null);
  const { refreshCabins } = useCabinContext();

  const editCabin = async (cabinId, cabinData) => {
    setIsEditing(true);
    setEditError(null);

    try {
      // Get CSRF cookie before sending request
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

      // Prepare form data for multipart/form-data submission
      const formData = new FormData();
      
      // Add all cabin data to the form
      Object.keys(cabinData).forEach(key => {
        // Skip description field
        if (key === 'description') return;
        
        // Skip undefined/null values except for image which can be null
        if (cabinData[key] === undefined || cabinData[key] === null) {
          return;
        }
        
        // Handle image file specially
        if (key === 'image' && cabinData[key] instanceof File) {
          formData.append('image', cabinData[key]);
        } else {
          formData.append(key, cabinData[key]);
        }
      });

      // Send update cabin request
      const response = await axios.post(
        `http://127.0.0.1:8000/api/cabins/${cabinId}`,
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            'X-HTTP-Method-Override': 'PUT' // Laravel often needs this for PUT requests with form data
          }
        }
      );

      console.log("Cabin updated successfully:", response.data);
      
      // Refresh the cabin list automatically
      refreshCabins();
      
      return response.data;
    } catch (error) {
      console.error("Error updating cabin:", error);
      setEditError(
        error.response?.data?.message || "Failed to update cabin. Please try again."
      );
      throw error;
    } finally {
      setIsEditing(false);
    }
  };

  return { editCabin, isEditing, editError };
};

export default useEditCabin;