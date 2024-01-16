import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import css from "./AddItem.module.css";
import imageIcon from "../../assets/icons/imageIcon.svg";
import TextInput from "../fragments/FormInputs/TextInput";
import plus from "../../assets/icons/plus.svg";
import close from "../../assets/icons/close.svg";
import success from "../../assets/icons/success.svg";
import error from "../../assets/icons/error.svg";
import { LINK_ADD_ITEM, LINK_ATTACH_PHOTO_ITEM, LINK_GET_ALL_TAGS } from "../misc";
import { useMutation, useQuery } from "react-query";
import TextArea from "../fragments/FormInputs/TextArea";
import RadioBtn from "../fragments/FormInputs/RadioBtn";
import SelectInput from "../fragments/FormInputs/SelectInput";
import Button from "../fragments/FormInputs/Button";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavBottom, MobileNavTop } from "../fragments/nav-bar/nav-bar";
import LoadingDialog, { IconTextDialog } from "../fragments/commonstuff/Dialogs";

interface ItemDetails {
  tag: number;
  description: string;
  name: string;
  isFeminine: number;
  price: number;
  size: string;
}
interface ImageInputProps {
  photos: string[];
  onChange: (files: File[]) => void;
}
interface TagData {
  [key: string]: string;
}

const MultipleImageInput: React.FC<ImageInputProps> = ({ photos, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onChange(Array.from(event.target.files)); // Convert FileList to array
    }
  };
  return (
    <div className={css.imageContainer}>
      <label htmlFor="image" className={css.imageInput}>
        <img src={imageIcon} alt="Image icon" className={css.imageIcon} />
        <p>Add image</p>
      </label>
      {photos.map((photo, index) => (
        <img src={photo} alt="Item" className={css.image} key={index} />
      ))}
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        multiple={true}
        onChange={handleChange}
        className={css.fileInput}
        required={true}
      />
    </div>
  );
};

