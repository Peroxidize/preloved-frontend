import utilcss from "../../utils/utils.module.css";
import frontcss from "../FrontPage/frontpage.module.css";
import css from "./collections.module.css";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { SubmitHandler, useForm } from "react-hook-form";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import deleteSVG from "../../assets/icons/delete.svg";
import editSVG from "../../assets/icons/edit-svgrepo-com.svg";
import plusSVG from "../../assets/icons/plus.svg";
import left_arrow from "../../assets/icons/leftArrow.svg";
import {
  create_collection,
  delete_collection,
  get_collection,
  remove_item_from_collection,
  rename_collection,
} from "../../utils/collections";
import loading from "../../assets/loading.gif";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  name: string;
}

interface ItemInformation {
  image: string;
  itemID: number;
  name: string;
  price: string;
  storeName: string;
}

interface DisplayClothingProps {
  collection: Collection; // Ensure this matches the expected type
  item_informaion?: ItemInformation; // Optional if it can be undefined
  setDisplayClothing: any;
}

export interface Collection {
  id: number;
  name: string;
  created_at: string;
  img_ids: string[];
  img_links: string[];
  itemInformation: ItemInformation[];
}

export const resultAtom = atom<string>(""); // success, failed
export const resultDeleteAtom = atom<string>(""); // success, failed
export const itemIDAtom = atom<number>(-1); // success, failed
export const showModalAtom = atom<string>("");
export const collectionsAtom = atom<any>(null);
export const collectionDataAtom = atom<{ name: string; id: number } | null>(null);

const fetch_collection = async () => {
  return await get_collection();
};

const RemoveItemModal = ({
  collectionID,
  itemID,
  img_link,
}: {
  collectionID: string;
  itemID: string;
  img_link: string;
}) => {
  const navigate = useNavigate();
  const [fetching, setFetching] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const setShowModal = useSetAtom(showModalAtom);
  const setItemID = useSetAtom(itemIDAtom);
  const setResultDelete = useSetAtom(resultDeleteAtom);
  const setCollections = useSetAtom(collectionsAtom);

  const delete_item = async () => {
    setFetching(true);
    const result = await remove_item_from_collection(collectionID, itemID);
    console.log(result);
    setItemID(Number(itemID));
    setResult(result);
    setResultDelete(String(result));
    setFetching(false);
    setCollections(fetch_collection());
  };

  const nav = () => {
    setShowModal("");
    navigate(`/item/${itemID}`);
  };

  return (
    <div className={css.modal_container}>
      <div className={css.dialog_container}>
        <div className={css.dialog_header}>
          <h2>Remove</h2>
        </div>
        <div className={css.dialog_body}>
          <img src={img_link} onClick={nav} className={`${css.image} ${css.image_display}`} />
          <div className={css.buttons}>
            {fetching && <img src={loading} className={css.loading} />}
            {result !== "success" && !fetching && (
              <>
                <button
                  onClick={delete_item}
                  className={`${css.primary_button} ${css.modal_button}`}
                >
                  Remove
                </button>
                <button
                  onClick={() => setShowModal("")}
                  className={`${css.secondary_button} ${css.modal_button}`}
                >
                  Close
                </button>
              </>
            )}
            {result === "success" && (
              <button onClick={() => setShowModal("")} className={css.primary_button}>
                Close
              </button>
            )}
          </div>
        </div>
        <div className={css.dialog_footer}>
          {result === "success" && <p className={css.form_success}>Item removed from collection</p>}
          {result === "failed" && (
            <p className={css.form_error}>Failed removing item from collection</p>
          )}
        </div>
      </div>
    </div>
  );
};

