import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonIcon from "../../ui/ButtonIcon";
import SpinnerMini from "../../ui/SpinnerMini";
import { useState } from "react";

function Logout() {
  const [isPending, setIsPending] = useState(false);

  // Hàm tĩnh mô phỏng quá trình logout
  function handleLogout() {
    setIsPending(true);

    // Giả lập thời gian xử lý đăng xuất
    setTimeout(() => {
      setIsPending(false);
      alert("Logged out successfully!");
      window.location.href = "./Login";
    }, 1000);
  }

  return (
    <ButtonIcon disabled={isPending} onClick={handleLogout}>
      {!isPending ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  );
}

export default Logout;
