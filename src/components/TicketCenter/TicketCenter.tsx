import React, { useEffect, useState } from "react";
import css from "./TicketCenter.module.css";
import { useQuery } from "react-query";
import axios from "axios";
import {
  LINK_GET_ITEM_DETAILS,
  LINK_GET_SHOP_DETAILS,
  LINK_GET_STORES,
  LINK_GET_TICKETS,
  LINK_GET_TICKET_STATUSES,
  User,
} from "../misc";
import { useMediaQuery } from "react-responsive";
import NavBar, { MobileNavBottom, MobileNavTop } from "../fragments/nav-bar/nav-bar";
import BackAndTitle from "../fragments/commonstuff/BackAndTitle";
import { userAtom } from "../../App";
import { useAtom } from "jotai";
import Button from "../fragments/FormInputs/Button";
import { UserType } from "../misc";
import dropdown from "../../assets/icons/dropdown.svg";
import { ItemDetails } from "../Item/Item";
import LoadingText, { LoadingBigText } from "../fragments/commonstuff/Loading";
import loading from "../../assets/loading.gif";

interface TicketObject {
  itemID: number;
  status: string;
  storeID: number;
  ticketID: number;
  userID: number;
  statusLevel: number;
}

interface TicketStatus {
  id: number;
  name: string;
  level: number;
}

interface TicketDetails {
  createdAt: string;
  expected_buyer_fulfillment: string | null;
  expected_seller_fulfillment: string | null;
  itemID: number;
  status: string;
  statusINT: number;
  storeID: number;
  ticketID: number;
  userID: number;
}

interface TicketProps {
  userType: number;
  status: string;
  itemID: number;
  storeID: number;
  ticketID: number;
  statusLevel: number;
}

interface ShopDetails {
  location: string;
  shopID: string;
  shopName: string;
}

const statuses: TicketStatus[] = [
  { id: 1, name: "Pending Shop Verification", level: 1 },
  { id: 2, name: "Shop Is Checking Inventory", level: 1 },
  { id: 3, name: "Pending Packaging", level: 1 },
  { id: 4, name: "Awaiting Pickup", level: 2 },
  { id: 5, name: "Order Completed", level: 3 },
  { id: 6, name: "Item Unavailable", level: 4 },
  { id: 7, name: "Seller is not responsive / inactive", level: 4 },
  { id: 8, name: "Buyer has not picked up past the deadline, item forfeited", level: 4 },
];

const level1 = [
  "Pending Shop Verification",
  "Shop Is Checking Inventory",
  "Pending Packaging",
];

const level2 = ["Awaiting Pickup"];
const level3 = ["Order Completed"];
const level4 = [
  "Item Unavailable",
  "Seller is not responsive / inactive",
  "Buyer has not picked up past the deadline, item forfeited",
];

const Ticket: React.FC<TicketProps> = ({
  userType,
  status,
  itemID,
  storeID,
  ticketID,
  statusLevel,
}) => {
  const itemDetails = useQuery<ItemDetails>(
    "itemDetails" + ticketID,
    async () => {
      const res = await axios.get(LINK_GET_ITEM_DETAILS, {
        params: {
          id: itemID,
        },
        withCredentials: true,
      });
      return res.data;
    },
    { staleTime: Infinity }
  );
  const ticketDetails = useQuery<TicketDetails>(
    "ticketDetails" + ticketID,
    async () => {
      const res = await axios.get(LINK_GET_TICKETS, {
        params: {
          ticketID: ticketID,
        },
        withCredentials: true,
      });
      return res.data;
    },
    { staleTime: Infinity }
  );

  const shopDetails = useQuery<ShopDetails>(
    "shopDetails" + ticketID,
    async () => {
      const res = await axios.get(LINK_GET_SHOP_DETAILS, {
        params: {
          shopID: storeID,
        },
        withCredentials: true,
      });
      console.log(res.data);
      return res.data;
    },
    { staleTime: Infinity }
  );
  return (
    <>
      <div className={css.ticket}>
        <div className={css.statusAndNumber}>
          <p className={css.ticketStatus}>{status}</p>
          <p className={css.ticketNumber}>#{ticketID}</p>
        </div>
        <div className={css.detailsAndPrice}>
          <div className={css.details}>
            {itemDetails.status === "success" ? (
              <p className={css.item}>{itemDetails.data.name}</p>
            ) : (
              <LoadingText />
            )}
            {ticketDetails.status === "success" &&
            ticketDetails.data.expected_seller_fulfillment ? (
              <p className={css.date}>
                Expect confirmation on or before{" "}
                {ticketDetails.data.expected_seller_fulfillment.split("T")[0]}
              </p>
            ) : ticketDetails.status === "success" &&
              ticketDetails.data.expected_buyer_fulfillment ? (
              <p className={css.date}>
                Expect pickup on or before{" "}
                {ticketDetails.data.expected_buyer_fulfillment.split("T")[0]}{" "}
              </p>
            ) : (
              <div className={css.loadingDate}>{""}</div>
            )}
            {ticketDetails.status === "success" ? (
              <p className={css.date}>
                Requested on {ticketDetails.data.createdAt.split("T")[0]}
              </p>
            ) : (
              <div className={css.loadingDate}>{""}</div>
            )}
          </div>
          {itemDetails.status === "success" ? (
            <div className={css.price}>₱{itemDetails.data.price}</div>
          ) : (
            <div className={css.loadingPrice}>{""}</div>
          )}
        </div>
        {shopDetails.status === "success" ? (
          <div className={css.shopDetails}>
            {shopDetails.data.shopName} @ {shopDetails.data.location}
          </div>
        ) : (
          <div className={css.loadingDate}>{""}</div>
        )}
        {userType === UserType.Seller && (
          <div className={css.options}>
            Mark as:
            <select name={`select${ticketID}`} id={`select${ticketID}`}>
              {statuses
                .filter((stat) => stat.level !== statusLevel)
                .map((stat) => (
                  <option value={stat.id}>{stat.name}</option>
                ))}
            </select>
          </div>
        )}
      </div>
    </>
  );
};

