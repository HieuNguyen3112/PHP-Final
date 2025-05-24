import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const useGetCabins = () => {
  const [cabins, setCabins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [searchParams] = useSearchParams();

  // Get filter and sort parameters
  const filterValue = searchParams.get("discount") || "all";
  const sortValue = searchParams.get("sortBy") || "name-asc";

  // Function to trigger a refresh
  const refreshCabins = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    const fetchCabins = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Prepare query parameters for the API
        let params = {
          with_image: true,
        };

        // Map frontend sort values to backend sort fields
        if (sortValue) {
          const [field, direction] = sortValue.split("-");
          
          // Map frontend field names to backend field names
          const fieldMap = {
            name: "name",
            regularPrice: "price",
            maxCapacity: "capacity",
          };
          
          params.sort = fieldMap[field] || field;
          params.direction = direction;
        }

        // Add cache buster to prevent browser caching
        params._cacheBuster = new Date().getTime();

        console.log("Fetching cabins with params:", params);
        const response = await axios.get("http://127.0.0.1:8000/api/cabins", {
          params,
          withCredentials: true,
        });

        if (response.data.success) {
          console.log("Cabins fetched successfully:", response.data);
          // Transform the data to match the frontend structure
          const transformedCabins = response.data.data.data.map(cabin => ({
            id: cabin.id,
            name: cabin.name,
            maxCapacity: cabin.capacity,
            regularPrice: cabin.price,
            discount: cabin.discount,
            image: cabin.image_url || null,
            pic_id: cabin.pic_id,
          }));

          // Apply frontend filtering if needed
          let filteredCabins = transformedCabins;
          
          if (filterValue === "no-discount") {
            filteredCabins = transformedCabins.filter(cabin => cabin.discount === 0);
          } else if (filterValue === "with-discount") {
            filteredCabins = transformedCabins.filter(cabin => cabin.discount > 0);
          }

          setCabins(filteredCabins);
        } else {
          throw new Error(response.data.message || "Failed to fetch cabins");
        }
      } catch (err) {
        console.error("Error fetching cabins:", err);
        setError(err.message || "Failed to fetch cabins. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCabins();
  }, [filterValue, sortValue, refreshTrigger]); // refreshTrigger will cause re-fetch

  return { cabins, isLoading, error, refreshCabins };
};

export default useGetCabins;