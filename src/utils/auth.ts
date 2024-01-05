import axios, { AxiosResponse } from "axios";
import { User, UserType } from "../components/misc";

const API_URL = "https://prelovedbackend.azurewebsites.net/auth/";

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

async function handleResponse(response: AxiosResponse | undefined) {
  if (response === undefined) {
    return undefined;
  }

  // console.log("First response");
  // console.log(response);

  if (!evaluatePostRequest(JSON.stringify(response))) {
    return undefined;
  }

  let user: User;
  let email: string = response.data.email as string;
  let user_type: string = response.data.user_type as string;
  let user_id: number = response.data.id as number;
  let shop_owner_id: number | undefined = response.data.shop_owner_id as number;
  let verified: number | undefined = response.data.verified as number;

  if (response.data.shop_owner_id !== undefined) {
    try {
      let status_response = await get_seller_status(response.data.shop_owner_id);
      user_type = evaluateSellerStatus(JSON.stringify(status_response));
    } catch (error) {
      console.log(error);
      return undefined;
    }
    // console.log("Second response");
    // console.log(status_response);
  }
  // console.log("USER TYPE");
  // console.log(user_type);
  return (user = {
    email: email,
    type: getUserType(user_type),
    user_id: user_id,
    shop_owner_id: shop_owner_id,
    verified: verified,
  });
}

function getUserType(type: string): UserType {
  // console.log("GETUSERTYPE");
  // console.log(type);
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