const TicketCenter: React.FC = () => {
  const [storedUser, setUser] = useAtom<User | null>(userAtom);

  const [selectedStatus, setStatus] = useState("Pending");
  const { status, data } = useQuery<TicketObject[]>("tickets", async () => {
    const res = await axios.get(LINK_GET_TICKETS, {
      params: {
        userID: storedUser?.user_id,
      },
      withCredentials: true,
    });
    return res.data.tickets;
  });

  let filteredTickets: TicketObject[] = [];
  if (selectedStatus === "Pending" && data) {
    filteredTickets = data.filter((ticket) => level1.includes(ticket.status));
    filteredTickets = filteredTickets.map<TicketObject>((ticket) => {
      return { ...ticket, statusLevel: 1 };
    });
  } else if (selectedStatus === "For Pickup" && data) {
    filteredTickets = data.filter((ticket) => level2.includes(ticket.status));
    filteredTickets = filteredTickets.map<TicketObject>((ticket) => {
      return { ...ticket, statusLevel: 2 };
    });
  } else if (selectedStatus === "Completed" && data) {
    filteredTickets = data.filter((ticket) => level3.includes(ticket.status));
    filteredTickets = filteredTickets.map<TicketObject>((ticket) => {
      return { ...ticket, statusLevel: 3 };
    });
  } else if (selectedStatus === "Cancelled" && data) {
    filteredTickets = data.filter((ticket) => level3.includes(ticket.status));
    filteredTickets = filteredTickets.map<TicketObject>((ticket) => {
      return { ...ticket, statusLevel: 1 };
    });
  }
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <div className={css.wrapper}>
        <BackAndTitle title="Tickets" backTo="/" />
        <div className={css.container}>
          <div className={css.statusContainer}>
            <button
              className={`${css.statusButton} ${
                selectedStatus === "Pending" && css.statusSelected
              }`}
              onClick={() => setStatus("Pending")}
            >
              Pending
            </button>
            <button
              className={`${css.statusButton} ${
                selectedStatus === "For Pickup" && css.statusSelected
              }`}
              onClick={() => setStatus("For Pickup")}
            >
              For Pickup
            </button>
            <button
              className={`${css.statusButton} ${
                selectedStatus === "Completed" && css.statusSelected
              }`}
              onClick={() => setStatus("Completed")}
            >
              Completed
            </button>
            <button
              className={`${css.statusButton} ${
                selectedStatus === "Cancelled" && css.statusSelected
              }`}
              onClick={() => setStatus("Cancelled")}
            >
              Cancelled
            </button>
          </div>
          <div className={css.spacer}></div>
          <div className={css.ticketsContainer}>
            {storedUser && status === "success" && filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => (
                <Ticket
                  userType={storedUser.type}
                  status={ticket.status}
                  itemID={ticket.itemID}
                  storeID={ticket.storeID}
                  ticketID={ticket.ticketID}
                  key={ticket.ticketID}
                  statusLevel={ticket.statusLevel}
                />
              ))
            ) : (
              <img src={loading} alt="loading" className={css.loadingIcon} />
            )}
          </div>
        </div>
      </div>
      {!isDesktopOrLaptop && <MobileNavBottom />}
    </>
  );
};
export default TicketCenter;
