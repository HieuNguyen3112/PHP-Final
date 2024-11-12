import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

function UpdatePasswordForm() {
  const { register, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;

  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");

  // Hàm tĩnh mô phỏng cập nhật mật khẩu
  function updatePassword({ password }) {
    setIsUpdating(true);
    setTimeout(() => {
      setMessage("Password updated successfully!");
      setIsUpdating(false);
      reset();
    }, 1500);
  }

  function onSubmit({ password }) {
    updatePassword({ password });
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow
        label="Password (min 8 characters)"
        error={errors?.password?.message}
      >
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
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

      {message && <p style={{ color: "green" }}>{message}</p>}

      <FormRow>
        <Button onClick={reset} type="reset" variations="secondary">
          Cancel
        </Button>
        <Button disabled={isUpdating}>
          {isUpdating ? "Updating..." : "Update password"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default UpdatePasswordForm;
