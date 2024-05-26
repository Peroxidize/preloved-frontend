import { useNavigate } from "react-router-dom";
import classes from "../../../assets/componentCSS/commonStuff/BackAndTitle.module.css";
import leftArrow from "../../../assets/icons/leftArrow.svg";
import { useEffect, useState } from "react";
import { handleResponse } from "../../../utils/auth"
import { AxiosResponse } from "axios";
import { UserType } from "../../misc";
import { userAtom } from "../../../App";
import { atom, useAtomValue } from "jotai";

interface BackAndTitleProps {
  title: string;
  backTo: string;
  containerClass?: string;
  image?: File;
}

const BackAndTitle: React.FC<BackAndTitleProps> = ({ title, backTo, containerClass, image }) => {
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    if (image) {
      const objectUrl = URL.createObjectURL(image);
      setImageSrc(objectUrl);

      // Clean up the object URL
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [image]);

  const isTitleTicket = title === "Tickets";
  const isSeller = useAtomValue(atom(get => !(get(userAtom)?.type === UserType.User)));

  return (
    <div className={`${classes.backAndTitle} ${containerClass}`}>
      {!(isSeller && isTitleTicket) && <img src={leftArrow} alt="Back to home icon" onClick={() => navigate(backTo)} />}
      <h1>{title}</h1>
      {imageSrc && <img src={imageSrc} alt="Uploaded preview" style={{height: "100px"}}/>}
    </div>
  );
};

export default BackAndTitle;
