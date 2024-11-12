import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

// Email regex: /\S+@\S+\.\S+/

function SignupForm() {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState("");

  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;

  function onSubmit({ fullName, email, password }) {
    setIsPending(true);

    // Mô phỏng quá trình đăng ký người dùng
    setTimeout(() => {
      // Kiểm tra dữ liệu tĩnh
      const mockEmail = "test@example.com";

      if (email === mockEmail) {
        setMessage("This email is already registered.");
      } else {
        setMessage("User registered successfully!");
      }

      setIsPending(false);
      reset();
    }, 1500);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isPending}
          {...register("fullName", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isPending}
          {...register("email", {
            required: "This field is required",
            pattern: {
              value: /\S+@\S+\.\S+/,
              message: "Please provide a valid email address",
            },
          })}
        />
      </FormRow>

      <FormRow label="Password (min 8 characters)" error={errors?.password?.message}>
        <Input
          type="password"
          id="password"
          disabled={isPending}
          {...register("password", {
            required: "This field is required",
            minLength: {
              value: 8,
              message: "Password needs a minimum of 8 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input
          type="password"
          id="passwordConfirm"
          disabled={isPending}
          {...register("passwordConfirm", {
            required: "This field is required",
            validate: (value, formValues) => {
              return value === formValues.password || "Passwords need to match";
            },
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          variations="secondary"
          type="reset"
          disabled={isPending}
          onClick={reset}
        >
          Cancel
        </Button>
        <Button disabled={isPending}>
          {!isPending ? "Create new user" : "Creating..."}
        </Button>
      </FormRow>

      {message && <p>{message}</p>}
    </Form>
  );
}

export default SignupForm;
