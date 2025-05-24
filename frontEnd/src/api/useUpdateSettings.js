import { useState } from "react";
import axios from "axios";

function useUpdateSettings() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Function to transform frontend field names to backend field names
  const transformFieldName = (fieldName) => {
    const fieldMap = {
      minBookingLength: "min_nights_booking",
      maxBookingLength: "max_nights_booking",
      maxGuestsPerBooking: "max_guests_booking",
      breakfastPrice: "breakfast_price"
    };
    
    return fieldMap[fieldName] || fieldName;
  };

  const updateSetting = async (updatedField) => {
    setIsUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);
    
    try {
      // Get CSRF token
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
        withCredentials: true
      });
      
      // Get current settings first
      const currentSettings = await axios.get("http://127.0.0.1:8000/api/settings", {
        withCredentials: true
      });
      
      // Prepare data for update
      const fieldName = Object.keys(updatedField)[0];
      const fieldValue = updatedField[fieldName];
      const backendFieldName = transformFieldName(fieldName);
      
      // Create update payload with all required fields
      const updateData = {
        min_nights_booking: currentSettings.data.min_nights_booking,
        max_nights_booking: currentSettings.data.max_nights_booking,
        max_guests_booking: currentSettings.data.max_guests_booking,
        breakfast_price: currentSettings.data.breakfast_price,
        [backendFieldName]: fieldValue
      };
      
      // Send update request
      const response = await axios.put(
        "http://127.0.0.1:8000/api/settings",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true
        }
      );
      
      setUpdateSuccess(true);
      return response.data;
    } catch (err) {
      console.error("Error updating setting:", err);
      setUpdateError("Failed to update setting. Please try again.");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };
  
  return { updateSetting, isUpdating, updateError, updateSuccess };
}

export default useUpdateSettings;