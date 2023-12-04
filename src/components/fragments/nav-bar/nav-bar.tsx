import { User, UserType } from '../../user';
import { Link } from 'react-router-dom';

import css from './nav-bar.module.css';

import logo from '../../../assets/preloved-logo.jpg';
import ticketIcon from '../../../assets/icons/ticket.svg'
import profileIcon from '../../../assets/icons/accountCircle.svg'
import shopping_cart from '../../../assets/icons/shopping_cart.svg';
import search_icon from '../../../assets/icons/search_icon.svg';

const user: User = JSON.parse(localStorage.getItem('userInfo')!);

function getMenu(userType: UserType) {
  switch(userType) {
    case UserType.User:
      return (
        <div className={css.dropdown_content}>
          <Link to="/collections" className={css.link}>
            Collections
          </Link>
          <Link onClick={destroyLocalStorage} to="/" className={css.link}>
            Logout
          </Link>
        </div>
      );
    case UserType.Seller:
      return(
        <div className={css.dropdown_content}>
          <Link to="/topup" className={css.link}>
            Top-up
          </Link>
          <Link to="/collections" className={css.link}>
            Collections
          </Link>
          <Link to="" onClick={destroyLocalStorage} className={css.link}>
            Logout
          </Link>
        </div>
      );
    case UserType.Admin:
      return(
        <div className={css.dropdown_content}>
          <Link to="/adminpanel" className={css.link}>
            Admin Panel
          </Link>
          <Link to="/collections" className={css.link}>
            Collections
          </Link>
          <Link to="/" onClick={destroyLocalStorage} className={css.link}>
            Logout
          </Link>
        </div>
      );
  }
}

function destroyLocalStorage() {
  localStorage.clear();
  window.location.replace("/");
}

function navigateTicketCenter() {
  window.location.replace("/ticketcenter");
}

function navigateFrontPage() {
  window.location.replace("/frontpage");
}

export default function DesktopNavUser() {
  return (
    <div>
      <div className={css.nav_bar}>
        <img src={logo} onClick={navigateFrontPage}
          className={css.logo} alt="Preloved Logo" />
        <div className={css.search_bar}>
            <img src={search_icon} alt="Search Icon" />
            <input type="text" placeholder="Search" />
        </div>
        <img src={shopping_cart} className={css.shopping_cart} alt="Shopping Cart" />
        <img src={ticketIcon} onClick={navigateTicketCenter}
          className={css.ticket_icon} alt="Ticket Icon" />
        <div className={css.dropdown}>
          <img src={profileIcon} className={css.profile_icon} alt="Profile Icon" />
          {/* remove the parameter if you want to 
          access webpages without logging in */}
          {getMenu(user.type)}
        </div>
      </div>
    </div>
  );
}