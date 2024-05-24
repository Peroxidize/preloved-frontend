import { useMediaQuery } from "react-responsive";
import css from "./ImageSearch.module.css";
import weaviate from "weaviate-ts-client";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import { useState } from "react";
import ImageInput from "../fragments/FormInputs/ImageInput";
import { UseMutationResult, useMutation, useQuery } from "react-query";
import axios from "axios";
import { LINK_IMG_SEARCH, LINK_SEARCH } from "../misc";
import BackAndTitle from "../fragments/commonstuff/BackAndTitle";
import { SearchItem, SearchResults } from "../Search/Search";
import loading from "../../assets/loading.gif";
import search_css from "../Search/Search.module.css";

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

  const getItems = useMutation({
    mutationFn: async (photo: string): Promise<SearchResults[]> => {
      const formData = new FormData();
      formData.append("photo", photo);
      const res = await axios.post(LINK_IMG_SEARCH, formData, { withCredentials: true });
      console.log(res);
      return res.data.results;
    },
  });

  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <div className={css.spacer}></div>
        {getItems.status === "success" ? (
          <>
            <BackAndTitle title="Results" backTo="/" />
            <div className={search_css.display_clothing}>
              {getItems.data &&
                getItems.data.map((item) => (
                  <SearchItem itemID={item.itemID} name={item.name} key={item.itemID} />
                ))}
            </div>
          </>
        ) : (
          <>
            <BackAndTitle title="Image search" backTo="/" />
            <div className={css.inputPadding}>
              <ImageInput onChange={onChange} name="Photo" photo={photo} fileName={file?.name} />
            </div>
          </>
        )}

        {getItems.status === "loading" && (
          <img src={loading} alt="loading" className={css.loading} />
        )}
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};

export default ImageSearch;
