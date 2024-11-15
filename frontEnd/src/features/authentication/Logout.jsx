import { HiArrowRightOnRectangle } from "react-icons/hi2";
import ButtonIcon from "../../ui/ButtonIcon";
import SpinnerMini from "../../ui/SpinnerMini";
import useLogout from "../../api/useLogout";

function Logout() {
  const { handleLogout, isPending } = useLogout();

  return (
    <ButtonIcon disabled={isPending} onClick={handleLogout}>
      {!isPending ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
    </ButtonIcon>
  );
}

export default Logout;
