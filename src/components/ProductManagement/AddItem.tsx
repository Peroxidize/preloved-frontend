import { useForm } from "react-hook-form";
import React, { useEffect, useState } from "react";
import axios from "axios";

import css from "./AddItem.module.css";
import imageIcon from "../../assets/icons/imageIcon.svg";
import TextInput from "../fragments/FormInputs/TextInput";
import plus from "../../assets/icons/plus.svg";
import { LINK_GET_ALL_TAGS } from "../misc";

interface FormData {
  image: FileList | null;
  tag: string;
}

interface ImageInputProps {
  photos: string[];
  onChange: (files: File[]) => void;
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

const AddItem: React.FC = () => {
  const { handleSubmit, register } = useForm<FormData>();
  const [photos, setPhotos] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [tag, setTag] = useState<string>("");
  const [isOpen, setOpen] = useState(false);

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

  const handleOpenDialog = (event: React.MouseEvent<HTMLDivElement>) => {
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
        <div className={css.addTag} onClick={handleOpenDialog}>
          {tag === "" ? (
            <img src={plus} alt="Add tag" className={css.plusIcon} />
          ) : (
            <div className={css.whiteCircle}>
              <div className={css.blackCircle}>{""}</div>
            </div>
          )}
          {tag === "" ? "Add Tag" : tag}
        </div>
        <dialog
          className={css.tagDialog}
          id="tagDialog"
          onClick={handleCloseDialogOutside}
        >
          <div className={css.radioContainer}>
            <input
              {...register("tag")}
              type="radio"
              value="oten"
              id="oten"
              onClick={() => setTag("oten")}
              className={css.tagRadio}
            />
            <label htmlFor="oten" className={css.addTag}>
              <img src={plus} alt="Add tags" className={css.plusIcon} />
              oten
            </label>
          </div>
        </dialog>
      </form>
    </div>
  );
};

export default AddItem;
