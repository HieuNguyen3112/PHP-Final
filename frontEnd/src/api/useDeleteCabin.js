import { useState } from "react";
import axios from "axios";
import { useCabinContext } from "../context/CabinContext";

const useDeleteCabin = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { refreshCabins } = useCabinContext();

  const deleteCabin = async (cabinId) => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      // Get CSRF cookie before sending request
      await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

      // Send delete cabin request
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/cabins/${cabinId}`,
        { withCredentials: true }
      );

      console.log("Cabin deleted successfully:", response.data);
      
      // Refresh the cabin list automatically
      refreshCabins();
      
      return response.data;
    } catch (error) {
      console.error("Error deleting cabin:", error);
      setDeleteError(
        error.response?.data?.message || "Failed to delete cabin. Please try again."
      );
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteCabin, isDeleting, deleteError };
};

export default useDeleteCabin;