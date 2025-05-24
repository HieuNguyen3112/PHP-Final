import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useGetAllBooking = (filterValue = "all", sortValue = "startDate-desc") => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch bookings whenever filter, sort values, or refreshTrigger changes
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        // Get CSRF cookie
        await axios.get("http://127.0.0.1:8000/sanctum/csrf-cookie");

        // Call API to get booking list
        const response = await axios.get("http://127.0.0.1:8000/api/bookings", {
          withCredentials: true,
        });

        if (!response.data.success) {
          throw new Error("Failed to fetch bookings");
        }

        // Normalize booking data to match UI requirements
        const normalizedBookings = response.data.bookings.map((booking) => {
          const startDate = booking.start_date
            ? new Date(booking.start_date).toISOString().split("T")[0]
            : null;
          const endDate = booking.end_date
            ? new Date(booking.end_date).toISOString().split("T")[0]
            : null;
          return {
            id: booking.id,
            created_at: booking.created_at || "Unknown Date",
            startDate,
            endDate,
            numNights: booking.nights || 1,
            numGuests: booking.num_guests || 1,
            totalPrice: booking.amount || 0,
            status: booking.status || "unknown",
            guest: {
              fullName: booking.guest_name || "Unknown Guest",
              email: booking.guest_email || "No Email Provided",
              country: booking.customer.country || "vn",
            },
            cabinName: booking.cabin ? booking.cabin.name : "Unknown Cabin",
            cabins: {
              name: booking.cabin ? booking.cabin.name : "Unknown Cabin",
            }
          };
        });

        // Apply filtering
        let filteredBookings = [...normalizedBookings];
        if (filterValue && filterValue !== "all") {
          filteredBookings = filteredBookings.filter(
            booking => booking.status === filterValue
          );
        }

        // Apply sorting
        if (sortValue) {
          const [field, direction] = sortValue.split('-');
          
          filteredBookings.sort((a, b) => {
            let valueA, valueB;
            
            // Handle different sort fields
            switch (field) {
              case "startDate":
                valueA = new Date(a.startDate || 0).getTime();
                valueB = new Date(b.startDate || 0).getTime();
                break;
              case "totalPrice":
                valueA = parseFloat(a.totalPrice || 0);
                valueB = parseFloat(b.totalPrice || 0);
                break;
              case "cabinName":
                valueA = a.cabinName || "";
                valueB = b.cabinName || "";
                break;
              case "guestName":
                valueA = a.guest?.fullName || "";
                valueB = b.guest?.fullName || "";
                break;
              default:
                valueA = a[field];
                valueB = b[field];
            }
            
            // Handle direction
            if (direction === "asc") {
              return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
            } else {
              return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
            }
          });
        }

        setBookings(filteredBookings);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError(err.message || "Error fetching bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [filterValue, sortValue, refreshTrigger]); // Add refreshTrigger as dependency

  // Memoize the refetch function to maintain a stable reference
  const refetch = useCallback(() => {
    // Increment the refresh trigger to cause a re-fetch
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return { 
    bookings, 
    loading, 
    error,
    refetch
  };
};

export default useGetAllBooking;