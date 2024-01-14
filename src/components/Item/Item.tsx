import React, { useEffect, useState } from "react";
import modalcss from "../Collections/collections.module.css";
import css from "./Item.module.css";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavBottom, MobileNavTop } from "../fragments/nav-bar/nav-bar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  LINK_ADD_TO_CART,
  LINK_GET_ITEM_DETAILS,
  LINK_GET_ITEM_IMAGES,
  LINK_PURCHASE_ITEM,
} from "../misc";
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
import loading from "../../assets/loading.gif";
import LoadingDialog, { IconTextDialog } from "../fragments/commonstuff/Dialogs";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useForm, SubmitHandler } from "react-hook-form";
import { showModalAtom, collectionsAtom, Collection } from "../Collections/collections";
import { add_item_to_collection, get_collection } from "../../utils/collections";

const itemDataAtom = atom<{ itemID: number; name: string } | null>(null);

interface IFormInput {
  collectionID: number;
}

const AddToCollectionModal = ({ name, id }: { name: string; id: number }) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const setCollections = useSetAtom(collectionsAtom);
  const [result, setResult] = useState<string>("");
  const setShowModal = useSetAtom(showModalAtom);
  const collections = useAtomValue(collectionsAtom);
  const itemData = useAtomValue(itemDataAtom);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (form) => {
    setFetching(true);
    setResult(
      await add_item_to_collection(String(form.collectionID), String(itemData?.itemID))
    );
    setFetching(false);
  };

  return (
    <div className={modalcss.modal_container}>
      <div className={modalcss.dialog_container}>
        <div className={modalcss.dialog_header}>
          <h2>Add {name} to Collection</h2>
        </div>
        <div className={modalcss.dialog_body}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <select
              className={modalcss.form_input}
              {...register("collectionID", { required: true })}
            >
              <option value="">Select Collection</option>
              {collections?.map((collection: Collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
            {fetching ? (
              <>
                <img src={loading} className={modalcss.loading} />
              </>
            ) : (
              <>
                <div className={modalcss.buttons}>
                  <input
                    className={modalcss.primary_button}
                    type="submit"
                    value="Add to collection"
                  />
                  <button
                    onClick={() => setShowModal("")}
                    className={modalcss.secondary_button}
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
        <div className={modalcss.dialog_footer}>
          {errors.collectionID && (
            <p className={modalcss.form_error}>You must select a collection</p>
          )}
          {result === "success" ? (
            <p className={modalcss.form_success}>Item added to collection successfully</p>
          ) : (
            <p className={modalcss.form_error}>{result}</p>
          )}
        </div>
      </div>
    </div>
  );
};

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

export interface ItemDetails {
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
  const [storeID, setStoreID] = useState("");
  const setItemData = useSetAtom(itemDataAtom);

  const purchaseItem = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("itemID", id as string);
      formData.append("storeID", storeID as string);
      const res = await axios.post(LINK_PURCHASE_ITEM, formData, {
        withCredentials: true,
      });
      return res;
    },
  });

  const addToCart = useMutation({
    mutationFn: async () => {
      console.log(id);
      const formData = new FormData();
      formData.append("itemID", id as string);
      const res = await axios.post(LINK_ADD_TO_CART, formData, {
        withCredentials: true,
      });
      console.log(res);
      return res;
    },
    onMutate: () => {
      const loadingDialog = document.getElementById("loadingDialog") as HTMLDialogElement;
      loadingDialog.showModal();
    },
    onSuccess: () => {
      const loadingDialog = document.getElementById("loadingDialog") as HTMLDialogElement;
      loadingDialog.close();
      const successDialog = document.getElementById(
        "cartSuccessDialog"
      ) as HTMLDialogElement;
      successDialog.showModal();
      setTimeout(() => successDialog.close(), 3000);
    },
    onError: () => {
      const loadingDialog = document.getElementById("loadingDialog") as HTMLDialogElement;
      loadingDialog.close();
      const errorDialog = document.getElementById("errorDialog") as HTMLDialogElement;
      errorDialog.showModal();
      setTimeout(() => errorDialog.close(), 3000);
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
    setStoreID(String(res.data.storeID));
    setItemData({ itemID: res.data.itemID, name: res.data.name });
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
  const [showModal, setShowModal] = useAtom(showModalAtom);
  const itemData = useAtomValue(itemDataAtom);

  return (
    <div className={css.detailsContainer}>
      {status === "success" && isFetchedAfterMount ? (
        <>
          {showModal === "add" && (
            <AddToCollectionModal name={itemData!.name} id={itemData!.itemID} />
          )}
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
              <div className={css.icon_tooltip}>
                <span>Add to collection</span>
                <img
                  src={isFilled ? addCollectionsFilled : addCollectionsIcon}
                  alt=""
                  onMouseEnter={() => setIsFilled(true)}
                  onMouseLeave={() => setIsFilled(false)}
                  onClick={() => setShowModal("add")}
                  className={css.addCollectionsIcon}
                />
              </div>
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
            <button className={css.addToCart} onClick={() => addToCart.mutate()}>
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
          <LoadingDialog />
          <IconTextDialog text="Item purchased!" icon={success} id="successDialog" />
          <IconTextDialog
            text="Item added to cart!"
            icon={success}
            id="cartSuccessDialog"
          />
          <IconTextDialog text="Something went wrong!" icon={error} id="errorDialog" />
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
  const setCollections = useSetAtom(collectionsAtom);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  useEffect(() => {
    const fetch_user_collection = async () => {
      setCollections(await get_collection());
    };

    fetch_user_collection();
  }, []);

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
