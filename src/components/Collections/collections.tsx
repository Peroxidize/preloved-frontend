import css from "./collections.module.css";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { SubmitHandler, useForm } from "react-hook-form";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  create_collection,
  delete_collection,
  get_collection,
} from "../../utils/collections";
import loading from "../../assets/loading.gif";

interface IFormInput {
  name: string;
}

interface Collection {
  id: number;
  name: string;
  created_at: string;
}

const resultAtom = atom<string>(""); // success, failed
const showModalAtom = atom<string>("");
const collectionsAtom = atom<any>(null);
const deleteDataAtom = atom<{ name: string; id: number } | null>(null);

const fetch_collection = async () => {
  return await get_collection();
};

const DeleteCollectionModal = ({ name, id }: { name: string; id: number }) => {
  const [fetching, setFetching] = useState<boolean>(false);
  const [result, setResult] = useState<string>("");
  const setCollections = useSetAtom(collectionsAtom);
  const setDeleteData = useSetAtom(deleteDataAtom);

  const deleteCollection = async () => {
    setFetching(true);
    setResult(await delete_collection(String(id)));
    setCollections(await fetch_collection());
    setFetching(false);
  };

  return (
    <div className={css.modal_container}>
      <div className={css.dialog_container}>
        {result !== "success" && (
          <div className={css.dialog_header}>
            <h2>Are you sure you want to delete {name}</h2>
          </div>
        )}
        <div className={css.buttons}>
          {result !== "success" && fetching === false && (
            <>
              <button onClick={deleteCollection} className={css.primary_button}>
                Confirm
              </button>
              <button
                onClick={() => setDeleteData(null)}
                className={css.secondary_button}
              >
                Cancel
              </button>
            </>
          )}
          {fetching && <img src={loading} className={css.loading} />}
          {result === "success" && (
            <button onClick={() => setDeleteData(null)} className={css.primary_button}>
              Close
            </button>
          )}
        </div>
        <div className={css.dialog_footer}>
          {result === "success" && (
            <p className={css.form_success}>Collection deleted successfully</p>
          )}
          {result === "failed" && (
            <p className={css.form_error}>Failed deleting collection</p>
          )}
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
                  <input className={css.primary_button} type="submit" value="Submit" />
                  <button onClick={closeModal} className={css.secondary_button}>
                    Cancel
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
          {result === "failed" && (
            <p className={css.form_error}>Error creating collection</p>
          )}
        </div>
      </div>
    </div>
  );
};

function Collections() {
  const collections = useAtomValue(collectionsAtom);
  const setCollections = useSetAtom(collectionsAtom);
  const showModal = useAtomValue(showModalAtom);
  const setShowModal = useSetAtom(showModalAtom);
  const deleteData = useAtomValue(deleteDataAtom);
  const setDeleteData = useSetAtom(deleteDataAtom);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  useEffect(() => {
    setCollections(fetch_collection());
  }, []);

  const create_modal = () => {
    setShowModal("create");
  };

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.container}>
        <h1 className={css.page_title}>Collections</h1>
        <div className={css.button_container} onClick={create_modal}>
          <h3>Create Collection</h3>
        </div>
        {collections?.map((collection: Collection) => (
          <div className={css.card_container} key={collection.id}>
            <h2>{collection.name}</h2>
            <div className={css.images}></div>
            <div className={css.button_row}>
              <button className={css.button_rename}>Rename Collection</button>
              <button
                onClick={() =>
                  setDeleteData({ name: collection.name, id: collection.id })
                }
                className={css.button_delete}
              >
                Delete Collection
              </button>
            </div>
          </div>
        ))}
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
      {showModal === "create" && <CreateCollectionModal />}
      {deleteData && <DeleteCollectionModal name={deleteData.name} id={deleteData.id} />}
    </>
  );
}

export default Collections;
