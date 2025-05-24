import { useState, useEffect } from "react";
import axios from "axios";

const useGetCabinN = (cabinId) => {
  const [cabin, setCabin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCabin = async () => {
      if (!cabinId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log(`Fetching cabin with ID: ${cabinId}`);
        const response = await axios.get(`http://127.0.0.1:8000/api/cabins/${cabinId}`, {
          
            with_image: false
          ,
          withCredentials: true,
        });

        if (response.data.success) {
          console.log("Cabin fetched successfulsssssly:", response.data);
          
          // Transform the data to match the frontend structure
          const cabinData = response.data.data;
          const transformedCabin = {
            id: cabinData.id,
            name: cabinData.name,
            maxCapacity: cabinData.capacity,
            regularPrice: cabinData.price,
            discount: cabinData.discount,
            image: cabinData.image_url || null,
            pic_id: cabinData.pic_id,
          };

          setCabin(transformedCabin);
        } else {
          throw new Error(response.data.message || "Failed to fetch cabin");
        }
      } catch (err) {
        console.error("Error fetching cabin:", err);
        setError(err.message || "Failed to fetch cabin details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCabin();
  }, [cabinId]); // Re-fetch when cabinId changes

  return { cabin, isLoading, error };
};

export default useGetCabinN;