const RenameCollectionModal = ({ name, id }: { name: string; id: number }) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const setShowModal = useSetAtom(showModalAtom);
  const setCollections = useSetAtom(collectionsAtom);
  const newName = useRef<string>("");

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (form) => {
    setFetching(true);
    setResult(await rename_collection(String(id), form.name));
    newName.current = form.name;
    setFetching(false);
    setCollections(await fetch_collection());
  };

  return (
    <div className={css.modal_container}>
      <div className={css.dialog_container}>
        <div className={css.dialog_header}>
          <h2>Rename {result === "success" ? newName.current : name}</h2>
        </div>
        <div className={css.dialog_body}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className={css.form_input}
              {...register("name", { required: true })}
              placeholder="Vintage Clothes"
            />
            {fetching ? (
              <>
                <img src={loading} className={css.loading} />
              </>
            ) : (
              <>
                <div className={css.buttons}>
                  <input
                    className={`${css.primary_button} ${css.modal_button}`}
                    type="submit"
                    value="Rename"
                  />
                  <button
                    onClick={() => setShowModal("")}
                    className={`${css.secondary_button} ${css.modal_button}`}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
        <div className={css.dialog_footer}>
          {errors.name && <p className={css.form_error}>Collection name is required</p>}
          {result === "success" && (
            <p className={css.form_success}>Collection renamed successfully</p>
          )}
          {result === "failed" && <p className={css.form_error}>Failed renaming collection</p>}
        </div>
      </div>
    </div>
  );
};

const DeleteCollectionModal = ({ name, id }: { name: string; id: number }) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const setShowModal = useSetAtom(showModalAtom);
  const setCollections = useSetAtom(collectionsAtom);

  const deleteCollection = async () => {
    setFetching(true);
    setResult(await delete_collection(String(id)));
    setFetching(false);
    setCollections(await fetch_collection());
  };

  return (
    <div className={css.modal_container}>
      <div className={css.dialog_container}>
        {result !== "success" && (
          <div className={css.dialog_header}>
            <h2>Are you sure you want to delete {name}?</h2>
          </div>
        )}
        <div className={css.buttons}>
          {result !== "success" && fetching === false && (
            <>
              <button
                onClick={deleteCollection}
                className={`${css.primary_button} ${css.modal_button}`}
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal("")}
                className={`${css.secondary_button} ${css.modal_button}`}
              >
                Close
              </button>
            </>
          )}
          {fetching && <img src={loading} className={css.loading} />}
          {result === "success" && (
            <button
              onClick={() => setShowModal("")}
              className={`${css.primary_button} ${css.modal_button}`}
            >
              Close
            </button>
          )}
        </div>
        <div className={css.dialog_footer}>
          {result === "success" && (
            <p className={css.form_success}>Collection deleted successfully</p>
          )}
          {result === "failed" && <p className={css.form_error}>Failed deleting collection</p>}
        </div>
      </div>
    </div>
  );
};

