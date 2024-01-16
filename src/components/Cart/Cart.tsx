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
import {
  LINK_GET_CART,
  LINK_GET_ITEM_DETAILS,
  LINK_PURCHASE_CART,
  LINK_REMOVE_FROM_CART,
  closeDialog,
  showAndCloseDialog,
  showDialog,
} from "../misc";
import { useMutation, useQuery } from "react-query";
import { ItemDetails } from "../Item/Item";
import LoadingText, { LoadingBigText, LoadingSmallText } from "../fragments/commonstuff/Loading";
import LoadingDialog, {
  ErrorDialog,
  IconTextDialog,
  SuccessDialog,
} from "../fragments/commonstuff/Dialogs";
import success from "../../assets/icons/success.svg";
import error from "../../assets/icons/error.svg";

interface CartDetails {
  itemID: number;
  price: string;
  size: string;
  storeName: string;
  thumbnail: string;
  refetchFn?: () => void;
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

const CartItem: React.FC<CartDetails> = ({
  itemID,
  price,
  size,
  storeName,
  thumbnail,
  refetchFn,
}) => {
  const [isFilled, setIsFilled] = useState(false);
  const { status, data } = useQuery<ItemDetails>("itemDetails" + itemID, async () => {
    const res = await axios.get(LINK_GET_ITEM_DETAILS, {
      params: { id: itemID },
      withCredentials: true,
    });
    console.log(res);
    return res.data;
  });
  const deleteItem = useMutation({
    mutationFn: async () => {
      console.log(itemID);
      const formData = new FormData();
      formData.append("itemID", itemID.toString());
      const res = await axios.post(LINK_REMOVE_FROM_CART, formData, { withCredentials: true });
      console.log(res);
      if (refetchFn) {
        refetchFn();
      }
      return res;
    },
    onMutate: () => showDialog("loadingDialog"),
    onSuccess: () => {
      closeDialog("loadingDialog");
      showAndCloseDialog("deleteSuccess", 3000);
      setIsFilled(false);
    },
    onError: () => {
      closeDialog("loadingDialog");
      showAndCloseDialog("deleteError", 3000);
      setIsFilled(false);
    },
  });
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
        <button className={css.deleteBtn} onClick={() => deleteItem.mutate()}>
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
  const { status, data, refetch } = useQuery<CartDetails[]>("cart", async () => {
    const res = await axios.get(LINK_GET_CART, { withCredentials: true });
    console.log(res);
    return res.data.cart;
  });

  const purchaseCart = useMutation({
    mutationFn: async () => {
      const res = await axios.post(LINK_PURCHASE_CART, { withCredentials: true });
      console.log(res);
      return res;
    },
    onMutate: () => showDialog("loadingDialog"),
    onSuccess: () => {
      closeDialog("loadingDialog");
      showAndCloseDialog("successDialog", 3000);
    },
    onError: () => {
      closeDialog("loadingDialog");
      showAndCloseDialog("errorDialog", 3000);
    },
  });
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <LoadingDialog />
      <IconTextDialog text="Deleted item from cart!" icon={success} id="deleteSuccess" />
      <IconTextDialog text="Error deleting item from cart!" icon={error} id="deleteError" />
      <SuccessDialog text="Purchased all items" />
      <ErrorDialog text="Error purchasing items" />
      <div className={css.wrapper}>
        <BackAndTitle title="Cart" backTo="/" />
        <div className={css.itemContainer}>
          {status === "success" && data.length > 0 ? (
            <>
              {data.map((item) => (
                <CartItem key={item.itemID} {...item} refetchFn={refetch} />
              ))}
              <Button text="PURCHASE ALL ITEMS" handleClick={() => purchaseCart.mutate()} />
            </>
          ) : data && data.length === 0 ? (
            <p className={css.noItems}>No items in cart.</p>
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
