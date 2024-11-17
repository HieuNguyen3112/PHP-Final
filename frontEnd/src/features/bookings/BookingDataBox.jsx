import styled from "styled-components";
import { format, isToday } from "date-fns";
import {
  HiOutlineChatBubbleBottomCenterText,
  HiOutlineCheckCircle,
  HiOutlineCurrencyDollar,
  HiOutlineHomeModern,
} from "react-icons/hi2";

import DataItem from "../../ui/DataItem";
import { Flag } from "../../ui/Flag";

import { formatDistanceFromNow, formatCurrency } from "../../utils/helpers";

const StyledBookingDataBox = styled.section`
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  overflow: hidden;
`;

const Header = styled.header`
  background-color: var(--color-brand-500);
  padding: 2rem 4rem;
  color: #e0e7ff;
  font-size: 1.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: space-between;

  svg {
    height: 3.2rem;
    width: 3.2rem;
  }

  & div:first-child {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    font-weight: 600;
    font-size: 1.8rem;
  }

  & span {
    font-family: "Sono";
    font-size: 2rem;
    margin-left: 4px;
  }
`;

const Section = styled.section`
  padding: 3.2rem 4rem 1.2rem;
`;

const Guest = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  color: var(--color-grey-500);

  & p:first-of-type {
    font-weight: 500;
    color: var(--color-grey-700);
  }
`;

const Footer = styled.footer`
  padding: 1.6rem 4rem;
  font-size: 1.2rem;
  color: var(--color-grey-500);
  text-align: right;
`;

const CustomerDetails = styled.div`
  margin-top: 2rem;
  padding: 1.6rem 3.2rem;
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-sm);
  background-color: var(--color-grey-50);

  & p {
    margin: 0.8rem 0;
    font-size: 1.4rem;
  }
`;

function isValidDate(date) {
  return date && !isNaN(Date.parse(date));
}

function BookingDataBox({ booking, customer }) {
  const {
    created_at,
    start_date: startDate,
    end_date: endDate,
    nights: numNights = 0,
    guest_name: guestName = "Unknown Guest",
    guest_email: email = "No Email Provided",
    cabin_name: cabinName = "Unknown Cabin",
    amount: totalPrice = 0,
  } = booking;

  const {
    name: customerName = "N/A",
    email: customerEmail = "N/A",
    phone_number: phoneNumber = "N/A",
    address = "N/A",
    national_id: nationalID = "N/A",
    country = "N/A",
  } = customer || {};

  return (
    <StyledBookingDataBox>
      <Header>
        <div>
          <HiOutlineHomeModern />
          <p>
            {numNights} nights in Cabin <span>{cabinName}</span>
          </p>
        </div>

        <p>
          {isValidDate(startDate)
            ? format(new Date(startDate), "EEE, MMM dd yyyy")
            : "Start date unknown"}{" "}
          (
          {isValidDate(startDate) && isToday(new Date(startDate))
            ? "Today"
            : isValidDate(startDate)
            ? formatDistanceFromNow(startDate)
            : ""}
          ){" "}
          &mdash;{" "}
          {isValidDate(endDate)
            ? format(new Date(endDate), "EEE, MMM dd yyyy")
            : "End date unknown"}
        </p>
      </Header>

      <Section>
        <Guest>
          <p>{guestName}</p>
          <span>&bull;</span>
          <p>{email}</p>
        </Guest>

        <CustomerDetails>
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> {customerName}</p>
          <p><strong>Email:</strong> {customerEmail}</p>
          <p><strong>Phone:</strong> {phoneNumber}</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>National ID:</strong> {nationalID}</p>
          <p><strong>Country:</strong> {country}</p>
        </CustomerDetails>

        <DataItem icon={<HiOutlineCurrencyDollar />} label="Total Price">
          {formatCurrency(totalPrice)}
        </DataItem>
      </Section>

      <Footer>
        <p>
          {isValidDate(created_at)
            ? `Booked on ${format(new Date(created_at), "EEE, MMM dd yyyy, p")}`
            : "Booking date unknown"}
        </p>
      </Footer>
    </StyledBookingDataBox>
  );
}

export default BookingDataBox;
