import React, { useEffect, useState } from "react";
import modalcss from "../Collections/collections.module.css";
import css from "./Item.module.css";
import exportedcss from "../FrontPage/frontpage.module.css";
import utilcss from "../../utils/utils.module.css";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavBottom, MobileNavTop } from "../fragments/nav-bar/nav-bar";
import { redirect, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  LINK_ADD_TO_CART,
  LINK_GET_ITEM_DETAILS,
  LINK_GET_ITEM_IMAGES,
  LINK_GET_SIMILAR_ITEMS,
  LINK_PURCHASE_ITEM,
  closeDialog,
  showAndCloseDialog,
  showDialog,
} from "../misc";
import { useMutation, useQuery } from "react-query";
import Tag from "../fragments/commonstuff/Tag";
import addCollectionsIcon from "../../assets/icons/addCollections.svg";
import addCollectionsFilled from "../../assets/icons/addCollectionsFilled.svg";
import Button from "../fragments/FormInputs/Button";
import cartIcon from "../../assets/icons/shopping_cart.svg";
import leftArrow from "../../assets/icons/leftArrow.svg";
import mapsIcon from "../../assets/icons/maps.svg";
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
import { get_location_link } from "../../utils/auth";
import { Image } from "../FrontPage/FrontPage";

const itemDataAtom = atom<{ itemID: number; name: string } | null>(null);
const storeIDAtom = atom<string | null>(null);
const linkAtom = atom<string | null>(null);

interface IFormInput {
  collectionID: number;
}

interface similarImage {
  link: string;
  slugID: number;
}

interface similarItems {
  images: string;
  item_id: number;
  item_name: string;
  item_price: string;
  storeName: string;
}

const ResultModal = () => {
  const setShowModal = useSetAtom(showModalAtom);

  return (
    <div className={modalcss.modal_container}>
      <div className={modalcss.shop_modal}>
        <div className={modalcss.dialog_header}>
          <h1>Unable to get your coordinates</h1>
        </div>
        <div className={modalcss.dialog_body}>
          <p>Allow location request next time</p>
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
    setResult(await add_item_to_collection(String(form.collectionID), String(itemData?.itemID)));
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
                  <button onClick={() => setShowModal("")} className={modalcss.secondary_button}>
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
          <div className={`${css.mainImage} ${utilcss.skeleton}`}>{""}</div>
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
          <div className={`${css.image} ${utilcss.skeleton}`}>{""}</div>
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
  const mapsLink = useAtomValue(linkAtom);
  const setStore = useSetAtom(storeIDAtom);
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
    onMutate: () => {
      closeDialog("sureDialog");
      showDialog("loadingDialog");
    },
    onSuccess: () => {
      closeDialog("loadingDialog");
      showAndCloseDialog("successDialog", 3000);
      setIsFilled(false);
    },
    onError: () => {
      closeDialog("loadingDialog");
      showAndCloseDialog("buyErrorDialog", 3000);
      setIsFilled(false);
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
    onMutate: () => showDialog("loadingDialog"),
    onSuccess: () => {
      closeDialog("loadingDialog");
      showAndCloseDialog("cartSuccessDialog", 3000);
      setIsFilled(false);
    },
    onError: (error) => {
      console.log(error);
      closeDialog("loadingDialog");
      showAndCloseDialog("cartErrorDialog", 3000);
      setIsFilled(false);
    },
  });

  const getItemDetails = async () => {
    const res = await axios.get(LINK_GET_ITEM_DETAILS, {
      params: {
        id: id,
      },
      withCredentials: true,
    });
    setStoreID(String(res.data.storeID));
    setStore(String(res.data.storeID));
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
              <Tag isPrimary={!data.isFeminine}>{data.isFeminine ? "Feminine" : "Masculine"}</Tag>
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
              {mapsLink && (
                <>
                  <div className={css.icon_tooltip}>
                    <span>Google Maps Location</span>
                    <a href={mapsLink!} target="_blank" rel="noopener noreferrer">
                      <img src={mapsIcon} alt="Description of the image" className={css.mapsIcon} />
                    </a>
                  </div>
                </>
              )}
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
            <Button text="Buy Now" isPrimary={true} handleClick={() => handleDialog(true)} />
          </div>
          <dialog className={css.sureDialog} id="sureDialog" onClick={dialogClickedOutside}>
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
                <Button text="No" isPrimary={true} handleClick={() => handleDialog(false)} />
              </div>
            </div>
          </dialog>
          <LoadingDialog />
          <IconTextDialog text="Item purchased!" icon={success} id="successDialog" />
          <IconTextDialog text="Item added to cart!" icon={success} id="cartSuccessDialog" />
          <IconTextDialog
            text="Cannot add item to cart. Pending ticket already exists."
            icon={error}
            id="cartErrorDialog"
          />
          <IconTextDialog
            text="Cannot buy item. Pending ticket already exists."
            icon={error}
            id="buyErrorDialog"
          />
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
  const [accepted, setAccepted] = useState<{ long: string; lat: string } | null>(null);
  const storeID = useAtomValue(storeIDAtom);
  const [show, setShow] = useAtom(showModalAtom);
  const [link, setLink] = useAtom(linkAtom);
  const [similarItems, setSimilarItems] = useState<any[]>([]);
  const setCollections = useSetAtom(collectionsAtom);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  const handleClick = (itemID: number) => {
    navigate(`/item/${itemID}`, { state: { toRefresh: true }});
    window.location.reload();
  };

  const successCallback = (position: any) => {
    console.log(position);
    const long = String(position.coords.longitude);
    const lat = String(position.coords.latitude);
    setAccepted({ long: long, lat: lat });
  };

  const errorCallback = (error: any) => {
    setShow("denied");
  };

  useEffect(() => {
    const fetch_user_collection = async () => {
      setCollections(await get_collection());
    };

    const fetch_similar_items = async () => {
      const response = await axios.get(LINK_GET_SIMILAR_ITEMS, {
          params: {
              item_id: Number(id),
              num: 4,
          },
          withCredentials: true,
      });
      setSimilarItems(response.data.items);
    };

    fetch_user_collection();
    fetch_similar_items();
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  useEffect(() => {
    const fetch_map = async () => {
      if (accepted && storeID) {
        setLink(await get_location_link(accepted.long, accepted.lat, storeID));
      }
    };

    fetch_map();
  }, [accepted, storeID]);

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <img
          src={leftArrow}
          alt="Back to home icon"
          onClick={() => navigate(-1)}
          className={css.leftArrow}
        />
        <Images id={id} />
        <Details id={id} />
      </div>
      <div className={css.similar_container}>
        {similarItems.map((item, i) => (
            <div className={exportedcss.item_container} onClick={() => handleClick(item.itemID)}>
              <img
                src={item.image}
                className={exportedcss.img}
                key={item.itemID}
              />
              <div className={exportedcss.information_container}>
                <p className={exportedcss.item_name}>{item.name}</p>
                <p className={exportedcss.store_name}>{item.storeName}</p>
                <p className={exportedcss.item_name}>₱{item.price}</p>
              </div>
            </div>
        ))}
      </div>
      {show === "denied" && <ResultModal />}
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default Item;
