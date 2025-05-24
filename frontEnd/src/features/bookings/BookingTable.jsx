import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";
import useGetAllBooking from "../../api/useBookings";
import { useEffect } from "react";

function BookingTable({ filterValue, sortValue }) {
  // Pass filter and sort values to the hook
  const { bookings, loading, error, refetch } = useGetAllBooking(filterValue, sortValue);

  // Only refetch when filter or sort values change, NOT when refetch changes
  useEffect(() => {
    // This will only run when filterValue or sortValue changes
    // We don't need to call refetch here since the hook already responds to these changes
  }, [filterValue, sortValue]); // Remove refetch from dependencies

  const count = bookings?.length || 0;

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;
  if (!bookings || bookings.length === 0) return <Empty resourceName="bookings" />;

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body
          data={bookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />

        <Table.Footer>
          <Pagination count={count} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}

export default BookingTable;