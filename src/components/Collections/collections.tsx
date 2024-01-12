import css from "./collections.module.css";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { SubmitHandler, useForm } from "react-hook-form";
import { atom, useAtom } from "jotai";
import { useEffect, useState } from "react";
import { create_collection, get_collection } from "../../utils/collections";

interface IFormInput {
  name: string;
}

export const isFetchingAtom = atom<boolean>(false);
export const isFetching = atom(
  (get) => get(isFetchingAtom),
  (get, set, state: boolean) => {
    set(isFetchingAtom, state);
  }
);
export const successAtom = atom<boolean | null>(false);
export const isSuccess = atom(
  (get) => get(successAtom),
  (get, set, state: boolean) => {
    set(successAtom, state);
  }
);
export const showModalAtom = atom<boolean>(false);
export const showModal = atom(
  (get) => get(showModalAtom),
  (get, set, state: boolean) => {
    set(showModalAtom, state);
  }
);

export const CollectionFormModal = () => {
  const [fetching, setFetching] = useAtom(isFetching);
  const [success, setSuccess] = useAtom(isSuccess);
  const [, setShowModal] = useAtom(showModal);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = async (form) => {
    setFetching(true);
    setSuccess(await create_collection(form.name));
    setFetching(false);
  };
  const closeModal = () => {
    setShowModal(false);
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
                <p className={css.text_center}>Loading...</p>
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
          {success && <p className={css.form_success}>Collection created successfully</p>}
          {success! && <p className={css.form_error}>Unknown error</p>}
        </div>
      </div>
    </div>
  );
};

function Collections() {
  const [response, setResponse] = useState<any>(null);
  const [show, setShowModal] = useAtom(showModal);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  
  useEffect(() => {
    const fetch = async () => {
      setResponse(await get_collection());
    };

    fetch();
  }, []);

  const show_modal = () => {
    setShowModal(true);
    console.log(show);
  };

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.container}>
        <h1 className={css.page_title}>Collections</h1>
        <div className={css.button_container} onClick={show_modal}>
          <h2>Create Collection</h2>
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
      {show && <CollectionFormModal />}
    </>
  );
}

export default Collections;
