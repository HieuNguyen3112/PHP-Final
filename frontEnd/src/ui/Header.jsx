import { useEffect, useState } from "react";
import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";
import useCurrentUser from "../api/useCurrentUser";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;
`;

const UserAvatar = styled.div`
  width: 3.6rem;
  height: 3.6rem;
  border-radius: 50%;
  background-color: var(--color-grey-300);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: var(--color-grey-700);
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

// Generate a random pastel color based on name
const getAvatarColor = (name) => {
  // Simple hash function for the name
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Generate pastel color using HSL
  const h = Math.abs(hash % 360);
  const s = 50 + Math.abs((hash % 30)); // 50-80%
  const l = 75 + Math.abs((hash % 15)); // 75-90% (light pastel)
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

function Header() {
  const { user, isLoading } = useCurrentUser();
  const [avatarColor, setAvatarColor] = useState("#e9ecef");
  
  useEffect(() => {
    if (user?.name) {
      setAvatarColor(getAvatarColor(user.name));
    }
  }, [user]);

  // Get first letter of name or fallback to "U" for unknown
  const getInitial = () => {
    if (!user) return "?";
    return user.name ? user.name.charAt(0).toUpperCase() : "U";
  };
  
  return (
    <StyledHeader>
      <UserAvatar style={{ backgroundColor: avatarColor }}>
        {!isLoading && (
          user?.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={`${user.name}'s avatar`} 
              onError={(e) => {
                // If image fails to load, show initial instead
                e.target.style.display = 'none';
                e.target.parentNode.innerText = getInitial();
              }} 
            />
          ) : (
            getInitial()
          )
        )}
      </UserAvatar>
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;