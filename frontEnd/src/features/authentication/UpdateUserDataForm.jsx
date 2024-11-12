import { useState } from "react";

import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";

function UpdateUserDataForm() {
  // Dữ liệu tĩnh thay thế cho `useUser`
  const mockUser = {
    email: "user@example.com",
    user_metadata: { fullName: "John Doe" },
  };

  const { email, user_metadata: { fullName: currentFullName } } = mockUser;

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!fullName) return;

    setIsUpdated(true);

    // Mô phỏng quá trình cập nhật người dùng
    setTimeout(() => {
      setMessage("User updated successfully!");
      setIsUpdated(false);
      setAvatar(null);
      e.target.reset();
    }, 1500);
  }

  function handleCancel() {
    setFullName(currentFullName);
    setAvatar(null);
    setMessage("");
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName"
          disabled={isUpdated}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          disabled={isUpdated}
        />
      </FormRow>
      <FormRow>
        <Button type="reset" variations="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button disabled={isUpdated}>
          {isUpdated ? "Updating..." : "Update account"}
        </Button>
      </FormRow>
      {message && <p>{message}</p>}
    </Form>
  );
}

export default UpdateUserDataForm;
