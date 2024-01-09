import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";

function RedeemVoucher() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
}

export default RedeemVoucher;
