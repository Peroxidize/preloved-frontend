import css from "./admin-panel.module.css";
import NavBar from "../fragments/nav-bar/nav-bar";
import axios from "axios";

const domain = 'https://prelovedbackends.azurewebsites.net/';
const pending = 'auth/verification/get_list_pending';
const approvereject = 'auth/verification/approve_or_reject';
const details = 'auth/verification/get_shop_owner_details';
const status = 'auth/verification/document_status';
const image = 'auth/verification/get_image';

export default function() {

  (async () => {
    await axios.get(domain + pending)
    .then(response => {
      console.log(response);
    }).catch(error => {
      console.log(error);
    }); 
  })();

  return(
    <div className={css.wrapper}>
      <NavBar />

      <h1 className={css.title}>Ticket Center</h1>
    </div>
  );
}