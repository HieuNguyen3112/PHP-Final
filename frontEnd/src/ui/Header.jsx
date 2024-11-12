import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";

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
`;

function Header() {
  // Dữ liệu tĩnh thay thế cho `UserAvatar`
  const mockUser = {
    fullName: "John Doe",
    avatar: null,
  };

  return (
    <StyledHeader>
      <UserAvatar>
        {mockUser.avatar ? (
          <img src={mockUser.avatar} alt="User Avatar" />
        ) : (
          mockUser.fullName.charAt(0)
        )}
      </UserAvatar>
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
