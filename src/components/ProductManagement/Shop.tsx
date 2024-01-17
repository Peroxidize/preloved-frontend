import NavBar, { MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { useMediaQuery } from "react-responsive";
import { MobileNavTop } from "../fragments/nav-bar/nav-bar";

import plus from "../../assets/icons/plus.svg";
import maps from "../../assets/icons/maps.svg";
import css from "./Shop.module.css";
import modalcss from "../Collections/collections.module.css";
import utilcss from "../../utils/utils.module.css";
import { Link, useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
import { LINK_GET_ITEM_IMAGES, LINK_GET_SHOP_ITEMS, LINK_GET_STORES } from "../misc";
import { useQuery } from "react-query";
import { LoadingImg } from "../fragments/commonstuff/Loading";
import { attach_location } from "../../utils/auth";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

export const showModalAtom = atom<string>("");
export const resultInfoAtom = atom<{
  long: string | null;
  lat: string | null;
  error: string | null;
} | null>(null);

interface ShopItemDetails {
  itemID: number;
  itemName: string;
}

const ResultModal = () => {
  const setShowModal = useSetAtom(showModalAtom);
  const resultInfo = useAtomValue(resultInfoAtom);

  return (
    <div className={modalcss.modal_container}>
      <div className={modalcss.shop_modal}>
        <div className={modalcss.dialog_header}>
          {resultInfo?.error !== null ? (
            <h1>Unable to process your request</h1>
          ) : (
            <h1>Shop coordinates updated</h1>
          )}
        </div>
        <div className={modalcss.dialog_body}>
          {resultInfo?.error !== null ? (
            <p>Allow location request next time</p>
          ) : (
            <>
              <p>Your new coordinates</p>
              <p>Longitude: {resultInfo.long}</p>
              <p>Latitude: {resultInfo.lat}</p>
            </>
          )}
        </div>
        <div>
          <button
            onClick={() => setShowModal("")}
            className={`${modalcss.secondary_button} ${modalcss.modal_button}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [result, setResult] = useAtom(showModalAtom);
  const setResultInfo = useSetAtom(resultInfoAtom);

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

  const successCallback = (position: any) => {
    console.log(position);
    const long = String(position.coords.longitude);
    const lat = String(position.coords.latitude);

    const formData = new FormData();
    formData.append("long", long);
    formData.append("lat", lat);
    setResultInfo({ long: long, lat: lat, error: null });

    const post = async () => {
      setResult(await attach_location(formData));
    };

    post();
  };

  const errorCallback = (error: any) => {
    console.log(error);
    setResultInfo({ long: null, lat: null, error: "error" });
    setResult("show");
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  };

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
              <h1 className={`${css.loadingName} ${utilcss.skeleton}`}>{""}</h1>
              <div className={`${css.storeDetails} ${utilcss.skeleton}`}>
                <div className={`${css.loadingDetail} ${utilcss.skeleton}`}>{""}</div>
                <div className={`${css.loadingDetail} ${utilcss.skeleton}`}>{""}</div>
              </div>
            </>
          )}
        </div>
        <div className={css.productGrid}>
          <Link to="/shop/add" className={css.addProduct}>
            <img src={plus} alt="Add product icon" className={css.addIcon} />
          </Link>
          <div onClick={getLocation} className={`${css.addProduct} ${css.gmaps}`}>
            <img src={maps} alt="Set google maps cords" className={css.addIcon} />
          </div>
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
      {result !== "" && <ResultModal />}
    </>
  );
};

export default Shop;
