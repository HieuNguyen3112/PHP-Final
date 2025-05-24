import { useForm } from "react-hook-form";
import { useEffect } from "react";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import FormRow from "../../ui/FormRow";
import useCreateCabin from "../../api/useCreateCabin";
import useEditCabin from "../../api/useEditCabin";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  // Use our custom hooks
  const { createCabin, isCreating, createError } = useCreateCabin();
  const { editCabin, isEditing, editError } = useEditCabin();

  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState, setError } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;
  const isWorking = isCreating || isEditing;

  // Handle API errors
  useEffect(() => {
    const apiError = isEditSession ? editError : createError;
    if (apiError) {
      setError("apiError", {
        type: "manual",
        message: apiError,
      });
    }
  }, [createError, editError, isEditSession, setError]);

  async function onSubmit(data) {
    try {
      // Prepare the data - map form field names to API expected names
      const cabinData = {
        name: data.name,
        capacity: Number(data.maxCapacity),
        price: Number(data.regularPrice),
        discount: Number(data.discount),
        // Removed description field
      };

      // Only add image if it's provided and it's a file
      if (data.image && data.image[0] instanceof File) {
        cabinData.image = data.image[0];
      }

      if (isEditSession) {
        await editCabin(editId, cabinData);
      } else {
        await createCabin(cabinData);
      }

      reset();
      onCloseModal?.();
    } catch (err) {
      // Error is already handled in the hooks
      console.error("Form submission error:", err);
    }
  }

  function onError(errors) {
    console.error("Form validation errors:", errors);
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow
        label="Cabin name"
        error={errors?.name?.message}
        type={onCloseModal ? "modal" : "regular"}
      >
        <Input
          type="text"
          id="name"
          disabled={isWorking}
          {...register("name", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Capacity should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Regular Price" error={errors?.regularPrice?.message}>
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regularPrice", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Price should be at least 1",
            },
          })}
        />
      </FormRow>

      <FormRow label="Discount" error={errors?.discount?.message}>
        <Input
          type="number"
          id="discount"
          disabled={isWorking}
          defaultValue={0}
          {...register("discount", {
            required: "This field is required",
            validate: (value, formValues) => {
              return (
                Number(value) <= Number(formValues.regularPrice) ||
                "Discount should be less than regular price"
              );
            },
          })}
        />
      </FormRow>

      {/* Description field removed */}

      <FormRow label="Cabin photo (optional)">
        <FileInput
          id="image"
          accept="image/*"
          {...register("image")}
        />
      </FormRow>

      {/* Display API errors */}
      {errors.apiError && (
        <FormRow>
          <p className="text-red-500">{errors.apiError.message}</p>
        </FormRow>
      )}

      <FormRow>
        <Button
          variations="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession 
            ? `Edit cabin ${isEditing ? '...' : ''}` 
            : `Create new cabin ${isCreating ? '...' : ''}`}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;