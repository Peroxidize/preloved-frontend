import { LINK_GET_PENDING_LIST, LINK_LOGOUT } from "../misc";
import { useEffect } from "react";
import axios from "axios";

import css from "./admin-panel.module.css";
import leftArrow from "../../assets/icons/leftArrow.svg";

async function logout() {
  localStorage.clear();
  await axios.get(LINK_LOGOUT).catch((error) => {
    console.log(error);
  });
  location.href = "/";
}

export default function AdminPanel() {
  useEffect(() => {
    const fetch_list = async () => {
      await axios
        .get(LINK_GET_PENDING_LIST, { withCredentials: true })
        .then((response) => {
          console.log(response);
          console.log(JSON.stringify(response));
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetch_list();
  }, []);

  return (
    <div className={css.wrapper}>
      <div className={css.header}>
        <img
          src={leftArrow}
          onClick={() => logout()}
          alt="Back to login icon"
          className={css.back_icon}
        />
        <h1 className={css.title}>Ticket Center</h1>
      </div>
    </div>
  );
}
