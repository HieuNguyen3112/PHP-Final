import styled from "styled-components";
import Tag from "../../ui/Tag";
import { Flag } from "../../ui/Flag";
import Button from "../../ui/Button";
import { Link } from "react-router-dom";
import CheckoutButton from "./CheckoutButton";

const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;
  font-size: 1.4rem;
  padding: 0.8rem 0;
  border-bottom: 1px solid var(--color-grey-100);

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

function TodayItem({ activity }) {
  // Sử dụng optional chaining và kiểm tra an toàn trước khi truy cập thuộc tính
  const { id, status, guest, numNights } = activity || {};

  return (
    <StyledTodayItem>
      {/* Hiển thị Tag dựa trên trạng thái */}
      {status === "unconfirmed" && <Tag type="blue">Arriving</Tag>}
      {status === "checked_in" && <Tag type="green">Departed</Tag>}

      {/* Kiểm tra xem guest có tồn tại trước khi render Flag */}
      {guest?.countryFlag ? (
        <Flag src={guest.countryFlag} alt={`Flag of ${guest.country}`} />
      ) : (
        <span>No flag available</span>
      )}

      {/* Hiển thị tên khách nếu có */}
      <Guest>{guest?.fullName || "Unknown Guest"}</Guest>
      <div>{numNights || 0}</div>

      {/* Hiển thị nút hành động dựa trên trạng thái */}
      {status === "unconfirmed" && (
        <Button
          sizes="small"
          variations="primary"
          as={Link}
          to={`/checkin/${id}`}
        >
          Check in
        </Button>
      )}
      {status === "checked_in" && <CheckoutButton bookingId={id} />}
    </StyledTodayItem>
  );
}

export default TodayItem;
