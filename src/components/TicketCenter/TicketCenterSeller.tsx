import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { useMediaQuery } from "react-responsive";
import BackAndTitle from "../fragments/commonstuff/BackAndTitle";
import NavBar, { MobileNavTop, MobileNavBottom } from "../fragments/nav-bar/nav-bar";
import {
  LINK_GET_ITEM_DETAILS,
  LINK_GET_SHOP_TICKETS,
  LINK_GET_TICKETS,
  LINK_UPDATE_TICKET_STATUS,
} from "../misc";
import css from "./TicketCenterSeller.module.css";
import { TicketStatus } from "./TicketCenter";
import { TicketDetails } from "./TicketCenter";
import { ItemDetails } from "../Item/Item";
import loading from "../../assets/loading.gif";
import LoadingText from "../fragments/commonstuff/Loading";
import Button from "../fragments/FormInputs/Button";
import LoadingDialog, { ErrorDialog, SuccessDialog } from "../fragments/commonstuff/Dialogs";

interface SellerTicketObject {
  currentStatusName: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  itemID: number;
  itemName: string;
  ["level / status_id"]: number;
  statusID: number;
  ticketID: number;
  userID: number;
}

interface SellerTicketProps {
  currentStatusName: string;
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string;
  itemID: number;
  itemName: string;
  level: number;
  statusID: number;
  ticketID: number;
  refetchFn: () => void;
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

const SellerTicket: React.FC<SellerTicketProps> = ({ ...props }) => {
  const selectRef = useRef<HTMLSelectElement>(null);
  const itemDetails = useQuery<ItemDetails>(
    "itemDetails" + props.ticketID,
    async () => {
      const res = await axios.get(LINK_GET_ITEM_DETAILS, {
        params: {
          id: props.itemID,
        },
        withCredentials: true,
      });
      return res.data;
    },
    { staleTime: Infinity }
  );
  const ticketDetails = useQuery<TicketDetails>(
    "ticketDetails" + props.ticketID,
    async () => {
      const res = await axios.get(LINK_GET_TICKETS, {
        params: {
          ticketID: props.ticketID,
        },
        withCredentials: true,
      });
      return res.data;
    },
    { staleTime: Infinity }
  );
  const updateStatus = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("ticketID", props.ticketID.toString());
      formData.append("statusID", selectRef.current!.value);
      const res = await axios.post(LINK_UPDATE_TICKET_STATUS, formData, {
        withCredentials: true,
      });
      console.log(res);
      return res;
    },
    onMutate: () => {
      const loadingDialog = document.getElementById("loadingDialog") as HTMLDialogElement;
      loadingDialog.showModal();
    },
    onSuccess: () => {
      const loadingDialog = document.getElementById("loadingDialog") as HTMLDialogElement;
      loadingDialog.close();
      const successDialog = document.getElementById("successDialog") as HTMLDialogElement;
      successDialog.showModal();
      setTimeout(() => successDialog.close(), 3000);
      props.refetchFn();
    },
    onError: () => {
      const loadingDialog = document.getElementById("loadingDialog") as HTMLDialogElement;
      loadingDialog.close();
      const errorDialog = document.getElementById("errorDialog") as HTMLDialogElement;
      errorDialog.showModal();
      setTimeout(() => errorDialog.close(), 3000);
    },
  });
  return (
    <>
      <div className={css.ticket}>
        <div className={css.statusAndNumber}>
          <p className={css.ticketStatus}>{props.currentStatusName}</p>
          <p className={css.ticketNumber}>#{props.ticketID}</p>
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
              <p className={css.date}>Requested on {ticketDetails.data.createdAt.split("T")[0]}</p>
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
        <div className={css.shopDetails}>
          <p>
            {props.customerFirstName} {props.customerLastName}
          </p>
          <p>
            {props.customerPhone} | {props.customerEmail}
          </p>
        </div>
        <div className={css.options}>
          Mark as:
          <select
            name={`select${props.ticketID}`}
            id={`select${props.ticketID}`}
            className={css.selectStatus}
            ref={selectRef}
          >
            {statuses
              .filter((stat) => stat.id !== props.statusID && stat.level >= props.level)
              .map((stat) => (
                <option value={stat.id}>{stat.name}</option>
              ))}
          </select>
          <Button text="Update Status" handleClick={() => updateStatus.mutate()} />
        </div>
      </div>
    </>
  );
};

const TicketCenterSeller: React.FC = () => {
  const getShopTickets = async () => {
    const res = await axios.get(LINK_GET_SHOP_TICKETS, {
      withCredentials: true,
    });
    console.log(res);
    return res.data.tickets;
  };

  const [selectedStatus, setStatus] = useState(1);
  const { status, data, refetch } = useQuery<SellerTicketObject[]>("tickets", getShopTickets, {
    staleTime: Infinity,
  });

  const filteredTickets = useRef<SellerTicketObject[] | null>(null);
  if (data) {
    filteredTickets.current = data.filter(
      (ticket) => ticket["level / status_id"] === selectedStatus
    );
  }

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 1224px)",
  });
  return (
    <>
      {isDesktopOrLaptop ? <NavBar /> : <MobileNavTop />}
      <LoadingDialog />
      <SuccessDialog text="Ticket successfully updated!" />
      <ErrorDialog text="Ticket failed to update!" />
      <div className={css.wrapper}>
        <BackAndTitle title="Tickets" backTo="/" />
        <div className={css.container}>
          <div className={css.statusContainer}>
            <button
              className={`${css.statusButton} ${selectedStatus === 1 && css.statusSelected}`}
              onClick={() => setStatus(1)}
            >
              Pending
            </button>
            <button
              className={`${css.statusButton} ${selectedStatus === 2 && css.statusSelected}`}
              onClick={() => setStatus(2)}
            >
              For Pickup
            </button>
            <button
              className={`${css.statusButton} ${selectedStatus === 3 && css.statusSelected}`}
              onClick={() => setStatus(3)}
            >
              Completed
            </button>
            <button
              className={`${css.statusButton} ${selectedStatus === 4 && css.statusSelected}`}
              onClick={() => setStatus(4)}
            >
              Cancelled
            </button>
          </div>
          <div className={css.spacer}></div>
          <div className={css.ticketsContainer}>
            {filteredTickets.current && filteredTickets.current.length > 0 ? (
              filteredTickets.current.map((ticket) => (
                <SellerTicket
                  currentStatusName={ticket.currentStatusName}
                  customerEmail={ticket.customerEmail}
                  customerFirstName={ticket.customerFirstName}
                  customerLastName={ticket.customerLastName}
                  customerPhone={ticket.customerPhone}
                  itemID={ticket.itemID}
                  key={ticket.ticketID}
                  itemName={ticket.itemName}
                  level={ticket["level / status_id"]}
                  statusID={ticket.statusID}
                  ticketID={ticket.ticketID}
                  refetchFn={refetch}
                />
              ))
            ) : filteredTickets.current && filteredTickets.current.length === 0 ? (
              <p className={css.noTicketsFound}>No tickets found in this category.</p>
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
export default TicketCenterSeller;
