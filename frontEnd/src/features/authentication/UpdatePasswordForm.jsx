import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import useUpdatePassword from "../../api/useUpdatePassword";

function UpdatePasswordForm() {
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const { updatePassword, isUpdating, error, message } = useUpdatePassword();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  async function onSubmit(data) {
    const result = await updatePassword({
      password: data.password,
      passwordConfirm: data.passwordConfirm
    });
    
    if (result.success) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      reset();
    }
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Success message */}
      {showSuccessMessage && (
        <div className="notification success">
          Password Updated Successfully
        </div>
      )}
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow
          label="New Password (min 8 characters)"
          error={errors?.password?.message}
        >
          <Input
            type="password"
            id="password"
            autoComplete="new-password"
            disabled={isUpdating}
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password needs a minimum of 8 characters",
              },
            })}
          />
        </FormRow>

        <FormRow label="Confirm password" error={errors?.passwordConfirm?.message}>
          <Input
            type="password"
            autoComplete="new-password"
            id="passwordConfirm"
            disabled={isUpdating}
            {...register("passwordConfirm", {
              required: "This field is required",
              validate: (value, formValues) => {
                return formValues.password === value || "Passwords need to match";
              },
            })}
          />
        </FormRow>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {message && !showSuccessMessage && <p style={{ color: "green" }}>{message}</p>}

        <FormRow>
          <Button onClick={reset} type="reset" variations="secondary" disabled={isUpdating}>
            Cancel
          </Button>
          <Button disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update password"}
          </Button>
        </FormRow>
      </Form>
      
      {/* Styling for notification */}
      <style jsx="true">{`
        .notification {
          position: absolute;
          top: -40px;
          width: 100%;
          padding: 10px;
          text-align: center;
          border-radius: 5px;
          color: white;
          font-weight: bold;
        }
        .notification.success {
          background-color: #4caf50;
        }
      `}</style>
    </div>
  );
}

export default UpdatePasswordForm;