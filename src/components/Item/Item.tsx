import React, { useEffect, useState } from "react";
import css from "./Item.module.css";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavBottom, MobileNavTop } from "../fragments/nav-bar/nav-bar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { LINK_GET_ITEM_DETAILS, LINK_GET_ITEM_IMAGES, LINK_PURCHASE_ITEM } from "../misc";
import { useMutation, useQuery } from "react-query";
import Tag from "../fragments/commonstuff/Tag";
import addCollectionsIcon from "../../assets/icons/addCollections.svg";
import addCollectionsFilled from "../../assets/icons/addCollectionsFilled.svg";
import Button from "../fragments/FormInputs/Button";
import cartIcon from "../../assets/icons/shopping_cart.svg";
import leftArrow from "../../assets/icons/leftArrow.svg";
import LoadingText, {
  LoadingBigText,
  LoadingButton,
  LoadingTag,
} from "../fragments/commonstuff/Loading";
import error from "../../assets/icons/error.svg";
import success from "../../assets/icons/success.svg";
import LoadingDialog, { IconTextDialog } from "../fragments/commonstuff/Dialogs";

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
  const { isFetchedAfterMount, data, status } = useQuery("getImages", getImages);
  return (
    <div className={css.imagesContainer}>
      <div className={css.mainImgContainer}>
        {isFetchedAfterMount && status === "success" ? (
          <img src={data[selectedImg]} alt="" className={css.mainImage} />
        ) : (
          <div className={css.mainImage}>{""}</div>
        )}
      </div>
      <div className={css.images}>
        {isFetchedAfterMount ? (
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
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("itemID", id as string);
      const res = await axios.post(LINK_PURCHASE_ITEM, formData, {
        withCredentials: true,
      });
      return res;
    },
  });

  useEffect(() => {
    const loadingDialog = document.getElementById("loadingDialog") as HTMLDialogElement;
    const sureDialog = document.getElementById("sureDialog") as HTMLDialogElement;
    if (purchaseItem.isLoading) {
      if (sureDialog.open) sureDialog.close();
      loadingDialog.showModal();
    } else if (purchaseItem.isSuccess) {
      loadingDialog.close();
      const successDialog = document.getElementById("successDialog") as HTMLDialogElement;
      successDialog.showModal();
      setTimeout(() => successDialog.close(), 3000);
    } else if (purchaseItem.isError) {
      loadingDialog.close();
      const errorDialog = document.getElementById("errorDialog") as HTMLDialogElement;
      errorDialog.showModal();
      setTimeout(() => errorDialog.close(), 3000);
    }
  }, [purchaseItem.isLoading, purchaseItem.isSuccess, purchaseItem.isError]);

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
  const { status, data, isFetchedAfterMount } = useQuery<ItemDetails>(
    "getItemDetails",
    getItemDetails
  );

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

  const dialogClickedOutside = (e: React.MouseEvent<HTMLDialogElement>) => {
    const dialog = document.getElementById("sureDialog") as HTMLDialogElement;
    const dialogDimensions = dialog.getBoundingClientRect();
    if (
      e.clientX < dialogDimensions.left ||
      e.clientX > dialogDimensions.right ||
      e.clientY < dialogDimensions.top ||
      e.clientY > dialogDimensions.bottom
    ) {
      dialog.close();
    }
  };

  const [isFilled, setIsFilled] = useState(false);

  return (
    <div className={css.detailsContainer}>
      {status === "success" && isFetchedAfterMount ? (
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
          <dialog
            className={css.sureDialog}
            id="sureDialog"
            onClick={dialogClickedOutside}
          >
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
          {(purchaseItem.isError || purchaseItem.isSuccess || purchaseItem.isLoading) && (
            <LoadingDialog />
          )}
          {purchaseItem.isSuccess && (
            <IconTextDialog text="Item purchased!" icon={success} id="successDialog" />
          )}
          {purchaseItem.isError && (
            <IconTextDialog text="Something went wrong!" icon={error} id="errorDialog" />
          )}
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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <img
          src={leftArrow}
          alt="Back to home icon"
          onClick={() => navigate("/")}
          className={css.leftArrow}
        />
        <Images id={id} />
        <Details id={id} />
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default Item;
