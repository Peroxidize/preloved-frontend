import { useNavigate } from "react-router-dom";
import classes from "../../../assets/componentCSS/commonStuff/BackAndTitle.module.css";
import leftArrow from "../../../assets/icons/leftArrow.svg";
import { useState } from "react";
import { handleResponse } from "../../../utils/auth"
import { AxiosResponse } from "axios";
import { UserType } from "../../misc";
import { userAtom } from "../../../App";
import { atom, useAtomValue } from "jotai";

interface BackAndTitleProps {
  title: string;
  backTo: string;
  containerClass?: string;
}

const BackAndTitle: React.FC<BackAndTitleProps> = ({ title, backTo, containerClass }) => {
  const navigate = useNavigate();

  const isTitleTicket = title === "Tickets";
  const isSeller = useAtomValue(atom(get => !(get(userAtom)?.type === UserType.User)));

  return (
    <div className={`${classes.backAndTitle} ${containerClass}`}>
      {!(isSeller && isTitleTicket) && <img src={leftArrow} alt="Back to home icon" onClick={() => navigate(backTo)} />}
      <h1>{title}</h1>
    </div>
  );
};

export default BackAndTitle;
