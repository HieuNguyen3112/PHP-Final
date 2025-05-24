import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Button from "../../ui/Button";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import useCreateUser from "../../api/useCreateUser";
import { toast } from "react-hot-toast";

function SignupForm() {
  const [message, setMessage] = useState("");
  
  // Use the custom hook for creating users
  const { 
    createUser, 
    isCreating, 
    error, 
    success, 
    userData 
  } = useCreateUser();

  const { register, formState, handleSubmit, reset } = useForm();
  const { errors } = formState;

  // Show success or error notifications
  useEffect(() => {
    if (success) {
      toast.success("User registered successfully!");
      setMessage("User registered successfully!");
      reset(); // Reset the form on success
    }
    
    if (error) {
      toast.error(error);
      setMessage(error);
    }
  }, [success, error, reset]);

  async function onSubmit(data) {
    setMessage("");
    
    try {
      await createUser(data);
    } catch (err) {
      // Error is already handled in the hook
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input
          type="text"
          id="fullName"
          disabled={isCreating}
          {...register("fullName", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input
          type="email"
          id="email"
          disabled={isCreating}
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
          disabled={isCreating}
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
          disabled={isCreating}
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
          variation="secondary"
          type="reset"
          disabled={isCreating}
          onClick={() => {
            reset();
            setMessage("");
          }}
        >
          Cancel
        </Button>
        <Button disabled={isCreating}>
          {!isCreating ? "Create new user" : "Creating..."}
        </Button>
      </FormRow>

      {message && (
        <p className={success ? "text-success" : "text-error"}>
          {message}
        </p>
      )}
    </Form>
  );
}

export default SignupForm;