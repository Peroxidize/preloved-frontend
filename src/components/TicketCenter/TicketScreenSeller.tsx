import css from "./ticketscreen.module.css";

import NavBar, { MobileNavBottom, MobileNavTop } from "../fragments/nav-bar/nav-bar";
import { useMediaQuery } from "react-responsive";

export default function TicketScreenSeller() {
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  return (
    <div className={css.wrapper}>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}

      <h1 className={css.title}>Ticket Center</h1>
      <div className={css.button_row}>
        <button className={css.button}>Pending</button>
        <button className={css.button}>Ready For Pickup</button>
        <button className={css.button}>Completed</button>
      </div>
      <div className={css.container}>
        <div className={css.ticket_pending}>
          <div className={css.space_between}>
            <p className={css.pending_button}>Waiting for confirmation</p>
            <p className={css.ticket_number}>#301126</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.item_name}>Dotted White Cardigan</p>
              <p className={css.price_tag}>₱215.00</p>
            </div>
            <p>Expect confirmation on or before 28/10/2023</p>
            <p>Requested on 25/10/2023</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.customer_info}>Juan de la Cruz</p>
              <p className={css.customer_info}>09123456789</p>
            </div>
          </div>
        </div>
        <div className={css.ticket_pending}>
          <div className={css.space_between}>
            <p className={css.pending_button}>Waiting for confirmation</p>
            <p className={css.ticket_number}>#301126</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.item_name}>Dotted White Cardigan</p>
              <p className={css.price_tag}>₱215.00</p>
            </div>
            <p>Expect confirmation on or before 28/10/2023</p>
            <p>Requested on 25/10/2023</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.customer_info}>Juan de la Cruz</p>
              <p className={css.customer_info}>09123456789</p>
            </div>
          </div>
        </div>
        <div className={css.ticket_pending}>
          <div className={css.space_between}>
            <p className={css.pending_button}>Waiting for confirmation</p>
            <p className={css.ticket_number}>#301126</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.item_name}>Dotted White Cardigan</p>
              <p className={css.price_tag}>₱215.00</p>
            </div>
            <p>Expect confirmation on or before 28/10/2023</p>
            <p>Requested on 25/10/2023</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.customer_info}>Juan de la Cruz</p>
              <p className={css.customer_info}>09123456789</p>
            </div>
          </div>
        </div>
        <div className={css.ticket_pending}>
          <div className={css.space_between}>
            <p className={css.pending_button}>Waiting for confirmation</p>
            <p className={css.ticket_number}>#301126</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.item_name}>Dotted White Cardigan</p>
              <p className={css.price_tag}>₱215.00</p>
            </div>
            <p>Expect confirmation on or before 28/10/2023</p>
            <p>Requested on 25/10/2023</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.customer_info}>Juan de la Cruz</p>
              <p className={css.customer_info}>09123456789</p>
            </div>
          </div>
        </div>
        <div className={css.ticket_pending}>
          <div className={css.space_between}>
            <p className={css.pending_button}>Waiting for confirmation</p>
            <p className={css.ticket_number}>#301126</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.item_name}>Dotted White Cardigan</p>
              <p className={css.price_tag}>₱215.00</p>
            </div>
            <p>Expect confirmation on or before 28/10/2023</p>
            <p>Requested on 25/10/2023</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.customer_info}>Juan de la Cruz</p>
              <p className={css.customer_info}>09123456789</p>
            </div>
          </div>
        </div>
        <div className={css.ticket_pending}>
          <div className={css.space_between}>
            <p className={css.pending_button}>Waiting for confirmation</p>
            <p className={css.ticket_number}>#301126</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.item_name}>Dotted White Cardigan</p>
              <p className={css.price_tag}>₱215.00</p>
            </div>
            <p>Expect confirmation on or before 28/10/2023</p>
            <p>Requested on 25/10/2023</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.customer_info}>Juan de la Cruz</p>
              <p className={css.customer_info}>09123456789</p>
            </div>
          </div>
        </div>
        <div className={css.ticket_pending}>
          <div className={css.space_between}>
            <p className={css.pending_button}>Waiting for confirmation</p>
            <p className={css.ticket_number}>#301126</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.item_name}>Dotted White Cardigan</p>
              <p className={css.price_tag}>₱215.00</p>
            </div>
            <p>Expect confirmation on or before 28/10/2023</p>
            <p>Requested on 25/10/2023</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.customer_info}>Juan de la Cruz</p>
              <p className={css.customer_info}>09123456789</p>
            </div>
          </div>
        </div>
        <div className={css.ticket_pending}>
          <div className={css.space_between}>
            <p className={css.pending_button}>Waiting for confirmation</p>
            <p className={css.ticket_number}>#301126</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.item_name}>Dotted White Cardigan</p>
              <p className={css.price_tag}>₱215.00</p>
            </div>
            <p>Expect confirmation on or before 28/10/2023</p>
            <p>Requested on 25/10/2023</p>
          </div>
          <hr className={css.hr} />
          <div className={css.pending_info}>
            <div className={css.space_between}>
              <p className={css.customer_info}>Juan de la Cruz</p>
              <p className={css.customer_info}>09123456789</p>
            </div>
          </div>
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </div>
  );
}
