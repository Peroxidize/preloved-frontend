import { Link, useNavigate } from "react-router-dom";
import { UserType } from "../../misc";

import css from "./nav-bar.module.css";

import logo from "../../../assets/preloved-logo.jpg";
import ticketIcon from "../../../assets/icons/ticket.svg";
import ticketFilledIcon from "../../../assets/icons/ticketFilled.svg";
import profileIcon from "../../../assets/icons/accountCircle.svg";
import profileFilledIcon from "../../../assets/icons/accountCircleFilled.svg";
import shopping_cart from "../../../assets/icons/shopping_cart.svg";
import shoppingFilledIcon from "../../../assets/icons/cartFilled.svg";
import search_icon from "../../../assets/icons/search_icon.svg";

import { useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../../App";
import { logout } from "../../../utils/auth";

function getMenu(
  userType: UserType,
  setProfileFilled: React.Dispatch<React.SetStateAction<boolean>>
) {
  switch (userType) {
    case UserType.User:
      return (
        <div
          className={css.dropdown_content}
          onMouseEnter={() => setProfileFilled(true)}
          onMouseLeave={() => setProfileFilled(false)}
        >
          <Link to="/collections" className={css.link}>
            Collections
          </Link>
          <Link to="" onClick={logout} className={css.link}>
            Logout
          </Link>
        </div>
      );
    case UserType.Seller:
      return (
        <div className={css.dropdown_content}>
          <Link to="/topup" className={css.link}>
            Top-up
          </Link>
          <Link to="/shopdocs" className={css.link}>
            Shop Verification
          </Link>
          <Link to="/ticketcenter" className={css.link}>
            Ticket Center
          </Link>
          <Link to="/collections" className={css.link}>
            Collections
          </Link>
          <Link to="" onClick={logout} className={css.link}>
            Logout
          </Link>
        </div>
      );
    case UserType.Admin:
      return (
        <div className={css.dropdown_content}>
          <Link to="/adminpanel" className={css.link}>
            Admin Panel
          </Link>
          <Link to="" onClick={logout} className={css.link}>
            Logout
          </Link>
        </div>
      );
  }
}

const MobileNavTop: React.FC = () => {
  // Component logic goes here

  return (
    // JSX code goes here
    <>
      <div className={css.mob_nav_bar}>
        <div className={css.search_bar}>
          <img src={search_icon} alt="Search Icon" />
          <input type="text" placeholder="Search" />
        </div>
      </div>
    </>
  );
};

const MobileNavBottom: React.FC = () => {
  const [profileFilled, setProfileFilled] = useState(false);
  const [ticketFilled, setTicketFilled] = useState(false);
  const [cartFilled, setCartFilled] = useState(false);
  const [storedUser, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const navigateTicketCenter = () => {
    navigate("/ticketcenter");
  };

  const toggleDropdown = () => {
    const dropdown = document.getElementById("dropdown")!;
    dropdown.classList.toggle(css.show);
  };

  return (
    // JSX code goes here
    <>
      <div className={css.mob_nav_bar_bottom}>
        <div className={css.dropdown} id="dropdown" onClick={toggleDropdown}>
          <img
            src={profileFilled ? profileFilledIcon : profileIcon}
            className={css.profile_icon}
            alt="Profile Icon"
            onMouseEnter={() => setProfileFilled(true)}
            onMouseLeave={() => setProfileFilled(false)}
          />
          {/* remove the parameter if you want to 
          access webpages without logging in */}
          {getMenu(storedUser!.type, setProfileFilled)}
        </div>
        <img
          src={cartFilled ? shoppingFilledIcon : shopping_cart}
          className={css.shopping_cart}
          alt="Shopping Cart"
          onMouseEnter={() => setCartFilled(true)}
          onMouseLeave={() => setCartFilled(false)}
        />
        <img
          src={ticketFilled ? ticketFilledIcon : ticketIcon}
          onClick={navigateTicketCenter}
          className={css.ticket_icon}
          alt="Ticket Icon"
          onMouseEnter={() => setTicketFilled(true)}
          onMouseLeave={() => setTicketFilled(false)}
        />
      </div>
    </>
  );
};

export default function DesktopNavUser() {
  const [profileFilled, setProfileFilled] = useState(false);
  const [ticketFilled, setTicketFilled] = useState(false);
  const [cartFilled, setCartFilled] = useState(false);
  const [storedUser, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const navigateTicketCenter = () => {
    navigate("/ticketcenter");
  };

  const navigateFrontPage = () => {
    navigate("/");
  };

  // useEffect(() => {
  //   const get_session = async () => {
  //     await axios
  //       .get(LINK_IS_AUTH, { withCredentials: true })
  //       .then((response) => {
  //         console.log(response);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   };

  //   get_session();
  // }, []);

  return (
    <>
      <div className={css.nav_bar}>
        <img
          src={logo}
          onClick={navigateFrontPage}
          className={css.logo}
          alt="Preloved Logo"
        />
        <div className={css.search_bar}>
          <img src={search_icon} alt="Search Icon" />
          <input type="text" placeholder="Search" />
        </div>
        <img
          src={cartFilled ? shoppingFilledIcon : shopping_cart}
          className={css.shopping_cart}
          alt="Shopping Cart"
          onMouseEnter={() => setCartFilled(true)}
          onMouseLeave={() => setCartFilled(false)}
        />
        <img
          src={ticketFilled ? ticketFilledIcon : ticketIcon}
          onClick={navigateTicketCenter}
          className={css.ticket_icon}
          alt="Ticket Icon"
          onMouseEnter={() => setTicketFilled(true)}
          onMouseLeave={() => setTicketFilled(false)}
        />
        <div className={css.dropdown}>
          <img
            src={profileFilled ? profileFilledIcon : profileIcon}
            className={css.profile_icon}
            alt="Profile Icon"
            onMouseEnter={() => setProfileFilled(true)}
            onMouseLeave={() => setProfileFilled(false)}
          />
          {/* remove the parameter if you want to 
          access webpages without logging in */}
          {getMenu(storedUser!.type, setProfileFilled)}
        </div>
      </div>
    </>
  );
}

export { MobileNavTop, MobileNavBottom };
