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
import { LINK_IS_AUTH } from "../misc";
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

export default function FrontPage() {
  useEffect(() => {
    axios
      .get(LINK_IS_AUTH, { withCredentials: true })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
          {repeatedClothingItems.map((item, index) => (
            <img key={index} src={item} alt={`${getImageName(item)}`} />
          ))}
        </div>
        {!isDesktopOrLaptop && <MobileNavBottom />}
      </div>
    </>
  );
}
