import { useMediaQuery } from "react-responsive";
import BackAndTitle from "../fragments/commonstuff/BackAndTitle";
import css from "./Cart.module.css";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import deleteIcon from "../../assets/icons/delete.svg";
import sweater from "../../assets/clothes/checkered-sweater.jpg";
import deleteFilled from "../../assets/icons/deleteFilled.svg";
import Button from "../fragments/FormInputs/Button";
import { useState } from "react";
import axios from "axios";
import { LINK_GET_CART, LINK_GET_ITEM_DETAILS } from "../misc";
import { useQuery } from "react-query";
import { ItemDetails } from "../Item/Item";
import LoadingText, { LoadingBigText, LoadingSmallText } from "../fragments/commonstuff/Loading";

interface CartDetails {
  itemID: number;
  price: string;
  size: string;
  storeName: string;
  thumbnail: string;
}

const LoadingCartItem: React.FC = () => {
  return (
    <div className={css.item}>
      <div className={css.loadingThumbnail}>{""}</div>
      <div className={css.nameAndSize}>
        <LoadingText />
        <LoadingSmallText />
        <LoadingSmallText />
      </div>
      <div className={css.priceAndDelete}>
        <p className={css.loadingPrice}>{""}</p>
      </div>
    </div>
  );
};

const CartItem: React.FC<CartDetails> = ({ itemID, price, size, storeName, thumbnail }) => {
  const [isFilled, setIsFilled] = useState(false);
  const { status, data } = useQuery<ItemDetails>(
    "itemDetails" + itemID,
    async () => {
      const res = await axios.get(LINK_GET_ITEM_DETAILS, {
        params: { id: itemID },
        withCredentials: true,
      });
      console.log(res);
      return res.data;
    },
    { staleTime: Infinity }
  );
  return (
    <div className={css.item}>
      <img src={thumbnail} alt="Item image" className={css.itemImage} />
      <div className={css.nameAndSize}>
        {status === "success" ? (
          <p className={css.itemName}>
            <strong>{data.name}</strong>
          </p>
        ) : (
          <LoadingText />
        )}
        <p className={css.itemStore}>by {storeName}</p>
        <p className={css.itemSize}>Size: {size}</p>
      </div>
      <div className={css.priceAndDelete}>
        <p className={css.itemPrice}>₱ {price}</p>
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
  const { status, data } = useQuery<CartDetails[]>(
    "cart",
    async () => {
      const res = await axios.get(LINK_GET_CART, { withCredentials: true });
      console.log(res);
      return res.data.cart;
    },
    { staleTime: Infinity }
  );
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <BackAndTitle title="Cart" backTo="/" />
        <div className={css.itemContainer}>
          {status === "success" ? (
            <>
              {data.map((item) => (
                <CartItem key={item.itemID} {...item} />
              ))}
              <Button text="PURCHASE ALL ITEMS" />
            </>
          ) : data && data.length === 0 ? (
            <p>No items in cart.</p>
          ) : (
            <LoadingCartItem />
          )}
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default Cart;
