import { useState } from "react";
import axios from "axios";

const useAvatarGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);

  const generateAvatar = async (prompt) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await axios.post(
        "https://api.cometapi.com/v1/images/generations",
        {
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            Authorization: "Bearer sk-qQs88ydepT3Qie6tr03yVni0A8hnimTJpcOo11TLqSvQqhdv",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.data && response.data.data[0]) {
        const imageUrl = response.data.data[0].url;
        setGeneratedImage(imageUrl);
        return { success: true, imageUrl };
      } else {
        throw new Error("No image data returned from API");
      }
    } catch (err) {
      const errorMessage = 
        err.response?.data?.error?.message || 
        err.message || 
        "Error generating avatar";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsGenerating(false);
    }
  };

  const clearGeneratedImage = () => {
    setGeneratedImage(null);
  };

  return {
    generateAvatar,
    clearGeneratedImage,
    isGenerating,
    generatedImage,
    error,
  };
};

export default useAvatarGenerator;