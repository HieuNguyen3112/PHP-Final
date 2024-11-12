import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import Stats from "./Stats";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

function DashboardLayout() {
  // Dữ liệu tĩnh thay thế cho `useRecentBookings`, `useRecentStays`, và `useCabins`
  const bookings = [
    { id: 1, amount: 250 },
    { id: 2, amount: 400 },
    { id: 3, amount: 150 },
  ];

  const confirmedStays = [
    { id: 1, nights: 3 },
    { id: 2, nights: 5 },
  ];

  const cabins = [
    { id: 1, name: "Cabin A" },
    { id: 2, name: "Cabin B" },
    { id: 3, name: "Cabin C" },
  ];

  const numDays = 7; // Giả sử số ngày gần đây

  const isLoading = false; // Giả lập không tải dữ liệu

  if (isLoading) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings}
        confirmedStays={confirmedStays}
        numDays={numDays}
        cabinCount={cabins.length}
      />
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart bookings={bookings} numDays={numDays} />
    </StyledDashboardLayout>
  );
}

export default DashboardLayout;
