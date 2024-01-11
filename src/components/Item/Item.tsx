import React, { useState } from "react";
import css from "./Item.module.css";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavBottom, MobileNavTop } from "../fragments/nav-bar/nav-bar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LINK_GET_ITEM_DETAILS, LINK_GET_ITEM_IMAGES, LINK_PURCHASE_ITEM } from "../misc";
import { useMutation, useQuery } from "react-query";
import Tag from "../fragments/commonstuff/Tag";
import addCollectionsIcon from "../../assets/icons/addCollections.svg";
import addCollectionsFilled from "../../assets/icons/addCollectionsFilled.svg";
import Button from "../fragments/FormInputs/Button";
import cartIcon from "../../assets/icons/shopping_cart.svg";
import LoadingText, {
  LoadingBigText,
  LoadingButton,
  LoadingTag,
} from "../fragments/commonstuff/Loading";

const Images: React.FC<{ id: string | undefined }> = ({ id }) => {
  const [selectedImg, setSelectedImg] = useState(0);
  const getImages = async () => {
    const res = await axios.get(LINK_GET_ITEM_IMAGES, {
      params: {
        id: id,
      },
      withCredentials: true,
    });
    return res.data.image_links;
  };
  const { status, data } = useQuery("getImages", getImages);
  return (
    <div className={css.imagesContainer}>
      <div className={css.mainImgContainer}>
        {status === "success" ? (
          <img src={data[selectedImg]} alt="" className={css.mainImage} />
        ) : (
          <div className={css.mainImage}>{""}</div>
        )}
      </div>
      <div className={css.images}>
        {status === "success" ? (
          data.map((img: string, index: number) => (
            <img
              src={img}
              alt=""
              className={`${css.image} ${index === selectedImg && css.selectedImg}`}
              onClick={() => setSelectedImg(index)}
              key={index}
            />
          ))
        ) : (
          <div className={css.image}>{""}</div>
        )}
      </div>
    </div>
  );
};

interface Tags {
  tagName: string;
  tagID: number;
}

interface ItemDetails {
  description: string;
  isFeminine: boolean;
  itemID: number;
  name: string;
  price: string;
  size: string;
  storeID: number;
  storeName: string;
  tags: Tags[];
}

const Details: React.FC<{ id: string | undefined }> = ({ id }) => {
  const purchaseItem = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      formData.append("itemID", id as string);
      const res = axios.post(LINK_PURCHASE_ITEM, formData, { withCredentials: true });
      return res;
    },
  });
  const getItemDetails = async () => {
    const res = await axios.get(LINK_GET_ITEM_DETAILS, {
      params: {
        id: id,
      },
      withCredentials: true,
    });
    console.log(res.data);
    return res.data;
  };
  const { status, data } = useQuery<ItemDetails>("getItemDetails", getItemDetails);

  const handleDialog = (open: boolean) => {
    const dialog = document.getElementById("sureDialog") as HTMLDialogElement;
    if (dialog) {
      if (open) {
        dialog.showModal();
      } else {
        dialog.close();
      }
    }
  };

  const [isFilled, setIsFilled] = useState(false);

  return (
    <div className={css.detailsContainer}>
      {status === "success" ? (
        <>
          <div className={css.nameAndStore}>
            <h1 className={css.itemName}>{data.name}</h1>
            <div className={css.storeName}>by {data.storeName}</div>
            <div className={css.tagContainer}>
              {data.tags.map((tag) => (
                <Tag key={tag.tagID} isPrimary>
                  {tag.tagName}
                </Tag>
              ))}
              <Tag isPrimary={!data.isFeminine}>
                {data.isFeminine ? "Feminine" : "Masculine"}
              </Tag>
              <img
                src={isFilled ? addCollectionsFilled : addCollectionsIcon}
                alt=""
                onMouseEnter={() => setIsFilled(true)}
                onMouseLeave={() => setIsFilled(false)}
                onClick={() => setIsFilled(!isFilled)}
                className={css.addCollectionsIcon}
              />
            </div>
          </div>
          <div className={css.descAndSize}>
            <p className={css.desc}>
              <strong>Description: </strong>
              {data.description}
            </p>
            <p className={css.size}>
              <strong>Size: </strong>
              {data.size}
            </p>
          </div>
          <h2 className={css.price}>₱ {data.price}</h2>
          <div className={css.buttons}>
            <button className={css.addToCart}>
              <img src={cartIcon} alt="Cart Icon" className={css.cart} />
              Add to Cart
            </button>
            <Button
              text="Buy Now"
              isPrimary={true}
              handleClick={() => handleDialog(true)}
            />
          </div>
          <dialog className={css.sureDialog} id="sureDialog">
            <div className={css.dialogContainer}>
              <h2 className={css.sureDialogTitle}>Are you sure you want to buy this?</h2>
              <div className={css.sureDialogButtons}>
                <Button
                  text="Yes"
                  isPrimary={false}
                  handleClick={() => {
                    purchaseItem.mutate();
                  }}
                />
                <Button
                  text="No"
                  isPrimary={true}
                  handleClick={() => handleDialog(false)}
                />
              </div>
            </div>
          </dialog>
        </>
      ) : (
        <>
          <div className={css.nameAndStore}>
            <LoadingBigText />
            <LoadingText />
            <div className={css.tagContainer}>
              <LoadingTag />
              <LoadingTag />
            </div>
          </div>
          <div className={css.descAndSize}>
            <LoadingText />
            <LoadingText />
          </div>
          <LoadingBigText />
          <div className={css.buttons}>
            <LoadingButton />
            <LoadingButton />
          </div>
        </>
      )}
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
