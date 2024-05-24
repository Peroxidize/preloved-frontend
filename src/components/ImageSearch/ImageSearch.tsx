import { useMediaQuery } from "react-responsive";
import css from "./ImageSearch.module.css";
import weaviate from "weaviate-ts-client";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { useState } from "react";
import ImageInput from "../fragments/FormInputs/ImageInput";
import { useQuery } from "react-query";
import axios from "axios";
import { LINK_SEARCH } from "../misc";
import BackAndTitle from "../fragments/commonstuff/BackAndTitle";

const client = weaviate.client({
  scheme: "https",
  host: "34.87.112.226:8080", // Replace with your Weaviate endpoint
});

const ImageSearch: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const onChange = (files: FileList) => {
    if (files.length === 0) {
      return;
    }
    setFile(files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhoto(reader.result);
      } else {
        return;
      }
    };
    reader.onerror = (error) => {
      return;
    };
    reader.readAsDataURL(files[0]);
  };
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.spacer}></div>
      <div className={css.back}>
        <BackAndTitle title="Image search" backTo="/" />
      </div>
      <div className={css.inputPadding}>
        <ImageInput onChange={onChange} name="Photo" photo={photo} fileName={file?.name} />
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default ImageSearch;
