import axios, { AxiosResponse } from "axios";
import { LINK_GET_PENDING_LIST, User, UserType } from "../components/misc";

const API_URL = "https://prelovedbackend.azurewebsites.net/auth/";

export const get_location_link = async (long: string, lat: string, shopID: string) => {
  try {
    const response = await axios.get(API_URL + "location/get_route", {
      withCredentials: true,
      params: { shopID: shopID, long: long, lat: lat },
    });
    console.log(response.data.path);
    return response.data.path;
  } catch (error: any) {
    console.log(error.data);
    return null;
  }
};

export const attach_location = async (formData: any) => {
  try {
    const response = await axios.post(API_URL + "location/attach_location", formData, {
      withCredentials: true,
    });
    console.log(response.data);
    return "success";
  } catch (error: any) {
    console.log(error);
    return "error";
  }
};

export const get_current_user = async () => {
  try {
    const response = await axios.get(API_URL + "get_current_user", {
      withCredentials: true,
    });
    console.log(response);
    return;
  } catch (error: any) {
    console.log(error.data.response);
    return;
  }
};

export const login = async (formData: any) => {
  let response;
  try {
    response = await axios.post(API_URL + "login", formData, { withCredentials: true });
  } catch (error) {
    response = undefined;
  }
  return handleResponse(response);
};

export const logout = async () => {
  localStorage.clear();
  try {
    await axios.post(API_URL + "logout", null, { withCredentials: true });
  } catch {}
  window.location.replace("/");
};

export const get_auth = async () => {
  return await axios.get(API_URL + "is_authenticated", { withCredentials: true });
};

export const get_seller_status = async (id: any) => {
  return await axios.get(API_URL + "/verification/document_status", {
    withCredentials: true,
    params: { id: id },
  });
};

export const get_shopowner_details = async (id: any) => {
  return await axios.get(API_URL + "/verification/get_shop_owner_details", {
    withCredentials: true,
    params: { id: id },
  });
};

async function handleResponse(response: AxiosResponse | undefined) {
  if (response === undefined) {
    return undefined;
  }

  console.log("First response");
  console.log(response);

  if (!evaluatePostRequest(JSON.stringify(response))) {
    return undefined;
  }

  let user: User;
  let email: string = response.data.email as string;
  let user_type: string = response.data.user_type as string;
  let user_id: number = response.data.id as number;
  let shop_owner_id: number | undefined = response.data.shop_owner_id as number;
  let verified: number | undefined = response.data.verified as number;

  if (response.data.shop_owner_id !== undefined && response.data.verified !== 1) {
    try {
      let status_response = await get_seller_status(response.data.shop_owner_id);
      user_type = evaluateSellerStatus(JSON.stringify(status_response));
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }
  return (user = {
    email: email,
    type: getUserType(user_type, String(verified)),
    user_id: user_id,
    shop_owner_id: shop_owner_id,
    verified: verified,
  });
}

function getUserType(type: string, verified: string): UserType {
  if (verified === "1") {
    return UserType.Seller;
  }

  switch (type) {
    case "Shop User":
      return UserType.User;
    case "Shop Owner":
      return UserType.Seller;
    case "Admin":
      return UserType.Admin;
    case "Unverified":
      return UserType.UnverifiedSeller;
    default:
      return UserType.CompletedSeller;
  }
}

export function evaluateSellerStatus(response: string): string {
  if (/is missing/.test(response)) {
    return "Unverified";
  }
  return "Completed";
}

function evaluatePostRequest(response: string): boolean {
  return /"statusText":"OK"/.test(response);
}
