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
  const [selectedImg, setSelectedImg] = useState(0);
  const getImages = async () => {
    const res = await axios.get(LINK_GET_ITEM_IMAGES, {
      params: {
        id: id,
      },
      withCredentials: true,
    });
    console.log(res);
    return res.data.image_links;
  };
  const { status, data } = useQuery("getImages", getImages);
  return (
    <div className={css.imagesContainer}>
      <div className={css.mainImgContainer}>
        {status === "success" && (
          <img src={data[selectedImg]} alt="" className={css.mainImage} />
        )}
      </div>
      <div className={css.images}>
        {status === "success" &&
          data.map((img: string, index: number) => (
            <img
              src={img}
              alt=""
              className={`${css.image} ${index === selectedImg && css.selectedImg}`}
              onClick={() => setSelectedImg(index)}
              key={index}
            />
          ))}
      </div>
    </div>
  );
};

const Details: React.FC<{ id: string | undefined }> = ({ id }) => {
  return (
    <div className={css.detailsContainer}>
      <h1>Red Checkered Sweater</h1>
      <div className={css.storeName}>by Jasper Keith Vallecera</div>
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
        <Details id={id} />
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default Item;
