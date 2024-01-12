import axios from "axios";
import { useEffect, useState } from "react";

import classes from "./ShopDocumentation.module.css";

import Button from "../fragments/FormInputs/Button";
import leftArrow from "../../assets/icons/leftArrow.svg";
import ImageInput from "../fragments/FormInputs/ImageInput";
import inProcessIcon from "../../assets/icons/verifyInProcess.svg";
import {
  LINK_LOGOUT,
  // LINK_IS_AUTH,
  LINK_SHOP_ID1,
  LINK_SHOP_ID2,
  LINK_SHOP_IDSELFIE,
} from "../misc";
import { logout } from "../../utils/auth";
import { useMutation } from "react-query";
import LoadingDialog, { ErrorDialog } from "../fragments/commonstuff/Dialogs";
import { useNavigate } from "react-router-dom";

interface ShopDocsProps {
  submitted: boolean;
}

const ShopDocumentation: React.FC<ShopDocsProps> = ({ submitted }) => {
  const navigate = useNavigate();
  const [firstID, setFirstID] = useState<File | null>(null);
  const [secondID, setSecondID] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [photoFirstID, setPhotoFirstID] = useState<string | null>(null);
  const [photoSecondID, setPhotoSecondID] = useState<string | null>(null);
  const [photoSelfie, setPhotoSelfie] = useState<string | null>(null);

  const returnFrontpage = async () => {
    await axios.post(LINK_LOGOUT, null, { withCredentials: true });
    localStorage.clear();
    location.reload();
  };

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

  const submitID1Mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axios.post(LINK_SHOP_ID1, data, { withCredentials: true });
      return res;
    },
  });

  const submitID2Mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axios.post(LINK_SHOP_ID2, data, { withCredentials: true });
      return res;
    },
  });

  const submitSelfieMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await axios.post(LINK_SHOP_IDSELFIE, data, { withCredentials: true });
      return res;
    },
  });

  async function submitID(endpoint: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    if (endpoint === LINK_SHOP_ID1) {
      submitID1Mutation.mutateAsync(formData);
    } else if (endpoint === LINK_SHOP_ID2) {
      submitID2Mutation.mutateAsync(formData);
    } else if (endpoint === LINK_SHOP_IDSELFIE) {
      submitSelfieMutation.mutateAsync(formData);
    }
  }

  useEffect(() => {
    const loadingDialog = document.querySelector("#loadingDialog") as HTMLDialogElement;
    if (
      submitID1Mutation.isLoading ||
      submitID2Mutation.isLoading ||
      submitSelfieMutation.isLoading
    ) {
      loadingDialog.showModal();
    }
    if (submitSelfieMutation.isSuccess) {
      loadingDialog.close();
      navigate("/shopdocs/submitted");
    }
    if (
      submitID1Mutation.isError ||
      submitID2Mutation.isError ||
      submitSelfieMutation.isError
    ) {
      loadingDialog.close();
      const errorDialog = document.querySelector("#errorDialog") as HTMLDialogElement;
      errorDialog.showModal();
      setTimeout(() => {
        errorDialog.close();
      }, 3000);
    }
  }, [
    navigate,
    submitID1Mutation.isError,
    submitID1Mutation.isLoading,
    submitID2Mutation.isError,
    submitID2Mutation.isLoading,
    submitSelfieMutation.isError,
    submitSelfieMutation.isLoading,
    submitSelfieMutation.isSuccess,
  ]);

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
  }

  return (
    <div className={classes.backgroundPhoto}>
      <LoadingDialog />
      <ErrorDialog text="Failed to submit photo" />
      <div className={classes.container}>
        <div className={classes.backAndTitle}>
          <img
            src={leftArrow}
            alt="Back to login icon"
            className={classes.backIcon}
            onClick={logout}
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
              We have received your documents, and your verification is in process.
              Verification may take 1-2 business days. Please come back another time!
            </p>
          </div>
        ) : (
          <>
            <p className={classes.description}>
              To proceed to shop curation, we must verify your shop. Prepare two valid IDs
              and one selfie picture.
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