export const CreateCollectionModal = () => {
  const [fetching, setFetching] = useState<boolean>(false);
  const result = useAtomValue(resultAtom);
  const setResult = useSetAtom(resultAtom);
  const setShowModal = useSetAtom(showModalAtom);
  const setCollections = useSetAtom(collectionsAtom);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (form) => {
    setFetching(true);
    setResult(await create_collection(form.name));
    setFetching(false);
    setCollections(await fetch_collection());
  };

  const closeModal = () => {
    setShowModal("");
  };

  return (
    <div className={css.modal_container}>
      <div className={css.dialog_container}>
        <div className={css.dialog_header}>
          <h2>Collection Name</h2>
        </div>
        <div className={css.dialog_body}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className={css.form_input}
              {...register("name", { required: true })}
              placeholder="Vintage Clothes"
            />
            {fetching ? (
              <>
                <img src={loading} className={css.loading} />
              </>
            ) : (
              <>
                <div className={css.buttons}>
                  <input
                    className={`${css.primary_button} ${css.modal_button}`}
                    type="submit"
                    value="Submit"
                  />
                  <button
                    onClick={closeModal}
                    className={`${css.secondary_button} ${css.modal_button}`}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
        <div className={css.dialog_footer}>
          {errors.name && <p className={css.form_error}>Collection name is required</p>}
          {result === "success" && (
            <p className={css.form_success}>Collection created successfully</p>
          )}
          {result === "failed" && <p className={css.form_error}>Error creating collection</p>}
        </div>
      </div>
    </div>
  );
};

const DisplayClothing = ({
  collection,
  item_information,
  setDisplayClothing,
  setItemData,
}: {
  collection: Collection;
  item_information: ItemInformation[];
  setDisplayClothing: any;
  setItemData: any;
}) => {
  const navigate = useNavigate();
  const [deleteResult, setDeleteResult] = useAtom(resultDeleteAtom);
  const itemID = useAtomValue(itemIDAtom);
  const [updatedItems, setUpdatedItems] = useState(item_information);
  const [isAllItems, setAllItems] = useState(true);

  useEffect(() => {
    // If deleteResult is "success", filter out the deleted item by itemID
    if (deleteResult === "success") {
      setUpdatedItems((prevItems) => prevItems.filter((item) => item.itemID !== itemID));
      setDeleteResult(""); // Reset delete result after processing
      console.log("TEST@!#!@");
      console.log(itemID);
    }
  }, [deleteResult, itemID]);

  return (
    <>
      <div className={css.collection_wrapper}>
        <div className={css.collection_content}>
          <div className={css.collection_header}>
            <img
              src={left_arrow}
              className={css.left_arrow}
              onClick={() => setDisplayClothing(false)}
            />
            <h1>{collection?.name}</h1>
          </div>
          <div className={css.fyp}>
            <p className={isAllItems ? css.bg_white : ""} onClick={() => setAllItems(true)}>
              All Items
            </p>
            <p className={isAllItems ? "" : css.bg_white} onClick={() => setAllItems(false)}>
              For You
            </p>
          </div>
          <div className={css.collection_body}>
            <div className={css.clothing_display}>
              {updatedItems.map((item_information: ItemInformation) => {
                return (
                  <div className={css.item_container} key={item_information.itemID}>
                    <img
                      src={item_information?.image}
                      className={css.img}
                      onClick={() => navigate(`/item/${item_information.itemID}`)}
                    />
                    <div className={css.information_container}>
                      <p className={css.item_name}>{item_information.name}</p>
                      <p className={css.store_name}>{item_information.storeName}</p>
                      <div className={css.space_between}>
                        <p className={css.item_name}>₱{item_information.price}</p>
                        <img
                          src={deleteSVG}
                          className={css.svg}
                          onClick={() =>
                            setItemData(
                              String(collection.id),
                              item_information.itemID,
                              item_information.image,
                              "delete_item"
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

function Collections() {
  const [collections, setCollections] = useAtom(collectionsAtom);
  const [showModal, setShowModal] = useAtom(showModalAtom);
  const [collectionData, setCollectionData] = useAtom(collectionDataAtom);
  const [displayClothing, setDisplayClothing] = useState<boolean>(false);
  const [itemInformation, setItemInformation] = useState<ItemInformation[]>();
  const [collectionInformation, setCollectionInformation] = useState<Collection>();
  const [itemData, setItemData] = useState<{
    collectionID: string;
    itemID: string;
    img_link: string;
  } | null>(null);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  useEffect(() => {
    setCollections(fetch_collection());
  }, []);

  useEffect(() => {
    console.log(collections);
  }, [collections]);

  const create_modal = (modal: string) => {
    setShowModal(modal);
  };

  const set_data = (collection: Collection, modal: string) => {
    setCollectionData({ name: collection.name, id: collection.id });
    create_modal(modal);
  };

  const set_item_data = (collectionID: string, itemID: string, img_link: string, modal: string) => {
    setItemData({ collectionID, itemID, img_link });
    setShowModal(modal);
  };

  const handleCollectionClick = (collection: Collection, item_information: ItemInformation[]) => {
    setCollectionInformation(collection);
    setItemInformation(item_information);
    setDisplayClothing(true);
  };

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.container2}>
        <div className={css.collections2}>
          <h1>Your Collections</h1>
          <div className={css.list_container}>
            <div className={css.createCollection} onClick={() => create_modal("create")}>
              <img src={plusSVG} className={css.addIcon} />
            </div>
            {collections?.map((collection: Collection) => (
              <div className={css.collection_container} key={collection.name}>
                <img
                  src={collection.img_links[0]}
                  className={css.img}
                  onClick={() => handleCollectionClick(collection, collection.itemInformation)}
                />
                <div className={css.list_info}>
                  <p className={css.collection_name}>{collection.name}</p>
                  <div className={css.icons_container}>
                    <img
                      src={editSVG}
                      className={css.svg}
                      onClick={() => set_data(collection, "rename")}
                    />
                    <img
                      src={deleteSVG}
                      className={css.svg}
                      onClick={() => set_data(collection, "delete")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
      {showModal === "delete_item" && itemData && (
        <RemoveItemModal
          collectionID={itemData!.collectionID}
          itemID={itemData!.itemID}
          img_link={itemData!.img_link}
        />
      )}
      {showModal === "create" && <CreateCollectionModal />}
      {showModal === "delete" && (
        <DeleteCollectionModal name={collectionData!.name} id={collectionData!.id} />
      )}
      {showModal === "rename" && (
        <RenameCollectionModal name={collectionData!.name} id={collectionData!.id} />
      )}
      {displayClothing && (
        <DisplayClothing
          collection={collectionInformation!}
          item_information={itemInformation!}
          setDisplayClothing={setDisplayClothing}
          setItemData={set_item_data}
        />
      )}
    </>
  );
}

export default Collections;
