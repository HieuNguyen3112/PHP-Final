import { useState } from "react";
import Button from "../../ui/Button";

function CheckoutButton({ bookingId }) {
  const [isCheckingout, setIsCheckingout] = useState(false);

  // Hàm tĩnh mô phỏng quá trình checkout
  function handleCheckout() {
    setIsCheckingout(true);

    // Giả lập thời gian xử lý checkout
    setTimeout(() => {
      alert(`Checked out booking with ID: ${bookingId}`);
      setIsCheckingout(false);
    }, 1000);
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
