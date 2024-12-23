import { useForm } from "react-hook-form";
import React, { useCallback, useEffect, useRef, useState } from "react";
import axios, { AxiosError } from "axios";

import css from "./AddItem.module.css";
import utilscss from "../../utils//utils.module.css";
import imageIcon from "../../assets/icons/imageIcon.svg";
import TextInput from "../fragments/FormInputs/TextInput";
import plus from "../../assets/icons/plus.svg";
import ai from "../../assets/icons/ai-svgrepo-com.svg";
import close from "../../assets/icons/close.svg";
import success from "../../assets/icons/success.svg";
import error from "../../assets/icons/error.svg";
import {
  LINK_ADD_ITEM,
  LINK_ADD_TAGS,
  LINK_ATTACH_PHOTO_ITEM,
  LINK_AUTO_TAGGING,
  LINK_GET_ALL_TAGS,
  closeDialog,
  showAndCloseDialog,
  showDialog,
} from "../misc";
import { useMutation, useQuery } from "react-query";
import TextArea from "../fragments/FormInputs/TextArea";
import RadioBtn from "../fragments/FormInputs/RadioBtn";
import SelectInput from "../fragments/FormInputs/SelectInput";
import Button from "../fragments/FormInputs/Button";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavBottom, MobileNavTop } from "../fragments/nav-bar/nav-bar";
import LoadingDialog, { IconTextDialog } from "../fragments/commonstuff/Dialogs";
import deleteIcon from "../../assets/icons/delete.svg";
import ReactCrop, { centerCrop, Crop, makeAspectCrop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ItemDetails {
  description: string;
  name: string;
  isFeminine: number;
  price: number;
  size: string;
}
interface ImageInputProps {
  photos: string[];
  onChange: (files: File[]) => void;
  handleDeleteImg: (index: number) => void;
}

interface AddTagProps {
  tag: number[];
  setTag: React.Dispatch<React.SetStateAction<number[]>>;
  submittedOnce: boolean;
  setSubmitted: any;
  imageFiles: File[];
}

export interface TagData {
  [key: string]: number;
}

let images: any;

const MultipleImageInput: React.FC<ImageInputProps> = ({ photos, onChange, handleDeleteImg }) => {
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImage(reader.result as string);
        dialogRef.current?.showModal();
      });
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
          height: 100,
        },
        width / height,
        width,
        height
      ),
      width,
      height
    );
    setCrop(crop);
  }, []);

  const handleComplete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (completedCrop && imageRef.current) {
      const canvas = document.createElement("canvas");
      const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
      const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(
          imageRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width,
          completedCrop.height
        );
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });
          onChange([croppedFile]);
        }
      }, "image/jpeg");
    }
    dialogRef.current?.close();
  };

  const handleCancel = () => {
    dialogRef.current?.close();
    setImage(null);
  };

  return (
    <div className={css.imageContainer}>
      <label htmlFor="image" className={css.imageInput}>
        <img src={imageIcon} alt="Image icon" className={css.imageIcon} />
        <p>Add image</p>
      </label>
      {photos.map((photo, index) => (
        <div className={css.imageWrapper} key={index} onClick={() => handleDeleteImg(index)}>
          <img src={photo} alt="Item" className={css.image} />
          <img src={deleteIcon} alt="" className={css.deleteIcon} />
        </div>
      ))}
      <input
        type="file"
        name="image"
        id="image"
        accept="image/*"
        multiple={false}
        onChange={handleChange}
        className={css.fileInput}
        required={true}
      />
      <dialog ref={dialogRef} className={css.cropDialog}>
        <img src={close} alt="" className={css.closeIcon} onClick={handleCancel} />
        <div className={css.spacer}></div>
        <h1>Edit Image</h1>
        <div className={css.spacer}></div>
        {image && (
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
          >
            <img ref={imageRef} src={image} alt="Crop me" onLoad={onImageLoad} />
          </ReactCrop>
        )}
        <div className={css.spacer}></div>
        <div className={css.dialogButtons}>
          <Button text="Complete" handleClick={handleComplete} isPrimary={true} />
        </div>
      </dialog>
    </div>
  );
};
const AddTag: React.FC<AddTagProps> = ({
  tag,
  setTag,
  submittedOnce,
  setSubmitted,
  imageFiles,
}) => {
  const [searchText, setSearchText] = useState<string>("");
  const [tags, setTags] = useState<any>();
  const [isLoading, setLoading] = useState<boolean>(false);

  const getTags = async () => {
    const response = await axios.get(LINK_GET_ALL_TAGS, { withCredentials: true });
    console.log(response.data);
    setTags(response.data);
    return response.data;
  };

  const { status, data } = useQuery<"idle" | "error" | "loading" | "success", AxiosError, TagData>(
    "tags",
    getTags
  );

  const handleAutoTag = async () => {
    try {
      const image = imageFiles[0];
      if (image === null || image === undefined) {
        throw new Error("Upload atleast one image");
      }

      setLoading(true);
      const formData = new FormData();
      formData.append("img", image);
      const response = await axios.post(LINK_AUTO_TAGGING, formData, { withCredentials: true });
      console.log(response.data);
      const selectedTags = response.data.data.map((tag_name: string) => tags[tag_name]);
      console.log(selectedTags);
      setTag(selectedTags);
      setLoading(false);
    } catch (e) {
      setSubmitted(true);
      setLoading(false);
      console.log(e);
    }
  };

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

  const handleCloseDialog = (event: React.MouseEvent) => {
    event.preventDefault();
    const tagDialog = document.querySelector("#tagDialog") as HTMLDialogElement;
    tagDialog.close();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    console.log("Tags:", tag);
  }, [tag]);

  const handleRemoveTag = (index: number) => {
    console.log("Removing tag at index:", index);
    setTag((prevTag) => {
      console.log("Previous Tags:", prevTag);
      const newTags = prevTag.filter((_, i) => i !== index);
      console.log("New Tags:", newTags);
      return newTags;
    });
  };

  return (
    <>
      <div className={css.addTag} onClick={handleOpenDialog}>
        <img src={plus} alt="Add tag" className={css.plusIcon} />
        Add Tags
      </div>
      {tag.length === 0 && submittedOnce && <div className={css.errors}>Add a tag</div>}
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
          <div
            className={`${css.autoTagging} ${isLoading ? utilscss.skeletonAI : ""}`}
            onClick={handleAutoTag}
          >
            <img src={ai} alt="Auto Tagging with AI" className={css.plusIconAutoTagging} />
            Auto Tagging
          </div>
          {data && tag.length > 0 && (
            <div className={css.selectedTagsContainer}>
              <p>Selected tags: </p>
              {tag.map((tag, index) => {
                console.log(tag);
                console.log(Object.keys(data).find((key) => data[key] === tag));
                return (
                  <label
                    className={css.addTag}
                    onClick={() => {
                      handleRemoveTag(index);
                    }}
                    key={index}
                    htmlFor={tag.toString()}
                  >
                    {Object.keys(data).find((key) => data[key] === tag)}
                    <img src={close} alt="" className={css.deleteTagIcon} />
                  </label>
                );
              })}
            </div>
          )}
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
                        type="checkbox"
                        value={data[key]}
                        id={data[key].toString()}
                        className={css.tagRadio}
                        checked={tag.includes(data[key])}
                        onChange={() => {
                          if (!tag.includes(data[key]))
                            setTag((prevTag) => [...prevTag, data[key]]);
                        }}
                      />
                      {!tag.includes(data[key]) && (
                        <label htmlFor={data[key].toString()} className={css.addTag}>
                          <img src={plus} alt="Add tags" className={css.plusIcon} />
                          {key}
                        </label>
                      )}
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
  const [tag, setTag] = useState<number[]>([]);

  const addDetails = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post(LINK_ADD_ITEM, formData, {
        withCredentials: true,
      });
      console.log(res);
      return res.data.generatedID;
    },
    onMutate: () => showDialog("loadingDialog"),
    onError: () => {
      closeDialog("loadingDialog");
      showAndCloseDialog("errorDialog", 3000);
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
    onError: () => {
      closeDialog("loadingDialog");
      showAndCloseDialog("errorDialog", 3000);
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

  const handleDeleteImg = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const addTags = useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await axios.post(LINK_ADD_TAGS, formData, { withCredentials: true });
      console.log(res);
      return res;
    },
    onError: () => {
      closeDialog("loadingDialog");
      showAndCloseDialog("errorDialog", 3000);
    },
  });

  const onSubmit = async (data: ItemDetails) => {
    console.log(data);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price.toString());
    formData.append("size", data.size);
    formData.append("isFeminine", data.isFeminine.toString());
    formData.append("tagID", tag[0].toString());
    console.log(data);
    console.log(formData);
    const itemID = await addDetails.mutateAsync(formData);
    if (addDetails.isError) {
      return;
    }
    for (const file of files) {
      const fileFormData = new FormData();
      fileFormData.append("id", itemID.toString());
      fileFormData.append("img", file);
      console.log(itemID);
      console.log(file);
      await addPhotos.mutateAsync(fileFormData);
      if (addPhotos.isError) {
        return;
      }
    }
    for (let i = 1; i < tag.length; i++) {
      const tagFormData = new FormData();
      tagFormData.append("itemID", itemID.toString());
      tagFormData.append("tagID", tag[i].toString());
      await addTags.mutateAsync(tagFormData);
    }
    if (addTags.isError) {
      return;
    }
    setFiles([]);
    setPhotos([]);
    setSubmittedOnce(false);
    reset();
    closeDialog("loadingDialog");
    showAndCloseDialog("successDialog", 3000);
  };

  // useEffect(() => {
  //   const loadingDialog = document.querySelector("#loadingDialog") as HTMLDialogElement;
  //   if (addDetails.isLoading || addPhotos.isLoading) {
  //     loadingDialog.showModal();
  //   }
  //   if (addDetails.isError || addDetails.isError) {
  //     loadingDialog.close();
  //     const errorDialog = document.querySelector("#errorDialog") as HTMLDialogElement;
  //     errorDialog.showModal();
  //     setTimeout(() => errorDialog.close(), 3000);
  //   }
  //   if (addPhotos.isSuccess && !addPhotos.isLoading) {
  //     loadingDialog.close();
  //     const successDialog = document.querySelector("#successDialog") as HTMLDialogElement;
  //     successDialog.showModal();
  //     setTimeout(() => successDialog.close(), 3000);
  //     setFiles([]);
  //     setPhotos([]);
  //     setSubmittedOnce(false);
  //     reset();
  //   }
  // }, [addDetails.isError, addDetails.isLoading, addPhotos.isLoading, addPhotos.isSuccess]);

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <LoadingDialog />
      <IconTextDialog text="Item added!" icon={success} id="successDialog" />
      <IconTextDialog
        text="Failed to add item. Please try again after a few minutes"
        icon={error}
        id="errorDialog"
      />
      <div className={css.wrapper}>
        <h1 className={css.title}>Add Item</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={css.formContainer}>
            <div className={css.firstColumn}>
              <MultipleImageInput
                photos={photos}
                onChange={handleAddPhoto}
                handleDeleteImg={handleDeleteImg}
              />
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
                <AddTag
                  tag={tag}
                  setTag={setTag}
                  submittedOnce={submittedOnce}
                  setSubmitted={setSubmittedOnce}
                  imageFiles={files}
                />
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
