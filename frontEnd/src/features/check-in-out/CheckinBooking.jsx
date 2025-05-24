import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import BookingDataBox from "../../features/bookings/BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Checkbox from "../../ui/Checkbox";
import Spinner from "../../ui/Spinner";

import { useMoveBack } from "../../hooks/useMoveBack";
import { formatCurrency } from "../../utils/helpers";
import useCheckIn from "../../api/useCheckin";
import useGetSettings from "../../api/useGetSettings";
import useGetOneBooking from "../../api/useGetOneBooking";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

const GuestInputBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  margin-bottom: 2rem;

  label {
    font-weight: 500;
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 1.6rem;
  }

  input {
    width: 7rem;
    padding: 0.8rem;
    border: 1px solid var(--color-grey-300);
    border-radius: var(--border-radius-sm);
    font-family: inherit;
    font-size: 1.6rem;
    background-color: var(--color-grey-0);
  }

  .controls {
    display: flex;
    gap: 0.8rem;
  }

  button {
    background-color: var(--color-grey-100);
    border: none;
    border-radius: var(--border-radius-sm);
    padding: 0.6rem 1.2rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
  }

  button:hover {
    background-color: var(--color-grey-200);
  }

  .error {
    color: var(--color-red-700);
    font-size: 1.4rem;
  }
`;

function CheckinBooking() {
  const { id: bookingId } = useParams();
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const [numGuests, setNumGuests] = useState(1);
  const [guestError, setGuestError] = useState("");
  
  // Use custom hooks
  const { booking, isLoading: bookingLoading, error: bookingError } = useGetOneBooking(bookingId);
  const { settings, isLoading: settingsLoading, error: settingsError } = useGetSettings();
  const { checkInBooking, isCheckingIn } = useCheckIn();
  const moveBack = useMoveBack();
  
  // Set confirmPaid based on booking.isPaid
  useEffect(() => {
    if (booking) {
      setConfirmPaid(booking.isPaid || false);
    }
  }, [booking]);

  // Initialize numGuests when booking data is loaded
  useEffect(() => {
    if (booking) {
      setNumGuests(1); // Default to 1 guest
    }
  }, [booking]);

  // Show loading state while fetching data
  if (bookingLoading || settingsLoading) return <Spinner />;
  
  // Handle errors
  if (bookingError) return <div>Error loading booking: {bookingError}</div>;
  if (settingsError) return <div>Error loading settings: {settingsError}</div>;
  if (!booking) return <div>No booking found</div>;

  const {
    id,
    guest,
    totalPrice,
    hasBreakfast,
    numNights,
    cabinCapacity // Now coming directly from the booking data
  } = booking;

  // Use settings from the hook with proper naming convention
  const breakfastPrice = settings?.breakfastPrice || 15;
  // Use the cabin's capacity directly from booking data
  const maxGuests = cabinCapacity || settings?.maxGuestsPerBooking || 10;
  const optionalBreakfastPrice = breakfastPrice * numNights * numGuests;

  // Guest count handlers
  function handleGuestChange(e) {
    const value = parseInt(e.target.value);
    
    if (isNaN(value)) {
      setNumGuests(1);
      setGuestError("");
      return;
    }
    
    if (value < 1) {
      setNumGuests(1);
      setGuestError("Number of guests cannot be less than 1");
      return;
    }
    
    if (value > maxGuests) {
      setNumGuests(maxGuests);
      setGuestError(`Maximum ${maxGuests} guests allowed for this cabin`);
      return;
    }
    
    setNumGuests(value);
    setGuestError("");
  }

  function incrementGuests() {
    if (numGuests < maxGuests) {
      setNumGuests(prev => prev + 1);
      setGuestError("");
    } else {
      setGuestError(`Maximum ${maxGuests} guests allowed for this cabin`);
    }
  }

  function decrementGuests() {
    if (numGuests > 1) {
      setNumGuests(prev => prev - 1);
      setGuestError("");
    } else {
      setGuestError("Number of guests cannot be less than 1");
    }
  }

  // Handle check-in function
  async function handleCheckin() {
    if (!confirmPaid) return;
    
    try {
      // Calculate the new total price based on guests and breakfast
      const basePrice = totalPrice;
      const breakfastTotal = addBreakfast ? optionalBreakfastPrice : 0;
      const newTotalPrice = Number(basePrice) + Number(breakfastTotal);
      
      // Prepare data for check-in
      const checkInData = {
        num_guests: numGuests,
        has_breakfast: addBreakfast || hasBreakfast,
        amount: newTotalPrice
      };
      
      // Use the check-in hook with PUT method
      await checkInBooking(id, checkInData);
      
      // Handle successful check-in
      alert("Guest successfully checked in!");
      moveBack();
      
    } catch (err) {
      console.error("Check-in error:", err);
      alert("Failed to check in guest. Please try again.");
    }
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{id}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={{...booking, numGuests}} />

      <GuestInputBox>
        <label htmlFor="numGuests">Number of guests</label>
        <div className="input-row">
          <input 
            id="numGuests"
            type="number" 
            value={numGuests} 
            onChange={handleGuestChange}
            min="1"
            max={maxGuests}
          />
          <div className="controls">
            <button type="button" onClick={decrementGuests} disabled={numGuests <= 1}>−</button>
            <button type="button" onClick={incrementGuests} disabled={numGuests >= maxGuests}>+</button>
          </div>
        </div>
        {guestError && <p className="error">{guestError}</p>}
        <p>Maximum {maxGuests} guests allowed for this cabin</p>
      </GuestInputBox>

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((add) => !add);
              setConfirmPaid(false);
            }}
            id="breakfast"
          >
            Want to add breakfast for {numGuests} {numGuests === 1 ? 'guest' : 'guests'} at {formatCurrency(optionalBreakfastPrice)}?
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((confirm) => !confirm)}
          disabled={confirmPaid || isCheckingIn}
          id="confirm"
        >
          I confirmed that {guest.fullname} has paid the total amount of{" "}
          {addBreakfast ? (
            <>
              {formatCurrency(Number(totalPrice) + Number(optionalBreakfastPrice))}{" "}
              <span style={{ fontWeight: "normal" }}>
                ({formatCurrency(totalPrice)} + {formatCurrency(optionalBreakfastPrice)})
              </span>
            </>
          ) : (
            formatCurrency(totalPrice)
          )}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button 
          onClick={handleCheckin} 
          disabled={!confirmPaid || isCheckingIn}
        >
          {isCheckingIn ? "Checking in..." : `Check in ${numGuests} ${numGuests === 1 ? 'guest' : 'guests'}`}
        </Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;