import { useState } from "react";
import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import Spinner from "../../ui/Spinner";
import Pagination from "../../ui/Pagination";

function BookingTable() {
  const [isLoading, setIsLoading] = useState(false);

  // Dữ liệu tĩnh giả lập cho `bookings`
  const bookings = [
    {
      id: 1,
      created_at: "2024-11-01",
      startDate: "2024-11-05",
      endDate: "2024-11-10",
      numNights: 5,
      numGuests: 2,
      totalPrice: 500,
      status: "checked-in",
      guest: {
        fullName: "John Doe",
        email: "johndoe@example.com",
      },
      cabins: {
        name: "Cabin A",
      },
    },
    {
      id: 2,
      created_at: "2024-11-02",
      startDate: "2024-11-07",
      endDate: "2024-11-12",
      numNights: 5,
      numGuests: 3,
      totalPrice: 750,
      status: "unconfirmed",
      guest: {
        fullName: "Jane Smith",
        email: "janesmith@example.com",
      },
      cabins: {
        name: "Cabin B",
      },
    },
  ];

  const count = bookings.length;

  if (isLoading) return <Spinner />;
  if (!bookings.length) return <Empty resourceName="bookings" />;

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
