import { useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import FormRow from "../../ui/FormRow";
import { useState } from "react";

function CreateCabinForm({ cabinToEdit = {}, onCloseModal }) {
  // State để mô phỏng quá trình tạo và chỉnh sửa cabin
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { id: editId, ...editValues } = cabinToEdit;
  const isEditSession = Boolean(editId);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: isEditSession ? editValues : {},
  });

  const { errors } = formState;
  const isWorking = isCreating || isEditing;

  // Hàm tĩnh mô phỏng việc tạo cabin
  function handleCreateCabin(data, onSuccess) {
    setIsCreating(true);
    setTimeout(() => {
      console.log("Cabin created:", data);
      setIsCreating(false);
      onSuccess?.(data);
    }, 1000);
  }

  // Hàm tĩnh mô phỏng việc chỉnh sửa cabin
  function handleEditCabin({ newCabinData, id }, onSuccess) {
    setIsEditing(true);
    setTimeout(() => {
      console.log("Cabin edited:", { id, ...newCabinData });
      setIsEditing(false);
      onSuccess?.(newCabinData);
    }, 1000);
  }

  function onSubmit(data) {
    const image = typeof data.image === "string" ? data.image : data.image?.[0];

    if (isEditSession) {
      handleEditCabin(
        { newCabinData: { ...data, image: image }, id: editId },
        (data) => {
          reset();
          onCloseModal?.();
        }
      );
    } else {
      handleCreateCabin({ ...data, image: image }, (data) => {
        reset();
        onCloseModal?.();
      });
    }
  }

  function onError(errors) {
    console.error(errors);
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
          disabled={isCreating}
          {...register("name", {
            required: "this field is required",
          })}
        />
      </FormRow>

      <FormRow label="Maximum capacity" error={errors?.maxCapacity?.message}>
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("maxCapacity", {
            required: "this field is required",
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
            required: "this field is required",
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
            required: "this field is required",
            validate: (value, formValues) => {
              return (
                Number(value) <= Number(formValues.regularPrice) ||
                "Discount should be less than regular price"
              );
            },
          })}
        />
      </FormRow>

      <FormRow
        label="Description for website"
        error={errors?.description?.message}
      >
        <Textarea
          type="number"
          id="description"
          disabled={isWorking}
          defaultValue=""
          {...register("description", {
            required: "this field is required",
          })}
        />
      </FormRow>

      <FormRow label="Cabin photo">
        <FileInput
          id="image"
          accept="image/*"
          {...register("image", {
            required: !isEditSession ? true : false,
          })}
        />
      </FormRow>

      <FormRow>
        <Button
          variations="secondary"
          type="reset"
          onClick={() => onCloseModal?.()}
        >
          Cancel
        </Button>
        <Button disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateCabinForm;
