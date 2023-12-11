import classes from "./ShopDocumentation.module.css";
import { useState } from "react";
import Button from "../fragments/FormInputs/Button";

import leftArrow from "../../assets/icons/leftArrow.svg";
import ImageInput from "../fragments/FormInputs/ImageInput";
// import { Navigate } from "react-router-dom";
import {
  LINK_LOGOUT,
  // LINK_IS_AUTH,
  LINK_SHOP_ID1,
  LINK_SHOP_ID2,
  LINK_SHOP_IDSELFIE,
} from "../misc";
import axios from "axios";
import inProcessIcon from "../../assets/icons/verifyInProcess.svg";
interface ShopDocsProps {
  submitted: boolean;
}

const ShopDocumentation: React.FC<ShopDocsProps> = ({ submitted }) => {
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

  async function returnFrontpage() {
    localStorage.clear();
    await axios.post(LINK_LOGOUT, null, { withCredentials: true });
    window.location.replace("/frontpage");
  }

  async function submitID(endpoint: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    await axios
      .post(endpoint, formData, { withCredentials: true })
      .then((response) => {
        console.log(response);
      })
      .catch((response) => {
        console.log(response);
      });
  }

  async function handlePostRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (firstID) {
      submitID(LINK_SHOP_ID1, firstID);
    }
    if (secondID) {
      // await axios
      //   .get(LINK_IS_AUTH, { withCredentials: true })
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((response) => {
      //     console.log(response);
      //   });
      submitID(LINK_SHOP_ID2, secondID);
    }
    if (selfie) {
      // await axios
      //   .get(LINK_IS_AUTH, { withCredentials: true })
      //   .then((response) => {
      //     console.log(response);
      //   })
      //   .catch((response) => {
      //     console.log(response);
      //   });
      await submitID(LINK_SHOP_IDSELFIE, selfie);
    }
    window.location.replace("/shopdocs/submitted");
  }

  return (
    <div className={classes.backgroundPhoto}>
      <div className={classes.container}>
        <div className={classes.backAndTitle}>
          <img
            src={leftArrow}
            alt="Back to login icon"
            className={classes.backIcon}
            onClick={returnFrontpage}
          />
          <h1>Shop Documentation</h1>
        </div>

        {submitted ? (
          <div className={classes.submittedContainer}>
            <img
              src={inProcessIcon}
              alt="Verification in process"
              className={classes.submittedIcon}
            />
            <p className={classes.submittedText}>
              We have received your documents, and your verification is in
              process. Verification may take 1-2 business days. Please come back
              another time!
            </p>
          </div>
        ) : (
          <>
            <p className={classes.description}>
              To proceed to shop curation, we must verify your shop. Prepare two
              valid IDs and one selfie picture.
            </p>
            <form
              action=""
              method="post"
              className={classes.formContainer}
              onSubmit={handlePostRequest}
            >
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
          </>
        )}
      </div>
    </div>
  );
};

export default ShopDocumentation;
