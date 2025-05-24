import { useEffect } from "react";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import useGetSettings from "../../api/useGetSettings";
import useUpdateSettings from "../../api/useUpdateSettings";
import { toast } from "react-hot-toast";

function UpdateSettingsForm() {
  // Use the hooks to get and update settings
  const { settings, isLoading, error } = useGetSettings();
  const { 
    updateSetting, 
    isUpdating, 
    updateError, 
    updateSuccess 
  } = useUpdateSettings();

  // Show success or error notifications
  useEffect(() => {
    if (updateSuccess) toast.success("Setting updated successfully");
    if (updateError) toast.error(updateError);
  }, [updateSuccess, updateError]);

  // Show error if fetching settings fails
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Handle updating a setting when the input loses focus
  async function handleUpdate(e, field) {
    const { value } = e.target;
    if (!value) return;
    
    const numericValue = Number(value);
    
    try {
      await updateSetting({ [field]: numericValue });
    } catch (err) {
      // Error is already handled in the hook
    }
  }

  if (isLoading) return <Spinner />;
  if (!settings) return <p>No settings found.</p>;

  return (
    <Form>
      <FormRow label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          defaultValue={settings.minBookingLength}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "minBookingLength")}
          min="1"
        />
      </FormRow>

      <FormRow label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          defaultValue={settings.maxBookingLength}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "maxBookingLength")}
          min="1"
        />
      </FormRow>

      <FormRow label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          defaultValue={settings.maxGuestsPerBooking}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "maxGuestsPerBooking")}
          min="1"
        />
      </FormRow>

      <FormRow label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={settings.breakfastPrice}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "breakfastPrice")}
          min="0"
          step="0.01"
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;