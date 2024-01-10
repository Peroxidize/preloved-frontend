import css from "./frontpage.module.css";

import NavBar, { MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { useMediaQuery } from "react-responsive";
import { MobileNavTop } from "../fragments/nav-bar/nav-bar";

import beigeJacket from "../../assets/clothes/beige-jacket.jpg";
import checkeredSweater from "../../assets/clothes/checkered-sweater.jpg";
import greySlacks from "../../assets/clothes/grey-slacks.jpg";
import khakiJacket from "../../assets/clothes/khaki-jacket.jpg";
import greenSweater from "../../assets/clothes/green-sweater.jpg";
import magentaShirt from "../../assets/clothes/magenta-shirt.png";
import { useEffect } from "react";
import axios from "axios";
import { LINK_GET_FRONTPAGE, LINK_GET_ITEM_DETAILS, LINK_IS_AUTH } from "../misc";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";

// const domain = "https://prelovedbackends.azurewebsites.net/";
// const downloadfiles = "host/storage/q";

const repeatArray = (array: string[], n: number) =>
  Array.from({ length: n }, () => array).flat();
const getImageName = (image: string) => {
  const path = image.split("/");
  const name = path[path.length - 1].split(".");
  return name[0];
};

interface Image {
  link: string;
  slugID: number;
}

interface Item {
  images: Image[];
  is_feminine: boolean;
  item_description: string;
  item_id: number;
  item_name: string;
  item_price: string;
  size: string;
  storeID: number;
}

export default function FrontPage() {
  const navigate = useNavigate();
  const getItems = async () => {
    const res = await axios.get(LINK_GET_FRONTPAGE, { withCredentials: true });
    console.log(res.data.items);
    const itemsWithImg = res.data.items.filter((item: Item) => {
      return item.images.length > 0;
    });
    console.log(itemsWithImg);
    return itemsWithImg;
  };
  const { status, data } = useQuery("getItems", getItems, {
    staleTime: Infinity,
  });
  // (async () => {
  //   await axios.get(domain + downloadfiles)
  //   .then(response => {
  //     console.log(response);
  //   }).catch(error => {
  //     console.log(error);
  //   });
  // })();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  const clothingItems = [
    beigeJacket,
    checkeredSweater,
    greySlacks,
    khakiJacket,
    greenSweater,
    magentaShirt,
  ];

  const repeatedClothingItems = repeatArray(clothingItems, 10);

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <div className={css.display_clothing}>
          {status === "success" &&
            data.map((item: Item) => (
              <img
                src={item.images[0].link}
                alt={item.item_name}
                className={css.img}
                key={item.item_id}
                onClick={() => navigate(`/item/${item.item_id}`)}
              />
            ))}
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
}
