import css from './nav-bar.module.css';

import logo from '../../../assets/preloved-logo.jpg';
import ticketIcon from '../../../assets/icons/ticket.svg'
import profileIcon from '../../../assets/icons/accountCircle.svg'
import shopping_cart from '../../../assets/icons/shopping_cart.svg';
import search_icon from '../../../assets/icons/search_icon.svg';

export default function DesktopNavUser() {
  return (
    <div className={css.nav_bar}>
      <img src={logo} className={css.logo} alt="Preloved Logo" />
      <div className={css.search_bar}>
          <img src={search_icon} alt="Search Icon" />
          <input type="text" placeholder="Search" />
      </div>
      <img src={shopping_cart} className={css.shopping_cart} alt="Shopping Cart" />
      <img src={ticketIcon} className={css.ticket_icon} alt="Ticket Icon" />
      <img src={profileIcon} className={css.profile_icon} alt="Profile Icon" />
    </div>
  );
}