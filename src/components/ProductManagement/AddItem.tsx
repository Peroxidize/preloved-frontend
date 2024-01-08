import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";

import css from "./AddItem.module.css";
import imageIcon from "../../assets/icons/imageIcon.svg";
import TextInput from "../fragments/FormInputs/TextInput";
import plus from "../../assets/icons/plus.svg";
import close from "../../assets/icons/close.svg";
import { LINK_GET_ALL_TAGS } from "../misc";
import { useQuery } from "react-query";

interface FormData {
  image: FileList | null;
  tag: string;
}

interface ImageInputProps {
  photos: string[];
  onChange: (files: File[]) => void;
}

interface AddTagProps {
  register: any;
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

const AddTag: React.FC<{ register: any }> = ({ register }) => {
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
      <dialog className={css.tagDialog} id="tagDialog" onClick={handleCloseDialogOutside}>
        <div className={css.dialogContainer}>
          <button className={css.closeDialog} onClick={handleCloseDialog}>
            <img src={close} alt="Close Dialog" />
          </button>
          <input
            type="text"
            name="searchTags"
            id="searchTags"
            value={searchText}
            onChange={handleSearch}
            placeholder="Search for tag"
            className={css.tagSearch}
          />
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
                .filter((key) => key.includes(searchText))
                .map((key) => {
                  return (
                    <div className={css.radioContainer} key={data[key]}>
                      <input
                        {...register("tag", { required: true })}
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
  const { handleSubmit, register } = useForm<FormData>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);

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

  const onSubmit = (data: FormData) => {};

  return (
    <div className={css.wrapper}>
      <h1 className={css.title}>Add Item</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MultipleImageInput photos={photos} onChange={handleAddPhoto} />
        <TextInput
          placeholder="Name"
          name="name"
          type="text"
          required
          register={register}
          containerClasses={css.name}
        />
        <AddTag register={register} />
      </form>
    </div>
  );
};

export default AddItem;
