import css from './ticketscreen.module.css';

import logo from '../../assets/preloved-logo.jpg';
import shopping_cart from '../../assets/icons/shopping_cart.svg';
import search_icon from '../../assets/icons/search_icon.svg';

export default function() {
  return (
    <div className={css.wrapper}>
      <div className={css.nav_bar}>
        <img src={logo} className={css.logo} alt="Preloved Logo" />
        <div className={css.search_bar}>
          <img src={search_icon} alt="Search Icon" />
          <input type="text" placeholder="Search" />
        </div>
        <img src={shopping_cart} className={css.shopping_cart} alt="Shopping Cart" />
        <button>
          <p>Sign Up</p>
        </button>
        <button>
          <p>Login</p>
        </button>
      </div>

      <div className={css.ticket_screen}>
        <h1>Ticket Screen</h1>
        <div className={css.ticket_row}>
          <div className={css.ticket_container}>
            <h2>Pending</h2>
            <div className={css.ticket_display}>
              <div className={css.pending_ticket}>
                <div className={css.ticket_head}>
                  <span className={css.label_pending}>
                    Waiting for confirmation
                  </span>
                  <span className={css.ticket_number}>
                    #301126
                  </span>
                </div>
                <div className={css.ticket_body}>
                  <hr />
                  <span className={css.left_right}>
                    <h6>Dotted White Cardigan</h6>
                    <h6>₱215.00</h6>
                  </span>
                  <p>Expect confirmation on or before 28/10/2023</p>
                  <p>Requested on 25/10/2023</p>
                  <hr />
                  <span className={css.left_right}>
                    <p>Juan de la Cruz</p>
                    <p>+639123456789</p>
                  </span>
                  <span className={css.center_button}>
                    <button type="submit" className={css.confirm_button}>
                        Submit
                    </button> 
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className={css.ticket_container}>
            <h2>Ready for pickup</h2>
            <div className={css.ticket_display}>
              
            </div>
          </div>
          <div className={css.ticket_container}>
            <h2>Completed</h2>
            <div className={css.ticket_display}>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}