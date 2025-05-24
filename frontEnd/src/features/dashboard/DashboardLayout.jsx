import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import Stats from "./Stats";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";
import { useMemo } from 'react';
import { subDays, isAfter, parseISO, differenceInDays } from 'date-fns';
import useGetAllBooking from "../../api/useBookings";
import useGetCabins from "../../api/useGetCabinsSmall";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout({ numDays }) {
  // Fetch all bookings and cabins
  const { bookings, loading: bookingsLoading } = useGetAllBooking();
  const { cabins, isLoading: cabinsLoading } = useGetCabins();

  // Calculate the start date for filtering (last X days)
  const today = new Date();
  const startDate = subDays(today, numDays);

  // Process data based on the selected time period
  const data = useMemo(() => {
    // Filter bookings for the selected period
    const filteredBookings = bookings.filter(booking => {
      if (!booking.startDate) return false;
      const bookingDate = parseISO(booking.startDate);
      return isAfter(bookingDate, startDate) || differenceInDays(bookingDate, startDate) === 0;
    });

    // Get only checked-in and checked-out stays
    const confirmedStays = filteredBookings.filter(
      booking => booking.status === "checked_in" || booking.status === "checked_out"
    );

    // Calculate today's activities (arrivals and departures)
    const todayActivities = bookings.filter(booking => {
      if (!booking.startDate) return false;
      const bookingDate = parseISO(booking.startDate);
      return differenceInDays(bookingDate, today) === 0;
    });

    return {
      bookings: filteredBookings,
      confirmedStays,
      todayActivities,
      cabinCount: cabins.length || 0
    };
  }, [bookings, cabins, startDate, today]);

  const isLoading = bookingsLoading || cabinsLoading;

  if (isLoading) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={data.bookings}
        confirmedStays={data.confirmedStays}
        numDays={numDays}
        cabinCount={data.cabinCount}
      />
      <TodayActivity activities={data.todayActivities} />
      <DurationChart confirmedStays={data.confirmedStays} />
      <SalesChart bookings={data.bookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;