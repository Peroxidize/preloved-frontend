export interface User {
  email: string;
  type: UserType;
  user_id: number;
  shop_owner_id: number | undefined;
  verified: number | undefined;
}

export enum UserType {
  User,
  Seller,
  Admin,
  UnverifiedSeller,
  CompletedSeller,
}

export const showDialog = (id: string) => {
  const dialog = document.querySelector(`#${id}`) as HTMLDialogElement;
  dialog.showModal();
};

export const closeDialog = (id: string) => {
  const dialog = document.querySelector(`#${id}`) as HTMLDialogElement;
  dialog.close();
};

export const showAndCloseDialog = (id: string, time: number) => {
  const dialog = document.querySelector(`#${id}`) as HTMLDialogElement;
  dialog.showModal();
  setTimeout(() => dialog.close(), time);
};

const domain = "https://prelovedbackend.azurewebsites.net/";
const storeApi = "store/";
const frontPageApi = "homepage/";
const ticketApi = "tickets/";

export const LINK_LOGIN = "https://prelovedbackend.azurewebsites.net/auth/login";
export const LINK_LOGOUT = "https://prelovedbackend.azurewebsites.net/auth/logout";
export const LINK_SIGNUP_USER = "https://prelovedbackend.azurewebsites.net/auth/new_shop_user";
export const LINK_SIGNUP_SELLER = "https://prelovedbackend.azurewebsites.net/auth/new_shop_owner";
export const LINK_IS_AUTH = "https://prelovedbackend.azurewebsites.net/auth/is_authenticated";
export const LINK_GET_CURRENT_USER =
  "https://prelovedbackend.azurewebsites.net/auth/get_current_user";
export const LINK_GET_PENDING_LIST =
  "https://prelovedbackend.azurewebsites.net/auth/verification/get_list_pending";
export const LINK_GET_SELLER_STATUS =
  "https://prelovedbackend.azurewebsites.net/auth/verification/document_status";
export const LINK_SHOP_ID1 = "https://prelovedbackend.azurewebsites.net/auth/shop_id_one";
export const LINK_SHOP_ID2 = "https://prelovedbackend.azurewebsites.net/auth/shop_id_two";
export const LINK_SHOP_IDSELFIE = "https://prelovedbackend.azurewebsites.net/auth/shop_id_selfie";
export const LINK_GET_SELLER_DETAILS =
  "https://prelovedbackend.azurewebsites.net/auth/verification/get_shop_owner_details";
export const LINK_GET_SHOPVERIFICATION_IMAGE =
  "https://prelovedbackend.azurewebsites.net/auth/verification/get_image";
export const LINK_APPROVE_OR_REJECT =
  "https://prelovedbackend.azurewebsites.net/auth/verification/approve_or_reject";
export const LINK_CREATE_SHOP = domain + storeApi + "create_new_shop";
export const LINK_GET_ALL_TAGS = domain + storeApi + "get_all_tags";
export const LINK_ADD_ITEM = domain + storeApi + "add_item";
export const LINK_ATTACH_PHOTO_ITEM = domain + storeApi + "add_img_item";
export const LINK_GET_STORES = domain + storeApi + "stores";
export const LINK_GET_FRONTPAGE = domain + frontPageApi;
export const LINK_GET_ITEM_DETAILS = domain + storeApi + "get_item_details";
export const LINK_GET_ITEM_IMAGES = domain + storeApi + "item_images";
export const LINK_PURCHASE_ITEM = domain + ticketApi + "purchase_item";
export const LINK_GET_TICKETS = domain + ticketApi + "ticket";
export const LINK_GET_TICKET_STATUSES = domain + ticketApi + "statuses";
export const LINK_GET_SHOP_DETAILS = domain + storeApi + "get_shop_details";
export const LINK_GET_SHOP_TICKETS = domain + ticketApi + "get_shop_tickets";
export const LINK_UPDATE_TICKET_STATUS = domain + ticketApi + "update_ticket_status";
export const LINK_ADD_TO_CART = domain + frontPageApi + "add_to_cart";
export const LINK_GET_CART = domain + frontPageApi + "cart";
