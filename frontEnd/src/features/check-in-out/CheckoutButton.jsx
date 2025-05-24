import { useState } from "react";
import Button from "../../ui/Button";
import useCheckoutBooking from "../../api/useCheckout";
import { useNavigate } from "react-router-dom";

function CheckoutButton({ bookingId }) {
  const [isCheckingout, setIsCheckingout] = useState(false);
  const { checkoutBooking } = useCheckoutBooking();
  const navigate = useNavigate(); 
  async function handleCheckout() {
    setIsCheckingout(true);

    try {
      // Call the real API function from the hook
      await checkoutBooking(bookingId);
      
      // Display alert message after successful checkout
      alert(`Checked out booking with ID: ${bookingId}`);
    } catch (error) {
      // If there's an error, alert with error message
      alert(`Error checking out booking: ${error.message || "Unknown error"}`);
    } finally {
      // Reset loading state
      
      setIsCheckingout(false);
      navigate(0);
    }
  }

  return (
    <Button
      variations="primary"
      sizes="small"
      onClick={handleCheckout}
      disabled={isCheckingout}
    >
      {isCheckingout ? "Checking out..." : "Check out"}
    </Button>
  );
}

export default CheckoutButton;