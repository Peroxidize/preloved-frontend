import { useMediaQuery } from "react-responsive";
import BackAndTitle from "../fragments/commonstuff/BackAndTitle";
import css from "./Cart.module.css";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import deleteIcon from "../../assets/icons/delete.svg";
import sweater from "../../assets/clothes/checkered-sweater.jpg";
import deleteFilled from "../../assets/icons/deleteFilled.svg";
import Button from "../fragments/FormInputs/Button";
import { useState } from "react";

const CartItem: React.FC = () => {
  const [isFilled, setIsFilled] = useState(false);
  return (
    <div className={css.item}>
      <img src={sweater} alt="Item image" className={css.itemImage} />
      <p className={css.itemName}>Red Checkered Sweater</p>
      <div className={css.priceAndDelete}>
        <p className={css.itemPrice}>₱ 10</p>
        <button className={css.deleteBtn}>
          <img
            src={isFilled ? deleteFilled : deleteIcon}
            alt="Delete Icon"
            className={css.deleteIcon}
            onMouseEnter={() => setIsFilled(true)}
            onMouseLeave={() => setIsFilled(false)}
          />
        </button>
      </div>
    </div>
  );
};

const Cart: React.FC = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <BackAndTitle title="Cart" backTo="/" />
        <div className={css.itemContainer}>
          <CartItem />
          <Button text="PURCHASE ALL ITEMS" />
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default Cart;
