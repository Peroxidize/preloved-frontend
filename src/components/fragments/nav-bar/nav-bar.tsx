import { Link, useNavigate } from "react-router-dom";
import { LINK_GET_STORES, LINK_SEARCH, User, UserType } from "../../misc";

import css from "./nav-bar.module.css";
import logo from "../../../assets/preloved-logo.jpg";
import ticketIcon from "../../../assets/icons/ticket.svg";
import ticketFilledIcon from "../../../assets/icons/ticketFilled.svg";
import profileIcon from "../../../assets/icons/accountCircle.svg";
import profileFilledIcon from "../../../assets/icons/accountCircleFilled.svg";
import shopping_cart from "../../../assets/icons/shopping_cart.svg";
import shoppingFilledIcon from "../../../assets/icons/cartFilled.svg";
import search_icon from "../../../assets/icons/search_icon.svg";

import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../../App";
import { get_current_user, logout } from "../../../utils/auth";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { get_balance } from "../../../utils/store";

export const UserMenu = () => {
  return (
    <div className={css.dropdown_content}>
      <Link to="/collections" className={css.link}>
        Collections
      </Link>
      <Link to="" onClick={logout} className={css.link}>
        Logout
      </Link>
    </div>
  );
};

export const SellerMenu = () => {
  const [storedUser, setUser] = useAtom(userAtom);
  const [balance, setBalance] = useState<any>(null);
  const [hasStore, setHasStore] = useState(false);
  useEffect(() => {
    axios
      .get(LINK_GET_STORES, { withCredentials: true })
      .then((res) => {
        if (res.data.stores.length > 0) setHasStore(true);
      })
      .catch((res) => {
        console.log(res);
      });

    const fetch = async () => {
      setBalance(await get_balance(String(storedUser!.shop_owner_id)));
    };

    fetch();
  }, []);
  return (
    <div className={css.dropdown_content}>
      <div className={css.link}>
        Balance: {balance === null ? "Loading..." : parseFloat(balance)}
      </div>
      <Link to={hasStore ? "/shop" : "/shop/create"} className={css.link}>
        {hasStore ? "My Shop" : "Create Shop"}
      </Link>
      <Link to="/topup" className={css.link}>
        Top-up
      </Link>
      <Link to="/redeem" className={css.link}>
        Redeem Voucher
      </Link>
      <Link to="" onClick={logout} className={css.link}>
        Logout
      </Link>
    </div>
  );
};

function getMenu(userType: UserType) {
  switch (userType) {
    case UserType.User:
      return UserMenu();
    case UserType.Seller:
      return SellerMenu();
  }
}

const MobileNavTop: React.FC = () => {
  // Component logic goes here
  const [storedUser, setUser] = useAtom(userAtom);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  if (storedUser?.type === UserType.Seller) return null;

  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    navigate(`/search?q=${searchText}`);
  };

  return (
    // JSX code goes here
    <>
      <div className={css.mob_nav_bar}>
        <div className={css.search_bar}>
          <img src={search_icon} alt="Search Icon" onClick={handleSearch} />
          <input
            type="search"
            placeholder="Search"
            onChange={handleSearchText}
            value={searchText}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSearch();
              }
            }}
          />
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
          {getMenu(storedUser!.type)}
        </div>
        {storedUser?.type === UserType.User && (
          <img
            src={cartFilled ? shoppingFilledIcon : shopping_cart}
            className={css.shopping_cart}
            alt="Shopping Cart"
            onMouseEnter={() => setCartFilled(true)}
            onMouseLeave={() => setCartFilled(false)}
            onClick={() => navigate("/cart")}
          />
        )}
        <img
          src={ticketFilled ? ticketFilledIcon : ticketIcon}
          onClick={() => navigate("/ticketcenter")}
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
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const navigateFrontPage = () => {
    navigate("/");
  };

  const handleSearchText = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSearch = () => {
    navigate(`/search?q=${searchText}`);
  };

  useEffect(() => {
    const fetch = async () => {
      console.log(await get_current_user());
    };

    fetch();
  }, []);

  return (
    <>
      <div className={css.nav_bar}>
        <img src={logo} onClick={navigateFrontPage} className={css.logo} alt="Preloved Logo" />
        {storedUser?.type === UserType.User ? (
          <>
            <div className={css.center}>
              <div className={css.search_bar}>
                <img src={search_icon} alt="Search Icon" onClick={handleSearch} />
                <input
                  type="text"
                  placeholder="Search"
                  onChange={handleSearchText}
                  value={searchText}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleSearch();
                    }
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <div className={css.center}>
            <h2 className={css.sellerSpace}>Seller Space</h2>
          </div>
        )}
        <div className={css.navIcons}>
          {storedUser?.type === UserType.User && (
            <img
              src={cartFilled ? shoppingFilledIcon : shopping_cart}
              className={css.shopping_cart}
              alt="Shopping Cart"
              onMouseEnter={() => setCartFilled(true)}
              onMouseLeave={() => setCartFilled(false)}
              onClick={() => navigate("/cart")}
            />
          )}
          <img
            src={ticketFilled ? ticketFilledIcon : ticketIcon}
            onClick={() => navigate("/ticketcenter")}
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
            {getMenu(storedUser!.type)}
          </div>
        </div>
      </div>
    </>
  );
}

export { MobileNavTop, MobileNavBottom };
