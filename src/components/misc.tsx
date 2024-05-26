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

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const domain = "https://preloved.westus3.cloudapp.azure.com/";
const storeApi = "store/";
const frontPageApi = "homepage/";
const ticketApi = "tickets/";

export const LINK_LOGIN = "https://preloved.westus3.cloudapp.azure.com/auth/login";
export const LINK_LOGOUT = "https://preloved.westus3.cloudapp.azure.com/auth/logout";
export const LINK_SIGNUP_USER = "https://preloved.westus3.cloudapp.azure.com/auth/new_shop_user";
export const LINK_SIGNUP_SELLER = "https://preloved.westus3.cloudapp.azure.com/auth/new_shop_owner";
export const LINK_IS_AUTH = "https://preloved.westus3.cloudapp.azure.com/auth/is_authenticated";
export const LINK_GET_CURRENT_USER =
  "https://preloved.westus3.cloudapp.azure.com/auth/get_current_user";
export const LINK_GET_PENDING_LIST =
  "https://preloved.westus3.cloudapp.azure.com/auth/verification/get_list_pending";
export const LINK_GET_SELLER_STATUS =
  "https://preloved.westus3.cloudapp.azure.com/auth/verification/document_status";
export const LINK_SHOP_ID1 = "https://preloved.westus3.cloudapp.azure.com/auth/shop_id_one";
export const LINK_SHOP_ID2 = "https://preloved.westus3.cloudapp.azure.com/auth/shop_id_two";
export const LINK_SHOP_IDSELFIE = "https://preloved.westus3.cloudapp.azure.com/auth/shop_id_selfie";
export const LINK_GET_SELLER_DETAILS =
  "https://preloved.westus3.cloudapp.azure.com/auth/verification/get_shop_owner_details";
export const LINK_GET_SHOPVERIFICATION_IMAGE =
  "https://preloved.westus3.cloudapp.azure.com/auth/verification/get_image";
export const LINK_APPROVE_OR_REJECT =
  "https://preloved.westus3.cloudapp.azure.com/auth/verification/approve_or_reject";
export const LINK_CREATE_SHOP = domain + storeApi + "create_new_shop";
export const LINK_GET_ALL_TAGS = domain + storeApi + "get_all_tags";
export const LINK_ADD_ITEM = domain + storeApi + "add_item";
export const LINK_GET_IMAGE_SEARCH = domain + frontPageApi + "img_search";
export const LINK_AUTO_TAGGING = domain + storeApi + "auto_tagging";
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
export const LINK_REMOVE_FROM_CART = domain + frontPageApi + "remove_from_cart";
export const LINK_SEARCH = domain + frontPageApi + "search";
export const LINK_PURCHASE_CART = domain + frontPageApi + "purchase_cart";
export const LINK_GET_SHOP_ITEMS = domain + storeApi + "get_shop_items";
export const LINK_ADD_TAGS = domain + storeApi + "attach_tag_to_item";
