import { useState } from "react";
import styled from "styled-components";
import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useNavigate } from "react-router-dom";
import { HiArrowUpOnSquare } from "react-icons/hi2";
import Spinner from "../../ui/Spinner";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Empty from "../../ui/Empty";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
  const moveBack = useMoveBack();
  const navigate = useNavigate();

  const [isCheckingout, setIsCheckingout] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Dữ liệu tĩnh giả lập cho `booking`
  const booking = {
    id: 1,
    status: "checked-in",
    guest: {
      fullName: "John Doe",
      country: "USA",
    },
    cabin: "Cabin A",
    numNights: 3,
  };

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resourceName="booking" />;

  const { status, id: bookingId } = booking;

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  // Hàm tĩnh mô phỏng `checkout`
  function handleCheckout() {
    setIsCheckingout(true);
    setTimeout(() => {
      alert(`Checked out booking #${bookingId}`);
      setIsCheckingout(false);
    }, 1500);
  }

  // Hàm tĩnh mô phỏng `deleteBooking`
  function handleDelete() {
    setIsDeleting(true);
    setTimeout(() => {
      alert(`Deleted booking #${bookingId}`);
      setIsDeleting(false);
      navigate(-1);
    }, 1500);
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

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {status === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${bookingId}`)}>
            Check in
          </Button>
        )}

        {status === "checked-in" && (
          <Button
            icon={<HiArrowUpOnSquare />}
            onClick={handleCheckout}
            disabled={isCheckingout}
          >
            {isCheckingout ? "Checking out..." : "Check out"}
          </Button>
        )}

        <Modal>
          <Modal.Open opens="delete">
            <Button variations="danger">Delete Booking</Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              disabled={isDeleting}
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
