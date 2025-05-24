import { HiOutlineBriefcase, HiOutlineChartBar } from "react-icons/hi";
import Stat from "./Stat";
import { HiOutlineBanknotes, HiOutlineCalendarDays } from "react-icons/hi2";
import { formatCurrency } from "../../utils/helpers";

function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
  // Total number of bookings in the selected period
  const numBookings = bookings.length;

  // Total sales from confirmed stays only (checked-in or checked-out)
  const sales = confirmedStays.reduce((acc, cur) => acc + Number(cur.totalPrice), 0);

  // Number of check-ins (guests with checked-in status)
  const checkins =  confirmedStays.filter(confirmedStays => confirmedStays.status === "checked_in").length;

  // Calculate occupancy rate
  // Total nights from confirmed stays / (total available nights in the period)
  const totalNights = confirmedStays.reduce((acc, cur) => acc + Number(cur.numNights), 0);
  const availableNights = numDays * cabinCount;
  const occupation = availableNights > 0 ? totalNights / availableNights : 0;

  return (
    <>
      <Stat
        title="Bookings"
        color="blue"
        icon={<HiOutlineBriefcase />}
        value={numBookings}
      />
      <Stat
        title="Sales"
        color="green"
        icon={<HiOutlineBanknotes />}
        value={formatCurrency(sales)}
      />
      <Stat
        title="Check ins"
        color="indigo"
        icon={<HiOutlineCalendarDays />}
        value={checkins}
      />
      <Stat
        title="Occupancy rate"
        color="yellow"
        icon={<HiOutlineChartBar />}
        value={Math.round(occupation * 100) + "%"}
      />
    </>
  );
}

export default Stats;