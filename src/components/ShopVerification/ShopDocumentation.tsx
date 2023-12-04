import classes from "./ShopDocumentation.module.css";
import { useState } from "react";
import Button from "../fragments/FormInputs/FileInput/Button";

import leftArrow from "../../assets/icons/leftArrow.svg";
import ImageInput from "../fragments/FormInputs/FileInput/ImageInput";

const domain = "https://prelovedbackends.azurewebsites.net/";
let endpoint = "auth/shop_id_one";

const ShopDocumentation: React.FC = () => {
  const [firstID, setFirstID] = useState<File | null>(null);
  const [secondID, setSecondID] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [photoFirstID, setPhotoFirstID] = useState<string | null>(null);
  const [photoSecondID, setPhotoSecondID] = useState<string | null>(null);
  const [photoSelfie, setPhotoSelfie] = useState<string | null>(null);

  const handleFirstIDChange = (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setFirstID(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoFirstID(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSecondIDChange = (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setSecondID(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoSecondID(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelfieChange = (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setSelfie(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoSelfie(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={classes.container}>
      <div className={classes.backAndTitle}>
        <img
          src={leftArrow}
          alt="Back to login icon"
          className={classes.backIcon}
        />
        <h1>Shop Documentation</h1>
      </div>
      <p className={classes.description}>
        To proceed to shop curation, we must verify your shop. Prepare two valid
        IDs and one selfie picture.
      </p>
      <form action="" method="post" className={classes.formContainer}>
        <div className={classes.responsiveContainer}>
          <div className={classes.flexContainer}>
            <ImageInput
              name="firstID"
              label="Upload first valid ID"
              onChange={handleFirstIDChange}
              fileName={firstID?.name}
              photo={photoFirstID}
            />
          </div>
          <div className={classes.flexContainer}>
            <ImageInput
              name="secondID"
              label="Upload second valid ID"
              onChange={handleSecondIDChange}
              fileName={secondID?.name}
              photo={photoSecondID}
            />
          </div>
        </div>
        <ImageInput
          name="selfie"
          label="Upload selfie"
          onChange={handleSelfieChange}
          fileName={selfie?.name}
          photo={photoSelfie}
        />
        <Button text="SUBMIT" />
      </form>
    </div>
  );
};

export default ShopDocumentation;
