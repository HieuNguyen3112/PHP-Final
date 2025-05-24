import { useState, useEffect } from "react";
import axios from "axios";

function useGetSettings() {
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get CSRF token
        await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie", {
          withCredentials: true
        });
        
        // Fetch settings
        const response = await axios.get("http://127.0.0.1:8000/api/settings", {
          withCredentials: true
        });
        
        // Transform the data to match the frontend naming convention
        const transformedSettings = {
          minBookingLength: response.data.min_nights_booking,
          maxBookingLength: response.data.max_nights_booking,
          maxGuestsPerBooking: response.data.max_guests_booking,
          breakfastPrice: response.data.breakfast_price
        };
        
        setSettings(transformedSettings);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError("Failed to load settings. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchSettings();
  }, []);
  
  return { settings, isLoading, error };
}

export default useGetSettings;