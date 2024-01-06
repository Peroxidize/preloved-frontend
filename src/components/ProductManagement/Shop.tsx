import NavBar, { MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { useMediaQuery } from "react-responsive";
import { MobileNavTop } from "../fragments/nav-bar/nav-bar";
import clothes from "../../assets/clothes/clothes";

import plus from "../../assets/icons/plus.svg";
import css from "./Shop.module.css";
import { Link } from "react-router-dom";

const Shop: React.FC = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <div className={css.storeCard}>
          <h1 className={css.storeName}>Jasper's apparel</h1>
          <div className={css.storeDetails}>
            <div className={css.storeAddress}>
              Address: Lorem Ipsum Street, Bankal, Lapu-Lapu City, Cebu 6015
            </div>
            <div className={css.storeContact}>Contact Number: 09123456789</div>
          </div>
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
