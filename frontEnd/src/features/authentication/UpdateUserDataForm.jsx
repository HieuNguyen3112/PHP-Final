import { useState, useEffect } from "react";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import useCurrentUser from "../../api/useCurrentUser";
import useUpdateUser from "../../api/useUpdateUser";
import useAvatarGenerator from "../../api/useAvatarGenerator";
import styled from "styled-components";

// Styled components
const AvatarPreview = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 2px solid #ddd;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const AIGeneratorContainer = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color:rgb(8, 4, 49);
`;

const AvatarActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const PromptInput = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  input {
    flex: 1;
  }
`;

function UpdateUserDataForm() {
  const { user, isLoading } = useCurrentUser();
  const { updateUser, isUpdating, updateError } = useUpdateUser();
  const { 
    generateAvatar, 
    clearGeneratedImage, 
    isGenerating, 
    generatedImage, 
    error: generationError 
  } = useAvatarGenerator();

  const [fullName, setFullName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [email, setEmail] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");
  const [prompt, setPrompt] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
      
      if (user.avatar_url) {
        setAvatarPreview(user.avatar_url);
      }
    }
  }, [user]);

  // Handle file input change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear any AI generated image
      clearGeneratedImage();
    }
  };

  // Handle AI avatar generation
  const handleGenerateAvatar = async () => {
    if (!prompt.trim()) {
      setErrorMessage("Please enter a prompt for the AI");
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }
    
    const result = await generateAvatar(prompt);
    
    if (result.success) {
      setAvatarPreview(result.imageUrl);
      // Clear file input
      setAvatar(null);
    } else {
      setErrorMessage(result.error || "Error generating avatar");
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!fullName) {
      setErrorMessage("Name is required");
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }
  
    try {
      const updateData = {
        name: fullName,
      };
      
      // Handle avatar update
      if (avatar) {
        updateData.avatar = avatar;
      } else if (generatedImage) {
        updateData.avatarUrl = generatedImage;
      }
      
      const result = await updateUser(updateData);
    
      if (result.success) {
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        setErrorMessage(result.error || "Error updating profile");
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 3000);
      }
    } catch (error) {
      setErrorMessage("Error updating profile");
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    if (user) {
      setFullName(user.name || "");
      setAvatar(null);
      
      if (user.avatar_url) {
        setAvatarPreview(user.avatar_url);
      } else {
        setAvatarPreview("");
      }
      
      clearGeneratedImage();
    }
  };

  // Handle discard AI avatar
  const handleDiscardAIAvatar = () => {
    clearGeneratedImage();
    
    if (user && user.avatar_url) {
      setAvatarPreview(user.avatar_url);
    } else {
      setAvatarPreview("");
    }
  };

  if (isLoading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div style={{ position: "relative" }}>
      {/* Success message */}
      {showSuccessMessage && (
        <div className="notification success">
          Profile Updated Successfully
        </div>
      )}
      
      {/* Error message */}
      {showErrorMessage && (
        <div className="notification error">
          {errorMessage}
        </div>
      )}

      <Form onSubmit={handleSubmit}>
        {/* Avatar preview */}
        {(avatarPreview || user?.avatar_url) && (
          <AvatarContainer>
            <AvatarPreview>
              <img 
                src={avatarPreview || user?.avatar_url} 
                alt="User avatar" 
              />
            </AvatarPreview>
          </AvatarContainer>
        )}
        
        <FormRow label="Email address">
          <Input value={email} disabled />
        </FormRow>
        
        <FormRow label="Full name">
          <Input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            id="fullName"
            disabled={isUpdating || isGenerating}
          />
        </FormRow>
        
        <FormRow label="Upload avatar image">
          <FileInput
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            disabled={isUpdating || isGenerating}
          />
        </FormRow>
        
        {/* AI Avatar Generator */}
        <AIGeneratorContainer>
          <h3>Generate AI Avatar</h3>
          <p>Enter a prompt to generate an AI avatar image.</p>
          
          <PromptInput>
            <Input
              type="text"
              placeholder="E.g., A professional headshot of a person with blue background"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating || isUpdating}
            />
            <Button 
              type="button" 
              onClick={handleGenerateAvatar}
              disabled={isGenerating || isUpdating || !prompt.trim()}
            >
              {isGenerating ? "Generating..." : "Generate"}
            </Button>
          </PromptInput>
          
          {generatedImage && (
            <>
              <AvatarPreview>
                <img src={generatedImage} alt="AI generated avatar" />
              </AvatarPreview>
              
              <AvatarActions>
                <Button 
                  type="button" 
                  variations="secondary"
                  onClick={handleDiscardAIAvatar}
                  disabled={isUpdating}
                >
                  Discard
                </Button>
              </AvatarActions>
            </>
          )}
          
          {generationError && (
            <p style={{ color: "red" }}>Error: {generationError}</p>
          )}
        </AIGeneratorContainer>
        
        {updateError && (
          <p style={{ color: "red" }}>Error: {updateError}</p>
        )}
        
        <FormRow>
          <Button 
            type="button" 
            variations="secondary" 
            onClick={handleCancel}
            disabled={isUpdating || isGenerating}
          >
            Cancel
          </Button>
          <Button disabled={isUpdating || isGenerating}>
            {isUpdating ? "Updating..." : "Update account"}
          </Button>
        </FormRow>
      </Form>
      
      {/* Styling for notifications */}
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
          z-index: 100;
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