const AddTag: React.FC<{ register: any; errors?: string }> = ({ register, errors }) => {
  const [tag, setTag] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const getTags = async () => {
    const response = await axios.get(LINK_GET_ALL_TAGS, { withCredentials: true });
    console.log(response.data);
    return response.data;
  };

  const { status, data, error } = useQuery<
    "idle" | "error" | "loading" | "success",
    AxiosError,
    TagData
  >("tags", getTags);

  const handleOpenDialog = () => {
    const tagDialog = document.querySelector("#tagDialog") as HTMLDialogElement;
    tagDialog?.showModal();
  };

  const handleCloseDialogOutside = (event: React.MouseEvent<HTMLDialogElement>) => {
    const tagDialog = document.querySelector("#tagDialog") as HTMLDialogElement;
    const dialogDimensions = tagDialog.getBoundingClientRect();
    if (
      event.clientX < dialogDimensions.left ||
      event.clientX > dialogDimensions.right ||
      event.clientY < dialogDimensions.top ||
      event.clientY > dialogDimensions.bottom
    ) {
      tagDialog.close();
    }
  };

  const handleCloseDialog = () => {
    const tagDialog = document.querySelector("#tagDialog") as HTMLDialogElement;
    tagDialog.close();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  return (
    <>
      <div className={css.addTag} onClick={handleOpenDialog}>
        {tag === "" && <img src={plus} alt="Add tag" className={css.plusIcon} />}
        {tag === "" ? "Add Tag" : tag}
      </div>
      {errors && <div className={css.errors}>{errors}</div>}
      <dialog className={css.tagDialog} id="tagDialog" onClick={handleCloseDialogOutside}>
        <div className={css.dialogContainer}>
          <div className={css.searchAndClose}>
            <input
              type="text"
              name="searchTags"
              id="searchTags"
              value={searchText}
              onChange={handleSearch}
              placeholder="Search for tag"
              className={css.tagSearch}
            />
            <button className={css.closeDialog} onClick={handleCloseDialog}>
              <img src={close} alt="Close Dialog" />
            </button>
          </div>
          <div className={css.tagContainer}>
            {status === "loading" ? (
              <>
                <div className={css.addTag}>
                  <img src={plus} alt="Add tag" className={css.plusIcon} />
                  Loading tags...
                </div>
              </>
            ) : (
              data &&
              Object.keys(data)
                .filter((key) => key.toLowerCase().includes(searchText.toLowerCase()))
                .map((key) => {
                  return (
                    <div className={css.radioContainer} key={data[key]}>
                      <input
                        {...register("tag", { required: "Add one tag" })}
                        type="radio"
                        value={data[key]}
                        id={data[key]}
                        onClick={() => {
                          setTag(key);
                          handleCloseDialog();
                        }}
                        className={css.tagRadio}
                      />
                      <label htmlFor={data[key]} className={css.addTag}>
                        <img src={plus} alt="Add tags" className={css.plusIcon} />
                        {key}
                      </label>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </dialog>
    </>
  );
};

const AddItem: React.FC = () => {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ItemDetails>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [submittedOnce, setSubmittedOnce] = useState(false);

  const addDetails = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post(LINK_ADD_ITEM, formData, {
        withCredentials: true,
      });
      console.log(res);
      return res.data.generatedID;
    },
  });

  const addPhotos = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post(LINK_ATTACH_PHOTO_ITEM, formData, {
        withCredentials: true,
      });
      console.log(res);
      return res;
    },
  });

  const handleAddPhoto = (newUpload: File[]) => {
    newUpload.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prevPhotos) => [...prevPhotos, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    setFiles((prevFiles) => [...prevFiles, ...newUpload]);
  };

  const onSubmit = async (data: ItemDetails) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("size", data.size);
    formData.append("isFeminine", data.isFeminine.toString());
    formData.append("tagID", data.tag.toString());
    console.log(data);
    console.log(formData);
    const itemID = await addDetails.mutateAsync(formData);
    for (const file of files) {
      const fileFormData = new FormData();
      fileFormData.append("id", itemID.toString());
      fileFormData.append("img", file);
      console.log(itemID);
      console.log(file);
      await addPhotos.mutateAsync(fileFormData);
      if (addPhotos.isError) {
        break; // Break out of the loop
      }
    }
  };

  useEffect(() => {
    const loadingDialog = document.querySelector("#loadingDialog") as HTMLDialogElement;
    if (addDetails.isLoading || addPhotos.isLoading) {
      loadingDialog.showModal();
    }
    if (addDetails.isError || addDetails.isError) {
      loadingDialog.close();
      const errorDialog = document.querySelector("#errorDialog") as HTMLDialogElement;
      errorDialog.showModal();
      setTimeout(() => errorDialog.close(), 3000);
    }
    if (addPhotos.isSuccess && !addPhotos.isLoading) {
      loadingDialog.close();
      const successDialog = document.querySelector("#successDialog") as HTMLDialogElement;
      successDialog.showModal();
      setTimeout(() => successDialog.close(), 3000);
      setFiles([]);
      setPhotos([]);
      reset();
    }
  }, [addDetails.isError, addDetails.isLoading, addPhotos.isLoading, addPhotos.isSuccess]);

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <LoadingDialog />
      <IconTextDialog text="Item added!" icon={success} id="successDialog" />
      <IconTextDialog text="Something went wrong!" icon={error} id="errorDialog" />
      <div className={css.wrapper}>
        <h1 className={css.title}>Add Item</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={css.formContainer}>
            <div className={css.firstColumn}>
              <MultipleImageInput photos={photos} onChange={handleAddPhoto} />
              {files.length === 0 && submittedOnce && (
                <div className={css.errors}>Upload at least one photo</div>
              )}
              <div className={css.nameAndTag}>
                <TextInput
                  placeholder="Name"
                  name="name"
                  type="text"
                  required
                  register={register}
                  containerClasses={css.name}
                  errors={errors.name?.message}
                />
                <AddTag register={register} errors={errors.tag?.message} />
              </div>
            </div>
            <div className={css.secondColumn}>
              <TextArea
                rows={3}
                placeholder="Description"
                name="description"
                register={register}
                errors={errors.description?.message}
                required
              />
              <div className={css.styleAndSize}>
                <SelectInput
                  label="Size:"
                  name="size"
                  options={["XS", "S", "M", "L", "XL"]}
                  register={register}
                  required={true}
                  containerClasses={css.sizeContainer}
                />
                <div className={css.styleContainer}>
                  Style:
                  <RadioBtn
                    register={register}
                    value={0}
                    group="isFeminine"
                    required={true}
                    label="Masculine"
                    id="masculine"
                  />
                  <RadioBtn
                    register={register}
                    value={1}
                    group="isFeminine"
                    required={true}
                    label="Feminine"
                    id="feminine"
                  />
                </div>
                {errors.isFeminine?.type === "required" && (
                  <div className={css.errors}>Style is required</div>
                )}
              </div>
              <TextInput
                label="Price:"
                name="price"
                type="number"
                required
                register={register}
                containerClasses={css.priceContainer}
                errors={errors.price?.message}
              />
            </div>
          </div>
          <Button text="ADD ITEM" handleClick={() => setSubmittedOnce(true)} />
        </form>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default AddItem;
