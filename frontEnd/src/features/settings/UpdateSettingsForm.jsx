import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { useState } from "react";

function UpdateSettingsForm() {
  // Dữ liệu tĩnh thay thế cho `useSettings`
  const settings = {
    minBookingLength: 2,
    maxBookingLength: 14,
    maxGuestsPerBooking: 6,
    breakfastPrice: 15,
  };

  // State để mô phỏng việc cập nhật
  const [isUpdating, setIsUpdating] = useState(false);

  // Mô phỏng hàm `updateSetting`
  function updateSetting(updatedField) {
    setIsUpdating(true);
    setTimeout(() => {
      console.log("Updated setting:", updatedField);
      setIsUpdating(false);
    }, 1000); // Mô phỏng thời gian cập nhật
  }

  function handleUpdate(e, field) {
    const { value } = e.target;
    if (!value) return;

    updateSetting({ [field]: value });
  }

  // Giả lập isLoading (có thể bỏ nếu không cần thiết)
  const isLoading = false;
  if (isLoading) return <Spinner />;

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          defaultValue={settings.minBookingLength}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "minBookingLength")}
        />
      </FormRow>

      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          defaultValue={settings.maxBookingLength}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "maxBookingLength")}
        />
      </FormRow>

      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          defaultValue={settings.maxGuestsPerBooking}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "maxGuestsPerBooking")}
        />
      </FormRow>

      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={settings.breakfastPrice}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "breakfastPrice")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
