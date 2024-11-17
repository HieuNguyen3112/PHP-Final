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
import useCheckIn from "../../api/useCheckin";
import useCheckout from "../../api/useCheckout"; // Import thêm useCheckout

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const { id } = useParams();
  const { booking, loading, error, refetch } = useDetailBooking(id); // Thêm `refetch` từ useDetailBooking
  const moveBack = useMoveBack();
  const navigate = useNavigate();

  const { checkInBooking, isCheckingIn } = useCheckIn(); // Hook check-in
  const { checkoutBooking, isCheckingOut } = useCheckout(); // Hook checkout

  if (loading) return <Spinner />;
  if (error) return <Empty resourceName="booking" />;
  if (!booking) {
    return <Empty resourceName="booking or required data" />;
  }

  const {
    id: bookingId,
    cabin_name,
    guest_name,
    guest_email,
    start_date,
    end_date,
    nights,
    status,
    amount,
    customer,
  } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  // Hàm xử lý `checkin`
  async function handleCheckIn() {
    try {
      await checkInBooking(bookingId);
      alert(`Checked in booking #${bookingId}`);
      refetch(); // Gọi lại API để cập nhật trạng thái
    } catch (error) {
      console.error("Error checking in booking:", error);
    }
  }

  // Hàm xử lý `checkout`
  async function handleCheckout() {
    try {
      await checkoutBooking(bookingId);
      alert(`Checked out booking #${bookingId}`);
      refetch(); // Gọi lại API để cập nhật trạng thái
    } catch (error) {
      console.error("Error checking out booking:", error);
    }
  }

  // Hàm xử lý `deleteBooking`
  async function handleDelete() {
    try {
      alert(`Deleted booking #${bookingId}`);
      navigate(-1);
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  }

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingId}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      {/* Gửi dữ liệu booking và customer vào BookingDataBox */}
      <BookingDataBox
        booking={{
          cabin_name,
          guest_name,
          guest_email,
          start_date,
          end_date,
          nights,
          amount,
        }}
        customer={customer}
      />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button
            icon={<HiArrowDownOnSquare />}
            onClick={handleCheckIn}
            disabled={isCheckingIn}
          >
            {isCheckingIn ? "Checking in..." : "Check in"}
          </Button>
        )}

        {status === "checked-in" && (
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
            <Button variations="danger">Delete Booking</Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              onConfirm={handleDelete}
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
