import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import useCurrentUser from "../../api/useCurrentUser";
import useUpdateUser from "../../api/useUpdateUser";

function UpdateUserDataForm() {
  const { user, isLoading, error } = useCurrentUser();
  const { updateUser, isUpdating, updateError, updateMessage } = useUpdateUser();

  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName) return;
  
    const response = await updateUser({ name: fullName, avatar });
  
    if (response && response.success) {
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } else {
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFullName(user.name || "");
      setAvatar(null);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Thông báo thành công */}
      {showSuccessMessage && (
        <div className="notification success">
          User Updated Successfully
        </div>
      )}
      
      {/* Thông báo lỗi */}
      {showErrorMessage && (
        <div className="notification error">
          Error updating user data
        </div>
      )}

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
            disabled={isUpdating}
          />
        </FormRow>
        <FormRow label="Avatar image">
          <FileInput
            id="avatar"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            disabled={isUpdating}
          />
        </FormRow>
        <FormRow>
          <Button type="reset" variations="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update account"}
          </Button>
        </FormRow>
      </Form>
      {updateError && console.error("Lỗi khi cập nhật:", updateError)}

      {/* Styling thông báo */}
      <style jsx>{`
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
        .notification.error {
          background-color: #f44336;
        }
      `}</style>
    </div>
  );
}

export default UpdateUserDataForm;
