import styled from "styled-components";
import { format, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiTrash,
} from "react-icons/hi2";
import Menus from "../../ui/Menus";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import useCheckoutBooking from "../../api/useCheckout";
import useDeleteBooking from "../../api/useDeleteBookings";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function BookingRow({
  booking: {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights = 1,
    numGuests = 1,
    totalPrice = 0,
    status = "unconfirmed",
    guest = {},
    cabins = {},
  },
  onDeleteSuccess, // Add this prop to handle refresh after deletion
}) {
  const navigate = useNavigate();
  const { checkoutBooking, isCheckingOut, checkoutError } = useCheckoutBooking();
  const { deleteBooking, isDeleting, deleteError } = useDeleteBooking();

  const statusToTagName = {
    unconfirmed: "blue",
    "checked_in": "green",
    "checked_out": "silver",
  };

  const handleCheckout = async () => {
    await checkoutBooking(bookingId);
    if (checkoutError) alert("Lỗi khi checkout booking");
    navigate(0);
  };

  // Fixed handleDelete function to actually call deleteBooking
  async function handleDelete() {
    try {
      // Call the deleteBooking function from the hook
      await deleteBooking(bookingId);
      
      // Show success message
      alert(`Booking #${bookingId} has been deleted successfully`);
      
      // Refresh the bookings list if a callback was provided
      //  onDeleteSuccess();
      
      // Alternative: refresh the current page
      navigate(0);
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert(`Failed to delete booking: ${deleteError || error.message}`);
    }
  }

  return (
    <Table.Row>
      <Cabin>{cabins?.name || "Unknown Cabin"}</Cabin>

      <Stacked>
        <span>{guest?.fullName || "Unknown Guest"}</span>
        <span>{guest?.email || "No Email Provided"}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={bookingId} />
          <Menus.List id={bookingId}>
            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`/bookings/${bookingId}`)}
            >
              See Details
            </Menus.Button>

            {status === "unconfirmed" && (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/checkin/${bookingId}`)}
              >
                Check in
              </Menus.Button>
            )}

            {status === "checked_in" && (
              <Menus.Button
                icon={<HiArrowUpOnSquare />}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? "Checking out..." : "Check out"}
              </Menus.Button>
              
            )}

            <Modal.Open opens="delete">
              <Menus.Button icon={<HiTrash />} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete booking"}
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>

        <Modal.Window name="delete">
          <ConfirmDelete
            resourceName="booking"
            onConfirm={handleDelete}
            disabled={isDeleting}
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}

export default BookingRow;
