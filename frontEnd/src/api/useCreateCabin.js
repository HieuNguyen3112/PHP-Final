import { useState } from "react";
import axios from "axios";
import { useCabinContext } from "../context/CabinContext";

const useCreateCabin = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState(null);
  const { refreshCabins } = useCabinContext();

  const createCabin = async (cabinData) => {
    setIsCreating(true);
    setCreateError(null);

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

      // Send create cabin request
      const response = await axios.post(
        "http://127.0.0.1:8000/api/cabins",
        formData,
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log("Cabin created successfully:", response.data);
      
      // Refresh the cabin list automatically
      refreshCabins();
      
      return response.data;
    } catch (error) {
      console.error("Error creating cabin:", error);
      setCreateError(
        error.response?.data?.message || "Failed to create cabin. Please try again."
      );
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createCabin, isCreating, createError };
};

export default useCreateCabin;