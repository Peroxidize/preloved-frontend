import NavBar, { MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { useMediaQuery } from "react-responsive";
import { MobileNavTop } from "../fragments/nav-bar/nav-bar";
import clothes from "../../assets/clothes/clothes";

import plus from "../../assets/icons/plus.svg";
import css from "./Shop.module.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { LINK_GET_STORES } from "../misc";
import { useQuery } from "react-query";

const Shop: React.FC = () => {
  const getShopDetails = async () => {
    const res = await axios.get(LINK_GET_STORES, { withCredentials: true });
    console.log(res.data);
    return res.data;
  };

  const { status, data } = useQuery("shopDetails", getShopDetails);

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
          {/* {clothes.map((clothing) => (
            <img src={clothing} alt="A product" className={css.clothing} />
          ))} */}
          <Link to="/shop/add" className={css.addProduct}>
            <img src={plus} alt="Add product icon" className={css.addIcon} />
          </Link>
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default Shop;
