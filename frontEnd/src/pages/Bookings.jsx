import { useSearchParams } from "react-router-dom";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import BookingTable from "../features/bookings/BookingTable";
import BookingTableOperations from "../features/bookings/BookingTableOperations";

function Bookings() {
  // Use search params to get filter and sort values
  const [searchParams] = useSearchParams();
  
  // Get filter and sort values from URL
  const filterValue = searchParams.get("status") || "all";
  const sortValue = searchParams.get("sortBy") || "startDate-desc";

  return (
    <> 
      <Row type="horizontal">
        <Heading as="h1">All bookings</Heading>
        <BookingTableOperations />
      </Row>

      <BookingTable filterValue={filterValue} sortValue={sortValue} />
    </>
  );
}

export default Bookings;