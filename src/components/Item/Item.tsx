import React, { useState } from "react";

import css from "./Item.module.css";
import clothes from "../../assets/clothes/clothes";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavBottom, MobileNavTop } from "../fragments/nav-bar/nav-bar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LINK_GET_ITEM_IMAGES } from "../misc";
import { useQuery } from "react-query";

const Images: React.FC<{ id: string | undefined }> = ({ id }) => {
  console.log(id);
  const getImages = async () => {
    const res = await axios.get(LINK_GET_ITEM_IMAGES, {
      params: {
        id: id,
      },
      withCredentials: true,
    });
    console.log(res);
    return res.data;
  };
  const { status, data } = useQuery("getImages", getImages);
  const threeClothes = clothes.slice(0, 3);
  const [selectedImg, setSelectedImg] = useState(threeClothes[0]);
  return (
    <div className={css.imagesContainer}>
      <img src={selectedImg} alt="" className={css.mainImage} />
      <div className={css.images}>
        {threeClothes.map((img, index) => (
          <img
            src={img}
            alt=""
            className={`${css.image} ${selectedImg === img && css.selectedImg}}`}
            onClick={() => setSelectedImg(img)}
            key={index}
          />
        ))}
      </div>
    </div>
  );
};

const Item: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <Images id={id} />
        <div className="details">
          <h1>Red Checkered Sweater</h1>
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default Item;
