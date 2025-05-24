import React, { useState } from "react";
import { HiArrowUpOnSquare, HiArrowDownOnSquare } from "react-icons/hi2";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import { useMoveBack } from "../../hooks/useMoveBack";
import Spinner from "../../ui/Spinner";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Empty from "../../ui/Empty";
import useDetailBooking from "../../api/useDetailBookings";
import useCheckout from "../../api/useCheckout";
import useDeleteBooking from "../../api/useDeleteBookings"; // Import the delete hook

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { id } = useParams();
  const { booking, loading, error, refetch } = useDetailBooking(id);
  const moveBack = useMoveBack();
  const navigate = useNavigate();

  const { checkoutBooking, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeleting } = useDeleteBooking(); // Add the delete hook

  if (loading) return <Spinner />;
  if (error) return <Empty resourceName="booking" />;
  if (!booking) {
    return <Empty resourceName="booking or required data" />;
  }

  const {
    id: bookingId,
    created_at,
    cabin_name: cabinName,
    guest_name: guestName,
    guest_email: guestEmail,
    start_date: startDate,
    end_date: endDate,
    nights: numNights,
    status,
    amount: totalPrice,
    customer,
  } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked_in": "green",
    "checked_out": "silver",
  };

  // Transform the data to match the structure expected by BookingDataBox
  const transformedBooking = {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    status,
    totalPrice,
    cabinName,
    guest: {
      fullname: guestName,
      email: guestEmail,
    },
    // Use the customer object directly as it contains all the needed fields
    customer: customer || {
      name: guestName,
      email: guestEmail,
      phone_number: "N/A",
      address: "N/A",
      national_id: "N/A",
      country: "N/A",
    },
  };

  function handleNavigateToCheckin() {
    navigate(`/checkin/${bookingId}`);
  }

  async function handleCheckout() {
    try {
      await checkoutBooking(bookingId);
      alert(`Checked out booking #${bookingId}`);
      refetch();
    } catch (error) {
      console.error("Error checking out booking:", error);
    }
  }

  // Fixed delete handler to actually call the deleteBooking function
  async function handleDelete() {
    try {
      await deleteBooking(bookingId);
      alert(`Booking #${bookingId} has been deleted successfully`);
      // Navigate back after successful deletion
      navigate(-1);
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Please try again.");
    }
  }

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status] || "blue"}>
            {status?.replace("-", " ") || "unknown"}
          </Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={transformedBooking} />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button
            icon={<HiArrowDownOnSquare />}
            onClick={handleNavigateToCheckin}
          >
            Check in
          </Button>
        )}

        {status === "checked_in" && (
          <Button
            icon={<HiArrowUpOnSquare />}
            onClick={handleCheckout}
            disabled={isCheckingOut}
          >
            {isCheckingOut ? "Checking out..." : "Check out"}
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <Button variation="danger" disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Booking"}
            </Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              onConfirm={handleDelete}
              disabled={isDeleting}
            />
          </Modal.Window>
        </Modal>

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;