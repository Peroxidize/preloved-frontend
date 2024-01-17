import NavBar, { MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { useMediaQuery } from "react-responsive";
import { MobileNavTop } from "../fragments/nav-bar/nav-bar";
import clothes from "../../assets/clothes/clothes";

import plus from "../../assets/icons/plus.svg";
import css from "./Shop.module.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import axios from "axios";
import {
  LINK_GET_ITEM_DETAILS,
  LINK_GET_ITEM_IMAGES,
  LINK_GET_SHOP_ITEMS,
  LINK_GET_SHOP_TICKETS,
  LINK_GET_STORES,
} from "../misc";
import { useQuery } from "react-query";
import { LoadingImg } from "../fragments/commonstuff/Loading";

interface ShopItemDetails {
  itemID: number;
  itemName: string;
}

const ShopItems: React.FC<ShopItemDetails> = ({ itemID, itemName }) => {
  const { status, data } = useQuery("itemImages" + itemID, async () => {
    const res = await axios.get(LINK_GET_ITEM_IMAGES, {
      params: {
        id: itemID,
      },
      withCredentials: true,
    });
    return res.data.image_links;
  });
  const navigate = useNavigate();

  if (status === "loading") return <LoadingImg />;
  if (data.length === 0) return null;
  return (
    <img
      src={data[0]}
      alt={itemName}
      className={css.clothing}
      onClick={() => navigate(`/item/${itemID}`)}
    />
  );
};

const Shop: React.FC = () => {
  const getShopDetails = async () => {
    const res = await axios.get(LINK_GET_STORES, { withCredentials: true });
    return res.data;
  };

  const { status, data } = useQuery("shopDetails", getShopDetails);
  const getShopItems = useQuery<ShopItemDetails[]>("shopItems", async () => {
    const res = await axios.get(LINK_GET_SHOP_ITEMS, { withCredentials: true });
    return res.data["items:"];
  });

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <div className={css.storeCard}>
          {status === "success" ? (
            <>
              <h1 className={css.storeName}>{data.stores[0].storeName}</h1>
              <div className={css.storeDetails}>
                <div className={css.storeAddress}>Address: {data.stores[0][""]}</div>
                <div className={css.storeContact}>Contact Number: {data.phoneNumber}</div>
              </div>
            </>
          ) : (
            <>
              <h1 className={css.loadingName}>{""}</h1>
              <div className={css.storeDetails}>
                <div className={css.loadingDetail}>{""}</div>
                <div className={css.loadingDetail}>{""}</div>
              </div>
            </>
          )}
        </div>
        <div className={css.productGrid}>
          <Link to="/shop/add" className={css.addProduct}>
            <img src={plus} alt="Add product icon" className={css.addIcon} />
          </Link>
          {getShopItems.status === "success" ? (
            getShopItems.data.map((item) => (
              <ShopItems itemID={item.itemID} itemName={item.itemName} key={item.itemID} />
            ))
          ) : (
            <LoadingImg />
          )}
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default Shop;
