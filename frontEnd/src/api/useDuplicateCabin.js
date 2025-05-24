import { useState } from "react";
import axios from "axios";
import { useCabinContext } from "../context/CabinContext";

const useDuplicateCabin = () => {
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [duplicateError, setDuplicateError] = useState(null);
  const { refreshCabins } = useCabinContext();

  const duplicateCabin = async (cabinId) => {
    setIsDuplicating(true);
    setDuplicateError(null);

    try {
      // Get CSRF cookie before sending request
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

      // Send duplicate cabin request
      const response = await axios.post(
        `http://127.0.0.1:8000/api/cabins/${cabinId}/duplicate`,
        {},
        { withCredentials: true }
      );

      console.log("Cabin duplicated successfully:", response.data);
      
      // Refresh the cabin list automatically
      refreshCabins();
      
      return response.data;
    } catch (error) {
      console.error("Error duplicating cabin:", error);
      setDuplicateError(
        error.response?.data?.message || "Failed to duplicate cabin. Please try again."
      );
      throw error;
    } finally {
      setIsDuplicating(false);
    }
  };

  return { duplicateCabin, isDuplicating, duplicateError };
};

export default useDuplicateCabin;