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

const safeFormatDistance = (date) => {
  if (!date) return "date unknown";
  
  try {
    // If it's already a Date object
    if (date instanceof Date) {
      return formatDistanceFromNow(date.toISOString());
    }
    
    // If it's a string
    if (typeof date === 'string') {
      return formatDistanceFromNow(date);
    }
    
    // If it's a number (timestamp)
    if (typeof date === 'number') {
      return formatDistanceFromNow(new Date(date).toISOString());
    }
    
    // If it's something else, try to convert it
    return formatDistanceFromNow(new Date(date).toISOString());
  } catch (error) {
    console.error("Date formatting error:", error, date);
    return "date unknown";
  }
};

// Safe date formatting function
const safeFormat = (date, formatString) => {
  if (!date) return "unknown date";
  
  try {
    return format(new Date(date), formatString);
  } catch (error) {
    console.error("Date formatting error:", error, date);
    return "unknown date";
  }
};

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

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1.2rem;
  border-radius: 100px;
  font-size: 1.2rem;
  font-weight: 600;
  text-transform: uppercase;
  
  /* Status-specific styles */
  background-color: ${props => {
    if (props.status === 'checked_in') return 'var(--color-green-100)';
    if (props.status === 'checked_out') return 'var(--color-grey-100)';
    if (props.status === 'unconfirmed') return 'var(--color-yellow-100)';
    return 'var(--color-blue-100)'; // default
  }};
  
  color: ${props => {
    if (props.status === 'checked_in') return 'var(--color-green-700)';
    if (props.status === 'checked_out') return 'var(--color-grey-700)';
    if (props.status === 'unconfirmed') return 'var(--color-yellow-700)';
    return 'var(--color-blue-700)'; // default
  }};
`;

function isValidDate(date) {
  return date && !isNaN(Date.parse(date));
}

function BookingDataBox({ booking }) {
  // Extract booking data with defaults
  const {
    id,
    created_at,
    startDate,
    endDate,
    numNights,
    status,
    totalPrice,
    cabinName,
    guest,
  } = booking;

  // Extract guest data with defaults
  const { fullname = "Unknown Guest", email = "No Email Provided" } = guest || {};

  // Extract customer data (from either booking.customer or passed directly)
  const customer = booking.customer || booking.guest || {};
  const {
    phone = customer.phone_number,
    nationalID = customer.national_id,
    country = "N/A",
  } = customer;
  

  // Format the created_at date
  const formattedCreatedAt = created_at 
    ? format(new Date(created_at), "EEE, MMM dd yyyy, p")
    : format(new Date(), "EEE, MMM dd yyyy, p");

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
  {isValidDate(startDate) ? (
    <>
      {safeFormat(startDate, "EEE, MMM dd yyyy")}
      {" "}
      {isToday(new Date(startDate)) 
        ? "(Today)" 
        : `(${safeFormatDistance(startDate)})`}
      {" "}&mdash;{" "}
      {safeFormat(endDate, "EEE, MMM dd yyyy")}
    </>
  ) : (
    "Date information unavailable"
  )}
</p>
      </Header>

      <Section>
        <Guest>
          <p>{fullname}</p>
          <span>&bull;</span>
          <p>{email}</p>
          <span>&bull;</span>
          <StatusBadge status={status}>{status}</StatusBadge>
        </Guest>

        <CustomerDetails>
          <h3>Customer Details</h3>
          <p><strong>Name:</strong> {fullname}</p>
          <p><strong>Email:</strong> {email}</p>
          <p><strong>Phone:</strong> {phone}</p>
          <p><strong>National ID:</strong> {nationalID}</p>
          <p><strong>Country:</strong> {country}</p>
        </CustomerDetails>

        <DataItem icon={<HiOutlineCurrencyDollar />} label="Total Price">
          {formatCurrency(totalPrice)}
        </DataItem>
      </Section>

      <Footer>
        <p>
          Booked on {formattedCreatedAt}
        </p>
      </Footer>
    </StyledBookingDataBox>
  );
}

export default BookingDataBox;